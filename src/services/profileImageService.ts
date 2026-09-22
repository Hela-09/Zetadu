import { storage } from '../lib/firebase';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';

/**
 * Resizes and compresses an image client-side to ensure quick uploads,
 * minimal storage usage, and consistent high-density display.
 */
export async function compressImage(file: File, maxDimension = 512, quality = 0.85): Promise<{ blob: Blob; dataUrl: string }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Failed to read selected image file.'));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('Failed to parse image. Please choose a valid image file.'));
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxDimension) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          }
        } else {
          if (height > maxDimension) {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Canvas context unavailable for image processing.'));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve({ blob, dataUrl });
            } else {
              resolve({ blob: new Blob([dataUrl], { type: 'image/jpeg' }), dataUrl });
            }
          },
          'image/jpeg',
          quality
        );
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}

/**
 * Uploads user profile picture to Firebase Storage under the user's UID:
 * `users/${uid}/profile-picture.jpg`
 *
 * If Firebase Storage is unreachable or blocks due to CORS/rules,
 * gracefully falls back to the compressed base64 image so the user's
 * picture is NEVER lost.
 */
export async function uploadUserProfilePicture(uid: string, file: File): Promise<string> {
  if (!uid) {
    throw new Error('User UID is required to upload profile picture.');
  }

  // 1. Process and compress image client-side first
  const { blob, dataUrl } = await compressImage(file, 512, 0.88);

  // 2. Try Firebase Storage with user UID
  if (storage) {
    try {
      const storageRef = ref(storage, `users/${uid}/profile-picture.jpg`);
      const snapshot = await uploadBytes(storageRef, blob, {
        contentType: 'image/jpeg',
        customMetadata: {
          uid,
          updatedAt: new Date().toISOString(),
        },
      });
      const downloadURL = await getDownloadURL(snapshot.ref);
      return downloadURL;
    } catch (storageError: any) {
      console.warn('[Firebase Storage] Upload warning, falling back to local compressed picture:', storageError?.message);
    }
  }

  // 3. Fallback to high-quality compressed dataUrl
  return dataUrl;
}

/**
 * Removes the profile picture from Firebase Storage and clears it.
 */
export async function removeUserProfilePicture(uid: string): Promise<void> {
  if (!uid) return;

  if (storage) {
    try {
      const storageRef = ref(storage, `users/${uid}/profile-picture.jpg`);
      await deleteObject(storageRef);
    } catch (err: any) {
      // Ignore if file doesn't exist in storage
      if (err?.code !== 'storage/object-not-found') {
        console.warn('[Firebase Storage] Delete warning:', err?.message);
      }
    }
  }
}
