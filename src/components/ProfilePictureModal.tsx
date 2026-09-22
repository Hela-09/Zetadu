import React, { useState, useRef } from 'react';
import { Camera, Trash2, X, Upload, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { uploadUserProfilePicture, removeUserProfilePicture } from '../services/profileImageService';
import UserAvatar from './UserAvatar';
import { useAuth } from '../contexts/AuthContext';

interface ProfilePictureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ProfilePictureModal({ isOpen, onClose }: ProfilePictureModalProps) {
  const { user, userProfile, updatePhotoURL } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  if (!isOpen || !user) return null;

  const currentPhoto = userProfile?.photoURL || user?.photoURL || null;

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset state
    setError(null);
    setSuccess(null);

    // Validate type
    if (!file.type.startsWith('image/')) {
      setError('Please choose a valid image file (PNG, JPG, or WEBP).');
      return;
    }

    // Validate size (max 10MB input before compression)
    if (file.size > 10 * 1024 * 1024) {
      setError('Image file is too large. Please select a photo under 10MB.');
      return;
    }

    setIsUploading(true);
    try {
      // 1. Upload to Firebase Storage using the user's UID
      const newPhotoURL = await uploadUserProfilePicture(user.uid, file);

      // 2. Persist to Auth currentUser, Firestore doc, and state
      await updatePhotoURL(newPhotoURL);

      setSuccess('Profile picture updated successfully!');
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
    } catch (err: any) {
      console.error('Failed to upload picture:', err);
      setError(err?.message || 'Failed to upload image. Please try again.');
    } finally {
      setIsUploading(false);
      // Reset input value so user can re-select the same file if desired
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemovePhoto = async () => {
    if (!currentPhoto) return;

    setError(null);
    setSuccess(null);
    setIsUploading(true);

    try {
      // 1. Delete from Firebase Storage
      await removeUserProfilePicture(user.uid);

      // 2. Clear from userProfile and Auth
      await updatePhotoURL(null);

      setSuccess('Profile picture removed.');
      setTimeout(() => {
        setSuccess(null);
      }, 2500);
    } catch (err: any) {
      console.error('Failed to remove photo:', err);
      setError(err?.message || 'Failed to remove picture.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="profile-photo-modal-title"
    >
      <div 
        className="w-full max-w-sm sm:max-w-md bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-7 relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          aria-label="Close dialog"
        >
          <X size={20} />
        </button>

        {/* Modal Title */}
        <div className="text-center mb-6">
          <h3 id="profile-photo-modal-title" className="text-xl font-bold text-slate-900 dark:text-white">
            Profile Picture
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Upload or change your picture across LearnDean
          </p>
        </div>

        {/* Avatar Live Display */}
        <div className="flex flex-col items-center justify-center mb-6">
          <div className="relative group">
            <UserAvatar
              photoURL={currentPhoto}
              displayName={userProfile?.name || user?.displayName}
              email={user?.email}
              size="hero"
              className="ring-4 ring-blue-500/20 shadow-lg"
            />
            {isUploading && (
              <div className="absolute inset-0 rounded-full bg-slate-900/60 backdrop-blur-2xs flex flex-col items-center justify-center text-white">
                <Loader2 size={28} className="animate-spin text-blue-400 mb-1" />
                <span className="text-[10px] font-semibold">Saving...</span>
              </div>
            )}
          </div>

          <div className="text-center mt-3">
            <p className="font-bold text-slate-800 dark:text-white text-sm">
              {userProfile?.name || user?.displayName || 'Student'}
            </p>
            <p className="text-xs text-slate-400">
              {user?.email}
            </p>
          </div>
        </div>

        {/* Alerts */}
        {error && (
          <div className="mb-5 p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/50 text-rose-700 dark:text-rose-300 text-xs flex items-start gap-2.5">
            <AlertCircle size={16} className="shrink-0 mt-0.5" />
            <p className="flex-1">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-5 p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/50 text-emerald-700 dark:text-emerald-300 text-xs flex items-start gap-2.5">
            <CheckCircle2 size={16} className="shrink-0 mt-0.5" />
            <p className="flex-1">{success}</p>
          </div>
        )}

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/gif"
          onChange={handleFileSelect}
          className="hidden"
          disabled={isUploading}
        />

        {/* Action Buttons */}
        <div className="space-y-2.5">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md transition-all cursor-pointer disabled:opacity-50"
          >
            {isUploading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Uploading to Storage...
              </>
            ) : currentPhoto ? (
              <>
                <Camera size={18} />
                Change Picture
              </>
            ) : (
              <>
                <Upload size={18} />
                Upload Picture from Device
              </>
            )}
          </button>

          {currentPhoto && (
            <button
              type="button"
              onClick={handleRemovePhoto}
              disabled={isUploading}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-rose-50 dark:bg-slate-800 dark:hover:bg-rose-950/30 text-slate-700 hover:text-rose-600 dark:text-slate-300 dark:hover:text-rose-400 font-semibold text-xs border border-slate-200 dark:border-slate-700 hover:border-rose-200 dark:hover:border-rose-800/40 transition-colors cursor-pointer disabled:opacity-50"
            >
              <Trash2 size={16} />
              Remove Picture
            </button>
          )}

          <button
            type="button"
            onClick={onClose}
            disabled={isUploading}
            className="w-full py-2.5 px-4 rounded-xl text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 text-xs font-semibold transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
