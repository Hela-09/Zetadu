import { initializeApp } from "firebase-admin/app";
import { getStorage } from "firebase-admin/storage";
import fs from "fs";

const config = JSON.parse(fs.readFileSync('firebase-applet-config.json', 'utf-8'));
initializeApp({ projectId: config.projectId, storageBucket: config.storageBucket });

const bucket = getStorage().bucket();
bucket.getFiles({ maxResults: 1 }).then(() => console.log("Success")).catch(e => console.error("Bucket Error:", e.message, e));
