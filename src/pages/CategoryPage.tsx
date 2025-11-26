'use client';

import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ProductCard } from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { categories, products } from '@/lib/data';
import { filterProducts, sortProducts } from '@/lib/utils-bike';
import { ProductFilters, SortOption } from '@/lib/types';
import { Search } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function CategoryPage() {
  const { slug } = useParams<{ slug: string }>();
  const { t } = useLanguage();
  const category = categories.find(c => c.slug === slug);
  
  const [filters, setFilters] = useState<ProductFilters>({
    categoryId: category?.id,
    minPrice: 0,
    maxPrice: 50000,
    inStock: true,
    search: '',
  });
  
  const [sortOption, setSortOption] = useState<SortOption>('newest');
  const [priceRange, setPriceRange] = useState([0, 50000]);

  if (!category) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container py-16">
          <h1 className="text-3xl font-bold">{t.common.categoryNotFound}</h1>
        </main>
        <Footer />
      </div>
    );
  }

  const filteredProducts = sortProducts(
    filterProducts(products, { ...filters, minPrice: priceRange[0], maxPrice: priceRange[1] }),
    sortOption
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero */}
        <section className="relative bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
          <div className="container">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{category.nameFr}</h1>
            <p className="text-xl text-blue-100">{category.descriptionFr}</p>
          </div>
        </section>

        {/* Contenu */}
        <section className="py-12">
          <div className="container">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Filtres */}
              <aside className="lg:col-span-1">
                <div className="bg-white p-6 rounded-lg shadow-sm sticky top-20">
                  <h2 className="text-xl font-bold mb-6">{t.filters.title}</h2>
                  
                  {/* Recherche */}
                  <div className="mb-6">
                    <Label htmlFor="search" className="mb-2 block">{t.filters.search}</Label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="search"
                        type="text"
                        placeholder={t.filters.searchPlaceholder}
                        className="pl-10"
                        value={filters.search}
                        onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                      />
                    </div>
                  </div>

                  {/* Prix */}
                  <div className="mb-6">
                    <Label className="mb-4 block">{t.filters.price}</Label>
                    <Slider
                      min={0}
                      max={50000}
                      step={500}
                      value={priceRange}
                      onValueChange={setPriceRange}
                      className="mb-4"
                    />
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span>{priceRange[0].toLocaleString()} MAD</span>
                      <span>{priceRange[1].toLocaleString()} MAD</span>
                    </div>
                  </div>

                  {/* Tri */}
                  <div className="mb-6">
                    <Label htmlFor="sort" className="mb-2 block">{t.filters.sortBy}</Label>
                    <Select value={sortOption} onValueChange={(value) => setSortOption(value as SortOption)}>
                      <SelectTrigger id="sort">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="newest">{t.filters.newest}</SelectItem>
                        <SelectItem value="price-asc">{t.filters.priceAsc}</SelectItem>
                        <SelectItem value="price-desc">{t.filters.priceDesc}</SelectItem>
                        <SelectItem value="name-asc">{t.filters.nameAsc}</SelectItem>
                        <SelectItem value="name-desc">{t.filters.nameDesc}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => {
                      setFilters({ categoryId: category.id, minPrice: 0, maxPrice: 50000, inStock: true, search: '' });
                      setPriceRange([0, 50000]);
                      setSortOption('newest');
                    }}
                  >
                    {t.filters.reset}
                  </Button>
                </div>
              </aside>

              {/* Produits */}
              <div className="lg:col-span-3">
                <div className="mb-6">
                  <p className="text-gray-600">
                    {filteredProducts.length} {t.products.found}
                  </p>
                </div>

                {filteredProducts.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProducts.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <p className="text-gray-600 text-lg">{t.products.noProducts}</p>
                    <Button 
                      variant="outline" 
                      className="mt-4"
                      onClick={() => {
                        setFilters({ categoryId: category.id, minPrice: 0, maxPrice: 50000, inStock: true, search: '' });
                        setPriceRange([0, 50000]);
                      }}
                    >
                      {t.filters.resetFilters}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}