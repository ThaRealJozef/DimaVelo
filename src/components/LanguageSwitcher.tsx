import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useLanguage } from '@/contexts/LanguageContext';
import { Globe } from 'lucide-react';

export const languages = [
  {
    code: 'fr' as const,
    name: 'Français',
    flag: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 3 2" style={{ width: '100%', height: '100%', display: 'block' }} preserveAspectRatio="none">
        <rect width="1" height="2" x="0" fill="#0055A4" />
        <rect width="1" height="2" x="1" fill="#FFFFFF" />
        <rect width="1" height="2" x="2" fill="#EF4135" />
      </svg>
    )
  },
  {
    code: 'en' as const,
    name: 'English',
    flag: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 30" style={{ width: '100%', height: '100%', display: 'block' }} preserveAspectRatio="none">
        <clipPath id="uk-clip-s">
          <path d="M0,0 v30 h60 v-30 z" />
        </clipPath>
        <clipPath id="uk-clip-t">
          <path d="M30,15 h30 v15 z v-15 h-30 z h-30 v15 z v-15 h30 z" />
        </clipPath>
        <g clipPath="url(#uk-clip-s)">
          <path d="M0,0 v30 h60 v-30 z" fill="#012169" />
          <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6" />
          <path d="M0,0 L60,30 M60,0 L0,30" clipPath="url(#uk-clip-t)" stroke="#C8102E" strokeWidth="4" />
          <path d="M30,0 v30 M0,15 h60" stroke="#fff" strokeWidth="10" />
          <path d="M30,0 v30 M0,15 h60" stroke="#C8102E" strokeWidth="6" />
        </g>
      </svg>
    )
  },
  {
    code: 'ar' as const,
    name: 'العربية',
    flag: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 600" style={{ width: '100%', height: '100%', display: 'block' }} preserveAspectRatio="none">
        <rect width="900" height="600" fill="#C1272D" />
        <g transform="translate(450,300) scale(2.7)" fill="none" stroke="#006233" strokeWidth="12" strokeLinejoin="round">
          <path d="M 0,-60 L 34.64,48.54 L -56.08,-18.54 L 56.08,-18.54 L -34.64,48.54 Z" />
        </g>
      </svg>
    )
  },
];

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();
  const currentLanguage = languages.find(lang => lang.code === language);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2">
          <Globe className="h-4 w-4" />
          <span className="hidden sm:inline">{currentLanguage?.name}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => setLanguage(lang.code)}
            className="flex items-center gap-3 cursor-pointer py-2.5"
          >
            <div className="flex-shrink-0 w-9 h-6 rounded overflow-hidden border border-gray-200 shadow-sm">
              {lang.flag}
            </div>
            <span className={`flex-1 ${language === lang.code ? 'font-semibold text-blue-600' : ''}`}>
              {lang.name}
            </span>
            {language === lang.code && (
              <span className="text-blue-600">✓</span>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}