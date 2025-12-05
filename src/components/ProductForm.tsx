'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { categories, subcategories } from '@/lib/data';
import { ImagePreviewGrid } from '@/components/ImagePreviewGrid';
import { ExistingImageGrid } from '@/components/ExistingImageGrid';

export interface ProductFormData {
    nameFr: string;
    nameEn?: string;
    nameAr?: string;
    categoryId: string;
    subcategoryId?: string;
    price: string | number;
    stockQuantity: string | number;
    descriptionFr: string;
    descriptionEn?: string;
    descriptionAr?: string;
    isFeatured: boolean;
    originalPrice?: string | number;
    discountedPrice?: string | number;
}

interface ProductFormProps {
    data: ProductFormData;
    onChange: (data: ProductFormData) => void;
    onSubmit: (e: React.FormEvent) => void;
    isSubmitting: boolean;
    submitLabel: string;
    loadingLabel: string;
    productImages: File[];
    onImagesChange: (files: File[]) => void;
    onRemoveImage: (index: number) => void;
    onReorderImages: (newOrder: File[]) => void;
    existingImages?: string[];
    onRemoveExistingImage?: (index: number) => void;
    onReorderExistingImages?: (newOrder: string[]) => void;
    mode: 'add' | 'edit';
}

function FormField({
    id,
    label,
    required,
    children,
    hint,
}: {
    id: string;
    label: string;
    required?: boolean;
    children: React.ReactNode;
    hint?: string;
}) {
    return (
        <div>
            <Label htmlFor={id}>
                {label} {required && '*'}
            </Label>
            {children}
            {hint && <p className="text-xs text-gray-500 mt-1">{hint}</p>}
        </div>
    );
}

function getSubcategoriesForCategory(categoryId: string) {
    return subcategories.filter((sub) => sub.parentCategoryId === categoryId);
}

export function ProductForm({
    data,
    onChange,
    onSubmit,
    isSubmitting,
    submitLabel,
    loadingLabel,
    productImages,
    onImagesChange,
    onRemoveImage,
    onReorderImages,
    existingImages,
    onRemoveExistingImage,
    onReorderExistingImages,
    mode,
}: ProductFormProps) {
    const update = <K extends keyof ProductFormData>(field: K, value: ProductFormData[K]) => {
        onChange({ ...data, [field]: value });
    };

    const idPrefix = mode === 'add' ? 'product' : 'edit';
    const availableSubcategories = data.categoryId ? getSubcategoriesForCategory(data.categoryId) : [];
    const showSubcategory = data.categoryId && availableSubcategories.length > 0;

    return (
        <form className="space-y-4 mt-4" onSubmit={onSubmit}>
            <FormField id={`${idPrefix}NameFr`} label="Nom du Produit (Français)" required>
                <Input
                    id={`${idPrefix}NameFr`}
                    value={data.nameFr}
                    onChange={(e) => update('nameFr', e.target.value)}
                    placeholder="Ex: VTT Giant Talon 3"
                    required
                />
            </FormField>

            <div className="grid grid-cols-2 gap-4">
                <FormField id={`${idPrefix}NameEn`} label="Nom (Anglais)">
                    <Input
                        id={`${idPrefix}NameEn`}
                        value={data.nameEn || ''}
                        onChange={(e) => update('nameEn', e.target.value)}
                        placeholder="Mountain Bike Giant Talon 3"
                    />
                </FormField>
                <FormField id={`${idPrefix}NameAr`} label="Nom (Arabe)">
                    <Input
                        id={`${idPrefix}NameAr`}
                        value={data.nameAr || ''}
                        onChange={(e) => update('nameAr', e.target.value)}
                        placeholder="دراجة جبلية جاينت تالون 3"
                    />
                </FormField>
            </div>

            <FormField id={`${idPrefix}Category`} label="Catégorie" required>
                <Select
                    value={data.categoryId}
                    onValueChange={(value) => onChange({ ...data, categoryId: value, subcategoryId: '' })}
                    required
                >
                    <SelectTrigger id={`${idPrefix}Category`}>
                        <SelectValue placeholder="Sélectionnez une catégorie" />
                    </SelectTrigger>
                    <SelectContent>
                        {categories
                            .filter((cat) => mode === 'edit' || cat.slug !== 'promotions')
                            .map((cat) => (
                                <SelectItem key={cat.id} value={cat.id}>
                                    {cat.nameFr}
                                </SelectItem>
                            ))}
                    </SelectContent>
                </Select>
            </FormField>

            {showSubcategory && (
                <FormField id={`${idPrefix}Subcategory`} label="Sous-catégorie" required>
                    <Select value={data.subcategoryId || ''} onValueChange={(value) => update('subcategoryId', value)} required>
                        <SelectTrigger id={`${idPrefix}Subcategory`}>
                            <SelectValue placeholder="Sélectionnez une sous-catégorie" />
                        </SelectTrigger>
                        <SelectContent>
                            {availableSubcategories.map((sub) => (
                                <SelectItem key={sub.id} value={sub.id}>
                                    {sub.nameFr}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </FormField>
            )}

            <div className="grid grid-cols-2 gap-4">
                <FormField
                    id={`${idPrefix}Price`}
                    label={mode === 'edit' ? 'Prix Normal (MAD)' : 'Prix (MAD)'}
                    required
                    hint={mode === 'edit' ? 'Prix affiché pour les produits non-vedettes' : undefined}
                >
                    <Input
                        id={`${idPrefix}Price`}
                        type="number"
                        value={data.price}
                        onChange={(e) => update('price', e.target.value)}
                        placeholder="12990"
                        required
                    />
                </FormField>
                <FormField id={`${idPrefix}Stock`} label="Stock" required>
                    <Input
                        id={`${idPrefix}Stock`}
                        type="number"
                        value={data.stockQuantity}
                        onChange={(e) => update('stockQuantity', e.target.value)}
                        placeholder="5"
                        required
                    />
                </FormField>
            </div>

            <FormField id={`${idPrefix}DescFr`} label="Description (Français)" required>
                <Textarea
                    id={`${idPrefix}DescFr`}
                    value={data.descriptionFr}
                    onChange={(e) => update('descriptionFr', e.target.value)}
                    rows={3}
                    placeholder="Description du produit..."
                    required
                />
            </FormField>

            <FormField id={`${idPrefix}DescEn`} label="Description (Anglais)">
                <Textarea
                    id={`${idPrefix}DescEn`}
                    value={data.descriptionEn || ''}
                    onChange={(e) => update('descriptionEn', e.target.value)}
                    rows={2}
                    placeholder="Product description..."
                />
            </FormField>

            <FormField id={`${idPrefix}DescAr`} label="Description (Arabe)">
                <Textarea
                    id={`${idPrefix}DescAr`}
                    value={data.descriptionAr || ''}
                    onChange={(e) => update('descriptionAr', e.target.value)}
                    rows={2}
                    placeholder="وصف المنتج..."
                />
            </FormField>

            <div className="flex items-center space-x-2">
                <input
                    type="checkbox"
                    id={`${idPrefix}IsFeatured`}
                    checked={data.isFeatured}
                    onChange={(e) => update('isFeatured', e.target.checked)}
                    className="rounded"
                />
                <Label htmlFor={`${idPrefix}IsFeatured`}>
                    Produit vedette {mode === 'add' && "(afficher sur la page d'accueil)"}
                </Label>
            </div>

            {data.isFeatured && (
                <div className="grid grid-cols-2 gap-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                    <FormField id={`${idPrefix}OriginalPrice`} label="Prix Original (MAD)">
                        <Input
                            id={`${idPrefix}OriginalPrice`}
                            type="number"
                            value={data.originalPrice || ''}
                            onChange={(e) => update('originalPrice', e.target.value)}
                            placeholder="Ex: 149.95"
                        />
                    </FormField>
                    <FormField id={`${idPrefix}DiscountedPrice`} label="Prix Réduit (MAD)">
                        <Input
                            id={`${idPrefix}DiscountedPrice`}
                            type="number"
                            value={data.discountedPrice || ''}
                            onChange={(e) => update('discountedPrice', e.target.value)}
                            placeholder="Ex: 139.95"
                        />
                    </FormField>
                    <p className="text-xs text-yellow-700 col-span-2">
                        ⚠️ <strong>Important:</strong> Ces prix remplacent le "Prix Normal" pour les produits vedettes uniquement. Le
                        prix normal reste pour les produits non-vedettes.
                    </p>
                </div>
            )}

            {mode === 'edit' && existingImages && onRemoveExistingImage && onReorderExistingImages && (
                <div className="space-y-4 border-t pt-4 mt-4">
                    <h3 className="font-medium">Gestion des Images</h3>
                    <ExistingImageGrid images={existingImages} onReorder={onReorderExistingImages} onRemove={onRemoveExistingImage} />
                </div>
            )}

            <div>
                <Label htmlFor={`${idPrefix}Images`}>{mode === 'edit' ? 'Ajouter de nouvelles images' : 'Images'}</Label>
                <Input
                    id={`${idPrefix}Images`}
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => onImagesChange(Array.from(e.target.files || []))}
                    className={mode === 'edit' ? 'mt-1' : ''}
                />
                <p className="text-xs text-gray-500 mt-1">
                    {mode === 'edit'
                        ? 'Les nouvelles images seront ajoutées après les images existantes'
                        : 'Vous pouvez sélectionner plusieurs images'}
                </p>
                <ImagePreviewGrid images={productImages} onReorder={onReorderImages} onRemove={onRemoveImage} />
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {loadingLabel}
                    </>
                ) : (
                    submitLabel
                )}
            </Button>
        </form>
    );
}
