import { Link } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Home } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function NotFound() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center">
        <div className="text-center space-y-6 p-6">
          <h1 className="text-6xl font-bold text-gray-300">404</h1>
          <h2 className="text-3xl font-bold">{t.common.notFound}</h2>
          <p className="text-gray-600 max-w-md">
            La page que vous recherchez n'existe pas ou a été déplacée.
          </p>
          <Button asChild size="lg">
            <Link to="/">
              <Home className="mr-2 h-5 w-5" />
              {t.nav.home}
            </Link>
          </Button>
        </div>
      </main>
      <Footer />
    </div>
  );
}