import fs from 'fs';

let profile = fs.readFileSync('src/components/Profile.tsx', 'utf8');

const target = `const SettingsView = () => {
    const { settings, updateSettings, userProfile, user } = useAuth();`;

const replacement = `const SettingsView = () => {
    const { settings, updateSettings, userProfile, user, refreshProfile } = useAuth();`;

profile = profile.replace(target, replacement);

fs.writeFileSync('src/components/Profile.tsx', profile);
