/**
 * Strict Subject Matching & Isolation Utility
 *
 * Guarantees that:
 * 1. Questions from different subjects are NEVER mixed or substituted.
 * 2. Similar-sounding subjects (e.g. "Economics" vs "Home Economics",
 *    "English" vs "Literature in English", "Commerce" vs "Computer Studies")
 *    are strictly isolated and never match each other.
 * 3. Never labels questions from another subject as the requested subject.
 */

export interface CanonicalSubjectInfo {
  key: string;
  displayName: string;
  code: string;
  aliases: string[];
}

export const CANONICAL_SUBJECT_DEFINITIONS: CanonicalSubjectInfo[] = [
  // 1. Home Economics (Vocational & Applied) - must precede general "Economics"
  {
    key: 'home_economics',
    displayName: 'Home Economics',
    code: 'HEC',
    aliases: [
      'home economics',
      'home_economics',
      'home-economics',
      'home economic',
      'food and nutrition',
      'food & nutrition',
      'food-nutrition',
      'home management',
      'clothing and textiles',
      'hec'
    ]
  },

  // 2. Literature in English (Arts) - must precede general "English"
  {
    key: 'literature',
    displayName: 'Literature in English',
    code: 'LIT',
    aliases: [
      'literature in english',
      'literature',
      'lit in eng',
      'lit in english',
      'lit_in_eng',
      'lit',
      'english literature'
    ]
  },

  // 3. Further Mathematics - must precede general "Mathematics"
  {
    key: 'further_mathematics',
    displayName: 'Further Mathematics',
    code: 'FMT',
    aliases: [
      'further mathematics',
      'further maths',
      'further math',
      'further-maths',
      'further_maths',
      'pure mathematics'
    ]
  },

  // 4. Basic Science - must precede general Science
  {
    key: 'basic_science',
    displayName: 'Basic Science',
    code: 'BSC',
    aliases: [
      'basic science',
      'basic_science',
      'basic-science',
      'integrated science'
    ]
  },

  // 5. Basic Technology
  {
    key: 'basic_technology',
    displayName: 'Basic Technology',
    code: 'BTE',
    aliases: [
      'basic technology',
      'basic_technology',
      'basic-technology',
      'introductory technology',
      'intro tech'
    ]
  },

  // 6. Social Studies
  {
    key: 'social_studies',
    displayName: 'Social Studies',
    code: 'SST',
    aliases: [
      'social studies',
      'social_studies',
      'social-studies'
    ]
  },

  // 7. Civic Education
  {
    key: 'civic',
    displayName: 'Civic Education',
    code: 'CIV',
    aliases: [
      'civic education',
      'civic',
      'civics',
      'civic_education',
      'civic-education'
    ]
  },

  // 8. Principles of Accounts / Financial Accounting
  {
    key: 'accounts',
    displayName: 'Principles of Accounts',
    code: 'ACC',
    aliases: [
      'principles of accounts',
      'principles of account',
      'financial accounting',
      'accounting',
      'accounts',
      'account',
      'bookkeeping',
      'acc'
    ]
  },

  // 9. Agricultural Science
  {
    key: 'agriculture',
    displayName: 'Agricultural Science',
    code: 'AGR',
    aliases: [
      'agricultural science',
      'agriculture',
      'agric science',
      'agric',
      'agricultural_science',
      'agr'
    ]
  },

  // 10. Physical and Health Education
  {
    key: 'phe',
    displayName: 'Physical and Health Education',
    code: 'PHE',
    aliases: [
      'physical and health education',
      'physical health education',
      'physical education',
      'phe',
      'pe'
    ]
  },

  // 11. Computer Studies / ICT / Data Processing
  {
    key: 'computer',
    displayName: 'Computer Studies',
    code: 'CMP',
    aliases: [
      'computer studies',
      'computer science',
      'computer',
      'data processing',
      'data-processing',
      'ict',
      'computing',
      'cmp'
    ]
  },

  // 12. Christian Religious Studies
  {
    key: 'crs',
    displayName: 'Christian Religious Studies',
    code: 'CRS',
    aliases: [
      'christian religious studies',
      'christian religious knowledge',
      'crs',
      'crk'
    ]
  },

  // 13. Islamic Studies
  {
    key: 'irs',
    displayName: 'Islamic Studies',
    code: 'IRS',
    aliases: [
      'islamic studies',
      'islamic religious studies',
      'islamic religious knowledge',
      'irs',
      'irk'
    ]
  },

  // 14. Art (Fine Art)
  {
    key: 'art',
    displayName: 'Art (Fine Art)',
    code: 'ART',
    aliases: [
      'art (fine art)',
      'fine art',
      'fine arts',
      'visual arts',
      'visual art',
      'creative arts',
      'cultural and creative arts',
      'cca',
      'art'
    ]
  },

  // 15. Music
  {
    key: 'music',
    displayName: 'Music',
    code: 'MUS',
    aliases: [
      'music',
      'mus'
    ]
  },

  // 16. Economics (pure subject)
  {
    key: 'economics',
    displayName: 'Economics',
    code: 'ECO',
    aliases: [
      'economics',
      'eco',
      'economic'
    ]
  },

  // 17. Commerce (pure subject)
  {
    key: 'commerce',
    displayName: 'Commerce',
    code: 'COM',
    aliases: [
      'commerce',
      'com'
    ]
  },

  // 18. English Language (pure subject)
  {
    key: 'english',
    displayName: 'English Language',
    code: 'ENG',
    aliases: [
      'english language',
      'english',
      'english studies',
      'use of english',
      'eng'
    ]
  },

  // 19. Mathematics (pure subject)
  {
    key: 'mathematics',
    displayName: 'Mathematics',
    code: 'MTH',
    aliases: [
      'mathematics',
      'general mathematics',
      'maths',
      'math',
      'mth'
    ]
  },

  // 20. Physics
  {
    key: 'physics',
    displayName: 'Physics',
    code: 'PHY',
    aliases: [
      'physics',
      'phy'
    ]
  },

  // 21. Chemistry
  {
    key: 'chemistry',
    displayName: 'Chemistry',
    code: 'CHM',
    aliases: [
      'chemistry',
      'chem',
      'chm'
    ]
  },

  // 22. Biology
  {
    key: 'biology',
    displayName: 'Biology',
    code: 'BIO',
    aliases: [
      'biology',
      'bio'
    ]
  },

  // 23. Government
  {
    key: 'government',
    displayName: 'Government',
    code: 'GOV',
    aliases: [
      'government',
      'gov'
    ]
  },

  // 24. Geography
  {
    key: 'geography',
    displayName: 'Geography',
    code: 'GEO',
    aliases: [
      'geography',
      'geo'
    ]
  },

  // 25. History
  {
    key: 'history',
    displayName: 'History',
    code: 'HIS',
    aliases: [
      'history',
      'his'
    ]
  },

  // 26. French
  {
    key: 'french',
    displayName: 'French',
    code: 'FRE',
    aliases: [
      'french',
      'fre'
    ]
  },

  // 27. Arabic
  {
    key: 'arabic',
    displayName: 'Arabic',
    code: 'ARA',
    aliases: [
      'arabic',
      'ara'
    ]
  },

  // 28. Hausa
  {
    key: 'hausa',
    displayName: 'Hausa',
    code: 'HAU',
    aliases: [
      'hausa',
      'hau'
    ]
  },

  // 29. Igbo
  {
    key: 'igbo',
    displayName: 'Igbo',
    code: 'IGB',
    aliases: [
      'igbo',
      'igb'
    ]
  },

  // 30. Yoruba
  {
    key: 'yoruba',
    displayName: 'Yoruba',
    code: 'YOR',
    aliases: [
      'yoruba',
      'yor'
    ]
  },

  // 31. Business Studies
  {
    key: 'business_studies',
    displayName: 'Business Studies',
    code: 'BUS',
    aliases: [
      'business studies',
      'business_studies',
      'business'
    ]
  },

  // 32. Technical Drawing
  {
    key: 'technical_drawing',
    displayName: 'Technical Drawing',
    code: 'TDR',
    aliases: [
      'technical drawing',
      'technical_drawing'
    ]
  }
];

// Map lookup table for instant O(1) matching
const ALIAS_TO_KEY_MAP = new Map<string, string>();
const KEY_TO_DISPLAY_NAME_MAP = new Map<string, string>();

for (const def of CANONICAL_SUBJECT_DEFINITIONS) {
  KEY_TO_DISPLAY_NAME_MAP.set(def.key, def.displayName);
  ALIAS_TO_KEY_MAP.set(def.key, def.key);
  ALIAS_TO_KEY_MAP.set(def.displayName.toLowerCase().trim(), def.key);
  ALIAS_TO_KEY_MAP.set(def.code.toLowerCase().trim(), def.key);
  for (const alias of def.aliases) {
    ALIAS_TO_KEY_MAP.set(alias.toLowerCase().trim(), def.key);
  }
}

/**
 * Returns the canonical normalized subject key for any subject identifier.
 * Example:
 * canonicalSubjectKey("Home Economics") -> "home_economics"
 * canonicalSubjectKey("Economics") -> "economics"
 * canonicalSubjectKey("home-economics") -> "home_economics"
 */
export function canonicalSubjectKey(raw: string | undefined | null): string {
  if (!raw) return '';
  const cleaned = String(raw).toLowerCase().replace(/[\-_]/g, ' ').replace(/\s+/g, ' ').trim();
  if (ALIAS_TO_KEY_MAP.has(cleaned)) {
    return ALIAS_TO_KEY_MAP.get(cleaned)!;
  }
  // Try directly replacing spaces with underscore if not found
  const directClean = cleaned.replace(/\s+/g, '_');
  if (ALIAS_TO_KEY_MAP.has(directClean)) {
    return ALIAS_TO_KEY_MAP.get(directClean)!;
  }
  return directClean;
}

/**
 * Returns the user-facing display name for a subject key or raw name.
 */
export function getCanonicalSubjectDisplayName(subjectKeyOrName: string): string {
  const key = canonicalSubjectKey(subjectKeyOrName);
  return KEY_TO_DISPLAY_NAME_MAP.get(key) || (subjectKeyOrName || 'General');
}

/**
 * Strictly checks if a question belongs to a specific target subject.
 * NEVER allows cross-subject contamination.
 */
export function isQuestionForSubject(
  q: { subject?: string; subjectName?: string; id?: string },
  targetSubject: string
): boolean {
  if (!targetSubject) return false;
  const targetKey = canonicalSubjectKey(targetSubject);
  if (!targetKey) return false;

  const qSubKey = canonicalSubjectKey(q.subject || '');
  if (qSubKey) {
    return qSubKey === targetKey;
  }

  const qNameKey = canonicalSubjectKey(q.subjectName || '');
  if (qNameKey) {
    return qNameKey === targetKey;
  }

  // Fallback to exact ID prefix match check only if subject field is missing
  if (q.id) {
    const idLower = q.id.toLowerCase();
    if (idLower.startsWith(`jamb-${targetKey}-`) || idLower.startsWith(`jamb_${targetKey}_`)) {
      return true;
    }
    const def = CANONICAL_SUBJECT_DEFINITIONS.find(d => d.key === targetKey);
    if (def && (idLower.startsWith(`jamb-${def.code.toLowerCase()}-`) || idLower.startsWith(`jamb_${def.code.toLowerCase()}_`))) {
      return true;
    }
  }

  return false;
}

/**
 * Filters an array of questions strictly for the specified subject.
 */
export function filterQuestionsBySubjectStrict<T extends { subject?: string; subjectName?: string; id?: string }>(
  questions: T[],
  targetSubject: string
): T[] {
  return questions.filter(q => isQuestionForSubject(q, targetSubject));
}
