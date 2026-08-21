import fs from 'fs';

let content = fs.readFileSync('src/components/Tutor.tsx', 'utf8');

const compressImage = `
  const compressImage = async (file: File): Promise<File> => {
    if (!file.type.startsWith('image/') || file.type === 'image/svg+xml') return file;
    
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 1920;
          const MAX_HEIGHT = 1080;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);

          canvas.toBlob((blob) => {
            if (blob) {
              resolve(new File([blob], file.name, { type: file.type, lastModified: Date.now() }));
            } else {
              resolve(file);
            }
          }, file.type, 0.8);
        };
        img.onerror = () => resolve(file);
      };
      reader.onerror = () => resolve(file);
    });
  };
`;

content = content.replace(
  '  const autoSaveConversation = async (newMessages: ChatMessage[]) => {',
  compressImage + '\n  const autoSaveConversation = async (newMessages: ChatMessage[]) => {'
);

content = content.replace(
  'selectedFiles.forEach(file => formData.append(\'files\', file));',
  'for (const file of selectedFiles) {\n          const compressedFile = await compressImage(file);\n          formData.append(\'files\', compressedFile);\n        }'
);

content = content.replace(
  '<img src={att.url} alt={att.name} className="w-10 h-10 object-cover rounded-md" />',
  '<img src={att.url} alt={att.name} loading="lazy" className="w-10 h-10 object-cover rounded-md" />'
);

fs.writeFileSync('src/components/Tutor.tsx', content);
