import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase/config';
import { doc, setDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { updateProfile } from 'firebase/auth';
import { motion } from 'motion/react';
import { User, Check, Loader2, AlertCircle, Camera } from 'lucide-react';

export default function CompleteProfile() {
  const { user, userProfile, refreshProfile } = useAuth();
  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkUsernameExists = async (username: string) => {
    const q = query(collection(db, 'users'), where('username', '==', username));
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setError(null);
    setLoading(true);

    try {
      const cleanUsername = username.trim().toLowerCase();
      
      // Basic validation
      if (cleanUsername.length < 3 || cleanUsername.length > 20) {
        throw new Error('Username must be between 3 and 20 characters.');
      }
      if (!/^[a-zA-Z0-9_.]+$/.test(cleanUsername)) {
        throw new Error('Username can only contain letters, numbers, underscores, and periods.');
      }

      // Check uniqueness
      const exists = await checkUsernameExists(cleanUsername);
      if (exists) {
        throw new Error('This username is already taken. Please choose another one.');
      }

      // Update auth profile if display name changed
      if (displayName && displayName !== user.displayName) {
        await updateProfile(user, { displayName });
      }

      // Save to Firestore
      const userRef = doc(db, 'users', user.uid);
      await setDoc(userRef, {
        username: cleanUsername,
        name: displayName || userProfile?.name || '',
      }, { merge: true });

      // Refresh context
      await refreshProfile();
      
    } catch (err: any) {
      setError(err.message || 'Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[100dvh] bg-slate-50 dark:bg-slate-900 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-xl border border-slate-100 dark:border-slate-700"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <User size={32} />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Complete Your Profile</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm">Choose a unique username to personalize your Zetadu experience.</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl flex items-start gap-3 text-sm">
            <AlertCircle size={18} className="shrink-0 mt-0.5" />
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="flex justify-center mb-6">
            <div className="relative">
              {user?.photoURL ? (
                <img src={user.photoURL} alt="Profile" className="w-24 h-24 rounded-full border-4 border-slate-50 dark:border-slate-700 object-cover" />
              ) : (
                <div className="w-24 h-24 rounded-full border-4 border-slate-50 dark:border-slate-700 bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-3xl font-bold text-white">
                  {displayName ? displayName.charAt(0).toUpperCase() : user?.email?.charAt(0).toUpperCase() || 'U'}
                </div>
              )}
              {/* Optional: Add camera icon for future avatar upload implementation */}
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">
              Username <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">@</span>
              <input 
                type="text" 
                required
                value={username}
                onChange={(e) => setUsername(e.target.value.replace(/[^a-zA-Z0-9_.]/g, ''))}
                placeholder="e.g. smart_student_24"
                className="w-full pl-9 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-slate-800 dark:text-white"
              />
            </div>
            <p className="text-xs text-slate-500 mt-1.5">3-20 characters. Letters, numbers, underscores, and periods.</p>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Display Name (Optional)</label>
            <input 
              type="text" 
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Your full name or nickname"
              className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-slate-800 dark:text-white"
            />
          </div>

          <button 
            type="submit" 
            disabled={loading || !username.trim()}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl transition-colors disabled:opacity-50 disabled:hover:bg-blue-600 flex items-center justify-center gap-2 mt-2"
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <span>Complete Profile</span>
                <Check size={18} />
              </>
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
