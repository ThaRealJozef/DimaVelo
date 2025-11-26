import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from '@/lib/firebase';

export const imageService = {
  /**
   * Upload an image to Firebase Storage
   * @param file - The image file to upload
   * @param path - The storage path (e.g., 'products/image-name.jpg')
   * @returns The download URL of the uploaded image
   */
  async uploadImage(file: File, path: string): Promise<string> {
    try {
      const storageRef = ref(storage, path);
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      return downloadURL;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw new Error('Failed to upload image');
    }
  },

  /**
   * Upload multiple images to Firebase Storage
   * @param files - Array of image files to upload
   * @param basePath - The base storage path (e.g., 'products')
   * @returns Array of download URLs
   */
  async uploadMultipleImages(files: File[], basePath: string): Promise<string[]> {
    try {
      const uploadPromises = files.map((file, index) => {
        const timestamp = Date.now();
        const fileName = `${timestamp}-${index}-${file.name}`;
        const path = `${basePath}/${fileName}`;
        return this.uploadImage(file, path);
      });

      return await Promise.all(uploadPromises);
    } catch (error) {
      console.error('Error uploading multiple images:', error);
      throw new Error('Failed to upload images');
    }
  },

  /**
   * Delete an image from Firebase Storage
   * @param imageUrl - The full URL of the image to delete
   */
  async deleteImage(imageUrl: string): Promise<void> {
    try {
      // Extract the path from the URL
      const baseUrl = `https://firebasestorage.googleapis.com/v0/b/${import.meta.env.VITE_FIREBASE_STORAGE_BUCKET}/o/`;
      if (!imageUrl.startsWith(baseUrl)) {
        throw new Error('Invalid Firebase Storage URL');
      }

      const encodedPath = imageUrl.split(baseUrl)[1].split('?')[0];
      const path = decodeURIComponent(encodedPath);
      
      const storageRef = ref(storage, path);
      await deleteObject(storageRef);
    } catch (error) {
      console.error('Error deleting image:', error);
      throw new Error('Failed to delete image');
    }
  },

  /**
   * Delete multiple images from Firebase Storage
   * @param imageUrls - Array of image URLs to delete
   */
  async deleteMultipleImages(imageUrls: string[]): Promise<void> {
    try {
      const deletePromises = imageUrls.map((url) => this.deleteImage(url));
      await Promise.all(deletePromises);
    } catch (error) {
      console.error('Error deleting multiple images:', error);
      throw new Error('Failed to delete images');
    }
  },
};