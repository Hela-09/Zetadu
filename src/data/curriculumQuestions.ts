export interface CurriculumQuestion {
  id: string;
  subject: string;
  subjectId: string;
  topic: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export const CURRICULUM_QUESTIONS: CurriculumQuestion[] = [
  // Mathematics
  {
    id: 'math-q-1',
    subject: 'Mathematics',
    subjectId: 'mathematics',
    topic: 'Quadratic Equations & Functions',
    question: 'Find the roots of the quadratic equation: x² - 5x + 6 = 0.',
    options: ['x = 2 or x = 3', 'x = -2 or x = -3', 'x = 1 or x = 6', 'x = -1 or x = -6'],
    correctAnswer: 0,
    explanation: 'Factoring: (x - 2)(x - 3) = 0, giving roots x = 2 and x = 3.'
  },
  {
    id: 'math-q-2',
    subject: 'Mathematics',
    subjectId: 'mathematics',
    topic: 'Logarithms & Indices',
    question: 'Evaluate log₁₀(1000) + log₁₀(0.01).',
    options: ['1', '2', '3', '0'],
    correctAnswer: 0,
    explanation: 'log₁₀(1000) = 3 and log₁₀(0.01) = -2. Therefore, 3 + (-2) = 1.'
  },
  {
    id: 'math-q-3',
    subject: 'Mathematics',
    subjectId: 'mathematics',
    topic: 'Probability & Combinatorics',
    question: 'A bag contains 4 red balls and 6 blue balls. What is the probability of picking a red ball at random?',
    options: ['2/5', '3/5', '1/4', '1/2'],
    correctAnswer: 0,
    explanation: 'Total balls = 4 + 6 = 10. P(Red) = 4/10 = 2/5.'
  },
  {
    id: 'math-q-4',
    subject: 'Mathematics',
    subjectId: 'mathematics',
    topic: 'Trigonometry & Bearing',
    question: 'If tan(θ) = 3/4 and θ is an acute angle, find the value of cos(θ).',
    options: ['4/5', '3/5', '5/4', '4/3'],
    correctAnswer: 0,
    explanation: 'Using a 3-4-5 right triangle: opposite = 3, adjacent = 4, hypotenuse = 5. Therefore cos(θ) = adjacent/hypotenuse = 4/5.'
  },
  {
    id: 'math-q-5',
    subject: 'Mathematics',
    subjectId: 'mathematics',
    topic: 'Differentiation & Calculus',
    question: 'Find the derivative of f(x) = 3x³ - 5x² + 2x - 7 with respect to x.',
    options: ['9x² - 10x + 2', '9x² - 5x + 2', '6x² - 10x + 2', '3x² - 10x'],
    correctAnswer: 0,
    explanation: 'd/dx(3x³) = 9x², d/dx(-5x²) = -10x, d/dx(2x) = 2, d/dx(-7) = 0. The result is 9x² - 10x + 2.'
  },

  // English Language
  {
    id: 'eng-q-1',
    subject: 'English Language',
    subjectId: 'english',
    topic: 'Subject-Verb Agreement (Concord)',
    question: 'Neither the teacher nor the students _____ present at the assembly yesterday.',
    options: ['were', 'was', 'is', 'are'],
    correctAnswer: 0,
    explanation: 'Under the rule of proximity for neither...nor, the verb agrees with the closer subject ("students", which is plural), hence "were".'
  },
  {
    id: 'eng-q-2',
    subject: 'English Language',
    subjectId: 'english',
    topic: 'Figures of Speech & Literary Devices',
    question: 'Identify the figure of speech in: "The wind whispered through the dark trees."',
    options: ['Personification', 'Metaphor', 'Simile', 'Hyperbole'],
    correctAnswer: 0,
    explanation: 'Giving human traits (whispering) to non-human elements (the wind) is personification.'
  },
  {
    id: 'eng-q-3',
    subject: 'English Language',
    subjectId: 'english',
    topic: 'Lexis, Vocabulary & Antonyms/Synonyms',
    question: 'Choose the word that is nearest in meaning to "CANDID":',
    options: ['Frank and honest', 'Deceitful', 'Hesitant', 'Secretive'],
    correctAnswer: 0,
    explanation: 'Candid means truthful, outspoken, and straightforward.'
  },

  // Physics
  {
    id: 'phy-q-1',
    subject: 'Physics',
    subjectId: 'physics',
    topic: 'Mechanics: Motion, Velocity & Acceleration',
    question: 'A car accelerates uniformly from rest to 20 m/s in 5 seconds. Calculate its acceleration.',
    options: ['4 m/s²', '2 m/s²', '10 m/s²', '0.25 m/s²'],
    correctAnswer: 0,
    explanation: 'a = (v - u)/t = (20 - 0)/5 = 4 m/s².'
  },
  {
    id: 'phy-q-2',
    subject: 'Physics',
    subjectId: 'physics',
    topic: 'Newton\'s Laws of Motion & Momentum',
    question: 'According to Newton\'s Second Law of Motion, force is equal to the rate of change of:',
    options: ['Momentum', 'Velocity', 'Kinetic energy', 'Acceleration'],
    correctAnswer: 0,
    explanation: 'Newton\'s Second Law states that force equals the time rate of change of momentum (F = dp/dt).'
  },
  {
    id: 'phy-q-3',
    subject: 'Physics',
    subjectId: 'physics',
    topic: 'Current Electricity, Ohm\'s Law & Circuits',
    question: 'What is the equivalent resistance of two 6-ohm resistors connected in parallel?',
    options: ['3 ohms', '12 ohms', '6 ohms', '1.5 ohms'],
    correctAnswer: 0,
    explanation: '1/R_eq = 1/6 + 1/6 = 2/6 = 1/3, so R_eq = 3 ohms.'
  },
  {
    id: 'phy-q-4',
    subject: 'Physics',
    subjectId: 'physics',
    topic: 'Waves, Sound & Light Reflection/Refraction',
    question: 'When light travels from air into glass, what happens to its speed and wavelength?',
    options: ['Both decrease', 'Both increase', 'Speed decreases, wavelength increases', 'Speed increases, wavelength stays constant'],
    correctAnswer: 0,
    explanation: 'Glass is optically denser than air. Speed decreases and wavelength decreases proportionally while frequency remains constant.'
  },

  // Chemistry
  {
    id: 'chem-q-1',
    subject: 'Chemistry',
    subjectId: 'chemistry',
    topic: 'Periodic Table & Periodic Trends',
    question: 'Which of the following elements has the highest electronegativity?',
    options: ['Fluorine', 'Chlorine', 'Oxygen', 'Sodium'],
    correctAnswer: 0,
    explanation: 'Fluorine is the most electronegative element on the periodic table with a Pauling value of 3.98.'
  },
  {
    id: 'chem-q-2',
    subject: 'Chemistry',
    subjectId: 'chemistry',
    topic: 'Acids, Bases, Salts & Neutralization',
    question: 'What is the pH of a 0.01 M aqueous solution of hydrochloric acid (HCl)?',
    options: ['2', '1', '7', '12'],
    correctAnswer: 0,
    explanation: 'HCl is a strong acid that dissociates completely: [H+] = 10⁻² M. pH = -log(10⁻²) = 2.'
  },
  {
    id: 'chem-q-3',
    subject: 'Chemistry',
    subjectId: 'chemistry',
    topic: 'Stoichiometry & Mole Concept Calculations',
    question: 'What is the molar mass of Calcium Carbonate (CaCO₃)? [Ca=40, C=12, O=16]',
    options: ['100 g/mol', '68 g/mol', '84 g/mol', '120 g/mol'],
    correctAnswer: 0,
    explanation: 'Ca (40) + C (12) + 3×O (3×16 = 48) = 100 g/mol.'
  },

  // Biology
  {
    id: 'bio-q-1',
    subject: 'Biology',
    subjectId: 'biology',
    topic: 'Cell Structure, Functions & Organelles',
    question: 'Which organelle is often referred to as the powerhouse of the cell?',
    options: ['Mitochondrion', 'Ribosome', 'Golgi apparatus', 'Nucleus'],
    correctAnswer: 0,
    explanation: 'Mitochondria generate most of the chemical energy needed to power the cell\'s biochemical reactions via ATP production.'
  },
  {
    id: 'bio-q-2',
    subject: 'Biology',
    subjectId: 'biology',
    topic: 'Photosynthesis & Plant Nutrition',
    question: 'In which part of the chloroplast does the light-dependent stage of photosynthesis occur?',
    options: ['Thylakoid membrane', 'Stroma', 'Outer membrane', 'Cristae'],
    correctAnswer: 0,
    explanation: 'The light reactions take place in the thylakoid membranes, while the dark reactions (Calvin cycle) take place in the stroma.'
  },
  {
    id: 'bio-q-3',
    subject: 'Biology',
    subjectId: 'biology',
    topic: 'Genetics, DNA & Mendelian Inheritance',
    question: 'A cross between two heterozygous tall pea plants (Tt × Tt) produces what phenotypic ratio of tall to short plants?',
    options: ['3 : 1', '1 : 2 : 1', '1 : 1', '4 : 0'],
    correctAnswer: 0,
    explanation: 'The genotypes are TT (tall), Tt (tall), Tt (tall), and tt (short), resulting in 3 tall to 1 short.'
  },

  // Economics
  {
    id: 'econ-q-1',
    subject: 'Economics',
    subjectId: 'economics',
    topic: 'Theory of Demand and Supply & Elasticity',
    question: 'According to the law of demand, assuming other factors remain constant, when the price of a good increases:',
    options: ['Quantity demanded decreases', 'Quantity demanded increases', 'Supply decreases', 'Demand shifts rightward'],
    correctAnswer: 0,
    explanation: 'The law of demand states an inverse relationship between price and quantity demanded (ceteris paribus).'
  },
  {
    id: 'econ-q-2',
    subject: 'Economics',
    subjectId: 'economics',
    topic: 'Money, Banking & Central Bank Monetary Policy',
    question: 'Which institution possesses the sole authority to issue legal tender currency notes in Nigeria?',
    options: ['Central Bank of Nigeria (CBN)', 'Federal Ministry of Finance', 'Commercial Banks', 'NDIC'],
    correctAnswer: 0,
    explanation: 'The Central Bank of Nigeria has the exclusive statutory power to issue notes and coins.'
  },

  // Government
  {
    id: 'gov-q-1',
    subject: 'Government',
    subjectId: 'government',
    topic: 'Separation of Powers & Checks and Balances',
    question: 'The doctrine of Separation of Powers was popularized by which political philosopher?',
    options: ['Baron de Montesquieu', 'John Locke', 'Thomas Hobbes', 'Jean-Jacques Rousseau'],
    correctAnswer: 0,
    explanation: 'Montesquieu articulated the division of government responsibilities into executive, legislative, and judicial branches in The Spirit of the Laws (1748).'
  },
  {
    id: 'gov-q-2',
    subject: 'Government',
    subjectId: 'government',
    topic: 'Arms of Government: Legislature, Executive & Judiciary',
    question: 'Which arm of government is responsible for interpreting the law and the constitution?',
    options: ['The Judiciary', 'The Legislature', 'The Executive', 'The Civil Service'],
    correctAnswer: 0,
    explanation: 'The Judiciary interprets laws and resolves constitutional disputes.'
  },

  // Computer Studies
  {
    id: 'comp-q-1',
    subject: 'Computer Studies',
    subjectId: 'computer',
    topic: 'Data Representation, Binary & Hexadecimal',
    question: 'Convert the binary number 1011₂ to its decimal (base 10) equivalent.',
    options: ['11', '13', '9', '15'],
    correctAnswer: 0,
    explanation: '1×2³ + 0×2² + 1×2¹ + 1×2⁰ = 8 + 0 + 2 + 1 = 11.'
  },
  {
    id: 'comp-q-2',
    subject: 'Computer Studies',
    subjectId: 'computer',
    topic: 'Computer Networks, Topology & The Internet',
    question: 'Which network topology connects all nodes to a single central hub or switch?',
    options: ['Star topology', 'Bus topology', 'Ring topology', 'Mesh topology'],
    correctAnswer: 0,
    explanation: 'In a Star topology, every host is connected directly to a central hub, switch, or concentrator.'
  }
];
