import fs from 'fs';

let content = fs.readFileSync('src/components/Tutor.tsx', 'utf8');

const validation = `
  const handleFileSelection = (files: FileList | null) => {
    if (!files) return;
    
    const validFiles: File[] = [];
    const newFiles = Array.from(files);
    
    for (const file of newFiles) {
      let maxSize = 25 * 1024 * 1024; // 25 MB default
      let typeName = "Document";
      
      if (file.type.startsWith('image/')) {
        maxSize = 20 * 1024 * 1024;
        typeName = "Image";
      } else if (file.type === 'application/pdf') {
        maxSize = 50 * 1024 * 1024;
        typeName = "PDF";
      } else if (file.type.startsWith('audio/')) {
        maxSize = 20 * 1024 * 1024;
        typeName = "Audio";
      }
      
      if (file.size > maxSize) {
        alert(\`\${file.name} is too large. Maximum size for \${typeName} is \${maxSize / (1024 * 1024)}MB.\`);
        continue;
      }
      validFiles.push(file);
    }
    
    if (validFiles.length > 0) {
      setSelectedFiles(prev => [...prev, ...validFiles]);
    }
  };
`;

content = content.replace(
  '  const handleDrag = (e: React.DragEvent) => {',
  validation + '\n  const handleDrag = (e: React.DragEvent) => {'
);

content = content.replace(
  'if (e.dataTransfer.files && e.dataTransfer.files[0]) {\n      setSelectedFiles(prev => [...prev, ...Array.from(e.dataTransfer.files)]);\n    }',
  'handleFileSelection(e.dataTransfer.files);'
);

content = content.replace(
  'if(e.target.files) setSelectedFiles(prev => [...prev, ...Array.from(e.target.files!)]);',
  'handleFileSelection(e.target.files);'
);

fs.writeFileSync('src/components/Tutor.tsx', content);
