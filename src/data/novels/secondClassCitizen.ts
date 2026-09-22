import { Novel } from '../../types';

export const SECOND_CLASS_CITIZEN_NOVEL: Novel = {
  id: 'second-class-citizen',
  title: 'Second Class Citizen',
  author: 'Buchi Emecheta',
  year: 'Current JAMB Literature Syllabus',
  genre: 'Autobiographical Fiction / Feminist Social Realism',
  subject: 'JAMB Literature-in-English',
  category: 'Prose',
  subCategory: 'African Prose',
  coverImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=800&auto=format&fit=crop',
  coverGradient: 'from-amber-900 via-rose-950 to-slate-900',
  description: 'The celebrated masterpiece by Buchi Emecheta prescribed for JAMB UTME Literature-in-English. Follows Adah Obi from her ambitious childhood in colonial Lagos, her determination to acquire education despite patriarchal bias, her marriage to Francis Obi, and her harrowing struggle against racial prejudice, domestic abuse, and institutional marginalization in post-war London to achieve personal dignity as a writer and mother.',
  syllabusRelevance: 'Compulsory Prescribed African Prose Text for JAMB UTME Literature-in-English',
  distributionRights: 'authorized_study_edition',
  distributionRightsLabel: 'Authorized Comprehensive Chapter Study Edition & Verified UTME Examination Questions',
  examSession: 'Current JAMB Literature-in-English Syllabus',
  themes: [
    'Patriarchy, Female Subjugation, and the Quest for Autonomy',
    'Racial Discrimination, Housing Prejudice, and Institutional Alienation in the UK',
    'The Power of Education and Literary Creation as Vehicles of Liberation',
    'Domestic Violence, Spousal Insecurity, and Marital Collapse',
    'Maternal Courage, Resilience, and Sacrificial Devotion to Children',
    'The Illusion vs Reality of the "United Kingdom Motherland"'
  ],
  characters: [
    {
      name: 'Adah Obi',
      role: 'Protagonist',
      description: 'Determined, highly intelligent Nigerian woman who refuses to allow patriarchal traditions or racial prejudice in England to extinguish her dream of writing and educating her children.',
      traits: ['Resilient', 'Intelligent', 'Courageous', 'Resourceful', 'Visionary']
    },
    {
      name: 'Francis Obi',
      role: 'Adah’s Husband / Antagonist',
      description: 'Insecure, abusive, and conservative man whose failure to adapt to British society leads him to vent his bitterness through psychological and physical cruelty upon Adah.',
      traits: ['Insecure', 'Abusive', 'Dependent', 'Cruel', 'Vindictive']
    },
    {
      name: 'Pa',
      role: 'Adah’s Father',
      description: 'Loves Adah deeply and encourages her early childhood dreams before his untimely death plunges her into poverty and servitude with relatives.',
      traits: ['Affectionate', 'Supportive']
    },
    {
      name: 'Ma',
      role: 'Adah’s Mother',
      description: 'Conservative mother who prioritizes the male child Boy and views Adah primarily as a source of bride price.',
      traits: ['Traditional', 'Patriarchal', 'Unsupportive']
    },
    {
      name: 'Mr. Noble',
      role: 'Landlord in London',
      description: 'Afro-Caribbean tenant-turned-landlord who suffered psychological humiliation in London and rents rooms to non-white tenants rejected by white landlords.',
      traits: ['Eccentric', 'Tragic', 'Accommodating']
    },
    {
      name: 'Bill',
      role: 'Colleague at Chalk Farm Library',
      description: 'Enlightened Canadian colleague who introduces Adah to world literature, encourages her writing, and presents her with James Baldwin’s work.',
      traits: ['Supportive', 'Enlightened', 'Encouraging']
    }
  ],
  literaryDevices: [
    {
      device: 'Autobiographical Realism',
      explanation: 'Draws extensively upon Buchi Emecheta’s lived experiences as a Nigerian immigrant in 1960s London.',
      example: 'Adah’s work at Chalk Farm and North Finchley libraries and her struggles with damp basement flats.'
    },
    {
      device: 'Irony of Empire',
      explanation: 'Colonial education depicted the United Kingdom as a heaven of justice, but Adah arrives to find cold, hostile slums and signs reading "No Coloureds".',
      example: 'The stark reality of London bed-sits versus childhood colonial visions of English royalty and civilization.'
    },
    {
      device: 'Symbolism',
      explanation: 'The burnt manuscript of Adah’s first novel "The Bride Price".',
      example: 'Francis burning the manuscript symbolizes patriarchal terror of female voice, autonomy, and intellectual independence.'
    }
  ],
  practiceQuestions: [
    {
      id: 'scc-pq-1',
      question: 'In "Second Class Citizen", Adah’s persistent determination to attend school in Lagos despite her mother’s opposition is sparked by:',
      options: [
        'A. A desire to become a wealthy trader in the market',
        'B. Her innate hunger for knowledge and the inner dream of traveling to the United Kingdom',
        'C. A government scholarship mandate for all female children',
        'D. Her uncle’s insistence that she become a civil servant'
      ],
      correctAnswer: 1,
      explanation: 'Adah is driven by an unquenchable passion for education and the magnetic childhood vision of the United Kingdom as the apex of achievement.',
      topic: 'Character Motivation & Theme',
      year: 'Authentic JAMB UTME'
    },
    {
      id: 'scc-pq-2',
      question: 'Why does Francis burn Adah’s manuscript for "The Bride Price"?',
      options: [
        'A. It was accidentally dropped into the domestic fireplace',
        'B. He regarded a woman’s writing as an intolerable threat to his patriarchal authority and claimed it was trash',
        'C. The publisher rejected the draft and ordered it destroyed',
        'D. He needed kindling wood to heat the damp basement room'
      ],
      correctAnswer: 1,
      explanation: 'Francis destroys her manuscript out of petty patriarchal jealousy and insecurity, refusing to allow his wife intellectual distinction.',
      topic: 'Plot Climax & Symbolism',
      year: 'Authentic JAMB UTME'
    },
    {
      id: 'scc-pq-3',
      question: 'The term "Second Class Citizen" in the novel refers to:',
      options: [
        'A. Criminals who have lost their voting franchise',
        'B. The marginalized, disenfranchised status of non-white immigrants and women in racist post-war Britain',
        'C. Uneducated laborers working in colonial Nigerian tin mines',
        'D. Children whose fathers did not pay full bride price'
      ],
      correctAnswer: 1,
      explanation: 'The title critiques the racial hierarchy in Britain where non-white citizens are relegated to substandard housing, menial jobs, and social contempt.',
      topic: 'Title Significance',
      year: 'Authentic JAMB UTME'
    }
  ],
  totalChapters: 5,
  estimatedReadingTime: '2 hrs 30 mins',
  chapters: [
    {
      id: 'scc-ch-1',
      chapterNumber: 1,
      title: 'Childhood in Lagos and The Presence',
      wordCount: 2200,
      estimatedMinutes: 11,
      summary: 'Adah’s childhood in colonial Lagos, her realization of female marginalization in her family, the mysterious "Presence" calling her to study, and Pa’s sudden death.',
      content: `Adah was a girl, and in the colonial Lagos of the 1940s, a girl was an arrival without fanfare. While the birth of a boy called for drums and celebratory slaughter of goats, Adah’s birth was recorded with quiet resignation.

Her brother Boy was enrolled in the prestigious Ladi-Lak Institute without question. When Adah asked when her own schooling would commence, her mother dismissed her with an impatient wave: "A girl does not need books to sweep a compound or cook soup for a husband."

Yet deep within Adah burned what she called "The Presence"—an inner voice, an inexplicable conviction that her destiny lay beyond the restrictive confines of domestic subservience. One morning, without anyone’s permission, eight-year-old Adah slipped out of the family compound, barefoot and wearing an oversized pinafore, and walked into the Methodist School classroom of Mr. Cole. Her audacity amused the master, but when she returned home, her mother had reported her missing to the police station.

The beating she received was savage, but Adah did not weep. She had crossed the threshold of the schoolroom; she had seen books, and she knew she would never turn back.

When Pa, who had always harbored a quiet affection for her, died suddenly following an operation, Adah’s life was fractured. Sent to live as an unpaid domestic servant with her maternal uncle, she endured beatings and labor, yet clung to her studies at Methodist Girls’ High School through sheer determination.`,
      questions: [
        {
          id: 'scc-ch1-q1',
          novelId: 'second-class-citizen',
          chapterIndex: 0,
          chapterNumber: 1,
          chapterTitle: 'Childhood in Lagos and The Presence',
          question: 'How was the birth of female children viewed in Adah’s childhood society in Lagos?',
          options: [
            'A. Celebrated with national holidays',
            'B. Treated as of secondary importance compared to male heirs who preserve family lineage',
            'C. Rewarded with government bursaries',
            'D. Completely hidden from the public'
          ],
          correctAnswer: 1,
          explanation: 'Patriarchal traditions prioritized male children like Boy, viewing girls primarily as future domestic labor and sources of dowry.',
          difficulty: 'easy',
          topic: 'Patriarchy & Cultural Setting',
          year: 'Authentic JAMB UTME'
        },
        {
          id: 'scc-ch1-q2',
          novelId: 'second-class-citizen',
          chapterIndex: 0,
          chapterNumber: 1,
          chapterTitle: 'Childhood in Lagos and The Presence',
          question: 'What bold action did Adah take to begin her education in Chapter 1?',
          options: [
            'A. She won a national essay competition',
            'B. She ran away from home and walked into Mr. Cole’s classroom at Methodist School without her mother’s permission',
            'C. She forged an admission letter from the colonial governor',
            'D. Her uncle paid her tuition secretly'
          ],
          correctAnswer: 1,
          explanation: 'Adah boldly entered Mr. Cole’s classroom on her own initiative, demonstrating her fierce determination.',
          difficulty: 'medium',
          topic: 'Character Resilience: Adah',
          year: 'Authentic JAMB UTME'
        }
      ]
    },
    {
      id: 'scc-ch-2',
      chapterNumber: 2,
      title: 'Marriage of Convenience and The Dream of the United Kingdom',
      wordCount: 2150,
      estimatedMinutes: 11,
      summary: 'Adah marries Francis Obi to escape servitude and continue her studies, earns a lucrative salary at the American Consulate, and finances Francis’s voyage to England.',
      content: `At sixteen, surrounded by elderly suitors seeking to purchase her youth with heavy bride prices, Adah realized that the only way to retain control over her earnings and education was to marry a young student.

She chose Francis Obi, an impoverished accounting student whose quiet demeanor she mistook for gentleness. Through sheer intellectual brilliance, Adah secured a senior library position at the American Consulate Library in Lagos, earning a magnificent salary of thirty-three pounds a month—an enormous fortune in the late 1950s.

With her income, she maintained Francis, his demanding parents, and their growing family. But her childhood dream of the United Kingdom never dimmed. She envisioned England as the motherland of culture, freedom, and civilized dignity.

When she proposed traveling, Francis’s father decreed that Francis must go first to study while Adah remained in Lagos to continue financing his expenses. Submissive to custom yet strategically focused, Adah complied. She bought Francis’s first-class ocean passage, sent him monthly allowances, and patiently saved until she could purchase tickets for herself and her children to join him in London.`,
      questions: [
        {
          id: 'scc-ch2-q1',
          novelId: 'second-class-citizen',
          chapterIndex: 1,
          chapterNumber: 2,
          chapterTitle: 'Marriage of Convenience and The Dream of the United Kingdom',
          question: 'Where did Adah work in Lagos, earning the lucrative salary that financed her household and Francis’s voyage?',
          options: [
            'A. The Federal Ministry of Finance',
            'B. The American Consulate Library in Lagos',
            'C. Standard Chartered Bank',
            'D. King’s College Lagos'
          ],
          correctAnswer: 1,
          explanation: 'Adah was employed at the American Consulate Library, earning a very high salary of £33 per month.',
          difficulty: 'easy',
          topic: 'Plot & Employment',
          year: 'Authentic JAMB UTME'
        }
      ]
    },
    {
      id: 'scc-ch-3',
      chapterNumber: 3,
      title: 'The Cold Reality of London and The Basement Room',
      wordCount: 2300,
      estimatedMinutes: 12,
      summary: 'Adah arrives in Liverpool and London, discovering that Francis has been crushed by racial prejudice, residing in a squalid, freezing single room in Ashdown Street.',
      content: `The Liverpool docks were shrouded in grey, penetrating fog. Expecting the dazzling towers of imperial majesty, Adah stepped into a bleak landscape of sooty brick, wet pavements, and biting cold.

When Francis met her, he was unrecognizable. The self-assured young man from Lagos had withered into a nervous, defeated figure. He took Adah and the children to Ashdown Street, North London, into a single cramped, damp room where a paraffin heater sputtered black smoke against peeling wallpaper.

Francis informed her of the brutal hierarchy: "In England, Adah, you are a second-class citizen. You are black. You must know your place."

Francis had abandoned all ambition, failing his preliminary accounting examinations repeatedly. He expected Adah to foster her children with white foster mothers—as other Nigerian immigrant students were doing—and take up factory work to support him.

Adah was horrified. "I did not bring my children across the sea to surrender them to strangers," she declared. Defying Francis, she refused to foster her babies and set out across the freezing streets of London to find professional employment and decent housing.`,
      questions: [
        {
          id: 'scc-ch3-q1',
          novelId: 'second-class-citizen',
          chapterIndex: 2,
          chapterNumber: 3,
          chapterTitle: 'The Cold Reality of London and The Basement Room',
          question: 'What shocking reality does Francis announce to Adah upon her arrival in London regarding their social status?',
          options: [
            'A. That they have been granted British citizenship automatically',
            'B. That as black immigrants in Britain, they are regarded as "second-class citizens" who must accept low status',
            'C. That they are entitled to free council houses in central London',
            'D. That white employers prefer African university graduates'
          ],
          correctAnswer: 1,
          explanation: 'Francis reveals his defeated mindset, warning Adah that Britain considers them second-class citizens.',
          difficulty: 'easy',
          topic: 'Core Theme: Second-Class Status',
          year: 'Authentic JAMB UTME'
        }
      ]
    },
    {
      id: 'scc-ch-4',
      chapterNumber: 4,
      title: 'Chalk Farm Library, Mr. Noble, and Domestic Terror',
      wordCount: 2450,
      estimatedMinutes: 12,
      summary: 'Adah secures a prestigious library post at Chalk Farm Library, secures rooms at Mr. Noble’s house, and endures escalating physical assaults from Francis.',
      content: `Adah’s intellect proved indomitable. Despite racial prejudice in employment, she marched into the Finchley Central Library and Chalk Farm Library, impressing the senior librarians with her cataloging knowledge and winning an appointment as a Senior Library Assistant.

Finding accommodation was a nightmare of bigotry. Landlords slammed doors in her face the moment they saw her skin or posted notices reading "Sorry, No Coloureds." Finally, they rented rooms in the dilapidated house of Mr. Noble, an eccentric Nigerian immigrant whose physical injuries and psychological trauma from factory work had left him an outcast.

At Chalk Farm, Adah found intellectual companionship with Bill, an open-minded Canadian colleague who introduced her to James Baldwin’s writings and recognized her natural gift for storytelling. Bill encouraged her: "Write your story, Adah. The world needs to hear your voice."

Inspired, Adah began writing late into the night, completing the manuscript of a novel titled *The Bride Price*.

When Francis discovered the notebook, his reaction was monstrous. Consumed by jealousy and terrified of her intellectual independence, he took the handwritten pages and threw them into the fireplace, watching them burn to ashes before her horrified eyes.

"You are just a woman," Francis snarled. "You will never be a writer."`,
      questions: [
        {
          id: 'scc-ch4-q1',
          novelId: 'second-class-citizen',
          chapterIndex: 3,
          chapterNumber: 4,
          chapterTitle: 'Chalk Farm Library, Mr. Noble, and Domestic Terror',
          question: 'Who encourages Adah to write and introduces her to the works of James Baldwin at Chalk Farm Library?',
          options: ['A. Francis Obi', 'B. Bill, the Canadian colleague', 'C. Mr. Noble', 'D. Her landlady Mrs. Cook'],
          correctAnswer: 1,
          explanation: 'Bill recognizes her literary genius, gives her books, and encourages her to tell her story.',
          difficulty: 'medium',
          topic: 'Characters & Literary Mentorship',
          year: 'Authentic JAMB UTME'
        },
        {
          id: 'scc-ch4-q2',
          novelId: 'second-class-citizen',
          chapterIndex: 3,
          chapterNumber: 4,
          chapterTitle: 'Chalk Farm Library, Mr. Noble, and Domestic Terror',
          question: 'What is the title of the manuscript that Adah writes and Francis destroys in the fireplace?',
          options: ['A. The Joys of Motherhood', 'B. The Bride Price', 'C. Second Class Citizen', 'D. Destination Biafra'],
          correctAnswer: 1,
          explanation: 'Adah writes the manuscript of *The Bride Price*, which Francis burns out of spite and jealousy.',
          difficulty: 'easy',
          topic: 'Plot Climax & Key Detail',
          year: 'Authentic JAMB UTME'
        }
      ]
    },
    {
      id: 'scc-ch-5',
      chapterNumber: 5,
      title: 'The Courtroom and The Triumph of Freedom',
      wordCount: 2300,
      estimatedMinutes: 12,
      summary: 'Following a near-fatal assault by Francis, Adah takes her children and walks away forever. In court, Francis denies his children, but Adah embraces her autonomy and starts life anew as a mother and author.',
      content: `The burning of her manuscript severed the last remaining filament of Adah’s patience. But Francis’s violence reached its absolute limit when he attacked her physically in front of their terrified children, inflicting severe bodily injuries that required hospital attention.

Gathering her battered body and her four young children—Titi, Vicky, Bubu, and the newborn baby—Adah walked out of Mr. Noble’s house into the cold night rain. She would never return.

In the magistrates’ court, Francis reached the lowest depth of cowardice. In a bid to evade paying child maintenance support, he looked at the magistrate and declared: "They are not my children. She had them with other men. I do not own them and I have no money to give her."

The courtroom gashed with disgust. The magistrate turned to Adah with profound sympathy: "Mrs. Obi, do you have anyone to assist you?"

Adah stood tall, bruised in body but sovereign in spirit. "I have myself, Your Honor, and I have my children. That is enough."

Outside the courthouse, an old acquaintance from Lagos recognized her, bought a taxi for her and her babies, and wished her well. As the cab pulled into the London streets, Adah looked at her children. She had no money, no home, and no husband. But she had her freedom. She had her mind. She was no longer anyone’s second-class citizen; she was Adah, the mother, the writer, the architect of her own destiny.`,
      questions: [
        {
          id: 'scc-ch5-q1',
          novelId: 'second-class-citizen',
          chapterIndex: 4,
          chapterNumber: 5,
          chapterTitle: 'The Courtroom and The Triumph of Freedom',
          question: 'In the court proceeding, what cowardly lie does Francis utter to avoid paying child support for his offspring?',
          options: [
            'A. That he is an undercover police detective',
            'B. That he is not the biological father of the children and owns nothing',
            'C. That he is returning to Nigeria the following morning',
            'D. That Adah earns ten times more than the magistrate'
          ],
          correctAnswer: 1,
          explanation: 'Francis brazenly disowns his own biological children before the magistrate to escape financial responsibility.',
          difficulty: 'easy',
          topic: 'Plot Resolution & Character',
          year: 'Authentic JAMB UTME'
        },
        {
          id: 'scc-ch5-q2',
          novelId: 'second-class-citizen',
          chapterIndex: 4,
          chapterNumber: 5,
          chapterTitle: 'The Courtroom and The Triumph of Freedom',
          question: 'Adah’s final declaration, "I have myself, and I have my children. That is enough," represents:',
          options: [
            'A. Complete despair and resignation to defeat',
            'B. The ultimate triumph of female agency, self-reliance, and maternal resilience over patriarchal oppression',
            'C. A plea for charity from the court',
            'D. A desire to return to her mother in Lagos'
          ],
          correctAnswer: 1,
          explanation: 'The conclusion celebrates Adah’s psychological liberation and sovereignty as an autonomous woman and mother.',
          difficulty: 'medium',
          topic: 'Thematic Resolution',
          year: 'Authentic JAMB UTME'
        }
      ]
    }
  ]
};
