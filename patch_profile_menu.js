import fs from 'fs';

let profile = fs.readFileSync('src/components/Profile.tsx', 'utf8');

profile = profile.replace(
  '<ActionRow icon={Settings} title="General Settings" value="Theme, Notifications, Language" onClick={() => handleAction(\'settings\')} />',
  '<ActionRow icon={Settings} title="General Settings & Preferences" value="Theme, Font Size, Study Preferences" onClick={() => handleAction(\'settings\')} />'
);

fs.writeFileSync('src/components/Profile.tsx', profile);
