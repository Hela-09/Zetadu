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
import { JAMB_SUBJECTS, JAMB_YEARS } from '../../data/jambQuestions';
import { JAMB_CATEGORIES, JambCategory } from '../../data/jambSubjects';
import { JAMB_SYLLABUS_DATA } from '../../data/jambSyllabus';

interface JambPracticeSectionProps {
  initialSubjectId?: string;
  onStartPractice: (config: {
    subject: string;
    topic?: string;
    year?: number | 'all';
    amount: number;
    ordering: 'random' | 'sequential';
    isUntimed: boolean;
    timerDuration: number;
    examType: 'JAMB';
  }) => void;
}

export default function JambPracticeSection({ initialSubjectId, onStartPractice }: JambPracticeSectionProps) {
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(initialSubjectId || 'mathematics');
  const [subjectCategory, setSubjectCategory] = useState<JambCategory>('All');
  const [filterType, setFilterType] = useState<'all' | 'topic' | 'year'>('all');
  const [selectedTopic, setSelectedTopic] = useState<string>('All Topics');
  const [selectedYear, setSelectedYear] = useState<number | 'all'>('all');

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

  const finalAmount = isCustomCount && Number(customQuestionCount) > 0 
    ? Math.min(100, Math.max(1, Number(customQuestionCount)))
    : questionCount;

  const handleLaunch = () => {
    onStartPractice({
      subject: currentSubjectMeta.name,
      topic: filterType === 'topic' ? selectedTopic : undefined,
      year: filterType === 'year' ? selectedYear : 'all',
      amount: finalAmount,
      ordering,
      isUntimed,
      timerDuration: isUntimed ? 0 : timerMinutes,
      examType: 'JAMB'
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
          Configure questions, timing, and topic focus. All sessions run through LearnDean's unified Practice Center engine with full answers and explanations.
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
                  <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase w-fit mb-1.5 border ${subj.badgeBg}`}>
                    {subj.code}
                  </span>
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

        {/* 2. Topic / Year Filter Scope */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
            2. Scope Focus
          </label>
          <div className="grid grid-cols-3 gap-2 mb-3">
            <button
              type="button"
              onClick={() => setFilterType('all')}
              className={`py-2 rounded-xl text-xs font-bold border transition-colors cursor-pointer text-center ${
                filterType === 'all'
                  ? 'border-blue-600 bg-blue-600 text-white'
                  : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
              }`}
            >
              All Topics & Years
            </button>
            <button
              type="button"
              onClick={() => setFilterType('topic')}
              className={`py-2 rounded-xl text-xs font-bold border transition-colors cursor-pointer text-center ${
                filterType === 'topic'
                  ? 'border-blue-600 bg-blue-600 text-white'
                  : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
              }`}
            >
              By Topic
            </button>
            <button
              type="button"
              onClick={() => setFilterType('year')}
              className={`py-2 rounded-xl text-xs font-bold border transition-colors cursor-pointer text-center ${
                filterType === 'year'
                  ? 'border-blue-600 bg-blue-600 text-white'
                  : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
              }`}
            >
              By Exam Year
            </button>
          </div>

          {filterType === 'topic' && (
            <select
              value={selectedTopic}
              onChange={e => setSelectedTopic(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-bold cursor-pointer"
            >
              <option value="All Topics">All Topics in {currentSubjectMeta.name}</option>
              {topicsList.map((t, idx) => (
                <option key={t.id || idx} value={t.name}>{t.name}</option>
              ))}
            </select>
          )}

          {filterType === 'year' && (
            <select
              value={selectedYear}
              onChange={e => setSelectedYear(e.target.value === 'all' ? 'all' : Number(e.target.value))}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-bold cursor-pointer"
            >
              <option value="all">All Past Years (Mixed)</option>
              {JAMB_YEARS.map(yr => (
                <option key={yr} value={yr}>JAMB {yr} Past Paper</option>
              ))}
            </select>
          )}
        </div>

        {/* 3. Number of Questions */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
            3. Number of Questions
          </label>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-1.5 sm:gap-2">
            {[5, 10, 20, 30, 40, 50].map(count => (
              <button
                key={count}
                type="button"
                onClick={() => {
                  setQuestionCount(count);
                  setIsCustomCount(false);
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
              onClick={() => setIsCustomCount(true)}
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

        {/* 4. Ordering & Timing */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Question Ordering */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
              4. Question Order
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

          {/* Timing Mode */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
              5. Timing
            </label>
            <div className="grid grid-cols-2 gap-2 mb-2">
              <button
                type="button"
                onClick={() => setIsUntimed(false)}
                className={`py-2.5 px-3 rounded-xl text-xs font-bold border flex items-center justify-center gap-1.5 cursor-pointer ${
                  !isUntimed
                    ? 'border-blue-600 bg-blue-600 text-white'
                    : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                <Clock size={14} />
                <span>Timed</span>
              </button>
              <button
                type="button"
                onClick={() => setIsUntimed(true)}
                className={`py-2.5 px-3 rounded-xl text-xs font-bold border flex items-center justify-center gap-1.5 cursor-pointer ${
                  isUntimed
                    ? 'border-blue-600 bg-blue-600 text-white'
                    : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                <span>Untimed</span>
              </button>
            </div>

            {!isUntimed && (
              <select
                value={timerMinutes}
                onChange={e => setTimerMinutes(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white cursor-pointer"
              >
                <option value={10}>10 Minutes (Speed)</option>
                <option value={15}>15 Minutes</option>
                <option value={20}>20 Minutes (Standard Drill)</option>
                <option value={30}>30 Minutes</option>
                <option value={45}>45 Minutes (Full UTME Pace)</option>
              </select>
            )}
          </div>
        </div>

        {/* Launch Button */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-slate-500">
            <span>Ready to practice <strong>{finalAmount} questions</strong> for <strong>{currentSubjectMeta.name}</strong></span>
          </div>

          <button
            id="jamb-launch-practice-btn"
            type="button"
            onClick={handleLaunch}
            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer hover:scale-[1.02]"
          >
            <span>Start Practice in Practice Center</span>
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
