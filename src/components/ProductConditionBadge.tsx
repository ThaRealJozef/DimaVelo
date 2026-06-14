import { Badge } from '@/components/ui/badge';

interface ProductConditionBadgeProps {
    condition?: 'new' | 'used' | 'outlet';
    language: 'fr' | 'en' | 'ar';
    size?: 'sm' | 'md';
    className?: string;
}

const conditionLabels = {
    new: {
        fr: 'Nouveau',
        en: 'New',
        ar: 'جديد',
    },
    used: {
        fr: 'Certifié',
        en: 'Certified',
        ar: 'معتمد',
    },
    outlet: {
        fr: 'Outlet',
        en: 'Outlet',
        ar: 'أوتلت',
    },
};

export function ProductConditionBadge({
    condition,
    language,
    size = 'sm',
    className = '',
}: ProductConditionBadgeProps) {
    // Default to 'new' if no condition specified
    const effectiveCondition = condition || 'new';

    // Don't render badge for standard 'new' products to keep UI clean
    if (effectiveCondition === 'new') {
        return null;
    }

    const label = conditionLabels[effectiveCondition][language];
    const sizeClass = size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-sm px-3 py-1';

    // Use muted accent color for used/outlet items
    const colorClass = 'bg-amber-50 text-amber-700 border-amber-200';

    return (
        <Badge
            variant="outline"
            className={`${sizeClass} ${colorClass} ${className}`}
        >
            {label}
        </Badge>
    );
}
