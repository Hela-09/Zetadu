import fs from 'fs';

let practice = fs.readFileSync('src/components/Practice.tsx', 'utf8');

const target = `          subject,
          topic,
          difficulty,
          educationLevel: level,
          amount
        })`;

const replacement = `          subject,
          topic,
          difficulty,
          educationLevel: level,
          country: userProfile?.country || 'International',
          amount
        })`;

practice = practice.replace(target, replacement);

fs.writeFileSync('src/components/Practice.tsx', practice);
