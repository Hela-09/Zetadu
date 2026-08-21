import fs from 'fs';

let profile = fs.readFileSync('src/components/Profile.tsx', 'utf8');

const target = `    const handleProfileUpdate = async (field: string, value: string) => {
      if (!user) return;
      try {
        await setDoc(doc(db, 'users', user.uid), { [field]: value }, { merge: true });
        // The real-time listener or refreshProfile will pick this up
      } catch (err) {
        console.error("Failed to update profile", err);
      }
    };`;

const replacement = `    const handleProfileUpdate = async (field: string, value: string) => {
      if (!user) return;
      try {
        await setDoc(doc(db, 'users', user.uid), { [field]: value }, { merge: true });
        if (refreshProfile) await refreshProfile();
      } catch (err) {
        console.error("Failed to update profile", err);
      }
    };`;

profile = profile.replace(target, replacement);

fs.writeFileSync('src/components/Profile.tsx', profile);
