const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const oldEffect = `  React.useEffect(() => {
    const prev = localStorage.getItem('educore_current_view');
    if (prev && prev !== currentView && currentView !== 'tutor') {
      localStorage.setItem('educore_previous_view', prev);
    } else if (prev && prev !== currentView && currentView === 'tutor') {
      if (prev !== 'tutor') {
         localStorage.setItem('educore_previous_view', prev);
      }
    }
    localStorage.setItem('educore_current_view', currentView);
  }, [currentView]);`;

const newEffect = `  React.useEffect(() => {
    const prev = localStorage.getItem('educore_current_view');
    if (prev && prev !== currentView && prev !== 'tutor') {
      localStorage.setItem('educore_previous_view', prev);
    }
    localStorage.setItem('educore_current_view', currentView);
  }, [currentView]);`;

if (code.includes(oldEffect)) {
    code = code.replace(oldEffect, newEffect);
    fs.writeFileSync('src/App.tsx', code);
    console.log('patched App.tsx history again');
} else {
    console.log('could not find old effect');
}
