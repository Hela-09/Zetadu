import { Novel } from '../../types';

export const ANTONY_CLEOPATRA_NOVEL: Novel = {
  id: 'antony-and-cleopatra',
  title: 'Antony and Cleopatra',
  author: 'William Shakespeare',
  year: 'Current JAMB Literature Syllabus',
  genre: 'Jacobean Tragedy / Historical Drama',
  subject: 'JAMB Literature-in-English',
  category: 'Drama',
  subCategory: 'Non-African Drama',
  coverImage: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?q=80&w=800&auto=format&fit=crop',
  coverGradient: 'from-amber-900 via-rose-950 to-indigo-950',
  description: 'William Shakespeare’s grand classical tragedy, prescribed for JAMB UTME Literature-in-English (Non-African Drama). Across Egypt and Rome, it charts the intoxicating, tragic romance between the Roman triumvir Mark Antony and the Egyptian Queen Cleopatra, exploring the clash between Roman stoic militarism and Egyptian sensual opulence, imperial power, political betrayal, and sublime suicide.',
  syllabusRelevance: 'Compulsory Prescribed Non-African Drama for JAMB UTME Literature-in-English',
  distributionRights: 'public_domain',
  distributionRightsLabel: 'Full Unabridged Text Permitted & Included (Public Domain Classic)',
  isFullTextIncluded: true,
  examSession: 'Current JAMB Literature-in-English Syllabus',
  themes: [
    'Reason, Order, and Roman Duty vs Sensual Passion and Egyptian Opulence',
    'Empire, Political Pragmatism, and the Triumvirate Power Struggle',
    'Nobility, Honor, and Transcendent Tragic Death',
    'Loyalty, Betrayal, and the Tragedy of Divided Hearts (Enobarbus)',
    'Theatricality, Role-Playing, and Cleopatra’s Infinite Variety'
  ],
  characters: [
    {
      name: 'Mark Antony',
      role: 'Triumvir of Rome',
      description: 'Legendary Roman soldier and general whose consuming passion for Cleopatra blinds him to political realities, leading to defeat at Actium and honorable suicide.',
      traits: ['Passionate', 'Valiant', 'Divided', 'Generous', 'Tragic']
    },
    {
      name: 'Cleopatra',
      role: 'Queen of Egypt',
      description: 'The intoxicating monarch of Egypt possessed of "infinite variety", passionate, mercurial, and fiercely proud, who chooses the bite of the asp over public humiliation in Caesar’s Roman triumph.',
      traits: ['Charismatic', 'Mercurial', 'Magnificent', 'Regal', 'Proud']
    },
    {
      name: 'Octavius Caesar',
      role: 'Triumvir of Rome (Later Emperor Augustus)',
      description: 'Cold, calculating, austere Roman statesman whose single-minded dedication to imperial order defeats Antony’s emotional impulsiveness.',
      traits: ['Calculating', 'Pragmatic', 'Disciplined', 'Austere']
    },
    {
      name: 'Enobarbus',
      role: 'Antony’s Devoted Lieutenant and Choric Voice',
      description: 'Witty, cynical, and perceptive soldier whose desertion of Antony breaks his own heart when Antony sends his treasure after him with blessings.',
      traits: ['Perceptive', 'Cynical', 'Loyal', 'Repentant']
    }
  ],
  literaryDevices: [
    {
      device: 'Antithesis and Binary Opposition',
      explanation: 'Contrasting cold, stoic, disciplined Rome with warm, lush, sensual, overflowing Egypt.',
      example: 'The austere councils of Rome versus the lavish Nile banquets and golden barges.'
    },
    {
      device: 'Hyperbole and Cosmic Imagery',
      explanation: 'Shakespeare portrays the lovers not as mere mortals, but as colossal figures straddling the globe.',
      example: 'Cleopatra’s dream: "His legs bestrid the ocean; his reared arm crested the world."'
    },
    {
      device: 'Tragic Catharsis',
      explanation: 'The noble deaths of Antony and Cleopatra redeem their human flaws and elevate their love into mythological eternity.',
      example: 'Cleopatra donning her royal robes to meet Antony in death.'
    }
  ],
  practiceQuestions: [
    {
      id: 'ac-pq-1',
      question: 'In "Antony and Cleopatra", how does Enobarbus famously describe Cleopatra’s royal barge on the river Cydnus?',
      options: [
        'A. A war galley loaded with iron spears',
        'B. "The barge she sat in, like a burnish’d throne, burn’d on the water: the poop was beaten gold"',
        'C. A simple wooden raft guided by fisherman',
        'D. A dark Egyptian coffin floating towards Alexandria'
      ],
      correctAnswer: 1,
      explanation: 'Enobarbus’s famous speech (Act II, Scene 2) describes Cleopatra’s barge as a burnished throne of beaten gold and purple silk.',
      topic: 'Poetic Description & Imagery',
      year: 'Authentic JAMB UTME'
    },
    {
      id: 'ac-pq-2',
      question: 'What catastrophic military blunder does Antony commit during the sea battle of Actium?',
      options: [
        'A. He falls asleep on the deck of his ship',
        'B. He flees the battle line in his flagship when Cleopatra’s Egyptian squadron turns and retreats',
        'C. He assassinates his own admiral',
        'D. He surrenders without firing an arrow'
      ],
      correctAnswer: 1,
      explanation: 'Antony is so besotted with Cleopatra that when her 60 Egyptian ships flee, he abandons his Roman navy to follow her, ensuring total military ruin.',
      topic: 'Plot Climax & Military Defeat',
      year: 'Authentic JAMB UTME'
    },
    {
      id: 'ac-pq-3',
      question: 'How does Cleopatra choose to end her life to prevent being dragged through Rome as a captive in Octavius Caesar’s victory parade?',
      options: [
        'A. By drinking poisoned Egyptian wine',
        'B. By applying venomous asps (snakes) to her breast and arm while dressed in full royal regalia',
        'C. By leaping from the high walls of her palace monument into the sea',
        'D. By begging Caesar’s guards to execute her'
      ],
      correctAnswer: 1,
      explanation: 'Cleopatra dies royally by applying asps to her breast, declaring "I have immortal longings in me," refusing to be displayed as a trophy.',
      topic: 'Tragic Denouement & Suicide',
      year: 'Authentic JAMB UTME'
    }
  ],
  totalChapters: 3,
  estimatedReadingTime: '2 hrs 15 mins',
  chapters: [
    {
      id: 'ac-act-1',
      chapterNumber: 1,
      title: 'Act I: Alexandria and Rome - The Divided Triumvir',
      wordCount: 2200,
      estimatedMinutes: 11,
      summary: 'Opens in Alexandria where Philo laments that Antony’s martial eyes now dote upon an Egyptian gypsy. Antony declares that kingdoms are clay, but news of his wife Fulvia’s death and the rebellion of Sextus Pompey forces his reluctant return to Rome.',
      content: `ACT I. SCENE I. Alexandria. A Room in Cleopatra’s Palace.

Enter DEMETRIUS and PHILO.

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

[Flourish. Enter ANTONY, CLEOPATRA, her Ladies, with Attendants.]

CLEOPATRA:
If it be love indeed, tell me how much.

ANTONY:
There's beggary in the love that can be reckon'd.

CLEOPATRA:
I'll set a bourn how far to be beloved.

ANTONY:
Then must thou needs find out new heaven, new earth.

[Enter an Attendant with news from Rome.]

ATTENDANT:
News, my good lord, from Rome.

ANTONY:
Grates me: the sum.

CLEOPATRA:
Nay, hear them, Antony:
Fulvia perchance is angry; or, who knows
If the scarce-bearded Caesar have not sent
His powerful mandate to you, 'Do this, or this;
Take in that kingdom, and enfranchise that;
Perform't, or else we damn thee.'

ANTONY:
How, my love!
Let Rome in Tiber melt, and the wide arch
Of the ranged empire fall! Here is my space.
Kingdoms are clay: our dungy earth alike
Feeds beast as man: the nobleness of life
Is to do thus; when such a mutual pair
And such a twain can do't, in which I bind,
On pain of punishment, the world to weet
We stand up peerless.`,
      questions: [
        {
          id: 'ac-act1-q1',
          novelId: 'antony-and-cleopatra',
          chapterIndex: 0,
          chapterNumber: 1,
          chapterTitle: 'Act I: Alexandria and Rome - The Divided Triumvir',
          question: 'In Act I Scene I, what cosmic declaration does Antony make regarding his love for Cleopatra?',
          options: [
            'A. "Rome must be conquered by Egyptian swords"',
            'B. "Let Rome in Tiber melt, and the wide arch of the ranged empire fall! Here is my space."',
            'C. "Gold is more precious than imperial crowns"',
            'D. "Caesar is my true brother in arms"'
          ],
          correctAnswer: 1,
          explanation: 'Antony renounces Roman imperial politics, declaring that his entire universe resides in his love for Cleopatra.',
          difficulty: 'easy',
          topic: 'Quotations & Central Theme',
          year: 'Authentic JAMB UTME'
        }
      ]
    },
    {
      id: 'ac-act-2',
      chapterNumber: 2,
      title: 'Act II & III: The Truce of Rome and The Disaster at Actium',
      wordCount: 2450,
      estimatedMinutes: 12,
      summary: 'Antony patches a fragile peace with Caesar by marrying Octavia, but returns to Cleopatra. War erupts, culminating in the naval battle of Actium where Antony follows Cleopatra’s fleeing ships to his ruin.',
      content: `In Rome, the triumvirs meet to reconcile their fractures. To cement their political alliance, Antony agrees to marry Octavius Caesar’s virtuous sister, Octavia.

Yet Enobarbus knows the truth. Describing Cleopatra’s entry into Antony’s life, he speaks the immortal lines:
"Age cannot wither her, nor custom stale
Her infinite variety: other women cloy
The appetites they feed: but she makes hungry
Where most she satisfies."

The marriage to Octavia is doomed from inception. Antony quickly tires of Roman sobriety and flees back to the intoxicating splendor of Alexandria.

Octavius Caesar seizes upon this insult to wage total imperial war. The two world powers meet at the naval strait of Actium. Against the earnest advice of his seasoned Roman generals who plead with him to fight on solid ground, Antony agrees to Cleopatra’s request to fight at sea.

In the height of battle, when the conflict hangs in the balance, Cleopatra’s sixty Egyptian galleys suddenly hoist their purple sails and turn tail. Antony, struck by madness, watches her ship flee, deserts his devoted legions, and rows after her.

"My heart was to thy rudder tied by the strings," he confesses in agony to Cleopatra. "And thou shouldst tow me after." His honor as a Roman soldier lies shattered beneath the waves.`,
      questions: [
        {
          id: 'ac-act2-q1',
          novelId: 'antony-and-cleopatra',
          chapterIndex: 1,
          chapterNumber: 2,
          chapterTitle: 'Act II & III: The Truce of Rome and The Disaster at Actium',
          question: 'Enobarbus asserts that Cleopatra will never lose Antony’s devotion because:',
          options: [
            'A. She controls the gold mines of Nubia',
            'B. "Age cannot wither her, nor custom stale her infinite variety"',
            'C. She possesses magical potions',
            'D. Caesar fears her military fleet'
          ],
          correctAnswer: 1,
          explanation: 'Enobarbus celebrates her timeless allure and kaleidoscopic charisma, stating age cannot wither her nor custom stale her variety.',
          difficulty: 'easy',
          topic: 'Characterization: Cleopatra',
          year: 'Authentic JAMB UTME'
        }
      ]
    },
    {
      id: 'ac-act-3',
      chapterNumber: 3,
      title: 'Act IV & V: Monumental Deaths and Immortal Longings',
      wordCount: 2600,
      estimatedMinutes: 13,
      summary: 'Antony falls upon his own sword upon hearing false reports of Cleopatra’s suicide, dying in her arms at the monument. Cleopatra dresses in royal robes, applies venomous asps to her flesh, and dies defying Caesar’s triumph.',
      content: `Surrounded by Caesar’s victorious legions, Antony receives false word that Cleopatra has committed suicide inside her fortified monument.

"Unarm, Eros," Antony commands his squire. "The long day's task is done, and we must sleep." He falls upon his Roman sword, mortally wounding himself. When he discovers that Cleopatra still lives, he has himself hoisted by ropes up into the monument, expiring in her tearful arms with one final kiss.

Cleopatra looks down upon the dead soldier:
"The crown o' the earth doth melt. My lord!
O, wither'd is the garland of the war,
The soldier's pole is fallen: young boys and girls
Are level now with men; the odds is gone,
And there is nothing left remarkable
Beneath the visiting moon."

Octavius Caesar enters Alexandria, intending to carry Cleopatra back to Rome as the crowning ornament of his triumphal procession. Cleopatra sees through his cold diplomacy. She refuses to be paraded before the Roman mob.

Dressing herself in her magnificent crown and royal coronation robes, she arranges a basket of figs containing poisonous asps.

"Give me my robe, put on my crown; I have
Immortal longings in me: now no more
The juice of Egypt's grape shall moist this lip:
Yare, yare, good Iras; quick. Methinks I hear
Antony call; I see him rouse himself
To praise my noble act...
Husband, I come:
Now to that name my courage prove my title!"

She applies an asp to her breast, then to her arm. Charmian adjusts her crown before dying beside her queen. When Caesar’s guards burst into the chamber, they find the Queen of Egypt dead upon her golden throne, majestic, regal, and unconquered.`,
      questions: [
        {
          id: 'ac-act3-q1',
          novelId: 'antony-and-cleopatra',
          chapterIndex: 2,
          chapterNumber: 3,
          chapterTitle: 'Act IV & V: Monumental Deaths and Immortal Longings',
          question: 'Cleopatra’s famous exclamation before applying the asp, "I have immortal longings in me," signifies:',
          options: [
            'A. Her desire to conquer Rome with an immortal army',
            'B. Her transcendence above earthly defeat to join Antony in an eternal spiritual marriage',
            'C. Her fear of physical death',
            'D. Her wish to live forever as an Egyptian goddess on earth'
          ],
          correctAnswer: 1,
          explanation: 'Cleopatra elevates her suicide into a transcendent act of nobility and eternal reunion with Antony.',
          difficulty: 'medium',
          topic: 'Tragic Catharsis & Themes',
          year: 'Authentic JAMB UTME'
        }
      ]
    }
  ]
};
