import { Link } from 'react-router-dom';
import { ArrowRight, Wrench, ShoppingCart, Phone } from 'lucide-react';

import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { MagneticButton } from '@/components/ui/MagneticButton';
import { PWAInstallPrompt } from '@/components/PWAInstallPrompt';
import { CategoriesCarousel } from '@/components/CategoriesCarousel';
import { FeaturedProductsGrid } from '@/components/FeaturedProductsGrid';
import { DeliveryInfo } from '@/components/DeliveryInfo';
import { Testimonials } from '@/components/Testimonials';
import { FadeIn, StaggerContainer, StaggerItem } from '@/components/FadeIn';
import { useProducts } from '@/hooks/useProducts';
import { useLanguage } from '@/contexts/LanguageContext';
import { categories } from '@/lib/data';

type Language = 'fr' | 'en' | 'ar';

interface LocalizedItem {
  nameFr: string;
  nameEn: string;
  nameAr: string;
  descriptionFr: string;
  descriptionEn: string;
  descriptionAr: string;
}

function getLocalizedText<T extends LocalizedItem>(item: T, field: 'name' | 'description', lang: Language): string {
  const keys = {
    name: { fr: 'nameFr', en: 'nameEn', ar: 'nameAr' },
    description: { fr: 'descriptionFr', en: 'descriptionEn', ar: 'descriptionAr' },
  } as const;
  return item[keys[field][lang] as keyof T] as string || item[keys[field].fr as keyof T] as string;
}

function SectionTitle({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="text-center mb-8 md:mb-12">
      <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3 md:mb-4 wrap-break-word px-4">{title}</h2>
      {subtitle && <p className="text-gray-600 max-w-2xl mx-auto wrap-break-word px-4">{subtitle}</p>}
    </div>
  );
}

function FeatureCard({ icon: Icon, title, description }: { icon: typeof ShoppingCart; title: string; description: string }) {
  return (
    <div className="text-center px-4">
      <div className="w-14 h-14 md:w-16 md:h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <Icon className="h-7 w-7 md:h-8 md:w-8 text-green-600" />
      </div>
      <h3 className="font-semibold text-lg md:text-xl mb-2 wrap-break-word">{title}</h3>
      <p className="text-gray-600 text-sm md:text-base wrap-break-word">{description}</p>
    </div>
  );
}

function LoadingState({ text }: { text: string }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container py-16 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4" />
          <p className="text-gray-600">{text}</p>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default function Index() {
  const { t, language } = useLanguage();
  const { products, loading } = useProducts();

  if (loading) return <LoadingState text={t.common?.loading || 'Chargement...'} />;

  const featuredProducts = products.filter((p) => p.isFeatured);
  const lang = language as Language;

  const helpTexts: Record<Language, string> = {
    fr: "Besoin d'aide ? Contactez-nous",
    en: 'Need help? Contact us',
    ar: 'تحتاج مساعدة؟ اتصل بنا',
  };

  const features = [
    { icon: ShoppingCart, title: t.home.whyChoose.quality.title, description: t.home.whyChoose.quality.description },
    { icon: Wrench, title: t.home.whyChoose.service.title, description: t.home.whyChoose.service.description },
    { icon: Phone, title: t.home.whyChoose.support.title, description: t.home.whyChoose.support.description },
  ];

  return (
    <div className="min-h-screen flex flex-col w-full">
      <Header />

      <main className="flex-1 w-full">
        {/* Hero */}
        <section className="relative bg-green-600 text-white py-12 md:py-20 overflow-hidden">
          <div className="container px-4">
            <FadeIn direction="up" delay={0.1}>
              <div className="max-w-3xl">
                <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6 wrap-break-word">
                  {t.home.hero.title}
                </h1>
                <p className="text-lg md:text-xl mb-6 md:mb-8 wrap-break-word opacity-95">
                  {t.home.hero.subtitle}
                </p>
                <div className="flex flex-col sm:flex-row gap-3 md:gap-4 mb-6">
                  <MagneticButton strength={0.2}>
                    <Button asChild size="lg" variant="outline" className="w-full sm:w-auto bg-transparent border-white text-white hover:bg-white hover:text-green-600">
                      <Link to="/categories">
                        <ShoppingCart className="mr-2 h-5 w-5" />
                        {t.home.hero.cta}
                      </Link>
                    </Button>
                  </MagneticButton>
                  <MagneticButton strength={0.2}>
                    <Button asChild size="lg" variant="outline" className="w-full sm:w-auto bg-transparent border-white text-white hover:bg-white hover:text-green-600">
                      <Link to="/services">
                        <Wrench className="mr-2 h-5 w-5" />
                        {t.home.hero.services}
                      </Link>
                    </Button>
                  </MagneticButton>
                </div>
                <div className="flex items-center gap-2 text-sm md:text-base opacity-90 hover:opacity-100 transition-opacity">
                  <Phone className="h-4 w-4" />
                  <Link to="/contact" className="hover:underline font-medium">{helpTexts[lang]}</Link>
                </div>
              </div>
            </FadeIn>
          </div>
        </section>

        {/* Categories */}
        <section className="py-12 md:py-16 bg-white overflow-hidden">
          <div className="container px-4">
            <FadeIn>
              <SectionTitle title={t.home.categories.title} subtitle={t.home.categories.subtitle} />
            </FadeIn>
            <FadeIn delay={0.2}>
              <CategoriesCarousel
                categories={categories}
                getCategoryName={(cat) => getLocalizedText(cat, 'name', lang)}
                getCategoryDescription={(cat) => getLocalizedText(cat, 'description', lang)}
              />
            </FadeIn>
          </div>
        </section>

        {/* Featured Products */}
        <section className="py-12 md:py-16 bg-gray-50 overflow-hidden">
          <div className="container px-4">
            <FadeIn>
              <SectionTitle title={t.home.featured.title} subtitle={t.home.featured.subtitle} />
            </FadeIn>
            <FadeIn delay={0.2}>
              <FeaturedProductsGrid products={featuredProducts} />
            </FadeIn>
            <FadeIn delay={0.4}>
              <div className="text-center mt-6 md:mt-8">
                <Button asChild size="lg" variant="outline" className="w-full sm:w-auto">
                  <Link to="/categories">{t.common.viewAll}</Link>
                </Button>
              </div>
            </FadeIn>
          </div>
        </section>

        {/* Testimonials */}
        <Testimonials />

        {/* Delivery */}
        <section className="py-8 md:py-12 bg-white overflow-hidden">
          <div className="container px-4">
            <DeliveryInfo variant="full" />
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-12 md:py-16 bg-white overflow-hidden">
          <div className="container px-4">
            <FadeIn>
              <SectionTitle title={t.home.whyChoose.title} />
            </FadeIn>
            <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              {features.map((feature, i) => (
                <StaggerItem key={i}>
                  <FeatureCard {...feature} />
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </section>

        {/* CTA */}
        <section className="py-12 md:py-16 bg-green-600 text-white overflow-hidden">
          <div className="container text-center px-4">
            <FadeIn>
              <h2 className="text-2xl md:text-3xl font-bold mb-3 md:mb-4 wrap-break-word">{t.home.cta.title}</h2>
              <p className="text-lg md:text-xl mb-6 md:mb-8 text-green-50 wrap-break-word">{t.home.cta.subtitle}</p>
              <MagneticButton strength={0.2} className="inline-block">
                <Button asChild size="lg" variant="secondary" className="w-full sm:w-auto">
                  <Link to="/contact">
                    {t.home.cta.button}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </MagneticButton>
            </FadeIn>
          </div>
        </section>
      </main>

      <PWAInstallPrompt />
      <Footer />
    </div>
  );
}