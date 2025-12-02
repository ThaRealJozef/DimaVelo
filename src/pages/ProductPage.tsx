import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { useProducts } from '@/hooks/useProducts';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, ShoppingCart, Plus, Minus } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { ProductImageGallery } from '@/components/ProductImageGallery';
import { productService } from '@/services/productService';
import { toast } from 'sonner';
import { DeliveryInfo } from '@/components/DeliveryInfo';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export default function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const { t, language } = useLanguage();
  const { products, loading } = useProducts();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);

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
      return (product[`${fieldBase}Fr` as keyof typeof product] as string) || '';
    }

    return value as string;
  };

  const productName = getLocalizedField('name');
  const productDescription = getLocalizedField('description');

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
                {product.discountedPrice && product.originalPrice ? (
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
                <h2 className="text-lg md:text-xl font-bold mb-4 break-words text-gray-900 flex items-center gap-2">
                  <span className="w-1 h-6 bg-green-600 rounded-full inline-block"></span>
                  {t.product.description}
                </h2>
                <p className="text-gray-600 text-sm md:text-base break-words">{productDescription}</p>
              </div>

              {product.specifications && Object.keys(product.specifications).length > 0 && (
                <div className="mb-6 md:mb-8">
                  <h2 className="text-lg md:text-xl font-bold mb-4 break-words text-gray-900 flex items-center gap-2">
                    <span className="w-1 h-6 bg-green-600 rounded-full inline-block"></span>
                    {t.product.specifications}
                  </h2>
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
                {/* Quantity Selector and Add to Cart */}
                <div className="space-y-3">
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-medium">{t.cart.quantity}:</span>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        disabled={!product.isAvailable}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-12 text-center font-medium">{quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setQuantity(quantity + 1)}
                        disabled={!product.isAvailable}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <Button
                    size="lg"
                    className="w-full bg-green-600 hover:bg-green-700"
                    disabled={!product.isAvailable}
                    onClick={() => {
                      addToCart({
                        productId: product.id,
                        name: productName,
                        price: product.price,
                        image: product.images?.[0] || '',
                        discountedPrice: product.discountedPrice,
                        originalPrice: product.originalPrice,
                      }, quantity);
                      toast.success(`${productName} ${t.cart.addToCart}`);
                    }}
                  >
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    {t.cart.addToCart}
                  </Button>
                </div>

                <Button asChild size="lg" variant="outline" className="w-full">
                  <Link to="/contact">{t.product.moreInfo}</Link>
                </Button>

                <div className="pt-4">
                  <DeliveryInfo variant="compact" />
                </div>
              </div>
            </div>
          </div>

          {/* Related Products / Recommendations */}
          {products && products.length > 0 && (
            <div className="mt-12">
              <h2 className="text-2xl font-bold mb-6">
                {language === 'ar' ? 'منتجات قد تعجبك' : language === 'en' ? 'You Might Also Like' : 'Vous pourriez aussi aimer'}
              </h2>

              <Carousel
                opts={{
                  align: "start",
                  loop: true,
                }}
                className="w-full"
              >
                <CarouselContent className="-ml-2 md:-ml-4">
                  {/* Smart Recommendations Logic */}
                  {(() => {
                    // 1. Similar Products (Same Category) - Max 4
                    const similarProducts = products
                      .filter(p => p.categoryId === product.categoryId && p.id !== product.id)
                      .slice(0, 4);

                    // 2. Accessories (Category ID: 2) - Max 2
                    // Don't include if current product is an accessory
                    const accessories = product.categoryId !== '2'
                      ? products.filter(p => p.categoryId === '2').slice(0, 2)
                      : [];

                    // 3. Nutrition (Category ID: 5) - Max 2
                    // Don't include if current product is nutrition
                    const nutrition = product.categoryId !== '5'
                      ? products.filter(p => p.categoryId === '5').slice(0, 2)
                      : [];

                    // Combine all recommendations
                    const recommendations = [...similarProducts, ...accessories, ...nutrition];

                    // If we don't have enough, fill with other featured products
                    if (recommendations.length < 4) {
                      const otherFeatured = products
                        .filter(p => p.isFeatured && p.id !== product.id && !recommendations.find(r => r.id === p.id))
                        .slice(0, 4 - recommendations.length);
                      recommendations.push(...otherFeatured);
                    }

                    return recommendations.map((relatedProduct) => {
                      // Safely get localized name and description
                      let relatedProductName = relatedProduct.nameFr;
                      let relatedProductDescription = relatedProduct.descriptionFr;

                      if (language === 'ar' && relatedProduct.nameAr) {
                        relatedProductName = relatedProduct.nameAr;
                        relatedProductDescription = relatedProduct.descriptionAr || relatedProduct.descriptionFr;
                      } else if (language === 'en' && relatedProduct.nameEn) {
                        relatedProductName = relatedProduct.nameEn;
                        relatedProductDescription = relatedProduct.descriptionEn || relatedProduct.descriptionFr;
                      }

                      return (
                        <CarouselItem key={relatedProduct.id} className="pl-2 md:pl-4 basis-1/2 md:basis-1/3 lg:basis-1/4">
                          <Link to={`/product/${relatedProduct.id}`} className="group">
                            <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full flex flex-col">
                              <div className="aspect-square overflow-hidden bg-gray-100 flex-shrink-0 relative">
                                <img
                                  src={relatedProduct.images?.[0] || 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=800&q=80'}
                                  alt={relatedProductName}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                                {relatedProduct.categoryId === '2' && product.categoryId !== '2' && (
                                  <Badge className="absolute top-2 right-2 bg-blue-600">
                                    {language === 'ar' ? 'إكسسوار' : language === 'en' ? 'Accessory' : 'Accessoire'}
                                  </Badge>
                                )}
                                {relatedProduct.categoryId === '5' && product.categoryId !== '5' && (
                                  <Badge className="absolute top-2 right-2 bg-orange-500">
                                    {language === 'ar' ? 'تغذية' : language === 'en' ? 'Nutrition' : 'Nutrition'}
                                  </Badge>
                                )}
                              </div>
                              <CardContent className="p-3 md:p-4 flex-1 flex flex-col">
                                <h3 className="font-semibold text-base md:text-lg mb-2 break-words">{relatedProductName}</h3>
                                <p className="text-xs md:text-sm text-gray-600 mb-3 line-clamp-2 break-words">
                                  {relatedProductDescription}
                                </p>
                                <div className="flex flex-col gap-1 mt-auto">
                                  {relatedProduct.discountedPrice && relatedProduct.originalPrice ? (
                                    <div className="flex flex-col gap-1">
                                      <div className="flex items-center gap-2 flex-wrap">
                                        <span className="text-lg md:text-xl font-bold text-red-600">
                                          {relatedProduct.discountedPrice.toLocaleString()} DH
                                        </span>
                                        <span className="text-sm text-gray-400 line-through">
                                          {relatedProduct.originalPrice.toLocaleString()} DH
                                        </span>
                                      </div>
                                      <span className="text-xs font-medium text-red-600 bg-red-50 px-2 py-0.5 rounded w-fit">
                                        {(relatedProduct.originalPrice - relatedProduct.discountedPrice).toLocaleString()} DH {language === 'ar' ? 'توفير' : language === 'en' ? 'off' : "d'économie"}
                                      </span>
                                    </div>
                                  ) : (
                                    <span className="text-lg md:text-xl font-bold text-green-600 break-words">
                                      {relatedProduct.price.toLocaleString()} DH
                                    </span>
                                  )}
                                </div>
                                <Button size="sm" className="bg-green-600 hover:bg-green-700 w-full sm:w-auto mt-3">
                                  {t.common.viewDetails}
                                </Button>
                              </CardContent>
                            </Card>
                          </Link>
                        </CarouselItem>
                      );
                    });
                  })()}
                </CarouselContent>
                <CarouselPrevious className="left-2 md:-left-12" />
                <CarouselNext className="right-2 md:-right-12" />
              </Carousel>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
