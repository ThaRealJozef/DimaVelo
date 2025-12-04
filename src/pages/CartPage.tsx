import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Plus, Minus, Trash2, ArrowLeft, Check, ChevronsUpDown } from 'lucide-react';
import { toast } from 'sonner';

import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { DeliveryInfo } from '@/components/DeliveryInfo';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useCart } from '@/contexts/CartContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { moroccanCities } from '@/lib/moroccanCities';
import { cn } from '@/lib/utils';
import { CartItem } from '@/lib/types';

const WHATSAPP_NUMBER = '+212631532200';
const DELIVERY_FEE_STANDARD = 35;
const DELIVERY_FEE_BIKE = 100;
const FREE_SHIPPING_CITIES = ['Rabat', 'Salé', 'Kenitra'];
const BIKE_CATEGORY_ID = '1';

interface CustomerInfo {
    name: string;
    email: string;
    phone: string;
    city: string;
    address: string;
    notes: string;
}

const defaultCustomerInfo: CustomerInfo = {
    name: '',
    email: '',
    phone: '',
    city: '',
    address: '',
    notes: '',
};

function CartItemCard({
    item,
    onQuantityChange,
    onRemove,
    translations,
}: {
    item: CartItem;
    onQuantityChange: (quantity: number) => void;
    onRemove: () => void;
    translations: { subtotal: string; removeFromCart: string };
}) {
    const itemPrice = item.discountedPrice || item.price;
    const itemSubtotal = itemPrice * item.quantity;

    return (
        <Card>
            <CardContent className="p-4 md:p-6">
                <div className="flex gap-4">
                    <Link to={`/product/${item.productId}`} className="flex-shrink-0">
                        <img
                            src={item.image}
                            alt={item.name}
                            className="w-20 h-20 md:w-24 md:h-24 object-cover rounded hover:opacity-80 transition-opacity"
                        />
                    </Link>

                    <div className="flex-1 min-w-0">
                        <Link to={`/product/${item.productId}`}>
                            <h3 className="font-semibold text-lg mb-2 break-words hover:text-green-600 transition-colors">
                                {item.name}
                            </h3>
                        </Link>

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

                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={() => onQuantityChange(item.quantity - 1)}
                                >
                                    <Minus className="h-4 w-4" />
                                </Button>
                                <span className="w-12 text-center font-medium">{item.quantity}</span>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={() => onQuantityChange(item.quantity + 1)}
                                >
                                    <Plus className="h-4 w-4" />
                                </Button>
                            </div>

                            <Button
                                variant="ghost"
                                size="sm"
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                onClick={onRemove}
                            >
                                <Trash2 className="h-4 w-4 mr-1" />
                                {translations.removeFromCart}
                            </Button>
                        </div>

                        <div className="mt-3 text-sm text-gray-600">
                            {translations.subtotal}: <span className="font-semibold">{itemSubtotal.toLocaleString()} DH</span>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

function CitySelector({
    value,
    onChange,
    label,
    placeholder,
}: {
    value: string;
    onChange: (city: string) => void;
    label: string;
    placeholder: string;
}) {
    const [open, setOpen] = useState(false);

    const handleSelect = (selectedValue: string) => {
        const city = moroccanCities.find((c) => c.toLowerCase() === selectedValue.toLowerCase());
        onChange(city === value ? '' : city || selectedValue);
        setOpen(false);
    };

    return (
        <div>
            <Label htmlFor="city">{label} *</Label>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between">
                        {value || placeholder}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
                    <Command>
                        <CommandInput placeholder={`${placeholder}...`} />
                        <CommandList>
                            <CommandEmpty>Aucune ville trouvée.</CommandEmpty>
                            <CommandGroup>
                                {moroccanCities.map((city) => (
                                    <CommandItem key={city} value={city} onSelect={handleSelect}>
                                        <Check className={cn('mr-2 h-4 w-4', value === city ? 'opacity-100' : 'opacity-0')} />
                                        {city}
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
        </div>
    );
}

function OrderTotal({
    cartItems,
    cartTotal,
    deliveryFee,
    hasDiscount,
}: {
    cartItems: CartItem[];
    cartTotal: number;
    deliveryFee: number;
    hasDiscount: boolean;
}) {
    const originalTotal = cartItems.reduce((acc, item) => acc + (item.originalPrice || item.price) * item.quantity, 0);
    const finalTotal = cartTotal + deliveryFee;

    if (hasDiscount) {
        return (
            <div className="flex flex-col items-end">
                <span className="text-2xl font-bold text-red-600">{finalTotal.toLocaleString()} DH</span>
                <span className="text-sm text-gray-400 line-through">
                    {(originalTotal + deliveryFee).toLocaleString()} DH
                </span>
            </div>
        );
    }

    return (
        <span className="text-2xl font-bold text-green-600">{finalTotal.toLocaleString()} DH</span>
    );
}

export default function CartPage() {
    const { t } = useLanguage();
    const { cartItems, updateQuantity, removeFromCart, getCartTotal } = useCart();
    const [customerInfo, setCustomerInfo] = useState<CustomerInfo>(defaultCustomerInfo);

    const updateField = (field: keyof CustomerInfo, value: string) => {
        setCustomerInfo((prev) => ({ ...prev, [field]: value }));
    };

    const handleQuantityChange = (productId: string, newQuantity: number) => {
        if (newQuantity >= 1) updateQuantity(productId, newQuantity);
    };

    const handleRemoveItem = (productId: string, productName: string) => {
        removeFromCart(productId);
        toast.success(`${productName} ${t.cart.removeFromCart}`);
    };

    const getDeliveryFee = () => {
        if (!customerInfo.city || FREE_SHIPPING_CITIES.includes(customerInfo.city)) return 0;
        const hasBike = cartItems.some((item) => item.categoryId === BIKE_CATEGORY_ID);
        return hasBike ? DELIVERY_FEE_BIKE : DELIVERY_FEE_STANDARD;
    };

    const generateWhatsAppMessage = () => {
        const itemsList = cartItems
            .map((item, i) => {
                const price = item.discountedPrice || item.price;
                return `${i + 1}. ${item.name}\n   - Quantite: ${item.quantity}\n   - Prix unitaire: ${price.toLocaleString()} DH\n   - Sous-total: ${(price * item.quantity).toLocaleString()} DH`;
            })
            .join('\n\n');

        const deliveryFee = getDeliveryFee();
        const subtotal = getCartTotal();
        const total = subtotal + deliveryFee;

        return `*NOUVELLE COMMANDE DIMAVELO*

DETAILS CLIENT:
Nom: ${customerInfo.name}
Email: ${customerInfo.email || 'Non fourni'}
Telephone: ${customerInfo.phone}
Ville: ${customerInfo.city}

COMMANDE:
----------------------------------

${itemsList}

----------------------------------
SOUS-TOTAL: ${subtotal.toLocaleString()} DH
FRAIS DE LIVRAISON: ${deliveryFee === 0 ? 'GRATUIT' : deliveryFee.toLocaleString() + ' DH'}
TOTAL: ${total.toLocaleString()} DH
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
        const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER.replace(/\D/g, '')}?text=${encodeURIComponent(generateWhatsAppMessage())}`;
        window.open(whatsappUrl, '_blank');
    };

    const deliveryFee = getDeliveryFee();
    const cartTotal = getCartTotal();
    const originalTotal = cartItems.reduce((acc, item) => acc + (item.originalPrice || item.price) * item.quantity, 0);
    const hasDiscount = originalTotal > cartTotal + deliveryFee;

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
                        <div className="lg:col-span-2 space-y-4">
                            {cartItems.map((item) => (
                                <CartItemCard
                                    key={item.productId}
                                    item={item}
                                    onQuantityChange={(qty) => handleQuantityChange(item.productId, qty)}
                                    onRemove={() => handleRemoveItem(item.productId, item.name)}
                                    translations={{ subtotal: t.cart.subtotal, removeFromCart: t.cart.removeFromCart }}
                                />
                            ))}
                        </div>

                        <div className="lg:col-span-1">
                            <DeliveryInfo variant="full" className="mb-6" />

                            <Card className="sticky top-24 border-green-100 shadow-md bg-gray-50/30">
                                <CardContent className="p-6">
                                    <h2 className="text-xl font-bold mb-2 text-gray-900 flex items-center gap-2">
                                        <span className="w-1 h-6 bg-green-600 rounded-full inline-block" />
                                        {t.cart.checkoutForm.title}
                                    </h2>
                                    <p className="text-sm text-gray-600 mb-6">{t.cart.checkoutForm.subtitle}</p>

                                    <form onSubmit={handleCheckout} className="space-y-4">
                                        <div>
                                            <Label htmlFor="name">{t.cart.checkoutForm.name} *</Label>
                                            <Input
                                                id="name"
                                                value={customerInfo.name}
                                                onChange={(e) => updateField('name', e.target.value)}
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
                                                onChange={(e) => updateField('email', e.target.value)}
                                                placeholder={t.cart.checkoutForm.emailPlaceholder}
                                            />
                                        </div>

                                        <div>
                                            <Label htmlFor="phone">{t.cart.checkoutForm.phone} *</Label>
                                            <Input
                                                id="phone"
                                                type="tel"
                                                value={customerInfo.phone}
                                                onChange={(e) => updateField('phone', e.target.value)}
                                                placeholder={t.cart.checkoutForm.phonePlaceholder}
                                                required
                                            />
                                        </div>

                                        <CitySelector
                                            value={customerInfo.city}
                                            onChange={(city) => updateField('city', city)}
                                            label={t.cart.checkoutForm.city}
                                            placeholder={t.cart.checkoutForm.selectCity}
                                        />

                                        <div>
                                            <Label htmlFor="address">{t.cart.checkoutForm.address} *</Label>
                                            <Textarea
                                                id="address"
                                                value={customerInfo.address}
                                                onChange={(e) => updateField('address', e.target.value)}
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
                                                onChange={(e) => updateField('notes', e.target.value)}
                                                placeholder={t.cart.checkoutForm.notesPlaceholder}
                                                rows={2}
                                            />
                                        </div>

                                        <div className="border-t pt-4">
                                            {customerInfo.city && (
                                                <div className="flex justify-between items-center mb-2 text-sm italic text-gray-600">
                                                    <span>{t.cart.checkoutForm.deliveryFee}:</span>
                                                    <span className={deliveryFee === 0 ? 'text-red-600 font-medium' : ''}>
                                                        {deliveryFee === 0 ? '0 DH' : `${deliveryFee.toLocaleString()} DH`}
                                                    </span>
                                                </div>
                                            )}

                                            <div className="flex justify-between items-center mb-4">
                                                <span className="text-lg font-semibold">{t.cart.total}:</span>
                                                <OrderTotal
                                                    cartItems={cartItems}
                                                    cartTotal={cartTotal}
                                                    deliveryFee={deliveryFee}
                                                    hasDiscount={hasDiscount}
                                                />
                                            </div>

                                            <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-lg py-6">
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
