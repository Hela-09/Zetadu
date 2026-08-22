const fs = require('fs');
let code = fs.readFileSync('src/components/Login.tsx', 'utf8');

if(!code.includes(`import Logo from './Logo';`)){
    code = code.replace(`import { BookOpen, User, Lock, Mail, ArrowRight, ShieldCheck, MailCheck, Eye, EyeOff } from 'lucide-react';`, `import { BookOpen, User, Lock, Mail, ArrowRight, ShieldCheck, MailCheck, Eye, EyeOff } from 'lucide-react';\nimport Logo from './Logo';`);
}

const oldLogoBox = `<div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-bold shadow-lg mb-6">
            <BookOpen size={28} />
          </div>`;

code = code.replace(oldLogoBox, `<Logo className="w-16 h-16 mb-6" />`);
fs.writeFileSync('src/components/Login.tsx', code);
console.log('patched login logo');
