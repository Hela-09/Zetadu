import fs from 'fs';

let tutor = fs.readFileSync('src/components/Tutor.tsx', 'utf8');

const target1 = `export default function Tutor() {
  const { user, getToken } = useAuth();`;

const replacement1 = `export default function Tutor() {
  const { user, getToken, userProfile, settings } = useAuth();`;

tutor = tutor.replace(target1, replacement1);

const target2 = `        body: JSON.stringify({
          message: userMsg.text,
          history: currentHistory,
          context: {
            educationLevel: 'Secondary',
            country: 'International'
          }
        })`;

const replacement2 = `        body: JSON.stringify({
          message: userMsg.text,
          history: currentHistory,
          context: {
            educationLevel: userProfile?.educationLevel || 'Secondary',
            country: userProfile?.country || 'International',
            tone: settings?.aiTutorTone || 'Friendly'
          }
        })`;

tutor = tutor.replace(target2, replacement2);

fs.writeFileSync('src/components/Tutor.tsx', tutor);
