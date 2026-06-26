import React, { useState, useEffect } from 'react';
import PageHeader from '../components/layout/PageHeader';
import SettingsSection from '../components/features/settings/SettingsSection';
import PreferenceSelector from '../components/features/settings/PreferenceSelector';
import Button from '../components/ui/Button';
import Toast from '../components/ui/Toast';
import Skeleton from '../components/ui/Skeleton';
import profileService from '../services/profileService';
import { useTheme } from '../context/ThemeContext';
import { Save, Settings2, Sparkles, Terminal } from 'lucide-react';

const TONE_OPTIONS = [
  { value: 'PROFESSIONAL', label: 'Professional' },
  { value: 'CASUAL', label: 'Casual' },
  { value: 'FRIENDLY', label: 'Friendly' },
  { value: 'PERSUASIVE', label: 'Persuasive' },
  { value: 'URGENT', label: 'Urgent' },
  { value: 'EMPATHETIC', label: 'Empathetic' }
];

const LENGTH_OPTIONS = [
  { value: 'SHORT', label: 'Short', subtext: '< 100 words' },
  { value: 'MEDIUM', label: 'Medium', subtext: '100 - 300 words' },
  { value: 'LONG', label: 'Long', subtext: '> 300 words' }
];

const LANGUAGE_OPTIONS = [
  { value: 'ENGLISH', label: 'English' },
  { value: 'SPANISH', label: 'Spanish' },
  { value: 'FRENCH', label: 'French' },
  { value: 'GERMAN', label: 'German' },
  { value: 'ITALIAN', label: 'Italian' }
];

const THEME_OPTIONS = [
  { value: 'SYSTEM', label: 'System Default' },
  { value: 'LIGHT', label: 'Light' },
  { value: 'DARK', label: 'Dark' }
];

export default function SettingsPage() {
  const { toggleTheme } = useTheme();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  
  const [settings, setSettings] = useState({
    defaultTone: 'PROFESSIONAL',
    defaultLanguage: 'ENGLISH',
    defaultEmailLength: 'MEDIUM',
    themePreference: 'SYSTEM',
    darkModeEnabled: false
  });

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const res = await profileService.getProfile();
        setSettings({
          defaultTone: res.data.defaultTone || 'PROFESSIONAL',
          defaultLanguage: res.data.defaultLanguage || 'ENGLISH',
          defaultEmailLength: res.data.defaultEmailLength || 'MEDIUM',
          themePreference: res.data.themePreference || 'SYSTEM',
          darkModeEnabled: res.data.darkModeEnabled || false
        });
      } catch (err) {
        setToast({ message: 'Failed to load settings.', type: 'error' });
      } finally {
        setLoading(false);
      }
    };
    loadSettings();
  }, []);

  const handleChange = (field, value) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // If user sets theme preference to DARK, ensure darkModeEnabled flag matches that explicitly
      const payload = { ...settings };
      if (payload.themePreference === 'DARK') payload.darkModeEnabled = true;
      if (payload.themePreference === 'LIGHT') payload.darkModeEnabled = false;

      const res = await profileService.updateSettings(payload);
      
      // Sync React ThemeContext immediately
      const isSystemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (payload.themePreference === 'DARK' || (payload.themePreference === 'SYSTEM' && isSystemDark)) {
        if (localStorage.getItem('theme') !== 'dark') toggleTheme();
      } else {
        if (localStorage.getItem('theme') !== 'light') toggleTheme();
      }

      setSettings({
        defaultTone: res.data.defaultTone,
        defaultLanguage: res.data.defaultLanguage,
        defaultEmailLength: res.data.defaultEmailLength,
        themePreference: res.data.themePreference,
        darkModeEnabled: res.data.darkModeEnabled
      });

      setToast({ message: 'Settings saved successfully.', type: 'success' });
    } catch (err) {
      setToast({ message: 'Failed to save settings.', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <PageHeader title="System Preferences" />
        <Skeleton className="h-64 w-full rounded-2xl" />
        <Skeleton className="h-48 w-full rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <PageHeader 
        title="System Preferences" 
        subtitle="Configure neural engine defaults and global system parameters."
      />

      <div className="bg-white/80 dark:bg-[#0a0a0a]/80 backdrop-blur-md rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.05)] dark:shadow-glass border border-black/10 dark:border-white/10 p-8 hover:border-brand/30 transition-colors duration-500 relative group">
        <div className="absolute inset-0 bg-brand/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none rounded-2xl"></div>
        
        <SettingsSection 
          title={<span className="flex items-center gap-2 uppercase tracking-widest text-lg font-display text-gray-900 dark:text-white"><Sparkles className="h-5 w-5 text-brand" /> Neural Core Defaults</span>}
          description="Baseline parameters automatically injected into every email generation sequence."
        >
          <div className="space-y-6 relative z-10">
            <PreferenceSelector
              label="Default Output Tone"
              options={TONE_OPTIONS}
              value={settings.defaultTone}
              onChange={(val) => handleChange('defaultTone', val)}
              disabled={saving}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              <PreferenceSelector
                label="Default Output Length"
                options={LENGTH_OPTIONS}
                value={settings.defaultEmailLength}
                onChange={(val) => handleChange('defaultEmailLength', val)}
                disabled={saving}
              />
              
              <PreferenceSelector
                label="Target Language"
                options={LANGUAGE_OPTIONS}
                value={settings.defaultLanguage}
                onChange={(val) => handleChange('defaultLanguage', val)}
                disabled={saving}
              />
            </div>
          </div>
        </SettingsSection>
      </div>

      <div className="bg-white/80 dark:bg-[#0a0a0a]/80 backdrop-blur-md rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.05)] dark:shadow-glass border border-black/10 dark:border-white/10 p-8 hover:border-brand/30 transition-colors duration-500 relative group">
        <div className="absolute inset-0 bg-brand/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none rounded-2xl"></div>
        
        <SettingsSection 
          title={<span className="flex items-center gap-2 uppercase tracking-widest text-lg font-display text-gray-900 dark:text-white"><Terminal className="h-5 w-5 text-brand" /> Environment Configuration</span>}
        >
          <div className="relative z-10">
            <PreferenceSelector
              label="HUD Display Mode"
              description="Override the system's global visual matrix."
              options={THEME_OPTIONS}
              value={settings.themePreference}
              onChange={(val) => handleChange('themePreference', val)}
              disabled={saving}
            />
          </div>
        </SettingsSection>
      </div>

      <div className="flex justify-end pt-4">
        <Button 
          size="lg" 
          icon={Save} 
          onClick={handleSave} 
          loading={saving}
        >
          Commit Preferences
        </Button>
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
