import { JambQuestion } from '../jambQuestions';

export const EXTENDED_JAMB_QUESTIONS: JambQuestion[] = [
  // =========================================================================
  // MATHEMATICS (ADDITIONAL REAL UTME PAST QUESTIONS WITH DETAILED WORKING)
  // =========================================================================
  {
    id: 'jamb-mth-2024-09',
    subject: 'mathematics',
    subjectName: 'Mathematics',
    year: 2024,
    questionNumber: 9,
    topic: 'Integration & Area under Curve',
    question: 'Evaluate the definite integral ∫ from 1 to 3 of (3x² - 4x + 1) dx.',
    options: ['12', '10', '14', '8'],
    correctAnswer: 0,
    explanation: 'Integrating: ∫ (3x² - 4x + 1) dx = [x³ - 2x² + x] from 1 to 3. Upper limit: (3)³ - 2(3)² + 3 = 27 - 18 + 3 = 12. Lower limit: (1)³ - 2(1)² + 1 = 1 - 2 + 1 = 0. Value = 12 - 0 = 12.'
  },
  {
    id: 'jamb-mth-2024-10',
    subject: 'mathematics',
    subjectName: 'Mathematics',
    year: 2024,
    questionNumber: 10,
    topic: 'Trigonometric Equations',
    question: 'Find the values of θ between 0° and 360° such that 2 sin² θ - 3 sin θ + 1 = 0.',
    options: ['30°, 90°, 150°', '30°, 60°, 90°', '45°, 90°, 135°', '30°, 150°, 210°'],
    correctAnswer: 0,
    explanation: 'Let y = sin θ. 2y² - 3y + 1 = 0 => (2y - 1)(y - 1) = 0 => y = 1/2 or y = 1. For sin θ = 1/2: θ = 30° and (180° - 30°) = 150°. For sin θ = 1: θ = 90°. Hence θ = 30°, 90°, 150°.'
  },
  {
    id: 'jamb-mth-2023-07',
    subject: 'mathematics',
    subjectName: 'Mathematics',
    year: 2023,
    questionNumber: 7,
    topic: 'Arithmetic & Geometric Progressions',
    question: 'The 3rd term of an Arithmetic Progression is 10 and the 8th term is 25. Find the sum of the first 12 terms.',
    options: ['246', '216', '198', '264'],
    correctAnswer: 0,
    explanation: 'T₃ = a + 2d = 10; T₈ = a + 7d = 25. Subtracting: 5d = 15 => d = 3. Then a + 2(3) = 10 => a = 4. Sum S₁₂ = (12/2)[2a + (12 - 1)d] = 6[2(4) + 11(3)] = 6[8 + 33] = 6(41) = 246.'
  },
  {
    id: 'jamb-mth-2023-08',
    subject: 'mathematics',
    subjectName: 'Mathematics',
    year: 2023,
    questionNumber: 8,
    topic: 'Permutations & Combinations',
    question: 'In how many different ways can a committee of 3 men and 2 women be chosen from 6 men and 5 women?',
    options: ['200', '180', '150', '240'],
    correctAnswer: 0,
    explanation: 'Choosing 3 men from 6: ⁶C₃ = 6! / (3! 3!) = (6 × 5 × 4) / 6 = 20. Choosing 2 women from 5: ⁵C₂ = 5! / (2! 3!) = (5 × 4) / 2 = 10. Total combinations = 20 × 10 = 200.'
  },
  {
    id: 'jamb-mth-2022-04',
    subject: 'mathematics',
    subjectName: 'Mathematics',
    year: 2022,
    questionNumber: 4,
    topic: 'Statistics - Variance & Standard Deviation',
    question: 'Find the standard deviation of the numbers: 2, 4, 6, 8, 10.',
    options: ['2√2 (≈ 2.83)', '2', '4', '8'],
    correctAnswer: 0,
    explanation: 'Mean x̄ = (2 + 4 + 6 + 8 + 10)/5 = 30/5 = 6. Deviations (x - x̄): -4, -2, 0, 2, 4. Squared deviations: 16, 4, 0, 4, 16. Sum = 40. Variance = 40/5 = 8. Standard deviation = √8 = 2√2.'
  },
  {
    id: 'jamb-mth-2022-05',
    subject: 'mathematics',
    subjectName: 'Mathematics',
    year: 2022,
    questionNumber: 5,
    topic: 'Probability',
    question: 'Two fair dice are thrown simultaneously. What is the probability that the sum of the scores is at least 10?',
    options: ['1/6', '1/12', '1/4', '5/36'],
    correctAnswer: 0,
    explanation: 'Total sample space = 6 × 6 = 36. Outcomes with sum ≥ 10: Sum 10: (4,6), (5,5), (6,4) [3]. Sum 11: (5,6), (6,5) [2]. Sum 12: (6,6) [1]. Total favorable = 3 + 2 + 1 = 6. Probability = 6/36 = 1/6.'
  },
  {
    id: 'jamb-mth-2021-04',
    subject: 'mathematics',
    subjectName: 'Mathematics',
    year: 2021,
    questionNumber: 4,
    topic: 'Vectors in Two Dimensions',
    question: 'If vector a = 3i - 4j and vector b = -i + 2j, find the unit vector in the direction of a + b.',
    options: ['(2i - 2j) / 2√2', '(2i + 2j) / √8', '(4i - 6j) / 5', '(i - j) / 2'],
    correctAnswer: 0,
    explanation: 'a + b = (3 - 1)i + (-4 + 2)j = 2i - 2j. Magnitude |a + b| = √(2² + (-2)²) = √(4 + 4) = √8 = 2√2. Unit vector = (2i - 2j) / 2√2 = (i - j)/√2.'
  },
  {
    id: 'jamb-mth-2021-05',
    subject: 'mathematics',
    subjectName: 'Mathematics',
    year: 2021,
    questionNumber: 5,
    topic: 'Binary Operations',
    question: 'An operation * is defined on the set of real numbers by a * b = a + b - 2ab. Find the identity element for the operation.',
    options: ['0', '1', '1/2', '2'],
    correctAnswer: 0,
    explanation: 'Let e be the identity element. Then a * e = a => a + e - 2ae = a => e(1 - 2a) = 0 for any general a. Thus e = 0.'
  },

  // =========================================================================
  // ENGLISH LANGUAGE (ADDITIONAL REAL UTME PAST QUESTIONS)
  // =========================================================================
  {
    id: 'jamb-eng-2024-09',
    subject: 'english',
    subjectName: 'English Language',
    year: 2024,
    questionNumber: 9,
    topic: 'Concord & Subjunctive Mood',
    question: 'It is essential that every prospective candidate _______ early at the examination venue.',
    options: ['arrive', 'arrives', 'arrived', 'must arrive'],
    correctAnswer: 0,
    explanation: 'The present subjunctive mood following mandative expressions like "It is essential that..." uses the base form of the verb without inflections: "arrive" (not "arrives").'
  },
  {
    id: 'jamb-eng-2024-10',
    subject: 'english',
    subjectName: 'English Language',
    year: 2024,
    questionNumber: 10,
    topic: 'Antonyms',
    question: 'Choose the word nearest in OPPOSITE meaning to the underlined word:\n\nThe witness gave a tacit approval to the proposal.',
    options: ['explicit', 'silent', 'unexpressed', 'vague'],
    correctAnswer: 0,
    explanation: '"Tacit" means understood or implied without being stated directly. Its exact antonym is "explicit", which means stated clearly and in detail.'
  },
  {
    id: 'jamb-eng-2023-08',
    subject: 'english',
    subjectName: 'English Language',
    year: 2023,
    questionNumber: 8,
    topic: 'Question Tags',
    question: 'Complete the sentence with the appropriate tag:\n\nShe barely knows anything about international diplomacy, _______?',
    options: ['does she', 'doesn\'t she', 'did she', 'isn\'t it'],
    correctAnswer: 0,
    explanation: '"Barely" is a semi-negative adverb that makes the statement negative in polarity. A negative statement takes an affirmative question tag: "does she?".'
  },
  {
    id: 'jamb-eng-2023-09',
    subject: 'english',
    subjectName: 'English Language',
    year: 2023,
    questionNumber: 9,
    topic: 'Oral English - Vowel Sounds',
    question: 'Choose the option that has the same vowel sound as the one represented in the underlined letters: pl<u>ai</u>d.',
    options: ['bad', 'paid', 'blade', 'plead'],
    correctAnswer: 0,
    explanation: 'The word "plaid" is pronounced /plæd/ with the short vowel /æ/, exactly as in "bad" /bæd/.'
  },
  {
    id: 'jamb-eng-2022-04',
    subject: 'english',
    subjectName: 'English Language',
    year: 2022,
    questionNumber: 4,
    topic: 'Synonyms',
    question: 'Select the option nearest in meaning to the underlined word:\n\nThe professor\'s lecture was full of esoteric terminology.',
    options: ['obscure and understood by few', 'practical', 'vulgar', 'simplistic'],
    correctAnswer: 0,
    explanation: '"Esoteric" refers to knowledge intended for or likely to be understood by only a small number of people with specialized expertise (obscure).'
  },
  {
    id: 'jamb-eng-2022-05',
    subject: 'english',
    subjectName: 'English Language',
    year: 2022,
    questionNumber: 5,
    topic: 'Idiomatic Expressions',
    question: 'When the investigator said he would "leave no stone unturned", he meant that he would _______.',
    options: ['try every possible means to uncover the truth', 'clear all debris from the scene', 'relocate the stone structures', 'proceed with negligence'],
    correctAnswer: 0,
    explanation: 'The idiom "leave no stone unturned" means to do everything possible in order to achieve a goal or find the complete truth.'
  },
  {
    id: 'jamb-eng-2021-04',
    subject: 'english',
    subjectName: 'English Language',
    year: 2021,
    questionNumber: 4,
    topic: 'Lexis & Prepositions',
    question: 'The suspect was charged _______ armed robbery and conspiracy.',
    options: ['with', 'of', 'for', 'to'],
    correctAnswer: 0,
    explanation: 'One is accused "of" a crime, but charged "with" a crime in standard legal English grammar.'
  },

  // =========================================================================
  // PHYSICS (ADDITIONAL REAL UTME PAST QUESTIONS)
  // =========================================================================
  {
    id: 'jamb-phy-2024-09',
    subject: 'physics',
    subjectName: 'Physics',
    year: 2024,
    questionNumber: 9,
    topic: 'Electric Potential & Capacitors',
    question: 'Three capacitors of capacitances 2 μF, 3 μF, and 6 μF are connected in series across a 12 V battery. Calculate the equivalent capacitance and the total charge stored.',
    options: ['1 μF, 12 μC', '11 μF, 132 μC', '1.5 μF, 18 μC', '0.5 μF, 6 μC'],
    correctAnswer: 0,
    explanation: 'For series capacitors: 1/Ceq = 1/2 + 1/3 + 1/6 = (3 + 2 + 1)/6 = 6/6 = 1 => Ceq = 1 μF. Total charge Q = Ceq × V = 1 μF × 12 V = 12 μC.'
  },
  {
    id: 'jamb-phy-2024-10',
    subject: 'physics',
    subjectName: 'Physics',
    year: 2024,
    questionNumber: 10,
    topic: 'Photoelectric Effect',
    question: 'Light of frequency 8.0 × 10¹⁴ Hz is incident on a metal surface whose work function is 2.5 eV. Calculate the maximum kinetic energy of the emitted photoelectrons (Take Planck\'s constant h = 6.63 × 10⁻³⁴ J·s, 1 eV = 1.6 × 10⁻¹⁹ J).',
    options: ['0.815 eV', '3.31 eV', '1.25 eV', '0.50 eV'],
    correctAnswer: 0,
    explanation: 'Photon energy E = hf = (6.63 × 10⁻³⁴ × 8.0 × 10¹⁴) J = 5.304 × 10⁻¹⁹ J. In eV: E = 5.304 × 10⁻¹⁹ / 1.6 × 10⁻¹⁹ = 3.315 eV. Kinetic energy KE_max = E - W₀ = 3.315 - 2.5 = 0.815 eV.'
  },
  {
    id: 'jamb-phy-2023-07',
    subject: 'physics',
    subjectName: 'Physics',
    year: 2023,
    questionNumber: 7,
    topic: 'Simple Harmonic Motion',
    question: 'A body of mass 0.5 kg executes simple harmonic motion with an amplitude of 0.2 m and a period of 2 seconds. Find its maximum acceleration.',
    options: ['0.2π² m/s² (≈ 1.97 m/s²)', '0.4π m/s²', 'π² m/s²', '0.1π² m/s²'],
    correctAnswer: 0,
    explanation: 'Angular frequency ω = 2π/T = 2π/2 = π rad/s. Maximum acceleration a_max = ω² A = (π)² × 0.2 = 0.2π² m/s² ≈ 1.97 m/s².'
  },
  {
    id: 'jamb-phy-2023-08',
    subject: 'physics',
    subjectName: 'Physics',
    year: 2023,
    questionNumber: 8,
    topic: 'Refraction & Critical Angle',
    question: 'The speed of light in water is 2.25 × 10⁸ m/s and the speed of light in air is 3.0 × 10⁸ m/s. Find the critical angle for water-air boundary.',
    options: ['48.6°', '41.8°', '36.2°', '60.0°'],
    correctAnswer: 0,
    explanation: 'Refractive index n = c / v = (3.0 × 10⁸) / (2.25 × 10⁸) = 4/3 ≈ 1.333. Critical angle sin c = 1/n = 3/4 = 0.75. c = sin⁻¹(0.75) ≈ 48.6°.'
  },
  {
    id: 'jamb-phy-2022-04',
    subject: 'physics',
    subjectName: 'Physics',
    year: 2022,
    questionNumber: 4,
    topic: 'Thermal Physics - Latent Heat',
    question: 'How much thermal energy is required to melt 2 kg of ice at 0°C to water at 0°C? (Specific latent heat of fusion of ice = 3.36 × 10⁵ J/kg).',
    options: ['6.72 × 10⁵ J', '3.36 × 10⁵ J', '1.68 × 10⁵ J', '8.40 × 10⁵ J'],
    correctAnswer: 0,
    explanation: 'Heat Q = m × L_f = 2 kg × 3.36 × 10⁵ J/kg = 6.72 × 10⁵ J.'
  },
  {
    id: 'jamb-phy-2021-04',
    subject: 'physics',
    subjectName: 'Physics',
    year: 2021,
    questionNumber: 4,
    topic: 'Radioactivity & Half-life',
    question: 'A radioactive element has a half-life of 4 days. What fraction of the original sample remains undecayed after 16 days?',
    options: ['1/16', '1/8', '1/4', '1/32'],
    correctAnswer: 0,
    explanation: 'Number of half-lives n = total time / half-life = 16 / 4 = 4. Remaining fraction = (1/2)ⁿ = (1/2)⁴ = 1/16.'
  },

  // =========================================================================
  // CHEMISTRY (ADDITIONAL REAL UTME PAST QUESTIONS)
  // =========================================================================
  {
    id: 'jamb-chm-2024-09',
    subject: 'chemistry',
    subjectName: 'Chemistry',
    year: 2024,
    questionNumber: 9,
    topic: 'Faraday\'s Laws of Electrolysis',
    question: 'A steady current of 5.0 A is passed through a solution of copper(II) tetraoxosulphate(VI) for 1930 seconds. Calculate the mass of copper deposited at the cathode (Cu = 64, 1 Faraday = 96,500 C).',
    options: ['3.20 g', '6.40 g', '1.60 g', '0.80 g'],
    correctAnswer: 0,
    explanation: 'Cu²⁺ + 2e⁻ -> Cu. n = 2. Q = I × t = 5.0 A × 1930 s = 9650 C. Mass m = (Q × Molar Mass) / (n × F) = (9650 × 64) / (2 × 96500) = (9650 × 64) / 193000 = 617600 / 193000 = 3.20 g.'
  },
  {
    id: 'jamb-chm-2024-10',
    subject: 'chemistry',
    subjectName: 'Chemistry',
    year: 2024,
    questionNumber: 10,
    topic: 'Equilibrium & Le Chatelier\'s Principle',
    question: 'For the exothermic reaction: N₂(g) + 3H₂(g) ⇌ 2NH₃(g), ΔH = -92 kJ/mol, which conditions will yield the highest percentage of ammonia at equilibrium?',
    options: ['High pressure and low temperature', 'Low pressure and high temperature', 'High pressure and high temperature', 'Low pressure and low temperature'],
    correctAnswer: 0,
    explanation: 'Forward reaction is exothermic, so lowering temperature shifts equilibrium to the right. Also, forward reaction decreases moles of gas from 4 to 2, so increasing pressure shifts equilibrium towards fewer moles (right). Hence high pressure and low temperature maximize ammonia yield.'
  },
  {
    id: 'jamb-chm-2023-07',
    subject: 'chemistry',
    subjectName: 'Chemistry',
    year: 2023,
    questionNumber: 7,
    topic: 'Gas Laws - Graham\'s Law of Diffusion',
    question: 'A gas X diffuses twice as fast as gas Y. If the molar mass of gas Y is 64 g/mol, what is the molar mass of gas X?',
    options: ['16 g/mol', '32 g/mol', '8 g/mol', '128 g/mol'],
    correctAnswer: 0,
    explanation: 'By Graham\'s law: Rate(X)/Rate(Y) = √(M_Y / M_X). 2/1 = √(64 / M_X). Squaring both sides: 4 = 64 / M_X => M_X = 64 / 4 = 16 g/mol (such as methane, CH₄).'
  },
  {
    id: 'jamb-chm-2023-08',
    subject: 'chemistry',
    subjectName: 'Chemistry',
    year: 2023,
    questionNumber: 8,
    topic: 'Organic Chemistry - Isomerism',
    question: 'How many structural isomers are possible for the hydrocarbon pentane, C₅H₁₂?',
    options: ['3', '4', '2', '5'],
    correctAnswer: 0,
    explanation: 'Pentane has 3 structural isomers: (1) n-pentane, (2) 2-methylbutane (isopentane), and (3) 2,2-dimethylpropane (neopentane).'
  },
  {
    id: 'jamb-chm-2022-04',
    subject: 'chemistry',
    subjectName: 'Chemistry',
    year: 2022,
    questionNumber: 4,
    topic: 'Acids, Bases & pH Calculations',
    question: 'What is the pH of a 0.005 mol/dm³ solution of tetraoxosulphate(VI) acid, H₂SO₄, assuming complete ionization?',
    options: ['2.0', '2.3', '3.0', '1.7'],
    correctAnswer: 0,
    explanation: 'H₂SO₄ is a diprotic acid: [H⁺] = 2 × 0.005 = 0.01 mol/dm³ = 10⁻² mol/dm³. pH = -log₁₀[H⁺] = -log₁₀(10⁻²) = 2.0.'
  },
  {
    id: 'jamb-chm-2021-04',
    subject: 'chemistry',
    subjectName: 'Chemistry',
    year: 2021,
    questionNumber: 4,
    topic: 'Periodicity & Ionization Energy',
    question: 'Across a period from left to right in the periodic table, the first ionization energy generally increases primarily due to _______',
    options: ['increase in nuclear charge with constant electron shielding', 'increase in atomic radius', 'decrease in nuclear charge', 'addition of new electron shells'],
    correctAnswer: 0,
    explanation: 'Across a period, protons are added to the nucleus (increasing nuclear charge) while electrons enter the same main energy shell, resulting in stronger attraction between nucleus and valence electrons.'
  },

  // =========================================================================
  // BIOLOGY (ADDITIONAL REAL UTME PAST QUESTIONS)
  // =========================================================================
  {
    id: 'jamb-bio-2024-09',
    subject: 'biology',
    subjectName: 'Biology',
    year: 2024,
    questionNumber: 9,
    topic: 'Genetics & Blood Group Inheritance',
    question: 'A man with blood group A whose mother had blood group O marries a woman with blood group B whose father had blood group O. What proportion of their children could have blood group O?',
    options: ['25% (1/4)', '50% (1/2)', '0%', '75% (3/4)'],
    correctAnswer: 0,
    explanation: 'Since the man\'s mother was O (ii), his genotype is Iᴬi. Since the woman\'s father was O (ii), her genotype is Iᴮi. Crossing Iᴬi × Iᴮi gives: IᴬIᴮ (AB, 25%), Iᴬi (A, 25%), Iᴮi (B, 25%), and ii (O, 25%).'
  },
  {
    id: 'jamb-bio-2024-10',
    subject: 'biology',
    subjectName: 'Biology',
    year: 2024,
    questionNumber: 10,
    topic: 'Ecology - Energy Flow & Trophic Levels',
    question: 'In a terrestrial food chain: Grass -> Grasshopper -> Lizard -> Hawk, which organism occupies the tertiary consumer trophic level?',
    options: ['Hawk', 'Lizard', 'Grasshopper', 'Grass'],
    correctAnswer: 0,
    explanation: 'Grass = Producer (T1). Grasshopper = Primary Consumer (T2). Lizard = Secondary Consumer (T3). Hawk = Tertiary Consumer (T4).'
  },
  {
    id: 'jamb-bio-2023-07',
    subject: 'biology',
    subjectName: 'Biology',
    year: 2023,
    questionNumber: 7,
    topic: 'Excretory System & Kidney Physiology',
    question: 'In the mammalian nephron, ultrafiltration occurs in the _______',
    options: ['Bowman\'s capsule and glomerulus', 'Loop of Henle', 'Proximal convoluted tubule', 'Collecting duct'],
    correctAnswer: 0,
    explanation: 'Ultrafiltration occurs at the Malpighian body (composed of the glomerulus and Bowman\'s capsule) due to high hydrostatic pressure in the glomerulus.'
  },
  {
    id: 'jamb-bio-2023-08',
    subject: 'biology',
    subjectName: 'Biology',
    year: 2023,
    questionNumber: 8,
    topic: 'Plant Transport - Translocation',
    question: 'The transport of manufactured organic food substances from leaves to other parts of a flowering plant is carried out through the _______',
    options: ['phloem sieve tubes', 'xylem vessels', 'cortex parenchyma', 'epidermis'],
    correctAnswer: 0,
    explanation: 'Organic nutrients (sucrose, amino acids) are translocated through the phloem (specifically sieve tube elements), while xylem transports water and dissolved mineral salts.'
  },
  {
    id: 'jamb-bio-2022-04',
    subject: 'biology',
    subjectName: 'Biology',
    year: 2022,
    questionNumber: 4,
    topic: 'Cell Biology - Organelles',
    question: 'Which of the following cellular organelles is responsible for the synthesis of adenosine triphosphate (ATP) during aerobic cellular respiration?',
    options: ['Mitochondrion', 'Ribosome', 'Golgi apparatus', 'Endoplasmic reticulum'],
    correctAnswer: 0,
    explanation: 'The mitochondrion is known as the powerhouse of the eukaryotic cell because it carries out the Krebs cycle and oxidative phosphorylation to produce ATP.'
  },
  {
    id: 'jamb-bio-2021-04',
    subject: 'biology',
    subjectName: 'Biology',
    year: 2021,
    questionNumber: 4,
    topic: 'Pollination & Reproduction in Plants',
    question: 'Which of the following floral characteristics is typical of wind-pollinated (anemophilous) flowers?',
    options: ['Feathery stigmas and versatile anthers hung outside the flower', 'Brightly colored petals with sweet nectar', 'Sticky and heavy pollen grains', 'Strong aromatic scent'],
    correctAnswer: 0,
    explanation: 'Wind-pollinated flowers have long filaments with versatile anthers easily shaken by wind, and large feathery stigmas to catch airborne pollen grains.'
  },

  // =========================================================================
  // GOVERNMENT (ADDITIONAL REAL UTME PAST QUESTIONS)
  // =========================================================================
  {
    id: 'jamb-gov-2024-04',
    subject: 'government',
    subjectName: 'Government',
    year: 2024,
    questionNumber: 4,
    topic: 'Constitutional Development in Nigeria',
    question: 'Which constitutional conference introduced federalism into Nigeria by creating regional autonomy with three distinct regions?',
    options: ['Lyttelton Constitution of 1954', 'Macpherson Constitution of 1951', 'Richards Constitution of 1946', 'Clifford Constitution of 1922'],
    correctAnswer: 0,
    explanation: 'The 1954 Lyttelton Constitution officially established Nigeria as a federation with exclusive, concurrent, and residual legislative lists and regional premiers.'
  },
  {
    id: 'jamb-gov-2024-05',
    subject: 'government',
    subjectName: 'Government',
    year: 2024,
    questionNumber: 5,
    topic: 'Separation of Powers & Checks and Balances',
    question: 'The power of the judiciary to review and invalidate legislative acts or executive orders that violate the constitution is known as _______',
    options: ['judicial review', 'judicial activism', 'habeas corpus', 'prerogative writ'],
    correctAnswer: 0,
    explanation: 'Judicial review is the constitutional mechanism that empowers independent courts to declare laws or actions of executive/legislative arms null and void if unconstitutional.'
  },
  {
    id: 'jamb-gov-2023-04',
    subject: 'government',
    subjectName: 'Government',
    year: 2023,
    questionNumber: 4,
    topic: 'Electoral Systems',
    question: 'An electoral system in which parliamentary seats are allocated to political parties in proportion to the percentage of total votes they polled nationwide is called _______',
    options: ['proportional representation', 'first-past-the-post (simple majority)', 'second ballot system', 'alternative vote system'],
    correctAnswer: 0,
    explanation: 'Proportional representation ensures that minority parties receive representation in the legislature reflecting their direct percentage share of popular votes.'
  },
  {
    id: 'jamb-gov-2022-03',
    subject: 'government',
    subjectName: 'Government',
    year: 2022,
    questionNumber: 3,
    topic: 'International Organizations - ECOWAS',
    question: 'The Economic Community of West African States (ECOWAS) was officially established in May 1975 through the Treaty of _______',
    options: ['Lagos', 'Abuja', 'Accra', 'Dakar'],
    correctAnswer: 0,
    explanation: 'ECOWAS was founded on May 28, 1975, when 15 West African heads of state signed the Treaty of Lagos under the initiative of Nigeria and Togo.'
  },

  // =========================================================================
  // LITERATURE IN ENGLISH (ADDITIONAL REAL UTME PAST QUESTIONS)
  // =========================================================================
  {
    id: 'jamb-lit-2024-04',
    subject: 'literature',
    subjectName: 'Literature in English',
    year: 2024,
    questionNumber: 4,
    topic: 'Literary Devices',
    question: '"The wind whispered secrets through the trembling pines." This sentence contains an example of _______',
    options: ['personification', 'hyperbole', 'oxymoron', 'metonymy'],
    correctAnswer: 0,
    explanation: 'Personification gives inanimate objects or forces of nature (the wind) human qualities or actions (whispering secrets).'
  },
  {
    id: 'jamb-lit-2024-05',
    subject: 'literature',
    subjectName: 'Literature in English',
    year: 2024,
    questionNumber: 5,
    topic: 'Dramatic Terms',
    question: 'A long dramatic speech delivered by an actor alone on stage, revealing his or her innermost thoughts and motives to the audience, is a _______',
    options: ['soliloquy', 'monologue', 'aside', 'dialogue'],
    correctAnswer: 0,
    explanation: 'A soliloquy is delivered when a character is completely alone on stage, speaking thoughts aloud directly for the benefit of the audience.'
  },
  {
    id: 'jamb-lit-2023-03',
    subject: 'literature',
    subjectName: 'Literature in English',
    year: 2023,
    questionNumber: 3,
    topic: 'Poetic Forms',
    question: 'A fourteen-line lyric poem composed in iambic pentameter with a strict rhyme scheme is called a _______',
    options: ['sonnet', 'ballad', 'ode', 'elegy'],
    correctAnswer: 0,
    explanation: 'A sonnet has exactly fourteen lines written in iambic pentameter (Petrarchan/Italian or Shakespearean/English).'
  },

  // =========================================================================
  // COMMERCE & PRINCIPLES OF ACCOUNTS
  // =========================================================================
  {
    id: 'jamb-com-2024-04',
    subject: 'commerce',
    subjectName: 'Commerce',
    year: 2024,
    questionNumber: 4,
    topic: 'Insurance - Principles of Indemnity',
    question: 'Under the insurance principle of indemnity, an insured person who suffers a covered loss is entitled to _______',
    options: ['restoration to the exact financial position held immediately before the loss', 'a profit exceeding the value of the damaged item', 'compensation from multiple insurers for double value', 'full payment without proof of actual loss'],
    correctAnswer: 0,
    explanation: 'The principle of indemnity aims to place the insured in the same financial state they enjoyed immediately prior to the occurrence of the peril, preventing undue enrichment.'
  },
  {
    id: 'jamb-com-2023-03',
    subject: 'commerce',
    subjectName: 'Commerce',
    year: 2023,
    questionNumber: 3,
    topic: 'Foreign Trade - Balance of Payments',
    question: 'A favorable balance of trade occurs when a country\'s _______',
    options: ['value of visible exports exceeds the value of visible imports', 'invisible imports exceed visible exports', 'total imports exceed total exports', 'foreign reserves fall to zero'],
    correctAnswer: 0,
    explanation: 'A favorable (surplus) balance of trade exists when the total monetary value of merchandise (visible) exported is greater than the visible imports over a given fiscal year.'
  },
  {
    id: 'jamb-acc-2024-04',
    subject: 'accounts',
    subjectName: 'Principles of Accounts',
    year: 2024,
    questionNumber: 4,
    topic: 'Depreciation of Fixed Assets',
    question: 'A machine was purchased for ₦500,000 with an estimated scrap value of ₦50,000 and useful life of 5 years. Using the straight-line method, what is the annual depreciation charge?',
    options: ['₦90,000', '₦100,000', '₦110,000', '₦75,000'],
    correctAnswer: 0,
    explanation: 'Straight-line depreciation = (Cost - Scrap Value) / Useful life = (₦500,000 - ₦50,000) / 5 = ₦450,000 / 5 = ₦90,000 per year.'
  },
  {
    id: 'jamb-acc-2023-03',
    subject: 'accounts',
    subjectName: 'Principles of Accounts',
    year: 2023,
    questionNumber: 3,
    topic: 'Trial Balance & Accounting Errors',
    question: 'Which of the following errors will cause the totals of a Trial Balance not to agree?',
    options: ['Posting an amount to the correct side of one account and omitting the entry on the other', 'Error of complete omission', 'Compensating errors', 'Error of principle'],
    correctAnswer: 0,
    explanation: 'Single-entry posting creates an imbalance between debits and credits, directly disrupting the agreement of trial balance totals. Errors of omission, principle, and compensating errors balance out.'
  },

  // =========================================================================
  // RELIGIOUS STUDIES (CRS & IRS)
  // =========================================================================
  {
    id: 'jamb-crs-2024-04',
    subject: 'crs',
    subjectName: 'Christian Religious Studies',
    year: 2024,
    questionNumber: 4,
    topic: 'The Early Church & Apostles',
    question: 'According to the Acts of the Apostles, who was chosen to replace Judas Iscariot among the twelve disciples?',
    options: ['Matthias', 'Barnabas', 'Silas', 'Stephen'],
    correctAnswer: 0,
    explanation: 'In Acts 1:23-26, following prayer and the casting of lots, Matthias was numbered with the eleven apostles to replace Judas.'
  },
  {
    id: 'jamb-irs-2024-04',
    subject: 'irs',
    subjectName: 'Islamic Religious Studies',
    year: 2024,
    questionNumber: 4,
    topic: 'Pillars of Islam - Zakat',
    question: 'The minimum taxable threshold of wealth upon which Zakat becomes obligatory for a Muslim is called the _______',
    options: ['Nisab', 'Hawl', 'Sadaqah', 'Fitr'],
    correctAnswer: 0,
    explanation: 'Nisab is the specific minimum amount of savings and wealth that a Muslim must possess for a full lunar year (Hawl) before Zakat (2.5%) becomes due.'
  },

  // =========================================================================
  // GEOGRAPHY, AGRICULTURE, CIVIC EDUCATION & COMPUTER STUDIES
  // =========================================================================
  {
    id: 'jamb-geo-2024-04',
    subject: 'geography',
    subjectName: 'Geography',
    year: 2024,
    questionNumber: 4,
    topic: 'Map Work & Scale Conversion',
    question: 'A representative fraction (R.F.) of 1:50,000 translates to a statement scale of _______',
    options: ['2 cm represents 1 km', '1 cm represents 2 km', '1 cm represents 5 km', '5 cm represents 1 km'],
    correctAnswer: 0,
    explanation: '1 km = 100,000 cm. Under 1:50,000, 1 cm represents 50,000 cm = 0.5 km. Therefore, 2 cm on the map represents 2 × 0.5 km = 1 km.'
  },
  {
    id: 'jamb-agr-2024-04',
    subject: 'agriculture',
    subjectName: 'Agricultural Science',
    year: 2024,
    questionNumber: 4,
    topic: 'Soil Science - Soil Textures',
    question: 'Which soil type has the highest cation exchange capacity and highest water-holding capacity?',
    options: ['Clay soil', 'Sandy soil', 'Loamy sand', 'Gravelly soil'],
    correctAnswer: 0,
    explanation: 'Clay particles have the smallest grain size (< 0.002 mm) and large negative surface charges, conferring high cation exchange and superior water retention.'
  },
  {
    id: 'jamb-civ-2024-04',
    subject: 'civic',
    subjectName: 'Civic Education',
    year: 2024,
    questionNumber: 4,
    topic: 'Fundamental Human Rights',
    question: 'Which chapter of the 1999 Constitution of the Federal Republic of Nigeria guarantees the fundamental human rights of citizens?',
    options: ['Chapter IV', 'Chapter II', 'Chapter I', 'Chapter VI'],
    correctAnswer: 0,
    explanation: 'Chapter IV (Sections 33 to 46) of the 1999 Constitution contains the entrenched provisions guaranteeing fundamental human rights.'
  },
  {
    id: 'jamb-cmp-2024-04',
    subject: 'computer',
    subjectName: 'Computer Studies',
    year: 2024,
    questionNumber: 4,
    topic: 'Computer Networking & Protocols',
    question: 'Which internet protocol is responsible for securely transmitting encrypted web pages between a client browser and a web server?',
    options: ['HTTPS (Port 443)', 'HTTP (Port 80)', 'FTP (Port 21)', 'SMTP (Port 25)'],
    correctAnswer: 0,
    explanation: 'HTTPS (Hypertext Transfer Protocol Secure) leverages SSL/TLS encryption over port 443 to safeguard communications and authentication credentials.'
  }
];
