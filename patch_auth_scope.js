import fs from 'fs';

let auth = fs.readFileSync('src/contexts/AuthContext.tsx', 'utf8');

auth = auth.replace(
  '          // Super Admin Logic\n          try {',
  '          // Super Admin Logic\n          let isFirst = false;\n          let isActualSuperAdmin = false;\n          try {'
);

auth = auth.replace(
  '              setIsSuperAdmin(true);\n            } else {',
  '              setIsSuperAdmin(true);\n              isFirst = true;\n              isActualSuperAdmin = true;\n            } else {'
);

auth = auth.replace(
  '                setIsSuperAdmin(true);\n              } else {',
  '                setIsSuperAdmin(true);\n                isActualSuperAdmin = true;\n              } else {'
);

auth = auth.replace(
  '            const isFirst = !superAdminSnap.exists();',
  ''
);

auth = auth.replace(
  'if (superAdminSnap.exists() && superAdminSnap.data().uid === currentUser.uid && !data.isSuperAdmin)',
  'if (isActualSuperAdmin && !data.isSuperAdmin)'
);

fs.writeFileSync('src/contexts/AuthContext.tsx', auth);
