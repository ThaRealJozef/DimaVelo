// Services data - Easy to edit for multilingual support
// All translations are managed in i18n.ts

export interface ServiceData {
  id: string;
  icon: string;
  price: number; // Price in MAD
  duration: string; // Duration in minutes
}

export const servicesData: ServiceData[] = [
  {
    id: 'bike-repair',
    icon: '🔧',
    price: 300,
    duration: '60',
  },
  {
    id: 'maintenance',
    icon: '⚙️',
    price: 200,
    duration: '45',
  },
  {
    id: 'customization',
    icon: '🎨',
    price: 0, // 0 means "On quote"
    duration: '90',
  },
  {
    id: 'assembly',
    icon: '🔩',
    price: 150,
    duration: '30',
  },
  {
    id: 'accessories',
    icon: '🛍️',
    price: 0, // Varies by product
    duration: '15',
  },
  {
    id: 'consultation',
    icon: '💡',
    price: 0, // Free
    duration: '30',
  },
];