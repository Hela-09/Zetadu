export interface SyllabusTopic {
  id: string;
  name: string;
  objectives: string[];
  contents: string[];
  examWeight: 'High' | 'Medium' | 'Essential';
  questionCount: number;
}

export interface RecommendedBook {
  title: string;
  author: string;
  publisher?: string;
  category?: string;
}

export interface SubjectSyllabus {
  subjectId: string;
  subjectName: string;
  code: string;
  overview: string;
  examStructure: {
    totalQuestions: number;
    durationMinutes: number;
    calculatorAllowed: boolean;
    sections?: string[];
  };
  generalObjectives: string[];
  topics: SyllabusTopic[];
  recommendedBooks: RecommendedBook[];
  prescribedNovel?: {
    title: string;
    author: string;
    role: string;
    description: string;
    chaptersCount: number;
    estimatedQuestions: number;
  };
}

export const JAMB_SYLLABUS_DATA: Record<string, SubjectSyllabus> = {
  english: {
    subjectId: 'english',
    subjectName: 'English Language (Use of English)',
    code: 'ENG',
    overview: 'Tests candidate competence in comprehension, summary, lexis and structure, oral forms, and the prescribed JAMB novel.',
    examStructure: {
      totalQuestions: 60,
      durationMinutes: 45,
      calculatorAllowed: false,
      sections: [
        'Section A: Comprehension & Summary (2 passages, 10 questions)',
        'Section B: The Prescribed Novel (15-20 questions)',
        'Section C: Lexis and Structure (20 questions)',
        'Section D: Oral Forms / Phonology (10 questions)'
      ]
    },
    generalObjectives: [
      'Communicate effectively in written English with grammatical accuracy.',
      'Demonstrate mastery of reading comprehension and central ideas in prose.',
      'Critically analyze characterization, themes, and plot in the prescribed novel.',
      'Identify and produce accurate vowel, consonant, stress, and intonation patterns.'
    ],
    prescribedNovel: {
      title: 'The Lekki Headmaster',
      author: 'Kabir Alabi Garba',
      role: 'Compulsory Prescribed Novel for UTME Use of English',
      description: 'Follows Mr. Bepo, the principled headmaster of Stardom Schools in Lekki, Lagos, dealing with institutional ethics, modern youth pressures, and integrity.',
      chaptersCount: 12,
      estimatedQuestions: 15
    },
    topics: [
      {
        id: 'eng-novel',
        name: 'The Prescribed Novel: The Lekki Headmaster',
        objectives: [
          'Analyze the moral and educational integrity themes embodied by Mr. Bepo.',
          'Trace plot progression across Stardom Schools and Lekki society.',
          'Differentiate major characters (Mr. Bepo, Mrs. Savage, Funke, Mrs. Bepo) and their motivations.'
        ],
        contents: ['Plot analysis', 'Character sketches', 'Themes and socio-cultural critique', 'Key quotes and symbols'],
        examWeight: 'Essential',
        questionCount: 15
      },
      {
        id: 'eng-comprehension',
        name: 'Comprehension & Summary',
        objectives: [
          'Deduce the central and supporting ideas in diverse passages.',
          'Interpret figurative and idiomatic expressions in context.',
          'Identify tone, mood, and register.'
        ],
        contents: ['Expository and argumentative passages', 'Vocabulary in context', 'Summary synthesis'],
        examWeight: 'High',
        questionCount: 10
      },
      {
        id: 'eng-concord',
        name: 'Concord & Subject-Verb Agreement',
        objectives: [
          'Apply the Rule of Proximity with correlative conjunctions (neither/nor, either/or).',
          'Use collective nouns and indefinite pronouns with correct verbal inflection.'
        ],
        contents: ['Principle of proximity', 'Notional concord', 'Indefinite pronouns', 'Parenthetical phrases'],
        examWeight: 'High',
        questionCount: 8
      },
      {
        id: 'eng-vocabulary',
        name: 'Synonyms & Antonyms',
        objectives: [
          'Identify words nearest or opposite in meaning to underlined words in sentences.',
          'Distinguish between denotative and connotative nuances.'
        ],
        contents: ['Contextual synonyms', 'Rigorous antonym pairs', 'Academic and formal registers'],
        examWeight: 'High',
        questionCount: 8
      },
      {
        id: 'eng-oral',
        name: 'Oral Forms & Phonology',
        objectives: [
          'Identify vowel sounds (monophthongs and diphthongs) in varied spellings.',
          'Recognize silent consonants and consonant clusters.',
          'Determine primary stress placement in multisyllabic words.'
        ],
        contents: ['Vowel contrasts (/i:/ vs /ɪ/, /æ/ vs /ʌ/)', 'Silent letters', 'Word stress rules', 'Intonation patterns'],
        examWeight: 'Medium',
        questionCount: 10
      }
    ],
    recommendedBooks: [
      { title: 'The Lekki Headmaster', author: 'Kabir Alabi Garba', category: 'Prescribed Novel' },
      { title: 'The Invisible Teacher', author: 'B.O. Adeleke' },
      { title: 'Round-Up English', author: 'Idowu et al.', publisher: 'Longman' },
      { title: 'Mastering English for JAMB/UTME', author: 'E.U. Nnamdi' }
    ]
  },

  mathematics: {
    subjectId: 'mathematics',
    subjectName: 'Mathematics',
    code: 'MTH',
    overview: 'Measures candidates mathematical literacy, computational fluency, logical reasoning, and problem-solving skills across Number & Numeration, Algebra, Geometry & Trigonometry, Calculus, and Statistics.',
    examStructure: {
      totalQuestions: 40,
      durationMinutes: 40,
      calculatorAllowed: true,
      sections: [
        'Number and Numeration (20%)',
        'Algebra (35%)',
        'Geometry and Trigonometry (25%)',
        'Calculus (10%)',
        'Statistics and Probability (10%)'
      ]
    },
    generalObjectives: [
      'Acquire mathematical concepts and techniques for tertiary studies.',
      'Develop deductive, spatial, and analytical reasoning abilities.',
      'Apply mathematical principles to scientific, industrial, and social situations.'
    ],
    topics: [
      {
        id: 'mth-quadratics',
        name: 'Quadratic Equations & Polynomials',
        objectives: [
          'Find the sum and product of roots (α + β and αβ).',
          'Form equations with given roots and evaluate symmetric functions of roots.',
          'Solve simultaneous equations containing linear and quadratic relations.'
        ],
        contents: ['Quadratic formula', 'Symmetric functions of roots', 'Factor and Remainder theorems'],
        examWeight: 'High',
        questionCount: 6
      },
      {
        id: 'mth-calculus',
        name: 'Differentiation & Integration',
        objectives: [
          'Differentiate algebraic, trigonometric, and composite functions.',
          'Find gradients, stationary points, and equations of tangents and normals.',
          'Evaluate definite and indefinite integrals and determine area under curves.'
        ],
        contents: ['Chain rule', 'Stationary points (max/min)', 'Definite integrals', 'Applications of rates of change'],
        examWeight: 'High',
        questionCount: 6
      },
      {
        id: 'mth-progression',
        name: 'Arithmetic & Geometric Progressions (AP & GP)',
        objectives: [
          'Find the nth term and sum of the first n terms of an AP.',
          'Compute common ratio, sum to infinity, and nth term of a GP.',
          'Solve word problems involving compound financial growth and depreciation.'
        ],
        contents: ['Formulae for Tn and Sn', 'Sum to infinity of GP', 'Arithmetic and geometric means'],
        examWeight: 'High',
        questionCount: 5
      },
      {
        id: 'mth-trigonometry',
        name: 'Trigonometry & Identities',
        objectives: [
          'Calculate trigonometric ratios of standard and special angles (30°, 45°, 60°).',
          'Apply sine rule and cosine rule in non-right triangles.',
          'Evaluate trigonometric equations and basic identities.'
        ],
        contents: ['Trig ratios', 'Sine and Cosine rules', 'Bearings and elevations', 'Pythagorean identities'],
        examWeight: 'High',
        questionCount: 5
      },
      {
        id: 'mth-probability',
        name: 'Statistics & Probability',
        objectives: [
          'Compute mean, median, mode, and standard deviation from frequency distributions.',
          'Calculate permutations and combinations for distinct and repeating elements.',
          'Determine probabilities of mutually exclusive and independent events.'
        ],
        contents: ['Permutations & Combinations', 'Addition and Multiplication laws of probability', 'Variance and standard deviation'],
        examWeight: 'Medium',
        questionCount: 5
      }
    ],
    recommendedBooks: [
      { title: 'New General Mathematics for Senior Secondary Schools (Books 1-3)', author: 'Channon, Smith & Head', publisher: 'Pearson' },
      { title: 'Further Mathematics for SSS', author: 'E.G. Phillips' },
      { title: 'Exam Focus: Mathematics for UTME', author: 'J.K. Egbe' }
    ]
  },

  physics: {
    subjectId: 'physics',
    subjectName: 'Physics',
    code: 'PHY',
    overview: 'Evaluates candidates understanding of physical laws, experimental procedures, mathematical relationships, and applications across Mechanics, Waves, Electricity, Optics, and Modern Physics.',
    examStructure: {
      totalQuestions: 40,
      durationMinutes: 40,
      calculatorAllowed: true,
      sections: [
        'Mechanics (35%)',
        'Thermal Physics (15%)',
        'Waves & Optics (20%)',
        'Electricity & Magnetism (20%)',
        'Atomic & Nuclear Physics (10%)'
      ]
    },
    generalObjectives: [
      'Master fundamental principles of physical phenomena and measurements.',
      'Interpret diagrams, circuit networks, ray optics, and vectors.',
      'Solve quantitative physics equations with appropriate SI units.'
    ],
    topics: [
      {
        id: 'phy-mechanics',
        name: 'Motion, Work, Energy & Power',
        objectives: [
          'Apply Newton’s equations of linear and projectile motion.',
          'Analyze conservation of linear momentum in elastic and inelastic collisions.',
          'Calculate work done, kinetic energy, potential energy, and mechanical advantage.'
        ],
        contents: ['Equations of uniformly accelerated motion', 'Projectile trajectories', 'Momentum & impulse', 'Simple machines'],
        examWeight: 'High',
        questionCount: 8
      },
      {
        id: 'phy-electricity',
        name: 'Electric Circuits & Electromagnetism',
        objectives: [
          'Calculate equivalent resistance in series, parallel, and bridge networks.',
          'Apply Ohm’s law, Kirchhoff’s laws, and electrical power formulae (P = IV = I²R).',
          'Determine magnetic flux, induced EMF using Faraday and Lenz laws.'
        ],
        contents: ['Resistors and capacitors in DC/AC', 'Magnetic fields around conductors', 'Transformer equations (Vp/Vs = Np/Ns)'],
        examWeight: 'High',
        questionCount: 8
      },
      {
        id: 'phy-waves',
        name: 'Waves, Sound & Light Optics',
        objectives: [
          'Apply wave equation v = fλ to mechanical and electromagnetic waves.',
          'Solve problems on reflection, refraction, lenses, mirrors, and Snell’s law.',
          'Analyze resonance, stationary waves, and sound frequencies in pipes.'
        ],
        contents: ['Refractive index', 'Lens and mirror formula (1/f = 1/u + 1/v)', 'Total internal reflection', 'Doppler effect'],
        examWeight: 'High',
        questionCount: 7
      },
      {
        id: 'phy-modern',
        name: 'Atomic & Nuclear Physics',
        objectives: [
          'Apply Einstein’s photoelectric equation (E = hf = W₀ + KE_max).',
          'Calculate radioactive decay, half-life (T_half = 0.693/λ), and binding energy.',
          'Distinguish alpha, beta, and gamma radiation characteristics.'
        ],
        contents: ['Photoelectric effect', 'Nuclear fission & fusion', 'Radioactive half-life', 'Wave-particle duality'],
        examWeight: 'Medium',
        questionCount: 5
      }
    ],
    recommendedBooks: [
      { title: 'Senior Secondary School Physics', author: 'P.N. Okeke & M.W. Anyakoha', publisher: 'Africana First' },
      { title: 'Principles of Physics', author: 'M. Nelkon', publisher: 'Hart-Davis' },
      { title: 'New School Physics', author: 'M.W. Anyakoha' }
    ]
  },

  chemistry: {
    subjectId: 'chemistry',
    subjectName: 'Chemistry',
    code: 'CHM',
    overview: 'Tests candidates understanding of chemical principles, atomic structure, stoichiometric calculations, periodic trends, organic synthesis, and environmental chemistry.',
    examStructure: {
      totalQuestions: 40,
      durationMinutes: 40,
      calculatorAllowed: true,
      sections: [
        'Atomic Structure & Bonding (20%)',
        'Stoichiometry & Mole Concept (20%)',
        'Physical Chemistry: Rates & Equilibrium (20%)',
        'Inorganic Chemistry & Periodicity (20%)',
        'Organic Chemistry & Hydrocarbons (20%)'
      ]
    },
    generalObjectives: [
      'Understand the particulate nature of matter and periodic properties.',
      'Balance redox and stoichiometric equations to compute molar concentrations.',
      'Recognize organic functional groups, IUPAC nomenclature, and reaction mechanisms.'
    ],
    topics: [
      {
        id: 'chm-organic',
        name: 'Organic Chemistry & Hydrocarbons',
        objectives: [
          'Apply IUPAC naming rules to aliphatic and aromatic compounds.',
          'Distinguish structural, geometric, and optical isomerism.',
          'Describe reactions of alkanes, alkenes, alkynes, alkanols, and alkanoic acids.'
        ],
        contents: ['Homologous series', 'Isomerism', 'Addition & substitution mechanisms', 'Esterification & saponification'],
        examWeight: 'High',
        questionCount: 8
      },
      {
        id: 'chm-stoichiometry',
        name: 'The Mole Concept & Stoichiometry',
        objectives: [
          'Calculate empirical and molecular formulae from percentage compositions.',
          'Solve volumetric titration problems (C₁V₁/n₁ = C₂V₂/n₂).',
          'Determine percentage purity and theoretical yield.'
        ],
        contents: ['Avogadro’s constant', 'Molar volume of gases at STP', 'Acid-base volumetric analysis'],
        examWeight: 'High',
        questionCount: 7
      },
      {
        id: 'chm-electrochem',
        name: 'Electrochemistry & Redox Reactions',
        objectives: [
          'Assign oxidation numbers and identify oxidizing/reducing agents.',
          'Apply Faraday’s laws of electrolysis (m = ItM / nF).',
          'Calculate standard electrode potentials and EMF of electrochemical cells.'
        ],
        contents: ['Electrolytic vs galvanic cells', 'Faraday’s laws', 'Electrochemical series', 'Corrosion of metals'],
        examWeight: 'High',
        questionCount: 6
      },
      {
        id: 'chm-bonding',
        name: 'Chemical Bonding & Periodic Trends',
        objectives: [
          'Explain ionic, covalent, coordinate, metallic, and hydrogen bonds.',
          'Predict variation of atomic radius, ionization energy, and electronegativity.',
          'Determine molecular geometry using VSEPR theory.'
        ],
        contents: ['Periodic trends', 'Shapes of simple molecules', 'Intermolecular forces'],
        examWeight: 'High',
        questionCount: 6
      }
    ],
    recommendedBooks: [
      { title: 'New School Chemistry for Senior Secondary Schools', author: 'Osei Yaw Ababio', publisher: 'Africana First' },
      { title: 'Understanding Chemistry for West Africa', author: 'S.T. Bajah et al.' },
      { title: 'Essential Chemistry', author: 'I.A. Odesina' }
    ]
  },

  biology: {
    subjectId: 'biology',
    subjectName: 'Biology',
    code: 'BIO',
    overview: 'Covers the organization of life, cellular biology, plant and animal physiology, ecological systems, inheritance, and evolutionary mechanisms.',
    examStructure: {
      totalQuestions: 40,
      durationMinutes: 40,
      calculatorAllowed: false,
      sections: [
        'Organization of Life & Cell Biology (20%)',
        'Plant & Animal Physiology (35%)',
        'Ecology & Environmental Biology (20%)',
        'Genetics & Heredity (15%)',
        'Evolution & Adaptation (10%)'
      ]
    },
    generalObjectives: [
      'Understand biological structures, physiological systems, and metabolic pathways.',
      'Apply Mendelian genetics to inheritance crosses and pedigree charts.',
      'Analyze energy flow, nutrient cycles, and adaptations in Nigerian ecological biomes.'
    ],
    topics: [
      {
        id: 'bio-genetics',
        name: 'Genetics, Heredity & Variation',
        objectives: [
          'Determine genotypes and phenotypic ratios using monohybrid and dihybrid crosses.',
          'Explain ABO blood group inheritance and rhesus factor incompatibility.',
          'Analyze sex-linked inheritance (hemophilia, color blindness).'
        ],
        contents: ['Mendel’s laws', 'Blood grouping & Rh factor', 'Sex linkage', 'Mutations and karyotypes'],
        examWeight: 'High',
        questionCount: 7
      },
      {
        id: 'bio-physiology',
        name: 'Mammalian & Plant Physiology',
        objectives: [
          'Describe the double circulation of blood and cardiac cycles.',
          'Explain renal ultrafiltration, selective reabsorption, and osmoregulation.',
          'Analyze the light and dark stages of photosynthesis and mineral transport.'
        ],
        contents: ['Cardiovascular system', 'Kidney & nephron function', 'Photosynthesis & transpiration', 'Nervous & endocrine control'],
        examWeight: 'High',
        questionCount: 10
      },
      {
        id: 'bio-ecology',
        name: 'Ecology & Nutrient Cycles',
        objectives: [
          'Trace nitrogen, carbon, and water cycles through biotic and abiotic components.',
          'Distinguish food chains, food webs, and ecological pyramids.',
          'Describe adaptations in aquatic, rainforest, and savanna habitats.'
        ],
        contents: ['Biogeochemical cycles', 'Trophic levels and energy loss', 'Ecological succession', 'Conservation of natural resources'],
        examWeight: 'High',
        questionCount: 8
      }
    ],
    recommendedBooks: [
      { title: 'Modern Biology for Senior Secondary Schools', author: 'S.T. Ramalingam', publisher: 'Africana First' },
      { title: 'Senior Secondary Biology (Books 1-3)', author: 'Ndu, F.O.C. et al.' },
      { title: 'College Biology', author: 'Idodo Umeh' }
    ]
  },

  literature: {
    subjectId: 'literature',
    subjectName: 'Literature in English',
    code: 'LIT',
    overview: 'Tests literary appreciation, dramatic conventions, poetry analysis, and prescribed African and non-African texts in prose, drama, and poetry.',
    examStructure: {
      totalQuestions: 40,
      durationMinutes: 40,
      calculatorAllowed: false,
      sections: [
        'General Literary Principles & Devices (25%)',
        'African & Non-African Prose (25%)',
        'African & Non-African Drama (25%)',
        'African & Non-African Poetry (25%)'
      ]
    },
    generalObjectives: [
      'Identify figures of speech, poetic meters, and dramatic conventions.',
      'Analyze thematic concerns, dramatic irony, characterization, and symbolism.',
      'Appraise stylistic techniques in prescribed African and non-African texts.'
    ],
    topics: [
      {
        id: 'lit-principles',
        name: 'Literary Appreciation & Figures of Speech',
        objectives: [
          'Distinguish metaphor, simile, oxymoron, personification, and synecdoche.',
          'Analyze dramatic concepts (soliloquy, aside, hamartia, catharsis, hubris).'
        ],
        contents: ['Figures of speech', 'Literary terms & devices', 'Rhyme schemes & meters', 'Dramatic genres'],
        examWeight: 'High',
        questionCount: 10
      },
      {
        id: 'lit-drama',
        name: 'African & Non-African Drama',
        objectives: [
          'Examine thematic conflicts in prescribed plays.',
          'Analyze character motivations, tragic flaws, and stage directions.'
        ],
        contents: ['Tragic hero conventions', 'Colonial vs indigenous tensions', 'Symbolic stagecraft'],
        examWeight: 'High',
        questionCount: 10
      },
      {
        id: 'lit-poetry',
        name: 'African & Non-African Poetry',
        objectives: [
          'Analyze tone, imagery, diction, and mood in prescribed poems.',
          'Trace post-colonial critique, nature imagery, and existential themes.'
        ],
        contents: ['Poetic imagery', 'Stanzaic forms (sonnet, ode, elegy)', 'Social commentary in African verse'],
        examWeight: 'High',
        questionCount: 10
      }
    ],
    recommendedBooks: [
      { title: 'Exam Focus: Literature in English for WASSCE and UTME', author: 'A.O. Lawal' },
      { title: 'A Glossary of Literary Terms', author: 'M.H. Abrams' },
      { title: 'Comprehensive Literature in English for Senior Secondary Schools', author: 'K.A. Uche' }
    ]
  },

  economics: {
    subjectId: 'economics',
    subjectName: 'Economics',
    code: 'ECN',
    overview: 'Covers microeconomics, macroeconomics, public finance, monetary systems, international trade, and Nigerian economic development.',
    examStructure: {
      totalQuestions: 40,
      durationMinutes: 40,
      calculatorAllowed: true,
      sections: [
        'Basic Economic Principles & Price Theory (30%)',
        'Production & Market Structures (25%)',
        'National Income & Macroeconomics (25%)',
        'Money, Banking & International Trade (20%)'
      ]
    },
    generalObjectives: [
      'Understand economic scarcity, opportunity cost, and choice.',
      'Calculate price, income, and cross elasticity of demand and supply.',
      'Analyze fiscal policies, inflation, balance of payments, and economic growth.'
    ],
    topics: [
      {
        id: 'ecn-price',
        name: 'Demand, Supply & Elasticity',
        objectives: [
          'Calculate price elasticity of demand (PED) using the percentage formula.',
          'Analyze determinants of market equilibrium and price control consequences.',
          'Distinguish complementary, substitute, and derived demand.'
        ],
        contents: ['Law of demand and supply', 'Elasticity calculations', 'Price ceiling and price floor', 'Consumer surplus'],
        examWeight: 'High',
        questionCount: 8
      },
      {
        id: 'ecn-national-income',
        name: 'National Income Accounting & Inflation',
        objectives: [
          'Calculate GDP, GNP, and NNI using output, income, and expenditure approaches.',
          'Analyze types and causes of inflation (demand-pull vs cost-push).',
          'Evaluate the multiplier effect and fiscal stabilization measures.'
        ],
        contents: ['Gross Domestic Product', 'Inflation indexation', 'Circular flow of income', 'Fiscal & monetary policy'],
        examWeight: 'High',
        questionCount: 8
      },
      {
        id: 'ecn-markets',
        name: 'Market Structures & Production Theory',
        objectives: [
          'Compare profit-maximizing conditions (MR = MC) across market types.',
          'Identify characteristics of perfect competition, monopoly, and oligopoly.',
          'Apply the law of diminishing returns in production analysis.'
        ],
        contents: ['Perfect competition', 'Monopolistic competition', 'Total, average, and marginal cost curves'],
        examWeight: 'High',
        questionCount: 8
      }
    ],
    recommendedBooks: [
      { title: 'Comprehensive Economics for Senior Secondary Schools', author: 'J.U. Anyaele' },
      { title: 'Fundamentals of Economics', author: 'R.A. Cole' },
      { title: 'Economics: A Complete Course for UTME', author: 'K.I. Eze' }
    ]
  },

  government: {
    subjectId: 'government',
    subjectName: 'Government',
    code: 'GOV',
    overview: 'Assesses political concepts, systems of government, constitutional evolution in Nigeria, public administration, and international diplomacy.',
    examStructure: {
      totalQuestions: 40,
      durationMinutes: 40,
      calculatorAllowed: false,
      sections: [
        'Elements of Government & Political Concepts (30%)',
        'Political Institutions & Ideologies (20%)',
        'Colonial & Post-Independence Nigerian Politics (35%)',
        'International Relations & Organizations (15%)'
      ]
    },
    generalObjectives: [
      'Master political definitions: sovereignty, power, legitimacy, and the rule of law.',
      'Differentiate federal, unitary, presidential, and parliamentary systems.',
      'Analyze constitutional developments in Nigeria from Clifford to the 1999 Constitution.'
    ],
    topics: [
      {
        id: 'gov-concepts',
        name: 'Basic Concepts: Sovereignty, Power & Rule of Law',
        objectives: [
          'Define the attributes of the state, sovereignty, and constitutionalism.',
          'Explain principles of separation of powers and checks and balances.'
        ],
        contents: ['Sovereignty & legitimacy', 'Rule of law (A.V. Dicey)', 'Separation of powers (Montesquieu)'],
        examWeight: 'High',
        questionCount: 8
      },
      {
        id: 'gov-constitutions',
        name: 'Constitutional Developments in Nigeria',
        objectives: [
          'Trace elective principle introduction in the 1922 Clifford Constitution.',
          'Compare regional autonomy in Richards, Macpherson, and Lyttelton Constitutions.',
          'Analyze the 1963 Republican, 1979 Presidential, and 1999 Constitutions.'
        ],
        contents: ['Clifford, Richards, Macpherson, Lyttelton', 'Independence (1960) & Republican (1963)', '1979 and 1999 Constitutions'],
        examWeight: 'High',
        questionCount: 10
      },
      {
        id: 'gov-foreign-policy',
        name: 'Nigerian Foreign Policy & International Orgs',
        objectives: [
          'Identify Afrocentric focus and non-alignment as pillars of Nigeria’s foreign policy.',
          'Analyze structures and functions of ECOWAS, AU, and the United Nations.'
        ],
        contents: ['Afrocentric foreign policy', 'ECOWAS formation (1975)', 'African Union (AU)', 'UN Security Council'],
        examWeight: 'Medium',
        questionCount: 6
      }
    ],
    recommendedBooks: [
      { title: 'Essential Government for Senior Secondary Schools', author: 'C.C. Dibie' },
      { title: 'Government for SSS', author: 'Oyediran, O. et al.', publisher: 'Longman' },
      { title: 'Constitutional Development in Nigeria', author: 'Kalu Ezera' }
    ]
  },

  commerce: {
    subjectId: 'commerce',
    subjectName: 'Commerce',
    code: 'COM',
    overview: 'Examines commercial activities, retail and wholesale trade, banking and finance, transportation, insurance, marketing, and business ownership.',
    examStructure: {
      totalQuestions: 40,
      durationMinutes: 40,
      calculatorAllowed: true,
      sections: ['Trade & Commerce', 'Banking & Finance', 'Insurance & Transport', 'Marketing & Law']
    },
    generalObjectives: [
      'Understand trade, commerce, and international business.',
      'Analyze commercial banking, central bank functions, and capital markets.',
      'Apply business law and consumer protection principles.'
    ],
    topics: [
      { id: 'com-trade', name: 'Trade & Commerce', objectives: ['Differentiate home and foreign trade.'], contents: ['Wholesale and Retail', 'International trade'], examWeight: 'High', questionCount: 10 },
      { id: 'com-banking', name: 'Banking & Financial Markets', objectives: ['Understand commercial and central banking.'], contents: ['Functions of Central Bank', 'Commercial bank services'], examWeight: 'High', questionCount: 10 },
      { id: 'com-insurance', name: 'Insurance & Risk Management', objectives: ['Explain principles of indemnity and insurable interest.'], contents: ['Life and Non-life insurance', 'Principles of insurance'], examWeight: 'Medium', questionCount: 10 },
      { id: 'com-law', name: 'Business Law & Consumer Protection', objectives: ['Understand contracts and consumer rights.'], contents: ['Elements of valid contract', 'Consumer protection councils'], examWeight: 'Medium', questionCount: 10 }
    ],
    recommendedBooks: [{ title: 'Commerce for Senior Secondary Schools', author: 'E.U. Longe' }]
  },

  accounts: {
    subjectId: 'accounts',
    subjectName: 'Principles of Accounts',
    code: 'ACC',
    overview: 'Tests bookkeeping principles, double entry, trial balance, final accounts, partnerships, company accounts, and public sector accounting.',
    examStructure: {
      totalQuestions: 40,
      durationMinutes: 40,
      calculatorAllowed: true,
      sections: ['Bookkeeping & Journals', 'Final Accounts & Balance Sheet', 'Partnership Accounts', 'Company & Non-Profit Accounts']
    },
    generalObjectives: [
      'Master the principles of double entry bookkeeping.',
      'Prepare Trading, Profit & Loss Accounts and Balance Sheets.',
      'Calculate accounting ratios, depreciation, and bank reconciliation.'
    ],
    topics: [
      { id: 'acc-bookkeeping', name: 'Bookkeeping & Ledger Entries', objectives: ['Apply double-entry rules.'], contents: ['Ledgers', 'Books of Prime Entry', 'Trial Balance'], examWeight: 'High', questionCount: 10 },
      { id: 'acc-final', name: 'Final Accounts & Balance Sheet', objectives: ['Compute gross profit, net profit, and capital employed.'], contents: ['Trading and Profit & Loss', 'Balance sheet', 'Adjustments'], examWeight: 'High', questionCount: 10 },
      { id: 'acc-partnerships', name: 'Partnership Accounts', objectives: ['Prepare Appropriation Account and partner current accounts.'], contents: ['Profit sharing', 'Goodwill', 'Dissolution'], examWeight: 'High', questionCount: 10 },
      { id: 'acc-depreciation', name: 'Depreciation & Reserves', objectives: ['Calculate straight line and reducing balance depreciation.'], contents: ['Straight-line method', 'Reducing balance method'], examWeight: 'Medium', questionCount: 10 }
    ],
    recommendedBooks: [{ title: 'Essential Financial Accounting', author: 'O.A. Longe' }]
  },

  computer: {
    subjectId: 'computer',
    subjectName: 'Computer Studies',
    code: 'CMP',
    overview: 'Covers computer systems, hardware, operating systems, networking, internet technologies, data processing, algorithms, and cyber security.',
    examStructure: {
      totalQuestions: 40,
      durationMinutes: 40,
      calculatorAllowed: false,
      sections: ['Computer Hardware & System Software', 'Data Processing & Information Tech', 'Networking & Internet', 'Algorithms & Computer Ethics']
    },
    generalObjectives: [
      'Understand computer architecture and peripherals.',
      'Differentiate system software and application suites.',
      'Explain networking protocols, IPv4/IPv6, and cyber safety.'
    ],
    topics: [
      { id: 'cmp-hardware', name: 'Computer Hardware & Architecture', objectives: ['Explain CPU structure, ALU, CU, and registers.'], contents: ['Von Neumann architecture', 'Memory types (RAM, ROM)', 'Peripherals'], examWeight: 'High', questionCount: 10 },
      { id: 'cmp-software', name: 'Operating Systems & System Software', objectives: ['Understand OS functions: multitasking, process scheduling, memory allocation.'], contents: ['OS types', 'File systems', 'Utility programs'], examWeight: 'High', questionCount: 10 },
      { id: 'cmp-networking', name: 'Computer Networks & Internet', objectives: ['Identify network topologies, IP addressing, and OSI layers.'], contents: ['LAN, WAN, MAN', 'IPv4 vs IPv6', 'DNS and HTTP protocols'], examWeight: 'High', questionCount: 10 },
      { id: 'cmp-programming', name: 'Algorithms & Programming Fundamentals', objectives: ['Trace flowcharts and pseudo-code logic.'], contents: ['Variables and loops', 'Flowcharts and algorithms', 'Data security'], examWeight: 'Medium', questionCount: 10 }
    ],
    recommendedBooks: [{ title: 'Computer Studies for Senior Secondary Schools', author: 'Hiit Plc' }]
  },

  civic: {
    subjectId: 'civic',
    subjectName: 'Civic Education',
    code: 'CIV',
    overview: 'Evaluates understanding of democratic values, human rights, the Nigerian constitution, youth empowerment, public service, and anti-corruption.',
    examStructure: {
      totalQuestions: 40,
      durationMinutes: 40,
      calculatorAllowed: false,
      sections: ['National Values & Citizenship', 'Democracy & Rule of Law', 'Human Rights & Social Issues', 'Public Service & Civic Responsibility']
    },
    generalObjectives: [
      'Demonstrate understanding of fundamental human rights.',
      'Identify pillars of democracy, constitutionalism, and civil society.',
      'Promote national consciousness, anti-corruption, and responsible citizenship.'
    ],
    topics: [
      { id: 'civ-values', name: 'National Values & Citizen Rights', objectives: ['Identify core national values.'], contents: ['Integrity and honesty', 'Fundamental human rights', 'Duties of citizens'], examWeight: 'High', questionCount: 10 },
      { id: 'civ-democracy', name: 'Democracy, Rule of Law & Electoral Process', objectives: ['Explain democratic institutions.'], contents: ['INEC and elections', 'Separation of powers', 'Rule of law'], examWeight: 'High', questionCount: 10 },
      { id: 'civ-cultism', name: 'Social Ills, Cultism & Drug Abuse', objectives: ['Analyze negative impacts of social vices.'], contents: ['Cultism origins and prevention', 'NDLEA and substance abuse'], examWeight: 'Medium', questionCount: 10 },
      { id: 'civ-public', name: 'Public Service & Anti-Corruption', objectives: ['Understand code of conduct and anti-graft agencies.'], contents: ['EFCC and ICPC', 'Civil service structure', 'Code of conduct'], examWeight: 'Medium', questionCount: 10 }
    ],
    recommendedBooks: [{ title: 'Basic Civic Education for Senior Secondary Schools', author: 'M.O. Ukegbu' }]
  },

  crs: {
    subjectId: 'crs',
    subjectName: 'Christian Religious Studies',
    code: 'CRS',
    overview: 'Examines the Old Testament, the Synoptic Gospels, the early Church, the apostolic epistles, and Christian living in society.',
    examStructure: {
      totalQuestions: 40,
      durationMinutes: 40,
      calculatorAllowed: false,
      sections: ['Old Testament Themes', 'Synoptic Gospels & Jesus Ministry', 'The Acts of Apostles & Early Church', 'Epistles & Christian Ethics']
    },
    generalObjectives: [
      'Analyze the life, teachings, and miracles of Jesus Christ.',
      'Trace the growth and challenges of the early Church in Acts.',
      'Apply biblical moral teachings to contemporary societal life.'
    ],
    topics: [
      { id: 'crs-gospels', name: 'The Ministry & Parables of Jesus', objectives: ['Interpret the parables and teachings of Jesus.'], contents: ['Sermon on the Mount', 'Parables of the Kingdom', 'Miracles'], examWeight: 'High', questionCount: 10 },
      { id: 'crs-church', name: 'The Early Church & Apostles', objectives: ['Trace the day of Pentecost and missionary journeys.'], contents: ['Pentecost and Holy Spirit', 'Paul missionary journeys', 'Persecution'], examWeight: 'High', questionCount: 10 },
      { id: 'crs-faith', name: 'Faith, Works & Fellowship', objectives: ['Examine Paul and James teachings on faith and justification.'], contents: ['Justification by faith', 'Living by the Spirit', 'Christian ethics'], examWeight: 'Medium', questionCount: 10 }
    ],
    recommendedBooks: [{ title: 'Comprehensive CRS for Senior Secondary Schools', author: 'A.E. Oji' }]
  },

  irs: {
    subjectId: 'irs',
    subjectName: 'Islamic Studies',
    code: 'IRS',
    overview: 'Covers the Qur’an, Hadith, Tawhid, Fiqh, Islamic history, and the moral system of Islam.',
    examStructure: {
      totalQuestions: 40,
      durationMinutes: 40,
      calculatorAllowed: false,
      sections: ['The Holy Qur’an', 'Hadith & Sunnah', 'Tawhid & Pillars of Islam', 'Islamic History & Jurisprudence']
    },
    generalObjectives: [
      'Understand the revelation, compilation, and themes of the Qur’an.',
      'Apply authentic Hadith to daily Islamic conduct.',
      'Explain the pillars of Islam and Islamic jurisprudence (Fiqh).'
    ],
    topics: [
      { id: 'irs-tawhid', name: 'Tawhid & Pillars of Islam', objectives: ['Explain unity of Allah and pillars.'], contents: ['Attributes of Allah', 'Salat, Zakat, Sawm, Hajj', 'Articles of Faith'], examWeight: 'High', questionCount: 10 },
      { id: 'irs-hadith', name: 'Hadith & Sunnah', objectives: ['Differentiate Sahih Hadith classifications.'], contents: ['Collections of Bukhari and Muslim', 'Sunnah in daily conduct'], examWeight: 'High', questionCount: 10 },
      { id: 'irs-history', name: 'Islamic History & Caliphate', objectives: ['Trace the Hijrah and the four Rightly Guided Caliphs.'], contents: ['The Prophet in Makkah and Madinah', 'The Khulafa ar-Rashidun'], examWeight: 'Medium', questionCount: 10 }
    ],
    recommendedBooks: [{ title: 'Islamic Religious Knowledge for SSS', author: 'B. Aisha Lemu' }]
  },

  agriculture: {
    subjectId: 'agriculture',
    subjectName: 'Agricultural Science',
    code: 'AGR',
    overview: 'Covers crop production, animal science, soil fertility, farm mechanization, agricultural economics, and extension.',
    examStructure: {
      totalQuestions: 40,
      durationMinutes: 40,
      calculatorAllowed: true,
      sections: ['General Agriculture & Soil', 'Crop Science & Agronomy', 'Animal Science & Nutrition', 'Agricultural Economics & Engineering']
    },
    generalObjectives: [
      'Master soil physical and chemical properties and nutrient management.',
      'Understand husbandry, pest management, and breeding in crops and livestock.',
      'Apply agricultural marketing, farm budgeting, and mechanization principles.'
    ],
    topics: [
      { id: 'agr-soil', name: 'Soil Science & Fertility', objectives: ['Analyze soil pH, texture, and nutrient cycles.'], contents: ['Soil profiles', 'Nitrogen and Carbon cycles', 'Fertilizer application'], examWeight: 'High', questionCount: 10 },
      { id: 'agr-crop', name: 'Crop Science & Agronomy', objectives: ['Explain cultivation of cereals, legumes, and tubers.'], contents: ['Crop husbandry', 'Pest and disease control', 'Weed management'], examWeight: 'High', questionCount: 10 },
      { id: 'agr-animal', name: 'Animal Husbandry & Nutrition', objectives: ['Differentiate ruminant and non-ruminant digestive systems.'], contents: ['Livestock feeds', 'Livestock diseases and immunization', 'Fishery and poultry'], examWeight: 'High', questionCount: 10 }
    ],
    recommendedBooks: [{ title: 'Essential Agricultural Science for SSS', author: 'O.A. Iwena' }]
  },

  geography: {
    subjectId: 'geography',
    subjectName: 'Geography',
    code: 'GEO',
    overview: 'Encompasses physical geography, climatology, map reading, human geography, and regional geography of Nigeria and Africa.',
    examStructure: {
      totalQuestions: 40,
      durationMinutes: 40,
      calculatorAllowed: true,
      sections: ['Physical Geography & Geomorphology', 'Climatology & Biogeography', 'Map Work & Cartography', 'Human & Regional Geography']
    },
    generalObjectives: [
      'Interpret topographic maps, contours, and gradients.',
      'Understand earth rotation, revolution, rock types, and plate tectonics.',
      'Analyze economic geography, urbanization, and resource distribution in Nigeria.'
    ],
    topics: [
      { id: 'geo-physical', name: 'Physical Geography & Landforms', objectives: ['Explain rock weathering, vulcanicity, and river action.'], contents: ['Rock cycle', 'River basin landforms', 'Plate tectonics'], examWeight: 'High', questionCount: 10 },
      { id: 'geo-climate', name: 'Climatology & Vegetation', objectives: ['Differentiate tropical rain forest, savannah, and desert climates.'], contents: ['Atmospheric pressure and winds', 'Precipitation types', 'World biomes'], examWeight: 'High', questionCount: 10 },
      { id: 'geo-regional', name: 'Regional Geography of Nigeria', objectives: ['Analyze mineral resources, population, and agriculture in Nigeria.'], contents: ['Vegetation zones of Nigeria', 'Mineral resources', 'Industrial zones'], examWeight: 'High', questionCount: 10 }
    ],
    recommendedBooks: [{ title: 'Essential Geography for Senior Secondary Schools', author: 'N.P. Iloeje' }]
  },

  history: {
    subjectId: 'history',
    subjectName: 'History',
    code: 'HIS',
    overview: 'Explores Nigeria up to 1800, 19th-century developments, colonial rule, nationalist struggles, and post-independence history.',
    examStructure: {
      totalQuestions: 40,
      durationMinutes: 40,
      calculatorAllowed: false,
      sections: ['Pre-Colonial Kingdoms', 'The 19th Century & Jihad Movements', 'British Conquest & Colonial Rule', 'Decolonization & Post-Colonial Nigeria']
    },
    generalObjectives: [
      'Trace historical kingdoms (Oyo, Benin, Kanem-Borno, Hausa States).',
      'Analyze the Sokoto Jihad and British amalgamation of Nigeria in 1914.',
      'Evaluate nationalist leaders and post-independence political development.'
    ],
    topics: [
      { id: 'his-precolonial', name: 'Pre-Colonial Kingdoms of Nigeria', objectives: ['Understand political structures of ancient Oyo, Benin, and Kanem-Borno.'], contents: ['Oyo Empire', 'Benin Kingdom', 'Kanem-Borno and Hausa Bakwai'], examWeight: 'High', questionCount: 10 },
      { id: 'his-colonial', name: 'Colonial Rule & Indirect Rule System', objectives: ['Evaluate Lord Lugard Indirect Rule policy.'], contents: ['Amalgamation (1914)', 'Indirect Rule in North, West, and East', 'Warrant chiefs'], examWeight: 'High', questionCount: 10 }
    ],
    recommendedBooks: [{ title: 'Groundwork of Nigerian History', author: 'O. Ikime' }]
  }
};

