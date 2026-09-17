import React, { useState } from 'react';
import { 
  Search, 
  BookOpen, 
  Play, 
  History, 
  Calculator, 
  Plus, 
  Check, 
  Sparkles,
  Layers,
  GraduationCap
} from 'lucide-react';
import { 
  OFFICIAL_JAMB_SUBJECTS, 
  JambSubject, 
  JAMB_CATEGORIES, 
  JambCategory 
} from '../../data/jambSubjects';
import { jambService } from '../../services/jambService';

interface AllJambSubjectsSectionProps {
  onOpenStudy: (subjectId: string) => void;
  onOpenPastQuestions: (subjectId: string) => void;
  onOpenPractice: (subjectId: string) => void;
  onOpenCourseCombination: () => void;
}

export const AllJambSubjectsSection: React.FC<AllJambSubjectsSectionProps> = ({
  onOpenStudy,
  onOpenPastQuestions,
  onOpenPractice,
  onOpenCourseCombination
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<JambCategory>('All');
  const [userSubjects, setUserSubjects] = useState<string[]>(() => jambService.getUserJambSubjects());

  // Filter subjects based on search term and category
  const filteredSubjects = OFFICIAL_JAMB_SUBJECTS.filter(s => {
    const matchesCategory = selectedCategory === 'All' || s.category === selectedCategory;
    const matchesSearch = 
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.category.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const isSubjectInUserList = (subject: JambSubject): boolean => {
    return userSubjects.some(
      s => s.toLowerCase() === subject.name.toLowerCase() || s.toLowerCase() === subject.id.toLowerCase()
    );
  };

  const handleToggleMySubjects = async (subject: JambSubject) => {
    if (subject.id === 'english') return; // English is permanent

    let updated: string[];
    const alreadyIn = isSubjectInUserList(subject);

    if (alreadyIn) {
      updated = userSubjects.filter(
        s => s.toLowerCase() !== subject.name.toLowerCase() && s.toLowerCase() !== subject.id.toLowerCase()
      );
    } else {
      if (userSubjects.length >= 4) {
        // Replace last elective
        updated = [...userSubjects.slice(0, 3), subject.name];
      } else {
        updated = [...userSubjects, subject.name];
      }
    }

    setUserSubjects(updated);
    await jambService.saveUserJambSubjects(updated);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* HEADER & SEARCH BAR */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              <Layers className="w-4 h-4" />
              Complete JAMB UTME Subject Catalog
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white">
              All 26 Official JAMB Subjects
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              Search and explore the comprehensive syllabus, past questions, and practice drills for every accredited UTME subject.
            </p>
          </div>

          <button
            onClick={onOpenCourseCombination}
            className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-medium text-xs md:text-sm flex items-center gap-2 transition self-start md:self-auto"
          >
            <GraduationCap className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            Check IBASS Course Requirements
          </button>
        </div>

        {/* SEARCH INPUT */}
        <div className="relative">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search all 26 subjects by name, acronym (e.g. MTH, ECN, BIO, COM, ACC), or topic..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              Clear
            </button>
          )}
        </div>

        {/* CATEGORY FILTER PILLS */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs no-scrollbar">
          {JAMB_CATEGORIES.map(category => {
            const isSelected = selectedCategory === category;
            const count = category === 'All' 
              ? OFFICIAL_JAMB_SUBJECTS.length 
              : OFFICIAL_JAMB_SUBJECTS.filter(s => s.category === category).length;

            return (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-xl font-medium whitespace-nowrap transition flex items-center gap-2 ${
                  isSelected
                    ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/30'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                <span>{category}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isSelected ? 'bg-emerald-700 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400'}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* RESULTS COUNT & SUBTITLE */}
      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-1">
        <span>Showing {filteredSubjects.length} of {OFFICIAL_JAMB_SUBJECTS.length} subjects</span>
        <span>Click on any subject card to start studying or practice past questions</span>
      </div>

      {/* SUBJECT CARDS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSubjects.map(subject => {
          const inMySubjects = isSubjectInUserList(subject);

          return (
            <div
              key={subject.id}
              className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-lg hover:border-emerald-500/40 transition-all flex flex-col justify-between group"
            >
              <div className="space-y-4">
                {/* CARD TOP ROW */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${subject.color} text-white flex items-center justify-center font-black text-xl shadow-md shrink-0 group-hover:scale-105 transition-transform`}>
                      {subject.code}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                          {subject.category}
                        </span>
                        {subject.compulsory && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                            Compulsory
                          </span>
                        )}
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-0.5 line-clamp-1">
                        {subject.name}
                      </h3>
                    </div>
                  </div>
                </div>

                {/* DESCRIPTION */}
                <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed">
                  {subject.description}
                </p>

                {/* METADATA PILLS */}
                <div className="flex flex-wrap items-center gap-2 text-xs pt-1">
                  <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-medium">
                    {subject.totalStandardQuestions} Standard Questions
                  </span>

                  {subject.hasCalculator ? (
                    <span className="px-2.5 py-1 rounded-lg bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 font-medium flex items-center gap-1">
                      <Calculator className="w-3.5 h-3.5" />
                      Calculator Allowed
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500">
                      Standard CBT
                    </span>
                  )}
                </div>
              </div>

              {/* CARD BOTTOM ACTION BUTTONS */}
              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => onOpenStudy(subject.id)}
                    className="py-2 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 text-xs font-semibold flex items-center justify-center gap-1.5 transition"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    Study
                  </button>

                  <button
                    onClick={() => onOpenPastQuestions(subject.id)}
                    className="py-2 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950/40 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 text-xs font-semibold flex items-center justify-center gap-1.5 transition"
                  >
                    <History className="w-3.5 h-3.5" />
                    Past Qs
                  </button>

                  <button
                    onClick={() => onOpenPractice(subject.id)}
                    className="py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition shadow-sm"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    Practice
                  </button>
                </div>

                {/* ADD TO MY SUBJECTS TOGGLE */}
                {!subject.compulsory && (
                  <button
                    onClick={() => handleToggleMySubjects(subject)}
                    className={`w-full py-2 px-3 rounded-xl text-xs font-medium flex items-center justify-center gap-1.5 transition border ${
                      inMySubjects
                        ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800'
                        : 'bg-transparent hover:bg-slate-50 dark:hover:bg-slate-800/40 text-slate-500 dark:text-slate-400 border-dashed border-slate-300 dark:border-slate-700'
                    }`}
                  >
                    {inMySubjects ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        In My JAMB Subjects
                      </>
                    ) : (
                      <>
                        <Plus className="w-3.5 h-3.5" />
                        Set as one of My JAMB Electives
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {filteredSubjects.length === 0 && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 text-center border border-slate-200 dark:border-slate-800 space-y-3">
          <p className="text-slate-800 dark:text-slate-200 font-bold text-base">
            No subjects matched "{searchTerm}"
          </p>
          <p className="text-xs text-slate-500">
            Please search by subject name, code, or click 'All' in the category filters.
          </p>
          <button
            onClick={() => { setSearchTerm(''); setSelectedCategory('All'); }}
            className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-500"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
};
