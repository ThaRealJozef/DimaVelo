import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Product } from '@/lib/types';
import { formatPrice } from '@/lib/utils-bike';
import { useLanguage } from '@/contexts/LanguageContext';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { t } = useLanguage();

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full flex flex-col">
      <Link to={`/product/${product.id}`}>
        <div className="aspect-square overflow-hidden bg-gray-100 flex-shrink-0">
          <img
            src={product.images?.[0] || 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=800&q=80'}
            alt={product.nameFr}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>
      </Link>
      <CardContent className="p-4 flex-1 flex flex-col">
        <Link to={`/product/${product.id}`}>
          <h3 className="font-semibold text-lg mb-2 hover:text-blue-600 transition-colors line-clamp-1">
            {product.nameFr}
          </h3>
        </Link>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2 flex-1">{product.descriptionFr}</p>
        <div className="flex items-center justify-between mt-auto">
          {product.isFeatured && product.discountedPrice && product.originalPrice ? (
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold text-red-600">{formatPrice(product.discountedPrice)}</span>
                <span className="text-sm text-gray-400 line-through">{formatPrice(product.originalPrice)}</span>
              </div>
              <span className="text-xs font-medium text-red-600 bg-red-50 px-2 py-0.5 rounded">
                {(product.originalPrice - product.discountedPrice).toLocaleString()} DH d'économie
              </span>
            </div>
          ) : (
            <span className="text-xl font-bold text-blue-600">{formatPrice(product.price)}</span>
          )}
          <Badge variant={product.isAvailable ? 'default' : 'secondary'}>
            {product.isAvailable ? t.product.inStock : t.product.outOfStock}
          </Badge>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 mt-auto">
        <Button asChild className="w-full">
          <Link to={`/product/${product.id}`}>{t.common.viewDetails}</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}