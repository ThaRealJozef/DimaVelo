import { useMemo } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ProductCard } from '@/components/ProductCard';
import { useProducts } from '@/hooks/useProducts';
import { useLanguage } from '@/contexts/LanguageContext';
import { Loader2, Tag } from 'lucide-react';

export default function PromotionsPage() {
    const { products, loading } = useProducts();
    const { t } = useLanguage();

    // Filter products that have discounts (originalPrice and discountedPrice set)
    const promotionProducts = useMemo(() => {
        return products.filter(
            (product) =>
                product.originalPrice &&
                product.discountedPrice &&
                product.originalPrice > product.discountedPrice
        );
    }, [products]);

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col">
                <Header />
                <main className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <Loader2 className="h-12 w-12 animate-spin text-green-600 mx-auto mb-4" />
                        <p className="text-gray-600">{t.common.loading}</p>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1 container py-8">
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-4">
                        <Tag className="h-8 w-8 text-red-600" />
                        <h1 className="text-3xl font-bold">
                            {t.promotions?.title || 'Promotions'}
                        </h1>
                    </div>
                    <p className="text-gray-600 max-w-3xl">
                        {t.promotions?.subtitle || 'Découvrez nos produits en promotion avec des prix réduits !'}
                    </p>
                </div>

                {promotionProducts.length === 0 ? (
                    <div className="text-center py-16">
                        <Tag className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                        <h2 className="text-2xl font-semibold text-gray-700 mb-2">
                            {t.promotions?.noProducts || 'Aucune promotion disponible'}
                        </h2>
                        <p className="text-gray-500">
                            {t.promotions?.checkBack || 'Revenez bientôt pour découvrir nos nouvelles offres !'}
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="mb-4 text-sm text-gray-600">
                            {promotionProducts.length} {promotionProducts.length === 1 ? 'produit' : 'produits'} en promotion
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {promotionProducts.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    </>
                )}
            </main>
            <Footer />
        </div>
    );
}
