import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { useLanguage } from '@/contexts/LanguageContext';
import { faqTranslations } from '@/lib/faq-translations';

interface FAQItem {
    question: string;
    answer: string;
    category: string;
}

const WHATSAPP_URL = 'https://wa.me/212631532200';
const fadeIn = { initial: { opacity: 0, y: -20 }, animate: { opacity: 1, y: 0 } };
const slideUp = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } };

function PageHero({ title, subtitle }: { title: string; subtitle: string }) {
    return (
        <div className="bg-gradient-to-r from-green-600 to-green-700 text-white py-16 md:py-24">
            <div className="container mx-auto px-4">
                <motion.h1 {...fadeIn} className="text-4xl md:text-5xl font-bold mb-4 text-center">
                    {title}
                </motion.h1>
                <motion.p {...fadeIn} transition={{ delay: 0.1 }} className="text-xl text-center text-green-100">
                    {subtitle}
                </motion.p>
            </div>
        </div>
    );
}

function FAQAccordion({
    item,
    isOpen,
    onToggle,
    index,
}: {
    item: FAQItem;
    isOpen: boolean;
    onToggle: () => void;
    index: number;
}) {
    return (
        <motion.div
            {...slideUp}
            transition={{ delay: index * 0.05 }}
            className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden"
        >
            <button
                onClick={onToggle}
                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
                <span className="font-semibold text-gray-800 pr-4">{item.question}</span>
                <ChevronDown
                    className={`h-5 w-5 text-green-600 flex-shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                    >
                        <div className="px-6 pb-4 text-gray-600 leading-relaxed">{item.answer}</div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}

function CategorySection({
    title,
    items,
    openIndex,
    onToggle,
    categoryOffset,
}: {
    title: string;
    items: FAQItem[];
    openIndex: number | null;
    onToggle: (index: number) => void;
    categoryOffset: number;
}) {
    return (
        <div className="mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 flex items-center">
                <span className="w-1 h-8 bg-green-600 mr-4" />
                {title}
            </h2>
            <div className="space-y-4">
                {items.map((item, index) => {
                    const globalIndex = categoryOffset + index;
                    return (
                        <FAQAccordion
                            key={globalIndex}
                            item={item}
                            isOpen={openIndex === globalIndex}
                            onToggle={() => onToggle(globalIndex)}
                            index={index}
                        />
                    );
                })}
            </div>
        </div>
    );
}

function ContactCTA({ title, description, buttonText }: { title: string; description: string; buttonText: string }) {
    return (
        <div className="mt-16 bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-8 text-center">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">{title}</h3>
            <p className="text-gray-600 mb-6">{description}</p>
            <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-3 rounded-lg transition-colors"
            >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                {buttonText}
            </a>
        </div>
    );
}

export default function FAQPage() {
    const { language } = useLanguage();
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const faq = faqTranslations[language as keyof typeof faqTranslations];

    const categories = [
        { id: 'hours', title: faq.categories.hours },
        { id: 'products', title: faq.categories.products },
        { id: 'services', title: faq.categories.services },
        { id: 'payment', title: faq.categories.payment },
    ];

    const toggleFAQ = (index: number) => setOpenIndex(openIndex === index ? null : index);

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-white">
            <Header />

            <main className="flex-1">
                <PageHero title={faq.title} subtitle={faq.subtitle} />

                <div className="container mx-auto px-4 py-12 md:py-16">
                    <div className="max-w-4xl mx-auto">
                        {categories.map((category, i) => (
                            <CategorySection
                                key={category.id}
                                title={category.title}
                                items={faq.items.filter((item: FAQItem) => item.category === category.id)}
                                openIndex={openIndex}
                                onToggle={toggleFAQ}
                                categoryOffset={i * 100}
                            />
                        ))}

                        <ContactCTA
                            title={faq.stillHaveQuestions}
                            description={faq.contactUs}
                            buttonText={faq.whatsappButton}
                        />
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
