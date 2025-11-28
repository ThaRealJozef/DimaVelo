import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { PWAInstallPrompt } from '@/components/PWAInstallPrompt';
import { Link } from 'react-router-dom';
import { categories } from '@/lib/data';
import { useProducts } from '@/hooks/useProducts';
import { useLanguage } from '@/contexts/LanguageContext';
import { ArrowRight, Wrench, ShoppingCart, Phone } from 'lucide-react';

export default function Index() {
  const { t, language } = useLanguage();
  const { products, loading } = useProducts();

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col overflow-x-hidden">
        <Header />
        <main className="flex-1 container py-16 flex items-center justify-center px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-gray-600">{t.common?.loading || 'Chargement...'}</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Get featured products (filter by isFeatured flag, max 6)
  const featuredProducts = products.filter(p => p.isFeatured).slice(0, 6);

  // Get category name based on language
  const getCategoryName = (category: typeof categories[0]) => {
    switch (language) {
      case 'en':
        return category.nameEn;
      case 'ar':
        return category.nameAr;
      default:
        return category.nameFr;
    }
  };

  const getCategoryDescription = (category: typeof categories[0]) => {
    switch (language) {
      case 'en':
        return category.descriptionEn;
      case 'ar':
        return category.descriptionAr;
      default:
        return category.descriptionFr;
    }
  };

  // Get localized product name
  const getProductName = (product: typeof products[0]) => {
    switch (language) {
      case 'en':
        return product.nameEn || product.nameFr;
      case 'ar':
        return product.nameAr || product.nameFr;
      default:
        return product.nameFr;
    }
  };

  // Get localized product description
  const getProductDescription = (product: typeof products[0]) => {
    switch (language) {
      case 'en':
        return product.descriptionEn || product.descriptionFr;
      case 'ar':
        return product.descriptionAr || product.descriptionFr;
      default:
        return product.descriptionFr;
    }
  };

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden w-full">
      <Header />

      <main className="flex-1 w-full">
        {/* Hero Section */}
        <section className="relative bg-green-600 text-white py-12 md:py-20 overflow-hidden">
          <div className="container px-4">
            <div className="max-w-3xl">
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6 break-words">
                {t.home.hero.title}
              </h1>
              <p className="text-lg md:text-xl mb-6 md:mb-8 break-words">
                {t.home.hero.subtitle}
              </p>
              <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
                <Button asChild size="lg" variant="secondary" className="w-full sm:w-auto">
                  <Link to="/categories">
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    {t.home.hero.cta}
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="w-full sm:w-auto bg-transparent border-white text-white hover:bg-white hover:text-green-600">
                  <Link to="/services">
                    <Wrench className="mr-2 h-5 w-5" />
                    {t.home.hero.services}
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="py-12 md:py-16 bg-white overflow-hidden">
          <div className="container px-4">
            <div className="text-center mb-8 md:mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3 md:mb-4 break-words px-4">
                {t.home.categories.title}
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto break-words px-4">
                {t.home.categories.subtitle}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  to={`/categories/${category.slug}`}
                  className="group"
                >
                  <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="aspect-square overflow-hidden bg-gray-100">
                      <img
                        src={category.imageUrl}
                        alt={getCategoryName(category)}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <CardContent className="p-3 md:p-4">
                      <h3 className="font-semibold text-base md:text-lg mb-2 break-words">{getCategoryName(category)}</h3>
                      <p className="text-xs md:text-sm text-gray-600 break-words">{getCategoryDescription(category)}</p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Products Section */}
        <section className="py-12 md:py-16 bg-gray-50 overflow-hidden">
          <div className="container px-4">
            <div className="text-center mb-8 md:mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3 md:mb-4 break-words px-4">
                {t.home.featured.title}
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto break-words px-4">
                {t.home.featured.subtitle}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
              {featuredProducts.map((product) => (
                <Link
                  key={product.id}
                  to={`/product/${product.id}`}
                  className="group"
                >
                  <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full">
                    <div className="aspect-square overflow-hidden bg-gray-100">
                      <img
                        src={product.images?.[0] || 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=800&q=80'}
                        alt={getProductName(product)}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <CardContent className="p-3 md:p-4">
                      <h3 className="font-semibold text-base md:text-lg mb-2 break-words">{getProductName(product)}</h3>
                      <p className="text-xs md:text-sm text-gray-600 mb-3 line-clamp-2 break-words">
                        {getProductDescription(product)}
                      </p>
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                        {product.discountedPrice && product.originalPrice ? (
                          <div className="flex flex-col">
                            <div className="flex items-center gap-2">
                              <span className="text-lg md:text-xl font-bold text-red-600 break-words">
                                {product.discountedPrice.toLocaleString()} DH
                              </span>
                              <span className="text-sm text-gray-400 line-through">
                                {product.originalPrice.toLocaleString()} DH
                              </span>
                            </div>
                          </div>
                        ) : (
                          <span className="text-lg md:text-xl font-bold text-green-600 break-words">
                            {product.price.toLocaleString()} DH
                          </span>
                        )}
                        <Button size="sm" className="bg-green-600 hover:bg-green-700 w-full sm:w-auto">
                          {t.common.viewDetails}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>

            <div className="text-center">
              <Button asChild size="lg" variant="outline" className="w-full sm:w-auto">
                <Link to="/categories">
                  {t.common.viewAll}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Why Choose Us Section */}
        <section className="py-12 md:py-16 bg-white overflow-hidden">
          <div className="container px-4">
            <div className="text-center mb-8 md:mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3 md:mb-4 break-words px-4">
                {t.home.whyChoose.title}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              <div className="text-center px-4">
                <div className="w-14 h-14 md:w-16 md:h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ShoppingCart className="h-7 w-7 md:h-8 md:w-8 text-green-600" />
                </div>
                <h3 className="font-semibold text-lg md:text-xl mb-2 break-words">{t.home.whyChoose.quality.title}</h3>
                <p className="text-gray-600 text-sm md:text-base break-words">{t.home.whyChoose.quality.description}</p>
              </div>

              <div className="text-center px-4">
                <div className="w-14 h-14 md:w-16 md:h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Wrench className="h-7 w-7 md:h-8 md:w-8 text-green-600" />
                </div>
                <h3 className="font-semibold text-lg md:text-xl mb-2 break-words">{t.home.whyChoose.service.title}</h3>
                <p className="text-gray-600 text-sm md:text-base break-words">{t.home.whyChoose.service.description}</p>
              </div>

              <div className="text-center px-4">
                <div className="w-14 h-14 md:w-16 md:h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Phone className="h-7 w-7 md:h-8 md:w-8 text-green-600" />
                </div>
                <h3 className="font-semibold text-lg md:text-xl mb-2 break-words">{t.home.whyChoose.support.title}</h3>
                <p className="text-gray-600 text-sm md:text-base break-words">{t.home.whyChoose.support.description}</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-12 md:py-16 bg-green-600 text-white overflow-hidden">
          <div className="container text-center px-4">
            <h2 className="text-2xl md:text-3xl font-bold mb-3 md:mb-4 break-words">
              {t.home.cta.title}
            </h2>
            <p className="text-lg md:text-xl mb-6 md:mb-8 text-green-50 break-words">
              {t.home.cta.subtitle}
            </p>
            <Button asChild size="lg" variant="secondary" className="w-full sm:w-auto">
              <Link to="/contact">
                {t.home.cta.button}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </section>
      </main>

      {/* PWA Install Prompt - Only on home page */}
      <PWAInstallPrompt />

      <Footer />
    </div>
  );
}