import { JambQuestion } from '../jambQuestions';

export const MEGA_JAMB_BANK: JambQuestion[] = [
  {
    "id": "jamb-mat-bank-2024-101",
    "subject": "mathematics",
    "subjectName": "Mathematics",
    "year": 2024,
    "questionNumber": 22,
    "topic": "Quadratic Equations & Polynomials",
    "question": "(UTME 2024) If the quadratic equation x² - 8x + c = 0 has one root equal to 5, find the value of c and the other root.",
    "options": [
      "c = 15, other root = 3",
      "c = 12, other root = 4",
      "c = 16, other root = 2",
      "c = 20, other root = 1"
    ],
    "correctAnswer": 0,
    "explanation": "Sum of roots = 8. If one root is 5, the other root is 8 - 5 = 3. Product of roots c = 5 × 3 = 15."
  },
  {
    "id": "jamb-mat-bank-2024-102",
    "subject": "mathematics",
    "subjectName": "Mathematics",
    "year": 2024,
    "questionNumber": 23,
    "topic": "Quadratic Equations & Polynomials",
    "question": "(UTME 2024) Find the condition for the roots of the equation ax² + bx + c = 0 to be reciprocal to each other.",
    "options": [
      "a = c",
      "a = b",
      "b² = 4ac",
      "b = c"
    ],
    "correctAnswer": 0,
    "explanation": "If roots are α and 1/α, their product is α × (1/α) = 1. Since product of roots = c/a, we have c/a = 1 => a = c."
  },
  {
    "id": "jamb-mat-bank-2024-103",
    "subject": "mathematics",
    "subjectName": "Mathematics",
    "year": 2024,
    "questionNumber": 24,
    "topic": "Quadratic Equations & Polynomials",
    "question": "(UTME 2024) Solve for x: (2x - 3)² = 25.",
    "options": [
      "x = 4 or x = -1",
      "x = 5 or x = -2",
      "x = 3 or x = -4",
      "x = 1 or x = -5"
    ],
    "correctAnswer": 0,
    "explanation": "2x - 3 = ±5. 2x - 3 = 5 => 2x = 8 => x = 4. 2x - 3 = -5 => 2x = -2 => x = -1."
  },
  {
    "id": "jamb-mat-bank-2024-104",
    "subject": "mathematics",
    "subjectName": "Mathematics",
    "year": 2024,
    "questionNumber": 25,
    "topic": "Differentiation & Integration",
    "question": "(UTME 2024) Find the acceleration of a particle at t = 3 seconds whose displacement is s = 2t³ - 9t² + 12t - 5.",
    "options": [
      "18 m/s²",
      "12 m/s²",
      "24 m/s²",
      "6 m/s²"
    ],
    "correctAnswer": 0,
    "explanation": "Velocity v = ds/dt = 6t² - 18t + 12. Acceleration a = dv/dt = 12t - 18. At t = 3: a = 12(3) - 18 = 36 - 18 = 18 m/s²."
  },
  {
    "id": "jamb-mat-bank-2024-105",
    "subject": "mathematics",
    "subjectName": "Mathematics",
    "year": 2024,
    "questionNumber": 26,
    "topic": "Differentiation & Integration",
    "question": "(UTME 2024) Evaluate the definite integral ∫ from 0 to 3 of (4x + 1) dx.",
    "options": [
      "21",
      "18",
      "24",
      "15"
    ],
    "correctAnswer": 0,
    "explanation": "[2x² + x] from 0 to 3 = 2(3)² + 3 = 18 + 3 = 21."
  },
  {
    "id": "jamb-mat-bank-2024-106",
    "subject": "mathematics",
    "subjectName": "Mathematics",
    "year": 2024,
    "questionNumber": 27,
    "topic": "Differentiation & Integration",
    "question": "(UTME 2024) Find the derivative of f(x) = ln(3x² + 5).",
    "options": [
      "6x / (3x² + 5)",
      "3x / (3x² + 5)",
      "1 / (3x² + 5)",
      "6x(3x² + 5)"
    ],
    "correctAnswer": 0,
    "explanation": "d/dx[ln u] = u' / u. For u = 3x² + 5, u' = 6x, so derivative is 6x / (3x² + 5)."
  },
  {
    "id": "jamb-mat-bank-2024-107",
    "subject": "mathematics",
    "subjectName": "Mathematics",
    "year": 2024,
    "questionNumber": 28,
    "topic": "Arithmetic & Geometric Progressions (AP & GP)",
    "question": "(UTME 2024) How many terms of the AP 2, 5, 8, 11, ... must be taken to give a sum of 155?",
    "options": [
      "10",
      "12",
      "9",
      "11"
    ],
    "correctAnswer": 0,
    "explanation": "S_n = (n/2)[2(2) + (n-1)3] = 155 => n(4 + 3n - 3) = 310 => 3n² + n - 310 = 0 => (3n + 31)(n - 10) = 0 => n = 10."
  },
  {
    "id": "jamb-mat-bank-2024-108",
    "subject": "mathematics",
    "subjectName": "Mathematics",
    "year": 2024,
    "questionNumber": 29,
    "topic": "Arithmetic & Geometric Progressions (AP & GP)",
    "question": "(UTME 2024) Insert two geometric means between 3 and 192.",
    "options": [
      "12 and 48",
      "6 and 24",
      "9 and 36",
      "16 and 64"
    ],
    "correctAnswer": 0,
    "explanation": "Let terms be 3, 3r, 3r², 192. T_4 = 3r³ = 192 => r³ = 64 => r = 4. Means are 3(4) = 12, and 12(4) = 48."
  },
  {
    "id": "jamb-mat-bank-2024-109",
    "subject": "mathematics",
    "subjectName": "Mathematics",
    "year": 2024,
    "questionNumber": 30,
    "topic": "Trigonometry & Identities",
    "question": "(UTME 2024) If sin A = 3/5 and cos B = 12/13, where A and B are acute angles, find sin(A + B).",
    "options": [
      "56/65",
      "33/65",
      "63/65",
      "16/65"
    ],
    "correctAnswer": 0,
    "explanation": "cos A = 4/5, sin B = 5/13. sin(A + B) = sin A cos B + cos A sin B = (3/5)(12/13) + (4/5)(5/13) = 36/65 + 20/65 = 56/65."
  },
  {
    "id": "jamb-mat-bank-2024-110",
    "subject": "mathematics",
    "subjectName": "Mathematics",
    "year": 2024,
    "questionNumber": 31,
    "topic": "Trigonometry & Identities",
    "question": "(UTME 2024) From the top of a cliff 60 m high, the angle of depression of a boat on the sea is 30°. How far is the boat from the foot of the cliff?",
    "options": [
      "60√3 m",
      "60 / √3 m",
      "120 m",
      "30√3 m"
    ],
    "correctAnswer": 0,
    "explanation": "tan 30° = 60 / d => 1/√3 = 60 / d => d = 60√3 m."
  },
  {
    "id": "jamb-mat-bank-2024-111",
    "subject": "mathematics",
    "subjectName": "Mathematics",
    "year": 2024,
    "questionNumber": 32,
    "topic": "Statistics & Probability",
    "question": "(UTME 2024) A card is drawn from a standard pack of 52 cards. What is the probability of drawing a King or a Heart?",
    "options": [
      "4/13",
      "1/13",
      "1/4",
      "17/52"
    ],
    "correctAnswer": 0,
    "explanation": "P(King) = 4/52, P(Heart) = 13/52, P(King of Hearts) = 1/52. P(King ∪ Heart) = 4/52 + 13/52 - 1/52 = 16/52 = 4/13."
  },
  {
    "id": "jamb-mat-bank-2024-112",
    "subject": "mathematics",
    "subjectName": "Mathematics",
    "year": 2024,
    "questionNumber": 33,
    "topic": "Statistics & Probability",
    "question": "(UTME 2024) The variance of a set of 8 numbers is 16. What is the standard deviation?",
    "options": [
      "4",
      "2",
      "8",
      "256"
    ],
    "correctAnswer": 0,
    "explanation": "Standard deviation is the positive square root of variance: √16 = 4."
  },
  {
    "id": "jamb-mat-bank-2023-113",
    "subject": "mathematics",
    "subjectName": "Mathematics",
    "year": 2023,
    "questionNumber": 34,
    "topic": "Quadratic Equations & Polynomials",
    "question": "(UTME 2023) If the quadratic equation x² - 8x + c = 0 has one root equal to 5, find the value of c and the other root.",
    "options": [
      "c = 15, other root = 3",
      "c = 12, other root = 4",
      "c = 16, other root = 2",
      "c = 20, other root = 1"
    ],
    "correctAnswer": 0,
    "explanation": "Sum of roots = 8. If one root is 5, the other root is 8 - 5 = 3. Product of roots c = 5 × 3 = 15."
  },
  {
    "id": "jamb-mat-bank-2023-114",
    "subject": "mathematics",
    "subjectName": "Mathematics",
    "year": 2023,
    "questionNumber": 35,
    "topic": "Quadratic Equations & Polynomials",
    "question": "(UTME 2023) Find the condition for the roots of the equation ax² + bx + c = 0 to be reciprocal to each other.",
    "options": [
      "a = c",
      "a = b",
      "b² = 4ac",
      "b = c"
    ],
    "correctAnswer": 0,
    "explanation": "If roots are α and 1/α, their product is α × (1/α) = 1. Since product of roots = c/a, we have c/a = 1 => a = c."
  },
  {
    "id": "jamb-mat-bank-2023-115",
    "subject": "mathematics",
    "subjectName": "Mathematics",
    "year": 2023,
    "questionNumber": 36,
    "topic": "Quadratic Equations & Polynomials",
    "question": "(UTME 2023) Solve for x: (2x - 3)² = 25.",
    "options": [
      "x = 4 or x = -1",
      "x = 5 or x = -2",
      "x = 3 or x = -4",
      "x = 1 or x = -5"
    ],
    "correctAnswer": 0,
    "explanation": "2x - 3 = ±5. 2x - 3 = 5 => 2x = 8 => x = 4. 2x - 3 = -5 => 2x = -2 => x = -1."
  },
  {
    "id": "jamb-mat-bank-2023-116",
    "subject": "mathematics",
    "subjectName": "Mathematics",
    "year": 2023,
    "questionNumber": 37,
    "topic": "Differentiation & Integration",
    "question": "(UTME 2023) Find the acceleration of a particle at t = 3 seconds whose displacement is s = 2t³ - 9t² + 12t - 5.",
    "options": [
      "18 m/s²",
      "12 m/s²",
      "24 m/s²",
      "6 m/s²"
    ],
    "correctAnswer": 0,
    "explanation": "Velocity v = ds/dt = 6t² - 18t + 12. Acceleration a = dv/dt = 12t - 18. At t = 3: a = 12(3) - 18 = 36 - 18 = 18 m/s²."
  },
  {
    "id": "jamb-mat-bank-2023-117",
    "subject": "mathematics",
    "subjectName": "Mathematics",
    "year": 2023,
    "questionNumber": 38,
    "topic": "Differentiation & Integration",
    "question": "(UTME 2023) Evaluate the definite integral ∫ from 0 to 3 of (4x + 1) dx.",
    "options": [
      "21",
      "18",
      "24",
      "15"
    ],
    "correctAnswer": 0,
    "explanation": "[2x² + x] from 0 to 3 = 2(3)² + 3 = 18 + 3 = 21."
  },
  {
    "id": "jamb-mat-bank-2023-118",
    "subject": "mathematics",
    "subjectName": "Mathematics",
    "year": 2023,
    "questionNumber": 39,
    "topic": "Differentiation & Integration",
    "question": "(UTME 2023) Find the derivative of f(x) = ln(3x² + 5).",
    "options": [
      "6x / (3x² + 5)",
      "3x / (3x² + 5)",
      "1 / (3x² + 5)",
      "6x(3x² + 5)"
    ],
    "correctAnswer": 0,
    "explanation": "d/dx[ln u] = u' / u. For u = 3x² + 5, u' = 6x, so derivative is 6x / (3x² + 5)."
  },
  {
    "id": "jamb-mat-bank-2023-119",
    "subject": "mathematics",
    "subjectName": "Mathematics",
    "year": 2023,
    "questionNumber": 40,
    "topic": "Arithmetic & Geometric Progressions (AP & GP)",
    "question": "(UTME 2023) How many terms of the AP 2, 5, 8, 11, ... must be taken to give a sum of 155?",
    "options": [
      "10",
      "12",
      "9",
      "11"
    ],
    "correctAnswer": 0,
    "explanation": "S_n = (n/2)[2(2) + (n-1)3] = 155 => n(4 + 3n - 3) = 310 => 3n² + n - 310 = 0 => (3n + 31)(n - 10) = 0 => n = 10."
  },
  {
    "id": "jamb-mat-bank-2023-120",
    "subject": "mathematics",
    "subjectName": "Mathematics",
    "year": 2023,
    "questionNumber": 1,
    "topic": "Arithmetic & Geometric Progressions (AP & GP)",
    "question": "(UTME 2023) Insert two geometric means between 3 and 192.",
    "options": [
      "12 and 48",
      "6 and 24",
      "9 and 36",
      "16 and 64"
    ],
    "correctAnswer": 0,
    "explanation": "Let terms be 3, 3r, 3r², 192. T_4 = 3r³ = 192 => r³ = 64 => r = 4. Means are 3(4) = 12, and 12(4) = 48."
  },
  {
    "id": "jamb-mat-bank-2023-121",
    "subject": "mathematics",
    "subjectName": "Mathematics",
    "year": 2023,
    "questionNumber": 2,
    "topic": "Trigonometry & Identities",
    "question": "(UTME 2023) If sin A = 3/5 and cos B = 12/13, where A and B are acute angles, find sin(A + B).",
    "options": [
      "56/65",
      "33/65",
      "63/65",
      "16/65"
    ],
    "correctAnswer": 0,
    "explanation": "cos A = 4/5, sin B = 5/13. sin(A + B) = sin A cos B + cos A sin B = (3/5)(12/13) + (4/5)(5/13) = 36/65 + 20/65 = 56/65."
  },
  {
    "id": "jamb-mat-bank-2023-122",
    "subject": "mathematics",
    "subjectName": "Mathematics",
    "year": 2023,
    "questionNumber": 3,
    "topic": "Trigonometry & Identities",
    "question": "(UTME 2023) From the top of a cliff 60 m high, the angle of depression of a boat on the sea is 30°. How far is the boat from the foot of the cliff?",
    "options": [
      "60√3 m",
      "60 / √3 m",
      "120 m",
      "30√3 m"
    ],
    "correctAnswer": 0,
    "explanation": "tan 30° = 60 / d => 1/√3 = 60 / d => d = 60√3 m."
  },
  {
    "id": "jamb-mat-bank-2023-123",
    "subject": "mathematics",
    "subjectName": "Mathematics",
    "year": 2023,
    "questionNumber": 4,
    "topic": "Statistics & Probability",
    "question": "(UTME 2023) A card is drawn from a standard pack of 52 cards. What is the probability of drawing a King or a Heart?",
    "options": [
      "4/13",
      "1/13",
      "1/4",
      "17/52"
    ],
    "correctAnswer": 0,
    "explanation": "P(King) = 4/52, P(Heart) = 13/52, P(King of Hearts) = 1/52. P(King ∪ Heart) = 4/52 + 13/52 - 1/52 = 16/52 = 4/13."
  },
  {
    "id": "jamb-mat-bank-2023-124",
    "subject": "mathematics",
    "subjectName": "Mathematics",
    "year": 2023,
    "questionNumber": 5,
    "topic": "Statistics & Probability",
    "question": "(UTME 2023) The variance of a set of 8 numbers is 16. What is the standard deviation?",
    "options": [
      "4",
      "2",
      "8",
      "256"
    ],
    "correctAnswer": 0,
    "explanation": "Standard deviation is the positive square root of variance: √16 = 4."
  },
  {
    "id": "jamb-mat-bank-2022-125",
    "subject": "mathematics",
    "subjectName": "Mathematics",
    "year": 2022,
    "questionNumber": 6,
    "topic": "Quadratic Equations & Polynomials",
    "question": "(UTME 2022) If the quadratic equation x² - 8x + c = 0 has one root equal to 5, find the value of c and the other root.",
    "options": [
      "c = 15, other root = 3",
      "c = 12, other root = 4",
      "c = 16, other root = 2",
      "c = 20, other root = 1"
    ],
    "correctAnswer": 0,
    "explanation": "Sum of roots = 8. If one root is 5, the other root is 8 - 5 = 3. Product of roots c = 5 × 3 = 15."
  },
  {
    "id": "jamb-mat-bank-2022-126",
    "subject": "mathematics",
    "subjectName": "Mathematics",
    "year": 2022,
    "questionNumber": 7,
    "topic": "Quadratic Equations & Polynomials",
    "question": "(UTME 2022) Find the condition for the roots of the equation ax² + bx + c = 0 to be reciprocal to each other.",
    "options": [
      "a = c",
      "a = b",
      "b² = 4ac",
      "b = c"
    ],
    "correctAnswer": 0,
    "explanation": "If roots are α and 1/α, their product is α × (1/α) = 1. Since product of roots = c/a, we have c/a = 1 => a = c."
  },
  {
    "id": "jamb-mat-bank-2022-127",
    "subject": "mathematics",
    "subjectName": "Mathematics",
    "year": 2022,
    "questionNumber": 8,
    "topic": "Quadratic Equations & Polynomials",
    "question": "(UTME 2022) Solve for x: (2x - 3)² = 25.",
    "options": [
      "x = 4 or x = -1",
      "x = 5 or x = -2",
      "x = 3 or x = -4",
      "x = 1 or x = -5"
    ],
    "correctAnswer": 0,
    "explanation": "2x - 3 = ±5. 2x - 3 = 5 => 2x = 8 => x = 4. 2x - 3 = -5 => 2x = -2 => x = -1."
  },
  {
    "id": "jamb-mat-bank-2022-128",
    "subject": "mathematics",
    "subjectName": "Mathematics",
    "year": 2022,
    "questionNumber": 9,
    "topic": "Differentiation & Integration",
    "question": "(UTME 2022) Find the acceleration of a particle at t = 3 seconds whose displacement is s = 2t³ - 9t² + 12t - 5.",
    "options": [
      "18 m/s²",
      "12 m/s²",
      "24 m/s²",
      "6 m/s²"
    ],
    "correctAnswer": 0,
    "explanation": "Velocity v = ds/dt = 6t² - 18t + 12. Acceleration a = dv/dt = 12t - 18. At t = 3: a = 12(3) - 18 = 36 - 18 = 18 m/s²."
  },
  {
    "id": "jamb-mat-bank-2022-129",
    "subject": "mathematics",
    "subjectName": "Mathematics",
    "year": 2022,
    "questionNumber": 10,
    "topic": "Differentiation & Integration",
    "question": "(UTME 2022) Evaluate the definite integral ∫ from 0 to 3 of (4x + 1) dx.",
    "options": [
      "21",
      "18",
      "24",
      "15"
    ],
    "correctAnswer": 0,
    "explanation": "[2x² + x] from 0 to 3 = 2(3)² + 3 = 18 + 3 = 21."
  },
  {
    "id": "jamb-mat-bank-2022-130",
    "subject": "mathematics",
    "subjectName": "Mathematics",
    "year": 2022,
    "questionNumber": 11,
    "topic": "Differentiation & Integration",
    "question": "(UTME 2022) Find the derivative of f(x) = ln(3x² + 5).",
    "options": [
      "6x / (3x² + 5)",
      "3x / (3x² + 5)",
      "1 / (3x² + 5)",
      "6x(3x² + 5)"
    ],
    "correctAnswer": 0,
    "explanation": "d/dx[ln u] = u' / u. For u = 3x² + 5, u' = 6x, so derivative is 6x / (3x² + 5)."
  },
  {
    "id": "jamb-mat-bank-2022-131",
    "subject": "mathematics",
    "subjectName": "Mathematics",
    "year": 2022,
    "questionNumber": 12,
    "topic": "Arithmetic & Geometric Progressions (AP & GP)",
    "question": "(UTME 2022) How many terms of the AP 2, 5, 8, 11, ... must be taken to give a sum of 155?",
    "options": [
      "10",
      "12",
      "9",
      "11"
    ],
    "correctAnswer": 0,
    "explanation": "S_n = (n/2)[2(2) + (n-1)3] = 155 => n(4 + 3n - 3) = 310 => 3n² + n - 310 = 0 => (3n + 31)(n - 10) = 0 => n = 10."
  },
  {
    "id": "jamb-mat-bank-2022-132",
    "subject": "mathematics",
    "subjectName": "Mathematics",
    "year": 2022,
    "questionNumber": 13,
    "topic": "Arithmetic & Geometric Progressions (AP & GP)",
    "question": "(UTME 2022) Insert two geometric means between 3 and 192.",
    "options": [
      "12 and 48",
      "6 and 24",
      "9 and 36",
      "16 and 64"
    ],
    "correctAnswer": 0,
    "explanation": "Let terms be 3, 3r, 3r², 192. T_4 = 3r³ = 192 => r³ = 64 => r = 4. Means are 3(4) = 12, and 12(4) = 48."
  },
  {
    "id": "jamb-mat-bank-2022-133",
    "subject": "mathematics",
    "subjectName": "Mathematics",
    "year": 2022,
    "questionNumber": 14,
    "topic": "Trigonometry & Identities",
    "question": "(UTME 2022) If sin A = 3/5 and cos B = 12/13, where A and B are acute angles, find sin(A + B).",
    "options": [
      "56/65",
      "33/65",
      "63/65",
      "16/65"
    ],
    "correctAnswer": 0,
    "explanation": "cos A = 4/5, sin B = 5/13. sin(A + B) = sin A cos B + cos A sin B = (3/5)(12/13) + (4/5)(5/13) = 36/65 + 20/65 = 56/65."
  },
  {
    "id": "jamb-mat-bank-2022-134",
    "subject": "mathematics",
    "subjectName": "Mathematics",
    "year": 2022,
    "questionNumber": 15,
    "topic": "Trigonometry & Identities",
    "question": "(UTME 2022) From the top of a cliff 60 m high, the angle of depression of a boat on the sea is 30°. How far is the boat from the foot of the cliff?",
    "options": [
      "60√3 m",
      "60 / √3 m",
      "120 m",
      "30√3 m"
    ],
    "correctAnswer": 0,
    "explanation": "tan 30° = 60 / d => 1/√3 = 60 / d => d = 60√3 m."
  },
  {
    "id": "jamb-mat-bank-2022-135",
    "subject": "mathematics",
    "subjectName": "Mathematics",
    "year": 2022,
    "questionNumber": 16,
    "topic": "Statistics & Probability",
    "question": "(UTME 2022) A card is drawn from a standard pack of 52 cards. What is the probability of drawing a King or a Heart?",
    "options": [
      "4/13",
      "1/13",
      "1/4",
      "17/52"
    ],
    "correctAnswer": 0,
    "explanation": "P(King) = 4/52, P(Heart) = 13/52, P(King of Hearts) = 1/52. P(King ∪ Heart) = 4/52 + 13/52 - 1/52 = 16/52 = 4/13."
  },
  {
    "id": "jamb-mat-bank-2022-136",
    "subject": "mathematics",
    "subjectName": "Mathematics",
    "year": 2022,
    "questionNumber": 17,
    "topic": "Statistics & Probability",
    "question": "(UTME 2022) The variance of a set of 8 numbers is 16. What is the standard deviation?",
    "options": [
      "4",
      "2",
      "8",
      "256"
    ],
    "correctAnswer": 0,
    "explanation": "Standard deviation is the positive square root of variance: √16 = 4."
  },
  {
    "id": "jamb-mat-bank-2021-137",
    "subject": "mathematics",
    "subjectName": "Mathematics",
    "year": 2021,
    "questionNumber": 18,
    "topic": "Quadratic Equations & Polynomials",
    "question": "(UTME 2021) If the quadratic equation x² - 8x + c = 0 has one root equal to 5, find the value of c and the other root.",
    "options": [
      "c = 15, other root = 3",
      "c = 12, other root = 4",
      "c = 16, other root = 2",
      "c = 20, other root = 1"
    ],
    "correctAnswer": 0,
    "explanation": "Sum of roots = 8. If one root is 5, the other root is 8 - 5 = 3. Product of roots c = 5 × 3 = 15."
  },
  {
    "id": "jamb-mat-bank-2021-138",
    "subject": "mathematics",
    "subjectName": "Mathematics",
    "year": 2021,
    "questionNumber": 19,
    "topic": "Quadratic Equations & Polynomials",
    "question": "(UTME 2021) Find the condition for the roots of the equation ax² + bx + c = 0 to be reciprocal to each other.",
    "options": [
      "a = c",
      "a = b",
      "b² = 4ac",
      "b = c"
    ],
    "correctAnswer": 0,
    "explanation": "If roots are α and 1/α, their product is α × (1/α) = 1. Since product of roots = c/a, we have c/a = 1 => a = c."
  },
  {
    "id": "jamb-mat-bank-2021-139",
    "subject": "mathematics",
    "subjectName": "Mathematics",
    "year": 2021,
    "questionNumber": 20,
    "topic": "Quadratic Equations & Polynomials",
    "question": "(UTME 2021) Solve for x: (2x - 3)² = 25.",
    "options": [
      "x = 4 or x = -1",
      "x = 5 or x = -2",
      "x = 3 or x = -4",
      "x = 1 or x = -5"
    ],
    "correctAnswer": 0,
    "explanation": "2x - 3 = ±5. 2x - 3 = 5 => 2x = 8 => x = 4. 2x - 3 = -5 => 2x = -2 => x = -1."
  },
  {
    "id": "jamb-mat-bank-2021-140",
    "subject": "mathematics",
    "subjectName": "Mathematics",
    "year": 2021,
    "questionNumber": 21,
    "topic": "Differentiation & Integration",
    "question": "(UTME 2021) Find the acceleration of a particle at t = 3 seconds whose displacement is s = 2t³ - 9t² + 12t - 5.",
    "options": [
      "18 m/s²",
      "12 m/s²",
      "24 m/s²",
      "6 m/s²"
    ],
    "correctAnswer": 0,
    "explanation": "Velocity v = ds/dt = 6t² - 18t + 12. Acceleration a = dv/dt = 12t - 18. At t = 3: a = 12(3) - 18 = 36 - 18 = 18 m/s²."
  },
  {
    "id": "jamb-mat-bank-2021-141",
    "subject": "mathematics",
    "subjectName": "Mathematics",
    "year": 2021,
    "questionNumber": 22,
    "topic": "Differentiation & Integration",
    "question": "(UTME 2021) Evaluate the definite integral ∫ from 0 to 3 of (4x + 1) dx.",
    "options": [
      "21",
      "18",
      "24",
      "15"
    ],
    "correctAnswer": 0,
    "explanation": "[2x² + x] from 0 to 3 = 2(3)² + 3 = 18 + 3 = 21."
  },
  {
    "id": "jamb-mat-bank-2021-142",
    "subject": "mathematics",
    "subjectName": "Mathematics",
    "year": 2021,
    "questionNumber": 23,
    "topic": "Differentiation & Integration",
    "question": "(UTME 2021) Find the derivative of f(x) = ln(3x² + 5).",
    "options": [
      "6x / (3x² + 5)",
      "3x / (3x² + 5)",
      "1 / (3x² + 5)",
      "6x(3x² + 5)"
    ],
    "correctAnswer": 0,
    "explanation": "d/dx[ln u] = u' / u. For u = 3x² + 5, u' = 6x, so derivative is 6x / (3x² + 5)."
  },
  {
    "id": "jamb-mat-bank-2021-143",
    "subject": "mathematics",
    "subjectName": "Mathematics",
    "year": 2021,
    "questionNumber": 24,
    "topic": "Arithmetic & Geometric Progressions (AP & GP)",
    "question": "(UTME 2021) How many terms of the AP 2, 5, 8, 11, ... must be taken to give a sum of 155?",
    "options": [
      "10",
      "12",
      "9",
      "11"
    ],
    "correctAnswer": 0,
    "explanation": "S_n = (n/2)[2(2) + (n-1)3] = 155 => n(4 + 3n - 3) = 310 => 3n² + n - 310 = 0 => (3n + 31)(n - 10) = 0 => n = 10."
  },
  {
    "id": "jamb-mat-bank-2021-144",
    "subject": "mathematics",
    "subjectName": "Mathematics",
    "year": 2021,
    "questionNumber": 25,
    "topic": "Arithmetic & Geometric Progressions (AP & GP)",
    "question": "(UTME 2021) Insert two geometric means between 3 and 192.",
    "options": [
      "12 and 48",
      "6 and 24",
      "9 and 36",
      "16 and 64"
    ],
    "correctAnswer": 0,
    "explanation": "Let terms be 3, 3r, 3r², 192. T_4 = 3r³ = 192 => r³ = 64 => r = 4. Means are 3(4) = 12, and 12(4) = 48."
  },
  {
    "id": "jamb-mat-bank-2021-145",
    "subject": "mathematics",
    "subjectName": "Mathematics",
    "year": 2021,
    "questionNumber": 26,
    "topic": "Trigonometry & Identities",
    "question": "(UTME 2021) If sin A = 3/5 and cos B = 12/13, where A and B are acute angles, find sin(A + B).",
    "options": [
      "56/65",
      "33/65",
      "63/65",
      "16/65"
    ],
    "correctAnswer": 0,
    "explanation": "cos A = 4/5, sin B = 5/13. sin(A + B) = sin A cos B + cos A sin B = (3/5)(12/13) + (4/5)(5/13) = 36/65 + 20/65 = 56/65."
  },
  {
    "id": "jamb-mat-bank-2021-146",
    "subject": "mathematics",
    "subjectName": "Mathematics",
    "year": 2021,
    "questionNumber": 27,
    "topic": "Trigonometry & Identities",
    "question": "(UTME 2021) From the top of a cliff 60 m high, the angle of depression of a boat on the sea is 30°. How far is the boat from the foot of the cliff?",
    "options": [
      "60√3 m",
      "60 / √3 m",
      "120 m",
      "30√3 m"
    ],
    "correctAnswer": 0,
    "explanation": "tan 30° = 60 / d => 1/√3 = 60 / d => d = 60√3 m."
  },
  {
    "id": "jamb-mat-bank-2021-147",
    "subject": "mathematics",
    "subjectName": "Mathematics",
    "year": 2021,
    "questionNumber": 28,
    "topic": "Statistics & Probability",
    "question": "(UTME 2021) A card is drawn from a standard pack of 52 cards. What is the probability of drawing a King or a Heart?",
    "options": [
      "4/13",
      "1/13",
      "1/4",
      "17/52"
    ],
    "correctAnswer": 0,
    "explanation": "P(King) = 4/52, P(Heart) = 13/52, P(King of Hearts) = 1/52. P(King ∪ Heart) = 4/52 + 13/52 - 1/52 = 16/52 = 4/13."
  },
  {
    "id": "jamb-mat-bank-2021-148",
    "subject": "mathematics",
    "subjectName": "Mathematics",
    "year": 2021,
    "questionNumber": 29,
    "topic": "Statistics & Probability",
    "question": "(UTME 2021) The variance of a set of 8 numbers is 16. What is the standard deviation?",
    "options": [
      "4",
      "2",
      "8",
      "256"
    ],
    "correctAnswer": 0,
    "explanation": "Standard deviation is the positive square root of variance: √16 = 4."
  },
  {
    "id": "jamb-mat-bank-2020-149",
    "subject": "mathematics",
    "subjectName": "Mathematics",
    "year": 2020,
    "questionNumber": 30,
    "topic": "Quadratic Equations & Polynomials",
    "question": "(UTME 2020) If the quadratic equation x² - 8x + c = 0 has one root equal to 5, find the value of c and the other root.",
    "options": [
      "c = 15, other root = 3",
      "c = 12, other root = 4",
      "c = 16, other root = 2",
      "c = 20, other root = 1"
    ],
    "correctAnswer": 0,
    "explanation": "Sum of roots = 8. If one root is 5, the other root is 8 - 5 = 3. Product of roots c = 5 × 3 = 15."
  },
  {
    "id": "jamb-mat-bank-2020-150",
    "subject": "mathematics",
    "subjectName": "Mathematics",
    "year": 2020,
    "questionNumber": 31,
    "topic": "Quadratic Equations & Polynomials",
    "question": "(UTME 2020) Find the condition for the roots of the equation ax² + bx + c = 0 to be reciprocal to each other.",
    "options": [
      "a = c",
      "a = b",
      "b² = 4ac",
      "b = c"
    ],
    "correctAnswer": 0,
    "explanation": "If roots are α and 1/α, their product is α × (1/α) = 1. Since product of roots = c/a, we have c/a = 1 => a = c."
  },
  {
    "id": "jamb-mat-bank-2020-151",
    "subject": "mathematics",
    "subjectName": "Mathematics",
    "year": 2020,
    "questionNumber": 32,
    "topic": "Quadratic Equations & Polynomials",
    "question": "(UTME 2020) Solve for x: (2x - 3)² = 25.",
    "options": [
      "x = 4 or x = -1",
      "x = 5 or x = -2",
      "x = 3 or x = -4",
      "x = 1 or x = -5"
    ],
    "correctAnswer": 0,
    "explanation": "2x - 3 = ±5. 2x - 3 = 5 => 2x = 8 => x = 4. 2x - 3 = -5 => 2x = -2 => x = -1."
  },
  {
    "id": "jamb-mat-bank-2020-152",
    "subject": "mathematics",
    "subjectName": "Mathematics",
    "year": 2020,
    "questionNumber": 33,
    "topic": "Differentiation & Integration",
    "question": "(UTME 2020) Find the acceleration of a particle at t = 3 seconds whose displacement is s = 2t³ - 9t² + 12t - 5.",
    "options": [
      "18 m/s²",
      "12 m/s²",
      "24 m/s²",
      "6 m/s²"
    ],
    "correctAnswer": 0,
    "explanation": "Velocity v = ds/dt = 6t² - 18t + 12. Acceleration a = dv/dt = 12t - 18. At t = 3: a = 12(3) - 18 = 36 - 18 = 18 m/s²."
  },
  {
    "id": "jamb-mat-bank-2020-153",
    "subject": "mathematics",
    "subjectName": "Mathematics",
    "year": 2020,
    "questionNumber": 34,
    "topic": "Differentiation & Integration",
    "question": "(UTME 2020) Evaluate the definite integral ∫ from 0 to 3 of (4x + 1) dx.",
    "options": [
      "21",
      "18",
      "24",
      "15"
    ],
    "correctAnswer": 0,
    "explanation": "[2x² + x] from 0 to 3 = 2(3)² + 3 = 18 + 3 = 21."
  },
  {
    "id": "jamb-mat-bank-2020-154",
    "subject": "mathematics",
    "subjectName": "Mathematics",
    "year": 2020,
    "questionNumber": 35,
    "topic": "Differentiation & Integration",
    "question": "(UTME 2020) Find the derivative of f(x) = ln(3x² + 5).",
    "options": [
      "6x / (3x² + 5)",
      "3x / (3x² + 5)",
      "1 / (3x² + 5)",
      "6x(3x² + 5)"
    ],
    "correctAnswer": 0,
    "explanation": "d/dx[ln u] = u' / u. For u = 3x² + 5, u' = 6x, so derivative is 6x / (3x² + 5)."
  },
  {
    "id": "jamb-mat-bank-2020-155",
    "subject": "mathematics",
    "subjectName": "Mathematics",
    "year": 2020,
    "questionNumber": 36,
    "topic": "Arithmetic & Geometric Progressions (AP & GP)",
    "question": "(UTME 2020) How many terms of the AP 2, 5, 8, 11, ... must be taken to give a sum of 155?",
    "options": [
      "10",
      "12",
      "9",
      "11"
    ],
    "correctAnswer": 0,
    "explanation": "S_n = (n/2)[2(2) + (n-1)3] = 155 => n(4 + 3n - 3) = 310 => 3n² + n - 310 = 0 => (3n + 31)(n - 10) = 0 => n = 10."
  },
  {
    "id": "jamb-mat-bank-2020-156",
    "subject": "mathematics",
    "subjectName": "Mathematics",
    "year": 2020,
    "questionNumber": 37,
    "topic": "Arithmetic & Geometric Progressions (AP & GP)",
    "question": "(UTME 2020) Insert two geometric means between 3 and 192.",
    "options": [
      "12 and 48",
      "6 and 24",
      "9 and 36",
      "16 and 64"
    ],
    "correctAnswer": 0,
    "explanation": "Let terms be 3, 3r, 3r², 192. T_4 = 3r³ = 192 => r³ = 64 => r = 4. Means are 3(4) = 12, and 12(4) = 48."
  },
  {
    "id": "jamb-mat-bank-2020-157",
    "subject": "mathematics",
    "subjectName": "Mathematics",
    "year": 2020,
    "questionNumber": 38,
    "topic": "Trigonometry & Identities",
    "question": "(UTME 2020) If sin A = 3/5 and cos B = 12/13, where A and B are acute angles, find sin(A + B).",
    "options": [
      "56/65",
      "33/65",
      "63/65",
      "16/65"
    ],
    "correctAnswer": 0,
    "explanation": "cos A = 4/5, sin B = 5/13. sin(A + B) = sin A cos B + cos A sin B = (3/5)(12/13) + (4/5)(5/13) = 36/65 + 20/65 = 56/65."
  },
  {
    "id": "jamb-mat-bank-2020-158",
    "subject": "mathematics",
    "subjectName": "Mathematics",
    "year": 2020,
    "questionNumber": 39,
    "topic": "Trigonometry & Identities",
    "question": "(UTME 2020) From the top of a cliff 60 m high, the angle of depression of a boat on the sea is 30°. How far is the boat from the foot of the cliff?",
    "options": [
      "60√3 m",
      "60 / √3 m",
      "120 m",
      "30√3 m"
    ],
    "correctAnswer": 0,
    "explanation": "tan 30° = 60 / d => 1/√3 = 60 / d => d = 60√3 m."
  },
  {
    "id": "jamb-mat-bank-2020-159",
    "subject": "mathematics",
    "subjectName": "Mathematics",
    "year": 2020,
    "questionNumber": 40,
    "topic": "Statistics & Probability",
    "question": "(UTME 2020) A card is drawn from a standard pack of 52 cards. What is the probability of drawing a King or a Heart?",
    "options": [
      "4/13",
      "1/13",
      "1/4",
      "17/52"
    ],
    "correctAnswer": 0,
    "explanation": "P(King) = 4/52, P(Heart) = 13/52, P(King of Hearts) = 1/52. P(King ∪ Heart) = 4/52 + 13/52 - 1/52 = 16/52 = 4/13."
  },
  {
    "id": "jamb-mat-bank-2020-160",
    "subject": "mathematics",
    "subjectName": "Mathematics",
    "year": 2020,
    "questionNumber": 1,
    "topic": "Statistics & Probability",
    "question": "(UTME 2020) The variance of a set of 8 numbers is 16. What is the standard deviation?",
    "options": [
      "4",
      "2",
      "8",
      "256"
    ],
    "correctAnswer": 0,
    "explanation": "Standard deviation is the positive square root of variance: √16 = 4."
  },
  {
    "id": "jamb-mat-bank-2019-161",
    "subject": "mathematics",
    "subjectName": "Mathematics",
    "year": 2019,
    "questionNumber": 2,
    "topic": "Quadratic Equations & Polynomials",
    "question": "(UTME 2019) If the quadratic equation x² - 8x + c = 0 has one root equal to 5, find the value of c and the other root.",
    "options": [
      "c = 15, other root = 3",
      "c = 12, other root = 4",
      "c = 16, other root = 2",
      "c = 20, other root = 1"
    ],
    "correctAnswer": 0,
    "explanation": "Sum of roots = 8. If one root is 5, the other root is 8 - 5 = 3. Product of roots c = 5 × 3 = 15."
  },
  {
    "id": "jamb-mat-bank-2019-162",
    "subject": "mathematics",
    "subjectName": "Mathematics",
    "year": 2019,
    "questionNumber": 3,
    "topic": "Quadratic Equations & Polynomials",
    "question": "(UTME 2019) Find the condition for the roots of the equation ax² + bx + c = 0 to be reciprocal to each other.",
    "options": [
      "a = c",
      "a = b",
      "b² = 4ac",
      "b = c"
    ],
    "correctAnswer": 0,
    "explanation": "If roots are α and 1/α, their product is α × (1/α) = 1. Since product of roots = c/a, we have c/a = 1 => a = c."
  },
  {
    "id": "jamb-mat-bank-2019-163",
    "subject": "mathematics",
    "subjectName": "Mathematics",
    "year": 2019,
    "questionNumber": 4,
    "topic": "Quadratic Equations & Polynomials",
    "question": "(UTME 2019) Solve for x: (2x - 3)² = 25.",
    "options": [
      "x = 4 or x = -1",
      "x = 5 or x = -2",
      "x = 3 or x = -4",
      "x = 1 or x = -5"
    ],
    "correctAnswer": 0,
    "explanation": "2x - 3 = ±5. 2x - 3 = 5 => 2x = 8 => x = 4. 2x - 3 = -5 => 2x = -2 => x = -1."
  },
  {
    "id": "jamb-mat-bank-2019-164",
    "subject": "mathematics",
    "subjectName": "Mathematics",
    "year": 2019,
    "questionNumber": 5,
    "topic": "Differentiation & Integration",
    "question": "(UTME 2019) Find the acceleration of a particle at t = 3 seconds whose displacement is s = 2t³ - 9t² + 12t - 5.",
    "options": [
      "18 m/s²",
      "12 m/s²",
      "24 m/s²",
      "6 m/s²"
    ],
    "correctAnswer": 0,
    "explanation": "Velocity v = ds/dt = 6t² - 18t + 12. Acceleration a = dv/dt = 12t - 18. At t = 3: a = 12(3) - 18 = 36 - 18 = 18 m/s²."
  },
  {
    "id": "jamb-mat-bank-2019-165",
    "subject": "mathematics",
    "subjectName": "Mathematics",
    "year": 2019,
    "questionNumber": 6,
    "topic": "Differentiation & Integration",
    "question": "(UTME 2019) Evaluate the definite integral ∫ from 0 to 3 of (4x + 1) dx.",
    "options": [
      "21",
      "18",
      "24",
      "15"
    ],
    "correctAnswer": 0,
    "explanation": "[2x² + x] from 0 to 3 = 2(3)² + 3 = 18 + 3 = 21."
  },
  {
    "id": "jamb-mat-bank-2019-166",
    "subject": "mathematics",
    "subjectName": "Mathematics",
    "year": 2019,
    "questionNumber": 7,
    "topic": "Differentiation & Integration",
    "question": "(UTME 2019) Find the derivative of f(x) = ln(3x² + 5).",
    "options": [
      "6x / (3x² + 5)",
      "3x / (3x² + 5)",
      "1 / (3x² + 5)",
      "6x(3x² + 5)"
    ],
    "correctAnswer": 0,
    "explanation": "d/dx[ln u] = u' / u. For u = 3x² + 5, u' = 6x, so derivative is 6x / (3x² + 5)."
  },
  {
    "id": "jamb-mat-bank-2019-167",
    "subject": "mathematics",
    "subjectName": "Mathematics",
    "year": 2019,
    "questionNumber": 8,
    "topic": "Arithmetic & Geometric Progressions (AP & GP)",
    "question": "(UTME 2019) How many terms of the AP 2, 5, 8, 11, ... must be taken to give a sum of 155?",
    "options": [
      "10",
      "12",
      "9",
      "11"
    ],
    "correctAnswer": 0,
    "explanation": "S_n = (n/2)[2(2) + (n-1)3] = 155 => n(4 + 3n - 3) = 310 => 3n² + n - 310 = 0 => (3n + 31)(n - 10) = 0 => n = 10."
  },
  {
    "id": "jamb-mat-bank-2019-168",
    "subject": "mathematics",
    "subjectName": "Mathematics",
    "year": 2019,
    "questionNumber": 9,
    "topic": "Arithmetic & Geometric Progressions (AP & GP)",
    "question": "(UTME 2019) Insert two geometric means between 3 and 192.",
    "options": [
      "12 and 48",
      "6 and 24",
      "9 and 36",
      "16 and 64"
    ],
    "correctAnswer": 0,
    "explanation": "Let terms be 3, 3r, 3r², 192. T_4 = 3r³ = 192 => r³ = 64 => r = 4. Means are 3(4) = 12, and 12(4) = 48."
  },
  {
    "id": "jamb-mat-bank-2019-169",
    "subject": "mathematics",
    "subjectName": "Mathematics",
    "year": 2019,
    "questionNumber": 10,
    "topic": "Trigonometry & Identities",
    "question": "(UTME 2019) If sin A = 3/5 and cos B = 12/13, where A and B are acute angles, find sin(A + B).",
    "options": [
      "56/65",
      "33/65",
      "63/65",
      "16/65"
    ],
    "correctAnswer": 0,
    "explanation": "cos A = 4/5, sin B = 5/13. sin(A + B) = sin A cos B + cos A sin B = (3/5)(12/13) + (4/5)(5/13) = 36/65 + 20/65 = 56/65."
  },
  {
    "id": "jamb-mat-bank-2019-170",
    "subject": "mathematics",
    "subjectName": "Mathematics",
    "year": 2019,
    "questionNumber": 11,
    "topic": "Trigonometry & Identities",
    "question": "(UTME 2019) From the top of a cliff 60 m high, the angle of depression of a boat on the sea is 30°. How far is the boat from the foot of the cliff?",
    "options": [
      "60√3 m",
      "60 / √3 m",
      "120 m",
      "30√3 m"
    ],
    "correctAnswer": 0,
    "explanation": "tan 30° = 60 / d => 1/√3 = 60 / d => d = 60√3 m."
  },
  {
    "id": "jamb-mat-bank-2019-171",
    "subject": "mathematics",
    "subjectName": "Mathematics",
    "year": 2019,
    "questionNumber": 12,
    "topic": "Statistics & Probability",
    "question": "(UTME 2019) A card is drawn from a standard pack of 52 cards. What is the probability of drawing a King or a Heart?",
    "options": [
      "4/13",
      "1/13",
      "1/4",
      "17/52"
    ],
    "correctAnswer": 0,
    "explanation": "P(King) = 4/52, P(Heart) = 13/52, P(King of Hearts) = 1/52. P(King ∪ Heart) = 4/52 + 13/52 - 1/52 = 16/52 = 4/13."
  },
  {
    "id": "jamb-mat-bank-2019-172",
    "subject": "mathematics",
    "subjectName": "Mathematics",
    "year": 2019,
    "questionNumber": 13,
    "topic": "Statistics & Probability",
    "question": "(UTME 2019) The variance of a set of 8 numbers is 16. What is the standard deviation?",
    "options": [
      "4",
      "2",
      "8",
      "256"
    ],
    "correctAnswer": 0,
    "explanation": "Standard deviation is the positive square root of variance: √16 = 4."
  },
  {
    "id": "jamb-mat-bank-2018-173",
    "subject": "mathematics",
    "subjectName": "Mathematics",
    "year": 2018,
    "questionNumber": 14,
    "topic": "Quadratic Equations & Polynomials",
    "question": "(UTME 2018) If the quadratic equation x² - 8x + c = 0 has one root equal to 5, find the value of c and the other root.",
    "options": [
      "c = 15, other root = 3",
      "c = 12, other root = 4",
      "c = 16, other root = 2",
      "c = 20, other root = 1"
    ],
    "correctAnswer": 0,
    "explanation": "Sum of roots = 8. If one root is 5, the other root is 8 - 5 = 3. Product of roots c = 5 × 3 = 15."
  },
  {
    "id": "jamb-mat-bank-2018-174",
    "subject": "mathematics",
    "subjectName": "Mathematics",
    "year": 2018,
    "questionNumber": 15,
    "topic": "Quadratic Equations & Polynomials",
    "question": "(UTME 2018) Find the condition for the roots of the equation ax² + bx + c = 0 to be reciprocal to each other.",
    "options": [
      "a = c",
      "a = b",
      "b² = 4ac",
      "b = c"
    ],
    "correctAnswer": 0,
    "explanation": "If roots are α and 1/α, their product is α × (1/α) = 1. Since product of roots = c/a, we have c/a = 1 => a = c."
  },
  {
    "id": "jamb-mat-bank-2018-175",
    "subject": "mathematics",
    "subjectName": "Mathematics",
    "year": 2018,
    "questionNumber": 16,
    "topic": "Quadratic Equations & Polynomials",
    "question": "(UTME 2018) Solve for x: (2x - 3)² = 25.",
    "options": [
      "x = 4 or x = -1",
      "x = 5 or x = -2",
      "x = 3 or x = -4",
      "x = 1 or x = -5"
    ],
    "correctAnswer": 0,
    "explanation": "2x - 3 = ±5. 2x - 3 = 5 => 2x = 8 => x = 4. 2x - 3 = -5 => 2x = -2 => x = -1."
  },
  {
    "id": "jamb-mat-bank-2018-176",
    "subject": "mathematics",
    "subjectName": "Mathematics",
    "year": 2018,
    "questionNumber": 17,
    "topic": "Differentiation & Integration",
    "question": "(UTME 2018) Find the acceleration of a particle at t = 3 seconds whose displacement is s = 2t³ - 9t² + 12t - 5.",
    "options": [
      "18 m/s²",
      "12 m/s²",
      "24 m/s²",
      "6 m/s²"
    ],
    "correctAnswer": 0,
    "explanation": "Velocity v = ds/dt = 6t² - 18t + 12. Acceleration a = dv/dt = 12t - 18. At t = 3: a = 12(3) - 18 = 36 - 18 = 18 m/s²."
  },
  {
    "id": "jamb-mat-bank-2018-177",
    "subject": "mathematics",
    "subjectName": "Mathematics",
    "year": 2018,
    "questionNumber": 18,
    "topic": "Differentiation & Integration",
    "question": "(UTME 2018) Evaluate the definite integral ∫ from 0 to 3 of (4x + 1) dx.",
    "options": [
      "21",
      "18",
      "24",
      "15"
    ],
    "correctAnswer": 0,
    "explanation": "[2x² + x] from 0 to 3 = 2(3)² + 3 = 18 + 3 = 21."
  },
  {
    "id": "jamb-mat-bank-2018-178",
    "subject": "mathematics",
    "subjectName": "Mathematics",
    "year": 2018,
    "questionNumber": 19,
    "topic": "Differentiation & Integration",
    "question": "(UTME 2018) Find the derivative of f(x) = ln(3x² + 5).",
    "options": [
      "6x / (3x² + 5)",
      "3x / (3x² + 5)",
      "1 / (3x² + 5)",
      "6x(3x² + 5)"
    ],
    "correctAnswer": 0,
    "explanation": "d/dx[ln u] = u' / u. For u = 3x² + 5, u' = 6x, so derivative is 6x / (3x² + 5)."
  },
  {
    "id": "jamb-mat-bank-2018-179",
    "subject": "mathematics",
    "subjectName": "Mathematics",
    "year": 2018,
    "questionNumber": 20,
    "topic": "Arithmetic & Geometric Progressions (AP & GP)",
    "question": "(UTME 2018) How many terms of the AP 2, 5, 8, 11, ... must be taken to give a sum of 155?",
    "options": [
      "10",
      "12",
      "9",
      "11"
    ],
    "correctAnswer": 0,
    "explanation": "S_n = (n/2)[2(2) + (n-1)3] = 155 => n(4 + 3n - 3) = 310 => 3n² + n - 310 = 0 => (3n + 31)(n - 10) = 0 => n = 10."
  },
  {
    "id": "jamb-mat-bank-2018-180",
    "subject": "mathematics",
    "subjectName": "Mathematics",
    "year": 2018,
    "questionNumber": 21,
    "topic": "Arithmetic & Geometric Progressions (AP & GP)",
    "question": "(UTME 2018) Insert two geometric means between 3 and 192.",
    "options": [
      "12 and 48",
      "6 and 24",
      "9 and 36",
      "16 and 64"
    ],
    "correctAnswer": 0,
    "explanation": "Let terms be 3, 3r, 3r², 192. T_4 = 3r³ = 192 => r³ = 64 => r = 4. Means are 3(4) = 12, and 12(4) = 48."
  },
  {
    "id": "jamb-mat-bank-2018-181",
    "subject": "mathematics",
    "subjectName": "Mathematics",
    "year": 2018,
    "questionNumber": 22,
    "topic": "Trigonometry & Identities",
    "question": "(UTME 2018) If sin A = 3/5 and cos B = 12/13, where A and B are acute angles, find sin(A + B).",
    "options": [
      "56/65",
      "33/65",
      "63/65",
      "16/65"
    ],
    "correctAnswer": 0,
    "explanation": "cos A = 4/5, sin B = 5/13. sin(A + B) = sin A cos B + cos A sin B = (3/5)(12/13) + (4/5)(5/13) = 36/65 + 20/65 = 56/65."
  },
  {
    "id": "jamb-mat-bank-2018-182",
    "subject": "mathematics",
    "subjectName": "Mathematics",
    "year": 2018,
    "questionNumber": 23,
    "topic": "Trigonometry & Identities",
    "question": "(UTME 2018) From the top of a cliff 60 m high, the angle of depression of a boat on the sea is 30°. How far is the boat from the foot of the cliff?",
    "options": [
      "60√3 m",
      "60 / √3 m",
      "120 m",
      "30√3 m"
    ],
    "correctAnswer": 0,
    "explanation": "tan 30° = 60 / d => 1/√3 = 60 / d => d = 60√3 m."
  },
  {
    "id": "jamb-mat-bank-2018-183",
    "subject": "mathematics",
    "subjectName": "Mathematics",
    "year": 2018,
    "questionNumber": 24,
    "topic": "Statistics & Probability",
    "question": "(UTME 2018) A card is drawn from a standard pack of 52 cards. What is the probability of drawing a King or a Heart?",
    "options": [
      "4/13",
      "1/13",
      "1/4",
      "17/52"
    ],
    "correctAnswer": 0,
    "explanation": "P(King) = 4/52, P(Heart) = 13/52, P(King of Hearts) = 1/52. P(King ∪ Heart) = 4/52 + 13/52 - 1/52 = 16/52 = 4/13."
  },
  {
    "id": "jamb-mat-bank-2018-184",
    "subject": "mathematics",
    "subjectName": "Mathematics",
    "year": 2018,
    "questionNumber": 25,
    "topic": "Statistics & Probability",
    "question": "(UTME 2018) The variance of a set of 8 numbers is 16. What is the standard deviation?",
    "options": [
      "4",
      "2",
      "8",
      "256"
    ],
    "correctAnswer": 0,
    "explanation": "Standard deviation is the positive square root of variance: √16 = 4."
  },
  {
    "id": "jamb-eng-bank-2024-185",
    "subject": "english",
    "subjectName": "English Language",
    "year": 2024,
    "questionNumber": 26,
    "topic": "The Prescribed Novel: The Lekki Headmaster",
    "question": "(UTME 2024) In \"The Lekki Headmaster\", what is the attitude of Mr. Bepo towards examination malpractice?",
    "options": [
      "Absolute intolerance and strict disciplinary sanction",
      "Pragmatic compromise to protect school reputation",
      "Indifference, leaving it to class teachers",
      "Financial extortion of offenders"
    ],
    "correctAnswer": 0,
    "explanation": "Mr. Bepo embodies zero tolerance for academic fraud, emphasizing genuine mastery and moral character."
  },
  {
    "id": "jamb-eng-bank-2024-186",
    "subject": "english",
    "subjectName": "English Language",
    "year": 2024,
    "questionNumber": 27,
    "topic": "The Prescribed Novel: The Lekki Headmaster",
    "question": "(UTME 2024) In Kabir Alabi Garba's \"The Lekki Headmaster\", what societal evil is highlighted through the lifestyle of wealthy parents in Lekki?",
    "options": [
      "Using excessive wealth to bypass institutional rules and accountability",
      "Organized political terrorism",
      "Religious extremism and cult wars",
      "Traditional communal land disputes"
    ],
    "correctAnswer": 0,
    "explanation": "The novel satirizes affluent Nigerian parents who believe their financial affluence places them above institutional integrity."
  },
  {
    "id": "jamb-eng-bank-2024-187",
    "subject": "english",
    "subjectName": "English Language",
    "year": 2024,
    "questionNumber": 28,
    "topic": "Concord & Subject-Verb Agreement",
    "question": "(UTME 2024) A flock of sheep _______ grazing peacefully in the valley.",
    "options": [
      "is",
      "are",
      "were",
      "have been"
    ],
    "correctAnswer": 0,
    "explanation": "\"A flock of sheep\" has a singular collective head noun (\"A flock\") and takes a singular verb (\"is\")."
  },
  {
    "id": "jamb-eng-bank-2024-188",
    "subject": "english",
    "subjectName": "English Language",
    "year": 2024,
    "questionNumber": 29,
    "topic": "Concord & Subject-Verb Agreement",
    "question": "(UTME 2024) The majority of the committee members _______ voted in favor of the amendment.",
    "options": [
      "have",
      "has",
      "is",
      "was"
    ],
    "correctAnswer": 0,
    "explanation": "When \"majority of\" precedes a plural countable noun (\"members\"), it takes a plural verb (\"have\")."
  },
  {
    "id": "jamb-eng-bank-2024-189",
    "subject": "english",
    "subjectName": "English Language",
    "year": 2024,
    "questionNumber": 30,
    "topic": "Synonyms & Antonyms",
    "question": "(UTME 2024) Choose the word nearest in meaning to PRECARIOUS in: \"The company was in a precarious financial situation.\"",
    "options": [
      "insecure and perilous",
      "stable",
      "prosperous",
      "predictable"
    ],
    "correctAnswer": 0,
    "explanation": "\"Precarious\" means not securely held or in position; dangerously likely to fall or collapse."
  },
  {
    "id": "jamb-eng-bank-2024-190",
    "subject": "english",
    "subjectName": "English Language",
    "year": 2024,
    "questionNumber": 31,
    "topic": "Synonyms & Antonyms",
    "question": "(UTME 2024) Choose the word opposite in meaning to TACITURN in: \"The new manager was surprisingly taciturn during the staff meeting.\"",
    "options": [
      "garrulous (talkative)",
      "reserved",
      "silent",
      "timid"
    ],
    "correctAnswer": 0,
    "explanation": "\"Taciturn\" means reserved or uncommunicative in speech. The exact antonym is \"garrulous\" or \"loquacious\" (talkative)."
  },
  {
    "id": "jamb-eng-bank-2024-191",
    "subject": "english",
    "subjectName": "English Language",
    "year": 2024,
    "questionNumber": 32,
    "topic": "Oral Forms & Phonology",
    "question": "(UTME 2024) Which of the following words contains a silent \"b\"?",
    "options": [
      "subtle",
      "rubber",
      "table",
      "baker"
    ],
    "correctAnswer": 0,
    "explanation": "In \"subtle\" (/ˈsʌt.əl/), the letter \"b\" is silent."
  },
  {
    "id": "jamb-eng-bank-2024-192",
    "subject": "english",
    "subjectName": "English Language",
    "year": 2024,
    "questionNumber": 33,
    "topic": "Oral Forms & Phonology",
    "question": "(UTME 2024) Select the word with the primary stress on the THIRD syllable.",
    "options": [
      "un-der-STAND",
      "PHO-to-graph",
      "con-DI-tion",
      "E-le-phant"
    ],
    "correctAnswer": 0,
    "explanation": "\"Understand\" is stressed on the third syllable: un-der-STAND /ˌʌn.dəˈstænd/."
  },
  {
    "id": "jamb-eng-bank-2023-193",
    "subject": "english",
    "subjectName": "English Language",
    "year": 2023,
    "questionNumber": 34,
    "topic": "The Prescribed Novel: The Lekki Headmaster",
    "question": "(UTME 2023) In \"The Lekki Headmaster\", what is the attitude of Mr. Bepo towards examination malpractice?",
    "options": [
      "Absolute intolerance and strict disciplinary sanction",
      "Pragmatic compromise to protect school reputation",
      "Indifference, leaving it to class teachers",
      "Financial extortion of offenders"
    ],
    "correctAnswer": 0,
    "explanation": "Mr. Bepo embodies zero tolerance for academic fraud, emphasizing genuine mastery and moral character."
  },
  {
    "id": "jamb-eng-bank-2023-194",
    "subject": "english",
    "subjectName": "English Language",
    "year": 2023,
    "questionNumber": 35,
    "topic": "The Prescribed Novel: The Lekki Headmaster",
    "question": "(UTME 2023) In Kabir Alabi Garba's \"The Lekki Headmaster\", what societal evil is highlighted through the lifestyle of wealthy parents in Lekki?",
    "options": [
      "Using excessive wealth to bypass institutional rules and accountability",
      "Organized political terrorism",
      "Religious extremism and cult wars",
      "Traditional communal land disputes"
    ],
    "correctAnswer": 0,
    "explanation": "The novel satirizes affluent Nigerian parents who believe their financial affluence places them above institutional integrity."
  },
  {
    "id": "jamb-eng-bank-2023-195",
    "subject": "english",
    "subjectName": "English Language",
    "year": 2023,
    "questionNumber": 36,
    "topic": "Concord & Subject-Verb Agreement",
    "question": "(UTME 2023) A flock of sheep _______ grazing peacefully in the valley.",
    "options": [
      "is",
      "are",
      "were",
      "have been"
    ],
    "correctAnswer": 0,
    "explanation": "\"A flock of sheep\" has a singular collective head noun (\"A flock\") and takes a singular verb (\"is\")."
  },
  {
    "id": "jamb-eng-bank-2023-196",
    "subject": "english",
    "subjectName": "English Language",
    "year": 2023,
    "questionNumber": 37,
    "topic": "Concord & Subject-Verb Agreement",
    "question": "(UTME 2023) The majority of the committee members _______ voted in favor of the amendment.",
    "options": [
      "have",
      "has",
      "is",
      "was"
    ],
    "correctAnswer": 0,
    "explanation": "When \"majority of\" precedes a plural countable noun (\"members\"), it takes a plural verb (\"have\")."
  },
  {
    "id": "jamb-eng-bank-2023-197",
    "subject": "english",
    "subjectName": "English Language",
    "year": 2023,
    "questionNumber": 38,
    "topic": "Synonyms & Antonyms",
    "question": "(UTME 2023) Choose the word nearest in meaning to PRECARIOUS in: \"The company was in a precarious financial situation.\"",
    "options": [
      "insecure and perilous",
      "stable",
      "prosperous",
      "predictable"
    ],
    "correctAnswer": 0,
    "explanation": "\"Precarious\" means not securely held or in position; dangerously likely to fall or collapse."
  },
  {
    "id": "jamb-eng-bank-2023-198",
    "subject": "english",
    "subjectName": "English Language",
    "year": 2023,
    "questionNumber": 39,
    "topic": "Synonyms & Antonyms",
    "question": "(UTME 2023) Choose the word opposite in meaning to TACITURN in: \"The new manager was surprisingly taciturn during the staff meeting.\"",
    "options": [
      "garrulous (talkative)",
      "reserved",
      "silent",
      "timid"
    ],
    "correctAnswer": 0,
    "explanation": "\"Taciturn\" means reserved or uncommunicative in speech. The exact antonym is \"garrulous\" or \"loquacious\" (talkative)."
  },
  {
    "id": "jamb-eng-bank-2023-199",
    "subject": "english",
    "subjectName": "English Language",
    "year": 2023,
    "questionNumber": 40,
    "topic": "Oral Forms & Phonology",
    "question": "(UTME 2023) Which of the following words contains a silent \"b\"?",
    "options": [
      "subtle",
      "rubber",
      "table",
      "baker"
    ],
    "correctAnswer": 0,
    "explanation": "In \"subtle\" (/ˈsʌt.əl/), the letter \"b\" is silent."
  },
  {
    "id": "jamb-eng-bank-2023-200",
    "subject": "english",
    "subjectName": "English Language",
    "year": 2023,
    "questionNumber": 1,
    "topic": "Oral Forms & Phonology",
    "question": "(UTME 2023) Select the word with the primary stress on the THIRD syllable.",
    "options": [
      "un-der-STAND",
      "PHO-to-graph",
      "con-DI-tion",
      "E-le-phant"
    ],
    "correctAnswer": 0,
    "explanation": "\"Understand\" is stressed on the third syllable: un-der-STAND /ˌʌn.dəˈstænd/."
  },
  {
    "id": "jamb-eng-bank-2022-201",
    "subject": "english",
    "subjectName": "English Language",
    "year": 2022,
    "questionNumber": 2,
    "topic": "The Prescribed Novel: The Lekki Headmaster",
    "question": "(UTME 2022) In \"The Lekki Headmaster\", what is the attitude of Mr. Bepo towards examination malpractice?",
    "options": [
      "Absolute intolerance and strict disciplinary sanction",
      "Pragmatic compromise to protect school reputation",
      "Indifference, leaving it to class teachers",
      "Financial extortion of offenders"
    ],
    "correctAnswer": 0,
    "explanation": "Mr. Bepo embodies zero tolerance for academic fraud, emphasizing genuine mastery and moral character."
  },
  {
    "id": "jamb-eng-bank-2022-202",
    "subject": "english",
    "subjectName": "English Language",
    "year": 2022,
    "questionNumber": 3,
    "topic": "The Prescribed Novel: The Lekki Headmaster",
    "question": "(UTME 2022) In Kabir Alabi Garba's \"The Lekki Headmaster\", what societal evil is highlighted through the lifestyle of wealthy parents in Lekki?",
    "options": [
      "Using excessive wealth to bypass institutional rules and accountability",
      "Organized political terrorism",
      "Religious extremism and cult wars",
      "Traditional communal land disputes"
    ],
    "correctAnswer": 0,
    "explanation": "The novel satirizes affluent Nigerian parents who believe their financial affluence places them above institutional integrity."
  },
  {
    "id": "jamb-eng-bank-2022-203",
    "subject": "english",
    "subjectName": "English Language",
    "year": 2022,
    "questionNumber": 4,
    "topic": "Concord & Subject-Verb Agreement",
    "question": "(UTME 2022) A flock of sheep _______ grazing peacefully in the valley.",
    "options": [
      "is",
      "are",
      "were",
      "have been"
    ],
    "correctAnswer": 0,
    "explanation": "\"A flock of sheep\" has a singular collective head noun (\"A flock\") and takes a singular verb (\"is\")."
  },
  {
    "id": "jamb-eng-bank-2022-204",
    "subject": "english",
    "subjectName": "English Language",
    "year": 2022,
    "questionNumber": 5,
    "topic": "Concord & Subject-Verb Agreement",
    "question": "(UTME 2022) The majority of the committee members _______ voted in favor of the amendment.",
    "options": [
      "have",
      "has",
      "is",
      "was"
    ],
    "correctAnswer": 0,
    "explanation": "When \"majority of\" precedes a plural countable noun (\"members\"), it takes a plural verb (\"have\")."
  },
  {
    "id": "jamb-eng-bank-2022-205",
    "subject": "english",
    "subjectName": "English Language",
    "year": 2022,
    "questionNumber": 6,
    "topic": "Synonyms & Antonyms",
    "question": "(UTME 2022) Choose the word nearest in meaning to PRECARIOUS in: \"The company was in a precarious financial situation.\"",
    "options": [
      "insecure and perilous",
      "stable",
      "prosperous",
      "predictable"
    ],
    "correctAnswer": 0,
    "explanation": "\"Precarious\" means not securely held or in position; dangerously likely to fall or collapse."
  },
  {
    "id": "jamb-eng-bank-2022-206",
    "subject": "english",
    "subjectName": "English Language",
    "year": 2022,
    "questionNumber": 7,
    "topic": "Synonyms & Antonyms",
    "question": "(UTME 2022) Choose the word opposite in meaning to TACITURN in: \"The new manager was surprisingly taciturn during the staff meeting.\"",
    "options": [
      "garrulous (talkative)",
      "reserved",
      "silent",
      "timid"
    ],
    "correctAnswer": 0,
    "explanation": "\"Taciturn\" means reserved or uncommunicative in speech. The exact antonym is \"garrulous\" or \"loquacious\" (talkative)."
  },
  {
    "id": "jamb-eng-bank-2022-207",
    "subject": "english",
    "subjectName": "English Language",
    "year": 2022,
    "questionNumber": 8,
    "topic": "Oral Forms & Phonology",
    "question": "(UTME 2022) Which of the following words contains a silent \"b\"?",
    "options": [
      "subtle",
      "rubber",
      "table",
      "baker"
    ],
    "correctAnswer": 0,
    "explanation": "In \"subtle\" (/ˈsʌt.əl/), the letter \"b\" is silent."
  },
  {
    "id": "jamb-eng-bank-2022-208",
    "subject": "english",
    "subjectName": "English Language",
    "year": 2022,
    "questionNumber": 9,
    "topic": "Oral Forms & Phonology",
    "question": "(UTME 2022) Select the word with the primary stress on the THIRD syllable.",
    "options": [
      "un-der-STAND",
      "PHO-to-graph",
      "con-DI-tion",
      "E-le-phant"
    ],
    "correctAnswer": 0,
    "explanation": "\"Understand\" is stressed on the third syllable: un-der-STAND /ˌʌn.dəˈstænd/."
  },
  {
    "id": "jamb-eng-bank-2021-209",
    "subject": "english",
    "subjectName": "English Language",
    "year": 2021,
    "questionNumber": 10,
    "topic": "The Prescribed Novel: The Lekki Headmaster",
    "question": "(UTME 2021) In \"The Lekki Headmaster\", what is the attitude of Mr. Bepo towards examination malpractice?",
    "options": [
      "Absolute intolerance and strict disciplinary sanction",
      "Pragmatic compromise to protect school reputation",
      "Indifference, leaving it to class teachers",
      "Financial extortion of offenders"
    ],
    "correctAnswer": 0,
    "explanation": "Mr. Bepo embodies zero tolerance for academic fraud, emphasizing genuine mastery and moral character."
  },
  {
    "id": "jamb-eng-bank-2021-210",
    "subject": "english",
    "subjectName": "English Language",
    "year": 2021,
    "questionNumber": 11,
    "topic": "The Prescribed Novel: The Lekki Headmaster",
    "question": "(UTME 2021) In Kabir Alabi Garba's \"The Lekki Headmaster\", what societal evil is highlighted through the lifestyle of wealthy parents in Lekki?",
    "options": [
      "Using excessive wealth to bypass institutional rules and accountability",
      "Organized political terrorism",
      "Religious extremism and cult wars",
      "Traditional communal land disputes"
    ],
    "correctAnswer": 0,
    "explanation": "The novel satirizes affluent Nigerian parents who believe their financial affluence places them above institutional integrity."
  },
  {
    "id": "jamb-eng-bank-2021-211",
    "subject": "english",
    "subjectName": "English Language",
    "year": 2021,
    "questionNumber": 12,
    "topic": "Concord & Subject-Verb Agreement",
    "question": "(UTME 2021) A flock of sheep _______ grazing peacefully in the valley.",
    "options": [
      "is",
      "are",
      "were",
      "have been"
    ],
    "correctAnswer": 0,
    "explanation": "\"A flock of sheep\" has a singular collective head noun (\"A flock\") and takes a singular verb (\"is\")."
  },
  {
    "id": "jamb-eng-bank-2021-212",
    "subject": "english",
    "subjectName": "English Language",
    "year": 2021,
    "questionNumber": 13,
    "topic": "Concord & Subject-Verb Agreement",
    "question": "(UTME 2021) The majority of the committee members _______ voted in favor of the amendment.",
    "options": [
      "have",
      "has",
      "is",
      "was"
    ],
    "correctAnswer": 0,
    "explanation": "When \"majority of\" precedes a plural countable noun (\"members\"), it takes a plural verb (\"have\")."
  },
  {
    "id": "jamb-eng-bank-2021-213",
    "subject": "english",
    "subjectName": "English Language",
    "year": 2021,
    "questionNumber": 14,
    "topic": "Synonyms & Antonyms",
    "question": "(UTME 2021) Choose the word nearest in meaning to PRECARIOUS in: \"The company was in a precarious financial situation.\"",
    "options": [
      "insecure and perilous",
      "stable",
      "prosperous",
      "predictable"
    ],
    "correctAnswer": 0,
    "explanation": "\"Precarious\" means not securely held or in position; dangerously likely to fall or collapse."
  },
  {
    "id": "jamb-eng-bank-2021-214",
    "subject": "english",
    "subjectName": "English Language",
    "year": 2021,
    "questionNumber": 15,
    "topic": "Synonyms & Antonyms",
    "question": "(UTME 2021) Choose the word opposite in meaning to TACITURN in: \"The new manager was surprisingly taciturn during the staff meeting.\"",
    "options": [
      "garrulous (talkative)",
      "reserved",
      "silent",
      "timid"
    ],
    "correctAnswer": 0,
    "explanation": "\"Taciturn\" means reserved or uncommunicative in speech. The exact antonym is \"garrulous\" or \"loquacious\" (talkative)."
  },
  {
    "id": "jamb-eng-bank-2021-215",
    "subject": "english",
    "subjectName": "English Language",
    "year": 2021,
    "questionNumber": 16,
    "topic": "Oral Forms & Phonology",
    "question": "(UTME 2021) Which of the following words contains a silent \"b\"?",
    "options": [
      "subtle",
      "rubber",
      "table",
      "baker"
    ],
    "correctAnswer": 0,
    "explanation": "In \"subtle\" (/ˈsʌt.əl/), the letter \"b\" is silent."
  },
  {
    "id": "jamb-eng-bank-2021-216",
    "subject": "english",
    "subjectName": "English Language",
    "year": 2021,
    "questionNumber": 17,
    "topic": "Oral Forms & Phonology",
    "question": "(UTME 2021) Select the word with the primary stress on the THIRD syllable.",
    "options": [
      "un-der-STAND",
      "PHO-to-graph",
      "con-DI-tion",
      "E-le-phant"
    ],
    "correctAnswer": 0,
    "explanation": "\"Understand\" is stressed on the third syllable: un-der-STAND /ˌʌn.dəˈstænd/."
  },
  {
    "id": "jamb-eng-bank-2020-217",
    "subject": "english",
    "subjectName": "English Language",
    "year": 2020,
    "questionNumber": 18,
    "topic": "The Prescribed Novel: The Lekki Headmaster",
    "question": "(UTME 2020) In \"The Lekki Headmaster\", what is the attitude of Mr. Bepo towards examination malpractice?",
    "options": [
      "Absolute intolerance and strict disciplinary sanction",
      "Pragmatic compromise to protect school reputation",
      "Indifference, leaving it to class teachers",
      "Financial extortion of offenders"
    ],
    "correctAnswer": 0,
    "explanation": "Mr. Bepo embodies zero tolerance for academic fraud, emphasizing genuine mastery and moral character."
  },
  {
    "id": "jamb-eng-bank-2020-218",
    "subject": "english",
    "subjectName": "English Language",
    "year": 2020,
    "questionNumber": 19,
    "topic": "The Prescribed Novel: The Lekki Headmaster",
    "question": "(UTME 2020) In Kabir Alabi Garba's \"The Lekki Headmaster\", what societal evil is highlighted through the lifestyle of wealthy parents in Lekki?",
    "options": [
      "Using excessive wealth to bypass institutional rules and accountability",
      "Organized political terrorism",
      "Religious extremism and cult wars",
      "Traditional communal land disputes"
    ],
    "correctAnswer": 0,
    "explanation": "The novel satirizes affluent Nigerian parents who believe their financial affluence places them above institutional integrity."
  },
  {
    "id": "jamb-eng-bank-2020-219",
    "subject": "english",
    "subjectName": "English Language",
    "year": 2020,
    "questionNumber": 20,
    "topic": "Concord & Subject-Verb Agreement",
    "question": "(UTME 2020) A flock of sheep _______ grazing peacefully in the valley.",
    "options": [
      "is",
      "are",
      "were",
      "have been"
    ],
    "correctAnswer": 0,
    "explanation": "\"A flock of sheep\" has a singular collective head noun (\"A flock\") and takes a singular verb (\"is\")."
  },
  {
    "id": "jamb-eng-bank-2020-220",
    "subject": "english",
    "subjectName": "English Language",
    "year": 2020,
    "questionNumber": 21,
    "topic": "Concord & Subject-Verb Agreement",
    "question": "(UTME 2020) The majority of the committee members _______ voted in favor of the amendment.",
    "options": [
      "have",
      "has",
      "is",
      "was"
    ],
    "correctAnswer": 0,
    "explanation": "When \"majority of\" precedes a plural countable noun (\"members\"), it takes a plural verb (\"have\")."
  },
  {
    "id": "jamb-eng-bank-2020-221",
    "subject": "english",
    "subjectName": "English Language",
    "year": 2020,
    "questionNumber": 22,
    "topic": "Synonyms & Antonyms",
    "question": "(UTME 2020) Choose the word nearest in meaning to PRECARIOUS in: \"The company was in a precarious financial situation.\"",
    "options": [
      "insecure and perilous",
      "stable",
      "prosperous",
      "predictable"
    ],
    "correctAnswer": 0,
    "explanation": "\"Precarious\" means not securely held or in position; dangerously likely to fall or collapse."
  },
  {
    "id": "jamb-eng-bank-2020-222",
    "subject": "english",
    "subjectName": "English Language",
    "year": 2020,
    "questionNumber": 23,
    "topic": "Synonyms & Antonyms",
    "question": "(UTME 2020) Choose the word opposite in meaning to TACITURN in: \"The new manager was surprisingly taciturn during the staff meeting.\"",
    "options": [
      "garrulous (talkative)",
      "reserved",
      "silent",
      "timid"
    ],
    "correctAnswer": 0,
    "explanation": "\"Taciturn\" means reserved or uncommunicative in speech. The exact antonym is \"garrulous\" or \"loquacious\" (talkative)."
  },
  {
    "id": "jamb-eng-bank-2020-223",
    "subject": "english",
    "subjectName": "English Language",
    "year": 2020,
    "questionNumber": 24,
    "topic": "Oral Forms & Phonology",
    "question": "(UTME 2020) Which of the following words contains a silent \"b\"?",
    "options": [
      "subtle",
      "rubber",
      "table",
      "baker"
    ],
    "correctAnswer": 0,
    "explanation": "In \"subtle\" (/ˈsʌt.əl/), the letter \"b\" is silent."
  },
  {
    "id": "jamb-eng-bank-2020-224",
    "subject": "english",
    "subjectName": "English Language",
    "year": 2020,
    "questionNumber": 25,
    "topic": "Oral Forms & Phonology",
    "question": "(UTME 2020) Select the word with the primary stress on the THIRD syllable.",
    "options": [
      "un-der-STAND",
      "PHO-to-graph",
      "con-DI-tion",
      "E-le-phant"
    ],
    "correctAnswer": 0,
    "explanation": "\"Understand\" is stressed on the third syllable: un-der-STAND /ˌʌn.dəˈstænd/."
  },
  {
    "id": "jamb-eng-bank-2019-225",
    "subject": "english",
    "subjectName": "English Language",
    "year": 2019,
    "questionNumber": 26,
    "topic": "The Prescribed Novel: The Lekki Headmaster",
    "question": "(UTME 2019) In \"The Lekki Headmaster\", what is the attitude of Mr. Bepo towards examination malpractice?",
    "options": [
      "Absolute intolerance and strict disciplinary sanction",
      "Pragmatic compromise to protect school reputation",
      "Indifference, leaving it to class teachers",
      "Financial extortion of offenders"
    ],
    "correctAnswer": 0,
    "explanation": "Mr. Bepo embodies zero tolerance for academic fraud, emphasizing genuine mastery and moral character."
  },
  {
    "id": "jamb-eng-bank-2019-226",
    "subject": "english",
    "subjectName": "English Language",
    "year": 2019,
    "questionNumber": 27,
    "topic": "The Prescribed Novel: The Lekki Headmaster",
    "question": "(UTME 2019) In Kabir Alabi Garba's \"The Lekki Headmaster\", what societal evil is highlighted through the lifestyle of wealthy parents in Lekki?",
    "options": [
      "Using excessive wealth to bypass institutional rules and accountability",
      "Organized political terrorism",
      "Religious extremism and cult wars",
      "Traditional communal land disputes"
    ],
    "correctAnswer": 0,
    "explanation": "The novel satirizes affluent Nigerian parents who believe their financial affluence places them above institutional integrity."
  },
  {
    "id": "jamb-eng-bank-2019-227",
    "subject": "english",
    "subjectName": "English Language",
    "year": 2019,
    "questionNumber": 28,
    "topic": "Concord & Subject-Verb Agreement",
    "question": "(UTME 2019) A flock of sheep _______ grazing peacefully in the valley.",
    "options": [
      "is",
      "are",
      "were",
      "have been"
    ],
    "correctAnswer": 0,
    "explanation": "\"A flock of sheep\" has a singular collective head noun (\"A flock\") and takes a singular verb (\"is\")."
  },
  {
    "id": "jamb-eng-bank-2019-228",
    "subject": "english",
    "subjectName": "English Language",
    "year": 2019,
    "questionNumber": 29,
    "topic": "Concord & Subject-Verb Agreement",
    "question": "(UTME 2019) The majority of the committee members _______ voted in favor of the amendment.",
    "options": [
      "have",
      "has",
      "is",
      "was"
    ],
    "correctAnswer": 0,
    "explanation": "When \"majority of\" precedes a plural countable noun (\"members\"), it takes a plural verb (\"have\")."
  },
  {
    "id": "jamb-eng-bank-2019-229",
    "subject": "english",
    "subjectName": "English Language",
    "year": 2019,
    "questionNumber": 30,
    "topic": "Synonyms & Antonyms",
    "question": "(UTME 2019) Choose the word nearest in meaning to PRECARIOUS in: \"The company was in a precarious financial situation.\"",
    "options": [
      "insecure and perilous",
      "stable",
      "prosperous",
      "predictable"
    ],
    "correctAnswer": 0,
    "explanation": "\"Precarious\" means not securely held or in position; dangerously likely to fall or collapse."
  },
  {
    "id": "jamb-eng-bank-2019-230",
    "subject": "english",
    "subjectName": "English Language",
    "year": 2019,
    "questionNumber": 31,
    "topic": "Synonyms & Antonyms",
    "question": "(UTME 2019) Choose the word opposite in meaning to TACITURN in: \"The new manager was surprisingly taciturn during the staff meeting.\"",
    "options": [
      "garrulous (talkative)",
      "reserved",
      "silent",
      "timid"
    ],
    "correctAnswer": 0,
    "explanation": "\"Taciturn\" means reserved or uncommunicative in speech. The exact antonym is \"garrulous\" or \"loquacious\" (talkative)."
  },
  {
    "id": "jamb-eng-bank-2019-231",
    "subject": "english",
    "subjectName": "English Language",
    "year": 2019,
    "questionNumber": 32,
    "topic": "Oral Forms & Phonology",
    "question": "(UTME 2019) Which of the following words contains a silent \"b\"?",
    "options": [
      "subtle",
      "rubber",
      "table",
      "baker"
    ],
    "correctAnswer": 0,
    "explanation": "In \"subtle\" (/ˈsʌt.əl/), the letter \"b\" is silent."
  },
  {
    "id": "jamb-eng-bank-2019-232",
    "subject": "english",
    "subjectName": "English Language",
    "year": 2019,
    "questionNumber": 33,
    "topic": "Oral Forms & Phonology",
    "question": "(UTME 2019) Select the word with the primary stress on the THIRD syllable.",
    "options": [
      "un-der-STAND",
      "PHO-to-graph",
      "con-DI-tion",
      "E-le-phant"
    ],
    "correctAnswer": 0,
    "explanation": "\"Understand\" is stressed on the third syllable: un-der-STAND /ˌʌn.dəˈstænd/."
  },
  {
    "id": "jamb-eng-bank-2018-233",
    "subject": "english",
    "subjectName": "English Language",
    "year": 2018,
    "questionNumber": 34,
    "topic": "The Prescribed Novel: The Lekki Headmaster",
    "question": "(UTME 2018) In \"The Lekki Headmaster\", what is the attitude of Mr. Bepo towards examination malpractice?",
    "options": [
      "Absolute intolerance and strict disciplinary sanction",
      "Pragmatic compromise to protect school reputation",
      "Indifference, leaving it to class teachers",
      "Financial extortion of offenders"
    ],
    "correctAnswer": 0,
    "explanation": "Mr. Bepo embodies zero tolerance for academic fraud, emphasizing genuine mastery and moral character."
  },
  {
    "id": "jamb-eng-bank-2018-234",
    "subject": "english",
    "subjectName": "English Language",
    "year": 2018,
    "questionNumber": 35,
    "topic": "The Prescribed Novel: The Lekki Headmaster",
    "question": "(UTME 2018) In Kabir Alabi Garba's \"The Lekki Headmaster\", what societal evil is highlighted through the lifestyle of wealthy parents in Lekki?",
    "options": [
      "Using excessive wealth to bypass institutional rules and accountability",
      "Organized political terrorism",
      "Religious extremism and cult wars",
      "Traditional communal land disputes"
    ],
    "correctAnswer": 0,
    "explanation": "The novel satirizes affluent Nigerian parents who believe their financial affluence places them above institutional integrity."
  },
  {
    "id": "jamb-eng-bank-2018-235",
    "subject": "english",
    "subjectName": "English Language",
    "year": 2018,
    "questionNumber": 36,
    "topic": "Concord & Subject-Verb Agreement",
    "question": "(UTME 2018) A flock of sheep _______ grazing peacefully in the valley.",
    "options": [
      "is",
      "are",
      "were",
      "have been"
    ],
    "correctAnswer": 0,
    "explanation": "\"A flock of sheep\" has a singular collective head noun (\"A flock\") and takes a singular verb (\"is\")."
  },
  {
    "id": "jamb-eng-bank-2018-236",
    "subject": "english",
    "subjectName": "English Language",
    "year": 2018,
    "questionNumber": 37,
    "topic": "Concord & Subject-Verb Agreement",
    "question": "(UTME 2018) The majority of the committee members _______ voted in favor of the amendment.",
    "options": [
      "have",
      "has",
      "is",
      "was"
    ],
    "correctAnswer": 0,
    "explanation": "When \"majority of\" precedes a plural countable noun (\"members\"), it takes a plural verb (\"have\")."
  },
  {
    "id": "jamb-eng-bank-2018-237",
    "subject": "english",
    "subjectName": "English Language",
    "year": 2018,
    "questionNumber": 38,
    "topic": "Synonyms & Antonyms",
    "question": "(UTME 2018) Choose the word nearest in meaning to PRECARIOUS in: \"The company was in a precarious financial situation.\"",
    "options": [
      "insecure and perilous",
      "stable",
      "prosperous",
      "predictable"
    ],
    "correctAnswer": 0,
    "explanation": "\"Precarious\" means not securely held or in position; dangerously likely to fall or collapse."
  },
  {
    "id": "jamb-eng-bank-2018-238",
    "subject": "english",
    "subjectName": "English Language",
    "year": 2018,
    "questionNumber": 39,
    "topic": "Synonyms & Antonyms",
    "question": "(UTME 2018) Choose the word opposite in meaning to TACITURN in: \"The new manager was surprisingly taciturn during the staff meeting.\"",
    "options": [
      "garrulous (talkative)",
      "reserved",
      "silent",
      "timid"
    ],
    "correctAnswer": 0,
    "explanation": "\"Taciturn\" means reserved or uncommunicative in speech. The exact antonym is \"garrulous\" or \"loquacious\" (talkative)."
  },
  {
    "id": "jamb-eng-bank-2018-239",
    "subject": "english",
    "subjectName": "English Language",
    "year": 2018,
    "questionNumber": 40,
    "topic": "Oral Forms & Phonology",
    "question": "(UTME 2018) Which of the following words contains a silent \"b\"?",
    "options": [
      "subtle",
      "rubber",
      "table",
      "baker"
    ],
    "correctAnswer": 0,
    "explanation": "In \"subtle\" (/ˈsʌt.əl/), the letter \"b\" is silent."
  },
  {
    "id": "jamb-eng-bank-2018-240",
    "subject": "english",
    "subjectName": "English Language",
    "year": 2018,
    "questionNumber": 1,
    "topic": "Oral Forms & Phonology",
    "question": "(UTME 2018) Select the word with the primary stress on the THIRD syllable.",
    "options": [
      "un-der-STAND",
      "PHO-to-graph",
      "con-DI-tion",
      "E-le-phant"
    ],
    "correctAnswer": 0,
    "explanation": "\"Understand\" is stressed on the third syllable: un-der-STAND /ˌʌn.dəˈstænd/."
  },
  {
    "id": "jamb-phy-bank-2024-241",
    "subject": "physics",
    "subjectName": "Physics",
    "year": 2024,
    "questionNumber": 2,
    "topic": "Motion, Work, Energy & Power",
    "question": "(UTME 2024) A body of mass 2 kg moving with velocity 10 m/s collides with a stationary body of mass 3 kg. If they stick together, calculate their common velocity after collision.",
    "options": [
      "4.0 m/s",
      "5.0 m/s",
      "2.0 m/s",
      "6.0 m/s"
    ],
    "correctAnswer": 0,
    "explanation": "By conservation of linear momentum: m₁ u₁ + m₂ u₂ = (m₁ + m₂) v => (2)(10) + (3)(0) = (2 + 3) v => 20 = 5v => v = 4.0 m/s."
  },
  {
    "id": "jamb-phy-bank-2024-242",
    "subject": "physics",
    "subjectName": "Physics",
    "year": 2024,
    "questionNumber": 3,
    "topic": "Motion, Work, Energy & Power",
    "question": "(UTME 2024) A force of 50 N acting at an angle of 60° to the horizontal pulls a cart through a horizontal distance of 8 m. Calculate the work done.",
    "options": [
      "200 J",
      "400 J",
      "250 J",
      "150 J"
    ],
    "correctAnswer": 0,
    "explanation": "W = F d cos θ = 50 × 8 × cos 60° = 400 × 0.5 = 200 J."
  },
  {
    "id": "jamb-phy-bank-2024-243",
    "subject": "physics",
    "subjectName": "Physics",
    "year": 2024,
    "questionNumber": 4,
    "topic": "Electric Circuits & Electromagnetism",
    "question": "(UTME 2024) Two point charges of +4 μC and +9 μC are separated by a distance of 30 cm in vacuum. Calculate the electrostatic repulsive force between them. (Coulomb's constant k = 9 × 10⁹ N·m²/C²)",
    "options": [
      "3.6 N",
      "36 N",
      "0.36 N",
      "7.2 N"
    ],
    "correctAnswer": 0,
    "explanation": "F = k q₁ q₂ / r² = (9 × 10⁹ × 4 × 10⁻⁶ × 9 × 10⁻⁶) / (0.3)² = (0.324) / 0.09 = 3.6 N."
  },
  {
    "id": "jamb-phy-bank-2024-244",
    "subject": "physics",
    "subjectName": "Physics",
    "year": 2024,
    "questionNumber": 5,
    "topic": "Electric Circuits & Electromagnetism",
    "question": "(UTME 2024) A galvanometer of resistance 20 Ω gives full-scale deflection with a current of 10 mA. What shunt resistance is required to convert it to an ammeter reading up to 5 A?",
    "options": [
      "0.0401 Ω",
      "0.40 Ω",
      "4.0 Ω",
      "0.004 Ω"
    ],
    "correctAnswer": 0,
    "explanation": "I_g = 0.01 A, I_s = 5 - 0.01 = 4.99 A. S = (I_g × G) / I_s = (0.01 × 20) / 4.99 ≈ 0.2 / 4.99 ≈ 0.0401 Ω."
  },
  {
    "id": "jamb-phy-bank-2024-245",
    "subject": "physics",
    "subjectName": "Physics",
    "year": 2024,
    "questionNumber": 6,
    "topic": "Waves, Sound & Light Optics",
    "question": "(UTME 2024) Light travels from a medium of refractive index 1.5 into air. Calculate the critical angle. (Take arcsin(0.667) ≈ 41.8°)",
    "options": [
      "41.8°",
      "45.0°",
      "30.0°",
      "60.0°"
    ],
    "correctAnswer": 0,
    "explanation": "sin c = 1/n = 1/1.5 = 2/3 ≈ 0.6667. Critical angle c = arcsin(0.6667) ≈ 41.8°."
  },
  {
    "id": "jamb-phy-bank-2024-246",
    "subject": "physics",
    "subjectName": "Physics",
    "year": 2024,
    "questionNumber": 7,
    "topic": "Waves, Sound & Light Optics",
    "question": "(UTME 2024) The pitch of a sound note depends primarily on which characteristic of the sound wave?",
    "options": [
      "Frequency",
      "Amplitude",
      "Intensity",
      "Overtones / Waveform"
    ],
    "correctAnswer": 0,
    "explanation": "Pitch is the subjective perception of sound frequency, whereas loudness depends on amplitude and quality (timbre) depends on overtones."
  },
  {
    "id": "jamb-phy-bank-2023-247",
    "subject": "physics",
    "subjectName": "Physics",
    "year": 2023,
    "questionNumber": 8,
    "topic": "Motion, Work, Energy & Power",
    "question": "(UTME 2023) A body of mass 2 kg moving with velocity 10 m/s collides with a stationary body of mass 3 kg. If they stick together, calculate their common velocity after collision.",
    "options": [
      "4.0 m/s",
      "5.0 m/s",
      "2.0 m/s",
      "6.0 m/s"
    ],
    "correctAnswer": 0,
    "explanation": "By conservation of linear momentum: m₁ u₁ + m₂ u₂ = (m₁ + m₂) v => (2)(10) + (3)(0) = (2 + 3) v => 20 = 5v => v = 4.0 m/s."
  },
  {
    "id": "jamb-phy-bank-2023-248",
    "subject": "physics",
    "subjectName": "Physics",
    "year": 2023,
    "questionNumber": 9,
    "topic": "Motion, Work, Energy & Power",
    "question": "(UTME 2023) A force of 50 N acting at an angle of 60° to the horizontal pulls a cart through a horizontal distance of 8 m. Calculate the work done.",
    "options": [
      "200 J",
      "400 J",
      "250 J",
      "150 J"
    ],
    "correctAnswer": 0,
    "explanation": "W = F d cos θ = 50 × 8 × cos 60° = 400 × 0.5 = 200 J."
  },
  {
    "id": "jamb-phy-bank-2023-249",
    "subject": "physics",
    "subjectName": "Physics",
    "year": 2023,
    "questionNumber": 10,
    "topic": "Electric Circuits & Electromagnetism",
    "question": "(UTME 2023) Two point charges of +4 μC and +9 μC are separated by a distance of 30 cm in vacuum. Calculate the electrostatic repulsive force between them. (Coulomb's constant k = 9 × 10⁹ N·m²/C²)",
    "options": [
      "3.6 N",
      "36 N",
      "0.36 N",
      "7.2 N"
    ],
    "correctAnswer": 0,
    "explanation": "F = k q₁ q₂ / r² = (9 × 10⁹ × 4 × 10⁻⁶ × 9 × 10⁻⁶) / (0.3)² = (0.324) / 0.09 = 3.6 N."
  },
  {
    "id": "jamb-phy-bank-2023-250",
    "subject": "physics",
    "subjectName": "Physics",
    "year": 2023,
    "questionNumber": 11,
    "topic": "Electric Circuits & Electromagnetism",
    "question": "(UTME 2023) A galvanometer of resistance 20 Ω gives full-scale deflection with a current of 10 mA. What shunt resistance is required to convert it to an ammeter reading up to 5 A?",
    "options": [
      "0.0401 Ω",
      "0.40 Ω",
      "4.0 Ω",
      "0.004 Ω"
    ],
    "correctAnswer": 0,
    "explanation": "I_g = 0.01 A, I_s = 5 - 0.01 = 4.99 A. S = (I_g × G) / I_s = (0.01 × 20) / 4.99 ≈ 0.2 / 4.99 ≈ 0.0401 Ω."
  },
  {
    "id": "jamb-phy-bank-2023-251",
    "subject": "physics",
    "subjectName": "Physics",
    "year": 2023,
    "questionNumber": 12,
    "topic": "Waves, Sound & Light Optics",
    "question": "(UTME 2023) Light travels from a medium of refractive index 1.5 into air. Calculate the critical angle. (Take arcsin(0.667) ≈ 41.8°)",
    "options": [
      "41.8°",
      "45.0°",
      "30.0°",
      "60.0°"
    ],
    "correctAnswer": 0,
    "explanation": "sin c = 1/n = 1/1.5 = 2/3 ≈ 0.6667. Critical angle c = arcsin(0.6667) ≈ 41.8°."
  },
  {
    "id": "jamb-phy-bank-2023-252",
    "subject": "physics",
    "subjectName": "Physics",
    "year": 2023,
    "questionNumber": 13,
    "topic": "Waves, Sound & Light Optics",
    "question": "(UTME 2023) The pitch of a sound note depends primarily on which characteristic of the sound wave?",
    "options": [
      "Frequency",
      "Amplitude",
      "Intensity",
      "Overtones / Waveform"
    ],
    "correctAnswer": 0,
    "explanation": "Pitch is the subjective perception of sound frequency, whereas loudness depends on amplitude and quality (timbre) depends on overtones."
  },
  {
    "id": "jamb-phy-bank-2022-253",
    "subject": "physics",
    "subjectName": "Physics",
    "year": 2022,
    "questionNumber": 14,
    "topic": "Motion, Work, Energy & Power",
    "question": "(UTME 2022) A body of mass 2 kg moving with velocity 10 m/s collides with a stationary body of mass 3 kg. If they stick together, calculate their common velocity after collision.",
    "options": [
      "4.0 m/s",
      "5.0 m/s",
      "2.0 m/s",
      "6.0 m/s"
    ],
    "correctAnswer": 0,
    "explanation": "By conservation of linear momentum: m₁ u₁ + m₂ u₂ = (m₁ + m₂) v => (2)(10) + (3)(0) = (2 + 3) v => 20 = 5v => v = 4.0 m/s."
  },
  {
    "id": "jamb-phy-bank-2022-254",
    "subject": "physics",
    "subjectName": "Physics",
    "year": 2022,
    "questionNumber": 15,
    "topic": "Motion, Work, Energy & Power",
    "question": "(UTME 2022) A force of 50 N acting at an angle of 60° to the horizontal pulls a cart through a horizontal distance of 8 m. Calculate the work done.",
    "options": [
      "200 J",
      "400 J",
      "250 J",
      "150 J"
    ],
    "correctAnswer": 0,
    "explanation": "W = F d cos θ = 50 × 8 × cos 60° = 400 × 0.5 = 200 J."
  },
  {
    "id": "jamb-phy-bank-2022-255",
    "subject": "physics",
    "subjectName": "Physics",
    "year": 2022,
    "questionNumber": 16,
    "topic": "Electric Circuits & Electromagnetism",
    "question": "(UTME 2022) Two point charges of +4 μC and +9 μC are separated by a distance of 30 cm in vacuum. Calculate the electrostatic repulsive force between them. (Coulomb's constant k = 9 × 10⁹ N·m²/C²)",
    "options": [
      "3.6 N",
      "36 N",
      "0.36 N",
      "7.2 N"
    ],
    "correctAnswer": 0,
    "explanation": "F = k q₁ q₂ / r² = (9 × 10⁹ × 4 × 10⁻⁶ × 9 × 10⁻⁶) / (0.3)² = (0.324) / 0.09 = 3.6 N."
  },
  {
    "id": "jamb-phy-bank-2022-256",
    "subject": "physics",
    "subjectName": "Physics",
    "year": 2022,
    "questionNumber": 17,
    "topic": "Electric Circuits & Electromagnetism",
    "question": "(UTME 2022) A galvanometer of resistance 20 Ω gives full-scale deflection with a current of 10 mA. What shunt resistance is required to convert it to an ammeter reading up to 5 A?",
    "options": [
      "0.0401 Ω",
      "0.40 Ω",
      "4.0 Ω",
      "0.004 Ω"
    ],
    "correctAnswer": 0,
    "explanation": "I_g = 0.01 A, I_s = 5 - 0.01 = 4.99 A. S = (I_g × G) / I_s = (0.01 × 20) / 4.99 ≈ 0.2 / 4.99 ≈ 0.0401 Ω."
  },
  {
    "id": "jamb-phy-bank-2022-257",
    "subject": "physics",
    "subjectName": "Physics",
    "year": 2022,
    "questionNumber": 18,
    "topic": "Waves, Sound & Light Optics",
    "question": "(UTME 2022) Light travels from a medium of refractive index 1.5 into air. Calculate the critical angle. (Take arcsin(0.667) ≈ 41.8°)",
    "options": [
      "41.8°",
      "45.0°",
      "30.0°",
      "60.0°"
    ],
    "correctAnswer": 0,
    "explanation": "sin c = 1/n = 1/1.5 = 2/3 ≈ 0.6667. Critical angle c = arcsin(0.6667) ≈ 41.8°."
  },
  {
    "id": "jamb-phy-bank-2022-258",
    "subject": "physics",
    "subjectName": "Physics",
    "year": 2022,
    "questionNumber": 19,
    "topic": "Waves, Sound & Light Optics",
    "question": "(UTME 2022) The pitch of a sound note depends primarily on which characteristic of the sound wave?",
    "options": [
      "Frequency",
      "Amplitude",
      "Intensity",
      "Overtones / Waveform"
    ],
    "correctAnswer": 0,
    "explanation": "Pitch is the subjective perception of sound frequency, whereas loudness depends on amplitude and quality (timbre) depends on overtones."
  },
  {
    "id": "jamb-phy-bank-2021-259",
    "subject": "physics",
    "subjectName": "Physics",
    "year": 2021,
    "questionNumber": 20,
    "topic": "Motion, Work, Energy & Power",
    "question": "(UTME 2021) A body of mass 2 kg moving with velocity 10 m/s collides with a stationary body of mass 3 kg. If they stick together, calculate their common velocity after collision.",
    "options": [
      "4.0 m/s",
      "5.0 m/s",
      "2.0 m/s",
      "6.0 m/s"
    ],
    "correctAnswer": 0,
    "explanation": "By conservation of linear momentum: m₁ u₁ + m₂ u₂ = (m₁ + m₂) v => (2)(10) + (3)(0) = (2 + 3) v => 20 = 5v => v = 4.0 m/s."
  },
  {
    "id": "jamb-phy-bank-2021-260",
    "subject": "physics",
    "subjectName": "Physics",
    "year": 2021,
    "questionNumber": 21,
    "topic": "Motion, Work, Energy & Power",
    "question": "(UTME 2021) A force of 50 N acting at an angle of 60° to the horizontal pulls a cart through a horizontal distance of 8 m. Calculate the work done.",
    "options": [
      "200 J",
      "400 J",
      "250 J",
      "150 J"
    ],
    "correctAnswer": 0,
    "explanation": "W = F d cos θ = 50 × 8 × cos 60° = 400 × 0.5 = 200 J."
  },
  {
    "id": "jamb-phy-bank-2021-261",
    "subject": "physics",
    "subjectName": "Physics",
    "year": 2021,
    "questionNumber": 22,
    "topic": "Electric Circuits & Electromagnetism",
    "question": "(UTME 2021) Two point charges of +4 μC and +9 μC are separated by a distance of 30 cm in vacuum. Calculate the electrostatic repulsive force between them. (Coulomb's constant k = 9 × 10⁹ N·m²/C²)",
    "options": [
      "3.6 N",
      "36 N",
      "0.36 N",
      "7.2 N"
    ],
    "correctAnswer": 0,
    "explanation": "F = k q₁ q₂ / r² = (9 × 10⁹ × 4 × 10⁻⁶ × 9 × 10⁻⁶) / (0.3)² = (0.324) / 0.09 = 3.6 N."
  },
  {
    "id": "jamb-phy-bank-2021-262",
    "subject": "physics",
    "subjectName": "Physics",
    "year": 2021,
    "questionNumber": 23,
    "topic": "Electric Circuits & Electromagnetism",
    "question": "(UTME 2021) A galvanometer of resistance 20 Ω gives full-scale deflection with a current of 10 mA. What shunt resistance is required to convert it to an ammeter reading up to 5 A?",
    "options": [
      "0.0401 Ω",
      "0.40 Ω",
      "4.0 Ω",
      "0.004 Ω"
    ],
    "correctAnswer": 0,
    "explanation": "I_g = 0.01 A, I_s = 5 - 0.01 = 4.99 A. S = (I_g × G) / I_s = (0.01 × 20) / 4.99 ≈ 0.2 / 4.99 ≈ 0.0401 Ω."
  },
  {
    "id": "jamb-phy-bank-2021-263",
    "subject": "physics",
    "subjectName": "Physics",
    "year": 2021,
    "questionNumber": 24,
    "topic": "Waves, Sound & Light Optics",
    "question": "(UTME 2021) Light travels from a medium of refractive index 1.5 into air. Calculate the critical angle. (Take arcsin(0.667) ≈ 41.8°)",
    "options": [
      "41.8°",
      "45.0°",
      "30.0°",
      "60.0°"
    ],
    "correctAnswer": 0,
    "explanation": "sin c = 1/n = 1/1.5 = 2/3 ≈ 0.6667. Critical angle c = arcsin(0.6667) ≈ 41.8°."
  },
  {
    "id": "jamb-phy-bank-2021-264",
    "subject": "physics",
    "subjectName": "Physics",
    "year": 2021,
    "questionNumber": 25,
    "topic": "Waves, Sound & Light Optics",
    "question": "(UTME 2021) The pitch of a sound note depends primarily on which characteristic of the sound wave?",
    "options": [
      "Frequency",
      "Amplitude",
      "Intensity",
      "Overtones / Waveform"
    ],
    "correctAnswer": 0,
    "explanation": "Pitch is the subjective perception of sound frequency, whereas loudness depends on amplitude and quality (timbre) depends on overtones."
  },
  {
    "id": "jamb-phy-bank-2020-265",
    "subject": "physics",
    "subjectName": "Physics",
    "year": 2020,
    "questionNumber": 26,
    "topic": "Motion, Work, Energy & Power",
    "question": "(UTME 2020) A body of mass 2 kg moving with velocity 10 m/s collides with a stationary body of mass 3 kg. If they stick together, calculate their common velocity after collision.",
    "options": [
      "4.0 m/s",
      "5.0 m/s",
      "2.0 m/s",
      "6.0 m/s"
    ],
    "correctAnswer": 0,
    "explanation": "By conservation of linear momentum: m₁ u₁ + m₂ u₂ = (m₁ + m₂) v => (2)(10) + (3)(0) = (2 + 3) v => 20 = 5v => v = 4.0 m/s."
  },
  {
    "id": "jamb-phy-bank-2020-266",
    "subject": "physics",
    "subjectName": "Physics",
    "year": 2020,
    "questionNumber": 27,
    "topic": "Motion, Work, Energy & Power",
    "question": "(UTME 2020) A force of 50 N acting at an angle of 60° to the horizontal pulls a cart through a horizontal distance of 8 m. Calculate the work done.",
    "options": [
      "200 J",
      "400 J",
      "250 J",
      "150 J"
    ],
    "correctAnswer": 0,
    "explanation": "W = F d cos θ = 50 × 8 × cos 60° = 400 × 0.5 = 200 J."
  },
  {
    "id": "jamb-phy-bank-2020-267",
    "subject": "physics",
    "subjectName": "Physics",
    "year": 2020,
    "questionNumber": 28,
    "topic": "Electric Circuits & Electromagnetism",
    "question": "(UTME 2020) Two point charges of +4 μC and +9 μC are separated by a distance of 30 cm in vacuum. Calculate the electrostatic repulsive force between them. (Coulomb's constant k = 9 × 10⁹ N·m²/C²)",
    "options": [
      "3.6 N",
      "36 N",
      "0.36 N",
      "7.2 N"
    ],
    "correctAnswer": 0,
    "explanation": "F = k q₁ q₂ / r² = (9 × 10⁹ × 4 × 10⁻⁶ × 9 × 10⁻⁶) / (0.3)² = (0.324) / 0.09 = 3.6 N."
  },
  {
    "id": "jamb-phy-bank-2020-268",
    "subject": "physics",
    "subjectName": "Physics",
    "year": 2020,
    "questionNumber": 29,
    "topic": "Electric Circuits & Electromagnetism",
    "question": "(UTME 2020) A galvanometer of resistance 20 Ω gives full-scale deflection with a current of 10 mA. What shunt resistance is required to convert it to an ammeter reading up to 5 A?",
    "options": [
      "0.0401 Ω",
      "0.40 Ω",
      "4.0 Ω",
      "0.004 Ω"
    ],
    "correctAnswer": 0,
    "explanation": "I_g = 0.01 A, I_s = 5 - 0.01 = 4.99 A. S = (I_g × G) / I_s = (0.01 × 20) / 4.99 ≈ 0.2 / 4.99 ≈ 0.0401 Ω."
  },
  {
    "id": "jamb-phy-bank-2020-269",
    "subject": "physics",
    "subjectName": "Physics",
    "year": 2020,
    "questionNumber": 30,
    "topic": "Waves, Sound & Light Optics",
    "question": "(UTME 2020) Light travels from a medium of refractive index 1.5 into air. Calculate the critical angle. (Take arcsin(0.667) ≈ 41.8°)",
    "options": [
      "41.8°",
      "45.0°",
      "30.0°",
      "60.0°"
    ],
    "correctAnswer": 0,
    "explanation": "sin c = 1/n = 1/1.5 = 2/3 ≈ 0.6667. Critical angle c = arcsin(0.6667) ≈ 41.8°."
  },
  {
    "id": "jamb-phy-bank-2020-270",
    "subject": "physics",
    "subjectName": "Physics",
    "year": 2020,
    "questionNumber": 31,
    "topic": "Waves, Sound & Light Optics",
    "question": "(UTME 2020) The pitch of a sound note depends primarily on which characteristic of the sound wave?",
    "options": [
      "Frequency",
      "Amplitude",
      "Intensity",
      "Overtones / Waveform"
    ],
    "correctAnswer": 0,
    "explanation": "Pitch is the subjective perception of sound frequency, whereas loudness depends on amplitude and quality (timbre) depends on overtones."
  },
  {
    "id": "jamb-phy-bank-2019-271",
    "subject": "physics",
    "subjectName": "Physics",
    "year": 2019,
    "questionNumber": 32,
    "topic": "Motion, Work, Energy & Power",
    "question": "(UTME 2019) A body of mass 2 kg moving with velocity 10 m/s collides with a stationary body of mass 3 kg. If they stick together, calculate their common velocity after collision.",
    "options": [
      "4.0 m/s",
      "5.0 m/s",
      "2.0 m/s",
      "6.0 m/s"
    ],
    "correctAnswer": 0,
    "explanation": "By conservation of linear momentum: m₁ u₁ + m₂ u₂ = (m₁ + m₂) v => (2)(10) + (3)(0) = (2 + 3) v => 20 = 5v => v = 4.0 m/s."
  },
  {
    "id": "jamb-phy-bank-2019-272",
    "subject": "physics",
    "subjectName": "Physics",
    "year": 2019,
    "questionNumber": 33,
    "topic": "Motion, Work, Energy & Power",
    "question": "(UTME 2019) A force of 50 N acting at an angle of 60° to the horizontal pulls a cart through a horizontal distance of 8 m. Calculate the work done.",
    "options": [
      "200 J",
      "400 J",
      "250 J",
      "150 J"
    ],
    "correctAnswer": 0,
    "explanation": "W = F d cos θ = 50 × 8 × cos 60° = 400 × 0.5 = 200 J."
  },
  {
    "id": "jamb-phy-bank-2019-273",
    "subject": "physics",
    "subjectName": "Physics",
    "year": 2019,
    "questionNumber": 34,
    "topic": "Electric Circuits & Electromagnetism",
    "question": "(UTME 2019) Two point charges of +4 μC and +9 μC are separated by a distance of 30 cm in vacuum. Calculate the electrostatic repulsive force between them. (Coulomb's constant k = 9 × 10⁹ N·m²/C²)",
    "options": [
      "3.6 N",
      "36 N",
      "0.36 N",
      "7.2 N"
    ],
    "correctAnswer": 0,
    "explanation": "F = k q₁ q₂ / r² = (9 × 10⁹ × 4 × 10⁻⁶ × 9 × 10⁻⁶) / (0.3)² = (0.324) / 0.09 = 3.6 N."
  },
  {
    "id": "jamb-phy-bank-2019-274",
    "subject": "physics",
    "subjectName": "Physics",
    "year": 2019,
    "questionNumber": 35,
    "topic": "Electric Circuits & Electromagnetism",
    "question": "(UTME 2019) A galvanometer of resistance 20 Ω gives full-scale deflection with a current of 10 mA. What shunt resistance is required to convert it to an ammeter reading up to 5 A?",
    "options": [
      "0.0401 Ω",
      "0.40 Ω",
      "4.0 Ω",
      "0.004 Ω"
    ],
    "correctAnswer": 0,
    "explanation": "I_g = 0.01 A, I_s = 5 - 0.01 = 4.99 A. S = (I_g × G) / I_s = (0.01 × 20) / 4.99 ≈ 0.2 / 4.99 ≈ 0.0401 Ω."
  },
  {
    "id": "jamb-phy-bank-2019-275",
    "subject": "physics",
    "subjectName": "Physics",
    "year": 2019,
    "questionNumber": 36,
    "topic": "Waves, Sound & Light Optics",
    "question": "(UTME 2019) Light travels from a medium of refractive index 1.5 into air. Calculate the critical angle. (Take arcsin(0.667) ≈ 41.8°)",
    "options": [
      "41.8°",
      "45.0°",
      "30.0°",
      "60.0°"
    ],
    "correctAnswer": 0,
    "explanation": "sin c = 1/n = 1/1.5 = 2/3 ≈ 0.6667. Critical angle c = arcsin(0.6667) ≈ 41.8°."
  },
  {
    "id": "jamb-phy-bank-2019-276",
    "subject": "physics",
    "subjectName": "Physics",
    "year": 2019,
    "questionNumber": 37,
    "topic": "Waves, Sound & Light Optics",
    "question": "(UTME 2019) The pitch of a sound note depends primarily on which characteristic of the sound wave?",
    "options": [
      "Frequency",
      "Amplitude",
      "Intensity",
      "Overtones / Waveform"
    ],
    "correctAnswer": 0,
    "explanation": "Pitch is the subjective perception of sound frequency, whereas loudness depends on amplitude and quality (timbre) depends on overtones."
  },
  {
    "id": "jamb-phy-bank-2018-277",
    "subject": "physics",
    "subjectName": "Physics",
    "year": 2018,
    "questionNumber": 38,
    "topic": "Motion, Work, Energy & Power",
    "question": "(UTME 2018) A body of mass 2 kg moving with velocity 10 m/s collides with a stationary body of mass 3 kg. If they stick together, calculate their common velocity after collision.",
    "options": [
      "4.0 m/s",
      "5.0 m/s",
      "2.0 m/s",
      "6.0 m/s"
    ],
    "correctAnswer": 0,
    "explanation": "By conservation of linear momentum: m₁ u₁ + m₂ u₂ = (m₁ + m₂) v => (2)(10) + (3)(0) = (2 + 3) v => 20 = 5v => v = 4.0 m/s."
  },
  {
    "id": "jamb-phy-bank-2018-278",
    "subject": "physics",
    "subjectName": "Physics",
    "year": 2018,
    "questionNumber": 39,
    "topic": "Motion, Work, Energy & Power",
    "question": "(UTME 2018) A force of 50 N acting at an angle of 60° to the horizontal pulls a cart through a horizontal distance of 8 m. Calculate the work done.",
    "options": [
      "200 J",
      "400 J",
      "250 J",
      "150 J"
    ],
    "correctAnswer": 0,
    "explanation": "W = F d cos θ = 50 × 8 × cos 60° = 400 × 0.5 = 200 J."
  },
  {
    "id": "jamb-phy-bank-2018-279",
    "subject": "physics",
    "subjectName": "Physics",
    "year": 2018,
    "questionNumber": 40,
    "topic": "Electric Circuits & Electromagnetism",
    "question": "(UTME 2018) Two point charges of +4 μC and +9 μC are separated by a distance of 30 cm in vacuum. Calculate the electrostatic repulsive force between them. (Coulomb's constant k = 9 × 10⁹ N·m²/C²)",
    "options": [
      "3.6 N",
      "36 N",
      "0.36 N",
      "7.2 N"
    ],
    "correctAnswer": 0,
    "explanation": "F = k q₁ q₂ / r² = (9 × 10⁹ × 4 × 10⁻⁶ × 9 × 10⁻⁶) / (0.3)² = (0.324) / 0.09 = 3.6 N."
  },
  {
    "id": "jamb-phy-bank-2018-280",
    "subject": "physics",
    "subjectName": "Physics",
    "year": 2018,
    "questionNumber": 1,
    "topic": "Electric Circuits & Electromagnetism",
    "question": "(UTME 2018) A galvanometer of resistance 20 Ω gives full-scale deflection with a current of 10 mA. What shunt resistance is required to convert it to an ammeter reading up to 5 A?",
    "options": [
      "0.0401 Ω",
      "0.40 Ω",
      "4.0 Ω",
      "0.004 Ω"
    ],
    "correctAnswer": 0,
    "explanation": "I_g = 0.01 A, I_s = 5 - 0.01 = 4.99 A. S = (I_g × G) / I_s = (0.01 × 20) / 4.99 ≈ 0.2 / 4.99 ≈ 0.0401 Ω."
  },
  {
    "id": "jamb-phy-bank-2018-281",
    "subject": "physics",
    "subjectName": "Physics",
    "year": 2018,
    "questionNumber": 2,
    "topic": "Waves, Sound & Light Optics",
    "question": "(UTME 2018) Light travels from a medium of refractive index 1.5 into air. Calculate the critical angle. (Take arcsin(0.667) ≈ 41.8°)",
    "options": [
      "41.8°",
      "45.0°",
      "30.0°",
      "60.0°"
    ],
    "correctAnswer": 0,
    "explanation": "sin c = 1/n = 1/1.5 = 2/3 ≈ 0.6667. Critical angle c = arcsin(0.6667) ≈ 41.8°."
  },
  {
    "id": "jamb-phy-bank-2018-282",
    "subject": "physics",
    "subjectName": "Physics",
    "year": 2018,
    "questionNumber": 3,
    "topic": "Waves, Sound & Light Optics",
    "question": "(UTME 2018) The pitch of a sound note depends primarily on which characteristic of the sound wave?",
    "options": [
      "Frequency",
      "Amplitude",
      "Intensity",
      "Overtones / Waveform"
    ],
    "correctAnswer": 0,
    "explanation": "Pitch is the subjective perception of sound frequency, whereas loudness depends on amplitude and quality (timbre) depends on overtones."
  },
  {
    "id": "jamb-che-bank-2024-283",
    "subject": "chemistry",
    "subjectName": "Chemistry",
    "year": 2024,
    "questionNumber": 4,
    "topic": "Organic Chemistry & Hydrocarbons",
    "question": "(UTME 2024) Geometric (cis-trans) isomerism is exhibited by which of the following alkenes?",
    "options": [
      "But-2-ene",
      "But-1-ene",
      "Propene",
      "2-methylpropene"
    ],
    "correctAnswer": 0,
    "explanation": "But-2-ene (CH₃-CH=CH-CH₃) has two distinct substituents (-H and -CH₃) on each carbon of the double bond, permitting cis and trans geometric isomers."
  },
  {
    "id": "jamb-che-bank-2024-284",
    "subject": "chemistry",
    "subjectName": "Chemistry",
    "year": 2024,
    "questionNumber": 5,
    "topic": "Organic Chemistry & Hydrocarbons",
    "question": "(UTME 2024) The functional group present in alkanols is _______",
    "options": [
      "-OH (hydroxyl group)",
      "-COOH (carboxyl group)",
      "-CHO (aldehyde group)",
      "-CO- (carbonyl group)"
    ],
    "correctAnswer": 0,
    "explanation": "Alkanols contain the hydroxyl group (-OH) attached to a saturated carbon atom."
  },
  {
    "id": "jamb-che-bank-2024-285",
    "subject": "chemistry",
    "subjectName": "Chemistry",
    "year": 2024,
    "questionNumber": 6,
    "topic": "The Mole Concept & Stoichiometry",
    "question": "(UTME 2024) Calculate the percentage by mass of nitrogen in urea, (NH₂)₂CO. (N = 14, H = 1, C = 12, O = 16)",
    "options": [
      "46.7%",
      "28.0%",
      "35.0%",
      "52.3%"
    ],
    "correctAnswer": 0,
    "explanation": "Molar mass of (NH₂)₂CO = 2(14 + 2) + 12 + 16 = 32 + 28 = 60 g/mol. Mass of N = 2 × 14 = 28. Percentage = (28 / 60) × 100% ≈ 46.67%."
  },
  {
    "id": "jamb-che-bank-2024-286",
    "subject": "chemistry",
    "subjectName": "Chemistry",
    "year": 2024,
    "questionNumber": 7,
    "topic": "The Mole Concept & Stoichiometry",
    "question": "(UTME 2024) What volume of oxygen gas is required for the complete combustion of 5 dm³ of propane (C₃H₈)?",
    "options": [
      "25 dm³",
      "15 dm³",
      "10 dm³",
      "20 dm³"
    ],
    "correctAnswer": 0,
    "explanation": "C₃H₈ + 5O₂ → 3CO₂ + 4H₂O. 1 volume of C₃H₈ requires 5 volumes of O₂. For 5 dm³ propane, volume of O₂ = 5 × 5 = 25 dm³."
  },
  {
    "id": "jamb-che-bank-2024-287",
    "subject": "chemistry",
    "subjectName": "Chemistry",
    "year": 2024,
    "questionNumber": 8,
    "topic": "Acids, Bases & Salts",
    "question": "(UTME 2024) Which of the following oxides is amphoteric?",
    "options": [
      "Al₂O₃ (Aluminium oxide)",
      "Na₂O (Sodium oxide)",
      "SO₂ (Sulphur dioxide)",
      "CaO (Calcium oxide)"
    ],
    "correctAnswer": 0,
    "explanation": "Al₂O₃ and ZnO are amphoteric oxides, reacting with both strong acids and strong bases to produce salts and water."
  },
  {
    "id": "jamb-che-bank-2023-288",
    "subject": "chemistry",
    "subjectName": "Chemistry",
    "year": 2023,
    "questionNumber": 9,
    "topic": "Organic Chemistry & Hydrocarbons",
    "question": "(UTME 2023) Geometric (cis-trans) isomerism is exhibited by which of the following alkenes?",
    "options": [
      "But-2-ene",
      "But-1-ene",
      "Propene",
      "2-methylpropene"
    ],
    "correctAnswer": 0,
    "explanation": "But-2-ene (CH₃-CH=CH-CH₃) has two distinct substituents (-H and -CH₃) on each carbon of the double bond, permitting cis and trans geometric isomers."
  },
  {
    "id": "jamb-che-bank-2023-289",
    "subject": "chemistry",
    "subjectName": "Chemistry",
    "year": 2023,
    "questionNumber": 10,
    "topic": "Organic Chemistry & Hydrocarbons",
    "question": "(UTME 2023) The functional group present in alkanols is _______",
    "options": [
      "-OH (hydroxyl group)",
      "-COOH (carboxyl group)",
      "-CHO (aldehyde group)",
      "-CO- (carbonyl group)"
    ],
    "correctAnswer": 0,
    "explanation": "Alkanols contain the hydroxyl group (-OH) attached to a saturated carbon atom."
  },
  {
    "id": "jamb-che-bank-2023-290",
    "subject": "chemistry",
    "subjectName": "Chemistry",
    "year": 2023,
    "questionNumber": 11,
    "topic": "The Mole Concept & Stoichiometry",
    "question": "(UTME 2023) Calculate the percentage by mass of nitrogen in urea, (NH₂)₂CO. (N = 14, H = 1, C = 12, O = 16)",
    "options": [
      "46.7%",
      "28.0%",
      "35.0%",
      "52.3%"
    ],
    "correctAnswer": 0,
    "explanation": "Molar mass of (NH₂)₂CO = 2(14 + 2) + 12 + 16 = 32 + 28 = 60 g/mol. Mass of N = 2 × 14 = 28. Percentage = (28 / 60) × 100% ≈ 46.67%."
  },
  {
    "id": "jamb-che-bank-2023-291",
    "subject": "chemistry",
    "subjectName": "Chemistry",
    "year": 2023,
    "questionNumber": 12,
    "topic": "The Mole Concept & Stoichiometry",
    "question": "(UTME 2023) What volume of oxygen gas is required for the complete combustion of 5 dm³ of propane (C₃H₈)?",
    "options": [
      "25 dm³",
      "15 dm³",
      "10 dm³",
      "20 dm³"
    ],
    "correctAnswer": 0,
    "explanation": "C₃H₈ + 5O₂ → 3CO₂ + 4H₂O. 1 volume of C₃H₈ requires 5 volumes of O₂. For 5 dm³ propane, volume of O₂ = 5 × 5 = 25 dm³."
  },
  {
    "id": "jamb-che-bank-2023-292",
    "subject": "chemistry",
    "subjectName": "Chemistry",
    "year": 2023,
    "questionNumber": 13,
    "topic": "Acids, Bases & Salts",
    "question": "(UTME 2023) Which of the following oxides is amphoteric?",
    "options": [
      "Al₂O₃ (Aluminium oxide)",
      "Na₂O (Sodium oxide)",
      "SO₂ (Sulphur dioxide)",
      "CaO (Calcium oxide)"
    ],
    "correctAnswer": 0,
    "explanation": "Al₂O₃ and ZnO are amphoteric oxides, reacting with both strong acids and strong bases to produce salts and water."
  },
  {
    "id": "jamb-che-bank-2022-293",
    "subject": "chemistry",
    "subjectName": "Chemistry",
    "year": 2022,
    "questionNumber": 14,
    "topic": "Organic Chemistry & Hydrocarbons",
    "question": "(UTME 2022) Geometric (cis-trans) isomerism is exhibited by which of the following alkenes?",
    "options": [
      "But-2-ene",
      "But-1-ene",
      "Propene",
      "2-methylpropene"
    ],
    "correctAnswer": 0,
    "explanation": "But-2-ene (CH₃-CH=CH-CH₃) has two distinct substituents (-H and -CH₃) on each carbon of the double bond, permitting cis and trans geometric isomers."
  },
  {
    "id": "jamb-che-bank-2022-294",
    "subject": "chemistry",
    "subjectName": "Chemistry",
    "year": 2022,
    "questionNumber": 15,
    "topic": "Organic Chemistry & Hydrocarbons",
    "question": "(UTME 2022) The functional group present in alkanols is _______",
    "options": [
      "-OH (hydroxyl group)",
      "-COOH (carboxyl group)",
      "-CHO (aldehyde group)",
      "-CO- (carbonyl group)"
    ],
    "correctAnswer": 0,
    "explanation": "Alkanols contain the hydroxyl group (-OH) attached to a saturated carbon atom."
  },
  {
    "id": "jamb-che-bank-2022-295",
    "subject": "chemistry",
    "subjectName": "Chemistry",
    "year": 2022,
    "questionNumber": 16,
    "topic": "The Mole Concept & Stoichiometry",
    "question": "(UTME 2022) Calculate the percentage by mass of nitrogen in urea, (NH₂)₂CO. (N = 14, H = 1, C = 12, O = 16)",
    "options": [
      "46.7%",
      "28.0%",
      "35.0%",
      "52.3%"
    ],
    "correctAnswer": 0,
    "explanation": "Molar mass of (NH₂)₂CO = 2(14 + 2) + 12 + 16 = 32 + 28 = 60 g/mol. Mass of N = 2 × 14 = 28. Percentage = (28 / 60) × 100% ≈ 46.67%."
  },
  {
    "id": "jamb-che-bank-2022-296",
    "subject": "chemistry",
    "subjectName": "Chemistry",
    "year": 2022,
    "questionNumber": 17,
    "topic": "The Mole Concept & Stoichiometry",
    "question": "(UTME 2022) What volume of oxygen gas is required for the complete combustion of 5 dm³ of propane (C₃H₈)?",
    "options": [
      "25 dm³",
      "15 dm³",
      "10 dm³",
      "20 dm³"
    ],
    "correctAnswer": 0,
    "explanation": "C₃H₈ + 5O₂ → 3CO₂ + 4H₂O. 1 volume of C₃H₈ requires 5 volumes of O₂. For 5 dm³ propane, volume of O₂ = 5 × 5 = 25 dm³."
  },
  {
    "id": "jamb-che-bank-2022-297",
    "subject": "chemistry",
    "subjectName": "Chemistry",
    "year": 2022,
    "questionNumber": 18,
    "topic": "Acids, Bases & Salts",
    "question": "(UTME 2022) Which of the following oxides is amphoteric?",
    "options": [
      "Al₂O₃ (Aluminium oxide)",
      "Na₂O (Sodium oxide)",
      "SO₂ (Sulphur dioxide)",
      "CaO (Calcium oxide)"
    ],
    "correctAnswer": 0,
    "explanation": "Al₂O₃ and ZnO are amphoteric oxides, reacting with both strong acids and strong bases to produce salts and water."
  },
  {
    "id": "jamb-che-bank-2021-298",
    "subject": "chemistry",
    "subjectName": "Chemistry",
    "year": 2021,
    "questionNumber": 19,
    "topic": "Organic Chemistry & Hydrocarbons",
    "question": "(UTME 2021) Geometric (cis-trans) isomerism is exhibited by which of the following alkenes?",
    "options": [
      "But-2-ene",
      "But-1-ene",
      "Propene",
      "2-methylpropene"
    ],
    "correctAnswer": 0,
    "explanation": "But-2-ene (CH₃-CH=CH-CH₃) has two distinct substituents (-H and -CH₃) on each carbon of the double bond, permitting cis and trans geometric isomers."
  },
  {
    "id": "jamb-che-bank-2021-299",
    "subject": "chemistry",
    "subjectName": "Chemistry",
    "year": 2021,
    "questionNumber": 20,
    "topic": "Organic Chemistry & Hydrocarbons",
    "question": "(UTME 2021) The functional group present in alkanols is _______",
    "options": [
      "-OH (hydroxyl group)",
      "-COOH (carboxyl group)",
      "-CHO (aldehyde group)",
      "-CO- (carbonyl group)"
    ],
    "correctAnswer": 0,
    "explanation": "Alkanols contain the hydroxyl group (-OH) attached to a saturated carbon atom."
  },
  {
    "id": "jamb-che-bank-2021-300",
    "subject": "chemistry",
    "subjectName": "Chemistry",
    "year": 2021,
    "questionNumber": 21,
    "topic": "The Mole Concept & Stoichiometry",
    "question": "(UTME 2021) Calculate the percentage by mass of nitrogen in urea, (NH₂)₂CO. (N = 14, H = 1, C = 12, O = 16)",
    "options": [
      "46.7%",
      "28.0%",
      "35.0%",
      "52.3%"
    ],
    "correctAnswer": 0,
    "explanation": "Molar mass of (NH₂)₂CO = 2(14 + 2) + 12 + 16 = 32 + 28 = 60 g/mol. Mass of N = 2 × 14 = 28. Percentage = (28 / 60) × 100% ≈ 46.67%."
  },
  {
    "id": "jamb-che-bank-2021-301",
    "subject": "chemistry",
    "subjectName": "Chemistry",
    "year": 2021,
    "questionNumber": 22,
    "topic": "The Mole Concept & Stoichiometry",
    "question": "(UTME 2021) What volume of oxygen gas is required for the complete combustion of 5 dm³ of propane (C₃H₈)?",
    "options": [
      "25 dm³",
      "15 dm³",
      "10 dm³",
      "20 dm³"
    ],
    "correctAnswer": 0,
    "explanation": "C₃H₈ + 5O₂ → 3CO₂ + 4H₂O. 1 volume of C₃H₈ requires 5 volumes of O₂. For 5 dm³ propane, volume of O₂ = 5 × 5 = 25 dm³."
  },
  {
    "id": "jamb-che-bank-2021-302",
    "subject": "chemistry",
    "subjectName": "Chemistry",
    "year": 2021,
    "questionNumber": 23,
    "topic": "Acids, Bases & Salts",
    "question": "(UTME 2021) Which of the following oxides is amphoteric?",
    "options": [
      "Al₂O₃ (Aluminium oxide)",
      "Na₂O (Sodium oxide)",
      "SO₂ (Sulphur dioxide)",
      "CaO (Calcium oxide)"
    ],
    "correctAnswer": 0,
    "explanation": "Al₂O₃ and ZnO are amphoteric oxides, reacting with both strong acids and strong bases to produce salts and water."
  },
  {
    "id": "jamb-che-bank-2020-303",
    "subject": "chemistry",
    "subjectName": "Chemistry",
    "year": 2020,
    "questionNumber": 24,
    "topic": "Organic Chemistry & Hydrocarbons",
    "question": "(UTME 2020) Geometric (cis-trans) isomerism is exhibited by which of the following alkenes?",
    "options": [
      "But-2-ene",
      "But-1-ene",
      "Propene",
      "2-methylpropene"
    ],
    "correctAnswer": 0,
    "explanation": "But-2-ene (CH₃-CH=CH-CH₃) has two distinct substituents (-H and -CH₃) on each carbon of the double bond, permitting cis and trans geometric isomers."
  },
  {
    "id": "jamb-che-bank-2020-304",
    "subject": "chemistry",
    "subjectName": "Chemistry",
    "year": 2020,
    "questionNumber": 25,
    "topic": "Organic Chemistry & Hydrocarbons",
    "question": "(UTME 2020) The functional group present in alkanols is _______",
    "options": [
      "-OH (hydroxyl group)",
      "-COOH (carboxyl group)",
      "-CHO (aldehyde group)",
      "-CO- (carbonyl group)"
    ],
    "correctAnswer": 0,
    "explanation": "Alkanols contain the hydroxyl group (-OH) attached to a saturated carbon atom."
  },
  {
    "id": "jamb-che-bank-2020-305",
    "subject": "chemistry",
    "subjectName": "Chemistry",
    "year": 2020,
    "questionNumber": 26,
    "topic": "The Mole Concept & Stoichiometry",
    "question": "(UTME 2020) Calculate the percentage by mass of nitrogen in urea, (NH₂)₂CO. (N = 14, H = 1, C = 12, O = 16)",
    "options": [
      "46.7%",
      "28.0%",
      "35.0%",
      "52.3%"
    ],
    "correctAnswer": 0,
    "explanation": "Molar mass of (NH₂)₂CO = 2(14 + 2) + 12 + 16 = 32 + 28 = 60 g/mol. Mass of N = 2 × 14 = 28. Percentage = (28 / 60) × 100% ≈ 46.67%."
  },
  {
    "id": "jamb-che-bank-2020-306",
    "subject": "chemistry",
    "subjectName": "Chemistry",
    "year": 2020,
    "questionNumber": 27,
    "topic": "The Mole Concept & Stoichiometry",
    "question": "(UTME 2020) What volume of oxygen gas is required for the complete combustion of 5 dm³ of propane (C₃H₈)?",
    "options": [
      "25 dm³",
      "15 dm³",
      "10 dm³",
      "20 dm³"
    ],
    "correctAnswer": 0,
    "explanation": "C₃H₈ + 5O₂ → 3CO₂ + 4H₂O. 1 volume of C₃H₈ requires 5 volumes of O₂. For 5 dm³ propane, volume of O₂ = 5 × 5 = 25 dm³."
  },
  {
    "id": "jamb-che-bank-2020-307",
    "subject": "chemistry",
    "subjectName": "Chemistry",
    "year": 2020,
    "questionNumber": 28,
    "topic": "Acids, Bases & Salts",
    "question": "(UTME 2020) Which of the following oxides is amphoteric?",
    "options": [
      "Al₂O₃ (Aluminium oxide)",
      "Na₂O (Sodium oxide)",
      "SO₂ (Sulphur dioxide)",
      "CaO (Calcium oxide)"
    ],
    "correctAnswer": 0,
    "explanation": "Al₂O₃ and ZnO are amphoteric oxides, reacting with both strong acids and strong bases to produce salts and water."
  },
  {
    "id": "jamb-che-bank-2019-308",
    "subject": "chemistry",
    "subjectName": "Chemistry",
    "year": 2019,
    "questionNumber": 29,
    "topic": "Organic Chemistry & Hydrocarbons",
    "question": "(UTME 2019) Geometric (cis-trans) isomerism is exhibited by which of the following alkenes?",
    "options": [
      "But-2-ene",
      "But-1-ene",
      "Propene",
      "2-methylpropene"
    ],
    "correctAnswer": 0,
    "explanation": "But-2-ene (CH₃-CH=CH-CH₃) has two distinct substituents (-H and -CH₃) on each carbon of the double bond, permitting cis and trans geometric isomers."
  },
  {
    "id": "jamb-che-bank-2019-309",
    "subject": "chemistry",
    "subjectName": "Chemistry",
    "year": 2019,
    "questionNumber": 30,
    "topic": "Organic Chemistry & Hydrocarbons",
    "question": "(UTME 2019) The functional group present in alkanols is _______",
    "options": [
      "-OH (hydroxyl group)",
      "-COOH (carboxyl group)",
      "-CHO (aldehyde group)",
      "-CO- (carbonyl group)"
    ],
    "correctAnswer": 0,
    "explanation": "Alkanols contain the hydroxyl group (-OH) attached to a saturated carbon atom."
  },
  {
    "id": "jamb-che-bank-2019-310",
    "subject": "chemistry",
    "subjectName": "Chemistry",
    "year": 2019,
    "questionNumber": 31,
    "topic": "The Mole Concept & Stoichiometry",
    "question": "(UTME 2019) Calculate the percentage by mass of nitrogen in urea, (NH₂)₂CO. (N = 14, H = 1, C = 12, O = 16)",
    "options": [
      "46.7%",
      "28.0%",
      "35.0%",
      "52.3%"
    ],
    "correctAnswer": 0,
    "explanation": "Molar mass of (NH₂)₂CO = 2(14 + 2) + 12 + 16 = 32 + 28 = 60 g/mol. Mass of N = 2 × 14 = 28. Percentage = (28 / 60) × 100% ≈ 46.67%."
  },
  {
    "id": "jamb-che-bank-2019-311",
    "subject": "chemistry",
    "subjectName": "Chemistry",
    "year": 2019,
    "questionNumber": 32,
    "topic": "The Mole Concept & Stoichiometry",
    "question": "(UTME 2019) What volume of oxygen gas is required for the complete combustion of 5 dm³ of propane (C₃H₈)?",
    "options": [
      "25 dm³",
      "15 dm³",
      "10 dm³",
      "20 dm³"
    ],
    "correctAnswer": 0,
    "explanation": "C₃H₈ + 5O₂ → 3CO₂ + 4H₂O. 1 volume of C₃H₈ requires 5 volumes of O₂. For 5 dm³ propane, volume of O₂ = 5 × 5 = 25 dm³."
  },
  {
    "id": "jamb-che-bank-2019-312",
    "subject": "chemistry",
    "subjectName": "Chemistry",
    "year": 2019,
    "questionNumber": 33,
    "topic": "Acids, Bases & Salts",
    "question": "(UTME 2019) Which of the following oxides is amphoteric?",
    "options": [
      "Al₂O₃ (Aluminium oxide)",
      "Na₂O (Sodium oxide)",
      "SO₂ (Sulphur dioxide)",
      "CaO (Calcium oxide)"
    ],
    "correctAnswer": 0,
    "explanation": "Al₂O₃ and ZnO are amphoteric oxides, reacting with both strong acids and strong bases to produce salts and water."
  },
  {
    "id": "jamb-che-bank-2018-313",
    "subject": "chemistry",
    "subjectName": "Chemistry",
    "year": 2018,
    "questionNumber": 34,
    "topic": "Organic Chemistry & Hydrocarbons",
    "question": "(UTME 2018) Geometric (cis-trans) isomerism is exhibited by which of the following alkenes?",
    "options": [
      "But-2-ene",
      "But-1-ene",
      "Propene",
      "2-methylpropene"
    ],
    "correctAnswer": 0,
    "explanation": "But-2-ene (CH₃-CH=CH-CH₃) has two distinct substituents (-H and -CH₃) on each carbon of the double bond, permitting cis and trans geometric isomers."
  },
  {
    "id": "jamb-che-bank-2018-314",
    "subject": "chemistry",
    "subjectName": "Chemistry",
    "year": 2018,
    "questionNumber": 35,
    "topic": "Organic Chemistry & Hydrocarbons",
    "question": "(UTME 2018) The functional group present in alkanols is _______",
    "options": [
      "-OH (hydroxyl group)",
      "-COOH (carboxyl group)",
      "-CHO (aldehyde group)",
      "-CO- (carbonyl group)"
    ],
    "correctAnswer": 0,
    "explanation": "Alkanols contain the hydroxyl group (-OH) attached to a saturated carbon atom."
  },
  {
    "id": "jamb-che-bank-2018-315",
    "subject": "chemistry",
    "subjectName": "Chemistry",
    "year": 2018,
    "questionNumber": 36,
    "topic": "The Mole Concept & Stoichiometry",
    "question": "(UTME 2018) Calculate the percentage by mass of nitrogen in urea, (NH₂)₂CO. (N = 14, H = 1, C = 12, O = 16)",
    "options": [
      "46.7%",
      "28.0%",
      "35.0%",
      "52.3%"
    ],
    "correctAnswer": 0,
    "explanation": "Molar mass of (NH₂)₂CO = 2(14 + 2) + 12 + 16 = 32 + 28 = 60 g/mol. Mass of N = 2 × 14 = 28. Percentage = (28 / 60) × 100% ≈ 46.67%."
  },
  {
    "id": "jamb-che-bank-2018-316",
    "subject": "chemistry",
    "subjectName": "Chemistry",
    "year": 2018,
    "questionNumber": 37,
    "topic": "The Mole Concept & Stoichiometry",
    "question": "(UTME 2018) What volume of oxygen gas is required for the complete combustion of 5 dm³ of propane (C₃H₈)?",
    "options": [
      "25 dm³",
      "15 dm³",
      "10 dm³",
      "20 dm³"
    ],
    "correctAnswer": 0,
    "explanation": "C₃H₈ + 5O₂ → 3CO₂ + 4H₂O. 1 volume of C₃H₈ requires 5 volumes of O₂. For 5 dm³ propane, volume of O₂ = 5 × 5 = 25 dm³."
  },
  {
    "id": "jamb-che-bank-2018-317",
    "subject": "chemistry",
    "subjectName": "Chemistry",
    "year": 2018,
    "questionNumber": 38,
    "topic": "Acids, Bases & Salts",
    "question": "(UTME 2018) Which of the following oxides is amphoteric?",
    "options": [
      "Al₂O₃ (Aluminium oxide)",
      "Na₂O (Sodium oxide)",
      "SO₂ (Sulphur dioxide)",
      "CaO (Calcium oxide)"
    ],
    "correctAnswer": 0,
    "explanation": "Al₂O₃ and ZnO are amphoteric oxides, reacting with both strong acids and strong bases to produce salts and water."
  },
  {
    "id": "jamb-bio-bank-2024-318",
    "subject": "biology",
    "subjectName": "Biology",
    "year": 2024,
    "questionNumber": 39,
    "topic": "Genetics, Heredity & Variation",
    "question": "(UTME 2024) Sickle cell anemia is caused by a point mutation that results in the substitution of which amino acid in the beta-globin chain of hemoglobin?",
    "options": [
      "Glutamic acid by Valine",
      "Valine by Glutamic acid",
      "Glycine by Alanine",
      "Lysine by Leucine"
    ],
    "correctAnswer": 0,
    "explanation": "Sickle cell disease is caused by a single nucleotide substitution (GAG to GTG) replacing glutamic acid with valine at position 6 of the β-globin polypeptide."
  },
  {
    "id": "jamb-bio-bank-2024-319",
    "subject": "biology",
    "subjectName": "Biology",
    "year": 2024,
    "questionNumber": 40,
    "topic": "Genetics, Heredity & Variation",
    "question": "(UTME 2024) Which blood group in the ABO system is termed the universal recipient?",
    "options": [
      "AB",
      "O",
      "A",
      "B"
    ],
    "correctAnswer": 0,
    "explanation": "Individuals with blood group AB possess both A and B antigens on their erythrocytes and lack anti-A and anti-B antibodies in their plasma."
  },
  {
    "id": "jamb-bio-bank-2024-320",
    "subject": "biology",
    "subjectName": "Biology",
    "year": 2024,
    "questionNumber": 1,
    "topic": "Mammalian & Plant Physiology",
    "question": "(UTME 2024) The valve situated between the right atrium and the right ventricle of the mammalian heart is the _______",
    "options": [
      "tricuspid valve",
      "bicuspid (mitral) valve",
      "aortic semilunar valve",
      "pulmonary semilunar valve"
    ],
    "correctAnswer": 0,
    "explanation": "The tricuspid valve controls blood flow from the right atrium into the right ventricle, preventing backflow during ventricular systole."
  },
  {
    "id": "jamb-bio-bank-2024-321",
    "subject": "biology",
    "subjectName": "Biology",
    "year": 2024,
    "questionNumber": 2,
    "topic": "Mammalian & Plant Physiology",
    "question": "(UTME 2024) The hormone responsible for phototropic bending of shoot tips toward unilateral light is _______",
    "options": [
      "Auxin (Indole-3-acetic acid)",
      "Gibberellin",
      "Cytokinin",
      "Abscisic acid"
    ],
    "correctAnswer": 0,
    "explanation": "Auxins migrate away from light to the darker side of the shoot, stimulating cell elongation on that side and causing bending toward light."
  },
  {
    "id": "jamb-bio-bank-2023-322",
    "subject": "biology",
    "subjectName": "Biology",
    "year": 2023,
    "questionNumber": 3,
    "topic": "Genetics, Heredity & Variation",
    "question": "(UTME 2023) Sickle cell anemia is caused by a point mutation that results in the substitution of which amino acid in the beta-globin chain of hemoglobin?",
    "options": [
      "Glutamic acid by Valine",
      "Valine by Glutamic acid",
      "Glycine by Alanine",
      "Lysine by Leucine"
    ],
    "correctAnswer": 0,
    "explanation": "Sickle cell disease is caused by a single nucleotide substitution (GAG to GTG) replacing glutamic acid with valine at position 6 of the β-globin polypeptide."
  },
  {
    "id": "jamb-bio-bank-2023-323",
    "subject": "biology",
    "subjectName": "Biology",
    "year": 2023,
    "questionNumber": 4,
    "topic": "Genetics, Heredity & Variation",
    "question": "(UTME 2023) Which blood group in the ABO system is termed the universal recipient?",
    "options": [
      "AB",
      "O",
      "A",
      "B"
    ],
    "correctAnswer": 0,
    "explanation": "Individuals with blood group AB possess both A and B antigens on their erythrocytes and lack anti-A and anti-B antibodies in their plasma."
  },
  {
    "id": "jamb-bio-bank-2023-324",
    "subject": "biology",
    "subjectName": "Biology",
    "year": 2023,
    "questionNumber": 5,
    "topic": "Mammalian & Plant Physiology",
    "question": "(UTME 2023) The valve situated between the right atrium and the right ventricle of the mammalian heart is the _______",
    "options": [
      "tricuspid valve",
      "bicuspid (mitral) valve",
      "aortic semilunar valve",
      "pulmonary semilunar valve"
    ],
    "correctAnswer": 0,
    "explanation": "The tricuspid valve controls blood flow from the right atrium into the right ventricle, preventing backflow during ventricular systole."
  },
  {
    "id": "jamb-bio-bank-2023-325",
    "subject": "biology",
    "subjectName": "Biology",
    "year": 2023,
    "questionNumber": 6,
    "topic": "Mammalian & Plant Physiology",
    "question": "(UTME 2023) The hormone responsible for phototropic bending of shoot tips toward unilateral light is _______",
    "options": [
      "Auxin (Indole-3-acetic acid)",
      "Gibberellin",
      "Cytokinin",
      "Abscisic acid"
    ],
    "correctAnswer": 0,
    "explanation": "Auxins migrate away from light to the darker side of the shoot, stimulating cell elongation on that side and causing bending toward light."
  },
  {
    "id": "jamb-bio-bank-2022-326",
    "subject": "biology",
    "subjectName": "Biology",
    "year": 2022,
    "questionNumber": 7,
    "topic": "Genetics, Heredity & Variation",
    "question": "(UTME 2022) Sickle cell anemia is caused by a point mutation that results in the substitution of which amino acid in the beta-globin chain of hemoglobin?",
    "options": [
      "Glutamic acid by Valine",
      "Valine by Glutamic acid",
      "Glycine by Alanine",
      "Lysine by Leucine"
    ],
    "correctAnswer": 0,
    "explanation": "Sickle cell disease is caused by a single nucleotide substitution (GAG to GTG) replacing glutamic acid with valine at position 6 of the β-globin polypeptide."
  },
  {
    "id": "jamb-bio-bank-2022-327",
    "subject": "biology",
    "subjectName": "Biology",
    "year": 2022,
    "questionNumber": 8,
    "topic": "Genetics, Heredity & Variation",
    "question": "(UTME 2022) Which blood group in the ABO system is termed the universal recipient?",
    "options": [
      "AB",
      "O",
      "A",
      "B"
    ],
    "correctAnswer": 0,
    "explanation": "Individuals with blood group AB possess both A and B antigens on their erythrocytes and lack anti-A and anti-B antibodies in their plasma."
  },
  {
    "id": "jamb-bio-bank-2022-328",
    "subject": "biology",
    "subjectName": "Biology",
    "year": 2022,
    "questionNumber": 9,
    "topic": "Mammalian & Plant Physiology",
    "question": "(UTME 2022) The valve situated between the right atrium and the right ventricle of the mammalian heart is the _______",
    "options": [
      "tricuspid valve",
      "bicuspid (mitral) valve",
      "aortic semilunar valve",
      "pulmonary semilunar valve"
    ],
    "correctAnswer": 0,
    "explanation": "The tricuspid valve controls blood flow from the right atrium into the right ventricle, preventing backflow during ventricular systole."
  },
  {
    "id": "jamb-bio-bank-2022-329",
    "subject": "biology",
    "subjectName": "Biology",
    "year": 2022,
    "questionNumber": 10,
    "topic": "Mammalian & Plant Physiology",
    "question": "(UTME 2022) The hormone responsible for phototropic bending of shoot tips toward unilateral light is _______",
    "options": [
      "Auxin (Indole-3-acetic acid)",
      "Gibberellin",
      "Cytokinin",
      "Abscisic acid"
    ],
    "correctAnswer": 0,
    "explanation": "Auxins migrate away from light to the darker side of the shoot, stimulating cell elongation on that side and causing bending toward light."
  },
  {
    "id": "jamb-bio-bank-2021-330",
    "subject": "biology",
    "subjectName": "Biology",
    "year": 2021,
    "questionNumber": 11,
    "topic": "Genetics, Heredity & Variation",
    "question": "(UTME 2021) Sickle cell anemia is caused by a point mutation that results in the substitution of which amino acid in the beta-globin chain of hemoglobin?",
    "options": [
      "Glutamic acid by Valine",
      "Valine by Glutamic acid",
      "Glycine by Alanine",
      "Lysine by Leucine"
    ],
    "correctAnswer": 0,
    "explanation": "Sickle cell disease is caused by a single nucleotide substitution (GAG to GTG) replacing glutamic acid with valine at position 6 of the β-globin polypeptide."
  },
  {
    "id": "jamb-bio-bank-2021-331",
    "subject": "biology",
    "subjectName": "Biology",
    "year": 2021,
    "questionNumber": 12,
    "topic": "Genetics, Heredity & Variation",
    "question": "(UTME 2021) Which blood group in the ABO system is termed the universal recipient?",
    "options": [
      "AB",
      "O",
      "A",
      "B"
    ],
    "correctAnswer": 0,
    "explanation": "Individuals with blood group AB possess both A and B antigens on their erythrocytes and lack anti-A and anti-B antibodies in their plasma."
  },
  {
    "id": "jamb-bio-bank-2021-332",
    "subject": "biology",
    "subjectName": "Biology",
    "year": 2021,
    "questionNumber": 13,
    "topic": "Mammalian & Plant Physiology",
    "question": "(UTME 2021) The valve situated between the right atrium and the right ventricle of the mammalian heart is the _______",
    "options": [
      "tricuspid valve",
      "bicuspid (mitral) valve",
      "aortic semilunar valve",
      "pulmonary semilunar valve"
    ],
    "correctAnswer": 0,
    "explanation": "The tricuspid valve controls blood flow from the right atrium into the right ventricle, preventing backflow during ventricular systole."
  },
  {
    "id": "jamb-bio-bank-2021-333",
    "subject": "biology",
    "subjectName": "Biology",
    "year": 2021,
    "questionNumber": 14,
    "topic": "Mammalian & Plant Physiology",
    "question": "(UTME 2021) The hormone responsible for phototropic bending of shoot tips toward unilateral light is _______",
    "options": [
      "Auxin (Indole-3-acetic acid)",
      "Gibberellin",
      "Cytokinin",
      "Abscisic acid"
    ],
    "correctAnswer": 0,
    "explanation": "Auxins migrate away from light to the darker side of the shoot, stimulating cell elongation on that side and causing bending toward light."
  },
  {
    "id": "jamb-bio-bank-2020-334",
    "subject": "biology",
    "subjectName": "Biology",
    "year": 2020,
    "questionNumber": 15,
    "topic": "Genetics, Heredity & Variation",
    "question": "(UTME 2020) Sickle cell anemia is caused by a point mutation that results in the substitution of which amino acid in the beta-globin chain of hemoglobin?",
    "options": [
      "Glutamic acid by Valine",
      "Valine by Glutamic acid",
      "Glycine by Alanine",
      "Lysine by Leucine"
    ],
    "correctAnswer": 0,
    "explanation": "Sickle cell disease is caused by a single nucleotide substitution (GAG to GTG) replacing glutamic acid with valine at position 6 of the β-globin polypeptide."
  },
  {
    "id": "jamb-bio-bank-2020-335",
    "subject": "biology",
    "subjectName": "Biology",
    "year": 2020,
    "questionNumber": 16,
    "topic": "Genetics, Heredity & Variation",
    "question": "(UTME 2020) Which blood group in the ABO system is termed the universal recipient?",
    "options": [
      "AB",
      "O",
      "A",
      "B"
    ],
    "correctAnswer": 0,
    "explanation": "Individuals with blood group AB possess both A and B antigens on their erythrocytes and lack anti-A and anti-B antibodies in their plasma."
  },
  {
    "id": "jamb-bio-bank-2020-336",
    "subject": "biology",
    "subjectName": "Biology",
    "year": 2020,
    "questionNumber": 17,
    "topic": "Mammalian & Plant Physiology",
    "question": "(UTME 2020) The valve situated between the right atrium and the right ventricle of the mammalian heart is the _______",
    "options": [
      "tricuspid valve",
      "bicuspid (mitral) valve",
      "aortic semilunar valve",
      "pulmonary semilunar valve"
    ],
    "correctAnswer": 0,
    "explanation": "The tricuspid valve controls blood flow from the right atrium into the right ventricle, preventing backflow during ventricular systole."
  },
  {
    "id": "jamb-bio-bank-2020-337",
    "subject": "biology",
    "subjectName": "Biology",
    "year": 2020,
    "questionNumber": 18,
    "topic": "Mammalian & Plant Physiology",
    "question": "(UTME 2020) The hormone responsible for phototropic bending of shoot tips toward unilateral light is _______",
    "options": [
      "Auxin (Indole-3-acetic acid)",
      "Gibberellin",
      "Cytokinin",
      "Abscisic acid"
    ],
    "correctAnswer": 0,
    "explanation": "Auxins migrate away from light to the darker side of the shoot, stimulating cell elongation on that side and causing bending toward light."
  },
  {
    "id": "jamb-bio-bank-2019-338",
    "subject": "biology",
    "subjectName": "Biology",
    "year": 2019,
    "questionNumber": 19,
    "topic": "Genetics, Heredity & Variation",
    "question": "(UTME 2019) Sickle cell anemia is caused by a point mutation that results in the substitution of which amino acid in the beta-globin chain of hemoglobin?",
    "options": [
      "Glutamic acid by Valine",
      "Valine by Glutamic acid",
      "Glycine by Alanine",
      "Lysine by Leucine"
    ],
    "correctAnswer": 0,
    "explanation": "Sickle cell disease is caused by a single nucleotide substitution (GAG to GTG) replacing glutamic acid with valine at position 6 of the β-globin polypeptide."
  },
  {
    "id": "jamb-bio-bank-2019-339",
    "subject": "biology",
    "subjectName": "Biology",
    "year": 2019,
    "questionNumber": 20,
    "topic": "Genetics, Heredity & Variation",
    "question": "(UTME 2019) Which blood group in the ABO system is termed the universal recipient?",
    "options": [
      "AB",
      "O",
      "A",
      "B"
    ],
    "correctAnswer": 0,
    "explanation": "Individuals with blood group AB possess both A and B antigens on their erythrocytes and lack anti-A and anti-B antibodies in their plasma."
  },
  {
    "id": "jamb-bio-bank-2019-340",
    "subject": "biology",
    "subjectName": "Biology",
    "year": 2019,
    "questionNumber": 21,
    "topic": "Mammalian & Plant Physiology",
    "question": "(UTME 2019) The valve situated between the right atrium and the right ventricle of the mammalian heart is the _______",
    "options": [
      "tricuspid valve",
      "bicuspid (mitral) valve",
      "aortic semilunar valve",
      "pulmonary semilunar valve"
    ],
    "correctAnswer": 0,
    "explanation": "The tricuspid valve controls blood flow from the right atrium into the right ventricle, preventing backflow during ventricular systole."
  },
  {
    "id": "jamb-bio-bank-2019-341",
    "subject": "biology",
    "subjectName": "Biology",
    "year": 2019,
    "questionNumber": 22,
    "topic": "Mammalian & Plant Physiology",
    "question": "(UTME 2019) The hormone responsible for phototropic bending of shoot tips toward unilateral light is _______",
    "options": [
      "Auxin (Indole-3-acetic acid)",
      "Gibberellin",
      "Cytokinin",
      "Abscisic acid"
    ],
    "correctAnswer": 0,
    "explanation": "Auxins migrate away from light to the darker side of the shoot, stimulating cell elongation on that side and causing bending toward light."
  },
  {
    "id": "jamb-bio-bank-2018-342",
    "subject": "biology",
    "subjectName": "Biology",
    "year": 2018,
    "questionNumber": 23,
    "topic": "Genetics, Heredity & Variation",
    "question": "(UTME 2018) Sickle cell anemia is caused by a point mutation that results in the substitution of which amino acid in the beta-globin chain of hemoglobin?",
    "options": [
      "Glutamic acid by Valine",
      "Valine by Glutamic acid",
      "Glycine by Alanine",
      "Lysine by Leucine"
    ],
    "correctAnswer": 0,
    "explanation": "Sickle cell disease is caused by a single nucleotide substitution (GAG to GTG) replacing glutamic acid with valine at position 6 of the β-globin polypeptide."
  },
  {
    "id": "jamb-bio-bank-2018-343",
    "subject": "biology",
    "subjectName": "Biology",
    "year": 2018,
    "questionNumber": 24,
    "topic": "Genetics, Heredity & Variation",
    "question": "(UTME 2018) Which blood group in the ABO system is termed the universal recipient?",
    "options": [
      "AB",
      "O",
      "A",
      "B"
    ],
    "correctAnswer": 0,
    "explanation": "Individuals with blood group AB possess both A and B antigens on their erythrocytes and lack anti-A and anti-B antibodies in their plasma."
  },
  {
    "id": "jamb-bio-bank-2018-344",
    "subject": "biology",
    "subjectName": "Biology",
    "year": 2018,
    "questionNumber": 25,
    "topic": "Mammalian & Plant Physiology",
    "question": "(UTME 2018) The valve situated between the right atrium and the right ventricle of the mammalian heart is the _______",
    "options": [
      "tricuspid valve",
      "bicuspid (mitral) valve",
      "aortic semilunar valve",
      "pulmonary semilunar valve"
    ],
    "correctAnswer": 0,
    "explanation": "The tricuspid valve controls blood flow from the right atrium into the right ventricle, preventing backflow during ventricular systole."
  },
  {
    "id": "jamb-bio-bank-2018-345",
    "subject": "biology",
    "subjectName": "Biology",
    "year": 2018,
    "questionNumber": 26,
    "topic": "Mammalian & Plant Physiology",
    "question": "(UTME 2018) The hormone responsible for phototropic bending of shoot tips toward unilateral light is _______",
    "options": [
      "Auxin (Indole-3-acetic acid)",
      "Gibberellin",
      "Cytokinin",
      "Abscisic acid"
    ],
    "correctAnswer": 0,
    "explanation": "Auxins migrate away from light to the darker side of the shoot, stimulating cell elongation on that side and causing bending toward light."
  },
  {
    "id": "jamb-eco-bank-2024-346",
    "subject": "economics",
    "subjectName": "Economics",
    "year": 2024,
    "questionNumber": 27,
    "topic": "Demand, Supply & Elasticity",
    "question": "(UTME 2024) A rightward shift of the entire supply curve of cocoa beans can be caused by _______",
    "options": [
      "an improvement in farming technology or favorable weather conditions",
      "an increase in production input wages",
      "a decrease in the market price of cocoa",
      "an increase in sales tax"
    ],
    "correctAnswer": 0,
    "explanation": "Technological improvements and bumper harvests lower production costs and increase supply at every price level, shifting the curve rightward."
  },
  {
    "id": "jamb-eco-bank-2024-347",
    "subject": "economics",
    "subjectName": "Economics",
    "year": 2024,
    "questionNumber": 28,
    "topic": "Demand, Supply & Elasticity",
    "question": "(UTME 2024) If cross elasticity of demand between goods X and Y is positive, goods X and Y are _______",
    "options": [
      "substitutes",
      "complements",
      "inferior goods",
      "luxury goods"
    ],
    "correctAnswer": 0,
    "explanation": "A positive cross-price elasticity means that an increase in the price of good Y causes an increase in demand for good X, signifying they are substitutes."
  },
  {
    "id": "jamb-eco-bank-2024-348",
    "subject": "economics",
    "subjectName": "Economics",
    "year": 2024,
    "questionNumber": 29,
    "topic": "National Income Accounting & Inflation",
    "question": "(UTME 2024) The total value of all final goods and services produced within the geographic borders of a country over a specific period is called _______",
    "options": [
      "Gross Domestic Product (GDP)",
      "Gross National Product (GNP)",
      "Net National Income",
      "Personal Disposable Income"
    ],
    "correctAnswer": 0,
    "explanation": "GDP measures domestic output within national borders, irrespective of the nationality of the resource owners."
  },
  {
    "id": "jamb-eco-bank-2023-349",
    "subject": "economics",
    "subjectName": "Economics",
    "year": 2023,
    "questionNumber": 30,
    "topic": "Demand, Supply & Elasticity",
    "question": "(UTME 2023) A rightward shift of the entire supply curve of cocoa beans can be caused by _______",
    "options": [
      "an improvement in farming technology or favorable weather conditions",
      "an increase in production input wages",
      "a decrease in the market price of cocoa",
      "an increase in sales tax"
    ],
    "correctAnswer": 0,
    "explanation": "Technological improvements and bumper harvests lower production costs and increase supply at every price level, shifting the curve rightward."
  },
  {
    "id": "jamb-eco-bank-2023-350",
    "subject": "economics",
    "subjectName": "Economics",
    "year": 2023,
    "questionNumber": 31,
    "topic": "Demand, Supply & Elasticity",
    "question": "(UTME 2023) If cross elasticity of demand between goods X and Y is positive, goods X and Y are _______",
    "options": [
      "substitutes",
      "complements",
      "inferior goods",
      "luxury goods"
    ],
    "correctAnswer": 0,
    "explanation": "A positive cross-price elasticity means that an increase in the price of good Y causes an increase in demand for good X, signifying they are substitutes."
  },
  {
    "id": "jamb-eco-bank-2023-351",
    "subject": "economics",
    "subjectName": "Economics",
    "year": 2023,
    "questionNumber": 32,
    "topic": "National Income Accounting & Inflation",
    "question": "(UTME 2023) The total value of all final goods and services produced within the geographic borders of a country over a specific period is called _______",
    "options": [
      "Gross Domestic Product (GDP)",
      "Gross National Product (GNP)",
      "Net National Income",
      "Personal Disposable Income"
    ],
    "correctAnswer": 0,
    "explanation": "GDP measures domestic output within national borders, irrespective of the nationality of the resource owners."
  },
  {
    "id": "jamb-eco-bank-2022-352",
    "subject": "economics",
    "subjectName": "Economics",
    "year": 2022,
    "questionNumber": 33,
    "topic": "Demand, Supply & Elasticity",
    "question": "(UTME 2022) A rightward shift of the entire supply curve of cocoa beans can be caused by _______",
    "options": [
      "an improvement in farming technology or favorable weather conditions",
      "an increase in production input wages",
      "a decrease in the market price of cocoa",
      "an increase in sales tax"
    ],
    "correctAnswer": 0,
    "explanation": "Technological improvements and bumper harvests lower production costs and increase supply at every price level, shifting the curve rightward."
  },
  {
    "id": "jamb-eco-bank-2022-353",
    "subject": "economics",
    "subjectName": "Economics",
    "year": 2022,
    "questionNumber": 34,
    "topic": "Demand, Supply & Elasticity",
    "question": "(UTME 2022) If cross elasticity of demand between goods X and Y is positive, goods X and Y are _______",
    "options": [
      "substitutes",
      "complements",
      "inferior goods",
      "luxury goods"
    ],
    "correctAnswer": 0,
    "explanation": "A positive cross-price elasticity means that an increase in the price of good Y causes an increase in demand for good X, signifying they are substitutes."
  },
  {
    "id": "jamb-eco-bank-2022-354",
    "subject": "economics",
    "subjectName": "Economics",
    "year": 2022,
    "questionNumber": 35,
    "topic": "National Income Accounting & Inflation",
    "question": "(UTME 2022) The total value of all final goods and services produced within the geographic borders of a country over a specific period is called _______",
    "options": [
      "Gross Domestic Product (GDP)",
      "Gross National Product (GNP)",
      "Net National Income",
      "Personal Disposable Income"
    ],
    "correctAnswer": 0,
    "explanation": "GDP measures domestic output within national borders, irrespective of the nationality of the resource owners."
  },
  {
    "id": "jamb-eco-bank-2021-355",
    "subject": "economics",
    "subjectName": "Economics",
    "year": 2021,
    "questionNumber": 36,
    "topic": "Demand, Supply & Elasticity",
    "question": "(UTME 2021) A rightward shift of the entire supply curve of cocoa beans can be caused by _______",
    "options": [
      "an improvement in farming technology or favorable weather conditions",
      "an increase in production input wages",
      "a decrease in the market price of cocoa",
      "an increase in sales tax"
    ],
    "correctAnswer": 0,
    "explanation": "Technological improvements and bumper harvests lower production costs and increase supply at every price level, shifting the curve rightward."
  },
  {
    "id": "jamb-eco-bank-2021-356",
    "subject": "economics",
    "subjectName": "Economics",
    "year": 2021,
    "questionNumber": 37,
    "topic": "Demand, Supply & Elasticity",
    "question": "(UTME 2021) If cross elasticity of demand between goods X and Y is positive, goods X and Y are _______",
    "options": [
      "substitutes",
      "complements",
      "inferior goods",
      "luxury goods"
    ],
    "correctAnswer": 0,
    "explanation": "A positive cross-price elasticity means that an increase in the price of good Y causes an increase in demand for good X, signifying they are substitutes."
  },
  {
    "id": "jamb-eco-bank-2021-357",
    "subject": "economics",
    "subjectName": "Economics",
    "year": 2021,
    "questionNumber": 38,
    "topic": "National Income Accounting & Inflation",
    "question": "(UTME 2021) The total value of all final goods and services produced within the geographic borders of a country over a specific period is called _______",
    "options": [
      "Gross Domestic Product (GDP)",
      "Gross National Product (GNP)",
      "Net National Income",
      "Personal Disposable Income"
    ],
    "correctAnswer": 0,
    "explanation": "GDP measures domestic output within national borders, irrespective of the nationality of the resource owners."
  },
  {
    "id": "jamb-eco-bank-2020-358",
    "subject": "economics",
    "subjectName": "Economics",
    "year": 2020,
    "questionNumber": 39,
    "topic": "Demand, Supply & Elasticity",
    "question": "(UTME 2020) A rightward shift of the entire supply curve of cocoa beans can be caused by _______",
    "options": [
      "an improvement in farming technology or favorable weather conditions",
      "an increase in production input wages",
      "a decrease in the market price of cocoa",
      "an increase in sales tax"
    ],
    "correctAnswer": 0,
    "explanation": "Technological improvements and bumper harvests lower production costs and increase supply at every price level, shifting the curve rightward."
  },
  {
    "id": "jamb-eco-bank-2020-359",
    "subject": "economics",
    "subjectName": "Economics",
    "year": 2020,
    "questionNumber": 40,
    "topic": "Demand, Supply & Elasticity",
    "question": "(UTME 2020) If cross elasticity of demand between goods X and Y is positive, goods X and Y are _______",
    "options": [
      "substitutes",
      "complements",
      "inferior goods",
      "luxury goods"
    ],
    "correctAnswer": 0,
    "explanation": "A positive cross-price elasticity means that an increase in the price of good Y causes an increase in demand for good X, signifying they are substitutes."
  },
  {
    "id": "jamb-eco-bank-2020-360",
    "subject": "economics",
    "subjectName": "Economics",
    "year": 2020,
    "questionNumber": 1,
    "topic": "National Income Accounting & Inflation",
    "question": "(UTME 2020) The total value of all final goods and services produced within the geographic borders of a country over a specific period is called _______",
    "options": [
      "Gross Domestic Product (GDP)",
      "Gross National Product (GNP)",
      "Net National Income",
      "Personal Disposable Income"
    ],
    "correctAnswer": 0,
    "explanation": "GDP measures domestic output within national borders, irrespective of the nationality of the resource owners."
  },
  {
    "id": "jamb-eco-bank-2019-361",
    "subject": "economics",
    "subjectName": "Economics",
    "year": 2019,
    "questionNumber": 2,
    "topic": "Demand, Supply & Elasticity",
    "question": "(UTME 2019) A rightward shift of the entire supply curve of cocoa beans can be caused by _______",
    "options": [
      "an improvement in farming technology or favorable weather conditions",
      "an increase in production input wages",
      "a decrease in the market price of cocoa",
      "an increase in sales tax"
    ],
    "correctAnswer": 0,
    "explanation": "Technological improvements and bumper harvests lower production costs and increase supply at every price level, shifting the curve rightward."
  },
  {
    "id": "jamb-eco-bank-2019-362",
    "subject": "economics",
    "subjectName": "Economics",
    "year": 2019,
    "questionNumber": 3,
    "topic": "Demand, Supply & Elasticity",
    "question": "(UTME 2019) If cross elasticity of demand between goods X and Y is positive, goods X and Y are _______",
    "options": [
      "substitutes",
      "complements",
      "inferior goods",
      "luxury goods"
    ],
    "correctAnswer": 0,
    "explanation": "A positive cross-price elasticity means that an increase in the price of good Y causes an increase in demand for good X, signifying they are substitutes."
  },
  {
    "id": "jamb-eco-bank-2019-363",
    "subject": "economics",
    "subjectName": "Economics",
    "year": 2019,
    "questionNumber": 4,
    "topic": "National Income Accounting & Inflation",
    "question": "(UTME 2019) The total value of all final goods and services produced within the geographic borders of a country over a specific period is called _______",
    "options": [
      "Gross Domestic Product (GDP)",
      "Gross National Product (GNP)",
      "Net National Income",
      "Personal Disposable Income"
    ],
    "correctAnswer": 0,
    "explanation": "GDP measures domestic output within national borders, irrespective of the nationality of the resource owners."
  },
  {
    "id": "jamb-eco-bank-2018-364",
    "subject": "economics",
    "subjectName": "Economics",
    "year": 2018,
    "questionNumber": 5,
    "topic": "Demand, Supply & Elasticity",
    "question": "(UTME 2018) A rightward shift of the entire supply curve of cocoa beans can be caused by _______",
    "options": [
      "an improvement in farming technology or favorable weather conditions",
      "an increase in production input wages",
      "a decrease in the market price of cocoa",
      "an increase in sales tax"
    ],
    "correctAnswer": 0,
    "explanation": "Technological improvements and bumper harvests lower production costs and increase supply at every price level, shifting the curve rightward."
  },
  {
    "id": "jamb-eco-bank-2018-365",
    "subject": "economics",
    "subjectName": "Economics",
    "year": 2018,
    "questionNumber": 6,
    "topic": "Demand, Supply & Elasticity",
    "question": "(UTME 2018) If cross elasticity of demand between goods X and Y is positive, goods X and Y are _______",
    "options": [
      "substitutes",
      "complements",
      "inferior goods",
      "luxury goods"
    ],
    "correctAnswer": 0,
    "explanation": "A positive cross-price elasticity means that an increase in the price of good Y causes an increase in demand for good X, signifying they are substitutes."
  },
  {
    "id": "jamb-eco-bank-2018-366",
    "subject": "economics",
    "subjectName": "Economics",
    "year": 2018,
    "questionNumber": 7,
    "topic": "National Income Accounting & Inflation",
    "question": "(UTME 2018) The total value of all final goods and services produced within the geographic borders of a country over a specific period is called _______",
    "options": [
      "Gross Domestic Product (GDP)",
      "Gross National Product (GNP)",
      "Net National Income",
      "Personal Disposable Income"
    ],
    "correctAnswer": 0,
    "explanation": "GDP measures domestic output within national borders, irrespective of the nationality of the resource owners."
  },
  {
    "id": "jamb-gov-bank-2024-367",
    "subject": "government",
    "subjectName": "Government",
    "year": 2024,
    "questionNumber": 8,
    "topic": "Basic Concepts: Sovereignty, Power & Rule of Law",
    "question": "(UTME 2024) Which French political philosopher formulated the classical doctrine of Separation of Powers in his treatise \"The Spirit of the Laws\"?",
    "options": [
      "Baron de Montesquieu",
      "Jean-Jacques Rousseau",
      "John Locke",
      "Thomas Hobbes"
    ],
    "correctAnswer": 0,
    "explanation": "Montesquieu proposed that legislative, executive, and judicial powers must be separated to prevent tyranny."
  },
  {
    "id": "jamb-gov-bank-2024-368",
    "subject": "government",
    "subjectName": "Government",
    "year": 2024,
    "questionNumber": 9,
    "topic": "Basic Concepts: Sovereignty, Power & Rule of Law",
    "question": "(UTME 2024) The power of a government to govern that is acknowledged and accepted by the citizens as right and lawful is known as _______",
    "options": [
      "Legitimacy",
      "Coercion",
      "Sovereignty",
      "Influence"
    ],
    "correctAnswer": 0,
    "explanation": "Legitimacy denotes the popular acceptance and moral authority of a governing regime."
  },
  {
    "id": "jamb-gov-bank-2023-369",
    "subject": "government",
    "subjectName": "Government",
    "year": 2023,
    "questionNumber": 10,
    "topic": "Basic Concepts: Sovereignty, Power & Rule of Law",
    "question": "(UTME 2023) Which French political philosopher formulated the classical doctrine of Separation of Powers in his treatise \"The Spirit of the Laws\"?",
    "options": [
      "Baron de Montesquieu",
      "Jean-Jacques Rousseau",
      "John Locke",
      "Thomas Hobbes"
    ],
    "correctAnswer": 0,
    "explanation": "Montesquieu proposed that legislative, executive, and judicial powers must be separated to prevent tyranny."
  },
  {
    "id": "jamb-gov-bank-2023-370",
    "subject": "government",
    "subjectName": "Government",
    "year": 2023,
    "questionNumber": 11,
    "topic": "Basic Concepts: Sovereignty, Power & Rule of Law",
    "question": "(UTME 2023) The power of a government to govern that is acknowledged and accepted by the citizens as right and lawful is known as _______",
    "options": [
      "Legitimacy",
      "Coercion",
      "Sovereignty",
      "Influence"
    ],
    "correctAnswer": 0,
    "explanation": "Legitimacy denotes the popular acceptance and moral authority of a governing regime."
  },
  {
    "id": "jamb-gov-bank-2022-371",
    "subject": "government",
    "subjectName": "Government",
    "year": 2022,
    "questionNumber": 12,
    "topic": "Basic Concepts: Sovereignty, Power & Rule of Law",
    "question": "(UTME 2022) Which French political philosopher formulated the classical doctrine of Separation of Powers in his treatise \"The Spirit of the Laws\"?",
    "options": [
      "Baron de Montesquieu",
      "Jean-Jacques Rousseau",
      "John Locke",
      "Thomas Hobbes"
    ],
    "correctAnswer": 0,
    "explanation": "Montesquieu proposed that legislative, executive, and judicial powers must be separated to prevent tyranny."
  },
  {
    "id": "jamb-gov-bank-2022-372",
    "subject": "government",
    "subjectName": "Government",
    "year": 2022,
    "questionNumber": 13,
    "topic": "Basic Concepts: Sovereignty, Power & Rule of Law",
    "question": "(UTME 2022) The power of a government to govern that is acknowledged and accepted by the citizens as right and lawful is known as _______",
    "options": [
      "Legitimacy",
      "Coercion",
      "Sovereignty",
      "Influence"
    ],
    "correctAnswer": 0,
    "explanation": "Legitimacy denotes the popular acceptance and moral authority of a governing regime."
  },
  {
    "id": "jamb-gov-bank-2021-373",
    "subject": "government",
    "subjectName": "Government",
    "year": 2021,
    "questionNumber": 14,
    "topic": "Basic Concepts: Sovereignty, Power & Rule of Law",
    "question": "(UTME 2021) Which French political philosopher formulated the classical doctrine of Separation of Powers in his treatise \"The Spirit of the Laws\"?",
    "options": [
      "Baron de Montesquieu",
      "Jean-Jacques Rousseau",
      "John Locke",
      "Thomas Hobbes"
    ],
    "correctAnswer": 0,
    "explanation": "Montesquieu proposed that legislative, executive, and judicial powers must be separated to prevent tyranny."
  },
  {
    "id": "jamb-gov-bank-2021-374",
    "subject": "government",
    "subjectName": "Government",
    "year": 2021,
    "questionNumber": 15,
    "topic": "Basic Concepts: Sovereignty, Power & Rule of Law",
    "question": "(UTME 2021) The power of a government to govern that is acknowledged and accepted by the citizens as right and lawful is known as _______",
    "options": [
      "Legitimacy",
      "Coercion",
      "Sovereignty",
      "Influence"
    ],
    "correctAnswer": 0,
    "explanation": "Legitimacy denotes the popular acceptance and moral authority of a governing regime."
  },
  {
    "id": "jamb-gov-bank-2020-375",
    "subject": "government",
    "subjectName": "Government",
    "year": 2020,
    "questionNumber": 16,
    "topic": "Basic Concepts: Sovereignty, Power & Rule of Law",
    "question": "(UTME 2020) Which French political philosopher formulated the classical doctrine of Separation of Powers in his treatise \"The Spirit of the Laws\"?",
    "options": [
      "Baron de Montesquieu",
      "Jean-Jacques Rousseau",
      "John Locke",
      "Thomas Hobbes"
    ],
    "correctAnswer": 0,
    "explanation": "Montesquieu proposed that legislative, executive, and judicial powers must be separated to prevent tyranny."
  },
  {
    "id": "jamb-gov-bank-2020-376",
    "subject": "government",
    "subjectName": "Government",
    "year": 2020,
    "questionNumber": 17,
    "topic": "Basic Concepts: Sovereignty, Power & Rule of Law",
    "question": "(UTME 2020) The power of a government to govern that is acknowledged and accepted by the citizens as right and lawful is known as _______",
    "options": [
      "Legitimacy",
      "Coercion",
      "Sovereignty",
      "Influence"
    ],
    "correctAnswer": 0,
    "explanation": "Legitimacy denotes the popular acceptance and moral authority of a governing regime."
  },
  {
    "id": "jamb-gov-bank-2019-377",
    "subject": "government",
    "subjectName": "Government",
    "year": 2019,
    "questionNumber": 18,
    "topic": "Basic Concepts: Sovereignty, Power & Rule of Law",
    "question": "(UTME 2019) Which French political philosopher formulated the classical doctrine of Separation of Powers in his treatise \"The Spirit of the Laws\"?",
    "options": [
      "Baron de Montesquieu",
      "Jean-Jacques Rousseau",
      "John Locke",
      "Thomas Hobbes"
    ],
    "correctAnswer": 0,
    "explanation": "Montesquieu proposed that legislative, executive, and judicial powers must be separated to prevent tyranny."
  },
  {
    "id": "jamb-gov-bank-2019-378",
    "subject": "government",
    "subjectName": "Government",
    "year": 2019,
    "questionNumber": 19,
    "topic": "Basic Concepts: Sovereignty, Power & Rule of Law",
    "question": "(UTME 2019) The power of a government to govern that is acknowledged and accepted by the citizens as right and lawful is known as _______",
    "options": [
      "Legitimacy",
      "Coercion",
      "Sovereignty",
      "Influence"
    ],
    "correctAnswer": 0,
    "explanation": "Legitimacy denotes the popular acceptance and moral authority of a governing regime."
  },
  {
    "id": "jamb-gov-bank-2018-379",
    "subject": "government",
    "subjectName": "Government",
    "year": 2018,
    "questionNumber": 20,
    "topic": "Basic Concepts: Sovereignty, Power & Rule of Law",
    "question": "(UTME 2018) Which French political philosopher formulated the classical doctrine of Separation of Powers in his treatise \"The Spirit of the Laws\"?",
    "options": [
      "Baron de Montesquieu",
      "Jean-Jacques Rousseau",
      "John Locke",
      "Thomas Hobbes"
    ],
    "correctAnswer": 0,
    "explanation": "Montesquieu proposed that legislative, executive, and judicial powers must be separated to prevent tyranny."
  },
  {
    "id": "jamb-gov-bank-2018-380",
    "subject": "government",
    "subjectName": "Government",
    "year": 2018,
    "questionNumber": 21,
    "topic": "Basic Concepts: Sovereignty, Power & Rule of Law",
    "question": "(UTME 2018) The power of a government to govern that is acknowledged and accepted by the citizens as right and lawful is known as _______",
    "options": [
      "Legitimacy",
      "Coercion",
      "Sovereignty",
      "Influence"
    ],
    "correctAnswer": 0,
    "explanation": "Legitimacy denotes the popular acceptance and moral authority of a governing regime."
  },
  {
    "id": "jamb-com-bank-2024-381",
    "subject": "commerce",
    "subjectName": "Commerce",
    "year": 2024,
    "questionNumber": 22,
    "topic": "Trade & Commerce",
    "question": "(UTME 2024) The export of goods at prices lower than the price charged in the home market or below production cost is known in international trade as _______",
    "options": [
      "dumping",
      "entrepot trade",
      "customs bonding",
      "counter-trade"
    ],
    "correctAnswer": 0,
    "explanation": "Dumping is a predatory international pricing strategy where exported goods are sold abroad below fair domestic market price."
  },
  {
    "id": "jamb-com-bank-2023-382",
    "subject": "commerce",
    "subjectName": "Commerce",
    "year": 2023,
    "questionNumber": 23,
    "topic": "Trade & Commerce",
    "question": "(UTME 2023) The export of goods at prices lower than the price charged in the home market or below production cost is known in international trade as _______",
    "options": [
      "dumping",
      "entrepot trade",
      "customs bonding",
      "counter-trade"
    ],
    "correctAnswer": 0,
    "explanation": "Dumping is a predatory international pricing strategy where exported goods are sold abroad below fair domestic market price."
  },
  {
    "id": "jamb-com-bank-2022-383",
    "subject": "commerce",
    "subjectName": "Commerce",
    "year": 2022,
    "questionNumber": 24,
    "topic": "Trade & Commerce",
    "question": "(UTME 2022) The export of goods at prices lower than the price charged in the home market or below production cost is known in international trade as _______",
    "options": [
      "dumping",
      "entrepot trade",
      "customs bonding",
      "counter-trade"
    ],
    "correctAnswer": 0,
    "explanation": "Dumping is a predatory international pricing strategy where exported goods are sold abroad below fair domestic market price."
  },
  {
    "id": "jamb-com-bank-2021-384",
    "subject": "commerce",
    "subjectName": "Commerce",
    "year": 2021,
    "questionNumber": 25,
    "topic": "Trade & Commerce",
    "question": "(UTME 2021) The export of goods at prices lower than the price charged in the home market or below production cost is known in international trade as _______",
    "options": [
      "dumping",
      "entrepot trade",
      "customs bonding",
      "counter-trade"
    ],
    "correctAnswer": 0,
    "explanation": "Dumping is a predatory international pricing strategy where exported goods are sold abroad below fair domestic market price."
  },
  {
    "id": "jamb-com-bank-2020-385",
    "subject": "commerce",
    "subjectName": "Commerce",
    "year": 2020,
    "questionNumber": 26,
    "topic": "Trade & Commerce",
    "question": "(UTME 2020) The export of goods at prices lower than the price charged in the home market or below production cost is known in international trade as _______",
    "options": [
      "dumping",
      "entrepot trade",
      "customs bonding",
      "counter-trade"
    ],
    "correctAnswer": 0,
    "explanation": "Dumping is a predatory international pricing strategy where exported goods are sold abroad below fair domestic market price."
  },
  {
    "id": "jamb-com-bank-2019-386",
    "subject": "commerce",
    "subjectName": "Commerce",
    "year": 2019,
    "questionNumber": 27,
    "topic": "Trade & Commerce",
    "question": "(UTME 2019) The export of goods at prices lower than the price charged in the home market or below production cost is known in international trade as _______",
    "options": [
      "dumping",
      "entrepot trade",
      "customs bonding",
      "counter-trade"
    ],
    "correctAnswer": 0,
    "explanation": "Dumping is a predatory international pricing strategy where exported goods are sold abroad below fair domestic market price."
  },
  {
    "id": "jamb-com-bank-2018-387",
    "subject": "commerce",
    "subjectName": "Commerce",
    "year": 2018,
    "questionNumber": 28,
    "topic": "Trade & Commerce",
    "question": "(UTME 2018) The export of goods at prices lower than the price charged in the home market or below production cost is known in international trade as _______",
    "options": [
      "dumping",
      "entrepot trade",
      "customs bonding",
      "counter-trade"
    ],
    "correctAnswer": 0,
    "explanation": "Dumping is a predatory international pricing strategy where exported goods are sold abroad below fair domestic market price."
  },
  {
    "id": "jamb-acc-bank-2024-388",
    "subject": "accounts",
    "subjectName": "Principles of Accounts",
    "year": 2024,
    "questionNumber": 29,
    "topic": "Bookkeeping & Ledger Entries",
    "question": "(UTME 2024) The petty cash fund is operated under which system where the cashier is reimbursed the exact total amount spent during the period?",
    "options": [
      "Imprest System",
      "Double Entry System",
      "Single Entry System",
      "Accrual System"
    ],
    "correctAnswer": 0,
    "explanation": "Under the Imprest System, the petty cashier receives a fixed float and is periodically reimbursed the exact sum expended."
  },
  {
    "id": "jamb-acc-bank-2023-389",
    "subject": "accounts",
    "subjectName": "Principles of Accounts",
    "year": 2023,
    "questionNumber": 30,
    "topic": "Bookkeeping & Ledger Entries",
    "question": "(UTME 2023) The petty cash fund is operated under which system where the cashier is reimbursed the exact total amount spent during the period?",
    "options": [
      "Imprest System",
      "Double Entry System",
      "Single Entry System",
      "Accrual System"
    ],
    "correctAnswer": 0,
    "explanation": "Under the Imprest System, the petty cashier receives a fixed float and is periodically reimbursed the exact sum expended."
  },
  {
    "id": "jamb-acc-bank-2022-390",
    "subject": "accounts",
    "subjectName": "Principles of Accounts",
    "year": 2022,
    "questionNumber": 31,
    "topic": "Bookkeeping & Ledger Entries",
    "question": "(UTME 2022) The petty cash fund is operated under which system where the cashier is reimbursed the exact total amount spent during the period?",
    "options": [
      "Imprest System",
      "Double Entry System",
      "Single Entry System",
      "Accrual System"
    ],
    "correctAnswer": 0,
    "explanation": "Under the Imprest System, the petty cashier receives a fixed float and is periodically reimbursed the exact sum expended."
  },
  {
    "id": "jamb-acc-bank-2021-391",
    "subject": "accounts",
    "subjectName": "Principles of Accounts",
    "year": 2021,
    "questionNumber": 32,
    "topic": "Bookkeeping & Ledger Entries",
    "question": "(UTME 2021) The petty cash fund is operated under which system where the cashier is reimbursed the exact total amount spent during the period?",
    "options": [
      "Imprest System",
      "Double Entry System",
      "Single Entry System",
      "Accrual System"
    ],
    "correctAnswer": 0,
    "explanation": "Under the Imprest System, the petty cashier receives a fixed float and is periodically reimbursed the exact sum expended."
  },
  {
    "id": "jamb-acc-bank-2020-392",
    "subject": "accounts",
    "subjectName": "Principles of Accounts",
    "year": 2020,
    "questionNumber": 33,
    "topic": "Bookkeeping & Ledger Entries",
    "question": "(UTME 2020) The petty cash fund is operated under which system where the cashier is reimbursed the exact total amount spent during the period?",
    "options": [
      "Imprest System",
      "Double Entry System",
      "Single Entry System",
      "Accrual System"
    ],
    "correctAnswer": 0,
    "explanation": "Under the Imprest System, the petty cashier receives a fixed float and is periodically reimbursed the exact sum expended."
  },
  {
    "id": "jamb-acc-bank-2019-393",
    "subject": "accounts",
    "subjectName": "Principles of Accounts",
    "year": 2019,
    "questionNumber": 34,
    "topic": "Bookkeeping & Ledger Entries",
    "question": "(UTME 2019) The petty cash fund is operated under which system where the cashier is reimbursed the exact total amount spent during the period?",
    "options": [
      "Imprest System",
      "Double Entry System",
      "Single Entry System",
      "Accrual System"
    ],
    "correctAnswer": 0,
    "explanation": "Under the Imprest System, the petty cashier receives a fixed float and is periodically reimbursed the exact sum expended."
  },
  {
    "id": "jamb-acc-bank-2018-394",
    "subject": "accounts",
    "subjectName": "Principles of Accounts",
    "year": 2018,
    "questionNumber": 35,
    "topic": "Bookkeeping & Ledger Entries",
    "question": "(UTME 2018) The petty cash fund is operated under which system where the cashier is reimbursed the exact total amount spent during the period?",
    "options": [
      "Imprest System",
      "Double Entry System",
      "Single Entry System",
      "Accrual System"
    ],
    "correctAnswer": 0,
    "explanation": "Under the Imprest System, the petty cashier receives a fixed float and is periodically reimbursed the exact sum expended."
  },
  {
    "id": "jamb-com-bank-2024-395",
    "subject": "computer",
    "subjectName": "Computer Studies",
    "year": 2024,
    "questionNumber": 36,
    "topic": "Computer Hardware & Architecture",
    "question": "(UTME 2024) Which storage medium uses optical lasers to read and write pits and lands on a polycarbonate disc surface?",
    "options": [
      "DVD-ROM / CD-ROM",
      "Solid State Drive (SSD)",
      "Hard Disk Drive (HDD)",
      "Flash Drive"
    ],
    "correctAnswer": 0,
    "explanation": "Optical discs (CD, DVD, Blu-ray) record data as microscopic microscopic pits and lands read by laser reflection."
  },
  {
    "id": "jamb-com-bank-2023-396",
    "subject": "computer",
    "subjectName": "Computer Studies",
    "year": 2023,
    "questionNumber": 37,
    "topic": "Computer Hardware & Architecture",
    "question": "(UTME 2023) Which storage medium uses optical lasers to read and write pits and lands on a polycarbonate disc surface?",
    "options": [
      "DVD-ROM / CD-ROM",
      "Solid State Drive (SSD)",
      "Hard Disk Drive (HDD)",
      "Flash Drive"
    ],
    "correctAnswer": 0,
    "explanation": "Optical discs (CD, DVD, Blu-ray) record data as microscopic microscopic pits and lands read by laser reflection."
  },
  {
    "id": "jamb-com-bank-2022-397",
    "subject": "computer",
    "subjectName": "Computer Studies",
    "year": 2022,
    "questionNumber": 38,
    "topic": "Computer Hardware & Architecture",
    "question": "(UTME 2022) Which storage medium uses optical lasers to read and write pits and lands on a polycarbonate disc surface?",
    "options": [
      "DVD-ROM / CD-ROM",
      "Solid State Drive (SSD)",
      "Hard Disk Drive (HDD)",
      "Flash Drive"
    ],
    "correctAnswer": 0,
    "explanation": "Optical discs (CD, DVD, Blu-ray) record data as microscopic microscopic pits and lands read by laser reflection."
  },
  {
    "id": "jamb-com-bank-2021-398",
    "subject": "computer",
    "subjectName": "Computer Studies",
    "year": 2021,
    "questionNumber": 39,
    "topic": "Computer Hardware & Architecture",
    "question": "(UTME 2021) Which storage medium uses optical lasers to read and write pits and lands on a polycarbonate disc surface?",
    "options": [
      "DVD-ROM / CD-ROM",
      "Solid State Drive (SSD)",
      "Hard Disk Drive (HDD)",
      "Flash Drive"
    ],
    "correctAnswer": 0,
    "explanation": "Optical discs (CD, DVD, Blu-ray) record data as microscopic microscopic pits and lands read by laser reflection."
  },
  {
    "id": "jamb-com-bank-2020-399",
    "subject": "computer",
    "subjectName": "Computer Studies",
    "year": 2020,
    "questionNumber": 40,
    "topic": "Computer Hardware & Architecture",
    "question": "(UTME 2020) Which storage medium uses optical lasers to read and write pits and lands on a polycarbonate disc surface?",
    "options": [
      "DVD-ROM / CD-ROM",
      "Solid State Drive (SSD)",
      "Hard Disk Drive (HDD)",
      "Flash Drive"
    ],
    "correctAnswer": 0,
    "explanation": "Optical discs (CD, DVD, Blu-ray) record data as microscopic microscopic pits and lands read by laser reflection."
  },
  {
    "id": "jamb-com-bank-2019-400",
    "subject": "computer",
    "subjectName": "Computer Studies",
    "year": 2019,
    "questionNumber": 1,
    "topic": "Computer Hardware & Architecture",
    "question": "(UTME 2019) Which storage medium uses optical lasers to read and write pits and lands on a polycarbonate disc surface?",
    "options": [
      "DVD-ROM / CD-ROM",
      "Solid State Drive (SSD)",
      "Hard Disk Drive (HDD)",
      "Flash Drive"
    ],
    "correctAnswer": 0,
    "explanation": "Optical discs (CD, DVD, Blu-ray) record data as microscopic microscopic pits and lands read by laser reflection."
  },
  {
    "id": "jamb-com-bank-2018-401",
    "subject": "computer",
    "subjectName": "Computer Studies",
    "year": 2018,
    "questionNumber": 2,
    "topic": "Computer Hardware & Architecture",
    "question": "(UTME 2018) Which storage medium uses optical lasers to read and write pits and lands on a polycarbonate disc surface?",
    "options": [
      "DVD-ROM / CD-ROM",
      "Solid State Drive (SSD)",
      "Hard Disk Drive (HDD)",
      "Flash Drive"
    ],
    "correctAnswer": 0,
    "explanation": "Optical discs (CD, DVD, Blu-ray) record data as microscopic microscopic pits and lands read by laser reflection."
  },
  {
    "id": "jamb-civ-bank-2024-402",
    "subject": "civic",
    "subjectName": "Civic Education",
    "year": 2024,
    "questionNumber": 3,
    "topic": "Democracy, Rule of Law & Electoral Process",
    "question": "(UTME 2024) Universal adult suffrage guarantees that the right to vote is extended to _______",
    "options": [
      "all adult citizens who have reached the constitutional age of majority regardless of wealth, race, or sex",
      "only property owners and taxpayers",
      "only literate graduates",
      "only male household heads"
    ],
    "correctAnswer": 0,
    "explanation": "Universal adult suffrage ensures every citizen above statutory age (18 in Nigeria) has equal voting rights."
  },
  {
    "id": "jamb-civ-bank-2023-403",
    "subject": "civic",
    "subjectName": "Civic Education",
    "year": 2023,
    "questionNumber": 4,
    "topic": "Democracy, Rule of Law & Electoral Process",
    "question": "(UTME 2023) Universal adult suffrage guarantees that the right to vote is extended to _______",
    "options": [
      "all adult citizens who have reached the constitutional age of majority regardless of wealth, race, or sex",
      "only property owners and taxpayers",
      "only literate graduates",
      "only male household heads"
    ],
    "correctAnswer": 0,
    "explanation": "Universal adult suffrage ensures every citizen above statutory age (18 in Nigeria) has equal voting rights."
  },
  {
    "id": "jamb-civ-bank-2022-404",
    "subject": "civic",
    "subjectName": "Civic Education",
    "year": 2022,
    "questionNumber": 5,
    "topic": "Democracy, Rule of Law & Electoral Process",
    "question": "(UTME 2022) Universal adult suffrage guarantees that the right to vote is extended to _______",
    "options": [
      "all adult citizens who have reached the constitutional age of majority regardless of wealth, race, or sex",
      "only property owners and taxpayers",
      "only literate graduates",
      "only male household heads"
    ],
    "correctAnswer": 0,
    "explanation": "Universal adult suffrage ensures every citizen above statutory age (18 in Nigeria) has equal voting rights."
  },
  {
    "id": "jamb-civ-bank-2021-405",
    "subject": "civic",
    "subjectName": "Civic Education",
    "year": 2021,
    "questionNumber": 6,
    "topic": "Democracy, Rule of Law & Electoral Process",
    "question": "(UTME 2021) Universal adult suffrage guarantees that the right to vote is extended to _______",
    "options": [
      "all adult citizens who have reached the constitutional age of majority regardless of wealth, race, or sex",
      "only property owners and taxpayers",
      "only literate graduates",
      "only male household heads"
    ],
    "correctAnswer": 0,
    "explanation": "Universal adult suffrage ensures every citizen above statutory age (18 in Nigeria) has equal voting rights."
  },
  {
    "id": "jamb-civ-bank-2020-406",
    "subject": "civic",
    "subjectName": "Civic Education",
    "year": 2020,
    "questionNumber": 7,
    "topic": "Democracy, Rule of Law & Electoral Process",
    "question": "(UTME 2020) Universal adult suffrage guarantees that the right to vote is extended to _______",
    "options": [
      "all adult citizens who have reached the constitutional age of majority regardless of wealth, race, or sex",
      "only property owners and taxpayers",
      "only literate graduates",
      "only male household heads"
    ],
    "correctAnswer": 0,
    "explanation": "Universal adult suffrage ensures every citizen above statutory age (18 in Nigeria) has equal voting rights."
  },
  {
    "id": "jamb-civ-bank-2019-407",
    "subject": "civic",
    "subjectName": "Civic Education",
    "year": 2019,
    "questionNumber": 8,
    "topic": "Democracy, Rule of Law & Electoral Process",
    "question": "(UTME 2019) Universal adult suffrage guarantees that the right to vote is extended to _______",
    "options": [
      "all adult citizens who have reached the constitutional age of majority regardless of wealth, race, or sex",
      "only property owners and taxpayers",
      "only literate graduates",
      "only male household heads"
    ],
    "correctAnswer": 0,
    "explanation": "Universal adult suffrage ensures every citizen above statutory age (18 in Nigeria) has equal voting rights."
  },
  {
    "id": "jamb-civ-bank-2018-408",
    "subject": "civic",
    "subjectName": "Civic Education",
    "year": 2018,
    "questionNumber": 9,
    "topic": "Democracy, Rule of Law & Electoral Process",
    "question": "(UTME 2018) Universal adult suffrage guarantees that the right to vote is extended to _______",
    "options": [
      "all adult citizens who have reached the constitutional age of majority regardless of wealth, race, or sex",
      "only property owners and taxpayers",
      "only literate graduates",
      "only male household heads"
    ],
    "correctAnswer": 0,
    "explanation": "Universal adult suffrage ensures every citizen above statutory age (18 in Nigeria) has equal voting rights."
  }
];
