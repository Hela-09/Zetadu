import { JambQuestion } from './jambQuestions';
import { LEKKI_HEADMASTER_NOVEL } from './novels/lekkiHeadmaster';
import { LIFE_CHANGER_NOVEL } from './novels/lifeChanger';

export interface NovelQuestionMetadata {
  novelId: string;
  novelTitle: string;
  chapterIndex?: number;
  chapterTitle?: string;
  questionNumber: number;
}

/**
 * Authentic, high-yield stored question bank for JAMB Prescribed Novels:
 * 1. The Lekki Headmaster (Kabir Alabi Garba) - Current Official JAMB Novel (2025/2026/2027)
 * 2. The Life Changer (Khadija Abubakar Jalli) - Previous Official JAMB Novel
 * 3. Second Class Citizen (Buchi Emecheta) - Literature-in-English Prescribed African Prose
 * 4. The Lion and the Jewel (Wole Soyinka) - Literature-in-English Prescribed Drama
 */
export const LEKKI_HEADMASTER_STORED_QUESTIONS: JambQuestion[] = [
  // Chapter 1: The Morning Assembly at Stardom Schools
  {
    id: 'lh-q-001',
    subject: 'english',
    subjectName: 'English Language',
    year: 2025,
    questionNumber: 1,
    topic: 'The Lekki Headmaster - Chapter 1: The Morning Assembly',
    question: 'In Chapter 1 of "The Lekki Headmaster", what does Mr. Bepo emphasize to the students during the Monday morning assembly at Stardom Schools?',
    options: [
      'That wealth and social standing without character and moral discipline are utterly worthless',
      'That students must focus entirely on passing foreign examinations rather than local curricula',
      'That the school fees for the upcoming term will be increased to fund sports facilities',
      'That teachers must be evaluated strictly based on the examination scores of their students'
    ],
    correctAnswer: 0,
    explanation: 'During the assembly address, Mr. Bepo passionately articulates his core pedagogical philosophy: academic brilliance and material affluence without steadfast moral character and integrity produce societal decay.'
  },
  {
    id: 'lh-q-002',
    subject: 'english',
    subjectName: 'English Language',
    year: 2025,
    questionNumber: 2,
    topic: 'The Lekki Headmaster - Chapter 1: The Morning Assembly',
    question: 'The sharp contrast depicted between the luxury sports utility vehicles arriving at Stardom Schools and the daily commute of teachers like Mr. Ojo highlights which literary theme?',
    options: [
      'Social realism and the economic disparity in modern urban Lagos',
      'Magical realism and supernatural intervention',
      'Historical nostalgia for pre-colonial village life',
      'The superiority of private enterprise over public education'
    ],
    correctAnswer: 0,
    explanation: 'Author Kabir Alabi Garba uses social realism to juxtapose the ostentatious wealth of affluent Lekki parents dropping their children in luxury vehicles with the grueling mainland-to-island commutes endured by underpaid, committed teachers.'
  },
  {
    id: 'lh-q-003',
    subject: 'english',
    subjectName: 'English Language',
    year: 2025,
    questionNumber: 3,
    topic: 'The Lekki Headmaster - Chapter 1: The Morning Assembly',
    question: 'Why does Mr. Bepo reprimand the senior prefect who attempted to excuse latecomers from wealthy families?',
    options: [
      'He insists that school rules and discipline must be applied impartially to all students regardless of family background',
      'The senior prefect had failed his own morning physics test',
      'The school proprietress had already suspended the prefect earlier that morning',
      'The latecomers had arrived after the school gates had been completely locked by security'
    ],
    correctAnswer: 0,
    explanation: 'Mr. Bepo refuses to tolerate preferential treatment or double standards, insisting that true character formation demands that rules apply equally to both the privileged and less privileged.'
  },
  {
    id: 'lh-q-004',
    subject: 'english',
    subjectName: 'English Language',
    year: 2025,
    questionNumber: 4,
    topic: 'The Lekki Headmaster - Chapter 1: The Morning Assembly',
    question: 'How do the junior teachers view Mr. Bepo’s leadership style in the early chapters of the novel?',
    options: [
      'As a rare beacon of principled integrity and an inspiring defender of academic excellence',
      'As an overly lenient administrator who tolerates insubordination',
      'As an absentee headmaster interested only in board politics',
      'As a stooge of the wealthy Lekki parents and school shareholders'
    ],
    correctAnswer: 0,
    explanation: 'Teachers like Miss Sandra and Mr. Ojo hold Mr. Bepo in high esteem because he shields them from undue parental intimidation and stands unbendingly for educational dignity.'
  },
  {
    id: 'lh-q-005',
    subject: 'english',
    subjectName: 'English Language',
    year: 2025,
    questionNumber: 5,
    topic: 'The Lekki Headmaster - Chapter 1: The Morning Assembly',
    question: 'What symbolic importance does the school motto of Stardom Schools hold in relation to Mr. Bepo’s personal mission?',
    options: [
      'It champions "Excellence and Integrity", which Mr. Bepo strives to make a living reality rather than a decorative slogan',
      'It promises automatic admission into elite British boarding schools',
      'It guarantees that every enrolled student will score 350+ in UTME without studying',
      'It emphasizes commercial leadership and corporate entrepreneurship for children'
    ],
    correctAnswer: 0,
    explanation: 'Mr. Bepo constantly reminds the proprietress and students that Stardom Schools\' motto of integrity must not be reduced to mere marketing window-dressing.'
  },

  // Chapter 2: The Proprietress’s Ledger and The Dilemma
  {
    id: 'lh-q-006',
    subject: 'english',
    subjectName: 'English Language',
    year: 2025,
    questionNumber: 6,
    topic: 'The Lekki Headmaster - Chapter 2: The Proprietress\'s Ledger',
    question: 'In Chapter 2, what primary dilemma does Mrs. Savage present to Mr. Bepo in her executive office?',
    options: [
      'She urges him to soften disciplinary measures against recalcitrant students whose parents pay high tuition fees on time',
      'She orders him to replace all Nigerian staff with expatriate teachers from Europe',
      'She demands that the school abandon the WAEC curriculum in favor of an American system',
      'She announces the immediate relocation of Stardom Schools to Ikeja'
    ],
    correctAnswer: 0,
    explanation: 'Mrs. Savage is primarily concerned with cash flow, student retention, and parent patronage, pressuring Mr. Bepo to compromise disciplinary rigor so as not to offend influential, wealthy fee-paying parents.'
  },
  {
    id: 'lh-q-007',
    subject: 'english',
    subjectName: 'English Language',
    year: 2025,
    questionNumber: 7,
    topic: 'The Lekki Headmaster - Chapter 2: The Proprietress\'s Ledger',
    question: 'How does Mr. Bepo respond to Mrs. Savage’s assertion that "private schooling is first and foremost a commercial business"?',
    options: [
      'He counters that when education trades moral character for profit, it ceases to educate and begins to corrupt society',
      'He agrees and immediately offers to take a percentage cut of all late-registration fees',
      'He submits his resignation letter immediately on the spot without discussion',
      'He suggests taking loans from commercial banks to offset the tuition shortfall'
    ],
    correctAnswer: 0,
    explanation: 'Mr. Bepo articulates the central philosophical thesis of the novel: treating education purely as a commodity destroys the sacred duty of molding honest, responsible citizens.'
  },
  {
    id: 'lh-q-008',
    subject: 'english',
    subjectName: 'English Language',
    year: 2025,
    questionNumber: 8,
    topic: 'The Lekki Headmaster - Chapter 2: The Proprietress\'s Ledger',
    question: 'What specific complaint did Chief Adeleke lodge with the school management concerning his son\'s midterm report?',
    options: [
      'He was furious that his son was awarded a realistic grade of "C" in English and Mathematics rather than an unearned "A"',
      'He claimed his son was denied participation in the annual inter-house sports race',
      'He complained that the school cafeteria food was not prepared to continental standards',
      'He protested against the mandatory morning assembly prayers'
    ],
    correctAnswer: 0,
    explanation: 'Chief Adeleke, embodying entitled Lekki parents, believed his heavy financial contributions entitled his son to inflated academic honors regardless of true classroom effort.'
  },
  {
    id: 'lh-q-009',
    subject: 'english',
    subjectName: 'English Language',
    year: 2025,
    questionNumber: 9,
    topic: 'The Lekki Headmaster - Chapter 2: The Proprietress\'s Ledger',
    question: 'The literary tone adopted by the author in describing Mrs. Savage’s obsession with the school ledger can best be described as:',
    options: [
      'Satirical and cautionary',
      'Tragic and fatalistic',
      'Detached and purely documentary',
      'Celebratory and adulatory'
    ],
    correctAnswer: 0,
    explanation: 'Garba satirizes the commercialization of modern private schools, using Mrs. Savage\'s balance sheet fixation as a cautionary tale on the erosion of educational standards.'
  },
  {
    id: 'lh-q-010',
    subject: 'english',
    subjectName: 'English Language',
    year: 2025,
    questionNumber: 10,
    topic: 'The Lekki Headmaster - Chapter 2: The Proprietress\'s Ledger',
    question: 'Why does Mrs. Savage hesitate to outright dismiss Mr. Bepo despite his refusal to bend school rules for high-net-worth parents?',
    options: [
      'She recognizes that his impeccable reputation and sterling integrity are the very foundation of the school\'s public credibility',
      'Mr. Bepo owns fifty percent of the voting shares in Stardom Schools',
      'The Ministry of Education issued a restraining order preventing any staff changes',
      'Her own husband is Mr. Bepo\'s childhood classmate and business partner'
    ],
    correctAnswer: 0,
    explanation: 'Mrs. Savage is pragmatic enough to understand that Stardom Schools owes its high public standing and parental trust precisely to Mr. Bepo\'s upright name and administrative competence.'
  },

  // Chapter 3: Counsel by the Evening Hearth
  {
    id: 'lh-q-011',
    subject: 'english',
    subjectName: 'English Language',
    year: 2025,
    questionNumber: 11,
    topic: 'The Lekki Headmaster - Chapter 3: Counsel by the Evening Hearth',
    question: 'In Chapter 3, what role does Mrs. Funke Bepo play in her husband\'s ongoing administrative battles?',
    options: [
      'She acts as a wise, grounding counselor who reinforces his moral resolve while advising tactical patience',
      'She urges him to quit teaching and relocate to the village to practice mechanized farming',
      'She encourages him to accept bribes from wealthy parents to build their retirement home',
      'She secretly confronts Mrs. Savage at her private residence in Ikoyi'
    ],
    correctAnswer: 0,
    explanation: 'Funke Bepo serves as Mr. Bepo\'s steadfast emotional anchor. Her calm discernment and moral clarity renew his strength during periods of severe professional isolation.'
  },
  {
    id: 'lh-q-012',
    subject: 'english',
    subjectName: 'English Language',
    year: 2025,
    questionNumber: 12,
    topic: 'The Lekki Headmaster - Chapter 3: Counsel by the Evening Hearth',
    question: 'The domestic environment of the Bepo household is portrayed in sharp contrast to the Lekki mansions because:',
    options: [
      'It radiates modest contentment, intellectual depth, mutual respect, and genuine warmth',
      'It is impoverished and filled with bitter resentment against the rich',
      'It relies on noisy electric generators and continuous ostentatious dinner parties',
      'It is dominated by strict military-style discipline where children cannot speak'
    ],
    correctAnswer: 0,
    explanation: 'Garba uses the Bepo home to show that genuine peace and dignity do not depend on lavish luxury, but on integrity, love, and honest labor.'
  },
  {
    id: 'lh-q-013',
    subject: 'english',
    subjectName: 'English Language',
    year: 2025,
    questionNumber: 13,
    topic: 'The Lekki Headmaster - Chapter 3: Counsel by the Evening Hearth',
    question: 'What memorable proverb or advice does Funke offer Mr. Bepo regarding the storm brewing at Stardom Schools?',
    options: [
      '"A pillar erected on the bedrock of truth may be shaken by the winds, but it will never collapse under falsehood"',
      '"When the music changes, the wise dancer must change his steps even if it means stealing"',
      '"A quiet tongue gathers no enemies in the marketplace of fools"',
      '"Money answers all questions in Lagos, so do not fight those with deep pockets"'
    ],
    correctAnswer: 0,
    explanation: 'Funke reminds Mr. Bepo that righteousness has staying power, assuring him that upholding truth will eventually vindicate him even if the immediate road is difficult.'
  },
  {
    id: 'lh-q-014',
    subject: 'english',
    subjectName: 'English Language',
    year: 2025,
    questionNumber: 14,
    topic: 'The Lekki Headmaster - Chapter 3: Counsel by the Evening Hearth',
    question: 'What concern does Mr. Bepo express to his wife regarding the impact of digital gadgets on the school children?',
    options: [
      'Unrestricted smartphones and tablets are replacing reading culture with superficial entertainment and moral numbness',
      'The children are using computers to hack into the central bank accounts',
      'The school wi-fi network is consuming too much electricity',
      'Parents are refusing to purchase tablets for classroom digital assignments'
    ],
    correctAnswer: 0,
    explanation: 'Mr. Bepo laments that modern parents provide their young children with unrestricted smart gadgets as substitutes for parenting, fostering short attention spans and ethical apathy.'
  },

  // Chapter 4: The Examination Hall Incident
  {
    id: 'lh-q-015',
    subject: 'english',
    subjectName: 'English Language',
    year: 2025,
    questionNumber: 15,
    topic: 'The Lekki Headmaster - Chapter 4: The Examination Hall Incident',
    question: 'What critical incident occurs in Chapter 4 during the promotional examinations at Stardom Schools?',
    options: [
      'Chief Adeleke’s son is caught red-handed with unauthorized examination materials and smart devices in the hall',
      'A fire outbreak destroys the science laboratories and question papers',
      'External invigilators from the ministry boycott the examination due to delayed stipends',
      'The students stage a walkout protesting the difficulty of the mathematics paper'
    ],
    correctAnswer: 0,
    explanation: 'The climax begins when Chief Adeleke\'s son is apprehended with smuggled answers and a smartwatch during the promotional examination, setting off an institutional crisis.'
  },
  {
    id: 'lh-q-016',
    subject: 'english',
    subjectName: 'English Language',
    year: 2025,
    questionNumber: 16,
    topic: 'The Lekki Headmaster - Chapter 4: The Examination Hall Incident',
    question: 'How does the invigilating teacher, Miss Sandra, conduct herself when she discovers the examination malpractice?',
    options: [
      'She bravely confiscates the cheating materials and logs the incident despite aggressive intimidation from the student',
      'She immediately accepts a monetary bribe to look the other way',
      'She ignores the infraction because the student\'s father is on the school board',
      'She tears up the question paper and flees the examination hall in tears'
    ],
    correctAnswer: 0,
    explanation: 'Inspired by Mr. Bepo\'s uncompromising leadership, Miss Sandra stands her ground, retrieves the incriminating evidence, and submits a formal incident report.'
  },
  {
    id: 'lh-q-017',
    subject: 'english',
    subjectName: 'English Language',
    year: 2025,
    questionNumber: 17,
    topic: 'The Lekki Headmaster - Chapter 4: The Examination Hall Incident',
    question: 'What immediate step does Mr. Bepo take upon receiving the documented report of the examination malpractice?',
    options: [
      'He upholds the standard examination code by nullifying the affected paper and summoning the disciplinary committee',
      'He shreds the report and warns Miss Sandra never to report a board member\'s child again',
      'He calls the press to announce an immediate scandal on national television',
      'He demands a private meeting at Chief Adeleke\'s mansion to negotiate settlement'
    ],
    correctAnswer: 0,
    explanation: 'True to his code of ethics, Mr. Bepo enforces statutory school examination regulations without fear or favor, referring the matter to the Disciplinary Committee.'
  },
  {
    id: 'lh-q-018',
    subject: 'english',
    subjectName: 'English Language',
    year: 2025,
    questionNumber: 18,
    topic: 'The Lekki Headmaster - Chapter 4: The Examination Hall Incident',
    question: 'How does Chief Adeleke react upon learning that his son has been implicated in examination malpractice?',
    options: [
      'He storms the school in uncontrolled rage, threatening to withdraw his patronage and close down the institution',
      'He humbly apologizes to the teachers and grounds his son for the rest of the holiday',
      'He writes an open letter of commendation to Miss Sandra for catching his son in time',
      'He transfers his son to a federal government college that very afternoon'
    ],
    correctAnswer: 0,
    explanation: 'Chief Adeleke exhibits classic parental entitlement: instead of correcting his wayward son, he storms Stardom Schools, shouting threats and boasting of his political and financial connections.'
  },

  // Chapter 5: The Trial of Truth and Community Awakening
  {
    id: 'lh-q-019',
    subject: 'english',
    subjectName: 'English Language',
    year: 2025,
    questionNumber: 19,
    topic: 'The Lekki Headmaster - Chapter 5: The Trial of Truth',
    question: 'What intense confrontation takes place during the emergency disciplinary panel meeting in Chapter 5?',
    options: [
      'Mrs. Savage attempts to whitewash the incident as a "misunderstanding", but Mr. Bepo tables clear forensic evidence',
      'Chief Adeleke physically assaults the school security guards in front of students',
      'The teachers stage an indefinite strike demanding triple salary increases',
      'The Ministry of Education closes the school permanently'
    ],
    correctAnswer: 0,
    explanation: 'During the disciplinary panel, Mrs. Savage seeks an expedient compromise to placate Chief Adeleke, but Mr. Bepo methodically presents the confiscated smartwatch and handwritten cheat sheets.'
  },
  {
    id: 'lh-q-020',
    subject: 'english',
    subjectName: 'English Language',
    year: 2025,
    questionNumber: 20,
    topic: 'The Lekki Headmaster - Chapter 5: The Trial of Truth',
    question: 'How does the Stardom Schools PTA (Parents and Teachers Association) react when news of the crisis spreads?',
    options: [
      'A coalition of conscientious parents steps forward to vigorously defend Mr. Bepo and demand strict discipline',
      'All parents unanimously vote to expel Mr. Bepo from Lagos State',
      'The parents demand that exams be banned in the school entirely',
      'The association disbands itself and transfers all funds to Chief Adeleke\'s company'
    ],
    correctAnswer: 0,
    explanation: 'The crisis sparks a moral awakening among ordinary, upright parents who speak out against the toxic culture of entitlement and openly back Mr. Bepo.'
  },
  {
    id: 'lh-q-021',
    subject: 'english',
    subjectName: 'English Language',
    year: 2025,
    questionNumber: 21,
    topic: 'The Lekki Headmaster - Chapter 5: The Trial of Truth',
    question: 'What psychological effect does the confrontation have on Chief Adeleke’s son himself?',
    options: [
      'Stripped of his arrogant swagger, he experiences genuine shame and begins to understand the destructive nature of deception',
      'He becomes hardened and forms a secret society within the school',
      'He immediately buys a new sports car to mock his classmates',
      'He runs away from home to live abroad permanently'
    ],
    correctAnswer: 0,
    explanation: 'Seeing the dignity with which Mr. Bepo handles the crisis breaks the boy\'s superficial facade, awakening genuine remorse for embarrassing his school and family.'
  },

  // Chapter 6: The Harvest of Honor
  {
    id: 'lh-q-022',
    subject: 'english',
    subjectName: 'English Language',
    year: 2025,
    questionNumber: 22,
    topic: 'The Lekki Headmaster - Chapter 6: The Harvest of Honor',
    question: 'How does the novel conclude at the annual Valedictory and Prize-Giving Ceremony in Chapter 6?',
    options: [
      'Mr. Bepo is publicly honored by the board and community for saving the institution\'s soul, and the school adopts stricter ethical guidelines',
      'Stardom Schools is bankrupt and shut down by the Lagos State Ministry of Education',
      'Mr. Bepo is fired and replaced by Chief Adeleke\'s personal secretary',
      'Mrs. Savage sells Stardom Schools to a foreign oil consortium'
    ],
    correctAnswer: 0,
    explanation: 'The novel ends on a triumphant note of vindication: truth and moral courage prevail over commercial expediency, establishing Stardom Schools as a true center of character and learning.'
  },
  {
    id: 'lh-q-023',
    subject: 'english',
    subjectName: 'English Language',
    year: 2025,
    questionNumber: 23,
    topic: 'The Lekki Headmaster - Chapter 6: The Harvest of Honor',
    question: 'What unexpected gesture does Chief Adeleke make during the grand valedictory ceremony?',
    options: [
      'He publicly apologizes to Mr. Bepo and donates a substantial endowment fund dedicated to teacher training and ethical education',
      'He stages an armed protest outside the school auditorium gates',
      'He demands a full refund of all school fees paid over the previous six years',
      'He refuses to allow any member of his family to enter the hall'
    ],
    correctAnswer: 0,
    explanation: 'In a moment of profound repentance and transformation, Chief Adeleke acknowledges his grave error, thanking Mr. Bepo for saving his son from a lifetime of moral delinquency.'
  },
  {
    id: 'lh-q-024',
    subject: 'english',
    subjectName: 'English Language',
    year: 2025,
    questionNumber: 24,
    topic: 'The Lekki Headmaster - Chapter 6: The Harvest of Honor',
    question: 'What central message does author Kabir Alabi Garba leave with candidates preparing for the UTME?',
    options: [
      'True education is the transformation of character and conscience, not the acquisition of unearned certificates or superficial status',
      'Wealthy individuals will always dictate the morals of society regardless of laws',
      'Teaching is an unrewarding profession that should be avoided by ambitious youths',
      'Passing examinations through shortcuts is acceptable as long as one is not caught'
    ],
    correctAnswer: 0,
    explanation: 'The thematic heartbeat of "The Lekki Headmaster" is that authentic societal progress requires principled men and women who value honesty and character above fleeting material advantage.'
  },

  // Literary Devices, Lexis & Contextual Questions (Lekki Headmaster)
  {
    id: 'lh-q-025',
    subject: 'english',
    subjectName: 'English Language',
    year: 2025,
    questionNumber: 25,
    topic: 'The Lekki Headmaster - Literary Devices & Themes',
    question: 'The name of the institution, "Stardom Schools", serves what literary function in the novel?',
    options: [
      'Dramatic irony and satire, highlighting the contradiction between the pursuit of flashy celebrity and substantive moral discipline',
      'Hyperbole emphasizing the extraterrestrial origin of the curriculum',
      'Metonymy representing the government\'s national space agency',
      'An oxymoron contrasting the daytime assembly with night lessons'
    ],
    correctAnswer: 0,
    explanation: '"Stardom Schools" embodies satirical irony: while the name caters to parents desiring glamorous prestige, Mr. Bepo insists on the difficult, unglamorous groundwork of character building.'
  },
  {
    id: 'lh-q-026',
    subject: 'english',
    subjectName: 'English Language',
    year: 2025,
    questionNumber: 26,
    topic: 'The Lekki Headmaster - Character Analysis',
    question: 'Which of the following character traits best summarizes Mr. Bepo throughout the narrative?',
    options: [
      'Incorruptible, empathetic, articulate, and steadfastly principled',
      'Timid, indecisive, materialistic, and authoritarian',
      'Cynical, vengeful, reclusive, and rebellious',
      'Ostentatious, ambitious, manipulative, and sycophantic'
    ],
    correctAnswer: 0,
    explanation: 'Mr. Bepo is depicted as an exemplary protagonist: courageous in the face of intimidation, compassionate toward children, eloquent, and morally incorruptible.'
  },
  {
    id: 'lh-q-027',
    subject: 'english',
    subjectName: 'English Language',
    year: 2025,
    questionNumber: 27,
    topic: 'The Lekki Headmaster - Vocabulary & Lexis',
    question: 'In the sentence from Chapter 2: "Mrs. Savage viewed the headmaster\'s moral stance as an unaffordable luxury in an era of cut-throat educational competition", the expression "cut-throat" means:',
    options: [
      'Fierce, ruthless, and intensely aggressive',
      'Literally involving knives and physical combat',
      'Subsidized and funded by government agencies',
      'Careless, sluggish, and unorganized'
    ],
    correctAnswer: 0,
    explanation: '"Cut-throat" is an idiomatic adjective signifying ferocious, ruthless rivalry where competitors will do anything to survive.'
  },
  {
    id: 'lh-q-028',
    subject: 'english',
    subjectName: 'English Language',
    year: 2025,
    questionNumber: 28,
    topic: 'The Lekki Headmaster - Vocabulary & Lexis',
    question: 'When the narrator remarks that Chief Adeleke\'s demeanor was "suffused with haughty condescension", what does "haughty" mean?',
    options: [
      'Arrogantly superior, disdainful, and proud',
      'Deeply sorrowful and crying profusely',
      'Extremely nervous and trembling with fright',
      'Generous, welcoming, and hospitable'
    ],
    correctAnswer: 0,
    explanation: '"Haughty" denotes blatant arrogance, an attitude of superiority, and contempt toward others considered inferior.'
  },
  {
    id: 'lh-q-029',
    subject: 'english',
    subjectName: 'English Language',
    year: 2025,
    questionNumber: 29,
    topic: 'The Lekki Headmaster - Social Setting',
    question: 'Why did author Kabir Alabi Garba choose "Lekki" as the primary geographical setting for the novel?',
    options: [
      'Because Lekki represents modern Nigeria’s upscale commercial elite, perfectly encapsulating the tension between newfound wealth and traditional values',
      'Because Lekki is the only local government area where English is spoken in Nigeria',
      'Because all registered private schools in Lagos State are located on the Lekki peninsula',
      'Because the Ministry of Education has its headquarters stationed in Lekki'
    ],
    correctAnswer: 0,
    explanation: 'Lekki serves as a powerful microcosm of rapid urban gentrification, conspicuous consumption, and nouveau-riche lifestyle contradictions in Nigeria.'
  },
  {
    id: 'lh-q-030',
    subject: 'english',
    subjectName: 'English Language',
    year: 2025,
    questionNumber: 30,
    topic: 'The Lekki Headmaster - Themes',
    question: 'Which of the following is NOT a major theme explored in "The Lekki Headmaster"?',
    options: [
      'The triumph of military dictatorship over democratic governance',
      'Parental indulgence and the outsourcing of moral discipline to schools',
      'The welfare, economic challenges, and social respect owed to schoolteachers',
      'The commercialization of education versus authentic academic integrity'
    ],
    correctAnswer: 0,
    explanation: 'Military dictatorship is completely absent from the novel\'s thematic structure; the narrative focuses entirely on educational ethics, parenting, teacher welfare, and social class.'
  },
  {
    id: 'lh-q-031',
    subject: 'english',
    subjectName: 'English Language',
    year: 2025,
    questionNumber: 31,
    topic: 'The Lekki Headmaster - Character Analysis',
    question: 'In the novel, Mr. Ojo and Miss Sandra are used by the author to represent which segment of Nigerian society?',
    options: [
      'The dedicated, hardworking teaching workforce who persevere despite economic hardship and transportation challenges',
      'Corrupt school administrators who sell examination papers for quick profit',
      'Wealthy investors seeking to open private tutorial centers in Lekki',
      'Expatriate consultants hired by the Lagos State Ministry of Education'
    ],
    correctAnswer: 0,
    explanation: 'Mr. Ojo and Miss Sandra embody the unsung heroes of education: teachers who travel long distances every morning from the mainland to Lekki, faithfully teaching with diligence.'
  },
  {
    id: 'lh-q-032',
    subject: 'english',
    subjectName: 'English Language',
    year: 2025,
    questionNumber: 32,
    topic: 'The Lekki Headmaster - Chapter 1: The Morning Assembly',
    question: 'What was the immediate reaction of the students when Mr. Bepo ordered the school gates closed at exactly 7:45 AM?',
    options: [
      'Disbelief and murmurings from late-coming students used to special privileges, followed by orderly compliance',
      'An immediate riot that broke the school fence',
      'The security guards refused to obey the headmaster\'s directive',
      'The proprietress immediately arrived and unlocked the gate personally'
    ],
    correctAnswer: 0,
    explanation: 'The students, particularly those accustomed to arriving late without consequence, were stunned by Mr. Bepo\'s uncompromising promptness, realizing that a new era of discipline had arrived.'
  },
  {
    id: 'lh-q-033',
    subject: 'english',
    subjectName: 'English Language',
    year: 2025,
    questionNumber: 33,
    topic: 'The Lekki Headmaster - Chapter 2: The Proprietress\'s Ledger',
    question: 'In Chapter 2, what euphemism did Mrs. Savage employ when describing the alteration of grades for influential parents\' children?',
    options: [
      '"Administrative harmonization of continuous assessment scores"',
      '"Executive examination pardon"',
      '"National academic equalization"',
      '"Tuition-based merit enhancement"'
    ],
    correctAnswer: 0,
    explanation: 'Mrs. Savage cloaked unethical grade inflation in corporate jargon, referring to it as "administrative harmonization", which Mr. Bepo flatly rejected as institutionalized deceit.'
  },
  {
    id: 'lh-q-034',
    subject: 'english',
    subjectName: 'English Language',
    year: 2025,
    questionNumber: 34,
    topic: 'The Lekki Headmaster - Chapter 3: Counsel by the Evening Hearth',
    question: 'What book was Mr. Bepo observed reading during his quiet reflection in Chapter 3?',
    options: [
      'Biographies of classic African educational reformers and moral philosophers',
      'A luxury real estate catalogue for beachfront plots in Epe',
      'A manual on foreign stock market trading',
      'A gossip magazine detailing Lagos celebrity socialites'
    ],
    correctAnswer: 0,
    explanation: 'Mr. Bepo is portrayed as a thoughtful scholar who draws strength and inspiration from the lives and writings of principled African educators and philosophers.'
  },
  {
    id: 'lh-q-035',
    subject: 'english',
    subjectName: 'English Language',
    year: 2025,
    questionNumber: 35,
    topic: 'The Lekki Headmaster - Chapter 4: The Examination Hall Incident',
    question: 'What specific electronic device was retrieved from Chief Adeleke’s son in the examination hall?',
    options: [
      'A programmable smartwatch pre-loaded with comprehensive subject summaries and answers',
      'A laptop connected to the school satellite link',
      'A handheld walkie-talkie transmitting answers from a car outside',
      'A wireless earpiece hidden in a headband'
    ],
    correctAnswer: 0,
    explanation: 'The student utilized a modern smartwatch containing pre-saved answers, illustrating how digital technology is often subverted for examination malpractice.'
  },
  {
    id: 'lh-q-036',
    subject: 'english',
    subjectName: 'English Language',
    year: 2025,
    questionNumber: 36,
    topic: 'The Lekki Headmaster - Chapter 5: The Trial of Truth',
    question: 'During the disciplinary hearing, what argument did Chief Adeleke advance to excuse his son’s misconduct?',
    options: [
      'That modern education focuses too much on memorization and his son was merely using digital aids like modern executives do',
      'That the examination questions were stolen from another school',
      'That his son was suffering from temporary amnesia',
      'That the invigilating teacher planted the device to frame his family'
    ],
    correctAnswer: 0,
    explanation: 'Chief Adeleke attempted to rationalize the blatant malpractice by claiming digital access is standard modern executive practice, demonstrating a distorted moral compass.'
  },
  {
    id: 'lh-q-037',
    subject: 'english',
    subjectName: 'English Language',
    year: 2025,
    questionNumber: 37,
    topic: 'The Lekki Headmaster - Chapter 6: The Harvest of Honor',
    question: 'What permanent policy change was instituted at Stardom Schools following the resolution of the crisis?',
    options: [
      'A zero-tolerance code of academic integrity and an independent disciplinary oversight council including respected community elders',
      'The complete cancellation of all end-of-term examinations',
      'Allowing students to bring open textbooks and laptops into all examination halls',
      'The termination of all Nigerian teaching staff contracts'
    ],
    correctAnswer: 0,
    explanation: 'The crisis led Stardom Schools to formalize an ironclad integrity policy, establishing an independent board to safeguard academic standards from commercial interference.'
  },
  {
    id: 'lh-q-038',
    subject: 'english',
    subjectName: 'English Language',
    year: 2025,
    questionNumber: 38,
    topic: 'The Lekki Headmaster - Vocabulary & Idioms',
    question: 'In the passage: "Mr. Bepo refused to play second fiddle to commercial expediency", what does the idiom "play second fiddle" mean?',
    options: [
      'To take a subordinate or inferior position to something else',
      'To perform classical violin music in an orchestra',
      'To deceive people using false promises',
      'To abandon one’s professional career'
    ],
    correctAnswer: 0,
    explanation: '"To play second fiddle" is an English idiom meaning to occupy a secondary, subservient, or less important role.'
  },
  {
    id: 'lh-q-039',
    subject: 'english',
    subjectName: 'English Language',
    year: 2025,
    questionNumber: 39,
    topic: 'The Lekki Headmaster - Lexis & Structure',
    question: 'Choose the option nearest in meaning to the underlined word: "The proprietress was visibly *flabbergasted* by the headmaster’s unbending refusal."',
    options: [
      'Astonished and utterly bewildered',
      'Delighted and ecstatic',
      'Exhausted and sleepy',
      'Relieved and unconcerned'
    ],
    correctAnswer: 0,
    explanation: '"Flabbergasted" means overcome with astonishment and bewilderment; completely shocked.'
  },
  {
    id: 'lh-q-040',
    subject: 'english',
    subjectName: 'English Language',
    year: 2025,
    questionNumber: 40,
    topic: 'The Lekki Headmaster - Literary Appreciation',
    question: 'The author’s portrayal of Mrs. Funke Bepo exemplifies which narrative archetype?',
    options: [
      'The wise and supportive confidante whose moral clarity strengthens the protagonist',
      'The tragic heroine doomed to early demise',
      'The treacherous betrayer who secretly aids the antagonist',
      'The eccentric comic relief character'
    ],
    correctAnswer: 0,
    explanation: 'Mrs. Funke Bepo functions as the classic archetypal wise confidante, offering discerning counsel and steady moral support throughout the story.'
  }
];

export const LIFE_CHANGER_STORED_QUESTIONS: JambQuestion[] = [
  // Chapter 1: Omar’s Admission & The Family Gathering
  {
    id: 'lc-q-001',
    subject: 'english',
    subjectName: 'English Language',
    year: 2024,
    questionNumber: 1,
    topic: 'The Life Changer - Chapter 1: Omar\'s Admission',
    question: 'In "The Life Changer" by Khadija Abubakar Jalli, what course of study did Omar gain admission to study at Kongo Campus, Ahmadu Bello University?',
    options: [
      'Law',
      'Medicine and Surgery',
      'Accounting',
      'Mass Communication'
    ],
    correctAnswer: 0,
    explanation: 'Omar excitedly shared with his mother Ummi and sisters that he had been offered admission to study Law at Ahmadu Bello University (Zaria).'
  },
  {
    id: 'lc-q-002',
    subject: 'english',
    subjectName: 'English Language',
    year: 2024,
    questionNumber: 2,
    topic: 'The Life Changer - Chapter 1: Omar\'s Admission',
    question: 'What score did Omar achieve in his Unified Tertiary Matriculation Examination (UTME)?',
    options: [
      '230',
      '250',
      '210',
      '280'
    ],
    correctAnswer: 0,
    explanation: 'Omar proudly revealed that he scored 230 in his JAMB examination, in addition to five credits in his SSCE including English and Literature.'
  },
  {
    id: 'lc-q-003',
    subject: 'english',
    subjectName: 'English Language',
    year: 2024,
    questionNumber: 3,
    topic: 'The Life Changer - Chapter 1: Omar\'s Admission',
    question: 'Who was the youngest member of Ummi’s family who engaged in playful banter about French lessons?',
    options: [
      'Bintu',
      'Jamila',
      'Teemah',
      'Salma'
    ],
    correctAnswer: 0,
    explanation: 'Bintu, the youngest child, was explaining French vocabulary she had learned in primary school, which prompted the family conversation.'
  },

  // Chapter 2: The Tale of Lafayette & The Stranger
  {
    id: 'lc-q-004',
    subject: 'english',
    subjectName: 'English Language',
    year: 2024,
    questionNumber: 4,
    topic: 'The Life Changer - Chapter 2: Tale of Lafayette',
    question: 'In the folktale narrated by Ummi in Chapter 2, why was Lafayette notorious in the village?',
    options: [
      'He was proud, stubborn, and stubbornly refused to greet elders in accordance with tradition',
      'He was an armed bandit who robbed merchants along the trade routes',
      'He refused to pay community farm taxes to the district head',
      'He ran away from home to join a traveling circus'
    ],
    correctAnswer: 0,
    explanation: 'Lafayette was known throughout the village for his extreme insolence and refusal to exchange customary greetings with community elders.'
  },
  {
    id: 'lc-q-005',
    subject: 'english',
    subjectName: 'English Language',
    year: 2024,
    questionNumber: 5,
    topic: 'The Life Changer - Chapter 2: Tale of Lafayette',
    question: 'What lesson did the village Hakimi (head) teach the community through the stranger\'s visit?',
    options: [
      'That respect, courtesy, and good neighborliness are foundational to human society',
      'That strangers should never be welcomed into a village without payment',
      'That young men should avoid traveling at night',
      'That traditional rulers must govern through fear and strict punishment'
    ],
    correctAnswer: 0,
    explanation: 'The Hakimi used the encounter to demonstrate the importance of humility, respect for elders, and communal solidarity.'
  },

  // Chapter 3: Ummi’s Matriculation
  {
    id: 'lc-q-006',
    subject: 'english',
    subjectName: 'English Language',
    year: 2024,
    questionNumber: 6,
    topic: 'The Life Changer - Chapter 3: Ummi\'s Matriculation',
    question: 'During her university registration, what mistaken assumption did Ummi make about the quiet official she met?',
    options: [
      'She assumed he was an arrogant junior clerk, not realizing he was the University Registrar and her future husband',
      'She thought he was an undercover security operative tracking student cultists',
      'She mistook him for a freshman looking for the lecture theater',
      'She assumed he did not understand Hausa or English'
    ],
    correctAnswer: 0,
    explanation: 'Ummi mistook the calm, unassuming man in the registry for a difficult clerk, only to discover he was a high-ranking official who later became her husband.'
  },

  // Chapter 4: Salma’s Arrival & Queen Amina Hall
  {
    id: 'lc-q-007',
    subject: 'english',
    subjectName: 'English Language',
    year: 2024,
    questionNumber: 7,
    topic: 'The Life Changer - Chapter 4: Salma and Queen Amina Hall',
    question: 'In Chapter 4, which hall of residence was Salma allocated at the university?',
    options: [
      'Queen Amina Hall',
      'Ribadu Hall',
      'Alexander Hall',
      'Suleiman Hall'
    ],
    correctAnswer: 0,
    explanation: 'Salma was allocated a room in Queen Amina Hall, the premier female hostel at Ahmadu Bello University.'
  },
  {
    id: 'lc-q-008',
    subject: 'english',
    subjectName: 'English Language',
    year: 2024,
    questionNumber: 8,
    topic: 'The Life Changer - Chapter 4: Salma and Queen Amina Hall',
    question: 'Salma’s three roommates in Queen Amina Hall — Tomiwa, Ngozi, and Ada — came from which respective geopolitical regions?',
    options: [
      'Ibadan (South-West), Imo (South-East), and Benue (Middle Belt)',
      'Lagos (South-West), Enugu (South-East), and Kano (North-West)',
      'Ogun (South-West), Delta (South-South), and Borno (North-East)',
      'Osun (South-West), Anambra (South-East), and Sokoto (North-West)'
    ],
    correctAnswer: 0,
    explanation: 'The roommates represented Nigeria\'s rich diversity: Tomiwa from Ibadan (Oyo State), Ngozi from Imo State, and Ada from Benue State.'
  },
  {
    id: 'lc-q-009',
    subject: 'english',
    subjectName: 'English Language',
    year: 2024,
    questionNumber: 9,
    topic: 'The Life Changer - Chapter 4: Salma and Queen Amina Hall',
    question: 'How did the four roommates maintain harmony despite their diverse ethnic and religious backgrounds?',
    options: [
      'Through mutual respect, sharing food and chores, and celebrating their common humanity as Nigerian students',
      'By signing a legal contract drawn up by the Student Union government',
      'By cooking and eating completely separate meals in isolation',
      'By speaking only in English and avoiding any discussion of home life'
    ],
    correctAnswer: 0,
    explanation: 'Their room became a model of national unity: they shared meals, supported each other\'s studies, and respected their cultural differences.'
  },

  // Chapter 5: The Car Ride & Politics of Deception
  {
    id: 'lc-q-010',
    subject: 'english',
    subjectName: 'English Language',
    year: 2024,
    questionNumber: 10,
    topic: 'The Life Changer - Chapter 5: The Car Ride',
    question: 'When Salma entered the luxury car outside the campus gate, whom did she meet inside?',
    options: [
      'Labaran and Habib',
      'Kabir and Dr. Sam-Kabir',
      'Omar and the Registrar',
      'Hakimi and Lafayette'
    ],
    correctAnswer: 0,
    explanation: 'Salma accepted a lift from two men, Labaran (the driver) and Habib, a wealthy politician, beginning her entanglements with luxury.'
  },
  {
    id: 'lc-q-011',
    subject: 'english',
    subjectName: 'English Language',
    year: 2024,
    questionNumber: 11,
    topic: 'The Life Changer - Chapter 5: The Car Ride',
    question: 'Why did Salma give Tomiwa’s phone number to Habib instead of her own?',
    options: [
      'Out of vanity and pretension, wishing to act aloof and uninterested',
      'Her own phone battery had completely died during the journey',
      'Tomiwa had specifically asked her to find a wealthy suitor for her',
      'She gave a random string of numbers that happened to match Tomiwa\'s phone'
    ],
    correctAnswer: 0,
    explanation: 'In an act of haughty pretension, Salma gave Tomiwa\'s phone number to test Habib\'s persistence, leading to unexpected romantic developments between Tomiwa and Habib.'
  },

  // Chapter 6: Kabir’s Shady Dealings
  {
    id: 'lc-q-012',
    subject: 'english',
    subjectName: 'English Language',
    year: 2024,
    questionNumber: 12,
    topic: 'The Life Changer - Chapter 6: Kabir\'s Dealings',
    question: 'Who was Kabir in the novel and what illegal scheme did he run?',
    options: [
      'A corrupt trickster who masqueraded as a university official to extort money from desperate students',
      'A drug dealer operating inside Queen Amina Hall',
      'A counterfeit currency manufacturer in Kaduna',
      'An armed robber who terrorized the Kongo campus bank'
    ],
    correctAnswer: 0,
    explanation: 'Kabir was a fraudulent con-artist who exploited naive students by claiming he had backstage access to grades, exam papers, and university administrators.'
  },

  // Chapter 7: The Moral Philosophy Exam Malpractice
  {
    id: 'lc-q-013',
    subject: 'english',
    subjectName: 'English Language',
    year: 2024,
    questionNumber: 13,
    topic: 'The Life Changer - Chapter 7: The Exam Hall',
    question: 'What course examination was Salma writing when she was caught with smuggled cheat notes?',
    options: [
      'Moral Philosophy (General Studies)',
      'Introduction to Nigerian Law',
      'Macroeconomics',
      'French for Beginners'
    ],
    correctAnswer: 0,
    explanation: 'In a deeply ironic twist, Salma was caught cheating during an examination in "Moral Philosophy", a course specifically designed to teach ethics and integrity.'
  },
  {
    id: 'lc-q-014',
    subject: 'english',
    subjectName: 'English Language',
    year: 2024,
    questionNumber: 14,
    topic: 'The Life Changer - Chapter 7: The Exam Hall',
    question: 'The fact that Salma cheated in a "Moral Philosophy" examination illustrates which literary technique?',
    options: [
      'Situational irony',
      'Hyperbole',
      'Onomatopoeia',
      'Synecdoche'
    ],
    correctAnswer: 0,
    explanation: 'Situational irony occurs when the outcome is diametrically opposed to what is expected: cheating in an ethics/moral philosophy test.'
  },

  // Chapter 8 & 9: The Expulsion and Redemption
  {
    id: 'lc-q-015',
    subject: 'english',
    subjectName: 'English Language',
    year: 2024,
    questionNumber: 15,
    topic: 'The Life Changer - Chapter 8: The Committee Trial',
    question: 'What verdict did the Examination Malpractice Committee (EMDC) hand down to Salma?',
    options: [
      'Expulsion from the university',
      'A one-semester academic suspension',
      'A written reprimand and deduction of five marks',
      'Re-writing the exam in the next academic session'
    ],
    correctAnswer: 0,
    explanation: 'Because cheating was proven with incontrovertible evidence, the committee recommended and enforced Salma\'s outright expulsion.'
  },
  {
    id: 'lc-q-016',
    subject: 'english',
    subjectName: 'English Language',
    year: 2024,
    questionNumber: 16,
    topic: 'The Life Changer - Chapter 9: Redemption',
    question: 'Following the death of her father and her university expulsion, how did Salma transform her life?',
    options: [
      'She adopted deep remorse, humble repentance, modest dressing, and devoted herself to moral uprightness',
      'She joined a gang of cybercriminals in Abuja',
      'She left Nigeria permanently to live in London without informing her family',
      'She sued the university administration at the Federal High Court'
    ],
    correctAnswer: 0,
    explanation: 'The harsh consequences of her vanity, coupled with the loss of her father, led Salma to profound repentance and spiritual renewal, making her a "changed" person.'
  },
  {
    id: 'lc-q-017',
    subject: 'english',
    subjectName: 'English Language',
    year: 2024,
    questionNumber: 17,
    topic: 'The Life Changer - Chapter 5: The Car Ride',
    question: 'What delicious gift did Habib purchase for the girls when Labaran drove them to a luxury eatery in Kaduna?',
    options: [
      'Barbecued meat (suya) and fresh fruit juices',
      'Continental Italian pizza and wine',
      'Imported chocolates and ice cream',
      'Traditional pounded yam and egusi soup'
    ],
    correctAnswer: 0,
    explanation: 'Habib bought generous parcels of suya and assorted refreshments, which Tomiwa enthusiastically accepted on behalf of the hostel room.'
  },
  {
    id: 'lc-q-018',
    subject: 'english',
    subjectName: 'English Language',
    year: 2024,
    questionNumber: 18,
    topic: 'The Life Changer - Chapter 8: The Committee Trial',
    question: 'Who was Dr. Sam-Kabir and how was he involved in Salma’s disciplinary crisis?',
    options: [
      'A university lecturer whom Kabir claimed was the committee chairman who could alter the verdict for a bribe',
      'The chief medical officer at the university clinic',
      'Salma\'s academic level adviser who pleaded on her behalf',
      'The Vice Chancellor of Ahmadu Bello University'
    ],
    correctAnswer: 0,
    explanation: 'Kabir swindled Salma by falsely claiming that a man named Dr. Sam-Kabir was the chairman of the Examination Malpractice Committee who needed money to squash the case.'
  },
  {
    id: 'lc-q-019',
    subject: 'english',
    subjectName: 'English Language',
    year: 2024,
    questionNumber: 19,
    topic: 'The Life Changer - General Themes',
    question: 'Why did author Khadija Abubakar Jalli title the novel "The Life Changer"?',
    options: [
      'Because university education represents a transformative, life-altering milestone that can either elevate or ruin a youth depending on personal choices',
      'Because Omar invented a life-changing software algorithm',
      'Because the Hakimi discovered gold deposits in the village',
      'Because Ummi became a famous motivational speaker'
    ],
    correctAnswer: 0,
    explanation: 'The title reflects the profound transition of entering tertiary institution: the newfound freedom changes one\'s life trajectory, for good or bad, based on character and discernment.'
  },
  {
    id: 'lc-q-020',
    subject: 'english',
    subjectName: 'English Language',
    year: 2024,
    questionNumber: 20,
    topic: 'The Life Changer - Character Analysis',
    question: 'Which of the following character pairings correctly depicts foil characters in "The Life Changer"?',
    options: [
      'Ummi’s grounded modesty versus Salma’s initial vanity and superficial ostentation',
      'Bintu versus Jamila',
      'Labaran versus the Hakimi',
      'Omar versus the University Registrar'
    ],
    correctAnswer: 0,
    explanation: 'Ummi (humble, respectful, disciplined) acts as a moral foil to the early Salma (haughty, deceptive, obsessed with prestige).'
  }
];

export const SECOND_CLASS_CITIZEN_QUESTIONS: JambQuestion[] = [
  {
    id: 'scc-q-001',
    subject: 'literature',
    subjectName: 'Literature in English',
    year: 2024,
    questionNumber: 1,
    topic: 'Second Class Citizen - Buchi Emecheta',
    question: 'In Buchi Emecheta’s "Second Class Citizen", what is Adah’s dream from childhood in Lagos and Ibuza?',
    options: [
      'To obtain a quality Western education and travel to the United Kingdom',
      'To become the market queen of Lagos island',
      'To marry a wealthy traditional chief in Ibuza',
      'To work as a merchant on commercial ships'
    ],
    correctAnswer: 0,
    explanation: 'Adah possessed an insatiable thirst for learning from childhood, dreaming of studying and traveling to the United Kingdom to achieve independence.'
  },
  {
    id: 'scc-q-002',
    subject: 'literature',
    subjectName: 'Literature in English',
    year: 2024,
    questionNumber: 2,
    topic: 'Second Class Citizen - Buchi Emecheta',
    question: 'Why did Adah marry Francis Obi before completing her education in Nigeria?',
    options: [
      'To secure an honorable home and freedom from the suffocating demands of her extended family',
      'Her father commanded her to marry him on his deathbed',
      'Francis was a wealthy lawyer who paid all her university tuition fees',
      'To inherit agricultural lands in Ibuza'
    ],
    correctAnswer: 0,
    explanation: 'In patriarchal colonial Nigeria, a single young woman was seen as property; Adah married Francis as a pragmatic pathway to living her own life.'
  },
  {
    id: 'scc-q-003',
    subject: 'literature',
    subjectName: 'Literature in English',
    year: 2024,
    questionNumber: 3,
    topic: 'Second Class Citizen - Buchi Emecheta',
    question: 'How did Adah finance Francis’s initial relocation to the United Kingdom to study accountancy?',
    options: [
      'Through her high-paying job as a senior library assistant at the American Consulate in Lagos',
      'Through bank loans secured with Francis\'s family land',
      'Her mother gave her a diamond necklace to sell',
      'Through a British colonial government scholarship'
    ],
    correctAnswer: 0,
    explanation: 'Adah earned a substantial salary at the American Consulate Library in Lagos, with which she funded Francis\'s passport, tickets, and initial London expenses.'
  },
  {
    id: 'scc-q-004',
    subject: 'literature',
    subjectName: 'Literature in English',
    year: 2024,
    questionNumber: 4,
    topic: 'Second Class Citizen - Buchi Emecheta',
    question: 'What shocking reality confronted Adah upon her arrival in London?',
    options: [
      'Harsh racial discrimination, deplorable living conditions, cold weather, and Francis’s degraded dignity',
      'Francis had built a luxury mansion in Kensington',
      'The British government immediately offered her free university admission',
      'All Nigerian immigrants were given high-paying civil service posts'
    ],
    correctAnswer: 0,
    explanation: 'Adah discovered that in post-war Britain, black immigrants were treated as "second-class citizens", forced into squalid housing in Chalk Farm and subjected to systemic racism.'
  },
  {
    id: 'scc-q-005',
    subject: 'literature',
    subjectName: 'Literature in English',
    year: 2024,
    questionNumber: 5,
    topic: 'Second Class Citizen - Buchi Emecheta',
    question: 'What heartless act of cruelty does Francis commit when Adah finishes writing her first manuscript, "The Bride Price"?',
    options: [
      'He burns the entire manuscript in the fireplace, declaring she will never be a writer',
      'He steals it and publishes it under his own name in London',
      'He sells it to a local publisher for fifty pounds',
      'He mails it to Adah\'s mother in Nigeria without telling her'
    ],
    correctAnswer: 0,
    explanation: 'Francis brutally burns Adah\'s manuscript out of spite and insecurity, cementing Adah\'s realization that their marriage is spiritually dead.'
  },
  {
    id: 'scc-q-006',
    subject: 'literature',
    subjectName: 'Literature in English',
    year: 2024,
    questionNumber: 6,
    topic: 'Second Class Citizen - Buchi Emecheta',
    question: 'How does Adah’s story conclude in "Second Class Citizen"?',
    options: [
      'She courageously leaves Francis with her children, resolved to build an independent life as a mother and author',
      'She reconciles with Francis and moves back to live as a traditional wife in Ibuza',
      'She is deported from Britain by the immigration department',
      'Francis passes his accounting exams and becomes an English judge'
    ],
    correctAnswer: 0,
    explanation: 'Adah claims her freedom, walking out of Francis\'s abusive control to raise her children alone and pursue her literary calling.'
  }
];

export const LION_AND_THE_JEWEL_QUESTIONS: JambQuestion[] = [
  {
    id: 'lj-q-001',
    subject: 'literature',
    subjectName: 'Literature in English',
    year: 2024,
    questionNumber: 1,
    topic: 'The Lion and the Jewel - Wole Soyinka',
    question: 'In Wole Soyinka’s "The Lion and the Jewel", why does Lakunle refuse to pay Sidi’s bride price?',
    options: [
      'He views the bride price as an uncivilized, archaic custom that equates women with cattle',
      'He is secretly bankrupt and has no money in his savings account',
      'Baroka has forbidden any teacher from marrying village maidens',
      'Sidi\'s father demands an astronomical sum of two thousand pounds'
    ],
    correctAnswer: 0,
    explanation: 'Lakunle, the self-proclaimed "modern" schoolteacher, pretentiously denounces bride price as a barbaric African tradition, failing to realize that to Sidi, bride price validates a woman\'s social worth.'
  },
  {
    id: 'lj-q-002',
    subject: 'literature',
    subjectName: 'Literature in English',
    year: 2024,
    questionNumber: 2,
    topic: 'The Lion and the Jewel - Wole Soyinka',
    question: 'What event turns Sidi’s head and inflates her vanity in the "Noon" section of the play?',
    options: [
      'A glossy magazine arrives from Lagos featuring her beautiful photographs on the cover, while Baroka appears in a small corner',
      'The Bale of Ilujinle appoints her as the minister of education',
      'Lakunle buys her a Western bridal gown from Ibadan',
      'She is crowned queen of the annual yam festival'
    ],
    correctAnswer: 0,
    explanation: 'The magazine images make Sidi believe she is far more famous and powerful than the aging Bale, leading her to boast that her fame outshines his.'
  },
  {
    id: 'lj-q-003',
    subject: 'literature',
    subjectName: 'Literature in English',
    year: 2024,
    questionNumber: 3,
    topic: 'The Lion and the Jewel - Wole Soyinka',
    question: 'What cunning trick does Baroka (The Bale) use to trap and conquer the haughty Sidi?',
    options: [
      'He feigns sexual impotence to his head wife Sadiku, knowing she will gleefully spread the gossip to Sidi',
      'He threatens to banish all teachers from Ilujinle village',
      'He sends armed warriors to kidnap Sidi from the village square',
      'He promises to build a modern railway line through the village'
    ],
    correctAnswer: 0,
    explanation: 'Baroka, the wily "Lion", feigns that his manhood has failed him. Knowing Sadiku will leak the secret, he draws Sidi into his palace where she visits to mock him, allowing him to seduce her.'
  },
  {
    id: 'lj-q-004',
    subject: 'literature',
    subjectName: 'Literature in English',
    year: 2024,
    questionNumber: 4,
    topic: 'The Lion and the Jewel - Wole Soyinka',
    question: 'Why does Sidi ultimately choose to marry the 62-year-old Baroka instead of the young schoolteacher Lakunle?',
    options: [
      'Baroka possesses authentic virility, cultural wisdom, and substance, whereas Lakunle is full of hollow words and superficial modern slogans',
      'Baroka threatens to execute her family if she refuses',
      'Lakunle leaves the village to study in London',
      'Sadiku forces her into the palace at spearpoint'
    ],
    correctAnswer: 0,
    explanation: 'Soyinka uses the resolution to show that rooted cultural vitality and substance (represented by Baroka) triumph over empty, alienating Western imitation (represented by Lakunle).'
  }
];

// Helper to extract chapter questions from novel collections
function extractNovelChapterQuestions(novel: any): JambQuestion[] {
  const result: JambQuestion[] = [];
  const seenIds = new Set<string>();

  if (novel.practiceQuestions) {
    novel.practiceQuestions.forEach((pq: any, idx: number) => {
      const qId = pq.id || `${novel.id}-pq-${idx + 1}`;
      if (!seenIds.has(qId)) {
        seenIds.add(qId);
        result.push({
          id: qId,
          subject: 'english',
          subjectName: 'English Language',
          year: 2025,
          questionNumber: idx + 1,
          topic: `${novel.title} - ${pq.topic || 'General Examination Focus'}`,
          question: pq.question,
          options: pq.options,
          correctAnswer: pq.correctAnswer,
          explanation: pq.explanation || `Key study point from ${novel.title}.`
        });
      }
    });
  }

  if (novel.chapters) {
    novel.chapters.forEach((ch: any) => {
      if (ch.questions) {
        ch.questions.forEach((cq: any, qIdx: number) => {
          const qId = cq.id || `${novel.id}-ch${ch.chapterNumber}-q${qIdx + 1}`;
          if (!seenIds.has(qId)) {
            seenIds.add(qId);
            result.push({
              id: qId,
              subject: 'english',
              subjectName: 'English Language',
              year: 2025,
              questionNumber: qIdx + 1,
              topic: `${novel.title} - Chapter ${ch.chapterNumber}: ${ch.title}`,
              question: cq.question,
              options: cq.options,
              correctAnswer: cq.correctAnswer,
              explanation: cq.explanation || `Study rationale from Chapter ${ch.chapterNumber} of ${novel.title}.`
            });
          }
        });
      }
    });
  }

  return result;
}

const LEKKI_CHAPTER_QUESTIONS = extractNovelChapterQuestions(LEKKI_HEADMASTER_NOVEL);
const LIFE_CHANGER_CHAPTER_QUESTIONS = extractNovelChapterQuestions(LIFE_CHANGER_NOVEL);

/**
 * Full combined stored questions for Lekki Headmaster (Bank + Chapters)
 */
export const LEKKI_HEADMASTER_ALL_QUESTIONS: JambQuestion[] = [
  ...LEKKI_HEADMASTER_STORED_QUESTIONS,
  ...LEKKI_CHAPTER_QUESTIONS.filter(cq => !LEKKI_HEADMASTER_STORED_QUESTIONS.some(sq => sq.id === cq.id))
];

/**
 * Full combined stored questions for The Life Changer (Bank + Chapters)
 */
export const LIFE_CHANGER_ALL_QUESTIONS: JambQuestion[] = [
  ...LIFE_CHANGER_STORED_QUESTIONS,
  ...LIFE_CHANGER_CHAPTER_QUESTIONS.filter(cq => !LIFE_CHANGER_STORED_QUESTIONS.some(sq => sq.id === cq.id))
];

/**
 * Combined high-yield stored question bank for all JAMB prescribed novels
 */
export const JAMB_NOVEL_QUESTIONS_BANK: JambQuestion[] = [
  ...LEKKI_HEADMASTER_ALL_QUESTIONS,
  ...LIFE_CHANGER_ALL_QUESTIONS,
  ...SECOND_CLASS_CITIZEN_QUESTIONS,
  ...LION_AND_THE_JEWEL_QUESTIONS
];

/**
 * Returns stored questions for a specified novel ID or title
 */
export function getStoredQuestionsForNovel(novelIdOrTitle: string): JambQuestion[] {
  const norm = (novelIdOrTitle || '').toLowerCase().trim();
  if (norm.includes('lekki') || norm.includes('headmaster')) {
    return LEKKI_HEADMASTER_ALL_QUESTIONS;
  }
  if (norm.includes('life') || norm.includes('changer')) {
    return LIFE_CHANGER_ALL_QUESTIONS;
  }
  if (norm.includes('second') || norm.includes('citizen') || norm.includes('emecheta')) {
    return SECOND_CLASS_CITIZEN_QUESTIONS;
  }
  if (norm.includes('lion') || norm.includes('jewel') || norm.includes('soyinka')) {
    return LION_AND_THE_JEWEL_QUESTIONS;
  }
  return JAMB_NOVEL_QUESTIONS_BANK;
}
