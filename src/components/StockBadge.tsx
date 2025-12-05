import { useLanguage } from '@/contexts/LanguageContext';

interface StockBadgeProps {
    quantity: number;
}

export function StockBadge({ quantity }: StockBadgeProps) {
    const { language } = useLanguage();

    if (quantity <= 0) {
        return (
            <span className="absolute top-2 left-2 bg-gray-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                {language === 'fr' ? 'Épuisé' : language === 'ar' ? 'نفذ' : 'Sold Out'}
            </span>
        );
    }

    if (quantity <= 3) {
        return (
            <span className="absolute top-2 left-2 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full animate-pulse">
                {language === 'fr' ? `Plus que ${quantity}!` : language === 'ar' ? `فقط ${quantity}!` : `Only ${quantity} left!`}
            </span>
        );
    }

    if (quantity <= 5) {
        return (
            <span className="absolute top-2 left-2 bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                {language === 'fr' ? 'Stock limité' : language === 'ar' ? 'مخزون محدود' : 'Limited Stock'}
            </span>
        );
    }

    return null;
}
