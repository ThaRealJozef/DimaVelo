import { useState } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Mail, MapPin, Phone, Clock } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function ContactPage() {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Contact form:', formData);
    alert('Message envoyé ! Nous vous répondrons bientôt.');
    setFormData({ name: '', email: '', phone: '', message: '' });
  };

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden w-full">
      <Header />

      <main className="flex-1 overflow-hidden">
        {/* Hero */}
        <section className="relative bg-gradient-to-r from-green-600 to-green-800 text-white py-12 md:py-16 overflow-hidden">
          <div className="container px-4">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3 md:mb-4 break-words">{t.contact.title}</h1>
            <p className="text-lg md:text-xl text-green-100 break-words">{t.contact.subtitle}</p>
          </div>
        </section>

        {/* Contenu */}
        <section className="py-12 md:py-16 overflow-hidden">
          <div className="container px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
              {/* Formulaire */}
              <Card className="overflow-hidden">
                <CardHeader className="p-4 md:p-6">
                  <CardTitle className="text-xl md:text-2xl break-words">{t.contact.send}</CardTitle>
                  <CardDescription className="text-sm md:text-base break-words">
                    Remplissez le formulaire et nous vous répondrons dans les plus brefs délais
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-4 md:p-6">
                  <form onSubmit={handleSubmit} className="space-y-4">
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

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                      <div>
                        <Label htmlFor="phone" className="text-sm md:text-base">{t.contact.phone}</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder={t.contact.phonePlaceholder}
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
                        rows={6}
                        required
                        className="text-sm md:text-base resize-none"
                      />
                    </div>

                    <Button type="submit" className="w-full text-sm md:text-base">
                      {t.contact.send}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Informations */}
              <div className="space-y-6">
                <Card className="overflow-hidden">
                  <CardHeader className="p-4 md:p-6">
                    <CardTitle className="text-xl md:text-2xl break-words">{t.contact.info}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 p-4 md:p-6">
                    <div className="flex items-start gap-3 md:gap-4">
                      <MapPin className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
                      <div className="overflow-hidden">
                        <h3 className="font-semibold mb-1 text-sm md:text-base break-words">{t.contact.address}</h3>
                        <p className="text-gray-600 text-sm md:text-base break-words">{t.contact.addressValue}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 md:gap-4">
                      <Phone className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
                      <div className="overflow-hidden">
                        <h3 className="font-semibold mb-1 text-sm md:text-base break-words">{t.contact.phone}</h3>
                        <a href="tel:+212631532200" className="text-green-600 hover:underline text-sm md:text-base break-words">
                          +212 6 31 53 22 00
                        </a>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 md:gap-4">
                      <Mail className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
                      <div className="overflow-hidden">
                        <h3 className="font-semibold mb-1 text-sm md:text-base break-words">{t.contact.email}</h3>
                        <a href="mailto:dimaveloteam@gmail.com" className="text-green-600 hover:underline text-sm md:text-base break-all">
                          dimaveloteam@gmail.com
                        </a>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 md:gap-4">
                      <Clock className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
                      <div className="overflow-hidden">
                        <h3 className="font-semibold mb-1 text-sm md:text-base break-words">{t.contact.hours}</h3>
                        <p className="text-gray-600 text-sm md:text-base break-words">{t.contact.hoursValue}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="overflow-hidden">
                  <CardHeader className="p-4 md:p-6">
                    <CardTitle className="text-xl md:text-2xl break-words">{t.contact.location}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 md:p-6">
                    <div className="aspect-video rounded-lg overflow-hidden bg-gray-100 w-full">
                      <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d106451.0!2d-6.8!3d34.05!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xda76b871f50c5c1%3A0x7ac946ed7408076b!2sSal%C3%A9%2C%20Morocco!5e0!3m2!1sen!2s!4v1234567890"
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