export interface JambSubject {
  id: string;
  name: string;
  code: string;
  category: 'General' | 'Sciences' | 'Commercial & Management' | 'Arts & Humanities' | 'Social Sciences' | 'Vocational & Applied' | 'Languages';
  color: string;
  accentColor: string;
  badgeBg: string;
  hasCalculator: boolean;
  totalStandardQuestions: number;
  compulsory: boolean;
  description: string;
}

export const JAMB_CATEGORIES = [
  'All',
  'Sciences',
  'Commercial & Management',
  'Arts & Humanities',
  'Social Sciences',
  'Languages',
  'Vocational & Applied'
] as const;

export type JambCategory = typeof JAMB_CATEGORIES[number];

/**
 * COMPLETE OFFICIAL JAMB UTME SUBJECT LIST (26 SUBJECTS)
 * Conforming strictly to the official Joint Admissions and Matriculation Board
 * (JAMB) IBASS (Interactive Brochure and Syllabus System).
 */
export const OFFICIAL_JAMB_SUBJECTS: JambSubject[] = [
  // 1. GENERAL / COMPULSORY
  {
    id: 'english',
    name: 'English Language',
    code: 'ENG',
    category: 'General',
    color: 'from-emerald-600 to-teal-600',
    accentColor: 'text-emerald-600 dark:text-emerald-400',
    badgeBg: 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
    hasCalculator: false,
    totalStandardQuestions: 60,
    compulsory: true,
    description: 'Comprehension, Lexis & Structure, Concord, Prescribed Novel & Oral English'
  },

  // 2. SCIENCES & MATHEMATICAL SCIENCES
  {
    id: 'mathematics',
    name: 'Mathematics',
    code: 'MTH',
    category: 'Sciences',
    color: 'from-blue-600 to-indigo-600',
    accentColor: 'text-blue-600 dark:text-blue-400',
    badgeBg: 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 border-blue-200 dark:border-blue-800',
    hasCalculator: true,
    totalStandardQuestions: 40,
    compulsory: false,
    description: 'Algebra, Trigonometry, Calculus, Coordinate Geometry, Statistics & Probability'
  },
  {
    id: 'physics',
    name: 'Physics',
    code: 'PHY',
    category: 'Sciences',
    color: 'from-purple-600 to-violet-600',
    accentColor: 'text-purple-600 dark:text-purple-400',
    badgeBg: 'bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-300 border-purple-200 dark:border-purple-800',
    hasCalculator: true,
    totalStandardQuestions: 40,
    compulsory: false,
    description: 'Mechanics, Waves, Optics, Electricity, Magnetism & Modern Physics'
  },
  {
    id: 'chemistry',
    name: 'Chemistry',
    code: 'CHM',
    category: 'Sciences',
    color: 'from-cyan-600 to-blue-600',
    accentColor: 'text-cyan-600 dark:text-cyan-400',
    badgeBg: 'bg-cyan-50 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800',
    hasCalculator: true,
    totalStandardQuestions: 40,
    compulsory: false,
    description: 'Stoichiometry, Periodic Table, Chemical Bonding, Organic Chemistry & Redox'
  },
  {
    id: 'biology',
    name: 'Biology',
    code: 'BIO',
    category: 'Sciences',
    color: 'from-amber-600 to-orange-600',
    accentColor: 'text-amber-600 dark:text-amber-400',
    badgeBg: 'bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-300 border-amber-200 dark:border-amber-800',
    hasCalculator: false,
    totalStandardQuestions: 40,
    compulsory: false,
    description: 'Genetics, Ecology, Physiology, Cell Structure, Diversity & Evolution'
  },
  {
    id: 'agriculture',
    name: 'Agricultural Science',
    code: 'AGR',
    category: 'Sciences',
    color: 'from-lime-600 to-green-700',
    accentColor: 'text-lime-600 dark:text-lime-400',
    badgeBg: 'bg-lime-50 dark:bg-lime-900/30 text-lime-600 dark:text-lime-300 border-lime-200 dark:border-lime-800',
    hasCalculator: false,
    totalStandardQuestions: 40,
    compulsory: false,
    description: 'Soil Science, Crop Production, Animal Husbandry, Farm Management & Extension'
  },
  {
    id: 'computer',
    name: 'Computer Studies',
    code: 'CMP',
    category: 'Sciences',
    color: 'from-sky-600 to-indigo-600',
    accentColor: 'text-sky-600 dark:text-sky-400',
    badgeBg: 'bg-sky-50 dark:bg-sky-900/30 text-sky-600 dark:text-sky-300 border-sky-200 dark:border-sky-800',
    hasCalculator: false,
    totalStandardQuestions: 40,
    compulsory: false,
    description: 'Computer Hardware, Operating Systems, Networking, Algorithms & Data Processing'
  },
  {
    id: 'phe',
    name: 'Physical and Health Education',
    code: 'PHE',
    category: 'Sciences',
    color: 'from-emerald-500 to-green-600',
    accentColor: 'text-emerald-600 dark:text-emerald-400',
    badgeBg: 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
    hasCalculator: false,
    totalStandardQuestions: 40,
    compulsory: false,
    description: 'Anatomy, Kinesiology, Sports Athletics, First Aid, Hygiene & Nutrition'
  },

  // 3. COMMERCIAL & MANAGEMENT SCIENCES
  {
    id: 'commerce',
    name: 'Commerce',
    code: 'COM',
    category: 'Commercial & Management',
    color: 'from-blue-700 to-teal-700',
    accentColor: 'text-blue-700 dark:text-blue-400',
    badgeBg: 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800',
    hasCalculator: false,
    totalStandardQuestions: 40,
    compulsory: false,
    description: 'Trade, E-Commerce, Warehousing, Insurance, Banking, Business Capital & Stock Exchange'
  },
  {
    id: 'accounts',
    name: 'Principles of Accounts',
    code: 'ACC',
    category: 'Commercial & Management',
    color: 'from-teal-600 to-cyan-700',
    accentColor: 'text-teal-600 dark:text-teal-400',
    badgeBg: 'bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-300 border-teal-200 dark:border-teal-800',
    hasCalculator: true,
    totalStandardQuestions: 40,
    compulsory: false,
    description: 'Double Entry, Trial Balance, Final Accounts, Partnership, Company & Bank Reconciliation'
  },

  // 4. SOCIAL SCIENCES
  {
    id: 'economics',
    name: 'Economics',
    code: 'ECN',
    category: 'Social Sciences',
    color: 'from-teal-600 to-emerald-600',
    accentColor: 'text-teal-600 dark:text-teal-400',
    badgeBg: 'bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-300 border-teal-200 dark:border-teal-800',
    hasCalculator: true,
    totalStandardQuestions: 40,
    compulsory: false,
    description: 'Price Theory, Elasticity, National Income, Public Finance & Monetary Systems'
  },
  {
    id: 'government',
    name: 'Government',
    code: 'GOV',
    category: 'Social Sciences',
    color: 'from-indigo-600 to-blue-700',
    accentColor: 'text-indigo-600 dark:text-indigo-400',
    badgeBg: 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800',
    hasCalculator: false,
    totalStandardQuestions: 40,
    compulsory: false,
    description: 'Political Concepts, Constitutional Evolution in Nigeria & Foreign Policy'
  },
  {
    id: 'geography',
    name: 'Geography',
    code: 'GEO',
    category: 'Social Sciences',
    color: 'from-emerald-700 to-stone-700',
    accentColor: 'text-emerald-700 dark:text-emerald-400',
    badgeBg: 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
    hasCalculator: false,
    totalStandardQuestions: 40,
    compulsory: false,
    description: 'Map Reading, Physical Geography, Climatology, Economic & Human Geography of Nigeria'
  },
  {
    id: 'civic',
    name: 'Civic Education',
    code: 'CIV',
    category: 'Social Sciences',
    color: 'from-violet-600 to-purple-700',
    accentColor: 'text-violet-600 dark:text-violet-400',
    badgeBg: 'bg-violet-50 dark:bg-violet-900/30 text-violet-600 dark:text-violet-300 border-violet-200 dark:border-violet-800',
    hasCalculator: false,
    totalStandardQuestions: 40,
    compulsory: false,
    description: 'Human Rights, Citizenship, Democratic Institutions, Youth Empowerment & Rule of Law'
  },

  // 5. ARTS & HUMANITIES
  {
    id: 'literature',
    name: 'Literature in English',
    code: 'LIT',
    category: 'Arts & Humanities',
    color: 'from-rose-600 to-pink-600',
    accentColor: 'text-rose-600 dark:text-rose-400',
    badgeBg: 'bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-300 border-rose-200 dark:border-rose-800',
    hasCalculator: false,
    totalStandardQuestions: 40,
    compulsory: false,
    description: 'Literary Devices, African & Non-African Prose, Drama & Poetry Analysis'
  },
  {
    id: 'crs',
    name: 'Christian Religious Studies',
    code: 'CRS',
    category: 'Arts & Humanities',
    color: 'from-amber-600 to-yellow-600',
    accentColor: 'text-amber-600 dark:text-amber-400',
    badgeBg: 'bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-300 border-amber-200 dark:border-amber-800',
    hasCalculator: false,
    totalStandardQuestions: 40,
    compulsory: false,
    description: 'Sovereignty of God, Kingship in Israel, Ministries of Jesus, The Early Church & Christian Living'
  },
  {
    id: 'irs',
    name: 'Islamic Studies',
    code: 'IRS',
    category: 'Arts & Humanities',
    color: 'from-emerald-600 to-green-700',
    accentColor: 'text-emerald-600 dark:text-emerald-400',
    badgeBg: 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
    hasCalculator: false,
    totalStandardQuestions: 40,
    compulsory: false,
    description: 'Tawhid, Quranic Exegesis, Hadith Studies, Fiqh, Islamic History & Caliphate'
  },
  {
    id: 'history',
    name: 'History',
    code: 'HIS',
    category: 'Arts & Humanities',
    color: 'from-stone-600 to-amber-800',
    accentColor: 'text-stone-700 dark:text-stone-300',
    badgeBg: 'bg-stone-50 dark:bg-stone-900/30 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-800',
    hasCalculator: false,
    totalStandardQuestions: 40,
    compulsory: false,
    description: 'Pre-Colonial Nigeria, Colonial Rule, Nationalist Movement, Post-Independence & Pan-Africanism'
  },
  {
    id: 'music',
    name: 'Music',
    code: 'MUS',
    category: 'Arts & Humanities',
    color: 'from-fuchsia-600 to-pink-600',
    accentColor: 'text-fuchsia-600 dark:text-fuchsia-400',
    badgeBg: 'bg-fuchsia-50 dark:bg-fuchsia-900/30 text-fuchsia-600 dark:text-fuchsia-300 border-fuchsia-200 dark:border-fuchsia-800',
    hasCalculator: false,
    totalStandardQuestions: 40,
    compulsory: false,
    description: 'Music Theory, African Traditional Music, Western Classical Periods & Musical Instruments'
  },
  {
    id: 'art',
    name: 'Art (Fine Art)',
    code: 'ART',
    category: 'Arts & Humanities',
    color: 'from-orange-600 to-rose-600',
    accentColor: 'text-orange-600 dark:text-orange-400',
    badgeBg: 'bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-300 border-orange-200 dark:border-orange-800',
    hasCalculator: false,
    totalStandardQuestions: 40,
    compulsory: false,
    description: 'Principles of Art, Drawing, Painting, Sculpture, Graphics & African Art Traditions'
  },

  // 6. LANGUAGES
  {
    id: 'french',
    name: 'French',
    code: 'FRE',
    category: 'Languages',
    color: 'from-blue-600 to-cyan-600',
    accentColor: 'text-blue-600 dark:text-blue-400',
    badgeBg: 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 border-blue-200 dark:border-blue-800',
    hasCalculator: false,
    totalStandardQuestions: 40,
    compulsory: false,
    description: 'Comprehension, Grammar, Conjugation, Francophone Literature & Cultural Life'
  },
  {
    id: 'arabic',
    name: 'Arabic',
    code: 'ARA',
    category: 'Languages',
    color: 'from-green-700 to-emerald-800',
    accentColor: 'text-green-700 dark:text-green-400',
    badgeBg: 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800',
    hasCalculator: false,
    totalStandardQuestions: 40,
    compulsory: false,
    description: 'Arabic Grammar (Nahw & Sarf), Prose, Poetry, Translation & Cultural History'
  },
  {
    id: 'hausa',
    name: 'Hausa',
    code: 'HAU',
    category: 'Languages',
    color: 'from-amber-700 to-yellow-800',
    accentColor: 'text-amber-700 dark:text-amber-400',
    badgeBg: 'bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800',
    hasCalculator: false,
    totalStandardQuestions: 40,
    compulsory: false,
    description: 'Harshe (Language/Grammar), Adabi (Literature & Poetry) & Al’ada (Hausa Customs & Traditions)'
  },
  {
    id: 'igbo',
    name: 'Igbo',
    code: 'IGB',
    category: 'Languages',
    color: 'from-rose-700 to-red-800',
    accentColor: 'text-rose-700 dark:text-rose-400',
    badgeBg: 'bg-rose-50 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800',
    hasCalculator: false,
    totalStandardQuestions: 40,
    compulsory: false,
    description: 'Asusu (Grammar & Linguistics), Agumagu (Literature & Oral Poetry) & Omenala (Igbo Culture)'
  },
  {
    id: 'yoruba',
    name: 'Yoruba',
    code: 'YOR',
    category: 'Languages',
    color: 'from-indigo-700 to-blue-800',
    accentColor: 'text-indigo-700 dark:text-indigo-400',
    badgeBg: 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800',
    hasCalculator: false,
    totalStandardQuestions: 40,
    compulsory: false,
    description: 'Ede (Grammar & Phonology), Litireso (Poetry & Drama) & Asa (Yoruba Customs & Beliefs)'
  },

  // 7. VOCATIONAL & APPLIED SCIENCES
  {
    id: 'home_economics',
    name: 'Home Economics',
    code: 'HEC',
    category: 'Vocational & Applied',
    color: 'from-teal-600 to-emerald-700',
    accentColor: 'text-teal-600 dark:text-teal-400',
    badgeBg: 'bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-300 border-teal-200 dark:border-teal-800',
    hasCalculator: false,
    totalStandardQuestions: 40,
    compulsory: false,
    description: 'Food & Nutrition, Clothing & Textiles, Family Living, Child Development & Home Management'
  }
];

export const JAMB_SUBJECTS = OFFICIAL_JAMB_SUBJECTS;

export const DEFAULT_USER_ELECTIVES = ['Mathematics', 'Physics', 'Chemistry'];

export function getJambSubjectById(id: string): JambSubject | undefined {
  return OFFICIAL_JAMB_SUBJECTS.find(s => s.id === id);
}

export function getJambSubjectByName(name: string): JambSubject | undefined {
  return OFFICIAL_JAMB_SUBJECTS.find(s => 
    s.name.toLowerCase() === name.toLowerCase() ||
    s.id.toLowerCase() === name.toLowerCase()
  );
}
