import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useCart } from '@/contexts/CartContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { ShoppingCart, Plus, Minus, Trash2, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

// WhatsApp number - DimaVelo business contact
const WHATSAPP_NUMBER = '+212631532200';

export default function CartPage() {
    const { t } = useLanguage();
    const navigate = useNavigate();
    const { cartItems, updateQuantity, removeFromCart, getCartTotal } = useCart();

    const [customerInfo, setCustomerInfo] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        notes: '',
    });

    const handleQuantityChange = (productId: string, newQuantity: number) => {
        if (newQuantity < 1) return;
        updateQuantity(productId, newQuantity);
    };

    const handleRemoveItem = (productId: string, productName: string) => {
        removeFromCart(productId);
        toast.success(`${productName} ${t.cart.removeFromCart}`);
    };

    const generateWhatsAppMessage = () => {
        const itemsList = cartItems.map((item, index) => {
            const price = item.discountedPrice || item.price;
            const subtotal = price * item.quantity;
            return `${index + 1}. ${item.name}
   - Quantite: ${item.quantity}
   - Prix unitaire: ${price.toLocaleString()} DH
   - Sous-total: ${subtotal.toLocaleString()} DH`;
        }).join('\n\n');

        return `*** NOUVELLE COMMANDE DIMAVELO ***

DETAILS CLIENT:
Nom: ${customerInfo.name}
Email: ${customerInfo.email || 'Non fourni'}
Telephone: ${customerInfo.phone}

COMMANDE:
----------------------------------

${itemsList}

----------------------------------
TOTAL: ${getCartTotal().toLocaleString()} DH
----------------------------------

ADRESSE DE LIVRAISON:
${customerInfo.address}

${customerInfo.notes ? `NOTES:\n${customerInfo.notes}\n\n` : ''}Merci d'avoir choisi DimaVelo!`;
    };

    const handleCheckout = (e: React.FormEvent) => {
        e.preventDefault();

        if (cartItems.length === 0) {
            toast.error('Votre panier est vide');
            return;
        }

        const message = generateWhatsAppMessage();
        const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`;

        window.open(whatsappUrl, '_blank');
    };

    if (cartItems.length === 0) {
        return (
            <div className="min-h-screen flex flex-col overflow-x-hidden w-full">
                <Header />
                <main className="flex-1 py-8 overflow-hidden">
                    <div className="container px-4">
                        <div className="max-w-2xl mx-auto text-center py-16">
                            <ShoppingCart className="h-24 w-24 mx-auto text-gray-300 mb-6" />
                            <h1 className="text-3xl font-bold mb-4">{t.cart.emptyCart}</h1>
                            <p className="text-gray-600 mb-8">{t.cart.continueShopping}</p>
                            <Button asChild className="bg-green-600 hover:bg-green-700">
                                <Link to="/categories">
                                    <ArrowLeft className="mr-2 h-4 w-4" />
                                    {t.cart.continueShopping}
                                </Link>
                            </Button>
                        </div>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col overflow-x-hidden w-full">
            <Header />
            <main className="flex-1 py-8 overflow-hidden">
                <div className="container px-4">
                    <div className="mb-6">
                        <Button asChild variant="ghost">
                            <Link to="/categories">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                {t.cart.continueShopping}
                            </Link>
                        </Button>
                    </div>

                    <h1 className="text-3xl md:text-4xl font-bold mb-8">{t.cart.title}</h1>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Cart Items */}
                        <div className="lg:col-span-2 space-y-4">
                            {cartItems.map((item) => (
                                <Card key={item.productId}>
                                    <CardContent className="p-4 md:p-6">
                                        <div className="flex gap-4">
                                            {/* Product Image */}
                                            <div className="flex-shrink-0">
                                                <img
                                                    src={item.image}
                                                    alt={item.name}
                                                    className="w-20 h-20 md:w-24 md:h-24 object-cover rounded"
                                                />
                                            </div>

                                            {/* Product Info */}
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-semibold text-lg mb-2 break-words">{item.name}</h3>

                                                <div className="flex items-center gap-4 mb-3">
                                                    {item.discountedPrice && item.originalPrice ? (
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-lg font-bold text-red-600">
                                                                {item.discountedPrice.toLocaleString()} DH
                                                            </span>
                                                            <span className="text-sm text-gray-400 line-through">
                                                                {item.originalPrice.toLocaleString()} DH
                                                            </span>
                                                        </div>
                                                    ) : (
                                                        <span className="text-lg font-bold text-green-600">
                                                            {item.price.toLocaleString()} DH
                                                        </span>
                                                    )}
                                                </div>

                                                {/* Quantity Controls */}
                                                <div className="flex items-center gap-4">
                                                    <div className="flex items-center gap-2">
                                                        <Button
                                                            variant="outline"
                                                            size="icon"
                                                            className="h-8 w-8"
                                                            onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
                                                        >
                                                            <Minus className="h-4 w-4" />
                                                        </Button>
                                                        <span className="w-12 text-center font-medium">{item.quantity}</span>
                                                        <Button
                                                            variant="outline"
                                                            size="icon"
                                                            className="h-8 w-8"
                                                            onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
                                                        >
                                                            <Plus className="h-4 w-4" />
                                                        </Button>
                                                    </div>

                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                                        onClick={() => handleRemoveItem(item.productId, item.name)}
                                                    >
                                                        <Trash2 className="h-4 w-4 mr-1" />
                                                        {t.cart.removeFromCart}
                                                    </Button>
                                                </div>

                                                {/* Item Subtotal */}
                                                <div className="mt-3 text-sm text-gray-600">
                                                    {t.cart.subtotal}: <span className="font-semibold">
                                                        {((item.discountedPrice || item.price) * item.quantity).toLocaleString()} DH
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        {/* Order Summary & Checkout Form */}
                        <div className="lg:col-span-1">
                            <Card className="sticky top-24">
                                <CardContent className="p-6">
                                    <h2 className="text-xl font-semibold mb-4">{t.cart.checkoutForm.title}</h2>
                                    <p className="text-sm text-gray-600 mb-6">{t.cart.checkoutForm.subtitle}</p>

                                    <form onSubmit={handleCheckout} className="space-y-4">
                                        <div>
                                            <Label htmlFor="name">{t.cart.checkoutForm.name} *</Label>
                                            <Input
                                                id="name"
                                                value={customerInfo.name}
                                                onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                                                placeholder={t.cart.checkoutForm.namePlaceholder}
                                                required
                                            />
                                        </div>

                                        <div>
                                            <Label htmlFor="email">{t.cart.checkoutForm.email}</Label>
                                            <Input
                                                id="email"
                                                type="email"
                                                value={customerInfo.email}
                                                onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
                                                placeholder={t.cart.checkoutForm.emailPlaceholder}
                                            />
                                        </div>

                                        <div>
                                            <Label htmlFor="phone">{t.cart.checkoutForm.phone} *</Label>
                                            <Input
                                                id="phone"
                                                type="tel"
                                                value={customerInfo.phone}
                                                onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                                                placeholder={t.cart.checkoutForm.phonePlaceholder}
                                                required
                                            />
                                        </div>

                                        <div>
                                            <Label htmlFor="address">{t.cart.checkoutForm.address} *</Label>
                                            <Textarea
                                                id="address"
                                                value={customerInfo.address}
                                                onChange={(e) => setCustomerInfo({ ...customerInfo, address: e.target.value })}
                                                placeholder={t.cart.checkoutForm.addressPlaceholder}
                                                rows={3}
                                                required
                                            />
                                        </div>

                                        <div>
                                            <Label htmlFor="notes">{t.cart.checkoutForm.notes}</Label>
                                            <Textarea
                                                id="notes"
                                                value={customerInfo.notes}
                                                onChange={(e) => setCustomerInfo({ ...customerInfo, notes: e.target.value })}
                                                placeholder={t.cart.checkoutForm.notesPlaceholder}
                                                rows={2}
                                            />
                                        </div>

                                        <div className="border-t pt-4">
                                            <div className="flex justify-between items-center mb-4">
                                                <span className="text-lg font-semibold">{t.cart.total}:</span>
                                                <div className="flex flex-col items-end">
                                                    {cartItems.reduce((acc, item) => acc + (item.originalPrice || item.price) * item.quantity, 0) > getCartTotal() ? (
                                                        <>
                                                            <span className="text-2xl font-bold text-red-600">
                                                                {getCartTotal().toLocaleString()} DH
                                                            </span>
                                                            <span className="text-sm text-gray-400 line-through">
                                                                {cartItems.reduce((acc, item) => acc + (item.originalPrice || item.price) * item.quantity, 0).toLocaleString()} DH
                                                            </span>
                                                        </>
                                                    ) : (
                                                        <span className="text-2xl font-bold text-green-600">
                                                            {getCartTotal().toLocaleString()} DH
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            <Button
                                                type="submit"
                                                className="w-full bg-green-600 hover:bg-green-700 text-lg py-6"
                                            >
                                                {t.cart.checkout}
                                            </Button>
                                        </div>
                                    </form>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
