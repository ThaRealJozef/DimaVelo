import { useParams, Link } from 'react-router-dom';
import { useEffect } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { useProducts } from '@/hooks/useProducts';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, MessageCircle } from 'lucide-react';
import { generateWhatsAppLink } from '@/lib/utils-bike';
import { useLanguage } from '@/contexts/LanguageContext';
import { ProductImageGallery } from '@/components/ProductImageGallery';
import { productService } from '@/services/productService';

export default function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const { t, language } = useLanguage();
  const { products, loading } = useProducts();

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col overflow-x-hidden">
        <Header />
        <main className="flex-1 container py-16 flex items-center justify-center px-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </main>
        <Footer />
      </div>
    );
  }

  const product = products.find((p) => p.id === id);

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col overflow-x-hidden">
        <Header />
        <main className="flex-1 container py-16 px-4">
          <div className="text-center">
            <h1 className="text-2xl md:text-3xl font-bold mb-4 break-words">{t.product.notFound}</h1>
            <Button asChild className="w-full sm:w-auto">
              <Link to="/categories">
                <ArrowLeft className="mr-2 h-4 w-4" />
                {t.product.backToProducts}
              </Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Get localized product name and description based on current language
  const getLocalizedField = (fieldBase: string): string => {
    const fieldMap: Record<string, keyof typeof product> = {
      name: language === 'ar' ? 'nameAr' : language === 'en' ? 'nameEn' : 'nameFr',
      description: language === 'ar' ? 'descriptionAr' : language === 'en' ? 'descriptionEn' : 'descriptionFr',
    };

    const field = fieldMap[fieldBase];
    const value = product[field];

    // Fallback to French if the localized field is empty
    if (!value || value === '') {
      return product[`${fieldBase}Fr` as keyof typeof product] as string || '';
    }

    return value as string;
  };

  const productName = getLocalizedField('name');
  const productDescription = getLocalizedField('description');
  const whatsappLink = generateWhatsAppLink(productName, product.price, product.id);

  // NOTE: View tracking disabled - causes crashes, needs debugging
  // TODO: Fix incrementViewCount to work without breaking the page

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden w-full">
      <Header />

      <main className="flex-1 py-8 overflow-hidden">
        <div className="container px-4">
          <Button asChild variant="ghost" className="mb-4 md:mb-6">
            <Link to="/categories">
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t.product.backToProducts}
            </Link>
          </Button>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
            {/* Product Image Gallery */}
            <ProductImageGallery
              images={product.images || []}
              productName={productName}
            />

            {/* Product Details */}
            <div className="w-full overflow-hidden">
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 break-words">{productName}</h1>

              <div className="flex items-center gap-2 mb-4 md:mb-6">
                <Badge variant={product.isAvailable ? 'default' : 'secondary'}>
                  {product.isAvailable ? t.product.inStock : t.product.outOfStock}
                </Badge>
              </div>

              <div className="mb-4 md:mb-6 break-words">
                {product.isFeatured && product.discountedPrice && product.originalPrice ? (
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl md:text-4xl font-bold text-red-600">
                        {product.discountedPrice.toLocaleString()} DH
                      </span>
                      <span className="text-xl md:text-2xl text-gray-400 line-through">
                        {product.originalPrice.toLocaleString()} DH
                      </span>
                    </div>
                    <span className="inline-block w-fit text-sm font-medium text-red-600 bg-red-50 px-2 py-1 rounded">
                      Économisez {(product.originalPrice - product.discountedPrice).toLocaleString()} DH
                    </span>
                  </div>
                ) : (
                  <div className="text-2xl md:text-3xl font-bold text-green-600">
                    {product.price.toLocaleString()} DH
                  </div>
                )}
              </div>

              <div className="prose max-w-none mb-6 md:mb-8">
                <h2 className="text-lg md:text-xl font-semibold mb-3 break-words">{t.product.description}</h2>
                <p className="text-gray-600 text-sm md:text-base break-words">{productDescription}</p>
              </div>

              {product.specifications && Object.keys(product.specifications).length > 0 && (
                <div className="mb-6 md:mb-8">
                  <h2 className="text-lg md:text-xl font-semibold mb-3 break-words">{t.product.specifications}</h2>
                  <Card className="overflow-hidden">
                    <CardContent className="p-3 md:p-4">
                      <dl className="space-y-2">
                        {Object.entries(product.specifications).map(([key, value]) => (
                          <div key={key} className="flex flex-col sm:flex-row sm:justify-between py-2 border-b last:border-0 gap-1">
                            <dt className="font-medium text-gray-700 text-sm md:text-base break-words">{key}</dt>
                            <dd className="text-gray-600 text-sm md:text-base break-words">{value}</dd>
                          </div>
                        ))}
                      </dl>
                    </CardContent>
                  </Card>
                </div>
              )}

              <div className="space-y-3 md:space-y-4">
                <Button
                  asChild
                  size="lg"
                  className="w-full bg-green-600 hover:bg-green-700"
                  disabled={!product.isAvailable}
                >
                  <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="mr-2 h-5 w-5" />
                    {t.product.contactWhatsApp}
                  </a>
                </Button>

                <Button asChild size="lg" variant="outline" className="w-full">
                  <Link to="/contact">{t.product.moreInfo}</Link>
                </Button>
              </div>
            </div>
          </div>

          {/* Related Products / Recommendations */}
          {products && products.length > 0 && (
            <div className="mt-12">
              <h2 className="text-2xl font-bold mb-6">
                {language === 'ar' ? 'منتجات مماثلة' : language === 'en' ? 'Similar Products' : 'Produits Similaires'}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {products
                  .filter(p => p.categoryId === product.categoryId && p.id !== product.id)
                  .slice(0, 4)
                  .map(relatedProduct => {
                    // Safely get localized name
                    let relatedProductName = relatedProduct.nameFr;
                    if (language === 'ar' && relatedProduct.nameAr) {
                      relatedProductName = relatedProduct.nameAr;
                    } else if (language === 'en' && relatedProduct.nameEn) {
                      relatedProductName = relatedProduct.nameEn;
                    }

                    return (
                      <Link key={relatedProduct.id} to={`/product/${relatedProduct.id}`}>
                        <Card className="hover:shadow-lg transition-shadow">
                          <div className="aspect-square overflow-hidden bg-gray-100">
                            <img
                              src={relatedProduct.images?.[0] || 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=800&q=80'}
                              alt={relatedProductName}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <CardContent className="p-3">
                            <h3 className="font-semibold text-sm mb-1 line-clamp-2">{relatedProductName}</h3>
                            <p className="text-green-600 font-bold">{relatedProduct.price.toLocaleString()} DH</p>
                          </CardContent>
                        </Card>
                      </Link>
                    );
                  })}
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}