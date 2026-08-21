import fs from 'fs';

let content = fs.readFileSync('server.ts', 'utf8');

const replacement = `
  app.use('/api/uploads', express.static('/tmp/uploads'));

  app.post("/api/upload", requireAuth, upload.array('files'), async (req, res) => {
    try {
      const files = req.files as Express.Multer.File[];
      if (!files || files.length === 0) {
        return res.status(400).json({ error: "No files uploaded" });
      }

      const ai = getGeminiClient();
      const uploadedAttachments = [];

      for (const file of files) {
        const ext = path.extname(file.originalname);
        const filename = \`\${Date.now()}-\${Math.round(Math.random() * 1E9)}\${ext}\`;
        const localPath = \`/tmp/uploads/\${filename}\`;

        // Rename the file to have the correct extension
        fs.renameSync(file.path, localPath);

        let fileUri = null;
        try {
          const fileResponse = await ai.files.upload({ file: localPath, mimeType: file.mimetype });
          fileUri = fileResponse.uri;
        } catch (err) {
          console.warn("Gemini upload failed for", file.originalname, err);
        }

        uploadedAttachments.push({
          url: \`/api/uploads/\${filename}\`,
          name: file.originalname,
          mimeType: file.mimetype,
          fileUri: fileUri
        });
      }

      res.json({ attachments: uploadedAttachments });
    } catch (error) {
      console.error("Upload API Error:", error);
      res.status(500).json({ error: "Failed to upload files" });
    }
  });
`;

content = content.replace(
  /app\.post\("\/api\/upload"[\s\S]*?res\.status\(500\)\.json\(\{ error: "Failed to upload files" \}\);\n    \}\n  \}\);/,
  replacement.trim()
);

fs.writeFileSync('server.ts', content);
