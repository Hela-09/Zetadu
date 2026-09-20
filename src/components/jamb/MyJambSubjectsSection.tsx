import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  Plus, 
  Trash2, 
  RotateCcw, 
  Save, 
  Calculator, 
  BookOpen, 
  GraduationCap, 
  Play, 
  Search, 
  AlertCircle,
  Sparkles,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import { OFFICIAL_JAMB_SUBJECTS, JambSubject, getJambSubjectByName, JAMB_CATEGORIES, JambCategory } from '../../data/jambSubjects';
import { jambService } from '../../services/jambService';
import { useAuth } from '../../contexts/AuthContext';

interface MyJambSubjectsSectionProps {
  onStartCbtWithSubjects: (subjects: string[]) => void;
  onOpenCourseCombination: () => void;
  onOpenSubjectStudy: (subjectId: string) => void;
  onOpenSubjectPractice: (subjectId: string) => void;
}

export const MyJambSubjectsSection: React.FC<MyJambSubjectsSectionProps> = ({
  onStartCbtWithSubjects,
  onOpenCourseCombination,
  onOpenSubjectStudy,
  onOpenSubjectPractice
}) => {
  const { user } = useAuth();
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>(['English Language', 'Mathematics', 'Physics', 'Chemistry']);
  const [isSaved, setIsSaved] = useState(true);
  const [saveToast, setSaveToast] = useState(false);
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [activeSlotIndex, setActiveSlotIndex] = useState<number | null>(null);
  const [pickerSearch, setPickerSearch] = useState('');
  const [pickerCategory, setPickerCategory] = useState<JambCategory>('All');

  // Load saved subjects on initial mount and when user auth state updates
  useEffect(() => {
    const current = jambService.getUserJambSubjects();
    setSelectedSubjects(current);

    // Attempt remote sync using authenticated user UID
    jambService.loadRemoteUserJambSubjects().then(remote => {
      if (remote && remote.length === 4) {
        setSelectedSubjects(remote);
      }
    });

    const handleSubjectsChange = (e: any) => {
      if (e.detail?.subjects) {
        setSelectedSubjects(e.detail.subjects);
        setIsSaved(true);
      }
    };

    window.addEventListener('learndean-jamb-subjects-changed', handleSubjectsChange);
    return () => window.removeEventListener('learndean-jamb-subjects-changed', handleSubjectsChange);
  }, [user?.uid]);

  const handleOpenPickerForSlot = (slotIndex: number) => {
    setActiveSlotIndex(slotIndex);
    setPickerSearch('');
    setPickerCategory('All');
    setIsPickerOpen(true);
  };

  const handleSelectSubjectFromPicker = async (subject: JambSubject) => {
    if (activeSlotIndex === null) return;
    
    // English is fixed at index 0
    if (subject.id === 'english' || subject.name === 'English Language') {
      setIsPickerOpen(false);
      return;
    }

    const newSelection = [...selectedSubjects];
    // Check if subject already in another slot
    const existingIndex = newSelection.findIndex(s => s.toLowerCase() === subject.name.toLowerCase() || s.toLowerCase() === subject.id.toLowerCase());
    
    if (existingIndex !== -1 && existingIndex !== activeSlotIndex) {
      // Swap or replace
      const temp = newSelection[activeSlotIndex];
      newSelection[activeSlotIndex] = subject.name;
      if (temp) {
        newSelection[existingIndex] = temp;
      }
    } else {
      newSelection[activeSlotIndex] = subject.name;
    }

    setSelectedSubjects(newSelection);
    setIsSaved(false);
    setIsPickerOpen(false);

    // Auto save
    await jambService.saveUserJambSubjects(newSelection);
    setIsSaved(true);
    triggerSaveToast();
  };

  const handleRemoveElective = async (index: number) => {
    if (index === 0) return; // Cannot remove English
    const newSelection = selectedSubjects.filter((_, i) => i !== index);
    setSelectedSubjects(newSelection);
    setIsSaved(false);
    await jambService.saveUserJambSubjects(newSelection);
    setIsSaved(true);
    triggerSaveToast();
  };

  const handleSaveExplicitly = async () => {
    await jambService.saveUserJambSubjects(selectedSubjects);
    setIsSaved(true);
    triggerSaveToast();
  };

  const triggerSaveToast = () => {
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2800);
  };

  const handleResetToDefault = async () => {
    const defaultSubs = ['English Language', 'Mathematics', 'Physics', 'Chemistry'];
    setSelectedSubjects(defaultSubs);
    await jambService.saveUserJambSubjects(defaultSubs);
    setIsSaved(true);
    triggerSaveToast();
  };

  // Filter available subjects for picker modal
  const filteredPickerSubjects = OFFICIAL_JAMB_SUBJECTS.filter(s => {
    if (s.id === 'english') return false; // English is already compulsory in slot 0
    const matchesCategory = pickerCategory === 'All' || s.category === pickerCategory;
    const matchesSearch = s.name.toLowerCase().includes(pickerSearch.toLowerCase()) || 
                          s.code.toLowerCase().includes(pickerSearch.toLowerCase()) ||
                          s.description.toLowerCase().includes(pickerSearch.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const isComplete = selectedSubjects.length === 4;

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* HEADER BANNER */}
      <div className="bg-gradient-to-r from-emerald-900/90 via-teal-900/90 to-cyan-950 p-6 md:p-8 rounded-2xl border border-emerald-500/20 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" />
              Official JAMB UTME Subject Configuration
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              My JAMB Subjects
            </h2>
            <p className="text-slate-300 text-sm md:text-base leading-relaxed">
              JAMB mandates <span className="text-emerald-300 font-semibold">English Language</span> for every candidate, plus <span className="text-emerald-300 font-semibold">3 elective subjects</span> strictly aligned with your target degree. Customize, save, and update your combination anytime.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleSaveExplicitly}
              disabled={isSaved}
              className={`px-4 py-2.5 rounded-xl font-medium text-sm flex items-center gap-2 transition shadow-sm ${
                isSaved 
                  ? 'bg-white/10 text-emerald-300 border border-emerald-400/20 cursor-default'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-900/50'
              }`}
            >
              {isSaved ? <CheckCircle2 className="w-4 h-4" /> : <Save className="w-4 h-4" />}
              {isSaved ? 'Saved to Profile' : 'Save Selection'}
            </button>

            <button
              onClick={onOpenCourseCombination}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white border border-white/10 font-medium text-sm flex items-center gap-2 transition backdrop-blur-sm"
            >
              <GraduationCap className="w-4 h-4 text-emerald-400" />
              Verify with IBASS
            </button>
          </div>
        </div>

        {/* STATUS BAR PILL */}
        <div className="mt-6 pt-5 border-t border-white/10 flex flex-wrap items-center justify-between gap-4 text-xs md:text-sm">
          <div className="flex items-center gap-3">
            <div className="flex -space-x-1">
              {[0, 1, 2, 3].map(i => (
                <div 
                  key={i}
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border-2 border-emerald-950 ${
                    selectedSubjects[i] ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {i + 1}
                </div>
              ))}
            </div>
            <span className="text-slate-300">
              {isComplete 
                ? <span className="text-emerald-300 font-semibold">All 4 JAMB Subjects Configured &amp; Active</span>
                : <span className="text-amber-300 font-semibold">{4 - selectedSubjects.length} more subject needed for 4-subject UTME</span>
              }
            </span>
          </div>

          <button
            onClick={handleResetToDefault}
            className="text-slate-400 hover:text-white flex items-center gap-1.5 transition text-xs"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset to Standard Sciences
          </button>
        </div>
      </div>

      {/* SAVE TOAST NOTIFICATION */}
      {saveToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-xl border border-emerald-500/40 shadow-2xl flex items-center gap-3 animate-slideUp">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span className="text-sm font-medium">Your JAMB subjects have been saved successfully!</span>
        </div>
      )}

      {/* 4 SUBJECT SLOTS GRID */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-4">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white flex flex-wrap items-baseline gap-1.5">
            <span>Your 4 Official JAMB Slots</span>
            <span className="text-xs font-normal text-slate-500 dark:text-slate-400">
              (Slot 1 is compulsory; Slots 2–4 are your chosen electives)
            </span>
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* SLOT 1: COMPULSORY ENGLISH LANGUAGE */}
          <div className="relative group bg-white dark:bg-slate-900 rounded-2xl p-5 border-2 border-emerald-500/40 shadow-sm flex flex-col justify-between overflow-hidden">
            <div className="absolute top-0 right-0 bg-emerald-600 text-white text-[11px] font-bold px-3 py-1 rounded-bl-xl tracking-wider uppercase flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" />
              Compulsory
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-600 text-white flex items-center justify-center font-black text-lg shadow-sm">
                  ENG
                </div>
                <div>
                  <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">Slot 1 • All Candidates</span>
                  <h4 className="text-base font-bold text-slate-900 dark:text-white">English Language</h4>
                </div>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
                Comprehension, Lexis &amp; Structure, Concord, Prescribed JAMB Novel &amp; Oral English.
              </p>

              <div className="pt-2 flex flex-wrap gap-2 text-[11px] text-slate-500 dark:text-slate-400">
                <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 font-medium">60 Questions</span>
                <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800">No Calculator</span>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <button
                onClick={() => onOpenSubjectPractice('english')}
                className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 flex items-center gap-1"
              >
                <Play className="w-3.5 h-3.5" />
                Practice
              </button>
              <button
                onClick={() => onOpenSubjectStudy('english')}
                className="text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-emerald-500 flex items-center gap-1"
              >
                <BookOpen className="w-3.5 h-3.5" />
                Study
              </button>
            </div>
          </div>

          {/* SLOTS 2, 3, 4: ELECTIVES */}
          {[1, 2, 3].map(slotIdx => {
            const subjectName = selectedSubjects[slotIdx];
            const subjectMeta = subjectName ? getJambSubjectByName(subjectName) : null;

            if (subjectMeta) {
              return (
                <div 
                  key={slotIdx}
                  className="relative group bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-emerald-500/50 transition flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${subjectMeta.color} text-white flex items-center justify-center font-black text-lg shadow-sm`}>
                          {subjectMeta.code}
                        </div>
                        <div>
                          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Slot {slotIdx + 1} • Elective</span>
                          <h4 className="text-base font-bold text-slate-900 dark:text-white line-clamp-1">{subjectMeta.name}</h4>
                        </div>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
                      {subjectMeta.description}
                    </p>

                    <div className="pt-2 flex flex-wrap gap-2 text-[11px] text-slate-500 dark:text-slate-400">
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 font-medium">40 Questions</span>
                      {subjectMeta.hasCalculator ? (
                        <span className="px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 flex items-center gap-1">
                          <Calculator className="w-3 h-3" />
                          Calculator
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800">Standard</span>
                      )}
                    </div>
                  </div>

                  <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                    <button
                      onClick={() => handleOpenPickerForSlot(slotIdx)}
                      className="text-xs font-medium text-emerald-600 dark:text-emerald-400 hover:underline"
                    >
                      Change
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onOpenSubjectPractice(subjectMeta.id)}
                        title="Practice this subject"
                        className="p-1.5 rounded-lg text-slate-500 hover:text-emerald-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                      >
                        <Play className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleRemoveElective(slotIdx)}
                        title="Remove subject"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            }

            // EMPTY SLOT
            return (
              <div 
                key={slotIdx}
                onClick={() => handleOpenPickerForSlot(slotIdx)}
                className="bg-slate-50/50 dark:bg-slate-900/30 rounded-2xl p-6 border-2 border-dashed border-slate-300 dark:border-slate-800 hover:border-emerald-500 dark:hover:border-emerald-500 cursor-pointer transition flex flex-col items-center justify-center text-center group min-h-[220px]"
              >
                <div className="w-12 h-12 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 group-hover:bg-emerald-600 group-hover:text-white transition flex items-center justify-center mb-3">
                  <Plus className="w-6 h-6" />
                </div>
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                  Slot {slotIdx + 1} Empty
                </span>
                <p className="text-sm font-bold text-slate-800 dark:text-slate-200 group-hover:text-emerald-600 transition">
                  Choose 3rd or 4th Subject
                </p>
                <span className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Click to select from 26 official subjects
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* QUICK LAUNCH CALLOUT */}
      <div className="bg-slate-900 text-white p-4 sm:p-6 rounded-2xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 sm:gap-6 shadow-md w-full min-w-0">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-4 h-4 shrink-0" />
            Synchronized Full-Mock CBT Engine
          </div>
          <h4 className="text-base sm:text-lg font-bold">
            Ready to test your {selectedSubjects.length}-subject combination?
          </h4>
          <p className="text-slate-300 text-xs md:text-sm">
            Simulates the exact JAMB 180-question CBT exam with timer, question navigation grid, and official calculator support for your active combination: <span className="text-white font-medium">{selectedSubjects.join(' • ')}</span>.
          </p>
        </div>

        <button
          onClick={() => onStartCbtWithSubjects(selectedSubjects)}
          className="w-full md:w-auto px-5 sm:px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 transition shadow-lg shadow-emerald-500/20 whitespace-nowrap cursor-pointer shrink-0"
        >
          <Play className="w-4 h-4 fill-current" />
          Launch My 4-Subject Mock CBT
        </button>
      </div>

      {/* SUBJECT PICKER MODAL */}
      {isPickerOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl max-w-3xl w-full max-h-[92vh] sm:max-h-[88vh] border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col overflow-hidden animate-scaleUp">
            {/* MODAL HEADER */}
            <div className="p-4 sm:p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
              <div className="min-w-0">
                <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white truncate">
                  Select Subject for Slot {(activeSlotIndex ?? 0) + 1}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 sm:mt-1 truncate">
                  Choose from all 26 official Joint Admissions and Matriculation Board UTME subjects
                </p>
              </div>
              <button
                onClick={() => setIsPickerOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center justify-center transition shrink-0"
              >
                ✕
              </button>
            </div>

            {/* SEARCH AND CATEGORY FILTER */}
            <div className="p-3 sm:p-4 bg-slate-50 dark:bg-slate-950/40 border-b border-slate-100 dark:border-slate-800 space-y-2 sm:space-y-3">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search by subject name, code (e.g. MTH, ECN, BIO)..."
                  value={pickerSearch}
                  onChange={e => setPickerSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* CATEGORIES PILLS */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
                {JAMB_CATEGORIES.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setPickerCategory(cat)}
                    className={`px-2.5 sm:px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition ${
                      pickerCategory === cat 
                        ? 'bg-emerald-600 text-white'
                        : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* SUBJECTS LIST */}
            <div className="p-3 sm:p-6 overflow-y-auto space-y-2.5 sm:space-y-3 flex-1">
              {filteredPickerSubjects.length === 0 ? (
                <div className="text-center py-12 text-slate-500">
                  <p className="font-semibold text-sm">No official subjects match your search.</p>
                  <p className="text-xs text-slate-400 mt-1">Try clearing filters or search terms.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {filteredPickerSubjects.map(sub => {
                    const isAlreadySelected = selectedSubjects.some(
                      s => s.toLowerCase() === sub.name.toLowerCase() || s.toLowerCase() === sub.id.toLowerCase()
                    );

                    return (
                      <button
                        key={sub.id}
                        onClick={() => handleSelectSubjectFromPicker(sub)}
                        className={`text-left p-4 rounded-xl border transition flex items-start gap-3.5 ${
                          isAlreadySelected 
                            ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-500/40 text-emerald-900 dark:text-emerald-100'
                            : 'bg-white dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/60 hover:border-emerald-500 hover:shadow-md'
                        }`}
                      >
                        <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${sub.color} text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-sm`}>
                          {sub.code}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1">
                            <h5 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                              {sub.name}
                            </h5>
                            {sub.hasCalculator && (
                              <span className="text-[10px] bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 px-1.5 py-0.5 rounded font-medium flex items-center gap-0.5 shrink-0">
                                <Calculator className="w-2.5 h-2.5" />
                                Calc
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-slate-500 dark:text-slate-400">
                            {sub.category}
                          </span>
                          <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-1 mt-1">
                            {sub.description}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* MODAL FOOTER */}
            <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 flex items-center justify-between text-xs text-slate-500">
              <span>Showing {filteredPickerSubjects.length} of 25 elective subjects</span>
              <button
                onClick={() => setIsPickerOpen(false)}
                className="px-4 py-2 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300 font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
