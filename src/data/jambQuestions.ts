export interface JambQuestion {
  id: string;
  subject: 'english' | 'mathematics' | 'physics' | 'chemistry' | 'biology';
  subjectName: string;
  year: number;
  questionNumber: number;
  topic: string;
  question: string;
  passage?: string;
  options: string[];
  correctAnswer: number; // 0 for A, 1 for B, 2 for C, 3 for D
  explanation: string;
}

export const JAMB_SUBJECTS = [
  { 
    id: 'mathematics' as const, 
    name: 'Mathematics', 
    code: 'MTH',
    color: 'from-blue-600 to-indigo-600',
    accentColor: 'text-blue-600 dark:text-blue-400',
    badgeBg: 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 border-blue-200 dark:border-blue-800',
    hasCalculator: true,
    totalStandardQuestions: 40,
    description: 'Algebra, Trigonometry, Calculus, Coordinate Geometry, Statistics & Probability'
  },
  { 
    id: 'english' as const, 
    name: 'English Language', 
    code: 'ENG',
    color: 'from-emerald-600 to-teal-600',
    accentColor: 'text-emerald-600 dark:text-emerald-400',
    badgeBg: 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
    hasCalculator: false,
    totalStandardQuestions: 60,
    description: 'Comprehension, Lexis & Structure, Concord, Antonyms, Synonyms & Oral English'
  },
  { 
    id: 'physics' as const, 
    name: 'Physics', 
    code: 'PHY',
    color: 'from-purple-600 to-violet-600',
    accentColor: 'text-purple-600 dark:text-purple-400',
    badgeBg: 'bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-300 border-purple-200 dark:border-purple-800',
    hasCalculator: true,
    totalStandardQuestions: 40,
    description: 'Mechanics, Waves, Optics, Electricity, Magnetism & Modern Physics'
  },
  { 
    id: 'chemistry' as const, 
    name: 'Chemistry', 
    code: 'CHM',
    color: 'from-cyan-600 to-blue-600',
    accentColor: 'text-cyan-600 dark:text-cyan-400',
    badgeBg: 'bg-cyan-50 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800',
    hasCalculator: true,
    totalStandardQuestions: 40,
    description: 'Stoichiometry, Periodic Table, Chemical Bonding, Organic Chemistry & Redox'
  },
  { 
    id: 'biology' as const, 
    name: 'Biology', 
    code: 'BIO',
    color: 'from-amber-600 to-orange-600',
    accentColor: 'text-amber-600 dark:text-amber-400',
    badgeBg: 'bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-300 border-amber-200 dark:border-amber-800',
    hasCalculator: false,
    totalStandardQuestions: 40,
    description: 'Genetics, Ecology, Physiology, Cell Structure, Diversity & Evolution'
  },
];

export const JAMB_YEARS = [2024, 2023, 2022, 2021, 2020, 2019, 2018];

export const JAMB_QUESTIONS: JambQuestion[] = [
  // ==========================================
  // MATHEMATICS
  // ==========================================
  {
    id: 'jamb-mth-2024-01',
    subject: 'mathematics',
    subjectName: 'Mathematics',
    year: 2024,
    questionNumber: 1,
    topic: 'Quadratic Equations & Roots',
    question: 'If α and β are the roots of the equation 2x² - 7x + 3 = 0, find the value of (α + β)² - 2αβ.',
    options: ['37/4', '49/4', '25/4', '13/4'],
    correctAnswer: 0,
    explanation: 'For ax² + bx + c = 0, α + β = -b/a = 7/2, and αβ = c/a = 3/2. Note that α² + β² = (α + β)² - 2αβ = (7/2)² - 2(3/2) = 49/4 - 3 = 49/4 - 12/4 = 37/4.'
  },
  {
    id: 'jamb-mth-2024-02',
    subject: 'mathematics',
    subjectName: 'Mathematics',
    year: 2024,
    questionNumber: 2,
    topic: 'Logarithms & Indices',
    question: 'Solve for x if log₂(x + 2) + log₂(x - 2) = 5.',
    options: ['6', '±6', '4', '8'],
    correctAnswer: 0,
    explanation: 'Using log law: log₂[(x + 2)(x - 2)] = 5 => x² - 4 = 2⁵ = 32 => x² = 36 => x = ±6. Since the argument of a logarithm must be strictly positive (x - 2 > 0 => x > 2), we discard x = -6, so x = 6.'
  },
  {
    id: 'jamb-mth-2024-03',
    subject: 'mathematics',
    subjectName: 'Mathematics',
    year: 2024,
    questionNumber: 3,
    topic: 'Differentiation & Applications',
    question: 'Find the gradient of the curve y = 2x³ - 5x² + 4x - 1 at the point where x = 2.',
    options: ['8', '12', '4', '16'],
    correctAnswer: 0,
    explanation: 'The gradient is given by the first derivative dy/dx: dy/dx = 6x² - 10x + 4. Substituting x = 2: dy/dx = 6(2)² - 10(2) + 4 = 6(4) - 20 + 4 = 24 - 20 + 4 = 8.'
  },
  {
    id: 'jamb-mth-2024-04',
    subject: 'mathematics',
    subjectName: 'Mathematics',
    year: 2024,
    questionNumber: 4,
    topic: 'Trigonometry & Identities',
    question: 'If tan θ = 5/12 and θ is an acute angle, evaluate (sin θ + cos θ) / (cos θ - sin θ).',
    options: ['17/7', '7/17', '12/5', '13/7'],
    correctAnswer: 0,
    explanation: 'Divide both numerator and denominator by cos θ: (tan θ + 1) / (1 - tan θ) = (5/12 + 1) / (1 - 5/12) = (17/12) / (7/12) = 17/7.'
  },
  {
    id: 'jamb-mth-2023-01',
    subject: 'mathematics',
    subjectName: 'Mathematics',
    year: 2023,
    questionNumber: 1,
    topic: 'Arithmetic & Geometric Progressions',
    question: 'The 3rd term of an Arithmetic Progression (A.P.) is 10 and the 8th term is 25. Find the common difference and the first term.',
    options: ['d = 3, a = 4', 'd = 3, a = 1', 'd = 5, a = 0', 'd = 2, a = 6'],
    correctAnswer: 0,
    explanation: 'Tₙ = a + (n - 1)d. T₃ = a + 2d = 10 (eq 1). T₈ = a + 7d = 25 (eq 2). Subtracting eq 1 from eq 2: 5d = 15 => d = 3. Substituting into eq 1: a + 2(3) = 10 => a = 4.'
  },
  {
    id: 'jamb-mth-2023-02',
    subject: 'mathematics',
    subjectName: 'Mathematics',
    year: 2023,
    questionNumber: 2,
    topic: 'Matrices & Determinants',
    question: 'Find the determinant of the matrix | 3  -2 | \n| 4   5 |.',
    options: ['23', '7', '-7', '-23'],
    correctAnswer: 0,
    explanation: 'For matrix | a  b | \n| c  d |, det = ad - bc = (3)(5) - (-2)(4) = 15 - (-8) = 15 + 8 = 23.'
  },
  {
    id: 'jamb-mth-2023-03',
    subject: 'mathematics',
    subjectName: 'Mathematics',
    year: 2023,
    questionNumber: 3,
    topic: 'Probability & Combinatorics',
    question: 'In how many different ways can the letters of the word "EXCELLENCE" be arranged?',
    options: ['37,800', '75,600', '151,200', '3,628,800'],
    correctAnswer: 0,
    explanation: 'Total letters = 10. Letter counts: E = 4, C = 2, L = 2, X = 1, N = 1. Number of permutations = 10! / (4! × 2! × 2!) = 3,628,800 / (24 × 2 × 2) = 3,628,800 / 96 = 37,800.'
  },
  {
    id: 'jamb-mth-2022-01',
    subject: 'mathematics',
    subjectName: 'Mathematics',
    year: 2022,
    questionNumber: 1,
    topic: 'Integration & Calculus',
    question: 'Evaluate the definite integral ∫ from 0 to 3 of (3x² - 2x + 1) dx.',
    options: ['21', '18', '24', '15'],
    correctAnswer: 0,
    explanation: '∫ (3x² - 2x + 1) dx = [x³ - x² + x] from 0 to 3. Upper limit: (3)³ - (3)² + 3 = 27 - 9 + 3 = 21. Lower limit: 0. Difference = 21 - 0 = 21.'
  },
  {
    id: 'jamb-mth-2022-02',
    subject: 'mathematics',
    subjectName: 'Mathematics',
    year: 2022,
    questionNumber: 2,
    topic: 'Coordinate Geometry',
    question: 'Find the equation of the line perpendicular to 2x - 3y = 6 and passing through the point (1, -2).',
    options: ['3x + 2y + 1 = 0', '3x - 2y - 7 = 0', '2x + 3y + 4 = 0', '3x + 2y - 1 = 0'],
    correctAnswer: 0,
    explanation: '2x - 3y = 6 => y = (2/3)x - 2. Gradient m₁ = 2/3. For perpendicular line, m₂ = -1/m₁ = -3/2. Equation: y - (-2) = (-3/2)(x - 1) => 2(y + 2) = -3(x - 1) => 2y + 4 = -3x + 3 => 3x + 2y + 1 = 0.'
  },
  {
    id: 'jamb-mth-2021-01',
    subject: 'mathematics',
    subjectName: 'Mathematics',
    year: 2021,
    questionNumber: 1,
    topic: 'Surds & Rationalization',
    question: 'Simplify (√5 + √3) / (√5 - √3).',
    options: ['4 + √15', '4 - √15', '8 + 2√15', '2 + √15'],
    correctAnswer: 0,
    explanation: 'Multiply numerator and denominator by conjugate (√5 + √3): [(√5 + √3)(√5 + √3)] / [(√5 - √3)(√5 + √3)] = (5 + 2√15 + 3) / (5 - 3) = (8 + 2√15) / 2 = 4 + √15.'
  },
  {
    id: 'jamb-mth-2020-01',
    subject: 'mathematics',
    subjectName: 'Mathematics',
    year: 2020,
    questionNumber: 1,
    topic: 'Variation (Direct & Inverse)',
    question: 'y is directly proportional to x² and inversely proportional to √z. If y = 12 when x = 2 and z = 9, find y when x = 3 and z = 16.',
    options: ['20.25', '18', '24', '13.5'],
    correctAnswer: 0,
    explanation: 'y = kx² / √z. 12 = k(2)² / √9 => 12 = 4k / 3 => 4k = 36 => k = 9. When x = 3 and z = 16: y = 9(3)² / √16 = 9(9) / 4 = 81 / 4 = 20.25.'
  },

  // ==========================================
  // ENGLISH LANGUAGE
  // ==========================================
  {
    id: 'jamb-eng-2024-01',
    subject: 'english',
    subjectName: 'English Language',
    year: 2024,
    questionNumber: 1,
    topic: 'Concord & Subject-Verb Agreement',
    question: 'Neither the headmaster nor the class tutors _____ at the emergency PTA meeting.',
    options: ['were present', 'was present', 'is present', 'has been present'],
    correctAnswer: 0,
    explanation: 'Under the Rule of Proximity for neither...nor constructions, when subjects differ in number, the verb agrees with the subject nearest to it. Here, "tutors" is plural, requiring the plural verb "were present".'
  },
  {
    id: 'jamb-eng-2024-02',
    subject: 'english',
    subjectName: 'English Language',
    year: 2024,
    questionNumber: 2,
    topic: 'Antonyms (Opposite in Meaning)',
    question: 'In the sentence: "The senator\'s speech was remarkably CANDID about the state of the economy", choose the word most opposite in meaning to CANDID.',
    options: ['Disingenuous', 'Blunt', 'Outspoken', 'Insightful'],
    correctAnswer: 0,
    explanation: 'Candid means frank, open, and sincere. The antonym is "disingenuous", which means deceitful, insincere, or hypocritical.'
  },
  {
    id: 'jamb-eng-2024-03',
    subject: 'english',
    subjectName: 'English Language',
    year: 2024,
    questionNumber: 3,
    topic: 'Synonyms (Nearest in Meaning)',
    question: 'The committee was asked to come up with an INGENIOUS solution to the persistent traffic congestion.',
    options: ['Clever and inventive', 'Expensive', 'Conventional', 'Impromptu'],
    correctAnswer: 0,
    explanation: 'Ingenious means marked by inventive skill, cleverness, or original design.'
  },
  {
    id: 'jamb-eng-2024-04',
    subject: 'english',
    subjectName: 'English Language',
    year: 2024,
    questionNumber: 4,
    topic: 'Oral English & Word Stress',
    question: 'Identify the syllable that receives primary stress in the word: PHOTOGRAPHY.',
    options: ['pho-TOG-ra-phy (2nd syllable)', 'PHO-tog-ra-phy (1st syllable)', 'pho-tog-RA-phy (3rd syllable)', 'pho-tog-ra-PHY (4th syllable)'],
    correctAnswer: 0,
    explanation: 'Words ending in "-graphy" place primary stress on the antepenultimate syllable (third from the end). Thus: pho-TOG-ra-phy, with primary stress on the second syllable.'
  },
  {
    id: 'jamb-eng-2023-01',
    subject: 'english',
    subjectName: 'English Language',
    year: 2023,
    questionNumber: 1,
    topic: 'Prepositions & Phrasal Verbs',
    question: 'The company decided to call _____ the scheduled strike negotiations until further notice.',
    options: ['off', 'out', 'up', 'down'],
    correctAnswer: 0,
    explanation: '"Call off" is the phrasal verb meaning to cancel an event or activity.'
  },
  {
    id: 'jamb-eng-2023-02',
    subject: 'english',
    subjectName: 'English Language',
    year: 2023,
    questionNumber: 2,
    topic: 'Idioms & Figurative Expressions',
    question: 'To "burn the candle at both ends" means to:',
    options: ['Exhaust oneself by overworking late into the night and early morning', 'Waste electricity or wax recklessly', 'Engage in fraudulent transactions', 'Hold two conflicting opinions'],
    correctAnswer: 0,
    explanation: 'The idiom "burn the candle at both ends" means to overextend oneself physically or mentally by going to bed late and waking early to work.'
  },
  {
    id: 'jamb-eng-2022-01',
    subject: 'english',
    subjectName: 'English Language',
    year: 2022,
    questionNumber: 1,
    topic: 'Lexis & Structure',
    question: 'One of the students who _____ selected for the national olympiad _____ absent today.',
    options: ['were / is', 'was / is', 'was / are', 'were / are'],
    correctAnswer: 0,
    explanation: 'In the relative clause "who were selected", "who" refers back to the antecedent "students" (plural), so "were" is correct. The main subject of the sentence is "One", which is singular, requiring "is". Hence, "were / is".'
  },
  {
    id: 'jamb-eng-2021-01',
    subject: 'english',
    subjectName: 'English Language',
    year: 2021,
    questionNumber: 1,
    topic: 'Vowel Sounds & Rhymes',
    question: 'Which of the following words contains the same vowel sound as the underlined sound in "b<u>ir</u>d"?',
    options: ['Work', 'Board', 'Port', 'Bear'],
    correctAnswer: 0,
    explanation: 'The vowel sound in "bird" is the central open-mid vowel /ɜː/. The word "work" has the identical /ɜː/ sound (/wɜːk/).'
  },

  // ==========================================
  // PHYSICS
  // ==========================================
  {
    id: 'jamb-phy-2024-01',
    subject: 'physics',
    subjectName: 'Physics',
    year: 2024,
    questionNumber: 1,
    topic: 'Mechanics: Projectile Motion',
    question: 'A projectile is launched with an initial velocity of 50 m/s at an angle of 30° to the horizontal. Calculate the maximum height reached by the projectile. [Take g = 10 m/s²]',
    options: ['31.25 m', '62.5 m', '125 m', '25 m'],
    correctAnswer: 0,
    explanation: 'H_max = (u² sin² θ) / (2g) = [50² × (sin 30°)²] / [2 × 10] = [2500 × (0.5)²] / 20 = [2500 × 0.25] / 20 = 625 / 20 = 31.25 m.'
  },
  {
    id: 'jamb-phy-2024-02',
    subject: 'physics',
    subjectName: 'Physics',
    year: 2024,
    questionNumber: 2,
    topic: 'Current Electricity & Ohm\'s Law',
    question: 'Three identical resistors, each of resistance 6 Ω, are connected such that two are in parallel and the third is in series with the combination. What is the total equivalent resistance?',
    options: ['9 Ω', '4 Ω', '18 Ω', '2 Ω'],
    correctAnswer: 0,
    explanation: 'Parallel combination of two 6 Ω resistors: R_p = (6 × 6) / (6 + 6) = 36 / 12 = 3 Ω. Now add the third resistor in series: R_total = R_p + R₃ = 3 Ω + 6 Ω = 9 Ω.'
  },
  {
    id: 'jamb-phy-2024-03',
    subject: 'physics',
    subjectName: 'Physics',
    year: 2024,
    questionNumber: 3,
    topic: 'Thermal Physics & Heat Transfer',
    question: 'Calculate the quantity of heat needed to raise the temperature of 2 kg of copper from 25 °C to 75 °C. [Specific heat capacity of copper = 400 J/(kg·K)]',
    options: ['40,000 J', '20,000 J', '80,000 J', '10,000 J'],
    correctAnswer: 0,
    explanation: 'Q = mcΔT = 2 kg × 400 J/(kg·K) × (75 - 25) K = 800 × 50 = 40,000 J (or 40 kJ).'
  },
  {
    id: 'jamb-phy-2023-01',
    subject: 'physics',
    subjectName: 'Physics',
    year: 2023,
    questionNumber: 1,
    topic: 'Waves & Sound',
    question: 'A sound wave of frequency 440 Hz travels through air with a speed of 330 m/s. What is its wavelength?',
    options: ['0.75 m', '1.33 m', '0.50 m', '1.50 m'],
    correctAnswer: 0,
    explanation: 'v = fλ => λ = v / f = 330 / 440 = 33 / 44 = 3 / 4 = 0.75 m.'
  },
  {
    id: 'jamb-phy-2023-02',
    subject: 'physics',
    subjectName: 'Physics',
    year: 2023,
    questionNumber: 2,
    topic: 'Optics: Refraction & Lenses',
    question: 'An object is placed 15 cm in front of a convex lens of focal length 10 cm. Find the image distance from the lens.',
    options: ['30 cm', '25 cm', '6 cm', '15 cm'],
    correctAnswer: 0,
    explanation: 'Lens formula: 1/f = 1/v + 1/u. For real object, u = +15 cm, convex lens f = +10 cm. 1/10 = 1/v + 1/15 => 1/v = 1/10 - 1/15 = (3 - 2)/30 = 1/30 => v = 30 cm.'
  },
  {
    id: 'jamb-phy-2022-01',
    subject: 'physics',
    subjectName: 'Physics',
    year: 2022,
    questionNumber: 1,
    topic: 'Nuclear Physics & Radioactivity',
    question: 'A radioactive sample has a half-life of 4 days. If the initial mass is 64 g, what mass of the sample remains undecayed after 16 days?',
    options: ['4 g', '8 g', '2 g', '16 g'],
    correctAnswer: 0,
    explanation: 'Number of half-lives n = Total time / half-life = 16 / 4 = 4. Remaining mass = N₀ × (1/2)ⁿ = 64 × (1/2)⁴ = 64 / 16 = 4 g.'
  },
  {
    id: 'jamb-phy-2021-01',
    subject: 'physics',
    subjectName: 'Physics',
    year: 2021,
    questionNumber: 1,
    topic: 'Capacitors & Electrostatics',
    question: 'Two capacitors of capacitance 4 μF and 6 μF are connected in series across a 100 V DC source. Calculate the equivalent capacitance.',
    options: ['2.4 μF', '10 μF', '5 μF', '1.2 μF'],
    correctAnswer: 0,
    explanation: 'For capacitors in series: 1/C_eq = 1/C₁ + 1/C₂ = (C₁ + C₂) / (C₁C₂) => C_eq = (4 × 6) / (4 + 6) = 24 / 10 = 2.4 μF.'
  },

  // ==========================================
  // CHEMISTRY
  // ==========================================
  {
    id: 'jamb-chm-2024-01',
    subject: 'chemistry',
    subjectName: 'Chemistry',
    year: 2024,
    questionNumber: 1,
    topic: 'Stoichiometry & Mole Concept',
    question: 'What volume of oxygen at standard temperature and pressure (s.t.p.) is required for the complete combustion of 5.6 g of ethene (C₂H₄)? [C = 12, H = 1, Molar volume at s.t.p = 22.4 dm³]',
    options: ['13.44 dm³', '4.48 dm³', '22.40 dm³', '6.72 dm³'],
    correctAnswer: 0,
    explanation: 'Balanced equation: C₂H₄ + 3O₂ -> 2CO₂ + 2H₂O. Molar mass of C₂H₄ = 2(12) + 4(1) = 28 g/mol. Moles of C₂H₄ = 5.6 / 28 = 0.2 mol. From stoichiometry, 1 mol C₂H₄ requires 3 mol O₂. Moles of O₂ = 0.2 × 3 = 0.6 mol. Volume = 0.6 × 22.4 dm³ = 13.44 dm³.'
  },
  {
    id: 'jamb-chm-2024-02',
    subject: 'chemistry',
    subjectName: 'Chemistry',
    year: 2024,
    questionNumber: 2,
    topic: 'Periodic Table & Periodicity',
    question: 'Which of the following elements has the lowest first ionization energy?',
    options: ['Cesium (Cs)', 'Sodium (Na)', 'Chlorine (Cl)', 'Fluorine (F)'],
    correctAnswer: 0,
    explanation: 'Ionization energy decreases down a group due to increased shielding and atomic radius, and increases across a period. Cesium is at the bottom of Group 1 (alkali metals) and has the lowest first ionization energy among the options.'
  },
  {
    id: 'jamb-chm-2024-03',
    subject: 'chemistry',
    subjectName: 'Chemistry',
    year: 2024,
    questionNumber: 3,
    topic: 'Electrochemistry & Faraday\'s Laws',
    question: 'How many Faradays of electricity are required to deposit 108 g of silver (Ag) from a solution of silver nitrate? [Ag = 108]',
    options: ['1 Faraday', '2 Faradays', '0.5 Faraday', '108 Faradays'],
    correctAnswer: 0,
    explanation: 'Half-reaction: Ag⁺ + e⁻ -> Ag. 1 mole of electrons (1 Faraday) deposits 1 mole of silver atoms (108 g). Since 108 g is exactly 1 mole, exactly 1 Faraday is required.'
  },
  {
    id: 'jamb-chm-2023-01',
    subject: 'chemistry',
    subjectName: 'Chemistry',
    year: 2023,
    questionNumber: 1,
    topic: 'Acids, Bases & pH Calculations',
    question: 'What is the pH of a 0.005 M sulfuric acid (H₂SO₄) solution, assuming complete ionization?',
    options: ['2.0', '2.3', '1.0', '3.0'],
    correctAnswer: 0,
    explanation: 'H₂SO₄ is a diprotic acid: H₂SO₄ -> 2H⁺ + SO₄²⁻. [H⁺] = 2 × 0.005 M = 0.01 M = 10⁻² M. pH = -log₁₀[H⁺] = -log₁₀(10⁻²) = 2.0.'
  },
  {
    id: 'jamb-chm-2023-02',
    subject: 'chemistry',
    subjectName: 'Chemistry',
    year: 2023,
    questionNumber: 2,
    topic: 'Organic Chemistry: Hydrocarbons',
    question: 'The reaction between ethanol and ethanoic acid in the presence of concentrated H₂SO₄ yields:',
    options: ['Ethyl ethanoate and water', 'Ethanal and hydrogen', 'Diethyl ether', 'Ethene and sulfur dioxide'],
    correctAnswer: 0,
    explanation: 'This is an esterification reaction: C₂H₅OH + CH₃COOH (conc H₂SO₄ catalyst) <=> CH₃COOC₂H₅ (ethyl ethanoate, an ester) + H₂O.'
  },
  {
    id: 'jamb-chm-2022-01',
    subject: 'chemistry',
    subjectName: 'Chemistry',
    year: 2022,
    questionNumber: 1,
    topic: 'Gas Laws & Kinetic Theory',
    question: 'A given mass of gas occupies 500 cm³ at 27 °C and 760 mmHg. What volume will it occupy at -23 °C and the same pressure?',
    options: ['416.7 cm³', '600.0 cm³', '250.0 cm³', '380.0 cm³'],
    correctAnswer: 0,
    explanation: 'Charles\'s Law (pressure constant): V₁/T₁ = V₂/T₂. T₁ = 27 + 273 = 300 K. T₂ = -23 + 273 = 250 K. V₂ = (V₁ × T₂) / T₁ = (500 × 250) / 300 = 125000 / 300 = 416.7 cm³.'
  },

  // ==========================================
  // BIOLOGY
  // ==========================================
  {
    id: 'jamb-bio-2024-01',
    subject: 'biology',
    subjectName: 'Biology',
    year: 2024,
    questionNumber: 1,
    topic: 'Genetics & Blood Group Inheritance',
    question: 'A man with blood group AB marries a woman with blood group O. What are the possible blood groups of their children?',
    options: ['A and B only', 'AB and O only', 'A, B, AB, and O', 'O only'],
    correctAnswer: 0,
    explanation: 'The man has genotype IᴬIᴮ and the woman has genotype IᴼIᴼ. The offspring inherit either (Iᴬ from father, Iᴼ from mother) giving blood group A, or (Iᴮ from father, Iᴼ from mother) giving blood group B. Thus, only groups A and B are possible.'
  },
  {
    id: 'jamb-bio-2024-02',
    subject: 'biology',
    subjectName: 'Biology',
    year: 2024,
    questionNumber: 2,
    topic: 'Ecology & Nutrient Cycles',
    question: 'In the nitrogen cycle, which group of bacteria converts nitrites (NO₂⁻) into nitrates (NO₃⁻)?',
    options: ['Nitrobacter', 'Nitrosomonas', 'Rhizobium', 'Azotobacter'],
    correctAnswer: 0,
    explanation: 'Nitrosomonas oxidizes ammonia into nitrites (NO₂⁻), while Nitrobacter oxidizes nitrites into nitrates (NO₃⁻), which are readily absorbed by plant root systems.'
  },
  {
    id: 'jamb-bio-2024-03',
    subject: 'biology',
    subjectName: 'Biology',
    year: 2024,
    questionNumber: 3,
    topic: 'Cell Biology & Organelles',
    question: 'Which cellular structure is primarily responsible for the synthesis of lipids and steroid hormones?',
    options: ['Smooth Endoplasmic Reticulum', 'Rough Endoplasmic Reticulum', 'Golgi Apparatus', 'Lysosome'],
    correctAnswer: 0,
    explanation: 'The Smooth Endoplasmic Reticulum (SER) lacks ribosomes and synthesizes lipids, phospholipids, and steroid hormones, while the Rough ER specializes in protein synthesis.'
  },
  {
    id: 'jamb-bio-2023-01',
    subject: 'biology',
    subjectName: 'Biology',
    year: 2023,
    questionNumber: 1,
    topic: 'Transport Systems: Blood & Circulation',
    question: 'Which blood vessel carries oxygenated blood directly from the lungs into the left atrium of the mammalian heart?',
    options: ['Pulmonary vein', 'Pulmonary artery', 'Aorta', 'Vena cava'],
    correctAnswer: 0,
    explanation: 'The pulmonary veins are the only veins in the human body that carry oxygenated blood, transporting it from the lungs back to the left atrium of the heart.'
  },
  {
    id: 'jamb-bio-2023-02',
    subject: 'biology',
    subjectName: 'Biology',
    year: 2023,
    questionNumber: 2,
    topic: 'Plant Physiology: Photosynthesis',
    question: 'During photosynthesis, the photolysis of water occurs in the presence of light and chlorophyll to yield:',
    options: ['Hydrogen ions, electrons, and oxygen gas', 'Glucose and carbon dioxide', 'Carbon dioxide and water', 'Lactic acid and energy'],
    correctAnswer: 0,
    explanation: 'In the light-dependent reaction (Hill reaction), water is split (photolysis): 2H₂O -> 4H⁺ + 4e⁻ + O₂. Oxygen is released as a byproduct.'
  },
  {
    id: 'jamb-bio-2022-01',
    subject: 'biology',
    subjectName: 'Biology',
    year: 2022,
    questionNumber: 1,
    topic: 'Excretion & Osmoregulation',
    question: 'The functional microscopic unit of the mammalian kidney responsible for urine formation is the:',
    options: ['Nephron', 'Neuron', 'Glomerulus', 'Loop of Henle'],
    correctAnswer: 0,
    explanation: 'The nephron is the complete functional and structural unit of the kidney, comprising Bowman\'s capsule, glomerulus, proximal and distal convoluted tubules, and the Loop of Henle.'
  }
];

export function getJambQuestionsByFilter(
  subject: 'english' | 'mathematics' | 'physics' | 'chemistry' | 'biology',
  year?: number | 'all',
  count: number = 20
): JambQuestion[] {
  let filtered = JAMB_QUESTIONS.filter(q => q.subject === subject);
  
  if (year && year !== 'all') {
    const yearFiltered = filtered.filter(q => q.year === year);
    if (yearFiltered.length > 0) {
      filtered = yearFiltered;
    }
  }

  // Shuffle questions randomly to ensure fresh practice
  const shuffled = [...filtered].sort(() => 0.5 - Math.random());
  
  // If count exceeds existing questions for that specific filter, duplicate with varying order or return all
  if (shuffled.length < count) {
    // Fill up with subject pool
    const extraPool = JAMB_QUESTIONS.filter(q => q.subject === subject);
    while (shuffled.length < count && extraPool.length > 0) {
      const pick = extraPool[Math.floor(Math.random() * extraPool.length)];
      shuffled.push({
        ...pick,
        id: `${pick.id}-variant-${shuffled.length + 1}`
      });
    }
  }

  return shuffled.slice(0, count);
}
