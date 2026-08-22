const fs = require('fs');

const code = `import Logo from './Logo';
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'motion/react';
import { Loader2 } from 'lucide-react';

export default function Login() {
  const { signInWithGoogle, error: contextError, clearError, setError } = useAuth();
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    try {
      clearError();
      setGoogleLoading(true);
      await signInWithGoogle();
    } catch (err: any) {
      console.error(err);
      setError(err?.message || 'Failed to sign in with Google');
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-[100dvh] flex items-center justify-center bg-slate-50 dark:bg-slate-900 p-4 font-sans relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-[50vh] bg-gradient-to-b from-blue-600/5 to-transparent pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-full h-[50vh] bg-gradient-to-t from-red-600/5 to-transparent pointer-events-none"></div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[440px] bg-white dark:bg-slate-800 rounded-3xl shadow-xl dark:shadow-2xl border border-slate-200 dark:border-slate-700/50 p-8 sm:p-10 relative z-10"
      >
        <div className="flex flex-col items-center mb-10">
          <div className="mb-6">
            <Logo size="lg" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white text-center mb-3">
            Welcome to EduCore
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

        <button 
          type="button"
          onClick={handleGoogleSignIn}
          disabled={googleLoading}
          className="w-full h-[56px] bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold rounded-xl transition-all shadow-sm hover:shadow flex items-center justify-center gap-3 disabled:opacity-50 group"
        >
          {googleLoading ? (
            <Loader2 className="animate-spin text-blue-600" size={24} />
          ) : (
            <svg className="w-6 h-6 transition-transform group-hover:scale-110" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 24c2.97 0 5.46-1 7.28-2.69l-3.57-2.77c-.99.69-2.26 1.1-3.71 1.1-2.87 0-5.3-1.94-6.16-4.53H2.18v2.84C3.99 21.53 7.7 24 12 24z" />
              <path fill="#FBBC05" d="M5.84 15.11c-.22-.69-.35-1.43-.35-2.11s.13-1.42.35-2.11V8.05H2.18C1.43 9.55 1 11.22 1 12s.43 2.45 1.18 3.95l3.66-2.84z" />
              <path fill="#EA4335" d="M12 4.69c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 1.19 14.97 0 12 0 7.7 0 3.99 2.47 2.18 5.95l3.66 2.84c.87-2.6 3.3-4.1 6.16-4.1z" />
            </svg>
          )}
          <span className="text-[17px]">{googleLoading ? 'Connecting...' : 'Continue with Google'}</span>
        </button>
        
        <div className="mt-8 text-center">
          <p className="text-xs text-slate-400 dark:text-slate-500">
            By continuing, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
`;

fs.writeFileSync('src/components/Login.tsx', code);
console.log("Login.tsx rewritten to use only Google Sign In");
