'use client';

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Package, Calendar, Plus, Edit, Trash2, Loader2, LogOut, Trash, Star } from 'lucide-react';

import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { AdminPWAInstallPrompt } from '@/components/AdminPWAInstallPrompt';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { ProductForm, ProductFormData } from '@/components/ProductForm';
import { subcategories } from '@/lib/data';
import { formatPrice } from '@/lib/utils-bike';
import { useProducts } from '@/hooks/useProducts';
import { useBookings } from '@/hooks/useBookings';
import { productService } from '@/services/productService';
import { bookingService } from '@/services/bookingService';
import { authService } from '@/services/authService';
import { Product } from '@/lib/types';

// HELPERS
function prepareProductData(data: ProductFormData, isNew: boolean, displayOrder?: number, slug?: string) {
  const toNumber = (val: string | number | undefined) => (typeof val === 'string' ? parseFloat(val) : val);
  const toInt = (val: string | number) => (typeof val === 'string' ? parseInt(val) : val);

  const productData: Record<string, unknown> = {
    nameFr: data.nameFr,
    nameEn: data.nameEn || data.nameFr,
    nameAr: data.nameAr || data.nameFr,
    categoryId: data.categoryId,
    price: toNumber(data.price),
    stockQuantity: toInt(data.stockQuantity),
    descriptionFr: data.descriptionFr,
    descriptionEn: data.descriptionEn || data.descriptionFr,
    descriptionAr: data.descriptionAr || data.nameFr,
    isFeatured: data.isFeatured,
    isAvailable: toInt(data.stockQuantity) > 0,
  };

  if (isNew) {
    productData.slug = slug;
    productData.images = [];
    productData.specifications = {};
    productData.displayOrder = displayOrder;
  }

  if (data.subcategoryId) productData.subcategoryId = data.subcategoryId;
  if (data.isFeatured && data.originalPrice) productData.originalPrice = toNumber(data.originalPrice);
  if (data.isFeatured && data.discountedPrice) productData.discountedPrice = toNumber(data.discountedPrice);

  return productData as any;
}

const STATUS_LABELS: Record<string, string> = {
  pending: 'En attente',
  confirmed: 'Confirmé',
  completed: 'Terminé',
  cancelled: 'Annulé',
};

const STATUS_BADGE_VARIANT: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  confirmed: 'default',
  completed: 'secondary',
  cancelled: 'destructive',
  pending: 'outline',
};

const INITIAL_PRODUCT: ProductFormData = {
  nameFr: '',
  nameEn: '',
  nameAr: '',
  categoryId: '',
  subcategoryId: '',
  price: '',
  stockQuantity: '',
  descriptionFr: '',
  descriptionEn: '',
  descriptionAr: '',
  isFeatured: false,
  originalPrice: '',
  discountedPrice: '',
};

// SUB-COMPONENTS
function StatCard({ title, value, subtitle, icon: Icon, valueClass }: {
  title: string;
  value: number;
  subtitle: string;
  icon: typeof Package;
  valueClass?: string;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-gray-500" />
      </CardHeader>
      <CardContent>
        <div className={`text-2xl font-bold ${valueClass || ''}`}>{value}</div>
        <p className="text-xs text-gray-500">{subtitle}</p>
      </CardContent>
    </Card>
  );
}

function ProductListItem({
  product,
  isSelected,
  onSelect,
  onEdit,
  onDelete,
}: {
  product: Product;
  isSelected: boolean;
  onSelect: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const subcategory = subcategories.find((s) => s.id === product.subcategoryId);

  return (
    <Card className={isSelected ? 'border-green-500 ring-1 ring-green-500' : ''}>
      <CardContent className="flex items-center gap-4 p-4">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={onSelect}
          className="h-5 w-5 rounded border-gray-300 text-green-600 focus:ring-green-500 cursor-pointer"
        />
        {product.images?.[0] && (
          <img src={product.images[0]} alt={product.nameFr} className="w-20 h-20 object-cover rounded" />
        )}
        <div className="flex-1">
          <h3 className="font-semibold">{product.nameFr}</h3>
          {product.isFeatured && product.discountedPrice && product.originalPrice ? (
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <p className="text-sm font-bold text-red-600">{formatPrice(product.discountedPrice)}</p>
                <p className="text-xs text-gray-400 line-through">{formatPrice(product.originalPrice)}</p>
              </div>
              <p className="text-xs text-red-600">Économie: {formatPrice(product.originalPrice - product.discountedPrice)}</p>
            </div>
          ) : (
            <p className="text-sm text-gray-600">{formatPrice(product.price)}</p>
          )}
          {subcategory && <p className="text-xs text-gray-500">{subcategory.nameFr}</p>}
          <div className="flex gap-2 mt-1">
            <Badge variant={product.stockQuantity > 5 ? 'default' : 'secondary'}>Stock: {product.stockQuantity}</Badge>
            {product.isFeatured && <Badge className="bg-green-600">Vedette</Badge>}
            {product.viewCount && product.viewCount > 0 && (
              <Badge variant="outline" className="text-blue-600">👁️ {product.viewCount} vues</Badge>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={onEdit}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="outline" className="text-red-600" onClick={onDelete}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function BookingCard({
  booking,
  onConfirm,
  onCancel,
}: {
  booking: any;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="font-semibold">{booking.customerName}</h3>
            <p className="text-sm text-gray-600">{booking.customerPhone}</p>
            <p className="text-sm text-gray-600">{booking.customerEmail}</p>
          </div>
          <Badge variant={STATUS_BADGE_VARIANT[booking.status] || 'outline'}>{STATUS_LABELS[booking.status] || booking.status}</Badge>
        </div>
        <p className="text-sm mb-1"><strong>Service:</strong> {booking.serviceName}</p>
        <p className="text-sm mb-2"><strong>Date:</strong> {booking.date}</p>
        {booking.message && <p className="text-sm mb-2"><strong>Message:</strong> {booking.message}</p>}
        <p className="text-xs text-gray-500 mb-3">Créé le: {booking.createdAt?.toDate().toLocaleString('fr-FR')}</p>
        {booking.status === 'pending' && (
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={onConfirm}>Confirmer</Button>
            <Button size="sm" variant="outline" className="text-red-600" onClick={onCancel}>Annuler</Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function BulkActionsBar({
  count,
  onFeature,
  onDelete,
  onClear,
}: {
  count: number;
  onFeature: () => void;
  onDelete: () => void;
  onClear: () => void;
}) {
  if (count === 0) return null;

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-white border shadow-lg rounded-full px-6 py-3 flex items-center gap-4 z-50 animate-in slide-in-from-bottom-5">
      <span className="font-medium text-sm text-gray-600">{count} sélectionné(s)</span>
      <div className="h-4 w-px bg-gray-200" />
      <Button variant="ghost" size="sm" onClick={onFeature} className="text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50">
        <Star className="mr-2 h-4 w-4" /> Mettre en vedette
      </Button>
      <Button variant="ghost" size="sm" onClick={onDelete} className="text-red-600 hover:text-red-700 hover:bg-red-50">
        <Trash className="mr-2 h-4 w-4" /> Supprimer
      </Button>
      <div className="h-4 w-px bg-gray-200" />
      <Button variant="ghost" size="sm" onClick={onClear}>Annuler</Button>
    </div>
  );
}

// MAIN COMPONENT
export default function AdminPage() {
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState('dashboard');
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [isEditProductOpen, setIsEditProductOpen] = useState(false);
  const [deleteProductId, setDeleteProductId] = useState<string | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedProductIds, setSelectedProductIds] = useState<Set<string>>(new Set());
  const [isBulkDeleteOpen, setIsBulkDeleteOpen] = useState(false);
  const [newProduct, setNewProduct] = useState<ProductFormData>(INITIAL_PRODUCT);
  const [productImages, setProductImages] = useState<File[]>([]);

  const { products, loading: productsLoading, refreshProducts } = useProducts();
  const { bookings, loading: bookingsLoading, refreshBookings } = useBookings();

  const stats = {
    totalProducts: products.length,
    pendingBookings: bookings.filter((b) => b.status === 'pending').length,
    lowStock: products.filter((p) => p.stockQuantity <= 5).length,
  };

  // Handlers
  const handleLogout = async () => {
    try {
      await authService.logout();
      toast.success('Déconnexion réussie');
      navigate('/admin/login');
    } catch (error) {
      toast.error('Erreur lors de la déconnexion');
      console.error(error);
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const slug = productService.generateSlug(newProduct.nameFr);
      const productData = prepareProductData(newProduct, true, products.length, slug);
      await productService.createProduct(productData, productImages);
      toast.success('Produit ajouté avec succès !');
      setIsAddProductOpen(false);
      setNewProduct(INITIAL_PRODUCT);
      setProductImages([]);
      refreshProducts();
    } catch (error) {
      console.error('Error adding product:', error);
      toast.error("Erreur lors de l'ajout du produit");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    setIsSubmitting(true);
    try {
      const productData = prepareProductData(editingProduct as unknown as ProductFormData, false);
      await productService.updateProduct(editingProduct.id, productData, productImages, existingImages);
      toast.success('Produit modifié avec succès !');
      setIsEditProductOpen(false);
      setEditingProduct(null);
      setProductImages([]);
      refreshProducts();
    } catch (error) {
      toast.error('Erreur lors de la modification du produit');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteProduct = async () => {
    if (!deleteProductId) return;
    try {
      await productService.deleteProduct(deleteProductId);
      toast.success('Produit supprimé avec succès !');
      setDeleteProductId(null);
      refreshProducts();
    } catch (error) {
      toast.error('Erreur lors de la suppression du produit');
      console.error(error);
    }
  };

  const handleUpdateBookingStatus = async (bookingId: string, status: 'confirmed' | 'completed' | 'cancelled') => {
    try {
      await bookingService.updateBookingStatus(bookingId, status);
      toast.success('Statut de la réservation mis à jour !');
      refreshBookings();
    } catch (error) {
      toast.error('Erreur lors de la mise à jour du statut');
      console.error(error);
    }
  };

  const openEditDialog = (product: Product) => {
    setEditingProduct(product);
    setExistingImages(product.images || []);
    setProductImages([]);
    setIsEditProductOpen(true);
  };

  // Bulk selection
  const toggleSelectAll = () => {
    setSelectedProductIds(selectedProductIds.size === products.length ? new Set() : new Set(products.map((p) => p.id)));
  };

  const toggleSelectProduct = (productId: string) => {
    const newSelected = new Set(selectedProductIds);
    newSelected.has(productId) ? newSelected.delete(productId) : newSelected.add(productId);
    setSelectedProductIds(newSelected);
  };

  const handleBulkDelete = async () => {
    if (selectedProductIds.size === 0) return;
    setIsSubmitting(true);
    try {
      await Promise.all(Array.from(selectedProductIds).map((id) => productService.deleteProduct(id)));
      toast.success(`${selectedProductIds.size} produits supprimés`);
      setSelectedProductIds(new Set());
      setIsBulkDeleteOpen(false);
      refreshProducts();
    } catch (error) {
      toast.error('Erreur lors de la suppression');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBulkToggleFeatured = async () => {
    if (selectedProductIds.size === 0) return;
    setIsSubmitting(true);
    try {
      const selected = products.filter((p) => selectedProductIds.has(p.id));
      const newState = !selected.every((p) => p.isFeatured);
      await Promise.all(Array.from(selectedProductIds).map((id) => productService.updateProduct(id, { isFeatured: newState })));
      toast.success(`Produits ${newState ? 'mis en vedette' : 'retirés des vedettes'}`);
      refreshProducts();
    } catch (error) {
      toast.error('Erreur lors de la mise à jour');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-1">
        <section className="bg-gradient-to-r from-gray-800 to-gray-900 text-white py-8">
          <div className="container">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold mb-2">Tableau de Bord Admin</h1>
                <p className="text-gray-300">Gérez votre magasin facilement</p>
              </div>
              <Button variant="outline" onClick={handleLogout} className="bg-white/10 hover:bg-white/20 text-white border-white/20">
                <LogOut className="mr-2 h-4 w-4" /> Déconnexion
              </Button>
            </div>
          </div>
        </section>

        <div className="container py-8">
          <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
            <TabsList className="grid grid-cols-3 gap-2">
              <TabsTrigger value="dashboard" className="flex items-center gap-2">
                <Package className="h-4 w-4" /><span className="hidden sm:inline">Dashboard</span>
              </TabsTrigger>
              <TabsTrigger value="products" className="flex items-center gap-2">
                <Package className="h-4 w-4" /><span className="hidden sm:inline">Produits</span>
              </TabsTrigger>
              <TabsTrigger value="bookings" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" /><span className="hidden sm:inline">Réservations</span>
              </TabsTrigger>
            </TabsList>

            {/* Dashboard Tab */}
            <TabsContent value="dashboard" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <StatCard title="Produits" value={stats.totalProducts} subtitle="Total en catalogue" icon={Package} />
                <StatCard title="Réservations" value={stats.pendingBookings} subtitle="À confirmer" icon={Calendar} />
                <StatCard title="Stock Bas" value={stats.lowStock} subtitle="Produits à réapprovisionner" icon={Package} valueClass="text-orange-600" />
              </div>
              <Card>
                <CardHeader><CardTitle>Actions Rapides</CardTitle></CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button onClick={() => setSelectedTab('products')} className="w-full"><Plus className="mr-2 h-4 w-4" /> Ajouter un Produit</Button>
                  <Button variant="outline" onClick={() => setSelectedTab('bookings')} className="w-full"><Calendar className="mr-2 h-4 w-4" /> Gérer les Réservations</Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Products Tab */}
            <TabsContent value="products" className="space-y-6">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <h2 className="text-2xl font-bold">Gestion des Produits</h2>
                  <div className="flex items-center space-x-2 bg-white px-3 py-1.5 rounded-md border shadow-sm">
                    <input
                      type="checkbox"
                      id="selectAll"
                      checked={products.length > 0 && selectedProductIds.size === products.length}
                      onChange={toggleSelectAll}
                      className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                    />
                    <Label htmlFor="selectAll" className="text-sm cursor-pointer">Tout sélectionner ({selectedProductIds.size})</Label>
                  </div>
                </div>
                <Dialog open={isAddProductOpen} onOpenChange={setIsAddProductOpen}>
                  <DialogTrigger asChild>
                    <Button><Plus className="mr-2 h-4 w-4" /> Ajouter un Produit</Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Ajouter un Nouveau Produit</DialogTitle>
                      <DialogDescription>Remplissez les informations du produit ci-dessous</DialogDescription>
                    </DialogHeader>
                    <ProductForm
                      mode="add"
                      data={newProduct}
                      onChange={setNewProduct}
                      onSubmit={handleAddProduct}
                      isSubmitting={isSubmitting}
                      submitLabel="Ajouter le Produit"
                      loadingLabel="Ajout en cours..."
                      productImages={productImages}
                      onImagesChange={setProductImages}
                      onRemoveImage={(i) => setProductImages((prev) => prev.filter((_, idx) => idx !== i))}
                      onReorderImages={setProductImages}
                    />
                  </DialogContent>
                </Dialog>
              </div>

              {productsLoading ? (
                <div className="flex justify-center items-center py-12"><Loader2 className="h-8 w-8 animate-spin text-green-600" /></div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {products.map((product) => (
                    <ProductListItem
                      key={product.id}
                      product={product}
                      isSelected={selectedProductIds.has(product.id)}
                      onSelect={() => toggleSelectProduct(product.id)}
                      onEdit={() => openEditDialog(product)}
                      onDelete={() => setDeleteProductId(product.id)}
                    />
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Bookings Tab */}
            <TabsContent value="bookings" className="space-y-6">
              <h2 className="text-2xl font-bold">Réservations de Services</h2>
              {bookingsLoading ? (
                <div className="flex justify-center items-center py-12"><Loader2 className="h-8 w-8 animate-spin text-green-600" /></div>
              ) : bookings.length === 0 ? (
                <Card><CardContent className="p-8 text-center text-gray-500">Aucune réservation pour le moment</CardContent></Card>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {bookings.map((booking) => (
                    <BookingCard
                      key={booking.id}
                      booking={booking}
                      onConfirm={() => handleUpdateBookingStatus(booking.id, 'confirmed')}
                      onCancel={() => handleUpdateBookingStatus(booking.id, 'cancelled')}
                    />
                  ))}
                </div>
              )}
            </TabsContent>

            <BulkActionsBar
              count={selectedProductIds.size}
              onFeature={handleBulkToggleFeatured}
              onDelete={() => setIsBulkDeleteOpen(true)}
              onClear={() => setSelectedProductIds(new Set())}
            />
          </Tabs>
        </div>
      </main>

      <AdminPWAInstallPrompt />

      {/* Edit Product Dialog */}
      <Dialog open={isEditProductOpen} onOpenChange={setIsEditProductOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Modifier le Produit</DialogTitle>
            <DialogDescription>Modifiez les informations du produit ci-dessous</DialogDescription>
          </DialogHeader>
          {editingProduct && (
            <ProductForm
              mode="edit"
              data={editingProduct as unknown as ProductFormData}
              onChange={(data) => setEditingProduct({ ...editingProduct, ...data } as Product)}
              onSubmit={handleEditProduct}
              isSubmitting={isSubmitting}
              submitLabel="Modifier le Produit"
              loadingLabel="Modification en cours..."
              productImages={productImages}
              onImagesChange={setProductImages}
              onRemoveImage={(i) => setProductImages((prev) => prev.filter((_, idx) => idx !== i))}
              onReorderImages={setProductImages}
              existingImages={existingImages}
              onRemoveExistingImage={(i) => setExistingImages((prev) => prev.filter((_, idx) => idx !== i))}
              onReorderExistingImages={setExistingImages}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteProductId} onOpenChange={() => setDeleteProductId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
            <AlertDialogDescription>Cette action est irréversible. Le produit et ses images seront définitivement supprimés.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteProduct} className="bg-red-600 hover:bg-red-700">Supprimer</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Bulk Delete Confirmation */}
      <AlertDialog open={isBulkDeleteOpen} onOpenChange={setIsBulkDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer {selectedProductIds.size} produits ?</AlertDialogTitle>
            <AlertDialogDescription>Cette action est irréversible. Les produits sélectionnés et leurs images seront définitivement supprimés.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleBulkDelete} className="bg-red-600 hover:bg-red-700">
              {isSubmitting ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Suppression...</>) : 'Supprimer définitivement'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Footer />
    </div>
  );
}
