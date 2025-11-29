import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { SearchBar } from '@/components/SearchBar';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCart } from '@/contexts/CartContext';
import { categories, subcategories } from '@/lib/data';
import { servicesData } from '@/lib/services-data';
import { Menu, X, ChevronRight, ChevronLeft, ShoppingCart, Plus, Minus, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { createPortal } from 'react-dom';

type MobileView = 'main' | 'categories' | 'subcategories' | 'services';

export function Header() {
  const { t, language } = useLanguage();
  const { getCartItemsCount, cartItems, updateQuantity, removeFromCart, getCartTotal } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileView, setMobileView] = useState<MobileView>('main');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);

  const getCategoryName = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    if (!category) return '';
    switch (language) {
      case 'ar': return category.nameAr;
      case 'en': return category.nameEn;
      default: return category.nameFr;
    }
  };

  const getSubcategoryName = (subcategory: typeof subcategories[0]) => {
    switch (language) {
      case 'ar': return subcategory.nameAr;
      case 'en': return subcategory.nameEn;
      default: return subcategory.nameFr;
    }
  };

  const getCategorySubcategories = (categoryId: string) => {
    return subcategories.filter(sub => sub.parentCategoryId === categoryId);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
    setMobileView('main');
    setSelectedCategoryId(null);
  };

  const goToCategoriesView = () => setMobileView('categories');
  const goToServicesView = () => setMobileView('services');
  const goBackToMain = () => {
    setMobileView('main');
    setSelectedCategoryId(null);
  };

  const goToSubcategoriesView = (categoryId: string) => {
    setSelectedCategoryId(categoryId);
    setMobileView('subcategories');
  };

  const mobileSlideVariants = {
    enter: (direction: number) => ({ x: direction > 0 ? '100%' : '-100%', opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (direction: number) => ({ x: direction < 0 ? '100%' : '-100%', opacity: 0 }),
  };

  const sortedCategories = [...categories].sort((a, b) => a.displayOrder - b.displayOrder);

  // Lock body scroll when menu is open
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

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container flex h-16 md:h-24 items-center justify-between px-4">
        <Link to="/" className="flex items-center flex-shrink-0">
          <img
            src="/logo.png"
            alt="Dima Vélo Logo"
            className="h-12 md:h-20 w-auto object-contain"
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          <Button variant="ghost" asChild className="text-sm lg:text-base">
            <Link to="/">{t.nav.home}</Link>
          </Button>

          {/* Categories Dropdown */}
          <div className="group relative">
            <Button variant="ghost" className="text-sm lg:text-base">
              {t.nav.categories}
            </Button>
            <div className="absolute left-0 top-full pt-2 hidden group-hover:block z-50">
              <div className="bg-white rounded-lg shadow-lg border py-2 min-w-[200px]">
                {sortedCategories.map((category) => {
                  const subs = getCategorySubcategories(category.id);
                  const categoryName = getCategoryName(category.id);

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

                      {/* Subcategories Dropdown */}
                      {subs.length > 0 && (
                        <div className="absolute left-full top-0 -ml-0.5 hidden group-hover/item:block">
                          <div className="bg-white rounded-lg shadow-lg border py-2 min-w-[180px]">
                            {subs.map((sub) => (
                              <Link
                                key={sub.id}
                                to={`/categories/${category.slug}/${sub.slug}`}
                                className="block px-4 py-2 hover:bg-gray-100 text-sm"
                              >
                                {getSubcategoryName(sub)}
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
            <Button variant="ghost" className="text-sm lg:text-base">
              {t.nav.services}
            </Button>
            <div className="absolute left-0 top-full pt-2 hidden group-hover:block z-50">
              <div className="bg-white rounded-lg shadow-lg border py-2 min-w-[220px]">
                {servicesData.map((service) => {
                  const serviceTranslation = t.services?.[service.id as keyof typeof t.services] || service.id;
                  return (
                    <Link
                      key={service.id}
                      to={`/services?service=${service.id}`}
                      className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 text-sm"
                    >
                      <span className="text-lg">{service.icon}</span>
                      <span>{serviceTranslation}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
          <Button variant="ghost" asChild className="text-sm lg:text-base">
            <Link to="/contact">{t.nav.contact}</Link>
          </Button>
          <SearchBar />
          <div className="relative group z-50">
            <Button variant="ghost" size="icon" asChild className="relative">
              <Link
                to="/panier"
                onClick={(e) => {
                  // Prevent navigation on desktop (hover capable devices)
                  // But allow it on tablets/touch devices where hover isn't available
                  if (window.matchMedia('(hover: hover)').matches) {
                    e.preventDefault();
                  }
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

                  {cartItems.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <ShoppingCart className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                      <p className="text-sm">{t.cart.emptyCart}</p>
                    </div>
                  ) : (
                    <>
                      <div className="max-h-96 overflow-y-auto space-y-3">
                        {cartItems.map((item) => (
                          <div key={item.productId} className="flex gap-3 pb-3 border-b">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-16 h-16 object-cover rounded"
                            />
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-sm line-clamp-1">{item.name}</h4>
                              {item.discountedPrice && item.originalPrice ? (
                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-bold text-red-600">
                                    {item.discountedPrice.toLocaleString()} DH
                                  </span>
                                  <span className="text-xs text-gray-400 line-through">
                                    {item.originalPrice.toLocaleString()} DH
                                  </span>
                                </div>
                              ) : (
                                <p className="text-sm text-green-600 font-semibold">
                                  {item.price.toLocaleString()} DH
                                </p>
                              )}
                              <div className="flex items-center gap-2 mt-1">
                                <button
                                  onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                                  className="w-6 h-6 rounded border hover:bg-gray-100 flex items-center justify-center"
                                >
                                  <Minus className="h-3 w-3" />
                                </button>
                                <span className="text-sm w-8 text-center">{item.quantity}</span>
                                <button
                                  onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                                  className="w-6 h-6 rounded border hover:bg-gray-100 flex items-center justify-center"
                                >
                                  <Plus className="h-3 w-3" />
                                </button>
                                <button
                                  onClick={() => removeFromCart(item.productId)}
                                  className="ml-auto text-red-600 hover:text-red-700"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="mt-4 pt-4 border-t">
                        <div className="flex justify-between items-center mb-4">
                          <span className="font-semibold">{t.cart.subtotal}:</span>
                          <div className="flex flex-col items-end">
                            {cartItems.reduce((acc, item) => acc + (item.originalPrice || item.price) * item.quantity, 0) > getCartTotal() ? (
                              <>
                                <span className="text-xl font-bold text-red-600">
                                  {getCartTotal().toLocaleString()} DH
                                </span>
                                <span className="text-sm text-gray-400 line-through">
                                  {cartItems.reduce((acc, item) => acc + (item.originalPrice || item.price) * item.quantity, 0).toLocaleString()} DH
                                </span>
                              </>
                            ) : (
                              <span className="text-xl font-bold text-green-600">
                                {getCartTotal().toLocaleString()} DH
                              </span>
                            )}
                          </div>
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
          <Button
            variant="ghost"
            size="icon"
            className="relative"
            onClick={() => setCartDrawerOpen(true)}
          >
            <ShoppingCart className="h-5 w-5" />
            {getCartItemsCount() > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {getCartItemsCount()}
              </span>
            )}
          </Button>
          <LanguageSwitcher />
          <Button
            variant="ghost"
            size="icon"
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
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
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-0 bg-white opacity-100 z-[9999] md:hidden"
              style={{ backgroundColor: '#ffffff', opacity: 1 }}
            >
              {/* Close Button - Top Right */}
              <div className="absolute top-4 right-4 z-10">
                <Button
                  variant="ghost"
                  size="icon"
                  type="button"
                  onClick={closeMobileMenu}
                  aria-label="Close menu"
                  className="h-12 w-12"
                >
                  <X className="h-8 w-8" />
                </Button>
              </div>

              {/* Menu Content - Centered Vertically, Left Aligned */}
              <div className="flex items-center min-h-screen px-8 py-20 bg-white">
                <div className="w-full max-w-md bg-white">
                  <AnimatePresence mode="wait" custom={mobileView === 'main' ? -1 : 1}>
                    {/* Main Menu */}
                    {mobileView === 'main' && (
                      <motion.div
                        key="main"
                        custom={-1}
                        variants={mobileSlideVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{ duration: 0.3 }}
                        className="space-y-4"
                      >
                        <Button variant="ghost" asChild className="w-full justify-start text-2xl py-8">
                          <Link to="/" onClick={closeMobileMenu}>{t.nav.home}</Link>
                        </Button>
                        <Button
                          variant="ghost"
                          className="w-full justify-between text-2xl py-8"
                          onClick={goToCategoriesView}
                        >
                          <span>{t.nav.categories}</span>
                          <ChevronRight className="h-6 w-6" />
                        </Button>
                        <Button
                          variant="ghost"
                          className="w-full justify-between text-2xl py-8"
                          onClick={goToServicesView}
                        >
                          <span>{t.nav.services}</span>
                          <ChevronRight className="h-6 w-6" />
                        </Button>
                        <Button variant="ghost" asChild className="w-full justify-start text-2xl py-8">
                          <Link to="/contact" onClick={closeMobileMenu}>{t.nav.contact}</Link>
                        </Button>
                      </motion.div>
                    )}

                    {/* Categories View */}
                    {mobileView === 'categories' && (
                      <motion.div
                        key="categories"
                        custom={1}
                        variants={mobileSlideVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{ duration: 0.3 }}
                        className="h-full"
                      >
                        <div className="sticky top-0 bg-white border-b p-4 flex items-center gap-3">
                          <Button variant="ghost" size="icon" onClick={goBackToMain}>
                            <ChevronLeft className="h-5 w-5" />
                          </Button>
                          <h2 className="text-lg font-semibold">{t.nav.categories}</h2>
                        </div>
                        <div className="p-4 space-y-4">

                          {sortedCategories.map((category) => {
                            const subs = getCategorySubcategories(category.id);
                            const categoryName = getCategoryName(category.id);

                            return (
                              <div key={category.id}>
                                {subs.length > 0 ? (
                                  <Button
                                    variant="ghost"
                                    className={`w-full justify-between text-2xl py-8 ${category.slug === 'promotions' ? 'text-red-600 hover:text-red-700' : ''}`}
                                    onClick={() => goToSubcategoriesView(category.id)}
                                  >
                                    <span>{categoryName}</span>
                                    <ChevronRight className="h-6 w-6" />
                                  </Button>
                                ) : (
                                  <Button variant="ghost" asChild className={`w-full justify-start text-2xl py-8 ${category.slug === 'promotions' ? 'text-red-600 hover:text-red-700' : ''}`}>
                                    <Link
                                      to={category.slug === 'promotions' ? '/promotions' : `/categories/${category.slug}`}
                                      onClick={closeMobileMenu}
                                    >
                                      {categoryName}
                                    </Link>
                                  </Button>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}

                    {/* Subcategories View */}
                    {mobileView === 'subcategories' && selectedCategoryId && (
                      <motion.div
                        key="subcategories"
                        custom={1}
                        variants={mobileSlideVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{ duration: 0.3 }}
                        className="h-full"
                      >
                        <div className="sticky top-0 bg-white border-b p-4 flex items-center gap-3">
                          <Button variant="ghost" size="icon" onClick={() => setMobileView('categories')}>
                            <ChevronLeft className="h-5 w-5" />
                          </Button>
                          <h2 className="text-lg font-semibold">{getCategoryName(selectedCategoryId)}</h2>
                        </div>
                        <div className="p-4 space-y-4">
                          {getCategorySubcategories(selectedCategoryId).map((sub) => {
                            const category = categories.find(c => c.id === selectedCategoryId);
                            return (
                              <Button key={sub.id} variant="ghost" asChild className="w-full justify-start text-2xl py-8">
                                <Link to={`/categories/${category?.slug}/${sub.slug}`} onClick={closeMobileMenu}>
                                  {getSubcategoryName(sub)}
                                </Link>
                              </Button>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}

                    {/* Services View */}
                    {mobileView === 'services' && (
                      <motion.div
                        key="services"
                        custom={1}
                        variants={mobileSlideVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{ duration: 0.3 }}
                        className="h-full"
                      >
                        <div className="sticky top-0 bg-white border-b p-4 flex items-center gap-3">
                          <Button variant="ghost" size="icon" onClick={goBackToMain}>
                            <ChevronLeft className="h-5 w-5" />
                          </Button>
                          <h2 className="text-lg font-semibold">{t.nav.services}</h2>
                        </div>
                        <div className="p-4 space-y-4">

                          {servicesData.map((service) => {
                            const serviceTranslation = t.services?.[service.id as keyof typeof t.services] || service.id;
                            return (
                              <Button key={service.id} variant="ghost" asChild className="w-full justify-start text-2xl py-8">
                                <Link to={`/services?service=${service.id}`} onClick={closeMobileMenu}>
                                  <span className="mr-3">{service.icon}</span>
                                  {serviceTranslation}
                                </Link>
                              </Button>
                            );
                          })}
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
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setCartDrawerOpen(false)}
                className="md:hidden fixed inset-0 bg-black/50 z-[90]"
              />

              {/* Drawer */}
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                className="md:hidden fixed right-0 top-0 h-full w-full max-w-sm bg-white z-[100] shadow-2xl flex flex-col"
                style={{ backgroundColor: '#ffffff' }}
              >
                {/* Header */}
                <div className="p-4 border-b flex items-center justify-between">
                  <h2 className="text-xl font-semibold">{t.cart.title}</h2>
                  <button
                    onClick={() => setCartDrawerOpen(false)}
                    className="p-2 hover:bg-gray-100 rounded-full"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {/* Content */}
                {cartItems.length === 0 ? (
                  <div className="flex-1 flex items-center justify-center p-4">
                    <div className="text-center text-gray-500">
                      <ShoppingCart className="h-16 w-16 mx-auto mb-3 text-gray-300" />
                      <p>{t.cart.emptyCart}</p>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Items */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                      {cartItems.map((item) => (
                        <div key={item.productId} className="flex gap-3 pb-4 border-b">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-20 h-20 object-cover rounded"
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium line-clamp-2 mb-1">{item.name}</h4>
                            {item.discountedPrice && item.originalPrice ? (
                              <div className="flex items-center gap-2 mb-2">
                                <span className="font-bold text-red-600">
                                  {item.discountedPrice.toLocaleString()} DH
                                </span>
                                <span className="text-sm text-gray-400 line-through">
                                  {item.originalPrice.toLocaleString()} DH
                                </span>
                              </div>
                            ) : (
                              <p className="text-green-600 font-semibold mb-2">
                                {item.price.toLocaleString()} DH
                              </p>
                            )}
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                                className="w-8 h-8 rounded border hover:bg-gray-100 flex items-center justify-center"
                              >
                                <Minus className="h-4 w-4" />
                              </button>
                              <span className="w-10 text-center">{item.quantity}</span>
                              <button
                                onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                                className="w-8 h-8 rounded border hover:bg-gray-100 flex items-center justify-center"
                              >
                                <Plus className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => removeFromCart(item.productId)}
                                className="ml-auto text-red-600 hover:text-red-700 p-2"
                              >
                                <Trash2 className="h-5 w-5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Footer */}
                    <div className="p-4 border-t bg-gray-50">
                      <div className="flex justify-between items-center mb-4">
                        <span className="font-semibold text-lg">{t.cart.subtotal}:</span>
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
                        asChild
                        className="w-full bg-green-600 hover:bg-green-700 text-lg py-6"
                      >
                        <Link to="/panier" onClick={() => setCartDrawerOpen(false)}>
                          {t.cart.checkout}
                        </Link>
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