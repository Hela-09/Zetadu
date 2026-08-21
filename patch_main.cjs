const fs = require('fs');
let content = fs.readFileSync('src/main.tsx', 'utf8');

if (!content.includes('ErrorBoundary')) {
  content = content.replace(
    "import { AuthProvider } from './contexts/AuthContext';",
    "import { AuthProvider } from './contexts/AuthContext';\nimport ErrorBoundary from './components/ErrorBoundary';"
  );
  content = content.replace(
    "<AuthProvider>",
    "<ErrorBoundary>\n      <AuthProvider>"
  );
  content = content.replace(
    "</AuthProvider>",
    "</AuthProvider>\n    </ErrorBoundary>"
  );
  fs.writeFileSync('src/main.tsx', content);
  console.log('patched main.tsx with ErrorBoundary');
}
