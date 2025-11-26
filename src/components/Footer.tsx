import { Link } from 'react-router-dom';
import { Facebook, Instagram, Mail, MapPin, Phone } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-gray-900 text-gray-300 overflow-x-hidden">
      <div className="container py-8 md:py-12 px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {/* Logo et Description */}
          <div className="space-y-4">
            <div className="flex items-center">
              <div className="bg-white/95 p-2 md:p-3 rounded-lg">
                <img 
                  src="/logo.png" 
                  alt="Dima Vélo Logo" 
                  className="h-12 md:h-16 w-auto object-contain"
                />
              </div>
            </div>
            <p className="text-sm break-words">
              {t.footer.description}
            </p>
          </div>

          {/* Liens Rapides */}
          <div>
            <h3 className="font-semibold text-white mb-3 md:mb-4">{t.footer.quickLinks}</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="hover:text-green-400 transition-colors break-words">
                  {t.nav.home}
                </Link>
              </li>
              <li>
                <Link to="/categories" className="hover:text-green-400 transition-colors break-words">
                  {t.nav.categories}
                </Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-green-400 transition-colors break-words">
                  {t.nav.services}
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-green-400 transition-colors break-words">
                  {t.nav.contact}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-white mb-3 md:mb-4">{t.nav.contact}</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 flex-shrink-0 mt-0.5" />
                <span className="break-words">{t.contact.addressValue}</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 flex-shrink-0" />
                <a href="tel:+212631532200" className="hover:text-green-400 transition-colors break-words">
                  +212 6 31 53 22 00
                </a>
              </li>
              <li className="flex items-start gap-2">
                <Mail className="h-4 w-4 flex-shrink-0 mt-0.5" />
                <a href="mailto:dimaveloteam@gmail.com" className="hover:text-green-400 transition-colors break-words">
                  dimaveloteam@gmail.com
                </a>
              </li>
            </ul>
          </div>

          {/* Réseaux Sociaux */}
          <div>
            <h3 className="font-semibold text-white mb-3 md:mb-4">{t.footer.followUs}</h3>
            <div className="flex gap-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-green-400 transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-green-400 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-6 md:mt-8 pt-6 md:pt-8 text-sm text-center">
          <p className="break-words px-4">© 2025 Dima Vélo. {t.footer.rights}</p>
        </div>
      </div>
    </footer>
  );
}