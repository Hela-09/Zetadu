import { Novel } from '../types';
import { LEKKI_HEADMASTER_NOVEL } from './novels/lekkiHeadmaster';
import { LIFE_CHANGER_NOVEL } from './novels/lifeChanger';
import { SECOND_CLASS_CITIZEN_NOVEL } from './novels/secondClassCitizen';
import { LION_AND_JEWEL_NOVEL } from './novels/lionAndJewel';
import { WUTHERING_HEIGHTS_NOVEL } from './novels/wutheringHeights';
import { MARRIAGE_OF_ANANSEWA_NOVEL } from './novels/marriageOfAnansewa';
import { ANTONY_CLEOPATRA_NOVEL } from './novels/antonyCleopatra';
import { UNEXPECTED_JOY_NOVEL } from './novels/unexpectedJoy';
import {
  JAMB_AFRICAN_POETRY_NOVEL,
  COUNTDOWN_JAMB_ENGLISH_NOVEL,
} from './novels/poetryAndGuides';

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
  // 1. Current JAMB Compulsory Novel (2025/2026/2027 Session)
  LEKKI_HEADMASTER_NOVEL,

  // 2. Previous JAMB Compulsory Novel (Revision & Past Questions)
  LIFE_CHANGER_NOVEL,

  // 3. JAMB Literature-in-English: Prescribed African Prose
  SECOND_CLASS_CITIZEN_NOVEL,

  // 4. JAMB Literature-in-English: Prescribed African Drama
  LION_AND_JEWEL_NOVEL,

  // 5. JAMB Literature-in-English: Prescribed Non-African Prose (Public Domain Full Text)
  WUTHERING_HEIGHTS_NOVEL,

  // 6. JAMB Literature-in-English: Prescribed African Drama
  MARRIAGE_OF_ANANSEWA_NOVEL,

  // 7. JAMB Literature-in-English: Prescribed Non-African Drama (Public Domain Full Text)
  ANTONY_CLEOPATRA_NOVEL,

  // 8. JAMB Literature-in-English: Prescribed African Prose
  UNEXPECTED_JOY_NOVEL,

  // 9. JAMB Literature-in-English: Prescribed African Poetry
  JAMB_AFRICAN_POETRY_NOVEL,

  // 10. JAMB Use of English: Recommended Grammar & Lexis Guide
  COUNTDOWN_JAMB_ENGLISH_NOVEL,
];
