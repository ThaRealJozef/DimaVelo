import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { useProducts } from '@/hooks/useProducts';
import { useLanguage } from '@/contexts/LanguageContext';
import { categories, subcategories } from '@/lib/data';
import { Product } from '@/lib/types';

type Language = 'fr' | 'en' | 'ar';

function getLocalizedField(item: any, field: string, lang: Language): string {
  const suffix = lang === 'ar' ? 'Ar' : lang === 'en' ? 'En' : 'Fr';
  return (item[`${field}${suffix}`] as string) || (item[`${field}Fr`] as string) || '';
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

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="font-bold text-lg md:text-xl mb-6 wrap-break-word text-gray-900 flex items-center gap-2">
      <span className="w-1 h-6 bg-green-600 rounded-full inline-block" />
      {children}
    </h2>
  );
}

function ProductPrice({ product }: { product: Product }) {
  if (product.discountedPrice && product.originalPrice) {
    const savings = product.originalPrice - product.discountedPrice;
    return (
      <div className="flex flex-col gap-0.5 md:gap-1">
        <div className="flex items-center gap-1.5 md:gap-2 flex-wrap">
          <span className="text-base md:text-xl font-bold text-red-600">{product.discountedPrice.toLocaleString()} DH</span>
          <span className="text-[10px] md:text-sm text-gray-400 line-through">{product.originalPrice.toLocaleString()} DH</span>
        </div>
        <span className="text-[10px] md:text-xs font-medium text-red-600 bg-red-50 px-1.5 py-0.5 rounded w-fit">
          -{savings.toLocaleString()} DH
        </span>
      </div>
    );
  }
  return <span className="text-base md:text-xl font-bold text-green-600 wrap-break-word">{product.price.toLocaleString()} DH</span>;
}

function ProductCard({ product, language, buttonText }: { product: Product; language: Language; buttonText: string }) {
  const name = getLocalizedField(product, 'name', language);
  const description = getLocalizedField(product, 'description', language);
  const defaultImg = 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=800&q=80';

  return (
    <Link to={`/product/${product.id}`} className="group">
      <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full flex flex-col">
        <div className="aspect-square overflow-hidden bg-gray-100 shrink-0">
          <img
            src={product.images?.[0] || defaultImg}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        <CardContent className="p-3 md:p-4 flex-1 flex flex-col">
          <h3 className="font-semibold text-sm md:text-lg mb-1 md:mb-2 line-clamp-1 wrap-break-word">{name}</h3>
          <p className="text-[10px] md:text-sm text-gray-600 mb-2 md:mb-3 line-clamp-2 wrap-break-word">{description}</p>
          <div className="flex flex-col gap-1 mt-auto">
            <ProductPrice product={product} />
          </div>
          <Button size="sm" className="bg-green-600 hover:bg-green-700 w-full sm:w-auto text-xs md:text-sm h-8 md:h-10">
            {buttonText}
          </Button>
        </CardContent>
      </Card>
    </Link>
  );
}

function CategoryCard({
  category,
  language,
  buttonText,
}: {
  category: typeof categories[0];
  language: Language;
  buttonText: string;
}) {
  const name = getLocalizedField(category, 'name', language);
  const description = getLocalizedField(category, 'description', language);
  const to = category.slug === 'promotions' ? '/promotions' : `/categories/${category.slug}`;

  return (
    <Link to={to} className="group">
      <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full flex flex-col">
        <div className="aspect-square overflow-hidden bg-gray-100 shrink-0">
          <img src={category.imageUrl} alt={name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        </div>
        <CardContent className="p-3 md:p-4 flex-1 flex flex-col">
          <h3 className="font-semibold text-base md:text-lg mb-2 wrap-break-word">{name}</h3>
          <p className="text-xs md:text-sm text-gray-600 mb-3 wrap-break-word flex-1">{description}</p>
          <Button size="sm" className="w-full bg-green-600 hover:bg-green-700 mt-auto">{buttonText}</Button>
        </CardContent>
      </Card>
    </Link>
  );
}

function Breadcrumb({ items, variant = 'default' }: { items: { to?: string; label: string }[], variant?: 'default' | 'light' }) {
  const textColor = variant === 'light' ? 'text-green-50' : 'text-gray-600';
  const activeColor = variant === 'light' ? 'text-white' : 'text-gray-900';
  const hoverColor = variant === 'light' ? 'hover:text-white' : 'hover:text-green-600';

  return (
    <div className={`flex items-center gap-2 text-xs md:text-sm ${textColor} mb-4 md:mb-6 overflow-x-auto whitespace-nowrap pb-2`}>
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-2">
          {i > 0 && <ChevronRight className="h-4 w-4 shrink-0" />}
          {item.to ? (
            <Link to={item.to} className={`${hoverColor} shrink-0`}>{item.label}</Link>
          ) : (
            <span className={`${activeColor} font-medium wrap-break-word`}>{item.label}</span>
          )}
        </span>
      ))}
    </div>
  );
}

export default function CategoriesPage() {
  const { t, language } = useLanguage();
  const { products, loading } = useProducts();
  const { categorySlug, subcategorySlug } = useParams();
  const navigate = useNavigate();
  const lang = language as Language;

  const [selectedSubcategory, setSelectedSubcategory] = useState('all');
  const [priceRange, setPriceRange] = useState([0, 50000]);

  const currentCategory = categories.find((cat) => cat.slug === categorySlug);
  const categorySubcategories = currentCategory
    ? subcategories.filter((sub) => sub.parentCategoryId === currentCategory.id)
    : [];

  useEffect(() => {
    if (categorySlug === 'promotions') {
      navigate('/promotions', { replace: true });
      return;
    }
    if (subcategorySlug) {
      const sub = categorySubcategories.find((s) => s.slug === subcategorySlug);
      setSelectedSubcategory(sub?.id || 'all');
    } else {
      setSelectedSubcategory('all');
    }
  }, [subcategorySlug, categorySlug, navigate, categorySubcategories]);

  const filteredProducts = products.filter((p) => {
    const catMatch = !currentCategory || p.categoryId === currentCategory.id;
    const subMatch = selectedSubcategory === 'all' || p.subcategoryId === selectedSubcategory;
    const priceMatch = p.price >= priceRange[0] && p.price <= priceRange[1];
    return catMatch && subMatch && priceMatch;
  });

  const handleSubcategoryClick = (subId: string) => {
    setSelectedSubcategory(subId);
    if (subId === 'all') {
      navigate(`/categories/${categorySlug}`);
    } else {
      const sub = categorySubcategories.find((s) => s.id === subId);
      if (sub) navigate(`/categories/${categorySlug}/${sub.slug}`);
    }
  };

  if (loading) return <LoadingState text={t.common?.loading || 'Chargement...'} />;

  if (!currentCategory) {
    return (
      <div className="min-h-screen flex flex-col w-full">
        <Header />
        <main className="flex-1 overflow-hidden">
          <div className="bg-linear-to-r from-green-600 to-green-800 py-8 md:py-12 mb-8">
            <div className="container px-4">
              <h1 className="text-3xl md:text-4xl font-bold mb-6 md:mb-8 wrap-break-word text-white">{t.categories.title}</h1>
              <p className="text-green-50 max-w-2xl text-lg">{t.categories.subtitle}</p>
            </div>
          </div>
          <div className="container px-4 pb-12">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
              {categories.map((cat) => (
                <CategoryCard key={cat.id} category={cat} language={lang} buttonText={t.categories.viewProducts} />
              ))}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col w-full">
      <Header />
      <main className="flex-1 overflow-hidden">
        <div className="bg-linear-to-r from-green-600 to-green-800 py-8 mb-8">
          <div className="container px-4">
            <Breadcrumb
              items={[
                { to: '/', label: t.nav.home },
                { to: '/categories', label: t.categories.title },
                { label: getLocalizedField(currentCategory, 'name', lang) },
              ]}
              variant="light"
            />
            <h1 className="text-3xl md:text-4xl font-bold wrap-break-word text-white">
              {getLocalizedField(currentCategory, 'name', lang)}
            </h1>
          </div>
        </div>

        <div className="container px-4 pb-12">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 md:gap-8">
            <div className="lg:col-span-1">
              <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm lg:sticky lg:top-24 overflow-hidden">
                <SectionHeading>{t.categories.filters}</SectionHeading>

                {categorySubcategories.length > 0 && (
                  <div className="mb-6">
                    <h3 className="font-medium mb-3 text-sm md:text-base wrap-break-word">{t.common.subcategory}</h3>
                    <div className="space-y-2">
                      <Button
                        variant={selectedSubcategory === 'all' ? 'default' : 'outline'}
                        className="w-full justify-start text-sm wrap-break-word"
                        onClick={() => handleSubcategoryClick('all')}
                      >
                        {t.categories.allSubcategories}
                      </Button>
                      {categorySubcategories.map((sub) => (
                        <Button
                          key={sub.id}
                          variant={selectedSubcategory === sub.id ? 'default' : 'outline'}
                          className="w-full justify-start text-sm wrap-break-word"
                          onClick={() => handleSubcategoryClick(sub.id)}
                        >
                          {getLocalizedField(sub, 'name', lang)}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <h3 className="font-medium mb-3 text-sm md:text-base wrap-break-word">{t.categories.priceRange}</h3>
                  <Slider min={0} max={50000} step={500} value={priceRange} onValueChange={setPriceRange} className="mb-4" />
                  <div className="flex justify-between text-xs md:text-sm text-gray-600">
                    <span>{priceRange[0].toLocaleString()} DH</span>
                    <span>{priceRange[1].toLocaleString()} DH</span>
                  </div>
                </div>

                <Button variant="outline" className="w-full mt-6 text-sm" onClick={() => navigate('/categories')}>
                  {t.common.backToCategories}
                </Button>
              </div>
            </div>

            <div className="lg:col-span-3">
              <div className="mb-4 text-sm md:text-base text-gray-600 wrap-break-word">
                {filteredProducts.length} {t.categories.productsFound}
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 md:gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} language={lang} buttonText={t.common.viewDetails} />
                ))}
              </div>

              {filteredProducts.length === 0 && (
                <div className="text-center py-12 px-4">
                  <p className="text-gray-600 text-base md:text-lg wrap-break-word">{t.categories.noProducts}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}