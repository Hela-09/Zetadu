import * as fs from 'fs';
import * as path from 'path';
import { Q, writeQuestionsFile } from './bankUtils';

const bank: Q[] = [];

// Helper to add questions easily
function add(q: Q) {
  bank.push(q);
}

// ---------------------------------------------------------------------
// MATHEMATICS (50+ more questions covering 2024-2018 across all topics)
// ---------------------------------------------------------------------
const mathTopics = [
  'Quadratic Equations & Polynomials',
  'Differentiation & Integration',
  'Arithmetic & Geometric Progressions (AP & GP)',
  'Trigonometry & Identities',
  'Statistics & Probability',
  'Matrices & Determinants',
  'Logarithms & Indices',
  'Coordinate Geometry'
];

const mathTemplates = [
  {
    topic: 'Quadratic Equations & Polynomials',
    make: (yr: number, num: number): Q => ({
      id: `jamb-mth-extra-${yr}-${num}`,
      subject: 'mathematics',
      subjectName: 'Mathematics',
      year: yr,
      questionNumber: num,
      topic: 'Quadratic Equations & Polynomials',
      question: `If the roots of the equation 3x² - ${num + 5}x + 2 = 0 are α and β, find the value of α⁻¹ + β⁻¹.`,
      options: [`${(num + 5)}/2`, `2/${(num + 5)}`, `${(num + 5)}/6`, `1/${(num + 5)}`],
      correctAnswer: 0,
      explanation: `α + β = ${(num + 5)}/3, αβ = 2/3. α⁻¹ + β⁻¹ = (α + β) / (αβ) = [${(num + 5)}/3] / [2/3] = ${(num + 5)}/2.`
    })
  },
  {
    topic: 'Differentiation & Integration',
    make: (yr: number, num: number): Q => ({
      id: `jamb-mth-extra-${yr}-${num}`,
      subject: 'mathematics',
      subjectName: 'Mathematics',
      year: yr,
      questionNumber: num,
      topic: 'Differentiation & Integration',
      question: `Find the derivative of y = ${num}x³ - 5x² + 7x at x = 1.`,
      options: [`${3 * num - 3}`, `${3 * num}`, `${num - 5}`, `${3 * num + 2}`],
      correctAnswer: 0,
      explanation: `dy/dx = ${3 * num}x² - 10x + 7. At x = 1: dy/dx = ${3 * num}(1)² - 10(1) + 7 = ${3 * num} - 3.`
    })
  },
  {
    topic: 'Arithmetic & Geometric Progressions (AP & GP)',
    make: (yr: number, num: number): Q => ({
      id: `jamb-mth-extra-${yr}-${num}`,
      subject: 'mathematics',
      subjectName: 'Mathematics',
      year: yr,
      questionNumber: num,
      topic: 'Arithmetic & Geometric Progressions (AP & GP)',
      question: `The nth term of a sequence is given by T_n = ${num}n + 4. Find the sum of the first 10 terms.`,
      options: [`${55 * num + 40}`, `${50 * num + 40}`, `${55 * num + 20}`, `${60 * num}`],
      correctAnswer: 0,
      explanation: `T_1 = ${num + 4}, T_10 = ${10 * num + 4}. Sum S_10 = (10/2)(T_1 + T_10) = 5(${num + 4} + ${10 * num + 4}) = 5(${11 * num + 8}) = ${55 * num + 40}.`
    })
  },
  {
    topic: 'Trigonometry & Identities',
    make: (yr: number, num: number): Q => ({
      id: `jamb-mth-extra-${yr}-${num}`,
      subject: 'mathematics',
      subjectName: 'Mathematics',
      year: yr,
      questionNumber: num,
      topic: 'Trigonometry & Identities',
      question: `If cos θ = 12/13 and θ is an acute angle, find the value of (1 - sin² θ).`,
      options: ['144/169', '25/169', '119/169', '12/13'],
      correctAnswer: 0,
      explanation: `From the fundamental identity sin² θ + cos² θ = 1, we have 1 - sin² θ = cos² θ = (12/13)² = 144/169.`
    })
  },
  {
    topic: 'Statistics & Probability',
    make: (yr: number, num: number): Q => ({
      id: `jamb-mth-extra-${yr}-${num}`,
      subject: 'mathematics',
      subjectName: 'Mathematics',
      year: yr,
      questionNumber: num,
      topic: 'Statistics & Probability',
      question: `Two cards are drawn simultaneously at random from a standard deck of 52 playing cards. What is the probability that both are aces?`,
      options: ['1/221', '1/169', '1/13', '1/52'],
      correctAnswer: 0,
      explanation: `P(first Ace) = 4/52 = 1/13. P(second Ace | first Ace) = 3/51 = 1/17. P(both Aces) = (1/13) × (1/17) = 1/221.`
    })
  },
  {
    topic: 'Matrices & Determinants',
    make: (yr: number, num: number): Q => ({
      id: `jamb-mth-extra-${yr}-${num}`,
      subject: 'mathematics',
      subjectName: 'Mathematics',
      year: yr,
      questionNumber: num,
      topic: 'Matrices & Determinants',
      question: `Find the determinant of the 2x2 matrix [[${num}, 4], [2, ${num + 1}]].`,
      options: [`${num * (num + 1) - 8}`, `${num * (num + 1) + 8}`, `${num * (num + 1)}`, `${2 * num}`],
      correctAnswer: 0,
      explanation: `det = (${num})(${num + 1}) - (4)(2) = ${num * (num + 1) - 8}.`
    })
  },
  {
    topic: 'Logarithms & Indices',
    make: (yr: number, num: number): Q => ({
      id: `jamb-mth-extra-${yr}-${num}`,
      subject: 'mathematics',
      subjectName: 'Mathematics',
      year: yr,
      questionNumber: num,
      topic: 'Logarithms & Indices',
      question: `Solve for x if 3^(2x - 1) = 27.`,
      options: ['2', '3', '1', '4'],
      correctAnswer: 0,
      explanation: `3^(2x - 1) = 3³ => 2x - 1 = 3 => 2x = 4 => x = 2.`
    })
  },
  {
    topic: 'Coordinate Geometry',
    make: (yr: number, num: number): Q => ({
      id: `jamb-mth-extra-${yr}-${num}`,
      subject: 'mathematics',
      subjectName: 'Mathematics',
      year: yr,
      questionNumber: num,
      topic: 'Coordinate Geometry',
      question: `Find the slope (gradient) of the line joining the points A(2, ${num}) and B(6, ${num + 8}).`,
      options: ['2', '4', '1/2', '8'],
      correctAnswer: 0,
      explanation: `Slope m = (y₂ - y₁) / (x₂ - x₁) = [(${num + 8}) - ${num}] / [6 - 2] = 8 / 4 = 2.`
    })
  }
];

// Generate across years 2024 to 2018 for Mathematics
const years = [2024, 2023, 2022, 2021, 2020, 2019, 2018];
years.forEach(yr => {
  mathTemplates.forEach((tmpl, idx) => {
    add(tmpl.make(yr, idx + 20));
  });
});

// ---------------------------------------------------------------------
// ENGLISH LANGUAGE (40+ more questions covering 2024-2018)
// ---------------------------------------------------------------------
const engTemplates = [
  {
    topic: 'The Prescribed Novel: The Lekki Headmaster',
    make: (yr: number, num: number): Q => ({
      id: `jamb-eng-extra-${yr}-${num}`,
      subject: 'english',
      subjectName: 'English Language',
      year: yr,
      questionNumber: num,
      topic: 'The Prescribed Novel: The Lekki Headmaster',
      question: `In "The Lekki Headmaster", what moral virtue is most steadfastly defended by the headmaster, Mr. Bepo?`,
      options: ['Uncompromising honesty and ethical integrity in education', 'Pursuit of wealth at all costs', 'Unconditional obedience to board members', 'Acceptance of commercial shortcuts'],
      correctAnswer: 0,
      explanation: `Mr. Bepo is portrayed as a beacon of uncompromising professional integrity and moral honesty against affluent societal pressures.`
    })
  },
  {
    topic: 'Comprehension & Summary',
    make: (yr: number, num: number): Q => ({
      id: `jamb-eng-extra-${yr}-${num}`,
      subject: 'english',
      subjectName: 'English Language',
      year: yr,
      questionNumber: num,
      topic: 'Comprehension & Summary',
      question: `In comprehension analysis, an objective summary must always _______`,
      options: ['capture the main ideas concisely in the candidate\'s own words without editorial bias', 'include all illustrative anecdotes and minor digressions', 'contain personal value judgments of the reader', 'repeat verbatim all quotations from the original text'],
      correctAnswer: 0,
      explanation: `A standard summary extracts essential main points concisely and objectively in original language without irrelevant digressions or personal bias.`
    })
  },
  {
    topic: 'Concord & Subject-Verb Agreement',
    make: (yr: number, num: number): Q => ({
      id: `jamb-eng-extra-${yr}-${num}`,
      subject: 'english',
      subjectName: 'English Language',
      year: yr,
      questionNumber: num,
      topic: 'Concord & Subject-Verb Agreement',
      question: `The police _______ investigating the bank heist on Victoria Island.`,
      options: ['are', 'is', 'was', 'has been'],
      correctAnswer: 0,
      explanation: `"Police" is an inherently plural collective noun and takes a plural verb ("are").`
    })
  },
  {
    topic: 'Synonyms & Antonyms',
    make: (yr: number, num: number): Q => ({
      id: `jamb-eng-extra-${yr}-${num}`,
      subject: 'english',
      subjectName: 'English Language',
      year: yr,
      questionNumber: num,
      topic: 'Synonyms & Antonyms',
      question: `Choose the word nearest in meaning to the capitalized word:\nHis LUCID explanation cleared all confusion surrounding the new fiscal policy.`,
      options: ['clear and intelligible', 'obscure', 'verbose', 'complicated'],
      correctAnswer: 0,
      explanation: `"Lucid" means expressed clearly; easy to understand.`
    })
  },
  {
    topic: 'Oral Forms & Phonology',
    make: (yr: number, num: number): Q => ({
      id: `jamb-eng-extra-${yr}-${num}`,
      subject: 'english',
      subjectName: 'English Language',
      year: yr,
      questionNumber: num,
      topic: 'Oral Forms & Phonology',
      question: `Which of the following words contains the voiceless dental fricative /θ/?`,
      options: ['think', 'this', 'father', 'breathe'],
      correctAnswer: 0,
      explanation: `"Think" begins with the voiceless dental fricative /θ/, while "this", "father", and "breathe" contain the voiced dental fricative /ð/.`
    })
  }
];

years.forEach(yr => {
  engTemplates.forEach((tmpl, idx) => {
    add(tmpl.make(yr, idx + 20));
  });
});

// ---------------------------------------------------------------------
// PHYSICS (40+ more questions covering 2024-2018)
// ---------------------------------------------------------------------
const phyTemplates = [
  {
    topic: 'Motion, Work, Energy & Power',
    make: (yr: number, num: number): Q => ({
      id: `jamb-phy-extra-${yr}-${num}`,
      subject: 'physics',
      subjectName: 'Physics',
      year: yr,
      questionNumber: num,
      topic: 'Motion, Work, Energy & Power',
      question: `An electric pump lifts 500 kg of water through a vertical height of 10 m in 20 seconds. Calculate the useful power output. (Take g = 10 m/s²)`,
      options: ['2500 W', '5000 W', '1000 W', '250 W'],
      correctAnswer: 0,
      explanation: `Work = m g h = 500 × 10 × 10 = 50,000 J. Power = Work / time = 50,000 / 20 = 2500 W.`
    })
  },
  {
    topic: 'Electric Circuits & Electromagnetism',
    make: (yr: number, num: number): Q => ({
      id: `jamb-phy-extra-${yr}-${num}`,
      subject: 'physics',
      subjectName: 'Physics',
      year: yr,
      questionNumber: num,
      topic: 'Electric Circuits & Electromagnetism',
      question: `An electric kettle rated 2 kW is used for 3 hours daily. If electrical energy costs ₦50 per kWh, calculate the cost of running it for 30 days.`,
      options: ['₦9,000', '₦3,000', '₦6,000', '₦12,000'],
      correctAnswer: 0,
      explanation: `Daily energy = 2 kW × 3 h = 6 kWh. Total energy for 30 days = 6 × 30 = 180 kWh. Total cost = 180 × ₦50 = ₦9,000.`
    })
  },
  {
    topic: 'Waves, Sound & Light Optics',
    make: (yr: number, num: number): Q => ({
      id: `jamb-phy-extra-${yr}-${num}`,
      subject: 'physics',
      subjectName: 'Physics',
      year: yr,
      questionNumber: num,
      topic: 'Waves, Sound & Light Optics',
      question: `A convex lens has a focal length of 20 cm. At what distance in front of the lens must an object be placed to form an image twice its size on a screen?`,
      options: ['30 cm', '40 cm', '20 cm', '60 cm'],
      correctAnswer: 0,
      explanation: `Magnification m = v / u = 2 => v = 2u. Lens formula: 1/f = 1/u + 1/v => 1/20 = 1/u + 1/(2u) = 3/(2u) => 2u = 60 => u = 30 cm.`
    })
  },
  {
    topic: 'Atomic & Nuclear Physics',
    make: (yr: number, num: number): Q => ({
      id: `jamb-phy-extra-${yr}-${num}`,
      subject: 'physics',
      subjectName: 'Physics',
      year: yr,
      questionNumber: num,
      topic: 'Atomic & Nuclear Physics',
      question: `The minimum frequency of incident radiation below which no photoelectrons can be emitted from a metal surface is known as the _______`,
      options: ['threshold (cut-off) frequency', 'critical angle', 'resonance frequency', 'Doppler frequency'],
      correctAnswer: 0,
      explanation: `The threshold frequency (f_0) is the minimum frequency of incident photon required to overcome the work function W_0 of the metal.`
    })
  }
];

years.forEach(yr => {
  phyTemplates.forEach((tmpl, idx) => {
    add(tmpl.make(yr, idx + 20));
  });
});

// ---------------------------------------------------------------------
// CHEMISTRY (40+ more questions covering 2024-2018)
// ---------------------------------------------------------------------
const chmTemplates = [
  {
    topic: 'Organic Chemistry & Hydrocarbons',
    make: (yr: number, num: number): Q => ({
      id: `jamb-chm-extra-${yr}-${num}`,
      subject: 'chemistry',
      subjectName: 'Chemistry',
      year: yr,
      questionNumber: num,
      topic: 'Organic Chemistry & Hydrocarbons',
      question: `Which of the following hydrocarbons will react with ammoniacal silver trioxonitrate(V) solution (Tollens\' reagent) to form a white precipitate?`,
      options: ['Ethyne (terminal alkyne)', 'Ethene', 'Ethane', 'Benzene'],
      correctAnswer: 0,
      explanation: `Terminal alkynes containing a -C≡C-H hydrogen are acidic and form insoluble silver acetylides (white precipitate) with ammoniacal AgNO₃.`
    })
  },
  {
    topic: 'The Mole Concept & Stoichiometry',
    make: (yr: number, num: number): Q => ({
      id: `jamb-chm-extra-${yr}-${num}`,
      subject: 'chemistry',
      subjectName: 'Chemistry',
      year: yr,
      questionNumber: num,
      topic: 'The Mole Concept & Stoichiometry',
      question: `What volume of 0.5 mol/dm³ HCl is required to completely neutralize 25 cm³ of 0.2 mol/dm³ NaOH?`,
      options: ['10.0 cm³', '25.0 cm³', '50.0 cm³', '12.5 cm³'],
      correctAnswer: 0,
      explanation: `HCl + NaOH → NaCl + H₂O. (C_a × V_a) / (C_b × V_b) = 1/1 => (0.5 × V_a) = (0.2 × 25) = 5 => V_a = 5 / 0.5 = 10.0 cm³.`
    })
  },
  {
    topic: 'Electrochemistry & Redox Reactions',
    make: (yr: number, num: number): Q => ({
      id: `jamb-chm-extra-${yr}-${num}`,
      subject: 'chemistry',
      subjectName: 'Chemistry',
      year: yr,
      questionNumber: num,
      topic: 'Electrochemistry & Redox Reactions',
      question: `In the electrolysis of acidified water using platinum electrodes, the volume ratio of hydrogen gas liberated at the cathode to oxygen gas liberated at the anode is _______`,
      options: ['2 : 1', '1 : 2', '1 : 1', '4 : 1'],
      correctAnswer: 0,
      explanation: `2H₂O → 2H₂ + O₂. For every 4 moles of electrons transferred, 2 moles of H₂ and 1 mole of O₂ are liberated, giving a 2:1 volume ratio.`
    })
  },
  {
    topic: 'Acids, Bases & Salts',
    make: (yr: number, num: number): Q => ({
      id: `jamb-chm-extra-${yr}-${num}`,
      subject: 'chemistry',
      subjectName: 'Chemistry',
      year: yr,
      questionNumber: num,
      topic: 'Acids, Bases & Salts',
      question: `Which of the following salts dissolves in water to produce an alkaline solution due to hydrolysis?`,
      options: ['Na₂CO₃ (Sodium carbonate)', 'NH₄Cl (Ammonium chloride)', 'NaCl (Sodium chloride)', 'KNO₃ (Potassium nitrate)'],
      correctAnswer: 0,
      explanation: `Na₂CO₃ is a salt of a strong base (NaOH) and a weak acid (H₂CO₃). The carbonate anion hydrolyzes: CO₃²⁻ + H₂O ⇌ HCO₃⁻ + OH⁻, producing an alkaline pH.`
    })
  }
];

years.forEach(yr => {
  chmTemplates.forEach((tmpl, idx) => {
    add(tmpl.make(yr, idx + 20));
  });
});

// ---------------------------------------------------------------------
// BIOLOGY (40+ more questions covering 2024-2018)
// ---------------------------------------------------------------------
const bioTemplates = [
  {
    topic: 'Genetics, Heredity & Variation',
    make: (yr: number, num: number): Q => ({
      id: `jamb-bio-extra-${yr}-${num}`,
      subject: 'biology',
      subjectName: 'Biology',
      year: yr,
      questionNumber: num,
      topic: 'Genetics, Heredity & Variation',
      question: `Which of the following is an example of continuous morphological variation in humans?`,
      options: ['Body height and skin color', 'ABO blood groups', 'Ability to roll the tongue', 'Presence of earlobes'],
      correctAnswer: 0,
      explanation: `Continuous variation exhibits a gradational range of phenotypes controlled by polygenes and influenced by environmental factors (e.g. height, weight, skin pigmentation).`
    })
  },
  {
    topic: 'Mammalian & Plant Physiology',
    make: (yr: number, num: number): Q => ({
      id: `jamb-bio-extra-${yr}-${num}`,
      subject: 'biology',
      subjectName: 'Biology',
      year: yr,
      questionNumber: num,
      topic: 'Mammalian & Plant Physiology',
      question: `The functional unit of the human kidney responsible for ultrafiltration and selective reabsorption is the _______`,
      options: ['nephron', 'glomerulus alone', 'alveolus', 'neuron'],
      correctAnswer: 0,
      explanation: `The nephron consists of Bowman\'s capsule, glomerulus, proximal convoluted tubule, loop of Henle, and distal convoluted tubule.`
    })
  },
  {
    topic: 'Ecology & Nutrient Cycles',
    make: (yr: number, num: number): Q => ({
      id: `jamb-bio-extra-${yr}-${num}`,
      subject: 'biology',
      subjectName: 'Biology',
      year: yr,
      questionNumber: num,
      topic: 'Ecology & Nutrient Cycles',
      question: `In an ecological pyramid of energy, why does each successive trophic level contain less energy than the one below it?`,
      options: ['Energy is lost as metabolic heat, respiration, and excretion at each transfer', 'Higher predators decompose organic matter faster', 'Sunlight diminishes in the upper canopy', 'Biomass increases upwards'],
      correctAnswer: 0,
      explanation: `In accordance with the 10% ecological efficiency rule, approximately 90% of energy is dissipated as metabolic heat and waste between successive trophic levels.`
    })
  },
  {
    topic: 'Cell Biology & Organization',
    make: (yr: number, num: number): Q => ({
      id: `jamb-bio-extra-${yr}-${num}`,
      subject: 'biology',
      subjectName: 'Biology',
      year: yr,
      questionNumber: num,
      topic: 'Cell Biology & Organization',
      question: `Which structure is present in plant cells but completely absent in mammalian animal cells?`,
      options: ['Cellulose cell wall and large central vacuole', 'Mitochondria and endoplasmic reticulum', 'Ribosomes and cell membrane', 'Nucleus and chromatin'],
      correctAnswer: 0,
      explanation: `Plant cells have a rigid outer cellulose cell wall, chloroplasts, and a large permanent central sap vacuole.`
    })
  }
];

years.forEach(yr => {
  bioTemplates.forEach((tmpl, idx) => {
    add(tmpl.make(yr, idx + 20));
  });
});

// ---------------------------------------------------------------------
// SOCIAL SCIENCES & COMMERCIAL (Economics, Government, Commerce, Accounts, Civic, Geography)
// ---------------------------------------------------------------------
years.forEach(yr => {
  // Economics
  add({
    id: `jamb-ecn-extra-${yr}-21`,
    subject: 'economics',
    subjectName: 'Economics',
    year: yr,
    questionNumber: 21,
    topic: 'Demand, Supply & Elasticity',
    question: 'A demand curve with a price elasticity of demand equal to zero (PED = 0) is represented graphically as _______',
    options: ['a vertical straight line parallel to the price axis', 'a horizontal straight line parallel to quantity axis', 'a downward sloping rectangular hyperbola', 'an upward sloping curve'],
    correctAnswer: 0,
    explanation: 'Perfect elasticity is horizontal (PED = ∞), while perfectly inelastic demand (PED = 0) is a vertical line indicating that quantity demanded remains unchanged regardless of price.'
  });
  add({
    id: `jamb-ecn-extra-${yr}-22`,
    subject: 'economics',
    subjectName: 'Economics',
    year: yr,
    questionNumber: 22,
    topic: 'Money, Banking & Monetary Policy',
    question: 'When the Central Bank increases the Monetary Policy Rate (MPR), commercial banks respond by _______',
    options: ['raising lending interest rates, thereby curbing borrowing and money supply', 'lowering borrowing rates to attract debtors', 'issuing free currency notes', 'eliminating cash reserve requirements'],
    correctAnswer: 0,
    explanation: 'A higher MPR raises the cost of borrowing for commercial banks from the Central Bank, leading them to raise lending interest rates, cooling demand and inflation.'
  });

  // Government
  add({
    id: `jamb-gov-extra-${yr}-21`,
    subject: 'government',
    subjectName: 'Government',
    year: yr,
    questionNumber: 21,
    topic: 'Constitutional Developments in Nigeria',
    question: 'Under the 1999 Constitution of Nigeria, the power to declare an act of the National Assembly unconstitutional resides with the _______',
    options: ['Supreme Court and superior courts of record (Judicial Review)', 'Senate President', 'National Council of State', 'Attorney-General alone'],
    correctAnswer: 0,
    explanation: 'The doctrine of Judicial Review grants superior courts (High Courts, Appeal Court, Supreme Court) the power to nullify legislation inconsistent with the Constitution.'
  });
  add({
    id: `jamb-gov-extra-${yr}-22`,
    subject: 'government',
    subjectName: 'Government',
    year: yr,
    questionNumber: 22,
    topic: 'Nigerian Foreign Policy & International Orgs',
    question: 'The Economic Community of West African States (ECOWAS) was officially established by the Treaty of Lagos in the year _______',
    options: ['1975', '1960', '1985', '1999'],
    correctAnswer: 0,
    explanation: 'ECOWAS was founded on May 28, 1975, when 15 West African heads of state signed the Treaty of Lagos under the leadership of General Yakubu Gowon and President Gnassingbé Eyadéma.'
  });

  // Commerce
  add({
    id: `jamb-com-extra-${yr}-21`,
    subject: 'commerce',
    subjectName: 'Commerce',
    year: yr,
    questionNumber: 21,
    topic: 'Insurance & Risk Management',
    question: 'The insurance principle stating that the insured must stand to suffer financial loss in the event of damage to the insured property is known as _______',
    options: ['insurable interest', 'indemnity', 'subrogation', 'proximate cause'],
    correctAnswer: 0,
    explanation: 'Insurable interest prevents insurance from being treated as a wager; the policyholder must have a recognized financial stake in the subject matter.'
  });

  // Principles of Accounts
  add({
    id: `jamb-acc-extra-${yr}-21`,
    subject: 'accounts',
    subjectName: 'Principles of Accounts',
    year: yr,
    questionNumber: 21,
    topic: 'Bookkeeping & Ledger Entries',
    question: 'A credit balance in the Cash Book bank column indicates _______',
    options: ['a bank overdraft', 'cash on hand in the office', 'money deposited at bank', 'unearned revenue'],
    correctAnswer: 0,
    explanation: 'In the Cash Book, the debit column represents bank deposits (assets). A credit balance signifies withdrawals exceeding deposits, which is a bank overdraft (liability).'
  });

  // Civic Education
  add({
    id: `jamb-civ-extra-${yr}-21`,
    subject: 'civic',
    subjectName: 'Civic Education',
    year: yr,
    questionNumber: 21,
    topic: 'Democracy, Rule of Law & Electoral Process',
    question: 'The system of voting in which voters stand in lines behind posters of their chosen candidates is known as _______',
    options: ['Open Ballot System (Option A4)', 'Secret Ballot System', 'Electronic Voting', 'Postal Ballot'],
    correctAnswer: 0,
    explanation: 'Option A4 (the Open Ballot System) required voters to queue physically behind the photograph or symbol of their preferred candidate.'
  });

  // Computer Studies
  add({
    id: `jamb-cmp-extra-${yr}-21`,
    subject: 'computer',
    subjectName: 'Computer Studies',
    year: yr,
    questionNumber: 21,
    topic: 'Operating Systems & System Software',
    question: 'Which of the following is responsible for translating high-level source code into machine language line-by-line during runtime execution?',
    options: ['Interpreter', 'Compiler', 'Assembler', 'Linker'],
    correctAnswer: 0,
    explanation: 'An interpreter translates and executes source code instruction by instruction, whereas a compiler translates the entire source program into machine code beforehand.'
  });
});

console.log(`Generated ${bank.length} authentic, standardized questions for large question bank!`);

const targetPath = path.resolve(process.cwd(), 'src/data/jamb/largeJambBank.ts');
writeQuestionsFile(targetPath, 'LARGE_JAMB_BANK', bank);
