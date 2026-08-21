import fs from 'fs';

let content = fs.readFileSync('src/components/Tutor.tsx', 'utf8');

const chatFetchReplacement = `
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...(token ? { 'Authorization': \`Bearer \${token}\` } : {})
        },
        body: JSON.stringify({
          message: userMsg.text,
          attachments: userMsg.attachments,
          history: currentHistory,
          context: {
            educationLevel: userProfile?.educationLevel || 'Secondary',
            country: userProfile?.country || 'International',
            tone: settings?.aiTutorTone || 'Friendly'
          }
        })
      });

      if (!response.ok) {
        if (response.status === 401) {
            throw new Error('Authentication required');
        }
        const errText = await response.text();
        throw new Error('Chat failed (' + response.status + '): ' + errText.substring(0, 100));
      }
      
      const contentType = response.headers.get("content-type");
      if (!contentType || contentType.indexOf("application/json") === -1) {
        throw new Error('Chat returned non-JSON response');
      }

      const data = await response.json();
`;

content = content.replace(
  /const response = await fetch\('\/api\/chat'[\s\S]*?const data = await response\.json\(\);/g,
  chatFetchReplacement
);

fs.writeFileSync('src/components/Tutor.tsx', content);

let practiceContent = fs.readFileSync('src/components/Practice.tsx', 'utf8');

const generateFetchReplacement = `
      const response = await fetch('/api/generate-questions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...(token ? { 'Authorization': \`Bearer \${token}\` } : {})
        },
        body: JSON.stringify({
          subject: selectedSubject,
          topic: selectedTopic,
          difficulty: selectedDifficulty,
          amount: amount,
          educationLevel: userProfile?.educationLevel,
          country: userProfile?.country
        })
      });

      if (!response.ok) {
        if (response.status === 401) throw new Error("Authentication required");
        throw new Error("Failed to generate questions.");
      }
      
      const contentType = response.headers.get("content-type");
      if (!contentType || contentType.indexOf("application/json") === -1) {
        throw new Error('Generation returned non-JSON response');
      }

      const data = await response.json();
`;

practiceContent = practiceContent.replace(
  /const response = await fetch\('\/api\/generate-questions'[\s\S]*?const data = await response\.json\(\);/g,
  generateFetchReplacement
);

fs.writeFileSync('src/components/Practice.tsx', practiceContent);
