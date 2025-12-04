import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import useEmblaCarousel from 'embla-carousel-react';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import type { Category } from '@/lib/types';

const DEFAULT_IMG = 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=800&q=80';

interface CategoriesCarouselProps {
    categories: Category[];
    getCategoryName: (category: Category) => string;
    getCategoryDescription: (category: Category) => string;
}

function CategoryCard({
    category,
    getName,
    getDescription,
}: {
    category: Category;
    getName: () => string;
    getDescription: () => string;
}) {
    const to = category.slug === 'promotions' ? '/promotions' : `/categories/${category.slug}`;

    return (
        <div className="flex-[0_0_calc(50%-0.5rem)] min-w-0 lg:flex-[0_0_calc(33.333%-1rem)] xl:flex-[0_0_calc(25%-1.125rem)]">
            <Link to={to} className="group block h-full">
                <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full flex flex-col">
                    <div className="aspect-square overflow-hidden bg-gray-100 flex-shrink-0">
                        <img
                            src={category.imageUrl}
                            alt={getName()}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            onError={(e) => { e.currentTarget.src = DEFAULT_IMG; }}
                        />
                    </div>
                    <CardContent className="p-3 md:p-4 flex-1 flex flex-col">
                        <h3 className="font-semibold text-base md:text-lg mb-2 break-words">{getName()}</h3>
                        <p className="text-xs md:text-sm text-gray-600 break-words flex-1">{getDescription()}</p>
                    </CardContent>
                </Card>
            </Link>
        </div>
    );
}

function NavButton({
    direction,
    onClick,
    disabled,
    variant,
}: {
    direction: 'left' | 'right';
    onClick: () => void;
    disabled: boolean;
    variant: 'desktop' | 'mobile';
}) {
    if (disabled) return null;

    const Icon = direction === 'left' ? ChevronLeft : ChevronRight;
    const position = direction === 'left'
        ? variant === 'desktop' ? 'left-0 -translate-x-4' : 'left-2'
        : variant === 'desktop' ? 'right-0 translate-x-4' : 'right-2';

    const baseClasses = 'absolute top-1/2 -translate-y-1/2 z-20';
    const variantClasses = variant === 'desktop'
        ? 'bg-white shadow-lg hover:bg-gray-50 hidden md:flex'
        : 'bg-white/90 backdrop-blur-sm shadow-md hover:bg-white h-8 w-8 md:hidden';

    return (
        <Button
            variant="outline"
            size="icon"
            className={`${baseClasses} ${position} ${variantClasses}`}
            onClick={onClick}
        >
            <Icon className={variant === 'desktop' ? 'h-4 w-4' : 'h-3.5 w-3.5'} />
        </Button>
    );
}

function FadeGradient({ side, visible }: { side: 'left' | 'right'; visible: boolean }) {
    if (!visible) return null;

    const classes = side === 'left'
        ? 'left-0 bg-gradient-to-r from-white to-transparent'
        : 'right-0 bg-gradient-to-l from-white to-transparent';

    return <div className={`absolute top-0 bottom-0 w-8 md:w-12 ${classes} z-10 pointer-events-none`} />;
}

export function CategoriesCarousel({ categories, getCategoryName, getCategoryDescription }: CategoriesCarouselProps) {
    const { language } = useLanguage();
    const isRtl = language === 'ar';

    const [emblaRef, emblaApi] = useEmblaCarousel({
        align: 'start',
        loop: false,
        skipSnaps: false,
        dragFree: false,
        direction: isRtl ? 'rtl' : 'ltr',
    });

    const [canScrollPrev, setCanScrollPrev] = useState(false);
    const [canScrollNext, setCanScrollNext] = useState(false);

    const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
    const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

    const updateButtons = useCallback(() => {
        if (!emblaApi) return;
        setCanScrollPrev(emblaApi.canScrollPrev());
        setCanScrollNext(emblaApi.canScrollNext());
    }, [emblaApi]);

    useEffect(() => {
        if (!emblaApi) return;
        updateButtons();
        emblaApi.on('select', updateButtons);
        emblaApi.on('reInit', updateButtons);
    }, [emblaApi, updateButtons]);

    useEffect(() => {
        emblaApi?.reInit();
    }, [language, emblaApi]);

    const showLeftNav = isRtl ? canScrollNext : canScrollPrev;
    const showRightNav = isRtl ? canScrollPrev : canScrollNext;
    const onLeftClick = isRtl ? scrollNext : scrollPrev;
    const onRightClick = isRtl ? scrollPrev : scrollNext;

    return (
        <div className="relative">
            <FadeGradient side="left" visible={showLeftNav} />
            <FadeGradient side="right" visible={showRightNav} />

            <div className="overflow-hidden" ref={emblaRef}>
                <div className="flex gap-3 md:gap-6">
                    {categories.map((category) => (
                        <CategoryCard
                            key={category.id}
                            category={category}
                            getName={() => getCategoryName(category)}
                            getDescription={() => getCategoryDescription(category)}
                        />
                    ))}
                </div>
            </div>

            <NavButton direction="left" onClick={onLeftClick} disabled={!showLeftNav} variant="desktop" />
            <NavButton direction="right" onClick={onRightClick} disabled={!showRightNav} variant="desktop" />
            <NavButton direction="left" onClick={onLeftClick} disabled={!showLeftNav} variant="mobile" />
            <NavButton direction="right" onClick={onRightClick} disabled={!showRightNav} variant="mobile" />
        </div>
    );
}
