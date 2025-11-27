import { useState, useRef, MouseEvent } from 'react';
import { useIsMobile } from '@/hooks/useIsMobile';
import { motion, AnimatePresence } from 'framer-motion';

interface ImageZoomProps {
    src: string;
    alt: string;
    className?: string;
    zoomLevel?: number;
}

/**
 * Image component with cursor-following zoom on desktop
 * No zoom on mobile (uses native pinch-to-zoom)
 */
export function ImageZoom({
    src,
    alt,
    className = '',
    zoomLevel = 2.5
}: ImageZoomProps) {
    const [isZooming, setIsZooming] = useState(false);
    const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
    const imageRef = useRef<HTMLDivElement>(null);
    const isMobile = useIsMobile();

    const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
        if (isMobile || !imageRef.current) return;

        const { left, top, width, height } = imageRef.current.getBoundingClientRect();
        const x = ((e.clientX - left) / width) * 100;
        const y = ((e.clientY - top) / height) * 100;

        setZoomPosition({ x, y });
    };

    const handleMouseEnter = () => {
        if (!isMobile) {
            setIsZooming(true);
        }
    };

    const handleMouseLeave = () => {
        setIsZooming(false);
    };

    return (
        <div
            ref={imageRef}
            className={`relative overflow-hidden ${className}`}
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            style={{ cursor: isMobile ? 'default' : 'zoom-in' }}
        >
            {/* Main Image */}
            <img
                src={src}
                alt={alt}
                className="w-full h-full object-contain"
                draggable={false}
            />

            {/* Zoomed Overlay (Desktop Only) */}
            {!isMobile && (
                <AnimatePresence>
                    {isZooming && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="absolute inset-0 pointer-events-none"
                            style={{
                                backgroundImage: `url(${src})`,
                                backgroundSize: `${zoomLevel * 100}%`,
                                backgroundPosition: `${zoomPosition.x}% ${zoomPosition.y}%`,
                                backgroundRepeat: 'no-repeat',
                            }}
                        />
                    )}
                </AnimatePresence>
            )}
        </div>
    );
}
