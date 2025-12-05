import { ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface StickyAddToCartProps {
    productName: string;
    price: number;
    discountedPrice?: number;
    isAvailable: boolean;
    onAddToCart: () => void;
}

export function StickyAddToCart({
    productName,
    price,
    discountedPrice,
    isAvailable,
    onAddToCart,
}: StickyAddToCartProps) {
    const displayPrice = discountedPrice || price;

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-3 z-40 md:hidden shadow-lg">
            <div className="flex items-center justify-between gap-3">
                <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{productName}</p>
                    <div className="flex items-center gap-2">
                        <span className={`font-bold ${discountedPrice ? 'text-red-600' : 'text-green-600'}`}>
                            {displayPrice.toLocaleString()} DH
                        </span>
                        {discountedPrice && (
                            <span className="text-xs text-gray-400 line-through">
                                {price.toLocaleString()} DH
                            </span>
                        )}
                    </div>
                </div>
                <Button
                    size="lg"
                    className="bg-green-600 hover:bg-green-700 flex-shrink-0"
                    disabled={!isAvailable}
                    onClick={onAddToCart}
                >
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    Ajouter
                </Button>
            </div>
        </div>
    );
}
