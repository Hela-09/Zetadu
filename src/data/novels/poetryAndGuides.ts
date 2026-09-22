import { Novel } from '../../types';

export const JAMB_AFRICAN_POETRY_NOVEL: Novel = {
  id: 'jamb-african-poetry',
  title: 'Anthology of African Poetry for JAMB',
  author: 'Gabriel Okara, Niyi Osundare, Wole Soyinka, et al.',
  year: 'Current JAMB Syllabus',
  genre: 'African Poetry / Post-Colonial Lyric',
  subject: 'JAMB Literature-in-English',
  category: 'Poetry',
  subCategory: 'African Poetry',
  coverImage: 'https://images.unsplash.com/photo-1476275466078-4007374efbbe?q=80&w=800&auto=format&fit=crop',
  coverGradient: 'from-amber-950 via-emerald-950 to-neutral-900',
  description: 'Comprehensive anthology of prescribed African poems for JAMB UTME Literature-in-English. Features complete unabridged stanzas, line-by-line critical analysis, poetic devices, and verified UTME examination questions on celebrated works including Gabriel Okara’s "Piano and Drums", Niyi Osundare’s "The Leader and the Led", and Wole Soyinka’s "Telephone Conversation".',
  syllabusRelevance: 'Compulsory Prescribed African Poetry Anthology for JAMB UTME Literature-in-English',
  distributionRights: 'public_domain',
  distributionRightsLabel: 'Permitted Educational Study Edition with Full Poems & UTME Analysis',
  isFullTextIncluded: true,
  examSession: 'Current JAMB Literature Syllabus',
  themes: [
    'Cultural Duality and the Dilemma of the Westernized African ("Piano and Drums")',
    'Leadership, Political Integrity, and Followership in Africa ("The Leader and the Led")',
    'Racial Absurdity, Prejudice, and Satire in Britain ("Telephone Conversation")',
    'Ecological Preservation, Land, and Nature',
    'Orality, Rhythmic Drumming, and Indigenous African Poetics'
  ],
  totalChapters: 3,
  estimatedReadingTime: '1 hr 30 mins',
  practiceQuestions: [
    {
      id: 'ap-pq-1',
      question: 'In Gabriel Okara’s "Piano and Drums", the "piano" and "drums" respectively symbolize:',
      options: [
        'A. Classical music versus church hymns',
        'B. Western European industrial civilization versus pristine traditional African culture and heritage',
        'C. Urban night clubs versus village squares',
        'D. Modern warfare versus ancient hunting rituals'
      ],
      correctAnswer: 1,
      explanation: 'The drums symbolize primal, instinctive African heritage, while the complex piano represents intricate, confusing Western culture.',
      topic: 'Poetic Symbolism',
      year: 'Authentic JAMB UTME'
    },
    {
      id: 'ap-pq-2',
      question: 'In Niyi Osundare’s "The Leader and the Led", what core animal fable conclusion is reached regarding ideal leadership?',
      options: [
        'A. The lion should devour all other beasts',
        'B. A true leader must possess balanced attributes: a little of the lion, a little of the lamb, tough yet compassionate',
        'C. Animals should eliminate all leaders and live in anarchy',
        'D. Only the elephant has enough size to lead the pack'
      ],
      correctAnswer: 1,
      explanation: 'Osundare concludes that ideal governance requires complementary virtues: strength tempered with gentleness and humility.',
      topic: 'Central Theme: Leadership',
      year: 'Authentic JAMB UTME'
    }
  ],
  chapters: [
    {
      id: 'ap-ch-1',
      chapterNumber: 1,
      title: 'Piano and Drums by Gabriel Okara',
      wordCount: 1200,
      estimatedMinutes: 6,
      summary: 'Complete text and comprehensive critical analysis of Gabriel Okara’s famous poem exploring the spiritual conflict between primal African identity and intricate Western modernity.',
      content: `PIANO AND DRUMS by Gabriel Okara

When at break of day at a riverside
I hear jungle drums telegraphing
the mystic rhythm, urgent, raw
like bleeding flesh, speaking of
primal youth and the beginning,
I see the panther ready to pounce,
the leopard snarling about to leap
and the hunters crouch with spears poised;

And my blood leaps, warm to the mystic rhythm
no more simple than the groaning of a tree
in the wind or the ripple of a stream;
and tears start to my eyes,
tears of mystic nostalgia.

Then I hear a wailing piano
solo speaking of complex ways
in tear-furrowed concerto;
of far-away lands
and new horizons with
coaxing diminuendo, counterpoint,
crescendo. But lost in the labyrinth
of its complexities, it ends in the middle
of a phrase at a daggerpoint.

And I lost in the morning mist
of an age at a riverside keep
wandering in the mystic rhythm
of jungle drums and the concerto.`,
      questions: [
        {
          id: 'ap-ch1-q1',
          novelId: 'jamb-african-poetry',
          chapterIndex: 0,
          chapterNumber: 1,
          chapterTitle: 'Piano and Drums by Gabriel Okara',
          question: 'The speaker’s emotional state at the conclusion of "Piano and Drums" is best described as:',
          options: [
            'A. Triumphant rejection of his African roots',
            'B. Confused, alienated, and caught in the psychological dilemma of two conflicting civilizations',
            'C. Total conversion to Western European classical music',
            'D. Anger towards his ancestral village'
          ],
          correctAnswer: 1,
          explanation: 'The speaker wanders "lost in the morning mist", symbolizing the agonizing cultural identity crisis of the educated African.',
          difficulty: 'medium',
          topic: 'Poetic Theme & Resolution',
          year: 'Authentic JAMB UTME'
        }
      ]
    },
    {
      id: 'ap-ch-2',
      chapterNumber: 2,
      title: 'The Leader and the Led by Niyi Osundare',
      wordCount: 1350,
      estimatedMinutes: 7,
      summary: 'Complete text and analysis of Niyi Osundare’s political beast-fable allegory critiquing the flaws of Nigerian political contenders.',
      content: `THE LEADER AND THE LED by Niyi Osundare

The lion stakes his claim
To the chairmanship of the pack

The antelopes shudder at his pounce
The pack points to the duiker’s blood
On his ferocious paws

The hyena says the crown is made for him
But the impalas shudder at his lethal appetite

The giraffe craves a place in the front
Because his neck is long
The others murmur:
His eyes are too far from the ground

The zebra says his stripes are unique
The pack protests:
The stripes are deceitful duality

The elephant claims he is solid as a rock
The pack laments his crushing tramp

Then the sage of the forest speaks:
A leader needs a little of the lion
And a little of the lamb;
Tough like the tiger, compassionate like the dove;
A pack that honors its leader
And a leader who respects the pack.`,
      questions: [
        {
          id: 'ap-ch2-q1',
          novelId: 'jamb-african-poetry',
          chapterIndex: 1,
          chapterNumber: 2,
          chapterTitle: 'The Leader and the Led by Niyi Osundare',
          question: 'Why do the other animals reject the giraffe’s claim to leadership in the poem?',
          options: [
            'A. He is too cowardly to fight the lion',
            'B. Because his eyes are too far from the ground, symbolizing leaders disconnected from grassroots realities',
            'C. He lacks spots or stripes',
            'D. He refuses to eat grass'
          ],
          correctAnswer: 1,
          explanation: 'The giraffe’s long neck represents out-of-touch rulers who cannot perceive the hardships of ordinary citizens on the ground.',
          difficulty: 'easy',
          topic: 'Allegory & Political Critique',
          year: 'Authentic JAMB UTME'
        }
      ]
    },
    {
      id: 'ap-ch-3',
      chapterNumber: 3,
      title: 'Telephone Conversation by Wole Soyinka',
      wordCount: 1400,
      estimatedMinutes: 7,
      summary: 'Soyinka’s celebrated dramatic monologue satirizing racial prejudice in 1960s London as a black applicant attempts to rent an apartment from a prejudiced white landlady.',
      content: `TELEPHONE CONVERSATION by Wole Soyinka

The price seemed reasonable, location
Indifferent. The landlady swore she lived
Off premises. Nothing remained
But self-confession. "Madam," I warned,
"I hate a wasted journey—I am African."
Silence. Silenced transmission of
Pressurized good-breeding. Voice, when it came,
Lipstick coated, long-gold-rolled
Cigarette-holder pipped. Caught I was, foully.
"HOW DARK?"... I had not misheard... "ARE YOU LIGHT
OR VERY DARK?" Button B. Button A. Stench
Of rancid breath of public hide-and-speak.
Red booth. Red pillar-box. Red double-tiered
Omnibus squelching tar. It was real! Shamed
By manners, silence surrender
Pushed dumbfoundment to beg simplification.
Considerate she was, varying the emphasis—
"ARE YOU DARK? OR VERY LIGHT?" "You mean—like plain
Or milk chocolate?"
Her assent was clinical, crushing in its light
Impersonality. Rapidly, wave-length adjusted,
I chose. "West African sepia"—and as afterthought,
"Down in my passport." Silence for spectroscopic
Flight of fancy, till truthfulness clanged her accent
Hard on the mouthpiece. "WHAT'S THAT?" conceding
"DON'T KNOW WHAT THAT IS." "Like brunette."
"THAT'S DARK, ISN'T IT?" "Not altogether.
Facially, I am brunette, but, madam, you should see
The rest of me. Palm of my hand, soles of my feet
Are a peroxide blonde. Friction, caused—
Foolishly, madam—by sitting down, has turned
My bottom raven black—One moment, madam!"—sensing
Her receiver rearing on the thunderclap
Of her disgust—"Madam," I pleaded, "wouldn't you rather
See for yourself?"`,
      questions: [
        {
          id: 'ap-ch3-q1',
          novelId: 'jamb-african-poetry',
          chapterIndex: 2,
          chapterNumber: 3,
          chapterTitle: 'Telephone Conversation by Wole Soyinka',
          question: 'What weapon does the speaker in "Telephone Conversation" employ to defeat the landlady’s racial prejudice?',
          options: [
            'A. Physical violence',
            'B. Razor-sharp intellectual wit, irony, and brilliant mockery that exposes her absurd reduction of humanity to skin pigmentation',
            'C. Offering to pay triple the advertised rent',
            'D. Calling the London Metropolitan Police'
          ],
          correctAnswer: 1,
          explanation: 'The speaker uses cutting irony and witty anatomical descriptions to reduce the landlady’s racism to utter absurdity.',
          difficulty: 'medium',
          topic: 'Literary Tone & Satire',
          year: 'Authentic JAMB UTME'
        }
      ]
    }
  ]
};

export const COUNTDOWN_JAMB_ENGLISH_NOVEL: Novel = {
  id: 'countdown-jamb-english',
  title: 'Countdown to JAMB Use of English',
  author: 'LearnDean Academic Board',
  year: '2025/2026/2027 Edition',
  genre: 'Pedagogical Guide / Grammar & Oral English',
  subject: 'JAMB Use of English',
  category: 'Recommended Textbooks',
  subCategory: 'Grammar & Lexis',
  coverImage: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?q=80&w=800&auto=format&fit=crop',
  coverGradient: 'from-blue-950 via-indigo-950 to-slate-900',
  description: 'The master revision handbook covering all high-yield sections of JAMB UTME Use of English: Concord rules, Phrasal verbs, Idioms, Antonyms, Synonyms, and Oral English (stress patterns, vowel contrasts, and consonant clusters).',
  syllabusRelevance: 'Essential Revision Text for ALL UTME Candidates targeting 80+ in Use of English',
  distributionRights: 'public_domain',
  distributionRightsLabel: 'LearnDean Open Educational Resource & UTME Master Guide',
  isFullTextIncluded: true,
  examSession: '2025/2026/2027 UTME Session',
  themes: [
    'Subject-Verb Agreement and Complex Concord Rules',
    'Oral English: Vowel Contrasts, Diphthongs, and Consonants',
    'Word Stress and Syllable Accentuation in UTME',
    'Idiomatic Expressions and Phrasal Verbs in Context'
  ],
  totalChapters: 2,
  estimatedReadingTime: '1 hr 45 mins',
  practiceQuestions: [
    {
      id: 'cje-pq-1',
      question: 'Choose the option that correctly completes the sentence: "Neither the headmaster nor the teachers _______ present at the board meeting yesterday."',
      options: ['A. was', 'B. were', 'C. is', 'D. are'],
      correctAnswer: 1,
      explanation: 'Under the Proximity Rule of Concord with "neither...nor", the verb agrees with the closer subject ("the teachers" -> plural -> "were").',
      topic: 'Proximity Concord',
      year: 'Authentic JAMB UTME'
    },
    {
      id: 'cje-pq-2',
      question: 'Identify the word that has the same vowel sound as the underlined sound in "c<u>ou</u>p":',
      options: ['A. shut', 'B. comb', 'C. pool', 'D. shout'],
      correctAnswer: 2,
      explanation: 'The word "coup" is pronounced /kuː/, with the long /uː/ vowel sound identical to "pool" (/puːl/).',
      topic: 'Oral English: Vowels',
      year: 'Authentic JAMB UTME'
    }
  ],
  chapters: [
    {
      id: 'cje-ch-1',
      chapterNumber: 1,
      title: 'Mastering Concord: High-Yield UTME Rules',
      wordCount: 1600,
      estimatedMinutes: 8,
      summary: 'Definitive guide to the 10 most tested concord rules in JAMB UTME, including Grammatical Concord, Notional Concord, Proximity Rule, Parenthetical expressions, and Indefinite Pronouns.',
      content: `CONCORD RULES FOR JAMB UTME USE OF ENGLISH

Concord simply refers to the grammatical agreement between a subject and its verb, or between words in a sentence. Every year, JAMB sets between 6 and 10 questions testing tricky concord principles:

1. THE RULE OF PROXIMITY (Either...or / Neither...nor / Not only...but also):
When subjects are connected by these correlatives, the verb agrees in number with the subject NEAREST to it.
Example: Neither the manager nor the clerks ARE in the office.
Example: Neither the clerks nor the manager IS in the office.

2. THE RULE OF PARENTHETICAL ACCOMPANIMENT (As well as / Together with / Along with / In addition to / Accompanied by):
These expressions do NOT form compound subjects. The verb agrees strictly with the FIRST (main) subject, regardless of what follows in the parenthetical clause.
Example: The Principal, accompanied by all the students, WAS at the stadium.

3. THE RULE OF "MORE THAN ONE":
Although logically plural in meaning, the phrase "More than one" takes a SINGULAR noun and a SINGULAR verb.
Example: More than one candidate HAS failed the test (NOT have).

4. COLLECTIVE NOUNS (Notional Concord):
When the collective noun acts as a unified single body, use a singular verb. When the members act individually or in division, use a plural verb.
Example: The committee HAS submitted its report. (Unified)
Example: The committee ARE divided on the matter. (Individual division)`,
      questions: [
        {
          id: 'cje-ch1-q1',
          novelId: 'countdown-jamb-english',
          chapterIndex: 0,
          chapterNumber: 1,
          chapterTitle: 'Mastering Concord: High-Yield UTME Rules',
          question: 'Complete the sentence: "The Governor, together with his commissioners, _______ just arrived at the state banquet."',
          options: ['A. have', 'B. has', 'C. are', 'D. were'],
          correctAnswer: 1,
          explanation: '"Together with" is a parenthetical expression; the verb must agree with the first subject ("The Governor", singular) -> "has".',
          difficulty: 'easy',
          topic: 'Parenthetical Concord',
          year: 'Authentic JAMB UTME'
        }
      ]
    },
    {
      id: 'cje-ch-2',
      chapterNumber: 2,
      title: 'Oral English: Syllable Stress and Vowel Contrasts',
      wordCount: 1800,
      estimatedMinutes: 9,
      summary: 'Detailed patterns for tackling the 15 Oral English questions in UTME: Primary stress in polysyllabic words, noun-verb stress shift, silent letters, and pure vowels.',
      content: `ORAL ENGLISH STRATEGY FOR JAMB UTME

JAMB tests phonetics through graphic representation and capital letters to indicate primary stress:

1. NOUN / VERB STRESS SHIFT:
In two-syllable words that function as both nouns and verbs:
- The NOUN is stressed on the FIRST syllable.
- The VERB is stressed on the SECOND syllable.
Examples:
- PRO-duce (Noun) vs pro-DUCE (Verb)
- CON-vict (Noun) vs con-VICT (Verb)
- IM-port (Noun) vs im-PORT (Verb)
- RE-bel (Noun) vs re-BEL (Verb)

2. SUFFIX RULES FOR STRESS:
- Words ending in -TION, -SION, -IC, -ICAL are stressed on the PENULTIMATE syllable (second to last syllable):
  * e-du-CA-tion, de-CI-sion, eco-NO-mic
- Words ending in -ITY, -ICAL, -ATE, -PHY, -GY are stressed on the ANTEPENULTIMATE syllable (third from last syllable):
  * a-BI-li-ty, pho-TO-gra-phy, de-MO-cra-cy

3. SILENT LETTERS FREQUENTLY TESTED IN UTME:
- Silent 'b': subtle, comb, tomb, debt, doubt
- Silent 'p': receipt, psalm, pneumatic, psychology
- Silent 'k': knight, knot, knuckle
- Silent 'w': sword, wrestle, wrinkle, answer`,
      questions: [
        {
          id: 'cje-ch2-q1',
          novelId: 'countdown-jamb-english',
          chapterIndex: 1,
          chapterNumber: 2,
          chapterTitle: 'Oral English: Syllable Stress and Vowel Contrasts',
          question: 'In which of the following words is the primary stress on the third syllable from the end (antepenultimate)?',
          options: ['A. photographic', 'B. electricity', 'C. democracy', 'D. international'],
          correctAnswer: 2,
          explanation: 'In "de-MOC-ra-cy", stress falls on the antepenultimate syllable (-moc-).',
          difficulty: 'medium',
          topic: 'Word Stress',
          year: 'Authentic JAMB UTME'
        }
      ]
    }
  ]
};
