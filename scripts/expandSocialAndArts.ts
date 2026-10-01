import { writeQuestionsFile, Q } from './bankUtils';
import * as path from 'path';

import { SOCIAL_SCIENCES_EXPANDED } from '../src/data/jamb/socialSciencesQuestionsExpanded';
import { ARTS_SOCIAL_QUESTIONS } from '../src/data/jamb/artsSocialQuestions';
import { APPLIED_VOCATIONAL_EXPANDED } from '../src/data/jamb/appliedVocationalQuestionsExpanded';

const extraSocial: Q[] = [
  // ECONOMICS
  {
    id: 'jamb-ecn-2024-05',
    subject: 'economics',
    subjectName: 'Economics',
    year: 2024,
    questionNumber: 5,
    topic: 'Demand, Supply & Elasticity',
    question: 'If the price of a commodity falls from ₦200 to ₦150 and the quantity demanded increases from 50 units to 75 units, calculate the price elasticity of demand (PED).',
    options: ['2.0', '1.5', '0.5', '1.0'],
    correctAnswer: 0,
    explanation: '%ΔQ = (75 - 50)/50 × 100% = +50%. %ΔP = (150 - 200)/200 × 100% = -25%. PED = |%ΔQ / %ΔP| = 50 / 25 = 2.0 (elastic).'
  },
  {
    id: 'jamb-ecn-2024-06',
    subject: 'economics',
    subjectName: 'Economics',
    year: 2024,
    questionNumber: 6,
    topic: 'National Income Accounting & Inflation',
    question: 'Gross National Product (GNP) is obtained by adding _______ to Gross Domestic Product (GDP).',
    options: ['net property income from abroad', 'depreciation allowances', 'indirect business taxes', 'transfer payments'],
    correctAnswer: 0,
    explanation: 'GNP = GDP + Net Property Income from Abroad (NPIA), representing economic output attributable to permanent residents of the country.'
  },
  {
    id: 'jamb-ecn-2023-01',
    subject: 'economics',
    subjectName: 'Economics',
    year: 2023,
    questionNumber: 1,
    topic: 'Market Structures & Production Theory',
    question: 'A profit-maximizing firm in any market structure will expand output up to the level where _______',
    options: ['Marginal Revenue equals Marginal Cost (MR = MC)', 'Total Revenue equals Total Cost', 'Average Cost is at its minimum', 'Price equals Average Fixed Cost'],
    correctAnswer: 0,
    explanation: 'The universal condition for profit maximization across perfect competition, monopoly, and oligopoly is MR = MC.'
  },

  // GOVERNMENT
  {
    id: 'jamb-gov-2024-05',
    subject: 'government',
    subjectName: 'Government',
    year: 2024,
    questionNumber: 5,
    topic: 'Basic Concepts: Sovereignty, Power & Rule of Law',
    question: 'According to A.V. Dicey, the Rule of Law includes all the following EXCEPT _______',
    options: ['immunity of the executive from judicial scrutiny', 'supremacy of regular law over arbitrary power', 'equality before the law', 'predominance of legal spirit'],
    correctAnswer: 0,
    explanation: 'Dicey\'s rule of law insists on the supremacy of regular law, universal equality before ordinary courts, and the absence of arbitrary executive exemptions.'
  },
  {
    id: 'jamb-gov-2024-06',
    subject: 'government',
    subjectName: 'Government',
    year: 2024,
    questionNumber: 6,
    topic: 'Constitutional Developments in Nigeria',
    question: 'Which colonial constitution introduced the elective principle for the first time in Nigeria, enabling elected representatives in Lagos and Calabar?',
    options: ['Clifford Constitution of 1922', 'Richards Constitution of 1946', 'Macpherson Constitution of 1951', 'Lyttelton Constitution of 1954'],
    correctAnswer: 0,
    explanation: 'The 1922 Clifford Constitution created 4 elected seats in the Legislative Council (3 for Lagos, 1 for Calabar) based on property qualifications.'
  },
  {
    id: 'jamb-gov-2023-01',
    subject: 'government',
    subjectName: 'Government',
    year: 2023,
    questionNumber: 1,
    topic: 'Constitutional Developments in Nigeria',
    question: 'The constitution that formally established a federal structure of government with regional autonomy in Nigeria was the _______',
    options: ['Lyttelton Constitution of 1954', 'Macpherson Constitution of 1951', 'Richards Constitution of 1946', 'Independence Constitution of 1960'],
    correctAnswer: 0,
    explanation: 'The 1954 Lyttelton Constitution established federalism, dividing legislative powers into Exclusive (Federal), Concurrent (Both), and Residual (Regions).'
  },

  // COMMERCE
  {
    id: 'jamb-com-2024-01',
    subject: 'commerce',
    subjectName: 'Commerce',
    year: 2024,
    questionNumber: 1,
    topic: 'Trade & Commerce',
    question: 'Which of the following functions is performed exclusively by the wholesaler in the chain of distribution?',
    options: ['Breaking bulk and warehousing goods for retailers', 'Selling directly in small retail units to final consumers', 'Providing manufacturing raw materials', 'Enforcing government price control'],
    correctAnswer: 0,
    explanation: 'The wholesaler buys in large quantities from manufacturers, "breaks bulk", stores goods in warehouses, and distributes smaller lots to retailers.'
  },
  {
    id: 'jamb-com-2024-02',
    subject: 'commerce',
    subjectName: 'Commerce',
    year: 2024,
    questionNumber: 2,
    topic: 'Banking & Financial Markets',
    question: 'The Central Bank regulates money supply and credit expansion through all the following instruments EXCEPT _______',
    options: ['accepting retail deposits from individual household savers', 'Open Market Operations (OMO)', 'adjusting the Monetary Policy Rate (MPR)', 'Cash Reserve Ratio (CRR) mandates'],
    correctAnswer: 0,
    explanation: 'The Central Bank is a bankers\' bank and government regulator; it does not operate retail banking services for the general public.'
  },

  // PRINCIPLES OF ACCOUNTS
  {
    id: 'jamb-acc-2024-01',
    subject: 'accounts',
    subjectName: 'Principles of Accounts',
    year: 2024,
    questionNumber: 1,
    topic: 'Bookkeeping & Ledger Entries',
    question: 'According to the accounting equation, Capital is equal to _______',
    options: ['Assets minus Liabilities', 'Assets plus Liabilities', 'Liabilities minus Assets', 'Gross Profit plus Drawings'],
    correctAnswer: 0,
    explanation: 'The fundamental accounting equation is: Assets = Capital + Liabilities, which rearranges to Capital = Assets - Liabilities.'
  },
  {
    id: 'jamb-acc-2024-02',
    subject: 'accounts',
    subjectName: 'Principles of Accounts',
    year: 2024,
    questionNumber: 2,
    topic: 'Final Accounts & Balance Sheet',
    question: 'In financial statements, Carriage Outwards is treated as _______',
    options: ['an operating selling/distribution expense in the Profit & Loss Account', 'an addition to purchases in the Trading Account', 'a current asset in the Balance Sheet', 'a direct deduction from sales revenue'],
    correctAnswer: 0,
    explanation: 'Carriage inwards is added to cost of purchases in the Trading Account, whereas carriage outwards is a selling/distribution expense debited to the Profit and Loss Account.'
  },

  // CIVIC EDUCATION
  {
    id: 'jamb-civ-2024-01',
    subject: 'civic',
    subjectName: 'Civic Education',
    year: 2024,
    questionNumber: 1,
    topic: 'National Values & Citizen Rights',
    question: 'Chapter IV of the 1999 Constitution of the Federal Republic of Nigeria (as amended) guarantees _______',
    options: ['Fundamental Human Rights', 'Directive Principles of State Policy', 'Powers of the Federal Legislature', 'Establishment of Political Parties'],
    correctAnswer: 0,
    explanation: 'Chapter IV of the 1999 Nigerian Constitution contains provisions for fundamental human rights including right to life, dignity, personal liberty, and fair hearing.'
  },
  {
    id: 'jamb-civ-2024-02',
    subject: 'civic',
    subjectName: 'Civic Education',
    year: 2024,
    questionNumber: 2,
    topic: 'Democracy, Rule of Law & Electoral Process',
    question: 'The statutory body constitutionally responsible for registering voters and conducting federal elections in Nigeria is _______',
    options: ['Independent National Electoral Commission (INEC)', 'Federal Character Commission (FCC)', 'National Orientation Agency (NOA)', 'Code of Conduct Bureau (CCB)'],
    correctAnswer: 0,
    explanation: 'INEC is the independent constitutional umpire established under the Third Schedule of the 1999 Constitution to conduct federal and state elections in Nigeria.'
  },

  // GEOGRAPHY
  {
    id: 'jamb-geo-2024-01',
    subject: 'geography',
    subjectName: 'Geography',
    year: 2024,
    questionNumber: 1,
    topic: 'Physical Geography & Landforms',
    question: 'Ox-bow lakes and meander loops are characteristic landforms formed in which stage of a river\'s course?',
    options: ['Lower or old age stage', 'Upper or youth stage', 'Middle or mature stage alone', 'Source torrents'],
    correctAnswer: 0,
    explanation: 'Ox-bow lakes result from lateral erosion and subsequent neck deposition across meanders in the low-gradient lower/plain stage of a river.'
  },
  {
    id: 'jamb-geo-2024-02',
    subject: 'geography',
    subjectName: 'Geography',
    year: 2024,
    questionNumber: 2,
    topic: 'Climatology & Vegetation',
    question: 'The Inter-Tropical Convergence Zone (ITCZ) in West Africa is the boundary zone between _______',
    options: ['Tropical Maritime (mT) and Tropical Continental (cT) air masses', 'Equatorial Westerlies and Polar Easterlies', 'Trade winds and Mid-latitude depressions', 'Harmattan and Monsoon currents in winter alone'],
    correctAnswer: 0,
    explanation: 'The ITCZ marks the convergence between the moist, rain-bearing South-West Monsoon (mT air mass) and the dry, dust-laden North-East Trade wind (cT air mass).'
  }
];

const extraApplied: Q[] = [
  // COMPUTER STUDIES
  {
    id: 'jamb-cmp-2024-01',
    subject: 'computer',
    subjectName: 'Computer Studies',
    year: 2024,
    questionNumber: 1,
    topic: 'Computer Hardware & Architecture',
    question: 'In the central processing unit (CPU), which component is specifically responsible for performing arithmetic additions and logical comparisons (AND, OR, NOT)?',
    options: ['Arithmetic and Logic Unit (ALU)', 'Control Unit (CU)', 'Program Counter (PC)', 'Memory Address Register (MAR)'],
    correctAnswer: 0,
    explanation: 'The ALU executes all arithmetic operations (addition, subtraction, multiplication) and Boolean logical operations.'
  },
  {
    id: 'jamb-cmp-2024-02',
    subject: 'computer',
    subjectName: 'Computer Studies',
    year: 2024,
    questionNumber: 2,
    topic: 'Computer Networks & Internet',
    question: 'Which layer of the Open Systems Interconnection (OSI) model is responsible for reliable end-to-end communication, flow control, and error recovery using TCP?',
    options: ['Transport Layer', 'Network Layer', 'Data Link Layer', 'Application Layer'],
    correctAnswer: 0,
    explanation: 'The Transport Layer (Layer 4) handles segmentation, end-to-end connection control, reliability, and flow control (e.g. TCP).'
  },
  {
    id: 'jamb-cmp-2023-01',
    subject: 'computer',
    subjectName: 'Computer Studies',
    year: 2023,
    questionNumber: 1,
    topic: 'Operating Systems & System Software',
    question: 'Which of the following is an example of an open-source operating system with a monolithic kernel?',
    options: ['Linux', 'Microsoft Windows 11', 'macOS', 'iOS'],
    correctAnswer: 0,
    explanation: 'Linux is a renowned open-source OS kernel released under the GNU General Public License.'
  },

  // AGRICULTURAL SCIENCE
  {
    id: 'jamb-agr-2024-01',
    subject: 'agriculture',
    subjectName: 'Agricultural Science',
    year: 2024,
    questionNumber: 1,
    topic: 'Soil Science & Fertility',
    question: 'Which of the following soil types has the highest water-holding capacity but poor drainage and aeration?',
    options: ['Clay soil', 'Sandy soil', 'Loamy soil', 'Silty soil'],
    correctAnswer: 0,
    explanation: 'Clay soils consist of extremely fine particles with tiny micropores, resulting in high capillarity and water retention but poor aeration.'
  },
  {
    id: 'jamb-agr-2024-02',
    subject: 'agriculture',
    subjectName: 'Agricultural Science',
    year: 2024,
    questionNumber: 2,
    topic: 'Animal Husbandry & Nutrition',
    question: 'In ruminant farm animals, the true gastric stomach that secretes hydrochloric acid and gastric enzymes is the _______',
    options: ['Abomasum', 'Rumen', 'Reticulum', 'Omasum'],
    correctAnswer: 0,
    explanation: 'The abomasum is the fourth and glandular stomach chamber of ruminants, functioning like the monogastric stomach.'
  },

  // PHYSICAL & HEALTH EDUCATION
  {
    id: 'jamb-phe-2024-01',
    subject: 'phe',
    subjectName: 'Physical and Health Education',
    year: 2024,
    questionNumber: 1,
    topic: 'Human Anatomy & Exercise Physiology',
    question: 'The principle of progressive overload in sports training states that _______',
    options: ['training intensity or volume must gradually increase for physical adaptations to continue', 'athletes must train to complete exhaustion daily', 'training should be identical each week', 'rest intervals must be eliminated'],
    correctAnswer: 0,
    explanation: 'Progressive overload requires progressively challenging the musculoskeletal and cardiovascular systems beyond accustomed loads to stimulate physiological adaptation.'
  }
];

const extraArts: Q[] = [
  // LITERATURE IN ENGLISH
  {
    id: 'jamb-lit-2024-01',
    subject: 'literature',
    subjectName: 'Literature in English',
    year: 2024,
    questionNumber: 1,
    topic: 'Literary Appreciation & Figures of Speech',
    question: '"The waves whispered secrets to the lonely shore under the pale moonlight." This line is an example of _______',
    options: ['personification', 'hyperbole', 'oxymoron', 'onomatopoeia'],
    correctAnswer: 0,
    explanation: 'Personification attributes human qualities ("whispered secrets") to non-human entities (the waves).'
  },
  {
    id: 'jamb-lit-2024-02',
    subject: 'literature',
    subjectName: 'Literature in English',
    year: 2024,
    questionNumber: 2,
    topic: 'Literary Appreciation & Figures of Speech',
    question: 'A play characterized by light, humorous themes and an ending that resolves happily for the protagonists is a _______',
    options: ['comedy', 'tragedy', 'melodrama', 'farce alone'],
    correctAnswer: 0,
    explanation: 'A classical comedy portrays amusing scenarios, satirical commentary, and concludes in prosperity and marriage or reconciliation.'
  },

  // CHRISTIAN RELIGIOUS STUDIES
  {
    id: 'jamb-crs-2024-01',
    subject: 'crs',
    subjectName: 'Christian Religious Studies',
    year: 2024,
    questionNumber: 1,
    topic: 'The Ministry & Parables of Jesus',
    question: 'In the Parable of the Good Samaritan (Luke 10), who among the travelers stopped and showed compassion to the wounded man?',
    options: ['A Samaritan', 'A Priest', 'A Levite', 'A Roman centurion'],
    correctAnswer: 0,
    explanation: 'The priest and the Levite passed by on the other side, while a despised Samaritan stopped, bandaged his wounds, and paid for his lodging.'
  },

  // ISLAMIC STUDIES
  {
    id: 'jamb-irs-2024-01',
    subject: 'irs',
    subjectName: 'Islamic Studies',
    year: 2024,
    questionNumber: 1,
    topic: 'Tawhid & Pillars of Islam',
    question: 'The belief in the absolute oneness, unicity, and indivisibility of Allah is termed _______',
    options: ['Tawhid', 'Shirk', 'Qadar', 'Sunnah'],
    correctAnswer: 0,
    explanation: 'Tawhid is the defining theological core of Islam, asserting the indivisible oneness of Allah.'
  },

  // HISTORY
  {
    id: 'jamb-his-2024-01',
    subject: 'history',
    subjectName: 'History',
    year: 2024,
    questionNumber: 1,
    topic: 'Pre-Colonial Kingdoms of Nigeria',
    question: 'In the pre-colonial Old Oyo Empire, the council of noble kingmakers headed by the Bashorun was the _______',
    options: ['Oyo Mesi', 'Ogboni cult', 'Are Ona Kakanfo', 'Ilari'],
    correctAnswer: 0,
    explanation: 'The Oyo Mesi was the council of seven senior noble chiefs led by the Bashorun who acted as constitutional checks on the Alaafin.'
  }
];

const mergedSocial = [...SOCIAL_SCIENCES_EXPANDED, ...extraSocial];
writeQuestionsFile(path.resolve(process.cwd(), 'src/data/jamb/socialSciencesQuestionsExpanded.ts'), 'SOCIAL_SCIENCES_EXPANDED', mergedSocial);

const mergedApp = [...APPLIED_VOCATIONAL_EXPANDED, ...extraApplied];
writeQuestionsFile(path.resolve(process.cwd(), 'src/data/jamb/appliedVocationalQuestionsExpanded.ts'), 'APPLIED_VOCATIONAL_EXPANDED', mergedApp);

const mergedArt = [...ARTS_SOCIAL_QUESTIONS, ...extraArts];
writeQuestionsFile(path.resolve(process.cwd(), 'src/data/jamb/artsSocialQuestions.ts'), 'ARTS_SOCIAL_QUESTIONS', mergedArt);

console.log('Completed social sciences, vocational & arts question expansion');
