import { useLanguage } from '@/contexts/LanguageContext';
import { Truck, Clock, Banknote, MapPin } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface DeliveryInfoProps {
    variant?: 'full' | 'compact' | 'badges';
    className?: string;
}

export function DeliveryInfo({ variant = 'full', className = '' }: DeliveryInfoProps) {
    const { t } = useLanguage();

    if (variant === 'badges') {
        return (
            <div className={`flex flex-wrap gap-2 ${className}`}>
                <div className="inline-flex items-center gap-1.5 bg-green-50 text-green-700 px-3 py-1.5 rounded-full text-sm font-medium">
                    <Banknote className="h-4 w-4" />
                    <span>{t.delivery.cashOnDelivery}</span>
                </div>
                <div className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full text-sm font-medium">
                    <Clock className="h-4 w-4" />
                    <span>{t.delivery.deliveryTime}</span>
                </div>
                <div className="inline-flex items-center gap-1.5 bg-purple-50 text-purple-700 px-3 py-1.5 rounded-full text-sm font-medium">
                    <MapPin className="h-4 w-4" />
                    <span>{t.delivery.freeShipping}</span>
                </div>
            </div>
        );
    }

    if (variant === 'compact') {
        return (
            <div className={`space-y-2 ${className}`}>
                <div className="flex items-center gap-2 text-sm">
                    <Banknote className="h-4 w-4 text-green-600 flex-shrink-0" />
                    <span>{t.delivery.cashOnDelivery}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-blue-600 flex-shrink-0" />
                    <span>{t.delivery.deliveryTime} ({t.delivery.deliveryArea})</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                    <Truck className="h-4 w-4 text-purple-600 flex-shrink-0" />
                    <span>
                        {t.delivery.freeShipping}: <span className="font-medium">{t.delivery.freeShippingCities}</span>
                    </span>
                </div>
            </div>
        );
    }

    // Full variant
    return (
        <Card className={className}>
            <CardContent className="p-4 md:p-6">
                <div className="flex items-center gap-2 mb-4">
                    <Truck className="h-5 w-5 text-green-600" />
                    <h3 className="font-semibold text-lg">{t.delivery.info}</h3>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                    <div className="flex items-start gap-3">
                        <div className="p-2 bg-green-50 rounded-lg flex-shrink-0">
                            <Banknote className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                            <p className="font-medium text-sm mb-1">{t.delivery.cashOnDelivery}</p>
                            <p className="text-xs text-gray-600">{t.delivery.available}</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                        <div className="p-2 bg-blue-50 rounded-lg flex-shrink-0">
                            <Clock className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                            <p className="font-medium text-sm mb-1">{t.delivery.deliveryTime}</p>
                            <p className="text-xs text-gray-600">{t.delivery.deliveryArea}</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                        <div className="p-2 bg-purple-50 rounded-lg flex-shrink-0">
                            <MapPin className="h-5 w-5 text-purple-600" />
                        </div>
                        <div>
                            <p className="font-medium text-sm mb-1">{t.delivery.freeShipping}</p>
                            <p className="text-xs text-gray-600">{t.delivery.freeShippingCities}</p>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
