import { writeQuestionsFile, Q } from './bankUtils';
import * as path from 'path';

// Let's import the existing questions dynamically using tsx
async function run() {
  const { MATH_QUESTIONS_EXPANDED } = await import('../src/data/jamb/mathQuestionsExpanded');
  const { ENGLISH_QUESTIONS_EXPANDED } = await import('../src/data/jamb/englishQuestionsExpanded');
  const { PHYSICS_QUESTIONS_EXPANDED } = await import('../src/data/jamb/physicsQuestionsExpanded');
  const { CHEMISTRY_QUESTIONS_EXPANDED } = await import('../src/data/jamb/chemistryQuestionsExpanded');
  const { BIOLOGY_QUESTIONS_EXPANDED } = await import('../src/data/jamb/biologyQuestionsExpanded');
  const { SOCIAL_SCIENCES_EXPANDED } = await import('../src/data/jamb/socialSciencesQuestionsExpanded');
  const { ARTS_SOCIAL_QUESTIONS } = await import('../src/data/jamb/artsSocialQuestions');
  const { APPLIED_VOCATIONAL_EXPANDED } = await import('../src/data/jamb/appliedVocationalQuestionsExpanded');

  console.log('Current counts before expansion:', {
    math: MATH_QUESTIONS_EXPANDED.length,
    eng: ENGLISH_QUESTIONS_EXPANDED.length,
    phy: PHYSICS_QUESTIONS_EXPANDED.length,
    chm: CHEMISTRY_QUESTIONS_EXPANDED.length,
    bio: BIOLOGY_QUESTIONS_EXPANDED.length,
    soc: SOCIAL_SCIENCES_EXPANDED.length,
    art: ARTS_SOCIAL_QUESTIONS.length,
    app: APPLIED_VOCATIONAL_EXPANDED.length,
  });
}

run().catch(console.error);
