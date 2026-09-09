import React, { useState, useEffect, useMemo } from 'react';
import { ViewType, SchoolUpdateCategory } from '../types';
import { POPULAR_SCHOOLS, INITIAL_SCHOOL_UPDATES } from '../data/schoolsData';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../lib/firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { 
  Building2, 
  Check, 
  Plus, 
  Search, 
  Calendar, 
  Clock, 
  ExternalLink, 
  ChevronRight, 
  AlertCircle, 
  Bookmark, 
  Settings, 
  SlidersHorizontal,
  GraduationCap,
  Sparkles,
  RefreshCw,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface SchoolUpdatesProps {
  setView: (view: ViewType) => void;
}

const CATEGORIES: ('All' | SchoolUpdateCategory)[] = [
  'All',
  'Admissions',
  'Post-UTME',
  'School news',
  'Deadlines',
  'Important announcements'
];

export default function SchoolUpdates({ setView }: SchoolUpdatesProps) {
  const { user } = useAuth();
  const [followedSchoolIds, setFollowedSchoolIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('zetadu_followed_schools');
      return saved ? JSON.parse(saved) : ['unilag', 'ui'];
    } catch {
      return ['unilag', 'ui'];
    }
  });

  const [activeCategory, setActiveCategory] = useState<'All' | SchoolUpdateCategory>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);
  const [schoolSearchQuery, setSchoolSearchQuery] = useState('');
  const [selectedUpdateId, setSelectedUpdateId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Sync followed schools with Firestore
  useEffect(() => {
    if (!user) return;

    const fetchFollowedSchools = async () => {
      try {
        const ref = doc(db, 'user_followed_schools', user.uid);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          const data = snap.data();
          if (Array.isArray(data.schoolIds)) {
            setFollowedSchoolIds(data.schoolIds);
            localStorage.setItem('zetadu_followed_schools', JSON.stringify(data.schoolIds));
          }
        }
      } catch (err) {
        console.warn('Could not fetch followed schools from Firestore, using local cache', err);
      }
    };

    fetchFollowedSchools();
  }, [user]);

  const toggleFollowSchool = async (schoolId: string) => {
    const updated = followedSchoolIds.includes(schoolId)
      ? followedSchoolIds.filter(id => id !== schoolId)
      : [...followedSchoolIds, schoolId];

    setFollowedSchoolIds(updated);
    localStorage.setItem('zetadu_followed_schools', JSON.stringify(updated));

    if (user) {
      setIsSaving(true);
      try {
        const ref = doc(db, 'user_followed_schools', user.uid);
        await setDoc(ref, {
          uid: user.uid,
          schoolIds: updated,
          updatedAt: serverTimestamp()
        }, { merge: true });
      } catch (err) {
        console.error('Error saving followed schools to Firestore:', err);
      } finally {
        setIsSaving(false);
      }
    }
  };

  // Only show updates relevant to the schools the student follows
  const personalizedUpdates = useMemo(() => {
    return INITIAL_SCHOOL_UPDATES.filter(item => {
      // Must be from a followed school
      const isFollowed = followedSchoolIds.includes(item.schoolId);
      if (!isFollowed) return false;

      // Category filter
      if (activeCategory !== 'All' && item.category !== activeCategory) {
        return false;
      }

      // Text search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        return (
          item.title.toLowerCase().includes(query) ||
          item.summary.toLowerCase().includes(query) ||
          item.schoolShortName.toLowerCase().includes(query) ||
          item.schoolFullName.toLowerCase().includes(query) ||
          (item.tags && item.tags.some(t => t.toLowerCase().includes(query)))
        );
      }

      return true;
    }).sort((a, b) => b.timestamp - a.timestamp);
  }, [followedSchoolIds, activeCategory, searchQuery]);

  const followedSchools = useMemo(() => {
    return POPULAR_SCHOOLS.filter(s => followedSchoolIds.includes(s.id));
  }, [followedSchoolIds]);

  const filteredModalSchools = useMemo(() => {
    if (!schoolSearchQuery.trim()) return POPULAR_SCHOOLS;
    const query = schoolSearchQuery.toLowerCase();
    return POPULAR_SCHOOLS.filter(s => 
      s.fullName.toLowerCase().includes(query) ||
      s.shortName.toLowerCase().includes(query) ||
      s.state.toLowerCase().includes(query) ||
      s.type.toLowerCase().includes(query)
    );
  }, [schoolSearchQuery]);

  const getCategoryBadgeClass = (category: SchoolUpdateCategory) => {
    switch (category) {
      case 'Admissions':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 border-blue-200 dark:border-blue-800';
      case 'Post-UTME':
        return 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300 border-purple-200 dark:border-purple-800';
      case 'Deadlines':
        return 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300 border-rose-200 dark:border-rose-800';
      case 'Important announcements':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 border-amber-200 dark:border-amber-800';
      case 'School news':
      default:
        return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';
    }
  };

  return (
    <div className="flex-1 flex flex-col w-full bg-slate-50 dark:bg-slate-950">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-10 px-4 sm:px-8 py-5">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                  <GraduationCap size={22} />
                </span>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">School Updates</h1>
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                Personalized Post-UTME, admissions, deadlines, and news for your target institutions.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                id="manage-schools-btn"
                onClick={() => setIsManageModalOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold shadow-sm transition-all cursor-pointer"
              >
                <SlidersHorizontal size={16} />
                <span>Select & Follow Schools ({followedSchoolIds.length})</span>
              </button>
            </div>
          </div>

          {/* Followed Schools Chips */}
          <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider shrink-0 mr-1">
              Following:
            </span>
            {followedSchools.length === 0 ? (
              <span className="text-xs text-amber-600 dark:text-amber-400 italic">
                No schools selected yet. Click "Select & Follow Schools" to follow institutions!
              </span>
            ) : (
              followedSchools.map(school => (
                <div
                  key={school.id}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-700 dark:text-slate-200 shrink-0"
                >
                  <span className={`w-2 h-2 rounded-full ${school.logoBg}`} />
                  <span>{school.shortName}</span>
                  <button
                    onClick={() => toggleFollowSchool(school.id)}
                    className="hover:text-red-500 ml-1 cursor-pointer transition-colors"
                    title={`Unfollow ${school.shortName}`}
                    aria-label={`Unfollow ${school.shortName}`}
                  >
                    <X size={12} />
                  </button>
                </div>
              ))
            )}
            <button
              onClick={() => setIsManageModalOpen(true)}
              className="px-3 py-1.5 rounded-full border border-dashed border-slate-300 dark:border-slate-700 hover:border-blue-500 text-xs font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 shrink-0 flex items-center gap-1 cursor-pointer transition-colors"
            >
              <Plus size={12} />
              <span>Add School</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-6xl mx-auto w-full px-4 sm:px-8 py-6 pb-28 sm:pb-32 space-y-6">
        {/* Search & Category Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={17} />
            <input
              type="text"
              placeholder="Search updates, keywords, or topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X size={15} />
              </button>
            )}
          </div>

          {/* Categories Pill Navigation */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full no-scrollbar">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  activeCategory === cat
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Updates Feed */}
        {followedSchoolIds.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 sm:p-12 text-center max-w-lg mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto mb-4">
              <Building2 size={32} />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
              Select Schools You Are Interested In
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
              Follow your chosen universities to receive tailored updates on Admissions, Post-UTME screening, cut-off marks, and key deadlines.
            </p>
            <button
              onClick={() => setIsManageModalOpen(true)}
              className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold shadow-md transition-all cursor-pointer"
            >
              Browse & Follow Schools
            </button>
          </div>
        ) : personalizedUpdates.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 text-center max-w-md mx-auto">
            <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto mb-3">
              <Search size={22} />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
              No matching updates found
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Try selecting another category or clearing your search query.
            </p>
            <button
              onClick={() => {
                setActiveCategory('All');
                setSearchQuery('');
              }}
              className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-medium text-slate-700 dark:text-slate-300"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
            {personalizedUpdates.map((update) => {
              const isExpanded = selectedUpdateId === update.id;
              return (
                <motion.div
                  key={update.id}
                  layout
                  className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs hover:border-blue-300 dark:hover:border-blue-700/60 transition-all flex flex-col justify-between"
                >
                  <div>
                    {/* Top Row: School Badge + Category + Deadline */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-1 rounded-md bg-slate-900 text-white dark:bg-slate-800 text-xs font-bold tracking-wide">
                          {update.schoolShortName}
                        </span>
                        <span className={`px-2.5 py-0.5 rounded-md text-[11px] font-semibold border ${getCategoryBadgeClass(update.category)}`}>
                          {update.category}
                        </span>
                      </div>

                      {update.isUrgent && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-900/30 px-2 py-0.5 rounded-md">
                          <AlertCircle size={12} />
                          Urgent
                        </span>
                      )}
                    </div>

                    {/* Title */}
                    <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug mb-2">
                      {update.title}
                    </h3>

                    {/* Summary */}
                    <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
                      {update.summary}
                    </p>

                    {/* Expanded Details */}
                    <AnimatePresence>
                      {isExpanded && update.details && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="pt-3 mb-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/40 p-3 rounded-xl space-y-2"
                        >
                          <p className="font-semibold text-slate-900 dark:text-slate-100">Full Instructions & Details:</p>
                          <p>{update.details}</p>
                          {update.tags && update.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 pt-1">
                              {update.tags.map(t => (
                                <span key={t} className="px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-[10px]">
                                  #{t}
                                </span>
                              ))}
                            </div>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Footer info: Date / Deadline / Actions */}
                  <div className="pt-3 mt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <Clock size={12} />
                        {update.date}
                      </span>
                      {update.deadlineDate && (
                        <span className="flex items-center gap-1 text-rose-600 dark:text-rose-400 font-medium">
                          <Calendar size={12} />
                          Deadline: {update.deadlineDate}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      {update.details && (
                        <button
                          onClick={() => setSelectedUpdateId(isExpanded ? null : update.id)}
                          className="text-blue-600 dark:text-blue-400 hover:underline font-medium cursor-pointer"
                        >
                          {isExpanded ? 'Less' : 'Read more'}
                        </button>
                      )}
                      {update.portalUrl && (
                        <a
                          href={update.portalUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 font-semibold p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                          title="Open official portal"
                        >
                          <span>Portal</span>
                          <ExternalLink size={12} />
                        </a>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Mobile Clearance Spacer */}
        <div className="md:hidden h-24 sm:h-28 w-full shrink-0 pointer-events-none" aria-hidden="true" />
      </div>

      {/* Modal: Select & Follow Schools */}
      <AnimatePresence>
        {isManageModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-2xl w-full max-h-[85vh] flex flex-col overflow-hidden"
            >
              {/* Modal Header */}
              <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                    Follow Target Institutions
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Select all the universities you want to track. Only updates for followed schools will appear in your feed.
                  </p>
                </div>
                <button
                  onClick={() => setIsManageModalOpen(false)}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Modal Search */}
              <div className="px-6 py-3 border-b border-slate-100 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-900/50">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input
                    type="text"
                    placeholder="Search schools by name, state, or category..."
                    value={schoolSearchQuery}
                    onChange={(e) => setSchoolSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Schools List */}
              <div className="flex-1 overflow-y-auto p-6 space-y-3">
                {filteredModalSchools.map((school) => {
                  const isFollowed = followedSchoolIds.includes(school.id);
                  return (
                    <div
                      key={school.id}
                      className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-4 ${
                        isFollowed
                          ? 'bg-blue-50/60 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
                          : 'bg-white dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        <div className={`w-11 h-11 rounded-xl ${school.logoBg} text-white font-bold flex items-center justify-center shrink-0 shadow-xs text-sm`}>
                          {school.badgeText}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-slate-900 dark:text-white truncate">
                              {school.fullName}
                            </span>
                            <span className="px-2 py-0.5 text-[10px] font-semibold rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 shrink-0">
                              {school.type}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                            {school.location}, {school.state} • UTME Cut-Off: {school.cutOffMark || 180}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => toggleFollowSchool(school.id)}
                        className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shrink-0 cursor-pointer ${
                          isFollowed
                            ? 'bg-blue-600 text-white shadow-xs hover:bg-blue-700'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                        }`}
                      >
                        {isFollowed ? (
                          <>
                            <Check size={14} />
                            <span>Following</span>
                          </>
                        ) : (
                          <>
                            <Plus size={14} />
                            <span>Follow</span>
                          </>
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* Modal Footer */}
              <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex items-center justify-between">
                <span className="text-xs text-slate-500">
                  {followedSchoolIds.length} {followedSchoolIds.length === 1 ? 'school' : 'schools'} followed
                </span>
                <button
                  onClick={() => setIsManageModalOpen(false)}
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold cursor-pointer transition-colors"
                >
                  Done
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
