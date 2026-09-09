import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, ChevronRight, Search, ChevronLeft, Star, Play, MessageSquare, BookMarked, BarChart3, FileText, Settings, Compass } from 'lucide-react';
import { db } from '../lib/firebase';
import { collection, getDocs, query, where, addDoc, updateDoc } from 'firebase/firestore';
import { ViewType } from '../types';
import { useAuth } from '../contexts/AuthContext';

import { ALL_SUBJECTS } from '../data/subjects';

export default function Subjects({ setView }: { setView?: (view: ViewType) => void }) {
  const { user } = useAuth();
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<any>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [progressData, setProgressData] = useState<Record<string, number>>({});

  const handleSelectSubject = async (subject: any) => {
    setSelectedSubject(subject);
    if (user) {
       try {
          const snap = await getDocs(query(collection(db, 'subject_history'), where('uid', '==', user.uid), where('subjectId', '==', subject.id)));
          if (!snap.empty) {
             const docRef = snap.docs[0].ref;
             await updateDoc(docRef, {
                lastOpened: Date.now()
             });
          } else {
             await addDoc(collection(db, 'subject_history'), {
                uid: user.uid,
                subjectId: subject.id,
                name: subject.name,
                category: subject.category,
                lastOpened: Date.now(),
                totalTimeStudied: 0,
                completedQuestions: 0,
                averageScore: 0
             });
          }
       } catch(e) { console.warn(e); }
    }
  };

  
  const categories = ['All', ...Array.from(new Set(ALL_SUBJECTS.map(s => s.category))).sort()];

  
  useEffect(() => {
    const targetId = localStorage.getItem('zetadu_target_subject_id');
    if (targetId) {
      localStorage.removeItem('zetadu_target_subject_id');
      const target = ALL_SUBJECTS.find(s => s.id === targetId);
      if (target) {
        setSelectedSubject(target); // Note: we don't call handleSelectSubject to avoid an infinite loop of saving
      }
    }
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem('zetadu_favorite_subjects');
    if (saved) {
      try { setFavorites(JSON.parse(saved)); } catch (e) {}
    }
    
    // Attempt to load actual progress if available
    const fetchProgress = async () => {
      if (!user) return;
       try {
         const snap = await getDocs(query(collection(db, 'user_progress'), where('uid', '==', user.uid)));
         const prog: Record<string, number> = {};
         snap.forEach(doc => {
            const data = doc.data();
            if (data.subjectId) {
               prog[data.subjectId] = data.masteryPercentage || 0;
            }
         });
         setProgressData(prog);
       } catch(e) {}
    };
    fetchProgress();
  }, []);

  const toggleFavorite = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setFavorites(prev => {
      const newFavs = prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id];
      localStorage.setItem('zetadu_favorite_subjects', JSON.stringify(newFavs));
      return newFavs;
    });
  };

  const handleAction = (action: string) => {
    if (!setView) return;
    
    localStorage.setItem('zetadu_target_subject_id', selectedSubject.id);
    localStorage.setItem('zetadu_target_subject', selectedSubject.name); // Keep for Tutor.tsx backwards compatibility
    
    if (action === 'practice') {
      setView('practice');
    } else if (action === 'tutor') {
      setView('tutor');
    } else if (action === 'journey') {
      localStorage.setItem('zetadu_journey_preselect_subject', selectedSubject.name);
      setView('journey');
    }
  };

  let filteredSubjects = ALL_SUBJECTS.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'All' || s.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  // Sort by favorite, then alphabetical
  filteredSubjects.sort((a, b) => {
    const aFav = favorites.includes(a.id);
    const bFav = favorites.includes(b.id);
    if (aFav && !bFav) return -1;
    if (!aFav && bFav) return 1;
    return a.name.localeCompare(b.name);
  });

  if (selectedSubject) {
    return (
      <div className="w-full max-w-5xl mx-auto pb-28 sm:pb-32 flex flex-col">
        <button onClick={() => setSelectedSubject(null)} className="text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white flex items-center gap-1 mb-6 transition-colors bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 w-fit shadow-sm hover:shadow-md">
          <ChevronLeft size={16} /> Back to Library
        </button>
        
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 md:p-8 border border-slate-200 dark:border-slate-700 shadow-sm relative overflow-hidden mb-10">
          <div className={`absolute top-0 left-0 w-full h-2 ${selectedSubject.color}`}></div>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div className="flex items-center gap-4 md:gap-6">
              <div className={`p-4 md:p-6 rounded-2xl text-white shadow-lg ${selectedSubject.color} shrink-0`}>
                <BookOpen size={48} className="w-10 h-10 md:w-12 md:h-12" />
              </div>
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-3 py-1 rounded-lg text-xs md:text-sm font-bold tracking-wide uppercase">
                    {selectedSubject.category}
                  </span>
                </div>
                <h2 className="text-2xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-2">
                  {selectedSubject.name}
                </h2>
                <div className="flex items-center gap-3">
                  <span className="text-slate-500 dark:text-slate-400 font-medium">
                    Mastery:
                  </span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 md:w-48 bg-slate-100 dark:bg-slate-700 rounded-full h-2.5 overflow-hidden">
                      <div 
                        className={`h-2.5 rounded-full ${selectedSubject.color} transition-all duration-1000`} 
                        style={{ width: `${progressData[selectedSubject.id] || 0}%` }}
                      ></div>
                    </div>
                    <span className="font-bold text-slate-700 dark:text-slate-300">{progressData[selectedSubject.id] || 0}%</span>
                  </div>
                </div>
              </div>
            </div>
            <button 
              onClick={(e) => toggleFavorite(e, selectedSubject.id)}
              className={`p-3 md:p-4 rounded-xl md:rounded-full transition-colors shrink-0 flex items-center justify-center gap-2 font-bold ${favorites.includes(selectedSubject.id) ? 'text-amber-600 bg-amber-50 border-2 border-amber-200 dark:text-amber-400 dark:bg-amber-900/30 dark:border-amber-800/50' : 'text-slate-500 hover:text-amber-500 bg-white hover:bg-slate-50 border-2 border-slate-200 dark:bg-slate-800 dark:border-slate-700 dark:hover:border-slate-600'}`}
            >
              <Star size={20} className={favorites.includes(selectedSubject.id) ? 'fill-current' : ''} />
              <span className="inline md:hidden lg:inline">{favorites.includes(selectedSubject.id) ? 'Favorited' : 'Add to Favorites'}</span>
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between mb-6">
           <h3 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Choose Activity</h3>
        </div>
        
        <div className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-3">
          <button 
            onClick={() => handleAction('journey')}
            className="group p-6 md:p-8 rounded-3xl bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 hover:border-purple-500 dark:hover:border-purple-500 shadow-sm hover:shadow-xl transition-all flex flex-col items-start gap-4 md:gap-6 text-left relative overflow-hidden"
          >
            <div className="absolute -right-8 -bottom-8 text-slate-50 dark:text-slate-700/20 group-hover:text-purple-50 dark:group-hover:text-purple-900/10 transition-colors pointer-events-none transform group-hover:scale-110 duration-500">
              <Compass size={180} />
            </div>
            <div className="p-4 rounded-2xl bg-purple-50 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform relative z-10">
              <Compass size={32} />
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-2 md:mb-3">
                <h3 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white">Study Journey</h3>
                <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-purple-100 dark:bg-purple-900/60 text-purple-700 dark:text-purple-300">Featured</span>
              </div>
              <p className="text-slate-500 dark:text-slate-400 text-sm md:text-base leading-relaxed">Full 6-step learning loop: Concept guide, flashcards, practice exam, mistake review, and mastery.</p>
            </div>
          </button>

          <button 
            onClick={() => handleAction('practice')}
            className="group p-6 md:p-8 rounded-3xl bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-500 shadow-sm hover:shadow-xl transition-all flex flex-col items-start gap-4 md:gap-6 text-left relative overflow-hidden"
          >
            <div className="absolute -right-8 -bottom-8 text-slate-50 dark:text-slate-700/20 group-hover:text-blue-50 dark:group-hover:text-blue-900/10 transition-colors pointer-events-none transform group-hover:scale-110 duration-500">
              <Play size={180} className="fill-current" />
            </div>
            <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform relative z-10">
              <Play size={32} className="fill-current" />
            </div>
            <div className="relative z-10">
              <h3 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white mb-2 md:mb-3">Start Practice</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm md:text-base leading-relaxed">Engage in adaptive quiz sessions, simulate real exams, and test your knowledge interactively.</p>
            </div>
          </button>

          <button 
            onClick={() => handleAction('tutor')}
            className="group p-6 md:p-8 rounded-3xl bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 hover:border-emerald-500 dark:hover:border-emerald-500 shadow-sm hover:shadow-xl transition-all flex flex-col items-start gap-4 md:gap-6 text-left relative overflow-hidden"
          >
            <div className="absolute -right-8 -bottom-8 text-slate-50 dark:text-slate-700/20 group-hover:text-emerald-50 dark:group-hover:text-emerald-900/10 transition-colors pointer-events-none transform group-hover:scale-110 duration-500">
              <MessageSquare size={180} className="fill-current" />
            </div>
            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform relative z-10">
              <MessageSquare size={32} className="fill-current" />
            </div>
            <div className="relative z-10">
              <h3 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white mb-2 md:mb-3">Study with AI Tutor</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm md:text-base leading-relaxed">Get personalized step-by-step explanations, ask questions, and learn at your own pace.</p>
            </div>
          </button>
        </div>

        {/* Mobile Clearance Spacer */}
        <div className="md:hidden h-20 sm:h-24 w-full shrink-0 pointer-events-none" aria-hidden="true" />
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto pb-28 sm:pb-32 flex flex-col">
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6 shrink-0">
        <div>
          <p className="text-sm font-bold tracking-widest text-blue-600 dark:text-blue-400 uppercase mb-2">
            Curriculum
          </p>
          <h2 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">Library</h2>
        </div>
        
        <div className="relative w-full md:w-96">
          <input 
            type="text" 
            placeholder="Search subjects..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-blue-500 focus:border-blue-500 outline-none transition-all shadow-sm no-spinners"
          />
          <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-4 mb-6 no-scrollbar shrink-0 snap-x">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`whitespace-nowrap px-6 py-2.5 rounded-full text-sm font-bold transition-all snap-start ${
              activeCategory === category
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-md'
                : 'bg-white text-slate-600 hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 border-2 border-slate-200 dark:border-slate-700'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 flex-1 pb-20 sm:pb-24">
        <AnimatePresence mode="popLayout">
          {filteredSubjects.map((subject, i) => (
            <motion.div
              key={subject.id}
              layout
              initial={{ opacity: 0, y: 30, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4, delay: (i % 10) * 0.05, ease: "easeOut" }}
              onClick={() => handleSelectSubject(subject)}
              className="bg-white dark:bg-slate-800 rounded-3xl p-6 border-2 border-slate-100 dark:border-slate-700/50 hover:border-blue-200 dark:hover:border-slate-500 shadow-sm hover:shadow-xl transition-all cursor-pointer group flex flex-col justify-between relative"
            >
              <button 
                onClick={(e) => toggleFavorite(e, subject.id)}
                className={`absolute top-6 right-6 p-1.5 rounded-full transition-colors z-10 ${favorites.includes(subject.id) ? 'text-amber-400 bg-amber-50 dark:bg-amber-400/10' : 'text-slate-300 dark:text-slate-600 hover:text-amber-400 hover:bg-slate-50 dark:hover:bg-slate-700 opacity-0 group-hover:opacity-100'}`}
                style={{ opacity: favorites.includes(subject.id) ? 1 : undefined }}
              >
                <Star size={18} className={favorites.includes(subject.id) ? 'fill-current' : ''} />
              </button>

              <div>
                <div className="flex justify-between items-start mb-6">
                  <div className={`p-4 rounded-2xl text-white shadow-md ${subject.color} group-hover:scale-110 transition-transform duration-300`}>
                    <BookOpen size={28} />
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1 pr-6">
                  {subject.name}
                </h3>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-6">{subject.category}</p>
              </div>
              
              <div>
                <div className="flex justify-between text-xs font-bold text-slate-500 dark:text-slate-400 mb-2">
                  <span>Mastery</span>
                  <span className="text-slate-700 dark:text-slate-200">{progressData[subject.id] || 0}%</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                  <div 
                    className={`h-2 rounded-full ${subject.color} transition-all duration-1000`} 
                    style={{ width: `${progressData[subject.id] || 0}%` }}
                  ></div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {filteredSubjects.length === 0 && (
          <div className="col-span-full py-20 text-center flex flex-col items-center">
             <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4 text-slate-400">
               <Search size={32} />
             </div>
             <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No subjects found</h3>
             <p className="text-slate-500 dark:text-slate-400">Try adjusting your search or category filter.</p>
          </div>
        )}
      </div>

      {/* Mobile Clearance Spacer */}
      <div className="md:hidden h-20 sm:h-24 w-full shrink-0 pointer-events-none" aria-hidden="true" />
    </div>
  );
}
