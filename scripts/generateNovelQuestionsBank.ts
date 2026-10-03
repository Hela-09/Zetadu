import * as fs from 'fs';
import * as path from 'path';

// Generator to build comprehensive stored novel questions bank
export interface GenNovelQ {
  id: string;
  novelId: string;
  novelTitle: string;
  chapterNumber?: number;
  chapterIndex?: number;
  chapterTitle?: string;
  questionNumber: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  topic: string;
  difficulty: 'easy' | 'medium' | 'hard';
  year: string;
}

const bank: GenNovelQ[] = [];
let qCounter = 1;

function addQ(q: Omit<GenNovelQ, 'questionNumber'>) {
  bank.push({
    ...q,
    questionNumber: qCounter++
  });
}

// -------------------------------------------------------------
// 1. THE LEKKI HEADMASTER (Current Compulsory Novel for UTME)
// -------------------------------------------------------------
const LH_ID = 'the-lekki-headmaster';
const LH_TITLE = 'The Lekki Headmaster';

// Chapter 1: The Morning Assembly at Stardom Schools
const lhCh1Questions = [
  {
    q: 'At the opening of "The Lekki Headmaster", what does Mr. Bepo consider to be the "covenant of personal destiny"?',
    opts: ['Wealth creation', 'Strict punctuality and self-discipline', 'Securing an overseas scholarship', 'Technological proficiency'],
    ans: 1,
    exp: 'During his address to the morning assembly in Chapter 1, Mr. Bepo famously describes punctuality as the foundational covenant of personal discipline and destiny.'
  },
  {
    q: 'The contrasting descriptions of students arriving in luxury vehicles and teachers enduring mainland transit highlights:',
    opts: ['The breakdown of public transport in Lagos', 'The stark socioeconomic disparity existing within elite private education', 'The superiority of island living', 'The lack of government funding for road networks'],
    ans: 1,
    exp: 'Kabir Alabi Garba deliberately juxtaposes the opulence of Lekki students with the grueling commutes of teachers from the mainland to highlight economic inequality.'
  },
  {
    q: 'What is Mr. Bepo’s attire during the morning assembly, and what does it symbolize?',
    opts: ['A flamboyant European tuxedo symbolizing foreign influence', 'An impeccably ironed, modest guinea-brocade attire symbolizing quiet dignity and unpretentious values', 'A sports tracksuit symbolizing modern agility', 'A torn coat symbolizing poverty'],
    ans: 1,
    exp: 'Mr. Bepo wears a modest but impeccably pressed guinea-brocade, signifying moral discipline, modesty, and resistance to ostentatious wealth.'
  },
  {
    q: 'Which student commits the initial disciplinary infraction during the morning assembly in Chapter 1?',
    opts: ['Segun Adeleke', 'Femi Adeleke', 'Tobi Savage', 'Dele Coker'],
    ans: 1,
    exp: 'Femi Adeleke arrives late and brandishes an expensive smartphone, defying the school regulations against unauthorized gadgets.'
  },
  {
    q: 'How does Mr. Bepo react when Femi Adeleke displays an arrogant attitude during assembly inspection?',
    opts: ['He ignores the boy because of his father’s wealth', 'He confiscates the device calmly and administers the standard school disciplinary sanction', 'He assaults the student physically', 'He expels the boy on the spot without due process'],
    ans: 1,
    exp: 'Mr. Bepo applies the school rules impartially, refusing to allow social status to excuse misconduct.'
  },
  {
    q: 'What is the reaction of the assembly students when Mr. Bepo enforces the discipline code on Femi Adeleke?',
    opts: ['They stage an open protest against the headmaster', 'A tense silence falls over the courtyard as they witness authority triumph over privilege', 'They cheer and mock Femi openly', 'They walk out of the school gates'],
    ans: 1,
    exp: 'A hushed silence envelopes the courtyard, proving to the students that Mr. Bepo treats all pupils equally regardless of parental wealth.'
  },
  {
    q: 'In Chapter 1, what vintage object does Mr. Bepo consult to verify the morning assembly time?',
    opts: ['A digital smartwatch', 'His vintage mechanical wristwatch', 'The school bell tower', 'A wall clock in the bursary'],
    ans: 1,
    exp: 'Mr. Bepo’s vintage mechanical wristwatch is symbolic of precision, classical values, and adherence to duty.'
  },
  {
    q: 'Which character trait best describes Mr. Bepo as portrayed in Chapter 1?',
    opts: ['Timid and indecisive', 'Principled, observant, and uncompromisingly fair', 'Greedy and status-seeking', 'Reckless and aggressive'],
    ans: 1,
    exp: 'Mr. Bepo is depicted as a man of high moral stature, dedicated to true education rather than superficial appearances.'
  }
];

lhCh1Questions.forEach(item => {
  addQ({
    id: `lh-ch1-q${qCounter}`,
    novelId: LH_ID,
    novelTitle: LH_TITLE,
    chapterNumber: 1,
    chapterIndex: 0,
    chapterTitle: 'The Morning Assembly at Stardom Schools',
    question: item.q,
    options: item.opts,
    correctAnswer: item.ans,
    explanation: item.exp,
    topic: 'Chapter 1: The Morning Assembly',
    difficulty: 'medium',
    year: '2025/2026'
  });
});

// Chapter 2: The Proprietress and the Ledger
const lhCh2Questions = [
  {
    q: 'In Chapter 2, what primary concern dominates Mrs. Savage’s administrative meetings with Mr. Bepo?',
    opts: ['Curriculum modernization', 'Tuition recovery, parent satisfaction, and commercial profitability', 'Hiring foreign teachers exclusively', 'Building an Olympic swimming pool'],
    ans: 1,
    exp: 'Mrs. Savage is focused on the school as a business venture, prioritizing financial liquidity and placating influential parents.'
  },
  {
    q: 'How does Mrs. Savage view the parents of Stardom Schools students?',
    opts: ['As partners in moral training', 'As valued clients whose patronage must be protected at all costs', 'As adversaries to be controlled', 'As passive observers with no influence'],
    ans: 1,
    exp: 'Mrs. Savage treats education as a service industry where wealthy parents are high-paying clients who expect favorable treatment.'
  },
  {
    q: 'What metaphor is used to describe the tension between Mr. Bepo and Mrs. Savage?',
    opts: ['A captain versus a pirate', 'An ethical pedagogue versus a commercial ledger', 'A judge versus a criminal', 'A doctor versus a patient'],
    ans: 1,
    exp: 'The novel contrasts Mr. Bepo’s moral pedagogical compass with Mrs. Savage’s preoccupation with financial ledgers and cash flow.'
  },
  {
    q: 'When Mrs. Savage suggests softening disciplinary measures for children of board members, Mr. Bepo argues that:',
    opts: ['Board members should be charged double tuition fees', 'Selective discipline destroys the moral foundation of children and ruins the school reputation', 'He will resign immediately if not given a salary increase', 'The teachers should decide by secret ballot'],
    ans: 1,
    exp: 'Mr. Bepo contends that exempting rich students from discipline destroys their character and undermines institutional credibility.'
  },
  {
    q: 'Mrs. Savage’s background before establishing Stardom Schools was predominantly in:',
    opts: ['Classroom secondary school teaching', 'Corporate banking and real estate enterprise', 'Military administration', 'Medical philanthropy'],
    ans: 1,
    exp: 'Her corporate and commercial business background explains her instinctual prioritization of profitability and public relations over pedogogical ethics.'
  },
  {
    q: 'What fear does Mrs. Savage express if Chief Adeleke withdraws his children from Stardom Schools?',
    opts: ['The school will fail its WAEC inspection', 'Other elite parents will follow suit, causing severe financial hemorrhaging', 'The headmaster will be arrested by the police', 'The students will lose their foreign scholarships'],
    ans: 1,
    exp: 'She dreads the herd mentality of wealthy Lekki parents who follow social trends and withdraw their patronage when displeased.'
  },
  {
    q: 'Which idiom best summarizes Mrs. Savage’s advice to Mr. Bepo in Chapter 2 regarding elite parents?',
    opts: ['Look before you leap', 'Don’t bite the finger that feeds you', 'A stitch in time saves nine', 'Honesty is the best policy'],
    ans: 1,
    exp: 'Mrs. Savage explicitly warns Mr. Bepo not to alienate the wealthy benefactors whose hefty school fees sustain the establishment.'
  },
  {
    q: 'How does Mr. Bepo defend the role of tough love in educational mentoring?',
    opts: ['By citing classical educational treatises and African communal wisdom', 'By threatening to report the school to the Ministry of Education', 'By demanding higher tuition from disobedient students', 'By asking the students to vote on school rules'],
    ans: 0,
    exp: 'Mr. Bepo roots his leadership philosophy in classical pedagogy and the time-honored African ethos that character precedes academic laurels.'
  }
];

lhCh2Questions.forEach(item => {
  addQ({
    id: `lh-ch2-q${qCounter}`,
    novelId: LH_ID,
    novelTitle: LH_TITLE,
    chapterNumber: 2,
    chapterIndex: 1,
    chapterTitle: 'The Proprietress and the Ledger',
    question: item.q,
    options: item.opts,
    correctAnswer: item.ans,
    explanation: item.exp,
    topic: 'Chapter 2: Ethical vs Commercial Tension',
    difficulty: 'medium',
    year: '2025/2026'
  });
});

// Chapter 3: The Mainland Commute and Teacher Dedication
const lhCh3Questions = [
  {
    q: 'In Chapter 3, the daily commute of teachers like Mr. Ojo and Miss Sandra from the mainland serves to:',
    opts: ['Demonstrate the efficiency of the Lagos ferry service', 'Expose the heavy sacrifices and economic burden borne by educators in an unequal society', 'Encourage teachers to buy cars on installment plans', 'Criticize teachers for living far from Lekki'],
    ans: 1,
    exp: 'The grueling four-hour daily commute of teachers living on the mainland exposes the hidden sacrifices that sustain elite institutions.'
  },
  {
    q: 'What time does Mr. Ojo wake up every weekday morning to ensure timely arrival at Stardom Schools?',
    opts: ['6:30 AM', '4:30 AM', '5:45 AM', '3:30 AM'],
    ans: 1,
    exp: 'Mr. Ojo rises before dawn at 4:30 AM to navigate the notorious traffic bottlenecks from Ikorodu to the Lekki tollgate.'
  },
  {
    q: 'How does Mr. Bepo treat the teachers’ welfare issues despite the board’s tight budget?',
    opts: ['He ignores their complaints as minor inconveniences', 'He advocates passionately for transport subsidies, timely salaries, and respectful treatment', 'He deducts pay for every five-minute delay', 'He advises them to quit teaching if they cannot afford Lekki rents'],
    ans: 1,
    exp: 'Mr. Bepo acts as an empathetic buffer, constantly lobbying Mrs. Savage to improve staff remuneration and working conditions.'
  },
  {
    q: 'What incident at the staff room reveals the quiet solidarity among the Stardom Schools instructors?',
    opts: ['A strike vote against the proprietor', 'Sharing home-cooked breakfast and pooling resources to support a bereaved colleague', 'Selling smuggled cosmetics during free periods', 'Refusing to grade mock examination scripts'],
    ans: 1,
    exp: 'The staff room community is bound by shared sacrifice, mutual empathy, and professional camaraderie.'
  },
  {
    q: 'The character of Miss Sandra represents which category of Nigerian educators?',
    opts: ['The cynical teacher waiting for a visa to leave the country', 'The passionate young graduate dedicated to inspiring young minds despite harsh economic conditions', 'The indolent worker who avoids classroom duties', 'The wealthy heiress teaching as a hobby'],
    ans: 1,
    exp: 'Miss Sandra embodies dedicated young educators who pour their intellectual gifts into teaching despite meager financial returns.'
  },
  {
    q: 'In his private reflections, what does Mr. Bepo describe as the greatest threat to teacher retention?',
    opts: ['Strict school inspection officers', 'Economic humiliation and lack of social respect for the teaching profession', 'Difficult examination syllabuses', 'Lack of air conditioners in the classrooms'],
    ans: 1,
    exp: 'Mr. Bepo laments that society venerates raw wealth while devaluing the noble architects of human intellect.'
  }
];

lhCh3Questions.forEach(item => {
  addQ({
    id: `lh-ch3-q${qCounter}`,
    novelId: LH_ID,
    novelTitle: LH_TITLE,
    chapterNumber: 3,
    chapterIndex: 2,
    chapterTitle: 'The Mainland Commute and Teacher Dedication',
    question: item.q,
    options: item.opts,
    correctAnswer: item.ans,
    explanation: item.exp,
    topic: 'Chapter 3: The Teachers’ Sacrifice',
    difficulty: 'medium',
    year: '2025/2026'
  });
});

// Chapter 4: The Examination Room Crisis
const lhCh4Questions = [
  {
    q: 'What crisis unfolds during the terminal mock examinations in Chapter 4?',
    opts: ['A fire outbreak in the chemistry laboratory', 'A high-tech examination malpractice scheme involving smuggled smartwatches and prepared answer sheets', 'A mass food poisoning in the cafeteria', 'A boycott of the exams by final year students'],
    ans: 1,
    exp: 'The examination hall is thrown into crisis when invigilators uncover smartwatches pre-loaded with illicit examination materials.'
  },
  {
    q: 'Which student is caught red-handed at the center of the examination malpractice ring?',
    opts: ['Tolu Savage', 'Femi Adeleke', 'Emeka Obi', 'Gbenga Coker'],
    ans: 1,
    exp: 'Femi Adeleke is discovered using encrypted communication on his concealed smartwatch to receive objective answer keys.'
  },
  {
    q: 'How does invigilator Mr. Ojo handle the discovery of the illicit examination materials?',
    opts: ['He accepts a financial bribe to look away', 'He follows the examination protocol strictly by documenting the exhibit and notifying Mr. Bepo', 'He tears up the question paper without evidence', 'He allows the student to finish before whispering to him'],
    ans: 1,
    exp: 'Mr. Ojo courageously follows ethical examination guidelines, seizing the device and filing an official infraction report.'
  },
  {
    q: 'What immediate pressure does Mrs. Savage exert on Mr. Bepo upon hearing of Femi Adeleke’s apprehension?',
    opts: ['She orders that the matter be hushed up and the seized device returned to prevent a scandal', 'She demands that the student be prosecuted in court', 'She congratulates the invigilators and awards them cash bonuses', 'She calls a press conference to denounce cheating'],
    ans: 0,
    exp: 'Terrified of Chief Adeleke’s wrath, Mrs. Savage orders the headmaster to suppress the incident and falsify the report.'
  },
  {
    q: 'Mr. Bepo’s refusal to bury the malpractice report demonstrates his commitment to:',
    opts: ['Vengeance against wealthy parents', 'Uncompromising academic integrity and moral stewardship', 'Gaining political popularity', 'Causing the school’s bankruptcy'],
    ans: 1,
    exp: 'Mr. Bepo insists that certifying fraud turns the school into a den of corruption rather than an academic sanctuary.'
  },
  {
    q: 'What proverb or saying does Mr. Bepo quote when defending the sanctions against cheating?',
    opts: ['A bird in hand is worth two in the bush', 'He who conceals a serpent’s egg in his bosom will perish from the serpent’s bite', 'Money answereth all things', 'Silence is the best answer to a fool'],
    ans: 1,
    exp: 'Mr. Bepo warns that shielding a young cheater nurtures an adult fraudster who will destroy society.'
  }
];

lhCh4Questions.forEach(item => {
  addQ({
    id: `lh-ch4-q${qCounter}`,
    novelId: LH_ID,
    novelTitle: LH_TITLE,
    chapterNumber: 4,
    chapterIndex: 3,
    chapterTitle: 'The Examination Room Crisis',
    question: item.q,
    options: item.opts,
    correctAnswer: item.ans,
    explanation: item.exp,
    topic: 'Chapter 4: The Examination Malpractice Crisis',
    difficulty: 'hard',
    year: '2025/2026'
  });
});

// Chapter 5: Parental Confrontation and the Disciplinary Board
const lhCh5Questions = [
  {
    q: 'In Chapter 5, Chief Adeleke storms Stardom Schools primarily to:',
    opts: ['Donate five million naira to the science lab', 'Intimidate the school administration into canceling his son’s suspension and expunging the malpractice record', 'Enroll his three younger daughters', 'Apologize for his son’s misconduct'],
    ans: 1,
    exp: 'Chief Adeleke attempts to use his political connections and financial clout to bully the school into erasing his son’s misconduct.'
  },
  {
    q: 'What argument does Chief Adeleke use when confronting Mr. Bepo in the administrative boardroom?',
    opts: ['That his son is innocent because he was in London during the exam', 'That his exorbitant school fees give him the right to dictate how his child is treated and assessed', 'That the invigilators planted the smartwatch on his son', 'That the examination questions were stolen from his home'],
    ans: 1,
    exp: 'Chief Adeleke exhibits the transactional arrogance of elite parents who believe that paying tuition entitles them to buy grades.'
  },
  {
    q: 'How does Mr. Bepo maintain his composure during Chief Adeleke’s verbal intimidation?',
    opts: ['By shouting back and trading insults', 'By calmly laying out the documented evidence and articulating the constitutional principles of the school charter', 'By breaking down in tears and begging for forgiveness', 'By locking himself inside the restroom'],
    ans: 1,
    exp: 'Mr. Bepo remains remarkably calm, presenting unassailable physical evidence and refusing to be cowed by bluster.'
  },
  {
    q: 'What role does Funke Bepo play when her husband returns home exhausted from the board confrontation?',
    opts: ['She berates him for refusing Chief Adeleke’s bribe', 'She offers him emotional reassurance, spiritual grounding, and wise counsel that steel his resolve', 'She packs her bags and leaves for her parents’ house', 'She urges him to flee the country immediately'],
    ans: 1,
    exp: 'Funke is portrayed as a bastion of domestic serenity and moral fortitude who fortifies Mr. Bepo’s spiritual endurance.'
  },
  {
    q: 'During the Disciplinary Committee meeting, what unexpected testimony turns the tide in favor of Mr. Bepo’s stance?',
    opts: ['Mrs. Savage secretly votes against the boy', 'Femi Adeleke breaks down under questioning and confesses that his peer group pressured him into the fraud', 'The state governor sends a commendation letter to the school', 'Chief Adeleke admits to coaching his son'],
    ans: 1,
    exp: 'Femi’s unexpected tearful confession reveals the vulnerability beneath his arrogant facade, vindicating Mr. Bepo’s disciplinary approach.'
  }
];

lhCh5Questions.forEach(item => {
  addQ({
    id: `lh-ch5-q${qCounter}`,
    novelId: LH_ID,
    novelTitle: LH_TITLE,
    chapterNumber: 5,
    chapterIndex: 4,
    chapterTitle: 'Parental Confrontation and the Disciplinary Board',
    question: item.q,
    options: item.opts,
    correctAnswer: item.ans,
    explanation: item.exp,
    topic: 'Chapter 5: Parental Confrontation',
    difficulty: 'hard',
    year: '2025/2026'
  });
});

// Chapter 6: The Valedictory Triumph and Moral Vindication
const lhCh6Questions = [
  {
    q: 'In the climactic valedictory ceremony in Chapter 6, what honor is bestowed upon Mr. Bepo?',
    opts: ['He is fired by the board without compensation', 'He receives the National Educational Leadership Award and heartfelt gratitude from reformed students, including Femi Adeleke', 'He is appointed Minister of Petroleum', 'He is elected president of the Parents Teachers Association'],
    ans: 1,
    exp: 'Mr. Bepo is publicly vindicated and honored when Stardom Schools records stellar, untainted national examination results.'
  },
  {
    q: 'How has Femi Adeleke changed by the conclusion of the novel?',
    opts: ['He has dropped out of school to become a club promoter', 'He has embraced disciplined study habits, shown genuine remorse, and achieved honorable examination success through personal effort', 'He has fled to South Africa to escape his father', 'He has refused to speak to his parents forever'],
    ans: 1,
    exp: 'Femi’s character transformation proves that Mr. Bepo’s firm disciplinary love saved the boy from moral ruin.'
  },
  {
    q: 'What confession does Mrs. Savage make to Mr. Bepo at the end of the graduation banquet?',
    opts: ['That she intends to sell the school to a foreign conglomerate', 'That his moral courage preserved the soul of Stardom Schools and that profit without principle is empty', 'That she will cut his salary by half next term', 'That she never believed in the school rules'],
    ans: 1,
    exp: 'Mrs. Savage candidly acknowledges that Mr. Bepo’s moral fortitude gave the school an incorruptible reputation that money could never buy.'
  },
  {
    q: 'The central moral message of "The Lekki Headmaster" can be succinctly phrased as:',
    opts: ['Wealth conquers all obstacles in modern Nigeria', 'True education is the cultivation of moral character, and integrity cannot be compromised for commercial gain', 'Private schools are always superior to public schools', 'Teachers should avoid disciplining wealthy children'],
    ans: 1,
    exp: 'Kabir Alabi Garba’s primary theme is that education without character is perilous, and integrity remains the greatest human virtue.'
  },
  {
    q: 'In the novel’s final sentence, what image symbolizes hope for the future of Nigerian youth?',
    opts: ['A bank vault overflowing with currency notes', 'The morning assembly courtyard where new students stand straight, looking toward the horizon with clear eyes and disciplined minds', 'A sports car racing down the Lekki-Epe expressway', 'A closed school building during rainy season'],
    ans: 1,
    exp: 'The novel closes with the serene, orderly assembly ground where children learn that character is the true passport to destiny.'
  }
];

lhCh6Questions.forEach(item => {
  addQ({
    id: `lh-ch6-q${qCounter}`,
    novelId: LH_ID,
    novelTitle: LH_TITLE,
    chapterNumber: 6,
    chapterIndex: 5,
    chapterTitle: 'The Valedictory Triumph and Moral Vindication',
    question: item.q,
    options: item.opts,
    correctAnswer: item.ans,
    explanation: item.exp,
    topic: 'Chapter 6: Resolution & Vindication',
    difficulty: 'medium',
    year: '2025/2026'
  });
});

// -------------------------------------------------------------
// 2. THE LIFE CHANGER (Khadija Abubakar Jalli)
// -------------------------------------------------------------
const LC_ID = 'the-life-changer';
const LC_TITLE = 'The Life Changer';

const lcQuestions = [
  {
    q: 'In "The Life Changer", what is the primary role of Ummi in the framing story of the novel?',
    opts: ['A strict university lecturer', 'A loving, observant mother who shares cautionary tales and life wisdom with her children', 'A civil servant in Abuja', 'A businesswoman trading in textiles'],
    ans: 1,
    exp: 'Ummi acts as the warm matriarch who gathers her children (Omar, Teemah, Jamila, and Bint) to narrate stories that prepare Omar for university life.'
  },
  {
    q: 'Which child of Ummi has just gained admission into the university to study Law at the start of the novel?',
    opts: ['Teemah', 'Bint', 'Omar', 'Jamila'],
    ans: 2,
    exp: 'Omar is overjoyed because he has just received his university admission letter to study Law at the university.'
  },
  {
    q: 'What is the full meaning of the abbreviation "EMAL" in the context of the novel’s university setting?',
    opts: ['Emergency Medical Aid Line', 'Examination Malpractice', 'Educational Mentorship and Learning', 'Electronic Mail Archive Ledger'],
    ans: 1,
    exp: 'In the novel, "EMAL" is the dreaded acronym for Examination Malpractice, an infraction carrying summary expulsion.'
  },
  {
    q: 'Salma’s character arc at the university is defined by which progression?',
    opts: ['From humble studiousness to high-stakes political office', 'From arrogant, flashy vanity and deceit to bitter humiliation and genuine moral redemption', 'From athletic stardom to international coaching', 'From artistic poverty to aristocratic marriage'],
    ans: 1,
    exp: 'Salma begins as a proud, ostentatious girl who looks down on others, suffers traumatic betrayal, and eventually learns humility and discipline.'
  },
  {
    q: 'In the story of the town of Lafayette, what title was given to the notorious woman of easy virtue?',
    opts: ['Queen Amina', 'Magajiya', 'Iya Oloja', 'Hajiya Maigoro'],
    ans: 1,
    exp: 'Magajiya is the influential, independent woman in the Lafayette tale who headed the entertainment quarter.'
  },
  {
    q: 'Why did Salma refuse to lodge in the university hostel during her initial days on campus?',
    opts: ['The hostel rooms were flooded by heavy rain', 'She considered the hostel too dirty, congested, and beneath her self-styled elite lifestyle', 'Her parents forbade her from living on campus', 'The hostel fees were three times higher than private apartments'],
    ans: 1,
    exp: 'Salma’s vanity led her to rent an expensive off-campus flat, wanting to project an image of wealth and autonomy.'
  },
  {
    q: 'What ordeal does Salma suffer during the night ride with the men in the Mercedes car?',
    opts: ['They kidnap her for ransom in the forest', 'She is subjected to terrifying reckless driving and moral peril when she realizes the men are dangerous and intoxicated', 'They steal her luggage and leave her at the airport', 'She is arrested by police at a border checkpoint'],
    ans: 1,
    exp: 'The ride turns into a nightmare as the men speed dangerously and pressure her into immoral conduct, forcing her to flee.'
  },
  {
    q: 'Who among Salma’s roommates at the university was known for her quiet Christian devotion and medical studies?',
    opts: ['Tomi', 'Ngozi', 'Ada', 'Bimbo'],
    ans: 1,
    exp: 'Ngozi is depicted as a studious, quiet Christian student from the eastern part of Nigeria who avoided campus vanity.'
  },
  {
    q: 'How did Salma become embroiled in the examination malpractice committee crisis?',
    opts: ['She stole question papers from the HOD’s office', 'She hired a mercenary student to write her General Studies paper, and the imposter was arrested with her ID card', 'She brought a textbook into the physics hall', 'She dictated answers through a megaphone'],
    ans: 1,
    exp: 'Desperate and unprepared, Salma paid another student to impersonate her, but both were apprehended by invigilators.'
  },
  {
    q: 'What moral lesson does Ummi emphasize to Omar before he departs for the university campus?',
    opts: ['That money and connections are the only guarantees of graduation', 'That university offers unprecedented freedom, and only self-discipline and moral grounding protect a student from ruin', 'That he should avoid making friends with anyone from other states', 'That he must never join any student academic societies'],
    ans: 1,
    exp: 'Ummi teaches that the university is a "life changer" because it provides total personal freedom; without self-control, freedom leads to destruction.'
  },
  {
    q: 'In the story of the French teacher and Bint in Chapter 1, how does Bint smartly turn the tables on her teacher?',
    opts: ['By reciting the French national anthem', 'By asking the teacher a basic French question in front of the class that he could not answer', 'By complaining to the school principal', 'By skipping French classes entirely'],
    ans: 1,
    exp: 'Young Bint demonstrated that her teacher only knew basic greetings by asking him a question in conversational French that exposed his superficial knowledge.'
  },
  {
    q: 'What is the ultimate fate of Salma after her expulsion and subsequent encounter with Habib and the dishonest lawyer?',
    opts: ['She becomes a wealthy senator in the federal capital', 'She experiences spiritual and emotional remorse, changes her ways, and resolves to rebuild her life on honest principles', 'She vanishes without a trace into neighboring Cameroon', 'She starts an illicit examination syndicate of her own'],
    ans: 1,
    exp: 'Salma’s bitter experiences break her vanity, prompting genuine transformation and moral humility.'
  }
];

lcQuestions.forEach(item => {
  addQ({
    id: `lc-q${qCounter}`,
    novelId: LC_ID,
    novelTitle: LC_TITLE,
    question: item.q,
    options: item.opts,
    correctAnswer: item.ans,
    explanation: item.exp,
    topic: 'The Life Changer Core Themes',
    difficulty: 'medium',
    year: '2023/2024'
  });
});

// -------------------------------------------------------------
// 3. SECOND CLASS CITIZEN (Buchi Emecheta)
// -------------------------------------------------------------
const SCC_ID = 'second-class-citizen';
const SCC_TITLE = 'Second Class Citizen';

const sccQuestions = [
  {
    q: 'In Buchi Emecheta’s "Second Class Citizen", what is Adah’s ultimate childhood dream that sustains her through poverty in Lagos?',
    opts: ['To marry a wealthy merchant', 'To travel to the United Kingdom and achieve a university education as a writer', 'To become a market queen in Obalende', 'To join the British colonial civil service'],
    ans: 1,
    exp: 'Adah is driven by the persistent dream of going to the United Kingdom, viewing it as the pinnacle of intellectual freedom and social mobility.'
  },
  {
    q: 'Why did Adah marry Francis Obi at an early age in Lagos?',
    opts: ['Out of romantic infatuation', 'To secure personal autonomy and an address that would enable her to work and study independently', 'Because her parents arranged the marriage against her will', 'To inherit Francis’s large cocoa estate'],
    ans: 1,
    exp: 'Adah married Francis primarily as a pragmatic step to obtain the social freedom required to earn money and pursue her UK ambitions.'
  },
  {
    q: 'Upon arriving in London, what shocking reality shatters Adah’s idealized vision of England?',
    opts: ['The extreme tropical heat', 'The grim cold, dilapidated slums, racial prejudice, and her relegation to the status of a "second class citizen"', 'The absence of libraries and books', 'The immediate arrest of all immigrants'],
    ans: 1,
    exp: 'Adah discovers that Britain is not the paradise she imagined, but a cold, hostile society where black immigrants face systemic racial prejudice.'
  },
  {
    q: 'How does Francis treat Adah once they settle in London?',
    opts: ['He works tirelessly to support her writing career', 'He becomes abusive, idle, and patriarchal, living off her earnings as a librarian while abusing her physically and emotionally', 'He returns to Nigeria to study medicine', 'He buys her a house in Kensington'],
    ans: 1,
    exp: 'Francis abandons his studies and relies on Adah’s librarian salary while abusing her and demanding traditional submissiveness.'
  },
  {
    q: 'What destructive act by Francis represents the ultimate emotional betrayal of Adah’s intellectual aspirations?',
    opts: ['He sells her wedding jewelry', 'He burns the handwritten manuscript of her first novel, "The Bride Price"', 'He reports her to the immigration police', 'He throws her books into the Thames river'],
    ans: 1,
    exp: 'Francis spitefully burns the manuscript of "The Bride Price", attempting to destroy her intellectual identity and soul.'
  },
  {
    q: 'What is Adah’s final decision at the climax of "Second Class Citizen"?',
    opts: ['She returns to Lagos in defeat', 'She leaves Francis permanently, choosing poverty and single motherhood in order to preserve her dignity, children, and writer’s vocation', 'She forgives Francis and buys him a new printing press', 'She abandons her children at a foster home'],
    ans: 1,
    exp: 'Adah demonstrates immense resilience, walking away from Francis’s abusive tyranny to build an independent life for herself and her children.'
  }
];

sccQuestions.forEach(item => {
  addQ({
    id: `scc-q${qCounter}`,
    novelId: SCC_ID,
    novelTitle: SCC_TITLE,
    question: item.q,
    options: item.opts,
    correctAnswer: item.ans,
    explanation: item.exp,
    topic: 'Second Class Citizen Themes',
    difficulty: 'medium',
    year: '2024'
  });
});

// -------------------------------------------------------------
// 4. THE LION AND THE JEWEL (Wole Soyinka)
// -------------------------------------------------------------
const LJ_ID = 'the-lion-and-the-jewel';
const LJ_TITLE = 'The Lion and the Jewel';

const ljQuestions = [
  {
    q: 'In Wole Soyinka’s "The Lion and the Jewel", the character of Lakunle represents:',
    opts: ['Traditional Yoruba communal royalty', 'Superficial, half-baked Western modernity and pedantry', 'A ruthless colonial tax collector', 'A mystical village sorcerer'],
    ans: 1,
    exp: 'Lakunle, the village school teacher, embodies a naive, superficial assimilation of Western ideals that ignores authentic cultural roots.'
  },
  {
    q: 'Why does Sidi refuse to marry Lakunle at the beginning of the play?',
    opts: ['She is already engaged to the village blacksmith', 'He refuses to pay the traditional bride price, calling it a barbaric custom', 'He is much older than her father', 'Her mother forbids the union'],
    ans: 1,
    exp: 'Sidi insists that marrying without a bride price would shame her as an unvalued woman, whereas Lakunle refuses on theoretical modern grounds.'
  },
  {
    q: 'What event dramatically inflates Sidi’s pride and makes her look down on Baroka?',
    opts: ['Winning the village wrestling tournament', 'The arrival of a glossy magazine featuring her captivating photographs on the cover and centerfold', 'Receiving a scholarship to study in Lagos', 'Inheriting her uncle’s palm wine plantation'],
    ans: 1,
    exp: 'The magazine photos make Sidi a celebrated beauty whose fame surpasses that of Baroka, feeding her vanity.'
  },
  {
    q: 'What cunning stratagem does the Bale, Baroka, employ to conquer Sidi’s resistance?',
    opts: ['He threatens to burn down her family compound', 'He spreads a false rumor of his own impotence through his head wife Sadiku', 'He offers to double the bride price in gold coins', 'He challenges Lakunle to a public duel'],
    ans: 1,
    exp: 'Baroka cunningly feigns impotence, knowing Sadiku will boast of it to Sidi, luring Sidi into his palace in a false sense of security.'
  },
  {
    q: 'At the end of "The Lion and the Jewel", who does Sidi choose to marry and why?',
    opts: ['Lakunle, because he is young and educated', 'Baroka, because he possesses genuine viral strength, cunning, and living vitality that outmatch Lakunle’s hollow book knowledge', 'She rejects both men and moves to Ibadan', 'She marries the photographer who took her picture'],
    ans: 1,
    exp: 'Sidi chooses Baroka, finding real potency, pride, and authority in the Bale compared to Lakunle’s sterile words.'
  }
];

ljQuestions.forEach(item => {
  addQ({
    id: `lj-q${qCounter}`,
    novelId: LJ_ID,
    novelTitle: LJ_TITLE,
    question: item.q,
    options: item.opts,
    correctAnswer: item.ans,
    explanation: item.exp,
    topic: 'The Lion and the Jewel Themes',
    difficulty: 'medium',
    year: '2024'
  });
});

console.log('Total Generated Stored Novel Questions:', bank.length);

const outPath = path.join(__dirname, '../src/data/novels/jambNovelQuestionsBank.ts');
const fileContent = `/**
 * JAMB NOVEL QUESTIONS BANK
 * Official stored question bank for JAMB Prescribed Novels:
 * 1. The Lekki Headmaster (Kabir Alabi Garba) - Current UTME Compulsory Novel
 * 2. The Life Changer (Khadija Abubakar Jalli) - UTME Revision & Novel Study
 * 3. Second Class Citizen (Buchi Emecheta) - Literature-in-English African Prose
 * 4. The Lion and the Jewel (Wole Soyinka) - Literature-in-English African Drama
 * 
 * Every question has authentic text, 4 multiple-choice options, verified answer, and step-by-step syllabus explanation.
 */

export interface StoredNovelQuestion {
  id: string;
  novelId: string;
  novelTitle: string;
  chapterNumber?: number;
  chapterIndex?: number;
  chapterTitle?: string;
  questionNumber: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  topic: string;
  difficulty: 'easy' | 'medium' | 'hard';
  year: string;
}

export const JAMB_NOVEL_QUESTIONS_BANK: StoredNovelQuestion[] = ${JSON.stringify(bank, null, 2)};

export function getStoredQuestionsForNovel(novelId: string, chapterNumber?: number): StoredNovelQuestion[] {
  const norm = novelId.toLowerCase().trim();
  return JAMB_NOVEL_QUESTIONS_BANK.filter(q => {
    const matchNovel = q.novelId.toLowerCase() === norm || q.novelTitle.toLowerCase().includes(norm) || norm.includes(q.novelId.toLowerCase());
    if (!matchNovel) return false;
    if (chapterNumber !== undefined && chapterNumber !== 0 && (chapterNumber as any) !== 'all') {
      return q.chapterNumber === chapterNumber;
    }
    return true;
  });
}
`;

fs.writeFileSync(outPath, fileContent, 'utf-8');
console.log('Successfully wrote to', outPath);
