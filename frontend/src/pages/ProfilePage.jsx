import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import PageHeader from '../components/layout/PageHeader';
import ProfileCard from '../components/features/profile/ProfileCard';
import AvatarUploader from '../components/features/profile/AvatarUploader';
import PasswordStrengthMeter from '../components/features/profile/PasswordStrengthMeter';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Toast from '../components/ui/Toast';
import Skeleton from '../components/ui/Skeleton';
import profileService from '../services/profileService';
import { useAuth } from '../context/AuthContext';
import { Save, Lock, User, Eye, EyeOff } from 'lucide-react';

const profileSchema = z.object({
  fullName: z.string().min(1, 'Full name is required').max(100, 'Maximum 100 characters'),
  profilePictureUrl: z.string().url('Must be a valid URL').optional().or(z.literal(''))
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
  const { user, login } = useAuth(); // Need to update context if name changes
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

  const avatarUrl = watchProfile('profilePictureUrl');

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
        setProfileValue('profilePictureUrl', res.data.profilePictureUrl || '');
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
        login(sessionStorage.getItem('token'), {
          ...user,
          name: res.data.fullName
        });
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
      <div className="max-w-4xl mx-auto space-y-6">
        <PageHeader title="Profile Settings" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6 md:col-span-1"><Skeleton className="h-64" /></Card>
          <div className="md:col-span-2 space-y-6">
            <Card className="p-6"><Skeleton className="h-48" /></Card>
            <Card className="p-6"><Skeleton className="h-64" /></Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <PageHeader 
        title="Profile Settings" 
        description="Manage your account information and security preferences."
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Profile Card */}
        <div className="lg:col-span-1">
          <ProfileCard profile={profile} />
        </div>

        {/* Right Column: Forms */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* General Information */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-6 border-b border-slate-100 dark:border-editorial-border pb-4">
              <User className="h-5 w-5 text-brand-500" />
              <h3 className="text-lg font-bold text-editorial-primary dark:text-editorial-primary">General Information</h3>
            </div>
            
            <form onSubmit={handleProfileSubmit(onProfileSave)} className="space-y-5">
              <AvatarUploader
                value={avatarUrl}
                onChange={(e) => setProfileValue('profilePictureUrl', e.target.value)}
                error={profileErrors.profilePictureUrl?.message}
                disabled={isSubmittingProfile}
              />
              
              <Input
                label="Full Name"
                error={profileErrors.fullName?.message}
                disabled={isSubmittingProfile}
                {...registerProfile('fullName')}
              />
              
              <div className="flex justify-end pt-2">
                <Button type="submit" loading={isSubmittingProfile} icon={Save}>
                  Save Changes
                </Button>
              </div>
            </form>
          </Card>

          {/* Security */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-6 border-b border-slate-100 dark:border-editorial-border pb-4">
              <Lock className="h-5 w-5 text-brand-500" />
              <h3 className="text-lg font-bold text-editorial-primary dark:text-editorial-primary">Change Password</h3>
            </div>
            
            <form onSubmit={handlePasswordSubmit(onPasswordSave)} className="space-y-4">
              <div className="relative">
                <Input
                  type={showCurrentPassword ? "text" : "password"}
                  label="Current Password"
                  error={passwordErrors.currentPassword?.message}
                  disabled={isSubmittingPassword}
                  {...registerPassword('currentPassword')}
                />
                <button
                  type="button"
                  className="absolute right-3 top-[34px] text-editorial-secondary hover:text-editorial-secondary dark:hover:text-editorial-secondary"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                >
                  {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>

              <div className="relative">
                <Input
                  type={showNewPassword ? "text" : "password"}
                  label="New Password"
                  error={passwordErrors.newPassword?.message}
                  disabled={isSubmittingPassword}
                  {...registerPassword('newPassword')}
                />
                <button
                  type="button"
                  className="absolute right-3 top-[34px] text-editorial-secondary hover:text-editorial-secondary dark:hover:text-editorial-secondary"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              
              <PasswordStrengthMeter password={newPasswordValue} />

              <Input
                type="password"
                label="Confirm New Password"
                error={passwordErrors.confirmPassword?.message}
                disabled={isSubmittingPassword}
                {...registerPassword('confirmPassword')}
              />
              
              <div className="flex justify-end pt-4">
                <Button type="submit" variant="primary" loading={isSubmittingPassword} icon={Lock}>
                  Update Password
                </Button>
              </div>
            </form>
          </Card>

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
