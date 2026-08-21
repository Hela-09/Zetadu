#!/bin/bash
cat << 'INNER_EOF' > src/components/Profile.tsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { motion, AnimatePresence } from 'motion/react';
import {
  User, Award, Clock, BookOpen, BrainCircuit, MessageSquare, 
  Settings, HelpCircle, Info, LogOut, ChevronRight, Bookmark, 
  FileText, Download, Moon, Sun, Monitor, Bell, Shield, 
  Trash2, Edit3, Image as ImageIcon, MapPin, GraduationCap, ArrowLeft, Camera, Check, X, AlertCircle
} from 'lucide-react';
import { collection, query, where, getDocs, doc, setDoc, getDoc } from 'firebase/firestore';
import { updateProfile } from 'firebase/auth';
import { db } from '../firebase/config';
import { ViewType } from '../types';

interface ProfileProps {
  setView: (view: ViewType) => void;
}

export default function Profile({ setView }: ProfileProps) {
  const { user, signOut } = useAuth();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
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
    const [name, setName] = useState(user?.displayName || '');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleSave = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!user) return;
      setLoading(true);
      try {
        await updateProfile(user, { displayName: name });
        await setDoc(doc(db, 'users', user.uid), { name }, { merge: true });
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      } catch (err) {
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
          <form onSubmit={handleSave} className="space-y-4">
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
    return (
      <div className="animate-in fade-in slide-in-from-right-4 duration-300">
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => setActiveSection(null)} className="p-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
            <ArrowLeft size={20} />
          </button>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Settings</h2>
        </div>
        
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 overflow-hidden">
            <div className="p-4 border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
              <h3 className="font-bold text-slate-800 dark:text-white">Appearance</h3>
            </div>
            <div className="p-4 flex items-center justify-between border-b border-slate-100 dark:border-slate-700">
              <div>
                <p className="font-medium text-slate-800 dark:text-white">Dark Mode</p>
                <p className="text-xs text-slate-500">Toggle dark theme</p>
              </div>
              <button className="w-12 h-6 bg-blue-600 rounded-full relative transition-colors">
                <div className="w-4 h-4 bg-white rounded-full absolute right-1 top-1 transition-all"></div>
              </button>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 overflow-hidden">
            <div className="p-4 border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
              <h3 className="font-bold text-slate-800 dark:text-white">Notifications</h3>
            </div>
            <div className="p-4 flex items-center justify-between border-b border-slate-100 dark:border-slate-700">
              <div>
                <p className="font-medium text-slate-800 dark:text-white">Push Notifications</p>
                <p className="text-xs text-slate-500">Daily reminders and updates</p>
              </div>
              <button className="w-12 h-6 bg-slate-200 dark:bg-slate-700 rounded-full relative transition-colors">
                <div className="w-4 h-4 bg-white dark:bg-slate-400 rounded-full absolute left-1 top-1 transition-all"></div>
              </button>
            </div>
            <div className="p-4 flex items-center justify-between">
              <div>
                <p className="font-medium text-slate-800 dark:text-white">Email Updates</p>
                <p className="text-xs text-slate-500">Weekly progress reports</p>
              </div>
              <button className="w-12 h-6 bg-blue-600 rounded-full relative transition-colors">
                <div className="w-4 h-4 bg-white rounded-full absolute right-1 top-1 transition-all"></div>
              </button>
            </div>
          </div>
          
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 overflow-hidden">
            <div className="p-4 border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
              <h3 className="font-bold text-slate-800 dark:text-white">Data Management</h3>
            </div>
            <button className="w-full p-4 flex items-center justify-between border-b border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors text-left">
              <div>
                <p className="font-medium text-slate-800 dark:text-white">Clear Cache</p>
                <p className="text-xs text-slate-500">Free up local storage</p>
              </div>
              <Trash2 size={18} className="text-slate-400" />
            </button>
            <button className="w-full p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors text-left">
              <div>
                <p className="font-medium text-slate-800 dark:text-white">Download My Data</p>
                <p className="text-xs text-slate-500">Export learning history</p>
              </div>
              <Download size={18} className="text-slate-400" />
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
    return (
      <div className="animate-in fade-in slide-in-from-right-4 duration-300">
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => setActiveSection(null)} className="p-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
            <ArrowLeft size={20} />
          </button>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Help & Support</h2>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 overflow-hidden">
          <button className="w-full p-4 flex items-center justify-between border-b border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors text-left">
            <div className="flex items-center gap-3">
              <HelpCircle size={20} className="text-blue-500" />
              <span className="font-medium text-slate-800 dark:text-white">Help Center</span>
            </div>
            <ChevronRight size={18} className="text-slate-400" />
          </button>
          <button className="w-full p-4 flex items-center justify-between border-b border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors text-left">
            <div className="flex items-center gap-3">
              <MessageSquare size={20} className="text-emerald-500" />
              <span className="font-medium text-slate-800 dark:text-white">Contact Support</span>
            </div>
            <ChevronRight size={18} className="text-slate-400" />
          </button>
          <button className="w-full p-4 flex items-center justify-between border-b border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors text-left">
            <div className="flex items-center gap-3">
              <AlertCircle size={20} className="text-amber-500" />
              <span className="font-medium text-slate-800 dark:text-white">Report a Bug</span>
            </div>
            <ChevronRight size={18} className="text-slate-400" />
          </button>
          <button className="w-full p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors text-left">
            <div className="flex items-center gap-3">
              <Info size={20} className="text-purple-500" />
              <span className="font-medium text-slate-800 dark:text-white">Send Feedback</span>
            </div>
            <ChevronRight size={18} className="text-slate-400" />
          </button>
        </div>
      </div>
    );
  }

  // --- Main View ---

  if (activeSection === 'edit_profile') return <EditProfileView />;
  if (activeSection === 'settings') return <SettingsView />;
  if (activeSection === 'saved') return <SavedContentView />;
  if (activeSection === 'stats') return <StatsView />;
  if (activeSection === 'support') return <SupportView />;

  return (
    <div className="max-w-3xl mx-auto w-full pb-8 animate-in fade-in duration-300">
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
        
        <div className="text-center md:text-left flex-1 relative z-10">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-1">{user?.displayName || 'Student'}</h2>
          <p className="text-slate-500 mb-1">{user?.email}</p>
          <p className="text-xs text-slate-400 mb-4 font-mono">ID: {user?.uid.substring(0, 8)}...</p>
          
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm text-slate-600 dark:text-slate-400">
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

      <SectionHeading>My Learning & Content</SectionHeading>
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700/50 shadow-sm flex flex-col mb-8">
        <ActionRow icon={Award} title="Detailed Progress & Statistics" onClick={() => handleAction('stats')} />
        <ActionRow icon={BookOpen} title="Subjects & Curriculum" onClick={() => { window.scrollTo(0, 0); setView('subjects'); }} />
        <ActionRow icon={BrainCircuit} title="Practice History" onClick={() => { window.scrollTo(0, 0); setView('practice'); }} />
        <ActionRow icon={MessageSquare} title="AI Tutor History" onClick={() => { window.scrollTo(0, 0); setView('tutor'); }} />
        <ActionRow icon={Bookmark} title="Saved Content & Notes" onClick={() => handleAction('saved')} />
      </div>

      <SectionHeading>Account & App Settings</SectionHeading>
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700/50 shadow-sm flex flex-col mb-8">
        <ActionRow icon={Settings} title="General Settings" value="Theme, Notifications" onClick={() => handleAction('settings')} />
        <ActionRow icon={Shield} title="Privacy & Security" onClick={() => handleAction('settings')} />
      </div>

      <SectionHeading>Help & Support</SectionHeading>
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700/50 shadow-sm flex flex-col mb-12">
        <ActionRow icon={HelpCircle} title="Help Center & FAQ" onClick={() => handleAction('support')} />
        <ActionRow icon={Info} title="About EduCore" value="v1.0.0" onClick={() => handleAction('support')} />
      </div>

      {/* Logout Section */}
      <div className="flex justify-center mb-8">
        {!showLogoutConfirm ? (
          <button 
            onClick={() => setShowLogoutConfirm(true)}
            className="flex items-center gap-2 px-6 py-3 rounded-xl text-red-600 font-semibold hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
          >
            <LogOut size={20} />
            Log Out
          </button>
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
INNER_EOF
