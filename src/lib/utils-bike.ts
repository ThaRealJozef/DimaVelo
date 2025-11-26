// Fonctions utilitaires pour le site web du magasin de vélos

import { Product, ProductFilters, SortOption } from './types';
import { WHATSAPP_NUMBER } from './data';

/**
 * Génère un lien WhatsApp avec message pré-rempli
 */
export function generateWhatsAppLink(productName: string, productPrice: number, productId: string): string {
  const message = encodeURIComponent(
    `Bonjour, je suis intéressé par le produit: ${productName} (${productPrice} MAD). Référence: ${productId}`
  );
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;
}

/**
 * Génère un lien WhatsApp pour une demande générale
 */
export function generateWhatsAppLinkGeneral(message: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

/**
 * Formate le prix en MAD
 */
export function formatPrice(price: number): string {
  return `${price.toLocaleString('fr-MA')} MAD`;
}

/**
 * Filtre les produits selon les critères
 */
export function filterProducts(products: Product[], filters: ProductFilters): Product[] {
  return products.filter(product => {
    if (filters.categoryId && product.categoryId !== filters.categoryId) {
      return false;
    }
    if (filters.minPrice && product.price < filters.minPrice) {
      return false;
    }
    if (filters.maxPrice && product.price > filters.maxPrice) {
      return false;
    }
    if (filters.inStock && product.stockQuantity === 0) {
      return false;
    }
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      return (
        product.nameFr.toLowerCase().includes(searchLower) ||
        product.descriptionFr.toLowerCase().includes(searchLower)
      );
    }
    return true;
  });
}

/**
 * Trie les produits selon l'option choisie
 */
export function sortProducts(products: Product[], sortOption: SortOption): Product[] {
  const sorted = [...products];
  
  switch (sortOption) {
    case 'name-asc':
      return sorted.sort((a, b) => a.nameFr.localeCompare(b.nameFr));
    case 'name-desc':
      return sorted.sort((a, b) => b.nameFr.localeCompare(a.nameFr));
    case 'price-asc':
      return sorted.sort((a, b) => a.price - b.price);
    case 'price-desc':
      return sorted.sort((a, b) => b.price - a.price);
    case 'newest':
      return sorted.sort((a, b) => b.displayOrder - a.displayOrder);
    default:
      return sorted;
  }
}

/**
 * Obtient les produits similaires (même catégorie)
 */
export function getSimilarProducts(products: Product[], currentProduct: Product, limit: number = 4): Product[] {
  return products
    .filter(p => p.categoryId === currentProduct.categoryId && p.id !== currentProduct.id && p.isAvailable)
    .slice(0, limit);
}

/**
 * Obtient les produits vedettes
 */
export function getFeaturedProducts(products: Product[], limit: number = 4): Product[] {
  return products.filter(p => p.isFeatured && p.isAvailable).slice(0, limit);
}

/**
 * Vérifie si un produit est en stock
 */
export function isInStock(product: Product): boolean {
  return product.isAvailable && product.stockQuantity > 0;
}

/**
 * Obtient le badge de stock
 */
export function getStockBadge(product: Product): { text: string; variant: 'default' | 'destructive' | 'secondary' } {
  if (!product.isAvailable || product.stockQuantity === 0) {
    return { text: 'Rupture de stock', variant: 'destructive' };
  }
  if (product.stockQuantity <= 5) {
    return { text: `Stock limité (${product.stockQuantity})`, variant: 'secondary' };
  }
  return { text: 'En stock', variant: 'default' };
}