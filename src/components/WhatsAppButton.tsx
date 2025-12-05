import { MessageCircle } from 'lucide-react';
import { WHATSAPP_NUMBER } from '@/lib/data';

export function WhatsAppButton() {
    const message = encodeURIComponent('Bonjour! Je suis intéressé par vos produits.');
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;

    return (
        <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 group"
            aria-label="Chat on WhatsApp"
        >
            <MessageCircle className="w-6 h-6" />
            <span className="hidden sm:inline font-medium">Chat avec nous</span>
            <span className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 rounded-full animate-pulse" />
        </a>
    );
}
