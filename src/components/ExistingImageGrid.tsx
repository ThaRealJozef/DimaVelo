import { useState, useEffect } from 'react';
import { X, GripVertical } from 'lucide-react';
import { Button } from './ui/button';
import { Reorder } from 'framer-motion';

interface ExistingImageGridProps {
    images: string[];
    onReorder: (newImages: string[]) => void;
    onRemove: (index: number) => void;
}

/**
 * Grid for managing existing product images (URLs)
 * Allows reordering and deletion of images that are already uploaded
 */
export function ExistingImageGrid({ images, onReorder, onRemove }: ExistingImageGridProps) {
    const [orderedImages, setOrderedImages] = useState(images);

    // Sync state when props change
    useEffect(() => {
        setOrderedImages(images);
    }, [images]);

    if (!images || images.length === 0) {
        return null;
    }

    return (
        <div className="mt-4">
            <p className="text-sm font-medium mb-2">Images actuelles ({images.length})</p>
            <Reorder.Group
                axis="x"
                values={orderedImages}
                onReorder={(newOrder) => {
                    setOrderedImages(newOrder);
                    onReorder(newOrder);
                }}
                className="flex gap-3 overflow-x-auto pb-2"
            >
                {orderedImages.map((url, index) => (
                    <Reorder.Item
                        key={url}
                        value={url}
                        className="flex-shrink-0 relative group"
                    >
                        <div className="w-24 h-24 rounded-lg overflow-hidden border-2 border-gray-200 hover:border-green-500 transition-colors cursor-grab active:cursor-grabbing">
                            <img
                                src={url}
                                alt={`Product image ${index + 1}`}
                                className="w-full h-full object-cover"
                            />

                            {/* Drag Handle */}
                            <div className="absolute inset-x-0 bottom-0 bg-black/50 text-white text-xs py-1 px-2 flex items-center justify-center">
                                <GripVertical className="h-3 w-3 mr-1" />
                                {index + 1}
                            </div>

                            {/* Remove Button */}
                            <Button
                                type="button"
                                variant="destructive"
                                size="icon"
                                className="absolute -top-2 -right-2 h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => onRemove(index)}
                            >
                                <X className="h-3 w-3" />
                            </Button>
                        </div>
                    </Reorder.Item>
                ))}
            </Reorder.Group>
            <p className="text-xs text-gray-500 mt-2">
                Glissez-déposez pour réorganiser les images existantes
            </p>
        </div>
    );
}
