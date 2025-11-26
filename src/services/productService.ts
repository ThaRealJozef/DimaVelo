import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  Timestamp,
  writeBatch,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Product } from '@/lib/types';
import { imageService } from './imageService';

const PRODUCTS_COLLECTION = 'products';

export const productService = {
  /**
   * Get all products
   */
  async getAllProducts(): Promise<Product[]> {
    try {
      const q = query(collection(db, PRODUCTS_COLLECTION), orderBy('displayOrder', 'asc'));
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Product[];
    } catch (error) {
      console.error('Error getting products:', error);
      throw new Error('Failed to fetch products');
    }
  },

  /**
   * Get products by category
   */
  async getProductsByCategory(categoryId: string): Promise<Product[]> {
    try {
      const q = query(
        collection(db, PRODUCTS_COLLECTION),
        where('categoryId', '==', categoryId),
        orderBy('displayOrder', 'asc')
      );
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Product[];
    } catch (error) {
      console.error('Error getting products by category:', error);
      throw new Error('Failed to fetch products by category');
    }
  },

  /**
   * Get featured products
   */
  async getFeaturedProducts(): Promise<Product[]> {
    try {
      const q = query(
        collection(db, PRODUCTS_COLLECTION),
        where('isFeatured', '==', true),
        orderBy('displayOrder', 'asc')
      );
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Product[];
    } catch (error) {
      console.error('Error getting featured products:', error);
      throw new Error('Failed to fetch featured products');
    }
  },

  /**
   * Get a single product by ID
   */
  async getProductById(id: string): Promise<Product | null> {
    try {
      const docRef = doc(db, PRODUCTS_COLLECTION, id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data(),
        } as Product;
      }
      
      return null;
    } catch (error) {
      console.error('Error getting product:', error);
      throw new Error('Failed to fetch product');
    }
  },

  /**
   * Get a product by slug
   */
  async getProductBySlug(slug: string): Promise<Product | null> {
    try {
      const q = query(collection(db, PRODUCTS_COLLECTION), where('slug', '==', slug));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        return {
          id: doc.id,
          ...doc.data(),
        } as Product;
      }
      
      return null;
    } catch (error) {
      console.error('Error getting product by slug:', error);
      throw new Error('Failed to fetch product by slug');
    }
  },

  /**
   * Create a new product
   */
  async createProduct(productData: Omit<Product, 'id'>, imageFiles?: File[]): Promise<string> {
    try {
      let imageUrls: string[] = [];
      
      // Upload images if provided
      if (imageFiles && imageFiles.length > 0) {
        imageUrls = await imageService.uploadMultipleImages(imageFiles, 'products');
      }

      const newProduct = {
        ...productData,
        images: imageUrls,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      };

      const docRef = await addDoc(collection(db, PRODUCTS_COLLECTION), newProduct);
      return docRef.id;
    } catch (error) {
      console.error('Error creating product:', error);
      throw new Error('Failed to create product');
    }
  },

  /**
   * Update an existing product
   */
  async updateProduct(
    id: string,
    productData: Partial<Product>,
    newImageFiles?: File[],
    imagesToDelete?: string[]
  ): Promise<void> {
    try {
      // Delete old images if specified
      if (imagesToDelete && imagesToDelete.length > 0) {
        await imageService.deleteMultipleImages(imagesToDelete);
      }

      // Upload new images if provided
      let newImageUrls: string[] = [];
      if (newImageFiles && newImageFiles.length > 0) {
        newImageUrls = await imageService.uploadMultipleImages(newImageFiles, 'products');
      }

      // Merge existing images with new images
      const currentProduct = await this.getProductById(id);
      const existingImages = currentProduct?.images || [];
      const filteredExistingImages = existingImages.filter(
        (img) => !imagesToDelete?.includes(img)
      );
      const updatedImages = [...filteredExistingImages, ...newImageUrls];

      const updateData = {
        ...productData,
        images: updatedImages,
        updatedAt: Timestamp.now(),
      };

      const docRef = doc(db, PRODUCTS_COLLECTION, id);
      await updateDoc(docRef, updateData);
    } catch (error) {
      console.error('Error updating product:', error);
      throw new Error('Failed to update product');
    }
  },

  /**
   * Delete a product
   */
  async deleteProduct(id: string): Promise<void> {
    try {
      // Get product to delete its images
      const product = await this.getProductById(id);
      
      if (product && product.images && product.images.length > 0) {
        await imageService.deleteMultipleImages(product.images);
      }

      const docRef = doc(db, PRODUCTS_COLLECTION, id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error('Error deleting product:', error);
      throw new Error('Failed to delete product');
    }
  },

  /**
   * Update product stock
   */
  async updateStock(id: string, stockQuantity: number): Promise<void> {
    try {
      const docRef = doc(db, PRODUCTS_COLLECTION, id);
      await updateDoc(docRef, {
        stockQuantity,
        isAvailable: stockQuantity > 0,
        updatedAt: Timestamp.now(),
      });
    } catch (error) {
      console.error('Error updating stock:', error);
      throw new Error('Failed to update stock');
    }
  },

  /**
   * Generate a URL-friendly slug from a string
   */
  generateSlug(text: string): string {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  },
};