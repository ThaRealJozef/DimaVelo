import { useState } from 'react';
import { Link } from 'react-router-dom';
import { X, ShoppingCart, Eye, Plus, Minus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/contexts/CartContext';
import { useLanguage } from '@/contexts/LanguageContext';
import type { Product } from '@/lib/types';

type Language = 'fr' | 'en' | 'ar';

function getLocalizedField(item: Product, field: string, lang: Language): string {
    const suffix = lang === 'ar' ? 'Ar' : lang === 'en' ? 'En' : 'Fr';
    return (item as any)[`${field}${suffix}`] || (item as any)[`${field}Fr`] || '';
}

interface QuickViewModalProps {
    product: Product | null;
    isOpen: boolean;
    onClose: () => void;
}

export function QuickViewModal({ product, isOpen, onClose }: QuickViewModalProps) {
    const { addToCart } = useCart();
    const { t, language } = useLanguage();
    const [quantity, setQuantity] = useState(1);

    if (!product) return null;

    const name = getLocalizedField(product, 'name', language as Language);
    const description = getLocalizedField(product, 'description', language as Language);
    const defaultImg = 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=800&q=80';

    const handleAddToCart = () => {
        addToCart({
            productId: product.id,
            categoryId: product.categoryId,
            name,
            price: product.price,
            image: product.images?.[0] || '',
            discountedPrice: product.discountedPrice,
            originalPrice: product.originalPrice,
        }, quantity);
        toast.success(`${name} ${t.cart.addToCart}`);
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 z-50"
                        onClick={onClose}
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-4 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-2xl md:w-full bg-white rounded-xl z-50 overflow-hidden shadow-2xl max-h-[90vh] flex flex-col"
                    >
                        {/* Close button */}
                        <button
                            onClick={onClose}
                            className="absolute top-3 right-3 z-10 p-2 bg-white/80 rounded-full hover:bg-gray-100 transition-colors"
                        >
                            <X className="h-5 w-5" />
                        </button>

                        <div className="flex flex-col md:flex-row overflow-y-auto">
                            {/* Image */}
                            <div className="w-full md:w-1/2 aspect-square bg-gray-100 flex-shrink-0">
                                <img
                                    src={product.images?.[0] || defaultImg}
                                    alt={name}
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            {/* Content */}
                            <div className="flex-1 p-4 md:p-6 flex flex-col">
                                <Badge variant={product.isAvailable ? 'default' : 'secondary'} className="w-fit mb-2">
                                    {product.isAvailable ? t.product.inStock : t.product.outOfStock}
                                </Badge>

                                <h2 className="text-xl md:text-2xl font-bold mb-2">{name}</h2>

                                {/* Price */}
                                <div className="mb-4">
                                    {product.discountedPrice && product.originalPrice ? (
                                        <div className="flex items-center gap-2">
                                            <span className="text-2xl font-bold text-red-600">
                                                {product.discountedPrice.toLocaleString()} DH
                                            </span>
                                            <span className="text-lg text-gray-400 line-through">
                                                {product.originalPrice.toLocaleString()} DH
                                            </span>
                                        </div>
                                    ) : (
                                        <span className="text-2xl font-bold text-green-600">
                                            {product.price.toLocaleString()} DH
                                        </span>
                                    )}
                                </div>

                                <p className="text-gray-600 text-sm mb-4 line-clamp-3">{description}</p>

                                {/* Quantity */}
                                <div className="flex items-center gap-4 mb-4">
                                    <span className="text-sm font-medium">{t.cart.quantity}:</span>
                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            className="h-8 w-8"
                                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        >
                                            <Minus className="h-4 w-4" />
                                        </Button>
                                        <span className="w-8 text-center font-medium">{quantity}</span>
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            className="h-8 w-8"
                                            onClick={() => setQuantity(quantity + 1)}
                                        >
                                            <Plus className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex flex-col gap-2 mt-auto">
                                    <Button
                                        size="lg"
                                        className="w-full bg-green-600 hover:bg-green-700"
                                        disabled={!product.isAvailable}
                                        onClick={handleAddToCart}
                                    >
                                        <ShoppingCart className="mr-2 h-5 w-5" />
                                        {t.cart.addToCart}
                                    </Button>
                                    <Button asChild variant="outline" size="lg" className="w-full">
                                        <Link to={`/product/${product.id}`} onClick={onClose}>
                                            <Eye className="mr-2 h-5 w-5" />
                                            {t.common.viewDetails}
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}

interface QuickViewButtonProps {
    onClick: () => void;
}

export function QuickViewButton({ onClick }: QuickViewButtonProps) {
    return (
        <button
            onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onClick();
            }}
            className="absolute top-2 right-2 p-2 bg-white/90 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-green-50 z-10"
            aria-label="Quick View"
        >
            <Eye className="h-4 w-4 text-gray-700" />
        </button>
    );
}
