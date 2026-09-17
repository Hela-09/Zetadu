import { OFFICIAL_JAMB_SUBJECTS, JambSubject } from './jambSubjects';

export interface JambQuestion {
  id: string;
  subject: string;
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

export const JAMB_SUBJECTS = OFFICIAL_JAMB_SUBJECTS;
export type { JambSubject };

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
  },

  // ==========================================
  // JAMB PRESCRIBED NOVEL: THE LEKKI HEADMASTER
  // ==========================================
  {
    id: 'jamb-nov-2025-01',
    subject: 'english',
    subjectName: 'English Language',
    year: 2024,
    questionNumber: 11,
    topic: 'The Prescribed Novel: The Lekki Headmaster',
    question: 'In Kabir Alabi Garba\'s "The Lekki Headmaster", what is Mr. Bepo\'s primary reason for rejecting the wealthy parent\'s demand to upgrade his son\'s terminal assessment grades?',
    options: [
      'He insisted that academic integrity and uncompromised character development must supersede commercial prestige',
      'The school proprietress Mrs. Savage had already issued an expulsion letter to the pupil',
      'The parent failed to remit the complete termly tuition fee on time',
      'The Ministry of Education had dispatched external examination monitors that very morning'
    ],
    correctAnswer: 0,
    explanation: 'Throughout the novel, Mr. Bepo epitomizes unshakeable ethical leadership, steadfastly maintaining that schools must uphold truthful grading and character formation rather than yielding to wealthy parental entitlement.'
  },
  {
    id: 'jamb-nov-2025-02',
    subject: 'english',
    subjectName: 'English Language',
    year: 2024,
    questionNumber: 12,
    topic: 'The Prescribed Novel: The Lekki Headmaster',
    question: 'How does Mrs. Savage\'s philosophy regarding the administration of Stardom Schools contrast with Mr. Bepo\'s core ideals?',
    options: [
      'Mrs. Savage views the school fundamentally through a business lens of elite client retention, whereas Mr. Bepo views education as moral transformation',
      'Mrs. Savage advocates exclusively for vocational education while Mr. Bepo champions liberal arts',
      'Mrs. Savage opposes modern educational technology whereas Mr. Bepo desires digital smartboards',
      'Mrs. Savage desires to transfer the school to a rural village outside Lagos'
    ],
    correctAnswer: 0,
    explanation: 'Mrs. Savage is pragmatic and market-driven, seeking to protect Stardom Schools\' prestigious image among Lekki\'s affluent class, contrasting sharply with Mr. Bepo\'s uncompromising moral pedagogy.'
  },

  // ==========================================
  // LITERATURE IN ENGLISH
  // ==========================================
  {
    id: 'jamb-lit-2024-01',
    subject: 'literature',
    subjectName: 'Literature in English',
    year: 2024,
    questionNumber: 1,
    topic: 'Literary Appreciation & Figures of Speech',
    question: 'Identify the figure of speech employed in the line: "The burning fire of betrayal whispered cold secrets to his bleeding conscience."',
    options: ['Oxymoron and Personification', 'Metonymy and Euphemism', 'Hyperbole and Synecdoche', 'Apostrophe and Litotes'],
    correctAnswer: 0,
    explanation: '"Cold secrets" juxtaposed against "burning fire" creates an oxymoron, while "fire whispered" attributes human vocal speech to an inanimate flame, constituting personification.'
  },
  {
    id: 'jamb-lit-2024-02',
    subject: 'literature',
    subjectName: 'Literature in English',
    year: 2024,
    questionNumber: 2,
    topic: 'Dramatic Conventions',
    question: 'A dramatic convention whereby a character speaks directly to the audience, revealing their innermost thoughts while remaining unheard by other characters present on stage, is known as:',
    options: ['An Aside', 'A Soliloquy', 'A Prologue', 'Dramatic Irony'],
    correctAnswer: 0,
    explanation: 'An Aside is a short speech delivered to the audience while other characters are present on stage but presumed not to hear. A Soliloquy occurs when the character is entirely alone on stage.'
  },
  {
    id: 'jamb-lit-2023-01',
    subject: 'literature',
    subjectName: 'Literature in English',
    year: 2023,
    questionNumber: 1,
    topic: 'Poetic Forms & Meters',
    question: 'A poem of fourteen lines structured into an octave (rhyming abbaabba) followed by a sestet (rhyming cdecde or cdcdcd) is classified as a:',
    options: ['Petrarchan (Italian) Sonnet', 'Shakespearean (English) Sonnet', 'Spenserian Sonnet', 'Dramatic Monologue'],
    correctAnswer: 0,
    explanation: 'The Petrarchan or Italian sonnet divides into an octave and sestet with the volta (turn) typically occurring between lines 8 and 9. Shakespearean sonnets consist of three quatrains and a concluding rhyming couplet.'
  },
  {
    id: 'jamb-lit-2023-02',
    subject: 'literature',
    subjectName: 'Literature in English',
    year: 2023,
    questionNumber: 2,
    topic: 'Tragic Conventions',
    question: 'In classical tragedy, the fatal flaw or error in judgment that inevitably precipitates the downfall of a noble protagonist is termed:',
    options: ['Hamartia', 'Catharsis', 'Hubris', 'Peripeteia'],
    correctAnswer: 0,
    explanation: 'Aristotle defined Hamartia as the tragic flaw or internal shortcoming (such as excessive ambition or indecision) that leads to catastrophe. Catharsis refers to the emotional purgation experienced by the audience.'
  },

  // ==========================================
  // ECONOMICS
  // ==========================================
  {
    id: 'jamb-ecn-2024-01',
    subject: 'economics',
    subjectName: 'Economics',
    year: 2024,
    questionNumber: 1,
    topic: 'Demand, Supply & Elasticity',
    question: 'When a 10% increase in the price of a commodity results in a 25% decrease in the quantity demanded, the price elasticity of demand is:',
    options: ['2.5 (Elastic)', '0.4 (Inelastic)', '1.0 (Unitary elastic)', '25.0 (Perfect elastic)'],
    correctAnswer: 0,
    explanation: 'Price Elasticity of Demand (PED) = |% Change in Quantity Demanded / % Change in Price| = 25% / 10% = 2.5. Since PED > 1, demand is price elastic.'
  },
  {
    id: 'jamb-ecn-2024-02',
    subject: 'economics',
    subjectName: 'Economics',
    year: 2024,
    questionNumber: 2,
    topic: 'National Income Accounting',
    question: 'Gross Domestic Product (GDP) differs from Gross National Product (GNP) by the value of:',
    options: ['Net factor income from abroad (NFIA)', 'Depreciation and capital consumption allowance', 'Indirect business taxes minus subsidies', 'Retained corporate earnings'],
    correctAnswer: 0,
    explanation: 'GNP = GDP + Net Factor Income from Abroad (NFIA). NFIA is income earned by domestic residents from overseas investments minus income earned by foreign residents in the domestic economy.'
  },
  {
    id: 'jamb-ecn-2023-01',
    subject: 'economics',
    subjectName: 'Economics',
    year: 2023,
    questionNumber: 1,
    topic: 'Market Structures & Production Theory',
    question: 'Under perfect competition, a firm maximizes profit in both short-run and long-run equilibrium at the output level where:',
    options: ['Price = Marginal Revenue = Marginal Cost (P = MR = MC)', 'Price = Average Fixed Cost', 'Total Revenue exceeds Total Cost by the largest percentage', 'Marginal Revenue is zero'],
    correctAnswer: 0,
    explanation: 'Because a competitive firm is a price taker facing a perfectly elastic demand curve, P = MR = AR. Maximum profit occurs where Marginal Revenue equals Marginal Cost (MR = MC), thus P = MR = MC.'
  },
  {
    id: 'jamb-ecn-2023-02',
    subject: 'economics',
    subjectName: 'Economics',
    year: 2023,
    questionNumber: 2,
    topic: 'Money, Banking & Inflation',
    question: 'Cost-push inflation in an open developing economy like Nigeria is most frequently initiated by:',
    options: ['A sharp increase in the costs of production, such as fuel price hikes or foreign exchange devaluation', 'Excessive money supply growth without corresponding output increases', 'A sudden surge in consumer credit cards and personal spending', 'A persistent fiscal budget surplus run by the federal treasury'],
    correctAnswer: 0,
    explanation: 'Cost-push inflation stems from supply-side shocks that increase per-unit production costs (e.g. energy costs, imported raw materials devaluation, rising wages), shifting aggregate supply inward.'
  },

  // ==========================================
  // GOVERNMENT
  // ==========================================
  {
    id: 'jamb-gov-2024-01',
    subject: 'government',
    subjectName: 'Government',
    year: 2024,
    questionNumber: 1,
    topic: 'Constitutional Developments in Nigeria',
    question: 'Which Nigerian colonial constitution was the first to introduce the elective principle into the country\'s legislative council?',
    options: ['The 1922 Clifford Constitution', 'The 1946 Richards Constitution', 'The 1951 Macpherson Constitution', 'The 1954 Lyttelton Constitution'],
    correctAnswer: 0,
    explanation: 'Sir Hugh Clifford\'s 1922 Constitution introduced the elective principle for the first time in British West Africa, providing 4 elected seats (3 for Lagos and 1 for Calabar).'
  },
  {
    id: 'jamb-gov-2024-02',
    subject: 'government',
    subjectName: 'Government',
    year: 2024,
    questionNumber: 2,
    topic: 'Basic Concepts: Sovereignty, Power & Rule of Law',
    question: 'According to A.V. Dicey, the doctrine of the Rule of Law fundamentally requires all of the following EXCEPT:',
    options: ['Immunity of top state officials from ordinary legal prosecution', 'Supremacy of the regular law over arbitrary power', 'Equality before the law of all citizens', 'Protection of fundamental civil liberties by ordinary courts'],
    correctAnswer: 0,
    explanation: 'Dicey\'s three core tenets of the Rule of Law are: absolute supremacy of regular law (absence of arbitrary power), equality before the law, and rights of individuals determined by ordinary courts. Official immunity contradicts equality before the law.'
  },
  {
    id: 'jamb-gov-2023-01',
    subject: 'government',
    subjectName: 'Government',
    year: 2023,
    questionNumber: 1,
    topic: 'Systems of Government',
    question: 'A crucial distinction between a Presidential system and a Parliamentary system of government is that in a Presidential system:',
    options: ['The Head of State is also the Head of Government and is not directly accountable to Parliament for his tenure', 'Cabinet ministers must be selected exclusively from the legislature', 'The Prime Minister exercises power of legislative dissolution', 'The executive possesses absolute unchecked decree powers'],
    correctAnswer: 0,
    explanation: 'In a presidential system (such as Nigeria and the USA), executive power is vested in a single President who is both Head of State and Government, separate from the legislature, with a fixed tenure.'
  },
  {
    id: 'jamb-gov-2023-02',
    subject: 'government',
    subjectName: 'Government',
    year: 2023,
    questionNumber: 2,
    topic: 'Nigerian Foreign Policy & International Orgs',
    question: 'The Economic Community of West African States (ECOWAS) was officially established under the Treaty of Lagos signed in what year?',
    options: ['1975', '1960', '1985', '1999'],
    correctAnswer: 0,
    explanation: 'ECOWAS was founded on 28 May 1975 via the Treaty of Lagos, spearheaded by General Yakubu Gowon of Nigeria and President Gnassingbé Eyadéma of Togo to promote regional economic integration.'
  },

  // ==========================================
  // COMMERCE
  // ==========================================
  {
    id: 'jamb-com-2024-01',
    subject: 'commerce',
    subjectName: 'Commerce',
    year: 2024,
    questionNumber: 1,
    topic: 'Aids to Trade & Transport',
    question: 'Which of the following aids to trade directly bridges the physical gap and eliminates distance between manufacturers and distant consumers?',
    options: ['Transport', 'Insurance', 'Banking', 'Advertising'],
    correctAnswer: 0,
    explanation: 'Transport bridges spatial barriers and creates place utility by physically moving commodities from areas of surplus/production to areas of demand.'
  },
  {
    id: 'jamb-com-2023-01',
    subject: 'commerce',
    subjectName: 'Commerce',
    year: 2023,
    questionNumber: 2,
    topic: 'Trade Documents',
    question: 'A document dispatched by a seller to notify a customer that their ledger account has been credited for overcharged or returned merchandise is known as a:',
    options: ['Debit Note', 'Credit Note', 'Pro-forma Invoice', 'Consignment Note'],
    correctAnswer: 1,
    explanation: 'A Credit Note is sent to a buyer to reduce the amount they owe, commonly issued when goods are returned damaged, wrong items were sent, or overcharging occurred.'
  },
  {
    id: 'jamb-com-2022-01',
    subject: 'commerce',
    subjectName: 'Commerce',
    year: 2022,
    questionNumber: 3,
    topic: 'Business Organizations & Capital',
    question: 'Which of the following business ownership models confers limited liability on all shareholders and allows shares to be publicly quoted and transferred on a securities exchange?',
    options: ['Sole Proprietorship', 'Partnership', 'Private Limited Company', 'Public Limited Company (Plc)'],
    correctAnswer: 3,
    explanation: 'A Public Limited Company (Plc) issues publicly quoted shares on the stock exchange, has a minimum of 7 members with no upper limit, and protects shareholders via limited liability.'
  },

  // ==========================================
  // PRINCIPLES OF ACCOUNTS
  // ==========================================
  {
    id: 'jamb-acc-2024-01',
    subject: 'accounts',
    subjectName: 'Principles of Accounts',
    year: 2024,
    questionNumber: 1,
    topic: 'Accounting Equation & Principles',
    question: 'The foundational double-entry accounting equation states that:',
    options: ['Assets = Liabilities + Capital', 'Assets = Liabilities - Capital', 'Capital = Assets + Liabilities', 'Liabilities = Assets + Capital'],
    correctAnswer: 0,
    explanation: 'The fundamental balance sheet equation is Assets = Liabilities + Capital (Owner’s Equity), signifying that all economic resources possessed by a firm are financed either by creditors or the owners.'
  },
  {
    id: 'jamb-acc-2023-01',
    subject: 'accounts',
    subjectName: 'Principles of Accounts',
    year: 2023,
    questionNumber: 2,
    topic: 'Ledger Entries & Cash Book',
    question: 'What is the correct double-entry journal entry to record immediate cash sales of ₦50,000?',
    options: ['Debit Cash Account, Credit Sales Account', 'Debit Sales Account, Credit Cash Account', 'Debit Purchases Account, Credit Cash Account', 'Debit Capital Account, Credit Sales Account'],
    correctAnswer: 0,
    explanation: 'Under the double-entry rule: Debit what comes in (Cash asset increases), Credit the revenue/income source (Sales account).'
  },
  {
    id: 'jamb-acc-2022-01',
    subject: 'accounts',
    subjectName: 'Principles of Accounts',
    year: 2022,
    questionNumber: 3,
    topic: 'Trial Balance & Errors',
    question: 'Which of the following accounting errors will NOT disrupt the arithmetic equality of total debits and credits on a Trial Balance?',
    options: ['Compensating error', 'Single entry error', 'Casting error on Sales account', 'Transposition error in a single posting'],
    correctAnswer: 0,
    explanation: 'A Compensating Error occurs when an error on the debit side is neutralized by an equal error of the same amount on the credit side, leaving the trial balance arithmetic intact.'
  },

  // ==========================================
  // AGRICULTURAL SCIENCE
  // ==========================================
  {
    id: 'jamb-agr-2024-01',
    subject: 'agriculture',
    subjectName: 'Agricultural Science',
    year: 2024,
    questionNumber: 1,
    topic: 'Soil Science & Formation',
    question: 'The breakdown and mechanical/chemical disintegration of parent rocks into loose, fertile soil particles under atmospheric exposure is termed:',
    options: ['Weathering', 'Soil Leaching', 'Deforestation', 'Salinization'],
    correctAnswer: 0,
    explanation: 'Weathering is the physical disintegration and chemical decomposition of parent mineral rocks by climatic agents (water, temperature, pressure) and biological organisms.'
  },
  {
    id: 'jamb-agr-2023-01',
    subject: 'agriculture',
    subjectName: 'Agricultural Science',
    year: 2023,
    questionNumber: 2,
    topic: 'Animal Husbandry & Digestion',
    question: 'Which of the following domestic farm animals possesses a single non-compartmentalized stomach but utilizes an enlarged functional caecum for cellulose microbial digestion (pseudo-ruminant)?',
    options: ['Goat', 'Sheep', 'Rabbit', 'Cattle'],
    correctAnswer: 2,
    explanation: 'Rabbits and horses are monogastric non-ruminants (pseudo-ruminants) that ferment plant cellulose in an exceptionally enlarged caecum rather than a 4-chambered rumen.'
  },
  {
    id: 'jamb-agr-2022-01',
    subject: 'agriculture',
    subjectName: 'Agricultural Science',
    year: 2022,
    questionNumber: 3,
    topic: 'Plant Nutrition & Soil Chemistry',
    question: 'A universal agronomic symptom indicating acute Nitrogen deficiency in arable field crops is:',
    options: ['General chlorosis and yellowing beginning on older leaves', 'Purple purplish pigmentation of leaf stems', 'Immediate blossom drop', 'Excessive vegetative growth'],
    correctAnswer: 0,
    explanation: 'Nitrogen is mobile within plants. When deficient, the plant mobilizes existing nitrogen from older basal leaves to support younger apical shoots, causing premature yellowing (chlorosis) in older leaves.'
  },

  // ==========================================
  // GEOGRAPHY
  // ==========================================
  {
    id: 'jamb-geo-2024-01',
    subject: 'geography',
    subjectName: 'Geography',
    year: 2024,
    questionNumber: 1,
    topic: 'Cartography & Map Reading',
    question: 'A topographical survey map constructed at a representative fraction (RF) scale of 1:50,000 implies that 2 centimetres on the map corresponds to what actual ground distance?',
    options: ['1 kilometre', '500 metres', '5 kilometres', '100 metres'],
    correctAnswer: 0,
    explanation: 'At 1:50,000, 1 cm on the map equals 50,000 cm = 500 m on the ground. Therefore, 2 cm on map equals 2 × 500 m = 1,000 m = 1 kilometre.'
  },
  {
    id: 'jamb-geo-2023-01',
    subject: 'geography',
    subjectName: 'Geography',
    year: 2023,
    questionNumber: 2,
    topic: 'Climatology & Rainfall',
    question: 'The characteristic rainfall type prevalent across the low-latitude tropical rainforest zones of southern Nigeria, typically preceded by high insolation and afternoon thunderstorms, is:',
    options: ['Convectional rainfall', 'Orographic / Relief rainfall', 'Frontal / Cyclonic rainfall', 'Advectional precipitation'],
    correctAnswer: 0,
    explanation: 'Convectional rainfall results from intense daytime solar heating of the Earth’s surface, causing hot moist air parcels to ascend rapidly, cool adiabatically, condense, and generate torrential afternoon downpours.'
  },
  {
    id: 'jamb-geo-2022-01',
    subject: 'geography',
    subjectName: 'Geography',
    year: 2022,
    questionNumber: 3,
    topic: 'Geomorphology & Rocks',
    question: 'Granite and gabbro are classified as which primary type of rock according to geological origin and formation process?',
    options: ['Plutonic intrusive igneous rocks', 'Volcanic extrusive igneous rocks', 'Chemically formed sedimentary rocks', 'Foliated metamorphic rocks'],
    correctAnswer: 0,
    explanation: 'Plutonic intrusive igneous rocks solidify slowly deep within the earth crust from magma chambers, resulting in coarse-grained crystalline structures like granite.'
  },

  // ==========================================
  // CHRISTIAN RELIGIOUS STUDIES
  // ==========================================
  {
    id: 'jamb-crs-2024-01',
    subject: 'crs',
    subjectName: 'Christian Religious Studies',
    year: 2024,
    questionNumber: 1,
    topic: 'Kingship in Israel & Old Testament',
    question: 'In the Old Testament narrative, King David fell into transgression by committing adultery with Bathsheba, who was the lawful wife of which devoted military officer?',
    options: ['Uriah the Hittite', 'Joab son of Zeruiah', 'Nathan the Prophet', 'Abner son of Ner'],
    correctAnswer: 0,
    explanation: 'According to 2 Samuel 11, Bathsheba was the wife of Uriah the Hittite, one of David’s elite thirty valiant warriors whom David subsequently commanded to be placed in the forefront of fierce battle.'
  },
  {
    id: 'jamb-crs-2023-01',
    subject: 'crs',
    subjectName: 'Christian Religious Studies',
    year: 2023,
    questionNumber: 2,
    topic: 'Pauline Epistles & Christian Ethics',
    question: 'According to Apostle Paul in Galatians 5:22-23, what is designated as the very first manifestation of the fruit of the Holy Spirit?',
    options: ['Love (Agape)', 'Joy', 'Peace', 'Gentleness'],
    correctAnswer: 0,
    explanation: 'Galatians 5:22 states: "But the fruit of the Spirit is love, joy, peace, longsuffering, gentleness, goodness, faith..." with Love standing as the foundational virtue.'
  },
  {
    id: 'jamb-crs-2022-01',
    subject: 'crs',
    subjectName: 'Christian Religious Studies',
    year: 2022,
    questionNumber: 3,
    topic: 'Prophets of Israel',
    question: 'Which Hebrew prophet challenged and defeated the 450 prophets of Baal in the supreme contest of fire sacrifice atop Mount Carmel?',
    options: ['Elijah the Tishbite', 'Elisha', 'Amos of Tekoa', 'Hosea'],
    correctAnswer: 0,
    explanation: 'In 1 Kings 18, Prophet Elijah challenged King Ahab and the 450 prophets of Baal on Mount Carmel where God answered by sending divine fire to consume the sacrifice.'
  },

  // ==========================================
  // ISLAMIC STUDIES
  // ==========================================
  {
    id: 'jamb-irs-2024-01',
    subject: 'irs',
    subjectName: 'Islamic Studies',
    year: 2024,
    questionNumber: 1,
    topic: 'Foundations of Shariah & Hadith',
    question: 'The supreme, infallible primary source of Islamic Law (Shari’ah) is the Holy Qur’an, followed immediately by:',
    options: ['Hadith and Sunnah of the Prophet (SAW)', 'Ijma (Consensus of Jurists)', 'Qiyas (Analogical Deduction)', 'Urf (Customary Practice)'],
    correctAnswer: 0,
    explanation: 'The primary divine sources of Shari’ah are the Holy Qur’an and the authentic Sunnah (traditions and sayings of Prophet Muhammad SAW). Secondary derived sources are Ijma and Qiyas.'
  },
  {
    id: 'jamb-irs-2023-01',
    subject: 'irs',
    subjectName: 'Islamic Studies',
    year: 2023,
    questionNumber: 2,
    topic: 'Quranic Sciences & Structure',
    question: 'How many total chapters (Surahs) are contained in the preserved text of the Holy Qur’an?',
    options: ['114', '112', '120', '30'],
    correctAnswer: 0,
    explanation: 'The Holy Qur’an comprises exactly 114 Surahs, divided into 30 Juz (parts) and classified into Makkan and Madinan revelations.'
  },
  {
    id: 'jamb-irs-2022-01',
    subject: 'irs',
    subjectName: 'Islamic Studies',
    year: 2022,
    questionNumber: 3,
    topic: 'Pillars of Islam (Arkan al-Islam)',
    question: 'The sacred pilgrimage to Makkah (Hajj) is an obligatory religious duty for every mentally sound, adult Muslim who possesses financial and physical capability at least:',
    options: ['Once in a lifetime', 'Once every five years', 'Every annual season', 'Twice in a lifetime'],
    correctAnswer: 0,
    explanation: 'Hajj is the fifth pillar of Islam, rendered fard (compulsory) once in a lifetime for every Muslim who meets the conditions of Istita’ah (financial, physical, and security competence).'
  },

  // ==========================================
  // HISTORY
  // ==========================================
  {
    id: 'jamb-his-2024-01',
    subject: 'history',
    subjectName: 'History',
    year: 2024,
    questionNumber: 1,
    topic: 'Colonial Era & Amalgamation',
    question: 'The British colonial administrator who officially proclaimed and enacted the amalgamation of the Northern and Southern Protectorates of Nigeria on January 1, 1914 was:',
    options: ['Sir Frederick Lugard', 'Sir Arthur Richards', 'Sir John Macpherson', 'Sir Donald Cameron'],
    correctAnswer: 0,
    explanation: 'Lord Frederick Lugard oversaw the amalgamation of the Colony and Protectorate of Southern Nigeria with the Protectorate of Northern Nigeria on January 1, 1914, becoming Nigeria’s first Governor-General.'
  },
  {
    id: 'jamb-his-2023-01',
    subject: 'history',
    subjectName: 'History',
    year: 2023,
    questionNumber: 2,
    topic: 'Pre-Colonial Empires of Western Sudan',
    question: 'The legendary Kanem-Borno Empire achieved military supremacy, diplomatic zenith, and extensive commercial prosperity under the 16th-century reign of which revered Mai?',
    options: ['Mai Idris Alooma', 'Mai Dunama Dabbalemi', 'Mai Hummay', 'Mai Ali Ghaji'],
    correctAnswer: 0,
    explanation: 'Mai Idris Alooma (reigned 1571–1603) imported Turkish firearms, trained professional cavalry forces, and governed Borno with strict administrative and Islamic legal reforms.'
  },
  {
    id: 'jamb-his-2022-01',
    subject: 'history',
    subjectName: 'History',
    year: 2022,
    questionNumber: 3,
    topic: 'Nationalist Movements & Protests',
    question: 'The historic Aba Women’s War of November–December 1929 in Southeastern Nigeria was fundamentally provoked by popular outrage against:',
    options: ['Rumors of direct colonial taxation imposed on women and market stalls', 'The abolition of indigenous barter trade', 'Forced labor recruitment for railway networks', 'Suppression of traditional palm oil cooperatives'],
    correctAnswer: 0,
    explanation: 'The Aba Women’s War was triggered when the British administration conducted headcounts and reassessments under Warrant Chiefs, sparking widespread apprehension that women were to be taxed directly.'
  },

  // ==========================================
  // CIVIC EDUCATION
  // ==========================================
  {
    id: 'jamb-civ-2024-01',
    subject: 'civic',
    subjectName: 'Civic Education',
    year: 2024,
    questionNumber: 1,
    topic: 'Fundamental Human Rights & Constitution',
    question: 'In the 1999 Constitution of the Federal Republic of Nigeria (as amended), fundamental human rights are formally codified and guaranteed under which Chapter?',
    options: ['Chapter IV', 'Chapter II', 'Chapter I', 'Chapter VII'],
    correctAnswer: 0,
    explanation: 'Chapter IV of the 1999 Nigerian Constitution guarantees Fundamental Rights, including right to life, dignity of human person, personal liberty, fair hearing, and freedom of expression.'
  },
  {
    id: 'jamb-civ-2023-01',
    subject: 'civic',
    subjectName: 'Civic Education',
    year: 2023,
    questionNumber: 2,
    topic: 'Law Enforcement Agencies in Nigeria',
    question: 'The statutory agency established under Decree 48 of 1989 to eradicate the cultivation, trafficking, and illicit consumption of narcotic drugs in Nigeria is the:',
    options: ['NDLEA', 'EFCC', 'ICPC', 'NAFDAC'],
    correctAnswer: 0,
    explanation: 'The National Drug Law Enforcement Agency (NDLEA) is legally mandated to intercept, investigate, and prosecute drug trafficking networks and manage substance abuse rehabilitation.'
  },
  {
    id: 'jamb-civ-2022-01',
    subject: 'civic',
    subjectName: 'Civic Education',
    year: 2022,
    questionNumber: 3,
    topic: 'Rule of Law & Democratic Principles',
    question: 'A core pillar of the Rule of Law formulated by Professor A.V. Dicey requires that:',
    options: ['All citizens and state authorities are equally subject to the ordinary law of the land', 'The government executive retains arbitrary discretionary powers in emergencies', 'Military tribunals operate independently of superior constitutional courts', 'Cabinet ministers cannot be challenged in public courts'],
    correctAnswer: 0,
    explanation: 'A.V. Dicey identified three principles: absolute supremacy of regular law over arbitrary power, equality of all persons before the law, and constitutional law as the result of ordinary judicial decisions.'
  },

  // ==========================================
  // COMPUTER STUDIES
  // ==========================================
  {
    id: 'jamb-cmp-2024-01',
    subject: 'computer',
    subjectName: 'Computer Studies',
    year: 2024,
    questionNumber: 1,
    topic: 'Computer Hardware Architecture',
    question: 'Within the Central Processing Unit (CPU), which specialized electronic subsystem directly computes mathematical operations (addition, multiplication) and Boolean logic evaluations?',
    options: ['Arithmetic Logic Unit (ALU)', 'Control Unit (CU)', 'Internal Bus System', 'Secondary Storage Unit'],
    correctAnswer: 0,
    explanation: 'The Arithmetic Logic Unit (ALU) executes all arithmetic calculations and binary decision logic instructions directed by the Control Unit.'
  },
  {
    id: 'jamb-cmp-2023-01',
    subject: 'computer',
    subjectName: 'Computer Studies',
    year: 2023,
    questionNumber: 2,
    topic: 'Software Systems & Management',
    question: 'Which of the following software categories is responsible for managing underlying hardware peripherals, process scheduling, and file systems, providing a platform for application software?',
    options: ['System Software / Operating System', 'Application Software Suite', 'Utility Compiler', 'Database Front-end'],
    correctAnswer: 0,
    explanation: 'The Operating System (e.g., Linux, Windows, macOS) is core system software that manages CPU scheduling, RAM allocation, peripheral I/O, and file system security.'
  },
  {
    id: 'jamb-cmp-2022-01',
    subject: 'computer',
    subjectName: 'Computer Studies',
    year: 2022,
    questionNumber: 3,
    topic: 'Computer Networks & Internet',
    question: 'An Internet Protocol version 4 (IPv4) address consists of how many total bits structured into four 8-bit octets separated by dots?',
    options: ['32 bits', '64 bits', '128 bits', '16 bits'],
    correctAnswer: 0,
    explanation: 'IPv4 addresses are 32-bit numerical labels formatted in dotted-decimal notation (e.g., 192.168.1.1), accommodating approximately 4.3 billion unique network host addresses.'
  }
];

export function getJambQuestionsByFilter(
  subject: string,
  year?: number | 'all',
  count: number = 20
): JambQuestion[] {
  const normSub = subject.toLowerCase().trim();
  let filtered = JAMB_QUESTIONS.filter(q => 
    q.subject.toLowerCase() === normSub || 
    q.subjectName.toLowerCase() === normSub ||
    q.id.toLowerCase().includes(normSub)
  );
  
  if (year && year !== 'all') {
    const yearFiltered = filtered.filter(q => q.year === year);
    if (yearFiltered.length > 0) {
      filtered = yearFiltered;
    }
  }

  // Shuffle questions randomly to ensure fresh practice
  const shuffled = [...filtered].sort(() => 0.5 - Math.random());
  
  // If count exceeds existing questions for that specific filter, duplicate with varying order or return all
  if (shuffled.length < count && filtered.length > 0) {
    const extraPool = [...filtered];
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

/**
 * UNIFIED PRACTICE QUERY FUNCTION
 * Normalizes questions into the exact format consumed by Quiz.tsx (the Practice Center engine).
 */
export interface PracticeQueryOptions {
  subject?: string;
  subjects?: string[]; // Multi-subject JAMB CBT
  topic?: string;
  year?: number | 'all';
  count?: number;
  order?: 'random' | 'sequential';
  examType?: string;
}

export function getUnifiedQuestionsForPractice(options: PracticeQueryOptions) {
  const { subjects, subject, topic, year, count = 20, order = 'random' } = options;

  let resultList: any[] = [];

  // Multi-subject mode (e.g. 4-subject JAMB CBT combination)
  if (subjects && subjects.length > 0) {
    const perSubjectCount = Math.max(1, Math.floor(count / subjects.length));
    
    for (const subId of subjects) {
      const normSubId = subId.toLowerCase().trim();
      let subQuestions = JAMB_QUESTIONS.filter(q => 
        q.subject.toLowerCase() === normSubId || 
        q.subjectName.toLowerCase() === normSubId ||
        q.id.toLowerCase().includes(normSubId)
      );
      if (year && year !== 'all') {
        const yf = subQuestions.filter(q => q.year === year);
        if (yf.length > 0) subQuestions = yf;
      }
      
      let pool = [...subQuestions];
      if (order === 'random') {
        pool.sort(() => 0.5 - Math.random());
      } else {
        pool.sort((a, b) => a.questionNumber - b.questionNumber);
      }

      // Select without repetition (never show the same question twice in a session)
      const selected = pool.slice(0, perSubjectCount);
      resultList.push(...selected);
    }
  } else if (subject) {
    const normSubject = subject.toLowerCase().trim();
    let subQuestions = JAMB_QUESTIONS.filter(q => 
      q.subject.toLowerCase() === normSubject || 
      q.subjectName.toLowerCase() === normSubject ||
      q.id.toLowerCase().includes(normSubject)
    );
    if (topic && topic !== 'All Topics' && topic !== 'General') {
      const tf = subQuestions.filter(q => q.topic.toLowerCase().includes(topic.toLowerCase()));
      if (tf.length > 0) subQuestions = tf;
    }
    if (year && year !== 'all') {
      const yf = subQuestions.filter(q => q.year === year);
      if (yf.length > 0) subQuestions = yf;
    }

    let pool = [...subQuestions];
    if (order === 'random') {
      pool.sort(() => 0.5 - Math.random());
    } else {
      pool.sort((a, b) => a.questionNumber - b.questionNumber);
    }

    // Select without repetition (never show the same question twice in a session)
    resultList = pool.slice(0, count);
  } else {
    // General all subjects mix
    let pool = [...JAMB_QUESTIONS];
    if (order === 'random') pool.sort(() => 0.5 - Math.random());
    resultList = pool.slice(0, count);
  }

  // Convert to Quiz.tsx Question format
  return resultList.map((q, idx) => ({
    id: q.id,
    question: q.passage ? `${q.passage}\n\n${q.question}` : q.question,
    options: q.options,
    correctAnswerIndex: q.correctAnswer,
    correctAnswer: q.correctAnswer,
    explanation: q.explanation,
    difficulty: 'Medium',
    topic: q.topic,
    subject: q.subjectName || q.subject,
    subjectId: q.subject,
    year: q.year,
    questionNumber: q.questionNumber || (idx + 1)
  }));
}

