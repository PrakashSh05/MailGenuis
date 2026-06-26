import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import PageHeader from '../components/layout/PageHeader';
import ProfileCard from '../components/features/profile/ProfileCard';
import PasswordStrengthMeter from '../components/features/profile/PasswordStrengthMeter';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Toast from '../components/ui/Toast';
import Skeleton from '../components/ui/Skeleton';
import profileService from '../services/profileService';
import { useAuth } from '../context/AuthContext';
import { Save, Lock, User, Eye, EyeOff, Terminal, Shield } from 'lucide-react';

const profileSchema = z.object({
  fullName: z.string().min(1, 'Full name is required').max(100, 'Maximum 100 characters')
});

const passwordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string().min(1, 'Please confirm your new password')
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export default function ProfilePage() {
  const { user, updateUser } = useAuth(); // Need to update context if name changes
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  
  // Password Visibility
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  // Profile Form
  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    setValue: setProfileValue,
    watch: watchProfile,
    formState: { errors: profileErrors, isSubmitting: isSubmittingProfile }
  } = useForm({
    resolver: zodResolver(profileSchema)
  });

  // Removed avatarUrl watch
  // Password Form
  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    watch: watchPassword,
    reset: resetPassword,
    formState: { errors: passwordErrors, isSubmitting: isSubmittingPassword }
  } = useForm({
    resolver: zodResolver(passwordSchema)
  });

  const newPasswordValue = watchPassword('newPassword');

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await profileService.getProfile();
        setProfile(res.data);
        setProfileValue('fullName', res.data.fullName || '');
      } catch (err) {
        setToast({ message: 'Failed to load profile data.', type: 'error' });
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, [setProfileValue]);

  const onProfileSave = async (data) => {
    try {
      const res = await profileService.updateProfile(data);
      setProfile(res.data);
      setToast({ message: 'Profile updated successfully.', type: 'success' });
      
      // Update global auth context so navbar avatar reflects changes immediately
      if (user) {
        updateUser({ fullName: res.data.fullName });
      }
    } catch (err) {
      setToast({ message: err.response?.data?.message || 'Failed to update profile.', type: 'error' });
    }
  };

  const onPasswordSave = async (data) => {
    try {
      await profileService.changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
        confirmPassword: data.confirmPassword
      });
      setToast({ message: 'Password changed successfully.', type: 'success' });
      resetPassword();
    } catch (err) {
      setToast({ message: err.response?.data?.message || 'Failed to change password.', type: 'error' });
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto space-y-8">
        <PageHeader title="Profile Settings" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4 p-6"><Skeleton className="h-64 rounded-2xl" /></div>
          <div className="lg:col-span-8 space-y-8">
            <div className="p-6"><Skeleton className="h-48 rounded-2xl" /></div>
            <div className="p-6"><Skeleton className="h-64 rounded-2xl" /></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <PageHeader 
        title="Profile Settings" 
        subtitle="Manage your operator profile and security protocols."
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Profile Card */}
        <div className="lg:col-span-4">
          <ProfileCard profile={profile} />
        </div>

        {/* Right Column: Forms */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* General Information */}
          <div className="bg-white/80 dark:bg-[#0a0a0a]/80 backdrop-blur-md rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.05)] dark:shadow-glass border border-black/10 dark:border-white/10 p-6 hover:border-brand/30 transition-colors duration-500 relative group">
            <div className="absolute inset-0 bg-brand/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
            <h2 className="text-lg font-display font-bold text-gray-900 dark:text-white mb-6 uppercase tracking-widest flex items-center gap-2 border-b border-black/10 dark:border-white/10 pb-4 relative z-10">
              <Terminal className="h-5 w-5 text-brand" /> Operator Details
            </h2>
            
            <form onSubmit={handleProfileSubmit(onProfileSave)} className="space-y-5 relative z-10">
              <Input
                label="Operator Identity"
                error={profileErrors.fullName?.message}
                disabled={isSubmittingProfile}
                {...registerProfile('fullName')}
              />
              
              <div className="flex justify-end pt-2">
                <Button type="submit" loading={isSubmittingProfile} icon={Save}>
                  Commit Changes
                </Button>
              </div>
            </form>
          </div>

          {/* Security */}
          <div className="bg-white/80 dark:bg-[#0a0a0a]/80 backdrop-blur-md rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.05)] dark:shadow-glass border border-black/10 dark:border-white/10 p-6 hover:border-brand/30 transition-colors duration-500 relative group">
            <div className="absolute inset-0 bg-brand/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
            <h2 className="text-lg font-display font-bold text-gray-900 dark:text-white mb-6 uppercase tracking-widest flex items-center gap-2 border-b border-black/10 dark:border-white/10 pb-4 relative z-10">
              <Shield className="h-5 w-5 text-brand" /> Security Protocols
            </h2>
            
            <form onSubmit={handlePasswordSubmit(onPasswordSave)} className="space-y-4 relative z-10">
              <div className="relative">
                <Input
                  type={showCurrentPassword ? "text" : "password"}
                  label="Current Access Key"
                  error={passwordErrors.currentPassword?.message}
                  disabled={isSubmittingPassword}
                  {...registerPassword('currentPassword')}
                />
                <button
                  type="button"
                  className="absolute right-3 top-[34px] text-text-secondary hover:text-brand"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                >
                  {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>

              <div className="relative">
                <Input
                  type={showNewPassword ? "text" : "password"}
                  label="New Access Key"
                  error={passwordErrors.newPassword?.message}
                  disabled={isSubmittingPassword}
                  {...registerPassword('newPassword')}
                />
                <button
                  type="button"
                  className="absolute right-3 top-[34px] text-text-secondary hover:text-brand"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              
              <PasswordStrengthMeter password={newPasswordValue} />

              <Input
                type="password"
                label="Verify New Access Key"
                error={passwordErrors.confirmPassword?.message}
                disabled={isSubmittingPassword}
                {...registerPassword('confirmPassword')}
              />
              
              <div className="flex justify-end pt-4">
                <Button type="submit" variant="primary" loading={isSubmittingPassword} icon={Lock}>
                  Update Key
                </Button>
              </div>
            </form>
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
