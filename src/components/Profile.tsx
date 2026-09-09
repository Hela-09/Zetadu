import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getLevelInfo } from '../lib/achievements';
import { motion, AnimatePresence } from 'motion/react';
import { User, Award, Trophy, Target, Flame, CheckCircle, Clock, BookOpen, Search, BrainCircuit, PenTool, MessageSquare, Settings, HelpCircle, Info, LogOut, ChevronRight, Bookmark, FileText, Download, Moon, Sun, Monitor, Bell, Shield, Trash2, Edit3, Image as ImageIcon, MapPin, GraduationCap, ArrowLeft, Camera, Check, X, AlertCircle, Phone, Mail, Copy, CheckCircle2, ShieldAlert } from 'lucide-react';
import { collection, query, where, getDocs, doc, setDoc, getDoc } from 'firebase/firestore';
import { updateProfile } from 'firebase/auth';
import { db } from '../lib/firebase';
import { ViewType } from '../types';

interface ProfileProps {
  setView: (view: ViewType) => void;
}

export default function Profile({ setView }: ProfileProps) {
  const { user, userProfile, refreshProfile, settings, updateSettings, isSuperAdmin, signOut } = useAuth();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  React.useEffect(() => {
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
    }
  };

  const [activeSection, setActiveSection] = useState<string | null>(null);
  
  // Stats state
  const [stats, setStats] = useState({
    studyTime: '0h',
    subjectsStudied: 0,
    practiceSessions: 0,
    avgScore: '0%',
    tutorSessions: 0,
    notesCreated: 0,
    bookmarks: 0,
    streak: 0,
    questionsAnswered: 0,
    correctAnswers: 0
  });

  const memberSince = user?.metadata.creationTime ? new Date(user.metadata.creationTime).toLocaleDateString(undefined, { month: 'long', year: 'numeric' }) : 'Recently';

  useEffect(() => {
    const fetchStats = async () => {
      if (!user) return;
      try {
        const learningDataRef = collection(db, 'learning_data');
        const q = query(learningDataRef, where('uid', '==', user.uid));
        const querySnapshot = await getDocs(q);
        
        let tQuestions = 0;
        let tScore = 0;
        let pSessions = 0;
        const subjects = new Set();

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          tQuestions += data.totalQuestions || 0;
          tScore += data.score || 0;
          pSessions++;
          if (data.subjectId) subjects.add(data.subjectId);
        });
        
        let avg = '0%';
        if (tQuestions > 0) {
          avg = Math.round((tScore / tQuestions) * 100) + '%';
        }
        
        // Check tutor sessions
        let tSess = 0;
        const tutorSnap = await getDoc(doc(db, 'tutor_sessions', user.uid));
        if (tutorSnap.exists()) {
          tSess = 1; // Simplified count
        }
        
        setStats({
          studyTime: Math.max(1, Math.round(pSessions * 0.5)) + 'h',
          subjectsStudied: subjects.size,
          practiceSessions: pSessions,
          avgScore: avg,
          tutorSessions: tSess,
          notesCreated: 0, // Mock for now
          bookmarks: 0, // Mock for now
          streak: pSessions > 0 ? 1 : 0,
          questionsAnswered: tQuestions,
          correctAnswers: tScore
        });
        
      } catch (e) {
        console.warn("Failed to fetch profile stats");
      }
    };
    fetchStats();
  }, [user]);

  const handleAction = (action: string) => {
    setActiveSection(action);
    window.scrollTo(0, 0);
  };

  const SectionHeading = ({ children }: { children: React.ReactNode }) => (
    <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4 mt-8">{children}</h3>
  );

  const ActionRow = ({ icon: Icon, title, value, onClick, danger = false }: any) => (
    <button 
      onClick={onClick}
      className={`w-full flex items-center justify-between p-4 bg-white dark:bg-slate-800 border-b border-slate-100 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors first:rounded-t-2xl last:rounded-b-2xl last:border-b-0 ${danger ? 'text-red-600' : 'text-slate-700 dark:text-slate-200'}`}
    >
      <div className="flex items-center gap-3">
        <Icon size={20} className={danger ? 'text-red-500' : 'text-slate-400 dark:text-slate-500'} />
        <span className="font-medium text-left">{title}</span>
      </div>
      <div className="flex items-center gap-2">
        {value && <span className="text-sm text-slate-500 dark:text-slate-400">{value}</span>}
        <ChevronRight size={18} className="text-slate-300 dark:text-slate-600" />
      </div>
    </button>
  );

  const StatCard = ({ icon: Icon, title, value }: any) => (
    <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-100 dark:border-slate-700/50 flex flex-col items-center justify-center text-center">
      <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-2">
        <Icon size={20} />
      </div>
      <p className="text-2xl font-bold text-slate-800 dark:text-white mb-1">{value}</p>
      <p className="text-xs text-slate-500 font-medium">{title}</p>
    </div>
  );

  // --- Subviews ---

  const EditProfileView = () => {
    const [name, setName] = useState(userProfile?.name || user?.displayName || '');
    const [username, setUsername] = useState(userProfile?.username || '');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const checkUsernameExists = async (usernameToCheck: string) => {
      const q = query(collection(db, 'users'), where('username', '==', usernameToCheck));
      const querySnapshot = await getDocs(q);
      // Ensure we don't count the current user's document
      let exists = false;
      querySnapshot.forEach((docSnap) => {
        if (docSnap.id !== user?.uid) {
          exists = true;
        }
      });
      return exists;
    };

    const handleSave = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!user) return;
      setLoading(true);
      setError(null);
      try {
        const cleanUsername = username.trim().toLowerCase();
        
        if (cleanUsername.length < 3 || cleanUsername.length > 20) {
          throw new Error('Username must be between 3 and 20 characters.');
        }
        if (!/^[a-zA-Z0-9_.]+$/.test(cleanUsername)) {
          throw new Error('Username can only contain letters, numbers, underscores, and periods.');
        }

        const exists = await checkUsernameExists(cleanUsername);
        if (exists) {
          throw new Error('This username is already taken.');
        }

        if (name !== user.displayName) {
          await updateProfile(user, { displayName: name });
        }
        await setDoc(doc(db, 'users', user.uid), { name, username: cleanUsername }, { merge: true });
        
        if (refreshProfile) await refreshProfile();
        
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      } catch (err: any) {
        setError(err.message || "Failed to update profile");
        console.warn("Failed to update profile", err);
      }
      setLoading(false);
    };

    return (
      <div className="animate-in fade-in slide-in-from-right-4 duration-300">
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => setActiveSection(null)} className="p-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
            <ArrowLeft size={20} />
          </button>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Edit Profile</h2>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 p-6">
          <div className="flex justify-center mb-8">
            <div className="relative">
              {user?.photoURL ? (
                <img src={user.photoURL} alt="Profile" className="w-24 h-24 rounded-full border-4 border-slate-50 dark:border-slate-700 object-cover" />
              ) : (
                <div className="w-24 h-24 rounded-full border-4 border-slate-50 dark:border-slate-700 bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-3xl font-bold text-white">
                  {user?.displayName ? user.displayName.charAt(0).toUpperCase() : user?.email?.charAt(0).toUpperCase() || 'U'}
                </div>
              )}
              <button className="absolute bottom-0 right-0 p-2 bg-blue-600 text-white rounded-full shadow-lg border-2 border-white dark:border-slate-800 hover:bg-blue-700 transition-colors">
                <Camera size={16} />
              </button>
            </div>
          </div>
          {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl flex items-start gap-3 text-sm">
              <AlertCircle size={18} className="shrink-0 mt-0.5" />
              <p>{error}</p>
            </div>
          )}
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Username</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">@</span>
                <input 
                  type="text" 
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value.replace(/[^a-zA-Z0-9_.]/g, ''))}
                  className="w-full pl-9 pr-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all no-spinners" 
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email Address</label>
              <input type="email" value={user?.email || ''} disabled className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-500 dark:text-slate-400 cursor-not-allowed" />
              <p className="text-xs text-slate-500 mt-1">Email cannot be changed.</p>
            </div>
            <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl mt-4 hover:bg-blue-700 transition-colors disabled:opacity-50">
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
            {success && (
              <p className="text-emerald-600 text-sm text-center font-medium flex items-center justify-center gap-2 mt-2">
                <Check size={16} /> Profile updated successfully
              </p>
            )}
          </form>
        </div>
      </div>
    );
  };

  const SettingsView = () => {
    const { settings, updateSettings, userProfile, user, refreshProfile } = useAuth();
    
    const handleClearCache = () => {
      localStorage.clear();
      alert("Local cache cleared successfully.");
      window.location.reload();
    };

    const handleProfileUpdate = async (field: string, value: string) => {
      if (!user) return;
      try {
        await setDoc(doc(db, 'users', user.uid), { [field]: value }, { merge: true });
        if (refreshProfile) await refreshProfile();
      } catch (err) {
        console.error("Failed to update profile", err);
      }
    };

    return (
      <div className="animate-in fade-in slide-in-from-right-4 duration-300">
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => setActiveSection(null)} className="p-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
            <ArrowLeft size={20} />
          </button>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">General Settings & Preferences</h2>
        </div>
        
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 overflow-hidden">
            <div className="p-4 border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
              <h3 className="font-bold text-slate-800 dark:text-white">Appearance & Display</h3>
            </div>
            


            {/* Font Size */}
            <div className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <p className="font-medium text-slate-800 dark:text-white">Font Size</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Adjust the text size across the app</p>
              </div>
              <select 
                value={settings?.fontSize || 'medium'} 
                onChange={(e) => updateSettings({ fontSize: e.target.value as any })}
                className="bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl px-3 py-2 text-slate-800 dark:text-white outline-none"
              >
                <option value="small">Small</option>
                <option value="medium">Medium</option>
                <option value="large">Large</option>
              </select>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 overflow-hidden">
            <div className="p-4 border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
              <h3 className="font-bold text-slate-800 dark:text-white">Study Preferences</h3>
            </div>
            
            {/* Education Level */}
            <div className="p-4 flex flex-col md:flex-row md:items-center justify-between border-b border-slate-100 dark:border-slate-700 gap-4">
              <div>
                <p className="font-medium text-slate-800 dark:text-white">Education Level</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Tailors content to your academic level</p>
              </div>
              <select 
                value={userProfile?.educationLevel || 'Secondary'} 
                onChange={(e) => handleProfileUpdate('educationLevel', e.target.value)}
                className="bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl px-3 py-2 text-slate-800 dark:text-white outline-none"
              >
                <option value="Primary">Primary</option>
                <option value="Secondary">Secondary</option>
                <option value="University">University</option>
                <option value="Professional">Professional</option>
              </select>
            </div>

            {/* Default Practice Difficulty */}
            <div className="p-4 flex flex-col md:flex-row md:items-center justify-between border-b border-slate-100 dark:border-slate-700 gap-4">
              <div>
                <p className="font-medium text-slate-800 dark:text-white">Default Practice Difficulty</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Standard difficulty for practice tests</p>
              </div>
              <select 
                value={settings?.defaultPracticeDifficulty || 'Medium'} 
                onChange={(e) => updateSettings({ defaultPracticeDifficulty: e.target.value as any })}
                className="bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl px-3 py-2 text-slate-800 dark:text-white outline-none"
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
                <option value="Mixed">Mixed</option>
              </select>
            </div>

            {/* AI Tutor Tone */}
            <div className="p-4 flex flex-col md:flex-row md:items-center justify-between border-b border-slate-100 dark:border-slate-700 gap-4">
              <div>
                <p className="font-medium text-slate-800 dark:text-white">AI Tutor Tone</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">How the AI interacts with you</p>
              </div>
              <select 
                value={settings?.aiTutorTone || 'Friendly'} 
                onChange={(e) => updateSettings({ aiTutorTone: e.target.value as any })}
                className="bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl px-3 py-2 text-slate-800 dark:text-white outline-none"
              >
                <option value="Friendly">Friendly</option>
                <option value="Direct">Direct</option>
                <option value="Socratic">Socratic (Guides you to answers)</option>
              </select>
            </div>

            {/* Country */}
            <div className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <p className="font-medium text-slate-800 dark:text-white">Country</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Adjusts curriculum standards</p>
              </div>
              <select 
                value={userProfile?.country || 'International'} 
                onChange={(e) => handleProfileUpdate('country', e.target.value)}
                className="bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl px-3 py-2 text-slate-800 dark:text-white outline-none"
              >
                <option value="International">International</option>
                <option value="US">United States</option>
                <option value="UK">United Kingdom</option>
                <option value="Nigeria">Nigeria</option>
                <option value="India">India</option>
              </select>
            </div>
          </div>
          
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 overflow-hidden">
            <div className="p-4 border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
              <h3 className="font-bold text-slate-800 dark:text-white">Data Management</h3>
            </div>
            <button onClick={handleClearCache} className="w-full p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors text-left">
              <div>
                <p className="font-medium text-slate-800 dark:text-white">Clear Cache</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Free up local storage without losing account data</p>
              </div>
              <Trash2 size={18} className="text-slate-400" />
            </button>
          </div>
        </div>
      </div>
    );
  };
  
  const SavedContentView = () => {
    return (
      <div className="animate-in fade-in slide-in-from-right-4 duration-300">
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => setActiveSection(null)} className="p-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
            <ArrowLeft size={20} />
          </button>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Saved Content</h2>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 p-8 text-center">
          <Bookmark size={48} className="mx-auto text-blue-500 mb-4 opacity-50" />
          <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Your library is empty</h3>
          <p className="text-slate-500 mb-6">You haven't saved any questions, notes, or lessons yet.</p>
          <button onClick={() => { setActiveSection(null); setView('subjects'); }} className="bg-blue-600 text-white font-bold py-2.5 px-6 rounded-xl hover:bg-blue-700 transition-colors">
            Browse Subjects
          </button>
        </div>
      </div>
    );
  };
  
  
  const AchievementsView = () => {
    return (
      <div className="animate-in fade-in duration-300">
        <div className="flex items-center gap-4 mb-6">
          <button onClick={() => setActiveSection(null)} className="p-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
            <ArrowLeft size={20} />
          </button>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Achievements</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-4 p-4 bg-white dark:bg-slate-800 border border-amber-200 dark:border-amber-900/50 rounded-2xl shadow-sm relative overflow-hidden">
             <div className="absolute top-0 right-0 p-2 opacity-10"><Award size={64} className="text-amber-500"/></div>
             <div className="w-14 h-14 rounded-full bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center text-2xl relative z-10 shrink-0">🏆</div>
             <div className="relative z-10">
               <h4 className="font-bold text-slate-900 dark:text-white text-lg">First Practice</h4>
               <p className="text-sm text-slate-500">Completed your first quiz session</p>
               <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider mt-1 block">Unlocked</span>
             </div>
          </div>
          <div className="flex items-center gap-4 p-4 bg-white dark:bg-slate-800 border border-orange-200 dark:border-orange-900/50 rounded-2xl shadow-sm relative overflow-hidden">
             <div className="absolute top-0 right-0 p-2 opacity-10"><Flame size={64} className="text-orange-500"/></div>
             <div className="w-14 h-14 rounded-full bg-orange-100 dark:bg-orange-900/40 flex items-center justify-center text-2xl relative z-10 shrink-0">🔥</div>
             <div className="relative z-10">
               <h4 className="font-bold text-slate-900 dark:text-white text-lg">7-Day Streak</h4>
               <p className="text-sm text-slate-500">Studied for 7 consecutive days</p>
               <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider mt-1 block">Unlocked</span>
             </div>
          </div>
          <div className="flex items-center gap-4 p-4 bg-white dark:bg-slate-800 border border-blue-200 dark:border-blue-900/50 rounded-2xl shadow-sm relative overflow-hidden">
             <div className="absolute top-0 right-0 p-2 opacity-10"><BrainCircuit size={64} className="text-blue-500"/></div>
             <div className="w-14 h-14 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center text-2xl relative z-10 shrink-0">🧠</div>
             <div className="relative z-10">
               <h4 className="font-bold text-slate-900 dark:text-white text-lg">Master Mind</h4>
               <p className="text-sm text-slate-500">Scored 90%+ in 3 practice sessions</p>
               <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full mt-2">
                 <div className="h-full bg-blue-500 rounded-full w-2/3"></div>
               </div>
               <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1 block">2 / 3 Completed</span>
             </div>
          </div>
          <div className="flex items-center gap-4 p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm relative overflow-hidden opacity-60 grayscale hover:grayscale-0 transition-all cursor-not-allowed">
             <div className="w-14 h-14 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-2xl relative z-10 shrink-0">⚡</div>
             <div className="relative z-10">
               <h4 className="font-bold text-slate-900 dark:text-white text-lg">Daily Challenger</h4>
               <p className="text-sm text-slate-500">Complete 10 Daily Challenges</p>
               <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1 block">Locked</span>
             </div>
          </div>
        </div>
      </div>
    );
  };


  const StatsView = () => {
    return (
      <div className="animate-in fade-in slide-in-from-right-4 duration-300">
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => setActiveSection(null)} className="p-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
            <ArrowLeft size={20} />
          </button>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Detailed Statistics</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <StatCard icon={BrainCircuit} title="Questions Answered" value={stats.questionsAnswered} />
          <StatCard icon={Check} title="Correct Answers" value={stats.correctAnswers} />
          <StatCard icon={X} title="Incorrect Answers" value={stats.questionsAnswered - stats.correctAnswers} />
          <StatCard icon={Award} title="Average Score" value={stats.avgScore} />
          <StatCard icon={Clock} title="Total Study Hours" value={stats.studyTime} />
          <StatCard icon={BookOpen} title="Subjects Studied" value={stats.subjectsStudied} />
          <StatCard icon={PenTool} title="Practice Sessions" value={stats.practiceSessions} />
          <StatCard icon={MessageSquare} title="AI Sessions" value={stats.tutorSessions} />
          <StatCard icon={Award} title="Learning Streak" value={stats.streak + ' Days'} />
        </div>
      </div>
    );
  };
  
  const SupportView = () => {
    const [copied, setCopied] = useState<string | null>(null);
    const [faqOpen, setFaqOpen] = useState<number | null>(null);

    const handleCopy = (text: string, type: string) => {
      navigator.clipboard.writeText(text);
      setCopied(type);
      setTimeout(() => setCopied(null), 2000);
    };

    const handlePhoneCall = () => {
      window.location.href = "tel:08100272572";
    };

    const handleEmail = (subject: string = "Zetadu Support Request") => {
      window.location.href = `mailto:emmanuelomojola07@gmail.com?subject=${encodeURIComponent(subject)}`;
    };

    const faqs = [
      { q: "How does the AI Tutor work?", a: "The AI Tutor acts as your personal learning assistant. It adapts to your learning level and answers questions step-by-step without simply giving away the final answer." },
      { q: "How is my progress saved?", a: "Your progress is automatically saved to the cloud whenever you complete a practice session or interact with the AI Tutor, allowing you to pick up where you left off." },
      { q: "Can I use Zetadu offline?", a: "Currently, Zetadu requires an active internet connection to communicate with the AI Tutor and sync your progress securely." },
    ];

    return (
      <div className="animate-in fade-in slide-in-from-right-4 duration-300">
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => setActiveSection(null)} className="p-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
            <ArrowLeft size={20} />
          </button>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Help & Support</h2>
        </div>
        
        <div className="space-y-6">
          {/* Contact Support */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 overflow-hidden">
            <div className="p-4 border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 flex items-center gap-2">
              <MessageSquare size={18} className="text-blue-600" />
              <h3 className="font-bold text-slate-800 dark:text-white">Contact Support</h3>
            </div>
            
            <div className="p-5 space-y-4">
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                Need help? Reach out to us directly through phone or email. We typically respond within 24 hours.
              </p>

              {/* Phone */}
              <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-700">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 flex items-center justify-center shrink-0">
                    <Phone size={18} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-0.5">Support Phone</p>
                    <button onClick={handlePhoneCall} className="font-bold text-slate-800 dark:text-white hover:text-blue-600 transition-colors text-left">
                      08100272572
                    </button>
                  </div>
                </div>
                <button 
                  onClick={() => handleCopy("08100272572", "phone")}
                  className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-slate-800 rounded-lg transition-colors"
                  aria-label="Copy phone number"
                >
                  {copied === "phone" ? <CheckCircle2 size={18} className="text-emerald-500" /> : <Copy size={18} />}
                </button>
              </div>

              {/* Email */}
              <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-700">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 flex items-center justify-center shrink-0">
                    <Mail size={18} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-0.5">Support Email</p>
                    <button onClick={() => handleEmail()} className="font-bold text-slate-800 dark:text-white hover:text-indigo-600 transition-colors text-left truncate max-w-[150px] sm:max-w-none">
                      emmanuelomojola07@gmail.com
                    </button>
                  </div>
                </div>
                <button 
                  onClick={() => handleCopy("emmanuelomojola07@gmail.com", "email")}
                  className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-slate-800 rounded-lg transition-colors shrink-0"
                  aria-label="Copy email address"
                >
                  {copied === "email" ? <CheckCircle2 size={18} className="text-emerald-500" /> : <Copy size={18} />}
                </button>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 overflow-hidden">
             <button onClick={() => handleEmail("Bug Report: Zetadu")} className="w-full p-4 flex items-center justify-between border-b border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors text-left">
              <div className="flex items-center gap-3">
                <AlertCircle size={20} className="text-amber-500" />
                <span className="font-medium text-slate-800 dark:text-white">Report a Bug</span>
              </div>
              <ChevronRight size={18} className="text-slate-400" />
            </button>
            <button onClick={() => handleEmail("Feedback: Zetadu")} className="w-full p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors text-left">
              <div className="flex items-center gap-3">
                <Info size={20} className="text-emerald-500" />
                <span className="font-medium text-slate-800 dark:text-white">Send Feedback</span>
              </div>
              <ChevronRight size={18} className="text-slate-400" />
            </button>
          </div>

          {/* FAQ */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 overflow-hidden">
            <div className="p-4 border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 flex items-center gap-2">
              <HelpCircle size={18} className="text-purple-600" />
              <h3 className="font-bold text-slate-800 dark:text-white">Frequently Asked Questions</h3>
            </div>
            <div className="divide-y divide-slate-100 dark:divide-slate-700">
              {faqs.map((faq, i) => (
                <div key={i} className="p-1">
                  <button 
                    onClick={() => setFaqOpen(faqOpen === i ? null : i)}
                    className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-50 dark:hover:bg-slate-750/50 rounded-xl transition-colors"
                  >
                    <span className="font-medium text-slate-800 dark:text-white">{faq.q}</span>
                    <ChevronRight size={18} className={`text-slate-400 transition-transform duration-200 ${faqOpen === i ? 'rotate-90' : ''}`} />
                  </button>
                  <AnimatePresence>
                    {faqOpen === i && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <p className="p-4 pt-0 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                          {faq.a}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const TutorHistoryView = () => {
    const [history, setHistory] = useState<any[]>([]);
    const [search, setSearch] = useState('');
    
    useEffect(() => {
       const load = async () => {
          if (!user) return;
          const q = query(collection(db, 'tutor_conversations'), where('uid', '==', user.uid));
          const snap = await getDocs(q);
          const items: any[] = [];
          snap.forEach(d => items.push({ id: d.id, ...d.data() }));
          items.sort((a, b) => b.updatedAt - a.updatedAt);
          setHistory(items);
       };
       load();
    }, []);
    
    const handleDelete = async (id: string) => {
       if (window.confirm('Delete this conversation?')) {
          await import('firebase/firestore').then(async (firestore) => {
             await firestore.deleteDoc(firestore.doc(db, 'tutor_conversations', id));
          });
          setHistory(prev => prev.filter(h => h.id !== id));
       }
    };
    
    const filtered = history.filter(h => h.title?.toLowerCase().includes(search.toLowerCase()) || h.subject?.toLowerCase().includes(search.toLowerCase()));

    return (
      <div className="animate-in fade-in duration-300">
        <div className="flex items-center gap-4 mb-6">
          <button onClick={() => setActiveSection(null)} className="p-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
            <ArrowLeft size={20} />
          </button>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">AI Tutor History</h2>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 p-6 mb-6">
           <div className="relative mb-6">
             <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
             <input 
               type="text" 
               placeholder="Search conversations..." 
               value={search}
               onChange={(e) => setSearch(e.target.value)}
               className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-blue-500 transition-colors dark:text-white no-spinners"
             />
           </div>
           <div className="space-y-3">
             {filtered.length > 0 ? filtered.map(item => (
                <div key={item.id} className="flex flex-col sm:flex-row items-center justify-between p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-700">
                   <div className="flex-1 min-w-0 mb-3 sm:mb-0 text-left w-full">
                      <h4 className="font-bold text-slate-900 dark:text-white truncate">{item.title}</h4>
                      <p className="text-sm text-slate-500">{item.subject} • {new Date(item.updatedAt).toLocaleDateString()}</p>
                   </div>
                   <div className="flex items-center gap-2 w-full sm:w-auto">
                      <button onClick={() => { localStorage.setItem('tutor_active_conv', item.id); setView('tutor'); }} className="flex-1 sm:flex-none px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors">Open</button>
                      <button onClick={() => handleDelete(item.id)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"><Trash2 size={18} /></button>
                   </div>
                </div>
             )) : (
                <div className="text-center p-6 text-slate-500">No conversations found.</div>
             )}
           </div>
        </div>
      </div>
    );
  };

  const SubjectHistoryView = () => {
    const [history, setHistory] = useState<any[]>([]);
    const [search, setSearch] = useState('');
    
    useEffect(() => {
       const load = async () => {
          if (!user) return;
          const q = query(collection(db, 'subject_history'), where('uid', '==', user.uid));
          const snap = await getDocs(q);
          const items: any[] = [];
          snap.forEach(d => items.push({ id: d.id, ...d.data() }));
          items.sort((a, b) => b.lastOpened - a.lastOpened);
          setHistory(items);
       };
       load();
    }, []);
    
    const handleDelete = async (id: string) => {
       if (window.confirm('Delete this history record?')) {
          await import('firebase/firestore').then(async (firestore) => {
             await firestore.deleteDoc(firestore.doc(db, 'subject_history', id));
          });
          setHistory(prev => prev.filter(h => h.id !== id));
       }
    };
    
    const filtered = history.filter(h => h.name?.toLowerCase().includes(search.toLowerCase()) || h.category?.toLowerCase().includes(search.toLowerCase()));

    return (
      <div className="animate-in fade-in duration-300">
        <div className="flex items-center gap-4 mb-6">
          <button onClick={() => setActiveSection(null)} className="p-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
            <ArrowLeft size={20} />
          </button>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Recently Studied Subjects</h2>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 p-6 mb-6">
           <div className="relative mb-6">
             <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
             <input 
               type="text" 
               placeholder="Search subjects..." 
               value={search}
               onChange={(e) => setSearch(e.target.value)}
               className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-blue-500 transition-colors dark:text-white no-spinners"
             />
           </div>
           <div className="space-y-3">
             {filtered.length > 0 ? filtered.map(item => (
                <div key={item.id} className="flex flex-col sm:flex-row items-center justify-between p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-700">
                   <div className="flex-1 min-w-0 mb-3 sm:mb-0 text-left w-full">
                      <h4 className="font-bold text-slate-900 dark:text-white truncate">{item.name}</h4>
                      <p className="text-sm text-slate-500">{item.category} • Last studied: {new Date(item.lastOpened).toLocaleDateString()}</p>
                   </div>
                   <div className="flex items-center gap-2 w-full sm:w-auto">
                      <button onClick={() => { localStorage.setItem('zetadu_target_subject_id', item.subjectId || item.subject || ''); setView('subjects'); }} className="flex-1 sm:flex-none px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors">Open</button>
                      <button onClick={() => handleDelete(item.id)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"><Trash2 size={18} /></button>
                   </div>
                </div>
             )) : (
                <div className="text-center p-6 text-slate-500">No subjects found.</div>
             )}
           </div>
        </div>
      </div>
    );
  };

// --- Main View ---

  if (activeSection === 'edit_profile') return <EditProfileView />;
  if (activeSection === 'settings') return <SettingsView />;
  if (activeSection === 'saved') return <SavedContentView />;
  if (activeSection === 'stats') return <StatsView />;
  if (activeSection === 'support') return <SupportView />;
  if (activeSection === 'tutor_history') return <TutorHistoryView />;
  if (activeSection === 'subject_history') return <SubjectHistoryView />;

  return (
    <div className="max-w-3xl mx-auto w-full pb-16 sm:pb-20 animate-in fade-in duration-300">
      {/* Header Profile Section */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 md:p-8 border border-slate-100 dark:border-slate-700/50 shadow-sm flex flex-col md:flex-row items-center gap-6 mb-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-10"></div>
        
        <div className="relative z-10">
          {user?.photoURL ? (
            <img src={user.photoURL} alt="Profile" className="w-24 h-24 rounded-full border-4 border-white dark:border-slate-800 shadow-md object-cover" />
          ) : (
            <div className="w-24 h-24 rounded-full border-4 border-white dark:border-slate-800 shadow-md bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-3xl font-bold text-white">
              {user?.displayName ? user.displayName.charAt(0).toUpperCase() : user?.email?.charAt(0).toUpperCase() || 'U'}
            </div>
          )}
        </div>
        
        <div className="text-center md:text-left flex-1 relative z-10 w-full">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-1">{userProfile?.name || user?.displayName || 'Student'}</h2>
              <p className="text-slate-500 mb-1">@{userProfile?.username || 'student'}</p>
              <p className="text-xs text-slate-400 mb-4">{user?.email}</p>
            </div>
            
            <div className="flex items-center justify-center gap-3">
              <div className="flex flex-col items-center bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800/50 rounded-xl px-4 py-2">
                <span className="text-[10px] font-bold text-blue-500 uppercase tracking-wider">Level</span>
                <span className="text-xl font-black text-blue-700 dark:text-blue-400">{getLevelInfo(userProfile?.xp || 0).level}</span>
              </div>
              <div className="flex flex-col items-center bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-100 dark:border-emerald-800/50 rounded-xl px-4 py-2">
                <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider">XP</span>
                <span className="text-xl font-black text-emerald-700 dark:text-emerald-400">{userProfile?.xp || 0}</span>
              </div>
              <div className="flex flex-col items-center bg-orange-50 dark:bg-orange-900/30 border border-orange-100 dark:border-orange-800/50 rounded-xl px-4 py-2">
                <span className="text-[10px] font-bold text-orange-500 uppercase tracking-wider">Streak</span>
                <span className="text-xl font-black text-orange-700 dark:text-orange-400">{userProfile?.streak || 0}🔥</span>
              </div>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm text-slate-600 dark:text-slate-400 mt-4 md:mt-0">
            <div className="flex items-center gap-1.5"><Clock size={16} /> Member since {memberSince}</div>
            <div className="flex items-center gap-1.5"><MapPin size={16} /> International</div>
            <div className="flex items-center gap-1.5"><GraduationCap size={16} /> Secondary</div>
          </div>
        </div>
        
        <button onClick={() => handleAction('edit_profile')} className="relative z-10 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 px-4 py-2 rounded-xl font-bold text-sm transition-colors flex items-center gap-2 border border-slate-200 dark:border-slate-600 shadow-sm">
          <Edit3 size={16} />
          Edit Profile
        </button>
      </div>

      <SectionHeading>Learning Statistics</SectionHeading>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8" onClick={() => handleAction('stats')} style={{ cursor: 'pointer' }}>
        <StatCard icon={Clock} title="Total Study Time" value={stats.studyTime} />
        <StatCard icon={BookOpen} title="Subjects Studied" value={stats.subjectsStudied} />
        <StatCard icon={BrainCircuit} title="Practice Sessions" value={stats.practiceSessions} />
        <StatCard icon={Award} title="Average Score" value={stats.avgScore} />
      </div>

      
      {/* Achievements Section */}
      {userProfile?.achievements && userProfile.achievements.length > 0 && (
         <div className="mb-8">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4 px-2">Recent Achievements</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {userProfile.achievements.map((ach: any) => {
                 let Icon = Trophy;
                 if (ach.icon === 'Flame') Icon = Flame;
                 if (ach.icon === 'Target') Icon = Target;
                 if (ach.icon === 'CheckCircle') Icon = CheckCircle;
                 
                 return (
                   <div key={ach.id} className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-yellow-100 dark:border-yellow-900/30 flex flex-col items-center text-center shadow-sm relative overflow-hidden">
                     <div className="absolute top-0 right-0 w-16 h-16 bg-yellow-400 opacity-5 rounded-bl-[100px]"></div>
                     <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/40 text-yellow-600 dark:text-yellow-400 rounded-full flex items-center justify-center mb-3">
                        <Icon size={24} />
                     </div>
                     <h4 className="font-bold text-sm text-slate-800 dark:text-white mb-1">{ach.title}</h4>
                     <p className="text-[10px] text-slate-500">{ach.description}</p>
                   </div>
                 );
              })}
            </div>
         </div>
      )}

      <SectionHeading>My Learning & Content</SectionHeading>
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700/50 shadow-sm flex flex-col mb-8">
        <ActionRow icon={Award} title="Detailed Progress & Statistics" onClick={() => handleAction('stats')} />
        <ActionRow icon={BookOpen} title="Subjects & Curriculum" onClick={() => { window.scrollTo(0, 0); setView('subjects'); }} />
        <ActionRow icon={Clock} title="Recently Studied Subjects" onClick={() => handleAction('subject_history')} />
        <ActionRow icon={BrainCircuit} title="Practice History" onClick={() => { window.scrollTo(0, 0); setView('practice'); }} />
        <ActionRow icon={MessageSquare} title="AI Tutor History" onClick={() => handleAction('tutor_history')} />
        <ActionRow icon={Bookmark} title="Saved Content & Notes" onClick={() => handleAction('saved')} />
      </div>

      {isSuperAdmin && (
        <>
          <SectionHeading>Admin Tools</SectionHeading>
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-red-100 dark:border-red-900/30 shadow-sm flex flex-col mb-8 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-2 h-full bg-red-500"></div>
            <ActionRow icon={ShieldAlert} title="Super Admin Dashboard" value="Manage Users & Content" onClick={() => { window.scrollTo(0, 0); setView('admin'); }} />
          </div>
        </>
      )}

      <SectionHeading>Settings</SectionHeading>
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700/50 shadow-sm flex flex-col mb-8">
        <ActionRow icon={Settings} title="General Settings & Preferences" value="Font Size, Study Preferences" onClick={() => handleAction('settings')} />
      </div>

      <SectionHeading>Help & Support</SectionHeading>
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700/50 shadow-sm flex flex-col mb-12">
        <ActionRow icon={HelpCircle} title="Help Center & Support" onClick={() => handleAction('support')} />
      </div>

      {/* Logout Section */}
      <div className="flex justify-center mb-8">
        {!showLogoutConfirm ? (
          <>
            {deferredPrompt && (
              <button 
                onClick={handleInstallClick}
                className="flex items-center gap-2 px-6 py-3 rounded-xl text-blue-600 dark:text-blue-400 font-semibold hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors w-full justify-center md:w-auto"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                Install Zetadu
              </button>
            )}
            <button 
              onClick={() => setShowLogoutConfirm(true)}
              className="flex items-center gap-2 px-6 py-3 rounded-xl text-red-600 font-semibold hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors w-full justify-center md:w-auto"
            >
              <LogOut size={20} />
              Log Out
            </button>
          </>
        ) : (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-6 rounded-2xl shadow-lg w-full max-w-sm text-center"
          >
            <h4 className="text-lg font-bold text-slate-800 dark:text-white mb-2">Are you sure you want to log out?</h4>
            <p className="text-slate-500 text-sm mb-6">You will need to sign in again to access your progress.</p>
            <div className="flex gap-3 justify-center">
              <button 
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 py-2.5 px-4 rounded-xl font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={signOut}
                className="flex-1 py-2.5 px-4 rounded-xl font-semibold text-white bg-red-600 hover:bg-red-700 transition-colors"
              >
                Log Out
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
