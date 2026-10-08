import Logo from './Logo';
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { motion, AnimatePresence } from 'motion/react';
import { Loader2, ArrowLeft, Eye, EyeOff, KeyRound, CheckCircle2, ShieldCheck, Mail, User as UserIcon, Phone } from 'lucide-react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail, updateProfile } from 'firebase/auth';
import { auth, db, isFirestoreQuotaExhausted } from '../lib/firebase';
import { doc, setDoc } from 'firebase/firestore';

type ViewState = 'login' | 'register' | 'forgot-password' | 'create-password';

interface LoginProps {
  forceCreatePassword?: boolean;
}

const translateError = (err: any) => {
  if (!err || !err.code) return err?.message || 'An unexpected error occurred.';
  switch (err.code) {
    case 'auth/user-disabled':
      return 'This account has been disabled by an administrator. Access is revoked.';
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
    case 'auth/weak-password':
      return 'Password must be at least 6 characters long.';
    default:
      return err?.message || 'An unexpected error occurred. Please try again.';
  }
};

export default function Login({ forceCreatePassword = false }: LoginProps) {
  const {
    user,
    userProfile,
    signInWithGoogle,
    signOut,
    linkPasswordAccount,
    pendingSignupData,
    setPendingSignupData,
    needsPasswordCreation,
    error: contextError,
    clearError,
    setError
  } = useAuth();

  const [view, setView] = useState<ViewState>(forceCreatePassword || needsPasswordCreation ? 'create-password' : 'login');
  
  // Signup / Form fields
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  // Synchronize view when forceCreatePassword or needsPasswordCreation toggles
  useEffect(() => {
    if (forceCreatePassword || needsPasswordCreation) {
      setView('create-password');
    }
  }, [forceCreatePassword, needsPasswordCreation]);

  // When in create-password mode, prefill user profile details from Google / pending state
  useEffect(() => {
    if (view === 'create-password') {
      const displayName = user?.displayName || userProfile?.name || '';
      const nameParts = displayName.trim().split(/\s+/);
      const googleFirstName = nameParts[0] || '';
      const googleSurname = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';

      setName((prev) => prev || pendingSignupData?.name || userProfile?.firstName || googleFirstName);
      setSurname((prev) => prev || pendingSignupData?.surname || userProfile?.surname || googleSurname);
      setPhoneNumber((prev) => prev || pendingSignupData?.phoneNumber || userProfile?.phoneNumber || user?.phoneNumber || '');
      setEmail((prev) => prev || user?.email || userProfile?.email || '');
    }
  }, [view, user, userProfile, pendingSignupData]);

  useEffect(() => {
    setGoogleLoading(false);
  }, []);

  const changeView = (newView: ViewState) => {
    setView(newView);
    clearError();
    setPassword('');
    setConfirmPassword('');
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setError('Please enter both email and password.');
      return;
    }
    
    try {
      clearError();
      setLoading(true);
      await signInWithEmailAndPassword(auth, email.trim().toLowerCase(), password);
    } catch (err: any) {
      console.error(err);
      setError(translateError(err));
      setLoading(false);
    }
  };

  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim();
    const trimmedSurname = surname.trim();
    const trimmedPhone = phoneNumber.trim();
    const trimmedEmail = email.trim().toLowerCase();

    if (!trimmedName || !trimmedSurname || !trimmedPhone || !trimmedEmail || !password || !confirmPassword) {
      setError('Please fill in all fields (Name, Surname, Phone Number, Email, Password, Confirm Password).');
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

      // Verify the email is not disabled by an administrator
      try {
        const checkRes = await fetch('/api/auth/check-status', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: trimmedEmail })
        });
        if (checkRes.ok) {
          const checkData = await checkRes.json();
          if (checkData.disabled) {
            setError(checkData.reason || 'This email address has been disabled by an administrator. Account creation is blocked.');
            setLoading(false);
            return;
          }
        }
      } catch (_) {}

      const userCredential = await createUserWithEmailAndPassword(auth, trimmedEmail, password);
      const fullName = `${trimmedName} ${trimmedSurname}`.trim();
      
      await updateProfile(userCredential.user, {
        displayName: fullName
      });

      const cleanUsername = trimmedEmail.split('@')[0].replace(/[^a-zA-Z0-9]/g, '') + Math.floor(Math.random() * 1000);
      const isActualSuperAdmin = trimmedEmail === 'emmanuelomojola07@gmail.com';

      const initialProfile = {
        uid: userCredential.user.uid,
        email: trimmedEmail,
        name: fullName,
        firstName: trimmedName,
        surname: trimmedSurname,
        phoneNumber: trimmedPhone,
        displayName: fullName,
        username: cleanUsername,
        photoURL: '',
        educationLevel: 'Secondary',
        country: 'International',
        progress: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        role: isActualSuperAdmin ? 'super_admin' : 'student',
        isSuperAdmin: isActualSuperAdmin,
        subscriptionStatus: 'active'
      };

      try {
        localStorage.setItem(`zetadu_profile_${userCredential.user.uid}`, JSON.stringify(initialProfile));
      } catch (_) {}

      if (db && !isFirestoreQuotaExhausted()) {
        try {
          await setDoc(doc(db, 'users', userCredential.user.uid), initialProfile, { merge: true });
        } catch (dbErr) {
          console.warn('[Auth] Failed to write initial profile to Firestore:', dbErr);
        }
      }
    } catch (err: any) {
      console.error(err);
      setError(translateError(err));
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      clearError();
      setGoogleLoading(true);

      // If user filled in Name, Surname, or Phone on the signup view, preserve them
      if (name.trim() || surname.trim() || phoneNumber.trim()) {
        const pending = {
          name: name.trim(),
          surname: surname.trim(),
          phoneNumber: phoneNumber.trim()
        };
        setPendingSignupData(pending);
        try {
          sessionStorage.setItem('learndean_pending_signup', JSON.stringify(pending));
        } catch (_) {}
      }

      await signInWithGoogle();
    } catch (err: any) {
      console.error("Google sign-in error in Login component:", err);
      setError(translateError(err));
      setGoogleLoading(false);
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleCompleteGooglePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    const trimmedName = name.trim();
    const trimmedSurname = surname.trim();
    const trimmedPhone = phoneNumber.trim();

    if (!trimmedName || !trimmedSurname) {
      setError('Please provide both your Name and Surname.');
      return;
    }

    if (!trimmedPhone) {
      setError('Please provide your Phone Number.');
      return;
    }

    if (!password) {
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
      const res = await linkPasswordAccount(password, {
        name: trimmedName,
        surname: trimmedSurname,
        phoneNumber: trimmedPhone,
        email: user?.email || email.trim().toLowerCase()
      });

      if (res.success) {
        // Successfully linked password to the exact same Google account & updated profile
        setLoading(false);
      } else {
        setError(res.error || 'Failed to link password. Please try again.');
        setLoading(false);
      }
    } catch (err: any) {
      console.error('handleCompleteGooglePassword error:', err);
      setError(err?.message || 'An unexpected error occurred while setting up your password.');
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    }
    
    try {
      clearError();
      setLoading(true);
      await sendPasswordResetEmail(auth, email.trim().toLowerCase());
      alert('Password reset email sent! Check your inbox.');
      changeView('login');
    } catch (err: any) {
      console.error(err);
      setError(translateError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleSwitchAccount = async () => {
    await signOut();
    changeView('login');
  };

  return (
    <div className="min-h-[100dvh] flex items-center justify-center bg-slate-50 dark:bg-slate-900 p-4 py-8 sm:py-12 font-sans relative overflow-y-auto">
      <div className="absolute top-0 left-0 w-full h-[50vh] bg-gradient-to-b from-blue-600/5 to-transparent pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-full h-[50vh] bg-gradient-to-t from-red-600/5 to-transparent pointer-events-none"></div>
      
      <motion.div 
        className="w-full max-w-[460px] bg-white dark:bg-slate-800 rounded-3xl shadow-xl dark:shadow-2xl border border-slate-200 dark:border-slate-700/50 p-6 sm:p-10 relative z-10 my-auto"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="mb-6">
            <Logo variant="icon" className="w-16 h-16 shrink-0" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white text-center mb-2">
            {view === 'create-password'
              ? 'Create Password'
              : view === 'register'
              ? 'Create Account'
              : view === 'forgot-password'
              ? 'Reset Password'
              : 'Welcome to LearnDean'}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-center text-sm sm:text-base">
            {view === 'create-password'
              ? 'Set a password for your account so you can sign in with Google or your email and password.'
              : view === 'register'
              ? 'Join LearnDean to start practicing JAMB and studying smarter.'
              : view === 'forgot-password'
              ? 'Enter your email to receive a password recovery link.'
              : 'Your personal AI-powered learning companion.'}
          </p>
        </div>

        {contextError && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 text-sm flex items-start gap-3">
            <span className="shrink-0 mt-0.5">⚠️</span>
            <span>{contextError}</span>
          </div>
        )}

        <AnimatePresence mode="wait">
          {/* VIEW: LOGIN */}
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
                  id="signin-email-input"
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-[52px] px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  required
                />
              </div>
              <div className="relative">
                <input
                  id="signin-password-input"
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-[52px] pl-4 pr-12 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  required
                />
                <button
                  id="toggle-signin-password-visibility"
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 focus:outline-none transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                </button>
              </div>
              
              <div className="flex justify-end">
                <button type="button" onClick={() => changeView('forgot-password')} className="text-sm text-blue-600 dark:text-blue-400 font-medium hover:underline">
                  Forgot password?
                </button>
              </div>

              <button
                id="signin-submit-btn"
                type="submit"
                disabled={loading || googleLoading}
                className="w-full h-[52px] bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors shadow-sm flex items-center justify-center gap-2 disabled:opacity-50 mt-2 cursor-pointer"
              >
                {loading ? <Loader2 className="animate-spin" size={20} /> : 'Sign In'}
              </button>

              <div className="relative flex items-center py-4">
                <div className="flex-grow border-t border-slate-200 dark:border-slate-700"></div>
                <span className="flex-shrink-0 mx-4 text-slate-400 text-sm">OR</span>
                <div className="flex-grow border-t border-slate-200 dark:border-slate-700"></div>
              </div>

              <button 
                id="signin-google-btn"
                type="button"
                onClick={handleGoogleSignIn}
                disabled={loading || googleLoading}
                className="w-full h-[52px] bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold rounded-xl transition-colors shadow-sm flex items-center justify-center gap-3 disabled:opacity-50 cursor-pointer"
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
                  <button type="button" onClick={() => changeView('register')} className="text-blue-600 dark:text-blue-400 font-semibold hover:underline cursor-pointer">
                    Create account
                  </button>
                </p>
              </div>
            </motion.form>
          )}

          {/* VIEW: REGISTER (SIGNUP FIELDS: Name, Surname, Phone Number, Email, Password, Confirm Password) */}
          {view === 'register' && (
            <motion.form 
              key="register"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              onSubmit={handleCreateAccount} 
              className="flex flex-col gap-3.5"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Name</label>
                  <input
                    id="register-name-input"
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full h-[48px] px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Surname</label>
                  <input
                    id="register-surname-input"
                    type="text"
                    placeholder="Surname"
                    value={surname}
                    onChange={(e) => setSurname(e.target.value)}
                    className="w-full h-[48px] px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Phone Number</label>
                <div className="relative">
                  <input
                    id="register-phone-input"
                    type="tel"
                    placeholder="Phone Number"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full h-[48px] pl-10 pr-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm"
                    required
                  />
                  <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Email</label>
                <input
                  id="register-email-input"
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-[48px] px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Password</label>
                <div className="relative">
                  <input
                    id="register-password-input"
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full h-[48px] pl-4 pr-12 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm"
                    required
                  />
                  <button
                    id="toggle-register-password-visibility"
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 focus:outline-none transition-colors cursor-pointer"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Confirm Password</label>
                <div className="relative">
                  <input
                    id="register-confirm-password-input"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full h-[48px] pl-4 pr-12 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm"
                    required
                  />
                  <button
                    id="toggle-register-confirm-password-visibility"
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 focus:outline-none transition-colors cursor-pointer"
                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              
              <button
                id="register-submit-btn"
                type="submit"
                disabled={loading || googleLoading}
                className="w-full h-[50px] bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors shadow-sm flex items-center justify-center gap-2 disabled:opacity-50 mt-2 cursor-pointer"
              >
                {loading ? <Loader2 className="animate-spin" size={20} /> : 'Create Account'}
              </button>

              <div className="relative flex items-center py-2">
                <div className="flex-grow border-t border-slate-200 dark:border-slate-700"></div>
                <span className="flex-shrink-0 mx-4 text-slate-400 text-xs font-medium">OR</span>
                <div className="flex-grow border-t border-slate-200 dark:border-slate-700"></div>
              </div>

              <button 
                id="register-google-btn"
                type="button"
                onClick={handleGoogleSignIn}
                disabled={loading || googleLoading}
                className="w-full h-[48px] bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold rounded-xl transition-colors shadow-sm flex items-center justify-center gap-3 disabled:opacity-50 cursor-pointer text-sm"
              >
                {googleLoading ? (
                  <Loader2 className="animate-spin" size={18} />
                ) : (
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 24c2.97 0 5.46-1 7.28-2.69l-3.57-2.77c-.99.69-2.26 1.1-3.71 1.1-2.87 0-5.3-1.94-6.16-4.53H2.18v2.84C3.99 21.53 7.7 24 12 24z" />
                    <path fill="#FBBC05" d="M5.84 15.11c-.22-.69-.35-1.43-.35-2.11s.13-1.42.35-2.11V8.05H2.18C1.43 9.55 1 11.22 1 12s.43 2.45 1.18 3.95l3.66-2.84z" />
                    <path fill="#EA4335" d="M12 4.69c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 1.19 14.97 0 12 0 7.7 0 3.99 2.47 2.18 5.95l3.66 2.84c.87-2.6 3.3-4.1 6.16-4.1z" />
                  </svg>
                )}
                {googleLoading ? 'Connecting to Google...' : 'Continue with Google'}
              </button>

              <div className="text-center mt-4">
                <p className="text-slate-500 text-sm">
                  Already have an account?{' '}
                  <button type="button" onClick={() => changeView('login')} className="text-blue-600 dark:text-blue-400 font-semibold hover:underline cursor-pointer">
                    Sign In
                  </button>
                </p>
              </div>
            </motion.form>
          )}

          {/* VIEW: CREATE PASSWORD (GOOGLE SIGNUP MANDATORY STEP) */}
          {view === 'create-password' && (
            <motion.form 
              key="create-password"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
              onSubmit={handleCompleteGooglePassword} 
              className="flex flex-col gap-3.5"
            >
              {/* Linked Google Account Banner */}
              <div className="p-3 bg-blue-50/80 dark:bg-blue-900/25 border border-blue-200/80 dark:border-blue-800/50 rounded-2xl flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-full bg-white dark:bg-slate-800 border border-blue-200 dark:border-blue-700 flex items-center justify-center shrink-0 shadow-2xs">
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 24c2.97 0 5.46-1 7.28-2.69l-3.57-2.77c-.99.69-2.26 1.1-3.71 1.1-2.87 0-5.3-1.94-6.16-4.53H2.18v2.84C3.99 21.53 7.7 24 12 24z" />
                      <path fill="#FBBC05" d="M5.84 15.11c-.22-.69-.35-1.43-.35-2.11s.13-1.42.35-2.11V8.05H2.18C1.43 9.55 1 11.22 1 12s.43 2.45 1.18 3.95l3.66-2.84z" />
                      <path fill="#EA4335" d="M12 4.69c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 1.19 14.97 0 12 0 7.7 0 3.99 2.47 2.18 5.95l3.66 2.84c.87-2.6 3.3-4.1 6.16-4.1z" />
                    </svg>
                  </div>
                  <div className="truncate">
                    <p className="font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
                      <ShieldCheck size={13} className="text-blue-600 dark:text-blue-400" />
                      Google Authenticated
                    </p>
                    <p className="text-slate-500 dark:text-slate-400 truncate font-mono text-[11px]">
                      {user?.email || email}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleSwitchAccount}
                  className="text-xs text-blue-600 dark:text-blue-400 font-medium hover:underline shrink-0 cursor-pointer"
                >
                  Change
                </button>
              </div>

              {/* Name & Surname inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Name</label>
                  <input
                    id="create-password-name-input"
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full h-[48px] px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Surname</label>
                  <input
                    id="create-password-surname-input"
                    type="text"
                    placeholder="Surname"
                    value={surname}
                    onChange={(e) => setSurname(e.target.value)}
                    className="w-full h-[48px] px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm"
                    required
                  />
                </div>
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Phone Number</label>
                <div className="relative">
                  <input
                    id="create-password-phone-input"
                    type="tel"
                    placeholder="Phone Number"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full h-[48px] pl-10 pr-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm"
                    required
                  />
                  <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Password</label>
                <div className="relative">
                  <input
                    id="create-password-input"
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full h-[48px] pl-4 pr-12 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm"
                    required
                  />
                  <button
                    id="toggle-create-password-visibility"
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 focus:outline-none transition-colors cursor-pointer"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Confirm Password</label>
                <div className="relative">
                  <input
                    id="create-confirm-password-input"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full h-[48px] pl-4 pr-12 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm"
                    required
                  />
                  <button
                    id="toggle-create-confirm-password-visibility"
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 focus:outline-none transition-colors cursor-pointer"
                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="text-[11px] text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/40 p-2.5 rounded-xl border border-slate-200/80 dark:border-slate-700/60 flex items-start gap-2">
                <KeyRound size={15} className="text-blue-500 shrink-0 mt-0.5" />
                <span>
                  This password will be securely linked to your Google account. You will be able to sign in using either <strong>Google</strong> or <strong>Email + Password</strong> anytime.
                </span>
              </div>
              
              <button
                id="create-password-submit-btn"
                type="submit"
                disabled={loading}
                className="w-full h-[52px] bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors shadow-sm flex items-center justify-center gap-2 disabled:opacity-50 mt-1 cursor-pointer"
              >
                {loading ? <Loader2 className="animate-spin" size={20} /> : 'Save Password & Finish Setup'}
              </button>

              <div className="text-center mt-3">
                <button
                  type="button"
                  onClick={handleSwitchAccount}
                  className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 text-xs font-medium flex items-center justify-center gap-1.5 mx-auto cursor-pointer"
                >
                  <ArrowLeft size={14} /> Cancel / Sign in with a different account
                </button>
              </div>
            </motion.form>
          )}

          {/* VIEW: FORGOT PASSWORD */}
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
                  id="forgot-email-input"
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-[52px] px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  required
                />
              </div>
              
              <button
                id="forgot-submit-btn"
                type="submit"
                disabled={loading}
                className="w-full h-[52px] bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors shadow-sm flex items-center justify-center gap-2 disabled:opacity-50 mt-4 cursor-pointer"
              >
                {loading ? <Loader2 className="animate-spin" size={20} /> : 'Send Reset Link'}
              </button>

              <div className="text-center mt-6">
                <button type="button" onClick={() => changeView('login')} className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 text-sm font-medium flex items-center justify-center gap-2 mx-auto cursor-pointer">
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

