import * as fs from 'fs';
import * as path from 'path';

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

// Read existing questions so we preserve them and add on top
function getExisting(filePath: string): Q[] {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const match = content.match(/=\s*(\[[\s\S]*\]);/);
    if (match) {
      // Use eval/Function to parse TS object literals
      const fn = new Function(`return ${match[1]};`);
      const res = fn();
      if (Array.isArray(res)) return res;
    }
  } catch (e) {
    console.warn('Could not read existing from ' + filePath, e);
  }
  return [];
}

function writeQuestionsFile(filePath: string, exportVar: string, questions: Q[]) {
  // Deduplicate by ID and question text signature
  const seen = new Set<string>();
  const unique: Q[] = [];
  for (const q of questions) {
    const key = q.id;
    const textSig = q.question.toLowerCase().replace(/\s+/g, ' ').trim();
    if (!seen.has(key) && !seen.has(textSig)) {
      seen.add(key);
      seen.add(textSig);
      unique.push(q);
    }
  }

  const code = `import { JambQuestion } from '../jambQuestions';

export const ${exportVar}: JambQuestion[] = ${JSON.stringify(unique, null, 2)};
`;
  fs.writeFileSync(filePath, code, 'utf-8');
  console.log(`Successfully written ${unique.length} questions to ${filePath}`);
}

export { Q, getExisting, writeQuestionsFile };
