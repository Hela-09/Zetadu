import fs from 'fs';

let profile = fs.readFileSync('src/components/Profile.tsx', 'utf8');

profile = profile.replace(
  'const { user, userProfile, refreshProfile, settings, updateSettings, signOut } = useAuth();',
  'const { user, userProfile, refreshProfile, settings, updateSettings, isSuperAdmin, signOut } = useAuth();'
);

if (!profile.includes('ShieldAlert')) {
  profile = profile.replace(
    '} from \'lucide-react\';',
    ', ShieldAlert } from \'lucide-react\';'
  );
}

const adminTarget = `<SectionHeading>Settings</SectionHeading>`;

const adminReplacement = `{isSuperAdmin && (
        <>
          <SectionHeading>Admin Tools</SectionHeading>
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-red-100 dark:border-red-900/30 shadow-sm flex flex-col mb-8 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-2 h-full bg-red-500"></div>
            <ActionRow icon={ShieldAlert} title="Super Admin Dashboard" value="Manage Users & Content" onClick={() => { window.scrollTo(0, 0); setView('admin'); }} />
          </div>
        </>
      )}

      <SectionHeading>Settings</SectionHeading>`;

profile = profile.replace(adminTarget, adminReplacement);
fs.writeFileSync('src/components/Profile.tsx', profile);
