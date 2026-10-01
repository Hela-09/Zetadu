import * as fs from 'fs';
import * as path from 'path';

console.log('Building comprehensive JAMB Question Bank...');

// Helper interface
interface Q {
  id: string;
  subject: string;
  subjectName: string;
  year: number;
  questionNumber: number;
  topic: string;
  question: string;
  passage?: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

function writeTsFile(filePath: string, exportVar: string, questions: Q[]) {
  const code = `import { JambQuestion } from '../jambQuestions';

export const ${exportVar}: JambQuestion[] = ${JSON.stringify(questions, null, 2)};
`;
  fs.writeFileSync(filePath, code, 'utf-8');
  console.log(`Wrote ${questions.length} questions to ${filePath}`);
}

export { Q, writeTsFile };
