import { Link } from 'react-router-dom';
import { Facebook, Instagram, Mail, MapPin, Phone } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { DeliveryInfo } from '@/components/DeliveryInfo';

const PHONE = '+212 6 31 53 22 00';
const EMAIL = 'dimaveloteam@gmail.com';

const socialLinks = [
  { href: 'https://facebook.com/DimaVeloTeam', icon: Facebook, label: 'Facebook' },
  { href: 'https://instagram.com/DimaVeloTeam', icon: Instagram, label: 'Instagram' },
];

function FooterSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="font-semibold text-white mb-3 md:mb-4">{title}</h3>
      {children}
    </div>
  );
}

function FooterLink({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <li>
      <Link to={to} className="hover:text-green-400 transition-colors break-words">
        {children}
      </Link>
    </li>
  );
}

export function Footer() {
  const { t } = useLanguage();

  const quickLinks = [
    { to: '/', label: t.nav.home },
    { to: '/categories', label: t.nav.categories },
    { to: '/services', label: t.nav.services },
    { to: '/faq', label: t.nav.faq },
    { to: '/contact', label: t.nav.contact },
  ];

  return (
    <footer className="bg-gray-900 text-gray-300 overflow-x-hidden">
      <div className="container py-8 md:py-12 px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 md:gap-8">
          <div className="space-y-4">
            <div className="flex items-center">
              <div className="bg-white/95 p-2 md:p-3 rounded-lg">
                <img src="/logo.png" alt="Dima Vélo" className="h-12 md:h-16 w-auto object-contain" />
              </div>
            </div>
            <p className="text-sm break-words">{t.footer.description}</p>
          </div>

          <FooterSection title={t.footer.quickLinks}>
            <ul className="space-y-2 text-sm">
              {quickLinks.map(({ to, label }) => (
                <FooterLink key={to} to={to}>{label}</FooterLink>
              ))}
            </ul>
          </FooterSection>

          <FooterSection title={t.nav.contact}>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 flex-shrink-0 mt-0.5" />
                <span className="break-words">{t.contact.addressValue}</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 flex-shrink-0" />
                <a href="tel:+212631532200" className="hover:text-green-400 transition-colors break-words">
                  {PHONE}
                </a>
              </li>
              <li className="flex items-start gap-2">
                <Mail className="h-4 w-4 flex-shrink-0 mt-0.5" />
                <a href={`mailto:${EMAIL}`} className="hover:text-green-400 transition-colors break-words">
                  {EMAIL}
                </a>
              </li>
            </ul>
          </FooterSection>

          <FooterSection title={t.footer.deliveryInfo}>
            <DeliveryInfo variant="compact" className="text-gray-300" />
          </FooterSection>

          <FooterSection title={t.footer.followUs}>
            <div className="flex gap-4">
              {socialLinks.map(({ href, icon: Icon, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-green-400 transition-colors"
                  aria-label={label}
                >
                  <Icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </FooterSection>
        </div>

        <div className="border-t border-gray-800 mt-6 md:mt-8 pt-6 md:pt-8 text-sm text-center">
          <p className="break-words px-4">© 2025 Dima Vélo. {t.footer.rights}</p>
        </div>
      </div>
    </footer>
  );
}
