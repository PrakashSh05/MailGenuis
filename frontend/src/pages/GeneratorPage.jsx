import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import PageHeader from '../components/layout/PageHeader';
import EmailForm from '../components/features/generator/EmailForm';
import EmailPreview from '../components/features/generator/EmailPreview';
import emailService from '../services/emailService';
import Toast from '../components/ui/Toast';

export default function GeneratorPage() {
  const location = useLocation();
  const [email, setEmail] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isApplyingAction, setIsApplyingAction] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState(null);

  // Maintain form data to pass to Save payload and actions
  const [currentFormData, setCurrentFormData] = useState(location.state?.emailData || null);

  const handleGenerate = async (formData) => {
    setCurrentFormData(formData);
    setIsGenerating(true);
    setToast(null);
    try {
      const response = await emailService.generateEmail(formData);
      setEmail({
        ...response.data,
        isFavorite: false
      });
    } catch (err) {
      setToast({ message: 'Failed to generate email. Please try again.', type: 'error' });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAction = async (actionType) => {
    if (!email) return;
    setIsApplyingAction(true);
    setToast(null);
    try {
      const actionRequest = {
        actionType,
        currentSubject: email.subject,
        currentBody: email.body,
        targetLanguage: currentFormData?.language || 'ENGLISH'
      };
      const response = await emailService.applyAction(email.id || 'temp', actionRequest);
      
      // Update email content while preserving other states
      setEmail(prev => ({
        ...prev,
        subject: response.data.subject,
        body: response.data.body
      }));
    } catch (err) {
      setToast({ message: 'Failed to apply AI action.', type: 'error' });
    } finally {
      setIsApplyingAction(false);
    }
  };

  const handleSave = async () => {
    if (!email || !currentFormData) return;
    setIsSaving(true);
    try {
      const savePayload = {
        purpose: currentFormData.purpose,
        recipient: currentFormData.recipient,
        tone: currentFormData.tone,
        length: currentFormData.length,
        language: currentFormData.language,
        additionalInstructions: currentFormData.additionalInstructions || '',
        subject: email.subject,
        body: email.body,
        isFavorite: email.isFavorite || false
      };
      const response = await emailService.saveEmail(savePayload);
      setEmail(prev => ({ ...prev, id: response.data.id }));
      setToast({ message: 'Email saved to history!', type: 'success' });
    } catch (err) {
      setToast({ message: 'Failed to save email.', type: 'error' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleFavorite = async () => {
    if (!email || !email.id) {
      // Toggle locally if not saved yet
      setEmail(prev => ({ ...prev, isFavorite: !prev.isFavorite }));
      return;
    }
    
    try {
      await emailService.toggleFavorite(email.id);
      setEmail(prev => ({ ...prev, isFavorite: !prev.isFavorite }));
    } catch (err) {
      setToast({ message: 'Failed to update favorite status.', type: 'error' });
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 h-full flex flex-col">
      <PageHeader 
        title="Email Generator" 
        description="Craft professional emails instantly using AI."
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 min-h-0">
        {/* Left Column: Form */}
        <div className="lg:col-span-4 bg-warm-primary dark:bg-warm-primary rounded-xl shadow-sm border border-editorial-border dark:border-editorial-border p-6 overflow-y-auto">
          <h2 className="text-lg font-bold text-editorial-primary dark:text-editorial-primary mb-4">
            Email Parameters
          </h2>
          <EmailForm 
            onSubmit={handleGenerate} 
            isLoading={isGenerating || isApplyingAction}
            defaultValues={currentFormData}
          />
        </div>

        {/* Right Column: Preview */}
        <div className="lg:col-span-8 flex flex-col">
          <EmailPreview 
            email={email}
            isLoading={isGenerating || isApplyingAction}
            isSaving={isSaving}
            onAction={handleAction}
            onRegenerate={() => currentFormData && handleGenerate(currentFormData)}
            onSave={handleSave}
            onToggleFavorite={handleToggleFavorite}
          />
        </div>
      </div>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
