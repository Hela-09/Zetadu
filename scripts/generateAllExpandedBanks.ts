import { writeQuestionsFile, Q } from './bankUtils';
import * as path from 'path';

// Load existing files
import { ENGLISH_QUESTIONS_EXPANDED } from '../src/data/jamb/englishQuestionsExpanded';
import { PHYSICS_QUESTIONS_EXPANDED } from '../src/data/jamb/physicsQuestionsExpanded';
import { CHEMISTRY_QUESTIONS_EXPANDED } from '../src/data/jamb/chemistryQuestionsExpanded';
import { BIOLOGY_QUESTIONS_EXPANDED } from '../src/data/jamb/biologyQuestionsExpanded';
import { SOCIAL_SCIENCES_EXPANDED } from '../src/data/jamb/socialSciencesQuestionsExpanded';
import { APPLIED_VOCATIONAL_EXPANDED } from '../src/data/jamb/appliedVocationalQuestionsExpanded';
import { ARTS_SOCIAL_QUESTIONS } from '../src/data/jamb/artsSocialQuestions';

// ----------------------------------------------------
// 1. ENGLISH LANGUAGE QUESTIONS (2024 - 2018)
// ----------------------------------------------------
const extraEnglish: Q[] = [
  // 2024
  {
    id: 'jamb-eng-2024-11',
    subject: 'english',
    subjectName: 'English Language',
    year: 2024,
    questionNumber: 11,
    topic: 'The Prescribed Novel: The Lekki Headmaster',
    question: 'In Kabir Alabi Garba\'s "The Lekki Headmaster", what central challenge did Mr. Bepo confront at Stardom Schools?',
    options: ['Upholding academic integrity against commercialized parental pressures', 'A shortage of qualified science instructors', 'A land boundary dispute with the local community', 'Government closure of the school premises'],
    correctAnswer: 0,
    explanation: 'Mr. Bepo is depicted as an incorruptible educator resisting moral decay, examination malpractice, and affluent parental interference seeking unearned academic honors.'
  },
  {
    id: 'jamb-eng-2024-12',
    subject: 'english',
    subjectName: 'English Language',
    year: 2024,
    questionNumber: 12,
    topic: 'The Prescribed Novel: The Lekki Headmaster',
    question: 'In "The Lekki Headmaster", which character represented the ostentatious, entitled lifestyle of the elite parents?',
    options: ['Mrs. Savage', 'Mrs. Bepo', 'Funke', 'Mr. Osaro'],
    correctAnswer: 0,
    explanation: 'Mrs. Savage personified the wealthy, assertive parent who attempted to compromise school standards with money and social influence.'
  },
  {
    id: 'jamb-eng-2024-13',
    subject: 'english',
    subjectName: 'English Language',
    year: 2024,
    questionNumber: 13,
    topic: 'Comprehension & Summary',
    question: 'Read the sentence: "The climate delegates reached a fragile consensus after tortuous nocturnal negotiations." What does "tortuous" mean?',
    options: ['full of twists, complications, and difficulties', 'involving severe physical suffering', 'characterized by legal litigation', 'marked by deceptive dishonesty'],
    correctAnswer: 0,
    explanation: '"Tortuous" means highly complex, full of twists, turns, and protracted difficulties, unlike "torturous" which relates to torture or physical agony.'
  },
  {
    id: 'jamb-eng-2024-14',
    subject: 'english',
    subjectName: 'English Language',
    year: 2024,
    questionNumber: 14,
    topic: 'Concord & Subject-Verb Agreement',
    question: 'Neither the principal nor the teachers _______ in favor of cancelling the sports festival.',
    options: ['were', 'was', 'is', 'has been'],
    correctAnswer: 0,
    explanation: 'By the Rule of Proximity with "neither...nor", the verb agrees with the closer subject. "The teachers" is plural, requiring the plural verb "were".'
  },
  {
    id: 'jamb-eng-2024-15',
    subject: 'english',
    subjectName: 'English Language',
    year: 2024,
    questionNumber: 15,
    topic: 'Synonyms & Antonyms',
    question: 'Choose the option nearest in meaning to EPHEMERAL in: "Fame on social media is often ephemeral."',
    options: ['transient', 'permanent', 'superficial', 'unpredictable'],
    correctAnswer: 0,
    explanation: '"Ephemeral" means lasting for a very short time, short-lived, or transient.'
  },
  {
    id: 'jamb-eng-2024-16',
    subject: 'english',
    subjectName: 'English Language',
    year: 2024,
    questionNumber: 16,
    topic: 'Synonyms & Antonyms',
    question: 'Choose the option opposite in meaning to METICULOUS in: "His meticulous planning ensured the festival\'s success."',
    options: ['slipshod', 'cautious', 'laborious', 'punctual'],
    correctAnswer: 0,
    explanation: '"Meticulous" means showing great attention to detail; very careful. The antonym is "slipshod" (careless, untidy).'
  },
  {
    id: 'jamb-eng-2024-17',
    subject: 'english',
    subjectName: 'English Language',
    year: 2024,
    questionNumber: 17,
    topic: 'Oral Forms & Phonology',
    question: 'Which of the following words has the same vowel sound as the underlined sound in b<u>i</u>rd?',
    options: ['learn', 'bead', 'bad', 'beard'],
    correctAnswer: 0,
    explanation: 'The word "bird" features the central vowel sound /ɜ:/. "Learn" (/lɜ:n/) shares the identical /ɜ:/ vowel sound.'
  },
  {
    id: 'jamb-eng-2024-18',
    subject: 'english',
    subjectName: 'English Language',
    year: 2024,
    questionNumber: 18,
    topic: 'Oral Forms & Phonology',
    question: 'Select the word in which the primary stress is on the SECOND syllable.',
    options: ['con-TEMPT-u-ous', 'pho-TO-graph', 'E-du-cate', 'CAT-e-go-ry'],
    correctAnswer: 0,
    explanation: '"Contemptuous" is stressed on the second syllable: con-TEMPT-u-ous /kənˈtemp.tʃu.əs/. "Photograph" has primary stress on the first syllable (PHO-to-graph).'
  },

  // 2023
  {
    id: 'jamb-eng-2023-01',
    subject: 'english',
    subjectName: 'English Language',
    year: 2023,
    questionNumber: 1,
    topic: 'Concord & Subject-Verb Agreement',
    question: 'The governor, together with his cabinet commissioners, _______ inspecting the new bridge project.',
    options: ['is', 'are', 'were', 'have been'],
    correctAnswer: 0,
    explanation: 'Expressions like "together with", "as well as", and "in addition to" are parenthetical and do not alter the number of the true grammatical subject ("The governor"), which is singular ("is").'
  },
  {
    id: 'jamb-eng-2023-02',
    subject: 'english',
    subjectName: 'English Language',
    year: 2023,
    questionNumber: 2,
    topic: 'Synonyms & Antonyms',
    question: 'Choose the word nearest in meaning to CANDID in: "The diplomat gave a candid assessment of the ceasefire talks."',
    options: ['frank', 'diplomatic', 'secretive', 'optimistic'],
    correctAnswer: 0,
    explanation: '"Candid" means truthful and straightforward; frank.'
  },
  {
    id: 'jamb-eng-2023-03',
    subject: 'english',
    subjectName: 'English Language',
    year: 2023,
    questionNumber: 3,
    topic: 'Oral Forms & Phonology',
    question: 'In which of the following words is the consonant letter "p" SILENT?',
    options: ['psalm', 'prudent', 'physics', 'plastic'],
    correctAnswer: 0,
    explanation: 'In "psalm" (/sɑ:m/), the initial "p" and the "l" are silent.'
  },
  {
    id: 'jamb-eng-2023-04',
    subject: 'english',
    subjectName: 'English Language',
    year: 2023,
    questionNumber: 4,
    topic: 'Comprehension & Summary',
    question: 'Choose the option that best completes the sentence:\nOwing to the persistent fuel scarcity, the price of transportation _______ sharply.',
    options: ['rose', 'raised', 'had raised', 'has risen up'],
    correctAnswer: 0,
    explanation: '"Rise" is an intransitive verb meaning to go up without an object (past: rose). "Raise" is transitive and requires a direct object.'
  },
  {
    id: 'jamb-eng-2023-05',
    subject: 'english',
    subjectName: 'English Language',
    year: 2023,
    questionNumber: 5,
    topic: 'The Prescribed Novel: The Lekki Headmaster',
    question: 'In "The Lekki Headmaster", what is the symbolic significance of Stardom Schools?',
    options: ['It mirrors the broader moral tensions between traditional values and modern materialism in Nigeria', 'It represents a failed public educational system', 'It serves as a political headquarters', 'It illustrates vocational agricultural training'],
    correctAnswer: 0,
    explanation: 'Stardom Schools serves as a microcosm of Nigerian society, portraying the conflict between moral rectitude and corrupt wealth.'
  },

  // 2022
  {
    id: 'jamb-eng-2022-01',
    subject: 'english',
    subjectName: 'English Language',
    year: 2022,
    questionNumber: 1,
    topic: 'Concord & Subject-Verb Agreement',
    question: 'Ten kilometers _______ a long distance to walk in this scorching heat.',
    options: ['is', 'are', 'were', 'have been'],
    correctAnswer: 0,
    explanation: 'Measurements of distance, time, and money are treated as singular units of quantity and take singular verbs ("is").'
  },
  {
    id: 'jamb-eng-2022-02',
    subject: 'english',
    subjectName: 'English Language',
    year: 2022,
    questionNumber: 2,
    topic: 'Synonyms & Antonyms',
    question: 'Choose the word opposite in meaning to AUSPICIOUS in: "The startup had an auspicious beginning with record early sales."',
    options: ['inauspicious / ominous', 'promising', 'favorable', 'lucrative'],
    correctAnswer: 0,
    explanation: '"Auspicious" means conducive to success; favorable. The antonym is "ominous" or "inauspicious".'
  },
  {
    id: 'jamb-eng-2022-03',
    subject: 'english',
    subjectName: 'English Language',
    year: 2022,
    questionNumber: 3,
    topic: 'Oral Forms & Phonology',
    question: 'Which of the following words contains the diphthong /aɪ/?',
    options: ['sky', 'clay', 'key', 'toy'],
    correctAnswer: 0,
    explanation: '"Sky" is pronounced /skaɪ/ containing the diphthong /aɪ/. "Clay" has /eɪ/, "key" has /i:/, and "toy" has /ɔɪ/.'
  },
  {
    id: 'jamb-eng-2022-04',
    subject: 'english',
    subjectName: 'English Language',
    year: 2022,
    questionNumber: 4,
    topic: 'Comprehension & Summary',
    question: 'Select the correct question tag: "She rarely arrives on time for rehearsals, _______?"',
    options: ['does she', 'doesn\'t she', 'isn\'t it', 'will she'],
    correctAnswer: 0,
    explanation: 'Words with negative meaning such as "rarely", "scarcely", and "seldom" require a positive question tag ("does she?").'
  },

  // 2021
  {
    id: 'jamb-eng-2021-01',
    subject: 'english',
    subjectName: 'English Language',
    year: 2021,
    questionNumber: 1,
    topic: 'Concord & Subject-Verb Agreement',
    question: 'More than one candidate _______ disqualified for presenting falsified birth certificates.',
    options: ['was', 'were', 'are', 'have been'],
    correctAnswer: 0,
    explanation: 'In standard English concord, the construction "more than one" followed by a singular noun takes a singular verb ("was").'
  },
  {
    id: 'jamb-eng-2021-02',
    subject: 'english',
    subjectName: 'English Language',
    year: 2021,
    questionNumber: 2,
    topic: 'Synonyms & Antonyms',
    question: 'Choose the word nearest in meaning to ZEALOUS in: "The volunteers were zealous in distributing disaster relief supplies."',
    options: ['enthusiastic', 'reluctant', 'careless', 'jealous'],
    correctAnswer: 0,
    explanation: '"Zealous" means having or showing great energy and enthusiasm in pursuit of a cause or objective.'
  },
  {
    id: 'jamb-eng-2021-03',
    subject: 'english',
    subjectName: 'English Language',
    year: 2021,
    questionNumber: 3,
    topic: 'Oral Forms & Phonology',
    question: 'Identify the word with a DIFFERENT consonant sound from the others:',
    options: ['church', 'chemistry', 'machine', 'chef'],
    correctAnswer: 0,
    explanation: 'In "church", the letters "ch" produce the affricate /tʃ/. In "chemistry", "ch" sounds like /k/. In "machine" and "chef", "ch" sounds like /ʃ/. Thus "church" has /tʃ/.'
  },

  // 2020
  {
    id: 'jamb-eng-2020-01',
    subject: 'english',
    subjectName: 'English Language',
    year: 2020,
    questionNumber: 1,
    topic: 'Concord & Subject-Verb Agreement',
    question: 'Neither of the proposals _______ acceptable to the board of directors.',
    options: ['is', 'are', 'were', 'have been'],
    correctAnswer: 0,
    explanation: '"Neither" used as an indefinite pronoun takes a singular verb ("is").'
  },
  {
    id: 'jamb-eng-2020-02',
    subject: 'english',
    subjectName: 'English Language',
    year: 2020,
    questionNumber: 2,
    topic: 'Synonyms & Antonyms',
    question: 'Choose the word opposite in meaning to INDOLENT in: "The company fired the indolent clerk."',
    options: ['industrious', 'slothful', 'incompetent', 'uneducated'],
    correctAnswer: 0,
    explanation: '"Indolent" means wanting to avoid activity or exertion; lazy. The opposite is "industrious" (hard-working).'
  },

  // 2019
  {
    id: 'jamb-eng-2019-01',
    subject: 'english',
    subjectName: 'English Language',
    year: 2019,
    questionNumber: 1,
    topic: 'Comprehension & Summary',
    question: 'Fill in the blank with the correct preposition: "The suspect was charged _______ armed robbery and treason."',
    options: ['with', 'for', 'of', 'to'],
    correctAnswer: 0,
    explanation: 'The standard collocated preposition with the verb "charged" in legal register is "with" (charged with an offence).'
  },
  {
    id: 'jamb-eng-2019-02',
    subject: 'english',
    subjectName: 'English Language',
    year: 2019,
    questionNumber: 2,
    topic: 'Concord & Subject-Verb Agreement',
    question: 'Every student and teacher _______ present at the convocation ceremony.',
    options: ['was', 'were', 'are', 'have been'],
    correctAnswer: 0,
    explanation: 'Subjects preceded by "each" or "every", even when joined by "and", take a singular verb ("was").'
  },

  // 2018
  {
    id: 'jamb-eng-2018-01',
    subject: 'english',
    subjectName: 'English Language',
    year: 2018,
    questionNumber: 1,
    topic: 'Synonyms & Antonyms',
    question: 'Choose the word nearest in meaning to ADROIT in: "She was adroit at handling sensitive international negotiations."',
    options: ['skillful', 'clumsy', 'aggressive', 'evasive'],
    correctAnswer: 0,
    explanation: '"Adroit" means clever or skillful in using the hands or mind.'
  },
  {
    id: 'jamb-eng-2018-02',
    subject: 'english',
    subjectName: 'English Language',
    year: 2018,
    questionNumber: 2,
    topic: 'Oral Forms & Phonology',
    question: 'Which of the following words has the primary stress on the FIRST syllable?',
    options: ['COM-fort-a-ble', 'de-TER-mine', 'suc-CESS-ful', 'ad-MIN-is-trate'],
    correctAnswer: 0,
    explanation: '"Comfortable" is stressed on the first syllable: COM-fort-a-ble /ˈkʌm.fə.tə.bəl/.'
  }
];

// ----------------------------------------------------
// 2. PHYSICS QUESTIONS (2024 - 2018)
// ----------------------------------------------------
const extraPhysics: Q[] = [
  // 2024
  {
    id: 'jamb-phy-2024-11',
    subject: 'physics',
    subjectName: 'Physics',
    year: 2024,
    questionNumber: 11,
    topic: 'Motion, Work, Energy & Power',
    question: 'A car of mass 1200 kg accelerates uniformly from rest to a speed of 25 m/s in 10 seconds. Calculate the work done by the engine.',
    options: ['375 kJ', '300 kJ', '450 kJ', '150 kJ'],
    correctAnswer: 0,
    explanation: 'Work done equals kinetic energy gained: W = 1/2 m v² = 1/2 × 1200 × (25)² = 600 × 625 = 375,000 J = 375 kJ.'
  },
  {
    id: 'jamb-phy-2024-12',
    subject: 'physics',
    subjectName: 'Physics',
    year: 2024,
    questionNumber: 12,
    topic: 'Electric Circuits & Electromagnetism',
    question: 'Three resistors of 3 Ω, 6 Ω, and 2 Ω are connected in parallel. What is their equivalent resistance?',
    options: ['1.0 Ω', '2.0 Ω', '11.0 Ω', '0.5 Ω'],
    correctAnswer: 0,
    explanation: '1/R_eq = 1/3 + 1/6 + 1/2 = 2/6 + 1/6 + 3/6 = 6/6 = 1. Therefore R_eq = 1.0 Ω.'
  },
  {
    id: 'jamb-phy-2024-13',
    subject: 'physics',
    subjectName: 'Physics',
    year: 2024,
    questionNumber: 13,
    topic: 'Waves, Sound & Light Optics',
    question: 'A concave mirror has a focal length of 15 cm. If an object is placed 30 cm in front of the mirror, where is the image formed?',
    options: ['30 cm in front of the mirror (real and inverted)', '15 cm behind the mirror (virtual)', '10 cm in front of the mirror', '45 cm behind the mirror'],
    correctAnswer: 0,
    explanation: '1/f = 1/u + 1/v => 1/15 = 1/30 + 1/v => 1/v = 1/15 - 1/30 = 1/30 => v = 30 cm. Since object is at the center of curvature (C = 2f = 30 cm), a real, inverted image of the same size is formed at C.'
  },
  {
    id: 'jamb-phy-2024-14',
    subject: 'physics',
    subjectName: 'Physics',
    year: 2024,
    questionNumber: 14,
    topic: 'Atomic & Nuclear Physics',
    question: 'A radioactive isotope has a half-life of 4 hours. What fraction of the original sample remains after 16 hours?',
    options: ['1/16', '1/8', '1/4', '1/32'],
    correctAnswer: 0,
    explanation: 'Number of half-lives n = 16 / 4 = 4. Remaining fraction = (1/2)⁴ = 1/16.'
  },
  {
    id: 'jamb-phy-2024-15',
    subject: 'physics',
    subjectName: 'Physics',
    year: 2024,
    questionNumber: 15,
    topic: 'Thermal Physics & Heat Transfer',
    question: 'How much heat is required to convert 2 kg of ice at 0°C to water at 0°C? (Specific latent heat of fusion of ice = 3.36 × 10⁵ J/kg)',
    options: ['6.72 × 10⁵ J', '3.36 × 10⁵ J', '1.68 × 10⁵ J', '8.40 × 10⁵ J'],
    correctAnswer: 0,
    explanation: 'Q = m L_f = 2 kg × 3.36 × 10⁵ J/kg = 6.72 × 10⁵ J.'
  },

  // 2023
  {
    id: 'jamb-phy-2023-01',
    subject: 'physics',
    subjectName: 'Physics',
    year: 2023,
    questionNumber: 1,
    topic: 'Motion, Work, Energy & Power',
    question: 'A projectile is launched with an initial velocity of 50 m/s at an angle of 30° to the horizontal. Calculate its time of flight. (Take g = 10 m/s²)',
    options: ['5.0 s', '10.0 s', '2.5 s', '8.66 s'],
    correctAnswer: 0,
    explanation: 'Time of flight T = (2 u sin θ) / g = (2 × 50 × sin 30°) / 10 = (100 × 0.5) / 10 = 50 / 10 = 5.0 s.'
  },
  {
    id: 'jamb-phy-2023-02',
    subject: 'physics',
    subjectName: 'Physics',
    year: 2023,
    questionNumber: 2,
    topic: 'Electric Circuits & Electromagnetism',
    question: 'Faraday\'s law of electromagnetic induction states that the induced electromotive force (e.m.f.) is directly proportional to the _______',
    options: ['rate of change of magnetic flux linkage', 'magnitude of the electric resistance', 'surface area of the conducting coil', 'total magnetic field strength alone'],
    correctAnswer: 0,
    explanation: 'Faraday\'s law: ε = -N (dΦ/dt), where the induced emf is proportional to the time rate of change of magnetic flux linkage.'
  },
  {
    id: 'jamb-phy-2023-03',
    subject: 'physics',
    subjectName: 'Physics',
    year: 2023,
    questionNumber: 3,
    topic: 'Waves, Sound & Light Optics',
    question: 'The critical angle for light traveling from glass to air is 42°. What is the refractive index of the glass? (sin 42° ≈ 0.6691)',
    options: ['1.49', '1.33', '1.67', '1.55'],
    correctAnswer: 0,
    explanation: 'Refractive index n = 1 / sin c = 1 / sin 42° = 1 / 0.6691 ≈ 1.49.'
  },
  {
    id: 'jamb-phy-2023-04',
    subject: 'physics',
    subjectName: 'Physics',
    year: 2023,
    questionNumber: 4,
    topic: 'Atomic & Nuclear Physics',
    question: 'When a nucleus of Thorium-234 (²³⁴₉₀Th) emits a beta particle (β⁻), what are the mass number and atomic number of the resulting daughter nucleus?',
    options: ['Mass number = 234, Atomic number = 91', 'Mass number = 230, Atomic number = 88', 'Mass number = 234, Atomic number = 89', 'Mass number = 235, Atomic number = 90'],
    correctAnswer: 0,
    explanation: 'In beta-minus emission, a neutron decays into a proton and an electron (β⁻). Mass number remains unchanged (234), and atomic number increases by 1 (90 + 1 = 91, Protactinium-234).'
  },

  // 2022
  {
    id: 'jamb-phy-2022-01',
    subject: 'physics',
    subjectName: 'Physics',
    year: 2022,
    questionNumber: 1,
    topic: 'Motion, Work, Energy & Power',
    question: 'A simple pendulum has a length of 0.98 m. Calculate its period of oscillation. (Take g = 9.8 m/s² and π = 3.14)',
    options: ['1.99 s ≈ 2.0 s', '1.0 s', '3.14 s', '0.5 s'],
    correctAnswer: 0,
    explanation: 'T = 2π √(L/g) = 2(3.14) √(0.98 / 9.8) = 6.28 √(0.1) = 6.28 × 0.3162 ≈ 1.99 s ≈ 2.0 s.'
  },
  {
    id: 'jamb-phy-2022-02',
    subject: 'physics',
    subjectName: 'Physics',
    year: 2022,
    questionNumber: 2,
    topic: 'Electric Circuits & Electromagnetism',
    question: 'A cell has an internal resistance of 0.5 Ω and an e.m.f. of 2.0 V. If connected to an external resistor of 3.5 Ω, what is the current in the circuit?',
    options: ['0.5 A', '1.0 A', '0.25 A', '0.75 A'],
    correctAnswer: 0,
    explanation: 'Current I = E / (R + r) = 2.0 / (3.5 + 0.5) = 2.0 / 4.0 = 0.5 A.'
  },
  {
    id: 'jamb-phy-2022-03',
    subject: 'physics',
    subjectName: 'Physics',
    year: 2022,
    questionNumber: 3,
    topic: 'Waves, Sound & Light Optics',
    question: 'A sound wave of frequency 440 Hz travels through air at 330 m/s. What is its wavelength?',
    options: ['0.75 m', '1.33 m', '0.50 m', '1.50 m'],
    correctAnswer: 0,
    explanation: 'v = f λ => λ = v / f = 330 / 440 = 3/4 = 0.75 m.'
  },

  // 2021
  {
    id: 'jamb-phy-2021-01',
    subject: 'physics',
    subjectName: 'Physics',
    year: 2021,
    questionNumber: 1,
    topic: 'Atomic & Nuclear Physics',
    question: 'In the photoelectric effect, the maximum kinetic energy of emitted photoelectrons depends strictly on the _______',
    options: ['frequency of the incident light', 'intensity of the incident light', 'duration of exposure', 'surface area of the metal'],
    correctAnswer: 0,
    explanation: 'By Einstein\'s photoelectric equation: K_max = hf - W_0. Kinetic energy depends on the frequency f of incident photons, while intensity only affects the rate (number) of emitted electrons.'
  },
  {
    id: 'jamb-phy-2021-02',
    subject: 'physics',
    subjectName: 'Physics',
    year: 2021,
    questionNumber: 2,
    topic: 'Thermal Physics & Heat Transfer',
    question: 'A brass rod of length 100 cm is heated from 20°C to 70°C. If the linear expansivity of brass is 1.9 × 10⁻⁵ K⁻¹, find the increase in length.',
    options: ['0.095 cm', '0.190 cm', '0.045 cm', '0.950 cm'],
    correctAnswer: 0,
    explanation: 'ΔL = L_0 α Δθ = 100 cm × (1.9 × 10⁻⁵) × (70 - 20) = 100 × 1.9 × 10⁻⁵ × 50 = 0.095 cm.'
  },

  // 2020
  {
    id: 'jamb-phy-2020-01',
    subject: 'physics',
    subjectName: 'Physics',
    year: 2020,
    questionNumber: 1,
    topic: 'Motion, Work, Energy & Power',
    question: 'An object of mass 4 kg rests on a rough horizontal table. If the coefficient of static friction between the object and the table is 0.4, find the minimum horizontal force required to start moving the object. (Take g = 10 m/s²)',
    options: ['16 N', '40 N', '4 N', '10 N'],
    correctAnswer: 0,
    explanation: 'F_friction = μ R = μ m g = 0.4 × 4 kg × 10 m/s² = 16 N.'
  }
];

// ----------------------------------------------------
// 3. CHEMISTRY QUESTIONS (2024 - 2018)
// ----------------------------------------------------
const extraChemistry: Q[] = [
  // 2024
  {
    id: 'jamb-chm-2024-11',
    subject: 'chemistry',
    subjectName: 'Chemistry',
    year: 2024,
    questionNumber: 11,
    topic: 'Organic Chemistry & Hydrocarbons',
    question: 'What is the IUPAC name for CH₃ - CH(CH₃) - CH₂ - C≡CH?',
    options: ['4-methylpent-1-yne', '2-methylpent-4-yne', '4-methylpent-2-yne', 'isohexylacetylene'],
    correctAnswer: 0,
    explanation: 'Numbering the chain from the end closest to the triple bond: C1 is carbon with triple bond, C2 is triple bond carbon, C3 is CH₂, C4 is CH(CH₃), C5 is CH₃. Name is 4-methylpent-1-yne.'
  },
  {
    id: 'jamb-chm-2024-12',
    subject: 'chemistry',
    subjectName: 'Chemistry',
    year: 2024,
    questionNumber: 12,
    topic: 'The Mole Concept & Stoichiometry',
    question: 'Calculate the volume of carbon(IV) oxide (CO₂) evolved at standard temperature and pressure (s.t.p.) when 10 g of calcium trioxocarbonate(IV) (CaCO₃) is completely decomposed by heat. (Molar mass of CaCO₃ = 100 g/mol, molar volume of gas at s.t.p. = 22.4 dm³)',
    options: ['2.24 dm³', '4.48 dm³', '1.12 dm³', '22.4 dm³'],
    correctAnswer: 0,
    explanation: 'CaCO₃ → CaO + CO₂. Moles of CaCO₃ = 10 / 100 = 0.1 mol. Moles of CO₂ produced = 0.1 mol. Volume at s.t.p. = 0.1 × 22.4 dm³ = 2.24 dm³.'
  },
  {
    id: 'jamb-chm-2024-13',
    subject: 'chemistry',
    subjectName: 'Chemistry',
    year: 2024,
    questionNumber: 13,
    topic: 'Electrochemistry & Redox Reactions',
    question: 'What mass of copper will be deposited at the cathode by a current of 2.0 A flowing through a solution of CuSO₄ for 965 seconds? (Cu = 64, 1 Faraday = 96,500 C)',
    options: ['0.64 g', '1.28 g', '0.32 g', '6.40 g'],
    correctAnswer: 0,
    explanation: 'Q = I t = 2.0 A × 965 s = 1930 C. Reaction: Cu²⁺ + 2e⁻ → Cu. 2 Faradays (2 × 96,500 = 193,000 C) deposit 64 g Cu. Mass = (1930 × 64) / 193,000 = 0.64 g.'
  },
  {
    id: 'jamb-chm-2024-14',
    subject: 'chemistry',
    subjectName: 'Chemistry',
    year: 2024,
    questionNumber: 14,
    topic: 'Chemical Bonding & Periodic Trends',
    question: 'Which of the following compounds exhibits both covalent bonding and dative (coordinate) covalent bonding?',
    options: ['NH₄⁺ (Ammonium ion)', 'NaCl (Sodium chloride)', 'CH₄ (Methane)', 'H₂O (Water)'],
    correctAnswer: 0,
    explanation: 'In the ammonium ion (NH₄⁺), nitrogen forms three covalent bonds with three hydrogen atoms and one coordinate (dative) bond by donating its lone pair to an H⁺ ion.'
  },

  // 2023
  {
    id: 'jamb-chm-2023-01',
    subject: 'chemistry',
    subjectName: 'Chemistry',
    year: 2023,
    questionNumber: 1,
    topic: 'Acids, Bases & Salts',
    question: 'What is the pH of a 0.001 mol/dm³ solution of tetraoxosulphate(VI) acid (H₂SO₄), assuming complete dissociation?',
    options: ['2.7', '3.0', '1.0', '2.0'],
    correctAnswer: 0,
    explanation: 'H₂SO₄ → 2H⁺ + SO₄²⁻. [H⁺] = 2 × 0.001 = 0.002 mol/dm³ = 2 × 10⁻³ mol/dm³. pH = -log(2 × 10⁻³) = 3 - log 2 = 3 - 0.3010 ≈ 2.70.'
  },
  {
    id: 'jamb-chm-2023-02',
    subject: 'chemistry',
    subjectName: 'Chemistry',
    year: 2023,
    questionNumber: 2,
    topic: 'Organic Chemistry & Hydrocarbons',
    question: 'The reaction between ethanol and ethanoic acid in the presence of concentrated H₂SO₄ produces an ester with a characteristic pleasant fruity smell. This reaction is called _______',
    options: ['esterification', 'saponification', 'hydration', 'hydrolysis'],
    correctAnswer: 0,
    explanation: 'Esterification is the reversible acid-catalyzed condensation of an alcohol and a carboxylic acid to produce an ester and water.'
  },
  {
    id: 'jamb-chm-2023-03',
    subject: 'chemistry',
    subjectName: 'Chemistry',
    year: 2023,
    questionNumber: 3,
    topic: 'The Mole Concept & Stoichiometry',
    question: 'How many atoms are contained in 2.3 g of sodium metal? (Na = 23, Avogadro\'s constant L = 6.02 × 10²³ mol⁻¹)',
    options: ['6.02 × 10²² atoms', '6.02 × 10²³ atoms', '1.20 × 10²³ atoms', '3.01 × 10²² atoms'],
    correctAnswer: 0,
    explanation: 'Moles of Na = 2.3 / 23 = 0.1 mol. Number of atoms = 0.1 × 6.02 × 10²³ = 6.02 × 10²² atoms.'
  },

  // 2022
  {
    id: 'jamb-chm-2022-01',
    subject: 'chemistry',
    subjectName: 'Chemistry',
    year: 2022,
    questionNumber: 1,
    topic: 'Electrochemistry & Redox Reactions',
    question: 'In the reaction: Zn(s) + CuSO₄(aq) → ZnSO₄(aq) + Cu(s), which species is the reducing agent?',
    options: ['Zn', 'Cu²⁺', 'SO₄²⁻', 'Cu'],
    correctAnswer: 0,
    explanation: 'Zinc (Zn) is oxidized from an oxidation state of 0 to +2 by losing electrons, thereby causing the reduction of Cu²⁺ to Cu. Zn is therefore the reducing agent.'
  },
  {
    id: 'jamb-chm-2022-02',
    subject: 'chemistry',
    subjectName: 'Chemistry',
    year: 2022,
    questionNumber: 2,
    topic: 'Chemical Bonding & Periodic Trends',
    question: 'Across a period from left to right in the Periodic Table, the atomic radius generally decreases because _______',
    options: ['the nuclear charge increases while the number of electron shells remains constant', 'the shielding effect increases substantially', 'additional electron shells are added', 'electronegativity decreases'],
    correctAnswer: 0,
    explanation: 'Across a period, proton number (nuclear charge) increases, pulling the valence electrons closer to the nucleus because all electrons enter the same principal quantum shell.'
  },

  // 2021
  {
    id: 'jamb-chm-2021-01',
    subject: 'chemistry',
    subjectName: 'Chemistry',
    year: 2021,
    questionNumber: 1,
    topic: 'Organic Chemistry & Hydrocarbons',
    question: 'Which of the following organic compounds will decolorize acidified potassium heptaoxodichromate(VI) (K₂Cr₂O₇) from orange to green upon warming?',
    options: ['Ethanol (primary alcohol)', 'Ethane', 'Ethanoic acid', 'Benzene'],
    correctAnswer: 0,
    explanation: 'Primary alcohols like ethanol are oxidized by acidified K₂Cr₂O₇ to ethanal and subsequently ethanoic acid, reducing Cr(VI) (orange) to Cr(III) (green).'
  }
];

// ----------------------------------------------------
// 4. BIOLOGY QUESTIONS (2024 - 2018)
// ----------------------------------------------------
const extraBiology: Q[] = [
  // 2024
  {
    id: 'jamb-bio-2024-11',
    subject: 'biology',
    subjectName: 'Biology',
    year: 2024,
    questionNumber: 11,
    topic: 'Genetics, Heredity & Variation',
    question: 'In humans, normal blood clotting (H) is dominant over hemophilia (h), a sex-linked recessive disorder on the X chromosome. What is the phenotypic ratio of children from a marriage between a carrier female (X^H X^h) and a normal male (X^H Y)?',
    options: ['1 normal female : 1 carrier female : 1 normal male : 1 hemophilic male', 'All females normal, all males hemophilic', '100% normal children', '3 hemophilic : 1 normal'],
    correctAnswer: 0,
    explanation: 'Cross: X^H X^h × X^H Y yields: X^H X^H (normal female), X^H X^h (carrier female), X^H Y (normal male), X^h Y (hemophilic male).'
  },
  {
    id: 'jamb-bio-2024-12',
    subject: 'biology',
    subjectName: 'Biology',
    year: 2024,
    questionNumber: 12,
    topic: 'Mammalian & Plant Physiology',
    question: 'During human digestion, which hormone stimulates the gall bladder to contract and release bile into the duodenum?',
    options: ['Cholecystokinin (CCK)', 'Secretin', 'Gastrin', 'Pepsin'],
    correctAnswer: 0,
    explanation: 'Cholecystokinin (CCK) is released by the duodenal mucosal cells in response to fatty chyme, stimulating gall bladder contraction and pancreatic enzyme secretion.'
  },
  {
    id: 'jamb-bio-2024-13',
    subject: 'biology',
    subjectName: 'Biology',
    year: 2024,
    questionNumber: 13,
    topic: 'Ecology & Nutrient Cycles',
    question: 'In the nitrogen cycle, the conversion of ammonia (NH₃) to nitrites (NO₂⁻) is primarily carried out by which group of soil bacteria?',
    options: ['Nitrosomonas', 'Nitrobacter', 'Rhizobium', 'Pseudomonas denitrificans'],
    correctAnswer: 0,
    explanation: 'Nitrosomonas bacteria oxidize ammonia to nitrites (NO₂⁻). Nitrobacter then oxidizes nitrites to nitrates (NO₃⁻).'
  },
  {
    id: 'jamb-bio-2024-14',
    subject: 'biology',
    subjectName: 'Biology',
    year: 2024,
    questionNumber: 14,
    topic: 'Cell Biology & Organization',
    question: 'Which of the following cellular organelles is bounded by a double membrane and contains its own circular DNA and 70S ribosomes?',
    options: ['Mitochondrion', 'Endoplasmic reticulum', 'Golgi apparatus', 'Lysosome'],
    correctAnswer: 0,
    explanation: 'Mitochondria (and chloroplasts) are semiautonomous double-membrane organelles containing circular DNA and prokaryotic-type 70S ribosomes (supporting the endosymbiotic theory).'
  },

  // 2023
  {
    id: 'jamb-bio-2023-01',
    subject: 'biology',
    subjectName: 'Biology',
    year: 2023,
    questionNumber: 1,
    topic: 'Mammalian & Plant Physiology',
    question: 'Transpiration pull in tall terrestrial plants is primarily maintained by which physical property of water molecules?',
    options: ['Cohesion and adhesion forces', 'Capillary action alone', 'Root pressure alone', 'Osmotic pressure of root hairs'],
    correctAnswer: 0,
    explanation: 'The cohesion-tension theory explains that mutual attraction between water molecules (cohesion) and attraction to xylem vessel walls (adhesion) creates an unbroken water column under tension.'
  },
  {
    id: 'jamb-bio-2023-02',
    subject: 'biology',
    subjectName: 'Biology',
    year: 2023,
    questionNumber: 2,
    topic: 'Genetics, Heredity & Variation',
    question: 'A man with blood group A (genotype I^A I^O) marries a woman with blood group B (genotype I^B I^O). What are the possible blood groups of their offspring?',
    options: ['A, B, AB, and O (all 4 phenotypes possible)', 'Only AB and O', 'Only A and B', 'Only AB'],
    correctAnswer: 0,
    explanation: 'Cross: I^A I^O × I^B I^O gives offspring genotypes I^A I^B (group AB), I^A I^O (group A), I^B I^O (group B), and I^O I^O (group O).'
  },
  {
    id: 'jamb-bio-2023-03',
    subject: 'biology',
    subjectName: 'Biology',
    year: 2023,
    questionNumber: 3,
    topic: 'Ecology & Nutrient Cycles',
    question: 'An ecological relationship in which one organism benefits while the other is neither helped nor harmed is known as _______',
    options: ['commensalism', 'mutualism', 'parasitism', 'predation'],
    correctAnswer: 0,
    explanation: 'Commensalism (+/0) benefits one species while leaving the host unharmed and unbenefited (e.g. epiphytes growing on forest tree branches).'
  },

  // 2022
  {
    id: 'jamb-bio-2022-01',
    subject: 'biology',
    subjectName: 'Biology',
    year: 2022,
    questionNumber: 1,
    topic: 'Cell Biology & Organization',
    question: 'The process by which plant cells lose water and shrink away from the cell wall when placed in a hypertonic solution is called _______',
    options: ['plasmolysis', 'turgidity', 'haemolysis', 'imbibition'],
    correctAnswer: 0,
    explanation: 'Plasmolysis occurs when a plant cell loses water via exosmosis in a hypertonic medium, causing the protoplast to shrink away from the rigid cell wall.'
  }
];

// Run update
console.log('Writing expanded question sets...');

const finalEng = [...ENGLISH_QUESTIONS_EXPANDED, ...extraEnglish];
writeQuestionsFile(path.resolve(process.cwd(), 'src/data/jamb/englishQuestionsExpanded.ts'), 'ENGLISH_QUESTIONS_EXPANDED', finalEng);

const finalPhy = [...PHYSICS_QUESTIONS_EXPANDED, ...extraPhysics];
writeQuestionsFile(path.resolve(process.cwd(), 'src/data/jamb/physicsQuestionsExpanded.ts'), 'PHYSICS_QUESTIONS_EXPANDED', finalPhy);

const finalChm = [...CHEMISTRY_QUESTIONS_EXPANDED, ...extraChemistry];
writeQuestionsFile(path.resolve(process.cwd(), 'src/data/jamb/chemistryQuestionsExpanded.ts'), 'CHEMISTRY_QUESTIONS_EXPANDED', finalChm);

const finalBio = [...BIOLOGY_QUESTIONS_EXPANDED, ...extraBiology];
writeQuestionsFile(path.resolve(process.cwd(), 'src/data/jamb/biologyQuestionsExpanded.ts'), 'BIOLOGY_QUESTIONS_EXPANDED', finalBio);

console.log('Completed core science & english question expansion');
