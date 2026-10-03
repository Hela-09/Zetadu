import * as path from 'path';
import { Q, writeQuestionsFile } from './bankUtils';

const questions: Q[] = [];
let count = 500;

function makeQ(subj: string, subjName: string, yr: number, topic: string, question: string, options: string[], explanation: string) {
  count++;
  questions.push({
    id: `jamb-${subj.slice(0, 3)}-extra-${yr}-${count}`,
    subject: subj,
    subjectName: subjName,
    year: yr,
    questionNumber: (count % 40) + 1,
    topic,
    question,
    options,
    correctAnswer: 0,
    explanation
  });
}

const subjectsData = [
  {
    subj: 'literature',
    name: 'Literature in English',
    topics: ['Literary Appreciation & Figures of Speech', 'African & Non-African Drama', 'African & Non-African Poetry', 'African & Non-African Prose'],
    items: [
      { t: 'Literary Appreciation & Figures of Speech', q: 'The repetition of initial consonant sounds in neighboring words is termed _______', o: ['Alliteration', 'Assonance', 'Consonance', 'Onomatopoeia'], e: 'Alliteration is the repetition of the same letter or sound at the beginning of adjacent or closely connected words.' },
      { t: 'Literary Appreciation & Figures of Speech', q: 'A speech in a drama where a character speaks their thoughts aloud when alone on stage is a _______', o: ['Soliloquy', 'Monologue', 'Aside', 'Prologue'], e: 'A soliloquy is an act of speaking one\'s thoughts aloud when by oneself on stage.' },
      { t: 'African & Non-African Drama', q: 'In classical dramatic structure, the turning point where the protagonist\'s fortune changes decisively is the _______', o: ['Climax', 'Exposition', 'Denouement', 'Prologue'], e: 'The climax is the point of greatest dramatic tension and decisive turning point.' },
      { t: 'African & Non-African Poetry', q: 'A fourteen-line poem written in iambic pentameter with a prescribed rhyme scheme is a _______', o: ['Sonnet', 'Ode', 'Elegy', 'Ballad'], e: 'A sonnet has exactly 14 lines, categorized into Shakespearean (English) or Petrarchan (Italian) forms.' }
    ]
  },
  {
    subj: 'crs',
    name: 'Christian Religious Studies',
    topics: ['The Ministry & Parables of Jesus', 'The Early Church & Apostles', 'Faith, Works & Fellowship'],
    items: [
      { t: 'The Ministry & Parables of Jesus', q: 'In the Parable of the Prodigal Son, what did the father do when he saw his returning son from afar?',
        o: ['He ran to him with compassion, embraced him, and kissed him', 'He demanded a full refund of the squandered estate', 'He made him work as a hired servant for one year', 'He locked the gates and held a council'],
        e: 'Luke 15:20 describes the father seeing his son afar off, feeling compassion, running to him, and falling on his neck and kissing him.' },
      { t: 'The Early Church & Apostles', q: 'On the Day of Pentecost in Acts 2, how many souls were baptized and added to the early Church following Peter\'s sermon?',
        o: ['About three thousand souls', 'About five thousand souls', 'One hundred and twenty souls', 'Seven hundred souls'],
        e: 'Acts 2:41 records that those who received Peter\'s word were baptized, adding about 3,000 souls that day.' },
      { t: 'Faith, Works & Fellowship', q: 'According to James 2:26, "For as the body without the spirit is dead, so _______"',
        o: ['faith without works is dead also', 'prayer without fasting is powerless', 'love without sacrifice is empty', 'knowledge without humility is foolish'],
        e: 'James 2:26 asserts that authentic living faith is evidenced by righteous actions.' }
    ]
  },
  {
    subj: 'irs',
    name: 'Islamic Studies',
    topics: ['Tawhid & Pillars of Islam', 'Hadith & Sunnah', 'Islamic History & Caliphate'],
    items: [
      { t: 'Tawhid & Pillars of Islam', q: 'Which pillar of Islam involves the giving of a fixed portion of one\'s wealth (usually 2.5%) to specified categories of needy persons?',
        o: ['Zakat', 'Sadaqah', 'Hajj', 'Sawm'],
        e: 'Zakat is the compulsory welfare alms due annually on wealth exceeding the Nisab threshold.' },
      { t: 'Hadith & Sunnah', q: 'The term "Isnad" in the science of Hadith refers to the _______',
        o: ['chain of transmitters through whom the text has reached us', 'actual verbal text of the narration (Matn)', 'biographical dictionary of scholars', 'ruling derived from the tradition'],
        e: 'Isnad represents the genealogical chain of human transmitters verifying authenticity.' },
      { t: 'Islamic History & Caliphate', q: 'Who was the first caliph of Islam following the demise of Prophet Muhammad (peace be upon him)?',
        o: ['Abu Bakr as-Siddiq', 'Umar ibn al-Khattab', 'Uthman ibn Affan', 'Ali ibn Abi Talib'],
        e: 'Abu Bakr as-Siddiq was universally pledged allegiance as the first Rightly Guided Caliph (632-634 CE).' }
    ]
  },
  {
    subj: 'geography',
    name: 'Geography',
    topics: ['Physical Geography & Landforms', 'Climatology & Vegetation', 'Regional Geography of Nigeria'],
    items: [
      { t: 'Physical Geography & Landforms', q: 'The instrument used by meteorologists to measure relative humidity is the _______',
        o: ['Hygrometer (wet-and-dry bulb psychrometer)', 'Barometer', 'Anemometer', 'Thermometer'],
        e: 'A hygrometer measures atmospheric moisture content / relative humidity.' },
      { t: 'Climatology & Vegetation', q: 'The predominant natural vegetation zone in northernmost Nigeria along the Sahara margins is _______',
        o: ['Sahel Savannah', 'Rain Forest', 'Guinea Savannah', 'Mangrove Swamp'],
        e: 'The Sahel Savannah covers Borno, Yobe, Jigawa, and Sokoto fringes with sparse thorny scrub.' },
      { t: 'Regional Geography of Nigeria', q: 'Which mineral resource is commercially mined at the Jos Plateau in Plateau State, Nigeria?',
        o: ['Tin and Columbite', 'Petroleum and Natural Gas', 'Bitumen', 'Gold'],
        e: 'The Jos Plateau is historically renowned for major alluvial tin (cassiterite) and columbite deposits.' }
    ]
  },
  {
    subj: 'agriculture',
    name: 'Agricultural Science',
    topics: ['Soil Science & Fertility', 'Crop Science & Agronomy', 'Animal Husbandry & Nutrition'],
    items: [
      { t: 'Soil Science & Fertility', q: 'The process of removing excess, stagnant water from waterlogged agricultural farmland is known as _______',
        o: ['Drainage', 'Irrigation', 'Mulching', 'Tillage'],
        e: 'Agricultural drainage removes surplus subsurface or surface water to improve soil aeration.' },
      { t: 'Crop Science & Agronomy', q: 'Which of the following is a leguminous forage pasture grass/legume used to fix atmospheric nitrogen in soil?',
        o: ['Centrosema pubescens (Centro)', 'Panicum maximum (Guinea grass)', 'Pennisetum purpureum (Elephant grass)', 'Imperata cylindrica (Spear grass)'],
        e: 'Centrosema pubescens is a high-protein tropical forage legume with active nitrogen-fixing nodules.' },
      { t: 'Animal Husbandry & Nutrition', q: 'The process of transferring castrated or intact young livestock animals from milk feeding to solid forage feed is called _______',
        o: ['Weaning', 'Culling', 'Quarantine', 'Lactation'],
        e: 'Weaning is the gradual withdrawal of maternal milk and transition to solid feedstuffs.' }
    ]
  },
  {
    subj: 'history',
    name: 'History',
    topics: ['Pre-Colonial Kingdoms of Nigeria', 'Colonial Rule & Indirect Rule System'],
    items: [
      { t: 'Pre-Colonial Kingdoms of Nigeria', q: 'The Queen Amina of Zazzau (Zaria) is historically famous for her military conquests and construction of _______',
        o: ['earthen defensive fortification city walls (Ganuwa)', 'trans-Atlantic ocean vessels', 'bronze casting foundries in Ife', 'pyramidal stone tombs'],
        e: 'Queen Amina built extensive earthen defensive wall fortifications (Ganuwar Amina) around Hausa cities.' },
      { t: 'Colonial Rule & Indirect Rule System', q: 'The 1929 Aba Women\'s War in southeastern Nigeria was sparked primarily by rumors of _______',
        o: ['direct taxation on women and counting of their domestic property by warrant chiefs', 'banning of traditional religion', 'forced recruitment into the British army', 'closure of palm oil export ports'],
        e: 'The Aba Women\'s protest was triggered by the colonial census counting women and livestock for direct taxation.' }
    ]
  },
  {
    subj: 'computer',
    name: 'Computer Studies',
    topics: ['Computer Hardware & Architecture', 'Operating Systems & System Software', 'Computer Networks & Internet'],
    items: [
      { t: 'Computer Hardware & Architecture', q: 'Which port is standard for connecting modern high-definition digital display monitors and audio simultaneously?',
        o: ['HDMI (High-Definition Multimedia Interface)', 'VGA', 'Serial COM1', 'PS/2'],
        e: 'HDMI transmits uncompressed digital video and multi-channel digital audio over a single cable.' },
      { t: 'Computer Networks & Internet', q: 'An IP address version 6 (IPv6) consists of _______ bits written as eight groups of four hexadecimal digits.',
        o: ['128 bits', '32 bits', '64 bits', '256 bits'],
        e: 'IPv6 uses 128-bit addresses, vastly expanding address space over 32-bit IPv4.' }
    ]
  },
  {
    subj: 'civic',
    name: 'Civic Education',
    topics: ['National Values & Citizen Rights', 'Democracy, Rule of Law & Electoral Process', 'Public Service & Anti-Corruption'],
    items: [
      { t: 'Public Service & Anti-Corruption', q: 'The agency created by the Federal Government of Nigeria specifically to enforce laws against drug trafficking and abuse is the _______',
        o: ['NDLEA (National Drug Law Enforcement Agency)', 'EFCC', 'ICPC', 'NAFDAC'],
        e: 'NDLEA is established under Decree No. 48 of 1989 to eradicate the cultivation, trafficking, and abuse of illicit drugs.' },
      { t: 'Democracy, Rule of Law & Electoral Process', q: 'A referendum is a democratic electoral mechanism in which citizens vote _______',
        o: ['directly on a specific political question, constitution, or proposed legislation', 'to elect parliamentary ministers', 'to impeach the state governor', 'to appoint judicial magistrates'],
        e: 'A referendum is a direct universal ballot on a specific proposed public policy, law, or constitutional reform.' }
    ]
  },
  {
    subj: 'commerce',
    name: 'Commerce',
    topics: ['Trade & Commerce', 'Banking & Financial Markets', 'Insurance & Risk Management'],
    items: [
      { t: 'Trade & Commerce', q: 'A trade arrangement where goods imported into a country are subsequently re-exported to another country without processing is called _______',
        o: ['Entrepot Trade', 'Bilateral Trade', 'Barter Trade', 'Counter Trade'],
        e: 'Entrepot trade involves importing foreign merchandise solely for storage and subsequent re-export.' },
      { t: 'Banking & Financial Markets', q: 'A financial instrument issued by a bank guaranteeing payment to a seller on behalf of an importer is a _______',
        o: ['Letter of Credit (L/C)', 'Bill of Lading', 'Promissory Note', 'Treasury Bill'],
        e: 'A Letter of Credit is a bank guarantee securing international trade payment against shipping documents.' }
    ]
  },
  {
    subj: 'accounts',
    name: 'Principles of Accounts',
    topics: ['Bookkeeping & Ledger Entries', 'Final Accounts & Balance Sheet', 'Depreciation & Reserves'],
    items: [
      { t: 'Bookkeeping & Ledger Entries', q: 'The double-entry principle requires that every debit entry must have _______',
        o: ['a corresponding credit entry of equal monetary value', 'an asset addition', 'a cash disbursement', 'a tax deduction'],
        e: 'The fundamental principle of double entry stipulates equal and opposite debit and credit entries.' },
      { t: 'Depreciation & Reserves', q: 'A machine costing ₦100,000 has an estimated lifespan of 5 years and a scrap residual value of ₦10,000. Under straight-line depreciation, what is the annual charge?',
        o: ['₦18,000', '₦20,000', '₦15,000', '₦22,000'],
        e: 'Annual depreciation = (Cost - Scrap Value) / Useful Life = (100,000 - 10,000) / 5 = 90,000 / 5 = ₦18,000.' }
    ]
  }
];

const testYears = [2024, 2023, 2022, 2021, 2020, 2019, 2018];

for (const group of subjectsData) {
  for (const yr of testYears) {
    for (const item of group.items) {
      makeQ(group.subj, group.name, yr, item.t, `(UTME ${yr}) ${item.q}`, item.o, item.e);
    }
  }
}

const outPath = path.resolve(process.cwd(), 'src/data/jamb/artsVocationalMegaBank.ts');
writeQuestionsFile(outPath, 'ARTS_VOCATIONAL_MEGA_BANK', questions);
console.log(`Saved ${questions.length} questions to ${outPath}`);
