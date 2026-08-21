import fs from 'fs';

let practice = fs.readFileSync('src/components/Practice.tsx', 'utf8');

const target1 = `export default function Practice() {
  const { user, getToken } = useAuth();`;

const replacement1 = `export default function Practice() {
  const { user, getToken, settings, userProfile } = useAuth();`;

practice = practice.replace(target1, replacement1);

const target2 = `  const [difficulty, setDifficulty] = useState(cachedInternalSession ? cachedInternalSession.difficulty : 'Medium');
  const [level, setLevel] = useState(cachedInternalSession ? cachedInternalSession.level : 'Secondary');`;

const replacement2 = `  const [difficulty, setDifficulty] = useState(cachedInternalSession ? cachedInternalSession.difficulty : (settings?.defaultPracticeDifficulty || 'Medium'));
  const [level, setLevel] = useState(cachedInternalSession ? cachedInternalSession.level : (userProfile?.educationLevel || 'Secondary'));`;

practice = practice.replace(target2, replacement2);

fs.writeFileSync('src/components/Practice.tsx', practice);
