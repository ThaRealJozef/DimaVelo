import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Eye } from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StockBadge } from '@/components/StockBadge';
import { QuickViewModal } from '@/components/QuickViewModal';
import { useLanguage } from '@/contexts/LanguageContext';
import type { Product } from '@/lib/types';

const PRODUCTS_PER_PAGE = 8;
const MAX_PAGES = 2;
const DEFAULT_IMG = 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=800&q=80';

type Language = 'fr' | 'en' | 'ar';

function getLocalizedField(item: any, field: string, lang: Language): string {
    const suffix = lang === 'ar' ? 'Ar' : lang === 'en' ? 'En' : 'Fr';
    return item[`${field}${suffix}`] || item[`${field}Fr`] || '';
}

function ProductPrice({ product }: { product: Product }) {
    if (product.discountedPrice && product.originalPrice) {
        const savings = product.originalPrice - product.discountedPrice;
        return (
            <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-lg md:text-xl font-bold text-red-600">{product.discountedPrice.toLocaleString()} DH</span>
                    <span className="text-sm text-gray-400 line-through">{product.originalPrice.toLocaleString()} DH</span>
                </div>
                <span className="text-xs font-medium text-red-600 bg-red-50 px-2 py-0.5 rounded w-fit">
                    {savings.toLocaleString()} DH d'économie
                </span>
            </div>
        );
    }

    return (
        <span className="text-lg md:text-xl font-bold text-green-600">{product.price.toLocaleString()} DH</span>
    );
}

interface ProductCardProps {
    product: Product;
    language: Language;
    buttonText: string;
    onQuickView: (product: Product) => void;
}

function ProductCard({ product, language, buttonText, onQuickView }: ProductCardProps) {
    const name = getLocalizedField(product, 'name', language);
    const description = getLocalizedField(product, 'description', language);

    return (
        <div className="group relative">
            <Link to={`/product/${product.id}`}>
                <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full flex flex-col">
                    <div className="aspect-square overflow-hidden bg-gray-100 flex-shrink-0 relative">
                        <img
                            src={product.images?.[0] || DEFAULT_IMG}
                            alt={name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <StockBadge quantity={product.stockQuantity} />
                    </div>
                    <CardContent className="p-3 md:p-4 flex-1 flex flex-col">
                        <h3 className="font-semibold text-base md:text-lg mb-2 break-words line-clamp-1">{name}</h3>
                        <p className="text-xs md:text-sm text-gray-600 mb-3 line-clamp-2 break-words">{description}</p>
                        <div className="flex flex-col gap-2 mt-auto">
                            <ProductPrice product={product} />
                            <Button size="sm" className="bg-green-600 hover:bg-green-700 w-full">{buttonText}</Button>
                        </div>
                    </CardContent>
                </Card>
            </Link>
            {/* Quick View Button */}
            <button
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onQuickView(product);
                }}
                className="absolute top-2 right-2 p-2 bg-white/90 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-green-50 z-10"
                aria-label="Aperçu rapide"
            >
                <Eye className="h-4 w-4 text-gray-700" />
            </button>
        </div>
    );
}

function PaginationControls({
    currentPage,
    totalPages,
    onPrev,
    onNext,
    isRtl,
}: {
    currentPage: number;
    totalPages: number;
    onPrev: () => void;
    onNext: () => void;
    isRtl: boolean;
}) {
    const atStart = currentPage === 0;
    const atEnd = currentPage === totalPages - 1;

    return (
        <div className="flex items-center justify-end gap-2">
            <Button
                variant="outline"
                size="icon"
                onClick={isRtl ? onNext : onPrev}
                disabled={isRtl ? atEnd : atStart}
                className="h-9 w-9"
            >
                <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm text-gray-600 min-w-[80px] text-center">
                Page {currentPage + 1} / {totalPages}
            </span>
            <Button
                variant="outline"
                size="icon"
                onClick={isRtl ? onPrev : onNext}
                disabled={isRtl ? atStart : atEnd}
                className="h-9 w-9"
            >
                <ChevronRight className="h-4 w-4" />
            </Button>
        </div>
    );
}

interface FeaturedProductsGridProps {
    products: Product[];
}

export function FeaturedProductsGrid({ products }: FeaturedProductsGridProps) {
    const { t, language } = useLanguage();
    const [currentPage, setCurrentPage] = useState(0);
    const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
    const lang = language as Language;

    const maxProducts = PRODUCTS_PER_PAGE * MAX_PAGES;
    const limitedProducts = products.slice(0, maxProducts);
    const totalPages = Math.ceil(limitedProducts.length / PRODUCTS_PER_PAGE);
    const startIndex = currentPage * PRODUCTS_PER_PAGE;
    const currentProducts = limitedProducts.slice(startIndex, startIndex + PRODUCTS_PER_PAGE);

    if (limitedProducts.length === 0) return null;

    return (
        <>
            <div className="relative">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mb-6">
                    {currentProducts.map((product) => (
                        <ProductCard
                            key={product.id}
                            product={product}
                            language={lang}
                            buttonText={t.common.viewDetails}
                            onQuickView={setQuickViewProduct}
                        />
                    ))}
                </div>

                {totalPages > 1 && (
                    <PaginationControls
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPrev={() => setCurrentPage((p) => Math.max(p - 1, 0))}
                        onNext={() => setCurrentPage((p) => Math.min(p + 1, totalPages - 1))}
                        isRtl={language === 'ar'}
                    />
                )}
            </div>

            <QuickViewModal
                product={quickViewProduct}
                isOpen={!!quickViewProduct}
                onClose={() => setQuickViewProduct(null)}
            />
        </>
    );
}
