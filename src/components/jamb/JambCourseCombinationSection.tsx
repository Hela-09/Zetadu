import React, { useState } from 'react';
import { 
  GraduationCap, 
  Search, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  ArrowRight, 
  BookOpen, 
  HelpCircle, 
  Sparkles,
  ShieldCheck,
  Building2,
  FileCheck,
  Check
} from 'lucide-react';
import { 
  OFFICIAL_IBASS_COURSES, 
  IbassCourse, 
  IBASS_FACULTIES, 
  IbassFaculty, 
  verifyJambCombination, 
  IbassVerificationResult 
} from '../../data/jambIbass';
import { jambService } from '../../services/jambService';

interface JambCourseCombinationSectionProps {
  onGoToMySubjects: () => void;
  onStartCbtWithCombination: (subjects: string[]) => void;
}

export const JambCourseCombinationSection: React.FC<JambCourseCombinationSectionProps> = ({
  onGoToMySubjects,
  onStartCbtWithCombination
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFaculty, setSelectedFaculty] = useState<IbassFaculty>('All Faculties');
  const [selectedCourse, setSelectedCourse] = useState<IbassCourse>(OFFICIAL_IBASS_COURSES[0]);
  const [userSubjects, setUserSubjects] = useState<string[]>(() => jambService.getUserJambSubjects());
  const [applySuccessToast, setApplySuccessToast] = useState(false);

  // Filter courses
  const filteredCourses = OFFICIAL_IBASS_COURSES.filter(c => {
    const matchesFaculty = selectedFaculty === 'All Faculties' || c.faculty === selectedFaculty;
    const matchesSearch = 
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.requiredElectives.some(e => e.toLowerCase().includes(searchTerm.toLowerCase())) ||
      c.faculty.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFaculty && matchesSearch;
  });

  // Run official IBASS verification for selected course against user's current subjects
  const verification: IbassVerificationResult = verifyJambCombination(userSubjects, selectedCourse);

  const handleApplyCombination = async () => {
    // English + the course's 3 required electives
    const newCombination = ['English Language', ...selectedCourse.requiredElectives.slice(0, 3)];
    setUserSubjects(newCombination);
    await jambService.saveUserJambSubjects(newCombination);
    setApplySuccessToast(true);
    setTimeout(() => setApplySuccessToast(false), 3000);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* HEADER BANNER */}
      <div className="bg-gradient-to-r from-blue-900/90 via-indigo-900/90 to-slate-900 p-6 md:p-8 rounded-3xl border border-indigo-500/20 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2 text-indigo-300 text-xs font-semibold uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" />
              Official JAMB / IBASS Requirements Guide
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              Course &amp; Subject Combination Checker
            </h2>
            <p className="text-indigo-200 text-sm md:text-base leading-relaxed">
              Verify your UTME subject choices against official JAMB IBASS brochure regulations before registering. Avoid disqualification and ensure 100% admission compliance.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15 max-w-xs text-xs space-y-2">
            <span className="font-semibold text-emerald-300 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              Your Active JAMB Subjects:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {userSubjects.map((sub, i) => (
                <span key={i} className="px-2 py-0.5 rounded-md bg-white/20 text-white font-medium">
                  {sub}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* TOAST ON APPLY */}
      {applySuccessToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3.5 rounded-2xl border border-emerald-500 shadow-2xl flex items-center gap-3 animate-slideUp">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span className="text-sm font-semibold">
            Applied {selectedCourse.name} combination to your JAMB profile!
          </span>
        </div>
      )}

      {/* SEARCH AND FACULTY FILTER BAR */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2 relative">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search intended course (e.g. Medicine, Computer Science, Law, Accounting, Nursing)..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <select
              value={selectedFaculty}
              onChange={e => setSelectedFaculty(e.target.value as IbassFaculty)}
              aria-label="Filter courses by faculty"
              className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {IBASS_FACULTIES.map(fac => (
                <option key={fac} value={fac}>{fac}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* MAIN TWO-COLUMN LAYOUT: COURSE SELECTOR & DETAILED IBASS VERIFICATION */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: LIST OF COURSES (4 COLS) */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col max-h-[720px]">
          <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Courses ({filteredCourses.length})
            </span>
            <span className="text-[11px] text-slate-400">Click to inspect</span>
          </div>

          <div className="overflow-y-auto p-2 space-y-1.5 flex-1 divide-y divide-slate-100 dark:divide-slate-800/60">
            {filteredCourses.map(course => {
              const isSelected = selectedCourse.id === course.id;
              const testVerification = verifyJambCombination(userSubjects, course);

              return (
                <button
                  key={course.id}
                  onClick={() => setSelectedCourse(course)}
                  className={`w-full text-left p-3.5 rounded-2xl transition flex items-start justify-between gap-2 ${
                    isSelected 
                      ? 'bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 text-indigo-950 dark:text-indigo-100'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <div className="space-y-1 min-w-0">
                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                      {course.faculty}
                    </span>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                      {course.name}
                    </h4>
                    <span className="text-xs text-slate-500 dark:text-slate-400 block truncate">
                      Requires: {course.requiredElectives.join(', ')}
                    </span>
                  </div>

                  <div className="shrink-0 mt-1">
                    {testVerification.isCompliant ? (
                      <span className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-[10px] font-bold" title="Matches your subjects">
                        ✓
                      </span>
                    ) : (
                      <span className="w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center text-[10px]" title="Mismatch">
                        •
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* RIGHT COLUMN: OFFICIAL REQUIREMENTS & LIVE VERIFICATION (8 COLS) */}
        <div className="lg:col-span-8 space-y-6">
          {/* VERIFICATION STATUS CARD */}
          <div className={`p-6 rounded-3xl border shadow-sm transition ${
            verification.isCompliant 
              ? verification.status === 'compliant'
                ? 'bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800'
                : 'bg-amber-50/60 dark:bg-amber-950/20 border-amber-300 dark:border-amber-800'
              : 'bg-rose-50/60 dark:bg-rose-950/20 border-rose-300 dark:border-rose-800'
          }`}>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-sm ${
                  verification.isCompliant 
                    ? verification.status === 'compliant' ? 'bg-emerald-600' : 'bg-amber-600'
                    : 'bg-rose-600'
                }`}>
                  {verification.isCompliant 
                    ? verification.status === 'compliant' ? <CheckCircle2 className="w-6 h-6" /> : <AlertTriangle className="w-6 h-6" />
                    : <XCircle className="w-6 h-6" />
                  }
                </div>

                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Live IBASS Verification Assessment
                  </span>
                  <h3 className="text-lg md:text-xl font-black text-slate-900 dark:text-white">
                    {verification.isCompliant 
                      ? verification.status === 'compliant' 
                        ? '100% IBASS Compliant Combination' 
                        : 'Partially Compatible (Recognized Alternative)'
                      : 'Subject Combination Mismatch'}
                  </h3>
                  <p className="text-xs md:text-sm text-slate-700 dark:text-slate-300 mt-1 leading-relaxed">
                    {verification.remarks}
                  </p>
                </div>
              </div>

              <div className="shrink-0 flex items-center md:flex-col justify-end text-right">
                <div className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white">
                  {verification.matchScore}%
                </div>
                <span className="text-xs text-slate-500 font-medium">Match Score</span>
              </div>
            </div>

            {/* ACTION TO FIX IF NOT COMPLIANT */}
            {!verification.isCompliant && (
              <div className="mt-5 pt-4 border-t border-rose-200 dark:border-rose-900/60 flex flex-wrap items-center justify-between gap-3">
                <span className="text-xs text-rose-800 dark:text-rose-300 font-medium">
                  Missing required subjects: <strong>{verification.missingRequiredSubjects.join(', ')}</strong>
                </span>

                <button
                  onClick={handleApplyCombination}
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-1.5 transition shadow-sm"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Auto-Set My Subjects to Match {selectedCourse.code}
                </button>
              </div>
            )}
          </div>

          {/* OFFICIAL IBASS BROCHURE SPECIFICATION */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
              <div>
                <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5" />
                  Faculty of {selectedCourse.faculty}
                </span>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                  {selectedCourse.name}
                </h3>
              </div>

              {selectedCourse.recommendedCutoff && (
                <div className="px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold">
                  Guidance UTME Target: <span className="text-indigo-600 dark:text-indigo-400 font-bold">{selectedCourse.recommendedCutoff}+</span>
                </div>
              )}
            </div>

            {/* MANDATORY 4-SUBJECT UTME REQUIREMENTS */}
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-500" />
                Required JAMB UTME Subject Combination
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                {/* 1. English */}
                <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800">
                  <span className="text-[10px] font-bold uppercase text-emerald-700 dark:text-emerald-400">
                    Compulsory
                  </span>
                  <div className="text-sm font-extrabold text-slate-900 dark:text-white mt-0.5">
                    English Language
                  </div>
                </div>

                {/* 2, 3, 4 Required Electives */}
                {selectedCourse.requiredElectives.map((elective, idx) => (
                  <div key={idx} className="p-3.5 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800">
                    <span className="text-[10px] font-bold uppercase text-indigo-600 dark:text-indigo-400">
                      Elective #{idx + 1}
                    </span>
                    <div className="text-sm font-extrabold text-slate-900 dark:text-white mt-0.5">
                      {elective}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ACCEPTABLE ALTERNATIVES IF ANY */}
            {selectedCourse.acceptableAlternatives && selectedCourse.acceptableAlternatives.length > 0 && (
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 space-y-1.5">
                <h5 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <HelpCircle className="w-3.5 h-3.5 text-amber-500" />
                  Recognized Alternative Subjects
                </h5>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Some faculties accept: <strong className="text-slate-900 dark:text-white">{selectedCourse.acceptableAlternatives.join(', ')}</strong> in place of one elective subject.
                </p>
              </div>
            )}

            {/* O'LEVEL REQUIREMENTS */}
            <div className="space-y-2">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-blue-500" />
                Official O'Level (WAEC / NECO / GCE) Requirements
              </h4>
              <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 leading-relaxed bg-slate-50 dark:bg-slate-950/30 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                {selectedCourse.oLevelRequirements}
              </p>
            </div>

            {/* SPECIAL REMARKS / IBASS NOTES */}
            <div className="space-y-2">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-purple-500" />
                IBASS Special Remarks &amp; Waiver Details
              </h4>
              <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 leading-relaxed bg-slate-50 dark:bg-slate-950/30 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                {selectedCourse.specialRemarks}
              </p>
            </div>

            {/* ACTION BUTTONS */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
              <button
                onClick={handleApplyCombination}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs md:text-sm flex items-center gap-2 transition shadow-md shadow-indigo-600/20"
              >
                <Sparkles className="w-4 h-4" />
                Set My 4 JAMB Subjects to {selectedCourse.name}
              </button>

              <button
                onClick={() => onStartCbtWithCombination(['English Language', ...selectedCourse.requiredElectives])}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs md:text-sm flex items-center gap-2 transition shadow-md shadow-emerald-600/20"
              >
                <span>Launch Mock CBT for this Course</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
