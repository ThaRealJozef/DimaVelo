'use client';

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { AdminPWAInstallPrompt } from '@/components/AdminPWAInstallPrompt';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { categories, subcategories } from '@/lib/data';
import { formatPrice } from '@/lib/utils-bike';
import { Package, Calendar, Plus, Edit, Trash2, Loader2, LogOut } from 'lucide-react';
import { toast } from 'sonner';
import { useProducts } from '@/hooks/useProducts';
import { useBookings } from '@/hooks/useBookings';
import { productService } from '@/services/productService';
import { bookingService } from '@/services/bookingService';
import { authService } from '@/services/authService';
import { Product } from '@/lib/types';
import { ImagePreviewGrid } from '@/components/ImagePreviewGrid';
import { ExistingImageGrid } from '@/components/ExistingImageGrid';

export default function AdminPage() {
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState('dashboard');
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [isEditProductOpen, setIsEditProductOpen] = useState(false);
  const [deleteProductId, setDeleteProductId] = useState<string | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { products, loading: productsLoading, refreshProducts } = useProducts();
  const { bookings, loading: bookingsLoading, refreshBookings } = useBookings();

  // Form states for adding product
  const [newProduct, setNewProduct] = useState({
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
  });
  const [productImages, setProductImages] = useState<File[]>([]);

  // Handle logout
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

  // Get subcategories for selected category
  const getSubcategoriesForCategory = (categoryId: string) => {
    return subcategories.filter(sub => sub.parentCategoryId === categoryId);
  };

  // Get subcategory name
  const getSubcategoryName = (subcategoryId: string) => {
    const subcategory = subcategories.find(sub => sub.id === subcategoryId);
    return subcategory?.nameFr || '';
  };

  // Statistics
  const stats = {
    totalProducts: products.length,
    pendingBookings: bookings.filter(b => b.status === 'pending').length,
    lowStock: products.filter(p => p.stockQuantity <= 5).length,
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const slug = productService.generateSlug(newProduct.nameFr);

      await productService.createProduct(
        {
          nameFr: newProduct.nameFr,
          nameEn: newProduct.nameEn || newProduct.nameFr,
          nameAr: newProduct.nameAr || newProduct.nameFr,
          slug,
          categoryId: newProduct.categoryId,
          subcategoryId: newProduct.subcategoryId || undefined,
          price: parseFloat(newProduct.price),
          stockQuantity: parseInt(newProduct.stockQuantity),
          descriptionFr: newProduct.descriptionFr,
          descriptionEn: newProduct.descriptionEn || newProduct.descriptionFr,
          descriptionAr: newProduct.descriptionAr || newProduct.nameFr,
          images: [],
          specifications: {},
          isAvailable: parseInt(newProduct.stockQuantity) > 0,
          isFeatured: newProduct.isFeatured,
          displayOrder: products.length,
        },
        productImages
      );

      toast.success('Produit ajouté avec succès !');
      setIsAddProductOpen(false);
      resetForm();
      refreshProducts();
    } catch (error) {
      console.error('Error adding product:', error);
      toast.error('Erreur lors de l\'ajout du produit');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    setIsSubmitting(true);

    try {
      await productService.updateProduct(
        editingProduct.id,
        {
          nameFr: editingProduct.nameFr,
          nameEn: editingProduct.nameEn,
          nameAr: editingProduct.nameAr,
          categoryId: editingProduct.categoryId,
          subcategoryId: editingProduct.subcategoryId || undefined,
          price: editingProduct.price,
          stockQuantity: editingProduct.stockQuantity,
          descriptionFr: editingProduct.descriptionFr,
          descriptionEn: editingProduct.descriptionEn,
          descriptionAr: editingProduct.descriptionAr,
          isFeatured: editingProduct.isFeatured,
          isAvailable: editingProduct.stockQuantity > 0,
        },
        productImages,
        existingImages // Pass the ordered list of existing images
      );

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

  const resetForm = () => {
    setNewProduct({
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
    });
    setProductImages([]);
  };

  // Handle image removal
  const handleRemoveImage = (index: number) => {
    setProductImages(prev => prev.filter((_, i) => i !== index));
  };

  // Handle image reordering
  const handleReorderImages = (newOrder: File[]) => {
    setProductImages(newOrder);
  };

  // Handle existing image removal (for edit mode)
  const handleRemoveExistingImage = (index: number) => {
    setExistingImages(prev => prev.filter((_, i) => i !== index));
  };

  // Handle existing image reordering (for edit mode)
  const handleReorderExistingImages = (newOrder: string[]) => {
    setExistingImages(newOrder);
  };

  const openEditDialog = (product: Product) => {
    setEditingProduct(product);
    setExistingImages(product.images || []);
    setProductImages([]); // Reset new images
    setIsEditProductOpen(true);
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'pending':
        return 'secondary';
      case 'confirmed':
        return 'default';
      case 'completed':
        return 'default';
      case 'cancelled':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      pending: 'En attente',
      confirmed: 'Confirmé',
      completed: 'Terminé',
      cancelled: 'Annulé',
    };
    return labels[status] || status;
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-1">
        {/* Hero Admin */}
        <section className="bg-gradient-to-r from-gray-800 to-gray-900 text-white py-8">
          <div className="container">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold mb-2">Tableau de Bord Admin</h1>
                <p className="text-gray-300">Gérez votre magasin facilement</p>
              </div>
              <Button
                variant="outline"
                onClick={handleLogout}
                className="bg-white/10 hover:bg-white/20 text-white border-white/20"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Déconnexion
              </Button>
            </div>
          </div>
        </section>

        <div className="container py-8">
          <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
            <TabsList className="grid grid-cols-3 gap-2">
              <TabsTrigger value="dashboard" className="flex items-center gap-2">
                <Package className="h-4 w-4" />
                <span className="hidden sm:inline">Dashboard</span>
              </TabsTrigger>
              <TabsTrigger value="products" className="flex items-center gap-2">
                <Package className="h-4 w-4" />
                <span className="hidden sm:inline">Produits</span>
              </TabsTrigger>
              <TabsTrigger value="bookings" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span className="hidden sm:inline">Réservations</span>
              </TabsTrigger>
            </TabsList>

            {/* Dashboard */}
            <TabsContent value="dashboard" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Produits</CardTitle>
                    <Package className="h-4 w-4 text-gray-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.totalProducts}</div>
                    <p className="text-xs text-gray-500">Total en catalogue</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Réservations</CardTitle>
                    <Calendar className="h-4 w-4 text-gray-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.pendingBookings}</div>
                    <p className="text-xs text-gray-500">À confirmer</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Stock Bas</CardTitle>
                    <Package className="h-4 w-4 text-orange-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-orange-600">{stats.lowStock}</div>
                    <p className="text-xs text-gray-500">Produits à réapprovisionner</p>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Actions Rapides</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button onClick={() => setSelectedTab('products')} className="w-full">
                    <Plus className="mr-2 h-4 w-4" />
                    Ajouter un Produit
                  </Button>
                  <Button variant="outline" onClick={() => setSelectedTab('bookings')} className="w-full">
                    <Calendar className="mr-2 h-4 w-4" />
                    Gérer les Réservations
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Produits */}
            <TabsContent value="products" className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Gestion des Produits</h2>
                <Dialog open={isAddProductOpen} onOpenChange={setIsAddProductOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Ajouter un Produit
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Ajouter un Nouveau Produit</DialogTitle>
                      <DialogDescription>
                        Remplissez les informations du produit ci-dessous
                      </DialogDescription>
                    </DialogHeader>
                    <form className="space-y-4 mt-4" onSubmit={handleAddProduct}>
                      <div>
                        <Label htmlFor="productNameFr">Nom du Produit (Français) *</Label>
                        <Input
                          id="productNameFr"
                          value={newProduct.nameFr}
                          onChange={(e) => setNewProduct({ ...newProduct, nameFr: e.target.value })}
                          placeholder="Ex: VTT Giant Talon 3"
                          required
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="productNameEn">Nom (Anglais)</Label>
                          <Input
                            id="productNameEn"
                            value={newProduct.nameEn}
                            onChange={(e) => setNewProduct({ ...newProduct, nameEn: e.target.value })}
                            placeholder="Mountain Bike Giant Talon 3"
                          />
                        </div>
                        <div>
                          <Label htmlFor="productNameAr">Nom (Arabe)</Label>
                          <Input
                            id="productNameAr"
                            value={newProduct.nameAr}
                            onChange={(e) => setNewProduct({ ...newProduct, nameAr: e.target.value })}
                            placeholder="دراجة جبلية جاينت تالون 3"
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="category">Catégorie *</Label>
                        <Select
                          value={newProduct.categoryId}
                          onValueChange={(value) => setNewProduct({ ...newProduct, categoryId: value, subcategoryId: '' })}
                          required
                        >
                          <SelectTrigger id="category">
                            <SelectValue placeholder="Sélectionnez une catégorie" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map((cat) => (
                              <SelectItem key={cat.id} value={cat.id}>{cat.nameFr}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      {newProduct.categoryId && getSubcategoriesForCategory(newProduct.categoryId).length > 0 && (
                        <div>
                          <Label htmlFor="subcategory">Sous-catégorie *</Label>
                          <Select
                            value={newProduct.subcategoryId}
                            onValueChange={(value) => setNewProduct({ ...newProduct, subcategoryId: value })}
                            required
                          >
                            <SelectTrigger id="subcategory">
                              <SelectValue placeholder="Sélectionnez une sous-catégorie" />
                            </SelectTrigger>
                            <SelectContent>
                              {getSubcategoriesForCategory(newProduct.categoryId).map((sub) => (
                                <SelectItem key={sub.id} value={sub.id}>{sub.nameFr}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="price">Prix (MAD) *</Label>
                          <Input
                            id="price"
                            type="number"
                            value={newProduct.price}
                            onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                            placeholder="12990"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="stock">Stock *</Label>
                          <Input
                            id="stock"
                            type="number"
                            value={newProduct.stockQuantity}
                            onChange={(e) => setNewProduct({ ...newProduct, stockQuantity: e.target.value })}
                            placeholder="5"
                            required
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="descriptionFr">Description (Français) *</Label>
                        <Textarea
                          id="descriptionFr"
                          value={newProduct.descriptionFr}
                          onChange={(e) => setNewProduct({ ...newProduct, descriptionFr: e.target.value })}
                          rows={3}
                          placeholder="Description du produit..."
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="descriptionEn">Description (Anglais)</Label>
                        <Textarea
                          id="descriptionEn"
                          value={newProduct.descriptionEn}
                          onChange={(e) => setNewProduct({ ...newProduct, descriptionEn: e.target.value })}
                          rows={2}
                          placeholder="Product description..."
                        />
                      </div>
                      <div>
                        <Label htmlFor="descriptionAr">Description (Arabe)</Label>
                        <Textarea
                          id="descriptionAr"
                          value={newProduct.descriptionAr}
                          onChange={(e) => setNewProduct({ ...newProduct, descriptionAr: e.target.value })}
                          rows={2}
                          placeholder="وصف المنتج..."
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="isFeatured"
                          checked={newProduct.isFeatured}
                          onChange={(e) => setNewProduct({ ...newProduct, isFeatured: e.target.checked })}
                          className="rounded"
                        />
                        <Label htmlFor="isFeatured">Produit vedette (afficher sur la page d'accueil)</Label>
                      </div>
                      <div>
                        <Label htmlFor="images">Images</Label>
                        <Input
                          id="images"
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={(e) => setProductImages(Array.from(e.target.files || []))}
                        />
                        <p className="text-xs text-gray-500 mt-1">Vous pouvez sélectionner plusieurs images</p>

                        {/* Image Preview Grid with Drag-and-Drop */}
                        <ImagePreviewGrid
                          images={productImages}
                          onReorder={handleReorderImages}
                          onRemove={handleRemoveImage}
                        />
                      </div>
                      <Button type="submit" className="w-full" disabled={isSubmitting}>
                        {isSubmitting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Ajout en cours...
                          </>
                        ) : (
                          'Ajouter le Produit'
                        )}
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>

              {productsLoading ? (
                <div className="flex justify-center items-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-green-600" />
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {products.map((product) => (
                    <Card key={product.id}>
                      <CardContent className="flex items-center gap-4 p-4">
                        {product.images && product.images[0] && (
                          <img
                            src={product.images[0]}
                            alt={product.nameFr}
                            className="w-20 h-20 object-cover rounded"
                          />
                        )}
                        <div className="flex-1">
                          <h3 className="font-semibold">{product.nameFr}</h3>
                          <p className="text-sm text-gray-600">{formatPrice(product.price)}</p>
                          {product.subcategoryId && (
                            <p className="text-xs text-gray-500">
                              {getSubcategoryName(product.subcategoryId)}
                            </p>
                          )}
                          <Badge variant={product.stockQuantity > 5 ? 'default' : 'secondary'}>
                            Stock: {product.stockQuantity}
                          </Badge>
                          {product.isFeatured && (
                            <Badge variant="default" className="ml-2 bg-green-600">
                              Vedette
                            </Badge>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => openEditDialog(product)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600"
                            onClick={() => setDeleteProductId(product.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Réservations */}
            <TabsContent value="bookings" className="space-y-6">
              <h2 className="text-2xl font-bold">Réservations de Services</h2>
              {bookingsLoading ? (
                <div className="flex justify-center items-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-green-600" />
                </div>
              ) : bookings.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center text-gray-500">
                    Aucune réservation pour le moment
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {bookings.map((booking) => (
                    <Card key={booking.id}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="font-semibold">{booking.customerName}</h3>
                            <p className="text-sm text-gray-600">{booking.customerPhone}</p>
                            <p className="text-sm text-gray-600">{booking.customerEmail}</p>
                          </div>
                          <Badge variant={getStatusBadgeVariant(booking.status)}>
                            {getStatusLabel(booking.status)}
                          </Badge>
                        </div>
                        <p className="text-sm mb-1">
                          <strong>Service:</strong> {booking.serviceName}
                        </p>
                        <p className="text-sm mb-2">
                          <strong>Date:</strong> {booking.date}
                        </p>
                        {booking.message && (
                          <p className="text-sm mb-2">
                            <strong>Message:</strong> {booking.message}
                          </p>
                        )}
                        <p className="text-xs text-gray-500 mb-3">
                          Créé le: {booking.createdAt?.toDate().toLocaleString('fr-FR')}
                        </p>
                        {booking.status === 'pending' && (
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleUpdateBookingStatus(booking.id, 'confirmed')}
                            >
                              Confirmer
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-red-600"
                              onClick={() => handleUpdateBookingStatus(booking.id, 'cancelled')}
                            >
                              Annuler
                            </Button>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {/* Admin PWA Install Prompt - Only on admin pages */}
      <AdminPWAInstallPrompt />

      {/* Edit Product Dialog */}
      <Dialog open={isEditProductOpen} onOpenChange={setIsEditProductOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Modifier le Produit</DialogTitle>
            <DialogDescription>
              Modifiez les informations du produit ci-dessous
            </DialogDescription>
          </DialogHeader>
          {editingProduct && (
            <form className="space-y-4 mt-4" onSubmit={handleEditProduct}>
              <div>
                <Label htmlFor="editProductNameFr">Nom du Produit (Français) *</Label>
                <Input
                  id="editProductNameFr"
                  value={editingProduct.nameFr}
                  onChange={(e) => setEditingProduct({ ...editingProduct, nameFr: e.target.value })}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="editProductNameEn">Nom (Anglais)</Label>
                  <Input
                    id="editProductNameEn"
                    value={editingProduct.nameEn}
                    onChange={(e) => setEditingProduct({ ...editingProduct, nameEn: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="editProductNameAr">Nom (Arabe)</Label>
                  <Input
                    id="editProductNameAr"
                    value={editingProduct.nameAr}
                    onChange={(e) => setEditingProduct({ ...editingProduct, nameAr: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="editCategory">Catégorie *</Label>
                <Select
                  value={editingProduct.categoryId}
                  onValueChange={(value) => setEditingProduct({ ...editingProduct, categoryId: value, subcategoryId: '' })}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une catégorie" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>{cat.nameFr}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>



              {editingProduct.categoryId && getSubcategoriesForCategory(editingProduct.categoryId).length > 0 && (
                <div>
                  <Label htmlFor="editSubcategory">Sous-catégorie *</Label>
                  <Select
                    value={editingProduct.subcategoryId || ''}
                    onValueChange={(value) => setEditingProduct({ ...editingProduct, subcategoryId: value })}
                    required
                  >
                    <SelectTrigger id="editSubcategory">
                      <SelectValue placeholder="Sélectionnez une sous-catégorie" />
                    </SelectTrigger>
                    <SelectContent>
                      {getSubcategoriesForCategory(editingProduct.categoryId).map((sub) => (
                        <SelectItem key={sub.id} value={sub.id}>{sub.nameFr}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="editPrice">Prix (MAD) *</Label>
                  <Input
                    id="editPrice"
                    type="number"
                    value={editingProduct.price}
                    onChange={(e) => setEditingProduct({ ...editingProduct, price: parseFloat(e.target.value) })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="editStock">Stock *</Label>
                  <Input
                    id="editStock"
                    type="number"
                    value={editingProduct.stockQuantity}
                    onChange={(e) => setEditingProduct({ ...editingProduct, stockQuantity: parseInt(e.target.value) })}
                    required
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="editDescriptionFr">Description (Français) *</Label>
                <Textarea
                  id="editDescriptionFr"
                  value={editingProduct.descriptionFr}
                  onChange={(e) => setEditingProduct({ ...editingProduct, descriptionFr: e.target.value })}
                  rows={3}
                  required
                />
              </div>
              <div>
                <Label htmlFor="editDescriptionEn">Description (Anglais)</Label>
                <Textarea
                  id="editDescriptionEn"
                  value={editingProduct.descriptionEn}
                  onChange={(e) => setEditingProduct({ ...editingProduct, descriptionEn: e.target.value })}
                  rows={2}
                />
              </div>
              <div>
                <Label htmlFor="editDescriptionAr">Description (Arabe)</Label>
                <Textarea
                  id="editDescriptionAr"
                  value={editingProduct.descriptionAr}
                  onChange={(e) => setEditingProduct({ ...editingProduct, descriptionAr: e.target.value })}
                  rows={2}
                />
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="editIsFeatured"
                  checked={editingProduct.isFeatured}
                  onChange={(e) => setEditingProduct({ ...editingProduct, isFeatured: e.target.checked })}
                  className="rounded"
                />
                <Label htmlFor="editIsFeatured">Produit vedette</Label>
              </div>
              {/* Image Management Section */}
              <div className="space-y-4 border-t pt-4 mt-4">
                <h3 className="font-medium">Gestion des Images</h3>

                {/* Existing Images Grid */}
                <ExistingImageGrid
                  images={existingImages}
                  onReorder={handleReorderExistingImages}
                  onRemove={handleRemoveExistingImage}
                />

                {/* New Image Upload */}
                <div>
                  <Label htmlFor="editImages">Ajouter de nouvelles images</Label>
                  <Input
                    id="editImages"
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => setProductImages(Array.from(e.target.files || []))}
                    className="mt-1"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Les nouvelles images seront ajoutées après les images existantes
                  </p>

                  {/* New Images Preview Grid */}
                  <ImagePreviewGrid
                    images={productImages}
                    onReorder={handleReorderImages}
                    onRemove={handleRemoveImage}
                  />
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Modification en cours...
                  </>
                ) : (
                  'Modifier le Produit'
                )}
              </Button>
            </form>
          )}
        </DialogContent>
      </Dialog >

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteProductId} onOpenChange={() => setDeleteProductId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. Le produit et ses images seront définitivement supprimés.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteProduct} className="bg-red-600 hover:bg-red-700">
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog >

      <Footer />
    </div >
  );
}
