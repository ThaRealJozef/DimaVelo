import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
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
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

export default function ServicesPage() {
  const { t } = useLanguage();
  const [searchParams] = useSearchParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    date: '',
    message: '',
  });

  // Pre-select service from URL parameter
  useEffect(() => {
    const serviceParam = searchParams.get('service');
    if (serviceParam && servicesData.find(s => s.id === serviceParam)) {
      setFormData(prev => ({ ...prev, service: serviceParam }));
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const selectedService = servicesData.find(s => s.id === formData.service);
      const serviceName = selectedService ? getServiceTranslation(selectedService.id).title : formData.service;

      await bookingService.createBooking({
        customerName: formData.name,
        customerEmail: formData.email,
        customerPhone: formData.phone,
        serviceId: formData.service,
        serviceName: serviceName,
        date: formData.date,
        message: formData.message,
      });

      toast.success('Réservation envoyée avec succès ! Nous vous contactons bientôt.');
      setFormData({ name: '', email: '', phone: '', service: '', date: '', message: '' });
    } catch (error) {
      console.error('Error creating booking:', error);
      toast.error('Erreur lors de l\'envoi de la réservation. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Map service IDs to translations
  const getServiceTranslation = (serviceId: string) => {
    const translations: Record<string, { title: string; desc: string }> = {
      'bikeRepair': { title: t.services.bikeRepair, desc: t.services.bikeRepairDesc },
      'maintenance': { title: t.services.maintenance, desc: t.services.maintenanceDesc },
      'customization': { title: t.services.customization, desc: t.services.customizationDesc },
      'assembly': { title: t.services.assembly, desc: t.services.assemblyDesc },
      'accessories': { title: t.services.accessories, desc: t.services.accessoriesDesc },
      'consultation': { title: t.services.consultation, desc: t.services.consultationDesc },
    };
    return translations[serviceId] || { title: serviceId, desc: '' };
  };

  const formatPrice = (price: number) => {
    if (price === 0) return t.services.onQuote;
    return `${t.services.fromPrice} ${price} MAD`;
  };

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden w-full">
      <Header />

      <main className="flex-1 overflow-hidden">
        {/* Hero */}
        <section className="relative bg-gradient-to-r from-green-600 to-green-800 text-white py-12 md:py-16 overflow-hidden">
          <div className="container px-4">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3 md:mb-4 break-words">{t.services.title}</h1>
            <p className="text-lg md:text-xl text-green-100 break-words">{t.services.subtitle}</p>
          </div>
        </section>

        {/* Services */}
        <section className="py-12 md:py-16 overflow-hidden">
          <div className="container px-4">
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6 mb-12 md:mb-16">
              {servicesData.map((service) => {
                const translation = getServiceTranslation(service.id);
                return (
                  <Card key={service.id} className="hover:shadow-lg transition-shadow overflow-hidden h-full flex flex-col">
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
                        <span className="text-base md:text-lg font-bold text-green-600 break-words">
                          {formatPrice(service.price)}
                        </span>
                        <span className="text-xs md:text-sm text-gray-600 break-words">
                          {t.services.duration}: {service.duration} {t.services.minutes}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Formulaire de réservation */}
            <div className="max-w-2xl mx-auto">
              <Card className="overflow-hidden">
                <CardHeader className="p-4 md:p-6">
                  <CardTitle className="text-xl md:text-2xl break-words">{t.services.bookService}</CardTitle>
                  <CardDescription className="text-sm md:text-base break-words">
                    {t.services.bookingDesc}
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-4 md:p-6">
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name" className="text-sm md:text-base">{t.contact.name}</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder={t.contact.namePlaceholder}
                          required
                          className="text-sm md:text-base"
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone" className="text-sm md:text-base">{t.contact.phone}</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder={t.contact.phonePlaceholder}
                          required
                          className="text-sm md:text-base"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="email" className="text-sm md:text-base">{t.contact.email}</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder={t.contact.emailPlaceholder}
                        className="text-sm md:text-base"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="service" className="text-sm md:text-base">{t.admin.service}</Label>
                        <Select
                          key={formData.service}
                          value={formData.service}
                          onValueChange={(value) => setFormData({ ...formData, service: value })}
                          required
                        >
                          <SelectTrigger id="service" className="text-sm md:text-base">
                            <SelectValue placeholder={t.services.selectService} />
                          </SelectTrigger>
                          <SelectContent>
                            {servicesData.map((service) => {
                              const translation = getServiceTranslation(service.id);
                              return (
                                <SelectItem key={service.id} value={service.id} className="text-sm md:text-base">
                                  {service.icon} {translation.title}
                                </SelectItem>
                              );
                            })}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="date" className="text-sm md:text-base">{t.admin.date}</Label>
                        <Input
                          id="date"
                          type="date"
                          value={formData.date}
                          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                          required
                          className="text-sm md:text-base"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="message" className="text-sm md:text-base">{t.contact.message}</Label>
                      <Textarea
                        id="message"
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder={t.contact.messagePlaceholder}
                        rows={4}
                        className="text-sm md:text-base resize-none"
                      />
                    </div>

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
