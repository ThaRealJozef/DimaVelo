import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, X, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useProducts } from '@/hooks/useProducts';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';

const INITIAL_RESULTS_LIMIT = 5;

export function SearchBar() {
  const { t, language } = useLanguage();
  const { products, loading: productsLoading } = useProducts();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAllResults, setShowAllResults] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  // Close search when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close search on Escape key
  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false);
        setSearchQuery('');
      }
    }

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  // Simulate search delay for better UX
  useEffect(() => {
    if (searchQuery) {
      setIsSearching(true);
      const timer = setTimeout(() => {
        setIsSearching(false);
      }, 300);
      return () => clearTimeout(timer);
    } else {
      setIsSearching(false);
    }
  }, [searchQuery]);

  // Get localized product name
  const getProductName = (product: typeof products[0]) => {
    switch (language) {
      case 'en': return product.nameEn || product.nameFr;
      case 'ar': return product.nameAr || product.nameFr;
      default: return product.nameFr;
    }
  };

  // Get localized product description
  const getProductDescription = (product: typeof products[0]) => {
    switch (language) {
      case 'en': return product.descriptionEn || product.descriptionFr;
      case 'ar': return product.descriptionAr || product.descriptionFr;
      default: return product.descriptionFr;
    }
  };

  // Filter products based on search query
  const filteredProducts = searchQuery.trim()
    ? products.filter((product) => {
        const query = searchQuery.toLowerCase();
        const name = getProductName(product).toLowerCase();
        const description = getProductDescription(product).toLowerCase();
        return name.includes(query) || description.includes(query);
      })
    : [];

  const displayedResults = showAllResults
    ? filteredProducts
    : filteredProducts.slice(0, INITIAL_RESULTS_LIMIT);

  const hasMoreResults = filteredProducts.length > INITIAL_RESULTS_LIMIT;

  const handleSearchClick = () => {
    setIsOpen(true);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setShowAllResults(false);
    inputRef.current?.focus();
  };

  const handleProductClick = () => {
    setIsOpen(false);
    setSearchQuery('');
    setShowAllResults(false);
  };

  return (
    <div ref={searchRef} className="relative">
      {/* Search Button/Input Container */}
      <AnimatePresence mode="wait">
        {!isOpen ? (
          <motion.div
            key="search-button"
            initial={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
          >
            <Button
              variant="ghost"
              size="icon"
              onClick={handleSearchClick}
              className="relative"
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </Button>
          </motion.div>
        ) : (
          <motion.div
            key="search-input"
            initial={{ opacity: 0, width: 40, scale: 0.95 }}
            animate={{ opacity: 1, width: '100%', scale: 1 }}
            exit={{ opacity: 0, width: 40, scale: 0.95 }}
            transition={{ 
              duration: 0.3, 
              ease: [0.4, 0, 0.2, 1],
              width: { duration: 0.3 },
              opacity: { duration: 0.2 },
              scale: { duration: 0.3 }
            }}
            className="relative w-full"
            style={{ transformOrigin: 'right center' }}
          >
            <motion.div
              initial={{ x: -10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.2 }}
            >
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 z-10" />
            </motion.div>
            <Input
              ref={inputRef}
              type="text"
              placeholder={t.common?.search || 'Rechercher...'}
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowAllResults(false);
              }}
              className="pl-10 pr-10 w-full md:w-80"
            />
            <AnimatePresence>
              {searchQuery && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, rotate: -90 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  exit={{ opacity: 0, scale: 0.8, rotate: 90 }}
                  transition={{ duration: 0.2, ease: 'easeInOut' }}
                  className="absolute right-1 top-1/2 -translate-y-1/2"
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleClearSearch}
                    className="h-7 w-7"
                    aria-label="Clear search"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search Results Dropdown */}
      <AnimatePresence>
        {isOpen && searchQuery && (
          <motion.div
            initial={{ 
              opacity: 0, 
              y: -10,
              scale: 0.95
            }}
            animate={{ 
              opacity: 1, 
              y: 0,
              scale: 1
            }}
            exit={{ 
              opacity: 0, 
              y: -10,
              scale: 0.95
            }}
            transition={{ 
              duration: 0.3,
              ease: [0.4, 0, 0.2, 1],
              opacity: { duration: 0.2 },
              y: { duration: 0.3 },
              scale: { duration: 0.3 }
            }}
            className="absolute top-full right-0 mt-2 w-full md:w-96 max-h-[70vh] overflow-hidden z-50"
            style={{ 
              transformOrigin: 'top right',
              willChange: 'transform, opacity'
            }}
          >
            <Card className="shadow-lg overflow-hidden backdrop-blur-sm bg-white/95">
              {isSearching || productsLoading ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                  className="p-8 flex items-center justify-center"
                >
                  <Loader2 className="h-6 w-6 animate-spin text-green-600" />
                </motion.div>
              ) : filteredProducts.length === 0 ? (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                  className="p-8 text-center text-gray-500"
                >
                  <p className="text-sm">{t.categories?.noProducts || 'Aucun produit trouvé'}</p>
                </motion.div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-y-auto max-h-[60vh]"
                  style={{ willChange: 'transform' }}
                >
                  <div className="p-2">
                    {displayedResults.map((product, index) => (
                      <motion.div
                        key={product.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ 
                          delay: index * 0.04, 
                          duration: 0.3,
                          ease: [0.4, 0, 0.2, 1]
                        }}
                        style={{ willChange: 'transform, opacity' }}
                      >
                        <Link
                          to={`/product/${product.id}`}
                          onClick={handleProductClick}
                          className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-all duration-200 ease-out"
                        >
                          <motion.div 
                            className="w-16 h-16 flex-shrink-0 rounded-md overflow-hidden bg-gray-100"
                            whileHover={{ scale: 1.05 }}
                            transition={{ duration: 0.2 }}
                          >
                            <img
                              src={product.images?.[0] || 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=800&q=80'}
                              alt={getProductName(product)}
                              className="w-full h-full object-cover"
                            />
                          </motion.div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-sm text-gray-900 truncate">
                              {getProductName(product)}
                            </h4>
                            <p className="text-xs text-gray-500 line-clamp-1">
                              {getProductDescription(product)}
                            </p>
                            <p className="text-sm font-bold text-green-600 mt-1">
                              {product.price.toLocaleString()} DH
                            </p>
                          </div>
                        </Link>
                      </motion.div>
                    ))}
                  </div>

                  <AnimatePresence mode="wait">
                    {hasMoreResults && !showAllResults && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ 
                          duration: 0.3,
                          ease: [0.4, 0, 0.2, 1],
                          height: { duration: 0.3 },
                          opacity: { duration: 0.2 }
                        }}
                        className="border-t overflow-hidden"
                      >
                        <div className="p-3">
                          <Button
                            variant="ghost"
                            onClick={() => setShowAllResults(true)}
                            className="w-full text-green-600 hover:text-green-700 hover:bg-green-50 transition-all duration-200"
                          >
                            {t.common?.showMore || 'Afficher plus'} ({filteredProducts.length - INITIAL_RESULTS_LIMIT} {t.common?.more || 'de plus'})
                          </Button>
                        </div>
                      </motion.div>
                    )}

                    {showAllResults && hasMoreResults && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ 
                          duration: 0.3,
                          ease: [0.4, 0, 0.2, 1],
                          height: { duration: 0.3 },
                          opacity: { duration: 0.2 }
                        }}
                        className="border-t overflow-hidden"
                      >
                        <div className="p-3">
                          <Button
                            variant="ghost"
                            onClick={() => setShowAllResults(false)}
                            className="w-full text-gray-600 hover:text-gray-700 hover:bg-gray-50 transition-all duration-200"
                          >
                            {t.common?.showLess || 'Afficher moins'}
                          </Button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}