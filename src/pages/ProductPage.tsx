import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, Plus, Minus } from 'lucide-react';
import { toast } from 'sonner';

import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { DeliveryInfo } from '@/components/DeliveryInfo';
import { ProductImageGallery } from '@/components/ProductImageGallery';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { useProducts } from '@/hooks/useProducts';
import { useCart } from '@/contexts/CartContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Product } from '@/lib/types';

type Language = 'fr' | 'en' | 'ar';

interface LocalizedItem {
  nameFr: string;
  nameEn?: string;
  nameAr?: string;
  descriptionFr: string;
  descriptionEn?: string;
  descriptionAr?: string;
}

function getLocalizedText(item: LocalizedItem, field: 'name' | 'description', language: Language): string {
  const langKey = `${field}${language === 'ar' ? 'Ar' : language === 'en' ? 'En' : 'Fr'}` as keyof LocalizedItem;
  const frKey = `${field}Fr` as keyof LocalizedItem;
  return (item[langKey] as string) || (item[frKey] as string) || '';
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-lg md:text-xl font-bold mb-4 break-words text-gray-900 flex items-center gap-2">
      <span className="w-1 h-6 bg-green-600 rounded-full inline-block" />
      {children}
    </h2>
  );
}

function ProductPrice({ product }: { product: Product }) {
  if (product.discountedPrice && product.originalPrice) {
    const savings = product.originalPrice - product.discountedPrice;
    return (
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
          Économisez {savings.toLocaleString()} DH
        </span>
      </div>
    );
  }

  return (
    <div className="text-2xl md:text-3xl font-bold text-green-600">
      {product.price.toLocaleString()} DH
    </div>
  );
}

function RelatedProductCard({
  product,
  currentCategoryId,
  language,
  viewDetailsText,
}: {
  product: Product;
  currentCategoryId: string;
  language: Language;
  viewDetailsText: string;
}) {
  const name = getLocalizedText(product, 'name', language);
  const description = getLocalizedText(product, 'description', language);
  const defaultImg = 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=800&q=80';

  const categoryBadges: Record<string, { color: string; labels: Record<Language, string> }> = {
    '2': { color: 'bg-blue-600', labels: { fr: 'Accessoire', en: 'Accessory', ar: 'إكسسوار' } },
    '5': { color: 'bg-orange-500', labels: { fr: 'Nutrition', en: 'Nutrition', ar: 'تغذية' } },
  };

  const badge = categoryBadges[product.categoryId];
  const showBadge = badge && product.categoryId !== currentCategoryId;

  return (
    <CarouselItem className="pl-2 md:pl-4 basis-1/2 md:basis-1/3 lg:basis-1/4">
      <Link to={`/product/${product.id}`} className="group">
        <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full flex flex-col">
          <div className="aspect-square overflow-hidden bg-gray-100 flex-shrink-0 relative">
            <img
              src={product.images?.[0] || defaultImg}
              alt={name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            {showBadge && (
              <Badge className={`absolute top-2 right-2 ${badge.color}`}>
                {badge.labels[language]}
              </Badge>
            )}
          </div>
          <CardContent className="p-3 md:p-4 flex-1 flex flex-col">
            <h3 className="font-semibold text-base md:text-lg mb-2 break-words">{name}</h3>
            <p className="text-xs md:text-sm text-gray-600 mb-3 line-clamp-2 break-words">{description}</p>
            <div className="flex flex-col gap-1 mt-auto">
              {product.discountedPrice && product.originalPrice ? (
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-lg md:text-xl font-bold text-red-600">
                      {product.discountedPrice.toLocaleString()} DH
                    </span>
                    <span className="text-sm text-gray-400 line-through">
                      {product.originalPrice.toLocaleString()} DH
                    </span>
                  </div>
                  <span className="text-xs font-medium text-red-600 bg-red-50 px-2 py-0.5 rounded w-fit">
                    {(product.originalPrice - product.discountedPrice).toLocaleString()} DH{' '}
                    {{ fr: "d'économie", en: 'off', ar: 'توفير' }[language]}
                  </span>
                </div>
              ) : (
                <span className="text-lg md:text-xl font-bold text-green-600 break-words">
                  {product.price.toLocaleString()} DH
                </span>
              )}
            </div>
            <Button size="sm" className="bg-green-600 hover:bg-green-700 w-full sm:w-auto mt-3">
              {viewDetailsText}
            </Button>
          </CardContent>
        </Card>
      </Link>
    </CarouselItem>
  );
}

function getRecommendations(products: Product[], currentProduct: Product): Product[] {
  const similar = products
    .filter((p) => p.categoryId === currentProduct.categoryId && p.id !== currentProduct.id)
    .slice(0, 4);

  const accessories = currentProduct.categoryId !== '2'
    ? products.filter((p) => p.categoryId === '2').slice(0, 2)
    : [];

  const nutrition = currentProduct.categoryId !== '5'
    ? products.filter((p) => p.categoryId === '5').slice(0, 2)
    : [];

  const recommendations = [...similar, ...accessories, ...nutrition];

  if (recommendations.length < 4) {
    const featured = products
      .filter((p) => p.isFeatured && p.id !== currentProduct.id && !recommendations.some((r) => r.id === p.id))
      .slice(0, 4 - recommendations.length);
    recommendations.push(...featured);
  }

  return recommendations;
}

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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600" />
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

  const productName = getLocalizedText(product, 'name', language as Language);
  const productDescription = getLocalizedText(product, 'description', language as Language);
  const recommendations = getRecommendations(products, product);

  const relatedTitle = { fr: 'Vous pourriez aussi aimer', en: 'You Might Also Like', ar: 'منتجات قد تعجبك' };

  const handleAddToCart = () => {
    addToCart({
      productId: product.id,
      categoryId: product.categoryId,
      name: productName,
      price: product.price,
      image: product.images?.[0] || '',
      discountedPrice: product.discountedPrice,
      originalPrice: product.originalPrice,
    }, quantity);
    toast.success(`${productName} ${t.cart.addToCart}`);
  };

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
            <ProductImageGallery images={product.images || []} productName={productName} />

            <div className="w-full overflow-hidden">
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 break-words">{productName}</h1>

              <div className="flex items-center gap-2 mb-4 md:mb-6">
                <Badge variant={product.isAvailable ? 'default' : 'secondary'}>
                  {product.isAvailable ? t.product.inStock : t.product.outOfStock}
                </Badge>
              </div>

              <div className="mb-4 md:mb-6 break-words">
                <ProductPrice product={product} />
              </div>

              <div className="prose max-w-none mb-6 md:mb-8">
                <SectionHeading>{t.product.description}</SectionHeading>
                <p className="text-gray-600 text-sm md:text-base break-words">{productDescription}</p>
              </div>

              {product.specifications && Object.keys(product.specifications).length > 0 && (
                <div className="mb-6 md:mb-8">
                  <SectionHeading>{t.product.specifications}</SectionHeading>
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
                    onClick={handleAddToCart}
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

          {recommendations.length > 0 && (
            <div className="mt-12">
              <h2 className="text-2xl font-bold mb-6">{relatedTitle[language as Language]}</h2>

              <Carousel opts={{ align: 'start', loop: true }} className="w-full">
                <CarouselContent className="-ml-2 md:-ml-4">
                  {recommendations.map((relatedProduct) => (
                    <RelatedProductCard
                      key={relatedProduct.id}
                      product={relatedProduct}
                      currentCategoryId={product.categoryId}
                      language={language as Language}
                      viewDetailsText={t.common.viewDetails}
                    />
                  ))}
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
