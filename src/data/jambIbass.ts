export interface IbassCourse {
  id: string;
  name: string;
  faculty: string;
  code: string;
  compulsorySubject: 'English Language';
  requiredElectives: string[]; // 3 required electives, e.g. ['Biology', 'Chemistry', 'Physics']
  acceptableAlternatives?: string[]; // E.g. ['Agricultural Science', 'Mathematics', 'Computer Studies']
  oLevelRequirements: string;
  specialRemarks: string;
  recommendedCutoff?: number; // Guidance score
}

export const IBASS_FACULTIES = [
  'All Faculties',
  'Medical & Health Sciences',
  'Engineering & Technology',
  'Sciences & Computing',
  'Law & Legal Studies',
  'Social Sciences',
  'Administration & Management',
  'Arts & Humanities',
  'Environmental Sciences',
  'Agriculture & Forestry',
  'Education'
] as const;

export type IbassFaculty = typeof IBASS_FACULTIES[number];

/**
 * OFFICIAL JAMB IBASS COURSE COMBINATIONS DATABASE
 * Direct from the Joint Admissions and Matriculation Board Interactive Brochure (IBASS)
 */
export const OFFICIAL_IBASS_COURSES: IbassCourse[] = [
  // =========================================================================
  // 1. MEDICAL & HEALTH SCIENCES
  // =========================================================================
  {
    id: 'mbbs',
    name: 'Medicine and Surgery (MBBS)',
    faculty: 'Medical & Health Sciences',
    code: 'MED',
    compulsorySubject: 'English Language',
    requiredElectives: ['Biology', 'Chemistry', 'Physics'],
    oLevelRequirements: '5 SSCE credit passes in English Language, Mathematics, Physics, Chemistry, and Biology at ONE sitting.',
    specialRemarks: 'Very competitive. Some universities do not accept two sittings for MBBS admissions. Minimum UTME score typically 280+.',
    recommendedCutoff: 270
  },
  {
    id: 'pharmacy',
    name: 'Pharmacy (Pharm.D / B.Pharm)',
    faculty: 'Medical & Health Sciences',
    code: 'PHM',
    compulsorySubject: 'English Language',
    requiredElectives: ['Biology', 'Chemistry', 'Physics'],
    oLevelRequirements: '5 SSCE credit passes in English Language, Mathematics, Physics, Chemistry, and Biology.',
    specialRemarks: 'Direct Entry requires 3 A-Level passes in Biology, Chemistry, and Physics.',
    recommendedCutoff: 250
  },
  {
    id: 'nursing',
    name: 'Nursing Science (B.N.Sc)',
    faculty: 'Medical & Health Sciences',
    code: 'NUR',
    compulsorySubject: 'English Language',
    requiredElectives: ['Biology', 'Chemistry', 'Physics'],
    oLevelRequirements: '5 SSCE credit passes in English Language, Mathematics, Physics, Chemistry, and Biology in not more than two sittings.',
    specialRemarks: 'Registered Nurses (RN) may apply via Direct Entry with valid NMCN certification.',
    recommendedCutoff: 240
  },
  {
    id: 'dentistry',
    name: 'Dentistry & Dental Surgery (BDS)',
    faculty: 'Medical & Health Sciences',
    code: 'DEN',
    compulsorySubject: 'English Language',
    requiredElectives: ['Biology', 'Chemistry', 'Physics'],
    oLevelRequirements: '5 SSCE credit passes in English Language, Mathematics, Physics, Chemistry, and Biology at one sitting.',
    specialRemarks: 'Subject combination is strictly uniform across all accredited Nigerian medical colleges.',
    recommendedCutoff: 260
  },
  {
    id: 'med-lab',
    name: 'Medical Laboratory Science (B.MLS)',
    faculty: 'Medical & Health Sciences',
    code: 'MLS',
    compulsorySubject: 'English Language',
    requiredElectives: ['Biology', 'Chemistry', 'Physics'],
    oLevelRequirements: '5 SSCE credit passes in English Language, Mathematics, Physics, Chemistry, and Biology.',
    specialRemarks: 'MLSCN requirements mandate standard credit passes in all basic sciences.',
    recommendedCutoff: 235
  },
  {
    id: 'physiotherapy',
    name: 'Physiotherapy / Medical Rehabilitation',
    faculty: 'Medical & Health Sciences',
    code: 'PST',
    compulsorySubject: 'English Language',
    requiredElectives: ['Biology', 'Chemistry', 'Physics'],
    oLevelRequirements: '5 SSCE credit passes in English Language, Mathematics, Physics, Chemistry, and Biology.',
    specialRemarks: 'Focuses on musculoskeletal, neurological, and cardio-pulmonary rehabilitation.',
    recommendedCutoff: 230
  },
  {
    id: 'radiography',
    name: 'Radiography & Radiation Science',
    faculty: 'Medical & Health Sciences',
    code: 'RAD',
    compulsorySubject: 'English Language',
    requiredElectives: ['Biology', 'Chemistry', 'Physics'],
    oLevelRequirements: '5 SSCE credit passes in English Language, Mathematics, Physics, Chemistry, and Biology.',
    specialRemarks: 'Physics and Chemistry command high significance in radiation physics evaluations.',
    recommendedCutoff: 230
  },
  {
    id: 'anatomy',
    name: 'Human Anatomy',
    faculty: 'Medical & Health Sciences',
    code: 'ANA',
    compulsorySubject: 'English Language',
    requiredElectives: ['Biology', 'Chemistry', 'Physics'],
    oLevelRequirements: '5 SSCE credit passes in English Language, Mathematics, Physics, Chemistry, and Biology.',
    specialRemarks: 'Foundational pre-clinical biomedical sciences.',
    recommendedCutoff: 210
  },
  {
    id: 'physiology',
    name: 'Human Physiology',
    faculty: 'Medical & Health Sciences',
    code: 'PHS',
    compulsorySubject: 'English Language',
    requiredElectives: ['Biology', 'Chemistry', 'Physics'],
    oLevelRequirements: '5 SSCE credit passes in English Language, Mathematics, Physics, Chemistry, and Biology.',
    specialRemarks: 'Investigates organ systems, neurophysiology, and metabolic functions.',
    recommendedCutoff: 210
  },
  {
    id: 'public-health',
    name: 'Public Health Science',
    faculty: 'Medical & Health Sciences',
    code: 'PBH',
    compulsorySubject: 'English Language',
    requiredElectives: ['Biology', 'Chemistry', 'Physics'],
    acceptableAlternatives: ['Mathematics'],
    oLevelRequirements: '5 SSCE credit passes in English Language, Mathematics, Physics, Chemistry, and Biology.',
    specialRemarks: 'Some institutions accept Mathematics in place of Physics.',
    recommendedCutoff: 220
  },

  // =========================================================================
  // 2. ENGINEERING & TECHNOLOGY
  // =========================================================================
  {
    id: 'computer-eng',
    name: 'Computer Engineering',
    faculty: 'Engineering & Technology',
    code: 'CEN',
    compulsorySubject: 'English Language',
    requiredElectives: ['Mathematics', 'Physics', 'Chemistry'],
    oLevelRequirements: '5 SSCE credit passes in English Language, Mathematics, Physics, Chemistry, and any other Science subject.',
    specialRemarks: 'Hardware architecture, embedded systems, microprocessors, and robotics.',
    recommendedCutoff: 240
  },
  {
    id: 'mech-eng',
    name: 'Mechanical Engineering',
    faculty: 'Engineering & Technology',
    code: 'MEE',
    compulsorySubject: 'English Language',
    requiredElectives: ['Mathematics', 'Physics', 'Chemistry'],
    oLevelRequirements: '5 SSCE credit passes in English Language, Mathematics, Physics, Chemistry, and Further Maths or Technical Drawing.',
    specialRemarks: 'Thermodynamics, fluid mechanics, machine design, and automation.',
    recommendedCutoff: 240
  },
  {
    id: 'elect-eng',
    name: 'Electrical / Electronics Engineering',
    faculty: 'Engineering & Technology',
    code: 'EEE',
    compulsorySubject: 'English Language',
    requiredElectives: ['Mathematics', 'Physics', 'Chemistry'],
    oLevelRequirements: '5 SSCE credit passes in English Language, Mathematics, Physics, Chemistry, and any relevant Science subject.',
    specialRemarks: 'Power systems, telecommunications, signal processing, and control engineering.',
    recommendedCutoff: 240
  },
  {
    id: 'civil-eng',
    name: 'Civil Engineering',
    faculty: 'Engineering & Technology',
    code: 'CVE',
    compulsorySubject: 'English Language',
    requiredElectives: ['Mathematics', 'Physics', 'Chemistry'],
    oLevelRequirements: '5 SSCE credit passes in English Language, Mathematics, Physics, Chemistry, and Technical Drawing or Geography.',
    specialRemarks: 'Structural engineering, hydraulics, geotechnical foundations, and transportation.',
    recommendedCutoff: 235
  },
  {
    id: 'chem-eng',
    name: 'Chemical & Petroleum Engineering',
    faculty: 'Engineering & Technology',
    code: 'CHE',
    compulsorySubject: 'English Language',
    requiredElectives: ['Mathematics', 'Physics', 'Chemistry'],
    oLevelRequirements: '5 SSCE credit passes in English Language, Mathematics, Physics, Chemistry, and Biology/Further Maths.',
    specialRemarks: 'Process engineering, fluid dynamics, reaction kinetics, and refinery operations.',
    recommendedCutoff: 240
  },
  {
    id: 'mechatronics',
    name: 'Mechatronics & Robotics Engineering',
    faculty: 'Engineering & Technology',
    code: 'MCE',
    compulsorySubject: 'English Language',
    requiredElectives: ['Mathematics', 'Physics', 'Chemistry'],
    oLevelRequirements: '5 SSCE credit passes in English Language, Mathematics, Physics, Chemistry, and Technical Drawing.',
    specialRemarks: 'Synergy of mechanical, electrical, and computer software controls.',
    recommendedCutoff: 240
  },
  {
    id: 'software-eng',
    name: 'Software Engineering',
    faculty: 'Engineering & Technology',
    code: 'SWE',
    compulsorySubject: 'English Language',
    requiredElectives: ['Mathematics', 'Physics', 'Chemistry'],
    acceptableAlternatives: ['Computer Studies', 'Biology', 'Economics'],
    oLevelRequirements: '5 SSCE credit passes in English Language, Mathematics, Physics, and any two other Science or Social Science subjects.',
    specialRemarks: 'Some universities accept Computer Studies or Economics in place of Chemistry.',
    recommendedCutoff: 230
  },

  // =========================================================================
  // 3. SCIENCES & COMPUTING
  // =========================================================================
  {
    id: 'computer-sci',
    name: 'Computer Science',
    faculty: 'Sciences & Computing',
    code: 'CSC',
    compulsorySubject: 'English Language',
    requiredElectives: ['Mathematics', 'Physics', 'Chemistry'],
    acceptableAlternatives: ['Biology', 'Computer Studies', 'Economics', 'Geography'],
    oLevelRequirements: '5 SSCE credit passes in English Language, Mathematics, Physics, plus two of Chemistry, Biology, Economics, or Computer Studies.',
    specialRemarks: 'Mathematics and Physics are compulsory in UTME across virtually all institutions. The third elective may be Chemistry, Biology, or Computer Studies.',
    recommendedCutoff: 230
  },
  {
    id: 'cyber-security',
    name: 'Cyber Security',
    faculty: 'Sciences & Computing',
    code: 'CYB',
    compulsorySubject: 'English Language',
    requiredElectives: ['Mathematics', 'Physics', 'Chemistry'],
    acceptableAlternatives: ['Computer Studies', 'Biology'],
    oLevelRequirements: '5 SSCE credit passes in English Language, Mathematics, Physics, and any other two science subjects.',
    specialRemarks: 'Network defense, ethical hacking, digital forensics, and cryptographic algorithms.',
    recommendedCutoff: 220
  },
  {
    id: 'data-science',
    name: 'Data Science & Artificial Intelligence',
    faculty: 'Sciences & Computing',
    code: 'DSC',
    compulsorySubject: 'English Language',
    requiredElectives: ['Mathematics', 'Physics', 'Chemistry'],
    acceptableAlternatives: ['Economics', 'Computer Studies', 'Biology'],
    oLevelRequirements: '5 SSCE credit passes in English Language, Mathematics, Physics, and two other relevant science subjects.',
    specialRemarks: 'Heavy emphasis on advanced statistics, calculus, and computational modeling.',
    recommendedCutoff: 220
  },
  {
    id: 'microbiology',
    name: 'Microbiology',
    faculty: 'Sciences & Computing',
    code: 'MCB',
    compulsorySubject: 'English Language',
    requiredElectives: ['Biology', 'Chemistry', 'Physics'],
    acceptableAlternatives: ['Mathematics'],
    oLevelRequirements: '5 SSCE credit passes in English Language, Mathematics, Biology, Chemistry, and Physics.',
    specialRemarks: 'Bacteriology, virology, immunology, and industrial fermentation.',
    recommendedCutoff: 210
  },
  {
    id: 'biochemistry',
    name: 'Biochemistry',
    faculty: 'Sciences & Computing',
    code: 'BCH',
    compulsorySubject: 'English Language',
    requiredElectives: ['Biology', 'Chemistry', 'Physics'],
    acceptableAlternatives: ['Mathematics'],
    oLevelRequirements: '5 SSCE credit passes in English Language, Mathematics, Biology, Chemistry, and Physics.',
    specialRemarks: 'Molecular genetics, enzymology, cellular metabolism, and bioenergetics.',
    recommendedCutoff: 215
  },
  {
    id: 'pure-chem',
    name: 'Pure & Industrial Chemistry',
    faculty: 'Sciences & Computing',
    code: 'CHM',
    compulsorySubject: 'English Language',
    requiredElectives: ['Chemistry', 'Physics', 'Mathematics'],
    acceptableAlternatives: ['Biology'],
    oLevelRequirements: '5 SSCE credit passes in English Language, Mathematics, Chemistry, Physics, and Biology.',
    specialRemarks: 'Spectroscopy, polymer science, organic synthesis, and analytical quality assurance.',
    recommendedCutoff: 200
  },
  {
    id: 'pure-physics',
    name: 'Physics with Electronics',
    faculty: 'Sciences & Computing',
    code: 'PHY',
    compulsorySubject: 'English Language',
    requiredElectives: ['Physics', 'Mathematics', 'Chemistry'],
    acceptableAlternatives: ['Biology'],
    oLevelRequirements: '5 SSCE credit passes in English Language, Mathematics, Physics, Chemistry, and any other science subject.',
    specialRemarks: 'Electromagnetism, quantum mechanics, semi-conductor physics, and circuits.',
    recommendedCutoff: 200
  },

  // =========================================================================
  // 4. LAW & LEGAL STUDIES
  // =========================================================================
  {
    id: 'common-law',
    name: 'Law (Civil / Common Law - LL.B)',
    faculty: 'Law & Legal Studies',
    code: 'LAW',
    compulsorySubject: 'English Language',
    requiredElectives: ['Literature in English', 'Government', 'Christian Religious Studies'],
    acceptableAlternatives: ['Islamic Studies', 'Economics', 'History'],
    oLevelRequirements: '5 SSCE credit passes in English Language, Literature in English, Mathematics, and two other Arts or Social Science subjects.',
    specialRemarks: 'Literature in English is strictly COMPULSORY for Law in virtually all Nigerian universities. Mathematics credit is also required in O\'Level.',
    recommendedCutoff: 260
  },
  {
    id: 'islamic-law',
    name: 'Islamic / Sharia Law (LL.B)',
    faculty: 'Law & Legal Studies',
    code: 'ISL',
    compulsorySubject: 'English Language',
    requiredElectives: ['Islamic Studies', 'Literature in English', 'Government'],
    acceptableAlternatives: ['Arabic', 'History'],
    oLevelRequirements: '5 SSCE credit passes including English Language, Islamic Studies or Arabic, and Literature in English.',
    specialRemarks: 'Specialized focus on Islamic jurisprudence (Fiqh) alongside statutory Nigerian common law.',
    recommendedCutoff: 230
  },

  // =========================================================================
  // 5. SOCIAL SCIENCES
  // =========================================================================
  {
    id: 'economics',
    name: 'Economics',
    faculty: 'Social Sciences',
    code: 'ECN',
    compulsorySubject: 'English Language',
    requiredElectives: ['Economics', 'Mathematics', 'Government'],
    acceptableAlternatives: ['Commerce', 'Geography', 'History', 'Literature in English', 'Principles of Accounts'],
    oLevelRequirements: '5 SSCE credit passes in English Language, Mathematics, Economics, and two other Arts or Social Science subjects.',
    specialRemarks: 'Mathematics is strictly mandatory for Economics in both UTME and O\'Level.',
    recommendedCutoff: 220
  },
  {
    id: 'political-science',
    name: 'Political Science',
    faculty: 'Social Sciences',
    code: 'POL',
    compulsorySubject: 'English Language',
    requiredElectives: ['Government', 'Economics', 'Literature in English'],
    acceptableAlternatives: ['History', 'Christian Religious Studies', 'Islamic Studies', 'Geography'],
    oLevelRequirements: '5 SSCE credit passes in English Language, Government/History, and three other subjects.',
    specialRemarks: 'Government or History is compulsory.',
    recommendedCutoff: 210
  },
  {
    id: 'mass-communication',
    name: 'Mass Communication / Media Studies',
    faculty: 'Social Sciences',
    code: 'MAC',
    compulsorySubject: 'English Language',
    requiredElectives: ['Literature in English', 'Government', 'Economics'],
    acceptableAlternatives: ['Christian Religious Studies', 'Islamic Studies', 'History', 'Commerce'],
    oLevelRequirements: '5 SSCE credit passes including English Language, Literature in English, and Mathematics.',
    specialRemarks: 'Broadcasting, journalism, public relations, and digital media production.',
    recommendedCutoff: 230
  },
  {
    id: 'international-relations',
    name: 'International Relations & Diplomacy',
    faculty: 'Social Sciences',
    code: 'INR',
    compulsorySubject: 'English Language',
    requiredElectives: ['Government', 'Economics', 'History'],
    acceptableAlternatives: ['Literature in English', 'French'],
    oLevelRequirements: '5 SSCE credit passes in English Language, Government/History, and three other subjects.',
    specialRemarks: 'Foreign policy analysis, multilateral treaties, and international law.',
    recommendedCutoff: 220
  },
  {
    id: 'sociology',
    name: 'Sociology & Anthropology',
    faculty: 'Social Sciences',
    code: 'SOC',
    compulsorySubject: 'English Language',
    requiredElectives: ['Government', 'Economics', 'History'],
    acceptableAlternatives: ['Christian Religious Studies', 'Islamic Studies', 'Geography', 'Literature in English'],
    oLevelRequirements: '5 SSCE credit passes in English Language, Mathematics, and three Arts or Social Science subjects.',
    specialRemarks: 'Social structures, cultural diversity, and demographic transitions.',
    recommendedCutoff: 200
  },
  {
    id: 'psychology',
    name: 'Psychology',
    faculty: 'Social Sciences',
    code: 'PSY',
    compulsorySubject: 'English Language',
    requiredElectives: ['Biology', 'Economics', 'Government'],
    acceptableAlternatives: ['Mathematics', 'Literature in English'],
    oLevelRequirements: '5 SSCE credit passes in English Language, Mathematics, Biology, and two other subjects.',
    specialRemarks: 'Biology is highly recommended or required due to physiological psychology modules.',
    recommendedCutoff: 210
  },

  // =========================================================================
  // 6. ADMINISTRATION & MANAGEMENT SCIENCES
  // =========================================================================
  {
    id: 'accounting',
    name: 'Accounting / Financial Studies',
    faculty: 'Administration & Management',
    code: 'ACC',
    compulsorySubject: 'English Language',
    requiredElectives: ['Mathematics', 'Economics', 'Principles of Accounts'],
    acceptableAlternatives: ['Commerce', 'Government', 'Geography'],
    oLevelRequirements: '5 SSCE credit passes in English Language, Mathematics, Economics, and any two of Accounting, Commerce, or Government.',
    specialRemarks: 'Mathematics and Economics are strictly required in UTME for Accounting across all federal and state universities.',
    recommendedCutoff: 230
  },
  {
    id: 'business-admin',
    name: 'Business Administration / Management',
    faculty: 'Administration & Management',
    code: 'BUS',
    compulsorySubject: 'English Language',
    requiredElectives: ['Mathematics', 'Economics', 'Commerce'],
    acceptableAlternatives: ['Government', 'Principles of Accounts', 'Geography'],
    oLevelRequirements: '5 SSCE credit passes in English Language, Mathematics, Economics, and two other relevant subjects.',
    specialRemarks: 'Strategic management, organizational behavior, operations research, and enterprise design.',
    recommendedCutoff: 220
  },
  {
    id: 'banking-finance',
    name: 'Banking and Finance',
    faculty: 'Administration & Management',
    code: 'BFN',
    compulsorySubject: 'English Language',
    requiredElectives: ['Mathematics', 'Economics', 'Commerce'],
    acceptableAlternatives: ['Principles of Accounts', 'Government'],
    oLevelRequirements: '5 SSCE credit passes in English Language, Mathematics, Economics, and two other relevant commercial subjects.',
    specialRemarks: 'Financial institutions, credit appraisal, capital markets, and central banking regulation.',
    recommendedCutoff: 215
  },
  {
    id: 'public-admin',
    name: 'Public Administration',
    faculty: 'Administration & Management',
    code: 'PAD',
    compulsorySubject: 'English Language',
    requiredElectives: ['Government', 'Economics', 'Commerce'],
    acceptableAlternatives: ['Mathematics', 'History', 'Literature in English'],
    oLevelRequirements: '5 SSCE credit passes in English Language, Mathematics, Government, and Economics.',
    specialRemarks: 'Civil service protocols, administrative law, public policy, and municipal management.',
    recommendedCutoff: 210
  },
  {
    id: 'marketing',
    name: 'Marketing',
    faculty: 'Administration & Management',
    code: 'MKT',
    compulsorySubject: 'English Language',
    requiredElectives: ['Mathematics', 'Economics', 'Commerce'],
    acceptableAlternatives: ['Government', 'Principles of Accounts'],
    oLevelRequirements: '5 SSCE credit passes in English Language, Mathematics, Economics, and two other relevant subjects.',
    specialRemarks: 'Brand management, consumer psychology, market analytics, and digital sales funnels.',
    recommendedCutoff: 200
  },

  // =========================================================================
  // 7. ARTS & HUMANITIES
  // =========================================================================
  {
    id: 'english-literary',
    name: 'English & Literary Studies',
    faculty: 'Arts & Humanities',
    code: 'ELS',
    compulsorySubject: 'English Language',
    requiredElectives: ['Literature in English', 'Government', 'History'],
    acceptableAlternatives: ['Christian Religious Studies', 'Islamic Studies', 'French', 'Yoruba', 'Igbo', 'Hausa'],
    oLevelRequirements: '5 SSCE credit passes in English Language, Literature in English, and three other Arts subjects.',
    specialRemarks: 'Literature in English is strictly compulsory for this degree in both UTME and O\'Level.',
    recommendedCutoff: 210
  },
  {
    id: 'history-intl',
    name: 'History & Diplomatic Studies',
    faculty: 'Arts & Humanities',
    code: 'HIS',
    compulsorySubject: 'English Language',
    requiredElectives: ['History', 'Government', 'Literature in English'],
    acceptableAlternatives: ['Christian Religious Studies', 'Islamic Studies', 'Economics'],
    oLevelRequirements: '5 SSCE credit passes in English Language, History or Government, and three Arts subjects.',
    specialRemarks: 'History or Government is compulsory in UTME.',
    recommendedCutoff: 200
  },
  {
    id: 'linguistics',
    name: 'Linguistics & Nigerian Languages',
    faculty: 'Arts & Humanities',
    code: 'LIN',
    compulsorySubject: 'English Language',
    requiredElectives: ['Literature in English', 'Yoruba', 'Government'],
    acceptableAlternatives: ['Igbo', 'Hausa', 'French', 'History', 'Christian Religious Studies'],
    oLevelRequirements: '5 SSCE credit passes in English Language and any Nigerian Language or Literature.',
    specialRemarks: 'Phonetics, syntax, morphology, dialectology, and sociolinguistics.',
    recommendedCutoff: 190
  },
  {
    id: 'theatre-arts',
    name: 'Theatre & Performing Arts',
    faculty: 'Arts & Humanities',
    code: 'TPA',
    compulsorySubject: 'English Language',
    requiredElectives: ['Literature in English', 'Government', 'Christian Religious Studies'],
    acceptableAlternatives: ['Islamic Studies', 'Music', 'History', 'Art (Fine Art)'],
    oLevelRequirements: '5 SSCE credit passes in English Language, Literature in English, and three other Arts subjects.',
    specialRemarks: 'Stage directing, playwriting, costume design, scenography, and choreography.',
    recommendedCutoff: 200
  },
  {
    id: 'philosophy',
    name: 'Philosophy',
    faculty: 'Arts & Humanities',
    code: 'PHL',
    compulsorySubject: 'English Language',
    requiredElectives: ['Government', 'Literature in English', 'Christian Religious Studies'],
    acceptableAlternatives: ['Islamic Studies', 'History', 'Economics'],
    oLevelRequirements: '5 SSCE credit passes in English Language, Mathematics, and three other Arts or Social Science subjects.',
    specialRemarks: 'Formal logic, epistemology, metaphysics, ethics, and African philosophy.',
    recommendedCutoff: 195
  },

  // =========================================================================
  // 8. ENVIRONMENTAL SCIENCES
  // =========================================================================
  {
    id: 'architecture',
    name: 'Architecture',
    faculty: 'Environmental Sciences',
    code: 'ARC',
    compulsorySubject: 'English Language',
    requiredElectives: ['Mathematics', 'Physics', 'Geography'],
    acceptableAlternatives: ['Chemistry', 'Art (Fine Art)', 'Economics'],
    oLevelRequirements: '5 SSCE credit passes in English Language, Mathematics, Physics, and any two of Chemistry, Geography, Fine Art, or Technical Drawing.',
    specialRemarks: 'Mathematics and Physics are strictly compulsory in UTME across all Nigerian universities for Architecture.',
    recommendedCutoff: 230
  },
  {
    id: 'estate-management',
    name: 'Estate Management',
    faculty: 'Environmental Sciences',
    code: 'ESM',
    compulsorySubject: 'English Language',
    requiredElectives: ['Mathematics', 'Economics', 'Geography'],
    acceptableAlternatives: ['Physics', 'Chemistry', 'Biology'],
    oLevelRequirements: '5 SSCE credit passes in English Language, Mathematics, Economics, and two other subjects.',
    specialRemarks: 'Property valuation, land law, estate agency, and real estate investment finance.',
    recommendedCutoff: 200
  },
  {
    id: 'quantity-surveying',
    name: 'Quantity Surveying',
    faculty: 'Environmental Sciences',
    code: 'QTS',
    compulsorySubject: 'English Language',
    requiredElectives: ['Mathematics', 'Physics', 'Chemistry'],
    acceptableAlternatives: ['Geography', 'Economics'],
    oLevelRequirements: '5 SSCE credit passes in English Language, Mathematics, Physics, and two other relevant science subjects.',
    specialRemarks: 'Construction cost estimation, procurement, project arbitration, and tendering.',
    recommendedCutoff: 210
  },

  // =========================================================================
  // 9. AGRICULTURE & FORESTRY
  // =========================================================================
  {
    id: 'agric-science',
    name: 'Agricultural Science & Agronomy',
    faculty: 'Agriculture & Forestry',
    code: 'AGR',
    compulsorySubject: 'English Language',
    requiredElectives: ['Chemistry', 'Biology', 'Agricultural Science'],
    acceptableAlternatives: ['Physics', 'Mathematics', 'Geography'],
    oLevelRequirements: '5 SSCE credit passes in English Language, Chemistry, Biology/Agric Science, Mathematics, and Physics.',
    specialRemarks: 'Chemistry is compulsory for all agricultural courses in both UTME and O\'Level.',
    recommendedCutoff: 190
  },
  {
    id: 'animal-science',
    name: 'Animal Science & Husbandry',
    faculty: 'Agriculture & Forestry',
    code: 'ANS',
    compulsorySubject: 'English Language',
    requiredElectives: ['Chemistry', 'Biology', 'Agricultural Science'],
    acceptableAlternatives: ['Physics', 'Mathematics'],
    oLevelRequirements: '5 SSCE credit passes in English Language, Chemistry, Biology/Agric, Mathematics, and Physics.',
    specialRemarks: 'Livestock breeding, poultry production, animal nutrition, and reproductive physiology.',
    recommendedCutoff: 190
  },
  {
    id: 'food-science',
    name: 'Food Science & Technology',
    faculty: 'Agriculture & Forestry',
    code: 'FST',
    compulsorySubject: 'English Language',
    requiredElectives: ['Chemistry', 'Mathematics', 'Physics'],
    acceptableAlternatives: ['Biology', 'Agricultural Science'],
    oLevelRequirements: '5 SSCE credit passes in English Language, Mathematics, Chemistry, Physics, and Biology.',
    specialRemarks: 'Food preservation, biochemistry, microbiology, quality control, and post-harvest technology.',
    recommendedCutoff: 210
  },

  // =========================================================================
  // 10. EDUCATION
  // =========================================================================
  {
    id: 'edu-science',
    name: 'Education and Biology / Chemistry / Physics / Maths',
    faculty: 'Education',
    code: 'ED-SCI',
    compulsorySubject: 'English Language',
    requiredElectives: ['Biology', 'Chemistry', 'Physics'],
    acceptableAlternatives: ['Mathematics', 'Agricultural Science'],
    oLevelRequirements: '5 SSCE credit passes in English Language, Mathematics, and teaching subject of specialization.',
    specialRemarks: 'Candidates take English, the specific subject of specialization, and two other science subjects.',
    recommendedCutoff: 190
  },
  {
    id: 'edu-arts',
    name: 'Education and English / Literature / History',
    faculty: 'Education',
    code: 'ED-ART',
    compulsorySubject: 'English Language',
    requiredElectives: ['Literature in English', 'Government', 'History'],
    acceptableAlternatives: ['Christian Religious Studies', 'Islamic Studies'],
    oLevelRequirements: '5 SSCE credit passes in English Language, Literature in English, and relevant arts subjects.',
    specialRemarks: 'Curriculum pedagogy, educational psychology, and classroom methodology.',
    recommendedCutoff: 190
  }
];

export interface IbassVerificationResult {
  isCompliant: boolean;
  matchScore: number; // 0 to 100%
  status: 'compliant' | 'warning' | 'ineligible';
  matchedSubjects: string[];
  missingRequiredSubjects: string[];
  alternativeMatches: string[];
  remarks: string;
}

/**
 * Normalizes subject names for fuzzy/loose equality checks
 */
function normalizeSubjName(name: string): string {
  return name
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .replace('use of english', 'english language')
    .replace('crk', 'christian religious studies')
    .replace('crs', 'christian religious studies')
    .replace('irk', 'islamic studies')
    .replace('irs', 'islamic studies')
    .trim();
}

/**
 * VERIFY SUBJECT COMBINATION AGAINST OFFICIAL JAMB / IBASS REQUIREMENTS
 */
export function verifyJambCombination(
  selectedSubjects: string[],
  course: IbassCourse
): IbassVerificationResult {
  const normSelected = selectedSubjects.map(normalizeSubjName);

  // 1. English is compulsory
  const hasEnglish = normSelected.some(s => s.includes('english'));

  // 2. Check required electives
  const matchedRequired: string[] = [];
  const missingRequired: string[] = [];

  for (const req of course.requiredElectives) {
    const normReq = normalizeSubjName(req);
    const isFound = normSelected.some(s => s === normReq || s.includes(normReq) || normReq.includes(s));
    if (isFound) {
      matchedRequired.push(req);
    } else {
      missingRequired.push(req);
    }
  }

  // 3. Check acceptable alternatives for any missing required subject
  const alternativeMatches: string[] = [];
  if (course.acceptableAlternatives && missingRequired.length > 0) {
    for (const alt of course.acceptableAlternatives) {
      const normAlt = normalizeSubjName(alt);
      const isFound = normSelected.some(s => s === normAlt || s.includes(normAlt) || normAlt.includes(s));
      if (isFound && !matchedRequired.includes(alt) && !alternativeMatches.includes(alt)) {
        alternativeMatches.push(alt);
      }
    }
  }

  // Total matching subject count out of 4 (English + 3 electives)
  const electiveMatchesCount = matchedRequired.length + Math.min(missingRequired.length, alternativeMatches.length);
  const totalMatches = (hasEnglish ? 1 : 0) + electiveMatchesCount;
  const matchScore = Math.round((totalMatches / 4) * 100);

  if (hasEnglish && missingRequired.length === 0) {
    return {
      isCompliant: true,
      matchScore: 100,
      status: 'compliant',
      matchedSubjects: ['English Language', ...matchedRequired],
      missingRequiredSubjects: [],
      alternativeMatches,
      remarks: `100% IBASS Compliant! Your selected subjects fully satisfy the official JAMB UTME requirement for ${course.name}.`
    };
  } else if (hasEnglish && (matchedRequired.length + alternativeMatches.length >= 3)) {
    return {
      isCompliant: true,
      matchScore: 90,
      status: 'warning',
      matchedSubjects: ['English Language', ...matchedRequired],
      missingRequiredSubjects: missingRequired.filter(m => !alternativeMatches.includes(m)),
      alternativeMatches,
      remarks: `Compatible via Acceptable Alternatives. Your combination includes ${alternativeMatches.join(', ')} which is recognized by several institutions for ${course.name}.`
    };
  } else {
    return {
      isCompliant: false,
      matchScore,
      status: 'ineligible',
      matchedSubjects: hasEnglish ? ['English Language', ...matchedRequired] : matchedRequired,
      missingRequiredSubjects: missingRequired,
      alternativeMatches,
      remarks: `Mismatch Detected: To study ${course.name} according to official JAMB IBASS brochure guidelines, you must register for ${course.requiredElectives.join(', ')}.`
    };
  }
}
