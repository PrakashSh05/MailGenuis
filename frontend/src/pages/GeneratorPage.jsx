import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import PageHeader from '../components/layout/PageHeader';
import EmailForm from '../components/features/generator/EmailForm';
import EmailPreview from '../components/features/generator/EmailPreview';
import emailService from '../services/emailService';
import profileService from '../services/profileService';
import Toast from '../components/ui/Toast';
import { Terminal, Code2 } from 'lucide-react';

export default function GeneratorPage() {
  const location = useLocation();
  const [email, setEmail] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isApplyingAction, setIsApplyingAction] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState(null);

  // Maintain form data to pass to Save payload and actions
  const [currentFormData, setCurrentFormData] = useState(location.state?.emailData || null);
  const [isProfileLoading, setIsProfileLoading] = useState(!location.state?.emailData);

  React.useEffect(() => {
    if (!location.state?.emailData) {
      const fetchProfile = async () => {
        try {
          const res = await profileService.getProfile();
          setCurrentFormData({
            tone: res.data.defaultTone || 'PROFESSIONAL',
            length: res.data.defaultEmailLength || 'MEDIUM',
            language: res.data.defaultLanguage || 'ENGLISH'
          });
        } catch (err) {
          console.error("Failed to load profile defaults", err);
        } finally {
          setIsProfileLoading(false);
        }
      };
      fetchProfile();
    }
  }, [location.state]);

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
      setToast({ message: 'System failure: AI module unresponsive.', type: 'error' });
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
      setToast({ message: 'Action failed: Protocol error.', type: 'error' });
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
      setToast({ message: 'Email saved into History.', type: 'success' });
    } catch (err) {
      setToast({ message: 'Failed to write to database.', type: 'error' });
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
      await emailService.toggleFavorite(email.id, !email.isFavorite);
      setEmail(prev => ({ ...prev, isFavorite: !prev.isFavorite }));
    } catch (err) {
      setToast({ message: 'Failed to update priority flag.', type: 'error' });
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 flex flex-col relative h-full min-h-[calc(100vh-8rem)]">
      <PageHeader 
        title="AI Generator" 
        subtitle="Initialize neural email synthesis."
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1">
        {/* Left Column: Form */}
        <div className="lg:col-span-4 bg-white/80 dark:bg-[#0a0a0a]/80 backdrop-blur-md rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.05)] dark:shadow-glass border border-black/10 dark:border-white/10 p-6 hover:border-brand/30 transition-colors duration-500 relative group">
          <div className="absolute inset-0 bg-brand/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
          <h2 className="text-lg font-display font-bold text-gray-900 dark:text-white mb-6 uppercase tracking-widest flex items-center gap-2">
            <Terminal className="h-5 w-5 text-brand" /> Input Parameters
          </h2>
          <div className="relative z-10">
            {isProfileLoading ? (
              <div className="animate-pulse space-y-4">
                <div className="h-24 bg-black/5 dark:bg-white/5 rounded-xl"></div>
                <div className="h-12 bg-black/5 dark:bg-white/5 rounded-xl"></div>
                <div className="h-12 bg-black/5 dark:bg-white/5 rounded-xl"></div>
              </div>
            ) : (
              <EmailForm 
                onSubmit={handleGenerate} 
                isLoading={isGenerating || isApplyingAction}
                defaultValues={currentFormData}
              />
            )}
          </div>
        </div>

        {/* Right Column: Preview */}
        <div className="lg:col-span-8 flex flex-col bg-white/80 dark:bg-[#0a0a0a]/80 backdrop-blur-md rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.05)] dark:shadow-glass border border-black/10 dark:border-white/10 overflow-hidden hover:border-brand/30 transition-colors duration-500 relative group h-full min-h-[500px]">
          <div className="absolute inset-0 bg-brand/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
          
          <div className="p-4 border-b border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 flex items-center gap-2 relative z-10">
            <Code2 className="h-5 w-5 text-brand" />
            <h2 className="text-sm font-mono text-text-secondary uppercase tracking-widest">Output Terminal</h2>
          </div>
          
          <div className="flex-1 p-6 relative z-10 h-full">
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
