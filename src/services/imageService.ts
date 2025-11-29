import { uploadImageToImgBB } from '@/utils/imageUpload';

export const imageService = {
  // ImgBB implementation - 'path' parameter kept for compatibility
  async uploadImage(file: File, path?: string): Promise<string> {
    try {
      return await uploadImageToImgBB(file);
    } catch (error) {
      console.error('Error uploading image:', error);
      throw new Error('Failed to upload image');
    }
  },

  async uploadMultipleImages(files: File[], basePath?: string): Promise<string[]> {
    try {
      const uploadPromises = files.map((file) => this.uploadImage(file));
      return await Promise.all(uploadPromises);
    } catch (error) {
      console.error('Error uploading multiple images:', error);
      throw new Error('Failed to upload images');
    }
  },

  // Note: ImgBB doesn't support deletion via API - placeholder to prevent errors
  async deleteImage(imageUrl: string): Promise<void> {
    console.warn('Image deletion is not supported with ImgBB simple integration. Image URL:', imageUrl);
    return Promise.resolve();
  },

  async deleteMultipleImages(imageUrls: string[]): Promise<void> {
    console.warn('Image deletion is not supported with ImgBB simple integration.', imageUrls);
    return Promise.resolve();
  },
};