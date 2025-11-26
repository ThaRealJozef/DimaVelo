import { Link } from 'react-router-dom';
import { Category } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface CategoryCardProps {
  category: Category;
}

export function CategoryCard({ category }: CategoryCardProps) {
  const { t } = useLanguage();
  
  // Map category slugs to translation keys
  const categoryTranslations: Record<string, { title: string; desc: string }> = {
    'velos': { title: t.categories.bikes, desc: t.categories.bikesDesc },
    'accessoires': { title: t.categories.accessories, desc: t.categories.accessoriesDesc },
    'gadgets': { title: t.categories.gadgets, desc: t.categories.gadgetsDesc },
    'pieces-detachees': { title: t.categories.parts, desc: t.categories.partsDesc },
  };

  const translation = categoryTranslations[category.slug] || { 
    title: category.nameFr, 
    desc: category.descriptionFr 
  };

  return (
    <Link to={`/category/${category.slug}`}>
      <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={category.imageUrl}
            alt={translation.title}
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <h3 className="text-2xl font-bold mb-2">{translation.title}</h3>
            <p className="text-sm text-gray-200 mb-3">{translation.desc}</p>
            <div className="flex items-center text-sm font-medium group-hover:translate-x-2 transition-transform">
              {t.categories.discover}
              <ArrowRight className="ml-2 h-4 w-4" />
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}