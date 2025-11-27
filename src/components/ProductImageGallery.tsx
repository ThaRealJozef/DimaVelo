import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ImageZoom } from './ImageZoom';
import { Button } from './ui/button';
import { motion, AnimatePresence } from 'framer-motion';

interface ProductImageGalleryProps {
    images: string[];
    productName: string;
}

/**
 * Product image gallery with thumbnails and zoom
 * Features: thumbnail carousel, arrow navigation, keyboard support, zoom on desktop
 */
export function ProductImageGallery({ images, productName }: ProductImageGalleryProps) {
    const [selectedIndex, setSelectedIndex] = useState(0);

    // Handle arrow navigation
    const goToPrevious = () => {
        setSelectedIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    };

    const goToNext = () => {
        setSelectedIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    };

    // Keyboard navigation
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'ArrowLeft') goToPrevious();
        if (e.key === 'ArrowRight') goToNext();
    };

    // Handle empty images array
    if (!images || images.length === 0) {
        return (
            <div className="w-full aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                <p className="text-gray-400">No images available</p>
            </div>
        );
    }

    const currentImage = images[selectedIndex];

    return (
        <div
            className="w-full space-y-4"
            onKeyDown={handleKeyDown}
            tabIndex={0}
        >
            {/* Main Image Display */}
            <div className="relative w-full aspect-square bg-gray-50 rounded-lg overflow-hidden group">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={selectedIndex}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="w-full h-full"
                    >
                        <ImageZoom
                            src={currentImage}
                            alt={`${productName} - Image ${selectedIndex + 1}`}
                            className="w-full h-full"
                            zoomLevel={2.5}
                        />
                    </motion.div>
                </AnimatePresence>

                {/* Arrow Navigation - Show only if multiple images */}
                {images.length > 1 && (
                    <>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={goToPrevious}
                            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                            aria-label="Previous image"
                        >
                            <ChevronLeft className="h-6 w-6" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={goToNext}
                            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                            aria-label="Next image"
                        >
                            <ChevronRight className="h-6 w-6" />
                        </Button>
                    </>
                )}

                {/* Image Counter */}
                {images.length > 1 && (
                    <div className="absolute bottom-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm">
                        {selectedIndex + 1} / {images.length}
                    </div>
                )}
            </div>

            {/* Thumbnail Carousel */}
            {images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                    {images.map((image, index) => (
                        <motion.button
                            key={index}
                            onClick={() => setSelectedIndex(index)}
                            className={`
                flex-shrink-0 w-20 h-20 rounded-md overflow-hidden border-2 transition-all
                ${index === selectedIndex
                                    ? 'border-green-600 ring-2 ring-green-200'
                                    : 'border-gray-200 hover:border-gray-400'
                                }
              `}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            aria-label={`View image ${index + 1}`}
                        >
                            <img
                                src={image}
                                alt={`${productName} thumbnail ${index + 1}`}
                                className="w-full h-full object-cover"
                            />
                        </motion.button>
                    ))}
                </div>
            )}
        </div>
    );
}
