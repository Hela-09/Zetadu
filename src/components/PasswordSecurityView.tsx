import React, { useState } from 'react';
import { 
  ArrowLeft, Lock, KeyRound, Eye, EyeOff, ShieldCheck, 
  AlertCircle, CheckCircle2, RefreshCw, Mail, ExternalLink, Shield
} from 'lucide-react';
import { updatePassword, reauthenticateWithCredential, EmailAuthProvider, sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';

interface PasswordSecurityViewProps {
  onBack: () => void;
}

export default function PasswordSecurityView({ onBack }: PasswordSecurityViewProps) {
  const { user } = useAuth();

  const hasPasswordProvider = user?.providerData?.some(p => p.providerId === 'password') || false;
  const isGoogleUser = user?.providerData?.some(p => p.providerId === 'google.com') || false;

  // Form states
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Visibility toggles
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Status states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Google setup email states
  const [resetEmailSent, setResetEmailSent] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [resetError, setResetError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!currentPassword.trim()) {
      setError('Please enter your current password.');
      return;
    }

    if (!newPassword.trim()) {
      setError('Please enter a new password.');
      return;
    }

    if (newPassword.length < 6) {
      setError('New password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('The new password and confirmation password do not match.');
      return;
    }

    if (currentPassword === newPassword) {
      setError('Your new password must be different from your current password.');
      return;
    }

    if (!user || !user.email) {
      setError('You must be signed in to change your password.');
      return;
    }

    setLoading(true);

    try {
      // Re-authenticate user with current password
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);

      // Update password using Firebase Authentication (never stored in Firestore)
      await updatePassword(user, newPassword);

      setSuccess('Your password has been successfully updated.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setShowCurrentPassword(false);
      setShowNewPassword(false);
      setShowConfirmPassword(false);
    } catch (err: any) {
      console.error('Password change error:', err);
      const code = err?.code;
      if (code === 'auth/wrong-password' || code === 'auth/invalid-credential') {
        setError('The current password you entered is incorrect. Please try again.');
      } else if (code === 'auth/weak-password') {
        setError('The new password is too weak. Please use at least 6 characters including letters and numbers.');
      } else if (code === 'auth/too-many-requests') {
        setError('Access temporarily blocked due to many failed attempts. Please try again in a few minutes.');
      } else if (code === 'auth/requires-recent-login') {
        setError('This operation requires recent authentication. Please log out and log back in, then try again.');
      } else {
        setError(err?.message || 'Failed to update password. Please check your current password and try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSendPasswordSetup = async () => {
    if (!user?.email || !auth) return;
    setResetLoading(true);
    setResetError(null);
    try {
      await sendPasswordResetEmail(auth, user.email);
      setResetEmailSent(true);
    } catch (err: any) {
      console.error('Error sending password setup email:', err);
      setResetError(err?.message || 'Failed to send password setup email. Please try again.');
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-300">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button 
          onClick={onBack} 
          className="p-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer" 
          aria-label="Back"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Lock className="text-blue-600 dark:text-blue-400" size={24} />
            Password & Security
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Manage your account credentials and security preferences
          </p>
        </div>
      </div>

      <div className="max-w-xl mx-auto space-y-6">
        {/* Google SSO User Info Card */}
        {!hasPasswordProvider && isGoogleUser ? (
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 p-6 shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4">
              <ShieldCheck size={26} />
            </div>

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 mb-3 border border-emerald-200/50 dark:border-emerald-800/50">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Google Single Sign-On Active
            </div>

            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
              Signed in with Google
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
              Your Zetadu account is authenticated directly through your Google account (
              <span className="font-semibold text-slate-900 dark:text-white">{user?.email}</span>
              ). Because you use Google OAuth, your password and sign-in credentials are secured directly by Google.
            </p>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/60 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 space-y-2">
              <div className="flex items-start gap-2">
                <Shield size={16} className="text-blue-500 shrink-0 mt-0.5" />
                <span>
                  No local password is required to log in. Simply use the <strong>Sign In with Google</strong> button whenever you log into Zetadu.
                </span>
              </div>
            </div>

            {/* Optional Setup Email */}
            <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-700/80">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                Want to add a password for email login?
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 mb-4">
                You can set up a password so you can sign in with either your Google account or with your email and password.
              </p>

              {resetEmailSent ? (
                <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 rounded-xl border border-emerald-200 dark:border-emerald-800 text-xs flex items-center gap-2">
                  <CheckCircle2 size={16} className="shrink-0" />
                  <span>Password setup email sent to <strong>{user?.email}</strong>. Check your inbox to create your password.</span>
                </div>
              ) : (
                <div>
                  <button
                    onClick={handleSendPasswordSetup}
                    disabled={resetLoading}
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-semibold transition-colors cursor-pointer disabled:opacity-50"
                  >
                    {resetLoading ? (
                      <RefreshCw size={14} className="animate-spin" />
                    ) : (
                      <Mail size={14} />
                    )}
                    Send Password Creation Email
                  </button>
                  {resetError && (
                    <p className="mt-2 text-xs text-red-600 dark:text-red-400">{resetError}</p>
                  )}
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Standard Email/Password User Form */
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100 dark:border-slate-700/80">
              <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <KeyRound size={20} />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-base">
                  Change Password
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Update your password to keep your account secure
                </p>
              </div>
            </div>

            {/* Error Banner */}
            {error && (
              <div className="mb-5 p-4 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/60 text-red-700 dark:text-red-300 text-xs flex items-start gap-3">
                <AlertCircle size={18} className="shrink-0 mt-0.5 text-red-500" />
                <div className="flex-1 font-medium">{error}</div>
              </div>
            )}

            {/* Success Banner */}
            {success && (
              <div className="mb-5 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-emerald-700 dark:text-emerald-300 text-xs flex items-start gap-3">
                <CheckCircle2 size={18} className="shrink-0 mt-0.5 text-emerald-500" />
                <div className="flex-1 font-medium">{success}</div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Current Password Field */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type={showCurrentPassword ? 'text' : 'password'}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter your current password"
                    autoComplete="current-password"
                    className="w-full px-4 py-2.5 pr-11 bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
                    aria-label={showCurrentPassword ? 'Hide current password' : 'Show current password'}
                  >
                    {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* New Password Field */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password (at least 6 characters)"
                    autoComplete="new-password"
                    className="w-full px-4 py-2.5 pr-11 bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
                    aria-label={showNewPassword ? 'Hide new password' : 'Show new password'}
                  >
                    {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {newPassword && (
                  <p className={`text-[11px] mt-1.5 flex items-center gap-1 ${newPassword.length >= 6 ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500 dark:text-slate-400'}`}>
                    {newPassword.length >= 6 ? <CheckCircle2 size={13} /> : <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>}
                    {newPassword.length >= 6 ? 'Minimum length requirement met' : 'Password must be at least 6 characters'}
                  </p>
                )}
              </div>

              {/* Confirm New Password Field */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm your new password"
                    autoComplete="new-password"
                    className="w-full px-4 py-2.5 pr-11 bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
                    aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                {/* Match indicator */}
                {confirmPassword && (
                  <p className={`text-[11px] mt-1.5 flex items-center gap-1 ${newPassword === confirmPassword ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}`}>
                    {newPassword === confirmPassword ? (
                      <>
                        <CheckCircle2 size={13} />
                        Passwords match
                      </>
                    ) : (
                      <>
                        <AlertCircle size={13} />
                        Passwords do not match yet
                      </>
                    )}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <div className="pt-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-sm rounded-xl shadow-sm hover:shadow transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
                >
                  {loading ? (
                    <>
                      <RefreshCw size={16} className="animate-spin" />
                      Updating Password...
                    </>
                  ) : (
                    'Update Password'
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Security Info Card */}
        <div className="bg-slate-50 dark:bg-slate-900/40 rounded-2xl border border-slate-200/60 dark:border-slate-800 p-4 text-xs text-slate-500 dark:text-slate-400 flex items-start gap-3">
          <Shield size={18} className="text-blue-500 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-semibold text-slate-700 dark:text-slate-300">
              Your security is our priority
            </p>
            <p>
              Passwords are encrypted and verified through Firebase Authentication. Zetadu never stores or logs your raw password in any database.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
