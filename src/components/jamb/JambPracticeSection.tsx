import React, { useState } from 'react';
import { 
  Sliders, 
  ArrowRight, 
  Clock, 
  Shuffle, 
  ListOrdered, 
  Calculator, 
  CheckCircle2, 
  FileText,
  Sparkles
} from 'lucide-react';
import { JAMB_SUBJECTS, JAMB_YEARS, getRealAvailableQuestionsForSubject } from '../../data/jambQuestions';
import { JAMB_CATEGORIES, JambCategory } from '../../data/jambSubjects';
import { JAMB_SYLLABUS_DATA } from '../../data/jambSyllabus';
import { AlertCircle } from 'lucide-react';

interface JambPracticeSectionProps {
  initialSubjectId?: string;
  onStartPractice: (config: {
    subject: string;
    subjectId?: string;
    topic?: string;
    year?: number | 'all';
    amount: number;
    ordering: 'random' | 'sequential';
    isUntimed: boolean;
    timerDuration: number;
    examType: 'JAMB';
    practiceMode?: 'practice' | 'cbt' | 'study';
  }) => void;
}

export default function JambPracticeSection({ initialSubjectId, onStartPractice }: JambPracticeSectionProps) {
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(initialSubjectId || 'mathematics');
  const [subjectCategory, setSubjectCategory] = useState<JambCategory>('All');
  const [selectedTopic, setSelectedTopic] = useState<string>('All Topics');
  const [selectedYear, setSelectedYear] = useState<number | 'all'>('all');
  const [practiceMode, setPracticeMode] = useState<'practice' | 'cbt' | 'study'>('practice');

  // Sync if initialSubjectId updates
  React.useEffect(() => {
    if (initialSubjectId) {
      setSelectedSubjectId(initialSubjectId);
    }
  }, [initialSubjectId]);
  const [questionCount, setQuestionCount] = useState<number>(20);
  const [customQuestionCount, setCustomQuestionCount] = useState<string>('');
  const [isCustomCount, setIsCustomCount] = useState<boolean>(false);
  const [ordering, setOrdering] = useState<'random' | 'sequential'>('random');
  const [isUntimed, setIsUntimed] = useState<boolean>(false);
  const [timerMinutes, setTimerMinutes] = useState<number>(20);

  const currentSubjectMeta = JAMB_SUBJECTS.find(s => s.id === selectedSubjectId) || JAMB_SUBJECTS[0];
  const syllabus = JAMB_SYLLABUS_DATA[selectedSubjectId];
  const topicsList = syllabus?.topics || [];
  const availableInBank = getRealAvailableQuestionsForSubject(selectedSubjectId).length;

  const finalAmount = isCustomCount && Number(customQuestionCount) > 0 
    ? Math.min(100, Math.max(1, Number(customQuestionCount)))
    : (practiceMode === 'cbt' ? 40 : questionCount);

  const handleLaunch = () => {
    const isUntimedMode = practiceMode === 'study' || isUntimed;
    const dur = isUntimedMode ? 0 : (practiceMode === 'cbt' ? 45 : timerMinutes);

    onStartPractice({
      subject: currentSubjectMeta.name,
      subjectId: currentSubjectMeta.id,
      topic: selectedTopic !== 'All Topics' ? selectedTopic : undefined,
      year: selectedYear !== 'all' ? selectedYear : 'all',
      amount: finalAmount,
      ordering,
      isUntimed: isUntimedMode,
      timerDuration: dur,
      examType: 'JAMB',
      practiceMode
    });
  };

  return (
    <div className="max-w-3xl mx-auto space-y-4 sm:space-y-6 w-full min-w-0">
      {/* Header Info */}
      <div className="bg-gradient-to-r from-blue-700 to-indigo-800 rounded-2xl sm:rounded-3xl p-4 sm:p-6 text-white shadow-lg space-y-2 w-full min-w-0">
        <div className="flex items-center gap-2">
          <Sparkles size={16} className="text-amber-300 shrink-0" />
          <span className="text-xs font-bold uppercase tracking-wider text-blue-200">
            Targeted UTME Practice Mode
          </span>
        </div>
        <h3 className="text-xl sm:text-2xl font-black">Customize Your Practice Session</h3>
        <p className="text-xs sm:text-sm text-blue-100 leading-relaxed">
          Configure questions, timing, and topic focus. All questions are retrieved directly from the official JAMB question bank with full verified answers and syllabus derivations.
        </p>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-sm space-y-5 sm:space-y-6 w-full min-w-0">
        
        {/* 1. Subject Choice */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              1. Select Subject ({JAMB_SUBJECTS.length} Official JAMB Subjects)
            </label>
            <div className="flex items-center gap-1 overflow-x-auto pb-1 text-[11px] no-scrollbar">
              {JAMB_CATEGORIES.map(cat => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSubjectCategory(cat)}
                  className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition ${
                    subjectCategory === cat 
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 sm:gap-2.5 max-h-72 overflow-y-auto pr-1">
            {JAMB_SUBJECTS.filter(s => subjectCategory === 'All' || s.category === subjectCategory).map(subj => {
              const isSelected = selectedSubjectId === subj.id;
              return (
                <button
                  key={subj.id}
                  type="button"
                  onClick={() => {
                    setSelectedSubjectId(subj.id);
                    setSelectedTopic('All Topics');
                  }}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'border-blue-600 bg-blue-50/60 dark:bg-blue-950/30 ring-2 ring-blue-600/30'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1 w-full mb-1.5">
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase w-fit border ${subj.badgeBg}`}>
                      {subj.code}
                    </span>
                    <span className="text-[10px] font-semibold text-slate-400">
                      {getRealAvailableQuestionsForSubject(subj.id).length} Qs
                    </span>
                  </div>
                  <span className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">
                    {subj.name}
                  </span>
                  {subj.hasCalculator && (
                    <span className="text-[10px] text-slate-400 flex items-center gap-1 mt-1">
                      <Calculator size={10} /> Calc available
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Scope Focus: Year and Topic */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
              2. Past Paper Year
            </label>
            <select
              value={selectedYear}
              onChange={e => setSelectedYear(e.target.value === 'all' ? 'all' : Number(e.target.value))}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-bold cursor-pointer"
            >
              <option value="all">All Past Years (2018–2024 Mixed)</option>
              {JAMB_YEARS.map(yr => (
                <option key={yr} value={yr}>JAMB {yr} Past Paper</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
              3. Syllabus Topic
            </label>
            <select
              value={selectedTopic}
              onChange={e => setSelectedTopic(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-bold cursor-pointer"
            >
              <option value="All Topics">All Topics in {currentSubjectMeta.name}</option>
              {topicsList.map((t, idx) => (
                <option key={t.id || idx} value={t.name}>{t.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* 3. Practice Mode */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
            4. Practice Mode
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => {
                setPracticeMode('practice');
                setIsUntimed(false);
              }}
              className={`p-3 rounded-xl text-left border transition-all cursor-pointer ${
                practiceMode === 'practice'
                  ? 'border-blue-600 bg-blue-50/70 dark:bg-blue-950/40 text-blue-900 dark:text-blue-100 ring-2 ring-blue-600/20'
                  : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
              }`}
            >
              <div className="flex items-center gap-1.5 font-bold text-xs">
                <Clock size={14} className="text-blue-600 dark:text-blue-400" />
                <span>Timed Practice</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                Custom duration with standard CBT countdown
              </p>
            </button>

            <button
              type="button"
              onClick={() => {
                setPracticeMode('study');
                setIsUntimed(true);
              }}
              className={`p-3 rounded-xl text-left border transition-all cursor-pointer ${
                practiceMode === 'study'
                  ? 'border-blue-600 bg-blue-50/70 dark:bg-blue-950/40 text-blue-900 dark:text-blue-100 ring-2 ring-blue-600/20'
                  : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
              }`}
            >
              <div className="flex items-center gap-1.5 font-bold text-xs">
                <FileText size={14} className="text-emerald-600 dark:text-emerald-400" />
                <span>Untimed Study</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                Learn without time pressure with full derivations
              </p>
            </button>

            <button
              type="button"
              onClick={() => {
                setPracticeMode('cbt');
                setIsUntimed(false);
                setQuestionCount(40);
                setIsCustomCount(false);
              }}
              className={`p-3 rounded-xl text-left border transition-all cursor-pointer ${
                practiceMode === 'cbt'
                  ? 'border-blue-600 bg-blue-50/70 dark:bg-blue-950/40 text-blue-900 dark:text-blue-100 ring-2 ring-blue-600/20'
                  : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
              }`}
            >
              <div className="flex items-center gap-1.5 font-bold text-xs">
                <Sparkles size={14} className="text-amber-500" />
                <span>Full UTME Mock</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                Official 40-question, 45-minute timed exam mode
              </p>
            </button>
          </div>
        </div>

        {/* 4. Number of Questions */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
            5. Number of Questions
          </label>
          <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-8 gap-1.5 sm:gap-2">
            {[5, 10, 20, 30, 40, 50, 75].map(count => (
              <button
                key={count}
                type="button"
                onClick={() => {
                  setQuestionCount(count);
                  setIsCustomCount(false);
                  if (practiceMode === 'cbt') setPracticeMode('practice');
                }}
                className={`py-2.5 rounded-xl text-xs font-bold border transition-colors cursor-pointer text-center ${
                  !isCustomCount && questionCount === count
                    ? 'border-blue-600 bg-blue-600 text-white shadow-xs'
                    : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                {count} Qs
              </button>
            ))}
            <button
              type="button"
              onClick={() => {
                setIsCustomCount(true);
                if (practiceMode === 'cbt') setPracticeMode('practice');
              }}
              className={`py-2.5 rounded-xl text-xs font-bold border transition-colors cursor-pointer text-center ${
                isCustomCount
                  ? 'border-blue-600 bg-blue-600 text-white shadow-xs'
                  : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
              }`}
            >
              Custom
            </button>
          </div>

          {isCustomCount && (
            <div className="mt-2 flex items-center gap-2">
              <input
                type="number"
                min="1"
                max="100"
                value={customQuestionCount}
                onChange={e => setCustomQuestionCount(e.target.value)}
                placeholder="Enter custom number (1-100)"
                className="w-48 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white"
              />
              <span className="text-xs text-slate-400">Max 100 questions</span>
            </div>
          )}
        </div>

        {/* 5. Ordering & Timing */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Question Ordering */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
              6. Question Order
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setOrdering('random')}
                className={`py-2.5 px-3 rounded-xl text-xs font-bold border flex items-center justify-center gap-1.5 cursor-pointer ${
                  ordering === 'random'
                    ? 'border-blue-600 bg-blue-600 text-white'
                    : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                <Shuffle size={14} />
                <span>Random</span>
              </button>
              <button
                type="button"
                onClick={() => setOrdering('sequential')}
                className={`py-2.5 px-3 rounded-xl text-xs font-bold border flex items-center justify-center gap-1.5 cursor-pointer ${
                  ordering === 'sequential'
                    ? 'border-blue-600 bg-blue-600 text-white'
                    : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                <ListOrdered size={14} />
                <span>Sequential</span>
              </button>
            </div>
          </div>

          {/* Timing Mode (if not untimed study mode) */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
              7. Session Duration
            </label>
            {practiceMode === 'study' ? (
              <div className="py-2.5 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-500 font-medium">
                Untimed (Take as much time as needed)
              </div>
            ) : practiceMode === 'cbt' ? (
              <div className="py-2.5 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 font-bold flex items-center gap-1.5">
                <Clock size={14} className="text-amber-500" />
                <span>45 Minutes (Official UTME CBT Standard)</span>
              </div>
            ) : (
              <select
                value={timerMinutes}
                onChange={e => setTimerMinutes(Number(e.target.value))}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white cursor-pointer"
              >
                <option value={10}>10 Minutes (Speed Drill)</option>
                <option value={15}>15 Minutes</option>
                <option value={20}>20 Minutes (Standard Drill)</option>
                <option value={30}>30 Minutes</option>
                <option value={45}>45 Minutes (Full UTME Pace)</option>
              </select>
            )}
          </div>
        </div>

        {/* Availability Notice if user requests more than is available in bank */}
        {finalAmount > availableInBank && (
          <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs text-amber-900 dark:text-amber-200 space-y-1.5 animate-fadeIn">
            <div className="flex items-center gap-1.5 font-bold text-amber-800 dark:text-amber-300">
              <AlertCircle size={16} className="text-amber-600 dark:text-amber-400 shrink-0" />
              <span>Question Bank Notice</span>
            </div>
            <p>
              You selected <strong>{finalAmount} questions</strong>, but <strong>{currentSubjectMeta.name}</strong> currently has <strong>{availableInBank} authentic questions</strong> available. {finalAmount} questions are not currently available.
            </p>
            <p className="text-[11px] text-amber-700/80 dark:text-amber-300/80">
              LearnDean strictly isolates questions and never substitutes questions from other subjects. If you start, practice will begin with all {availableInBank} authentic {currentSubjectMeta.name} questions.
            </p>
          </div>
        )}

        {/* Launch Button */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-slate-500">
            <span>
              Ready to practice <strong>{finalAmount > availableInBank ? availableInBank : finalAmount} authentic questions</strong> for <strong>{currentSubjectMeta.name}</strong>
              {finalAmount > availableInBank && <span className="text-amber-600 dark:text-amber-400 font-semibold ml-1">({finalAmount} requested; {finalAmount} not currently available)</span>}
            </span>
          </div>

          <button
            id="jamb-launch-practice-btn"
            type="button"
            onClick={handleLaunch}
            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer hover:scale-[1.02]"
          >
            <span>Start JAMB Practice</span>
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
