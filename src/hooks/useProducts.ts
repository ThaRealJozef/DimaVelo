import { useCallback } from 'react';
import { productService } from '@/services/productService';
import { useDataFetcher } from './useDataFetcher';

export function useProducts() {
  const fetchProducts = useCallback(() => productService.getAllProducts(), []);
  const { data, loading, error, refresh } = useDataFetcher(fetchProducts);

  return {
    products: data || [],
    loading,
    error,
    refreshProducts: refresh
  };
}

export function useFeaturedProducts() {
  const fetchFeatured = useCallback(() => productService.getFeaturedProducts(), []);
  const { data, loading, error } = useDataFetcher(fetchFeatured);

  return {
    products: data || [],
    loading,
    error
  };
}

export function useProductsByCategory(categoryId: string) {
  const fetchByCategory = useCallback(() => {
    if (!categoryId) return Promise.resolve([]);
    return productService.getProductsByCategory(categoryId);
  }, [categoryId]);

  const { data, loading, error } = useDataFetcher(fetchByCategory, [categoryId]);

  return {
    products: data || [],
    loading,
    error
  };
}

export function useProduct(id: string) {
  const fetchProduct = useCallback(() => {
    if (!id) return Promise.resolve(null);
    return productService.getProductById(id);
  }, [id]);

  const { data, loading, error } = useDataFetcher(fetchProduct, [id]);

  return {
    product: data,
    loading,
    error
  };
}