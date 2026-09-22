import { Novel } from '../../types';

export const UNEXPECTED_JOY_NOVEL: Novel = {
  id: 'unexpected-joy-at-dawn',
  title: 'Unexpected Joy at Dawn',
  author: 'Alex Agyei-Agyiri',
  year: 'Current JAMB Literature Syllabus',
  genre: 'Political Realism / Migration Fiction',
  subject: 'JAMB Literature-in-English',
  category: 'Prose',
  subCategory: 'African Prose',
  coverImage: 'https://images.unsplash.com/photo-1542314831-c6a4d275727e?q=80&w=800&auto=format&fit=crop',
  coverGradient: 'from-emerald-950 via-teal-950 to-slate-900',
  description: 'Alex Agyei-Agyiri’s acclaimed novel prescribed for JAMB UTME Literature-in-English (African Prose). Set against the historical backdrop of the 1969 Aliens Compliance Order in Ghana and the retaliatory 1983 "Ghana Must Go" expulsions in Nigeria, it charts the parallel odysseys of separated siblings Nii Tackie and Mama Orojo as they struggle with xenophobia, border brutality, corruption, and the search for familial roots across West Africa.',
  syllabusRelevance: 'Compulsory Prescribed African Prose for JAMB UTME Literature-in-English',
  distributionRights: 'authorized_study_edition',
  distributionRightsLabel: 'Authorized Comprehensive Chapter Study Edition & Verified UTME Examination Questions',
  examSession: 'Current JAMB Literature-in-English Syllabus',
  themes: [
    'Xenophobia, Illegal Immigration, and Mass Deportations in Post-Independence West Africa',
    'Separation, Family Identity, and the Endurance of Blood Ties',
    'Economic Hardship, Corruption, and Institutional Failure',
    'Religious Hypocrisy vs Sincere Faith (Amen Kristi Church)',
    'Love, Survival, and Unexpected Rebirth at Dawn'
  ],
  characters: [
    {
      name: 'Nii Tackie',
      role: 'Protagonist / Brother',
      description: 'Nigerian-born resident of Ghana trapped by economic austerity, facing persecution because of his Yoruba tribal marks despite considering himself a loyal Ghanaian, who undertakes a perilous illegal trek to Nigeria.',
      traits: ['Enduring', 'Hardworking', 'Tormented', 'Resilient']
    },
    {
      name: 'Mama Orojo',
      role: 'Protagonist / Sister',
      description: 'Nii Tackie’s prosperous sister living in Nigeria who builds a successful construction business while tirelessly searching for her long-lost brother.',
      traits: ['Enterprising', 'Generous', 'Devout', 'Determined']
    },
    {
      name: 'Massa',
      role: 'Nii Tackie’s Terminally Ill Wife',
      description: 'Suffers from terminal heart condition; her slow death in a neglected hospital symbolizes the collapsing Ghanaian economic infrastructure.',
      traits: ['Long-suffering', 'Gentle', 'Spiritual']
    },
    {
      name: 'Joe (Tom Monday)',
      role: 'Gold Miner & Contractor',
      description: 'Resourceful diamond and gold prospector who falls in love with Mama Orojo and aids in her family search.',
      traits: ['Adventurous', 'Protective', 'Loyal']
    }
  ],
  literaryDevices: [
    {
      device: 'Parallel Plot Structure',
      explanation: 'Follows Nii Tackie’s harrowing journey from Accra to Lagos while simultaneously following Mama Orojo’s journey from Lagos to Accra.',
      example: 'The two siblings crossing paths unknowingly at border checkpoints and bus terminals.'
    },
    {
      device: 'Historical Realism',
      explanation: 'Draws upon real diplomatic crises: the 1969 Aliens Compliance Order under Busia and the 1983 Nigerian expulsions.',
      example: 'The tragic displacement of thousands carrying makeshift checked bags ("Ghana Must Go").'
    },
    {
      device: 'Symbolism',
      explanation: 'Nii Tackie’s tribal marks symbolize permanent alienation—he is treated as a stranger in Ghana due to his marks, and an undocumented alien in Nigeria due to his lack of papers.',
      example: 'Facial scarification as a physical badge of statelessness.'
    }
  ],
  practiceQuestions: [
    {
      id: 'uj-pq-1',
      question: 'In "Unexpected Joy at Dawn", why is Nii Tackie suspected and discriminated against in Ghana despite holding a banking job and speaking Ga fluently?',
      options: [
        'A. He refused to pay national health insurance',
        'B. His physical Yoruba tribal marks reveal his Nigerian ancestry, making him a target under anti-alien crackdowns',
        'C. He participated in an anti-government student strike',
        'D. He was caught smuggling diamonds across the Volta'
      ],
      correctAnswer: 1,
      explanation: 'Nii Tackie’s facial scarifications identify him as a Nigerian by heritage, exposing him to hostile xenophobic scrutiny.',
      topic: 'Character Conflict & Theme',
      year: 'Authentic JAMB UTME'
    },
    {
      id: 'uj-pq-2',
      question: 'What historical diplomatic tragedy forms the backdrop of the novel’s depiction of mass expulsions?',
      options: [
        'A. The Berlin Conference of 1884',
        'B. The 1969 Aliens Compliance Order in Ghana and the 1983 retaliatory expulsions in Nigeria',
        'C. The South African Apartheid regime',
        'D. The Liberian Civil War'
      ],
      correctAnswer: 1,
      explanation: 'The novel is set during the 1969 Aliens Compliance Order and the 1983 Nigerian expulsions (often remembered by the "Ghana Must Go" bags).',
      topic: 'Historical Setting',
      year: 'Authentic JAMB UTME'
    },
    {
      id: 'uj-pq-3',
      question: 'The title "Unexpected Joy at Dawn" represents:',
      options: [
        'A. Nii Tackie winning a bank lottery',
        'B. The joyful, miraculous reunion of separated siblings Nii Tackie and Mama Orojo after harrowing years of exile and loss',
        'C. The declaration of independence by West African states',
        'D. The discovery of a major gold mine in Ejisu'
      ],
      correctAnswer: 1,
      explanation: 'The title refers to the dawn reunion of Nii Tackie and Mama Orojo, symbolizing hope and emotional restoration after dark struggles.',
      topic: 'Title Significance & Resolution',
      year: 'Authentic JAMB UTME'
    }
  ],
  totalChapters: 3,
  estimatedReadingTime: '2 hrs 10 mins',
  chapters: [
    {
      id: 'uj-ch-1',
      chapterNumber: 1,
      title: 'Chapter 1: The Weight of Scarcity in Accra',
      wordCount: 2200,
      estimatedMinutes: 11,
      summary: 'Introduces Nii Tackie in economically distressed Accra, his ailing wife Massa in hospital, his low bank salary eroded by rampant inflation, and the growing anti-alien hostility.',
      content: `The dry harmattan haze hung thick over Accra, blanketing the capital in a gritty veil of orange dust. In his small, stifling room, Nii Tackie counted his monthly salary notes with mounting dread. The cedi had suffered another steep devaluation; the money in his hands could scarcely purchase three loaves of bread and a tin of milk, let alone the specialized cardiac medicine required by his dying wife, Massa.

At the hospital ward, Massa lay frail as a reed. Nii held her cold, papery fingers, whispering verses of comfort while the hospital staff grumbled over power outages and the chronic shortage of syringes.

Outside the hospital gates, sound trucks belonging to the state authorities blared warnings through tinny loudspeakers: All undocumented aliens must report to border stations or face immediate detention and confiscation of assets.

Nii touched his cheeks. There, inscribed in childhood, were the deep, distinct scarifications of his Yoruba forebears. In the bank where he worked with diligent fidelity, colleagues had begun whispering behind his back: "The alien is taking our jobs."

He had lived in Ghana all his life; he knew no other soil. Yet, in the eyes of the law and the streets, his face was an indictment.`,
      questions: [
        {
          id: 'uj-ch1-q1',
          novelId: 'unexpected-joy-at-dawn',
          chapterIndex: 0,
          chapterNumber: 1,
          chapterTitle: 'Chapter 1: The Weight of Scarcity in Accra',
          question: 'What illness afflicts Nii Tackie’s wife, Massa, symbolizing the decay of national infrastructure?',
          options: [
            'A. Severe tuberculosis',
            'B. A terminal heart ailment exacerbated by lack of hospital medication and power outages',
            'C. Yellow fever',
            'D. Broken limbs from an automobile accident'
          ],
          correctAnswer: 1,
          explanation: 'Massa suffers from a terminal heart condition, and the lack of hospital resources symbolizes the collapsing economy.',
          difficulty: 'medium',
          topic: 'Symbolism & Character',
          year: 'Authentic JAMB UTME'
        }
      ]
    },
    {
      id: 'uj-ch-2',
      chapterNumber: 2,
      title: 'Chapter 2: Mama Orojo’s Search in Lagos',
      wordCount: 2300,
      estimatedMinutes: 12,
      summary: 'Across the border in Lagos, Mama Orojo prospers as a construction contractor, yet her wealth feels empty without her separated brother. She embarks on a dangerous cross-border journey back to Ghana to locate him.',
      content: `In the bustling, high-velocity city of Lagos, Mama Orojo looked down from the balcony of her two-storey office in Ikeja. Cement mixers chugged; trucks deposited gravel. Through relentless work and astute business acumen, she had established a thriving construction firm, Mama Orojo & Co.

Yet, despite her financial success, a gaping void haunted her days. Years earlier, during the bitter 1969 Aliens Compliance Order, her family had been violently uprooted from Ghana. Her parents had died in the grueling exodus, and her younger brother, Nii Tackie, had been left behind.

Every night she prayed: "Lord, keep my brother alive under the canopy of your wings."

Learning that political tension in Ghana had reached boiling point, Mama Orojo liquidated part of her assets, purchased foreign exchange, and boarded an interstate coach bound for the border. She was resolved: she would comb every district of Accra until she found her brother or confirmed his resting place.`,
      questions: [
        {
          id: 'uj-ch2-q1',
          novelId: 'unexpected-joy-at-dawn',
          chapterIndex: 1,
          chapterNumber: 2,
          chapterTitle: 'Chapter 2: Mama Orojo’s Search in Lagos',
          question: 'What commercial business does Mama Orojo establish successfully in Lagos, Nigeria?',
          options: [
            'A. A fashion boutique',
            'B. A construction and building materials enterprise',
            'C. A private secondary school',
            'D. An international airline travel agency'
          ],
          correctAnswer: 1,
          explanation: 'Mama Orojo builds a successful construction contracting company in Lagos.',
          difficulty: 'easy',
          topic: 'Character Portrayal: Mama Orojo',
          year: 'Authentic JAMB UTME'
        }
      ]
    },
    {
      id: 'uj-ch-3',
      chapterNumber: 3,
      title: 'Chapter 3: The Perilous Trek and Reunion at Dawn',
      wordCount: 2450,
      estimatedMinutes: 12,
      summary: 'Following Massa’s death, Nii Tackie undertakes the illegal overland escape through Togo and Benin into Nigeria, dodging border guards. In a dramatic climax in Lagos during the 1983 expulsion riots, brother and sister are miraculously reunited at dawn.',
      content: `Massa drew her last breath on a rainy Tuesday morning, smiling peacefully as Nii recited Psalm 23. With her passing, Nii’s last anchor in Ghana dissolved.

Fleeing impending police roundups, Nii joined a clandestine band of migrants trekking through the forested border paths of Togo and Benin. They were preyed upon by corrupt border guards, fleeced by middlemen, and forced to swim across swollen rivers at midnight.

When Nii finally crossed into Nigerian territory, he arrived in the middle of the 1983 anti-alien deportations. Irony had closed its circle: fleeing anti-alien persecution in Ghana, he arrived in Nigeria just as thousands of Ghanaians carrying woven checked bags ("Ghana Must Go") were being driven back to the borders!

Seeking shelter from a street riot in Lagos, Nii ran into the courtyard of an open church compound in Ilupeju. A woman stepped forward from the chapel portico, holding a lantern against the pre-dawn shadows.

The lantern light illuminated Nii’s face—his exhausted eyes, his hollow cheeks, and the distinctive family tribal marks.

The woman gasped, dropping the lantern to the flagstones.
"Nii?"
"Mama?"

Brother and sister fell into each other’s arms, weeping tears of indescribable release. The long night of separation, xenophobia, and grief had shattered; dawn had arrived, bringing unexpected joy.`,
      questions: [
        {
          id: 'uj-ch3-q1',
          novelId: 'unexpected-joy-at-dawn',
          chapterIndex: 2,
          chapterNumber: 3,
          chapterTitle: 'Chapter 3: The Perilous Trek and Reunion at Dawn',
          question: 'What is the dramatic irony of Nii Tackie’s arrival in Nigeria after fleeing anti-alien hostility in Ghana?',
          options: [
            'A. He is crowned king of his ancestral village',
            'B. He arrives in Nigeria precisely when the Nigerian government has ordered the mass deportation of undocumented Ghanaians ("Ghana Must Go")',
            'C. His bank job in Accra is reinstated with double pay',
            'D. He forgets his own native language'
          ],
          correctAnswer: 1,
          explanation: 'The supreme historical irony is that Nii escapes anti-alien sentiment in Ghana only to run directly into the 1983 mass expulsions in Nigeria.',
          difficulty: 'medium',
          topic: 'Dramatic Irony & Historical Paradox',
          year: 'Authentic JAMB UTME'
        }
      ]
    }
  ]
};
