const fs = require('fs');
let code = fs.readFileSync('src/components/Tutor.tsx', 'utf8');

code = code.replace(
  'export default function Tutor() {',
  'import { ArrowLeft } from \'lucide-react\';\n\ninterface TutorProps {\n  setCurrentView?: (view: string) => void;\n}\n\nexport default function Tutor({ setCurrentView }: TutorProps = {}) {'
);

fs.writeFileSync('src/components/Tutor.tsx', code);
