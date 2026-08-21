import fs from 'fs';

let types = fs.readFileSync('src/types.ts', 'utf8');

types = types.replace(
  'subject: string;\n  subjectId?: string;\n  name?: string;\n  category?: string;',
  'subject: string;'
);

types = types.replace(
  'export interface SubjectHistory {\n  id: string;\n  subject: string;',
  'export interface SubjectHistory {\n  id: string;\n  subject: string;\n  subjectId?: string;\n  name?: string;\n  category?: string;'
);

fs.writeFileSync('src/types.ts', types);
