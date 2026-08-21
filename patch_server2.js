import fs from 'fs';

let server = fs.readFileSync('server.ts', 'utf8');

const uploadRoutes = `
  const upload = multer({ dest: '/tmp/uploads/' });

  app.post("/api/upload", requireAuth, upload.array('files'), async (req, res) => {
    try {
      const files = req.files as Express.Multer.File[];
      if (!files || files.length === 0) {
        return res.status(400).json({ error: "No files uploaded" });
      }
      const ai = getGeminiClient();
      const uid = (req as any).user.uid;
      const bucket = getStorage().bucket();

      const uploadedAttachments = [];

      for (const file of files) {
        const ext = path.extname(file.originalname);
        const filename = \`\${Date.now()}-\${Math.round(Math.random() * 1E9)}\${ext}\`;
        const storagePath = \`users/\${uid}/attachments/\${filename}\`;

        await bucket.upload(file.path, {
          destination: storagePath,
          metadata: { contentType: file.mimetype }
        });
        
        const [downloadUrl] = await bucket.file(storagePath).getSignedUrl({
          action: 'read',
          expires: '01-01-2099',
        });

        let fileUri = null;
        try {
          const fileResponse = await ai.files.upload({ file: file.path, mimeType: file.mimetype });
          fileUri = fileResponse.uri;
        } catch (err) {
          console.warn("Gemini upload failed for", file.originalname, err);
        }

        fs.unlinkSync(file.path);

        uploadedAttachments.push({
          path: storagePath,
          url: downloadUrl,
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

server = server.replace('  // Chat API', uploadRoutes + '\n  // Chat API');

server = server.replace(
  `      const contents = history ? history.map((msg: any) => ({\n        role: msg.role === 'user' ? 'user' : 'model',\n        parts: [{ text: msg.text }]\n      })) : [];\n      \n      contents.push({ role: 'user', parts: [{ text: message }] });`,
  `      const contents = history ? history.map((msg: any) => {
        const parts: any[] = [{ text: msg.text || ' ' }];
        if (msg.attachments) {
          msg.attachments.forEach((att: any) => {
            if (att.fileUri) parts.push({ fileData: { fileUri: att.fileUri, mimeType: att.mimeType } });
          });
        }
        return { role: msg.role === 'user' ? 'user' : 'model', parts };
      }) : [];
      
      const newParts: any[] = [{ text: message || ' ' }];
      if (req.body.attachments) {
        req.body.attachments.forEach((att: any) => {
          if (att.fileUri) newParts.push({ fileData: { fileUri: att.fileUri, mimeType: att.mimeType } });
        });
      }
      contents.push({ role: 'user', parts: newParts });`
);

fs.writeFileSync('server.ts', server);

