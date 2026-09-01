import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, MapPin, Calendar, ExternalLink, BookmarkPlus, ChevronRight, Briefcase, GraduationCap, Building } from 'lucide-react';

const mockOpportunities = [
  {
    id: 1,
    title: 'PTDF Undergraduate Scholarship 2026',
    organization: 'Petroleum Technology Development Fund',
    type: 'Scholarship',
    deadline: 'Oct 30, 2026',
    location: 'Nigeria (Federal Universities)',
    icon: GraduationCap,
    color: 'bg-emerald-500'
  },
  {
    id: 2,
    title: 'University of Lagos Post-UTME Screening',
    organization: 'UNILAG',
    type: 'Admission',
    deadline: 'Sep 15, 2026',
    location: 'Lagos, Nigeria',
    icon: Building,
    color: 'bg-blue-600'
  },
  {
    id: 3,
    title: 'Google Africa Developer Scholarship',
    organization: 'Google / Pluralsight',
    type: 'Course / Training',
    deadline: 'Nov 12, 2026',
    location: 'Remote',
    icon: Briefcase,
    color: 'bg-red-500'
  }
];

export default function Opportunities() {
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  const tabs = ['All', 'Scholarships', 'Admissions', 'Courses'];
  
  return (
    <div className="w-full max-w-7xl mx-auto pb-12 flex flex-col">
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6 shrink-0">
        <div>
          <p className="text-sm font-bold tracking-widest text-emerald-600 dark:text-emerald-400 uppercase mb-2">
            Student Board
          </p>
          <h2 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">Opportunities</h2>
          <p className="text-slate-500 mt-2 max-w-2xl">Find scholarships, university admissions, and educational opportunities tailored to you.</p>
        </div>
        
        <div className="relative w-full md:w-96">
          <input 
            type="text" 
            placeholder="Search opportunities..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all shadow-sm"
          />
          <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-4 mb-6 scrollbar-hide shrink-0 snap-x">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`whitespace-nowrap px-6 py-2.5 rounded-full text-sm font-bold transition-all snap-start ${
              activeTab === tab
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-md'
                : 'bg-white text-slate-600 hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 border-2 border-slate-200 dark:border-slate-700'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 flex-1 pb-8">
        <AnimatePresence mode="popLayout">
          {mockOpportunities.map((opp, i) => (
            <motion.div
              key={opp.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="bg-white dark:bg-slate-800 rounded-3xl p-6 border-2 border-slate-100 dark:border-slate-700/50 hover:border-emerald-200 dark:hover:border-slate-500 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between"
            >
               <div>
                  <div className="flex justify-between items-start mb-4">
                     <div className={`w-12 h-12 rounded-2xl text-white shadow-md flex items-center justify-center ${opp.color}`}>
                       <opp.icon size={24} />
                     </div>
                     <button className="text-slate-300 hover:text-amber-500 transition-colors">
                        <BookmarkPlus size={24} />
                     </button>
                  </div>
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">{opp.type}</div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 line-clamp-2">{opp.title}</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 font-medium mb-4">{opp.organization}</p>
               </div>
               
               <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700 space-y-2">
                  <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                     <Calendar size={16} /> Deadline: <span className="font-semibold text-slate-700 dark:text-slate-300">{opp.deadline}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                     <MapPin size={16} /> {opp.location}
                  </div>
               </div>
               
               <button className="w-full mt-6 flex items-center justify-center gap-2 py-3 rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-900/80 text-slate-700 dark:text-slate-200 font-bold transition-colors">
                  View Details <ExternalLink size={16} />
               </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
