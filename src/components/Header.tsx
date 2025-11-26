import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { SearchBar } from '@/components/SearchBar';
import { useLanguage } from '@/contexts/LanguageContext';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function Header() {
  const { t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const mobileMenuVariants = {
    hidden: {
      opacity: 0,
      height: 0,
      transition: {
        duration: 0.3,
        ease: 'easeInOut',
        when: 'afterChildren',
      },
    },
    visible: {
      opacity: 1,
      height: 'auto',
      transition: {
        duration: 0.3,
        ease: 'easeInOut',
        when: 'beforeChildren',
        staggerChildren: 0.05,
      },
    },
  };

  const menuItemVariants = {
    hidden: {
      opacity: 0,
      x: -20,
    },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.2,
        ease: 'easeOut',
      },
    },
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container flex h-16 md:h-24 items-center justify-between px-4">
        <NavLink to="/" className="flex items-center flex-shrink-0">
          <img 
            src="/logo.png" 
            alt="Dima Vélo Logo" 
            className="h-12 md:h-20 w-auto object-contain"
          />
        </NavLink>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          <Button variant="ghost" asChild className="text-sm lg:text-base">
            <NavLink 
              to="/"
              className={({ isActive }) => 
                isActive ? "text-green-600 font-semibold" : ""
              }
            >
              {t.nav.home}
            </NavLink>
          </Button>
          <Button variant="ghost" asChild className="text-sm lg:text-base">
            <NavLink 
              to="/categories"
              className={({ isActive }) => 
                isActive ? "text-green-600 font-semibold" : ""
              }
            >
              {t.nav.categories}
            </NavLink>
          </Button>
          <Button variant="ghost" asChild className="text-sm lg:text-base">
            <NavLink 
              to="/services"
              className={({ isActive }) => 
                isActive ? "text-green-600 font-semibold" : ""
              }
            >
              {t.nav.services}
            </NavLink>
          </Button>
          <Button variant="ghost" asChild className="text-sm lg:text-base">
            <NavLink 
              to="/contact"
              className={({ isActive }) => 
                isActive ? "text-green-600 font-semibold" : ""
              }
            >
              {t.nav.contact}
            </NavLink>
          </Button>
          <SearchBar />
          <LanguageSwitcher />
        </nav>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden items-center gap-2">
          <SearchBar />
          <LanguageSwitcher />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
            className="relative"
          >
            <motion.div
              initial={false}
              animate={{ rotate: mobileMenuOpen ? 90 : 0 }}
              transition={{ duration: 0.2 }}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </motion.div>
          </Button>
        </div>
      </div>

      {/* Mobile Navigation with Animation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={mobileMenuVariants}
            className="md:hidden border-t bg-white overflow-hidden"
          >
            <nav className="container px-4 py-4 flex flex-col space-y-2">
              <motion.div variants={menuItemVariants}>
                <Button 
                  variant="ghost" 
                  asChild 
                  className="w-full justify-start"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <NavLink 
                    to="/"
                    className={({ isActive }) => 
                      isActive ? "text-green-600 font-semibold" : ""
                    }
                  >
                    {t.nav.home}
                  </NavLink>
                </Button>
              </motion.div>

              <motion.div variants={menuItemVariants}>
                <Button 
                  variant="ghost" 
                  asChild 
                  className="w-full justify-start"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <NavLink 
                    to="/categories"
                    className={({ isActive }) => 
                      isActive ? "text-green-600 font-semibold" : ""
                    }
                  >
                    {t.nav.categories}
                  </NavLink>
                </Button>
              </motion.div>

              <motion.div variants={menuItemVariants}>
                <Button 
                  variant="ghost" 
                  asChild 
                  className="w-full justify-start"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <NavLink 
                    to="/services"
                    className={({ isActive }) => 
                      isActive ? "text-green-600 font-semibold" : ""
                    }
                  >
                    {t.nav.services}
                  </NavLink>
                </Button>
              </motion.div>

              <motion.div variants={menuItemVariants}>
                <Button 
                  variant="ghost" 
                  asChild 
                  className="w-full justify-start"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <NavLink 
                    to="/contact"
                    className={({ isActive }) => 
                      isActive ? "text-green-600 font-semibold" : ""
                    }
                  >
                    {t.nav.contact}
                  </NavLink>
                </Button>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}