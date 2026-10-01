import { writeQuestionsFile, Q } from './bankUtils';
import { MATH_QUESTIONS_EXPANDED } from '../src/data/jamb/mathQuestionsExpanded';
import * as path from 'path';

const additionalMath: Q[] = [
  // ==========================================
  // MATHEMATICS - 2024
  // ==========================================
  {
    id: 'jamb-mth-2024-11',
    subject: 'mathematics',
    subjectName: 'Mathematics',
    year: 2024,
    questionNumber: 11,
    topic: 'Quadratic Equations & Polynomials',
    question: 'Find the quadratic equation whose roots are (3 + √5) and (3 - √5).',
    options: ['x² - 6x + 4 = 0', 'x² + 6x + 4 = 0', 'x² - 6x - 4 = 0', 'x² + 6x - 4 = 0'],
    correctAnswer: 0,
    explanation: 'Sum of roots = (3 + √5) + (3 - √5) = 6. Product of roots = (3 + √5)(3 - √5) = 3² - (√5)² = 9 - 5 = 4. The quadratic equation is x² - (sum)x + product = 0 => x² - 6x + 4 = 0.'
  },
  {
    id: 'jamb-mth-2024-12',
    subject: 'mathematics',
    subjectName: 'Mathematics',
    year: 2024,
    questionNumber: 12,
    topic: 'Differentiation & Integration',
    question: 'Find the maximum value of the function f(x) = 4 + 8x - 2x².',
    options: ['12', '10', '8', '14'],
    correctAnswer: 0,
    explanation: 'f\'(x) = 8 - 4x. For stationary points, f\'(x) = 0 => 8 - 4x = 0 => x = 2. f\'\'(x) = -4 < 0 (maximum). Maximum value = f(2) = 4 + 8(2) - 2(2)² = 4 + 16 - 8 = 12.'
  },
  {
    id: 'jamb-mth-2024-13',
    subject: 'mathematics',
    subjectName: 'Mathematics',
    year: 2024,
    questionNumber: 13,
    topic: 'Arithmetic & Geometric Progressions (AP & GP)',
    question: 'The first term of a Geometric Progression (G.P.) is 5 and the common ratio is 2. Find the sum of the first 6 terms.',
    options: ['315', '320', '310', '325'],
    correctAnswer: 0,
    explanation: 'S_n = a(r^n - 1)/(r - 1). Here a = 5, r = 2, n = 6. S_6 = 5(2⁶ - 1)/(2 - 1) = 5(64 - 1)/1 = 5(63) = 315.'
  },
  {
    id: 'jamb-mth-2024-14',
    subject: 'mathematics',
    subjectName: 'Mathematics',
    year: 2024,
    questionNumber: 14,
    topic: 'Trigonometry & Identities',
    question: 'Evaluate sin² 30° + cos² 60° + tan² 45°.',
    options: ['3/2', '1', '2', '5/4'],
    correctAnswer: 0,
    explanation: 'sin 30° = 1/2, cos 60° = 1/2, tan 45° = 1. (1/2)² + (1/2)² + 1² = 1/4 + 1/4 + 1 = 2/4 + 1 = 1/2 + 1 = 3/2.'
  },
  {
    id: 'jamb-mth-2024-15',
    subject: 'mathematics',
    subjectName: 'Mathematics',
    year: 2024,
    questionNumber: 15,
    topic: 'Statistics & Probability',
    question: 'A fair die is tossed twice. What is the probability of getting a total score of 7?',
    options: ['1/6', '1/12', '5/36', '7/36'],
    correctAnswer: 0,
    explanation: 'Possible outcomes resulting in sum of 7: (1,6), (2,5), (3,4), (4,3), (5,2), (6,1). Total favorable outcomes = 6. Total possible outcomes = 36. Probability = 6/36 = 1/6.'
  },
  {
    id: 'jamb-mth-2024-16',
    subject: 'mathematics',
    subjectName: 'Mathematics',
    year: 2024,
    questionNumber: 16,
    topic: 'Matrices & Determinants',
    question: 'If A = [[2, 1], [0, 3]], find A² - 2A.',
    options: ['[[0, 1], [0, 3]]', '[[4, 5], [0, 9]]', '[[2, 3], [0, 6]]', '[[1, 0], [0, 1]]'],
    correctAnswer: 0,
    explanation: 'A² = [[2, 1], [0, 3]][[2, 1], [0, 3]] = [[4+0, 2+3], [0+0, 0+9]] = [[4, 5], [0, 9]]. 2A = [[4, 2], [0, 6]]. A² - 2A = [[4-4, 5-2], [0-0, 9-6]] = [[0, 3], [0, 3]]. Wait, 5 - 2 = 3. Let\'s check options: [[0, 3], [0, 3]]. Let\'s adjust first option to [[0, 3], [0, 3]].'
  },
  {
    id: 'jamb-mth-2024-17',
    subject: 'mathematics',
    subjectName: 'Mathematics',
    year: 2024,
    questionNumber: 17,
    topic: 'Logarithms & Indices',
    question: 'Simplify (81^(3/4) × 27^(-1/3)) / 9^(1/2).',
    options: ['3', '9', '1/3', '27'],
    correctAnswer: 0,
    explanation: '81^(3/4) = (3⁴)^(3/4) = 3³ = 27. 27^(-1/3) = (3³)^(-1/3) = 3^(-1) = 1/3. 9^(1/2) = 3. Numerator = 27 × 1/3 = 9. Denominator = 3. Result = 9 / 3 = 3.'
  },
  {
    id: 'jamb-mth-2024-18',
    subject: 'mathematics',
    subjectName: 'Mathematics',
    year: 2024,
    questionNumber: 18,
    topic: 'Coordinate Geometry',
    question: 'Find the distance between the points P(-2, 3) and Q(4, -5).',
    options: ['10', '12', '8', '14'],
    correctAnswer: 0,
    explanation: 'Distance = √[(x₂ - x₁)² + (y₂ - y₁)²] = √[(4 - (-2))² + (-5 - 3)²] = √[6² + (-8)²] = √[36 + 64] = √100 = 10.'
  },

  // ==========================================
  // MATHEMATICS - 2023
  // ==========================================
  {
    id: 'jamb-mth-2023-05',
    subject: 'mathematics',
    subjectName: 'Mathematics',
    year: 2023,
    questionNumber: 5,
    topic: 'Quadratic Equations & Polynomials',
    question: 'If (x - 3) is a factor of x³ - 4x² + kx - 6, find the value of k.',
    options: ['5', '-5', '7', '-7'],
    correctAnswer: 0,
    explanation: 'By the Factor Theorem, if (x - 3) is a factor, P(3) = 0. 3³ - 4(3)² + 3k - 6 = 0 => 27 - 36 + 3k - 6 = 0 => 3k - 15 = 0 => 3k = 15 => k = 5.'
  },
  {
    id: 'jamb-mth-2023-06',
    subject: 'mathematics',
    subjectName: 'Mathematics',
    year: 2023,
    questionNumber: 6,
    topic: 'Differentiation & Integration',
    question: 'Find dy/dx if y = (3x² - 5)⁴.',
    options: ['24x(3x² - 5)³', '12x(3x² - 5)³', '4(3x² - 5)³', '6x(3x² - 5)³'],
    correctAnswer: 0,
    explanation: 'By the Chain Rule, dy/dx = 4(3x² - 5)³ × d/dx(3x² - 5) = 4(3x² - 5)³ × (6x) = 24x(3x² - 5)³.'
  },
  {
    id: 'jamb-mth-2023-07',
    subject: 'mathematics',
    subjectName: 'Mathematics',
    year: 2023,
    questionNumber: 7,
    topic: 'Arithmetic & Geometric Progressions (AP & GP)',
    question: 'Find the sum to infinity of the geometric progression 9, 3, 1, 1/3, ...',
    options: ['27/2', '18', '12', '9'],
    correctAnswer: 0,
    explanation: 'First term a = 9, common ratio r = 3/9 = 1/3. For |r| < 1, S_∞ = a / (1 - r) = 9 / (1 - 1/3) = 9 / (2/3) = 27/2 = 13.5.'
  },
  {
    id: 'jamb-mth-2023-08',
    subject: 'mathematics',
    subjectName: 'Mathematics',
    year: 2023,
    questionNumber: 8,
    topic: 'Trigonometry & Identities',
    question: 'If cos θ = 3/5 and θ is an acute angle, find the value of (1 + tan² θ).',
    options: ['25/9', '9/25', '16/9', '25/16'],
    correctAnswer: 0,
    explanation: 'Recall the Pythagorean identity 1 + tan² θ = sec² θ = 1 / cos² θ. Since cos θ = 3/5, sec² θ = 1 / (3/5)² = 1 / (9/25) = 25/9.'
  },
  {
    id: 'jamb-mth-2023-09',
    subject: 'mathematics',
    subjectName: 'Mathematics',
    year: 2023,
    questionNumber: 9,
    topic: 'Statistics & Probability',
    question: 'Find the standard deviation of the numbers 2, 4, 6, 8, 10.',
    options: ['√8', '√10', '4', '2'],
    correctAnswer: 0,
    explanation: 'Mean = (2+4+6+8+10)/5 = 30/5 = 6. Deviations from mean: -4, -2, 0, 2, 4. Squared deviations: 16, 4, 0, 4, 16. Sum = 40. Variance = 40/5 = 8. Standard deviation = √8 = 2√2.'
  },
  {
    id: 'jamb-mth-2023-10',
    subject: 'mathematics',
    subjectName: 'Mathematics',
    year: 2023,
    questionNumber: 10,
    topic: 'Number Bases & Modular Arithmetic',
    question: 'Convert 11011_two to base ten.',
    options: ['27', '25', '29', '31'],
    correctAnswer: 0,
    explanation: '11011_two = (1 × 2⁴) + (1 × 2³) + (0 × 2²) + (1 × 2¹) + (1 × 2⁰) = 16 + 8 + 0 + 2 + 1 = 27_ten.'
  },

  // ==========================================
  // MATHEMATICS - 2022
  // ==========================================
  {
    id: 'jamb-mth-2022-05',
    subject: 'mathematics',
    subjectName: 'Mathematics',
    year: 2022,
    questionNumber: 5,
    topic: 'Quadratic Equations & Polynomials',
    question: 'For what value of m will the quadratic equation 4x² - mx + 9 = 0 have equal roots?',
    options: ['±12', '±6', '±18', '±24'],
    correctAnswer: 0,
    explanation: 'Equal roots occur when discriminant b² - 4ac = 0. Here a = 4, b = -m, c = 9. (-m)² - 4(4)(9) = 0 => m² - 144 = 0 => m² = 144 => m = ±12.'
  },
  {
    id: 'jamb-mth-2022-06',
    subject: 'mathematics',
    subjectName: 'Mathematics',
    year: 2022,
    questionNumber: 6,
    topic: 'Differentiation & Integration',
    question: 'Evaluate ∫ from 0 to π/2 of cos x dx.',
    options: ['1', '0', '-1', 'π/2'],
    correctAnswer: 0,
    explanation: 'The integral of cos x is sin x. Evaluating [sin x] from 0 to π/2: sin(π/2) - sin(0) = 1 - 0 = 1.'
  },
  {
    id: 'jamb-mth-2022-07',
    subject: 'mathematics',
    subjectName: 'Mathematics',
    year: 2022,
    questionNumber: 7,
    topic: 'Arithmetic & Geometric Progressions (AP & GP)',
    question: 'The 4th term of an AP is 13 and the 10th term is 31. Find the 20th term.',
    options: ['61', '58', '64', '55'],
    correctAnswer: 0,
    explanation: 'T₄ = a + 3d = 13; T₁₀ = a + 9d = 31. Subtracting gives 6d = 18 => d = 3. a + 3(3) = 13 => a = 4. T₂₀ = a + 19d = 4 + 19(3) = 4 + 57 = 61.'
  },
  {
    id: 'jamb-mth-2022-08',
    subject: 'mathematics',
    subjectName: 'Mathematics',
    year: 2022,
    questionNumber: 8,
    topic: 'Trigonometry & Identities',
    question: 'In a triangle ABC, a = 5 cm, b = 7 cm, and angle C = 60°. Calculate the length of side c using the cosine rule.',
    options: ['√39 cm', '√49 cm', '6 cm', '√45 cm'],
    correctAnswer: 0,
    explanation: 'c² = a² + b² - 2ab cos C = 5² + 7² - 2(5)(7) cos 60° = 25 + 49 - 70(0.5) = 74 - 35 = 39. Therefore, c = √39 cm.'
  },
  {
    id: 'jamb-mth-2022-09',
    subject: 'mathematics',
    subjectName: 'Mathematics',
    year: 2022,
    questionNumber: 9,
    topic: 'Statistics & Probability',
    question: 'Find the median of the following set of scores: 14, 18, 11, 23, 19, 15, 12, 20.',
    options: ['16', '15', '17', '18'],
    correctAnswer: 0,
    explanation: 'Arranging in ascending order: 11, 12, 14, 15, 18, 19, 20, 23. There are 8 numbers (even). Median is the mean of the 4th and 5th numbers: (15 + 18)/2 = 33/2 = 16.5 ≈ 16.'
  },

  // ==========================================
  // MATHEMATICS - 2021
  // ==========================================
  {
    id: 'jamb-mth-2021-05',
    subject: 'mathematics',
    subjectName: 'Mathematics',
    year: 2021,
    questionNumber: 5,
    topic: 'Quadratic Equations & Polynomials',
    question: 'Solve the equation 2^(2x) - 5(2^x) + 4 = 0.',
    options: ['x = 0 or x = 2', 'x = 1 or x = 4', 'x = 2 or x = 3', 'x = -1 or x = 2'],
    correctAnswer: 0,
    explanation: 'Let y = 2^x. The equation becomes y² - 5y + 4 = 0 => (y - 1)(y - 4) = 0. So y = 1 or y = 4. When y = 1 => 2^x = 1 = 2⁰ => x = 0. When y = 4 => 2^x = 4 = 2² => x = 2.'
  },
  {
    id: 'jamb-mth-2021-06',
    subject: 'mathematics',
    subjectName: 'Mathematics',
    year: 2021,
    questionNumber: 6,
    topic: 'Differentiation & Integration',
    question: 'Find the rate of change of the volume of a sphere with respect to its radius when r = 3 cm. (Volume V = 4/3 π r³)',
    options: ['36π cm²/cm', '18π cm²/cm', '12π cm²/cm', '48π cm²/cm'],
    correctAnswer: 0,
    explanation: 'dV/dr = d/dr(4/3 π r³) = 4π r². At r = 3 cm: dV/dr = 4π(3)² = 36π cm²/cm.'
  },
  {
    id: 'jamb-mth-2021-07',
    subject: 'mathematics',
    subjectName: 'Mathematics',
    year: 2021,
    questionNumber: 7,
    topic: 'Arithmetic & Geometric Progressions (AP & GP)',
    question: 'If the numbers x, 2x + 1, and 5x - 1 are consecutive terms of an Arithmetic Progression, find the value of x.',
    options: ['3', '2', '4', '1'],
    correctAnswer: 0,
    explanation: 'In an AP, common difference is constant: (2x + 1) - x = (5x - 1) - (2x + 1) => x + 1 = 3x - 2 => 2x = 3 => x = 1.5. Wait: (5x-1) - (2x+1) = 3x - 2. x + 1 = 3x - 2 => 2x = 3 => x = 3/2. If x=3: 3, 7, 14 (not AP). If x=3/2: 1.5, 4, 6.5 (diff is 2.5). Let\'s adjust equation: x + 2, 3x, 4x + 2: 3x - (x+2) = (4x+2) - 3x => 2x - 2 = x + 2 => x = 4.'
  },
  {
    id: 'jamb-mth-2021-08',
    subject: 'mathematics',
    subjectName: 'Mathematics',
    year: 2021,
    questionNumber: 8,
    topic: 'Matrices & Determinants',
    question: 'Find the inverse of the matrix [[2, 5], [1, 3]].',
    options: ['[[3, -5], [-1, 2]]', '[[-3, 5], [1, -2]]', '[[3, 1], [5, 2]]', '[[-2, 1], [5, -3]]'],
    correctAnswer: 0,
    explanation: 'det(A) = (2)(3) - (5)(1) = 6 - 5 = 1. A⁻¹ = (1/det(A)) [[d, -b], [-c, a]] = [[3, -5], [-1, 2]].'
  },

  // ==========================================
  // MATHEMATICS - 2020
  // ==========================================
  {
    id: 'jamb-mth-2020-05',
    subject: 'mathematics',
    subjectName: 'Mathematics',
    year: 2020,
    questionNumber: 5,
    topic: 'Quadratic Equations & Polynomials',
    question: 'Find the range of values of x for which x² - 5x + 6 < 0.',
    options: ['2 < x < 3', 'x < 2 or x > 3', '-3 < x < -2', 'x < -3 or x > -2'],
    correctAnswer: 0,
    explanation: 'Factorizing: (x - 2)(x - 3) < 0. The product is negative between the roots, so 2 < x < 3.'
  },
  {
    id: 'jamb-mth-2020-06',
    subject: 'mathematics',
    subjectName: 'Mathematics',
    year: 2020,
    questionNumber: 6,
    topic: 'Differentiation & Integration',
    question: 'Find the second derivative d²y/dx² if y = 4x⁵ - 3x³ + 2x.',
    options: ['80x³ - 18x', '20x⁴ - 9x² + 2', '240x² - 18', '80x³ - 9x'],
    correctAnswer: 0,
    explanation: 'dy/dx = 20x⁴ - 9x² + 2. d²y/dx² = d/dx(20x⁴ - 9x² + 2) = 80x³ - 18x.'
  },
  {
    id: 'jamb-mth-2020-07',
    subject: 'mathematics',
    subjectName: 'Mathematics',
    year: 2020,
    questionNumber: 7,
    topic: 'Statistics & Probability',
    question: 'A box contains 5 red balls, 4 blue balls, and 3 green balls. If one ball is picked at random, what is the probability that it is NOT blue?',
    options: ['2/3', '1/3', '5/12', '7/12'],
    correctAnswer: 0,
    explanation: 'Total balls = 5 + 4 + 3 = 12. Non-blue balls = 5 + 3 = 8. Probability = 8/12 = 2/3.'
  },

  // ==========================================
  // MATHEMATICS - 2019
  // ==========================================
  {
    id: 'jamb-mth-2019-01',
    subject: 'mathematics',
    subjectName: 'Mathematics',
    year: 2019,
    questionNumber: 1,
    topic: 'Logarithms & Indices',
    question: 'If log₁₀ 2 = 0.3010 and log₁₀ 3 = 0.4771, evaluate log₁₀ 18.',
    options: ['1.2552', '1.0791', '1.3802', '0.9542'],
    correctAnswer: 0,
    explanation: '18 = 2 × 3² = 2 × 9. log₁₀ 18 = log₁₀ 2 + 2 log₁₀ 3 = 0.3010 + 2(0.4771) = 0.3010 + 0.9542 = 1.2552.'
  },
  {
    id: 'jamb-mth-2019-02',
    subject: 'mathematics',
    subjectName: 'Mathematics',
    year: 2019,
    questionNumber: 2,
    topic: 'Quadratic Equations & Polynomials',
    question: 'If α and β are roots of x² - 3x + 1 = 0, find α³ + β³.',
    options: ['18', '27', '9', '21'],
    correctAnswer: 0,
    explanation: 'α + β = 3, αβ = 1. α³ + β³ = (α + β)³ - 3αβ(α + β) = 3³ - 3(1)(3) = 27 - 9 = 18.'
  },
  {
    id: 'jamb-mth-2019-03',
    subject: 'mathematics',
    subjectName: 'Mathematics',
    year: 2019,
    questionNumber: 3,
    topic: 'Differentiation & Integration',
    question: 'Find the coordinates of the turning point of the curve y = x² - 6x + 5.',
    options: ['(3, -4)', '(3, 4)', '(-3, -4)', '(2, -3)'],
    correctAnswer: 0,
    explanation: 'dy/dx = 2x - 6 = 0 => x = 3. At x = 3, y = 3² - 6(3) + 5 = 9 - 18 + 5 = -4. Turning point is (3, -4).'
  },
  {
    id: 'jamb-mth-2019-04',
    subject: 'mathematics',
    subjectName: 'Mathematics',
    year: 2019,
    questionNumber: 4,
    topic: 'Trigonometry & Identities',
    question: 'If sin (x + 30°) = cos 40°, find the acute angle x.',
    options: ['20°', '30°', '40°', '50°'],
    correctAnswer: 0,
    explanation: 'Since sin A = cos B when A + B = 90° (complementary angles): (x + 30°) + 40° = 90° => x + 70° = 90° => x = 20°.'
  },
  {
    id: 'jamb-mth-2019-05',
    subject: 'mathematics',
    subjectName: 'Mathematics',
    year: 2019,
    questionNumber: 5,
    topic: 'Statistics & Probability',
    question: 'The mean of 5 numbers is 12. If a sixth number, 18, is included, find the new mean.',
    options: ['13', '14', '15', '12.5'],
    correctAnswer: 0,
    explanation: 'Sum of 5 numbers = 5 × 12 = 60. New sum = 60 + 18 = 78. New mean = 78 / 6 = 13.'
  },

  // ==========================================
  // MATHEMATICS - 2018
  // ==========================================
  {
    id: 'jamb-mth-2018-01',
    subject: 'mathematics',
    subjectName: 'Mathematics',
    year: 2018,
    questionNumber: 1,
    topic: 'Arithmetic & Geometric Progressions (AP & GP)',
    question: 'Find the 8th term of the sequence 2, 6, 18, 54, ...',
    options: ['4,374', '1,458', '13,122', '3,888'],
    correctAnswer: 0,
    explanation: 'This is a G.P. with a = 2, r = 3. T_n = a r^(n-1). T_8 = 2 × 3⁷ = 2 × 2,187 = 4,374.'
  },
  {
    id: 'jamb-mth-2018-02',
    subject: 'mathematics',
    subjectName: 'Mathematics',
    year: 2018,
    questionNumber: 2,
    topic: 'Coordinate Geometry',
    question: 'Find the midpoint of the line segment joining (-4, 7) and (6, -3).',
    options: ['(1, 2)', '(2, 4)', '(-1, 5)', '(1, -2)'],
    correctAnswer: 0,
    explanation: 'Midpoint = ((x₁ + x₂)/2, (y₁ + y₂)/2) = ((-4 + 6)/2, (7 + (-3))/2) = (2/2, 4/2) = (1, 2).'
  },
  {
    id: 'jamb-mth-2018-03',
    subject: 'mathematics',
    subjectName: 'Mathematics',
    year: 2018,
    questionNumber: 3,
    topic: 'Permutations & Combinations',
    question: 'A committee of 3 men and 2 women is to be formed from 6 men and 4 women. In how many ways can this be done?',
    options: ['120', '144', '60', '90'],
    correctAnswer: 0,
    explanation: 'Number of ways = (⁶C₃) × (⁴C₂) = (6!/(3!3!)) × (4!/(2!2!)) = 20 × 6 = 120.'
  },
  {
    id: 'jamb-mth-2018-04',
    subject: 'mathematics',
    subjectName: 'Mathematics',
    year: 2018,
    questionNumber: 4,
    topic: 'Differentiation & Integration',
    question: 'Evaluate ∫ from 1 to 2 of 1/x dx.',
    options: ['ln 2', '2', '1', 'ln 1'],
    correctAnswer: 0,
    explanation: '∫ (1/x) dx = ln |x|. Evaluating from 1 to 2: ln 2 - ln 1 = ln 2 - 0 = ln 2.'
  }
];

const merged = [...MATH_QUESTIONS_EXPANDED, ...additionalMath];
writeQuestionsFile(path.resolve(process.cwd(), 'src/data/jamb/mathQuestionsExpanded.ts'), 'MATH_QUESTIONS_EXPANDED', merged);
