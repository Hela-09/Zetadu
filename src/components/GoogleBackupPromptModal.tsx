import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  KeyRound,
  ShieldCheck,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Loader2,
  X,
  Lock,
} from 'lucide-react';

interface GoogleBackupPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function GoogleBackupPromptModal({ isOpen, onClose }: GoogleBackupPromptModalProps) {
  const { user, linkPasswordAccount } = useAuth();
  const [mode, setMode] = useState<'prompt' | 'form' | 'success'>('prompt');
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !user) return null;

  const handleSkip = () => {
    // Record in sessionStorage so it doesn't persistently re-interrupt the user in this session
    try {
      sessionStorage.setItem(`learndean_skipped_backup_prompt_${user.uid}`, 'true');
    } catch (_) {}
    onClose();
  };

  const handleCreatePasswordClick = () => {
    setError(null);
    setMode('form');
  };

  const handleSubmitPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!password.trim()) {
      setError('Please enter a password.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match. Please verify your confirmation password.');
      return;
    }

    setLoading(true);
    try {
      const res = await linkPasswordAccount(password);
      if (res.success) {
        setMode('success');
        try {
          sessionStorage.setItem(`learndean_skipped_backup_prompt_${user.uid}`, 'true');
        } catch (_) {}
        setTimeout(() => {
          onClose();
        }, 2200);
      } else {
        setError(res.error || 'Failed to link password. Please try again.');
      }
    } catch (err: any) {
      setError(err?.message || 'An unexpected error occurred while linking your password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      id="google-backup-prompt-overlay"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in"
      onClick={handleSkip}
    >
      <div
        id="google-backup-prompt-card"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-7 relative overflow-hidden animate-scale-up"
      >
        {/* Top Close Button (Acts as Skip) */}
        <button
          onClick={handleSkip}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors cursor-pointer"
          aria-label="Skip for now"
          title="Skip for now"
        >
          <X size={18} />
        </button>

        {/* STEP 1: INITIAL PROMPT */}
        {mode === 'prompt' && (
          <div className="space-y-5 text-center">
            {/* Header Icon */}
            <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto shadow-xs">
              <KeyRound size={28} />
            </div>

            {/* Prompt Text (matching exact user requirements) */}
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-100/70 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300">
                <ShieldCheck size={14} />
                <span>Google Sign-Up Successful</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white leading-snug">
                Add a backup sign-in method?
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-sm mx-auto">
                Create a password so you can sign in without Google on another device.
              </p>
            </div>

            {/* Account pill */}
            <div className="px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200/80 dark:border-slate-700/80 text-xs text-slate-600 dark:text-slate-300 font-medium">
              Signed in as <strong className="text-slate-900 dark:text-white">{user.email}</strong>
            </div>

            {/* Buttons (matching exact user requirements) */}
            <div className="space-y-2.5 pt-2">
              <button
                id="create-password-btn"
                onClick={handleCreatePasswordClick}
                className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-bold text-sm shadow-md shadow-blue-500/20 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Lock size={16} />
                <span>Create Password</span>
              </button>

              <button
                id="skip-password-btn"
                onClick={handleSkip}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs sm:text-sm transition-colors cursor-pointer"
              >
                Skip for Now
              </button>
            </div>

            <p className="text-[11px] text-slate-400 dark:text-slate-500">
              You can also add or update a password anytime from <strong>Profile → Security</strong>.
            </p>
          </div>
        )}

        {/* STEP 2: PASSWORD CREATION FORM */}
        {mode === 'form' && (
          <form onSubmit={handleSubmitPassword} className="space-y-4">
            <div className="flex items-center gap-3 mb-1">
              <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                <Lock size={20} />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-base">
                  Create Backup Password
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Linked to {user.email}
                </p>
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-xs flex items-start gap-2">
                <AlertCircle size={16} className="shrink-0 mt-0.5 text-red-500" />
                <span className="flex-1 font-medium">{error}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  autoComplete="new-password"
                  className="w-full px-3.5 py-2.5 pr-10 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-type password"
                  autoComplete="new-password"
                  className="w-full px-3.5 py-2.5 pr-10 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="pt-2 space-y-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-bold text-sm shadow-md shadow-blue-500/20 transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Linking Password...</span>
                  </>
                ) : (
                  <span>Save & Link Password</span>
                )}
              </button>

              <button
                type="button"
                onClick={handleSkip}
                disabled={loading}
                className="w-full py-2 px-4 rounded-xl text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 text-xs font-semibold transition-colors cursor-pointer"
              >
                Skip for Now
              </button>
            </div>
          </form>
        )}

        {/* STEP 3: SUCCESS CONFIRMATION */}
        {mode === 'success' && (
          <div className="py-4 text-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 size={32} />
            </div>
            <h3 className="text-lg font-black text-slate-900 dark:text-white">
              Backup Password Created!
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed max-w-xs mx-auto">
              Your password has been linked to your account. You can now sign in with either Google or your email and password.
            </p>
            <div className="pt-2">
              <button
                onClick={onClose}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors cursor-pointer"
              >
                Continue
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
