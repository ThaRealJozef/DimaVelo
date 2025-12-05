import { Star, Quote } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface Testimonial {
    id: number;
    nameFr: string;
    nameAr: string;
    textFr: string;
    textAr: string;
    rating: number;
    location: string;
}

const testimonials: Testimonial[] = [
    {
        id: 1,
        nameFr: 'Mohammed',
        nameAr: 'محمد',
        textFr: 'Service excellent! Mon VTT est arrivé en parfait état. L\'équipe est très professionnelle.',
        textAr: 'خدمة ممتازة! وصلت دراجتي الجبلية في حالة ممتازة. الفريق محترف جداً.',
        rating: 5,
        location: 'Rabat',
    },
    {
        id: 2,
        nameFr: 'Youssef',
        nameAr: 'يوسف',
        textFr: 'Livraison rapide et gratuite à Salé. Je recommande vivement dima velo!',
        textAr: 'توصيل سريع ومجاني في سلا. أنصح بشدة بديما فيلو!',
        rating: 5,
        location: 'Salé',
    },
    {
        id: 3,
        nameFr: 'Karim',
        nameAr: 'كريم',
        textFr: 'Très bon rapport qualité-prix. Le service après-vente est au top!',
        textAr: 'جودة ممتازة مقابل السعر. خدمة ما بعد البيع رائعة!',
        rating: 5,
        location: 'Salé',
    },
];

function StarRating({ rating }: { rating: number }) {
    return (
        <div className="flex gap-1">
            {[...Array(5)].map((_, i) => (
                <Star
                    key={i}
                    className={`w-4 h-4 ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                />
            ))}
        </div>
    );
}

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
    const { language } = useLanguage();
    const isArabic = language === 'ar';
    const name = isArabic ? testimonial.nameAr : testimonial.nameFr;
    const text = isArabic ? testimonial.textAr : testimonial.textFr;

    return (
        <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow relative">
            <Quote className="absolute top-4 right-4 w-8 h-8 text-green-100" />
            <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white font-bold text-lg">
                    {name.charAt(0)}
                </div>
                <div>
                    <p className="font-semibold text-gray-800">{name}</p>
                    <p className="text-sm text-gray-500">{testimonial.location}</p>
                </div>
            </div>
            <StarRating rating={testimonial.rating} />
            <p className={`mt-4 text-gray-600 leading-relaxed ${isArabic ? 'text-right' : ''}`}>
                "{text}"
            </p>
        </div>
    );
}

export function Testimonials() {
    const { language } = useLanguage();

    const title = {
        fr: 'Ce que disent nos clients',
        en: 'What Our Customers Say',
        ar: 'ماذا يقول عملاؤنا',
    }[language];

    return (
        <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
            <div className="container">
                <h2 className="text-3xl font-bold text-center mb-12">{title}</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {testimonials.map((testimonial) => (
                        <TestimonialCard key={testimonial.id} testimonial={testimonial} />
                    ))}
                </div>
            </div>
        </section>
    );
}
