const fs = require('fs');

let appCode = fs.readFileSync('src/App.tsx', 'utf8');
if (!appCode.includes("const Opportunities =")) {
   appCode = appCode.replace("const Admin = React.lazy(() => import('./components/Admin'));", "const Admin = React.lazy(() => import('./components/Admin'));\nconst Opportunities = React.lazy(() => import('./components/Opportunities'));");
   fs.writeFileSync('src/App.tsx', appCode);
}
