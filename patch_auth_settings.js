import fs from 'fs';

let auth = fs.readFileSync('src/contexts/AuthContext.tsx', 'utf8');

const target1 = `export interface UserSettings {
  theme: "light" | "dark" | "system";
  notifications: boolean;
  fontSize: "small" | "medium" | "large";
  language: string;
  accessibility: boolean;
  dataSync: boolean;
  privacyMode: boolean;
}`;

const replacement1 = `export interface UserSettings {
  theme: "light" | "dark" | "system";
  fontSize: "small" | "medium" | "large";
  defaultPracticeDifficulty: "Easy" | "Medium" | "Hard" | "Mixed";
  aiTutorTone: "Friendly" | "Direct" | "Socratic";
}`;

auth = auth.replace(target1, replacement1);

const target2 = `const defaultSettings: UserSettings = {
  theme: 'system',
  notifications: true,
  fontSize: 'medium',
  language: 'en',
  accessibility: false,
  dataSync: true,
  privacyMode: false
};`;

const replacement2 = `const defaultSettings: UserSettings = {
  theme: 'system',
  fontSize: 'medium',
  defaultPracticeDifficulty: 'Medium',
  aiTutorTone: 'Friendly'
};`;

auth = auth.replace(target2, replacement2);

fs.writeFileSync('src/contexts/AuthContext.tsx', auth);
