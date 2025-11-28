// Types et interfaces pour le site web du magasin de vélos

export interface Subcategory {
  id: string;
  nameFr: string;
  nameEn: string;
  nameAr: string;
  slug: string;
  parentCategoryId: string;
}

export interface Category {
  id: string;
  nameFr: string;
  nameEn: string;
  nameAr: string;
  slug: string;
  descriptionFr: string;
  descriptionEn: string;
  descriptionAr: string;
  imageUrl: string;
  displayOrder: number;
  subcategories?: Subcategory[];
}

export interface Product {
  id: string;
  categoryId: string;
  subcategoryId?: string;
  nameFr: string;
  nameEn?: string;
  nameAr?: string;
  slug: string;
  descriptionFr: string;
  descriptionEn?: string;
  descriptionAr?: string;
  price: number;
  stockQuantity: number;
  isAvailable: boolean;
  isFeatured: boolean;
  images: string[];
  specifications: Record<string, string>;
  displayOrder: number;
  viewCount?: number;
  originalPrice?: number;
  discountedPrice?: number;
}

export interface ContactRequest {
  id: string;
  productId?: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  message: string;
  contactMethod: 'whatsapp' | 'phone';
  status: 'new' | 'in_progress' | 'completed';
  createdAt: Date;
}

export interface ServiceBooking {
  id: string;
  serviceType: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  preferredDate: string;
  preferredTime: string;
  description: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  createdAt: Date;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  price: string;
  icon: string;
}

export type ProductFilters = {
  categoryId?: string;
  subcategoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  search?: string;
};

export type SortOption = 'name-asc' | 'name-desc' | 'price-asc' | 'price-desc' | 'newest';
