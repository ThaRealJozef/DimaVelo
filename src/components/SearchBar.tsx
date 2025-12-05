import { useState, useEffect, useRef, ReactNode } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, X, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useProducts } from '@/hooks/useProducts';
import { useLanguage } from '@/contexts/LanguageContext';
import { categories } from '@/lib/data';
import { Product } from '@/lib/types';

const INITIAL_RESULTS_LIMIT = 5;
const SEARCH_DEBOUNCE_MS = 300;

type Language = 'fr' | 'en' | 'ar';

const smoothTransition = { duration: 0.15, ease: [0.25, 0.1, 0.25, 1] };
const fadeTransition = { duration: 0.2 };

function getLocalizedField(item: any, field: string, lang: Language): string {
  const langSuffix = lang === 'ar' ? 'Ar' : lang === 'en' ? 'En' : 'Fr';
  return item[`${field}${langSuffix}`] || item[`${field}Fr`] || '';
}

function highlightText(text: string, query: string): ReactNode {
  if (!query.trim() || !text) return text;
  try {
    const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const parts = text.split(new RegExp(`(${escaped})`, 'gi'));
    return parts.map((part, i) =>
      part.toLowerCase() === query.toLowerCase()
        ? <mark key={i} className="bg-yellow-200 px-0.5 rounded">{part}</mark>
        : part
    );
  } catch {
    return text;
  }
}

function SearchResultItem({
  product,
  query,
  language,
  onClick,
  index,
}: {
  product: Product;
  query: string;
  language: Language;
  onClick: () => void;
  index: number;
}) {
  const name = getLocalizedField(product, 'name', language);
  const description = getLocalizedField(product, 'description', language);
  const category = categories.find((c) => c.id === product.categoryId);
  const categoryName = category ? getLocalizedField(category, 'name', language) : '';
  const defaultImg = 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=800&q=80';

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.04, ...smoothTransition }}
    >
      <Link
        to={`/product/${product.id}`}
        onClick={onClick}
        className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-all duration-200"
      >
        <motion.div
          className="w-16 h-16 flex-shrink-0 rounded-md overflow-hidden bg-gray-100"
          whileHover={{ scale: 1.05 }}
          transition={fadeTransition}
        >
          <img
            src={product.images?.[0] || defaultImg}
            alt={name}
            className="w-full h-full object-cover"
          />
        </motion.div>
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-sm text-gray-900 truncate">
            {highlightText(name, query)}
          </h4>
          <p className="text-xs text-gray-500 line-clamp-1">
            {highlightText(description, query)}
          </p>
          <div className="flex items-center gap-2 mt-1">
            <p className="text-sm font-bold text-green-600">{product.price.toLocaleString()} DH</p>
            <Badge variant="outline" className="text-xs">{categoryName}</Badge>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

function useClickOutside(ref: React.RefObject<HTMLElement>, handler: () => void) {
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) handler();
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [ref, handler]);
}

function useEscapeKey(handler: () => void) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handler();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [handler]);
}

function useSearchHistory() {
  const [history, setHistory] = useState<string[]>([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('searchHistory');
      if (saved) setHistory(JSON.parse(saved));
    } catch { }
  }, []);

  const addToHistory = (query: string) => {
    if (!query.trim()) return;
    const updated = [query, ...history.filter((h) => h.toLowerCase() !== query.toLowerCase())].slice(0, 5);
    setHistory(updated);
    localStorage.setItem('searchHistory', JSON.stringify(updated));
  };

  return { history, addToHistory };
}

export function SearchBar() {
  const { t, language } = useLanguage();
  const { products, loading: productsLoading } = useProducts();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAllResults, setShowAllResults] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { addToHistory } = useSearchHistory();
  const lang = language as Language;

  const closeSearch = () => {
    setIsOpen(false);
    setSearchQuery('');
  };

  useClickOutside(searchRef, () => setIsOpen(false));
  useEscapeKey(closeSearch);

  useEffect(() => {
    if (!searchQuery) {
      setIsSearching(false);
      return;
    }
    setIsSearching(true);
    const timer = setTimeout(() => setIsSearching(false), SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const filteredProducts = searchQuery.trim()
    ? products.filter((p) => {
      const query = searchQuery.toLowerCase();
      const name = getLocalizedField(p, 'name', lang).toLowerCase();
      const desc = getLocalizedField(p, 'description', lang).toLowerCase();
      return name.includes(query) || desc.includes(query);
    })
    : [];

  const displayedResults = showAllResults ? filteredProducts : filteredProducts.slice(0, INITIAL_RESULTS_LIMIT);
  const hasMoreResults = filteredProducts.length > INITIAL_RESULTS_LIMIT;

  const handleSearchClick = () => {
    setIsOpen(true);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const handleClear = () => {
    setSearchQuery('');
    setShowAllResults(false);
    inputRef.current?.focus();
  };

  const handleProductClick = () => {
    if (searchQuery.trim()) addToHistory(searchQuery);
    closeSearch();
    setShowAllResults(false);
  };

  return (
    <div ref={searchRef} className="relative">
      <AnimatePresence mode="wait">
        {!isOpen ? (
          <motion.div
            key="button"
            initial={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={fadeTransition}
          >
            <Button variant="ghost" size="icon" onClick={handleSearchClick} aria-label="Search">
              <Search className="h-5 w-5" />
            </Button>
          </motion.div>
        ) : (
          <motion.div
            key="input"
            initial={{ opacity: 0, width: 40, scale: 0.95 }}
            animate={{ opacity: 1, width: '100%', scale: 1 }}
            exit={{ opacity: 0, width: 40, scale: 0.95 }}
            transition={smoothTransition}
            className="relative w-full"
            style={{ transformOrigin: 'right center' }}
          >
            <motion.div
              initial={{ x: -10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.1, ...fadeTransition }}
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
                  transition={fadeTransition}
                  className="absolute right-1 top-1/2 -translate-y-1/2"
                >
                  <Button variant="ghost" size="icon" onClick={handleClear} className="h-7 w-7" aria-label="Clear">
                    <X className="h-4 w-4" />
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && searchQuery && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={smoothTransition}
            className="absolute top-full right-0 mt-2 w-full md:w-96 max-h-[70vh] overflow-hidden z-50"
            style={{ transformOrigin: 'top right' }}
          >
            <Card className="shadow-lg overflow-hidden backdrop-blur-sm bg-white/95">
              {isSearching || productsLoading ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-8 flex items-center justify-center">
                  <Loader2 className="h-6 w-6 animate-spin text-green-600" />
                </motion.div>
              ) : filteredProducts.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={smoothTransition}
                  className="p-8 text-center text-gray-500"
                >
                  <p className="text-sm">{t.categories?.noProducts || 'Aucun produit trouvé'}</p>
                </motion.div>
              ) : (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="overflow-y-auto max-h-[60vh]">
                  <div className="p-2">
                    {displayedResults.map((product, i) => (
                      <SearchResultItem
                        key={product.id}
                        product={product}
                        query={searchQuery}
                        language={lang}
                        onClick={handleProductClick}
                        index={i}
                      />
                    ))}
                  </div>

                  <AnimatePresence mode="wait">
                    {hasMoreResults && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={smoothTransition}
                        className="border-t overflow-hidden"
                      >
                        <div className="p-3">
                          <Button
                            variant="ghost"
                            onClick={() => setShowAllResults(!showAllResults)}
                            className={`w-full transition-all duration-200 ${showAllResults ? 'text-gray-600 hover:bg-gray-50' : 'text-green-600 hover:bg-green-50'}`}
                          >
                            {showAllResults
                              ? t.common?.showLess || 'Afficher moins'
                              : `${t.common?.showMore || 'Afficher plus'} (${filteredProducts.length - INITIAL_RESULTS_LIMIT} ${t.common?.more || 'de plus'})`}
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