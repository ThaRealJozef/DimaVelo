import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { servicesData } from '@/lib/services-data';
import { useLanguage } from '@/contexts/LanguageContext';
import { bookingService } from '@/services/bookingService';

interface FormData {
  name: string;
  email: string;
  phone: string;
  service: string;
  date: string;
  message: string;
}

const initialFormData: FormData = { name: '', email: '', phone: '', service: '', date: '', message: '' };

function ServiceCard({
  service,
  translation,
  priceText,
  durationText,
}: {
  service: (typeof servicesData)[0];
  translation: { title: string; desc: string };
  priceText: string;
  durationText: string;
}) {
  return (
    <Card className="hover:shadow-lg transition-shadow overflow-hidden h-full flex flex-col">
      <CardHeader className="p-4 md:p-6">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl md:text-4xl flex-shrink-0">{service.icon}</span>
          <CardTitle className="text-lg md:text-xl break-words">{translation.title}</CardTitle>
        </div>
        <CardDescription className="text-xs md:text-sm leading-relaxed break-words flex-1">
          {translation.desc}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4 md:p-6 pt-0 mt-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <span className="text-base md:text-lg font-bold text-green-600 break-words">{priceText}</span>
          <span className="text-xs md:text-sm text-gray-600 break-words">{durationText}</span>
        </div>
      </CardContent>
    </Card>
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
  placeholder?: string;
  required?: boolean;
  rows?: number;
}) {
  const commonClass = 'text-sm md:text-base';
  const Component = rows ? Textarea : Input;

  return (
    <div>
      <Label htmlFor={id} className={commonClass}>{label}</Label>
      <Component
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

export default function ServicesPage() {
  const { t } = useLanguage();
  const [searchParams] = useSearchParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>(initialFormData);

  useEffect(() => {
    const serviceParam = searchParams.get('service');
    if (serviceParam && servicesData.find((s) => s.id === serviceParam)) {
      setFormData((prev) => ({ ...prev, service: serviceParam }));
    }
  }, [searchParams]);

  const getServiceTranslation = (serviceId: string) => {
    const map: Record<string, { title: string; desc: string }> = {
      bikeRepair: { title: t.services.bikeRepair, desc: t.services.bikeRepairDesc },
      maintenance: { title: t.services.maintenance, desc: t.services.maintenanceDesc },
      customization: { title: t.services.customization, desc: t.services.customizationDesc },
      assembly: { title: t.services.assembly, desc: t.services.assemblyDesc },
      accessories: { title: t.services.accessories, desc: t.services.accessoriesDesc },
      consultation: { title: t.services.consultation, desc: t.services.consultationDesc },
    };
    return map[serviceId] || { title: serviceId, desc: '' };
  };

  const formatPrice = (price: number) =>
    price === 0 ? t.services.onQuote : `${t.services.fromPrice} ${price} MAD`;

  const updateField = (field: keyof FormData, value: string) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const selectedService = servicesData.find((s) => s.id === formData.service);
      const serviceName = selectedService ? getServiceTranslation(selectedService.id).title : formData.service;

      await bookingService.createBooking({
        customerName: formData.name,
        customerEmail: formData.email,
        customerPhone: formData.phone,
        serviceId: formData.service,
        serviceName,
        date: formData.date,
        message: formData.message,
      });

      toast.success('Réservation envoyée avec succès ! Nous vous contactons bientôt.');
      setFormData(initialFormData);
    } catch (error) {
      console.error('Error creating booking:', error);
      toast.error("Erreur lors de l'envoi de la réservation. Veuillez réessayer.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden w-full">
      <Header />

      <main className="flex-1 overflow-hidden">
        <section className="relative bg-gradient-to-r from-green-600 to-green-800 text-white py-12 md:py-16 overflow-hidden">
          <div className="container px-4">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3 md:mb-4 break-words">{t.services.title}</h1>
            <p className="text-lg md:text-xl text-green-100 break-words">{t.services.subtitle}</p>
          </div>
        </section>

        <section className="py-12 md:py-16 overflow-hidden">
          <div className="container px-4">
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6 mb-12 md:mb-16">
              {servicesData.map((service) => (
                <ServiceCard
                  key={service.id}
                  service={service}
                  translation={getServiceTranslation(service.id)}
                  priceText={formatPrice(service.price)}
                  durationText={`${t.services.duration}: ${service.duration} ${t.services.minutes}`}
                />
              ))}
            </div>

            <div className="max-w-2xl mx-auto">
              <Card className="overflow-hidden">
                <CardHeader className="p-4 md:p-6">
                  <CardTitle className="text-xl md:text-2xl break-words">{t.services.bookService}</CardTitle>
                  <CardDescription className="text-sm md:text-base break-words">{t.services.bookingDesc}</CardDescription>
                </CardHeader>
                <CardContent className="p-4 md:p-6">
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        id="name"
                        label={t.contact.name}
                        value={formData.name}
                        onChange={(v) => updateField('name', v)}
                        placeholder={t.contact.namePlaceholder}
                        required
                      />
                      <FormField
                        id="phone"
                        label={t.contact.phone}
                        type="tel"
                        value={formData.phone}
                        onChange={(v) => updateField('phone', v)}
                        placeholder={t.contact.phonePlaceholder}
                        required
                      />
                    </div>

                    <FormField
                      id="email"
                      label={t.contact.email}
                      type="email"
                      value={formData.email}
                      onChange={(v) => updateField('email', v)}
                      placeholder={t.contact.emailPlaceholder}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="service" className="text-sm md:text-base">{t.admin.service}</Label>
                        <Select
                          key={formData.service}
                          value={formData.service}
                          onValueChange={(v) => updateField('service', v)}
                          required
                        >
                          <SelectTrigger id="service" className="text-sm md:text-base">
                            <SelectValue placeholder={t.services.selectService} />
                          </SelectTrigger>
                          <SelectContent>
                            {servicesData.map((service) => (
                              <SelectItem key={service.id} value={service.id} className="text-sm md:text-base">
                                {service.icon} {getServiceTranslation(service.id).title}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <FormField
                        id="date"
                        label={t.admin.date}
                        type="date"
                        value={formData.date}
                        onChange={(v) => updateField('date', v)}
                        required
                      />
                    </div>

                    <FormField
                      id="message"
                      label={t.contact.message}
                      value={formData.message}
                      onChange={(v) => updateField('message', v)}
                      placeholder={t.contact.messagePlaceholder}
                      rows={4}
                    />

                    <Button type="submit" className="w-full text-sm md:text-base" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Envoi en cours...
                        </>
                      ) : (
                        t.services.bookNow
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
