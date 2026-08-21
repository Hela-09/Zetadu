import fs from 'fs';

// 1. Fix types.ts
let types = fs.readFileSync('src/types.ts', 'utf8');
types = types.replace(
  'subject: string;',
  'subject: string;\n  subjectId?: string;\n  name?: string;\n  category?: string;'
);
fs.writeFileSync('src/types.ts', types);

// 2. Fix Tutor.tsx
let tutor = fs.readFileSync('src/components/Tutor.tsx', 'utf8');
tutor = tutor.replace(
  'const newMessages = [...prev => [...currentHistory, userMsg]]; // wait that\'s not right, newMessages should be currentHistory + userMsg',
  'const newMessages = [...currentHistory, userMsg];'
);
fs.writeFileSync('src/components/Tutor.tsx', tutor);

// 3. Fix Profile.tsx
// Check if Search is imported
let profile = fs.readFileSync('src/components/Profile.tsx', 'utf8');
if (!profile.includes('Search,')) {
  profile = profile.replace('BookOpen,', 'BookOpen, Search,');
}
fs.writeFileSync('src/components/Profile.tsx', profile);

