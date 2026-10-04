/**
 * LearnDean Education Curricula Database
 * Country -> Exam/Class -> Subjects -> Topics -> Study/Practice
 * 
 * Provides official, accurate, and current curriculum standards for:
 * - Nigeria (JAMB UTME, WAEC WASSCE, NECO SSCE, BECE Junior WAEC, Primary)
 * - United States (SAT, ACT, AP, High School Common Core)
 * - United Kingdom (GCSE/IGCSE, A-Levels, Key Stage 3)
 * - India (CBSE Class 10/12, JEE, NEET)
 * - International (IB Diploma, Cambridge International)
 */

export interface TopicQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface CurriculumTopic {
  id: string;
  name: string;
  overview: string;
  objectives: string[];
  keyPoints: string[];
  examWeight: 'High' | 'Medium' | 'Essential';
  lessonContent: string;
  practiceQuestions: TopicQuestion[];
}

export interface CurriculumSubject {
  id: string;
  name: string;
  code: string;
  category: string;
  description: string;
  iconName: string;
  totalTopics: number;
  questionCount: number;
  topics: CurriculumTopic[];
}

export interface ExamLevel {
  id: string;
  name: string;
  shortName: string;
  category: 'Tertiary Entrance' | 'Senior Secondary' | 'Junior Secondary' | 'Primary' | 'High School' | 'Board Exam' | 'College Prep' | 'International';
  shortDescription: string;
  badge?: string;
  badgeColor?: string;
  examBoard: string;
  officialSyllabusYear: string;
  isJambDirect?: boolean;
  subjects: CurriculumSubject[];
}

export interface CountryCurriculum {
  code: string;
  name: string;
  flag: string;
  description: string;
  educationLevels: ExamLevel[];
}

// ==========================================
// 1. NIGERIA (NG) EDUCATION CURRICULUM
// ==========================================

const NIGERIA_WAEC_SUBJECTS: CurriculumSubject[] = [
  {
    id: 'waec-math',
    name: 'General Mathematics',
    code: 'MATH',
    category: 'Core',
    iconName: 'Calculator',
    description: 'Number and numeration, algebraic processes, mensuration, geometry, trigonometry, statistics, and probability.',
    totalTopics: 6,
    questionCount: 15,
    topics: [
      {
        id: 'waec-math-t1',
        name: 'Number & Numeration: Indices, Logarithms & Surds',
        overview: 'Laws of indices, logarithmic conversions, change of base, and simplification of surds with rationalization of denominators.',
        objectives: [
          'Apply the laws of indices to simplify complex exponential expressions.',
          'Solve logarithmic equations using standard rules of base change and product/quotient laws.',
          'Rationalize denominators of surds involving binomial radicals.'
        ],
        keyPoints: [
          'a^m × a^n = a^(m+n); a^m ÷ a^n = a^(m-n); (a^m)^n = a^(mn)',
          'log_b(xy) = log_b(x) + log_b(y); log_b(x/y) = log_b(x) - log_b(y)',
          'To rationalize 1 / (√a + √b), multiply numerator and denominator by (√a - √b).'
        ],
        examWeight: 'High',
        lessonContent: `### Number and Numeration in WAEC Mathematics

#### 1. Indices
Indices indicate the power or exponent to which a base number is raised. The fundamental laws:
- **Product Law**: $a^m \\times a^n = a^{m+n}$
- **Quotient Law**: $a^m \\div a^n = a^{m-n}$
- **Power Law**: $(a^m)^n = a^{mn}$
- **Zero Index**: $a^0 = 1$ ($a \\neq 0$)
- **Negative Index**: $a^{-n} = \\frac{1}{a^n}$
- **Fractional Index**: $a^{m/n} = \\sqrt[n]{a^m} = (\\sqrt[n]{a})^m$

#### 2. Logarithms
If $y = b^x$, then $x = \\log_b(y)$.
- $\\log_b(MN) = \\log_b(M) + \\log_b(N)$
- $\\log_b(M/N) = \\log_b(M) - \\log_b(N)$
- $\\log_b(M^k) = k \\log_b(M)$
- **Change of Base**: $\\log_b(a) = \\frac{\\log_c(a)}{\\log_c(b)}$

#### 3. Surds
A surd is an irrational root of a rational number.
- $\\sqrt{ab} = \\sqrt{a} \\times \\sqrt{b}$
- $\\sqrt{\\frac{a}{b}} = \\frac{\\sqrt{a}}{\\sqrt{b}}$
- **Conjugate Surds**: The conjugate of $(a + \\sqrt{b})$ is $(a - \\sqrt{b})$.
- **Rationalization**: To eliminate radicals in denominators, multiply numerator and denominator by the conjugate.`,
        practiceQuestions: [
          {
            id: 'waec-m-q1',
            question: 'Simplify without using tables: (27)^(2/3) × (64)^(-1/3) ÷ (16)^(1/4).',
            options: ['9/8', '3/4', '9/4', '18'],
            correctAnswer: 0,
            explanation: '27^(2/3) = (3^3)^(2/3) = 3^2 = 9. 64^(-1/3) = 1/(64^(1/3)) = 1/4. 16^(1/4) = 2. Thus 9 × (1/4) ÷ 2 = (9/4) / 2 = 9/8.'
          },
          {
            id: 'waec-m-q2',
            question: 'Given that log₁₀(2) = 0.3010 and log₁₀(3) = 0.4771, calculate the value of log₁₀(18).',
            options: ['1.2552', '1.0791', '0.7781', '1.5562'],
            correctAnswer: 0,
            explanation: '18 = 2 × 3^2. log₁₀(18) = log₁₀(2) + 2·log₁₀(3) = 0.3010 + 2(0.4771) = 0.3010 + 0.9542 = 1.2552.'
          },
          {
            id: 'waec-m-q3',
            question: 'Rationalize the denominator: (3 + √2) / (3 - √2).',
            options: ['(11 + 6√2) / 7', '(7 + 6√2) / 7', '(11 + 3√2) / 5', '(9 + 2√2) / 7'],
            correctAnswer: 0,
            explanation: 'Multiply numerator and denominator by (3 + √2): (3 + √2)(3 + √2) / (3^2 - (√2)^2) = (9 + 6√2 + 2) / (9 - 2) = (11 + 6√2) / 7.'
          }
        ]
      },
      {
        id: 'waec-math-t2',
        name: 'Algebraic Processes: Quadratic Equations & Variations',
        overview: 'Methods of solving quadratic equations (factorization, formula, completing the square), simultaneous equations (one linear, one non-linear), and direct, inverse, and joint variations.',
        objectives: [
          'Form and solve quadratic equations arising from word problems.',
          'Solve simultaneous equations with one linear and one quadratic relationship.',
          'Translate variation problems into algebraic relationships and determine constant of variation.'
        ],
        keyPoints: [
          'Quadratic formula: x = (-b ± √(b² - 4ac)) / (2a)',
          'Discriminant D = b² - 4ac determines root nature: D > 0 (two real distinct), D = 0 (equal/repeated), D < 0 (complex/no real roots).',
          'Joint variation: y ∝ xz ⇒ y = kxz.'
        ],
        examWeight: 'Essential',
        lessonContent: `### Quadratic Equations & Variations in WAEC

#### 1. Quadratic Equations
General form: $ax^2 + bx + c = 0$ ($a \\neq 0$).
- **Quadratic Formula**:
  $$x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$$
- **Sum and Product of Roots**:
  If $\\alpha$ and $\\beta$ are roots:
  - $\\alpha + \\beta = -\\frac{b}{a}$
  - $\\alpha\\beta = \\frac{c}{a}$

#### 2. Simultaneous Equations (Linear & Quadratic)
To solve $y = mx + c$ and $x^2 + y^2 = r^2$:
1. Substitute $y$ from the linear equation into the quadratic.
2. Obtain a quadratic in $x$ alone.
3. Solve for $x$, then find corresponding $y$ values.

#### 3. Theory of Variations
- **Direct**: $y \\propto x \\implies y = kx$
- **Inverse**: $y \\propto \\frac{1}{x} \\implies y = \\frac{k}{x}$
- **Joint**: $y \\propto xz \\implies y = kxz$
- **Partial**: $y = k_1 + k_2 x$`,
        practiceQuestions: [
          {
            id: 'waec-m-q4',
            question: 'Find the quadratic equation whose roots are -2/3 and 4.',
            options: ['3x² - 10x - 8 = 0', '3x² + 10x - 8 = 0', '3x² - 10x + 8 = 0', 'x² - 3x - 8 = 0'],
            correctAnswer: 0,
            explanation: 'Sum of roots = -2/3 + 4 = 10/3. Product of roots = (-2/3)(4) = -8/3. Equation: x² - (Sum)x + Product = 0 ⇒ x² - (10/3)x - 8/3 = 0 ⇒ 3x² - 10x - 8 = 0.'
          },
          {
            id: 'waec-m-q5',
            question: 'If y varies inversely as the square of x, and y = 8 when x = 3, find y when x = 6.',
            options: ['2', '4', '1/2', '16'],
            correctAnswer: 0,
            explanation: 'y = k / x² ⇒ 8 = k / 3² ⇒ k = 72. When x = 6: y = 72 / 6² = 72 / 36 = 2.'
          }
        ]
      },
      {
        id: 'waec-math-t3',
        name: 'Mensuration: Lengths, Areas, and Volumes',
        overview: 'Arc lengths, sector areas, surface areas and volumes of prisms, cylinders, cones, pyramids, spheres, and frustums.',
        objectives: [
          'Calculate arc lengths and area of sectors/segments of circles.',
          'Compute total surface area and volume of combined composite solids.',
          'Solve real-world problems involving frustums of cones and pyramids.'
        ],
        keyPoints: [
          'Arc length s = (θ/360) × 2πr',
          'Sector Area = (θ/360) × πr²',
          'Sphere Volume = (4/3)πr³; Surface Area = 4πr²',
          'Cone Volume = (1/3)πr²h; Curved Surface Area = πrl (where l = √(r² + h²))'
        ],
        examWeight: 'High',
        lessonContent: `### Mensuration for WASSCE Candidates

#### 1. Circular Geometry
- Length of Arc: $L = \\frac{\\theta}{360^\\circ} \\times 2\\pi r$
- Area of Sector: $A = \\frac{\\theta}{360^\\circ} \\times \\pi r^2$
- Area of Segment = Area of Sector - Area of Triangle $= \\frac{\\theta}{360}\\pi r^2 - \\frac{1}{2}r^2 \\sin(\\theta)$

#### 2. Three-Dimensional Solids
- **Cylinder**:
  - Curved Surface Area $= 2\\pi rh$
  - Total Surface Area (closed) $= 2\\pi r(h + r)$
  - Volume $= \\pi r^2 h$
- **Cone**:
  - Slant height $l = \\sqrt{r^2 + h^2}$
  - Curved Surface Area $= \\pi r l$
  - Volume $= \\frac{1}{3}\\pi r^2 h$
- **Sphere**:
  - Surface Area $= 4\\pi r^2$
  - Volume $= \\frac{4}{3}\\pi r^3$
- **Frustum of a Cone**:
  - Volume $= \\frac{1}{3}\\pi h (R^2 + Rr + r^2)$`,
        practiceQuestions: [
          {
            id: 'waec-m-q6',
            question: 'An arc of a circle of radius 7 cm subtends an angle of 60° at the centre. Find the length of the arc. (Take π = 22/7).',
            options: ['7.33 cm', '14.67 cm', '3.67 cm', '11.00 cm'],
            correctAnswer: 0,
            explanation: 'Arc length = (60/360) × 2 × (22/7) × 7 = (1/6) × 44 = 44/6 = 7.33 cm.'
          },
          {
            id: 'waec-m-q7',
            question: 'Find the total surface area of a solid hemisphere of radius 7 cm. (Take π = 22/7).',
            options: ['462 cm²', '308 cm²', '154 cm²', '616 cm²'],
            correctAnswer: 0,
            explanation: 'Total surface area of a solid hemisphere = curved surface + flat base = 2πr² + πr² = 3πr² = 3 × (22/7) × 7² = 3 × 22 × 7 = 462 cm².'
          }
        ]
      },
      {
        id: 'waec-math-t4',
        name: 'Trigonometry & Bearings',
        overview: 'Trigonometric ratios of acute angles, sine and cosine rules, angles of elevation and depression, and three-figure compass bearings.',
        objectives: [
          'Apply sine rule and cosine rule to solve scalene triangles.',
          'Solve two-dimensional and three-dimensional problems involving angles of elevation/depression.',
          'Draw accurate navigational diagrams to calculate distances and bearings between three points.'
        ],
        keyPoints: [
          'Sine rule: a / sin(A) = b / sin(B) = c / sin(C)',
          'Cosine rule: a² = b² + c² - 2bc·cos(A)',
          'Three-figure bearings are measured clockwise from True North (000° to 360°).'
        ],
        examWeight: 'High',
        lessonContent: `### Trigonometry and Navigational Bearings

#### 1. Non-Right-Angled Triangles
- **Sine Rule**: Use when given two angles and one side, or two sides and an angle opposite one:
  $$\\frac{a}{\\sin A} = \\frac{b}{\\sin B} = \\frac{c}{\\sin C}$$
- **Cosine Rule**: Use when given two sides and the included angle, or all three sides:
  $$a^2 = b^2 + c^2 - 2bc \\cos A \\implies \\cos A = \\frac{b^2 + c^2 - a^2}{2bc}$$
- **Area of a Triangle**:
  $$\\text{Area} = \\frac{1}{2}ab \\sin C$$

#### 2. Three-Figure Bearings
- Always measured from North in a clockwise direction.
- Expressed using three digits (e.g., 045°, 210°).
- The back bearing of a bearing $\\theta$:
  - If $\\theta < 180^\\circ$: $\\text{Back Bearing} = \\theta + 180^\\circ$
  - If $\\theta > 180^\\circ$: $\\text{Back Bearing} = \\theta - 180^\\circ$`,
        practiceQuestions: [
          {
            id: 'waec-m-q8',
            question: 'In triangle PQR, p = 8 cm, q = 6 cm, and angle R = 60°. Calculate the length of side r.',
            options: ['7.21 cm', '6.50 cm', '8.12 cm', '10.00 cm'],
            correctAnswer: 0,
            explanation: 'r² = p² + q² - 2pq·cos(R) = 8² + 6² - 2(8)(6)cos(60°) = 64 + 36 - 96(0.5) = 100 - 48 = 52. r = √52 ≈ 7.21 cm.'
          },
          {
            id: 'waec-m-q9',
            question: 'The bearing of point Q from point P is 065°. What is the bearing of point P from point Q?',
            options: ['245°', '115°', '295°', '155°'],
            correctAnswer: 0,
            explanation: 'Since the bearing is less than 180°, Back Bearing = 065° + 180° = 245°.'
          }
        ]
      },
      {
        id: 'waec-math-t5',
        name: 'Plane Geometry & Circle Theorems',
        overview: 'Angles subtended at the centre and circumference, angles in the same segment, cyclic quadrilaterals, tangents, and alternate segment theorem.',
        objectives: [
          'Prove and apply the fundamental circle theorems to determine unknown angles.',
          'Utilize properties of cyclic quadrilaterals (opposite angles sum to 180°).',
          'Apply the alternate segment theorem to tangent-chord configurations.'
        ],
        keyPoints: [
          'Angle at centre is twice angle at circumference subtended by the same arc.',
          'Angle in a semicircle is a right angle (90°).',
          'Angles in the same segment are equal.',
          'Opposite angles of a cyclic quadrilateral are supplementary (sum = 180°).'
        ],
        examWeight: 'Essential',
        lessonContent: `### Circle Theorems in WAEC Mathematics

1. **Angle at the Centre**: The angle subtended by an arc at the centre of a circle is twice the angle subtended by it at any point on the circumference.
2. **Angle in a Semicircle**: The angle subtended at the circumference by a diameter is $90^\\circ$.
3. **Angles in the Same Segment**: Angles in the same segment of a circle are equal.
4. **Cyclic Quadrilateral**:
   - The opposite angles of a cyclic quadrilateral sum to $180^\\circ$.
   - The exterior angle of a cyclic quadrilateral is equal to the interior opposite angle.
5. **Tangent Theorems**:
   - A tangent to a circle is perpendicular to the radius at the point of contact ($90^\\circ$).
   - The two tangents drawn from an external point to a circle are equal in length.
   - **Alternate Segment Theorem**: The angle between a tangent and a chord through the point of contact is equal to the angle in the alternate segment.`,
        practiceQuestions: [
          {
            id: 'waec-m-q10',
            question: 'In a circle, a chord subtends an angle of 70° at the circumference. What angle does this chord subtend at the centre of the circle?',
            options: ['140°', '35°', '70°', '110°'],
            correctAnswer: 0,
            explanation: 'By circle theorem, the angle subtended at the centre is twice the angle at the circumference: 2 × 70° = 140°.'
          },
          {
            id: 'waec-m-q11',
            question: 'ABCD is a cyclic quadrilateral. If angle ABC = 105°, find the measure of angle ADC.',
            options: ['75°', '105°', '95°', '85°'],
            correctAnswer: 0,
            explanation: 'Opposite angles of a cyclic quadrilateral are supplementary: angle ADC = 180° - 105° = 75°.'
          }
        ]
      },
      {
        id: 'waec-math-t6',
        name: 'Statistics & Probability',
        overview: 'Frequency distributions, mean, median, mode for grouped and ungrouped data, cumulative frequency curves (ogives), and theoretical/experimental probability.',
        objectives: [
          'Calculate measures of central tendency and dispersion (range, variance, standard deviation).',
          'Construct and interpret cumulative frequency tables and ogive graphs to estimate percentiles and quartiles.',
          'Compute compound probability using addition and multiplication rules for independent and mutually exclusive events.'
        ],
        keyPoints: [
          'Mean x̄ = Σfx / Σf',
          'Standard deviation σ = √(Σf(x - x̄)² / Σf)',
          'Independent events: P(A ∩ B) = P(A) × P(B)',
          'Mutually exclusive: P(A ∪ B) = P(A) + P(B)'
        ],
        examWeight: 'High',
        lessonContent: `### Statistics & Probability in WAEC

#### 1. Measures of Central Tendency
- **Mean** for grouped data: $\\bar{x} = \\frac{\\sum f x}{\\sum f}$, where $x$ is the midpoint of each class interval.
- **Median** from grouped data: $L + \\left(\\frac{\\frac{N}{2} - F}{f_m}\\right)c$
- **Mode** from grouped data: $L_1 + \\left(\\frac{\\Delta_1}{\\Delta_1 + \\Delta_2}\\right)c$

#### 2. Cumulative Frequency (Ogive)
- The Ogive plots upper class boundaries against cumulative frequency.
- Used to estimate the Median ($Q_2$), Lower Quartile ($Q_1$), Upper Quartile ($Q_3$), and Semi-Interquartile Range $\\frac{Q_3 - Q_1}{2}$.

#### 3. Probability Laws
- $0 \\le P(E) \\le 1$; $P(E') = 1 - P(E)$
- **Addition Rule**: $P(A \\cup B) = P(A) + P(B) - P(A \\cap B)$
- If mutually exclusive: $P(A \\cup B) = P(A) + P(B)$
- **Multiplication Rule** for independent events: $P(A \\cap B) = P(A) \\times P(B)$`,
        practiceQuestions: [
          {
            id: 'waec-m-q12',
            question: 'Two fair six-sided dice are tossed simultaneously. What is the probability of obtaining a total score of 7?',
            options: ['1/6', '1/12', '5/36', '7/36'],
            correctAnswer: 0,
            explanation: 'Total possible outcomes = 6 × 6 = 36. Outcomes summing to 7: (1,6), (2,5), (3,4), (4,3), (5,2), (6,1) = 6 outcomes. P = 6/36 = 1/6.'
          },
          {
            id: 'waec-m-q13',
            question: 'The mean of the numbers 4, 7, 9, x, 14, and 18 is 11. Find the value of x.',
            options: ['14', '12', '10', '16'],
            correctAnswer: 0,
            explanation: 'Sum = 4 + 7 + 9 + x + 14 + 18 = 52 + x. Mean = (52 + x) / 6 = 11 ⇒ 52 + x = 66 ⇒ x = 66 - 52 = 14.'
          }
        ]
      }
    ]
  },
  {
    id: 'waec-eng',
    name: 'English Language',
    code: 'ENG',
    category: 'Core',
    iconName: 'BookOpen',
    description: 'Lexis and structure, reading comprehension, summary writing, oral English phonology, and continuous writing.',
    totalTopics: 4,
    questionCount: 12,
    topics: [
      {
        id: 'waec-eng-t1',
        name: 'Lexis & Structure: Grammatical Concord & Tenses',
        overview: 'Subject-verb agreement rules, proximity concord, correlative conjunctions, tense sequences, and idioms.',
        objectives: [
          'Select verbs that agree with complex singular and plural subjects.',
          'Identify correct prepositional idioms and collocations.',
          'Master conditional clauses and reported speech conversions.'
        ],
        keyPoints: [
          'Neither...nor / Either...or follows proximity concord (verb agrees with closest subject).',
          '"As well as", "together with", "accompanied by" do not affect subject number.',
          'Indefinite pronouns (everybody, someone, neither of) take singular verbs.'
        ],
        examWeight: 'High',
        lessonContent: `### WAEC Lexis & Structure Master Guide

#### 1. Fundamental Rules of Concord
- **Principle of Proximity**: With *either...or*, *neither...nor*, the verb agrees in person and number with the nearest subject:
  - *Neither the teacher nor the students **were** present.*
  - *Either the boys or the principal **is** attending.*
- **Parenthetical Expressions**: Expressions such as *as well as*, *together with*, *along with*, *accompanied by* do not make the subject compound:
  - *The Governor, accompanied by his aides, **was** welcomed.*
- **Indefinite Pronouns**: Words ending in *-one*, *-body*, *-thing* are singular:
  - *Everyone **has** submitted their homework.*

#### 2. Sequence of Tenses & Conditionals
- **First Conditional** (Real): *If it rains, we will cancel the trip.*
- **Second Conditional** (Hypothetical): *If I won the lottery, I would build a library.*
- **Third Conditional** (Unfulfilled Past): *If she had studied harder, she would have passed.*`,
        practiceQuestions: [
          {
            id: 'waec-e-q1',
            question: 'Neither the captain nor the sailors _______ able to control the vessel during the storm.',
            options: ['were', 'was', 'is', 'are'],
            correctAnswer: 0,
            explanation: 'By the rule of proximity, the verb agrees with "the sailors" which is plural, so "were" is correct.'
          },
          {
            id: 'waec-e-q2',
            question: 'The principal, as well as the senior teachers, _______ expected at the board meeting today.',
            options: ['is', 'are', 'were', 'have been'],
            correctAnswer: 0,
            explanation: 'The subject is "The principal" (singular). The phrase "as well as the senior teachers" is parenthetical and does not pluralize the subject.'
          }
        ]
      },
      {
        id: 'waec-eng-t2',
        name: 'Oral English: Vowel & Consonant Phonology',
        overview: 'Monophthongs, diphthongs, consonant clusters, silent letters, and syllable stress placement.',
        objectives: [
          'Distinguish between short and long English vowels.',
          'Identify words containing identical vowel and consonant sounds.',
          'Determine correct syllable stress placement in multisyllabic words.'
        ],
        keyPoints: [
          'English has 20 vowel sounds (12 monophthongs + 8 diphthongs) and 24 consonants.',
          'Nouns/Adjectives with two syllables often stress the first syllable (e.g. CON-duct, PRE-sent).',
          'Verbs with two syllables often stress the second syllable (e.g. con-DUCT, pre-SENT).'
        ],
        examWeight: 'High',
        lessonContent: `### WAEC Oral English Phonology Guide

#### 1. Vowels and Diphthongs
- Long vowels are marked with a colon: /i:/ as in *seat*, /u:/ as in *pool*, /ɔ:/ as in *court*.
- Diphthongs involve a glide from one vowel quality to another:
  - /eɪ/ (*day*, *break*)
  - /aɪ/ (*sky*, *bite*)
  - /əʊ/ (*goat*, *home*)
  - /aʊ/ (*now*, *cloud*)

#### 2. Stress Patterns in WAEC
- **Two-syllable noun/verb pairs**:
  - *IM-port* (noun) vs. *im-PORT* (verb)
  - *RE-cord* (noun) vs. *re-CORD* (verb)
  - *OB-ject* (noun) vs. *ob-JECT* (verb)
- **Suffix rules**:
  - Words ending in *-tion*, *-sion*, *-ic* have primary stress on the penultimate (second to last) syllable: *e-lec-TRIC*, *con-ver-SA-tion*.`,
        practiceQuestions: [
          {
            id: 'waec-e-q3',
            question: 'From the options below, choose the word that contains the vowel sound /i:/.',
            options: ['Machine', 'Sit', 'Women', 'Pretty'],
            correctAnswer: 0,
            explanation: '"Machine" is pronounced /məˈʃiːn/, which contains the long vowel sound /i:/.'
          },
          {
            id: 'waec-e-q4',
            question: 'Identify the syllable that receives the primary stress in the word: PHOTOGRAPHY.',
            options: ['pho-TOG-ra-phy', 'PHO-to-gra-phy', 'pho-to-GRAPH-y', 'pho-to-graph-Y'],
            correctAnswer: 0,
            explanation: 'Words ending in "-graphy" place primary stress on the antepenultimate syllable (third from the end): pho-TOG-ra-phy.'
          }
        ]
      },
      {
        id: 'waec-eng-t3',
        name: 'Comprehension & Summary Writing',
        overview: 'Strategies for identifying topic sentences, drawing contextual inferences, and writing concise summary statements in candidate\'s own words.',
        objectives: [
          'Extract main arguments and supporting details from passages.',
          'Replace idioms and figurative expressions with plain prose.',
          'Draft concise summary points adhering strictly to word count limits.'
        ],
        keyPoints: [
          'Summary answers must be complete sentences without extraneous details.',
          'Avoid lifted verbatim quotes; paraphrase using your own vocabulary.'
        ],
        examWeight: 'Essential',
        lessonContent: `### WAEC Summary Writing Principles

1. **Read with Purpose**: Skim once for general gist, then read closely to identify specific answers to the summary prompt.
2. **Draft in Complete Sentences**: In WAEC, summary answers presented as fragments or incomplete clauses lose marks.
3. **Avoid Mindless Lifting**: Transform the author's words into concise synonyms while maintaining the exact original meaning.
4. **Exclude Illustrations**: Omit statistics, examples, rhetorical questions, and quotations when writing summary sentences.`,
        practiceQuestions: [
          {
            id: 'waec-e-q5',
            question: 'What is the most critical requirement for scoring full marks in the WAEC Summary Writing section?',
            options: [
              'Writing complete grammatical sentences in your own words without extraneous details',
              'Copying the exact sentences containing the answers from the passage',
              'Writing the longest possible paragraph to cover all points',
              'Using complex poetic words not found in the text'
            ],
            correctAnswer: 0,
            explanation: 'WAEC examiners award maximum marks for clear, grammatically complete sentences formulated in candidate’s own words without copying verbatim or including unnecessary illustrations.'
          }
        ]
      },
      {
        id: 'waec-eng-t4',
        name: 'Continuous Writing: Formal Letters, Articles & Debates',
        overview: 'Structure, register, tone, and organization for formal/informal letters, feature articles, speeches, and debates.',
        objectives: [
          'Format formal letters with two addresses, date, salutation, title, and complementary close.',
          'Adopt the proper register and formal tone appropriate for publication or official correspondence.',
          'Construct coherent paragraphs with clear topic sentences and logical transition markers.'
        ],
        keyPoints: [
          'Formal letters: Sender address (top-right), Recipient address (top-left), Salutation, Title (underlined or capitalized), Body, "Yours faithfully," followed by signature and full name.',
          'Debate speech: Vocatives ("Mr. Chairman, Panel of Judges..."), stand assertion, refutation of opponent claims.'
        ],
        examWeight: 'High',
        lessonContent: `### WAEC Continuous Writing Guide

#### Assessment Criteria (50 Marks total)
- **Content (10 Marks)**: Relevance to the topic and thorough development of ideas.
- **Organization (10 Marks)**: Proper format, paragraphing, and logical flow.
- **Expression (20 Marks)**: Vocabulary choices, sentence variation, and idiom mastery.
- **Mechanical Accuracy (10 Marks)**: Deductions of 1/2 mark for each spelling, punctuation, or grammatical error.`,
        practiceQuestions: [
          {
            id: 'waec-e-q6',
            question: 'Which complimentary close is required when a formal letter begins with "Dear Sir" or "Dear Madam"?',
            options: ['Yours faithfully,', 'Yours sincerely,', 'Yours truly,', 'Warm regards,'],
            correctAnswer: 0,
            explanation: 'When addressing an unnamed recipient (Dear Sir/Madam), the convention requires "Yours faithfully,". "Yours sincerely," is used when the recipient is named (e.g., Dear Mr. Adeleke).'
          }
        ]
      }
    ]
  },
  {
    id: 'waec-bio',
    name: 'Biology',
    code: 'BIO',
    category: 'Science',
    iconName: 'Dna',
    description: 'Cell biology, nutrition, transport, ecology, genetics, and adaptation in living organisms.',
    totalTopics: 5,
    questionCount: 10,
    topics: [
      {
        id: 'waec-bio-t1',
        name: 'Cell Biology & Organization of Life',
        overview: 'Structure and functions of plant and animal cell organelles, cell specialization, and levels of organization.',
        objectives: [
          'Distinguish between plant and animal cells under electron microscopy.',
          'State the functions of mitochondria, chloroplasts, ribosomes, and endoplasmic reticulum.',
          'Trace the levels of organization from cell, tissue, organ, organ system to organism.'
        ],
        keyPoints: [
          'Plant cells have cellulose cell wall, large central vacuole, and plastids; animal cells have centrioles.',
          'Mitochondria is site of ATP cellular respiration; Ribosome is site of protein synthesis.'
        ],
        examWeight: 'High',
        lessonContent: `### Cell Biology for WASSCE

#### 1. Cell Organelles and Functions
- **Nucleus**: Houses chromosomes and genetic material (DNA), controls cell activities.
- **Mitochondria**: Double-membrane organelle responsible for aerobic respiration and ATP generation.
- **Chloroplast**: Contains chlorophyll pigments for photosynthesis in autotrophic cells.
- **Endoplasmic Reticulum (ER)**:
  - *Rough ER*: Studded with ribosomes for protein transport.
  - *Smooth ER*: Synthesizes lipids and detoxifies chemicals.
- **Ribosomes**: Sites of polypeptide (protein) translation.
- **Cell Membrane**: Phospholipid bilayer exhibiting selective permeability.`,
        practiceQuestions: [
          {
            id: 'waec-b-q1',
            question: 'Which organelle is found in plant cells but absent in typical animal cells?',
            options: ['Cellulose cell wall', 'Mitochondrion', 'Ribosome', 'Golgi apparatus'],
            correctAnswer: 0,
            explanation: 'Plant cells possess a rigid cellulose cell wall outside the plasma membrane, which is absent in animal cells.'
          }
        ]
      },
      {
        id: 'waec-bio-t2',
        name: 'Plant & Animal Nutrition',
        overview: 'Photosynthesis mechanisms (light and dark reactions), mineral nutrition in plants, mammalian digestive system, and balanced diets.',
        objectives: [
          'State the equations and conditions for light and dark phases of photosynthesis.',
          'Describe the chemical digestion of carbohydrates, proteins, and lipids in the human alimentary canal.'
        ],
        keyPoints: [
          'Light reaction occurs in thylakoid grana (photolysis of water); Dark reaction occurs in stroma.',
          'Enzymes: Ptyalin (saliva), Pepsin (gastric juice), Trypsin & Lipase (pancreatic juice).'
        ],
        examWeight: 'Essential',
        lessonContent: `### Nutrition in Organisms

#### 1. Photosynthesis
Equation:
$$6CO_2 + 6H_2O \\xrightarrow[\\text{Chlorophyll}]{\\text{Light}} C_6H_{12}O_6 + 6O_2$$
- **Photolysis of water**: $2H_2O \\to 4H^+ + 4e^- + O_2$ (Light reaction in grana).
- **Calvin Cycle**: Carbon fixation in stroma using ATP and NADPH.

#### 2. Human Digestion
- **Mouth**: Salivary amylase breaks starch into maltose.
- **Stomach**: Pepsin (active in acidic pH 2) converts proteins into peptones.
- **Duodenum**: Bile emulsifies fats; pancreatic lipase digests lipids to fatty acids and glycerol.`,
        practiceQuestions: [
          {
            id: 'waec-b-q2',
            question: 'What is the primary role of bile in the digestion of dietary fats?',
            options: [
              'To emulsify large fat globules into tiny droplets for lipase action',
              'To chemically hydrolyze lipids into glycerol and fatty acids',
              'To provide an acidic medium for pepsin activation',
              'To convert carbohydrates into simple monosaccharides'
            ],
            correctAnswer: 0,
            explanation: 'Bile contains bile salts that emulsify fats, breaking large lipid globules into fine droplets to drastically increase the surface area available for pancreatic lipase.'
          }
        ]
      }
    ]
  },
  {
    id: 'waec-phy',
    name: 'Physics',
    code: 'PHY',
    category: 'Science',
    iconName: 'Atom',
    description: 'Mechanics, heat energy, wave motions, electricity, electromagnetism, and atomic physics.',
    totalTopics: 4,
    questionCount: 8,
    topics: [
      {
        id: 'waec-phy-t1',
        name: 'Mechanics: Kinematics, Dynamics & Projectiles',
        overview: 'Equations of uniformly accelerated motion, Newton\'s laws, momentum conservation, and projectile trajectory.',
        objectives: [
          'Apply the three equations of motion to horizontal and vertical trajectories.',
          'Calculate maximum height, time of flight, and range of a projectile.',
          'State and verify the law of conservation of linear momentum.'
        ],
        keyPoints: [
          'v = u + at; s = ut + ½at²; v² = u² + 2as',
          'Time of flight: T = (2u sin θ) / g',
          'Maximum Height: H = (u² sin² θ) / (2g)',
          'Range: R = (u² sin 2θ) / g'
        ],
        examWeight: 'High',
        lessonContent: `### Mechanics in WASSCE Physics

#### 1. Equations of Motion
- $v = u + at$
- $s = ut + \\frac{1}{2}at^2$
- $v^2 = u^2 + 2as$
- For vertical motion under gravity, replace $a$ with $-g$ (rising) or $+g$ (falling).

#### 2. Projectile Motion
A projectile fired with initial velocity $u$ at angle $\\theta$ to the horizontal:
- Initial horizontal velocity: $u_x = u \\cos \\theta$ (constant, assuming no air resistance)
- Initial vertical velocity: $u_y = u \\sin \\theta$
- **Time of flight**: $T = \\frac{2u \\sin \\theta}{g}$
- **Maximum Height**: $H = \\frac{u^2 \\sin^2 \\theta}{2g}$
- **Horizontal Range**: $R = \\frac{u^2 \\sin(2\\theta)}{g}$ (Maximum range occurs at $\\theta = 45^\\circ$).`,
        practiceQuestions: [
          {
            id: 'waec-p-q1',
            question: 'A ball is projected with an initial velocity of 20 m/s at an angle of 30° to the horizontal. Calculate the maximum height reached. (Take g = 10 m/s²).',
            options: ['5 m', '10 m', '15 m', '20 m'],
            correctAnswer: 0,
            explanation: 'H = (u² sin² θ) / (2g) = (20² × (sin 30°)²) / (2 × 10) = (400 × (0.5)²) / 20 = (400 × 0.25) / 20 = 100 / 20 = 5 m.'
          }
        ]
      }
    ]
  },
  {
    id: 'waec-chem',
    name: 'Chemistry',
    code: 'CHM',
    category: 'Science',
    iconName: 'FlaskConical',
    description: 'Atomic structure, chemical bonding, stoichiometry, periodic properties, and organic chemistry.',
    totalTopics: 3,
    questionCount: 6,
    topics: [
      {
        id: 'waec-chm-t1',
        name: 'Atomic Structure & Periodic Trends',
        overview: 'Electronic configuration (s, p, d, f notation), periodic trends (ionization energy, electronegativity, atomic radius), and chemical bonding.',
        objectives: [
          'Write spdf electronic configurations for atoms and ions up to Z = 30.',
          'Explain trends across periods and down groups for atomic radii and ionization energy.',
          'Differentiate between electrovalent, covalent, coordinate, and metallic bonding.'
        ],
        keyPoints: [
          'Atomic radius decreases across a period and increases down a group.',
          'Electronegativity increases across a period and decreases down a group.',
          'Octet rule: Atoms lose, gain, or share valence electrons to achieve stable octet.'
        ],
        examWeight: 'High',
        lessonContent: `### Atomic Structure & Periodic Trends

#### 1. Quantum Numbers and Orbitals
- **Aufbau Principle**: Orbitals of lowest energy are filled first (1s < 2s < 2p < 3s < 3p < 4s < 3d).
- **Hund\'s Rule**: Orbitals of equal energy are singly occupied before pairing occurs.
- **Pauli Exclusion Principle**: No two electrons in an atom can have the same four quantum numbers.

#### 2. Periodic Trends
- **Atomic Radius**: Decreases from left to right across a period due to increasing effective nuclear charge; increases down a group due to additional electron shells.
- **First Ionization Energy**: Energy required to remove the most loosely bound electron from an isolated gaseous atom. Trends: Increases across a period, decreases down a group.`,
        practiceQuestions: [
          {
            id: 'waec-c-q1',
            question: 'What is the correct electronic configuration of the Fe²⁺ ion? (Atomic number of Fe = 26).',
            options: [
              '1s² 2s² 2p⁶ 3s² 3p⁶ 3d⁶',
              '1s² 2s² 2p⁶ 3s² 3p⁶ 4s² 3d⁴',
              '1s² 2s² 2p⁶ 3s² 3p⁶ 3d⁵ 4s¹',
              '1s² 2s² 2p⁶ 3s² 3p⁶ 4s² 3d⁶'
            ],
            correctAnswer: 0,
            explanation: 'Neutral Fe is [Ar] 4s² 3d⁶. When ionizing to Fe²⁺, the two 4s electrons are lost first, leaving [Ar] 3d⁶, which is 1s² 2s² 2p⁶ 3s² 3p⁶ 3d⁶.'
          }
        ]
      }
    ]
  },
  {
    id: 'waec-econ',
    name: 'Economics',
    code: 'ECN',
    category: 'Social Science',
    iconName: 'TrendingUp',
    description: 'Microeconomics, price theory, consumer behavior, national income, and public finance.',
    totalTopics: 3,
    questionCount: 6,
    topics: [
      {
        id: 'waec-ecn-t1',
        name: 'Theory of Demand and Supply & Elasticity',
        overview: 'Price elasticity of demand and supply, equilibrium price determination, government price controls (ceiling and floor).',
        objectives: [
          'Calculate price, income, and cross elasticity of demand.',
          'Interpret market equilibrium shifts caused by non-price determinants.',
          'Analyze economic consequences of maximum and minimum price legislation.'
        ],
        keyPoints: [
          'Price Elasticity of Demand (PED) = (% Change in Qty Demanded) / (% Change in Price)',
          'Maximum price (Price Ceiling) set below equilibrium results in market shortage/black markets.',
          'Minimum price (Price Floor) set above equilibrium causes surplus/excess supply.'
        ],
        examWeight: 'High',
        lessonContent: `### Demand, Supply & Price Theory

#### 1. Elasticity of Demand
- **Price Elasticity ($E_d$)**:
  $$E_d = \\frac{\\% \\Delta Q_d}{\\% \\Delta P} = \\frac{\\Delta Q}{\\Delta P} \\times \\frac{P}{Q}$$
- $|E_d| > 1$: Elastic
- $|E_d| < 1$: Inelastic
- $|E_d| = 1$: Unitary elastic

#### 2. Price Controls
- **Maximum Price (Price Ceiling)**: Fixed by government below equilibrium to protect consumers from inflation. Effects: Shortage, rationing, black marketing.
- **Minimum Price (Price Floor)**: Fixed above equilibrium to protect producers/farmers. Effects: Excess supply (surplus), government buffer stock purchases.`,
        practiceQuestions: [
          {
            id: 'waec-ec-q1',
            question: 'When government imposes a legal maximum price below the equilibrium price, what is the immediate market consequence?',
            options: [
              'A persistent market shortage with demand exceeding supply',
              'A surplus of goods accumulating in warehouses',
              'An automatic increase in producer profits',
              'A total collapse of consumer demand'
            ],
            correctAnswer: 0,
            explanation: 'A price ceiling below equilibrium makes the good cheaper, causing quantity demanded to rise while quantity supplied contracts, creating an excess demand or market shortage.'
          }
        ]
      }
    ]
  },
  {
    id: 'waec-civic',
    name: 'Civic Education',
    code: 'CIV',
    category: 'Core',
    iconName: 'Shield',
    description: 'Human rights, democratic governance, citizenship, national values, and public institutions.',
    totalTopics: 3,
    questionCount: 6,
    topics: [
      {
        id: 'waec-civ-t1',
        name: 'Fundamental Human Rights & Rule of Law',
        overview: 'Universal Declaration of Human Rights (UDHR), constitutional safeguards, limitations of human rights, and components of the rule of law.',
        objectives: [
          'State the history and core articles of the 1948 UDHR.',
          'Explain principles of the rule of law (supremacy, equality, protection of rights).',
          'Identify situations where individual rights may lawfully be curtailed.'
        ],
        keyPoints: [
          'UDHR adopted by UN General Assembly on December 10, 1948.',
          'Rights may be restricted during state of emergency, war, or lawful detention.'
        ],
        examWeight: 'High',
        lessonContent: `### Civic Education: Human Rights & Rule of Law

#### 1. Universal Declaration of Human Rights (UDHR)
Adopted on December 10, 1948 by the UN General Assembly in Paris.
Core rights: Right to life, liberty, equality before the law, freedom from torture, freedom of thought, conscience, and religion.

#### 2. The Rule of Law
Formulated by A.V. Dicey:
1. **Supremacy of the Law**: Absolute supremacy of regular law over arbitrary power.
2. **Equality Before the Law**: Equal subjection of all classes to the ordinary law of the land.
3. **Protection of Human Rights**: Rights established through judicial decisions and constitutions.`,
        practiceQuestions: [
          {
            id: 'waec-cv-q1',
            question: 'Which constitutional body is primarily tasked with safeguarding the fundamental human rights of citizens in Nigeria?',
            options: ['The Judiciary / Courts of Law', 'The Federal Civil Service', 'The Police Service Commission', 'The National Orientation Agency'],
            correctAnswer: 0,
            explanation: 'The Judiciary acts as the guardian of the constitution and the protector of citizens\' fundamental human rights through judicial review and enforcement.'
          }
        ]
      }
    ]
  }
];

// ==========================================
// 2. EXAM LEVELS FOR NIGERIA
// ==========================================
export const NIGERIA_CURRICULUM: CountryCurriculum = {
  code: 'NG',
  name: 'Nigeria',
  flag: '🇳🇬',
  description: 'National Educational Research and Development Council (NERDC), JAMB UTME, WAEC, and NECO standards.',
  educationLevels: [
    {
      id: 'jamb',
      name: 'JAMB (UTME)',
      shortName: 'JAMB',
      category: 'Tertiary Entrance',
      shortDescription: 'Official Computer-Based Test for admissions into Nigerian Universities, Polytechnics, and Colleges of Education.',
      badge: 'OFFICIAL CBT',
      badgeColor: 'bg-emerald-600 text-white',
      examBoard: 'Joint Admissions and Matriculation Board (JAMB)',
      officialSyllabusYear: '2024 / 2025 UTME',
      isJambDirect: true,
      subjects: [] // Will link to full JAMB Prep engine!
    },
    {
      id: 'waec',
      name: 'WAEC (WASSCE)',
      shortName: 'WAEC',
      category: 'Senior Secondary',
      shortDescription: 'West African Senior School Certificate Examination for SS1 - SS3 candidates across science, arts, and commercial streams.',
      badge: 'SSCE',
      badgeColor: 'bg-blue-600 text-white',
      examBoard: 'West African Examinations Council (WAEC)',
      officialSyllabusYear: '2024 / 2025 Syllabus',
      subjects: NIGERIA_WAEC_SUBJECTS
    },
    {
      id: 'neco',
      name: 'NECO (SSCE)',
      shortName: 'NECO',
      category: 'Senior Secondary',
      shortDescription: 'National Examinations Council Senior School Certificate Examination for secondary school completion.',
      badge: 'NATIONAL',
      badgeColor: 'bg-amber-600 text-white',
      examBoard: 'National Examinations Council (NECO)',
      officialSyllabusYear: '2024 / 2025 Syllabus',
      subjects: NIGERIA_WAEC_SUBJECTS // NECO shares the NERDC Senior Secondary syllabus
    },
    {
      id: 'bece',
      name: 'BECE (Junior WAEC)',
      shortName: 'BECE',
      category: 'Junior Secondary',
      shortDescription: 'Basic Education Certificate Examination concluding 9-year universal basic education (JSS 1 - 3).',
      badge: 'JUNIOR',
      badgeColor: 'bg-teal-600 text-white',
      examBoard: 'NERDC / State Examination Boards',
      officialSyllabusYear: '2024 / 2025 Standard',
      subjects: [
        {
          id: 'bece-math',
          name: 'Mathematics',
          code: 'MTH',
          category: 'Core',
          iconName: 'Calculator',
          description: 'Whole numbers, fractions, percentages, basic algebra, plane shapes, and statistics.',
          totalTopics: 3,
          questionCount: 6,
          topics: [
            {
              id: 'bece-m-t1',
              name: 'Basic Algebra & Simple Equations',
              overview: 'Expansion of algebraic terms, factorization of common factors, and solving one-variable linear equations.',
              objectives: ['Simplify algebraic expressions', 'Solve linear equations with brackets'],
              keyPoints: ['Balance method: whatever operation is done on the LHS must be done on the RHS.'],
              examWeight: 'High',
              lessonContent: `### Basic Algebra for Junior Secondary Candidates\n\nLinear equations in one variable involve expressions where the highest power of the unknown is 1 (e.g., $3x + 5 = 20$).`,
              practiceQuestions: [
                {
                  id: 'bece-q1',
                  question: 'Solve for x: 3x - 7 = 14.',
                  options: ['x = 7', 'x = 8', 'x = 21', 'x = 3'],
                  correctAnswer: 0,
                  explanation: '3x = 14 + 7 = 21 ⇒ x = 21/3 = 7.'
                }
              ]
            }
          ]
        },
        {
          id: 'bece-sci',
          name: 'Basic Science & Technology',
          code: 'BST',
          category: 'Science',
          iconName: 'Atom',
          description: 'Living and non-living things, environmental sanitation, energy, and digital technology.',
          totalTopics: 2,
          questionCount: 4,
          topics: [
            {
              id: 'bece-s-t1',
              name: 'Living Organisms & Environmental Conservation',
              overview: 'Characteristics of living things, pollution control, sanitation, and disease prevention.',
              objectives: ['List characteristics of living organisms', 'Identify causes and effects of water and air pollution'],
              keyPoints: ['MR NIGER D: Movement, Respiration, Nutrition, Irritability, Growth, Excretion, Reproduction, Death.'],
              examWeight: 'High',
              lessonContent: `### Living Organisms in Basic Science\n\nAll living organisms display the fundamental characteristics summarized as MR NIGER D.`,
              practiceQuestions: [
                {
                  id: 'bece-s-q1',
                  question: 'Which of the following processes is responsible for energy release in living cells?',
                  options: ['Respiration', 'Excretion', 'Reproduction', 'Irritability'],
                  correctAnswer: 0,
                  explanation: 'Respiration is the cellular biochemical breakdown of food substances (glucose) to release energy in the form of ATP.'
                }
              ]
            }
          ]
        }
      ]
    }
  ]
};

// ==========================================
// 3. UNITED STATES (US) CURRICULUM
// ==========================================
export const US_CURRICULUM: CountryCurriculum = {
  code: 'US',
  name: 'United States',
  flag: '🇺🇸',
  description: 'College Board Digital SAT, ACT, Advanced Placement (AP), and Common Core State Standards (CCSS).',
  educationLevels: [
    {
      id: 'sat',
      name: 'Digital SAT',
      shortName: 'SAT',
      category: 'College Prep',
      shortDescription: 'Standardized college admissions exam administered by the College Board measuring Math and Reading & Writing.',
      badge: 'DIGITAL',
      badgeColor: 'bg-indigo-600 text-white',
      examBoard: 'College Board',
      officialSyllabusYear: '2024 / 2025 Digital SAT',
      subjects: [
        {
          id: 'sat-math',
          name: 'SAT Mathematics',
          code: 'SAT-MTH',
          category: 'Math',
          iconName: 'Calculator',
          description: 'Algebra, Advanced Math, Problem-Solving and Data Analysis, and Geometry & Trigonometry.',
          totalTopics: 4,
          questionCount: 8,
          topics: [
            {
              id: 'sat-m-t1',
              name: 'Heart of Algebra: Linear Equations & Systems',
              overview: 'Mastery of linear equations in one and two variables, linear functions, and systems of linear equations and inequalities.',
              objectives: ['Solve linear equations and systems', 'Interpret slope and y-intercept in context'],
              keyPoints: ['Slope-intercept form: y = mx + b', 'Parallel lines have identical slopes; perpendicular slopes are negative reciprocals.'],
              examWeight: 'High',
              lessonContent: `### SAT Heart of Algebra Guide\n\nLinear equations represent lines with constant rate of change (slope $m = \\frac{y_2 - y_1}{x_2 - x_1}$).`,
              practiceQuestions: [
                {
                  id: 'sat-q1',
                  question: 'If 3x + 2y = 12 and y = 2x - 1, what is the value of x?',
                  options: ['2', '3', '1.5', '4'],
                  correctAnswer: 0,
                  explanation: 'Substitute y = 2x - 1 into first equation: 3x + 2(2x - 1) = 12 ⇒ 3x + 4x - 2 = 12 ⇒ 7x = 14 ⇒ x = 2.'
                }
              ]
            }
          ]
        },
        {
          id: 'sat-rw',
          name: 'SAT Reading & Writing',
          code: 'SAT-RW',
          category: 'English',
          iconName: 'BookOpen',
          description: 'Craft and Structure, Information and Ideas, Standard English Conventions, and Expression of Ideas.',
          totalTopics: 3,
          questionCount: 6,
          topics: [
            {
              id: 'sat-rw-t1',
              name: 'Standard English Conventions: Punctuation & Clauses',
              overview: 'Independent vs dependent clauses, semicolons, commas, apostrophes, and subject-verb agreement.',
              objectives: ['Eliminate comma splices and run-ons', 'Select correct relative pronouns and transitions'],
              keyPoints: ['A semicolon connects two complete independent clauses without a conjunction.'],
              examWeight: 'Essential',
              lessonContent: `### SAT Conventions & Punctuation Rules\n\nAvoid comma splices: two independent clauses cannot be joined by a comma alone without a coordinating conjunction (FANBOYS).`,
              practiceQuestions: [
                {
                  id: 'sat-rw-q1',
                  question: 'Which choice correctly joins two independent clauses without a coordinating conjunction?',
                  options: [
                    'The experiment was a success; the team published their findings immediately.',
                    'The experiment was a success, the team published their findings immediately.',
                    'The experiment was a success the team published their findings immediately.',
                    'The experiment was a success, therefore the team published their findings immediately.'
                  ],
                  correctAnswer: 0,
                  explanation: 'A semicolon is grammatically required to separate two independent clauses without a conjunction. A comma alone creates an illegal comma splice.'
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: 'ap',
      name: 'Advanced Placement (AP)',
      shortName: 'AP',
      category: 'High School',
      shortDescription: 'College-level coursework and examinations recognized for college credit and advanced placement.',
      badge: 'COLLEGE LEVEL',
      badgeColor: 'bg-blue-700 text-white',
      examBoard: 'College Board',
      officialSyllabusYear: '2024 / 2025 AP Standards',
      subjects: [
        {
          id: 'ap-calc',
          name: 'AP Calculus AB',
          code: 'AP-CALC',
          category: 'Math',
          iconName: 'FunctionSquare',
          description: 'Limits, continuity, differential calculus, and integral calculus applications.',
          totalTopics: 2,
          questionCount: 4,
          topics: [
            {
              id: 'ap-c-t1',
              name: 'Limits and Continuity',
              overview: 'Definition of a limit, one-sided limits, squeeze theorem, and conditions for continuity at a point.',
              objectives: ['Evaluate limits algebraically', 'Determine continuity at x = c'],
              keyPoints: ['A function is continuous at c if f(c) exists, lim_{x->c} f(x) exists, and they are equal.'],
              examWeight: 'High',
              lessonContent: `### AP Calculus: Limits & Continuity\n\nUnderstanding the formal limit definition and L\'Hôpital\'s Rule for indeterminate forms $0/0$ or $\\infty/\\infty$.`,
              practiceQuestions: [
                {
                  id: 'ap-calc-q1',
                  question: 'Evaluate lim(x -> 0) [sin(3x) / x].',
                  options: ['3', '1', '0', '1/3'],
                  correctAnswer: 0,
                  explanation: 'Using the standard limit lim(θ -> 0) [sin(θ)/θ] = 1, rewrite as 3 × [sin(3x)/(3x)]. The limit is 3 × 1 = 3.'
                }
              ]
            }
          ]
        }
      ]
    }
  ]
};

// ==========================================
// 4. UNITED KINGDOM (UK) CURRICULUM
// ==========================================
export const UK_CURRICULUM: CountryCurriculum = {
  code: 'UK',
  name: 'United Kingdom',
  flag: '🇬🇧',
  description: 'Ofqual National Curriculum, GCSE, IGCSE (Years 10-11), and GCE Advanced Levels (Sixth Form).',
  educationLevels: [
    {
      id: 'gcse',
      name: 'GCSE / IGCSE',
      shortName: 'GCSE',
      category: 'Senior Secondary',
      shortDescription: 'General Certificate of Secondary Education across AQA, Edexcel, and OCR examination boards (Ages 14-16).',
      badge: 'KEY STAGE 4',
      badgeColor: 'bg-purple-600 text-white',
      examBoard: 'AQA / Edexcel / OCR',
      officialSyllabusYear: '2024 / 2025 GCSE 9-1',
      subjects: [
        {
          id: 'gcse-math',
          name: 'GCSE Mathematics',
          code: 'GCSE-MATH',
          category: 'Core',
          iconName: 'Calculator',
          description: 'Higher and Foundation Tier Mathematics (Number, Algebra, Ratio, Geometry, Probability, Statistics).',
          totalTopics: 3,
          questionCount: 6,
          topics: [
            {
              id: 'gcse-m-t1',
              name: 'Ratio, Proportion & Rates of Change',
              overview: 'Dividing into ratios, direct and inverse proportion, compound units (speed, density, pressure).',
              objectives: ['Divide quantities in given ratios', 'Solve compound measure word problems'],
              keyPoints: ['Speed = Distance / Time; Density = Mass / Volume.'],
              examWeight: 'High',
              lessonContent: `### GCSE Mathematics: Ratio and Compound Measures\n\nDividing in a given ratio $a:b$ requires finding total parts $a+b$, calculating the value of one part, and multiplying.`,
              practiceQuestions: [
                {
                  id: 'gcse-q1',
                  question: 'Divide £240 in the ratio 3:5.',
                  options: ['£90 and £150', '£80 and £160', '£100 and £140', '£60 and £180'],
                  correctAnswer: 0,
                  explanation: 'Total parts = 3 + 5 = 8. One part = £240 / 8 = £30. 3 parts = £90, 5 parts = £150.'
                }
              ]
            }
          ]
        },
        {
          id: 'gcse-sci',
          name: 'GCSE Combined Science',
          code: 'GCSE-SCI',
          category: 'Science',
          iconName: 'Atom',
          description: 'Biology, Chemistry, and Physics core components for double award science certification.',
          totalTopics: 2,
          questionCount: 4,
          topics: [
            {
              id: 'gcse-s-t1',
              name: 'Atomic Structure & The Periodic Table',
              overview: 'Structure of the atom, electronic arrangement, Group 1 alkali metals, and Group 7 halogens.',
              objectives: ['Deduce atomic structure from mass number', 'Explain group trends in reactivity'],
              keyPoints: ['Alkali metals increase in reactivity down Group 1; Halogens decrease in reactivity down Group 7.'],
              examWeight: 'High',
              lessonContent: `### GCSE Chemistry: Periodic Table Trends\n\nGroup 1 elements react by losing their single valence electron. As atoms become larger down the group, the outer electron is further from the nucleus and more easily lost.`,
              practiceQuestions: [
                {
                  id: 'gcse-q2',
                  question: 'Why does potassium react more vigorously with water than sodium does?',
                  options: [
                    'Its outer electron is further from the nucleus and more easily lost',
                    'It has more protons in the nucleus holding electrons tighter',
                    'It has fewer electron shells shielding the nucleus',
                    'It is a non-metal that forms negative ions readily'
                  ],
                  correctAnswer: 0,
                  explanation: 'Potassium has more electron shells than sodium, resulting in greater electron shielding and a weaker electrostatic attraction between the nucleus and the valence electron, making it easier to lose.'
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: 'alevels',
      name: 'A-Levels (GCE)',
      shortName: 'A-Levels',
      category: 'Senior Secondary',
      shortDescription: 'Advanced Level qualifications for university entry in the UK and worldwide (Sixth Form Years 12-13).',
      badge: 'SIXTH FORM',
      badgeColor: 'bg-blue-800 text-white',
      examBoard: 'Cambridge / Edexcel / AQA',
      officialSyllabusYear: '2024 / 2025 A-Level',
      subjects: [
        {
          id: 'alevel-math',
          name: 'A-Level Mathematics',
          code: 'AL-MTH',
          category: 'Math',
          iconName: 'FunctionSquare',
          description: 'Pure Mathematics, Mechanics, and Statistics components.',
          totalTopics: 2,
          questionCount: 4,
          topics: [
            {
              id: 'al-m-t1',
              name: 'Pure Mathematics: Differentiation & Integration',
              overview: 'Chain rule, product rule, quotient rule, integration by substitution, and integration by parts.',
              objectives: ['Differentiate composite functions using chain rule', 'Apply integration by parts'],
              keyPoints: ['Product rule: d/dx(uv) = u(dv/dx) + v(du/dx)', 'Integration by parts: ∫ u(dv/dx) dx = uv - ∫ v(du/dx) dx.'],
              examWeight: 'High',
              lessonContent: `### A-Level Pure Mathematics: Calculus\n\nAdvanced calculus requires mastering the chain rule, product rule, quotient rule, and techniques of integration.`,
              practiceQuestions: [
                {
                  id: 'al-q1',
                  question: 'Differentiate y = x² · e^(3x) with respect to x.',
                  options: [
                    'e^(3x) · (2x + 3x²)',
                    '2x · e^(3x)',
                    '3x² · e^(3x)',
                    '6x · e^(3x)'
                  ],
                  correctAnswer: 0,
                  explanation: 'By product rule: d/dx(u·v) = u\'v + uv\'. Here u = x², u\' = 2x; v = e^(3x), v\' = 3e^(3x). Result: 2x·e^(3x) + 3x²·e^(3x) = e^(3x)(2x + 3x²).'
                }
              ]
            }
          ]
        }
      ]
    }
  ]
};

// ==========================================
// 5. INDIA (IN) CURRICULUM
// ==========================================
export const INDIA_CURRICULUM: CountryCurriculum = {
  code: 'IN',
  name: 'India',
  flag: '🇮🇳',
  description: 'NCERT / CBSE Board, CISCE, and National Entrance Examinations (JEE, NEET).',
  educationLevels: [
    {
      id: 'cbse10',
      name: 'CBSE Class 10 (Board Exam)',
      shortName: 'Class 10',
      category: 'Board Exam',
      shortDescription: 'Central Board of Secondary Education Class X All India Secondary School Examination.',
      badge: 'CBSE X',
      badgeColor: 'bg-orange-600 text-white',
      examBoard: 'Central Board of Secondary Education (CBSE)',
      officialSyllabusYear: '2024 / 2025 NCERT',
      subjects: [
        {
          id: 'cbse10-math',
          name: 'Mathematics (Standard / Basic)',
          code: 'CBSE-MATH',
          category: 'Core',
          iconName: 'Calculator',
          description: 'Real Numbers, Polynomials, Linear Equations, Quadratic, Arithmetic Progression, Trigonometry, Statistics.',
          totalTopics: 2,
          questionCount: 4,
          topics: [
            {
              id: 'cbse10-m-t1',
              name: 'Real Numbers & Fundamental Theorem of Arithmetic',
              overview: 'Euclid\'s division lemma, Fundamental Theorem of Arithmetic, and proofs of irrationality of √2, √3, √5.',
              objectives: ['Find HCF and LCM using prime factorization', 'Prove irrationality of square roots'],
              keyPoints: ['HCF(a, b) × LCM(a, b) = a × b.'],
              examWeight: 'High',
              lessonContent: `### Real Numbers for CBSE Class 10\n\nThe Fundamental Theorem of Arithmetic states that every composite number can be uniquely expressed as a product of prime factors.`,
              practiceQuestions: [
                {
                  id: 'cbse-q1',
                  question: 'If HCF(306, 657) = 9, find LCM(306, 657).',
                  options: ['22338', '21338', '23338', '22438'],
                  correctAnswer: 0,
                  explanation: 'HCF × LCM = Product of numbers ⇒ LCM = (306 × 657) / 9 = 34 × 657 = 22,338.'
                }
              ]
            }
          ]
        },
        {
          id: 'cbse10-sci',
          name: 'Science',
          code: 'CBSE-SCI',
          category: 'Science',
          iconName: 'Atom',
          description: 'Chemical Reactions, Life Processes, Electricity, Magnetic Effects, and Light (Reflection/Refraction).',
          totalTopics: 2,
          questionCount: 4,
          topics: [
            {
              id: 'cbse10-s-t1',
              name: 'Life Processes: Nutrition, Respiration & Circulation',
              overview: 'Autotrophic and heterotrophic nutrition, human digestive system, double circulation in humans.',
              objectives: ['Explain the mechanism of double circulation in human heart', 'Describe nephron filtration'],
              keyPoints: ['Pulmonary artery carries deoxygenated blood from right ventricle to lungs.'],
              examWeight: 'High',
              lessonContent: `### Life Processes in CBSE Class 10 Science\n\nDetailed breakdown of autotrophic photosynthesis, stomatal mechanisms, human cardiac circulation, and kidney excretion.`,
              practiceQuestions: [
                {
                  id: 'cbse-s-q1',
                  question: 'Which chamber of the human heart pumps oxygenated blood to all parts of the body?',
                  options: ['Left ventricle', 'Right ventricle', 'Left atrium', 'Right atrium'],
                  correctAnswer: 0,
                  explanation: 'The left ventricle has thick muscular walls to pump oxygenated blood through the aorta into systemic circulation.'
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: 'neet',
      name: 'NEET (UG)',
      shortName: 'NEET',
      category: 'College Prep',
      shortDescription: 'National Eligibility cum Entrance Test for undergraduate medical admissions across India.',
      badge: 'MEDICAL',
      badgeColor: 'bg-emerald-700 text-white',
      examBoard: 'National Testing Agency (NTA)',
      officialSyllabusYear: '2024 / 2025 NTA',
      subjects: [
        {
          id: 'neet-bio',
          name: 'Biology (Botany & Zoology)',
          code: 'NEET-BIO',
          category: 'Science',
          iconName: 'Dna',
          description: 'Diversity in Living World, Structural Organisation, Cell Biology, Plant Physiology, Human Physiology, Genetics.',
          totalTopics: 2,
          questionCount: 4,
          topics: [
            {
              id: 'neet-b-t1',
              name: 'Genetics and Evolution',
              overview: 'Mendelian inheritance, chromosomal theory, DNA replication, transcription, and translation.',
              objectives: ['Solve dihybrid cross ratios', 'Understand genetic code characteristics'],
              keyPoints: ['Genetic code is degenerate, unambiguous, and universal with AUG as start codon.'],
              examWeight: 'High',
              lessonContent: `### Molecular Basis of Inheritance for NEET\n\nStructure of DNA double helix, Meselson-Stahl experiment proving semiconservative replication, and central dogma of molecular biology.`,
              practiceQuestions: [
                {
                  id: 'neet-q1',
                  question: 'Which codon acts as both the initiation codon for translation and codes for Methionine?',
                  options: ['AUG', 'UAA', 'UAG', 'UGA'],
                  correctAnswer: 0,
                  explanation: 'AUG is the universal start codon in mRNA translation, coding for the amino acid Methionine.'
                }
              ]
            }
          ]
        }
      ]
    }
  ]
};

// ==========================================
// 6. INTERNATIONAL (INT) CURRICULUM
// ==========================================
export const INTERNATIONAL_CURRICULUM: CountryCurriculum = {
  code: 'INT',
  name: 'International',
  flag: '🌐',
  description: 'International Baccalaureate (IB), Cambridge Assessment International, and Global Standards.',
  educationLevels: [
    {
      id: 'ib-dp',
      name: 'IB Diploma Programme (DP)',
      shortName: 'IB Diploma',
      category: 'International',
      shortDescription: 'Rigorous two-year pre-university international curriculum for students aged 16-19.',
      badge: 'GLOBAL',
      badgeColor: 'bg-cyan-600 text-white',
      examBoard: 'International Baccalaureate Organization (IBO)',
      officialSyllabusYear: '2024 / 2025 IB Standards',
      subjects: [
        {
          id: 'ib-math-aa',
          name: 'Mathematics: Analysis and Approaches (HL/SL)',
          code: 'IB-MATH-AA',
          category: 'Math',
          iconName: 'Calculator',
          description: 'Functions, trigonometry, geometry, calculus, and mathematical proof.',
          totalTopics: 2,
          questionCount: 4,
          topics: [
            {
              id: 'ib-m-t1',
              name: 'Calculus: Derivatives & Tangents',
              overview: 'First principles, rate of change, tangents, normals, and optimization problems.',
              objectives: ['Find equations of tangents and normals to curves', 'Solve global optimization problems'],
              keyPoints: ['The slope of the tangent at x = a is f\'(a). The slope of the normal is -1 / f\'(a).'],
              examWeight: 'High',
              lessonContent: `### IB Mathematics AA: Differential Calculus\n\nStudy of rates of change, stationary points, inflection points, and concavity.`,
              practiceQuestions: [
                {
                  id: 'ib-q1',
                  question: 'Find the gradient of the normal to the curve y = 2x³ - 5x at the point where x = 1.',
                  options: ['-1', '1', '-1/5', '5'],
                  correctAnswer: 0,
                  explanation: 'dy/dx = 6x² - 5. At x = 1, tangent gradient m_t = 6(1) - 5 = 1. Normal gradient m_n = -1 / m_t = -1 / 1 = -1.'
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: 'cambridge-igcse',
      name: 'Cambridge IGCSE',
      shortName: 'Cambridge',
      category: 'International',
      shortDescription: 'The world\'s most popular international qualification for 14 to 16 year olds.',
      badge: 'CAMBRIDGE',
      badgeColor: 'bg-rose-700 text-white',
      examBoard: 'Cambridge Assessment International Education',
      officialSyllabusYear: '2024 / 2025 Syllabus',
      subjects: NIGERIA_WAEC_SUBJECTS // Shares international standard O-Level syllabus
    }
  ]
};

// ==========================================
// MASTER ALL COUNTRIES MAP
// ==========================================
export const ALL_COUNTRY_CURRICULA: Record<string, CountryCurriculum> = {
  NG: NIGERIA_CURRICULUM,
  US: US_CURRICULUM,
  UK: UK_CURRICULUM,
  IN: INDIA_CURRICULUM,
  INT: INTERNATIONAL_CURRICULUM,
};

/**
 * Normalizes user country name from profile to matching curriculum key
 */
export function normalizeCountryCode(countryString?: string | null): string {
  if (!countryString) return 'NG';
  const c = countryString.trim().toLowerCase();

  if (c.includes('nigeria') || c === 'ng') return 'NG';
  if (c.includes('united states') || c.includes('usa') || c === 'us') return 'US';
  if (c.includes('united kingdom') || c.includes('britain') || c.includes('england') || c === 'uk') return 'UK';
  if (c.includes('india') || c === 'in') return 'IN';
  if (c.includes('international') || c.includes('global') || c === 'int') return 'INT';

  return 'NG'; // Default to Nigeria if unknown
}

export function getCountryCurriculum(countryString?: string | null): CountryCurriculum {
  const code = normalizeCountryCode(countryString);
  return ALL_COUNTRY_CURRICULA[code] || NIGERIA_CURRICULUM;
}
