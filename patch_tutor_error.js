import fs from 'fs';

let content = fs.readFileSync('src/components/Tutor.tsx', 'utf8');

const replacement = `
        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            ...(token ? { 'Authorization': \`Bearer \${token}\` } : {})
          },
          body: formData
        });
        
        if (!uploadRes.ok) {
          const errText = await uploadRes.text();
          throw new Error('Upload failed (' + uploadRes.status + '): ' + errText.substring(0, 100));
        }
        
        const contentType = uploadRes.headers.get("content-type");
        if (contentType && contentType.indexOf("application/json") !== -1) {
          const uploadData = await uploadRes.json();
          uploadedAttachments = uploadData.attachments || [];
        } else {
          const errText = await uploadRes.text();
          throw new Error('Upload returned HTML: ' + errText.substring(0, 100));
        }
`;

content = content.replace(
  /const uploadRes = await fetch\('\/api\/upload', \{[\s\S]*?uploadedAttachments = uploadData\.attachments \|\| \[\];/g,
  replacement
);

// Also fix the issue where file selection alone doesn't trigger send!
content = content.replace(
  /if \(\(!input\.trim\(\) && selectedFiles\.length === 0\) \|\| isLoading \|\| isUploading\) return;\n    if \(!input\.trim\(\) \|\| isLoading\) return;/g,
  "if ((!input.trim() && selectedFiles.length === 0) || isLoading || isUploading) return;"
);

fs.writeFileSync('src/components/Tutor.tsx', content);

