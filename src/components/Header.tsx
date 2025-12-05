import { useState, useEffect, ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronRight, ChevronLeft, ShoppingCart, Plus, Minus, Trash2, Check } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { LanguageSwitcher, languages } from '@/components/LanguageSwitcher';
import { SearchBar } from '@/components/SearchBar';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCart } from '@/contexts/CartContext';
import { categories, subcategories } from '@/lib/data';
import { servicesData } from '@/lib/services-data';
import { CartItem } from '@/lib/types';

type MobileView = 'main' | 'categories' | 'subcategories' | 'services' | 'languages';

const slideTransition = { duration: 0.3 };
const springTransition = { type: 'spring', damping: 25, stiffness: 200 };
const fastSpringTransition = { type: 'spring', damping: 25, stiffness: 300 };

const slideVariants = {
  enter: (direction: number) => ({ x: direction > 0 ? '100%' : '-100%', opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (direction: number) => ({ x: direction < 0 ? '100%' : '-100%', opacity: 0 }),
};

function MenuDivider() {
  return (
    <div className="relative py-2">
      <div
        className="w-full border-t-2"
        style={{
          borderImage: 'linear-gradient(to right, transparent, rgb(187 247 208), transparent) 1',
          boxShadow: '0 2px 4px -1px rgba(34, 197, 94, 0.15)'
        }}
      />
    </div>
  );
}

interface PriceDisplayProps {
  price: number;
  discountedPrice?: number;
  originalPrice?: number;
  size?: 'sm' | 'md' | 'lg';
}

function PriceDisplay({ price, discountedPrice, originalPrice, size = 'md' }: PriceDisplayProps) {
  const sizeClasses = {
    sm: { main: 'text-sm', strike: 'text-xs' },
    md: { main: 'text-lg', strike: 'text-sm' },
    lg: { main: 'text-xl', strike: 'text-sm' },
  };

  if (discountedPrice && originalPrice) {
    return (
      <div className="flex items-center gap-2">
        <span className={`font-bold text-red-600 ${sizeClasses[size].main}`}>
          {discountedPrice.toLocaleString()} DH
        </span>
        <span className={`text-gray-400 line-through ${sizeClasses[size].strike}`}>
          {originalPrice.toLocaleString()} DH
        </span>
      </div>
    );
  }

  return (
    <span className={`font-semibold text-green-600 ${sizeClasses[size].main}`}>
      {price.toLocaleString()} DH
    </span>
  );
}

interface CartTotalDisplayProps {
  cartItems: CartItem[];
  getCartTotal: () => number;
  size?: 'sm' | 'lg';
}

function CartTotalDisplay({ cartItems, getCartTotal, size = 'sm' }: CartTotalDisplayProps) {
  const originalTotal = cartItems.reduce(
    (acc, item) => acc + (item.originalPrice || item.price) * item.quantity, 0
  );
  const currentTotal = getCartTotal();
  const hasDiscount = originalTotal > currentTotal;
  const sizeClass = size === 'lg' ? 'text-2xl' : 'text-xl';

  return (
    <div className="flex flex-col items-end">
      {hasDiscount ? (
        <>
          <span className={`${sizeClass} font-bold text-red-600`}>
            {currentTotal.toLocaleString()} DH
          </span>
          <span className="text-sm text-gray-400 line-through">
            {originalTotal.toLocaleString()} DH
          </span>
        </>
      ) : (
        <span className={`${sizeClass} font-bold text-green-600`}>
          {currentTotal.toLocaleString()} DH
        </span>
      )}
    </div>
  );
}

interface QuantityControlProps {
  quantity: number;
  onDecrease: () => void;
  onIncrease: () => void;
  onRemove: () => void;
  size?: 'sm' | 'md';
}

function QuantityControl({ quantity, onDecrease, onIncrease, onRemove, size = 'sm' }: QuantityControlProps) {
  const btnSize = size === 'sm' ? 'w-6 h-6' : 'w-8 h-8';
  const iconSize = size === 'sm' ? 'h-3 w-3' : 'h-4 w-4';

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={onDecrease}
        className={`${btnSize} rounded border hover:bg-gray-100 flex items-center justify-center`}
      >
        <Minus className={iconSize} />
      </button>
      <span className={`${size === 'sm' ? 'w-8 text-sm' : 'w-10'} text-center`}>{quantity}</span>
      <button
        onClick={onIncrease}
        className={`${btnSize} rounded border hover:bg-gray-100 flex items-center justify-center`}
      >
        <Plus className={iconSize} />
      </button>
      <button
        onClick={onRemove}
        className="ml-auto text-red-600 hover:text-red-700 p-1"
      >
        <Trash2 className={size === 'sm' ? 'h-4 w-4' : 'h-5 w-5'} />
      </button>
    </div>
  );
}

interface MobileMenuHeaderProps {
  title: string;
  onBack: () => void;
}

function MobileMenuHeader({ title, onBack }: MobileMenuHeaderProps) {
  return (
    <div className="sticky top-0 bg-white border-b p-4 flex items-center gap-3 z-10">
      <Button variant="ghost" size="icon" onClick={onBack}>
        <ChevronLeft className="h-5 w-5" />
      </Button>
      <h2 className="text-lg font-semibold">{title}</h2>
    </div>
  );
}

interface MobileMenuItemProps {
  children: ReactNode;
  to?: string;
  onClick?: () => void;
  hasArrow?: boolean;
  isPromo?: boolean;
  icon?: ReactNode;
}

function MobileMenuItem({ children, to, onClick, hasArrow, isPromo, icon }: MobileMenuItemProps) {
  const baseClass = `w-full justify-${hasArrow ? 'between' : 'start'} text-xl sm:text-2xl py-5 hover:bg-green-50 relative group overflow-hidden`;
  const colorClass = isPromo ? 'text-red-600 hover:text-red-700' : '';

  const content = (
    <>
      {icon && <span className="mr-3">{icon}</span>}
      <span className="relative z-10">{children}</span>
      {hasArrow && <ChevronRight className="h-6 w-6 relative z-10 group-hover:translate-x-1 transition-transform" />}
      <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-transparent via-green-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
    </>
  );

  if (to) {
    return (
      <Button variant="ghost" asChild className={`${baseClass} ${colorClass}`}>
        <Link to={to} onClick={onClick}>{content}</Link>
      </Button>
    );
  }

  return (
    <Button variant="ghost" className={`${baseClass} ${colorClass}`} onClick={onClick}>
      {content}
    </Button>
  );
}

export function Header() {
  const { t, language, setLanguage } = useLanguage();
  const { getCartItemsCount, cartItems, updateQuantity, removeFromCart, getCartTotal } = useCart();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileView, setMobileView] = useState<MobileView>('main');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);

  const currentLanguage = languages.find(lang => lang.code === language);
  const sortedCategories = [...categories].sort((a, b) => a.displayOrder - b.displayOrder);

  const getLocalizedName = (item: { nameFr: string; nameEn: string; nameAr: string }) => {
    const names = { fr: item.nameFr, en: item.nameEn, ar: item.nameAr };
    return names[language] || item.nameFr;
  };

  const getCategorySubcategories = (categoryId: string) =>
    subcategories.filter(sub => sub.parentCategoryId === categoryId);

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
    setMobileView('main');
    setSelectedCategoryId(null);
  };

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
    } else {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
    };
  }, [mobileMenuOpen]);

  const renderCartItem = (item: CartItem, variant: 'compact' | 'full') => {
    const isCompact = variant === 'compact';
    const imgSize = isCompact ? 'w-16 h-16' : 'w-20 h-20';

    return (
      <div key={item.productId} className={`flex gap-3 ${isCompact ? 'pb-3' : 'pb-4'} border-b`}>
        <img src={item.image} alt={item.name} className={`${imgSize} object-cover rounded`} />
        <div className="flex-1 min-w-0">
          <h4 className={`font-medium ${isCompact ? 'text-sm line-clamp-1' : 'line-clamp-2 mb-1'}`}>
            {item.name}
          </h4>
          <div className={isCompact ? '' : 'mb-2'}>
            <PriceDisplay
              price={item.price}
              discountedPrice={item.discountedPrice}
              originalPrice={item.originalPrice}
              size="sm"
            />
          </div>
          <div className={isCompact ? 'mt-1' : ''}>
            <QuantityControl
              quantity={item.quantity}
              onDecrease={() => updateQuantity(item.productId, item.quantity - 1)}
              onIncrease={() => updateQuantity(item.productId, item.quantity + 1)}
              onRemove={() => removeFromCart(item.productId)}
              size={isCompact ? 'sm' : 'md'}
            />
          </div>
        </div>
      </div>
    );
  };

  const renderEmptyCart = (iconSize: string = 'h-12 w-12') => (
    <div className="text-center py-8 text-gray-500">
      <ShoppingCart className={`${iconSize} mx-auto mb-2 text-gray-300`} />
      <p className="text-sm">{t.cart.emptyCart}</p>
    </div>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container flex h-16 md:h-24 items-center justify-between px-4">
        <Link to="/" className="flex items-center flex-shrink-0">
          <img src="/logo.png" alt="Dima Vélo" className="h-12 md:h-20 w-auto object-contain" />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          <Button variant="ghost" asChild className="text-sm lg:text-base">
            <Link to="/">{t.nav.home}</Link>
          </Button>

          {/* Categories Dropdown */}
          <div className="group relative">
            <Button variant="ghost" className="text-sm lg:text-base">{t.nav.categories}</Button>
            <div className="absolute left-0 top-full pt-2 hidden group-hover:block z-50">
              <div className="bg-white rounded-lg shadow-lg border py-2 min-w-[200px]">
                {sortedCategories.map((category) => {
                  const subs = getCategorySubcategories(category.id);
                  const categoryName = getLocalizedName(category);

                  return (
                    <div key={category.id} className="group/item relative">
                      {subs.length > 0 ? (
                        <div className="flex items-center justify-between px-4 py-2 hover:bg-gray-100 text-sm cursor-default">
                          <span>{categoryName}</span>
                          <ChevronRight className="h-4 w-4" />
                        </div>
                      ) : (
                        <Link
                          to={category.slug === 'promotions' ? '/promotions' : `/categories/${category.slug}`}
                          className="flex items-center justify-between px-4 py-2 hover:bg-gray-100 text-sm"
                        >
                          <span>{categoryName}</span>
                        </Link>
                      )}
                      {subs.length > 0 && (
                        <div className="absolute left-full top-0 -ml-0.5 hidden group-hover/item:block">
                          <div className="bg-white rounded-lg shadow-lg border py-2 min-w-[180px]">
                            {subs.map((sub) => (
                              <Link
                                key={sub.id}
                                to={`/categories/${category.slug}/${sub.slug}`}
                                className="block px-4 py-2 hover:bg-gray-100 text-sm"
                              >
                                {getLocalizedName(sub)}
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Services Dropdown */}
          <div className="group relative">
            <Button variant="ghost" className="text-sm lg:text-base">{t.nav.services}</Button>
            <div className="absolute left-0 top-full pt-2 hidden group-hover:block z-50">
              <div className="bg-white rounded-lg shadow-lg border py-2 min-w-[220px]">
                {servicesData.map((service) => (
                  <Link
                    key={service.id}
                    to={`/services?service=${service.id}`}
                    className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 text-sm"
                  >
                    <span className="text-lg">{service.icon}</span>
                    <span>{t.services?.[service.id as keyof typeof t.services] || service.id}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <Button variant="ghost" asChild className="text-sm lg:text-base">
            <Link to="/faq">{t.nav.faq}</Link>
          </Button>
          <Button variant="ghost" asChild className="text-sm lg:text-base">
            <Link to="/contact">{t.nav.contact}</Link>
          </Button>

          <SearchBar />

          {/* Cart */}
          <div className="relative group z-50">
            <Button variant="ghost" size="icon" asChild className="relative">
              <Link
                to="/panier"
                onClick={(e) => {
                  if (window.matchMedia('(hover: hover)').matches) e.preventDefault();
                }}
              >
                <ShoppingCart className="h-5 w-5" />
                {getCartItemsCount() > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {getCartItemsCount()}
                  </span>
                )}
              </Link>
            </Button>

            {/* Desktop Cart Dropdown */}
            <div className={`absolute top-full pt-2 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-200 w-80 md:w-96 hidden md:block ${language === 'ar' ? 'left-0' : 'right-0'}`}>
              <div className="bg-white rounded-lg shadow-2xl border overflow-hidden">
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-4">{t.cart.title}</h3>
                  {cartItems.length === 0 ? renderEmptyCart() : (
                    <>
                      <div className="max-h-96 overflow-y-auto space-y-3">
                        {cartItems.map(item => renderCartItem(item, 'compact'))}
                      </div>
                      <div className="mt-4 pt-4 border-t">
                        <div className="flex justify-between items-center mb-4">
                          <span className="font-semibold">{t.cart.subtotal}:</span>
                          <CartTotalDisplay cartItems={cartItems} getCartTotal={getCartTotal} />
                        </div>
                        <Button asChild className="w-full bg-green-600 hover:bg-green-700">
                          <Link to="/panier">{t.cart.checkout}</Link>
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          <LanguageSwitcher />
        </nav>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden items-center gap-2">
          <SearchBar />
          <Button variant="ghost" size="icon" className="relative" onClick={() => setCartDrawerOpen(true)}>
            <ShoppingCart className="h-5 w-5" />
            {getCartItemsCount() > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {getCartItemsCount()}
              </span>
            )}
          </Button>
          <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Toggle menu">
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Full-Screen Navigation */}
      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={springTransition}
              className="fixed inset-0 bg-white z-[9999] md:hidden"
            >
              {/* Logo */}
              <div className="absolute top-4 left-4 z-10">
                <Link to="/" onClick={closeMobileMenu}>
                  <img src="/logo.png" alt="Dima Vélo" className="h-20 w-auto" />
                </Link>
              </div>

              {/* Close Button */}
              <div className="absolute top-4 right-4 z-10">
                <Button variant="ghost" size="icon" onClick={closeMobileMenu} aria-label="Close" className="h-12 w-12">
                  <X className="h-8 w-8" />
                </Button>
              </div>

              {/* Menu Content */}
              <div className="relative h-full flex flex-col bg-gradient-to-br from-white via-green-50/30 to-white">
                <div className="pt-8 pb-6 px-6 border-b border-green-100/50 flex flex-col items-center">
                  <h2 className="text-xl font-bold mb-4">Menu</h2>
                </div>

                <div className="flex-1 flex flex-col overflow-hidden">
                  <AnimatePresence mode="wait" custom={mobileView === 'main' ? -1 : 1}>
                    {/* Main Menu */}
                    {mobileView === 'main' && (
                      <motion.div
                        key="main"
                        custom={-1}
                        variants={slideVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={slideTransition}
                        className="flex flex-col h-full"
                      >
                        <div className="flex-1 overflow-y-auto pt-10 px-6 space-y-1">
                          <MobileMenuItem to="/" onClick={closeMobileMenu}>{t.nav.home}</MobileMenuItem>
                          <MenuDivider />
                          <MobileMenuItem to="/promotions" onClick={closeMobileMenu} isPromo>Promotions</MobileMenuItem>
                          <MenuDivider />
                          <MobileMenuItem hasArrow onClick={() => setMobileView('categories')}>{t.nav.categories}</MobileMenuItem>
                          <MenuDivider />
                          <MobileMenuItem hasArrow onClick={() => setMobileView('services')}>{t.nav.services}</MobileMenuItem>
                          <MenuDivider />
                          <MobileMenuItem to="/contact" onClick={closeMobileMenu}>{t.nav.contact}</MobileMenuItem>
                        </div>

                        <div className="p-6 border-t border-green-100 bg-white/50 flex justify-between items-center mt-auto">
                          <Link to="/faq" onClick={closeMobileMenu} className="text-sm font-medium text-gray-600 hover:text-green-600 transition-colors">
                            {t.nav.faq}
                          </Link>
                          <button onClick={() => setMobileView('languages')} className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-green-600 transition-colors">
                            <span>{currentLanguage?.name}</span>
                            <div className="w-6 h-4 rounded overflow-hidden border border-gray-200">
                              {currentLanguage?.flag}
                            </div>
                          </button>
                        </div>
                      </motion.div>
                    )}

                    {/* Categories View */}
                    {mobileView === 'categories' && (
                      <motion.div key="categories" custom={1} variants={slideVariants} initial="enter" animate="center" exit="exit" transition={slideTransition} className="h-full overflow-y-auto">
                        <MobileMenuHeader title={t.nav.categories} onBack={() => setMobileView('main')} />
                        <div className="flex-1 overflow-y-auto pt-10 px-6 space-y-1">
                          {sortedCategories.filter((c) => c.slug !== 'promotions').map((category, index, arr) => {
                            const subs = getCategorySubcategories(category.id);
                            return (
                              <div key={category.id}>
                                {subs.length > 0 ? (
                                  <MobileMenuItem hasArrow onClick={() => { setSelectedCategoryId(category.id); setMobileView('subcategories'); }}>
                                    {getLocalizedName(category)}
                                  </MobileMenuItem>
                                ) : (
                                  <MobileMenuItem to={`/categories/${category.slug}`} onClick={closeMobileMenu}>
                                    {getLocalizedName(category)}
                                  </MobileMenuItem>
                                )}
                                {index < arr.length - 1 && <MenuDivider />}
                              </div>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}

                    {/* Subcategories View */}
                    {mobileView === 'subcategories' && selectedCategoryId && (
                      <motion.div key="subcategories" custom={1} variants={slideVariants} initial="enter" animate="center" exit="exit" transition={slideTransition} className="h-full overflow-y-auto">
                        <MobileMenuHeader title={getLocalizedName(categories.find(c => c.id === selectedCategoryId)!)} onBack={() => setMobileView('categories')} />
                        <div className="flex-1 overflow-y-auto pt-10 px-6 space-y-1">
                          {getCategorySubcategories(selectedCategoryId).map((sub, index, arr) => {
                            const category = categories.find(c => c.id === selectedCategoryId);
                            return (
                              <div key={sub.id}>
                                <MobileMenuItem to={`/categories/${category?.slug}/${sub.slug}`} onClick={closeMobileMenu}>
                                  {getLocalizedName(sub)}
                                </MobileMenuItem>
                                {index < arr.length - 1 && <MenuDivider />}
                              </div>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}

                    {/* Services View */}
                    {mobileView === 'services' && (
                      <motion.div key="services" custom={1} variants={slideVariants} initial="enter" animate="center" exit="exit" transition={slideTransition} className="h-full overflow-y-auto">
                        <MobileMenuHeader title={t.nav.services} onBack={() => setMobileView('main')} />
                        <div className="flex-1 overflow-y-auto pt-10 px-6 space-y-1">
                          {servicesData.map((service, index, arr) => (
                            <div key={service.id}>
                              <MobileMenuItem to={`/services?service=${service.id}`} onClick={closeMobileMenu} icon={service.icon}>
                                {t.services?.[service.id as keyof typeof t.services] || service.id}
                              </MobileMenuItem>
                              {index < arr.length - 1 && <MenuDivider />}
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}

                    {/* Languages View */}
                    {mobileView === 'languages' && (
                      <motion.div key="languages" custom={1} variants={slideVariants} initial="enter" animate="center" exit="exit" transition={slideTransition} className="h-full overflow-y-auto">
                        <MobileMenuHeader title="Language / Langue / اللغة" onBack={() => setMobileView('main')} />
                        <div className="p-4 space-y-2">
                          {languages.map((lang) => (
                            <Button
                              key={lang.code}
                              variant="ghost"
                              className={`w-full justify-between text-xl py-6 ${language === lang.code ? 'bg-green-50 text-green-700' : ''}`}
                              onClick={() => { setLanguage(lang.code); closeMobileMenu(); }}
                            >
                              <div className="flex items-center gap-4">
                                <div className="w-9 h-6 rounded overflow-hidden border border-gray-200 shadow-sm">{lang.flag}</div>
                                <span className={language === lang.code ? 'font-bold' : ''}>{lang.name}</span>
                              </div>
                              {language === lang.code && <Check className="h-6 w-6 text-green-600" />}
                            </Button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}

      {/* Mobile Cart Drawer */}
      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {cartDrawerOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setCartDrawerOpen(false)}
                className="md:hidden fixed inset-0 bg-black/50 z-[90]"
              />
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={fastSpringTransition}
                className="md:hidden fixed right-0 top-0 h-full w-full max-w-sm bg-white z-[100] shadow-2xl flex flex-col"
              >
                <div className="p-4 border-b flex items-center justify-between">
                  <h2 className="text-xl font-semibold">{t.cart.title}</h2>
                  <button onClick={() => setCartDrawerOpen(false)} className="p-2 hover:bg-gray-100 rounded-full">
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {cartItems.length === 0 ? (
                  <div className="flex-1 flex items-center justify-center p-4">
                    {renderEmptyCart('h-16 w-16')}
                  </div>
                ) : (
                  <>
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                      {cartItems.map(item => renderCartItem(item, 'full'))}
                    </div>
                    <div className="p-4 border-t bg-gray-50">
                      <div className="flex justify-between items-center mb-4">
                        <span className="font-semibold text-lg">{t.cart.subtotal}:</span>
                        <CartTotalDisplay cartItems={cartItems} getCartTotal={getCartTotal} size="lg" />
                      </div>
                      <Button asChild className="w-full bg-green-600 hover:bg-green-700 text-lg py-6">
                        <Link to="/panier" onClick={() => setCartDrawerOpen(false)}>{t.cart.checkout}</Link>
                      </Button>
                    </div>
                  </>
                )}
              </motion.div>
            </>
          )}
        </AnimatePresence>,
        document.body
      )}
    </header>
  );
}
