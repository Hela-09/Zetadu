import fs from 'fs';

let profile = fs.readFileSync('src/components/Profile.tsx', 'utf8');

const target = `<SectionHeading>Account & App Settings</SectionHeading>
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700/50 shadow-sm flex flex-col mb-8">
        <ActionRow icon={Settings} title="General Settings" value="Theme, Notifications" onClick={() => handleAction('settings')} />
        <ActionRow icon={Shield} title="Privacy & Security" onClick={() => handleAction('settings')} />
      </div>`;

const replacement = `<SectionHeading>Settings</SectionHeading>
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700/50 shadow-sm flex flex-col mb-8">
        <ActionRow icon={Settings} title="General Settings" value="Theme, Notifications, Language" onClick={() => handleAction('settings')} />
      </div>`;

profile = profile.replace(target, replacement);
fs.writeFileSync('src/components/Profile.tsx', profile);
