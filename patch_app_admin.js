import fs from 'fs';

let app = fs.readFileSync('src/App.tsx', 'utf8');

if (!app.includes('const Admin = React.lazy')) {
  app = app.replace(
    "const Profile = React.lazy(() => import('./components/Profile'));",
    "const Profile = React.lazy(() => import('./components/Profile'));\nconst Admin = React.lazy(() => import('./components/Admin'));"
  );
}

app = app.replace(
  "{currentView === 'profile' && <Profile setView={setCurrentView} />}",
  "{currentView === 'profile' && <Profile setView={setCurrentView} />}\n              {currentView === 'admin' && <Admin />}"
);

// We should also check for isSuperAdmin during render to route to admin if currentView is admin, 
// though Admin.tsx handles the unauthorized state. But if isSuperAdmin is true and currentView is admin, we render Admin.
// We also need to add isSuperAdmin to useAuth() destructuring in App.tsx just to know if we should switch to admin automatically. 
// "Automatically check: Is this user's UID equal to the stored Super Admin UID? If YES: Load Admin Mode."
// To do this, we can add a useEffect that switches to 'admin' if isSuperAdmin is true and we haven't handled it yet.
// However, the prompt says "If YES: Load Admin Mode. If NO: Load the normal user experience."
// If we switch them to 'admin' every time they load the app, it's fine.

const checkSuperAdminLogic = `
  const { user, userProfile, settings, updateSettings, isSuperAdmin, loading, signOut } = useAuth();
  const [adminChecked, setAdminChecked] = useState(false);

  React.useEffect(() => {
    if (user && isSuperAdmin && !adminChecked) {
      setCurrentView('admin');
      setAdminChecked(true);
    } else if (user && !isSuperAdmin && !adminChecked) {
      setAdminChecked(true);
      if (currentView === 'admin') {
        setCurrentView('home');
      }
    }
  }, [user, isSuperAdmin, adminChecked, currentView]);
`;

app = app.replace(
  "const { user, userProfile, settings, updateSettings, loading, signOut } = useAuth();",
  checkSuperAdminLogic
);

fs.writeFileSync('src/App.tsx', app);
