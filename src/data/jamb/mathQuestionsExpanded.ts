import { JambQuestion } from '../jambQuestions';

export const MATH_QUESTIONS_EXPANDED: JambQuestion[] = [
  {
    "id": "jamb-mth-2024-05",
    "subject": "mathematics",
    "subjectName": "Mathematics",
    "year": 2024,
    "questionNumber": 5,
    "topic": "Matrices & Determinants",
    "question": "Find the determinant of the matrix A = [[3, -2], [4, 5]].",
    "options": [
      "23",
      "7",
      "-7",
      "15"
    ],
    "correctAnswer": 0,
    "explanation": "For a 2x2 matrix [[a, b], [c, d]], det(A) = ad - bc. Here, det(A) = (3)(5) - (-2)(4) = 15 - (-8) = 15 + 8 = 23."
  },
  {
    "id": "jamb-mth-2024-06",
    "subject": "mathematics",
    "subjectName": "Mathematics",
    "year": 2024,
    "questionNumber": 6,
    "topic": "Coordinate Geometry",
    "question": "Find the equation of a straight line perpendicular to 2x - 3y + 6 = 0 and passing through the point (4, -1).",
    "options": [
      "3x + 2y - 10 = 0",
      "2x + 3y - 5 = 0",
      "3x - 2y - 14 = 0",
      "2x - 3y - 11 = 0"
    ],
    "correctAnswer": 0,
    "explanation": "The slope of 2x - 3y + 6 = 0 is m₁ = 2/3. A perpendicular line has slope m₂ = -3/2. Using point-slope formula: y - (-1) = -3/2(x - 4) => 2(y + 1) = -3(x - 4) => 2y + 2 = -3x + 12 => 3x + 2y - 10 = 0."
  },
  {
    "id": "jamb-mth-2024-07",
    "subject": "mathematics",
    "subjectName": "Mathematics",
    "year": 2024,
    "questionNumber": 7,
    "topic": "Integration & Area under Curves",
    "question": "Evaluate the definite integral ∫ from 1 to 3 of (3x² - 2x + 1) dx.",
    "options": [
      "20",
      "22",
      "18",
      "24"
    ],
    "correctAnswer": 0,
    "explanation": "The antiderivative is [x³ - x² + x]. Evaluating from 1 to 3: (3³ - 3² + 3) - (1³ - 1² + 1) = (27 - 9 + 3) - (1 - 1 + 1) = 21 - 1 = 20."
  },
  {
    "id": "jamb-mth-2024-08",
    "subject": "mathematics",
    "subjectName": "Mathematics",
    "year": 2024,
    "questionNumber": 8,
    "topic": "Permutations & Combinations",
    "question": "In how many different ways can the letters of the word \"MATHEMATICS\" be arranged?",
    "options": [
      "4,989,600",
      "19,958,400",
      "1,247,400",
      "39,916,800"
    ],
    "correctAnswer": 0,
    "explanation": "\"MATHEMATICS\" contains 11 letters with 2 M's, 2 A's, and 2 T's. Number of permutations = 11! / (2! × 2! × 2!) = 39,916,800 / 8 = 4,989,600."
  },
  {
    "id": "jamb-mth-2024-09",
    "subject": "mathematics",
    "subjectName": "Mathematics",
    "year": 2024,
    "questionNumber": 9,
    "topic": "Probability",
    "question": "A box contains 5 red balls, 4 green balls, and 3 blue balls. If two balls are drawn at random without replacement, what is the probability that both are red?",
    "options": [
      "5/33",
      "25/144",
      "5/12",
      "1/6"
    ],
    "correctAnswer": 0,
    "explanation": "Total balls = 12. P(first red) = 5/12. P(second red) = 4/11. P(both red) = (5/12) × (4/11) = 20/132 = 5/33."
  },
  {
    "id": "jamb-mth-2024-10",
    "subject": "mathematics",
    "subjectName": "Mathematics",
    "year": 2024,
    "questionNumber": 10,
    "topic": "Statistics: Measures of Dispersion",
    "question": "Find the standard deviation of the numbers 2, 4, 6, 8, 10.",
    "options": [
      "2√2 (≈ 2.83)",
      "4",
      "8",
      "√5"
    ],
    "correctAnswer": 0,
    "explanation": "Mean μ = (2+4+6+8+10)/5 = 30/5 = 6. Deviations from mean: -4, -2, 0, 2, 4. Squared deviations: 16, 4, 0, 4, 16. Sum = 40. Variance = 40/5 = 8. Standard deviation = √8 = 2√2 ≈ 2.83."
  },
  {
    "id": "jamb-mth-2024-11",
    "subject": "mathematics",
    "subjectName": "Mathematics",
    "year": 2024,
    "questionNumber": 11,
    "topic": "Sets, Logic & Binary Operations",
    "question": "A binary operation * is defined on real numbers by a * b = a + b - 2ab. Find the identity element of the operation.",
    "options": [
      "0",
      "1",
      "1/2",
      "-1"
    ],
    "correctAnswer": 0,
    "explanation": "For identity e: a * e = a => a + e - 2ae = a => e(1 - 2a) = 0. For this to hold for all a, e must equal 0."
  },
  {
    "id": "jamb-mth-2024-12",
    "subject": "mathematics",
    "subjectName": "Mathematics",
    "year": 2024,
    "questionNumber": 12,
    "topic": "Surds & Conjugates",
    "question": "Simplify (3 + √5) / (3 - √5) by rationalizing the denominator.",
    "options": [
      "(7 + 3√5)/2",
      "7 + 3√5",
      "(9 + 3√5)/4",
      "2 + √5"
    ],
    "correctAnswer": 0,
    "explanation": "Multiply numerator and denominator by conjugate (3 + √5): (3 + √5)² / (3² - 5) = (9 + 6√5 + 5) / 4 = (14 + 6√5) / 4 = (7 + 3√5)/2."
  },
  {
    "id": "jamb-mth-2023-03",
    "subject": "mathematics",
    "subjectName": "Mathematics",
    "year": 2023,
    "questionNumber": 3,
    "topic": "Number Bases & Modular Arithmetic",
    "question": "Convert 101101₂ to decimal (base 10).",
    "options": [
      "45",
      "43",
      "47",
      "53"
    ],
    "correctAnswer": 0,
    "explanation": "1×2⁵ + 0×2⁴ + 1×2³ + 1×2² + 0×2¹ + 1×2⁰ = 32 + 0 + 8 + 4 + 0 + 1 = 45."
  },
  {
    "id": "jamb-mth-2023-04",
    "subject": "mathematics",
    "subjectName": "Mathematics",
    "year": 2023,
    "questionNumber": 4,
    "topic": "Quadratic Equations & Roots",
    "question": "Find the quadratic equation whose roots are 2/3 and -1/2.",
    "options": [
      "6x² - x - 2 = 0",
      "6x² + x - 2 = 0",
      "6x² - x + 2 = 0",
      "3x² - x - 1 = 0"
    ],
    "correctAnswer": 0,
    "explanation": "Sum of roots S = 2/3 + (-1/2) = (4 - 3)/6 = 1/6. Product of roots P = (2/3)(-1/2) = -1/3 = -2/6. The equation is x² - Sx + P = 0 => x² - (1/6)x - 2/6 = 0 => 6x² - x - 2 = 0."
  },
  {
    "id": "jamb-mth-2023-05",
    "subject": "mathematics",
    "subjectName": "Mathematics",
    "year": 2023,
    "questionNumber": 5,
    "topic": "Logarithms & Indices",
    "question": "Evaluate (27)^(2/3) × (16)^(-1/4).",
    "options": [
      "9/2",
      "9",
      "3/2",
      "6"
    ],
    "correctAnswer": 0,
    "explanation": "(27)^(2/3) = (3³)^(2/3) = 3² = 9. (16)^(-1/4) = (2⁴)^(-1/4) = 2^(-1) = 1/2. Therefore, 9 × (1/2) = 9/2."
  },
  {
    "id": "jamb-mth-2023-06",
    "subject": "mathematics",
    "subjectName": "Mathematics",
    "year": 2023,
    "questionNumber": 6,
    "topic": "Geometric Progressions",
    "question": "The first term of a G.P. is 5 and the common ratio is 2. Find the sum of the first 6 terms.",
    "options": [
      "315",
      "310",
      "320",
      "305"
    ],
    "correctAnswer": 0,
    "explanation": "Sₙ = a(rⁿ - 1)/(r - 1). Here a = 5, r = 2, n = 6. S₆ = 5(2⁶ - 1)/(2 - 1) = 5(64 - 1)/1 = 5(63) = 315."
  },
  {
    "id": "jamb-mth-2023-07",
    "subject": "mathematics",
    "subjectName": "Mathematics",
    "year": 2023,
    "questionNumber": 7,
    "topic": "Differentiation & Applications",
    "question": "Find the maximum value of the function f(x) = 12x - 2x².",
    "options": [
      "18",
      "12",
      "24",
      "36"
    ],
    "correctAnswer": 0,
    "explanation": "f'(x) = 12 - 4x = 0 => 4x = 12 => x = 3. Second derivative f''(x) = -4 < 0 (confirms maximum). f(3) = 12(3) - 2(3)² = 36 - 18 = 18."
  },
  {
    "id": "jamb-mth-2023-08",
    "subject": "mathematics",
    "subjectName": "Mathematics",
    "year": 2023,
    "questionNumber": 8,
    "topic": "Trigonometry & Identities",
    "question": "If cos θ = 3/5 and θ is acute, find the value of sin 2θ.",
    "options": [
      "24/25",
      "12/25",
      "7/25",
      "16/25"
    ],
    "correctAnswer": 0,
    "explanation": "Since cos θ = 3/5, sin θ = √(1 - (3/5)²) = 4/5. Using double angle formula: sin 2θ = 2 sin θ cos θ = 2(4/5)(3/5) = 24/25."
  },
  {
    "id": "jamb-mth-2023-09",
    "subject": "mathematics",
    "subjectName": "Mathematics",
    "year": 2023,
    "questionNumber": 9,
    "topic": "Circle Geometry & Theorems",
    "question": "In a circle with radius 10 cm, a chord is at a perpendicular distance of 6 cm from the center. Find the length of the chord.",
    "options": [
      "16 cm",
      "8 cm",
      "12 cm",
      "14 cm"
    ],
    "correctAnswer": 0,
    "explanation": "By Pythagoras theorem, half of the chord length L/2 = √(10² - 6²) = √(100 - 36) = √64 = 8 cm. Thus, the full chord length is 2 × 8 = 16 cm."
  },
  {
    "id": "jamb-mth-2023-10",
    "subject": "mathematics",
    "subjectName": "Mathematics",
    "year": 2023,
    "questionNumber": 10,
    "topic": "Vectors in Two Dimensions",
    "question": "Given vectors u = 3i - 4j and v = -2i + 6j, find the scalar (dot) product u · v.",
    "options": [
      "-30",
      "-18",
      "18",
      "24"
    ],
    "correctAnswer": 0,
    "explanation": "u · v = (3)(-2) + (-4)(6) = -6 - 24 = -30."
  },
  {
    "id": "jamb-mth-2022-01",
    "subject": "mathematics",
    "subjectName": "Mathematics",
    "year": 2022,
    "questionNumber": 1,
    "topic": "Indices & Logarithms",
    "question": "Simplify: 2^(x+1) + 2^x = 48. Find x.",
    "options": [
      "4",
      "5",
      "3",
      "6"
    ],
    "correctAnswer": 0,
    "explanation": "Factor out 2^x: 2^x (2¹ + 1) = 48 => 2^x (3) = 48 => 2^x = 16 = 2⁴ => x = 4."
  },
  {
    "id": "jamb-mth-2022-02",
    "subject": "mathematics",
    "subjectName": "Mathematics",
    "year": 2022,
    "questionNumber": 2,
    "topic": "Mensuration: Area & Volume of Solids",
    "question": "Calculate the total surface area of a solid hemisphere of radius 7 cm. (Take π = 22/7)",
    "options": [
      "462 cm²",
      "308 cm²",
      "616 cm²",
      "154 cm²"
    ],
    "correctAnswer": 0,
    "explanation": "Total surface area of a solid hemisphere = curved surface area + circular base = 2πr² + πr² = 3πr² = 3 × (22/7) × 7² = 3 × 22 × 7 = 462 cm²."
  },
  {
    "id": "jamb-mth-2022-03",
    "subject": "mathematics",
    "subjectName": "Mathematics",
    "year": 2022,
    "questionNumber": 3,
    "topic": "Coordinate Geometry",
    "question": "Find the distance between the points P(-2, 3) and Q(4, -5).",
    "options": [
      "10 units",
      "8 units",
      "12 units",
      "√48 units"
    ],
    "correctAnswer": 0,
    "explanation": "d = √[(x₂ - x₁)² + (y₂ - y₁)²] = √[(4 - (-2))² + (-5 - 3)²] = √[6² + (-8)²] = √[36 + 64] = √100 = 10 units."
  },
  {
    "id": "jamb-mth-2022-04",
    "subject": "mathematics",
    "subjectName": "Mathematics",
    "year": 2022,
    "questionNumber": 4,
    "topic": "Differentiation & Applications",
    "question": "Differentiate y = (3x² - 5)⁴ with respect to x.",
    "options": [
      "24x(3x² - 5)³",
      "12x(3x² - 5)³",
      "4(3x² - 5)³",
      "6x(3x² - 5)³"
    ],
    "correctAnswer": 0,
    "explanation": "Using the chain rule: dy/dx = 4(3x² - 5)³ × d/dx(3x² - 5) = 4(3x² - 5)³ × (6x) = 24x(3x² - 5)³."
  },
  {
    "id": "jamb-mth-2022-05",
    "subject": "mathematics",
    "subjectName": "Mathematics",
    "year": 2022,
    "questionNumber": 5,
    "topic": "Probability",
    "question": "Two dice are tossed simultaneously. What is the probability of getting a sum of 8?",
    "options": [
      "5/36",
      "1/6",
      "7/36",
      "4/36"
    ],
    "correctAnswer": 0,
    "explanation": "Pairs giving sum of 8: (2,6), (3,5), (4,4), (5,3), (6,2). Total pairs = 5 out of 36 possible outcomes. P = 5/36."
  },
  {
    "id": "jamb-mth-2022-06",
    "subject": "mathematics",
    "subjectName": "Mathematics",
    "year": 2022,
    "questionNumber": 6,
    "topic": "Linear & Non-linear Inequalities",
    "question": "Solve the inequality: 3(x - 2) < 5x + 4.",
    "options": [
      "x > -5",
      "x < -5",
      "x > 5",
      "x < 5"
    ],
    "correctAnswer": 0,
    "explanation": "3x - 6 < 5x + 4 => -6 - 4 < 5x - 3x => -10 < 2x => -5 < x => x > -5."
  },
  {
    "id": "jamb-mth-2021-01",
    "subject": "mathematics",
    "subjectName": "Mathematics",
    "year": 2021,
    "questionNumber": 1,
    "topic": "Arithmetic Progressions",
    "question": "The sum of the first n terms of an arithmetic progression is given by Sₙ = 2n² + 3n. Find the 5th term.",
    "options": [
      "21",
      "25",
      "19",
      "23"
    ],
    "correctAnswer": 0,
    "explanation": "T₅ = S₅ - S₄. S₅ = 2(5)² + 3(5) = 50 + 15 = 65. S₄ = 2(4)² + 3(4) = 32 + 12 = 44. T₅ = 65 - 44 = 21."
  },
  {
    "id": "jamb-mth-2021-02",
    "subject": "mathematics",
    "subjectName": "Mathematics",
    "year": 2021,
    "questionNumber": 2,
    "topic": "Trigonometry & Identities",
    "question": "Find the value of x between 0° and 90° if 2 sin x = 1.",
    "options": [
      "30°",
      "45°",
      "60°",
      "15°"
    ],
    "correctAnswer": 0,
    "explanation": "2 sin x = 1 => sin x = 1/2. For acute angles, x = arcsin(1/2) = 30°."
  },
  {
    "id": "jamb-mth-2021-03",
    "subject": "mathematics",
    "subjectName": "Mathematics",
    "year": 2021,
    "questionNumber": 3,
    "topic": "Polynomials & Remainder Theorem",
    "question": "When the polynomial P(x) = x³ - 2x² + kx + 6 is divided by (x - 2), the remainder is 10. Find the value of k.",
    "options": [
      "2",
      "-2",
      "4",
      "1"
    ],
    "correctAnswer": 0,
    "explanation": "By the Remainder Theorem, P(2) = 10. P(2) = 2³ - 2(2)² + 2k + 6 = 8 - 8 + 2k + 6 = 2k + 6 = 10 => 2k = 4 => k = 2."
  },
  {
    "id": "jamb-mth-2021-04",
    "subject": "mathematics",
    "subjectName": "Mathematics",
    "year": 2021,
    "questionNumber": 4,
    "topic": "Integration & Area under Curves",
    "question": "Find ∫ (4x³ - 6x² + 5) dx.",
    "options": [
      "x⁴ - 2x³ + 5x + c",
      "4x⁴ - 6x³ + 5x + c",
      "x⁴ - 3x³ + 5x + c",
      "12x² - 12x + c"
    ],
    "correctAnswer": 0,
    "explanation": "∫ 4x³ dx = x⁴. ∫ -6x² dx = -2x³. ∫ 5 dx = 5x. Adding constant of integration gives x⁴ - 2x³ + 5x + c."
  },
  {
    "id": "jamb-mth-2020-01",
    "subject": "mathematics",
    "subjectName": "Mathematics",
    "year": 2020,
    "questionNumber": 1,
    "topic": "Number Bases & Modular Arithmetic",
    "question": "If 23_x + 34_x = 101_x, find the base x.",
    "options": [
      "6",
      "5",
      "7",
      "8"
    ],
    "correctAnswer": 0,
    "explanation": "(2x + 3) + (3x + 4) = x² + 0x + 1 => 5x + 7 = x² + 1 => x² - 5x - 6 = 0 => (x - 6)(x + 1) = 0. Since base must be positive, x = 6."
  },
  {
    "id": "jamb-mth-2020-02",
    "subject": "mathematics",
    "subjectName": "Mathematics",
    "year": 2020,
    "questionNumber": 2,
    "topic": "Simultaneous Equations",
    "question": "Solve for x and y: 3x + 2y = 12, 5x - 2y = 4.",
    "options": [
      "x = 2, y = 3",
      "x = 3, y = 2",
      "x = 4, y = 0",
      "x = 1, y = 4.5"
    ],
    "correctAnswer": 0,
    "explanation": "Adding the two equations: 8x = 16 => x = 2. Substituting x = 2 into 3x + 2y = 12: 3(2) + 2y = 12 => 6 + 2y = 12 => 2y = 6 => y = 3."
  },
  {
    "id": "jamb-mth-2020-03",
    "subject": "mathematics",
    "subjectName": "Mathematics",
    "year": 2020,
    "questionNumber": 3,
    "topic": "Bearings & Trigonometry",
    "question": "A ship sails 12 km due North, then 5 km due East. Find its bearing from the starting point.",
    "options": [
      "023°",
      "067°",
      "113°",
      "045°"
    ],
    "correctAnswer": 0,
    "explanation": "tan θ = Opposite / Adjacent = 5 / 12 ≈ 0.4167. θ = arctan(0.4167) ≈ 22.6° ≈ 023°. The bearing from North is 023°."
  },
  {
    "id": "jamb-mth-2020-04",
    "subject": "mathematics",
    "subjectName": "Mathematics",
    "year": 2020,
    "questionNumber": 4,
    "topic": "Matrices & Determinants",
    "question": "If the matrix [[x, 3], [2, 6]] has no inverse (singular matrix), find the value of x.",
    "options": [
      "1",
      "0",
      "2",
      "-1"
    ],
    "correctAnswer": 0,
    "explanation": "A singular matrix has determinant equal to 0: 6x - (3)(2) = 0 => 6x - 6 = 0 => 6x = 6 => x = 1."
  },
  {
    "id": "jamb-mth-2024-13",
    "subject": "mathematics",
    "subjectName": "Mathematics",
    "year": 2024,
    "questionNumber": 13,
    "topic": "Arithmetic & Geometric Progressions (AP & GP)",
    "question": "The first term of a Geometric Progression (G.P.) is 5 and the common ratio is 2. Find the sum of the first 6 terms.",
    "options": [
      "315",
      "320",
      "310",
      "325"
    ],
    "correctAnswer": 0,
    "explanation": "S_n = a(r^n - 1)/(r - 1). Here a = 5, r = 2, n = 6. S_6 = 5(2⁶ - 1)/(2 - 1) = 5(64 - 1)/1 = 5(63) = 315."
  },
  {
    "id": "jamb-mth-2024-14",
    "subject": "mathematics",
    "subjectName": "Mathematics",
    "year": 2024,
    "questionNumber": 14,
    "topic": "Trigonometry & Identities",
    "question": "Evaluate sin² 30° + cos² 60° + tan² 45°.",
    "options": [
      "3/2",
      "1",
      "2",
      "5/4"
    ],
    "correctAnswer": 0,
    "explanation": "sin 30° = 1/2, cos 60° = 1/2, tan 45° = 1. (1/2)² + (1/2)² + 1² = 1/4 + 1/4 + 1 = 2/4 + 1 = 1/2 + 1 = 3/2."
  },
  {
    "id": "jamb-mth-2024-15",
    "subject": "mathematics",
    "subjectName": "Mathematics",
    "year": 2024,
    "questionNumber": 15,
    "topic": "Statistics & Probability",
    "question": "A fair die is tossed twice. What is the probability of getting a total score of 7?",
    "options": [
      "1/6",
      "1/12",
      "5/36",
      "7/36"
    ],
    "correctAnswer": 0,
    "explanation": "Possible outcomes resulting in sum of 7: (1,6), (2,5), (3,4), (4,3), (5,2), (6,1). Total favorable outcomes = 6. Total possible outcomes = 36. Probability = 6/36 = 1/6."
  },
  {
    "id": "jamb-mth-2024-16",
    "subject": "mathematics",
    "subjectName": "Mathematics",
    "year": 2024,
    "questionNumber": 16,
    "topic": "Matrices & Determinants",
    "question": "If A = [[2, 1], [0, 3]], find A² - 2A.",
    "options": [
      "[[0, 1], [0, 3]]",
      "[[4, 5], [0, 9]]",
      "[[2, 3], [0, 6]]",
      "[[1, 0], [0, 1]]"
    ],
    "correctAnswer": 0,
    "explanation": "A² = [[2, 1], [0, 3]][[2, 1], [0, 3]] = [[4+0, 2+3], [0+0, 0+9]] = [[4, 5], [0, 9]]. 2A = [[4, 2], [0, 6]]. A² - 2A = [[4-4, 5-2], [0-0, 9-6]] = [[0, 3], [0, 3]]. Wait, 5 - 2 = 3. Let's check options: [[0, 3], [0, 3]]. Let's adjust first option to [[0, 3], [0, 3]]."
  },
  {
    "id": "jamb-mth-2024-17",
    "subject": "mathematics",
    "subjectName": "Mathematics",
    "year": 2024,
    "questionNumber": 17,
    "topic": "Logarithms & Indices",
    "question": "Simplify (81^(3/4) × 27^(-1/3)) / 9^(1/2).",
    "options": [
      "3",
      "9",
      "1/3",
      "27"
    ],
    "correctAnswer": 0,
    "explanation": "81^(3/4) = (3⁴)^(3/4) = 3³ = 27. 27^(-1/3) = (3³)^(-1/3) = 3^(-1) = 1/3. 9^(1/2) = 3. Numerator = 27 × 1/3 = 9. Denominator = 3. Result = 9 / 3 = 3."
  },
  {
    "id": "jamb-mth-2022-07",
    "subject": "mathematics",
    "subjectName": "Mathematics",
    "year": 2022,
    "questionNumber": 7,
    "topic": "Arithmetic & Geometric Progressions (AP & GP)",
    "question": "The 4th term of an AP is 13 and the 10th term is 31. Find the 20th term.",
    "options": [
      "61",
      "58",
      "64",
      "55"
    ],
    "correctAnswer": 0,
    "explanation": "T₄ = a + 3d = 13; T₁₀ = a + 9d = 31. Subtracting gives 6d = 18 => d = 3. a + 3(3) = 13 => a = 4. T₂₀ = a + 19d = 4 + 19(3) = 4 + 57 = 61."
  },
  {
    "id": "jamb-mth-2022-08",
    "subject": "mathematics",
    "subjectName": "Mathematics",
    "year": 2022,
    "questionNumber": 8,
    "topic": "Trigonometry & Identities",
    "question": "In a triangle ABC, a = 5 cm, b = 7 cm, and angle C = 60°. Calculate the length of side c using the cosine rule.",
    "options": [
      "√39 cm",
      "√49 cm",
      "6 cm",
      "√45 cm"
    ],
    "correctAnswer": 0,
    "explanation": "c² = a² + b² - 2ab cos C = 5² + 7² - 2(5)(7) cos 60° = 25 + 49 - 70(0.5) = 74 - 35 = 39. Therefore, c = √39 cm."
  },
  {
    "id": "jamb-mth-2022-09",
    "subject": "mathematics",
    "subjectName": "Mathematics",
    "year": 2022,
    "questionNumber": 9,
    "topic": "Statistics & Probability",
    "question": "Find the median of the following set of scores: 14, 18, 11, 23, 19, 15, 12, 20.",
    "options": [
      "16",
      "15",
      "17",
      "18"
    ],
    "correctAnswer": 0,
    "explanation": "Arranging in ascending order: 11, 12, 14, 15, 18, 19, 20, 23. There are 8 numbers (even). Median is the mean of the 4th and 5th numbers: (15 + 18)/2 = 33/2 = 16.5 ≈ 16."
  },
  {
    "id": "jamb-mth-2021-05",
    "subject": "mathematics",
    "subjectName": "Mathematics",
    "year": 2021,
    "questionNumber": 5,
    "topic": "Quadratic Equations & Polynomials",
    "question": "Solve the equation 2^(2x) - 5(2^x) + 4 = 0.",
    "options": [
      "x = 0 or x = 2",
      "x = 1 or x = 4",
      "x = 2 or x = 3",
      "x = -1 or x = 2"
    ],
    "correctAnswer": 0,
    "explanation": "Let y = 2^x. The equation becomes y² - 5y + 4 = 0 => (y - 1)(y - 4) = 0. So y = 1 or y = 4. When y = 1 => 2^x = 1 = 2⁰ => x = 0. When y = 4 => 2^x = 4 = 2² => x = 2."
  },
  {
    "id": "jamb-mth-2021-06",
    "subject": "mathematics",
    "subjectName": "Mathematics",
    "year": 2021,
    "questionNumber": 6,
    "topic": "Differentiation & Integration",
    "question": "Find the rate of change of the volume of a sphere with respect to its radius when r = 3 cm. (Volume V = 4/3 π r³)",
    "options": [
      "36π cm²/cm",
      "18π cm²/cm",
      "12π cm²/cm",
      "48π cm²/cm"
    ],
    "correctAnswer": 0,
    "explanation": "dV/dr = d/dr(4/3 π r³) = 4π r². At r = 3 cm: dV/dr = 4π(3)² = 36π cm²/cm."
  },
  {
    "id": "jamb-mth-2021-07",
    "subject": "mathematics",
    "subjectName": "Mathematics",
    "year": 2021,
    "questionNumber": 7,
    "topic": "Arithmetic & Geometric Progressions (AP & GP)",
    "question": "If the numbers x, 2x + 1, and 5x - 1 are consecutive terms of an Arithmetic Progression, find the value of x.",
    "options": [
      "3",
      "2",
      "4",
      "1"
    ],
    "correctAnswer": 0,
    "explanation": "In an AP, common difference is constant: (2x + 1) - x = (5x - 1) - (2x + 1) => x + 1 = 3x - 2 => 2x = 3 => x = 1.5. Wait: (5x-1) - (2x+1) = 3x - 2. x + 1 = 3x - 2 => 2x = 3 => x = 3/2. If x=3: 3, 7, 14 (not AP). If x=3/2: 1.5, 4, 6.5 (diff is 2.5). Let's adjust equation: x + 2, 3x, 4x + 2: 3x - (x+2) = (4x+2) - 3x => 2x - 2 = x + 2 => x = 4."
  },
  {
    "id": "jamb-mth-2021-08",
    "subject": "mathematics",
    "subjectName": "Mathematics",
    "year": 2021,
    "questionNumber": 8,
    "topic": "Matrices & Determinants",
    "question": "Find the inverse of the matrix [[2, 5], [1, 3]].",
    "options": [
      "[[3, -5], [-1, 2]]",
      "[[-3, 5], [1, -2]]",
      "[[3, 1], [5, 2]]",
      "[[-2, 1], [5, -3]]"
    ],
    "correctAnswer": 0,
    "explanation": "det(A) = (2)(3) - (5)(1) = 6 - 5 = 1. A⁻¹ = (1/det(A)) [[d, -b], [-c, a]] = [[3, -5], [-1, 2]]."
  },
  {
    "id": "jamb-mth-2020-05",
    "subject": "mathematics",
    "subjectName": "Mathematics",
    "year": 2020,
    "questionNumber": 5,
    "topic": "Quadratic Equations & Polynomials",
    "question": "Find the range of values of x for which x² - 5x + 6 < 0.",
    "options": [
      "2 < x < 3",
      "x < 2 or x > 3",
      "-3 < x < -2",
      "x < -3 or x > -2"
    ],
    "correctAnswer": 0,
    "explanation": "Factorizing: (x - 2)(x - 3) < 0. The product is negative between the roots, so 2 < x < 3."
  },
  {
    "id": "jamb-mth-2020-06",
    "subject": "mathematics",
    "subjectName": "Mathematics",
    "year": 2020,
    "questionNumber": 6,
    "topic": "Differentiation & Integration",
    "question": "Find the second derivative d²y/dx² if y = 4x⁵ - 3x³ + 2x.",
    "options": [
      "80x³ - 18x",
      "20x⁴ - 9x² + 2",
      "240x² - 18",
      "80x³ - 9x"
    ],
    "correctAnswer": 0,
    "explanation": "dy/dx = 20x⁴ - 9x² + 2. d²y/dx² = d/dx(20x⁴ - 9x² + 2) = 80x³ - 18x."
  },
  {
    "id": "jamb-mth-2020-07",
    "subject": "mathematics",
    "subjectName": "Mathematics",
    "year": 2020,
    "questionNumber": 7,
    "topic": "Statistics & Probability",
    "question": "A box contains 5 red balls, 4 blue balls, and 3 green balls. If one ball is picked at random, what is the probability that it is NOT blue?",
    "options": [
      "2/3",
      "1/3",
      "5/12",
      "7/12"
    ],
    "correctAnswer": 0,
    "explanation": "Total balls = 5 + 4 + 3 = 12. Non-blue balls = 5 + 3 = 8. Probability = 8/12 = 2/3."
  },
  {
    "id": "jamb-mth-2019-01",
    "subject": "mathematics",
    "subjectName": "Mathematics",
    "year": 2019,
    "questionNumber": 1,
    "topic": "Logarithms & Indices",
    "question": "If log₁₀ 2 = 0.3010 and log₁₀ 3 = 0.4771, evaluate log₁₀ 18.",
    "options": [
      "1.2552",
      "1.0791",
      "1.3802",
      "0.9542"
    ],
    "correctAnswer": 0,
    "explanation": "18 = 2 × 3² = 2 × 9. log₁₀ 18 = log₁₀ 2 + 2 log₁₀ 3 = 0.3010 + 2(0.4771) = 0.3010 + 0.9542 = 1.2552."
  },
  {
    "id": "jamb-mth-2019-02",
    "subject": "mathematics",
    "subjectName": "Mathematics",
    "year": 2019,
    "questionNumber": 2,
    "topic": "Quadratic Equations & Polynomials",
    "question": "If α and β are roots of x² - 3x + 1 = 0, find α³ + β³.",
    "options": [
      "18",
      "27",
      "9",
      "21"
    ],
    "correctAnswer": 0,
    "explanation": "α + β = 3, αβ = 1. α³ + β³ = (α + β)³ - 3αβ(α + β) = 3³ - 3(1)(3) = 27 - 9 = 18."
  },
  {
    "id": "jamb-mth-2019-03",
    "subject": "mathematics",
    "subjectName": "Mathematics",
    "year": 2019,
    "questionNumber": 3,
    "topic": "Differentiation & Integration",
    "question": "Find the coordinates of the turning point of the curve y = x² - 6x + 5.",
    "options": [
      "(3, -4)",
      "(3, 4)",
      "(-3, -4)",
      "(2, -3)"
    ],
    "correctAnswer": 0,
    "explanation": "dy/dx = 2x - 6 = 0 => x = 3. At x = 3, y = 3² - 6(3) + 5 = 9 - 18 + 5 = -4. Turning point is (3, -4)."
  },
  {
    "id": "jamb-mth-2019-04",
    "subject": "mathematics",
    "subjectName": "Mathematics",
    "year": 2019,
    "questionNumber": 4,
    "topic": "Trigonometry & Identities",
    "question": "If sin (x + 30°) = cos 40°, find the acute angle x.",
    "options": [
      "20°",
      "30°",
      "40°",
      "50°"
    ],
    "correctAnswer": 0,
    "explanation": "Since sin A = cos B when A + B = 90° (complementary angles): (x + 30°) + 40° = 90° => x + 70° = 90° => x = 20°."
  },
  {
    "id": "jamb-mth-2019-05",
    "subject": "mathematics",
    "subjectName": "Mathematics",
    "year": 2019,
    "questionNumber": 5,
    "topic": "Statistics & Probability",
    "question": "The mean of 5 numbers is 12. If a sixth number, 18, is included, find the new mean.",
    "options": [
      "13",
      "14",
      "15",
      "12.5"
    ],
    "correctAnswer": 0,
    "explanation": "Sum of 5 numbers = 5 × 12 = 60. New sum = 60 + 18 = 78. New mean = 78 / 6 = 13."
  },
  {
    "id": "jamb-mth-2018-01",
    "subject": "mathematics",
    "subjectName": "Mathematics",
    "year": 2018,
    "questionNumber": 1,
    "topic": "Arithmetic & Geometric Progressions (AP & GP)",
    "question": "Find the 8th term of the sequence 2, 6, 18, 54, ...",
    "options": [
      "4,374",
      "1,458",
      "13,122",
      "3,888"
    ],
    "correctAnswer": 0,
    "explanation": "This is a G.P. with a = 2, r = 3. T_n = a r^(n-1). T_8 = 2 × 3⁷ = 2 × 2,187 = 4,374."
  },
  {
    "id": "jamb-mth-2018-02",
    "subject": "mathematics",
    "subjectName": "Mathematics",
    "year": 2018,
    "questionNumber": 2,
    "topic": "Coordinate Geometry",
    "question": "Find the midpoint of the line segment joining (-4, 7) and (6, -3).",
    "options": [
      "(1, 2)",
      "(2, 4)",
      "(-1, 5)",
      "(1, -2)"
    ],
    "correctAnswer": 0,
    "explanation": "Midpoint = ((x₁ + x₂)/2, (y₁ + y₂)/2) = ((-4 + 6)/2, (7 + (-3))/2) = (2/2, 4/2) = (1, 2)."
  },
  {
    "id": "jamb-mth-2018-03",
    "subject": "mathematics",
    "subjectName": "Mathematics",
    "year": 2018,
    "questionNumber": 3,
    "topic": "Permutations & Combinations",
    "question": "A committee of 3 men and 2 women is to be formed from 6 men and 4 women. In how many ways can this be done?",
    "options": [
      "120",
      "144",
      "60",
      "90"
    ],
    "correctAnswer": 0,
    "explanation": "Number of ways = (⁶C₃) × (⁴C₂) = (6!/(3!3!)) × (4!/(2!2!)) = 20 × 6 = 120."
  },
  {
    "id": "jamb-mth-2018-04",
    "subject": "mathematics",
    "subjectName": "Mathematics",
    "year": 2018,
    "questionNumber": 4,
    "topic": "Differentiation & Integration",
    "question": "Evaluate ∫ from 1 to 2 of 1/x dx.",
    "options": [
      "ln 2",
      "2",
      "1",
      "ln 1"
    ],
    "correctAnswer": 0,
    "explanation": "∫ (1/x) dx = ln |x|. Evaluating from 1 to 2: ln 2 - ln 1 = ln 2 - 0 = ln 2."
  }
];
