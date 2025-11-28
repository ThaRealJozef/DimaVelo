import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { useManifestSwitcher } from '@/hooks/useManifestSwitcher';
import { useEffect } from 'react';
import Index from './pages/Index';
import NotFound from './pages/NotFound';
import CategoriesPage from './pages/CategoriesPage';
import ProductPage from './pages/ProductPage';
import ServicesPage from './pages/ServicesPage';
import ContactPage from './pages/ContactPage';
import AdminPage from './pages/AdminPage';
import LoginPage from './pages/LoginPage';
import TestImageUpload from '@/components/TestImageUpload';
import PromotionsPage from './pages/PromotionsPage';
import { PageTransition } from '@/components/PageTransition';


const queryClient = new QueryClient();

// ScrollToTop component to handle navigation scroll behavior
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

// Component to handle manifest switching
function ManifestSwitcher() {
  useManifestSwitcher();
  return null;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <TooltipProvider>
        <Toaster />
        <BrowserRouter>
          <ScrollToTop />
          <ManifestSwitcher />
          <div className="overflow-x-hidden w-full">
            <Routes>
              <Route path="/" element={<PageTransition><Index /></PageTransition>} />
              <Route path="/categories" element={<PageTransition><CategoriesPage /></PageTransition>} />
              <Route path="/categories/:categorySlug" element={<PageTransition><CategoriesPage /></PageTransition>} />
              <Route path="/categories/:categorySlug/:subcategorySlug" element={<PageTransition><CategoriesPage /></PageTransition>} />
              <Route path="/product/:id" element={<PageTransition><ProductPage /></PageTransition>} />
              <Route path="/promotions" element={<PageTransition><PromotionsPage /></PageTransition>} />
              <Route path="/services" element={<PageTransition><ServicesPage /></PageTransition>} />
              <Route path="/contact" element={<PageTransition><ContactPage /></PageTransition>} />
              <Route path="/admin/login" element={<PageTransition><LoginPage /></PageTransition>} />
              <Route
                path="/admin"
                element={
                  <PageTransition>
                    <ProtectedRoute>
                      <AdminPage />
                    </ProtectedRoute>
                  </PageTransition>
                }
              />
              <Route path="/test-upload" element={<PageTransition><TestImageUpload /></PageTransition>} />
            </Routes>
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;