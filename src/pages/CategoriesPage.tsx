import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { categories, subcategories } from '@/lib/data';
import { useProducts } from '@/hooks/useProducts';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { ChevronRight } from 'lucide-react';

export default function CategoriesPage() {
  const { t, language } = useLanguage();
  const { products, loading } = useProducts();
  const { categorySlug, subcategorySlug } = useParams();
  const navigate = useNavigate();

  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<number[]>([0, 50000]);

  // Find current category
  const currentCategory = categories.find(cat => cat.slug === categorySlug);

  // Get subcategories for current category
  const categorySubcategories = currentCategory
    ? subcategories.filter(sub => sub.parentCategoryId === currentCategory.id)
    : [];

  // Set selected subcategory from URL
  useEffect(() => {
    if (categorySlug === 'promotions') {
      navigate('/promotions', { replace: true });
      return;
    }

    if (subcategorySlug) {
      const sub = categorySubcategories.find(s => s.slug === subcategorySlug);
      if (sub) {
        setSelectedSubcategory(sub.id);
      }
    } else {
      setSelectedSubcategory('all');
    }
  }, [subcategorySlug, categorySlug, navigate]);

  // Filter products
  const filteredProducts = products.filter((product) => {
    const categoryMatch = !currentCategory || product.categoryId === currentCategory.id;
    const subcategoryMatch = selectedSubcategory === 'all' || product.subcategoryId === selectedSubcategory;
    const priceMatch = product.price >= priceRange[0] && product.price <= priceRange[1];
    return categoryMatch && subcategoryMatch && priceMatch;
  });

  // Get name based on language
  const getCategoryName = (category: typeof categories[0]) => {
    switch (language) {
      case 'en': return category.nameEn;
      case 'ar': return category.nameAr;
      default: return category.nameFr;
    }
  };

  const getSubcategoryName = (subcategory: typeof subcategories[0]) => {
    switch (language) {
      case 'en': return subcategory.nameEn;
      case 'ar': return subcategory.nameAr;
      default: return subcategory.nameFr;
    }
  };

  const getProductName = (product: typeof products[0]) => {
    switch (language) {
      case 'en': return product.nameEn || product.nameFr;
      case 'ar': return product.nameAr || product.nameFr;
      default: return product.nameFr;
    }
  };

  const getProductDescription = (product: typeof products[0]) => {
    switch (language) {
      case 'en': return product.descriptionEn || product.descriptionFr;
      case 'ar': return product.descriptionAr || product.descriptionFr;
      default: return product.descriptionFr;
    }
  };

  const handleSubcategoryClick = (subId: string) => {
    setSelectedSubcategory(subId);
    if (subId === 'all') {
      navigate(`/categories/${categorySlug}`);
    } else {
      const sub = categorySubcategories.find(s => s.id === subId);
      if (sub) {
        navigate(`/categories/${categorySlug}/${sub.slug}`);
      }
    }
  };

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

  // If no category selected, show all categories
  if (!currentCategory) {
    return (
      <div className="min-h-screen flex flex-col overflow-x-hidden w-full">
        <Header />

        <main className="flex-1 py-8 overflow-hidden">
          <div className="container px-4">
            <h1 className="text-3xl md:text-4xl font-bold mb-6 md:mb-8 break-words">{t.categories.title}</h1>
            <p className="text-gray-600 mb-6 md:mb-8 break-words">{t.categories.subtitle}</p>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  to={category.slug === 'promotions' ? '/promotions' : `/categories/${category.slug}`}
                  className="group"
                >
                  <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full flex flex-col">
                    <div className="aspect-square overflow-hidden bg-gray-100 flex-shrink-0">
                      <img
                        src={category.imageUrl}
                        alt={getCategoryName(category)}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <CardContent className="p-3 md:p-4 flex-1 flex flex-col">
                      <h3 className="font-semibold text-base md:text-lg mb-2 break-words">{getCategoryName(category)}</h3>
                      <p className="text-xs md:text-sm text-gray-600 mb-3 break-words flex-1">
                        {language === 'en' ? category.descriptionEn : language === 'ar' ? category.descriptionAr : category.descriptionFr}
                      </p>
                      <Button size="sm" className="w-full bg-green-600 hover:bg-green-700 mt-auto">
                        {t.categories.viewProducts}
                      </Button>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden w-full">
      <Header />

      <main className="flex-1 py-8 overflow-hidden">
        <div className="container px-4">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs md:text-sm text-gray-600 mb-4 md:mb-6 overflow-x-auto whitespace-nowrap pb-2">
            <Link to="/" className="hover:text-green-600 flex-shrink-0">{t.nav.home}</Link>
            <ChevronRight className="h-4 w-4 flex-shrink-0" />
            <Link to="/categories" className="hover:text-green-600 flex-shrink-0">{t.categories.title}</Link>
            <ChevronRight className="h-4 w-4 flex-shrink-0" />
            <span className="text-gray-900 font-medium break-words">{getCategoryName(currentCategory)}</span>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold mb-6 md:mb-8 break-words">{getCategoryName(currentCategory)}</h1>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 md:gap-8">
            {/* Filters Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm lg:sticky lg:top-24 overflow-hidden">
                <h2 className="font-semibold text-base md:text-lg mb-4 break-words">{t.categories.filters}</h2>

                {/* Subcategory Filter */}
                {categorySubcategories.length > 0 && (
                  <div className="mb-6">
                    <h3 className="font-medium mb-3 text-sm md:text-base break-words">{t.common.subcategory}</h3>
                    <div className="space-y-2">
                      <Button
                        variant={selectedSubcategory === 'all' ? 'default' : 'outline'}
                        className="w-full justify-start text-sm break-words"
                        onClick={() => handleSubcategoryClick('all')}
                      >
                        {t.categories.allSubcategories}
                      </Button>
                      {categorySubcategories.map((subcategory) => (
                        <Button
                          key={subcategory.id}
                          variant={selectedSubcategory === subcategory.id ? 'default' : 'outline'}
                          className="w-full justify-start text-sm break-words"
                          onClick={() => handleSubcategoryClick(subcategory.id)}
                        >
                          {getSubcategoryName(subcategory)}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Price Range Filter */}
                <div>
                  <h3 className="font-medium mb-3 text-sm md:text-base break-words">{t.categories.priceRange}</h3>
                  <Slider
                    min={0}
                    max={50000}
                    step={500}
                    value={priceRange}
                    onValueChange={setPriceRange}
                    className="mb-4"
                  />
                  <div className="flex justify-between text-xs md:text-sm text-gray-600">
                    <span className="break-words">{priceRange[0].toLocaleString()} DH</span>
                    <span className="break-words">{priceRange[1].toLocaleString()} DH</span>
                  </div>
                </div>

                <Button
                  variant="outline"
                  className="w-full mt-6 text-sm"
                  onClick={() => navigate('/categories')}
                >
                  {t.common.backToCategories}
                </Button>
              </div>
            </div>

            {/* Products Grid */}
            <div className="lg:col-span-3">
              <div className="mb-4 text-sm md:text-base text-gray-600 break-words">
                {filteredProducts.length} {t.categories.productsFound}
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
                {filteredProducts.map((product) => (
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
                        <h3 className="font-semibold text-base md:text-lg mb-2 break-words">{getProductName(product)}</h3>
                        <p className="text-xs md:text-sm text-gray-600 mb-3 line-clamp-2 break-words">
                          {getProductDescription(product)}
                        </p>
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mt-auto">
                          <span className="text-lg md:text-xl font-bold text-green-600 break-words">
                            {product.price.toLocaleString()} DH
                          </span>
                          <Button size="sm" className="bg-green-600 hover:bg-green-700 w-full sm:w-auto">
                            {t.common.viewDetails}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>

              {filteredProducts.length === 0 && (
                <div className="text-center py-12 px-4">
                  <p className="text-gray-600 text-base md:text-lg break-words">{t.categories.noProducts}</p>
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