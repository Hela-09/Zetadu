const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

if (!code.includes('import Opportunities')) {
    code = code.replace("import Profile from './components/Profile';", "import Profile from './components/Profile';\nimport Opportunities from './components/Opportunities';");
}

code = code.replace(
    /\{currentView === 'profile' && <Profile setView=\{setCurrentView\} \/>\}/,
    `{currentView === 'profile' && <Profile setView={setCurrentView} />}
              {currentView === 'opportunities' && <Opportunities />}`
);

fs.writeFileSync('src/App.tsx', code);
