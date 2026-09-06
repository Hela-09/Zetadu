const fs = require('fs');
let code = fs.readFileSync('src/components/Profile.tsx', 'utf8');

// The original import might already have Flame
// It was: import { Sparkles, Award, Trash2, Edit3, Image as ImageIcon, MapPin, GraduationCap, ArrowLeft, Camera, Check, X, AlertCircle, Phone, Mail, Copy, CheckCircle2 , ShieldAlert } from 'lucide-react';
// I added: import { Flame, Trophy, Target, CheckCircle } from 'lucide-react';
// Wait, my patch was:
// const importAdd = `import { Flame, Trophy, Target, CheckCircle } from 'lucide-react';\n`;
// But I never injected importAdd, I just replaced "Award," with "Award, Trophy, Target, Flame, CheckCircle,".
// Wait, maybe the user already had Flame in an import at the top of Profile? Let's check imports.

// Let's remove duplicate 'Flame', 'Trophy', 'Target', 'CheckCircle' from lucide-react imports.
const imports = code.match(/import {([^}]+)} from 'lucide-react'/g);
if (imports) {
  imports.forEach(imp => {
     const innerMatch = imp.match(/import {([^}]+)}/);
     if (innerMatch) {
       let inner = innerMatch[1];
       const uniqueParts = Array.from(new Set(inner.split(',').map(s => s.trim()).filter(Boolean)));
       code = code.replace(imp, `import { ${uniqueParts.join(', ')} } from 'lucide-react'`);
     }
  });
}

fs.writeFileSync('src/components/Profile.tsx', code);
