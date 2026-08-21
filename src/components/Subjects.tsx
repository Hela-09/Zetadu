import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, ChevronRight, Search, ChevronLeft, Star, Play, MessageSquare, BookMarked, BarChart3, FileText, Settings } from 'lucide-react';
import { db } from '../firebase/config';
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
    const targetId = localStorage.getItem('educore_target_subject_id');
    if (targetId) {
      localStorage.removeItem('educore_target_subject_id');
      const target = ALL_SUBJECTS.find(s => s.id === targetId);
      if (target) {
        setSelectedSubject(target); // Note: we don't call handleSelectSubject to avoid an infinite loop of saving
      }
    }
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem('educore_favorite_subjects');
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
      localStorage.setItem('educore_favorite_subjects', JSON.stringify(newFavs));
      return newFavs;
    });
  };

  const handleAction = (action: string) => {
    if (!setView) return;
    
    localStorage.setItem('educore_target_subject_id', selectedSubject.id);
    localStorage.setItem('educore_target_subject', selectedSubject.name); // Keep for Tutor.tsx backwards compatibility
    
    if (action === 'practice') {
      setView('practice');
    } else if (action === 'tutor') {
      setView('tutor');
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
      <div className="w-full max-w-5xl mx-auto pb-8 h-full flex flex-col">
        <div className="mb-8 shrink-0">
          <button onClick={() => setSelectedSubject(null)} className="text-sm font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center gap-1 mb-4 transition-colors">
            <ChevronLeft size={16} /> Back to Subjects
          </button>
          <div className="flex items-center gap-4">
            <div className={`p-5 rounded-2xl text-white shadow-lg ${selectedSubject.color}`}>
              <BookOpen size={40} />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white tracking-tight">{selectedSubject.name}</h2>
                <button 
                  onClick={(e) => toggleFavorite(e, selectedSubject.id)}
                  className={`p-2 rounded-full transition-colors ${favorites.includes(selectedSubject.id) ? 'text-amber-400 bg-amber-50 dark:bg-amber-400/10' : 'text-slate-400 hover:text-amber-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                >
                  <Star size={24} className={favorites.includes(selectedSubject.id) ? 'fill-current' : ''} />
                </button>
              </div>
              <p className="text-slate-500 dark:text-slate-400 font-medium mt-1 text-lg">{selectedSubject.category}</p>
            </div>
          </div>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center pt-4 md:pt-8">
           <div className="w-full max-w-2xl grid gap-4 grid-cols-1 md:grid-cols-2">
             <button 
               onClick={() => handleAction('practice')}
               className="group p-6 rounded-3xl bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-500 shadow-sm hover:shadow-xl transition-all flex flex-col items-start gap-4 text-left"
             >
               <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
                 <Play size={32} className="fill-current" />
               </div>
               <div>
                 <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Start Practice</h3>
                 <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">Begin a custom practice session or exam simulation for {selectedSubject.name}.</p>
               </div>
             </button>

             <button 
               onClick={() => handleAction('tutor')}
               className="group p-6 rounded-3xl bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 hover:border-emerald-500 dark:hover:border-emerald-500 shadow-sm hover:shadow-xl transition-all flex flex-col items-start gap-4 text-left"
             >
               <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform">
                 <MessageSquare size={32} />
               </div>
               <div>
                 <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Study with AI Tutor</h3>
                 <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">Get personalized explanations and step-by-step guidance.</p>
               </div>
             </button>
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto pb-12 flex flex-col h-full">
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

      <div className="flex gap-2 overflow-x-auto pb-4 mb-6 scrollbar-hide shrink-0 snap-x">
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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 flex-1 overflow-y-auto pb-8 pr-2">
        <AnimatePresence mode="popLayout">
          {filteredSubjects.map((subject, i) => (
            <motion.div
              key={subject.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: (i % 10) * 0.02 }}
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
    </div>
  );
}
