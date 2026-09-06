const fs = require('fs');
let code = fs.readFileSync('src/contexts/AuthContext.tsx', 'utf8');

const search = `        } catch (err: any) {
          console.warn("Error setting up user profile:", err);
          if (err?.message?.includes("Database '(default)' not found") || err?.message?.includes("not found")) {
             console.warn("Firestore database not found. Disabling network to prevent endless retries.");
             import('firebase/firestore').then(({ disableNetwork }) => {
                 if (db) disableNetwork(db).catch(console.warn);
             });
          }
        }`;

const replace = `        } catch (err: any) {
          console.warn("Error setting up user profile:", err);
        }`;

code = code.replace(search, replace);
fs.writeFileSync('src/contexts/AuthContext.tsx', code);
