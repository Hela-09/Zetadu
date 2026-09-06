export interface TopicOption {
  name: string;
  category?: string;
}

export const EDUCATION_LEVELS = [
  { id: 'Secondary', label: 'Secondary School', description: 'JSS 1-3 & SSS 1-3 (WAEC, JAMB, NECO)' },
  { id: 'Tertiary', label: 'University / Tertiary', description: 'Undergraduate, 100-500 Level, Post-UTME' },
  { id: 'Primary', label: 'Primary School', description: 'Basic 1-6 & Common Entrance' },
];

export const EXAM_TYPES_BY_LEVEL: Record<string, string[]> = {
  Secondary: ['WAEC / WASSCE', 'JAMB / UTME', 'NECO (SSCE)', 'BECE (Junior WAEC)', 'Cambridge IGCSE', 'General Exam'],
  Tertiary: ['University Semester Exams', 'Post-UTME Screening', 'Professional Licensing', 'General Study'],
  Primary: ['National Common Entrance (NCEE)', 'Primary School Leaving Certificate', 'Term Exams'],
};

export const SYLLABUS_TOPICS: Record<string, string[]> = {
  'mathematics': [
    'Quadratic Equations & Functions',
    'Linear Inequalities & Graphs',
    'Fractions, Decimals & Percentages',
    'Logarithms & Indices',
    'Trigonometry & Bearing',
    'Statistics, Mean, Median & Mode',
    'Probability & Combinatorics',
    'Circle Geometry & Theorems',
    'Matrices & Determinants',
    'Differentiation & Calculus',
    'Integration & Area Under Curves',
    'Commercial Arithmetic & Compound Interest',
    'Mensuration of Solid Shapes'
  ],
  'further-maths': [
    'Advanced Calculus & Derivatives',
    'Matrices & Linear Transformations',
    'Vectors in 2D & 3D Space',
    'Coordinate Geometry of Conic Sections',
    'Complex Numbers & De Moivre Theorem',
    'Dynamics & Statics'
  ],
  'english': [
    'Subject-Verb Agreement (Concord)',
    'Tenses & Aspects of Verbs',
    'Figures of Speech & Literary Devices',
    'Sentence Structures & Clauses',
    'Lexis, Vocabulary & Antonyms/Synonyms',
    'Idiomatic Expressions & Phrasal Verbs',
    'Comprehension & Summary Skills',
    'Direct & Indirect Speech',
    'Punctuation & Capitalization'
  ],
  'physics': [
    'Mechanics: Motion, Velocity & Acceleration',
    'Newton\'s Laws of Motion & Momentum',
    'Work, Energy and Power',
    'Thermal Physics, Heat & Gas Laws',
    'Waves, Sound & Light Reflection/Refraction',
    'Current Electricity, Ohm\'s Law & Circuits',
    'Electric & Magnetic Fields',
    'Electromagnetic Induction & Transformers',
    'Atomic Structure, Radioactivity & Nuclear Energy'
  ],
  'chemistry': [
    'Atomic Structure & Electronic Configuration',
    'Periodic Table & Periodic Trends',
    'Chemical Bonding: Ionic, Covalent & Metallic',
    'Stoichiometry & Mole Concept Calculations',
    'Acids, Bases, Salts & Neutralization',
    'Redox Reactions & Oxidation Numbers',
    'Chemical Kinetics & Equilibrium',
    'Hydrocarbons: Alkanes, Alkenes & Alkynes',
    'Electrochemistry & Electrolysis',
    'Separation Techniques for Mixtures'
  ],
  'biology': [
    'Cell Structure, Functions & Organelles',
    'Photosynthesis & Plant Nutrition',
    'Human Digestive System & Enzymes',
    'Circulatory System, Blood & Heart',
    'Respiratory System & Cellular Respiration',
    'Excretory System & Kidney Osmoregulation',
    'Genetics, DNA & Mendelian Inheritance',
    'Ecology, Food Chains & Biomes',
    'Microorganisms, Pathogens & Immunity',
    'Reproduction in Flowering Plants & Humans'
  ],
  'economics': [
    'Theory of Demand and Supply & Elasticity',
    'Price Mechanism & Equilibrium Price',
    'Production, Costs & Economies of Scale',
    'Market Structures: Perfect Competition & Monopoly',
    'National Income Accounting (GDP & GNP)',
    'Money, Banking & Central Bank Monetary Policy',
    'Inflation, Deflation & Unemployment',
    'Fiscal Policy, Government Budgets & Taxation',
    'International Trade & Balance of Payments'
  ],
  'government': [
    'Basic Concepts: Sovereignty, Power & Authority',
    'Forms of Government: Democracy, Oligarchy & Autocracy',
    'Arms of Government: Legislature, Executive & Judiciary',
    'Separation of Powers & Checks and Balances',
    'Constitutional Development in Nigeria',
    'Electoral Systems & Voting Processes',
    'Colonial Administration in West Africa',
    'Political Parties & Pressure Groups',
    'International Organizations (UN, AU, ECOWAS)'
  ],
  'literature': [
    'Themes in African Poetry',
    'Non-African Poetry Analysis',
    'Shakespearean Drama & Tragedy',
    'Literary Devices: Metaphor, Allegory, Irony',
    'Characterization & Plot Development in Prose',
    'Oral Literature, Myths & Folklore'
  ],
  'civic': [
    'Citizenship Rights, Duties & Responsibilities',
    'Values, Honesty, Integrity & Discipline',
    'Human Rights & Universal Declaration (UDHR)',
    'Rule of Law & Democratic Institutions',
    'National Consciousness, Unity & Patriotism',
    'HIV/AIDS & Drug Abuse Prevention'
  ],
  'computer': [
    'Computer Hardware & System Units',
    'Computer Software: System vs Application',
    'Algorithms & Flowchart Design',
    'Data Representation, Binary & Hexadecimal',
    'Computer Networks, Topology & The Internet',
    'Database Management Systems & SQL Basics',
    'Cyber Security, Malware & Data Protection',
    'Programming Fundamentals & Logic'
  ],
  'commerce': [
    'Introduction to Commerce & Trade',
    'Wholesale & Retail Trade Channels',
    'Advertising & Sales Promotion',
    'Warehousing & Inventory Management',
    'Transportation in Commercial Activities',
    'Insurance & Risk Management Principles'
  ],
  'accounting': [
    'Principles of Double Entry Bookkeeping',
    'Ledger Accounts & Trial Balance',
    'Trading, Profit and Loss Accounts',
    'Balance Sheet & Financial Position',
    'Bank Reconciliation Statements',
    'Depreciation of Fixed Assets & Methods'
  ],
  'agric': [
    'Importance of Agriculture in Economic Development',
    'Soil Science: Types, Composition & Fertility',
    'Crop Husbandry: Cereals, Legumes & Tubers',
    'Animal Husbandry: Ruminants & Poultry',
    'Agricultural Ecology & Weather Factors',
    'Farm Machinery, Implements & Maintenance'
  ]
};
