'use client';

import ProfileDropdown from '@/components/ProfileDropdown';
import { useEffect, useState } from 'react';
import {
  User,
  Mail,
  Lock,
  Trash2,
  AlertTriangle,
  Camera,
  BookOpen,
  Mic,
  Headphones,
  PenTool,
} from 'lucide-react';
import { useUserStore } from '@/lib/store/userStore';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { uploadProfilePicture } from '@/lib/services/profileServices';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const router = useRouter();
  const { profile, setProfile, fetchProfile } = useUserStore();
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const hasPassword = profile?.has_password;

  const [formData, setFormData] = useState({
    name: '',
    email: '',
  });

  // Course progress data
  const courseProgress = {
    totalScore: 102,
    maxScore: 120,
    skills: [
      {
        name: 'Reading',
        completed: 28,
        total: 30,
        color: 'bg-blue-100',
        textColor: 'text-blue-600',
        icon: <BookOpen size={20} />,
      },
      {
        name: 'Listening',
        completed: 26,
        total: 30,
        color: 'bg-green-100',
        textColor: 'text-green-600',
        icon: <Headphones size={20} />,
      },
      {
        name: 'Speaking',
        completed: 24,
        total: 30,
        color: 'bg-orange-100',
        textColor: 'text-orange-600',
        icon: <Mic size={20} />,
      },
      {
        name: 'Writing',
        completed: 24,
        total: 30,
        color: 'bg-purple-100',
        textColor: 'text-purple-600',
        icon: <PenTool size={20} />,
      },
    ],
  };

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.full_name || '',
        email: profile.email || '',
      });
    } else {
      fetchProfile();
    }
  }, [profile, fetchProfile]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = async () => {
    setLoading(true);

    const promise = new Promise(async (resolve, reject) => {
      try {
        const res = await fetch('/api/profile/update', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fullName: formData.name,
            email: formData.email,
          }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error);

        if (profile) {
          setProfile({
            ...profile,
            full_name: formData.name,
          });
        }

        setIsEditing(false);
        router.refresh();

        resolve(data);
      } catch (error) {
        reject(error);
      } finally {
        setLoading(false);
      }
    });

    await toast.promise(promise, {
      loading: 'Saving changes...',
      success: 'Profile updated successfully!',
      error: (err) => err.message,
    });
  };

  const handleChangePassword = async () => {
    if (hasPassword && !passwordData.currentPassword) {
      toast.error('Current password is required');
      return;
    }

    if (!passwordData.newPassword || !passwordData.confirmPassword) {
      toast.error('Please fill in new password fields');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New password and confirmation do not match!');
      return;
    }

    if (passwordData.newPassword.length < 8) {
      toast.error('New password must be at least 8 characters');
      return;
    }

    setLoading(true);

    const promise = new Promise(async (resolve, reject) => {
      try {
        const res = await fetch('/api/profile/change-password', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            currentPassword: passwordData.currentPassword,
            newPassword: passwordData.newPassword,
          }),
        });

        const data = await res.json();

        if (!res.ok) throw new Error(data.error || 'Failed to change password');

        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
        setIsChangingPassword(false);

        if (profile) {
          setProfile({
            ...profile,
            has_password: true,
          });
        }

        router.refresh();

        resolve(data);
      } catch (error) {
        reject(error);
      } finally {
        setLoading(false);
      }
    });

    await toast.promise(promise, {
      loading: 'Updating password...',
      success: hasPassword
        ? 'Password changed successfully!'
        : 'Set Password successfully!',
      error: (err) => err.message,
    });
  };

  const handleDeleteAccount = () => {
    // TODO: Add API call to delete account
    alert('Account deleted successfully!');
    setShowDeleteModal(false);
    // Redirect to home or login page
  };

  const handleProfilePictureChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file || !profile) return;

    setLoading(true);

    const promise = new Promise(async (resolve, reject) => {
      try {
        const publicUrl = await uploadProfilePicture(
          file,
          profile.id,
          profile.image_url
        );

        const res = await fetch('/api/profile/update', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ imageUrl: publicUrl }),
        });

        const data = await res.json();

        if (!res.ok) throw new Error(data.error || 'Failed to update database');

        setProfile({ ...profile, image_url: publicUrl });
        router.refresh();

        resolve(data);
      } catch (error) {
        reject(error);
      } finally {
        setLoading(false);
      }
    });

    await toast.promise(promise, {
      loading: 'Saving picture...',
      success: 'Profile picture updated successfully!',
      error: (err) => err.message,
    });
  };

  return (
    <div className="min-h-screen py-10 flex justify-center w-full">
      <div className="flex gap-5 w-full max-w-6xl mx-auto">
        <div>
          <ProfileDropdown />
        </div>

        <div className="w-full mx-5">
          {/* Header */}
          <div className="w-full max-w-4xl mb-8">
            <h1 className="text-3xl font-rowdies text-primary">My Profile</h1>
            <div className="mt-2 h-[2px] bg-primary/60"></div>
          </div>

          {/* Profile Content */}
          <div className="w-full max-w-4xl bg-white rounded-lg shadow-sm p-8">
            {/* Profile Picture & Level */}
            <div className="flex items-center gap-6 mb-8 pb-8 border-b border-gray-200">
              <div className="relative">
                <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-gray-200 relative bg-white">
                  <Image
                    src={
                      profile?.image_url || '/assets/images/profile_default.jpg'
                    }
                    alt={profile?.full_name ?? 'Profile Picture'}
                    fill
                    className="object-cover"
                  />
                </div>
                <label
                  htmlFor="profile-picture-upload"
                  className="absolute bottom-0 right-0 w-8 h-8 bg-teal-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-teal-700 transition-colors shadow-lg"
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <Camera size={16} className="text-white" />
                  )}
                </label>
                <input
                  id="profile-picture-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleProfilePictureChange}
                  className="hidden"
                  disabled={loading}
                />
              </div>
              <div>
                <h2 className="text-2xl font-saira font-semibold text-gray-800">
                  {profile?.full_name}
                </h2>
                <p className="text-primary font-medium">
                  Level {profile?.level}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Score: {profile?.score}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Member since {new Date().getFullYear()}{' '}
                </p>
              </div>
            </div>

            {/* Profile Information Form */}
            <div className="space-y-6">
              {/* Name */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-teal-50 flex items-center justify-center flex-shrink-0 mt-1">
                  <User size={20} className="text-teal-600" />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    Full Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      disabled={loading}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-800 font-saira">{formData.name}</p>
                  )}
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-teal-50 flex items-center justify-center flex-shrink-0 mt-1">
                  <Mail size={20} className="text-teal-600" />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    Email Address
                  </label>
                  {isEditing ? (
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      disabled={loading}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-800 font-saira">{formData.email}</p>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-6">
                {isEditing ? (
                  <>
                    <button
                      onClick={handleSave}
                      disabled={loading}
                      className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-medium"
                    >
                      {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button
                      onClick={() => setIsEditing(false)}
                      disabled={loading}
                      className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-medium"
                  >
                    Edit Profile
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Course Progress Section */}
          <div className="w-full max-w-4xl bg-white rounded-lg shadow-sm p-8 mt-6">
            <div className="mb-6">
              <div className="flex items-baseline justify-between mb-2">
                <h2 className="text-xl font-saira font-semibold text-gray-800">
                  Course Progress
                </h2>
                <div className="text-right">
                  <span className="text-3xl font-bold text-primary">
                    {courseProgress.totalScore}
                  </span>
                  <span className="text-gray-500">
                    /{courseProgress.maxScore}
                  </span>
                </div>
              </div>
            </div>

            {/* Skills Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {courseProgress.skills.map((skill) => (
                <div
                  key={skill.name}
                  className={`${skill.color} rounded-lg p-4 flex items-center gap-3`}
                >
                  <div className={`${skill.textColor}`}>{skill.icon}</div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">
                        {skill.name}
                      </span>
                      <span className={`text-sm font-bold ${skill.textColor}`}>
                        {skill.completed}/{skill.total}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Change Password Section */}
          <div className="w-full max-w-4xl bg-white rounded-lg shadow-sm p-8 mt-6">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
              <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center">
                <Lock size={20} className="text-amber-600" />
              </div>
              <h2 className="text-xl font-saira font-semibold text-gray-800">
                Change Password
              </h2>
            </div>

            {isChangingPassword ? (
              <div className="space-y-4">
                {hasPassword && (
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">
                      Current Password
                    </label>
                    <input
                      type="password"
                      name="currentPassword"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      placeholder="Enter current password"
                    />
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    New Password
                  </label>
                  <input
                    type="password"
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="Enter new password"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="Confirm new password"
                  />
                </div>
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={handleChangePassword}
                    className="px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors font-medium"
                  >
                    {hasPassword ? 'Update Password' : 'Set Password'}
                  </button>
                  <button
                    onClick={() => {
                      setIsChangingPassword(false);
                      setPasswordData({
                        currentPassword: '',
                        newPassword: '',
                        confirmPassword: '',
                      });
                    }}
                    className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setIsChangingPassword(true)}
                className="px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors font-medium"
              >
                Change Password
              </button>
            )}
          </div>

          {/* Delete Account Section */}
          <div className="w-full max-w-4xl bg-white rounded-lg shadow-sm p-8 mt-6 border-2 border-red-100">
            <div className="flex items-center gap-3 mb-4 pb-4 border-b border-red-200">
              <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center">
                <Trash2 size={20} className="text-red-600" />
              </div>
              <h2 className="text-xl font-saira font-semibold text-gray-800">
                Danger Zone
              </h2>
            </div>
            <p className="text-gray-600 mb-4">
              Once you delete your account, there is no going back. Please be
              certain.
            </p>
            <button
              onClick={() => setShowDeleteModal(true)}
              className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
            >
              Delete Account
            </button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                <AlertTriangle size={24} className="text-red-600" />
              </div>
              <h3 className="text-xl font-saira font-semibold text-gray-800">
                Delete Account?
              </h3>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete your account? This action cannot
              be undone and all your data will be permanently removed.
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleDeleteAccount}
                className="flex-1 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
              >
                Yes, Delete
              </button>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
