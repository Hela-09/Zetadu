import Logo from './Logo';
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { motion, AnimatePresence } from 'motion/react';
import { Loader2, ArrowLeft } from 'lucide-react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail, updateProfile } from 'firebase/auth';
import { auth, db } from '../lib/firebase';

type ViewState = 'login' | 'register' | 'forgot-password';

const translateError = (err: any) => {
  if (!err || !err.code) return err?.message || 'An unexpected error occurred.';
  switch (err.code) {
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/user-not-found':
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'Email or password is incorrect.';
    case 'auth/email-already-in-use':
      return 'An account with this email already exists.';
    case 'auth/network-request-failed':
      return 'Something went wrong. Please check your internet connection and try again.';
    case 'auth/popup-closed-by-user':
    case 'auth/cancelled-popup-request':
      return 'Google sign-in was cancelled.';
    case 'auth/popup-blocked':
      return 'Popup blocked by browser. Please allow popups or try opening the app in a new tab.';
    default:
      return 'An unexpected error occurred. Please try again.';
  }
};

export default function Login() {
  const { signInWithGoogle, error: contextError, clearError, setError } = useAuth();
  const [view, setView] = useState<ViewState>('login');
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const changeView = (newView: ViewState) => {
    setView(newView);
    clearError();
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setName('');
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }
    
    try {
      clearError();
      setLoading(true);
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err: any) {
      console.error(err);
      setError(translateError(err));
      setLoading(false);
    }
  };

  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill in all fields.');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    
    try {
      clearError();
      setLoading(true);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      await updateProfile(userCredential.user, {
        displayName: name
      });
      // The onAuthStateChanged listener in AuthContext will create the user profile in Firestore
    } catch (err: any) {
      console.error(err);
      setError(translateError(err));
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email address.');
      return;
    }
    
    try {
      clearError();
      setLoading(true);
      await sendPasswordResetEmail(auth, email);
      alert('Password reset email sent! Check your inbox.');
      changeView('login');
    } catch (err: any) {
      console.error(err);
      setError(translateError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      clearError();
      setGoogleLoading(true);
      await signInWithGoogle();
    } catch (err: any) {
      console.error(err);
      setError(translateError(err));
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-[100dvh] flex items-center justify-center bg-slate-50 dark:bg-slate-900 p-4 font-sans relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-[50vh] bg-gradient-to-b from-blue-600/5 to-transparent pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-full h-[50vh] bg-gradient-to-t from-red-600/5 to-transparent pointer-events-none"></div>
      
      <motion.div 
        className="w-full max-w-[440px] bg-white dark:bg-slate-800 rounded-3xl shadow-xl dark:shadow-2xl border border-slate-200 dark:border-slate-700/50 p-8 sm:p-10 relative z-10"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="mb-6">
            <Logo variant="icon" className="w-16 h-16 shrink-0" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white text-center mb-2">
            Welcome to Zetadu
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-center text-sm sm:text-base">
            Your personal AI-powered learning companion.
          </p>
        </div>

        {contextError && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 text-sm flex items-start gap-3">
            <span className="shrink-0 mt-0.5">⚠️</span>
            <span>{contextError}</span>
          </div>
        )}

        <AnimatePresence mode="wait">
          {view === 'login' && (
            <motion.form 
              key="login"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
              onSubmit={handleSignIn} 
              className="flex flex-col gap-4"
            >
              <div>
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-[52px] px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  required
                />
              </div>
              <div>
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-[52px] px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  required
                />
              </div>
              
              <div className="flex justify-end">
                <button type="button" onClick={() => changeView('forgot-password')} className="text-sm text-blue-600 dark:text-blue-400 font-medium hover:underline">
                  Forgot password?
                </button>
              </div>

              <button
                type="submit"
                disabled={loading || googleLoading}
                className="w-full h-[52px] bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors shadow-sm flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
              >
                {loading ? <Loader2 className="animate-spin" size={20} /> : 'Sign In'}
              </button>

              <div className="relative flex items-center py-4">
                <div className="flex-grow border-t border-slate-200 dark:border-slate-700"></div>
                <span className="flex-shrink-0 mx-4 text-slate-400 text-sm">OR</span>
                <div className="flex-grow border-t border-slate-200 dark:border-slate-700"></div>
              </div>

              <button 
                type="button"
                onClick={handleGoogleSignIn}
                disabled={loading || googleLoading}
                className="w-full h-[52px] bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold rounded-xl transition-colors shadow-sm flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {googleLoading ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 24c2.97 0 5.46-1 7.28-2.69l-3.57-2.77c-.99.69-2.26 1.1-3.71 1.1-2.87 0-5.3-1.94-6.16-4.53H2.18v2.84C3.99 21.53 7.7 24 12 24z" />
                    <path fill="#FBBC05" d="M5.84 15.11c-.22-.69-.35-1.43-.35-2.11s.13-1.42.35-2.11V8.05H2.18C1.43 9.55 1 11.22 1 12s.43 2.45 1.18 3.95l3.66-2.84z" />
                    <path fill="#EA4335" d="M12 4.69c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 1.19 14.97 0 12 0 7.7 0 3.99 2.47 2.18 5.95l3.66 2.84c.87-2.6 3.3-4.1 6.16-4.1z" />
                  </svg>
                )}
                {googleLoading ? 'Connecting to Google...' : 'Continue with Google'}
              </button>

              <div className="text-center mt-6">
                <p className="text-slate-500 text-sm">
                  Don't have an account?{' '}
                  <button type="button" onClick={() => changeView('register')} className="text-blue-600 dark:text-blue-400 font-semibold hover:underline">
                    Create account
                  </button>
                </p>
              </div>
            </motion.form>
          )}

          {view === 'register' && (
            <motion.form 
              key="register"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              onSubmit={handleCreateAccount} 
              className="flex flex-col gap-4"
            >
              <div>
                <input
                  type="text"
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full h-[52px] px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  required
                />
              </div>
              <div>
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-[52px] px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  required
                />
              </div>
              <div>
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-[52px] px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  required
                />
              </div>
              <div>
                <input
                  type="password"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full h-[52px] px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  required
                />
              </div>
              
              <button
                type="submit"
                disabled={loading}
                className="w-full h-[52px] bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors shadow-sm flex items-center justify-center gap-2 disabled:opacity-50 mt-4"
              >
                {loading ? <Loader2 className="animate-spin" size={20} /> : 'Create Account'}
              </button>

              <div className="text-center mt-6">
                <p className="text-slate-500 text-sm">
                  Already have an account?{' '}
                  <button type="button" onClick={() => changeView('login')} className="text-blue-600 dark:text-blue-400 font-semibold hover:underline">
                    Sign In
                  </button>
                </p>
              </div>
            </motion.form>
          )}

          {view === 'forgot-password' && (
            <motion.form 
              key="forgot-password"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
              onSubmit={handleForgotPassword} 
              className="flex flex-col gap-4"
            >
              <div>
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-[52px] px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  required
                />
              </div>
              
              <button
                type="submit"
                disabled={loading}
                className="w-full h-[52px] bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors shadow-sm flex items-center justify-center gap-2 disabled:opacity-50 mt-4"
              >
                {loading ? <Loader2 className="animate-spin" size={20} /> : 'Send Reset Link'}
              </button>

              <div className="text-center mt-6">
                <button type="button" onClick={() => changeView('login')} className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 text-sm font-medium flex items-center justify-center gap-2 mx-auto">
                  <ArrowLeft size={16} /> Back to Sign In
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
