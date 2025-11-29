import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import type { Product } from '@/lib/types';

// Easy configuration - Change these values as your product catalog grows
const PRODUCTS_PER_PAGE = 8; // 4 columns x 2 rows
const MAX_PAGES = 2; // Maximum 2 pages (16 products total), increase this as needed

interface FeaturedProductsGridProps {
    products: Product[];
}

export function FeaturedProductsGrid({ products }: FeaturedProductsGridProps) {
    const { t, language } = useLanguage();
    const [currentPage, setCurrentPage] = useState(0);

    // Limit to maximum products based on MAX_PAGES
    const maxProducts = PRODUCTS_PER_PAGE * MAX_PAGES;
    const limitedProducts = products.slice(0, maxProducts);

    // Calculate total pages
    const totalPages = Math.ceil(limitedProducts.length / PRODUCTS_PER_PAGE);

    // Get products for current page
    const startIndex = currentPage * PRODUCTS_PER_PAGE;
    const currentProducts = limitedProducts.slice(startIndex, startIndex + PRODUCTS_PER_PAGE);

    const getProductName = (product: Product) => {
        switch (language) {
            case 'ar': return product.nameAr || product.nameFr;
            case 'en': return product.nameEn || product.nameFr;
            default: return product.nameFr;
        }
    };

    const getProductDescription = (product: Product) => {
        switch (language) {
            case 'ar': return product.descriptionAr || product.descriptionFr;
            case 'en': return product.descriptionEn || product.descriptionFr;
            default: return product.descriptionFr;
        }
    };

    const goToNextPage = () => {
        setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1));
    };

    const goToPrevPage = () => {
        setCurrentPage((prev) => Math.max(prev - 1, 0));
    };

    if (limitedProducts.length === 0) {
        return null;
    }

    return (
        <div className="relative">
            {/* Grid - 2 columns on mobile, 4 columns on desktop */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mb-6">
                {currentProducts.map((product) => (
                    <Link
                        key={product.id}
                        to={`/product/${product.id}`}
                        className="group"
                    >
                        <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full flex flex-col">
                            <div className="aspect-square overflow-hidden bg-gray-100 flex-shrink-0">
                                <img
                                    src={product.images?.[0] || 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=800&q=80'}
                                    alt={getProductName(product)}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                            </div>
                            <CardContent className="p-3 md:p-4 flex-1 flex flex-col">
                                <h3 className="font-semibold text-base md:text-lg mb-2 break-words line-clamp-1">
                                    {getProductName(product)}
                                </h3>
                                <p className="text-xs md:text-sm text-gray-600 mb-3 line-clamp-2 break-words">
                                    {getProductDescription(product)}
                                </p>
                                <div className="flex flex-col gap-2 mt-auto">
                                    {product.discountedPrice && product.originalPrice ? (
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <span className="text-lg md:text-xl font-bold text-red-600">
                                                {product.discountedPrice.toLocaleString()} DH
                                            </span>
                                            <span className="text-sm text-gray-400 line-through">
                                                {product.originalPrice.toLocaleString()} DH
                                            </span>
                                        </div>
                                    ) : (
                                        <span className="text-lg md:text-xl font-bold text-green-600">
                                            {product.price.toLocaleString()} DH
                                        </span>
                                    )}
                                    <Button size="sm" className="bg-green-600 hover:bg-green-700 w-full">
                                        {t.common.viewDetails}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>

            {/* Pagination Controls - Bottom Right */}
            {totalPages > 1 && (
                <div className="flex items-center justify-end gap-2">
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={language === 'ar' ? goToNextPage : goToPrevPage}
                        disabled={language === 'ar' ? currentPage === totalPages - 1 : currentPage === 0}
                        className="h-9 w-9"
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span className="text-sm text-gray-600 min-w-[80px] text-center">
                        {language === 'ar'
                            ? `${t.common?.page || 'Page'} ${currentPage + 1} / ${totalPages}`
                            : `Page ${currentPage + 1} / ${totalPages}`
                        }
                    </span>
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={language === 'ar' ? goToPrevPage : goToNextPage}
                        disabled={language === 'ar' ? currentPage === 0 : currentPage === totalPages - 1}
                        className="h-9 w-9"
                    >
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            )}
        </div>
    );
}
