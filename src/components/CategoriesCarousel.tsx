import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import useEmblaCarousel from 'embla-carousel-react';
import { useCallback, useEffect, useState } from 'react';
import type { Category } from '@/lib/types';
import { useLanguage } from '@/contexts/LanguageContext';

interface CategoriesCarouselProps {
    categories: Category[];
    getCategoryName: (category: Category) => string;
    getCategoryDescription: (category: Category) => string;
}

export function CategoriesCarousel({ categories, getCategoryName, getCategoryDescription }: CategoriesCarouselProps) {
    const { language } = useLanguage();

    const [emblaRef, emblaApi] = useEmblaCarousel({
        align: 'start',
        loop: false,
        skipSnaps: false,
        dragFree: false,
        direction: language === 'ar' ? 'rtl' : 'ltr',
    });

    const [prevBtnEnabled, setPrevBtnEnabled] = useState(false);
    const [nextBtnEnabled, setNextBtnEnabled] = useState(false);

    const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
    const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

    const onSelect = useCallback(() => {
        if (!emblaApi) return;
        setPrevBtnEnabled(emblaApi.canScrollPrev());
        setNextBtnEnabled(emblaApi.canScrollNext());
    }, [emblaApi]);

    useEffect(() => {
        if (!emblaApi) return;
        onSelect();
        emblaApi.on('select', onSelect);
        emblaApi.on('reInit', onSelect);
    }, [emblaApi, onSelect]);

    // Re-initialize carousel when language changes
    useEffect(() => {
        if (emblaApi) {
            emblaApi.reInit();
        }
    }, [language, emblaApi]);

    return (
        <div className="relative">
            {/* Left fade gradient indicator */}
            {(language === 'ar' ? nextBtnEnabled : prevBtnEnabled) && (
                <div className="absolute left-0 top-0 bottom-0 w-8 md:w-12 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
            )}

            {/* Right fade gradient indicator */}
            {(language === 'ar' ? prevBtnEnabled : nextBtnEnabled) && (
                <div className="absolute right-0 top-0 bottom-0 w-8 md:w-12 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
            )}

            <div className="overflow-hidden" ref={emblaRef}>
                <div className="flex gap-3 md:gap-6">
                    {categories.map((category) => (
                        <div
                            key={category.id}
                            className="flex-[0_0_calc(50%-0.5rem)] min-w-0 lg:flex-[0_0_calc(33.333%-1rem)] xl:flex-[0_0_calc(25%-1.125rem)]"
                        >
                            <Link
                                to={category.slug === 'promotions' ? '/promotions' : `/categories/${category.slug}`}
                                className="group block h-full"
                            >
                                <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full flex flex-col">
                                    <div className="aspect-square overflow-hidden bg-gray-100 flex-shrink-0">
                                        <img
                                            src={category.imageUrl}
                                            alt={getCategoryName(category)}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                            onError={(e) => {
                                                e.currentTarget.src = 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=800&q=80';
                                            }}
                                        />
                                    </div>
                                    <CardContent className="p-3 md:p-4 flex-1 flex flex-col">
                                        <h3 className="font-semibold text-base md:text-lg mb-2 break-words">
                                            {getCategoryName(category)}
                                        </h3>
                                        <p className="text-xs md:text-sm text-gray-600 break-words flex-1">
                                            {getCategoryDescription(category)}
                                        </p>
                                    </CardContent>
                                </Card>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>

            {/* Navigation Buttons - Desktop */}
            {(language === 'ar' ? nextBtnEnabled : prevBtnEnabled) && (
                <Button
                    variant="outline"
                    size="icon"
                    className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-20 bg-white shadow-lg hover:bg-gray-50 hidden md:flex"
                    onClick={language === 'ar' ? scrollNext : scrollPrev}
                    disabled={language === 'ar' ? !nextBtnEnabled : !prevBtnEnabled}
                >
                    <ChevronLeft className="h-4 w-4" />
                </Button>
            )}

            {(language === 'ar' ? prevBtnEnabled : nextBtnEnabled) && (
                <Button
                    variant="outline"
                    size="icon"
                    className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-20 bg-white shadow-lg hover:bg-gray-50 hidden md:flex"
                    onClick={language === 'ar' ? scrollPrev : scrollNext}
                    disabled={language === 'ar' ? !prevBtnEnabled : !nextBtnEnabled}
                >
                    <ChevronRight className="h-4 w-4" />
                </Button>
            )}

            {/* Navigation Buttons - Mobile (smaller, positioned inside) */}
            {(language === 'ar' ? nextBtnEnabled : prevBtnEnabled) && (
                <Button
                    variant="outline"
                    size="icon"
                    className="absolute left-2 top-1/2 -translate-y-1/2 z-20 bg-white/90 backdrop-blur-sm shadow-md hover:bg-white h-8 w-8 md:hidden"
                    onClick={language === 'ar' ? scrollNext : scrollPrev}
                    disabled={language === 'ar' ? !nextBtnEnabled : !prevBtnEnabled}
                >
                    <ChevronLeft className="h-3.5 w-3.5" />
                </Button>
            )}

            {(language === 'ar' ? prevBtnEnabled : nextBtnEnabled) && (
                <Button
                    variant="outline"
                    size="icon"
                    className="absolute right-2 top-1/2 -translate-y-1/2 z-20 bg-white/90 backdrop-blur-sm shadow-md hover:bg-white h-8 w-8 md:hidden"
                    onClick={language === 'ar' ? scrollPrev : scrollNext}
                    disabled={language === 'ar' ? !prevBtnEnabled : !nextBtnEnabled}
                >
                    <ChevronRight className="h-3.5 w-3.5" />
                </Button>
            )}
        </div>
    );
}
