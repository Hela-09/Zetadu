import React, { useState, useEffect } from 'react';
import { 
  Check, 
  Clock, 
  Calculator, 
  Flag, 
  Layers, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle,
  Search,
  RotateCcw,
  BookOpen,
  GraduationCap
} from 'lucide-react';
import { OFFICIAL_JAMB_SUBJECTS, getJambSubjectByName, JAMB_CATEGORIES, JambCategory } from '../../data/jambSubjects';
import { jambService } from '../../services/jambService';

interface JambCbtSectionProps {
  initialSubjects?: string[];
  onStartCbt: (config: {
    subjects: string[];
    amount: number;
    timerDuration: number;
    isUntimed: boolean;
    examType: 'JAMB';
  }) => void;
  onNavigateToMySubjects?: () => void;
  onNavigateToCourseCombination?: () => void;
}

interface FacultyPreset {
  id: string;
  name: string;
  description: string;
  subjects: string[]; // subject names
}

const FACULTY_PRESETS: FacultyPreset[] = [
  {
    id: 'medicine',
    name: 'Medicine & Health Sciences',
    description: 'MBBS, Pharmacy, Nursing, Medical Lab Science, Anatomy',
    subjects: ['English Language', 'Biology', 'Chemistry', 'Physics']
  },
  {
    id: 'engineering',
    name: 'Engineering & Technology',
    description: 'Mechanical, Electrical, Civil, Computer Engineering, Software Eng',
    subjects: ['English Language', 'Mathematics', 'Physics', 'Chemistry']
  },
  {
    id: 'law',
    name: 'Law & Legal Studies',
    description: 'Civil Law, Common Law, English & Literary Studies',
    subjects: ['English Language', 'Literature in English', 'Government', 'Christian Religious Studies']
  },
  {
    id: 'social',
    name: 'Commercial & Management Sciences',
    description: 'Accounting, Economics, Business Admin, Banking & Finance',
    subjects: ['English Language', 'Economics', 'Mathematics', 'Principles of Accounts']
  },
  {
    id: 'agriculture',
    name: 'Agricultural & Environmental Sciences',
    description: 'Agriculture, Forestry, Food Science, Architecture, Estate Mgt',
    subjects: ['English Language', 'Agricultural Science', 'Chemistry', 'Biology']
  }
];

export default function JambCbtSection({ 
  initialSubjects, 
  onStartCbt,
  onNavigateToMySubjects,
  onNavigateToCourseCombination
}: JambCbtSectionProps) {
  // Load saved subjects from service or prop
  const [selectedElectives, setSelectedElectives] = useState<string[]>(() => {
    const base = initialSubjects || jambService.getUserJambSubjects();
    return base.filter(s => s !== 'English Language').slice(0, 3);
  });

  const [examLengthMode, setExamLengthMode] = useState<'standard' | 'mini' | 'express'>('mini');
  const [examDurationMinutes, setExamDurationMinutes] = useState<number>(60);
  const [isUntimed, setIsUntimed] = useState<boolean>(false);
  const [subjectSearch, setSubjectSearch] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<JambCategory>('All');

  // Sync if initialSubjects changes
  useEffect(() => {
    if (initialSubjects && initialSubjects.length > 0) {
      const electives = initialSubjects.filter(s => s !== 'English Language').slice(0, 3);
      setSelectedElectives(electives);
    }
  }, [initialSubjects]);

  const toggleElective = (subjectName: string) => {
    if (subjectName === 'English Language') return; // Cannot deselect English

    if (selectedElectives.includes(subjectName)) {
      if (selectedElectives.length <= 1) {
        alert('You must select at least 1 elective subject (up to 3 for standard 4-subject UTME combination).');
        return;
      }
      setSelectedElectives(prev => prev.filter(s => s !== subjectName));
    } else {
      if (selectedElectives.length >= 3) {
        alert('JAMB UTME combination allows a maximum of 4 subjects total (English + 3 electives). Remove one to add this.');
        return;
      }
      setSelectedElectives(prev => [...prev, subjectName]);
    }
  };

  const applyPreset = (preset: FacultyPreset) => {
    const electives = preset.subjects.filter(s => s !== 'English Language');
    setSelectedElectives(electives);
  };

  const handleResetToSaved = () => {
    const saved = jambService.getUserJambSubjects();
    setSelectedElectives(saved.filter(s => s !== 'English Language').slice(0, 3));
  };

  const allSelectedSubjects = ['English Language', ...selectedElectives];

  // Check if any subject has a calculator
  const subjectsWithCalculator = allSelectedSubjects.filter(name => {
    const meta = getJambSubjectByName(name);
    return meta?.hasCalculator;
  });

  // Filter available elective subjects
  const filteredElectiveSubjects = OFFICIAL_JAMB_SUBJECTS.filter(s => {
    if (s.id === 'english') return false;
    const matchesCategory = selectedCategory === 'All' || s.category === selectedCategory;
    const matchesSearch = 
      s.name.toLowerCase().includes(subjectSearch.toLowerCase()) ||
      s.code.toLowerCase().includes(subjectSearch.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Calculate total question count
  const questionCount = examLengthMode === 'standard' 
    ? (60 + selectedElectives.length * 40) // 180 questions
    : examLengthMode === 'mini'
    ? (20 + selectedElectives.length * 20) // 80 questions
    : (10 + selectedElectives.length * 10); // 40 questions

  const handleLaunch = () => {
    onStartCbt({
      subjects: allSelectedSubjects,
      amount: questionCount,
      timerDuration: isUntimed ? 0 : examDurationMinutes,
      isUntimed,
      examType: 'JAMB'
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn">
      {/* Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-[11px] font-extrabold bg-blue-500 text-white uppercase tracking-wider">
              Full UTME CBT Simulation
            </span>
            <span className="text-xs text-blue-200">Authentic 400-Mark Scoring Engine</span>
          </div>

          {onNavigateToMySubjects && (
            <button
              onClick={onNavigateToMySubjects}
              className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-semibold underline"
            >
              Configure in My JAMB Subjects →
            </button>
          )}
        </div>

        <h3 className="text-2xl sm:text-3xl font-black">Official 4-Subject JAMB CBT Mock</h3>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
          Simulate the true computer-based examination experience with your 4 subject combinations, live multi-subject switching tabs, onscreen calculator, flagged question review, and comprehensive performance breakdown out of 400 marks.
        </p>

        {/* Feature badges */}
        <div className="flex flex-wrap gap-2 pt-2 text-xs">
          <span className="px-3 py-1.5 rounded-xl bg-white/10 backdrop-blur-xs flex items-center gap-1.5 font-medium">
            <Calculator size={14} className="text-amber-300" />
            Standard JAMB 8-digit Calculator
          </span>
          <span className="px-3 py-1.5 rounded-xl bg-white/10 backdrop-blur-xs flex items-center gap-1.5 font-medium">
            <Layers size={14} className="text-blue-300" />
            Multi-Subject Tabs Navigation
          </span>
          <span className="px-3 py-1.5 rounded-xl bg-white/10 backdrop-blur-xs flex items-center gap-1.5 font-medium">
            <Flag size={14} className="text-rose-300" />
            Flagged Review Navigator
          </span>
        </div>
      </div>

      {/* Calculator Notification Banner if applicable */}
      {subjectsWithCalculator.length > 0 && (
        <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-2xl p-4 flex items-center justify-between gap-3 text-xs text-amber-800 dark:text-amber-200">
          <div className="flex items-center gap-2">
            <Calculator className="w-5 h-5 text-amber-600 shrink-0" />
            <span>
              <strong>Official Onscreen Calculator Enabled</strong> for: {subjectsWithCalculator.join(', ')}.
            </span>
          </div>
          <span className="text-[11px] font-semibold text-amber-600 dark:text-amber-400 shrink-0">
            Active in CBT Engine
          </span>
        </div>
      )}

      {/* Preset Combinations */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            Quick Faculty Subject Presets
          </h4>
          {onNavigateToCourseCombination && (
            <button
              onClick={onNavigateToCourseCombination}
              className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 font-medium"
            >
              <GraduationCap className="w-3.5 h-3.5" />
              Check IBASS Course Requirements
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {FACULTY_PRESETS.map(preset => {
            const isMatch = preset.subjects.every(s => allSelectedSubjects.includes(s)) && allSelectedSubjects.length === preset.subjects.length;
            return (
              <div
                key={preset.id}
                onClick={() => applyPreset(preset)}
                className={`p-4 rounded-2xl border text-left cursor-pointer transition-all flex flex-col justify-between ${
                  isMatch
                    ? 'border-blue-600 bg-blue-50/60 dark:bg-blue-950/30 ring-2 ring-blue-600/30'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 bg-slate-50/50 dark:bg-slate-800/40'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-slate-900 dark:text-white text-sm">
                      {preset.name}
                    </span>
                    {isMatch && (
                      <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1">
                        <Check size={13} /> Active
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 mb-3 line-clamp-1">{preset.description}</p>
                </div>
                <div className="flex flex-wrap gap-1">
                  {preset.subjects.map(s => (
                    <span key={s} className="px-2 py-0.5 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[10px] font-semibold text-slate-700 dark:text-slate-300">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Subject Combination Selector */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-6">
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Selected Combination ({allSelectedSubjects.length} of 4 Subjects)
            </label>
            <div className="flex items-center gap-3">
              <button
                onClick={handleResetToSaved}
                className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-white flex items-center gap-1"
                title="Reload from My JAMB Subjects"
              >
                <RotateCcw className="w-3 h-3" />
                Reset to Saved Subjects
              </button>
              <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                English is compulsory for all candidates
              </span>
            </div>
          </div>

          {/* ACTIVE COMBINATION SUMMARY CHIPS */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-6">
            {/* Slot 1: English */}
            <div className="p-3.5 rounded-2xl border-2 border-blue-600 bg-blue-50/70 dark:bg-blue-950/40 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-black uppercase text-blue-700 dark:text-blue-300">Slot 1 • Compulsory</span>
                <p className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">Use of English</p>
              </div>
              <CheckCircle2 size={18} className="text-blue-600 shrink-0" />
            </div>

            {/* Slots 2-4: Chosen Electives */}
            {[0, 1, 2].map(slotIdx => {
              const electiveName = selectedElectives[slotIdx];
              const meta = electiveName ? getJambSubjectByName(electiveName) : null;

              if (electiveName && meta) {
                return (
                  <div key={slotIdx} className="p-3.5 rounded-2xl border border-emerald-500/50 bg-emerald-50/40 dark:bg-emerald-950/20 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase text-emerald-700 dark:text-emerald-400">Slot {slotIdx + 2} • {meta.code}</span>
                      <p className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white truncate">{electiveName}</p>
                    </div>
                    {meta.hasCalculator && (
                      <span title="Calculator allowed">
                        <Calculator size={14} className="text-amber-500 shrink-0" />
                      </span>
                    )}
                  </div>
                );
              }

              return (
                <div key={slotIdx} className="p-3.5 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 flex items-center justify-center text-slate-400 text-xs">
                  + Select Slot {slotIdx + 2}
                </div>
              );
            })}
          </div>

          {/* SEARCH & CATEGORY FILTER FOR ELECTIVES */}
          <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Filter official electives by name or code..."
                  value={subjectSearch}
                  onChange={e => setSubjectSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center gap-1 overflow-x-auto pb-1 text-[11px] no-scrollbar">
                {JAMB_CATEGORIES.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-2.5 py-1.5 rounded-lg font-medium whitespace-nowrap transition ${
                      selectedCategory === cat 
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* ELECTIVES GRID */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 max-h-60 overflow-y-auto pr-1">
              {filteredElectiveSubjects.map(subj => {
                const isSelected = selectedElectives.includes(subj.name);
                return (
                  <button
                    key={subj.id}
                    type="button"
                    onClick={() => toggleElective(subj.name)}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/30 text-slate-900 dark:text-white ring-1 ring-blue-600/30'
                        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/40 text-slate-600 dark:text-slate-300 hover:border-slate-300'
                    }`}
                  >
                    <div className="min-w-0 pr-1">
                      <div className="flex items-center gap-1">
                        <span className="text-[10px] text-slate-400 uppercase font-black">{subj.code}</span>
                        {subj.hasCalculator && (
                          <Calculator size={11} className="text-amber-500" />
                        )}
                      </div>
                      <p className="font-bold text-xs truncate">{subj.name}</p>
                    </div>
                    {isSelected ? (
                      <CheckCircle2 size={16} className="text-blue-600 shrink-0" />
                    ) : (
                      <div className="w-3.5 h-3.5 rounded-full border border-slate-300 dark:border-slate-600 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Exam Length & Timing */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
              Exam Format Length
            </label>
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => {
                  setExamLengthMode('standard');
                  setExamDurationMinutes(120);
                }}
                className={`w-full p-3 rounded-2xl border text-left cursor-pointer transition-colors ${
                  examLengthMode === 'standard'
                    ? 'border-blue-600 bg-blue-50/60 dark:bg-blue-950/30 font-bold'
                    : 'border-slate-200 dark:border-slate-800'
                }`}
              >
                <div className="flex items-center justify-between text-xs">
                  <span>Full Official UTME Length</span>
                  <span className="text-blue-600">180 Questions</span>
                </div>
                <p className="text-[11px] text-slate-500 font-normal mt-0.5">
                  60 English + 3x40 Electives (Exact exam standard)
                </p>
              </button>

              <button
                type="button"
                onClick={() => {
                  setExamLengthMode('mini');
                  setExamDurationMinutes(60);
                }}
                className={`w-full p-3 rounded-2xl border text-left cursor-pointer transition-colors ${
                  examLengthMode === 'mini'
                    ? 'border-blue-600 bg-blue-50/60 dark:bg-blue-950/30 font-bold'
                    : 'border-slate-200 dark:border-slate-800'
                }`}
              >
                <div className="flex items-center justify-between text-xs">
                  <span>Standard Mini Mock (Recommended)</span>
                  <span className="text-blue-600">80 Questions</span>
                </div>
                <p className="text-[11px] text-slate-500 font-normal mt-0.5">
                  20 questions per subject, 400 marks scaled
                </p>
              </button>

              <button
                type="button"
                onClick={() => {
                  setExamLengthMode('express');
                  setExamDurationMinutes(30);
                }}
                className={`w-full p-3 rounded-2xl border text-left cursor-pointer transition-colors ${
                  examLengthMode === 'express'
                    ? 'border-blue-600 bg-blue-50/60 dark:bg-blue-950/30 font-bold'
                    : 'border-slate-200 dark:border-slate-800'
                }`}
              >
                <div className="flex items-center justify-between text-xs">
                  <span>Express Drill</span>
                  <span className="text-blue-600">40 Questions</span>
                </div>
                <p className="text-[11px] text-slate-500 font-normal mt-0.5">
                  10 questions per subject (Quick revision)
                </p>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
              Exam Timer
            </label>
            <div className="grid grid-cols-2 gap-2 mb-2">
              <button
                type="button"
                onClick={() => setIsUntimed(false)}
                className={`py-2.5 rounded-xl text-xs font-bold border flex items-center justify-center gap-1.5 cursor-pointer ${
                  !isUntimed
                    ? 'border-blue-600 bg-blue-600 text-white'
                    : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                <Clock size={14} />
                <span>Timed Exam</span>
              </button>
              <button
                type="button"
                onClick={() => setIsUntimed(true)}
                className={`py-2.5 rounded-xl text-xs font-bold border flex items-center justify-center gap-1.5 cursor-pointer ${
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
                value={examDurationMinutes}
                onChange={e => setExamDurationMinutes(Number(e.target.value))}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white cursor-pointer"
              >
                <option value={120}>120 Minutes (2 Hours - Standard UTME)</option>
                <option value={90}>90 Minutes (1.5 Hours)</option>
                <option value={60}>60 Minutes (1 Hour)</option>
                <option value={45}>45 Minutes (Fast Pace)</option>
                <option value={30}>30 Minutes (Sprint Drill)</option>
              </select>
            )}

            <div className="mt-4 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 space-y-1">
              <p className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Sparkles size={14} className="text-amber-500" />
                UTME Mock Ready:
              </p>
              <p>• Total Questions: <strong>{questionCount}</strong> across <strong>{allSelectedSubjects.length} subjects</strong></p>
              <p>• Max Score: <strong>400 Marks</strong></p>
            </div>
          </div>
        </div>

        {/* Launch Button */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-slate-500">
            <span>Subjects: <strong>{allSelectedSubjects.join(', ')}</strong></span>
          </div>

          <button
            id="jamb-launch-cbt-exam-btn"
            type="button"
            onClick={handleLaunch}
            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer hover:scale-[1.02]"
          >
            <span>Launch JAMB CBT Mock Exam</span>
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
