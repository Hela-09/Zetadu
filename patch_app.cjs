const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  "const Admin = React.lazy(() => import('./components/Admin'));",
  "const Admin = React.lazy(() => import('./components/Admin'));\nconst DailyChallenge = React.lazy(() => import('./components/DailyChallenge'));"
);

code = code.replace(
  "{currentView === 'admin' && <Admin />}",
  "{currentView === 'admin' && <Admin />}\n              {currentView === 'daily_challenge' && <DailyChallenge setView={setCurrentView} />}"
);

fs.writeFileSync('src/App.tsx', code);
