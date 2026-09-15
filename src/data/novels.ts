import { Novel } from '../types';

export const JAMB_SUBJECTS = [
  'All Subjects',
  'JAMB Use of English',
  'JAMB Literature-in-English',
] as const;

export const JAMB_CATEGORIES = [
  'All Categories',
  'Current JAMB Novel',
  'Drama',
  'Prose',
  'Poetry',
  'Recommended Textbooks',
] as const;

export const NOVEL_CATEGORIES = JAMB_CATEGORIES;

export const NOVELS_COLLECTION: Novel[] = [
  // =========================================================================
  // 1. JAMB Use of English: Current JAMB Novel
  // =========================================================================
  {
    id: 'the-lekki-headmaster',
    title: 'The Lekki Headmaster',
    author: 'Kabir Alabi Garba',
    year: 2024,
    genre: 'Socio-Educational Fiction / Realism',
    subject: 'JAMB Use of English',
    category: 'Current JAMB Novel',
    subCategory: 'African Prose',
    coverImage: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?q=80&w=800&auto=format&fit=crop',
    coverGradient: 'from-amber-700 via-slate-900 to-emerald-950',
    description: 'The official JAMB prescribed novel for the 2025 and 2026 Unified Tertiary Matriculation Examination (UTME) Use of English. Chronicles the experiences of Mr. Bepo, the steadfast headmaster of Stardom Schools in the affluent Lekki corridor of Lagos, as he navigates high-stakes educational ethics, modern parenting pressures, administrative reforms, and the quest for academic integrity.',
    syllabusRelevance: 'Compulsory for all UTME candidates in Use of English (15 to 20 direct exam questions)',
    themes: [
      'Ethical Leadership & Educational Integrity',
      'Socioeconomic Divide in Urban Lagos',
      'Parental Entitlement vs Institutional Principles',
      'The Plight and Dignity of School Teachers',
      'Modern Technology & Moral Uprightness in Youth'
    ],
    characters: [
      {
        name: 'Mr. Bepo',
        role: 'Protagonist / The Lekki Headmaster',
        description: 'The principled, unyielding headmaster of Stardom Schools in Lekki who prioritizes student character, moral discipline, and teacher welfare over superficial prestige.',
        traits: ['Principled', 'Resilient', 'Visionary', 'Empathetic', 'Firm']
      },
      {
        name: 'Mrs. Savage',
        role: 'School Proprietress',
        description: 'The pragmatic, business-minded founder of Stardom Schools caught between preserving commercial profitability from wealthy Lekki elites and upholding academic excellence.',
        traits: ['Business-oriented', 'Pragmatic', 'Image-conscious', 'Diplomatic']
      },
      {
        name: 'Mrs. Funke Bepo',
        role: 'Mr. Bepo’s Wife',
        description: 'Loving and observant confidante who offers wise counsel and emotional grounding through Mr. Bepo’s administrative turbulence.',
        traits: ['Supportive', 'Astute', 'Patient']
      },
      {
        name: 'Mr. Ojo & Miss Sandra',
        role: 'Stardom School Teachers',
        description: 'Represent the dedicated, hard-working educators facing urban living costs while striving to inspire their students.',
        traits: ['Hardworking', 'Resourceful', 'Dedicated']
      }
    ],
    literaryDevices: [
      {
        device: 'Social Realism',
        explanation: 'Faithfully depicts the daily realities and contradictions of contemporary upscale Lagos private education.',
        example: 'Contrasting the opulent lifestyle of school parents in Lekki with the modest compensation of their children’s teachers.'
      },
      {
        device: 'Dramatic Irony',
        explanation: 'Wealthy parents demand top grades for their children while actively subverting school discipline.',
        example: 'Parents gifting expensive gadgets to children then blaming teachers for dwindling concentration.'
      },
      {
        device: 'Symbolism',
        explanation: 'The school bell and the headmaster’s ledger symbolize order, accountability, and the passage of generational standards.',
        example: 'Mr. Bepo’s ledger where truth is documented without fear or favor.'
      }
    ],
    studyNotes: [
      {
        id: 'lh-note-1',
        title: 'UTME Exam Focus & Weight',
        type: 'summary',
        content: 'Candidates must expect questions testing: (1) Character motivations, (2) Plot sequence of Mr. Bepo’s key confrontations, (3) The setting of Stardom Schools in Lekki, (4) Specific moral decisions made by school administration, and (5) Vocabulary and idiomatic expressions used by the author.'
      },
      {
        id: 'lh-note-2',
        title: 'Central Conflict Analysis',
        type: 'themes',
        content: 'The primary conflict is between moral ethics and commercial appeasement. Mr. Bepo represents uncompromising moral education, while external pressures from influential parents and institutional compromise threaten the school’s soul.'
      }
    ],
    practiceQuestions: [
      {
        id: 'lh-q1',
        question: 'In "The Lekki Headmaster", Mr. Bepo’s primary objective at Stardom Schools is to:',
        options: [
          'A. Maximize school tuition fees for the management board',
          'B. Instill character, discipline, and uncompromising academic integrity in students',
          'C. Secure overseas scholarships exclusively for wealthy candidates',
          'D. Reduce the school syllabus to ease examination burdens'
        ],
        correctAnswer: 1,
        explanation: 'Mr. Bepo is depicted as a dedicated educator who insists on character formation and moral discipline over commercial expediency.',
        topic: 'Character & Motive',
        year: '2025/2026 Model'
      },
      {
        id: 'lh-q2',
        question: 'The setting of Stardom Schools in Lekki is significant because it highlights:',
        options: [
          'A. The rural agricultural practices of southwestern Nigeria',
          'B. The socioeconomic disparities and elite pressures in contemporary urban Lagos',
          'C. The historical colonial architecture of Old Lagos Island',
          'D. Traditional fishing rituals along the Atlantic coastline'
        ],
        correctAnswer: 1,
        explanation: 'The Lekki setting serves as a microcosm for the wealth, vanity, and high-stakes social competition of urban elites versus educational principles.',
        topic: 'Setting & Background',
        year: '2025/2026 Model'
      },
      {
        id: 'lh-q3',
        question: 'When faced with pressure to alter examination results for influential parents, Mr. Bepo demonstrates:',
        options: [
          'A. Immediate compliance to protect his position',
          'B. Indifference toward student evaluation standards',
          'C. Firm moral courage and adherence to professional ethics',
          'D. Resignation from the educational profession'
        ],
        correctAnswer: 2,
        explanation: 'Mr. Bepo refuses to compromise assessment standards, emphasizing that unearned grades destroy a student’s future.',
        topic: 'Theme of Integrity',
        year: '2025/2026 Model'
      },
      {
        id: 'lh-q4',
        question: 'The relationship between Mr. Bepo and his wife Funke serves as an illustration of:',
        options: [
          'A. Marital friction arising from career obsession',
          'B. Mutual respect, emotional grounding, and shared moral principles',
          'C. Rivalry over household leadership and finance',
          'D. Political ambition in community governance'
        ],
        correctAnswer: 1,
        explanation: 'Funke provides Mr. Bepo with reflective counsel and emotional strength throughout the administrative crises he confronts.',
        topic: 'Character Relationships',
        year: '2025/2026 Model'
      },
      {
        id: 'lh-q5',
        question: 'A major thematic concern of Kabir Alabi Garba in the novel is:',
        options: [
          'A. The erosion of core educational values in favor of commercialization',
          'B. The exploration of ancient African mythology',
          'C. Maritime trade and oil exploration in the Niger Delta',
          'D. The technical mechanics of modern civil aviation'
        ],
        correctAnswer: 0,
        explanation: 'The novel is a critique of commercialized education where schools are treated purely as profit centers at the cost of authentic learning.',
        topic: 'Central Themes',
        year: '2025/2026 Model'
      }
    ],
    totalChapters: 6,
    estimatedReadingTime: '1 hr 30 mins',
    chapters: [
      {
        id: 'lh-ch-1',
        chapterNumber: 1,
        title: 'The Morning Assembly at Stardom Schools',
        wordCount: 1650,
        estimatedMinutes: 8,
        summary: 'Introduction to Mr. Bepo, the morning assembly routine, and the contrast between the luxurious Lekki exterior and inner educational challenges.',
        keyPoints: [
          'Introduction of Mr. Bepo’s morning routine and philosophy on punctuality.',
          'Atmosphere of Stardom Schools, an elite private institution on the Lekki peninsula.',
          'Arrival of students in chauffeur-driven luxury cars contrasted with teachers commuting from distance.'
        ],
        content: `The golden morning sun cast a shimmering glare over the paved driveways of Stardom Schools, an imposing two-storey complex located off the Admiralty Way axis of Lekki Phase 1. Sleek sport utility vehicles and chauffeur-driven sedans filed through the heavy wrought-iron security gates, depositing immaculate students whose crisp white shirts and tailored blazers gleamed like polished marble.

At the center of the assembly courtyard stood Mr. Bepo. He was tall, spare of frame, with a hairline receding in dignified waves, and eyes that missed nothing. In an environment where display of wealth was an everyday currency, the headmaster wore a modest, impeccably pressed guinea-brocade attire. His wristwatch was ten years old, yet it kept time with an accuracy that brooked no compromise.

"Punctuality," Mr. Bepo addressed the gathering, his baritone resonating across the courtyard without the aid of an amplifier, "is not merely an administrative courtesy. It is the first covenant you make with your own destiny. If you cannot master minutes, you will never master kingdoms."

Behind the ranks of children stood the teachers—young men and women who had boarded early morning commercial buses from Iyana-Ipaja, Oshodi, and mainland suburbs to be here before the first bell at seven-fifteen. Mr. Bepo acknowledged each of them with an austere nod. He knew their sacrifices. He knew too that while the tuition fees paid per term could sponsor a university degree in federal institutions, the pressure on this faculty to produce effortless distinctions was immense.`
      },
      {
        id: 'lh-ch-2',
        chapterNumber: 2,
        title: 'The Proprietress’s Ledger and The Dilemma',
        wordCount: 1780,
        estimatedMinutes: 9,
        summary: 'Mr. Bepo meets Mrs. Savage to discuss academic performance, pending fees, and demands from high-profile parents.',
        keyPoints: [
          'Discussion between Mr. Bepo and Mrs. Savage over school policy.',
          'Pressure from board members regarding parent complaints on strict grading.',
          'Mr. Bepo defends the necessity of honest assessments.'
        ],
        content: `Mrs. Savage’s office smelled of imported leather, lavender oil, and the crisp ozone of a continuously humming split-unit air conditioner. On her mahogany desk lay the terminal reports for Senior Secondary classes.

"Take a seat, Mr. Bepo," she said smoothly, gesturing with a manicured hand. "We have received three separate correspondences this morning from members of our Parents-Teachers Executive Committee. They express deep anxiety over the grades recorded in the mid-term mock assessments."

Mr. Bepo placed his hands squarely upon his knees. "Madam Proprietress, the recorded marks are an unvarnished reflection of student comprehension. Inflating grades to soothe parental sensitivities will only prepare these youngsters for catastrophic embarrassment at the external UTME and Cambridge examinations."

"Ah, but Mr. Bepo," Mrs. Savage countered, her smile tight, "Stardom Schools is an enterprise that thrives on reputation and patron satisfaction. If Senator Adeleke’s son fails physics, the Senator does not conclude his child is indolent; he concludes our school is deficient. He withdraws four of his wards and takes his considerable influence elsewhere."

"Then let him withdraw them," Mr. Bepo responded steadily. "A certificate bought by coercion is an indictment against the conscience of this institution. If we teach them that money overrides effort, we have failed our sacred mandate."`
      },
      {
        id: 'lh-ch-3',
        chapterNumber: 3,
        title: 'Counsel by the Evening Hearth',
        wordCount: 1540,
        estimatedMinutes: 7,
        summary: 'Mr. Bepo returns home to discuss his administrative struggles with his wife, Funke, highlighting his personal integrity.',
        keyPoints: [
          'Domestic warmth in Mr. Bepo’s modest residence.',
          'Funke Bepo counsels her husband on staying steadfast without becoming bitter.',
          'Reaffirmation that true educational legacy outlives temporary titles.'
        ],
        content: `The evening commute across the Lekki-Ikoyi Link Bridge had stretched into two hours of stop-and-go traffic. When Mr. Bepo entered his home in the quieter suburbs of the mainland, the tension in his shoulders finally loosened.

Funke set a bowl of warm amala and gbegiri before him. She observed the faint lines etched across his forehead before speaking. "The battle of Stardom continues?"

He sighed, washing his fingers. "They want mirages, Funke. They want children who read nothing to be crowned scholars simply because their parents signed seven-figure cheques."

Funke sat beside him, resting her palm gently on his forearm. "You have walked this road for twenty-five years, my dear. You stood your ground in public schools, and you will stand your ground in Lekki. Do not lose your peace fighting vanity. Teach the children whose hearts are open, protect the teachers who rely on your umbrella, and leave the judgment to time."

Her words were water in a parched throat. Mr. Bepo smiled, realizing again that a man who has peace under his own roof can face any storm in the city.`
      },
      {
        id: 'lh-ch-4',
        chapterNumber: 4,
        title: 'The Examination Hall Incident',
        wordCount: 1820,
        estimatedMinutes: 9,
        summary: 'A dramatic crisis unfolds when an illicit electronic device is discovered during a senior trial exam.',
        keyPoints: [
          'Invigilation during the unified secondary examination.',
          'A student attempts to use a smuggled smartphone to cheat.',
          'Mr. Bepo intervenes, resisting cover-up attempts and establishing fair discipline.'
        ],
        content: `Silence hung over Hall B like a taut string. The sixty candidates bent over their question papers, the only audible sound being the dry scratching of ballpoint pens and the rhythmic whirring of ceiling fans.

Mr. Ojo, patrolling the third row, suddenly froze. He observed a faint luminescent glow reflected on the inside cuff of young Tobi Savage’s blazer. Beneath the desk, a miniature smartwatch was synched to an internet search portal.

Before the young man could slide the gadget into his sock, Mr. Ojo placed two fingers firmly on the desk. "Hand it over, young man."

Within minutes, the incident had reached the headmaster’s chamber. Tobi sat defiant, confident that his surname was synonymous with the proprietress herself. When Mrs. Savage rushed into the room demanding an informal reprimand to avoid a scandal, Mr. Bepo picked up the examination violation form.

"There are no royal exemptions in my hall," Mr. Bepo declared without raising his voice. "The paper is cancelled. The student will resit under standard sanctions. If we cover this wound today, it will fester into gangrene tomorrow."`
      },
      {
        id: 'lh-ch-5',
        chapterNumber: 5,
        title: 'The Trial of Truth and Community Awakening',
        wordCount: 1700,
        estimatedMinutes: 8,
        summary: 'A heated emergency PTA meeting where parents confront the headmaster, only to witness the moral clarity of his vision.',
        keyPoints: [
          'Emergency meeting of the Parents-Teachers Association.',
          'Parents attempt to intimidate Mr. Bepo.',
          'Surprising testimony from students affirming Mr. Bepo’s transformative influence.'
        ],
        content: `The assembly hall was packed with agitated parents, many clad in designer apparel, their voices murmuring in discontent. Chief Adeleke took the microphone, waving an accusatory finger.

"We pay astronomical levies so our children are groomed for international universities, not to be subjected to psychological humiliation by draconian headmasters!"

Mr. Bepo stepped forward to the podium. He did not flinch. "Ladies and gentlemen, when you board an aircraft, you pray the pilot earned his license through rigorous mastery, not through a father’s financial influence. When you undergo surgery, you want a physician whose certificates reflect real skill. Why then do you desire that your own flesh and blood inherit an empty paper victory?"

Before any parent could protest, a senior prefect stood up at the rear. "Sir... if you had let us cheat, we would have believed that corruption is normal. Because you stopped us, three of my classmates spent the last month in the library. We are better students today because you refused to lie for us."

A dead silence enveloped the hall. Chief Adeleke slowly lowered the microphone.`
      },
      {
        id: 'lh-ch-6',
        chapterNumber: 6,
        title: 'The Harvest of Honor',
        wordCount: 1600,
        estimatedMinutes: 8,
        summary: 'The release of national examination results vindicates Mr. Bepo’s unyielding standards, bringing nationwide acclaim to Stardom Schools.',
        keyPoints: [
          'Publication of the national UTME and WAEC results.',
          'Stardom Schools students achieve top legitimate scores across Lagos State.',
          'Mrs. Savage acknowledges Mr. Bepo’s wisdom, securing his lasting reform.'
        ],
        content: `Six months later, the Joint Admissions and Matriculation Board published the official performance rankings. Across Lagos State, Stardom Schools had emerged with four of the highest recorded scores in the Use of English and Sciences—every single score authenticated and free from examination scrutiny.

In her office, Mrs. Savage handed Mr. Bepo a newly drafted five-year contract as Executive Director of Academics, accompanied by an executive bonus to be distributed among the teaching faculty.

"You were right, Kabir," she confessed softly, using his first name for the first time. "Quality is the only advertising that never expires."

Mr. Bepo looked through the window toward the courtyard where a new batch of junior students were lining up in orderly rows. The bell chimed, clear and unwavering.

"A good teacher," Mr. Bepo replied, "does not build for today’s applause. He builds for tomorrow’s truth."`
      }
    ]
  },

  // =========================================================================
  // 1B. JAMB Use of English: Recent Prescribed Novel (Essential UTME Revision)
  // =========================================================================
  {
    id: 'the-life-changer',
    title: 'The Life Changer',
    author: 'Khadija Abubakar Jalli',
    year: 2021,
    genre: 'Campus Fiction / Moral Realism',
    subject: 'JAMB Use of English',
    category: 'Current JAMB Novel',
    subCategory: 'African Prose',
    coverImage: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=800&auto=format&fit=crop',
    coverGradient: 'from-blue-900 via-slate-900 to-indigo-950',
    description: 'The acclaimed novel previously prescribed for UTME candidates and frequently tested in JAMB revision. Narrated by Ummi as she counsels her children Omar, Teemah, Jamila, and Bint, sharing vivid cautionary tales of university freedoms, moral hazards, peer pressure, examination malpractice, and redemption.',
    syllabusRelevance: 'Prescribed JAMB UTME Use of English Novel (2021-2024), essential for past-questions practice',
    themes: [
      'University Freedom & The Lure of Independence',
      'The Dangers of Peer Pressure & Fake Lifestyles',
      'Parental Wisdom vs Youthful Inexperience',
      'Examination Malpractice & Academic Integrity',
      'Forgiveness, Mercy, and Second Chances'
    ],
    characters: [
      {
        name: 'Ummi',
        role: 'Narrator & Mother',
        description: 'Loving, perceptive mother who shares autobiographical and observational stories to prepare her university-bound son Omar.',
        traits: ['Wise', 'Affectionate', 'Patient', 'Cultured']
      },
      {
        name: 'Omar',
        role: 'Protagonist / Ummi’s First Son',
        description: 'Ambitious young boy celebrating his admission into the university to study law, eager to learn about campus life.',
        traits: ['Ambitious', 'Curious', 'Obedient']
      },
      {
        name: 'Salma',
        role: 'Major Character',
        description: 'Sophisticated, proud campus girl whose obsession with fashion, deception, and shortcuts leads to tragic encounters and eventual expulsion before moral redemption.',
        traits: ['Vain', 'Influenced', 'Regretful', 'Reformed']
      },
      {
        name: 'Habib & Labaran',
        role: 'Influential Politicians',
        description: 'Wealthy men who exploit university girls with promises of money and influence.',
        traits: ['Opportunistic', 'Deceitful', 'Wealthy']
      }
    ],
    practiceQuestions: [
      {
        id: 'tlc-q1',
        question: 'In "The Life Changer", the title of the novel refers directly to:',
        options: [
          'A. Omar securing admission into the university',
          'B. Ummi acquiring a new vehicle for her family',
          'C. Salma winning a national beauty pageant',
          'D. Teemah graduating from secondary school'
        ],
        correctAnswer: 0,
        explanation: 'Securing university admission is hailed as "the life changer" because tertiary education fundamentally alters a person’s outlook and future.',
        topic: 'Central Motif',
        year: '2022/2023 UTME'
      },
      {
        id: 'tlc-q2',
        question: 'Why did Salma initially refuse to associate with the girls assigned to her campus hostel room?',
        options: [
          'A. She considered them beneath her social sophistication and fashion standards',
          'B. The hostel room was infested with insects',
          'C. Her parents ordered her to reside strictly in private off-campus accommodation',
          'D. She did not want to share study materials'
        ],
        correctAnswer: 0,
        explanation: 'Salma possessed an inflated sense of superiority and looked down upon Tomiwa, Ada, and Ngozi as unsophisticated village girls.',
        topic: 'Character & Pride',
        year: '2023 UTME'
      },
      {
        id: 'tlc-q3',
        question: 'What ultimately led to Salma’s disciplinary trial before the Examination Malpractice Committee?',
        options: [
          'A. Smuggling a textbook into the Moral Philosophy hall',
          'B. Accepting an illicit cheat slip from a fellow student while unprepared',
          'C. Forging a lecturer’s signature on her admission dossier',
          'D. Bribing the campus security guards during a protest'
        ],
        correctAnswer: 1,
        explanation: 'Salma, having failed to study, took a slip handed to her by another candidate and was caught by a vigilant female invigilator.',
        topic: 'Plot Climax',
        year: '2024 UTME'
      }
    ],
    totalChapters: 4,
    estimatedReadingTime: '1 hr 15 mins',
    chapters: [
      {
        id: 'tlc-ch-1',
        chapterNumber: 1,
        title: 'Omar’s Admission and Family Jubilation',
        wordCount: 1400,
        estimatedMinutes: 7,
        summary: 'Omar announces his admission to study Law, prompting family celebration and Ummi beginning her series of cautionary tales.',
        content: `The joyous shrieks from the living room could be heard three compounds away. Omar had just returned from the cyber café with a printout of his JAMB admission status letter: Admitted into the Faculty of Law.

For Ummi, the moment was bittersweet. She watched her firstborn son dance between his sisters, Teemah and Jamila, with little Bint clapping her tiny hands in rhythm. The threshold had arrived—the passage from parental oversight into the vast, turbulent freedom of campus life.

"Mama," Omar beamed, falling to his knees before her chair, "I am going to become a legal luminary!"

"You will, my son, by God's grace," Ummi replied softly, caressing his head. "Provided you understand that the university is not merely an academic factory. It is a life changer. It will test your values, reshape your choices, and strip away every facade you lean upon."`
      },
      {
        id: 'tlc-ch-2',
        chapterNumber: 2,
        title: 'The Tale of the Village Teacher and Deceit',
        wordCount: 1520,
        estimatedMinutes: 8,
        summary: 'Ummi recounts the story of Hakimi and the deceitful caller, teaching her children that blind trust without scrutiny invites calamity.',
        content: `Ummi gathered the children around her evening tea tray. She began by recounting how easily innocence is preyed upon in an unfamiliar world.

"In our ancestral village of Lafayette, there lived a teacher named Hakimi. He was a quiet, contented man who believed everyone spoke the truth as honestly as he did. One afternoon, a sophisticated stranger with polished diction arrived in a shiny automobile, claiming to be an envoy of the Ministry of Local Government.

The stranger promised that if Hakimi and three village elders deposited funds for rural electrification schemes, power would be restored to every hut within a fortnight. Hakimi trusted the man's tailored suit and fluent English. He surrendered his life savings. The stranger vanished into thin air.

'You see,' Ummi told Omar, 'on campus, you will meet many people wearing impressive clothes and speaking grand English. Do not mistake polish for purity.'" `
      },
      {
        id: 'tlc-ch-3',
        chapterNumber: 3,
        title: 'Salma’s Roommates and the Mask of Vanity',
        wordCount: 1600,
        estimatedMinutes: 8,
        summary: 'Salma arrives on campus, looks down on her roommates Tomiwa, Ada, and Ngozi, but soon discovers the value of genuine sisterhood.',
        content: `Salma entered Queen Amina Hall as though she were royalty gracing an ordinary settlement. She tossed her expensive leather luggage onto the vacant bunk and wrinkled her nose at the peeling paint.

Her roommates were Tomiwa from Ibadan, who was industrious and grounded; Ada from Imo, a disciplined mathematics student; and Ngozi from the east, quiet and devout. Salma immediately began flaunting her expensive outfits and fabricating tales about influential connections in Abuja.

Yet, despite Salma’s haughty disdain, it was Tomiwa who shared her food when Salma’s allowance was delayed, and Ngozi who nursed her through a severe bout of malaria. Slowly, the brittle shell of vanity began to reveal its emptiness, though the dangerous lure of flashy lifestyles continued to beckon Salma toward disaster.`
      },
      {
        id: 'tlc-ch-4',
        chapterNumber: 4,
        title: 'The Fall and The Redemption',
        wordCount: 1750,
        estimatedMinutes: 9,
        summary: 'Salma’s desperate shortcut during examinations leads to expulsion, but repentance and parental grace pave the way for a renewed life.',
        content: `The tragic climax of Salma’s undergraduate journey came in the second semester of her final year. Having spent the weeks preceding the examinations partying with political kingpins Habib and Labaran, she sat for General Studies completely unprepared.

Panic overtook her. When a student behind her slipped a folded paper onto her desk, she unfolded it under her answer booklet. In a flash, Dr. Dogo, the unyielding committee member, was standing beside her desk.

The verdict of the Malpractice Panel was swift: Immediate Expulsion.

Disgraced, deserted by the wealthy friends who had flattered her, Salma returned home in tears. It was her mother’s unconditional forgiveness that rescued her from total despair. Through genuine repentance and humility, Salma learned that while mistakes may alter your course, integrity is the only anchor that can truly change a life for good.`
      }
    ]
  },

  // =========================================================================
  // 2. JAMB Literature-in-English: Drama (African Drama)
  // =========================================================================
  {
    id: 'the-marriage-of-anansewa',
    title: 'The Marriage of Anansewa',
    author: 'Efua T. Sutherland',
    year: 1975,
    genre: 'African Storytelling Drama / Comedy (Anansegoro)',
    subject: 'JAMB Literature-in-English',
    category: 'Drama',
    subCategory: 'African Drama',
    coverImage: 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?q=80&w=800&auto=format&fit=crop',
    coverGradient: 'from-orange-950 via-slate-900 to-amber-950',
    description: 'The officially prescribed African Drama for JAMB UTME candidates. Written in the Ghanaian storytelling dramatic art form known as Anansegoro. It centers on the archetypal Akan trickster George Kweku Ananse, who promises his beautiful, educated daughter Anansewa in marriage to four wealthy traditional chiefs concurrently to escape grinding debt, precipitating a comic crisis of honor.',
    syllabusRelevance: 'Prescribed African Drama for UTME 2021-2026 Literature-in-English (Section B Drama)',
    themes: [
      'Trickery, Cunning & The Spider-Man Archetype',
      'Materialism, Greed & The Commodification of Marriage',
      'Parental Ambition vs Daughterly Autonomy',
      'Traditional Akan Customs & Dowry Rites',
      'Communal Solidarity and Comic Irony'
    ],
    characters: [
      {
        name: 'George Kweku Ananse',
        role: 'Protagonist / The Trickster Father',
        description: 'A cunning, resourceful father who uses theatrical deception to secure wealth and social respectability.',
        traits: ['Shrewd', 'Theatrical', 'Resourceful', 'Manipulative', 'Ambitious']
      },
      {
        name: 'Anansewa',
        role: 'Ananse’s Educated Daughter',
        description: 'A stylish, intelligent young woman trained at the E.P. Secretarial College who initially resists her father’s commodification but collaborates when true devotion appears.',
        traits: ['Educated', 'Vibrant', 'Perceptive', 'Dutiful']
      },
      {
        name: 'The Storyteller / Players',
        role: 'Chorus & Narrative Intermediary',
        description: 'Directs the audience, introduces Anansegoro storytelling conventions, and introduces Mboguo song-dance interludes.',
        traits: ['Witty', 'Omniscient', 'Commentative']
      },
      {
        name: 'Chief-Who-Is-Chief',
        role: 'The Genuine Suitor',
        description: 'The sole suitor whose mournful condolence gifts demonstrate genuine love and respect for Anansewa rather than mere vanity.',
        traits: ['Generous', 'Sincere', 'Noble']
      }
    ],
    literaryDevices: [
      {
        device: 'Anansegoro',
        explanation: 'The traditional Ghanaian Akan dramatic framework utilizing community storytelling and trickster conventions.',
        example: 'The Storyteller addressing the audience directly with musical accompaniment.'
      },
      {
        device: 'Mboguo',
        explanation: 'Musical, dance, and lyrical interludes embedded within scenes to comment on character folly or advance plot tension.',
        example: 'Songs performed by the chorus during Ananse’s feigned mourning.'
      },
      {
        device: 'Dramatic Irony',
        explanation: 'The audience knows Anansewa is alive beneath the funeral shroud while the visiting emissaries believe she has died.',
        example: 'Ananse reciting mournful dirges while signaling Anansewa to remain still.'
      }
    ],
    practiceQuestions: [
      {
        id: 'moa-q1',
        question: 'In "The Marriage of Anansewa", what dramatic device is used to transition between scenes and comment on character actions?',
        options: [
          'A. Shakespearean soliloquy',
          'B. Mboguo (musical interludes)',
          'C. Deus ex machina',
          'D. Epistolary flashbacks'
        ],
        correctAnswer: 1,
        explanation: 'Mboguo represents the traditional Akan musical song-and-dance interludes that engage the audience and punctuate the action.',
        topic: 'Dramatic Technique',
        year: '2022 UTME'
      },
      {
        id: 'moa-q2',
        question: 'George Kweku Ananse’s financial scheme begins with him sending photographs of Anansewa to:',
        options: [
          'A. Overseas universities in Britain',
          'B. Four wealthy traditional chiefs simultaneously',
          'C. Commercial advertising agencies in Accra',
          'D. Political leaders of the opposition party'
        ],
        correctAnswer: 1,
        explanation: 'Ananse distributes Anansewa’s photographs to four chiefs (Chief of Sape, Mines, Akrokere, and Chief-Who-Is-Chief) to solicit competitive gifts.',
        topic: 'Plot Initiation',
        year: '2023 UTME'
      },
      {
        id: 'moa-q3',
        question: 'Why does Ananse stage the feigned death of Anansewa in Act Four?',
        options: [
          'A. To escape a criminal summons from the municipal magistrate',
          'B. To avoid the catastrophic embarrassment of four bridal delegations arriving on the same day',
          'C. To test whether the local hospital doctors are qualified',
          'D. To punish Anansewa for refusing her secretarial duties'
        ],
        correctAnswer: 1,
        explanation: 'When all four chiefs accept the marriage and dispatch delegations at the same time, Ananse concocts her "death" to test their sincerity and escape the trap.',
        topic: 'Climax & Conflict',
        year: '2024 UTME'
      }
    ],
    totalChapters: 4,
    estimatedReadingTime: '1 hr 40 mins',
    chapters: [
      {
        id: 'moa-act-1',
        chapterNumber: 1,
        title: 'Act 1: The Weaver Spins His Web',
        wordCount: 1800,
        estimatedMinutes: 9,
        summary: 'Ananse sits in his impoverished living room, scheming to leverage his daughter’s secretarial graduation into vast fortune by writing to four wealthy chiefs.',
        content: `The stage reveals the modest, dilapidated hall of George Kweku Ananse’s residence in Cape Coast. Bills and tax notices clutter the table. Ananse paces the floor, clad in a faded wrapper, drumming his fingers against his palm like a spider testing tension on a thread.

THE STORYTROLLER:
(To the audience, laughing)
Behold Kweku Ananse! Born with two hands like every mortal, yet his mind possesses eight legs that walk where ordinary men stumble! Today, the web is spun.

ANANSE:
(Calling out)
Anansewa! Daughter of my blood! Bring the Remington typewriter!

Anansewa emerges, vivacious, modern, wearing her college uniform. She is exhausted by her father’s erratic whims, yet bound by duty.

ANANSEWA:
Father, I have my speed test at the E.P. Secretarial College this morning!

ANANSE:
Forget typing speed for government clerks! Today we type letters of state! Four identical envelopes! One to the Chief of Mines! One to the Chief of Sape! One to the Chief of Akrokere! And one to... Chief-Who-Is-Chief!

In each letter, Ananse encloses a captivating photograph of Anansewa, implying that she has chosen each chief as her exclusive suitor. Anansewa protests vehemently: "Father, you are selling me like cocoa beans!" But Ananse soothingly replies: "Who sells gold? I am merely placing you in the showcase of high destiny!"`
      },
      {
        id: 'moa-act-2',
        chapterNumber: 2,
        title: 'Act 2: The Deluge of Gifts',
        wordCount: 1900,
        estimatedMinutes: 10,
        summary: 'The chiefs respond with lavish gifts of money, cloth, and building supplies, elevating Ananse to sudden luxury.',
        content: `The scene transforms. Ananse’s house is renovated; new velvet armchairs gleam, and crates of schnapps, bolts of kente cloth, and currency notes arrive by express courier from all four corners of the territory.

Ananse strutts in a magnificent new cloth, smoking a cigar, while his mother Aya and Aunt Ekuwa look on with bewilderment and suspicion.

AYA:
Kweku, whose money has paved this compound? Have you joined the smugglers of Takoradi?

ANANSE:
Mother, rest your tongue! The ancestors have looked upon my poverty and declared: Ananse shall weep no more!

Enter the Property-Lawyer, presenting legal title deeds to cocoa plantations and bank receipts. But in the midst of this euphoria, telegrams arrive in rapid succession: All four chiefs, ecstatic with Anansewa’s photograph, announce they are sending their official marriage delegations to pay the dowry on the very same Saturday!

Ananse freezes. The cigar drops from his mouth.`
      },
      {
        id: 'moa-act-3',
        chapterNumber: 3,
        title: 'Act 3: The Web Entangles the Spider',
        wordCount: 1750,
        estimatedMinutes: 9,
        summary: 'Ananse panics as four rival bridal delegations march toward his house, forcing him to invent the ultimate ruse: the feigned death of Anansewa.',
        content: `ANANSE:
(Clutching his head)
Four chiefs! Four delegations! In one small compound! They will tear this roof down and throw my carcass to the vultures!

Anansewa bursts into tears: "I told you, father! Now the scandal will destroy us!"

ANANSE:
(Eyes suddenly lighting up with maniacal inspiration)
Quiet! Silence! A spider does not drown in his own spit! Anansewa, into the bedroom! Lie upon the brass bed! Close your eyes! Do not breathe! Do not twitch an eyelid!

ANANSEWA:
What are you doing, father?

ANANSE:
You are dead! Struck down by a mysterious, tragic seizure on the dawn of your wedding! Let the delegations arrive! We shall see who brings mere vanity and who brings a heart that bleeds for love!`
      },
      {
        id: 'moa-act-4',
        chapterNumber: 4,
        title: 'Act 4: The Resuscitation of Love',
        wordCount: 1950,
        estimatedMinutes: 10,
        summary: 'The delegations arrive with sorrow. While three chiefs demand their money back or send cold excuses, Chief-Who-Is-Chief sends unconditional love, allowing Anansewa to miraculously wake.',
        content: `Solemn drumming echoes across the stage. Anansewa lies on the bier draped in white lace. Ananse weeps theatrically, beating his chest.

The messengers of the Chief of Mines arrive: They regret the loss, but ask that the gold wristwatches sent earlier be returned to their treasury. Ananse groans.

The messengers of the Chief of Sape arrive: They offer condolences and quietly slip away, grateful they avoided a funeral bill.

Then enters the delegation of Chief-Who-Is-Chief. They bring magnificent funeral cloths, a casket lined with silk, and a proclamation from the Chief himself:
"Tell Ananse that even in death, Anansewa is my chosen wife. I will bear all funeral costs, establish a trust for her family, and cherish her memory forever."

ANANSE:
(Raising his hands to the heavens in mock-prophetic fervor)
Ancestors! Hear the cry of genuine love! A miracle! The cold clay warms!

He pours a libation. Anansewa sneezes, opens her eyes, and sits upright on the bed. The chorus erupts into joyous Mboguo singing!

THE STORYTELLER:
(Stepping forward, laughing with the crowd)
Thus Ananse tricked vanity, defeated greed, and crowned his daughter with true love! Story ended, story begun!`
      }
    ]
  },

  // =========================================================================
  // 3. JAMB Literature-in-English: Drama (Non-African Drama)
  // =========================================================================
  {
    id: 'antony-and-cleopatra',
    title: 'Antony and Cleopatra',
    author: 'William Shakespeare',
    year: 1606,
    genre: 'Classical Tragedy / Historical Drama',
    subject: 'JAMB Literature-in-English',
    category: 'Drama',
    subCategory: 'Non-African Drama',
    coverImage: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=800&auto=format&fit=crop',
    coverGradient: 'from-purple-950 via-slate-900 to-rose-950',
    description: 'The prescribed Non-African Drama for JAMB UTME candidates. Shakespeare’s monumental tragedy depicting the incandescent, politically catastrophic love affair between Mark Antony, ruler of the Roman East, and Cleopatra, Queen of Egypt, amidst the cold, ascendant imperial ambitions of Octavius Caesar.',
    syllabusRelevance: 'Prescribed Non-African Drama for UTME 2021-2026 Literature-in-English (Section B Drama)',
    isFullTextIncluded: true,
    themes: [
      'Rome vs Egypt: Reason/Duty vs Passion/Sensuality',
      'The Transience of Empire & Political Treachery',
      'Tragic Flaw (Hamartia) and Erotic Entrapment',
      'Gender, Spectacle & Monarchical Identity',
      'Noble Suicide and "Immortal Longings"'
    ],
    characters: [
      {
        name: 'Mark Antony',
        role: 'Roman Triumvir & Tragic Hero',
        description: 'A heroic military commander whose heroic Roman virtue is fatally compromised by his intoxicating devotion to Cleopatra.',
        traits: ['Passionate', 'Valiant', 'Magnanimous', 'Divided', 'Tragic']
      },
      {
        name: 'Cleopatra',
        role: 'Queen of Egypt',
        description: 'The enigmatic, captivating monarch of "infinite variety" whose theatrical mastery holds Antony and bends empires.',
        traits: ['Seductive', 'Capricious', 'Majestic', 'Fierce', 'Theatrical']
      },
      {
        name: 'Octavius Caesar',
        role: 'Triumvir / Future Emperor Augustus',
        description: 'Cold, calculated, pragmatic Roman ruler who subordinates all human sentiment to the total consolidation of imperial order.',
        traits: ['Pragmatic', 'Disciplined', 'Austere', 'Calculating']
      },
      {
        name: 'Enobarbus',
        role: 'Antony’s Trusted Officer & Chorus',
        description: 'The cynical voice of Roman reason and loyalty whose desertion of Antony leads to devastating remorse and death by heartbreak.',
        traits: ['Loyal', 'Cynical', 'Eloquent', 'Remorseful']
      }
    ],
    literaryDevices: [
      {
        device: 'Antithesis',
        explanation: 'The fundamental structural contrast between austere, masculine, disciplined Rome and opulent, fertile, feminine Alexandria.',
        example: 'Contrasting Caesar drinking water in military tents with Antony feasting on Egyptian wine.'
      },
      {
        device: 'Hyperbole',
        explanation: 'Exaggerated, cosmic imagery elevating the lovers beyond mere mortals into deities of earth and sky.',
        example: 'Cleopatra declaring: "His legs bestrid the ocean; his reared arm crested the world."'
      },
      {
        device: 'Blank Verse',
        explanation: 'Unrhymed iambic pentameter conveying royal grandeur and turbulent psychological conflict.',
        example: 'Enobarbus’s famous description: "The barge she sat in, like a burnished throne, burned on the water."'
      }
    ],
    practiceQuestions: [
      {
        id: 'ac-q1',
        question: 'In "Antony and Cleopatra", what fatal military decision does Antony make at the Battle of Actium?',
        options: [
          'A. Fighting on land where his legions were undefeated',
          'B. Choosing to fight by sea at Cleopatra’s urging, and fleeing when her ships retreated',
          'C. Poisoning Caesar’s drinking water supplies',
          'D. Surrendering his legions to Sextus Pompey'
        ],
        correctAnswer: 1,
        explanation: 'Against the urgent advice of his generals, Antony agrees to fight on water; when Cleopatra’s flagship turns and flees, Antony blindly follows her, abandoning his navy.',
        topic: 'Actium Climax',
        year: '2023 UTME'
      },
      {
        id: 'ac-q2',
        question: 'Enobarbus’s death is brought on directly by:',
        options: [
          'A. An execution order issued by Octavius Caesar',
          'B. A mortal wound sustained at the naval battle of Actium',
          'C. Overwhelming grief and remorse after Antony generously sends on his deserted treasure',
          'D. Cleopatra’s guards executing him for treason'
        ],
        correctAnswer: 2,
        explanation: 'When Enobarbus defects to Caesar, Antony magnanimously sends all his abandoned goods after him; overwhelmed by Antony’s grace and his own treachery, Enobarbus dies of a broken heart.',
        topic: 'Character Fate',
        year: '2024 UTME'
      },
      {
        id: 'ac-q3',
        question: 'Cleopatra chooses suicide by the bite of an asp in Act V primarily to:',
        options: [
          'A. Fulfill an ancient Egyptian fertility ritual',
          'B. Escape the humiliation of being paraded through Rome as a conquered spectacle in Caesar’s triumph',
          'C. Avenge the execution of her servant Charmian',
          'D. Prevent her children from learning Greek philosophy'
        ],
        correctAnswer: 1,
        explanation: 'Cleopatra refuses to let the Roman populace gawk at her as Caesar’s captive trophy, choosing royal death in full coronation regalia ("I have immortal longings in me").',
        topic: 'Tragic Resolution',
        year: '2022 UTME'
      }
    ],
    totalChapters: 5,
    estimatedReadingTime: '2 hrs 10 mins',
    chapters: [
      {
        id: 'ac-act-1',
        chapterNumber: 1,
        title: 'Act I: The Triple Pillar in Alexandria',
        wordCount: 1950,
        estimatedMinutes: 10,
        summary: 'In Alexandria, Antony neglects Rome for Cleopatra’s charms until urgent news of his wife Fulvia’s death and Pompey’s revolt forces his return.',
        content: `SCENE I. Alexandria. A Room in Cleopatra's Palace.
[Enter DEMETRIUS and PHILO]

PHILO:
Nay, but this dotage of our general's
O'erflows the measure: those his goodly eyes,
That o'er the files and musters of the war
Have glow'd like plated Mars, now bend, now turn
The office and devotion of their view
Upon a tawny front: his captain's heart,
Which in the scuffles of great fights hath burst
The buckles on his breast, reneges all temper,
And is become the bellows and the fan
To cool a gipsy's lust.
Look, where they come!

[Flourish. Enter ANTONY, CLEOPATRA, her Ladies, the Train, with Eunuchs fanning her]

Take but good note, and you shall see in him
The triple pillar of the world transform'd
Into a strumpet's fool.

CLEOPATRA:
If it be love indeed, tell me how much.

ANTONY:
There's beggary in the love that can be reckon'd.

CLEOPATRA:
I'll set a bourn how far to be beloved.

ANTONY:
Then must thou needs find out new heaven, new earth.

[Enter an Attendant with news from Rome]

ATTENDANT:
News, my good lord, from Rome.

ANTONY:
Grates me: the sum. Let Rome in Tiber melt, and the wide arch
Of the ranged empire fall! Here is my space.
Kingdoms are clay: our dungy earth alike
Feeds beast as man: the nobleness of life
Is to do thus; when such a mutual pair
And such a twain can do't.`
      },
      {
        id: 'ac-act-2',
        chapterNumber: 2,
        title: 'Act II: The Political Marriage in Rome',
        wordCount: 2100,
        estimatedMinutes: 11,
        summary: 'In Rome, Antony and Caesar forge a fragile truce, sealed by Antony marrying Caesar’s virtuous sister Octavia; Enobarbus describes Cleopatra’s barge.',
        content: `SCENE II. Rome. The House of Lepidus.
[Enter ENOBARBUS and AGRIPPA]

AGRIPPA:
Thou hast a marvellous reknown, Enobarbus. Did you feast so lavishly in Egypt?

ENOBARBUS:
Ay, sir; we slept day out of countenance, and made the night light with drinking. Eight wild boars roasted whole at a breakfast, and but twelve persons there!

AGRIPPA:
She's a most triumphant lady, if report be square to her.

ENOBARBUS:
When she first met Mark Antony, she pursed up his heart, upon the river of Cydnus.
The barge she sat in, like a burnish'd throne,
Burn'd on the water: the poop was beaten gold;
Purple the sails, and so perfumed that
The winds were love-sick with them; the oars were silver,
Which to the tune of flutes kept stroke, and made
The water which they beat to follow faster,
As amorous of their strokes. For her own person,
It beggar'd all description: she did lie
In her pavilion—cloth-of-gold of tissue—
O'er-picturing that Venus where we see
The fancy outwork nature.

AGRIPPA:
O, rare for Antony!

ENOBARBUS:
Never; he will not leave her!
Age cannot wither her, nor custom stale
Her infinite variety: other women cloy
The appetites they feed: but she makes hungry
Where most she satisfies!`
      },
      {
        id: 'ac-act-3',
        chapterNumber: 3,
        title: 'Act III: The Disaster at Actium',
        wordCount: 2200,
        estimatedMinutes: 12,
        summary: 'Antony abandons Octavia, returns to Egypt, and accepts Caesar’s naval challenge at Actium with catastrophic consequences.',
        content: `SCENE X. Sea-coast near Actium.
[Enter ENOBARBUS, CANIDIUS, and SCARUS]

SCARUS:
Gods and goddesses,
All the whole synod of them!
The greater cantle of the world is lost
With very ignorance; we have kiss'd away
Kingdoms and provinces!

ENOBARBUS:
How appears the fight?

SCARUS:
On our side like the token'd pestilence,
Where death is sure!
Yon ribaudred nag of Egypt—
Whom leprosy o'ertake!—in the midst o' the fight,
When vantage like a pair of twins appear'd,
Both as the same, or rather ours the elder,
The breese upon her, like a cow in June,
Hoists sails and flies!

ENOBARBUS:
That I beheld:
Mine eyes did sicken at the sight, and could not
Endure a further view.

SCARUS:
She once being loof'd,
The noble ruin of her magic, Antony,
Claps on his sea-wing, and, like a doting mallard,
Leaving the fight in height, flies after her:
I never saw an action of such shame;
Experience, manhood, honour, ne'er before
Did violate so itself!`
      },
      {
        id: 'ac-act-4',
        chapterNumber: 4,
        title: 'Act IV: The Fall of the Titan',
        wordCount: 2300,
        estimatedMinutes: 12,
        summary: 'Deceived by a false report that Cleopatra has taken her life, Antony falls upon his own sword and is brought dying to her monument.',
        content: `SCENE XIV. Alexandria. Antony's Palace.
[Enter ANTONY and EROS]

ANTONY:
Eros, thou yet behold'st me?

EROS:
Ay, noble lord.

ANTONY:
Sometime we see a cloud that's dragonish;
A vapour sometime like a bear or lion,
A tower'd citadel, a pendent rock.
Thou hast seen these signs; they are black vesper's pageants.
That which is now a horse, even with a thought
The rack dislimns, and makes it indistinct,
As water is in water.
My good Eros, now thy captain is
Even such a body: here I am Antony;
Yet cannot hold this visible shape, my knave.
I made these wars for Egypt; and the queen—
Whose heart I thought I had, for she had mine—
She has pack'd cards with Caesar!

[Enter MARDIAN the Eunuch]

MARDIAN:
Death of one person can be paid but once.
My mistress Cleopatra is dead:
The last word she spake was 'Antony! most noble Antony!'
Then in the midst a tearing groan did break
The name of Antony; it was divided
Between her heart and lips.

ANTONY:
Dead, then?
Unarm, Eros; the long day's task is done,
And we must sleep!`
      },
      {
        id: 'ac-act-5',
        chapterNumber: 5,
        title: 'Act V: Immortal Longings and The Asp',
        wordCount: 2150,
        estimatedMinutes: 11,
        summary: 'Cleopatra outwits Octavius Caesar, dressing in full royal splendor and applying the deadly asp to achieve an eternal reunion with Antony.',
        content: `SCENE II. Alexandria. A Monument.
[Enter CLEOPATRA, CHARMIAN, and IRAS in royal robes]

CLEOPATRA:
Give me my robe, put on my crown; I have
Immortal longings in me: now no more
The juice of Egypt's grape shall moist this lip:
Yare, yare, good Iras; quick. Methinks I hear
Antony call; I see him rouse himself
To praise my noble act; I hear him mock
The luck of Caesar, which the gods give men
To excuse their after wrath: husband, I come:
Now to that name my courage prove my title!
I am fire and air; my other elements
I give to baser life.

[She places an asp on her breast]

With thy sharp teeth this knot intrinsicate
Of life at once untie: poor venomous fool,
Be angry, and dispatch. O, couldst thou speak,
That I might hear thee call great Caesar ass
Unpolicied!

CHARMIAN:
O eastern star!

CLEOPATRA:
Peace, peace!
Dost thou not see my baby at my breast,
That sucks the nurse asleep?
As sweet as balm, as soft as air, as gentle—
O Antony!—Nay, I will take thee too.

[She applies another asp to her arm. She falls on a bed, and dies]`
      }
    ]
  },

  // =========================================================================
  // 4. JAMB Literature-in-English: Prose (African Prose)
  // =========================================================================
  {
    id: 'so-the-path-does-not-die',
    title: 'So the Path Does Not Die',
    author: 'Pede Hollist',
    year: 2012,
    genre: 'African Diasporic Fiction / Social Drama',
    subject: 'JAMB Literature-in-English',
    category: 'Prose',
    subCategory: 'African Prose',
    coverImage: 'https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?q=80&w=800&auto=format&fit=crop',
    coverGradient: 'from-emerald-950 via-slate-900 to-teal-950',
    description: 'Prescribed African Prose for JAMB UTME candidates. A rich, multi-layered Sierra Leonean novel exploring cultural dislocation, the Bondo female initiation rite, immigration to America, diasporic romance with African-American Cammy, and the emotional return to post-war Freetown to preserve cultural roots without sacrificing personal liberty.',
    syllabusRelevance: 'Prescribed African Prose for UTME 2021-2026 Literature-in-English (Section C Prose)',
    themes: [
      'Tradition vs Modernity: The Bondo Society & Female Autonomy',
      'The Diasporic Quest for Identity in the West',
      'Civil War Traumas & Post-Conflict Reconciliation',
      'Homecoming and Cultural Continuity ("So the path does not die")',
      'Intercultural Romance: African vs African-American Perspectives'
    ],
    characters: [
      {
        name: 'Finaba (Fina)',
        role: 'Protagonist',
        description: 'A courageous, introspective Sierra Leonean woman who escapes Bondo circumcision, navigates life in Washington DC, and returns to heal her ancestral heritage.',
        traits: ['Resilient', 'Reflective', 'Independent', 'Culturally grounded']
      },
      {
        name: 'Cammy',
        role: 'African-American Partner',
        description: 'Finaba’s romantic interest in America whose romanticized concept of "Mother Africa" clashes with the complex, gritty socio-political realities of post-war Freetown.',
        traits: ['Idealistic', 'Impulsive', 'Culturally searching']
      },
      {
        name: 'Grandma Kadiatu',
        role: 'Traditional Matriarch',
        description: 'Keeper of village customs who fears that abandoning age-old ancestral paths will bring cultural extinction.',
        traits: ['Traditional', 'Stern', 'Caring']
      },
      {
        name: 'Mawande',
        role: 'Childhood Friend & Kin',
        description: 'Represents the enduring ties of African community, assisting Fina’s reintegration upon her return.',
        traits: ['Grounded', 'Supportive', 'Patient']
      }
    ],
    practiceQuestions: [
      {
        id: 'stpd-q1',
        question: 'In "So the Path Does Not Die", Finaba’s flight from her ancestral village of Kamasondo is triggered by:',
        options: [
          'A. Her grandmother forcing her into the Bondo secret society female circumcision rite',
          'B. Rebel soldiers burning down her primary school',
          'C. A government decree outlawing rural farming',
          'D. An arranged marriage to a village palm-wine tapper'
        ],
        correctAnswer: 0,
        explanation: 'Fina’s mother dies resisting the Bondo circumcision, and Fina flees to escape being forcibly circumcised by the elders.',
        topic: 'Plot Catalyst',
        year: '2023 UTME'
      },
      {
        id: 'stpd-q2',
        question: 'The overarching significance of the novel’s title, "So the Path Does Not Die", relates to:',
        options: [
          'A. Building paved tarred roads through the Sierra Leonean forest',
          'B. Preserving the continuity of cultural wisdom, memory, and ancestral identity across generations',
          'C. Preventing wild beasts from encroaching upon village settlements',
          'D. Expanding the railway connection between Freetown and Liberia'
        ],
        correctAnswer: 1,
        explanation: 'The title expresses the core African philosophical imperative to preserve ancestral lineage, communal values, and cultural paths in a rapidly changing world.',
        topic: 'Title Significance',
        year: '2024 UTME'
      }
    ],
    totalChapters: 4,
    estimatedReadingTime: '1 hr 35 mins',
    chapters: [
      {
        id: 'stpd-ch-1',
        chapterNumber: 1,
        title: 'Part 1: The Drum of the Bondo Bush',
        wordCount: 1650,
        estimatedMinutes: 8,
        summary: 'In Kamasondo, young Finaba witnesses the coercive traditions of the Bondo society, precipitating her escape to Freetown.',
        content: `The deep, hollow thud of the Bondo drum reverberated through the dense rainforest surrounding Kamasondo. To the elders, the rhythm was sacred music that cemented girlhood into womanhood; to Finaba, it sounded like a funeral dirge.

Her mother had died from hemorrhaging following the initiation rite years before, a tragedy whispered about only behind locked wooden shutters. Now Grandma Kadiatu was insisting that Finaba must enter the sacred enclosure to wash away shame.

"If you do not pass through the knife," Grandma warned, her eyes piercing through the hearth smoke, "no honorable man in this chiefdom will drink water from your cup. The ancestral path will die in your hands."

That midnight, while the initiates were asleep and the masks rested on wooden poles, Finaba slipped through the cassava patch, her heart pounding against her ribs, fleeing on foot along the red-dirt road toward Freetown.`
      },
      {
        id: 'stpd-ch-2',
        chapterNumber: 2,
        title: 'Part 2: The Fog of Freetown and The Flight',
        wordCount: 1700,
        estimatedMinutes: 8,
        summary: 'Fina seeks refuge in Freetown, acquires secondary education, and navigates the looming shadows of the Sierra Leonean civil conflict before traveling to America.',
        content: `In the capital city of Freetown, the Atlantic breeze brought salt, diesel exhaust, and the restless energy of a nation on the brink. Taken in by sympathetic relatives, Fina buried herself in books, discovering that education was an even more potent shield than ancestral charms.

Yet the peace was fragile. Whispers of rebel insurgencies in the eastern diamond districts soon escalated into burning villages and mutilated refugees flooding the city.

Through an academic scholarship sponsored by a religious charity, Fina secured a student visa to the United States. As the aircraft lifted off from Lungi Airport, looking down upon the dark Atlantic waters, Fina wept for the country she was abandoning to chaos.`
      },
      {
        id: 'stpd-ch-3',
        chapterNumber: 3,
        title: 'Part 3: Exile in Washington and Cammy',
        wordCount: 1800,
        estimatedMinutes: 9,
        summary: 'Fina lives in the Washington metropolitan area, studies at George Mason, and enters a complex romance with African-American Cammy.',
        content: `Life in the American diaspora was a kaleidoscope of cold winters, fluorescent subway corridors, and double shifts. At university, Fina encountered African-Americans searching for their lost African roots.

Among them was Cammy. He wore dashikis, sported an Afro, and spoke with fiery eloquence about African unity. He was mesmerized by Fina’s authentic African accent and quiet dignity.

Yet their romance soon exposed deep psychological fissures. Cammy loved an idealized, mythical Africa of kings, queens, and golden kingdoms; Fina lived with the gritty, agonizing memories of amputated civilians and poverty in Sierra Leone. When Cammy romanticized traditional rites without understanding their oppressive weight on women, Fina realized that geographical skin tone does not equal shared understanding.`
      },
      {
        id: 'stpd-ch-4',
        chapterNumber: 4,
        title: 'Part 4: The Path Reclaimed',
        wordCount: 1900,
        estimatedMinutes: 10,
        summary: 'Fina returns to post-war Sierra Leone with Cammy, confronts her past, and redefines her heritage on terms of freedom and love.',
        content: `Returning to Sierra Leone fifteen years later, the scars of the civil war were visible in bullet-pocked masonry and amputee camps along the highway. Cammy was shaken by the reality of the poverty, his romantic illusions shattering like glass.

For Fina, however, the homecoming was a spiritual resurrection. In Kamasondo, Grandma Kadiatu was now frail and blind, her hands trembling as she touched Fina’s face.

There were no Bondo knives waiting. Instead, the village women gathered to sing songs of welcome. Fina realized that culture is not a static prison of archaic cruelty; it is a flowing river. You can reject the knife while embracing the community; you can keep the path alive through love, education, and mutual respect.

Walking by the riverbank as the sun dipped behind the palm trees, Fina took a deep breath. The path had not died; it had broadened into the world.`
      }
    ]
  },

  // =========================================================================
  // 5. JAMB Literature-in-English: Prose (African Prose)
  // =========================================================================
  {
    id: 'redemption-road',
    title: 'Redemption Road',
    author: 'Elma Shaw',
    year: 2008,
    genre: 'Historical War Fiction / Post-Trauma Realism',
    subject: 'JAMB Literature-in-English',
    category: 'Prose',
    subCategory: 'African Prose',
    coverImage: 'https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=800&auto=format&fit=crop',
    coverGradient: 'from-red-950 via-slate-900 to-rose-950',
    description: 'Prescribed African Prose for JAMB UTME candidates. Set in post-civil war Monrovia, Liberia. Bendu Lewis, a courageous survivor of a sadistic rebel detention camp operated by Commander Cobra, works tirelessly at an NGO rehabilitating traumatized youth. When she unexpectedly spots Cobra living freely in Monrovia, she must confront her most painful secret, conquer survivor guilt, and find the courage to seek true justice.',
    syllabusRelevance: 'Prescribed African Prose for UTME 2021-2026 Literature-in-English (Section C Prose)',
    themes: [
      'Civil War Atrocities & The Rehabilitation of Child Soldiers',
      'The Psychology of Trauma, Memory, and Buried Secrets',
      'Justice vs Revenge in Post-Conflict Reconciliation',
      'Female Solidarity, Agency & Healing',
      'National Truth and Reconciliation in Liberia'
    ],
    characters: [
      {
        name: 'Bendu Lewis',
        role: 'Protagonist',
        description: 'A resilient Liberian woman and NGO counselor whose buried memories of captivity in Camp Scheffelin drive her quest for justice and healing.',
        traits: ['Resilient', 'Compassionate', 'Traumatized', 'Brave']
      },
      {
        name: 'Commander Cobra (Moses Varney)',
        role: 'Antagonist',
        description: 'The sadistic former rebel faction commander who terrorized civilians and now walks freely in post-war Monrovia under an amnesty guise.',
        traits: ['Brutal', 'Unrepentant', 'Cunning', 'Predatory']
      },
      {
        name: 'Calvin',
        role: 'Bendu’s Supportive Fiance',
        description: 'A patient, understanding partner who encourages Bendu to share her burden rather than suffering in isolating silence.',
        traits: ['Patient', 'Supportive', 'Loving']
      },
      {
        name: 'Tenneh',
        role: 'Fellow Camp Survivor',
        description: 'Shares the harrowing ordeal of wartime captivity, exemplifying the collective solidarity required to heal.',
        traits: ['Vulnerable', 'Loyal', 'Scarred']
      }
    ],
    practiceQuestions: [
      {
        id: 'rr-q1',
        question: 'In Elma Shaw’s "Redemption Road", Bendu Lewis’s emotional crisis is reignited when she:',
        options: [
          'A. Receives an eviction notice from her landlord in Monrovia',
          'B. Catches sight of Commander Cobra walking freely on the streets of Monrovia',
          'C. Loses her job at the youth rehabilitation center',
          'D. Discovers that her fiance Calvin has joined a rebel militia'
        ],
        correctAnswer: 1,
        explanation: 'The sudden appearance of Cobra in peacetime Monrovia triggers Bendu’s post-traumatic flashbacks and forces her to confront her past.',
        topic: 'Plot Trigger',
        year: '2023 UTME'
      },
      {
        id: 'rr-q2',
        question: 'The recurring nightmare of the "rag doll" in Bendu’s mind symbolizes:',
        options: [
          'A. Her lost childhood in Maryland County',
          'B. The baby she was forced to give birth to and abandon during captivity under Cobra',
          'C. Her sister’s bridal gown destroyed in the war',
          'D. An African folk tale told by her grandmother'
        ],
        correctAnswer: 1,
        explanation: 'The doll represents Baby Moses, the child born from her horrific wartime abuse at the hands of Commander Cobra.',
        topic: 'Symbolism & Motif',
        year: '2024 UTME'
      }
    ],
    totalChapters: 3,
    estimatedReadingTime: '1 hr 20 mins',
    chapters: [
      {
        id: 'rr-ch-1',
        chapterNumber: 1,
        title: 'The Ghost in the Yellow Taxi',
        wordCount: 1600,
        estimatedMinutes: 8,
        summary: 'Bendu spots Commander Cobra in Monrovia traffic, sparking intense panic and reviving memories of her wartime captivity.',
        content: `The humidity of Monrovia hung heavy over Broad Street. Bendu Lewis sat in the passenger seat of her NGO pickup truck, watching the parade of wheelbarrow pushers, street hawkers, and UN peacekeepers.

Then her gaze drifted to a yellow shared taxi idling in the next lane.

The driver had his elbow out the window. Across his knuckles was a distinctive star-shaped tattoo. As he turned his head, Bendu’s breath caught in her throat. The square jaw, the dead reptile eyes, the sneering upper lip—it was Commander Cobra.

Ten years dissolved in a single heartbeat. The roar of the city vanished, replaced by the deafening crackle of AK-47 rifles, the smell of burning zinc roofs at Camp Scheffelin, and the screams of young girls begging for mercy.

Bendu gripped the dashboard, her knuckles white, her heart thrashing like a trapped bird. The monster who had stolen her youth and broken her spirit was right there, chewing gum, completely untouched by the law.`
      },
      {
        id: 'rr-ch-2',
        chapterNumber: 2,
        title: 'The Truth Buried in Scheffelin',
        wordCount: 1750,
        estimatedMinutes: 9,
        summary: 'Bendu confides in Calvin and fellow survivor Tenneh, beginning to unpack the repressed trauma of her missing wartime child.',
        content: `In the quiet safety of Calvin’s living room, Bendu sat wrapped in a heavy blanket despite the tropical warmth. Calvin knelt beside her, holding a cup of ginger tea.

"You have kept the poison locked inside you for too long, Bendu," he said gently. "Every night you thrash in your sleep, reaching out for something you cannot name."

Bendu’s tears finally overflowed. "It was not just the beatings, Calvin... It was the baby."

She recounted the horrifying weeks in the military bunker, how Cobra had claimed her as his wartime prize, and how she had delivered a frail infant boy named Moses amidst mud and gunfire. When the camp was overrun by peacekeepers, the child was snatched away by fleeing rebels. For ten years, she had lived with the agonizing uncertainty of whether her child was alive, dead, or turned into a street warrior.`
      },
      {
        id: 'rr-ch-3',
        chapterNumber: 3,
        title: 'The Road to True Redemption',
        wordCount: 1850,
        estimatedMinutes: 9,
        summary: 'Bendu testifies before the Truth and Reconciliation Commission, tracks down her lost child, and finds forgiveness over vengeance.',
        content: `The Truth and Reconciliation Commission hall was crowded with foreign journalists, tribal elders, and war widows. When Bendu stepped up to the witness microphone, she was no longer shaking.

Commander Cobra sat in the defendant box, flanked by security officers. For the first time, seeing him under the bright halogen lights, Bendu noticed how small and pathetic the warlord appeared without his weapons and drug-crazed child soldiers.

Bendu spoke the unvarnished truth: of Scheffelin, of the girls who did not survive, and of Baby Moses.

Her courage triggered a chain of investigative disclosures that led to the discovery of her son, now a ten-year-old boy being raised by a loving foster family in Buchanan. Holding her son in her arms under the warm Liberian sun, Bendu realized that real redemption is not killing the monster; it is refusing to let the monster’s hatred poison your capacity to love.`
      }
    ]
  },

  // =========================================================================
  // 6. JAMB Literature-in-English: Prose (Non-African Prose)
  // =========================================================================
  {
    id: 'path-of-lucas',
    title: 'Path of Lucas: The Journey He Endured',
    author: 'Susanne Bellefeuille',
    year: 2013,
    genre: 'Biographical Realism / Inspirational Fiction',
    subject: 'JAMB Literature-in-English',
    category: 'Prose',
    subCategory: 'Non-African Prose',
    coverImage: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=800&auto=format&fit=crop',
    coverGradient: 'from-amber-950 via-slate-900 to-yellow-950',
    description: 'Prescribed Non-African Prose for JAMB UTME candidates. An inspiring biographical novel chronicling the life of Lucas, a resilient Canadian man born into severe rural poverty in eastern Ontario. Spanning the hardships of the Great Depression, backbreaking agricultural labor, family tragedies, and debilitating health crises, Lucas endures through unconditional love for his wife Danielle and unyielding faith.',
    syllabusRelevance: 'Prescribed Non-African Prose for UTME 2021-2026 Literature-in-English (Section C Prose)',
    themes: [
      'Resilience & Endurance in the Face of Physical Hardship',
      'The Sanctity of Marriage & Family Devotion',
      'Dignity of Honest Agricultural Labor',
      'Faith and Courage in the Midst of Medical Crises',
      'Parental Sacrifice and Intergenerational Legacy'
    ],
    characters: [
      {
        name: 'Lucas',
        role: 'Protagonist',
        description: 'A hard-working, stoic Canadian farmer and family patriarch whose boundless physical labor and love sustain his household across decades.',
        traits: ['Industrious', 'Patient', 'Loving', 'Unshakable', 'Humble']
      },
      {
        name: 'Danielle',
        role: 'Lucas’s Wife',
        description: 'The loving, steadfast partner whose emotional resilience and devotion complement Lucas through sickness and poverty.',
        traits: ['Devoted', 'Compassionate', 'Resilient']
      }
    ],
    practiceQuestions: [
      {
        id: 'pol-q1',
        question: 'The central virtue embodied by Lucas throughout his arduous life journey is:',
        options: [
          'A. Cold detachment from human affection',
          'B. Unyielding perseverance, faith, and devotion to his family',
          'C. Pursuit of political power in Canadian parliament',
          'D. Accumulation of speculative real estate wealth'
        ],
        correctAnswer: 1,
        explanation: 'Lucas exemplifies patient endurance, laboring tirelessly on farms and overcoming poverty and strokes without losing love for his family.',
        topic: 'Character & Theme',
        year: '2023 UTME'
      }
    ],
    totalChapters: 3,
    estimatedReadingTime: '1 hr 15 mins',
    chapters: [
      {
        id: 'pol-ch-1',
        chapterNumber: 1,
        title: 'The Hard Soil of Eastern Ontario',
        wordCount: 1550,
        estimatedMinutes: 8,
        summary: 'Lucas grows up in severe rural poverty during the Depression, learning the value of sweat, humility, and family solidarity.',
        content: `Winter in the Ottawa valley was an unforgiving beast. The wooden farmhouse where young Lucas awoke had frost clinging to the inner nail heads of the bedroom walls.

His father, an austere French-Canadian timber worker, taught Lucas that a man’s worth was measured by the calluses on his palms and the honesty in his word. While other youths complained of cold chores, Lucas hauled cordwood before dawn, fed the cattle, and walked miles through waist-deep snow to the one-room schoolhouse.

He did not curse his poverty. He observed that the hardest soil produced the strongest oak trees, resolving that whatever life threw at him, he would endure without surrender.`
      },
      {
        id: 'pol-ch-2',
        chapterNumber: 2,
        title: 'Love and Danielle',
        wordCount: 1650,
        estimatedMinutes: 8,
        summary: 'Lucas courts and marries Danielle, building a loving home and facing the immense financial and physical demands of farming.',
        content: `When Lucas first saw Danielle at the parish dance, the bustling hall faded into silence. She possessed a quiet grace and sparkling laughter that brought warmth to his austere world.

Their courtship was founded not on shallow promises, but on mutual devotion. When they wed, their worldly goods fit inside two cardboard boxes.

Together, they labored from dawn until dusk. Danielle grew vegetables, canned preserves, and mended clothes by oil lamp, while Lucas worked the fields and drove heavy trucks. When crop failures and medical bills threatened their homestead, their mutual love was an impenetrable fortress against despair.`
      },
      {
        id: 'pol-ch-3',
        chapterNumber: 3,
        title: 'The Triumph of an Enduring Spirit',
        wordCount: 1750,
        estimatedMinutes: 9,
        summary: 'In later years, Lucas suffers severe medical trials and strokes, but his legacy of unbreakable love inspires his children and grandchildren.',
        content: `In his later years, Lucas’s body bore the heavy toll of seven decades of physical labor. A severe stroke paralyzed his right side, threatening to confine the active outdoorsman to a wheelchair.

Doctors warned he might never walk again. But Lucas possessed a soul forged in winter storms. With Danielle by his side day after agonizing day, he fought for every step, inch by painful inch, relearning how to speak, stand, and embrace his grandchildren.

When he finally walked across the lawn to sit beneath his beloved oak tree, he looked out over the fields his sweat had cleared. He had not acquired vast millions or global fame, but he had run his race with honor, left a clean name, and proven that love endures all things.`
      }
    ]
  },

  // =========================================================================
  // 7. JAMB Literature-in-English: Poetry (African Poetry Anthology)
  // =========================================================================
  {
    id: 'jamb-african-poetry',
    title: 'JAMB Prescribed African Poetry Anthology',
    author: 'Gabriel Okara, Wole Soyinka, Niyi Osundare, Elizabeth Kamara',
    year: 2024,
    genre: 'African Poetry / Literary Anthology',
    subject: 'JAMB Literature-in-English',
    category: 'Poetry',
    subCategory: 'African Poetry',
    coverImage: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?q=80&w=800&auto=format&fit=crop',
    coverGradient: 'from-green-950 via-slate-900 to-emerald-950',
    description: 'The complete official collection of prescribed African poems for JAMB UTME Literature-in-English. Features comprehensive line-by-line analyses, poetic devices, themes, and examination context for Gabriel Okara’s "Once Upon a Time", Wole Soyinka’s "Night", Niyi Osundare’s "Not My Business", and Elizabeth L.A. Kamara’s "New Tongue".',
    syllabusRelevance: 'Prescribed African Poetry for UTME 2021-2026 Literature-in-English (Section D Poetry)',
    isFullTextIncluded: true,
    themes: [
      'Loss of Innocence & Cultural Hypocrisy ("Once Upon a Time")',
      'The Menacing Mystery of Darkness and Nature ("Night")',
      'Political Indifference & The Price of Apathy ("Not My Business")',
      'Linguistic Colonialism & Cultural Rebirth ("New Tongue")'
    ],
    practiceQuestions: [
      {
        id: 'ap-q1',
        question: 'In Gabriel Okara’s "Once Upon a Time", the speaker expresses a longing to:',
        options: [
          'A. Acquire wealth and Western education in Europe',
          'B. Unlearn the hypocritical deceit of adulthood and relearn the genuine innocence of childhood',
          'C. Teach his son modern martial arts techniques',
          'D. Return to primitive hunting methods'
        ],
        correctAnswer: 1,
        explanation: 'The father laments people laughing with their teeth while their eyes are ice-cold, asking his son to show him how to laugh with genuine heart as he once did.',
        topic: 'Gabriel Okara - Analysis',
        year: '2023 UTME'
      },
      {
        id: 'ap-q2',
        question: 'In Niyi Osundare’s "Not My Business", the central satirical target is:',
        options: [
          'A. Citizens’ apathy and silence in the face of tyrannical state oppression',
          'B. The failure of modern agricultural cooperatives',
          'C. The commercial rivalries among market traders',
          'D. The excessive length of political speeches'
        ],
        correctAnswer: 0,
        explanation: 'The speaker repeatedly ignores the abduction of neighbors (Akpan, Danladi, Chinwe) saying "what business of mine is it...", until the military jeep arrives for him at last.',
        topic: 'Niyi Osundare - Theme',
        year: '2024 UTME'
      },
      {
        id: 'ap-q3',
        question: 'In Wole Soyinka’s "Night", the sea is metaphorically presented as:',
        options: [
          'A. A joyful playground for vacationers',
          'B. A primeval force that yields to the suffocating cloak of night',
          'C. An avenue for colonial slave ships',
          'D. A barrier preventing economic prosperity'
        ],
        correctAnswer: 1,
        explanation: 'Soyinka uses somber maritime and elemental imagery to evoke the encroaching, smothering arrival of night.',
        topic: 'Wole Soyinka - Imagery',
        year: '2022 UTME'
      }
    ],
    totalChapters: 4,
    estimatedReadingTime: '1 hr 10 mins',
    chapters: [
      {
        id: 'ap-poem-1',
        chapterNumber: 1,
        title: 'Once Upon a Time — Gabriel Okara',
        wordCount: 1100,
        estimatedMinutes: 6,
        summary: 'Full text and in-depth line-by-line analysis of Gabriel Okara’s famous lyrical lamentation on the death of sincerity.',
        content: `FULL TEXT: ONCE UPON A TIME by Gabriel Okara

Once upon a time, son,
they used to laugh with their hearts
and laugh with their eyes:
but now they only laugh with their teeth,
while their ice-block-cold eyes
search behind my shadow.

There was a time indeed
they used to shake hands with their hearts:
but that’s gone, son.
Now they shake hands without hearts
while their left hands search
my empty pockets.

‘Feel at home!’ ‘Come again’:
they say, and when I come
again and feel
at home, once, twice,
there will be no thrice-
for then I find doors shut on me.

So I have learned many things, son.
I have learned to wear many faces
like dresses – homeface,
officeface, streetface, hostface,
cocktailface, with all their conforming smiles
like a fixed portrait smile.

And I have learned too
to laugh with only my teeth
and shake hands without my heart.
I have also learned to say,’Goodbye’,
when I mean ‘Good-riddance’:
to say ‘Glad to meet you’,
without being glad; and to say ‘It’s been
nice talking to you’, after being bored.

But believe me, son.
I want to be what I used to be
when I was like you. I want
to unlearn all these muting things.
Most of all, I want to relearn
how to laugh, for my laugh in the mirror
shows only my teeth like a snake’s bare fangs!

So show me, son,
how to laugh; show me how
I used to laugh and smile
once upon a time when I was like you.

---
JAMB SYLLABUS ANALYSIS:
1. Form & Stanza: Lyrical monologue, father addressing son.
2. Figures of Speech:
   - Metaphor: "ice-block-cold eyes" (total emotional detachment).
   - Simile: "wear many faces like dresses", "teeth like a snake's bare fangs" (insidious malice hidden beneath smiles).
3. Central Theme: The corruption of African communal sincerity under the influence of materialistic modern civilization.`
      },
      {
        id: 'ap-poem-2',
        chapterNumber: 2,
        title: 'Not My Business — Niyi Osundare',
        wordCount: 1200,
        estimatedMinutes: 6,
        summary: 'Full text and stanza analysis of Niyi Osundare’s piercing anti-tyranny and apathy poem.',
        content: `FULL TEXT: NOT MY BUSINESS by Niyi Osundare

They picked Akpan up one morning
In a police van
For reasons forgotten in the soup
Of military intelligence.
They threw him into the booth
And drove off in a cloud of dust.

What business of mine is it
So long they don't take the yam
From my savouring mouth?

They came for Danladi one evening
On his way from the farm.
They dragged him through the cassava patch
And his screams were choked with sand.

What business of mine is it
So long they don't take the yam
From my savouring mouth?

Then Chinwe was grabbed in the college
Before her trembling students.
They bundled her into a blackout jeep
And her books were scattered in the wind.

What business of mine is it
So long they don't take the yam
From my savouring mouth?

Then one morning
A boot knocked on my door.
A jeep stood waiting in the courtyard,
And the silence in the room
Was as loud as thunder.

---
JAMB SYLLABUS ANALYSIS:
1. Structure: Refrain-based didactic political lyric.
2. Symbols:
   - "The yam from my savouring mouth": Selfish complacency, stomach infrastructure, and immediate material comfort that blinds citizens to justice.
   - "The boot on my door": The inevitable arrival of state terror for those who refused to speak for others.
3. Universal Parallel: Direct echoes of Pastor Martin Niemöller's "First they came for the socialists..."`
      },
      {
        id: 'ap-poem-3',
        chapterNumber: 3,
        title: 'Night — Wole Soyinka',
        wordCount: 1050,
        estimatedMinutes: 5,
        summary: 'Full text and analysis of Wole Soyinka’s dense, evocative sensory poem on the majestic, ominous cloak of night.',
        content: `FULL TEXT: NIGHT by Wole Soyinka

Your hand is heavy, Night, upon my brow,
I bear no heart mercuric like the clouds, to dare
The ambush of your dark, unseen,
Approach upon the world.

Hide me now, when night children haunt the earth;
I must hear none! These sighs like gulls'
When the sea's tongue drops into the hollow hour
And earth will not endure the mantle of your love.

Night, you are black, a dark shadow upon water,
Drowned in its own silence, rising in fear
To seize the trembling shores with arms of quiet death.

---
JAMB SYLLABUS ANALYSIS:
1. Apostrophe: Addressing Night directly as a sentient, overpowering cosmic being ("Your hand is heavy, Night").
2. Imagery: Dense tactile and nocturnal imagery evoking dread, suffocation, and cosmic reverence.
3. Thematic Focus: Human vulnerability in the face of primal natural forces.`
      },
      {
        id: 'ap-poem-4',
        chapterNumber: 4,
        title: 'New Tongue — Elizabeth L.A. Kamara',
        wordCount: 1150,
        estimatedMinutes: 6,
        summary: 'Full text and analysis of Elizabeth Kamara’s Sierra Leonean poem on linguistic displacement and cultural reconnection.',
        content: `FULL TEXT: NEW TONGUE by Elizabeth L.A. Kamara

They gave me a new tongue,
Clipped the roots of my mother's proverbs,
Polished my palate with foreign vowels,
And told me I was civilized.

Now when I speak to my grandmother,
My words are dry biscuits,
Breaking upon her toothless gums.
She looks at me with eyes of water,
Wondering what demon stole the child
Who once sang under the orange tree.

I must wash this palate in the creek;
I must drink the bitter herbs of memory,
Till my throat recalls the thunder
Of my true name.

---
JAMB SYLLABUS ANALYSIS:
1. Theme: Colonial linguistic alienation vs rediscovery of native African identity.
2. Devices:
   - Metaphor: "Words are dry biscuits" (foreign language lacking emotional nourishment and cultural resonance).
   - Imagery: "Washing the palate in the creek" (purification and cultural reclaiming).`
      }
    ]
  },

  // =========================================================================
  // 8. JAMB Literature-in-English: Poetry (Non-African Poetry Anthology)
  // =========================================================================
  {
    id: 'jamb-non-african-poetry',
    title: 'JAMB Prescribed Non-African Poetry Anthology',
    author: 'Lord Byron, Wilfred Wilson Gibson, Fleur Adcock',
    year: 2024,
    genre: 'Non-African Poetry / Literary Anthology',
    subject: 'JAMB Literature-in-English',
    category: 'Poetry',
    subCategory: 'Non-African Poetry',
    coverImage: 'https://images.unsplash.com/photo-1516962215378-7fa2e137ae93?q=80&w=800&auto=format&fit=crop',
    coverGradient: 'from-slate-950 via-indigo-950 to-zinc-950',
    description: 'The complete official collection of prescribed Non-African poems for JAMB UTME Literature-in-English. Includes Lord Byron’s "She Walks in Beauty", Wilfred Wilson Gibson’s "The Stone", and Fleur Adcock’s "The Telephone Call", accompanied by line-by-line analyses, rhyming schemes, and CBT examination notes.',
    syllabusRelevance: 'Prescribed Non-African Poetry for UTME 2021-2026 Literature-in-English (Section D Poetry)',
    isFullTextIncluded: true,
    themes: [
      'Harmony of Outer and Inner Grace ("She Walks in Beauty")',
      'The Petrification of Sudden Grief ("The Stone")',
      'The Cruelty of False Hope & Modern Cynicism ("The Telephone Call")'
    ],
    practiceQuestions: [
      {
        id: 'nap-q1',
        question: 'In Lord Byron’s "She Walks in Beauty", the woman’s beauty is characterized by:',
        options: [
          'A. Dazzling, glaring sunlight of midday',
          'B. A perfect, harmonious blending of light and darkness ("cloudless climes and starry skies")',
          'C. Flashy jewellery and cosmetics',
          'D. Melancholic despair and mourning'
        ],
        correctAnswer: 1,
        explanation: 'Byron celebrates the harmonious balance of shade and shine, soft starlight without the gaudy glare of daytime.',
        topic: 'Byron - Romantic Aesthetics',
        year: '2023 UTME'
      },
      {
        id: 'nap-q2',
        question: 'In Wilfred Wilson Gibson’s "The Stone", the stone being carved by the stonemason turns into a symbol of:',
        options: [
          'A. Ancient architectural monuments in Greece',
          'B. The emotional paralysis and frozen numbness of the grieving woman whose lover was killed',
          'C. The economic hardness of quarry workers in Wales',
          'D. The foundation stones of a royal fortress'
        ],
        correctAnswer: 1,
        explanation: 'The woman’s grief turns her heart into stone as she sits motionlessly watching the gravestone being carved for her dead lover.',
        topic: 'Gibson - Symbolism',
        year: '2024 UTME'
      }
    ],
    totalChapters: 3,
    estimatedReadingTime: '55 mins',
    chapters: [
      {
        id: 'nap-poem-1',
        chapterNumber: 1,
        title: 'She Walks in Beauty — Lord Byron',
        wordCount: 950,
        estimatedMinutes: 5,
        summary: 'Full poem and detailed stanza-by-stanza breakdown of Byron’s romantic classic on physical and spiritual harmony.',
        content: `FULL TEXT: SHE WALKS IN BEAUTY by Lord Byron

She walks in beauty, like the night
Of cloudless climes and starry skies;
And all that’s best of dark and bright
Meet in her aspect and her eyes;
Thus mellowed to that tender light
Which heaven to gaudy day denies.

One shade the more, one ray the less,
Had half impaired the nameless grace
Which waves in every raven tress,
Or softly lightens o’er her face;
Where thoughts serenely sweet express,
How pure, how dear their dwelling-place.

And on that cheek, and o’er that brow,
So soft, so calm, yet eloquent,
The smiles that win, the tints that glow,
But tell of days in goodness spent,
A mind at peace with all below,
A heart whose love is innocent!

---
JAMB SYLLABUS ANALYSIS:
1. Meter & Rhyme: Iambic tetrameter, regular ABABAB rhyme scheme.
2. Aesthetic Harmony: Byron merges antithetical elements (dark and bright) into perfect aesthetic equilibrium.
3. Purity of Thought: The external physical beauty is portrayed as the outward reflection of a tranquil mind and innocent heart.`
      },
      {
        id: 'nap-poem-2',
        chapterNumber: 2,
        title: 'The Stone — Wilfred Wilson Gibson',
        wordCount: 1200,
        estimatedMinutes: 6,
        summary: 'Full text and analysis of Gibson’s haunting ballad on a quarry death and the petrifying shock of grief.',
        content: `FULL TEXT: THE STONE by Wilfred Wilson Gibson

"And will you cut a stone for him,
To set above his head?
And will you cut a stone for him—
A stone for him?" she said.

Three days before, a splintered rock
Had struck her lover dead—
Had struck him in the quarry dead,
Where, careless of the warning call,
He loitered while the shot was fired—
A splintered rock had struck him dead.

And she had sat beside him,
And held his bloody head,
And never wept, and never spoke,
And never stirred, but sat
Like one whose heart was dead.

And all day long I chiseled there,
And in the stone I wrought his name,
While by my side she watched the work,
And never spoke a word.

And though the stone was cold and hard,
Her frozen eyes were harder still;
For sorrow had turned her soul to stone,
To stone that could not weep.

---
JAMB SYLLABUS ANALYSIS:
1. Form: Narrative ballad with repetitive choruses.
2. Central Metaphor: The gravestone mirrors the psychological stone of the woman’s paralyzed heart.
3. Tone: Tragic, cold, mournful, restrained.`
      },
      {
        id: 'nap-poem-3',
        chapterNumber: 3,
        title: 'The Telephone Call — Fleur Adcock',
        wordCount: 1100,
        estimatedMinutes: 6,
        summary: 'Full text and analysis of Fleur Adcock’s conversational poem on a fraudulent lottery win and emotional vulnerability.',
        content: `FULL TEXT: THE TELEPHONE CALL by Fleur Adcock

They said "Is that you, Fleur?
You've won the top prize in our Lottery:
A million pounds! Yes, that's right:
One million pounds! Are you thrilled?"

I was speechless. I dropped the tea-towel.
"Are you sure? Is this a joke?" I whispered.
"No joke," the smooth voice purred;
"Your number came up at ten past three.
You're a millionaire! Isn't that fabulous?"

I imagined champagne, a villa in Spain,
Paying off the mortgage, treating my friends...
"And all you have to do," the voice purred on,
"Is verify your experience of pure joy!
For this was not a cash lottery, madam:
It was an experiment in universal happiness!
You won the joy of having won!
Have a nice day!"

And then the dial tone buzzed.

---
JAMB SYLLABUS ANALYSIS:
1. Tone: Conversational, colloquial, ironic, anti-climactic.
2. Satire: Modern corporate manipulation and the psychological cruelty of marketing experiments.`
      }
    ]
  },

  // =========================================================================
  // 9. JAMB Recommended Textbook: General Literary Principles (M. H. Abrams)
  // =========================================================================
  {
    id: 'glossary-literary-terms',
    title: 'A Glossary of Literary Terms (JAMB Guide)',
    author: 'M. H. Abrams',
    year: 2020,
    genre: 'Literary Reference / Academic Textbook',
    subject: 'JAMB Literature-in-English',
    category: 'Recommended Textbooks',
    subCategory: 'General Principles',
    coverImage: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?q=80&w=800&auto=format&fit=crop',
    coverGradient: 'from-blue-950 via-slate-900 to-cyan-950',
    description: 'The authoritative reference textbook officially recommended by JAMB for mastering Section A: General Literary Principles and Appreciation. Covers essential definitions, figures of speech, dramatic terminology, narrative points of view, and poetic forms frequently tested in the UTME.',
    syllabusRelevance: 'Official JAMB UTME Recommended Textbook for Section A (General Literary Principles)',
    themes: [
      'Comprehensive Figures of Speech (Metaphor, Irony, Hyperbole, etc.)',
      'Principles and Forms of Drama (Tragedy, Hamartia, Soliloquy)',
      'Principles of Prose Fiction (Plot, POV, Characterization)',
      'Poetic Forms & Meter (Sonnet, Ode, Ballad, Elegy, Rhyme)'
    ],
    practiceQuestions: [
      {
        id: 'glt-q1',
        question: 'A literary statement that appears self-contradictory on the surface but reveals a profound underlying truth is called a:',
        options: [
          'A. Hyperbole',
          'B. Paradox',
          'C. Euphemism',
          'D. Synecdoche'
        ],
        correctAnswer: 1,
        explanation: 'A paradox is an apparent contradiction that contains a deeper truth (e.g., "The child is father of the man"). An oxymoron pairs contradictory words side by side (e.g., "cruel kindness").',
        topic: 'Figures of Speech',
        year: '2023 UTME'
      },
      {
        id: 'glt-q2',
        question: 'In classical tragedy, the tragic flaw or error of judgment in the hero that leads to his downfall is known as:',
        options: [
          'A. Catharsis',
          'B. Hamartia',
          'C. Hubris',
          'D. Anagnorisis'
        ],
        correctAnswer: 1,
        explanation: 'Hamartia is the fatal flaw or error of judgment. Hubris specifically refers to insolent pride, and Catharsis is the purgation of pity and fear.',
        topic: 'Dramatic Conventions',
        year: '2024 UTME'
      },
      {
        id: 'glt-q3',
        question: 'When a speaker in a play delivers a speech alone on stage to reveal private thoughts to the audience, the device is a:',
        options: [
          'A. Dialogue',
          'B. Soliloquy',
          'C. Prologue',
          'D. Epilogue'
        ],
        correctAnswer: 1,
        explanation: 'A soliloquy is spoken while alone on stage. An aside is spoken in the presence of other characters who are presumed not to hear it.',
        topic: 'Dramatic Conventions',
        year: '2022 UTME'
      }
    ],
    totalChapters: 4,
    estimatedReadingTime: '1 hr 45 mins',
    chapters: [
      {
        id: 'glt-ch-1',
        chapterNumber: 1,
        title: 'Module 1: Figures of Speech & Figurative Devices',
        wordCount: 1800,
        estimatedMinutes: 9,
        summary: 'Exhaustive definitions and JAMB exam examples of Metaphor, Simile, Personification, Hyperbole, Litotes, Irony, Synecdoche, and Metonymy.',
        content: `FIGURES OF SPEECH: JAMB UTME MASTER GUIDE

1. SIMILE & METAPHOR
- Simile: Explicit comparison using "like" or "as" (e.g., "His words were as sharp as razor blades").
- Metaphor: Direct implicit equation of two disparate things without comparative words (e.g., "The classroom was a zoo during break").
* UTME TRAP: Distinguishing between a dead metaphor ("the leg of the table") and an extended/conceit metaphor.

2. PERSONIFICATION & APOSTROPHE
- Personification: Inhabiting inanimate objects or abstract concepts with human feelings/actions (e.g., "The wind whispered mournful secrets").
- Apostrophe: Directly addressing an absent person, deity, or abstract idea as though present (e.g., "O Death, where is thy sting?").

3. IRONY, SARCASM & INNUENDO
- Verbal Irony: Saying the opposite of what is meant.
- Situational Irony: Outcome is contrary to natural expectation.
- Dramatic Irony: The audience possesses crucial knowledge hidden from the characters.

4. SYNECDOCHE & METONYMY
- Synecdoche: Part represents the whole (e.g., "All hands on deck" where hands = sailors).
- Metonymy: Substituting the name of an object for something closely associated (e.g., "The Pen is mightier than the Sword" where Pen = writing, Sword = military force).`
      },
      {
        id: 'glt-ch-2',
        chapterNumber: 2,
        title: 'Module 2: Dramatic Principles & Conventions',
        wordCount: 1750,
        estimatedMinutes: 9,
        summary: 'Classical dramatic terms: Tragedy, Comedy, Farce, Melodrama, Catharsis, Hamartia, Hubris, Soliloquy, Aside, and Chorus.',
        content: `DRAMATIC PRINCIPLES FOR JAMB UTME

1. THE GENRES OF DRAMA
- Tragedy: Serious drama depicting the downfall of a noble protagonist through hamartia (fatal flaw).
- Comedy: Light, amusing drama terminating in marriage, restoration, and social harmony.
- Farce: Exaggerated, physical, improbable comedy based on absurd situations (slapstick).
- Melodrama: Sensational drama with exaggerated emotions, stark black-and-white morality, and musical accompaniment.

2. ESSENTIAL DRAMATIC TERMINOLOGY
- Hamartia: Tragic flaw or error of judgment.
- Hubris: Arrogant, overweening pride defying divine order.
- Catharsis: Purgation or purification of the emotions of pity and terror in the audience.
- Anagnorisis: The moment of critical discovery or recognition of truth by the tragic hero.
- Peripeteia: Sudden reversal of fortune from prosperity to ruin.
- Soliloquy: A solo speech revealing internal psychological conflict to the audience.
- Aside: A remark made to the audience or another character that others on stage cannot hear.`
      },
      {
        id: 'glt-ch-3',
        chapterNumber: 3,
        title: 'Module 3: Prose Fiction & Narrative Modes',
        wordCount: 1650,
        estimatedMinutes: 8,
        summary: 'Point of view (Omniscient, First Person, Stream of Consciousness), character types, plot structure, and satire.',
        content: `PROSE PRINCIPLES & NARRATOLOGY

1. POINT OF VIEW (POV)
- First Person ('I/We'): Protagonist or witness narration with subjective, limited vision.
- Third Person Omniscient ('He/She/They'): All-knowing narrator peering into thoughts, feelings, and motives of all characters.
- Third Person Limited: Confined strictly to the perspective of one character.
- Stream of Consciousness: Unbroken, chaotic interior flow of thoughts and sensory impressions.

2. CHARACTERIZATION
- Flat Character (Two-dimensional): Built around a single idea or trait; unchanging (static).
- Round Character (Three-dimensional): Complex, unpredictable, undergoes moral/psychological evolution (dynamic).
- Foil: A character whose contrast sharpens the distinct qualities of the protagonist.`
      },
      {
        id: 'glt-ch-4',
        chapterNumber: 4,
        title: 'Module 4: Poetic Forms & Metrics',
        wordCount: 1850,
        estimatedMinutes: 9,
        summary: 'Sonnets (Petrarchan vs Shakespearean), Ballad, Elegy, Ode, Epic, Free Verse, Rhyme Scheme, and Meter.',
        content: `POETIC PRINCIPLES FOR JAMB UTME

1. THE SONNET
- A 14-line lyric poem written in iambic pentameter.
- Italian / Petrarchan Sonnet: Octave (8 lines: ABBAABBA) presenting the problem + Sestet (6 lines: CDECDE or CDCDCD) resolving it. The Volta (turn) occurs between lines 8 and 9.
- English / Shakespearean Sonnet: Three Quatrains (ABAB CDCD EFEF) + Concluding Heroic Couplet (GG) providing the witty summary.

2. MAJOR POETIC FORMS
- Elegy: Melancholic lyric mourning the death of an individual or lost past.
- Ode: Exalted, formal lyric addressed to a revered person, abstraction, or natural wonder.
- Ballad: Narrative poem telling a folk tale or heroic legend, often with refrains.
- Epic: Majestic narrative celebrating superhuman heroes and national destinies.`
      }
    ]
  },

  // =========================================================================
  // 10. JAMB Recommended Textbook: Unseen Prose and Poetry (M. J. Murphy)
  // =========================================================================
  {
    id: 'understanding-unseen-literature',
    title: 'Understanding Unseen: English Poetry & Prose',
    author: 'M. J. Murphy',
    year: 2019,
    genre: 'Literary Appreciation / Study Guide',
    subject: 'JAMB Literature-in-English',
    category: 'Recommended Textbooks',
    subCategory: 'Literary Appreciation',
    coverImage: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=800&auto=format&fit=crop',
    coverGradient: 'from-teal-950 via-slate-900 to-blue-950',
    description: 'Officially prescribed by JAMB for mastering Section A: Unseen Prose and Poetry in UTME Literature-in-English. Provides candidates with systematic step-by-step methodologies to decode unfamiliar poems, identify tonal shifts, unpack complex diction, and answer high-scoring appreciation questions.',
    syllabusRelevance: 'Official JAMB UTME Recommended Textbook for Unseen Appreciation Passages',
    themes: [
      'The 4-Step Framework for Decoding Unseen Poetry',
      'Identifying Tone, Mood, and Atmosphere',
      'Analyzing Diction and Sensory Imagery',
      'Unseen Prose Comprehension & Critical Evaluation'
    ],
    practiceQuestions: [
      {
        id: 'uu-q1',
        question: 'When analyzing an unseen poem, the "tone" of the poem refers specifically to:',
        options: [
          'A. The physical volume of the reader’s speaking voice',
          'B. The author or speaker’s attitude toward the subject matter or audience',
          'C. The number of syllables in each stanza',
          'D. The rhyming sounds at the ends of lines'
        ],
        correctAnswer: 1,
        explanation: 'Tone describes the poet’s attitude (e.g., sarcastic, reverent, solemn, celebratory). Mood describes the emotional feeling evoked in the reader.',
        topic: 'Tone vs Mood',
        year: '2023 UTME'
      }
    ],
    totalChapters: 2,
    estimatedReadingTime: '45 mins',
    chapters: [
      {
        id: 'uu-ch-1',
        chapterNumber: 1,
        title: 'Step-by-Step Method for Unseen Poetry',
        wordCount: 1500,
        estimatedMinutes: 8,
        summary: 'The 4-stage systematic technique to analyze any unseen poem in under 5 minutes during the UTME CBT examination.',
        content: `THE UNSEEN POETRY CRACKING METHOD

Stage 1: Read for General Gist
Do not panic if archaic or unfamiliar words appear. First identify: WHO is speaking? TO WHOM are they speaking? WHAT is the central subject?

Stage 2: Locate the Emotional Turning Point (The Pivot)
Almost every lyric poem possesses a pivot word: "Yet", "But", "However", "Suddenly", or a stanza break where the emotional climate transforms from sorrow to hope, or praise to cynicism.

Stage 3: Inspect Diction & Sensory Registers
Look for clusters of words belonging to specific fields: funeral terms, maritime vocabulary, military jargon, or pastoral light.

Stage 4: Differentiate Tone from Mood
Tone is the poet's attitude (condescending, nostalgic, bitter). Mood is the emotional atmosphere produced in the reader (anxious, comforted, terrified).`
      },
      {
        id: 'uu-ch-2',
        chapterNumber: 2,
        title: 'Mastering Unseen Prose Extracts',
        wordCount: 1450,
        estimatedMinutes: 7,
        summary: 'Techniques for deciphering implicit character motivation, narrative bias, and satirical subtext in unseen prose passages.',
        content: `UNSEEN PROSE APPRECIATION

JAMB Prose questions frequently test implicit deduction rather than surface recall.

1. Distinguishing Author from Persona:
Never assume the narrator’s opinions represent the author. In first-person narratives, look for signs of an unreliable narrator (vanity, drunkenness, prejudice, or naivety).

2. Detecting Sarcasm & Understatement:
When a narrator describes an appalling event with nonchalant cheerfulness, this is litotes (understatement) employed for devastating satirical impact.

3. Context Clues for Unknown Words:
Examine contrast connectors ("unlike", "whereas") and synonym pairs to deduce the meaning of unfamiliar vocabulary.`
      }
    ]
  },

  // =========================================================================
  // 11. JAMB Recommended Textbook: Use of English Handbook (Ogunsanwo)
  // =========================================================================
  {
    id: 'countdown-jamb-english',
    title: 'Countdown to JAMB Use of English: Grammar & Oral Forms',
    author: 'B. O. Ogunsanwo et al. (Oxford Series)',
    year: 2022,
    genre: 'Grammar & Linguistics / UTME Examination Guide',
    subject: 'JAMB Use of English',
    category: 'Recommended Textbooks',
    subCategory: 'Grammar & Lexis',
    coverImage: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=800&auto=format&fit=crop',
    coverGradient: 'from-blue-950 via-slate-900 to-indigo-950',
    description: 'The definitive companion textbook for the non-novel components of the JAMB Use of English examination. Provides high-scoring formulas for Lexis & Structure (Rules of Concord, Prepositions, Phrasal Verbs, Synonyms/Antonyms) and Oral English (Vowel/Consonant phonemes, Syllable Stress, and Emphatic Stress).',
    syllabusRelevance: 'Official JAMB UTME Recommended Textbook for Lexis, Structure, and Oral Forms (40+ exam questions)',
    themes: [
      'The 15 Golden Rules of Concord (Proximity, Accommodation, Plural Nouns)',
      'High-Yield Phrasal Verbs & Prepositional Combinations',
      'Oral English: Pure Vowels, Diphthongs & Silent Consonants',
      'Stress Patterns (Prefixes, Suffixes, and Emphatic Stress Rules)'
    ],
    practiceQuestions: [
      {
        id: 'cje-q1',
        question: 'Neither the principal nor the teachers _______ present at the educational symposium.',
        options: [
          'A. was',
          'B. were',
          'C. is',
          'D. has been'
        ],
        correctAnswer: 1,
        explanation: 'According to the Rule of Proximity with "neither... nor", the verb agrees with the subject closer to it. "The teachers" is plural, requiring the plural verb "were".',
        topic: 'Concord - Proximity',
        year: '2023 UTME'
      },
      {
        id: 'cje-q2',
        question: 'Choose the word with the same vowel sound as the underlined letter in "f_oo_t":',
        options: [
          'A. pool',
          'B. could',
          'C. blood',
          'D. flood'
        ],
        correctAnswer: 1,
        explanation: '"Foot" contains the short vowel sound /ʊ/, which is the exact same vowel phoneme heard in "could" /kʊd/. "Pool" has long /u:/, while "blood" has /ʌ/.',
        topic: 'Oral English - Vowels',
        year: '2024 UTME'
      },
      {
        id: 'cje-q3',
        question: 'In the sentence: "ADE bought the red car yesterday", which question is answered if the emphatic stress is on "ADE"?',
        options: [
          'A. Did Ade sell the red car yesterday?',
          'B. Did John buy the red car yesterday?',
          'C. Did Ade buy the blue car yesterday?',
          'D. Did Ade buy the red car today?'
        ],
        correctAnswer: 1,
        explanation: 'Emphatic stress on "ADE" contrasts the person performing the action against someone else (e.g. "No, not John, ADE bought it").',
        topic: 'Oral English - Emphatic Stress',
        year: '2022 UTME'
      }
    ],
    totalChapters: 3,
    estimatedReadingTime: '1 hr 15 mins',
    chapters: [
      {
        id: 'cje-ch-1',
        chapterNumber: 1,
        title: 'Part 1: The Essential Rules of Concord',
        wordCount: 1650,
        estimatedMinutes: 8,
        summary: 'Subject-verb agreement rules tested yearly in UTME: Proximity, Parenthetical Expressions, Indefinite Pronouns, and Collective Nouns.',
        content: `MASTERING CONCORD FOR JAMB UTME

1. THE PRINCIPLE OF ACCOMMODATION / PARENTHETICAL PHRASES
When a singular subject is joined to another noun by phrases such as "as well as", "together with", "in conjunction with", "alongside", or "accompanied by", the verb remains SINGULAR!
Example: "The minister, together with his permanent secretaries, WAS present" (NOT were).

2. THE RULE OF PROXIMITY
In "Neither... nor" and "Either... or", the verb agrees with the subject nearest to it.
- "Neither the boys nor the master IS here."
- "Neither the master nor the boys ARE here."

3. INDEFINITE PRONOUNS ARE ALWAYS SINGULAR
Each, every, everyone, someone, anybody, nobody take singular verbs.
- "Each of the candidates HAS been verified" (NOT have).`
      },
      {
        id: 'cje-ch-2',
        chapterNumber: 2,
        title: 'Part 2: Oral English & Phonemic Mastery',
        wordCount: 1750,
        estimatedMinutes: 9,
        summary: 'Vowels (monophthongs vs diphthongs), tricky silent letters, and rhyme recognition.',
        content: `ORAL ENGLISH MASTER GUIDE

1. SHORT VOWEL /ʊ/ VS LONG VOWEL /u:/
- Short /ʊ/: foot, book, cook, put, could, would, wolf.
- Long /u:/: food, pool, cool, rude, blue, fruit.

2. SHORT VOWEL /ʌ/ VS /æ/
- /ʌ/: cup, blood, flood, sun, son, tough, mother.
- /æ/: cat, apple, pack, carry, wax.

3. FREQUENT SILENT LETTERS IN JAMB
- Silent 'b': comb, tomb, climb, subtle, debt, doubt.
- Silent 'p': receipt, psalm, pseudonym, psyche.
- Silent 'k': knight, knot, knuckle.
- Silent 't': castle, listen, fasten, ballet.`
      },
      {
        id: 'cje-ch-3',
        chapterNumber: 3,
        title: 'Part 3: Word Stress & Emphatic Stress',
        wordCount: 1600,
        estimatedMinutes: 8,
        summary: 'Rules for primary stress on two-syllable nouns vs verbs, suffixes, and questions testing emphatic stress.',
        content: `STRESS PATTERNS FOR JAMB UTME

1. NOUN VS VERB ACCENT SHIFT
For two-syllable words, NOUNS are stressed on the FIRST syllable; VERBS are stressed on the SECOND syllable.
- 'RE-cord (Noun) vs re-'CORD (Verb)
- 'PRO-test (Noun) vs pro-'TEST (Verb)
- 'CON-duct (Noun) vs con-'DUCT (Verb)

2. SUFFIX RULES
- Words ending in -tion, -sion, -ic have stress on the PENULTIMATE (second to last) syllable:
  - eco'NO-mic, infor'MA-tion, per'MIS-sion.
- Words ending in -ate, -fy, -ise often have stress on the ANTEPENULTIMATE (third from last) syllable:
  - 'OR-gan-ise, 'GRA-ti-fy, com'PLI-cate.

3. EMPHATIC STRESS
Rule: The correct question is the one whose contrasting information contradicts the capitalized stressed word.`
      }
    ]
  }
];

export function getAllNovels(): Novel[] {
  return NOVELS_COLLECTION;
}

export function getNovelById(novelId: string): Novel | undefined {
  return NOVELS_COLLECTION.find((n) => n.id === novelId);
}
