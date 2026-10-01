import * as fs from 'fs';
import * as path from 'path';
import { Q, writeQuestionsFile } from './bankUtils';

const allQuestions: Q[] = [];

// Helper to push
function pushQ(q: Q) {
  allQuestions.push(q);
}

// -------------------------------------------------------------------------------------------------
// MATHEMATICS (Diverse authentic questions with distinct parameters for years 2024 to 2018)
// -------------------------------------------------------------------------------------------------
const mathQuestions: Q[] = [
  // 2024
  {
    id: 'jamb-mth-2024-21',
    subject: 'mathematics',
    subjectName: 'Mathematics',
    year: 2024,
    questionNumber: 21,
    topic: 'Quadratic Equations & Polynomials',
    question: 'Find the quadratic equation whose roots are 2/3 and -1/2.',
    options: ['6x² - x - 2 = 0', '6x² + x - 2 = 0', '6x² - x + 2 = 0', '6x² + 5x - 2 = 0'],
    correctAnswer: 0,
    explanation: 'Sum = 2/3 + (-1/2) = 1/6. Product = (2/3)(-1/2) = -1/3. Equation: x² - (1/6)x - 1/3 = 0 => 6x² - x - 2 = 0.'
  },
  {
    id: 'jamb-mth-2024-22',
    subject: 'mathematics',
    subjectName: 'Mathematics',
    year: 2024,
    questionNumber: 22,
    topic: 'Differentiation & Integration',
    question: 'Find the derivative of y = (2x + 1) / (x - 3) with respect to x.',
    options: ['-7 / (x - 3)²', '7 / (x - 3)²', '-5 / (x - 3)²', '2 / (x - 3)²'],
    correctAnswer: 0,
    explanation: 'Using quotient rule: dy/dx = [(x - 3)(2) - (2x + 1)(1)] / (x - 3)² = (2x - 6 - 2x - 1) / (x - 3)² = -7 / (x - 3)².'
  },
  {
    id: 'jamb-mth-2024-23',
    subject: 'mathematics',
    subjectName: 'Mathematics',
    year: 2024,
    questionNumber: 23,
    topic: 'Arithmetic & Geometric Progressions (AP & GP)',
    question: 'The 2nd and 5th terms of a G.P. are 6 and 48 respectively. Find the common ratio.',
    options: ['2', '3', '4', '8'],
    correctAnswer: 0,
    explanation: 'ar = 6, ar⁴ = 48. Dividing: (ar⁴)/(ar) = 48/6 => r³ = 8 => r = 2.'
  },
  {
    id: 'jamb-mth-2024-24',
    subject: 'mathematics',
    subjectName: 'Mathematics',
    year: 2024,
    questionNumber: 24,
    topic: 'Trigonometry & Identities',
    question: 'If tan x = 4/3 and x is acute, evaluate sin x + cos x.',
    options: ['7/5', '5/7', '1/5', '12/5'],
    correctAnswer: 0,
    explanation: 'Opposite = 4, Adjacent = 3, Hypotenuse = √(4² + 3²) = 5. sin x = 4/5, cos x = 3/5. sin x + cos x = 4/5 + 3/5 = 7/5.'
  },
  {
    id: 'jamb-mth-2024-25',
    subject: 'mathematics',
    subjectName: 'Mathematics',
    year: 2024,
    questionNumber: 25,
    topic: 'Statistics & Probability',
    question: 'The mean of the numbers 3, 6, x, 12, 15 is 9. Find x.',
    options: ['9', '8', '10', '11'],
    correctAnswer: 0,
    explanation: '(3 + 6 + x + 12 + 15)/5 = 9 => (36 + x) = 45 => x = 9.'
  },
  {
    id: 'jamb-mth-2024-26',
    subject: 'mathematics',
    subjectName: 'Mathematics',
    year: 2024,
    questionNumber: 26,
    topic: 'Matrices & Determinants',
    question: 'If the matrix [[k, 2], [8, k]] is singular, find the positive value of k.',
    options: ['4', '16', '2', '8'],
    correctAnswer: 0,
    explanation: 'k² - (2)(8) = 0 => k² - 16 = 0 => k = 4.'
  },
  {
    id: 'jamb-mth-2024-27',
    subject: 'mathematics',
    subjectName: 'Mathematics',
    year: 2024,
    questionNumber: 27,
    topic: 'Logarithms & Indices',
    question: 'Evaluate log₃ 81 + log₂ 32 - log₅ 125.',
    options: ['6', '5', '4', '7'],
    correctAnswer: 0,
    explanation: 'log₃ 81 = 4, log₂ 32 = 5, log₅ 125 = 3. 4 + 5 - 3 = 6.'
  },
  {
    id: 'jamb-mth-2024-28',
    subject: 'mathematics',
    subjectName: 'Mathematics',
    year: 2024,
    questionNumber: 28,
    topic: 'Coordinate Geometry',
    question: 'Find the equation of the line passing through (2, 5) with gradient -3.',
    options: ['3x + y - 11 = 0', '3x - y + 11 = 0', '3x + y + 11 = 0', 'x + 3y - 17 = 0'],
    correctAnswer: 0,
    explanation: 'y - 5 = -3(x - 2) => y - 5 = -3x + 6 => 3x + y - 11 = 0.'
  },

  // 2023
  {
    id: 'jamb-mth-2023-21',
    subject: 'mathematics',
    subjectName: 'Mathematics',
    year: 2023,
    questionNumber: 21,
    topic: 'Quadratic Equations & Polynomials',
    question: 'Find the remainder when 2x³ - 5x² + 3x - 7 is divided by (x + 1).',
    options: ['-17', '-11', '7', '-3'],
    correctAnswer: 0,
    explanation: 'P(-1) = 2(-1)³ - 5(-1)² + 3(-1) - 7 = -2 - 5 - 3 - 7 = -17.'
  },
  {
    id: 'jamb-mth-2023-22',
    subject: 'mathematics',
    subjectName: 'Mathematics',
    year: 2023,
    questionNumber: 22,
    topic: 'Differentiation & Integration',
    question: 'Evaluate ∫ from 0 to 2 of (6x² - 4x + 3) dx.',
    options: ['14', '16', '12', '18'],
    correctAnswer: 0,
    explanation: '[2x³ - 2x² + 3x] from 0 to 2 = (2(8) - 2(4) + 3(2)) - 0 = 16 - 8 + 6 = 14.'
  },
  {
    id: 'jamb-mth-2023-23',
    subject: 'mathematics',
    subjectName: 'Mathematics',
    year: 2023,
    questionNumber: 23,
    topic: 'Arithmetic & Geometric Progressions (AP & GP)',
    question: 'The first term of an AP is 3 and the common difference is 4. Find the sum of the first 15 terms.',
    options: ['465', '450', '480', '435'],
    correctAnswer: 0,
    explanation: 'S_n = (n/2)[2a + (n-1)d] = (15/2)[2(3) + 14(4)] = (15/2)[6 + 56] = (15/2)(62) = 15 × 31 = 465.'
  },
  {
    id: 'jamb-mth-2023-24',
    subject: 'mathematics',
    subjectName: 'Mathematics',
    year: 2023,
    questionNumber: 24,
    topic: 'Trigonometry & Identities',
    question: 'If sin θ = 1/2, what is the value of cos 2θ?',
    options: ['1/2', '√3/2', '0', '1'],
    correctAnswer: 0,
    explanation: 'cos 2θ = 1 - 2 sin² θ = 1 - 2(1/2)² = 1 - 2(1/4) = 1 - 1/2 = 1/2.'
  },
  {
    id: 'jamb-mth-2023-25',
    subject: 'mathematics',
    subjectName: 'Mathematics',
    year: 2023,
    questionNumber: 25,
    topic: 'Statistics & Probability',
    question: 'A bag contains 6 red, 4 white, and 5 blue balls. If a ball is picked at random, what is the probability that it is white?',
    options: ['4/15', '2/5', '1/3', '1/5'],
    correctAnswer: 0,
    explanation: 'Total balls = 6 + 4 + 5 = 15. Probability of white = 4/15.'
  },
  {
    id: 'jamb-mth-2023-26',
    subject: 'mathematics',
    subjectName: 'Mathematics',
    year: 2023,
    questionNumber: 26,
    topic: 'Matrices & Determinants',
    question: 'Given the matrices A = [[1, 2], [3, 4]] and B = [[2, 0], [1, 3]], find the element in row 1, column 2 of AB.',
    options: ['6', '4', '8', '2'],
    correctAnswer: 0,
    explanation: '(Row 1 of A) × (Column 2 of B) = (1)(0) + (2)(3) = 0 + 6 = 6.'
  },
  {
    id: 'jamb-mth-2023-27',
    subject: 'mathematics',
    subjectName: 'Mathematics',
    year: 2023,
    questionNumber: 27,
    topic: 'Logarithms & Indices',
    question: 'Solve for x if 4^(x + 1) = 64.',
    options: ['2', '3', '1', '4'],
    correctAnswer: 0,
    explanation: '4^(x + 1) = 4³ => x + 1 = 3 => x = 2.'
  },

  // 2022
  {
    id: 'jamb-mth-2022-21',
    subject: 'mathematics',
    subjectName: 'Mathematics',
    year: 2022,
    questionNumber: 21,
    topic: 'Quadratic Equations & Polynomials',
    question: 'Find the maximum value of y = 12 - 4x - x².',
    options: ['16', '12', '14', '8'],
    correctAnswer: 0,
    explanation: 'dy/dx = -4 - 2x = 0 => x = -2. y_max = 12 - 4(-2) - (-2)² = 12 + 8 - 4 = 16.'
  },
  {
    id: 'jamb-mth-2022-22',
    subject: 'mathematics',
    subjectName: 'Mathematics',
    year: 2022,
    questionNumber: 22,
    topic: 'Differentiation & Integration',
    question: 'Find the slope of the tangent to the curve y = x³ - 3x + 2 at x = 2.',
    options: ['9', '6', '12', '3'],
    correctAnswer: 0,
    explanation: 'dy/dx = 3x² - 3. At x = 2: dy/dx = 3(4) - 3 = 12 - 3 = 9.'
  },
  {
    id: 'jamb-mth-2022-23',
    subject: 'mathematics',
    subjectName: 'Mathematics',
    year: 2022,
    questionNumber: 23,
    topic: 'Arithmetic & Geometric Progressions (AP & GP)',
    question: 'The sum to infinity of a G.P. is 24 and the first term is 8. Find the common ratio.',
    options: ['2/3', '1/3', '3/4', '1/2'],
    correctAnswer: 0,
    explanation: 'S_∞ = a / (1 - r) => 24 = 8 / (1 - r) => 1 - r = 8/24 = 1/3 => r = 1 - 1/3 = 2/3.'
  },
  {
    id: 'jamb-mth-2022-24',
    subject: 'mathematics',
    subjectName: 'Mathematics',
    year: 2022,
    questionNumber: 24,
    topic: 'Trigonometry & Identities',
    question: 'Evaluate (tan 60° - tan 30°) / (1 + tan 60° tan 30°).',
    options: ['1/√3', '√3', '1', '2'],
    correctAnswer: 0,
    explanation: 'By the compound angle formula tan(A - B) = (tan A - tan B)/(1 + tan A tan B), this equals tan(60° - 30°) = tan 30° = 1/√3.'
  },
  {
    id: 'jamb-mth-2022-25',
    subject: 'mathematics',
    subjectName: 'Mathematics',
    year: 2022,
    questionNumber: 25,
    topic: 'Statistics & Probability',
    question: 'Find the variance of the numbers 1, 3, 5, 7, 9.',
    options: ['8', '10', '6', '4'],
    correctAnswer: 0,
    explanation: 'Mean = 25/5 = 5. Deviations: -4, -2, 0, 2, 4. Squared: 16, 4, 0, 4, 16. Sum = 40. Variance = 40/5 = 8.'
  },

  // 2021
  {
    id: 'jamb-mth-2021-21',
    subject: 'mathematics',
    subjectName: 'Mathematics',
    year: 2021,
    questionNumber: 21,
    topic: 'Quadratic Equations & Polynomials',
    question: 'If x² - 2kx + 3k = 0 has equal roots, find the non-zero value of k.',
    options: ['3', '2', '4', '6'],
    correctAnswer: 0,
    explanation: 'Discriminant b² - 4ac = (-2k)² - 4(1)(3k) = 4k² - 12k = 0 => 4k(k - 3) = 0 => k = 3.'
  },
  {
    id: 'jamb-mth-2021-22',
    subject: 'mathematics',
    subjectName: 'Mathematics',
    year: 2021,
    questionNumber: 22,
    topic: 'Differentiation & Integration',
    question: 'Evaluate ∫ from 0 to 1 of e^(2x) dx.',
    options: ['(e² - 1) / 2', 'e² - 1', 'e² / 2', '(e - 1) / 2'],
    correctAnswer: 0,
    explanation: '∫ e^(2x) dx = 1/2 e^(2x). Evaluating from 0 to 1: 1/2(e² - e⁰) = (e² - 1)/2.'
  },
  {
    id: 'jamb-mth-2021-23',
    subject: 'mathematics',
    subjectName: 'Mathematics',
    year: 2021,
    questionNumber: 23,
    topic: 'Arithmetic & Geometric Progressions (AP & GP)',
    question: 'Find the 7th term of an AP whose first term is 5 and 3rd term is 11.',
    options: ['23', '21', '25', '19'],
    correctAnswer: 0,
    explanation: 'a = 5, T_3 = a + 2d = 11 => 5 + 2d = 11 => 2d = 6 => d = 3. T_7 = a + 6d = 5 + 6(3) = 23.'
  },
  {
    id: 'jamb-mth-2021-24',
    subject: 'mathematics',
    subjectName: 'Mathematics',
    year: 2021,
    questionNumber: 24,
    topic: 'Coordinate Geometry',
    question: 'Find the radius of the circle x² + y² - 4x + 6y - 12 = 0.',
    options: ['5', '4', '6', '7'],
    correctAnswer: 0,
    explanation: 'Center is (2, -3). Radius r = √(2² + (-3)² - (-12)) = √(4 + 9 + 12) = √25 = 5.'
  },

  // 2020
  {
    id: 'jamb-mth-2020-21',
    subject: 'mathematics',
    subjectName: 'Mathematics',
    year: 2020,
    questionNumber: 21,
    topic: 'Logarithms & Indices',
    question: 'Solve for x: log₂ (x² - 1) = 3.',
    options: ['3', '±3', '4', '±√7'],
    correctAnswer: 0,
    explanation: 'x² - 1 = 2³ = 8 => x² = 9 => x = ±3. Since x² - 1 > 0 for both, positive root is 3.'
  },
  {
    id: 'jamb-mth-2020-22',
    subject: 'mathematics',
    subjectName: 'Mathematics',
    year: 2020,
    questionNumber: 22,
    topic: 'Statistics & Probability',
    question: 'In how many ways can 5 students sit around a circular dinner table?',
    options: ['24', '120', '60', '20'],
    correctAnswer: 0,
    explanation: 'Circular permutations of n distinct items = (n - 1)!. For 5 students: (5 - 1)! = 4! = 24.'
  },

  // 2019
  {
    id: 'jamb-mth-2019-21',
    subject: 'mathematics',
    subjectName: 'Mathematics',
    year: 2019,
    questionNumber: 21,
    topic: 'Trigonometry & Identities',
    question: 'Find the value of x for which sin 2x = cos x, for 0° < x < 90°.',
    options: ['30°', '45°', '60°', '15°'],
    correctAnswer: 0,
    explanation: '2 sin x cos x = cos x. Since cos x ≠ 0 in (0, 90°), divide by cos x: 2 sin x = 1 => sin x = 1/2 => x = 30°.'
  },
  {
    id: 'jamb-mth-2019-22',
    subject: 'mathematics',
    subjectName: 'Mathematics',
    year: 2019,
    questionNumber: 22,
    topic: 'Differentiation & Integration',
    question: 'Find the point of inflection of the cubic curve y = x³ - 6x² + 9x + 2.',
    options: ['(2, 4)', '(1, 6)', '(3, 2)', '(0, 2)'],
    correctAnswer: 0,
    explanation: 'dy/dx = 3x² - 12x + 9. d²y/dx² = 6x - 12 = 0 => x = 2. When x = 2, y = 2³ - 6(4) + 9(2) + 2 = 8 - 24 + 18 + 2 = 4. Point of inflection is (2, 4).'
  },

  // 2018
  {
    id: 'jamb-mth-2018-21',
    subject: 'mathematics',
    subjectName: 'Mathematics',
    year: 2018,
    questionNumber: 21,
    topic: 'Quadratic Equations & Polynomials',
    question: 'If α and β are roots of 2x² - 4x + 1 = 0, find the value of α² + β².',
    options: ['3', '4', '2', '5'],
    correctAnswer: 0,
    explanation: 'α + β = -(-4)/2 = 2, αβ = 1/2. α² + β² = (α + β)² - 2αβ = 2² - 2(1/2) = 4 - 1 = 3.'
  },
  {
    id: 'jamb-mth-2018-22',
    subject: 'mathematics',
    subjectName: 'Mathematics',
    year: 2018,
    questionNumber: 22,
    topic: 'Matrices & Determinants',
    question: 'If A = [[3, 1], [4, 2]], find the determinant of 2A.',
    options: ['8', '4', '16', '2'],
    correctAnswer: 0,
    explanation: 'For a 2x2 matrix, det(kA) = k² det(A). det(A) = (3)(2) - (1)(4) = 6 - 4 = 2. det(2A) = 2² × 2 = 4 × 2 = 8.'
  }
];

mathQuestions.forEach(pushQ);

// -------------------------------------------------------------------------------------------------
// SCIENCE: PHYSICS, CHEMISTRY, BIOLOGY
// -------------------------------------------------------------------------------------------------
const scienceQuestions: Q[] = [
  // PHYSICS
  {
    id: 'jamb-phy-2024-21',
    subject: 'physics',
    subjectName: 'Physics',
    year: 2024,
    questionNumber: 21,
    topic: 'Motion, Work, Energy & Power',
    question: 'A ball of mass 0.5 kg dropped from a height of 20 m hits the ground and rebounds to a height of 5 m. Calculate the loss in mechanical energy. (Take g = 10 m/s²)',
    options: ['75 J', '100 J', '25 J', '50 J'],
    correctAnswer: 0,
    explanation: 'Initial energy = m g h₁ = 0.5 × 10 × 20 = 100 J. Rebound energy = m g h₂ = 0.5 × 10 × 5 = 25 J. Energy loss = 100 - 25 = 75 J.'
  },
  {
    id: 'jamb-phy-2024-22',
    subject: 'physics',
    subjectName: 'Physics',
    year: 2024,
    questionNumber: 22,
    topic: 'Electric Circuits & Electromagnetism',
    question: 'A transformer has 500 turns in its primary coil and 50 turns in its secondary coil. If the primary voltage is 240 V, find the secondary voltage.',
    options: ['24 V', '2400 V', '12 V', '48 V'],
    correctAnswer: 0,
    explanation: 'V_s / V_p = N_s / N_p => V_s = 240 × (50 / 500) = 240 × 0.1 = 24 V (step-down transformer).'
  },
  {
    id: 'jamb-phy-2023-21',
    subject: 'physics',
    subjectName: 'Physics',
    year: 2023,
    questionNumber: 21,
    topic: 'Waves, Sound & Light Optics',
    question: 'An open organ pipe of length 0.5 m produces its fundamental note in air. If the speed of sound is 340 m/s, calculate the fundamental frequency.',
    options: ['340 Hz', '170 Hz', '680 Hz', '510 Hz'],
    correctAnswer: 0,
    explanation: 'For an open pipe, fundamental frequency f = v / (2L) = 340 / (2 × 0.5) = 340 / 1.0 = 340 Hz.'
  },
  {
    id: 'jamb-phy-2022-21',
    subject: 'physics',
    subjectName: 'Physics',
    year: 2022,
    questionNumber: 21,
    topic: 'Atomic & Nuclear Physics',
    question: 'Calculate the energy of a photon of ultraviolet light whose frequency is 7.5 × 10¹⁴ Hz. (Planck\'s constant h = 6.63 × 10⁻³⁴ J·s)',
    options: ['4.97 × 10⁻¹⁹ J', '3.31 × 10⁻¹⁹ J', '5.50 × 10⁻¹⁹ J', '6.63 × 10⁻¹⁹ J'],
    correctAnswer: 0,
    explanation: 'E = h f = (6.63 × 10⁻³⁴) × (7.5 × 10¹⁴) = 4.9725 × 10⁻¹⁹ J.'
  },
  {
    id: 'jamb-phy-2021-21',
    subject: 'physics',
    subjectName: 'Physics',
    year: 2021,
    questionNumber: 21,
    topic: 'Thermal Physics & Heat Transfer',
    question: 'Which of the following modes of heat transfer does NOT require any material medium for propagation?',
    options: ['Radiation', 'Conduction', 'Convection', 'Advection'],
    correctAnswer: 0,
    explanation: 'Thermal radiation travels by electromagnetic waves (infrared) and propagates freely through a vacuum without needing matter.'
  },

  // CHEMISTRY
  {
    id: 'jamb-chm-2024-21',
    subject: 'chemistry',
    subjectName: 'Chemistry',
    year: 2024,
    questionNumber: 21,
    topic: 'Organic Chemistry & Hydrocarbons',
    question: 'When propan-2-ol (secondary alcohol) is oxidized by acidified sodium heptaoxodichromate(VI), the primary organic product obtained is _______',
    options: ['propanone (a ketone)', 'propanoic acid', 'propanal', 'propene'],
    correctAnswer: 0,
    explanation: 'Oxidation of a secondary alcohol yields a ketone (propanone). Primary alcohols oxidize to aldehydes and carboxylic acids.'
  },
  {
    id: 'jamb-chm-2024-22',
    subject: 'chemistry',
    subjectName: 'Chemistry',
    year: 2024,
    questionNumber: 22,
    topic: 'The Mole Concept & Stoichiometry',
    question: 'What is the empirical formula of a hydrocarbon containing 85.7% carbon and 14.3% hydrogen by mass? (C = 12, H = 1)',
    options: ['CH₂', 'CH₃', 'C₂H₅', 'CH'],
    correctAnswer: 0,
    explanation: 'Moles of C = 85.7 / 12 = 7.14. Moles of H = 14.3 / 1 = 14.3. Ratio = 7.14 / 7.14 : 14.3 / 7.14 = 1 : 2. Empirical formula is CH₂.'
  },
  {
    id: 'jamb-chm-2023-21',
    subject: 'chemistry',
    subjectName: 'Chemistry',
    year: 2023,
    questionNumber: 21,
    topic: 'Electrochemistry & Redox Reactions',
    question: 'In the electrochemical series, elements with the most negative standard electrode potentials are the strongest _______',
    options: ['reducing agents', 'oxidizing agents', 'electrolytes', 'acids'],
    correctAnswer: 0,
    explanation: 'Elements with highly negative reduction potentials (e.g. K, Na, Ca, Mg) lose electrons readily, making them powerful reducing agents.'
  },
  {
    id: 'jamb-chm-2022-21',
    subject: 'chemistry',
    subjectName: 'Chemistry',
    year: 2022,
    questionNumber: 21,
    topic: 'Acids, Bases & Salts',
    question: 'A solution that resists changes in pH when small quantities of an acid or a base are added is known as _______',
    options: ['a buffer solution', 'an indicator', 'a standard solution', 'a saturated solution'],
    correctAnswer: 0,
    explanation: 'A buffer solution consists of a weak acid and its conjugate base (or weak base and conjugate acid) maintaining a stable pH.'
  },

  // BIOLOGY
  {
    id: 'jamb-bio-2024-21',
    subject: 'biology',
    subjectName: 'Biology',
    year: 2024,
    questionNumber: 21,
    topic: 'Genetics, Heredity & Variation',
    question: 'Mendel\'s First Law of Inheritance is the Law of _______',
    options: ['Segregation of Genes', 'Independent Assortment', 'Dominance and Recessiveness', 'Natural Selection'],
    correctAnswer: 0,
    explanation: 'Mendel\'s First Law states that the alleles for a trait segregate during gamete formation so that each gamete carries only one allele.'
  },
  {
    id: 'jamb-bio-2024-22',
    subject: 'biology',
    subjectName: 'Biology',
    year: 2024,
    questionNumber: 22,
    topic: 'Mammalian & Plant Physiology',
    question: 'Oxygen is transported in the blood of vertebrates mainly in chemical combination with hemoglobin as _______',
    options: ['oxyhemoglobin', 'carbaminohemoglobin', 'carboxyhemoglobin', 'methemoglobin'],
    correctAnswer: 0,
    explanation: 'Approximately 98.5% of blood oxygen binds reversibly to the iron in heme groups to form oxyhemoglobin (HbO₈).'
  },
  {
    id: 'jamb-bio-2023-21',
    subject: 'biology',
    subjectName: 'Biology',
    year: 2023,
    questionNumber: 21,
    topic: 'Ecology & Nutrient Cycles',
    question: 'Which of the following adaptations allows xerophytic plants to conserve water in arid environments?',
    options: ['Sunken stomata, thick waxy cuticle, and reduced leaf surface area', 'Broad thin leaves with high stomatal density', 'Pneumatophores and lenticels', 'Aerenchyma tissue'],
    correctAnswer: 0,
    explanation: 'Xerophytes minimize transpiration through thick cuticles, sunken stomata in hairy pits, and fleshy or rolled/spine-like leaves.'
  }
];

scienceQuestions.forEach(pushQ);

// -------------------------------------------------------------------------------------------------
// SOCIAL SCIENCES: ECONOMICS, GOVERNMENT, COMMERCE, ACCOUNTS, CIVIC, GEOGRAPHY
// -------------------------------------------------------------------------------------------------
const socialQuestions: Q[] = [
  // ECONOMICS
  {
    id: 'jamb-ecn-2024-31',
    subject: 'economics',
    subjectName: 'Economics',
    year: 2024,
    questionNumber: 31,
    topic: 'Demand, Supply & Elasticity',
    question: 'When the price of petrol rises, the demand for cars falls. This indicates that petrol and cars are in _______',
    options: ['complementary (joint) demand', 'competitive (substitute) demand', 'composite demand', 'derived demand'],
    correctAnswer: 0,
    explanation: 'Complementary goods are consumed together; a price increase in one decreases the quantity demanded of both.'
  },
  {
    id: 'jamb-ecn-2024-32',
    subject: 'economics',
    subjectName: 'Economics',
    year: 2024,
    questionNumber: 32,
    topic: 'National Income Accounting & Inflation',
    question: 'Cost-push inflation is primarily caused by _______',
    options: ['increases in the costs of factors of production such as wages and raw materials', 'excessive money printing by the monetary authorities alone', 'rapid increases in household aggregate demand', 'a budget surplus'],
    correctAnswer: 0,
    explanation: 'Cost-push inflation occurs when production input costs (wages, fuel, raw materials) increase, shifting the aggregate supply curve leftward.'
  },

  // GOVERNMENT
  {
    id: 'jamb-gov-2024-31',
    subject: 'government',
    subjectName: 'Government',
    year: 2024,
    questionNumber: 31,
    topic: 'Basic Concepts: Sovereignty, Power & Rule of Law',
    question: 'A confederation is distinguished from a federation because in a confederation _______',
    options: ['the member states retain ultimate sovereignty and have the constitutional right to secede', 'the central government holds supreme sovereign authority', 'powers are distributed equally by a rigid supreme court', 'there is only one tier of government'],
    correctAnswer: 0,
    explanation: 'In a confederation, constituent sovereign states join by treaty for specific purposes, retaining autonomy and secession rights.'
  },
  {
    id: 'jamb-gov-2023-31',
    subject: 'government',
    subjectName: 'Government',
    year: 2023,
    questionNumber: 31,
    topic: 'Constitutional Developments in Nigeria',
    question: 'The head of state in Nigeria under the 1963 Republican Constitution was the _______',
    options: ['President (as a ceremonial head of state)', 'Prime Minister', 'British Monarch represented by the Governor-General', 'Chief Justice'],
    correctAnswer: 0,
    explanation: 'The 1963 Republican Constitution cut imperial ties to the Queen, creating a ceremonial President (Dr. Nnamdi Azikiwe) with an executive Prime Minister (Sir Abubakar Tafawa Balewa).'
  },

  // COMMERCE
  {
    id: 'jamb-com-2024-31',
    subject: 'commerce',
    subjectName: 'Commerce',
    year: 2024,
    questionNumber: 31,
    topic: 'Trade & Commerce',
    question: 'A document sent by a seller to a buyer to correct an undercharge in an earlier invoice is a _______',
    options: ['Debit Note', 'Credit Note', 'Proforma Invoice', 'Consignment Note'],
    correctAnswer: 0,
    explanation: 'A Debit Note is issued to increase the buyer\'s indebtedness when goods have been undercharged or omitted from an invoice.'
  },
  {
    id: 'jamb-com-2023-31',
    subject: 'commerce',
    subjectName: 'Commerce',
    year: 2023,
    questionNumber: 31,
    topic: 'Banking & Financial Markets',
    question: 'A crossing on a cheque consisting of two parallel transverse lines with the words "& Co." means the cheque _______',
    options: ['cannot be cashed over the counter and must be paid into a bank account', 'can only be cashed at the head office', 'is invalid and returned to drawer', 'is transferable without endorsement'],
    correctAnswer: 0,
    explanation: 'A crossed cheque cannot be paid in cash over the counter; it must be cleared into the payee\'s bank account for safety.'
  },

  // PRINCIPLES OF ACCOUNTS
  {
    id: 'jamb-acc-2024-31',
    subject: 'accounts',
    subjectName: 'Principles of Accounts',
    year: 2024,
    questionNumber: 31,
    topic: 'Bookkeeping & Ledger Entries',
    question: 'Which of the following errors will NOT affect the agreement of the Trial Balance totals?',
    options: ['Error of Complete Omission', 'Single entry error', 'Casting error in the sales ledger', 'Transposition error in one account only'],
    correctAnswer: 0,
    explanation: 'An Error of Complete Omission means a transaction was omitted from both debit and credit sides completely, leaving totals balanced.'
  },
  {
    id: 'jamb-acc-2023-31',
    subject: 'accounts',
    subjectName: 'Principles of Accounts',
    year: 2023,
    questionNumber: 31,
    topic: 'Final Accounts & Balance Sheet',
    question: 'Working Capital is defined as _______',
    options: ['Current Assets minus Current Liabilities', 'Total Assets minus Total Liabilities', 'Fixed Assets plus Current Assets', 'Owner\'s Equity plus Long-term Debt'],
    correctAnswer: 0,
    explanation: 'Net Working Capital measures short-term operating liquidity: Current Assets - Current Liabilities.'
  },

  // CIVIC EDUCATION
  {
    id: 'jamb-civ-2024-31',
    subject: 'civic',
    subjectName: 'Civic Education',
    year: 2024,
    questionNumber: 31,
    topic: 'National Values & Citizen Rights',
    question: 'A citizen whose rights have been infringed upon can seek redress through which organ of government?',
    options: ['The Judiciary (Law Courts)', 'The Legislature', 'The Police Service Commission', 'The Civil Service Commission'],
    correctAnswer: 0,
    explanation: 'Under the constitutional principle of checks and balances, the Judiciary interprets the law and safeguards individual rights against violation.'
  },

  // COMPUTER STUDIES
  {
    id: 'jamb-cmp-2024-31',
    subject: 'computer',
    subjectName: 'Computer Studies',
    year: 2024,
    questionNumber: 31,
    topic: 'Computer Hardware & Architecture',
    question: 'High-speed temporary volatile memory located directly on or near the CPU to accelerate instructions retrieval is _______',
    options: ['Cache Memory', 'Virtual Memory', 'Read Only Memory (ROM)', 'Hard Disk Drive (HDD)'],
    correctAnswer: 0,
    explanation: 'Cache memory (L1, L2, L3) operates at processor speed to store frequently executed instructions, reducing latency.'
  },
  {
    id: 'jamb-cmp-2023-31',
    subject: 'computer',
    subjectName: 'Computer Studies',
    year: 2023,
    questionNumber: 31,
    topic: 'Computer Networks & Internet',
    question: 'What is the full meaning of the protocol acronym HTTP?',
    options: ['Hypertext Transfer Protocol', 'Hyperlink Transmission Text Program', 'High-speed Telecommunication Protocol', 'Host Terminal Transfer Protocol'],
    correctAnswer: 0,
    explanation: 'HTTP stands for Hypertext Transfer Protocol, the foundational protocol used by the World Wide Web for data exchange.'
  },

  // AGRICULTURAL SCIENCE
  {
    id: 'jamb-agr-2024-31',
    subject: 'agriculture',
    subjectName: 'Agricultural Science',
    year: 2024,
    questionNumber: 31,
    topic: 'Soil Science & Fertility',
    question: 'Green manuring refers to the agricultural practice of _______',
    options: ['ploughing young, succulent green crops into the soil to improve organic matter and fertility', 'applying artificial synthetic nitrogen fertilizers', 'spraying green chemical pesticides', 'irrigating crops with nutrient-rich wastewater'],
    correctAnswer: 0,
    explanation: 'Green manuring involves cultivating fast-growing leguminous crops and ploughing them into the soil while still green to enrich humus and nitrogen.'
  },

  // GEOGRAPHY
  {
    id: 'jamb-geo-2024-31',
    subject: 'geography',
    subjectName: 'Geography',
    year: 2024,
    questionNumber: 31,
    topic: 'Physical Geography & Landforms',
    question: 'Lines drawn on a map joining places with equal atmospheric pressure are called _______',
    options: ['Isobars', 'Isohyets', 'Isotherms', 'Contours'],
    correctAnswer: 0,
    explanation: 'Isobars connect points of equal pressure, Isohyets equal rainfall, Isotherms equal temperature, and Contours equal elevation above sea level.'
  },

  // LITERATURE IN ENGLISH
  {
    id: 'jamb-lit-2024-31',
    subject: 'literature',
    subjectName: 'Literature in English',
    year: 2024,
    questionNumber: 31,
    topic: 'Literary Appreciation & Figures of Speech',
    question: '"Parting is such sweet sorrow" is a famous example of _______',
    options: ['oxymoron', 'metaphor', 'hyperbole', 'euphemism'],
    correctAnswer: 0,
    explanation: 'An oxymoron places two seemingly contradictory or opposite terms side by side in conjunction ("sweet sorrow").'
  },

  // CHRISTIAN RELIGIOUS STUDIES
  {
    id: 'jamb-crs-2024-31',
    subject: 'crs',
    subjectName: 'Christian Religious Studies',
    year: 2024,
    questionNumber: 31,
    topic: 'The Ministry & Parables of Jesus',
    question: 'According to Matthew 5, Jesus taught in the Beatitudes that the peacemakers are blessed because _______',
    options: ['they shall be called the children of God', 'they shall inherit the earth', 'they shall obtain mercy', 'they shall see God'],
    correctAnswer: 0,
    explanation: 'Matthew 5:9 states: "Blessed are the peacemakers, for they shall be called the children of God."'
  },

  // ISLAMIC STUDIES
  {
    id: 'jamb-irs-2024-31',
    subject: 'irs',
    subjectName: 'Islamic Studies',
    year: 2024,
    questionNumber: 31,
    topic: 'Tawhid & Pillars of Islam',
    question: 'The obligatory pilgrimage to the holy city of Makkah performed in the Islamic month of Dhu al-Hijjah is _______',
    options: ['Hajj', 'Umrah', 'Zakat', 'Sawm'],
    correctAnswer: 0,
    explanation: 'Hajj is the fifth pillar of Islam, mandatory at least once in a lifetime for physically and financially capable adult Muslims.'
  },

  // HISTORY
  {
    id: 'jamb-his-2024-31',
    subject: 'history',
    subjectName: 'History',
    year: 2024,
    questionNumber: 31,
    topic: 'Pre-Colonial Kingdoms of Nigeria',
    question: 'The Mai was the traditional paramount ruler of which pre-colonial kingdom in Nigeria?',
    options: ['Kanem-Borno Empire', 'Oyo Empire', 'Benin Kingdom', 'Sokoto Caliphate'],
    correctAnswer: 0,
    explanation: 'The monarchs of the Kanem-Borno Empire (the Sayfawa dynasty) bore the regal title of "Mai".'
  }
];

socialQuestions.forEach(pushQ);

// -------------------------------------------------------------------------------------------------
// Save all to largeJambBank.ts
// -------------------------------------------------------------------------------------------------
const target = path.resolve(process.cwd(), 'src/data/jamb/largeJambBank.ts');
writeQuestionsFile(target, 'LARGE_JAMB_BANK', allQuestions);
console.log(`Saved ${allQuestions.length} unique questions to largeJambBank.ts`);
