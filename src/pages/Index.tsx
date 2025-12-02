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
import { CategoriesCarousel } from '@/components/CategoriesCarousel';
import { FeaturedProductsGrid } from '@/components/FeaturedProductsGrid';
import { DeliveryInfo } from '@/components/DeliveryInfo';

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

  // Get featured products (filter by isFeatured flag)
  const featuredProducts = products.filter(p => p.isFeatured);

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
              <p className="text-lg md:text-xl mb-6 md:mb-8 break-words opacity-95">
                {t.home.hero.subtitle}
              </p>
              <div className="flex flex-col sm:flex-row gap-3 md:gap-4 mb-6">
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

              <div className="flex items-center gap-2 text-sm md:text-base opacity-90 hover:opacity-100 transition-opacity">
                <Phone className="h-4 w-4" />
                <Link to="/contact" className="hover:underline font-medium">
                  {language === 'ar' ? 'تحتاج مساعدة؟ اتصل بنا' : language === 'en' ? 'Need help? Contact us' : 'Besoin d\'aide ? Contactez-nous'}
                </Link>
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

            <CategoriesCarousel categories={categories} getCategoryName={getCategoryName} getCategoryDescription={getCategoryDescription} />
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

            <FeaturedProductsGrid products={featuredProducts} />

            <div className="text-center mt-6 md:mt-8">
              <Button asChild size="lg" variant="outline" className="w-full sm:w-auto">
                <Link to="/categories">{t.common.viewAll}</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Delivery Info Section */}
        <section className="py-8 md:py-12 bg-white overflow-hidden">
          <div className="container px-4">
            <DeliveryInfo variant="full" />
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