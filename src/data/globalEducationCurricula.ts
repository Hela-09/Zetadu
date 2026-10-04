/**
 * LearnDean Global Education System
 * Complete multi-continent, country-isolated curriculum architecture:
 * Continent -> Country -> Education Level -> Class/Grade -> Exam -> Subjects -> Curriculum -> Topics -> Study/Practice
 *
 * Covers: Africa, Europe, North America, South America, Asia, Oceania
 * Strictly authentic examinations, boards, and national syllabi.
 */

export type ContinentId = 
  | 'africa' 
  | 'europe' 
  | 'north_america' 
  | 'south_america' 
  | 'asia' 
  | 'oceania';

export interface GlobalPracticeQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface GlobalTopic {
  id: string;
  name: string;
  overview: string;
  objectives: string[];
  keyPoints: string[];
  examWeight: 'High' | 'Medium' | 'Essential';
  lessonContent: string;
  practiceQuestions: GlobalPracticeQuestion[];
}

export interface GlobalSubject {
  id: string;
  name: string;
  code: string;
  category: 'Core' | 'Sciences' | 'Social Sciences' | 'Humanities' | 'Commercial' | 'Technical' | 'Languages';
  description: string;
  curriculumOverview: string;
  officialTopics: GlobalTopic[];
}

export interface ExamAssessment {
  id: string;
  name: string;
  shortName: string;
  examBoard: string;
  officialCurriculumYear: string;
  badge?: string;
  badgeColor?: string;
  description: string;
  isJambDirect?: boolean;
  subjects: GlobalSubject[];
}

export interface ClassGradeLevel {
  id: string;
  name: string;
  ageRange?: string;
  description: string;
  exams: ExamAssessment[];
}

export interface EducationStage {
  id: string;
  name: string;
  stageType: 'primary' | 'junior_secondary' | 'senior_secondary' | 'national_exams' | 'tertiary_entrance' | 'higher_ed';
  description: string;
  grades: ClassGradeLevel[];
}

export interface CountryEducation {
  id: string;
  code: string;
  name: string;
  flag: string;
  continentId: ContinentId;
  capital: string;
  educationMinistry: string;
  systemDescription: string;
  educationStages: EducationStage[];
}

export interface Continent {
  id: ContinentId;
  name: string;
  icon: string;
  description: string;
  countries: CountryEducation[];
}

// ============================================================================
// SHARED TOPICS & VERIFIED PRACTICE REPOSITORIES
// ============================================================================

export const MATH_CORE_TOPICS: GlobalTopic[] = [
  {
    id: 'm-core-t1',
    name: 'Indices, Logarithms & Surds',
    overview: 'Laws of indices, logarithmic conversions, change of base, and simplification of surds with rationalization of denominators.',
    objectives: [
      'Apply the laws of indices to simplify complex exponential expressions.',
      'Solve logarithmic equations using standard rules of base change.',
      'Rationalize denominators of surds involving binomial radicals.'
    ],
    keyPoints: [
      'a^m × a^n = a^(m+n); a^m ÷ a^n = a^(m-n); (a^m)^n = a^(mn)',
      'log_b(xy) = log_b(x) + log_b(y); log_b(x/y) = log_b(x) - log_b(y)',
      'To rationalize 1 / (√a + √b), multiply numerator and denominator by conjugate (√a - √b).'
    ],
    examWeight: 'High',
    lessonContent: `### Number and Numeration: Indices, Logarithms & Surds

#### 1. Indices
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
- $\\sqrt{ab} = \\sqrt{a} \\times \\sqrt{b}$
- $\\sqrt{\\frac{a}{b}} = \\frac{\\sqrt{a}}{\\sqrt{b}}$
- **Conjugate**: Conjugate of $(a + \\sqrt{b})$ is $(a - \\sqrt{b})$.`,
    practiceQuestions: [
      {
        id: 'qm-1',
        question: 'Simplify without using mathematical tables: (27)^(2/3) × (64)^(-1/3) ÷ (16)^(1/4).',
        options: ['9/8', '3/4', '9/4', '18'],
        correctAnswer: 0,
        explanation: '27^(2/3) = (3^3)^(2/3) = 3^2 = 9. 64^(-1/3) = 1/(64^(1/3)) = 1/4. 16^(1/4) = 2. Thus 9 × (1/4) ÷ 2 = (9/4) / 2 = 9/8.'
      },
      {
        id: 'qm-2',
        question: 'Given that log₁₀(2) = 0.3010 and log₁₀(3) = 0.4771, calculate log₁₀(18).',
        options: ['1.2552', '1.0791', '0.7781', '1.5562'],
        correctAnswer: 0,
        explanation: '18 = 2 × 3^2. log₁₀(18) = log₁₀(2) + 2·log₁₀(3) = 0.3010 + 2(0.4771) = 0.3010 + 0.9542 = 1.2552.'
      }
    ]
  },
  {
    id: 'm-core-t2',
    name: 'Quadratic Equations & Variations',
    overview: 'Methods of solving quadratic equations (factorization, formula, completing the square), simultaneous equations, and variations.',
    objectives: [
      'Solve quadratic equations arising from real-life situations.',
      'Solve simultaneous linear and quadratic equations.',
      'Determine constants of direct, inverse, and joint variations.'
    ],
    keyPoints: [
      'Quadratic formula: x = (-b ± √(b² - 4ac)) / (2a)',
      'Joint variation: y ∝ xz ⇒ y = kxz.'
    ],
    examWeight: 'Essential',
    lessonContent: `### Quadratic Equations & Variations

#### Quadratic Formula
For $ax^2 + bx + c = 0$:
$$x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$$
Discriminant $D = b^2 - 4ac$:
- $D > 0$: Two real distinct roots
- $D = 0$: Real equal roots
- $D < 0$: No real roots`,
    practiceQuestions: [
      {
        id: 'qm-3',
        question: 'Find the quadratic equation whose roots are -2/3 and 4.',
        options: ['3x² - 10x - 8 = 0', '3x² + 10x - 8 = 0', '3x² - 10x + 8 = 0', 'x² - 3x - 8 = 0'],
        correctAnswer: 0,
        explanation: 'Sum of roots = -2/3 + 4 = 10/3. Product = (-2/3)(4) = -8/3. Equation: x² - (10/3)x - 8/3 = 0 ⇒ 3x² - 10x - 8 = 0.'
      }
    ]
  }
];

export const ENGLISH_CORE_TOPICS: GlobalTopic[] = [
  {
    id: 'eng-core-t1',
    name: 'Grammatical Concord & Structure',
    overview: 'Subject-verb agreement rules, proximity concord, correlative conjunctions, tense sequences, and idioms.',
    objectives: [
      'Select verbs agreeing with complex singular and plural subjects.',
      'Identify prepositional idioms and collocations.'
    ],
    keyPoints: [
      'Neither...nor / Either...or follows proximity concord.',
      '"As well as" and "together with" do not pluralize the subject.'
    ],
    examWeight: 'High',
    lessonContent: `### Rules of Concord & Structure
- **Principle of Proximity**: With *neither...nor*, *either...or*, verb agrees with the subject closest to it.
- **Parenthetical Expressions**: Expressions such as *as well as*, *together with*, *along with* do not change the number of the subject.`,
    practiceQuestions: [
      {
        id: 'qe-1',
        question: 'Neither the captain nor the sailors _______ able to control the vessel during the storm.',
        options: ['were', 'was', 'is', 'are'],
        correctAnswer: 0,
        explanation: 'By the rule of proximity, the verb agrees with "the sailors" (plural), so "were" is correct.'
      },
      {
        id: 'qe-2',
        question: 'Choose the word that is NEAREST in meaning to: CANDID.',
        options: ['Frank and honest', 'Deceitful', 'Hesitant', 'Secretive'],
        correctAnswer: 0,
        explanation: 'Candid means truthful, outspoken, and straightforward.'
      }
    ]
  }
];

export const BIOLOGY_CORE_TOPICS: GlobalTopic[] = [
  {
    id: 'bio-core-t1',
    name: 'Cell Biology & Transport Mechanisms',
    overview: 'Cell structure and functions, diffusion, osmosis, active transport, and cellular respiration.',
    objectives: [
      'Differentiate between plant and animal cellular organelles.',
      'Explain the mechanisms of osmosis and plasmolysis in plant tissues.'
    ],
    keyPoints: [
      'Mitochondria: site of aerobic cellular respiration (ATP synthesis).',
      'Osmosis: net movement of water from higher water potential to lower across semi-permeable membrane.'
    ],
    examWeight: 'High',
    lessonContent: `### Cellular Organization & Transport
- **Prokaryotes vs Eukaryotes**: Prokaryotes lack membrane-bound nucleus and organelles.
- **Osmosis**: Movement of water molecules from hypotonic solution to hypertonic solution across partially permeable membrane.`,
    practiceQuestions: [
      {
        id: 'qb-1',
        question: 'Which of the following cellular organelles is primarily responsible for ATP synthesis during aerobic respiration?',
        options: ['Mitochondrion', 'Ribosome', 'Golgi apparatus', 'Endoplasmic reticulum'],
        correctAnswer: 0,
        explanation: 'The mitochondrion is the powerhouse of the cell where the Krebs cycle and oxidative phosphorylation occur.'
      }
    ]
  }
];

export const PHYSICS_CORE_TOPICS: GlobalTopic[] = [
  {
    id: 'phy-core-t1',
    name: 'Mechanics: Kinematics & Newton\'s Laws of Motion',
    overview: 'Equations of uniformly accelerated motion, projectiles, Newton\'s laws, and conservation of linear momentum.',
    objectives: [
      'Apply the equations of linear motion to solve kinematics problems.',
      'State and verify the law of conservation of linear momentum.'
    ],
    keyPoints: [
      'v = u + at; s = ut + 0.5at²; v² = u² + 2as',
      'Momentum p = mv; in isolated collisions, total momentum is conserved.'
    ],
    examWeight: 'High',
    lessonContent: `### Newton\'s Laws & Linear Motion
- **First Law**: Inertia - an object remains at rest or constant velocity unless acted upon by resultant force.
- **Second Law**: $F = \\frac{dp}{dt} = ma$.
- **Third Law**: For every action, there is an equal and opposite reaction.`,
    practiceQuestions: [
      {
        id: 'qp-1',
        question: 'A car travelling at 20 m/s accelerates uniformly at 2 m/s² for 5 seconds. What is its final velocity?',
        options: ['30 m/s', '25 m/s', '40 m/s', '10 m/s'],
        correctAnswer: 0,
        explanation: 'v = u + at = 20 + (2 × 5) = 20 + 10 = 30 m/s.'
      }
    ]
  }
];

export const CHEMISTRY_CORE_TOPICS: GlobalTopic[] = [
  {
    id: 'chem-core-t1',
    name: 'Atomic Structure & Chemical Bonding',
    overview: 'Subatomic particles, electronic configurations, ionic, covalent, and metallic bonding, and periodic trends.',
    objectives: [
      'Write electronic configurations using spdf notation.',
      'Explain ionization energy, electronegativity, and atomic radii periodic trends.'
    ],
    keyPoints: [
      'Electronegativity increases across a period and decreases down a group.',
      'Ionic bonding: electrostatic attraction between oppositely charged ions.'
    ],
    examWeight: 'High',
    lessonContent: `### Atomic Structure & Periodic Trends
- **Octet Rule**: Atoms gain, lose, or share valence electrons to achieve stable noble gas electronic configuration.
- **Trends**: Ionization energy increases across period due to increasing nuclear charge.`,
    practiceQuestions: [
      {
        id: 'qc-1',
        question: 'Which of the following elements has the highest electronegativity value on the Pauling scale?',
        options: ['Fluorine', 'Oxygen', 'Chlorine', 'Nitrogen'],
        correctAnswer: 0,
        explanation: 'Fluorine is the most electronegative element with a Pauling value of approximately 4.0.'
      }
    ]
  }
];

export const SCIENCE_GENERAL_TOPICS: GlobalTopic[] = [
  {
    id: 'sci-core-t1',
    name: 'Matter, Energy & Living Systems',
    overview: 'States of matter, energy transformations, ecosystems, human body systems, and simple machines.',
    objectives: [
      'Describe changes of state using kinetic particle theory.',
      'Identify energy conversions in everyday appliances.'
    ],
    keyPoints: [
      'Law of Conservation of Energy: energy cannot be created or destroyed, only transformed.',
      'Photosynthesis converts light energy into chemical energy.'
    ],
    examWeight: 'Essential',
    lessonContent: `### Matter and Energy Fundamentals
- **States of Matter**: Solid (fixed shape and volume), Liquid (fixed volume, variable shape), Gas (variable volume and shape).
- **Energy Transformations**: Chemical to electrical in batteries; electrical to mechanical in electric motors.`,
    practiceQuestions: [
      {
        id: 'qs-1',
        question: 'Which energy transformation occurs in a hydroelectric power station when water turns a turbine?',
        options: ['Kinetic energy to electrical energy', 'Chemical energy to heat energy', 'Nuclear energy to light energy', 'Sound energy to electrical energy'],
        correctAnswer: 0,
        explanation: 'Flowing water possesses kinetic energy which turns the generator turbines to produce electrical energy.'
      }
    ]
  }
];

// Helper: Standard subject generator
export function createSubject(
  id: string,
  name: string,
  code: string,
  category: GlobalSubject['category'],
  description: string,
  curriculumOverview: string,
  officialTopics: GlobalTopic[]
): GlobalSubject {
  return {
    id,
    name,
    code,
    category,
    description,
    curriculumOverview,
    officialTopics
  };
}

// ============================================================================
// 1. AFRICA: NIGERIA 🇳🇬
// Primary -> JSS -> SSS -> JAMB UTME
// ============================================================================

const NIGERIA_PRIMARY_SUBJECTS: GlobalSubject[] = [
  createSubject('ng-pri-math', 'Quantitative Aptitude & Mathematics', 'QA-MTH', 'Core', 'Number patterns, arithmetic, fractions, decimals, and logic problems.', 'NERDC Primary Mathematics standard curriculum.', MATH_CORE_TOPICS),
  createSubject('ng-pri-eng', 'Verbal Aptitude & English Studies', 'VA-ENG', 'Core', 'Reading comprehension, spelling patterns, verbal reasoning, and grammar.', 'NERDC Primary English curriculum.', ENGLISH_CORE_TOPICS),
  createSubject('ng-pri-sci', 'Basic Science & Technology', 'BST', 'Sciences', 'Living and non-living things, weather, simple machines, and health habits.', 'NERDC Basic Science standard.', SCIENCE_GENERAL_TOPICS)
];

const NIGERIA_JSS_SUBJECTS: GlobalSubject[] = [
  createSubject('ng-jss-math', 'Mathematics', 'MTH', 'Core', 'Algebra, plane geometry, statistics, and business arithmetic.', 'National 9-year basic education mathematics curriculum.', MATH_CORE_TOPICS),
  createSubject('ng-jss-eng', 'English Studies', 'ENG', 'Core', 'Grammar, continuous writing, lexis and structure, and comprehension.', 'National 9-year basic education curriculum.', ENGLISH_CORE_TOPICS),
  createSubject('ng-jss-bst', 'Basic Science & Technology', 'BST', 'Sciences', 'Energy, matter, workshop safety, simple machines, and health science.', 'NERDC JSS curriculum.', SCIENCE_GENERAL_TOPICS),
  createSubject('ng-jss-civic', 'Civic Education & Social Studies', 'CIV', 'Social Sciences', 'Citizenship rights, democratic institutions, peace, and national values.', 'NERDC Civic Education standard.', ENGLISH_CORE_TOPICS)
];

const NIGERIA_SSS_SUBJECTS: GlobalSubject[] = [
  createSubject('waec-math', 'General Mathematics', 'MATH', 'Core', 'Core senior secondary mathematics syllabus.', 'NERDC WASSCE general mathematics curriculum.', MATH_CORE_TOPICS),
  createSubject('waec-eng', 'English Language', 'ENG', 'Core', 'Grammar, reading comprehension, continuous writing, and phonology.', 'NERDC WASSCE English curriculum.', ENGLISH_CORE_TOPICS),
  createSubject('waec-bio', 'Biology', 'BIO', 'Sciences', 'Cell biology, ecology, genetics, physiology, and evolutionary mechanisms.', 'NERDC WASSCE Biology standard.', BIOLOGY_CORE_TOPICS),
  createSubject('waec-phy', 'Physics', 'PHY', 'Sciences', 'Mechanics, heat, waves, optics, electricity, and atomic physics.', 'NERDC WASSCE Physics syllabus.', PHYSICS_CORE_TOPICS),
  createSubject('waec-chem', 'Chemistry', 'CHEM', 'Sciences', 'Atomic structure, chemical reactions, organic chemistry, and stoichiometry.', 'NERDC WASSCE Chemistry standard.', CHEMISTRY_CORE_TOPICS),
  createSubject('waec-econ', 'Economics', 'ECON', 'Commercial', 'Microeconomics, macroeconomics, public finance, and international trade.', 'NERDC WASSCE Economics syllabus.', MATH_CORE_TOPICS)
];

const NIGERIA_COUNTRY: CountryEducation = {
  id: 'nigeria',
  code: 'NG',
  name: 'Nigeria',
  flag: '🇳🇬',
  continentId: 'africa',
  capital: 'Abuja',
  educationMinistry: 'Federal Ministry of Education (FME) & NERDC',
  systemDescription: '6-3-3-4 System: 6 years Primary, 3 years Junior Secondary, 3 years Senior Secondary, 4 years Tertiary.',
  educationStages: [
    {
      id: 'ng-primary',
      name: 'Primary / Basic Education (Grades 1-6)',
      stageType: 'primary',
      description: 'Foundational universal basic education concluding with the National Common Entrance Examination.',
      grades: [
        {
          id: 'ng-pri-6',
          name: 'Primary 6 / Terminal Class',
          ageRange: 'Ages 10-11',
          description: 'Terminal primary class preparing pupils for federal and state unity colleges.',
          exams: [
            {
              id: 'ng-ncee',
              name: 'National Common Entrance Examination (NCEE)',
              shortName: 'NCEE',
              examBoard: 'National Examinations Council (NECO)',
              officialCurriculumYear: '2024 / 2025',
              badge: 'ENTRANCE',
              badgeColor: 'bg-emerald-600 text-white',
              description: 'National entrance examination into Federal Unity Colleges across Nigeria.',
              subjects: NIGERIA_PRIMARY_SUBJECTS
            }
          ]
        }
      ]
    },
    {
      id: 'ng-jss',
      name: 'Junior Secondary School (JSS 1-3)',
      stageType: 'junior_secondary',
      description: 'Lower secondary education concluding with BECE certification.',
      grades: [
        {
          id: 'ng-jss-3',
          name: 'JSS 3 (Final Year Basic Education)',
          ageRange: 'Ages 13-14',
          description: 'Prepares junior secondary students for transition to Senior Secondary or Technical Colleges.',
          exams: [
            {
              id: 'ng-bece',
              name: 'Basic Education Certificate Examination (BECE)',
              shortName: 'BECE / Junior WAEC',
              examBoard: 'NECO / State Examination Boards',
              officialCurriculumYear: '2024 / 2025',
              badge: 'BASIC ED',
              badgeColor: 'bg-teal-600 text-white',
              description: 'National examination certifying 9-year universal basic education completion.',
              subjects: NIGERIA_JSS_SUBJECTS
            }
          ]
        }
      ]
    },
    {
      id: 'ng-sss',
      name: 'Senior Secondary School (SS 1-3)',
      stageType: 'senior_secondary',
      description: 'Senior secondary education preparing candidates for SSCE certification and tertiary matriculation.',
      grades: [
        {
          id: 'ng-ss-3',
          name: 'SS 3 (Terminal Secondary Class)',
          ageRange: 'Ages 16-17',
          description: 'Terminal high school class undertaking national and regional school certificate examinations.',
          exams: [
            {
              id: 'ng-waec',
              name: 'WAEC (WASSCE)',
              shortName: 'WAEC',
              examBoard: 'West African Examinations Council (WAEC)',
              officialCurriculumYear: '2024 / 2025 WASSCE',
              badge: 'SSCE',
              badgeColor: 'bg-blue-600 text-white',
              description: 'Official Senior School Certificate Examination for all secondary schools across West Africa.',
              subjects: NIGERIA_SSS_SUBJECTS
            },
            {
              id: 'ng-neco',
              name: 'NECO (SSCE)',
              shortName: 'NECO',
              examBoard: 'National Examinations Council (NECO)',
              officialCurriculumYear: '2024 / 2025 SSCE',
              badge: 'NATIONAL',
              badgeColor: 'bg-amber-600 text-white',
              description: 'National Senior School Certificate Examination for school candidates and private candidates.',
              subjects: NIGERIA_SSS_SUBJECTS
            }
          ]
        }
      ]
    },
    {
      id: 'ng-tertiary',
      name: 'University & Tertiary Admissions',
      stageType: 'tertiary_entrance',
      description: 'National examination board for admission into Nigerian universities, polytechnics, and colleges.',
      grades: [
        {
          id: 'ng-utme-grade',
          name: 'UTME Matriculation Candidate',
          ageRange: 'Ages 16+',
          description: 'Candidates preparing for unified computer-based tertiary entrance screening.',
          exams: [
            {
              id: 'ng-jamb',
              name: 'JAMB (UTME)',
              shortName: 'JAMB UTME',
              examBoard: 'Joint Admissions and Matriculation Board (JAMB)',
              officialCurriculumYear: '2024 / 2025 UTME',
              badge: 'OFFICIAL CBT',
              badgeColor: 'bg-emerald-600 text-white',
              description: 'Official Computer-Based Test for university, polytechnic, and college of education admissions.',
              isJambDirect: true,
              subjects: NIGERIA_SSS_SUBJECTS
            }
          ]
        }
      ]
    }
  ]
};

// ============================================================================
// 2. AFRICA: GHANA 🇬🇭
// ============================================================================

const GHANA_SHS_SUBJECTS: GlobalSubject[] = [
  createSubject('gh-c-math', 'Core Mathematics', 'CMTH', 'Core', 'Core mathematics curriculum for Ghanaian Senior High Schools.', 'GES CRDD syllabus.', MATH_CORE_TOPICS),
  createSubject('gh-eng', 'English Language', 'ENG', 'Core', 'Comprehension, continuous writing, lexis and structure.', 'WAEC Ghana syllabus.', ENGLISH_CORE_TOPICS),
  createSubject('gh-sci', 'Integrated Science', 'ISCI', 'Sciences', 'Interdisciplinary biology, chemistry, physics, and agricultural science.', 'GES Integrated Science.', SCIENCE_GENERAL_TOPICS),
  createSubject('gh-soc', 'Social Studies', 'SOC', 'Social Sciences', 'Culture, governance, nation building, and socio-economic development.', 'GES Social Studies.', ENGLISH_CORE_TOPICS)
];

const GHANA_COUNTRY: CountryEducation = {
  id: 'ghana',
  code: 'GH',
  name: 'Ghana',
  flag: '🇬🇭',
  continentId: 'africa',
  capital: 'Accra',
  educationMinistry: 'Ministry of Education (MoE) & Ghana Education Service (GES)',
  systemDescription: '6-3-3 System: 6 years Primary, 3 years Junior High School (JHS), 3 years Senior High School (SHS).',
  educationStages: [
    {
      id: 'gh-primary',
      name: 'Primary School (Classes 1-6)',
      stageType: 'primary',
      description: 'Foundational universal basic education across literacy, numeracy, and environmental science.',
      grades: [
        {
          id: 'gh-pri-6',
          name: 'Class 6 / Terminal Primary',
          ageRange: 'Ages 11-12',
          description: 'Preparation for transition into Junior High School.',
          exams: [
            {
              id: 'gh-nat-test',
              name: 'National Assessment Test',
              shortName: 'Class 6 Assessment',
              examBoard: 'National Council for Curriculum and Assessment (NaCCA)',
              officialCurriculumYear: '2024 / 2025',
              badge: 'PRIMARY',
              badgeColor: 'bg-emerald-600 text-white',
              description: 'National numeracy and literacy diagnostic examination.',
              subjects: [
                createSubject('gh-p-math', 'Mathematics', 'MATH', 'Core', 'Arithmetic, fractions, measurement, and geometry.', 'NaCCA standard.', MATH_CORE_TOPICS),
                createSubject('gh-p-eng', 'English Language', 'ENG', 'Core', 'Reading comprehension, phonics, grammar, and composition.', 'NaCCA standard.', ENGLISH_CORE_TOPICS)
              ]
            }
          ]
        }
      ]
    },
    {
      id: 'gh-shs',
      name: 'Senior High School (SHS 1-3)',
      stageType: 'senior_secondary',
      description: 'Secondary education concluding with the West African Senior School Certificate Examination.',
      grades: [
        {
          id: 'gh-shs-3',
          name: 'SHS 3 (Graduation Class)',
          ageRange: 'Ages 17-18',
          description: 'Final year preparing for Ghanaian university and college admission.',
          exams: [
            {
              id: 'gh-wassce',
              name: 'WASSCE (Ghana)',
              shortName: 'WASSCE Ghana',
              examBoard: 'West African Examinations Council (WAEC Ghana)',
              officialCurriculumYear: '2024 / 2025',
              badge: 'SHS CERT',
              badgeColor: 'bg-blue-600 text-white',
              description: 'Official WASSCE examination for Ghanaian Senior High Schools.',
              subjects: GHANA_SHS_SUBJECTS
            }
          ]
        }
      ]
    }
  ]
};

// ============================================================================
// 3. AFRICA: KENYA 🇰🇪
// ============================================================================

const KENYA_KCSE_SUBJECTS: GlobalSubject[] = [
  createSubject('ke-math', 'Mathematics Alternative A', 'MAT-A', 'Core', 'Algebra, vectors, calculus, trigonometry, and commercial arithmetic.', 'KICD Secondary Mathematics syllabus.', MATH_CORE_TOPICS),
  createSubject('ke-eng', 'English Language', 'ENG', 'Core', 'Functional writing, poetry, comprehension, grammar, and oral skills.', 'KNEC English syllabus.', ENGLISH_CORE_TOPICS),
  createSubject('ke-bio', 'Biology', 'BIO', 'Sciences', 'Cell structure, nutrition, ecology, reproduction, genetics, and evolution.', 'KICD Biology standard.', BIOLOGY_CORE_TOPICS),
  createSubject('ke-chem', 'Chemistry', 'CHEM', 'Sciences', 'Acids, bases, salts, mole concept, organic chemistry, and electrochemistry.', 'KICD Chemistry standard.', CHEMISTRY_CORE_TOPICS)
];

const KENYA_COUNTRY: CountryEducation = {
  id: 'kenya',
  code: 'KE',
  name: 'Kenya',
  flag: '🇰🇪',
  continentId: 'africa',
  capital: 'Nairobi',
  educationMinistry: 'Ministry of Education & Kenya National Examinations Council (KNEC)',
  systemDescription: 'CBC System (2-6-3-3-3): Primary, Junior School, Senior School, University.',
  educationStages: [
    {
      id: 'ke-primary',
      name: 'Primary Education (Grades 1-6)',
      stageType: 'primary',
      description: 'Foundational learning concluding with KPSEA assessment.',
      grades: [
        {
          id: 'ke-gr-6',
          name: 'Grade 6 (KPSEA Candidate)',
          ageRange: 'Ages 11-12',
          description: 'Terminal primary cohort under Competency-Based Curriculum.',
          exams: [
            {
              id: 'ke-kpsea',
              name: 'Kenya Primary School Education Assessment (KPSEA)',
              shortName: 'KPSEA',
              examBoard: 'KNEC',
              officialCurriculumYear: '2024 / 2025',
              badge: 'PRIMARY',
              badgeColor: 'bg-emerald-600 text-white',
              description: 'National formative assessment transitioning pupils to Junior School.',
              subjects: [
                createSubject('ke-p-math', 'Mathematics', 'MATH', 'Core', 'Numeracy, fractions, measurement, and algebra.', 'KICD standard.', MATH_CORE_TOPICS),
                createSubject('ke-p-eng', 'English Language', 'ENG', 'Core', 'Reading, grammar, and creative writing.', 'KICD standard.', ENGLISH_CORE_TOPICS)
              ]
            }
          ]
        }
      ]
    },
    {
      id: 'ke-secondary',
      name: 'Secondary School (Form 1-4)',
      stageType: 'senior_secondary',
      description: 'Secondary school concluding with the Kenya Certificate of Secondary Education.',
      grades: [
        {
          id: 'ke-form-4',
          name: 'Form 4 (KCSE Candidate)',
          ageRange: 'Ages 17-18',
          description: 'Terminal secondary school class undertaking national KCSE examination.',
          exams: [
            {
              id: 'ke-kcse',
              name: 'KCSE (Kenya Certificate of Secondary Education)',
              shortName: 'KCSE',
              examBoard: 'Kenya National Examinations Council (KNEC)',
              officialCurriculumYear: '2024 / 2025',
              badge: 'NATIONAL',
              badgeColor: 'bg-emerald-700 text-white',
              description: 'National secondary school examination required for university entrance in Kenya.',
              subjects: KENYA_KCSE_SUBJECTS
            }
          ]
        }
      ]
    }
  ]
};

// ============================================================================
// 4. AFRICA: SOUTH AFRICA 🇿🇦
// ============================================================================

const SA_MATRIC_SUBJECTS: GlobalSubject[] = [
  createSubject('za-math', 'Mathematics', 'MATH', 'Core', 'Functions, number patterns, finance, trigonometry, and calculus.', 'CAPS Grade 12 specification.', MATH_CORE_TOPICS),
  createSubject('za-eng', 'English Home Language', 'ENG', 'Core', 'Language structures, comprehension, literature analysis, and writing.', 'DBE CAPS standard.', ENGLISH_CORE_TOPICS),
  createSubject('za-physci', 'Physical Sciences', 'PHYSCI', 'Sciences', 'Mechanics, organic chemistry, electrochemistry, and matter & materials.', 'DBE Physical Sciences.', PHYSICS_CORE_TOPICS),
  createSubject('za-lifesci', 'Life Sciences', 'LIFESCI', 'Sciences', 'DNA and genetic code, meiosis, endocrine system, and evolution.', 'DBE Life Sciences.', BIOLOGY_CORE_TOPICS)
];

const SOUTH_AFRICA_COUNTRY: CountryEducation = {
  id: 'south_africa',
  code: 'ZA',
  name: 'South Africa',
  flag: '🇿🇦',
  continentId: 'africa',
  capital: 'Pretoria',
  educationMinistry: 'Department of Basic Education (DBE)',
  systemDescription: 'CAPS Curriculum: General Education & Training (GET) and Further Education & Training (FET Grades 10-12).',
  educationStages: [
    {
      id: 'za-fet',
      name: 'FET Phase (Grades 10-12)',
      stageType: 'senior_secondary',
      description: 'Further Education and Training phase culminating in the National Senior Certificate (Matric).',
      grades: [
        {
          id: 'za-grade-12',
          name: 'Grade 12 (Matric)',
          ageRange: 'Ages 17-18',
          description: 'National Senior Certificate matriculation examination year.',
          exams: [
            {
              id: 'za-nsc',
              name: 'National Senior Certificate (NSC / Matric)',
              shortName: 'NSC Matric',
              examBoard: 'Department of Basic Education / Umalusi',
              officialCurriculumYear: '2024 / 2025',
              badge: 'MATRIC',
              badgeColor: 'bg-amber-700 text-white',
              description: 'Official school leaving certificate and university endorsement qualification in South Africa.',
              subjects: SA_MATRIC_SUBJECTS
            }
          ]
        }
      ]
    }
  ]
};

// ============================================================================
// 5. EUROPE: UNITED KINGDOM 🇬🇧
// Primary (KS2) -> Lower Secondary (KS3) -> GCSE -> A-Levels
// ============================================================================

const UK_KS2_SUBJECTS: GlobalSubject[] = [
  createSubject('ks2-math', 'Mathematics (Arithmetic & Reasoning)', 'KS2-MATH', 'Core', 'Place value, arithmetic operations, fractions, decimals, percentages, and word problem reasoning.', 'DfE National Curriculum.', MATH_CORE_TOPICS),
  createSubject('ks2-eng', 'English Reading, Grammar & Punctuation', 'KS2-ENG', 'Core', 'Reading comprehension, grammatical terminology, word classes, and punctuation.', 'STA standard.', ENGLISH_CORE_TOPICS),
  createSubject('ks2-sci', 'Science (Living Things & Matter)', 'KS2-SCI', 'Sciences', 'Living organisms, evolution, light, electricity, and properties of materials.', 'National Curriculum Science.', SCIENCE_GENERAL_TOPICS)
];

const UK_KS3_SUBJECTS: GlobalSubject[] = [
  createSubject('ks3-math', 'Mathematics', 'KS3-MATH', 'Core', 'Linear equations, Pythagoras theorem, probability, and bivariate data.', 'National Curriculum KS3.', MATH_CORE_TOPICS),
  createSubject('ks3-eng', 'English Language & Literature', 'KS3-ENG', 'Core', 'Critical reading, essay writing, Shakespeare, and vocabulary enrichment.', 'DfE KS3 standard.', ENGLISH_CORE_TOPICS),
  createSubject('ks3-sci', 'Combined Science', 'KS3-SCI', 'Sciences', 'Cells, periodic table, forces, energy transfers, and genetics.', 'DfE Programmes of Study.', SCIENCE_GENERAL_TOPICS)
];

const UK_GCSE_SUBJECTS: GlobalSubject[] = [
  createSubject('gcse-math', 'Mathematics (Higher / Foundation)', 'GCSE-MATH', 'Core', 'Number, algebra, ratio, proportion, rates of change, geometry, and probability.', 'Ofqual approved GCSE Mathematics.', MATH_CORE_TOPICS),
  createSubject('gcse-eng', 'English Language (9-1)', 'GCSE-ENG', 'Core', 'Fiction/non-fiction text analysis, evaluation, and creative/viewpoint writing.', 'AQA / Edexcel syllabus.', ENGLISH_CORE_TOPICS),
  createSubject('gcse-bio', 'Biology', 'GCSE-BIO', 'Sciences', 'Cell biology, infection and response, bioenergetics, homeostasis, and ecology.', 'AQA GCSE Biology.', BIOLOGY_CORE_TOPICS),
  createSubject('gcse-chem', 'Chemistry', 'GCSE-CHEM', 'Sciences', 'Atomic structure, bonding, quantitative chemistry, and organic reactions.', 'AQA GCSE Chemistry.', CHEMISTRY_CORE_TOPICS),
  createSubject('gcse-phy', 'Physics', 'GCSE-PHY', 'Sciences', 'Forces, energy, waves, electricity, magnetism, and space physics.', 'AQA GCSE Physics.', PHYSICS_CORE_TOPICS)
];

const UK_ALEVEL_SUBJECTS: GlobalSubject[] = [
  createSubject('alevel-math', 'Mathematics', 'AL-MATH', 'Core', 'Pure mathematics (calculus, trigonometry, algebra), mechanics, and statistics.', 'Edexcel / AQA Linear specification.', MATH_CORE_TOPICS),
  createSubject('alevel-phy', 'Physics', 'AL-PHY', 'Sciences', 'Particle physics, quantum phenomena, fields, mechanics, and nuclear physics.', 'OCR / AQA A-Level Physics.', PHYSICS_CORE_TOPICS),
  createSubject('alevel-chem', 'Chemistry', 'AL-CHEM', 'Sciences', 'Physical chemistry, transition metals, mechanisms in organic synthesis, and NMR.', 'AQA A-Level Chemistry.', CHEMISTRY_CORE_TOPICS),
  createSubject('alevel-bio', 'Biology', 'AL-BIO', 'Sciences', 'Biological molecules, genetic information, organisms exchange substances, and gene expression.', 'AQA A-Level Biology.', BIOLOGY_CORE_TOPICS)
];

const UK_COUNTRY: CountryEducation = {
  id: 'uk',
  code: 'UK',
  name: 'United Kingdom',
  flag: '🇬🇧',
  continentId: 'europe',
  capital: 'London',
  educationMinistry: 'Department for Education (DfE) & Ofqual',
  systemDescription: 'National Curriculum: Key Stage 1-2 (Primary), Key Stage 3 (Years 7-9), Key Stage 4 (GCSE), Sixth Form (A-Levels).',
  educationStages: [
    {
      id: 'uk-ks2',
      name: 'Primary Education / Key Stage 2 (Years 3-6)',
      stageType: 'primary',
      description: 'Foundational English, mathematics, and science culminating in the National Curriculum SATs assessments.',
      grades: [
        {
          id: 'uk-year-6',
          name: 'Year 6 (Key Stage 2 SATs)',
          ageRange: 'Ages 10-11',
          description: 'Terminal primary year preparing pupils for transition to secondary school.',
          exams: [
            {
              id: 'uk-sats',
              name: 'National Curriculum Key Stage 2 Tests (SATs)',
              shortName: 'KS2 SATs',
              examBoard: 'Standards and Testing Agency (STA)',
              officialCurriculumYear: '2024 / 2025',
              badge: 'PRIMARY',
              badgeColor: 'bg-emerald-600 text-white',
              description: 'Standardized national tests assessing mathematics arithmetic, reasoning, and grammar.',
              subjects: UK_KS2_SUBJECTS
            }
          ]
        }
      ]
    },
    {
      id: 'uk-ks3',
      name: 'Lower Secondary / Key Stage 3 (Years 7-9)',
      stageType: 'junior_secondary',
      description: 'Foundational secondary curriculum bridging primary education to GCSE study.',
      grades: [
        {
          id: 'uk-year-9',
          name: 'Year 9 (GCSE Transition)',
          ageRange: 'Ages 13-14',
          description: 'Capstone year for Key Stage 3 curriculum and GCSE subject options.',
          exams: [
            {
              id: 'uk-ks3-checkpoint',
              name: 'Key Stage 3 End-of-Stage Assessment',
              shortName: 'KS3 Assessment',
              examBoard: 'National Curriculum Framework / Cambridge Lower Secondary',
              officialCurriculumYear: '2024 / 2025',
              badge: 'LOWER SEC',
              badgeColor: 'bg-teal-600 text-white',
              description: 'Comprehensive secondary checkpoint testing algebraic fluency, scientific analysis, and literature.',
              subjects: UK_KS3_SUBJECTS
            }
          ]
        }
      ]
    },
    {
      id: 'uk-ks4',
      name: 'Key Stage 4 / GCSE (Years 10-11)',
      stageType: 'senior_secondary',
      description: 'Secondary education concluding with General Certificate of Secondary Education qualifications.',
      grades: [
        {
          id: 'uk-year-11',
          name: 'Year 11 (GCSE Candidate)',
          ageRange: 'Ages 15-16',
          description: 'Terminal GCSE year under AQA, Edexcel, and OCR boards.',
          exams: [
            {
              id: 'uk-gcse',
              name: 'GCSE / IGCSE (9-1)',
              shortName: 'GCSE',
              examBoard: 'AQA / Pearson Edexcel / OCR',
              officialCurriculumYear: '2024 / 2025 GCSE',
              badge: 'GCSE 9-1',
              badgeColor: 'bg-purple-600 text-white',
              description: 'General Certificate of Secondary Education required for Sixth Form admission.',
              subjects: UK_GCSE_SUBJECTS
            }
          ]
        }
      ]
    },
    {
      id: 'uk-sixth-form',
      name: 'Sixth Form / A-Levels (Years 12-13)',
      stageType: 'tertiary_entrance',
      description: 'Advanced qualifications recognized globally for university admissions.',
      grades: [
        {
          id: 'uk-year-13',
          name: 'Year 13 (A-Level Candidate)',
          ageRange: 'Ages 17-18',
          description: 'Final year of GCE Advanced Level qualifications.',
          exams: [
            {
              id: 'uk-alevels',
              name: 'GCE Advanced Levels (A-Levels)',
              shortName: 'A-Levels',
              examBoard: 'Cambridge / Edexcel / AQA',
              officialCurriculumYear: '2024 / 2025',
              badge: 'A-LEVELS',
              badgeColor: 'bg-blue-800 text-white',
              description: 'Standard qualification for entry into UK and international universities.',
              subjects: UK_ALEVEL_SUBJECTS
            }
          ]
        }
      ]
    }
  ]
};

// ============================================================================
// 6. EUROPE: FRANCE 🇫🇷
// ============================================================================

const FRANCE_BAC_SUBJECTS: GlobalSubject[] = [
  createSubject('fr-math', 'Mathématiques (Spécialité)', 'MATH-BAC', 'Core', 'Suites, limites, calcul différentiel et intégral, probabilités discrètes, et géométrie dans l\'espace.', 'Ministère de l\'Éducation nationale.', MATH_CORE_TOPICS),
  createSubject('fr-pc', 'Physique-Chimie', 'PC-BAC', 'Sciences', 'Ondes, cinématique, thermodynamique, synthèse organique, et réactions acide-base.', 'BO spécial Baccalauréat.', PHYSICS_CORE_TOPICS),
  createSubject('fr-svt', 'Sciences de la Vie et de la Terre (SVT)', 'SVT-BAC', 'Sciences', 'Génétique, immunologie, géodynamique interne, et climatologie terrestre.', 'Programme officiel Terminale.', BIOLOGY_CORE_TOPICS),
  createSubject('fr-philo', 'Philosophie & Humanités', 'PHILO', 'Humanities', 'Épistémologie, morale, politique, liberté, vérité, et méthode de dissertation.', 'Programme national de Philosophie.', ENGLISH_CORE_TOPICS)
];

const FRANCE_COUNTRY: CountryEducation = {
  id: 'france',
  code: 'FR',
  name: 'France',
  flag: '🇫🇷',
  continentId: 'europe',
  capital: 'Paris',
  educationMinistry: 'Ministère de l\'Éducation nationale et de la Jeunesse',
  systemDescription: 'Système français: École primaire, Collège (Diplôme National du Brevet), Lycée (Baccalauréat Général / Technologique).',
  educationStages: [
    {
      id: 'fr-lycee',
      name: 'Lycée (Seconde, Première, Terminale)',
      stageType: 'senior_secondary',
      description: 'Secondary education concluding with Le Baccalauréat for university access.',
      grades: [
        {
          id: 'fr-terminale',
          name: 'Classe de Terminale',
          ageRange: 'Ages 17-18',
          description: 'Terminal high school year undertaking national written and grand oral examinations.',
          exams: [
            {
              id: 'fr-bac',
              name: 'Le Baccalauréat Général (Le Bac)',
              shortName: 'Le Bac',
              examBoard: 'Ministère de l\'Éducation nationale',
              officialCurriculumYear: '2024 / 2025 Bac',
              badge: 'BAC',
              badgeColor: 'bg-indigo-600 text-white',
              description: 'National academic qualification certifying completion of secondary education and higher education admission.',
              subjects: FRANCE_BAC_SUBJECTS
            }
          ]
        }
      ]
    }
  ]
};

// ============================================================================
// 7. NORTH AMERICA: UNITED STATES 🇺🇸
// Elementary -> Middle School -> High School (SAT / AP)
// ============================================================================

const USA_ELEM_SUBJECTS: GlobalSubject[] = [
  createSubject('us-elem-math', 'Mathematics', 'MTH-5', 'Core', 'Fractions, decimals, volume concepts, multi-digit operations, and algebraic thinking.', 'Common Core State Standards for Grade 5.', MATH_CORE_TOPICS),
  createSubject('us-elem-ela', 'English Language Arts (ELA)', 'ELA-5', 'Core', 'Reading literature, informational texts, foundational phonics, and argumentative writing.', 'Common Core ELA standard.', ENGLISH_CORE_TOPICS),
  createSubject('us-elem-sci', 'Science & Engineering', 'SCI-5', 'Sciences', 'Earth systems, matter and energy, ecosystems, and simple engineering design.', 'Next Generation Science Standards (NGSS).', SCIENCE_GENERAL_TOPICS)
];

const USA_MIDDLE_SUBJECTS: GlobalSubject[] = [
  createSubject('us-mid-math', 'Pre-Algebra & Linear Functions', 'MTH-8', 'Core', 'Linear equations, functions, Pythagorean theorem, bivariate data, and real number system.', 'Common Core Grade 8 Math.', MATH_CORE_TOPICS),
  createSubject('us-mid-ela', 'English Language Arts', 'ELA-8', 'Core', 'Textual evidence, literary analysis, theme analysis, and persuasive writing.', 'CCSS ELA 8.', ENGLISH_CORE_TOPICS),
  createSubject('us-mid-sci', 'Physical Science', 'PSCI-8', 'Sciences', 'Newton\'s laws, waves, electromagnetism, and energy conservation.', 'NGSS Physical Science.', PHYSICS_CORE_TOPICS)
];

const USA_HIGHSCHOOL_SUBJECTS: GlobalSubject[] = [
  createSubject('us-sat-math', 'SAT Mathematics', 'SAT-M', 'Core', 'Heart of Algebra, Problem Solving and Data Analysis, Passport to Advanced Math, and Additional Topics.', 'College Board Digital SAT standard.', MATH_CORE_TOPICS),
  createSubject('us-sat-rw', 'SAT Reading & Writing', 'SAT-RW', 'Core', 'Craft and Structure, Information and Ideas, Standard English Conventions, and Expression of Ideas.', 'College Board Digital SAT.', ENGLISH_CORE_TOPICS),
  createSubject('us-ap-calc', 'AP Calculus AB', 'AP-CALC', 'Sciences', 'Limits, derivatives, definite integrals, and Fundamental Theorem of Calculus.', 'College Board AP Calculus AB Course Description.', MATH_CORE_TOPICS),
  createSubject('us-ap-bio', 'AP Biology', 'AP-BIO', 'Sciences', 'Chemistry of life, cell structure, energetics, cellular communication, heredity, and gene regulation.', 'College Board AP Biology Course Framework.', BIOLOGY_CORE_TOPICS),
  createSubject('us-ap-phy', 'AP Physics 1', 'AP-PHY1', 'Sciences', 'Kinematics, dynamics, circular motion, energy, momentum, simple harmonic motion, and torque.', 'College Board AP Physics 1 standard.', PHYSICS_CORE_TOPICS)
];

const USA_COUNTRY: CountryEducation = {
  id: 'usa',
  code: 'US',
  name: 'United States',
  flag: '🇺🇸',
  continentId: 'north_america',
  capital: 'Washington, D.C.',
  educationMinistry: 'U.S. Department of Education & State Education Agencies',
  systemDescription: 'K-12 System: Elementary (K-5), Middle School (6-8), High School (9-12), College Prep (SAT, ACT, AP).',
  educationStages: [
    {
      id: 'us-elementary',
      name: 'Elementary School (Grades 1-5)',
      stageType: 'primary',
      description: 'Foundational literacy, arithmetic, science, and social studies.',
      grades: [
        {
          id: 'us-grade-5',
          name: 'Grade 5',
          ageRange: 'Ages 10-11',
          description: 'Terminal elementary grade preparing for middle school transition.',
          exams: [
            {
              id: 'us-naep-5',
              name: 'Grade 5 State Assessment',
              shortName: 'State Standards',
              examBoard: 'State Department of Education',
              officialCurriculumYear: '2024 / 2025',
              badge: 'ELEMENTARY',
              badgeColor: 'bg-blue-600 text-white',
              description: 'Standardized state achievement test in Mathematics, ELA, and Science.',
              subjects: USA_ELEM_SUBJECTS
            }
          ]
        }
      ]
    },
    {
      id: 'us-middle',
      name: 'Middle School (Grades 6-8)',
      stageType: 'junior_secondary',
      description: 'Intermediate education covering pre-algebra, earth/life sciences, and world geography.',
      grades: [
        {
          id: 'us-grade-8',
          name: 'Grade 8 (Middle School Capstone)',
          ageRange: 'Ages 13-14',
          description: 'Pre-Algebra and early high school course credit readiness.',
          exams: [
            {
              id: 'us-mid-assessment',
              name: 'Grade 8 Standardized Assessment',
              shortName: 'Middle School Exam',
              examBoard: 'State Department of Education',
              officialCurriculumYear: '2024 / 2025',
              badge: 'MIDDLE',
              badgeColor: 'bg-teal-600 text-white',
              description: 'Evaluation of readiness for rigorous high school diploma coursework.',
              subjects: USA_MIDDLE_SUBJECTS
            }
          ]
        }
      ]
    },
    {
      id: 'us-high',
      name: 'High School & College Prep (Grades 9-12)',
      stageType: 'senior_secondary',
      description: 'Comprehensive secondary diploma coursework, Advanced Placement (AP), and college admissions testing.',
      grades: [
        {
          id: 'us-grade-12',
          name: 'Junior & Senior Years (Grades 11-12)',
          ageRange: 'Ages 16-18',
          description: 'College Board SAT, ACT, and Advanced Placement academic testing cohort.',
          exams: [
            {
              id: 'us-sat',
              name: 'Digital SAT',
              shortName: 'SAT',
              examBoard: 'College Board',
              officialCurriculumYear: '2024 / 2025 Digital SAT',
              badge: 'COLLEGE ADMISSION',
              badgeColor: 'bg-blue-600 text-white',
              description: 'Widely accepted standardized college admissions examination across the United States.',
              subjects: USA_HIGHSCHOOL_SUBJECTS.slice(0, 2)
            },
            {
              id: 'us-ap',
              name: 'Advanced Placement (AP)',
              shortName: 'AP Exams',
              examBoard: 'College Board',
              officialCurriculumYear: '2024 / 2025 AP',
              badge: 'AP COLLEGE CREDIT',
              badgeColor: 'bg-emerald-600 text-white',
              description: 'Rigorous college-level curricula and examinations offering university credit.',
              subjects: USA_HIGHSCHOOL_SUBJECTS.slice(2)
            }
          ]
        }
      ]
    }
  ]
};

// ============================================================================
// 8. SOUTH AMERICA: BRAZIL 🇧🇷
// ============================================================================

const BRAZIL_ENEM_SUBJECTS: GlobalSubject[] = [
  createSubject('br-enem-mat', 'Matemática e suas Tecnologias', 'MAT-BR', 'Core', 'Funções, geometria espacial, probabilidade, estatística, e matemática financeira.', 'Matriz de Referência do ENEM.', MATH_CORE_TOPICS),
  createSubject('br-enem-ling', 'Linguagens, Códigos e suas Tecnologias', 'LING-BR', 'Core', 'Língua Portuguesa, literatura, interpretação de texto, língua estrangeira, e redação.', 'INEP Matriz ENEM.', ENGLISH_CORE_TOPICS),
  createSubject('br-enem-nat', 'Ciências da Natureza e suas Tecnologias', 'NAT-BR', 'Sciences', 'Física (mecânica, termologia, óptica), Química (estequiometria, orgânica) e Biologia.', 'INEP Matriz ENEM.', BIOLOGY_CORE_TOPICS),
  createSubject('br-enem-hum', 'Ciências Humanas e suas Tecnologias', 'HUM-BR', 'Social Sciences', 'História do Brasil, geografia, sociologia, filosofia, e direitos humanos.', 'INEP Matriz ENEM.', ENGLISH_CORE_TOPICS)
];

const BRAZIL_COUNTRY: CountryEducation = {
  id: 'brazil',
  code: 'BR',
  name: 'Brazil',
  flag: '🇧🇷',
  continentId: 'south_america',
  capital: 'Brasília',
  educationMinistry: 'Ministério da Educação (MEC) & INEP',
  systemDescription: 'Educação Básica: Ensino Fundamental (1º ao 9º ano) e Ensino Médio (1º ao 3º ano, ENEM).',
  educationStages: [
    {
      id: 'br-medio',
      name: 'Ensino Médio (1º ao 3º ano)',
      stageType: 'senior_secondary',
      description: 'Secondary education concluding with the national ENEM examination for university entrance.',
      grades: [
        {
          id: 'br-3ano',
          name: '3º Ano do Ensino Médio',
          ageRange: 'Ages 16-17',
          description: 'Terminal high school year preparing for ENEM and vestibular exams.',
          exams: [
            {
              id: 'br-enem',
              name: 'ENEM (Exame Nacional do Ensino Médio)',
              shortName: 'ENEM',
              examBoard: 'INEP / Ministério da Educação',
              officialCurriculumYear: '2024 / 2025',
              badge: 'NACIONAL',
              badgeColor: 'bg-emerald-600 text-white',
              description: 'Main standardized examination for admission to federal and state Brazilian universities (SiSU).',
              subjects: BRAZIL_ENEM_SUBJECTS
            }
          ]
        }
      ]
    }
  ]
};

// ============================================================================
// 9. ASIA: INDIA 🇮🇳
// ============================================================================

const INDIA_CBSE10_SUBJECTS: GlobalSubject[] = [
  createSubject('in-cbse-math', 'Mathematics (Standard / Basic)', 'CBSE-MTH', 'Core', 'Real Numbers, Polynomials, Linear Equations, Quadratic, Arithmetic Progressions, Trigonometry.', 'NCERT Class 10 Mathematics syllabus.', MATH_CORE_TOPICS),
  createSubject('in-cbse-sci', 'Science (Physics, Chemistry, Biology)', 'CBSE-SCI', 'Core', 'Chemical Reactions, Acids Bases Salts, Life Processes, Control Coordination, Light, Electricity.', 'NCERT Class 10 Science.', SCIENCE_GENERAL_TOPICS),
  createSubject('in-cbse-eng', 'English Language & Literature', 'CBSE-ENG', 'Core', 'Reading comprehension, formal writing skills, grammar, and literature textbook analysis.', 'CBSE Class 10 Curriculum.', ENGLISH_CORE_TOPICS),
  createSubject('in-cbse-sst', 'Social Science', 'CBSE-SST', 'Social Sciences', 'History (Rise of Nationalism), Geography (Resources), Political Science, and Economics.', 'CBSE Social Science framework.', ENGLISH_CORE_TOPICS)
];

const INDIA_ENTRANCE_SUBJECTS: GlobalSubject[] = [
  createSubject('in-neet-bio', 'Biology (Botany & Zoology)', 'NEET-BIO', 'Sciences', 'Diversity in Living World, Structural Organisation, Cell Biology, Human Physiology, Genetics.', 'NTA NEET UG syllabus.', BIOLOGY_CORE_TOPICS),
  createSubject('in-jee-math', 'Mathematics', 'JEE-MATH', 'Core', 'Complex numbers, matrices, calculus, coordinate geometry, vectors, and 3D geometry.', 'NTA JEE Main syllabus.', MATH_CORE_TOPICS),
  createSubject('in-jee-phy', 'Physics', 'JEE-PHY', 'Sciences', 'Kinematics, thermodynamics, electrostatics, current electricity, optics, and modern physics.', 'NTA JEE syllabus.', PHYSICS_CORE_TOPICS),
  createSubject('in-jee-chem', 'Chemistry', 'JEE-CHEM', 'Sciences', 'Physical, inorganic, and organic chemistry, coordination compounds, and thermodynamics.', 'NTA JEE syllabus.', CHEMISTRY_CORE_TOPICS)
];

const INDIA_COUNTRY: CountryEducation = {
  id: 'india',
  code: 'IN',
  name: 'India',
  flag: '🇮🇳',
  continentId: 'asia',
  capital: 'New Delhi',
  educationMinistry: 'Ministry of Education & CBSE / NTA',
  systemDescription: '10+2 System: Secondary (Classes 9-10, CBSE X), Senior Secondary (Classes 11-12, CBSE XII, JEE, NEET).',
  educationStages: [
    {
      id: 'in-secondary',
      name: 'Secondary Education (Classes 9-10)',
      stageType: 'senior_secondary',
      description: 'Secondary education concluding with CBSE Class 10 All India Secondary School Examination.',
      grades: [
        {
          id: 'in-class-10',
          name: 'Class 10 (Board Exam Year)',
          ageRange: 'Ages 15-16',
          description: 'Terminal secondary school class undertaking national board examinations.',
          exams: [
            {
              id: 'in-cbse-10',
              name: 'CBSE Class 10 Board Examination',
              shortName: 'CBSE Class 10',
              examBoard: 'Central Board of Secondary Education (CBSE)',
              officialCurriculumYear: '2024 / 2025 NCERT',
              badge: 'CBSE X',
              badgeColor: 'bg-orange-600 text-white',
              description: 'National board exam assessing Mathematics, Science, and Social Science.',
              subjects: INDIA_CBSE10_SUBJECTS
            }
          ]
        }
      ]
    },
    {
      id: 'in-entrance',
      name: 'National Entrance Exams (Engineering & Medical)',
      stageType: 'tertiary_entrance',
      description: 'Competitive national entrance exams for admissions to IITs, NITs, and medical colleges (AIIMS).',
      grades: [
        {
          id: 'in-entrance-candidates',
          name: 'Class 12 / Droppers (Entrance Aspirants)',
          ageRange: 'Ages 17-19',
          description: 'Aspirants preparing for national competitive testing in STEM and Medical sciences.',
          exams: [
            {
              id: 'in-neet',
              name: 'NEET (UG) - National Eligibility cum Entrance Test',
              shortName: 'NEET UG',
              examBoard: 'National Testing Agency (NTA)',
              officialCurriculumYear: '2024 / 2025 NEET',
              badge: 'MEDICAL ENTRANCE',
              badgeColor: 'bg-blue-600 text-white',
              description: 'Unified all-India entrance examination for admissions to MBBS and BDS courses.',
              subjects: INDIA_ENTRANCE_SUBJECTS
            }
          ]
        }
      ]
    }
  ]
};

// ============================================================================
// 10. OCEANIA: AUSTRALIA 🇦🇺
// ============================================================================

const AUSTRALIA_HSC_SUBJECTS: GlobalSubject[] = [
  createSubject('au-math-adv', 'Mathematics Advanced', 'MAT-ADV', 'Core', 'Functions, differential calculus, integral calculus, financial mathematics, and statistical analysis.', 'NESA Stage 6 syllabus.', MATH_CORE_TOPICS),
  createSubject('au-eng-adv', 'English Advanced', 'ENG-ADV', 'Core', 'Texts and human experiences, critical study of literature, and textual conversations.', 'NESA English Stage 6.', ENGLISH_CORE_TOPICS),
  createSubject('au-bio', 'Biology', 'BIO-AU', 'Sciences', 'Heredity, genetic change, infectious disease, non-infectious disease, and disorders.', 'NESA Biology syllabus.', BIOLOGY_CORE_TOPICS),
  createSubject('au-chem', 'Chemistry', 'CHEM-AU', 'Sciences', 'Equilibrium, acid/base reactions, organic chemistry, and applying chemical ideas.', 'NESA Chemistry syllabus.', CHEMISTRY_CORE_TOPICS)
];

const AUSTRALIA_COUNTRY: CountryEducation = {
  id: 'australia',
  code: 'AU',
  name: 'Australia',
  flag: '🇦🇺',
  continentId: 'oceania',
  capital: 'Canberra',
  educationMinistry: 'Department of Education & ACARA / NESA / VCAA',
  systemDescription: 'Australian Curriculum: Primary (F-6), Secondary (7-10), Senior Secondary (11-12, ATAR).',
  educationStages: [
    {
      id: 'au-senior',
      name: 'Senior Secondary (Years 11-12, ATAR)',
      stageType: 'senior_secondary',
      description: 'Senior secondary studies leading to Year 12 certificates (HSC, VCE, QCE) and the Australian Tertiary Admission Rank.',
      grades: [
        {
          id: 'au-year-12',
          name: 'Year 12 (ATAR Candidate)',
          ageRange: 'Ages 17-18',
          description: 'Final year of senior secondary studies determining university entry rank.',
          exams: [
            {
              id: 'au-atar',
              name: 'Higher School Certificate / VCE (ATAR)',
              shortName: 'ATAR HSC / VCE',
              examBoard: 'NESA / VCAA / State TACs',
              officialCurriculumYear: '2024 / 2025 ATAR',
              badge: 'ATAR CERT',
              badgeColor: 'bg-emerald-600 text-white',
              description: 'Standardized assessment across core subjects yielding the national Australian Tertiary Admission Rank.',
              subjects: AUSTRALIA_HSC_SUBJECTS
            }
          ]
        }
      ]
    }
  ]
};

// ============================================================================
// CONTINENTS REPOSITORY
// ============================================================================
export const GLOBAL_CONTINENTS: Continent[] = [
  {
    id: 'africa',
    name: 'Africa',
    icon: '🌍',
    description: 'National and regional curricula across West, East, North, and Southern Africa.',
    countries: [NIGERIA_COUNTRY, GHANA_COUNTRY, KENYA_COUNTRY, SOUTH_AFRICA_COUNTRY]
  },
  {
    id: 'europe',
    name: 'Europe',
    icon: '🌍',
    description: 'National educational frameworks, GCSEs, A-Levels, and the European Baccalaureate.',
    countries: [UK_COUNTRY, FRANCE_COUNTRY]
  },
  {
    id: 'north_america',
    name: 'North America',
    icon: '🌎',
    description: 'Standardized elementary, middle, high school, AP, and college entrance systems.',
    countries: [USA_COUNTRY]
  },
  {
    id: 'south_america',
    name: 'South America',
    icon: '🌎',
    description: 'National secondary and vestibular systems across South America.',
    countries: [BRAZIL_COUNTRY]
  },
  {
    id: 'asia',
    name: 'Asia',
    icon: '🌏',
    description: 'Rigorous national board standards and competitive university entrance systems.',
    countries: [INDIA_COUNTRY]
  },
  {
    id: 'oceania',
    name: 'Oceania',
    icon: '🌏',
    description: 'Australian Curriculum, ATAR, and Pacific educational systems.',
    countries: [AUSTRALIA_COUNTRY]
  }
];

// Helper: Find country by code or name
export function findCountryEducation(query?: string | null): CountryEducation {
  if (!query) return NIGERIA_COUNTRY;
  const q = query.trim().toLowerCase();

  for (const continent of GLOBAL_CONTINENTS) {
    for (const country of continent.countries) {
      if (
        country.id.toLowerCase() === q ||
        country.code.toLowerCase() === q ||
        country.name.toLowerCase() === q ||
        q.includes(country.name.toLowerCase()) ||
        q.includes(country.id.toLowerCase())
      ) {
        return country;
      }
    }
  }

  return NIGERIA_COUNTRY;
}
