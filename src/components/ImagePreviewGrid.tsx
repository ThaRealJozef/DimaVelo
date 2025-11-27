import { useState, useEffect, useMemo } from 'react';
import { X, GripVertical } from 'lucide-react';
import { Button } from './ui/button';
import { Reorder } from 'framer-motion';

interface ImagePreviewGridProps {
    images: File[];
    onReorder: (newImages: File[]) => void;
    onRemove: (index: number) => void;
}

/**
 * Image preview grid with drag-and-drop reordering
 * Used in admin panel for managing product images before upload
 */
export function ImagePreviewGrid({ images, onReorder, onRemove }: ImagePreviewGridProps) {
    const [imagePreviews, setImagePreviews] = useState<Record<string, string>>({});

    // Generate unique key for each file
    const fileKeys = useMemo(() =>
        images.map((file, i) => `${file.name}-${file.size}-${i}`),
        [images]
    );

    // Load previews only for new files
    useEffect(() => {
        const newFiles = images.filter((file, i) => !imagePreviews[fileKeys[i]]);

        if (newFiles.length === 0) return;

        const loadPreviews = async () => {
            const previews: Record<string, string> = {};

            for (let i = 0; i < images.length; i++) {
                const key = fileKeys[i];
                if (!imagePreviews[key]) {
                    const file = images[i];
                    const url = await new Promise<string>((resolve) => {
                        const reader = new FileReader();
                        reader.onload = (e) => resolve(e.target?.result as string || '');
                        reader.readAsDataURL(file);
                    });
                    previews[key] = url;
                }
            }

            setImagePreviews(prev => ({ ...prev, ...previews }));
        };

        loadPreviews();
    }, [fileKeys]); // Only re-run when file keys change

    if (images.length === 0) {
        return null;
    }

    return (
        <div className="mt-4">
            <p className="text-sm font-medium mb-2">{images.length} image(s) sélectionnée(s)</p>
            <Reorder.Group
                axis="x"
                values={images}
                onReorder={onReorder}
                className="flex gap-3 overflow-x-auto pb-2"
            >
                {images.map((file, index) => {
                    const key = fileKeys[index];
                    return (
                        <Reorder.Item
                            key={key}
                            value={file}
                            className="flex-shrink-0 relative group"
                        >
                            <div className="w-24 h-24 rounded-lg overflow-hidden border-2 border-gray-200 hover:border-green-500 transition-colors cursor-grab active:cursor-grabbing">
                                {imagePreviews[key] ? (
                                    <img
                                        src={imagePreviews[key]}
                                        alt={`Preview ${index + 1}`}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gray-100 animate-pulse flex items-center justify-center text-xs text-gray-400">
                                        Loading...
                                    </div>
                                )}
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
                    );
                })}
            </Reorder.Group>
            <p className="text-xs text-gray-500 mt-2">
                Glissez-déposez pour réorganiser • La première image sera l'image principale
            </p>
        </div>
    );
}
