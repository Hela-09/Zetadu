const fs = require('fs');
let code = fs.readFileSync('src/components/PaymentGate.tsx', 'utf8');

const oldStorageLogic = `      if (storage) {
        const fileExt = file.name.split('.').pop();
        const fileName = \`receipts/\${user.uid}_\${Date.now()}.\${fileExt}\`;
        const storageRef = ref(storage, fileName);
        await uploadBytes(storageRef, file);
        receiptUrl = await getDownloadURL(storageRef);
      } else {
        // Fallback to base64 if storage is not configured properly (though it should be)
        const reader = new FileReader();
        receiptUrl = await new Promise((resolve) => {
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        });
      }`;

const newStorageLogic = `      // We use base64 string and compress if it's an image
      const compressImage = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
          if (!file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = error => reject(error);
            reader.readAsDataURL(file);
            return;
          }
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = event => {
            const img = new Image();
            img.src = event.target?.result as string;
            img.onload = () => {
              const canvas = document.createElement('canvas');
              const MAX_WIDTH = 800;
              const MAX_HEIGHT = 800;
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
              resolve(canvas.toDataURL('image/jpeg', 0.6));
            };
          };
        });
      };
      
      receiptUrl = await compressImage(file);
`;

if (code.includes(oldStorageLogic)) {
  code = code.replace(oldStorageLogic, newStorageLogic);
  fs.writeFileSync('src/components/PaymentGate.tsx', code);
  console.log("PaymentGate.tsx patched with image compression");
} else {
  console.log("Could not find storage logic");
}
