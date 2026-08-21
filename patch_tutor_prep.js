import fs from 'fs';

let tutor = fs.readFileSync('src/components/Tutor.tsx', 'utf8');

// I will just download the Tutor.tsx content to a separate file so I can easily use sed or multi_edit
