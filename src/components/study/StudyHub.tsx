import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Globe, 
  Award, 
  BookOpen, 
  GraduationCap, 
  CheckCircle2, 
  ChevronRight, 
  ArrowLeft, 
  Calculator, 
  Sliders, 
  Sparkles, 
  Search, 
  FileText, 
  Layers, 
  Bookmark, 
  RotateCcw, 
  Check, 
  HelpCircle, 
  X,
  Play,
  Clock,
  Zap,
  Info,
  ChevronDown,
  Building2,
  Compass,
  MapPin,
  Calendar,
  School,
  FileCheck2,
  Download,
  HardDrive,
  Star,
  CheckSquare,
  Database,
  Filter,
  CheckCircle,
  Plus,
  Minus,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { 
  GLOBAL_CONTINENTS,
  Continent,
  ContinentId,
  CountryEducation,
  EducationStage,
  ClassGradeLevel,
  ExamAssessment,
  GlobalSubject,
  GlobalTopic,
  GlobalPracticeQuestion,
  findCountryEducation
} from '../../data/globalEducationCurricula';
import { buildPracticeQuestionsForSubjects, checkSubjectsAvailability, SubjectQuestionRequest } from '../../utils/studyPracticeEngine';
import Quiz, { QuizProps } from '../Quiz';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import JambPrep from '../jamb/JambPrep';

interface StudyHubProps {
  setView?: (v: any) => void;
}

// Flow: Continent -> Country -> Education Level -> Class/Grade -> Exam -> Subjects -> Practice
export type FlowStep = 
  | 'continent'
  | 'country'
  | 'level'
  | 'grade'
  | 'exam'
  | 'subject'
  | 'topic'
  | 'study_mode'
  | 'question_bank'
  | 'jamb_direct';

export default function StudyHub({ setView }: StudyHubProps) {
  const navigate = useNavigate();
  const { user, userProfile, refreshProfile } = useAuth();

  // Selected hierarchy entities
  const [selectedContinent, setSelectedContinent] = useState<Continent | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<CountryEducation | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<EducationStage | null>(null);
  const [selectedGrade, setSelectedGrade] = useState<ClassGradeLevel | null>(null);
  const [selectedExam, setSelectedExam] = useState<ExamAssessment | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<GlobalSubject | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<GlobalTopic | null>(null);

  const [currentStep, setCurrentStep] = useState<FlowStep>('continent');
  const [searchQuery, setSearchQuery] = useState('');
  const [isUpdatingCountry, setIsUpdatingCountry] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Active Quiz practice session configuration (uses existing Quiz practice engine!)
  const [activeQuizConfig, setActiveQuizConfig] = useState<QuizProps['initialConfig'] | null>(null);

  // Multi-Subject Practice Selection state
  const [selectedSubjectIds, setSelectedSubjectIds] = useState<string[]>([]);
  const [subjectQuestionCounts, setSubjectQuestionCounts] = useState<Record<string, number>>({});
  const [isUntimedPractice, setIsUntimedPractice] = useState<boolean>(true);
  const [practiceTimerMinutes, setPracticeTimerMinutes] = useState<number>(30);

  // Single Subject Practice Setup Modal
  const [isSingleSubjectModalOpen, setIsSingleSubjectModalOpen] = useState(false);
  const [singleSubjectCount, setSingleSubjectCount] = useState<number>(20);
  const [singleSubjectUntimed, setSingleSubjectUntimed] = useState<boolean>(true);

  // Topic filter options
  const [topicFilter, setTopicFilter] = useState<'all' | 'bookmarked' | 'offline'>('all');

  // Progress Tracking: Completed topics
  const [completedTopics, setCompletedTopics] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('learndean_study_completed_topics');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Bookmarks
  const [bookmarkedTopics, setBookmarkedTopics] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('learndean_study_bookmarked_topics');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Offline Saved Topics
  const [offlineTopics, setOfflineTopics] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('learndean_study_offline_topics');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Scores
  const [topicScores, setTopicScores] = useState<Record<string, { score: number; total: number; percentage: number; date: string }>>(() => {
    try {
      const saved = localStorage.getItem('learndean_study_topic_scores');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Question Bank State
  const [qbMode, setQbMode] = useState<'browse' | 'quiz'>('browse');
  const [qbSearch, setQbSearch] = useState('');
  const [qbTopicFilter, setQbTopicFilter] = useState<string>('all');

  // Toast trigger helper
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  // Synchronize on initial load with the user's profile country
  useEffect(() => {
    const profileCountryStr = userProfile?.country || 'Nigeria';
    const matchedCountry = findCountryEducation(profileCountryStr);
    
    // Find the continent for this country
    const matchedContinent = GLOBAL_CONTINENTS.find(c => c.id === matchedCountry.continentId) || GLOBAL_CONTINENTS[0];
    
    setSelectedContinent(matchedContinent);
    setSelectedCountry(matchedCountry);
    setCurrentStep('level');
  }, [userProfile?.country]);

  // Handle switching continent
  const handleSelectContinent = (continent: Continent) => {
    setSelectedContinent(continent);
    setSelectedCountry(null);
    setSelectedLevel(null);
    setSelectedGrade(null);
    setSelectedExam(null);
    setSelectedSubject(null);
    setSelectedTopic(null);
    setSelectedSubjectIds([]);
    setSearchQuery('');
    setCurrentStep('country');
  };

  // Handle selecting country & sync with user profile
  const handleSelectCountry = async (country: CountryEducation) => {
    setSelectedCountry(country);
    setSelectedLevel(null);
    setSelectedGrade(null);
    setSelectedExam(null);
    setSelectedSubject(null);
    setSelectedTopic(null);
    setSelectedSubjectIds([]);
    setSearchQuery('');
    setCurrentStep('level');

    // Save country to Firestore profile if authenticated
    if (user) {
      try {
        setIsUpdatingCountry(true);
        await setDoc(doc(db, 'users', user.uid), { country: country.name }, { merge: true });
        if (refreshProfile) {
          await refreshProfile();
        }
        showToast(`Education system set to ${country.name}`);
      } catch (e) {
        console.warn('Could not sync country to profile:', e);
      } finally {
        setIsUpdatingCountry(false);
      }
    }
  };

  // Handle selecting education stage/level
  const handleSelectLevel = (level: EducationStage) => {
    setSelectedLevel(level);
    setSelectedGrade(null);
    setSelectedExam(null);
    setSelectedSubject(null);
    setSelectedTopic(null);
    setSelectedSubjectIds([]);
    setSearchQuery('');
    setCurrentStep('grade');
  };

  // Handle selecting grade/class
  const handleSelectGrade = (grade: ClassGradeLevel) => {
    setSelectedGrade(grade);
    setSelectedSubject(null);
    setSelectedTopic(null);
    setSelectedSubjectIds([]);
    setSearchQuery('');

    // If grade has only 1 exam, jump straight to subjects or exam
    if (grade.exams.length === 1) {
      const exm = grade.exams[0];
      setSelectedExam(exm);
      if (exm.isJambDirect) {
        setCurrentStep('jamb_direct');
        return;
      }
      setCurrentStep('subject');
      return;
    }

    setCurrentStep('exam');
  };

  // Handle selecting exam/assessment
  const handleSelectExam = (exam: ExamAssessment) => {
    setSelectedExam(exam);
    setSelectedSubject(null);
    setSelectedTopic(null);
    setSelectedSubjectIds([]);
    setSearchQuery('');

    if (exam.isJambDirect) {
      setCurrentStep('jamb_direct');
      return;
    }

    setCurrentStep('subject');
  };

  // Handle selecting a single subject (shows topics & study materials)
  const handleSelectSubject = (subject: GlobalSubject) => {
    setSelectedSubject(subject);
    setSelectedTopic(null);
    setSearchQuery('');
    setTopicFilter('all');
    setCurrentStep('topic');
  };

  // Handle opening topic in Study Mode
  const handleOpenStudy = (topic: GlobalTopic) => {
    setSelectedTopic(topic);
    setCurrentStep('study_mode');
  };

  // Handle opening Question Bank for the subject
  const handleOpenQuestionBank = (subject: GlobalSubject) => {
    setSelectedSubject(subject);
    setQbMode('browse');
    setQbSearch('');
    setQbTopicFilter('all');
    setCurrentStep('question_bank');
  };

  // Toggle multi-subject selection
  const handleToggleSubjectSelection = (subject: GlobalSubject, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setSelectedSubjectIds(prev => {
      const exists = prev.includes(subject.id);
      let updated: string[];
      if (exists) {
        updated = prev.filter(id => id !== subject.id);
      } else {
        updated = [...prev, subject.id];
        // Default 20 questions if not set
        setSubjectQuestionCounts(counts => ({
          ...counts,
          [subject.id]: counts[subject.id] || 20
        }));
      }
      return updated;
    });
  };

  // Update question count for a selected subject in multi-subject practice
  const handleSetQuestionCount = (subjectId: string, count: number) => {
    const val = Math.max(5, Math.min(80, count));
    setSubjectQuestionCounts(prev => ({
      ...prev,
      [subjectId]: val
    }));
  };

  // Select all subjects for combined practice
  const handleSelectAllSubjects = () => {
    if (!selectedExam) return;
    const allIds = selectedExam.subjects.map(s => s.id);
    setSelectedSubjectIds(allIds);
    setSubjectQuestionCounts(prev => {
      const updated = { ...prev };
      allIds.forEach(id => {
        if (!updated[id]) updated[id] = 20;
      });
      return updated;
    });
    showToast(`Selected all ${allIds.length} subjects for combined practice`);
  };

  // Clear subject selection
  const handleClearAllSubjects = () => {
    setSelectedSubjectIds([]);
  };

  // Start Single Subject Practice Session
  const handleStartSingleSubjectPractice = (sub: GlobalSubject, count: number, untimed: boolean) => {
    const requests: SubjectQuestionRequest[] = [
      {
        subjectName: sub.name,
        subjectId: sub.id,
        questionCount: count
      }
    ];

    const availability = checkSubjectsAvailability(requests, selectedExam?.subjects || [sub]);
    const subReport = availability[0];

    const questions = buildPracticeQuestionsForSubjects(requests, selectedExam?.subjects || [sub]);
    if (questions.length === 0) {
      showToast(`No authentic questions currently available for ${sub.name}.`);
      return;
    }

    if (questions.length < count) {
      showToast(
        `${questions.length} authentic questions available for ${sub.name}. ${count} questions are not currently available in the question bank. Starting with all ${questions.length} questions.`
      );
    }

    setActiveQuizConfig({
      subject: sub.name,
      subjectId: sub.id,
      subjects: [sub.name],
      amount: questions.length,
      questions: questions,
      isUntimed: untimed,
      timerDuration: untimed ? 0 : Math.max(10, Math.round(questions.length * 1.2)),
      examType: selectedExam?.shortName?.includes('JAMB') ? 'JAMB' : 'General'
    });
    setIsSingleSubjectModalOpen(false);
  };

  // Start Multiple Subject Practice Session
  const handleStartMultiSubjectPractice = () => {
    if (selectedSubjectIds.length < 2) {
      showToast('Please select at least 2 subjects for combined practice.');
      return;
    }

    if (!selectedExam) return;

    const chosenSubjects = selectedExam.subjects.filter(s => selectedSubjectIds.includes(s.id));
    const requests: SubjectQuestionRequest[] = chosenSubjects.map(sub => ({
      subjectName: sub.name,
      subjectId: sub.id,
      questionCount: subjectQuestionCounts[sub.id] || 20
    }));

    const availability = checkSubjectsAvailability(requests, selectedExam.subjects);
    const shortfalls = availability.filter(a => a.isShortfall);

    const questions = buildPracticeQuestionsForSubjects(requests, selectedExam.subjects);

    if (questions.length === 0) {
      showToast('Could not compile practice questions for the chosen subjects.');
      return;
    }

    if (shortfalls.length > 0) {
      const summaryMsg = shortfalls
        .map(s => `${s.subjectName} (${s.availableCount}/${s.requestedCount} Qs)`)
        .join(', ');
      showToast(`Note: Full question count not currently available for: ${summaryMsg}. Practicing with all authentic questions available.`);
    }

    const subjectNames = chosenSubjects.map(s => s.name);
    const totalCount = questions.length;

    setActiveQuizConfig({
      subject: `Combined Practice (${subjectNames.length} Subjects)`,
      subjects: subjectNames,
      amount: totalCount,
      questions: questions,
      isUntimed: isUntimedPractice,
      timerDuration: isUntimedPractice ? 0 : practiceTimerMinutes,
      examType: selectedExam.shortName?.includes('JAMB') ? 'JAMB' : 'General'
    });
  };

  // Toggle Topic Completion
  const toggleCompleteTopic = (topicId: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCompletedTopics(prev => {
      let updated: string[];
      if (prev.includes(topicId)) {
        updated = prev.filter(id => id !== topicId);
        showToast('Topic marked as incomplete');
      } else {
        updated = [...prev, topicId];
        showToast('Topic marked as completed! 🎯');
      }
      try {
        localStorage.setItem('learndean_study_completed_topics', JSON.stringify(updated));
      } catch (err) {
        console.warn('Storage error:', err);
      }
      return updated;
    });
  };

  // Toggle Bookmark
  const toggleBookmarkTopic = (topicId: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setBookmarkedTopics(prev => {
      let updated: string[];
      if (prev.includes(topicId)) {
        updated = prev.filter(id => id !== topicId);
        showToast('Removed from bookmarks');
      } else {
        updated = [...prev, topicId];
        showToast('Saved to your study bookmarks! ⭐️');
      }
      try {
        localStorage.setItem('learndean_study_bookmarked_topics', JSON.stringify(updated));
      } catch (err) {
        console.warn('Storage error:', err);
      }
      return updated;
    });
  };

  // Toggle Save for Offline
  const toggleSaveOfflineTopic = (topic: GlobalTopic, subjectName?: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setOfflineTopics(prev => {
      let updated: string[];
      if (prev.includes(topic.id)) {
        updated = prev.filter(id => id !== topic.id);
        try {
          localStorage.removeItem(`learndean_offline_topic_${topic.id}`);
          localStorage.setItem('learndean_study_offline_topics', JSON.stringify(updated));
        } catch (err) {
          console.warn('Storage error:', err);
        }
        showToast('Removed from offline storage');
      } else {
        updated = [...prev, topic.id];
        try {
          localStorage.setItem(
            `learndean_offline_topic_${topic.id}`,
            JSON.stringify({ ...topic, subjectName: subjectName || selectedSubject?.name || 'Study Subject' })
          );
          localStorage.setItem('learndean_study_offline_topics', JSON.stringify(updated));
        } catch (err) {
          console.warn('Storage error:', err);
        }
        showToast('Saved to device for offline learning! ⚡️');
      }
      return updated;
    });
  };

  // Aggregated questions for selected subject
  const allSubjectQuestions = useMemo(() => {
    if (!selectedSubject) return [];
    return selectedSubject.officialTopics.flatMap(t => 
      t.practiceQuestions.map(q => ({
        ...q,
        topicId: t.id,
        topicName: t.name
      }))
    );
  }, [selectedSubject]);

  // Filtered questions in Question Bank
  const filteredQbQuestions = useMemo(() => {
    let list = allSubjectQuestions;
    if (qbTopicFilter !== 'all') {
      list = list.filter(q => q.topicId === qbTopicFilter);
    }
    if (qbSearch.trim()) {
      const q = qbSearch.toLowerCase().trim();
      list = list.filter(item => 
        item.question.toLowerCase().includes(q) ||
        item.explanation.toLowerCase().includes(q) ||
        item.options.some(opt => opt.toLowerCase().includes(q))
      );
    }
    return list;
  }, [allSubjectQuestions, qbTopicFilter, qbSearch]);

  // Calculate subject completion percentage
  const getSubjectProgress = (sub: GlobalSubject) => {
    if (!sub.officialTopics || sub.officialTopics.length === 0) return { count: 0, total: 0, percent: 0 };
    const count = sub.officialTopics.filter(t => completedTopics.includes(t.id)).length;
    const total = sub.officialTopics.length;
    const percent = Math.round((count / total) * 100);
    return { count, total, percent };
  };

  // Real-time filtered lists
  const filteredCountries = useMemo(() => {
    if (!selectedContinent) return [];
    const q = searchQuery.toLowerCase().trim();
    if (!q) return selectedContinent.countries;
    return selectedContinent.countries.filter(c => 
      c.name.toLowerCase().includes(q) || 
      c.systemDescription.toLowerCase().includes(q)
    );
  }, [selectedContinent, searchQuery]);

  const filteredLevels = useMemo(() => {
    if (!selectedCountry) return [];
    const q = searchQuery.toLowerCase().trim();
    if (!q) return selectedCountry.educationStages;
    return selectedCountry.educationStages.filter(l => 
      l.name.toLowerCase().includes(q) || 
      l.description.toLowerCase().includes(q)
    );
  }, [selectedCountry, searchQuery]);

  const filteredGrades = useMemo(() => {
    if (!selectedLevel) return [];
    const q = searchQuery.toLowerCase().trim();
    if (!q) return selectedLevel.grades;
    return selectedLevel.grades.filter(g => 
      g.name.toLowerCase().includes(q) || 
      g.description.toLowerCase().includes(q)
    );
  }, [selectedLevel, searchQuery]);

  const filteredExams = useMemo(() => {
    if (!selectedGrade) return [];
    const q = searchQuery.toLowerCase().trim();
    if (!q) return selectedGrade.exams;
    return selectedGrade.exams.filter(e => 
      e.name.toLowerCase().includes(q) || 
      e.description.toLowerCase().includes(q)
    );
  }, [selectedGrade, searchQuery]);

  const filteredSubjects = useMemo(() => {
    if (!selectedExam) return [];
    const q = searchQuery.toLowerCase().trim();
    if (!q) return selectedExam.subjects;
    return selectedExam.subjects.filter(s => 
      s.name.toLowerCase().includes(q) || 
      s.description.toLowerCase().includes(q) ||
      s.category.toLowerCase().includes(q)
    );
  }, [selectedExam, searchQuery]);

  const filteredTopics = useMemo(() => {
    if (!selectedSubject) return [];
    let list = selectedSubject.officialTopics;

    if (topicFilter === 'bookmarked') {
      list = list.filter(t => bookmarkedTopics.includes(t.id));
    } else if (topicFilter === 'offline') {
      list = list.filter(t => offlineTopics.includes(t.id));
    }

    const q = searchQuery.toLowerCase().trim();
    if (!q) return list;
    return list.filter(t => 
      t.name.toLowerCase().includes(q) || 
      t.overview.toLowerCase().includes(q)
    );
  }, [selectedSubject, topicFilter, searchQuery, bookmarkedTopics, offlineTopics]);

  // Combined Questions total for multi-subject practice
  const totalMultiSubjectQuestions = useMemo(() => {
    return selectedSubjectIds.reduce((sum, id) => sum + (subjectQuestionCounts[id] || 20), 0);
  }, [selectedSubjectIds, subjectQuestionCounts]);

  // If a practice session is active, render Quiz directly (reusing the existing practice engine!)
  if (activeQuizConfig) {
    return (
      <div className="flex-1 flex flex-col min-h-0 bg-slate-50 dark:bg-slate-900 overflow-y-auto">
        <Quiz
          initialConfig={activeQuizConfig}
          onBack={() => setActiveQuizConfig(null)}
          setView={setView}
        />
      </div>
    );
  }

  // Full JAMB Prep Direct view
  if (currentStep === 'jamb_direct') {
    return (
      <div className="flex-1 flex flex-col min-h-0 bg-slate-50 dark:bg-slate-900">
        <div className="p-3 sm:p-4 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between gap-3">
          <button
            onClick={() => {
              setCurrentStep('grade');
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-700 dark:text-slate-200 font-semibold text-xs transition-colors cursor-pointer"
          >
            <ArrowLeft size={16} />
            <span>Back to Nigerian Classes</span>
          </button>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-800 dark:text-white">
              JAMB (UTME) Official CBT Suite
            </span>
            <span className="text-[10px] font-black px-2 py-0.5 rounded bg-emerald-600 text-white">
              CBT ACTIVE
            </span>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          <JambPrep initialTab="study" setView={setView} />
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-slate-50 dark:bg-slate-900 overflow-y-auto relative">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-20 md:bottom-8 right-6 z-50 bg-slate-900/90 dark:bg-slate-800 text-white px-4 py-2.5 rounded-2xl shadow-xl border border-slate-700 backdrop-blur-md flex items-center gap-2.5 text-xs font-semibold animate-in fade-in slide-in-from-bottom-3 duration-200">
          <Sparkles size={16} className="text-amber-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* SINGLE SUBJECT PRACTICE SETUP MODAL */}
      {isSingleSubjectModalOpen && selectedSubject && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 w-full max-w-md rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-700 space-y-5 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
              <div>
                <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Practice Setup</span>
                <h3 className="text-lg font-black text-slate-900 dark:text-white">
                  {selectedSubject.name}
                </h3>
              </div>
              <button 
                onClick={() => setIsSingleSubjectModalOpen(false)}
                className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-600"
              >
                <X size={18} />
              </button>
            </div>

            {/* Choose Number of Questions */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Choose Number of Questions:
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[10, 20, 40, 75].map(cnt => (
                  <button
                    key={cnt}
                    type="button"
                    onClick={() => setSingleSubjectCount(cnt)}
                    className={`py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      singleSubjectCount === cnt
                        ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                        : 'bg-slate-50 dark:bg-slate-750 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-blue-400'
                    }`}
                  >
                    {cnt} Questions
                  </button>
                ))}
              </div>
              <div className="flex items-center justify-between pt-1">
                <span className="text-xs text-slate-500">Custom Count:</span>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="5"
                    max="100"
                    value={singleSubjectCount}
                    onChange={e => setSingleSubjectCount(Math.min(100, Math.max(1, Number(e.target.value) || 20)))}
                    aria-label="Custom number of questions"
                    className="w-20 px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold text-center text-slate-900 dark:text-white"
                  />
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setSingleSubjectCount(c => Math.max(5, c - 5))}
                      className="p-1 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-200 hover:bg-slate-200"
                    >
                      <Minus size={14} />
                    </button>
                    <button
                      onClick={() => setSingleSubjectCount(c => Math.min(100, c + 5))}
                      className="p-1 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-200 hover:bg-slate-200"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Availability Notice if selected count exceeds available in bank */}
            {(() => {
              const req = [{ subjectName: selectedSubject.name, subjectId: selectedSubject.id, questionCount: 999 }];
              const rep = checkSubjectsAvailability(req, selectedExam?.subjects || [selectedSubject]);
              const availableInBank = rep[0]?.availableCount || 0;

              if (singleSubjectCount > availableInBank) {
                return (
                  <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs text-amber-900 dark:text-amber-200 space-y-1 animate-fadeIn">
                    <div className="flex items-center gap-1.5 font-bold text-amber-800 dark:text-amber-300">
                      <AlertCircle size={15} className="text-amber-600 dark:text-amber-400 shrink-0" />
                      <span>Question Bank Notice</span>
                    </div>
                    <p>
                      You selected <strong>{singleSubjectCount} questions</strong>, but <strong>{selectedSubject.name}</strong> currently has <strong>{availableInBank} authentic questions</strong> available. {singleSubjectCount} questions are not currently available.
                    </p>
                    <p className="text-[11px] text-amber-700/80 dark:text-amber-300/80">
                      LearnDean strictly isolates questions and never substitutes questions from other subjects. Practice will begin with all {availableInBank} authentic questions.
                    </p>
                  </div>
                );
              }
              return null;
            })()}

            {/* Mode Option: Untimed vs Timed */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Practice Timing:
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setSingleSubjectUntimed(true)}
                  className={`p-3 rounded-xl border text-xs font-bold text-left transition-all ${
                    singleSubjectUntimed
                      ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-500 text-blue-900 dark:text-blue-200'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  <div className="font-extrabold">Untimed</div>
                  <div className="text-[11px] font-normal text-slate-500">Learn at your own pace</div>
                </button>
                <button
                  type="button"
                  onClick={() => setSingleSubjectUntimed(false)}
                  className={`p-3 rounded-xl border text-xs font-bold text-left transition-all ${
                    !singleSubjectUntimed
                      ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-500 text-blue-900 dark:text-blue-200'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  <div className="font-extrabold">Timed Drill</div>
                  <div className="text-[11px] font-normal text-slate-500">{Math.round(singleSubjectCount * 1.2)} minutes</div>
                </button>
              </div>
            </div>

            <div className="pt-3 flex gap-2">
              <button
                type="button"
                onClick={() => setIsSingleSubjectModalOpen(false)}
                className="flex-1 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleStartSingleSubjectPractice(selectedSubject, singleSubjectCount, singleSubjectUntimed)}
                className="flex-2 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md cursor-pointer"
              >
                <Play size={14} />
                <span>
                  Start Practice ({(() => {
                    const req = [{ subjectName: selectedSubject.name, subjectId: selectedSubject.id, questionCount: 999 }];
                    const rep = checkSubjectsAvailability(req, selectedExam?.subjects || [selectedSubject]);
                    const availableInBank = rep[0]?.availableCount || 0;
                    return Math.min(singleSubjectCount, availableInBank > 0 ? availableInBank : singleSubjectCount);
                  })()} Qs)
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto w-full p-3 sm:p-5 md:p-8 space-y-6">
        
        {/* GLOBAL STUDY HEADER & BREADCRUMB PIPELINE */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-5 sm:p-6 md:p-8 border border-slate-200/90 dark:border-slate-700 shadow-sm relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                <span className="text-xs font-black uppercase tracking-wider text-blue-600 dark:text-blue-400 flex items-center gap-1.5">
                  <School size={16} />
                  School & Exam Hub
                </span>
                <span className="text-slate-300 dark:text-slate-600">·</span>
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  {selectedCountry ? `${selectedCountry.flag} ${selectedCountry.name}` : 'Global Education'}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                LearnDean Study & Practice Hub
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
                Explore classes, subjects, official curriculum topics, and practice with single or combined multi-subject exam drills.
              </p>
            </div>

            {/* Quick Country Switcher & Progress Badges */}
            <div className="flex items-center gap-2 shrink-0 flex-wrap">
              {/* Completed Topics Stat */}
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-bold">
                <CheckCircle2 size={14} className="text-emerald-600" />
                <span>{completedTopics.length} Mastered</span>
              </div>

              {selectedCountry && (
                <button
                  onClick={() => setCurrentStep('continent')}
                  className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 border border-slate-200 dark:border-slate-600 text-xs font-bold text-slate-800 dark:text-white transition-all cursor-pointer shadow-xs"
                  title="Explore All Continents & Countries"
                >
                  <Compass size={15} className="text-blue-600 dark:text-blue-400" />
                  <span>Change Country ({selectedCountry.flag})</span>
                </button>
              )}
            </div>
          </div>

          {/* 5-STAGE FLOW BREADCRUMB PIPELINE: Country -> Education Level -> Exam/Class -> Subjects -> Practice */}
          <nav 
            className="flex items-center gap-1.5 mt-5 pt-4 border-t border-slate-100 dark:border-slate-700/80 text-xs font-semibold overflow-x-auto pb-1"
            aria-label="Education Hub Breadcrumbs"
          >
            {/* Country */}
            <button
              onClick={() => {
                setCurrentStep('country');
                setSelectedLevel(null);
                setSelectedGrade(null);
                setSelectedExam(null);
                setSelectedSubject(null);
                setSelectedTopic(null);
              }}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-colors cursor-pointer shrink-0 ${
                currentStep === 'country'
                  ? 'bg-blue-600 text-white font-bold'
                  : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              <span>{selectedCountry ? selectedCountry.flag : '🌍'}</span>
              <span>{selectedCountry ? selectedCountry.name : 'Country'}</span>
            </button>

            {/* Education Level */}
            {selectedCountry && (
              <>
                <ChevronRight size={13} className="text-slate-400 shrink-0" />
                <button
                  onClick={() => {
                    setCurrentStep('level');
                    setSelectedLevel(null);
                    setSelectedGrade(null);
                    setSelectedExam(null);
                    setSelectedSubject(null);
                    setSelectedTopic(null);
                  }}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-colors cursor-pointer shrink-0 ${
                    currentStep === 'level'
                      ? 'bg-blue-600 text-white font-bold'
                      : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                  }`}
                >
                  <span>{selectedLevel ? selectedLevel.name.split('(')[0] : 'Education Level'}</span>
                </button>
              </>
            )}

            {/* Exam / Class */}
            {selectedLevel && (
              <>
                <ChevronRight size={13} className="text-slate-400 shrink-0" />
                <button
                  onClick={() => {
                    setCurrentStep('grade');
                    setSelectedGrade(null);
                    setSelectedExam(null);
                    setSelectedSubject(null);
                    setSelectedTopic(null);
                  }}
                  className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer shrink-0 truncate max-w-[150px] ${
                    currentStep === 'grade' || currentStep === 'exam'
                      ? 'bg-blue-600 text-white font-bold'
                      : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                  }`}
                >
                  {selectedGrade ? selectedGrade.name.split('/')[0] : 'Class / Grade'}
                </button>
              </>
            )}

            {/* Subjects */}
            {selectedGrade && selectedExam && (
              <>
                <ChevronRight size={13} className="text-slate-400 shrink-0" />
                <button
                  onClick={() => {
                    setCurrentStep('subject');
                    setSelectedSubject(null);
                    setSelectedTopic(null);
                  }}
                  className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer shrink-0 truncate max-w-[130px] ${
                    currentStep === 'subject'
                      ? 'bg-blue-600 text-white font-bold'
                      : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                  }`}
                >
                  {selectedExam.shortName} Subjects
                </button>
              </>
            )}

            {/* Topics / Practice */}
            {selectedSubject && (
              <>
                <ChevronRight size={13} className="text-slate-400 shrink-0" />
                <span className="px-2.5 py-1 rounded-lg bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 font-bold truncate max-w-[150px]">
                  {selectedSubject.name}
                </span>
              </>
            )}
          </nav>
        </div>

        {/* ========================================================================= */}
        {/* STAGE 1: COUNTRY & CONTINENT SELECTION */}
        {/* ========================================================================= */}
        {(currentStep === 'continent' || currentStep === 'country') && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                Select Your Country
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Choose your nation to unlock authentic primary, secondary, and national examination curricula
              </p>
            </div>

            <div className="space-y-6">
              {GLOBAL_CONTINENTS.map((cont) => (
                <div key={cont.id} className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{cont.icon}</span>
                    <h3 className="text-base font-black text-slate-900 dark:text-white uppercase tracking-wider text-xs">
                      {cont.name}
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {cont.countries.map(country => {
                      const isProfile = country.name.toLowerCase() === (userProfile?.country || 'nigeria').toLowerCase();

                      return (
                        <div
                          key={country.id}
                          onClick={() => handleSelectCountry(country)}
                          className="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-200/90 dark:border-slate-700 hover:border-blue-500 hover:shadow-md transition-all cursor-pointer flex items-center justify-between group"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <span className="text-2xl">{country.flag}</span>
                            <div className="min-w-0">
                              <h4 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-blue-600 truncate">
                                {country.name}
                              </h4>
                              <p className="text-[11px] text-slate-400 truncate">
                                {country.educationStages.length} Education Levels
                              </p>
                            </div>
                          </div>
                          {isProfile && (
                            <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-emerald-600 text-white shrink-0">
                              Active
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STAGE 2: EDUCATION LEVEL / STAGE */}
        {/* ========================================================================= */}
        {currentStep === 'level' && selectedCountry && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentStep('country')}
                    className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-600 dark:text-slate-300 cursor-pointer"
                    title="Change Country"
                  >
                    <ArrowLeft size={16} />
                  </button>
                  <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <span>{selectedCountry.flag}</span>
                    <span>{selectedCountry.name} — Education Levels</span>
                  </h2>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 ml-8">
                  From Primary/Basic through Secondary and Tertiary Matriculation
                </p>
              </div>

              {/* Filter */}
              <div className="relative w-full sm:w-64">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter education stages..."
                  className="w-full pl-8.5 pr-4 py-1.5 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-blue-500 dark:text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredLevels.map((lvl) => (
                <div
                  key={lvl.id}
                  onClick={() => handleSelectLevel(lvl)}
                  className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200/90 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-400 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 uppercase tracking-wider">
                        {lvl.stageType.replace('_', ' ')}
                      </span>
                      <span className="text-xs font-semibold text-slate-400">
                        {lvl.grades.length} Classes/Grades
                      </span>
                    </div>

                    <h3 className="text-lg font-black text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {lvl.name}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      {lvl.description}
                    </p>
                  </div>

                  <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-700/80 flex items-center justify-between text-xs font-semibold text-blue-600 dark:text-blue-400">
                    <span>View Classes & Grades</span>
                    <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STAGE 3: CLASS / GRADE SELECTION */}
        {/* ========================================================================= */}
        {currentStep === 'grade' && selectedLevel && selectedCountry && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentStep('level')}
                    className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-600 dark:text-slate-300 cursor-pointer"
                    title="Back to education levels"
                  >
                    <ArrowLeft size={16} />
                  </button>
                  <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                    {selectedLevel.name} — Classes & Grades
                  </h2>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 ml-8">
                  Select your class to load its accredited subjects and curriculum
                </p>
              </div>

              {/* Filter */}
              <div className="relative w-full sm:w-64">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter classes..."
                  className="w-full pl-8.5 pr-4 py-1.5 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-blue-500 dark:text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredGrades.map((grd) => (
                <div
                  key={grd.id}
                  onClick={() => handleSelectGrade(grd)}
                  className="bg-white dark:bg-slate-800 rounded-3xl p-5 sm:p-6 border border-slate-200/90 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-400 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-400">
                        {grd.ageRange || 'Standard Cohort'}
                      </span>
                      <span className="text-[10px] font-black px-2 py-0.5 rounded bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                        {grd.exams.length} Exam Standards
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {grd.name}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      {grd.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700/80 flex items-center justify-between text-xs font-semibold text-blue-600 dark:text-blue-400">
                    <span>Enter Class Subjects</span>
                    <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STAGE 3B: EXAM SELECTION (When a grade has multiple national exam choices) */}
        {/* ========================================================================= */}
        {currentStep === 'exam' && selectedGrade && selectedCountry && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentStep('grade')}
                    className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-600 dark:text-slate-300 cursor-pointer"
                    title="Back to classes"
                  >
                    <ArrowLeft size={16} />
                  </button>
                  <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                    {selectedGrade.name} — Target Examinations
                  </h2>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 ml-8">
                  Choose the examination standard for this cohort
                </p>
              </div>

              {/* Filter */}
              <div className="relative w-full sm:w-64">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter exams..."
                  className="w-full pl-8.5 pr-4 py-1.5 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-blue-500 dark:text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredExams.map((exm) => (
                <div
                  key={exm.id}
                  onClick={() => handleSelectExam(exm)}
                  className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200/90 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-400 hover:shadow-lg transition-all cursor-pointer flex flex-col justify-between group"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider ${exm.badgeColor || 'bg-blue-600 text-white'}`}>
                        {exm.badge || 'OFFICIAL'}
                      </span>
                      <span className="text-xs font-bold text-slate-400">
                        {exm.officialCurriculumYear}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-xl font-black text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {exm.name}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                        {exm.examBoard}
                      </p>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      {exm.description}
                    </p>
                  </div>

                  <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-700/80 flex items-center justify-between text-xs font-semibold">
                    <span className="text-slate-500 dark:text-slate-400">
                      {exm.subjects.length} Official Subjects
                    </span>
                    <div className="flex items-center text-blue-600 dark:text-blue-400 group-hover:translate-x-1 transition-transform">
                      <span>Enter Subjects</span>
                      <ChevronRight size={16} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STAGE 4: SUBJECTS LIST WITH MULTI-SUBJECT PRACTICE ENGINE */}
        {/* ========================================================================= */}
        {currentStep === 'subject' && selectedExam && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentStep('grade')}
                    className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-600 dark:text-slate-300 cursor-pointer"
                    title="Back to classes"
                  >
                    <ArrowLeft size={16} />
                  </button>
                  <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                    {selectedExam.name} — Subjects
                  </h2>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 ml-8">
                  {selectedExam.examBoard} Curriculum • Select 2 or more subjects for combined practice, or study individual subjects
                </p>
              </div>

              {/* Filter */}
              <div className="relative w-full sm:w-64">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter subjects..."
                  className="w-full pl-8.5 pr-4 py-1.5 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-blue-500 dark:text-white"
                />
              </div>
            </div>

            {/* Class Exam Syllabus Switcher (if class has multiple exams e.g. WAEC, NECO, JAMB) */}
            {selectedGrade && selectedGrade.exams.length > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
                <span className="text-xs font-bold text-slate-500 shrink-0">Exam Syllabus:</span>
                {selectedGrade.exams.map(ex => {
                  const isExActive = selectedExam.id === ex.id;
                  return (
                    <button
                      key={ex.id}
                      onClick={() => handleSelectExam(ex)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                        isExActive 
                          ? 'bg-blue-600 text-white shadow-xs' 
                          : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <span>{ex.name}</span>
                      {ex.isJambDirect && (
                        <span className="ml-1.5 px-1.5 py-0.5 rounded text-[10px] bg-emerald-600 text-white">CBT</span>
                      )}
                    </button>
                  );
                })}
              </div>
            )}

            {/* MULTI-SUBJECT PRACTICE CONTROLLER PANEL */}
            <div className="bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-slate-800 dark:via-slate-800 dark:to-blue-950/30 rounded-3xl p-5 sm:p-6 border-2 border-blue-200 dark:border-blue-900/60 shadow-md space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2.5 py-0.5 rounded-full bg-blue-600 text-white text-[10px] font-black uppercase tracking-wider">
                      Combined Exam Engine
                    </span>
                    <span className="text-xs font-black text-slate-800 dark:text-slate-200">
                      {selectedSubjectIds.length} Subjects Selected
                    </span>
                    <div className="flex items-center gap-1.5 ml-2">
                      <button
                        type="button"
                        onClick={handleSelectAllSubjects}
                        className="px-2.5 py-1 rounded-lg bg-blue-100 hover:bg-blue-200 dark:bg-blue-900/40 dark:hover:bg-blue-900/60 text-blue-700 dark:text-blue-300 text-[11px] font-bold transition-colors cursor-pointer"
                      >
                        Select All ({selectedExam.subjects.length})
                      </button>
                      {selectedSubjectIds.length > 0 && (
                        <button
                          type="button"
                          onClick={handleClearAllSubjects}
                          className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-650 text-slate-600 dark:text-slate-300 text-[11px] font-bold transition-colors cursor-pointer"
                        >
                          Clear
                        </button>
                      )}
                    </div>
                  </div>
                  <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                    Multiple Subject Practice Session
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 max-w-2xl leading-relaxed">
                    Select 2 or more subjects. Choose the number of questions for <span className="font-semibold text-slate-700 dark:text-slate-300">each selected subject</span> (e.g. Mathematics = 20, English = 20, Science = 15) to start one combined exam session with separate subject tabs and individual scoring.
                  </p>
                </div>

                {/* Start Multi-Subject Button */}
                <div className="shrink-0 flex items-center gap-2">
                  <button
                    disabled={selectedSubjectIds.length < 2}
                    onClick={handleStartMultiSubjectPractice}
                    className={`px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all shadow-md cursor-pointer ${
                      selectedSubjectIds.length >= 2
                        ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20'
                        : 'bg-slate-200 dark:bg-slate-700 text-slate-400 dark:text-slate-500 cursor-not-allowed'
                    }`}
                  >
                    <Play size={16} />
                    <span>
                      {selectedSubjectIds.length >= 2
                        ? `Start Combined Practice (${totalMultiSubjectQuestions} Questions)`
                        : 'Select at least 2 subjects'}
                    </span>
                  </button>
                </div>
              </div>

              {/* Per-subject question count selectors */}
              {selectedSubjectIds.length > 0 && (
                <div className="pt-3 border-t border-blue-100 dark:border-slate-700/80 space-y-3">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300 flex-wrap gap-2">
                    <span>Configure Questions per Selected Subject:</span>
                    <div className="flex items-center gap-3">
                      <label className="flex items-center gap-1.5 cursor-pointer text-[11px] font-medium text-slate-600 dark:text-slate-400">
                        <input
                          type="checkbox"
                          checked={!isUntimedPractice}
                          onChange={(e) => setIsUntimedPractice(!e.target.checked)}
                          className="rounded text-blue-600"
                        />
                        <span>Enable Practice Timer ({practiceTimerMinutes} mins)</span>
                      </label>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {selectedExam.subjects
                      .filter(s => selectedSubjectIds.includes(s.id))
                      .map(sub => {
                        const count = subjectQuestionCounts[sub.id] || 20;

                        return (
                          <div 
                            key={sub.id}
                            className="bg-white dark:bg-slate-750 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2.5 shadow-xs"
                          >
                            <div className="flex items-center justify-between gap-2">
                              <div className="min-w-0 flex-1">
                                <p className="font-bold text-xs text-slate-900 dark:text-white truncate">
                                  {sub.name}
                                </p>
                                <span className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold">
                                  {sub.code}
                                </span>
                              </div>
                              <span className="text-xs font-black text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded-lg bg-blue-50 dark:bg-blue-900/40">
                                {count} Qs
                              </span>
                            </div>

                            {/* Preset Buttons + Stepper */}
                            <div className="flex items-center justify-between gap-1.5 pt-1 border-t border-slate-100 dark:border-slate-700/60">
                              <div className="flex items-center gap-1">
                                {[10, 15, 20, 30].map(cnt => (
                                  <button
                                    key={cnt}
                                    type="button"
                                    onClick={() => handleSetQuestionCount(sub.id, cnt)}
                                    className={`px-1.5 py-0.5 rounded-md text-[10px] font-bold border transition-colors cursor-pointer ${
                                      count === cnt
                                        ? 'bg-blue-600 text-white border-blue-600'
                                        : 'bg-slate-50 dark:bg-slate-700 border-slate-200 dark:border-slate-650 text-slate-600 dark:text-slate-300 hover:border-blue-400'
                                    }`}
                                  >
                                    {cnt}
                                  </button>
                                ))}
                              </div>

                              <div className="flex items-center gap-1 shrink-0">
                                <button
                                  type="button"
                                  onClick={() => handleSetQuestionCount(sub.id, count - 5)}
                                  className="p-1 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-700 dark:text-slate-200 cursor-pointer"
                                  title="Fewer questions"
                                >
                                  <Minus size={12} />
                                </button>
                                <input
                                  type="number"
                                  min={5}
                                  max={80}
                                  value={count}
                                  onChange={(e) => handleSetQuestionCount(sub.id, parseInt(e.target.value) || 20)}
                                  className="w-10 text-center text-xs font-black text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-650 rounded-md py-0.5 outline-none"
                                />
                                <button
                                  type="button"
                                  onClick={() => handleSetQuestionCount(sub.id, count + 5)}
                                  className="p-1 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-700 dark:text-slate-200 cursor-pointer"
                                  title="More questions"
                                >
                                  <Plus size={12} />
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                  </div>

                  {selectedSubjectIds.length >= 2 && (
                    <div className="p-3 rounded-xl bg-blue-50/60 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/40 text-xs font-medium text-slate-700 dark:text-slate-300 flex items-center justify-between flex-wrap gap-2">
                      <span className="font-semibold text-blue-900 dark:text-blue-200">
                        Combined Session Plan:
                      </span>
                      <span className="text-slate-600 dark:text-slate-400">
                        {selectedExam.subjects
                          .filter(s => selectedSubjectIds.includes(s.id))
                          .map(s => `${s.name} (${subjectQuestionCounts[s.id] || 20})`)
                          .join(' • ')}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* SUBJECT CARDS GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredSubjects.map((sub) => {
                const isSelected = selectedSubjectIds.includes(sub.id);
                const progress = getSubjectProgress(sub);

                return (
                  <div
                    key={sub.id}
                    className={`bg-white dark:bg-slate-800 rounded-3xl p-5 border-2 transition-all flex flex-col justify-between group relative overflow-hidden ${
                      isSelected
                        ? 'border-blue-500 dark:border-blue-500 shadow-md ring-2 ring-blue-500/20'
                        : 'border-slate-200/90 dark:border-slate-700 hover:border-blue-400'
                    }`}
                  >
                    <div className="space-y-3">
                      {/* Top Checkbox & Code */}
                      <div className="flex items-center justify-between">
                        <label 
                          onClick={(e) => handleToggleSubjectSelection(sub, e)}
                          className="flex items-center gap-2 cursor-pointer select-none"
                        >
                          <div className={`w-5 h-5 rounded-lg border flex items-center justify-center transition-all ${
                            isSelected 
                              ? 'bg-blue-600 border-blue-600 text-white' 
                              : 'border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-750'
                          }`}>
                            {isSelected && <Check size={13} strokeWidth={3} />}
                          </div>
                          <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                            {isSelected ? 'Selected' : 'Select for Multi-Practice'}
                          </span>
                        </label>

                        <span className="text-[10px] font-black px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300">
                          {sub.code}
                        </span>
                      </div>

                      <div 
                        onClick={() => handleSelectSubject(sub)}
                        className="cursor-pointer"
                      >
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {sub.name}
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2 mt-1">
                          {sub.description}
                        </p>
                      </div>

                      {/* Progress Bar */}
                      <div className="space-y-1 pt-1">
                        <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500">
                          <span>Progress: {progress.count}/{progress.total} topics</span>
                          <span className={progress.percent === 100 ? 'text-emerald-600 font-bold' : ''}>
                            {progress.percent}%
                          </span>
                        </div>
                        <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden">
                          <div 
                            className={`h-full rounded-full transition-all duration-300 ${
                              progress.percent === 100 ? 'bg-emerald-500' : 'bg-blue-600'
                            }`}
                            style={{ width: `${progress.percent}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Actions: Start Single Practice vs Study & Topics */}
                    <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-700/80 flex items-center justify-between gap-2 text-xs font-semibold">
                      <button
                        onClick={() => {
                          setSelectedSubject(sub);
                          setIsSingleSubjectModalOpen(true);
                        }}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition-all shadow-xs cursor-pointer"
                      >
                        <Play size={13} />
                        <span>Practice</span>
                      </button>

                      <button
                        onClick={() => handleSelectSubject(sub)}
                        className="text-slate-600 dark:text-slate-300 hover:text-blue-600 flex items-center gap-1 transition-colors cursor-pointer py-1.5 px-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-750"
                      >
                        <span>Study Materials</span>
                        <ChevronRight size={14} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STAGE 5: SUBJECT TOPICS & STUDY MATERIALS */}
        {/* ========================================================================= */}
        {currentStep === 'topic' && selectedSubject && selectedExam && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentStep('subject')}
                    className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-600 dark:text-slate-300 cursor-pointer"
                    title="Back to subjects"
                  >
                    <ArrowLeft size={16} />
                  </button>
                  <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                    {selectedSubject.name} — Curriculum Topics
                  </h2>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 ml-8">
                  {selectedExam.name} Official Syllabus Standard ({selectedExam.officialCurriculumYear})
                </p>
              </div>

              {/* Start Practice on this Subject + Question Bank */}
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={() => setIsSingleSubjectModalOpen(true)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
                >
                  <Play size={14} />
                  <span>Start Practice Session</span>
                </button>

                <button
                  onClick={() => handleOpenQuestionBank(selectedSubject)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
                >
                  <Database size={14} />
                  <span>Question Bank ({allSubjectQuestions.length})</span>
                </button>

                <div className="relative w-full sm:w-48">
                  <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Filter topics..."
                    className="w-full pl-8.5 pr-4 py-1.5 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-blue-500 dark:text-white"
                  />
                </div>
              </div>
            </div>

            {/* Subject Overview & Progress Summary Bar */}
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/90 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black text-blue-600 dark:text-blue-400">
                    Subject Syllabus Mastery
                  </span>
                  <span className="text-xs text-slate-400">·</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    {selectedSubject.officialTopics.filter(t => completedTopics.includes(t.id)).length} of {selectedSubject.officialTopics.length} Topics Mastered
                  </span>
                </div>
                <div className="w-48 sm:w-64 h-2 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden">
                  <div 
                    className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                    style={{ 
                      width: `${Math.round((selectedSubject.officialTopics.filter(t => completedTopics.includes(t.id)).length / (selectedSubject.officialTopics.length || 1)) * 100)}%` 
                    }}
                  />
                </div>
              </div>

              {/* Filter Tabs: All | Bookmarked | Offline */}
              <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-750 p-1 rounded-xl text-xs font-bold">
                <button
                  onClick={() => setTopicFilter('all')}
                  className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                    topicFilter === 'all'
                      ? 'bg-white dark:bg-slate-800 text-blue-600 shadow-xs'
                      : 'text-slate-600 dark:text-slate-300'
                  }`}
                >
                  All Topics ({selectedSubject.officialTopics.length})
                </button>
                <button
                  onClick={() => setTopicFilter('bookmarked')}
                  className={`flex items-center gap-1 px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                    topicFilter === 'bookmarked'
                      ? 'bg-white dark:bg-slate-800 text-amber-600 shadow-xs'
                      : 'text-slate-600 dark:text-slate-300'
                  }`}
                >
                  <Star size={13} className="text-amber-500" />
                  <span>Saved</span>
                </button>
                <button
                  onClick={() => setTopicFilter('offline')}
                  className={`flex items-center gap-1 px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                    topicFilter === 'offline'
                      ? 'bg-white dark:bg-slate-800 text-blue-600 shadow-xs'
                      : 'text-slate-600 dark:text-slate-300'
                  }`}
                >
                  <Download size={13} className="text-blue-500" />
                  <span>Offline</span>
                </button>
              </div>
            </div>

            {filteredTopics.length === 0 ? (
              <div className="p-8 text-center bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 text-slate-500">
                <Bookmark size={32} className="mx-auto text-slate-400 mb-2 opacity-60" />
                <p className="text-sm font-semibold">No topics match your current filter.</p>
                <button
                  onClick={() => { setTopicFilter('all'); setSearchQuery(''); }}
                  className="mt-3 px-4 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 text-xs font-bold"
                >
                  Reset Filter
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredTopics.map((topic, tIdx) => {
                  const isCompleted = completedTopics.includes(topic.id);
                  const isBookmarked = bookmarkedTopics.includes(topic.id);
                  const isOffline = offlineTopics.includes(topic.id);
                  const scoreRecord = topicScores[topic.id];

                  return (
                    <div
                      key={topic.id}
                      className="bg-white dark:bg-slate-800 rounded-2xl p-4 sm:p-5 border border-slate-200/90 dark:border-slate-700 hover:border-blue-400 transition-all shadow-xs space-y-3"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                        <div className="space-y-1 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs font-black text-blue-600 dark:text-blue-400">
                              Topic {tIdx + 1}
                            </span>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                              topic.examWeight === 'Essential'
                                ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/60 dark:text-rose-300'
                                : 'bg-amber-100 text-amber-700 dark:bg-amber-900/60 dark:text-amber-300'
                            }`}>
                              {topic.examWeight} Exam Weight
                            </span>

                            {isCompleted && (
                              <span className="flex items-center gap-1 text-[10px] font-black px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                                <Check size={11} />
                                Completed
                              </span>
                            )}

                            {isOffline && (
                              <span className="flex items-center gap-1 text-[10px] font-black px-2 py-0.5 rounded bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300">
                                <Download size={11} />
                                Available Offline
                              </span>
                            )}

                            {scoreRecord && (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                                Best: {scoreRecord.score}/{scoreRecord.total} ({scoreRecord.percentage}%)
                              </span>
                            )}
                          </div>

                          <h3 className="text-base font-bold text-slate-900 dark:text-white">
                            {topic.name}
                          </h3>
                          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                            {topic.overview}
                          </p>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-1.5 shrink-0 pt-2 sm:pt-0">
                          {/* Bookmark Toggle */}
                          <button
                            onClick={(e) => toggleBookmarkTopic(topic.id, e)}
                            className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                              isBookmarked 
                                ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 text-amber-500' 
                                : 'bg-slate-50 dark:bg-slate-750 border-slate-200 dark:border-slate-700 text-slate-400 hover:text-amber-500'
                            }`}
                            title={isBookmarked ? 'Remove Bookmark' : 'Bookmark Topic'}
                          >
                            <Star size={15} className={isBookmarked ? 'fill-amber-400 text-amber-500' : ''} />
                          </button>

                          {/* Save Offline Toggle */}
                          <button
                            onClick={(e) => toggleSaveOfflineTopic(topic, selectedSubject.name, e)}
                            className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                              isOffline 
                                ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-300 text-blue-600' 
                                : 'bg-slate-50 dark:bg-slate-750 border-slate-200 dark:border-slate-700 text-slate-400 hover:text-blue-500'
                            }`}
                            title={isOffline ? 'Saved Offline' : 'Save for Offline Study'}
                          >
                            <Download size={15} />
                          </button>

                          {/* Mark Complete Checkbox */}
                          <button
                            onClick={(e) => toggleCompleteTopic(topic.id, e)}
                            className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                              isCompleted 
                                ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 text-emerald-600' 
                                : 'bg-slate-50 dark:bg-slate-750 border-slate-200 dark:border-slate-700 text-slate-400 hover:text-emerald-500'
                            }`}
                            title={isCompleted ? 'Mark as Incomplete' : 'Mark as Complete'}
                          >
                            <CheckSquare size={15} />
                          </button>

                          <button
                            onClick={() => handleOpenStudy(topic)}
                            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 hover:bg-blue-100 text-xs font-bold transition-colors cursor-pointer"
                          >
                            <BookOpen size={15} />
                            <span>Study Lesson</span>
                          </button>
                        </div>
                      </div>

                      {/* Syllabus Learning Objectives */}
                      {topic.objectives && topic.objectives.length > 0 && (
                        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-750 text-xs space-y-1">
                          <p className="font-bold text-slate-700 dark:text-slate-300 text-[11px] uppercase tracking-wider">
                            Syllabus Objectives:
                          </p>
                          <ul className="list-disc list-inside text-slate-600 dark:text-slate-400 space-y-0.5">
                            {topic.objectives.map((obj, i) => (
                              <li key={i}>{obj}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* STAGE 6: STUDY LESSON VIEWER */}
        {/* ========================================================================= */}
        {currentStep === 'study_mode' && selectedTopic && selectedSubject && (
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-slate-200/90 dark:border-slate-700 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-700 pb-4">
              <button
                onClick={() => setCurrentStep('topic')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold hover:bg-slate-200 transition-colors cursor-pointer"
              >
                <ArrowLeft size={16} />
                <span>Back to Topics</span>
              </button>

              <div className="flex items-center gap-2">
                {/* Offline Save */}
                <button
                  onClick={(e) => toggleSaveOfflineTopic(selectedTopic, selectedSubject.name, e)}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-xl border text-xs font-bold transition-colors cursor-pointer ${
                    offlineTopics.includes(selectedTopic.id)
                      ? 'bg-blue-50 border-blue-300 text-blue-600'
                      : 'bg-slate-100 dark:bg-slate-700 border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200'
                  }`}
                >
                  <Download size={14} />
                  <span>{offlineTopics.includes(selectedTopic.id) ? 'Saved Offline' : 'Save Offline'}</span>
                </button>

                {/* Complete */}
                <button
                  onClick={(e) => toggleCompleteTopic(selectedTopic.id, e)}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-xl border text-xs font-bold transition-colors cursor-pointer ${
                    completedTopics.includes(selectedTopic.id)
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-600'
                      : 'bg-slate-100 dark:bg-slate-700 border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200'
                  }`}
                >
                  <CheckSquare size={14} />
                  <span>{completedTopics.includes(selectedTopic.id) ? 'Completed' : 'Mark Completed'}</span>
                </button>

                <button
                  onClick={() => setIsSingleSubjectModalOpen(true)}
                  className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition-colors cursor-pointer shadow-sm"
                >
                  <Play size={14} />
                  <span>Practice Subject</span>
                </button>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
                  {selectedSubject.name} Lesson Notes
                </span>
                <span className="text-slate-300 dark:text-slate-600">·</span>
                <span className="text-xs text-slate-500">
                  {selectedExam?.name} Curriculum
                </span>
              </div>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white">
                {selectedTopic.name}
              </h2>
            </div>

            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200/60 dark:border-blue-800/40 space-y-1.5">
                <p className="font-bold text-blue-900 dark:text-blue-300 text-xs uppercase tracking-wider">
                  Key Syllabus Takeaways:
                </p>
                <ul className="list-disc list-inside text-xs sm:text-sm text-blue-800 dark:text-blue-300/90 space-y-1">
                  {selectedTopic.keyPoints.map((kp, i) => (
                    <li key={i}>{kp}</li>
                  ))}
                </ul>
              </div>

              <div className="whitespace-pre-line font-normal leading-relaxed bg-slate-50/50 dark:bg-slate-900/40 p-4 sm:p-6 rounded-2xl border border-slate-100 dark:border-slate-800 text-slate-800 dark:text-slate-200 text-sm sm:text-base">
                {selectedTopic.lessonContent}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-700 flex justify-end">
              <button
                onClick={() => setIsSingleSubjectModalOpen(true)}
                className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm transition-all shadow-md cursor-pointer"
              >
                <span>Proceed to Practice Session</span>
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STAGE 7: QUESTION BANK BROWSER */}
        {/* ========================================================================= */}
        {currentStep === 'question_bank' && selectedSubject && (
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-slate-200/90 dark:border-slate-700 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-700 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentStep('topic')}
                    className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold hover:bg-slate-200 transition-colors cursor-pointer"
                    title="Back to topics"
                  >
                    <ArrowLeft size={16} />
                  </button>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                    <Database size={20} className="text-amber-500" />
                    <span>{selectedSubject.name} Question Bank</span>
                  </h2>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 ml-8">
                  {allSubjectQuestions.length} Questions across {selectedSubject.officialTopics.length} syllabus topics
                </p>
              </div>

              <button
                onClick={() => setIsSingleSubjectModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5"
              >
                <Play size={14} />
                <span>Start Practice Drill</span>
              </button>
            </div>

            {/* Filter and Search Bar for Question Bank */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              {/* Topic Select Filter */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-500">Filter Topic:</span>
                <select
                  value={qbTopicFilter}
                  onChange={(e) => {
                    setQbTopicFilter(e.target.value);
                  }}
                  className="text-xs bg-slate-50 dark:bg-slate-750 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-1.5 outline-none font-medium dark:text-white"
                >
                  <option value="all">All Topics ({allSubjectQuestions.length} questions)</option>
                  {selectedSubject.officialTopics.map(t => (
                    <option key={t.id} value={t.id}>
                      {t.name} ({t.practiceQuestions.length})
                    </option>
                  ))}
                </select>
              </div>

              {/* Search Questions */}
              <div className="relative w-full sm:w-64">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={qbSearch}
                  onChange={(e) => setQbSearch(e.target.value)}
                  placeholder="Search question bank..."
                  className="w-full pl-8.5 pr-4 py-1.5 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-blue-500 dark:text-white"
                />
              </div>
            </div>

            {/* BROWSE MODE: All Questions with Answers & Explanations */}
            <div className="space-y-4">
              {filteredQbQuestions.length === 0 ? (
                <div className="p-8 text-center text-slate-500">
                  No questions found matching your filter.
                </div>
              ) : (
                filteredQbQuestions.map((q, idx) => (
                  <div 
                    key={q.id || idx}
                    className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-750 border border-slate-200 dark:border-slate-700 space-y-3"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-black text-blue-600 dark:text-blue-400">
                        Q{idx + 1} · {q.topicName}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                        Answer: Option {String.fromCharCode(65 + q.correctAnswer)}
                      </span>
                    </div>

                    <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                      {q.question}
                    </h4>

                    {/* Options Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                      {q.options.map((opt, oIdx) => {
                        const isCorrect = q.correctAnswer === oIdx;
                        return (
                          <div 
                            key={oIdx}
                            className={`p-2.5 rounded-xl border text-xs flex items-center gap-2 ${
                              isCorrect 
                                ? 'border-emerald-500 bg-emerald-50/80 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 font-bold'
                                : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                            }`}
                          >
                            <span className="w-5 h-5 rounded-full flex items-center justify-center border text-[10px] shrink-0 font-bold">
                              {String.fromCharCode(65 + oIdx)}
                            </span>
                            <span className="break-words min-w-0 flex-1 leading-snug">{opt}</span>
                          </div>
                        );
                      })}
                    </div>

                    {/* Solution breakdown */}
                    <div className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs space-y-1">
                      <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1">
                        <Info size={13} className="text-blue-500" />
                        Explanation:
                      </span>
                      <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                        {q.explanation}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
