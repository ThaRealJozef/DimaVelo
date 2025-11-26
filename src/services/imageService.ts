import { uploadImageToImgBB } from '@/utils/imageUpload';

export const imageService = {
  /**
   * Upload an image to ImgBB
   * @param file - The image file to upload
   * @param path - Unused in ImgBB implementation, kept for compatibility
   * @returns The download URL of the uploaded image
   */
  async uploadImage(file: File, path?: string): Promise<string> {
    try {
      return await uploadImageToImgBB(file);
    } catch (error) {
      console.error('Error uploading image:', error);
      throw new Error('Failed to upload image');
    }
  },

  /**
   * Upload multiple images to ImgBB
   * @param files - Array of image files to upload
   * @param basePath - Unused in ImgBB implementation, kept for compatibility
   * @returns Array of download URLs
   */
  async uploadMultipleImages(files: File[], basePath?: string): Promise<string[]> {
    try {
      const uploadPromises = files.map((file) => this.uploadImage(file));
      return await Promise.all(uploadPromises);
    } catch (error) {
      console.error('Error uploading multiple images:', error);
      throw new Error('Failed to upload images');
    }
  },

  /**
   * Delete an image
   * Note: ImgBB API simple upload doesn't support deletion via API key without extra setup.
   * This is a placeholder to prevent errors in existing code.
   * @param imageUrl - The URL of the image
   */
  async deleteImage(imageUrl: string): Promise<void> {
    console.warn('Image deletion is not supported with ImgBB simple integration. Image URL:', imageUrl);
    // No-op
    return Promise.resolve();
  },

  /**
   * Delete multiple images
   * Note: ImgBB API simple upload doesn't support deletion via API key without extra setup.
   * This is a placeholder to prevent errors in existing code.
   * @param imageUrls - Array of image URLs
   */
  async deleteMultipleImages(imageUrls: string[]): Promise<void> {
    console.warn('Image deletion is not supported with ImgBB simple integration.', imageUrls);
    // No-op
    return Promise.resolve();
  },
};