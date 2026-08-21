import fs from 'fs';

let profile = fs.readFileSync('src/components/Profile.tsx', 'utf8');

const startIdx = profile.indexOf('const SettingsView = () => {');
const endIdx = profile.indexOf('const SavedContentView = () => {');

if (startIdx !== -1 && endIdx !== -1) {
  const newSettingsView = `const SettingsView = () => {
    const { settings, updateSettings, userProfile, user, refreshProfile } = useAuth();
    
    const handleClearCache = () => {
      localStorage.clear();
      alert("Local cache cleared successfully.");
      window.location.reload();
    };

    const handleProfileUpdate = async (field: string, value: string) => {
      if (!user) return;
      try {
        await setDoc(doc(db, 'users', user.uid), { [field]: value }, { merge: true });
        if (refreshProfile) await refreshProfile();
      } catch (err) {
        console.error("Failed to update profile", err);
      }
    };

    return (
      <div className="animate-in fade-in slide-in-from-right-4 duration-300">
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => setActiveSection(null)} className="p-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
            <ArrowLeft size={20} />
          </button>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">General Settings & Preferences</h2>
        </div>
        
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 overflow-hidden">
            <div className="p-4 border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
              <h3 className="font-bold text-slate-800 dark:text-white">Appearance & Display</h3>
            </div>
            
            {/* Theme */}
            <div className="p-4 flex flex-col md:flex-row md:items-center justify-between border-b border-slate-100 dark:border-slate-700 gap-4">
              <div>
                <p className="font-medium text-slate-800 dark:text-white">Theme</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Choose your preferred appearance</p>
              </div>
              <div className="flex bg-slate-100 dark:bg-slate-700 p-1 rounded-xl">
                {(['light', 'dark', 'system'] as const).map(t => (
                  <button 
                    key={t}
                    onClick={() => updateSettings({ theme: t })}
                    className={\`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors \${settings?.theme === t ? 'bg-white dark:bg-slate-800 text-blue-600 shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}\`}
                  >
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Font Size */}
            <div className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <p className="font-medium text-slate-800 dark:text-white">Font Size</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Adjust the text size across the app</p>
              </div>
              <select 
                value={settings?.fontSize || 'medium'} 
                onChange={(e) => updateSettings({ fontSize: e.target.value as any })}
                className="bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl px-3 py-2 text-slate-800 dark:text-white outline-none"
              >
                <option value="small">Small</option>
                <option value="medium">Medium</option>
                <option value="large">Large</option>
              </select>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 overflow-hidden">
            <div className="p-4 border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
              <h3 className="font-bold text-slate-800 dark:text-white">Study Preferences</h3>
            </div>
            
            {/* Education Level */}
            <div className="p-4 flex flex-col md:flex-row md:items-center justify-between border-b border-slate-100 dark:border-slate-700 gap-4">
              <div>
                <p className="font-medium text-slate-800 dark:text-white">Education Level</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Tailors content to your academic level</p>
              </div>
              <select 
                value={userProfile?.educationLevel || 'Secondary'} 
                onChange={(e) => handleProfileUpdate('educationLevel', e.target.value)}
                className="bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl px-3 py-2 text-slate-800 dark:text-white outline-none"
              >
                <option value="Primary">Primary</option>
                <option value="Secondary">Secondary</option>
                <option value="University">University</option>
                <option value="Professional">Professional</option>
              </select>
            </div>

            {/* Default Practice Difficulty */}
            <div className="p-4 flex flex-col md:flex-row md:items-center justify-between border-b border-slate-100 dark:border-slate-700 gap-4">
              <div>
                <p className="font-medium text-slate-800 dark:text-white">Default Practice Difficulty</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Standard difficulty for practice tests</p>
              </div>
              <select 
                value={settings?.defaultPracticeDifficulty || 'Medium'} 
                onChange={(e) => updateSettings({ defaultPracticeDifficulty: e.target.value as any })}
                className="bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl px-3 py-2 text-slate-800 dark:text-white outline-none"
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
                <option value="Mixed">Mixed</option>
              </select>
            </div>

            {/* AI Tutor Tone */}
            <div className="p-4 flex flex-col md:flex-row md:items-center justify-between border-b border-slate-100 dark:border-slate-700 gap-4">
              <div>
                <p className="font-medium text-slate-800 dark:text-white">AI Tutor Tone</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">How the AI interacts with you</p>
              </div>
              <select 
                value={settings?.aiTutorTone || 'Friendly'} 
                onChange={(e) => updateSettings({ aiTutorTone: e.target.value as any })}
                className="bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl px-3 py-2 text-slate-800 dark:text-white outline-none"
              >
                <option value="Friendly">Friendly</option>
                <option value="Direct">Direct</option>
                <option value="Socratic">Socratic (Guides you to answers)</option>
              </select>
            </div>

            {/* Country */}
            <div className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <p className="font-medium text-slate-800 dark:text-white">Country</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Adjusts curriculum standards</p>
              </div>
              <select 
                value={userProfile?.country || 'International'} 
                onChange={(e) => handleProfileUpdate('country', e.target.value)}
                className="bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl px-3 py-2 text-slate-800 dark:text-white outline-none"
              >
                <option value="International">International</option>
                <option value="US">United States</option>
                <option value="UK">United Kingdom</option>
                <option value="Nigeria">Nigeria</option>
                <option value="India">India</option>
              </select>
            </div>
          </div>
          
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 overflow-hidden">
            <div className="p-4 border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
              <h3 className="font-bold text-slate-800 dark:text-white">Data Management</h3>
            </div>
            <button onClick={handleClearCache} className="w-full p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors text-left">
              <div>
                <p className="font-medium text-slate-800 dark:text-white">Clear Cache</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Free up local storage without losing account data</p>
              </div>
              <Trash2 size={18} className="text-slate-400" />
            </button>
          </div>
        </div>
      </div>
    );
  };
  
  `;
  profile = profile.substring(0, startIdx) + newSettingsView + profile.substring(endIdx);
  fs.writeFileSync('src/components/Profile.tsx', profile);
} else {
  console.log('Failed to find indices');
}
