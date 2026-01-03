import { useState, ReactNode } from 'react';
import { LucideIcon, Mail, MapPin, Phone, Clock } from 'lucide-react';

import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useLanguage } from '@/contexts/LanguageContext';

interface FormData {
  name: string;
  email: string;
  phone: string;
  message: string;
}

const initialFormData: FormData = { name: '', email: '', phone: '', message: '' };

const PHONE = '+212 6 31 53 22 00';
const EMAIL = 'dimaveloteam@gmail.com';
const MAP_URL = 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d106451.0!2d-6.8!3d34.05!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xda76b871f50c5c1%3A0x7ac946ed7408076b!2sSal%C3%A9%2C%20Morocco!5e0!3m2!1sen!2s!4v1234567890';

function ContactInfoRow({ icon: Icon, title, children }: { icon: LucideIcon; title: string; children: ReactNode }) {
  return (
    <div className="flex items-start gap-3 md:gap-4">
      <Icon className="h-5 w-5 text-green-600 mt-1 shrink-0" />
      <div className="overflow-hidden">
        <h3 className="font-semibold mb-1 text-sm md:text-base wrap-break-word">{title}</h3>
        {children}
      </div>
    </div>
  );
}

function FormField({
  id,
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  required,
  rows,
}: {
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  required?: boolean;
  rows?: number;
}) {
  const commonClass = 'text-sm md:text-base';
  const InputComponent = rows ? Textarea : Input;

  return (
    <div>
      <Label htmlFor={id} className={commonClass}>{label}</Label>
      <InputComponent
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className={`${commonClass} ${rows ? 'resize-none' : ''}`}
        {...(rows ? { rows } : {})}
      />
    </div>
  );
}

export default function ContactPage() {
  const { t } = useLanguage();
  const [formData, setFormData] = useState<FormData>(initialFormData);

  const updateField = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Contact form:', formData);
    alert('Message envoyé ! Nous vous répondrons bientôt.');
    setFormData(initialFormData);
  };

  return (
    <div className="min-h-screen flex flex-col w-full">
      <Header />

      <main className="flex-1 overflow-hidden">
        <section className="relative bg-linear-to-r from-green-600 to-green-800 text-white py-12 md:py-16 overflow-hidden">
          <div className="container px-4">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3 md:mb-4 wrap-break-word">{t.contact.title}</h1>
            <p className="text-lg md:text-xl text-green-100 wrap-break-word">{t.contact.subtitle}</p>
          </div>
        </section>

        <section className="py-12 md:py-16 overflow-hidden">
          <div className="container px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
              <Card className="overflow-hidden">
                <CardHeader className="p-4 md:p-6">
                  <CardTitle className="text-xl md:text-2xl wrap-break-word">{t.contact.send}</CardTitle>
                  <CardDescription className="text-sm md:text-base wrap-break-word">
                    Remplissez le formulaire et nous vous répondrons dans les plus brefs délais
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-4 md:p-6">
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <FormField
                      id="name"
                      label={t.contact.name}
                      value={formData.name}
                      onChange={(v) => updateField('name', v)}
                      placeholder={t.contact.namePlaceholder}
                      required
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        id="email"
                        label={t.contact.email}
                        type="email"
                        value={formData.email}
                        onChange={(v) => updateField('email', v)}
                        placeholder={t.contact.emailPlaceholder}
                      />
                      <FormField
                        id="phone"
                        label={t.contact.phone}
                        type="tel"
                        value={formData.phone}
                        onChange={(v) => updateField('phone', v)}
                        placeholder={t.contact.phonePlaceholder}
                      />
                    </div>

                    <FormField
                      id="message"
                      label={t.contact.message}
                      value={formData.message}
                      onChange={(v) => updateField('message', v)}
                      placeholder={t.contact.messagePlaceholder}
                      required
                      rows={6}
                    />

                    <Button type="submit" className="w-full text-sm md:text-base">
                      {t.contact.send}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              <div className="space-y-6">
                <Card className="overflow-hidden">
                  <CardHeader className="p-4 md:p-6">
                    <CardTitle className="text-xl md:text-2xl wrap-break-word">{t.contact.info}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 p-4 md:p-6">
                    <ContactInfoRow icon={MapPin} title={t.contact.address}>
                      <p className="text-gray-600 text-sm md:text-base wrap-break-word">{t.contact.addressValue}</p>
                    </ContactInfoRow>

                    <ContactInfoRow icon={Phone} title={t.contact.phone}>
                      <a href="tel:+212631532200" className="text-green-600 hover:underline text-sm md:text-base wrap-break-word">
                        {PHONE}
                      </a>
                    </ContactInfoRow>

                    <ContactInfoRow icon={Mail} title={t.contact.email}>
                      <a href={`mailto:${EMAIL}`} className="text-green-600 hover:underline text-sm md:text-base break-all">
                        {EMAIL}
                      </a>
                    </ContactInfoRow>

                    <ContactInfoRow icon={Clock} title={t.contact.hours}>
                      <p className="text-gray-600 text-sm md:text-base wrap-break-word">{t.contact.hoursValue}</p>
                    </ContactInfoRow>
                  </CardContent>
                </Card>

                <Card className="overflow-hidden">
                  <CardHeader className="p-4 md:p-6">
                    <CardTitle className="text-xl md:text-2xl wrap-break-word">{t.contact.location}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 md:p-6">
                    <div className="aspect-video rounded-lg overflow-hidden bg-gray-100 w-full">
                      <iframe
                        src={MAP_URL}
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen
                        loading="lazy"
                        title="Location Map"
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}