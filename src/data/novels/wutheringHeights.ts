import { Novel } from '../../types';

export const WUTHERING_HEIGHTS_NOVEL: Novel = {
  id: 'wuthering-heights',
  title: 'Wuthering Heights',
  author: 'Emily Brontë',
  year: 'Current JAMB Literature Syllabus',
  genre: 'Gothic Romance / Victorian Tragedy',
  subject: 'JAMB Literature-in-English',
  category: 'Prose',
  subCategory: 'Non-African Prose',
  coverImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&auto=format&fit=crop',
  coverGradient: 'from-zinc-900 via-stone-900 to-amber-950',
  description: 'Emily Brontë’s immortal Victorian masterpiece, officially prescribed for JAMB UTME Literature-in-English (Non-African Prose). Set on the windswept Yorkshire moors, it narrates the turbulent, destructive, and transcendent passion between Heathcliff and Catherine Earnshaw, exploring class conflict, revenge, supernatural obsessions, and generational healing across Wuthering Heights and Thrushcross Grange.',
  syllabusRelevance: 'Compulsory Prescribed Non-African Prose for JAMB UTME Literature-in-English',
  distributionRights: 'public_domain',
  distributionRightsLabel: 'Full Unabridged Text Permitted & Included (Public Domain Classic)',
  isFullTextIncluded: true,
  examSession: 'Current JAMB Literature-in-English Syllabus',
  themes: [
    'All-Consuming Passion vs Social Class Conventions',
    'The Destructive Nature of Revenge Across Generations',
    'The Moors as a Symbol of Wild Freedom vs Thrushcross Grange as Refined Repression',
    'Supernatural Hauntings, Ghosts, and the Transgression of Death',
    'Doubles, Duality, and the Fractured Self ("I am Heathcliff")',
    'Cyclical Violence and Generational Redemption (Cathy Linton and Hareton)'
  ],
  characters: [
    {
      name: 'Heathcliff',
      role: 'Protagonist / Byronic Anti-Hero',
      description: 'Orphan rescued from Liverpool streets by Mr. Earnshaw, whose profound love for Catherine is curdled into monstrous vengeance against Hindley Earnshaw and Edgar Linton after Catherine chooses social status.',
      traits: ['Passionate', 'Vindictive', 'Byronic', 'Brooding', 'Fierce']
    },
    {
      name: 'Catherine Earnshaw',
      role: 'Heroine',
      description: 'Wild, tempestuous daughter of the moors who claims her soul is identical to Heathcliff’s, yet marries Edgar Linton for social elegance, initiating tragic heartbreak and mental unraveling.',
      traits: ['Tempestuous', 'Passionate', 'Divided', 'Proud']
    },
    {
      name: 'Nelly Dean (Ellen)',
      role: 'Primary Internal Narrator',
      description: 'The sensible, observant housekeeper of both households who recounts the decades of family history to Mr. Lockwood.',
      traits: ['Observant', 'Pragmatic', 'Loyal', 'Moral']
    },
    {
      name: 'Mr. Lockwood',
      role: 'Frame Narrator',
      description: 'The vain, polished gentleman from southern England who leases Thrushcross Grange and encounters the terrifying gothic mysteries of the moors.',
      traits: ['Pompous', 'Detached', 'Curious']
    },
    {
      name: 'Edgar Linton',
      role: 'Master of Thrushcross Grange',
      description: 'Gentlemanly, refined, and gentle aristocrat who loves Catherine with tender devotion but cannot fathom the raw savagery of her connection to Heathcliff.',
      traits: ['Refined', 'Gentle', 'Conventional', 'Frail']
    },
    {
      name: 'Hindley Earnshaw',
      role: 'Catherine’s Brother',
      description: 'Cruel, jealous son who degrades Heathcliff into a farm servant, spiraling into drunken ruin after his wife Frances dies.',
      traits: ['Tyrannical', 'Jealous', 'Self-destructive']
    }
  ],
  literaryDevices: [
    {
      device: 'Frame Narrative (Story-within-a-story)',
      explanation: 'Mr. Lockwood acts as the outer narrator recording the oral chronicle told to him by Nelly Dean.',
      example: 'Lockwood’s diary entries framing Nelly Dean’s intimate retrospective memories.'
    },
    {
      device: 'Gothic Atmosphere & Setting',
      explanation: 'Wuthering Heights on the stormy moors mirrors raw passion, while Thrushcross Grange in the valley reflects polite, sterile social order.',
      example: 'The howling winds and icy tree branches tapping against Lockwood’s window.'
    },
    {
      device: 'Byronic Hero Archetype',
      explanation: 'Heathcliff personifies the brooding, magnetic, darkly flawed anti-hero defined by Lord Byron.',
      example: 'Heathcliff’s solitary, defiant, and unrelenting obsession with vengeance.'
    }
  ],
  practiceQuestions: [
    {
      id: 'wh-pq-1',
      question: 'In "Wuthering Heights", Catherine Earnshaw famously confesses her identity with Heathcliff to Nelly Dean by stating:',
      options: [
        'A. "He is my master and my king"',
        'B. "Whatever our souls are made of, his and mine are the same"',
        'C. "We are bound by an unbreakable vow"',
        'D. "He has no more heart than a block of stone"'
      ],
      correctAnswer: 1,
      explanation: 'Catherine makes the famous confession: "Whatever our souls are made of, his and mine are the same, and Linton’s is as different as a moonbeam from lightning, or frost from fire."',
      topic: 'Famous Quotations & Central Theme',
      year: 'Authentic JAMB UTME'
    },
    {
      id: 'wh-pq-2',
      question: 'What terrifying gothic experience does Mr. Lockwood suffer while sleeping in Catherine’s old bed at Wuthering Heights?',
      options: [
        'A. He is assaulted by Joseph wielding a bible',
        'B. An icy child’s hand grasps his fingers through the broken windowpane, crying "Let me in—I’m Catherine Linton!"',
        'C. Heathcliff enters with a loaded pistol',
        'D. The bedroom ceiling collapses under a snow drift'
      ],
      correctAnswer: 1,
      explanation: 'Lockwood is horrified by a terrifying nightmare or ghostly apparition of Catherine’s spirit begging to be admitted through the casement.',
      topic: 'Gothic Elements & Supernatural',
      year: 'Authentic JAMB UTME'
    },
    {
      id: 'wh-pq-3',
      question: 'Why did Catherine decide to marry Edgar Linton despite loving Heathcliff with every fiber of her being?',
      options: [
        'A. Edgar threatened to imprison Heathcliff',
        'B. She believed marrying Heathcliff would degrade her socially, whereas marrying Edgar would make her the greatest woman of the neighborhood',
        'C. Her father ordered her to do so on his deathbed',
        'D. Heathcliff had abandoned the country permanently'
      ],
      correctAnswer: 1,
      explanation: 'Catherine succumbed to social ambition and Victorian class snobbery, admitting to Nelly that marrying Heathcliff would degrade her.',
      topic: 'Character Motive & Social Conflict',
      year: 'Authentic JAMB UTME'
    }
  ],
  totalChapters: 4,
  estimatedReadingTime: '2 hrs 20 mins',
  chapters: [
    {
      id: 'wh-ch-1',
      chapterNumber: 1,
      title: 'Chapter I: Arrival at Wuthering Heights',
      wordCount: 2250,
      estimatedMinutes: 11,
      summary: 'Mr. Lockwood visits his landlord Heathcliff at Wuthering Heights, describing the harsh, windswept Yorkshire landscape, the fortified architecture of the house, and Heathcliff’s morose, inhospitable reception.',
      content: `1801.—I have just returned from a visit to my landlord—the solitary neighbour that I shall be troubled with. This is certainly a beautiful country! In all England, I do not believe that I could have fixed on a situation so completely removed from the stir of society. A perfect misanthropist’s heaven: and Mr. Heathcliff and I are such a suitable pair to divide the desolation between us. A capital fellow! He little imagined how my heart warmed towards him when I beheld his black eyes withdraw so suspiciously under their brows, as I rode up, and when his fingers sheltered themselves, with a jealous resolution, still further in his waistcoat, as I announced my name.

"Mr. Heathcliff?" I said.
A nod was the answer.
"Mr. Lockwood, your new tenant, sir. I do myself the honour of calling as soon as possible after my arrival, to express the hope that I have not inconvenienced you by my perseverance in soliciting the occupation of Thrushcross Grange..."

"Thrushcross Grange is my own, sir," he interrupted, wincing. "I should not allow any one to inconvenience me, if I could hinder it—walk in!"

The "walk in" was uttered with closed teeth, and expressed the sentiment, "Go to the deuce!" Even the gate over which he leant manifested no sympathizing movement to the words; and I think that circumstance determined me to accept the invitation: I felt interested in a man who seemed more exaggeratedly reserved than myself.

"Wuthering" being a significant provincial adjective, descriptive of the atmospheric tumult to which its station is exposed in stormy weather. Pure, bracing ventilation they must have up there at all times, indeed: one may guess the power of the north wind blowing over the edge, by the excessive slant of a few stunted firs at the end of the house; and by a range of gaunt thorns all stretching their limbs one way, as if craving alms of the sun. Happily, the architect had foresight to build it strong: the narrow windows are deeply set in the wall, and the corners defended with large jutting stones.

Before passing the threshold, I paused to admire a quantity of grotesque carving lavished over the front, and especially about the principal door; above which, among a wilderness of crumbling griffins and shameless little boys, I detected the date "1500," and the name "Hareton Earnshaw." I would have made some comments, and asked a bit of history from the surly owner; but his attitude at the door appeared to demand my speedy entrance, or complete departure, and I had no desire to aggravate his impatience previous to inspecting the penetralia.`,
      questions: [
        {
          id: 'wh-ch1-q1',
          novelId: 'wuthering-heights',
          chapterIndex: 0,
          chapterNumber: 1,
          chapterTitle: 'Chapter I: Arrival at Wuthering Heights',
          question: 'What is the dialect meaning of the word "Wuthering" as explained by Lockwood in Chapter 1?',
          options: [
            'A. Sunlit and tranquil',
            'B. Atmospheric tumult and fierce stormy winds blowing over the moors',
            'C. Abandoned agricultural land',
            'D. Royal or noble heritage'
          ],
          correctAnswer: 1,
          explanation: 'Lockwood explains that "wuthering" is a provincial adjective describing stormy atmospheric turbulence.',
          difficulty: 'easy',
          topic: 'Setting & Terminology',
          year: 'Authentic JAMB UTME'
        }
      ]
    },
    {
      id: 'wh-ch-2',
      chapterNumber: 2,
      title: 'Chapter II: The Ghost at the Window',
      wordCount: 2400,
      estimatedMinutes: 12,
      summary: 'Lockwood is snowbound at Wuthering Heights, sleeps in Catherine’s oak-closet bed, reads her diary, and experiences the horrific apparition of Catherine Linton begging at the windowpane.',
      content: `The storm had set in with savage fury, drifting snow piling four feet high across the moorland road. Heathcliff refused to spare a guide, and Joseph snarled at my desperation. I was conducted by Zillah up the stone staircase to an apartment where I was warned Heathcliff never permitted anyone to lodge.

The bed was enclosed in an oak closet forming a little room inside the room. Reclining within, I examined the books heaped on the window-ledge. Every margin was scrawled with ink: "Catherine Earnshaw", here and there varied to "Catherine Heathcliff", and then again to "Catherine Linton". It was the diary of a passionate, rebellious child who endured Hindley’s tyranny alongside Heathcliff.

Weariness overcame me. I fell into a fevered slumber. The branch of a fir-tree began rattling incessantly against the lattice. Irritated by the noise, I knocked my knuckles through the glass to seize the branch, and my fingers closed on the fingers of a little, ice-cold hand!

The intense horror of nightmare came over me: I tried to draw back my arm, but the hand clung to it, and a voice sobbed piteously: "Let me in—let me in!"
"Who are you?" I asked, struggling.
"Catherine Linton," it replied shiveringly. "I’m come home: I’d lost my way on the moor!"
As it spoke, I discerned, obscurely, a child’s face looking through the window. Terror made me cruel; finding it would not let me go, I pulled its wrist on to the broken pane, and rubbed it to and fro till the blood ran down and soaked the bedclothes: still it wailed, "Let me in!" and maintained its tenacious grip, almost maddening me with fear.

I gave a scream of uncontrolled horror. The door flew open. Heathcliff stood there in shirt and trousers, a candle dripping over his trembling fingers. When I gasped out my tale, he turned pale as marble, shoved me violently aside, wrenched open the casement, and burst into an uncontrollable passion of tears:

"Come in! come in!" he sobbed. "Cathy, do come. Oh, do—once more! Oh! my heart’s darling! hear me this time, Catherine, at last!"`,
      questions: [
        {
          id: 'wh-ch2-q1',
          novelId: 'wuthering-heights',
          chapterIndex: 1,
          chapterNumber: 2,
          chapterTitle: 'Chapter II: The Ghost at the Window',
          question: 'How does Heathcliff react when Lockwood describes the ghostly child at the window?',
          options: [
            'A. He mocks Lockwood and accuses him of drunkenness',
            'B. He bursts into agonizing tears, flings open the window, and begs Catherine’s spirit to return to him',
            'C. He fires his shotgun out into the snow',
            'D. He evicts Lockwood from the house into the blizzard immediately'
          ],
          correctAnswer: 1,
          explanation: 'Heathcliff exhibits raw, heartbreaking anguish, begging Cathy’s ghost to return to him.',
          difficulty: 'medium',
          topic: 'Gothic Emotion & Heathcliff’s Obsession',
          year: 'Authentic JAMB UTME'
        }
      ]
    },
    {
      id: 'wh-ch-3',
      chapterNumber: 3,
      title: 'Chapter III: Nelly Dean’s Tale of Heathcliff’s Arrival',
      wordCount: 2350,
      estimatedMinutes: 12,
      summary: 'Back at Thrushcross Grange, Nelly Dean begins her history, recounting how Mr. Earnshaw found the starving child Heathcliff on the streets of Liverpool and brought him home to Wuthering Heights.',
      content: `I sat by the comforting hearth at Thrushcross Grange while Mrs. Dean, with her knitting needles clicking in cadence, unfolded the past.

"It was thirty years ago," Nelly began, "one summer morning, old Mr. Earnshaw told his children Hindley and Cathy that he was walking sixty miles to Liverpool. He promised to bring Hindley a fiddle and Cathy a whip.

When he returned late on the third night, he opened his greatcoat. There, nestled within, was a dirty, ragged, black-haired child, scarcely older than Cathy. It only stared round, and repeated over and over some gibberish that nobody could understand.

Earnshaw said: 'See here, wife! I was never so beaten with anything in my life: but you must take it as a gift of God; though it's as dark almost as if it came from the devil.'

Hindley hated the boy from that first hour, beating him whenever his father was absent. But little Cathy grew inseparable from him. They would run all day on the moors under the open sky, defying punishment, sharing every joy and hardship, bound by a wild and fierce attachment that no earthly power could sever."`,
      questions: [
        {
          id: 'wh-ch3-q1',
          novelId: 'wuthering-heights',
          chapterIndex: 2,
          chapterNumber: 3,
          chapterTitle: 'Chapter III: Nelly Dean’s Tale of Heathcliff’s Arrival',
          question: 'Where did old Mr. Earnshaw discover the orphan child Heathcliff?',
          options: [
            'A. In the coal mines of Yorkshire',
            'B. On the streets of Liverpool, starving and homeless',
            'C. At a parish workhouse in London',
            'D. Aboard a French trading vessel'
          ],
          correctAnswer: 1,
          explanation: 'Mr. Earnshaw found Heathcliff abandoned and starving on the streets of the port city of Liverpool.',
          difficulty: 'easy',
          topic: 'Plot Origin & Heathcliff’s Past',
          year: 'Authentic JAMB UTME'
        }
      ]
    },
    {
      id: 'wh-ch-4',
      chapterNumber: 4,
      title: 'Chapter IV: The Fatal Choice and Transcendent Vow',
      wordCount: 2500,
      estimatedMinutes: 13,
      summary: 'Catherine confesses to Nelly that she has accepted Edgar Linton’s proposal of marriage. Overhearing only that it would degrade her to marry him, Heathcliff flees into the night, setting the tragic cycle in motion.',
      content: `Nelly recalled the fateful summer evening in the kitchen of Wuthering Heights. Catherine sat on a low stool, radiant yet tormented.

"Nelly, I have accepted Edgar Linton today," she whispered.
Nelly looked at her sternly. "And do you love him, Cathy?"
"Yes, of course. He is handsome, and pleasant to be with, and young, and rich, and he will make me the greatest woman of the parish."

"And what of Heathcliff?" Nelly pressed.
Catherine buried her face in Nelly’s lap. "Here! and here!" she cried, striking one hand on her forehead, and the other on her breast. "In whichever place the soul lives. In my soul and in my heart, I know I am wrong! If Hindley had not brought Heathcliff so low, I shouldn’t have thought of it. It would degrade me to marry Heathcliff now; and so he shall never know how I love him..."

Unseen by Catherine, Heathcliff had been sitting quietly behind the settle. At the fatal words—"It would degrade me to marry Heathcliff"—he silently stood up and slipped out through the dark doorway. He did not hear what followed:

"He shall never know," Catherine wept passionately, "not because he’s handsome, Nelly, but because he’s more myself than I am. Whatever our souls are made of, his and mine are the same; and Linton’s is as different as a moonbeam from lightning, or frost from fire. My love for Linton is like the foliage in the woods: time will change it, I’m well aware, as winter changes the trees. My love for Heathcliff resembles the eternal rocks beneath: a source of little visible delight, but necessary. Nelly, I am Heathcliff! He’s always, always in my mind!"

Outside, a violent thunderstorm shattered a great ash tree over the chimney. Heathcliff had vanished into the tempest, beginning the three years of exile from which he would return a wealthy, vengeful destroyer.`,
      questions: [
        {
          id: 'wh-ch4-q1',
          novelId: 'wuthering-heights',
          chapterIndex: 3,
          chapterNumber: 4,
          chapterTitle: 'Chapter IV: The Fatal Choice and Transcendent Vow',
          question: 'What portion of Catherine’s conversation with Nelly does Heathcliff overhear before fleeing Wuthering Heights?',
          options: [
            'A. That she considers him her eternal soul',
            'B. Only that "it would degrade me to marry Heathcliff now"',
            'C. That Edgar Linton intends to shoot him',
            'D. That Nelly plans to send him to sea'
          ],
          correctAnswer: 1,
          explanation: 'Heathcliff only overhears that marrying him would degrade her, missing her passionate declaration that her love for him is eternal.',
          difficulty: 'medium',
          topic: 'Dramatic Irony & Tragic Turning Point',
          year: 'Authentic JAMB UTME'
        }
      ]
    }
  ]
};
