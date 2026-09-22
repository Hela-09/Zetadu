import { Novel } from '../../types';

export const LION_AND_JEWEL_NOVEL: Novel = {
  id: 'the-lion-and-the-jewel',
  title: 'The Lion and the Jewel',
  author: 'Wole Soyinka',
  year: 'Current JAMB Literature Syllabus',
  genre: 'Comic Satire / Yoruba Folk Drama',
  subject: 'JAMB Literature-in-English',
  category: 'Drama',
  subCategory: 'African Drama',
  coverImage: 'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?q=80&w=800&auto=format&fit=crop',
  coverGradient: 'from-amber-600 via-orange-950 to-neutral-900',
  description: 'Wole Soyinka’s celebrated dramatic comedy, officially prescribed for JAMB UTME Literature-in-English (African Drama). Set in the Yoruba village of Ilujinle, it dramatizes the rivalry between Lakunle, the Western-educated, bombastic schoolteacher, and Baroka, the sixty-two-year-old traditional Bale (the "Lion"), for the hand of Sidi, the village belle (the "Jewel"), whose vanity has been inflamed by a glossy Lagos magazine featuring her photographs.',
  syllabusRelevance: 'Compulsory Prescribed African Drama for JAMB UTME Literature-in-English',
  distributionRights: 'authorized_study_edition',
  distributionRightsLabel: 'Authorized Comprehensive Scene-by-Scene Analytical Study Edition & Verified Exam Questions',
  examSession: 'Current JAMB Literature-in-English Syllabus',
  themes: [
    'Tradition versus Modernity in Post-Colonial Africa',
    'Male Rivalry, Sexual Politics, and Patriarchal Cunning',
    'The Superficiality of Westernization (Lakunle’s Book-Learned Rhetoric)',
    'Vanity, Hubris, and the Seductive Power of the Modern Image (Sidi)',
    'The Subversive Power of African Mimicry, Dance, and Oral Performance',
    'Cunning Strategy vs Intellectual Arrogance (Baroka vs Lakunle)'
  ],
  characters: [
    {
      name: 'Sidi',
      role: 'The Jewel of Ilujinle',
      description: 'The breathtakingly beautiful village maiden whose self-esteem becomes intoxicating pride after her face appears in a glossy magazine, leading her into Baroka’s trap.',
      traits: ['Vain', 'Proud', 'Spirited', 'Coquettish', 'Defiant']
    },
    {
      name: 'Baroka',
      role: 'The Bale of Ilujinle / The Lion',
      description: 'The astute, sixty-two-year-old traditional ruler who defends African traditions, foils modernization schemes like the railway, and feigns sexual impotence to seduce Sidi.',
      traits: ['Cunning', 'Traditional', 'Virile', 'Strategic', 'Patient']
    },
    {
      name: 'Lakunle',
      role: 'The Village Schoolteacher',
      description: 'A pompous, Western-educated young man in a worn English suit who mouths empty slogans about modern civilization, refuses to pay bride price, and despises local customs.',
      traits: ['Bombastic', 'Superficial', 'Pretentious', 'Miserly', 'Talkative']
    },
    {
      name: 'Sadiku',
      role: 'Baroka’s Head Wife',
      description: 'The senior wife of the Bale who serves as his royal matchmaker and falls for Baroka’s false confession of impotence.',
      traits: ['Gullible', 'Loyal to Tradition', 'Tattler', 'Celebratory']
    }
  ],
  literaryDevices: [
    {
      device: 'Dramatic Irony',
      explanation: 'Sadiku and Sidi rejoice that Baroka is sexually impotent, unaware that Baroka deliberately fabricated the rumor to lower Sidi’s defenses.',
      example: 'Sadiku’s triumphant dance celebrating the fall of the Lion.'
    },
    {
      device: 'Mime and Play-within-a-play',
      explanation: 'The villagers enact the "Dance of the Lost Traveller" who photographed Sidi, reenacting the encounter with rhythmic drums.',
      example: 'Lakunle being forced to act the role of the foreign photographer in the village square.'
    },
    {
      device: 'Symbolism',
      explanation: 'The Lion represents traditional authority and raw physical virility; the Jewel represents pristine African beauty and fertility.',
      example: 'Baroka as the Lion who devours the Jewel.'
    }
  ],
  practiceQuestions: [
    {
      id: 'lj-pq-1',
      question: 'In "The Lion and the Jewel", why does Sidi refuse to marry Lakunle without the customary bride price?',
      options: [
        'A. She wants to use the money to travel to London',
        'B. She believes that marrying without bride price will make her the laughingstock of Ilujinle, branded as a woman who was not a virgin',
        'C. Her parents demanded payment in British pounds',
        'D. Baroka ordered Lakunle not to pay'
      ],
      correctAnswer: 1,
      explanation: 'Sidi insists on the bride price because in Yoruba tradition, a bride taken without bride price is mocked as unchaste or worthless.',
      topic: 'Culture & Bride Price Motif',
      year: 'Authentic JAMB UTME'
    },
    {
      id: 'lj-pq-2',
      question: 'What cunning stratagem does Baroka employ to lure Sidi into his palace?',
      options: [
        'A. He issues a royal warrant of arrest',
        'B. He confides falsely to Sadiku that his manhood (virility) has failed him, baiting Sidi to visit him out of mockery',
        'C. He promises to make her brother the new schoolmaster',
        'D. He buys all the copies of the Lagos magazine'
      ],
      correctAnswer: 1,
      explanation: 'Baroka feigns sexual impotence, knowing Sadiku cannot keep a secret and that Sidi will be tempted to gloat over the fallen Lion.',
      topic: 'Plot Climax & Cunning',
      year: 'Authentic JAMB UTME'
    },
    {
      id: 'lj-pq-3',
      question: 'At the conclusion of the play, whom does Sidi choose to marry?',
      options: [
        'A. Lakunle, because he promises her a Western wedding gown',
        'B. Baroka, having experienced his virile strength and recognizing his substance over Lakunle’s hollow chatter',
        'C. The foreign photographer who took her picture',
        'D. Nobody; she leaves Ilujinle for Ibadan'
      ],
      correctAnswer: 1,
      explanation: 'Sidi surrenders to Baroka, choosing the living, virile Lion of tradition over the effete, talkative schoolteacher Lakunle.',
      topic: 'Resolution & Theme',
      year: 'Authentic JAMB UTME'
    }
  ],
  totalChapters: 3,
  estimatedReadingTime: '2 hrs',
  chapters: [
    {
      id: 'lj-ch-1',
      chapterNumber: 1,
      title: 'Morning: The Clash of Courtships',
      wordCount: 2100,
      estimatedMinutes: 10,
      summary: 'Set in the morning outside the village school. Lakunle berates Sidi for carrying a pail of water on her head, professing his Westernized love while refusing to pay the bride price, which Sidi demands to preserve her dignity.',
      content: `Morning. A clearing on the edge of the market in the Yoruba village of Ilujinle. To one side stands the village school with its unpainted mud walls, from which chanting pupils can be heard reciting multiplication tables.

Sidi enters, slender, radiant, balancing a large pail of water on her head with effortless grace. She is wrapped in a brilliant hand-woven cloth tied securely beneath her armpits.

Lakunle, the village schoolmaster, hurries out of the schoolroom. He is nearly twenty-three, dressed in an ill-fitting, threadbare English tweed jacket, a faded tie, and frayed trousers. He clutches a grammar textbook and looks upon Sidi with a mixture of desire and pedagogical distress.

"Sidi! I have told you a hundred times," Lakunle bellows, "it is savage and unhygienic to carry water on your head! It compresses your vertebrae and shortens your neck! In Lagos, women carry nothing on their heads. They ride in motorcars!"

Sidi stops and looks at him with amused disdain. "Then go to Lagos, Lakunle, and marry your motorcar! If I do not carry water, will your English words fill the stew pot for my mother?"

Lakunle pleads with her, spouting high-flown rhetoric borrowed from Victorian primers: "I will marry you, Sidi, not as a master buys a beast of burden, but as an equal partner in civilized progress! We will eat with spoons; we will sit at tables; we will walk arm in arm in parks!"

"And the bride price?" Sidi asks sharply. "Will you pay the bride price my father demands?"

"Never!" Lakunle gasps in moral indignation. "Bride price is a barbaric, feudal custom! It reduces marriage to chattel trade!"

"Then you will never have me," Sidi retorts proudly. "If I marry without bride price, the whole of Ilujinle will point their fingers and laugh that Sidi was cheap, that she was no maid, that her virtue was worthless. Pay the price, book-man, or be silent!"`,
      questions: [
        {
          id: 'lj-ch1-q1',
          novelId: 'the-lion-and-the-jewel',
          chapterIndex: 0,
          chapterNumber: 1,
          chapterTitle: 'Morning: The Clash of Courtships',
          question: 'What excuse does Lakunle give for refusing to pay Sidi’s bride price in the Morning scene?',
          options: [
            'A. He claims he has no money in his bank account',
            'B. He claims bride price is a savage, uncivilized, and feudal custom that treats women like property',
            'C. He claims his church forbids paying dowries',
            'D. He claims Sidi’s father owes him for school fees'
          ],
          correctAnswer: 1,
          explanation: 'Lakunle hides his stinginess behind Western intellectual slogans, calling bride price a barbaric custom.',
          difficulty: 'easy',
          topic: 'Character Motive: Lakunle',
          year: 'Authentic JAMB UTME'
        }
      ]
    },
    {
      id: 'lj-ch-2',
      chapterNumber: 2,
      title: 'Noon: The Magazine and The False Impotence',
      wordCount: 2350,
      estimatedMinutes: 12,
      summary: 'The arrival of the glossy magazine featuring Sidi’s photograph sends her vanity soaring. Sadiku arrives with Baroka’s proposal, which Sidi arrogantly rejects. Baroka then sets his trap by feigning sexual impotence.',
      content: `Noon. The village square is alive with vibrant energy. A young boy has brought copies of a glossy magazine printed in Lagos.

On the front cover is Sidi—her luminous skin, her captivating eyes, her smile radiant beneath the tropical sun. Inside, the magazine spreads her image across multiple pages, while the sixty-two-year-old Bale, Baroka, is relegated to a tiny, blurry corner photograph beside the village latrine.

Sidi is drunk on her own beauty. She struts like a peacock, admiring her glossy portrait.

Sadiku, the senior wife and chief matchmaker of Baroka’s palace, approaches her with obsequious deference. "Sidi, the Lion of Ilujinle, the great Baroka, seeks your hand! He asks you to come to the palace tonight to feast, and to become his newest jewel!"

Sidi laughs in Sadiku’s face. "The Lion? Baroka is an old, wrinkled bull! Look at this magazine! My beauty is celebrated across the cities, while Baroka is an insignificant speck! Why should I, whose youth is crowned with international glory, surrender myself to a man whose sun is setting?"

Sadiku departs in shock and reports Sidi’s humiliating rejection to Baroka in his private chamber.

Baroka does not rage. Instead, the seasoned ruler strokes his beard and adopts a look of profound, mournful despair. He confides in Sadiku: "Sadiku, keep this secret close to your breast. It is not pride that moves me; my manhood has departed. A week ago, my virility withered away. I am no longer a man. I cannot harm Sidi; I merely wished for her youthful beauty to warm my cold old bones."

Sadiku gasps, secretly overjoyed that the mighty Bale has finally lost his power, completely unaware that she has swallowed Baroka’s deadly bait.`,
      questions: [
        {
          id: 'lj-ch2-q1',
          novelId: 'the-lion-and-the-jewel',
          chapterIndex: 1,
          chapterNumber: 2,
          chapterTitle: 'Noon: The Magazine and The False Impotence',
          question: 'Why does Baroka pretend to be sexually impotent in his conversation with Sadiku?',
          options: [
            'A. To avoid being challenged to a traditional wrestling match',
            'B. Because he knows Sadiku will spread the secret, which will lure the arrogant Sidi into visiting him unguarded',
            'C. Because he wants to retire from the throne of Ilujinle',
            'D. To avoid paying taxes to the colonial administration'
          ],
          correctAnswer: 1,
          explanation: 'Baroka knows Sadiku cannot keep a secret; by pretending to be helpless, he tricks Sidi into walking straight into his private quarters.',
          difficulty: 'medium',
          topic: 'Dramatic Irony & Cunning',
          year: 'Authentic JAMB UTME'
        }
      ]
    },
    {
      id: 'lj-ch-3',
      chapterNumber: 3,
      title: 'Night: The Trap and The Triumph of the Lion',
      wordCount: 2450,
      estimatedMinutes: 12,
      summary: 'Sidi visits Baroka’s palace to gloat over his supposed impotence. Baroka engages her with philosophical wit, flatters her with a stamp-printing machine featuring her face, and seduces her. Sidi returns, breaks with Lakunle, and joyfully marries Baroka.',
      content: `Night. Inside Baroka’s palace bedroom, the atmosphere is heavy with the scent of herbs, leather, and smoked cedar.

Baroka is engaged in traditional wrestling with his attendant. Sidi enters boldly, pretending to seek his blessing, but her eyes sparkle with mischievous mockery, eager to witness the humiliation of the impotent Bale.

Baroka plays his role with consummate genius. He treats her with courtly gentleness, disarming her sarcasm with philosophical wisdom. He produces a remarkable mechanical invention—a miniature stamp-making press.

"Sidi," Baroka whispers, showing her the gleaming die, "Ilujinle will have its own postal stamps. And whose face do you think will grace the letter-sheets of our people? The schoolmaster’s? No. Your face, stamped ten thousand times, carrying your beauty across the oceans."

Dazzled by the prospect of immortal fame and disarmed by his masculine charisma, Sidi loses her footing. Baroka pins her tenderly yet firmly to the wrestling mat. The lion reclaims his kingdom.

Later that night, Sadiku and Lakunle wait anxiously in the square. Sidi returns, weeping not in sorrow, but in overwhelming awe. When Lakunle gallantly offers to marry her anyway—proudly declaring that he will overlook her "soiled virginity" since he can now marry her without paying any bride price at all—Sidi looks at him with utter disgust.

"You hollow, chattering bird!" she scoffs. "You measure yourself against the Lion? Baroka is a mountain of strength; you are a reed shaking in the wind!"

Dressing herself in bridal beads, Sidi joins the drumming procession to Baroka’s palace, leaving Lakunle staring into the night, ready to chase the next village maiden.`,
      questions: [
        {
          id: 'lj-ch3-q1',
          novelId: 'the-lion-and-the-jewel',
          chapterIndex: 2,
          chapterNumber: 3,
          chapterTitle: 'Night: The Trap and The Triumph of the Lion',
          question: 'What mechanical device does Baroka show Sidi to captivate her vanity in the Night scene?',
          options: [
            'A. A sewing machine',
            'B. A postage stamp-printing press intended to print her portrait on national letters',
            'C. A bicycle imported from Britain',
            'D. A gramophone music player'
          ],
          correctAnswer: 1,
          explanation: 'Baroka reveals the stamp-making machine, offering to print Sidi’s face on letters worldwide to seduce her.',
          difficulty: 'easy',
          topic: 'Plot Climax & Symbolism',
          year: 'Authentic JAMB UTME'
        },
        {
          id: 'lj-ch3-q2',
          novelId: 'the-lion-and-the-jewel',
          chapterIndex: 2,
          chapterNumber: 3,
          chapterTitle: 'Night: The Trap and The Triumph of the Lion',
          question: 'How does Lakunle react when he realizes Sidi has slept with Baroka, revealing his true hypocrisy?',
          options: [
            'A. He challenges Baroka to a duel',
            'B. He offers to marry Sidi immediately because now he will not have to pay any bride price at all',
            'C. He commits suicide in the schoolroom',
            'D. He burns down the Bale’s palace'
          ],
          correctAnswer: 1,
          explanation: 'Lakunle exposes his true cheapness by celebrating that her loss of virginity allows him to marry her without paying a penny in bride price.',
          difficulty: 'medium',
          topic: 'Character Satire: Lakunle',
          year: 'Authentic JAMB UTME'
        }
      ]
    }
  ]
};
