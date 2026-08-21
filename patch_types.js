import fs from 'fs';

let types = fs.readFileSync('src/types.ts', 'utf8');

types = types.replace(
  'export interface ChatMessage {\n  role: \'user\' | \'tutor\';\n  text: string;\n}',
  'export interface ChatMessage {\n  role: \'user\' | \'tutor\';\n  text: string;\n  attachments?: any[];\n}'
);

fs.writeFileSync('src/types.ts', types);

