import React, { useState, useMemo } from 'react';
import { 
  BookOpen, 
  HelpCircle, 
  Bookmark, 
  Calendar, 
  Layers, 
  FileText, 
  Award, 
  CheckCircle2, 
  ChevronRight, 
  Search, 
  Download, 
  Trash2, 
  Sparkles, 
  Calculator, 
  ArrowRight,
  BookmarkCheck,
  Check,
  Clock,
  RotateCcw
} from 'lucide-react';
import { 
  JAMB_SUBJECTS, 
  JAMB_YEARS, 
  JAMB_QUESTIONS, 
  JambQuestion 
} from '../../data/jambQuestions';
import { JAMB_SYLLABUS_DATA } from '../../data/jambSyllabus';
import { NOVELS_COLLECTION } from '../../data/novels';
import { BookmarkedJambQuestion } from '../../services/jambService';
import { DownloadedSubjectMeta } from '../../services/jambOfflineDb';

export type StudySubTab = 
  | 'subjects' 
  | 'past_questions' 
  | 'topics' 
  | 'years' 
  | 'jamb_novel' 
  | 'syllabus' 
  | 'bookmarks';

interface JambStudySectionProps {
  initialSubjectId?: string;
  initialSubTab?: StudySubTab;
  onStartPractice: (config: {
    subject?: string;
    topic?: string;
    year?: number | 'all';
    amount?: number;
    ordering?: 'random' | 'sequential';
    isUntimed?: boolean;
    timerDuration?: number;
    examType?: 'JAMB';
  }) => void;
  bookmarksList: BookmarkedJambQuestion[];
  bookmarkedIds: Set<string>;
  onToggleBookmark: (question: JambQuestion) => void;
  downloadedSubjects: Map<string, DownloadedSubjectMeta>;
  onDownloadSubject: (subjectId: string) => void;
  onDeleteSubjectDownload: (subjectId: string) => void;
  downloadProgress: Record<string, { progress: number; current: number; total: number }>;
}

export default function JambStudySection({
  initialSubjectId,
  initialSubTab,
  onStartPractice,
  bookmarksList,
  bookmarkedIds,
  onToggleBookmark,
  downloadedSubjects,
  onDownloadSubject,
  onDeleteSubjectDownload,
  downloadProgress
}: JambStudySectionProps) {
  const [activeSubTab, setActiveSubTab] = useState<StudySubTab>(initialSubTab || 'subjects');

  // Subjects & Topics Filter State
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(initialSubjectId || 'english');

  React.useEffect(() => {
    if (initialSubjectId) {
      setSelectedSubjectId(initialSubjectId);
    }
  }, [initialSubjectId]);

  React.useEffect(() => {
    if (initialSubTab) {
      setActiveSubTab(initialSubTab);
    }
  }, [initialSubTab]);
  const [selectedYearFilter, setSelectedYearFilter] = useState<number | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedQuestionId, setExpandedQuestionId] = useState<string | null>(null);

  // Novel state
  const currentNovel = useMemo(() => {
    return NOVELS_COLLECTION.find(n => n.category === 'Current JAMB Novel') || NOVELS_COLLECTION[0];
  }, []);
  const [selectedNovelChapterIdx, setSelectedNovelChapterIdx] = useState<number>(0);

  // Filtered Past Questions
  const filteredQuestions = useMemo(() => {
    return JAMB_QUESTIONS.filter(q => {
      if (selectedSubjectId && q.subject !== selectedSubjectId) return false;
      if (selectedYearFilter !== 'all' && q.year !== selectedYearFilter) return false;
      if (searchQuery.trim()) {
        const qText = q.question.toLowerCase();
        const topText = q.topic.toLowerCase();
        const search = searchQuery.toLowerCase();
        return qText.includes(search) || topText.includes(search);
      }
      return true;
    });
  }, [selectedSubjectId, selectedYearFilter, searchQuery]);

  // Current Subject Syllabus
  const currentSyllabus = JAMB_SYLLABUS_DATA[selectedSubjectId] || JAMB_SYLLABUS_DATA['english'];

  const subNavItems: { id: StudySubTab; label: string; icon: React.ReactNode; badge?: string | number }[] = [
    { id: 'subjects', label: 'Subjects', icon: <BookOpen size={16} /> },
    { id: 'past_questions', label: 'Past Questions', icon: <HelpCircle size={16} />, badge: filteredQuestions.length },
    { id: 'topics', label: 'Topics', icon: <Layers size={16} /> },
    { id: 'years', label: 'Years', icon: <Calendar size={16} />, badge: JAMB_YEARS.length },
    { id: 'jamb_novel', label: 'JAMB Novel', icon: <Sparkles size={16} /> },
    { id: 'syllabus', label: 'Syllabus', icon: <FileText size={16} /> },
    { id: 'bookmarks', label: 'Bookmarks', icon: <Bookmark size={16} />, badge: bookmarksList.length }
  ];

  return (
    <div className="space-y-6">
      {/* Sub-Navigation Tabs */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-1.5 shadow-2xs overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-1 min-w-max">
          {subNavItems.map(item => {
            const isActive = activeSubTab === item.id;
            return (
              <button
                key={item.id}
                id={`jamb-study-tab-${item.id}`}
                type="button"
                onClick={() => setActiveSubTab(item.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
                {item.badge !== undefined && (
                  <span className={`px-1.5 py-0.2 text-[11px] rounded-full font-black ${
                    isActive 
                      ? 'bg-blue-700 text-blue-100' 
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 1. SUBJECTS SUB-VIEW */}
      {/* ------------------------------------------------------------- */}
      {activeSubTab === 'subjects' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Official JAMB UTME Subjects</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Study curriculum syllabus, authentic questions, and download for 100% offline study.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {JAMB_SUBJECTS.map(subj => {
              const isDownloaded = downloadedSubjects.has(subj.id);
              const downloadState = downloadProgress[subj.id];
              const isDownloading = Boolean(downloadState);
              const syllabus = JAMB_SYLLABUS_DATA[subj.id];

              return (
                <div
                  key={subj.id}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs flex flex-col justify-between hover:border-slate-300 dark:hover:border-slate-700 transition-all"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className={`px-2.5 py-1 rounded-lg text-xs font-black uppercase border ${subj.badgeBg}`}>
                        {subj.code}
                      </span>
                      <div className="flex items-center gap-1.5">
                        {subj.hasCalculator && (
                          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                            <Calculator size={12} className="text-blue-500" /> Calc
                          </span>
                        )}
                        {isDownloaded ? (
                          <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-md flex items-center gap-1">
                            <CheckCircle2 size={12} /> Offline
                          </span>
                        ) : null}
                      </div>
                    </div>

                    <h4 className="text-base font-bold text-slate-900 dark:text-white mb-1">
                      {subj.name}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-3">
                      {syllabus?.overview || subj.description}
                    </p>

                    <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mb-4">
                      <span>{subj.totalStandardQuestions} Questions / Paper</span>
                      <span>•</span>
                      <span>{syllabus?.topics.length || 10} Syllabus Topics</span>
                    </div>
                  </div>

                  <div className="space-y-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedSubjectId(subj.id);
                          setActiveSubTab('syllabus');
                        }}
                        className="flex-1 py-2 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition-colors cursor-pointer text-center"
                      >
                        Syllabus
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedSubjectId(subj.id);
                          setActiveSubTab('past_questions');
                        }}
                        className="flex-1 py-2 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition-colors cursor-pointer text-center"
                      >
                        Past Papers
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => onStartPractice({
                          subject: subj.name,
                          amount: 20,
                          isUntimed: false,
                          timerDuration: 20,
                          examType: 'JAMB'
                        })}
                        className="flex-1 py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                      >
                        <span>Practice Now</span>
                        <ArrowRight size={14} />
                      </button>

                      {isDownloaded ? (
                        <button
                          type="button"
                          onClick={() => onDeleteSubjectDownload(subj.id)}
                          className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer"
                          title="Remove offline copy"
                        >
                          <Trash2 size={15} />
                        </button>
                      ) : (
                        <button
                          type="button"
                          disabled={isDownloading}
                          onClick={() => onDownloadSubject(subj.id)}
                          className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-blue-600 hover:border-blue-300 transition-colors cursor-pointer"
                          title="Download for offline study"
                        >
                          {isDownloading ? (
                            <div className="w-3.5 h-3.5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <Download size={15} />
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 2. PAST QUESTIONS SUB-VIEW */}
      {/* ------------------------------------------------------------- */}
      {activeSubTab === 'past_questions' && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs space-y-3">
            <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
              {/* Subject Selector */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold text-slate-500 uppercase">Subject:</span>
                <select
                  value={selectedSubjectId}
                  onChange={e => setSelectedSubjectId(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white cursor-pointer"
                >
                  {JAMB_SUBJECTS.map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>

                <span className="text-xs font-bold text-slate-500 uppercase ml-2">Year:</span>
                <select
                  value={selectedYearFilter}
                  onChange={e => setSelectedYearFilter(e.target.value === 'all' ? 'all' : Number(e.target.value))}
                  className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white cursor-pointer"
                >
                  <option value="all">All Years</option>
                  {JAMB_YEARS.map(y => (
                    <option key={y} value={y}>JAMB {y}</option>
                  ))}
                </select>
              </div>

              {/* Quick Practice button */}
              <button
                type="button"
                onClick={() => {
                  const subjectMeta = JAMB_SUBJECTS.find(s => s.id === selectedSubjectId);
                  onStartPractice({
                    subject: subjectMeta?.name || 'English Language',
                    year: selectedYearFilter,
                    amount: 20,
                    isUntimed: true,
                    examType: 'JAMB'
                  });
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
              >
                <span>Practice These Questions in Engine</span>
                <ArrowRight size={14} />
              </button>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search questions by text or topic..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
          </div>

          {/* Questions List */}
          <div className="space-y-3">
            {filteredQuestions.length === 0 ? (
              <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 border border-slate-200 dark:border-slate-800 text-center space-y-2">
                <p className="text-sm font-bold text-slate-700 dark:text-slate-300">No questions found matching your filter</p>
                <p className="text-xs text-slate-500">Try selecting a different subject or year</p>
              </div>
            ) : (
              filteredQuestions.map((q, idx) => {
                const isExpanded = expandedQuestionId === q.id;
                const isBookmarked = bookmarkedIds.has(q.id);

                return (
                  <div
                    key={q.id}
                    className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-2xs space-y-3"
                  >
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <div className="flex items-center gap-2">
                        {(q as any).isAIgenerated || (q as any).sourceType === 'ai_generated' ? (
                          <span className="px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 text-xs font-black inline-flex items-center gap-1 border border-indigo-200 dark:border-indigo-800/60">
                            <Sparkles size={12} /> AI Drill • Q{q.questionNumber || (idx + 1)}
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 text-xs font-black border border-blue-200 dark:border-blue-800/60">
                            JAMB {q.year || 'Past Paper'} • Q{q.questionNumber || (idx + 1)}
                          </span>
                        )}
                        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                          {q.topic}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => onToggleBookmark(q)}
                          className={`p-2 rounded-xl transition-colors cursor-pointer ${
                            isBookmarked 
                              ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300' 
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-amber-600'
                          }`}
                          title="Bookmark question"
                        >
                          <Bookmark size={15} className={isBookmarked ? 'fill-current' : ''} />
                        </button>
                        <button
                          type="button"
                          onClick={() => setExpandedQuestionId(isExpanded ? null : q.id)}
                          className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition-colors cursor-pointer"
                        >
                          {isExpanded ? 'Hide Solution' : 'Show Solution'}
                        </button>
                      </div>
                    </div>

                    {q.passage && (
                      <div className="p-3.5 rounded-xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 text-xs leading-relaxed italic text-slate-800 dark:text-slate-200">
                        {q.passage}
                      </div>
                    )}

                    <p className="text-sm font-semibold text-slate-900 dark:text-white leading-relaxed">
                      {q.question}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                      {q.options.map((opt, optIdx) => {
                        const letter = String.fromCharCode(65 + optIdx);
                        const isCorrect = isExpanded && optIdx === q.correctAnswer;
                        return (
                          <div
                            key={optIdx}
                            className={`p-2.5 rounded-xl text-xs font-medium border flex items-center gap-2.5 ${
                              isCorrect
                                ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-800 dark:text-emerald-200 font-bold'
                                : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                            }`}
                          >
                            <span className={`w-5 h-5 rounded-md flex items-center justify-center font-bold text-[11px] shrink-0 ${
                              isCorrect ? 'bg-emerald-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                            }`}>
                              {letter}
                            </span>
                            <span>{opt}</span>
                            {isCorrect && (
                              <CheckCircle2 size={14} className="ml-auto text-emerald-600 shrink-0" />
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {isExpanded && (
                      <div className="p-4 rounded-xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/40 text-xs text-slate-800 dark:text-slate-200 space-y-1">
                        <p className="font-bold text-blue-700 dark:text-blue-300 flex items-center gap-1.5">
                          <Check size={14} /> Correct Answer: Option {String.fromCharCode(65 + q.correctAnswer)}
                        </p>
                        <p className="leading-relaxed whitespace-pre-line">{q.explanation}</p>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 3. TOPICS SUB-VIEW */}
      {/* ------------------------------------------------------------- */}
      {activeSubTab === 'topics' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500 uppercase">Select Subject:</span>
              <select
                value={selectedSubjectId}
                onChange={e => setSelectedSubjectId(e.target.value)}
                className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white cursor-pointer"
              >
                {JAMB_SUBJECTS.map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>
            <p className="text-xs text-slate-500">
              {currentSyllabus.topics.length} official syllabus topics for {currentSyllabus.subjectName}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentSyllabus.topics.map((top, idx) => (
              <div
                key={top.id || idx}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs flex flex-col justify-between hover:border-blue-300 dark:hover:border-blue-800 transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-extrabold text-blue-600 dark:text-blue-400">
                      Topic {idx + 1}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      top.examWeight === 'Essential' 
                        ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300' 
                        : top.examWeight === 'High' 
                        ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300' 
                        : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
                    }`}>
                      {top.examWeight} Frequency
                    </span>
                  </div>

                  <h4 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                    {top.name}
                  </h4>

                  <div className="space-y-1.5 mb-4">
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Key Objectives:</p>
                    <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-1">
                      {top.objectives.slice(0, 3).map((obj, oIdx) => (
                        <li key={oIdx} className="flex items-start gap-1.5">
                          <span className="text-blue-500 mt-0.5">•</span>
                          <span>{obj}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onStartPractice({
                    subject: currentSyllabus.subjectName,
                    topic: top.name,
                    amount: 15,
                    isUntimed: false,
                    timerDuration: 15,
                    examType: 'JAMB'
                  })}
                  className="w-full py-2.5 px-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-600 hover:text-white text-blue-700 dark:text-blue-300 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>Practice Questions on {top.name}</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 4. YEARS SUB-VIEW */}
      {/* ------------------------------------------------------------- */}
      {activeSubTab === 'years' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500 uppercase">Subject:</span>
              <select
                value={selectedSubjectId}
                onChange={e => setSelectedSubjectId(e.target.value)}
                className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white cursor-pointer"
              >
                {JAMB_SUBJECTS.map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>
            <p className="text-xs text-slate-500">
              Practice full authentic UTME past papers sorted by official examination years.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {JAMB_YEARS.map(yr => {
              const subjMeta = JAMB_SUBJECTS.find(s => s.id === selectedSubjectId);
              const qCountForYear = JAMB_QUESTIONS.filter(q => q.subject === selectedSubjectId && q.year === yr).length;

              return (
                <div
                  key={yr}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs flex flex-col justify-between hover:border-blue-500 transition-all"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-slate-400">UTME Series</span>
                      <span className="px-2 py-0.5 rounded-md bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-[10px] font-extrabold">
                        Verified
                      </span>
                    </div>

                    <h4 className="text-2xl font-black text-slate-900 dark:text-white mb-1">
                      JAMB {yr}
                    </h4>
                    <p className="text-xs text-slate-500 mb-4">
                      {subjMeta?.name} • Authentic past examination paper
                    </p>
                  </div>

                  <div className="space-y-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                    <button
                      type="button"
                      onClick={() => onStartPractice({
                        subject: subjMeta?.name,
                        year: yr,
                        amount: subjMeta?.totalStandardQuestions || 40,
                        isUntimed: false,
                        timerDuration: 30,
                        examType: 'JAMB'
                      })}
                      className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <Clock size={13} />
                      <span>Timed Exam ({yr})</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => onStartPractice({
                        subject: subjMeta?.name,
                        year: yr,
                        amount: subjMeta?.totalStandardQuestions || 40,
                        isUntimed: true,
                        examType: 'JAMB'
                      })}
                      className="w-full py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition-colors cursor-pointer text-center"
                    >
                      Untimed Study Drill
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 5. JAMB NOVEL SUB-VIEW */}
      {/* ------------------------------------------------------------- */}
      {activeSubTab === 'jamb_novel' && currentNovel && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-amber-900 via-slate-900 to-indigo-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row gap-6 items-start">
            <div className="w-24 sm:w-32 aspect-[3/4] rounded-xl bg-slate-800 overflow-hidden shrink-0 shadow-lg border border-white/20">
              <img
                src={currentNovel.coverImage}
                alt={currentNovel.title}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="flex-1 space-y-3">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-[11px] font-extrabold bg-amber-400 text-slate-950 uppercase tracking-wider">
                  Current Official JAMB Prescribed Novel
                </span>
                <span className="text-xs text-amber-200">15-20 Questions in Use of English</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black">{currentNovel.title}</h3>
              <p className="text-sm text-slate-300">By {currentNovel.author} • {currentNovel.year}</p>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed max-w-3xl">
                {currentNovel.description}
              </p>

              <div className="pt-2 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => onStartPractice({
                    subject: 'English Language',
                    topic: currentNovel.title,
                    amount: 20,
                    isUntimed: true,
                    examType: 'JAMB'
                  })}
                  className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs sm:text-sm flex items-center gap-2 shadow-lg transition-transform cursor-pointer hover:scale-[1.02]"
                >
                  <Sparkles size={16} />
                  <span>Practice All Novel Questions ({currentNovel.practiceQuestions?.length || 20} Qs)</span>
                </button>
              </div>
            </div>
          </div>

          {/* Chapter Selector & Chapter Detail */}
          {currentNovel.chapters && currentNovel.chapters.length > 0 && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                <h4 className="text-lg font-bold text-slate-900 dark:text-white">Chapter Breakdown & Study Notes</h4>
                <span className="text-xs text-slate-500">{currentNovel.chapters.length} Total Chapters</span>
              </div>

              {/* Chapter Pills */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
                {currentNovel.chapters.map((ch, chIdx) => (
                  <button
                    key={ch.id}
                    type="button"
                    onClick={() => setSelectedNovelChapterIdx(chIdx)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                      selectedNovelChapterIdx === chIdx
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    Chapter {ch.chapterNumber}
                  </button>
                ))}
              </div>

              {/* Selected Chapter Details */}
              {(() => {
                const chapter = currentNovel.chapters[selectedNovelChapterIdx];
                if (!chapter) return null;

                return (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xs font-extrabold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                          Chapter {chapter.chapterNumber}
                        </span>
                        <h4 className="text-xl font-bold text-slate-900 dark:text-white">
                          {chapter.title}
                        </h4>
                      </div>

                      {chapter.questions && chapter.questions.length > 0 && (
                        <button
                          type="button"
                          onClick={() => onStartPractice({
                            subject: 'English Language',
                            topic: `${currentNovel.title} - Chapter ${chapter.chapterNumber}`,
                            amount: chapter.questions?.length || 10,
                            isUntimed: true,
                            examType: 'JAMB'
                          })}
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <BookOpen size={14} />
                          <span>Practice Chapter Questions</span>
                        </button>
                      )}
                    </div>

                    {/* Summary */}
                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                      <p className="font-bold text-slate-900 dark:text-white mb-1.5 uppercase text-xs tracking-wider">
                        Chapter Summary:
                      </p>
                      <p>{chapter.summary}</p>
                    </div>

                    {/* Key Characters & Themes */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {chapter.importantCharacters && chapter.importantCharacters.length > 0 && (
                        <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2">
                          <p className="font-bold text-xs uppercase tracking-wider text-slate-500">
                            Key Characters in Chapter
                          </p>
                          <div className="flex flex-wrap gap-1.5">
                            {chapter.importantCharacters.map((c, i) => (
                              <span key={i} className="px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 text-xs font-semibold">
                                {c.name} ({c.role})
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {chapter.themes && chapter.themes.length > 0 && (
                        <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2">
                          <p className="font-bold text-xs uppercase tracking-wider text-slate-500">
                            Themes Explored
                          </p>
                          <div className="flex flex-wrap gap-1.5">
                            {chapter.themes.map((t, i) => (
                              <span key={i} className="px-2.5 py-1 rounded-lg bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 text-xs font-semibold">
                                {t}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })()}
            </div>
          )}
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 6. SYLLABUS SUB-VIEW */}
      {/* ------------------------------------------------------------- */}
      {activeSubTab === 'syllabus' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <span className="text-xs font-extrabold uppercase tracking-wider text-blue-600">Official UTME Syllabus</span>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">{currentSyllabus.subjectName}</h3>
              </div>
              <select
                value={selectedSubjectId}
                onChange={e => setSelectedSubjectId(e.target.value)}
                className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white cursor-pointer"
              >
                {JAMB_SUBJECTS.map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-xs">
                <span className="text-slate-400 block mb-1">Examination Structure</span>
                <span className="font-bold text-slate-900 dark:text-white text-sm">
                  {currentSyllabus.examStructure.totalQuestions} Questions • {currentSyllabus.examStructure.durationMinutes} Mins
                </span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-xs">
                <span className="text-slate-400 block mb-1">Calculator Permitted</span>
                <span className="font-bold text-slate-900 dark:text-white text-sm">
                  {currentSyllabus.examStructure.calculatorAllowed ? 'Yes (On-Screen Standard)' : 'No (Non-calculator paper)'}
                </span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-xs">
                <span className="text-slate-400 block mb-1">Syllabus Scope</span>
                <span className="font-bold text-slate-900 dark:text-white text-sm">
                  {currentSyllabus.topics.length} Major Topic Domains
                </span>
              </div>
            </div>

            {/* General Objectives */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">General UTME Examination Objectives:</h4>
              <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                {currentSyllabus.generalObjectives.map((obj, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 size={14} className="text-emerald-500 mt-0.5 shrink-0" />
                    <span>{obj}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Recommended Books */}
            {currentSyllabus.recommendedBooks && currentSyllabus.recommendedBooks.length > 0 && (
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Official Recommended Textbooks:</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {currentSyllabus.recommendedBooks.map((b, i) => (
                    <div key={i} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-xs">
                      <p className="font-bold text-slate-900 dark:text-white">{b.title}</p>
                      <p className="text-slate-500">{b.author}{b.publisher ? ` • ${b.publisher}` : ''}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 7. BOOKMARKS SUB-VIEW */}
      {/* ------------------------------------------------------------- */}
      {activeSubTab === 'bookmarks' && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Saved Questions ({bookmarksList.length})</h3>
              <p className="text-xs text-slate-500">Review difficult questions you saved during CBT mock examinations.</p>
            </div>

            {bookmarksList.length > 0 && (
              <button
                type="button"
                onClick={() => {
                  const firstBm = bookmarksList[0];
                  onStartPractice({
                    subject: firstBm?.question?.subjectName || firstBm?.subject || 'General',
                    amount: bookmarksList.length,
                    isUntimed: true,
                    examType: 'JAMB'
                  });
                }}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
              >
                <BookmarkCheck size={15} />
                <span>Practice All Bookmarks</span>
              </button>
            )}
          </div>

          {bookmarksList.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-10 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-500 flex items-center justify-center mx-auto">
                <Bookmark size={22} />
              </div>
              <h4 className="font-bold text-slate-900 dark:text-white text-base">No Saved Questions Yet</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                While practicing in the CBT simulator, click the bookmark icon on any question to save it here for targeted revision.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {bookmarksList.map(bm => {
                const q = bm.question;
                return (
                  <div
                    key={bm.questionId}
                    className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-md bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-xs font-bold">
                          {q.subjectName || bm.subject} • {q.year ? `JAMB ${q.year}` : 'Past Question'}
                        </span>
                        <span className="text-xs text-slate-500">{q.topic}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => onToggleBookmark(q)}
                        className="text-xs text-rose-500 hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <Trash2 size={13} />
                        <span>Remove</span>
                      </button>
                    </div>

                    <p className="text-sm font-semibold text-slate-900 dark:text-white">
                      {q.question}
                    </p>

                    <div className="p-3 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/40 text-xs text-emerald-900 dark:text-emerald-200">
                      <p className="font-bold mb-1">
                        Correct Answer: Option {String.fromCharCode(65 + q.correctAnswer)} - {q.options[q.correctAnswer]}
                      </p>
                      <p className="text-slate-600 dark:text-slate-300 whitespace-pre-line">{q.explanation}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
