import { useState, useEffect } from 'react';

/**
 * Hook to detect if the user is on a mobile device
 * Uses CSS media query to check screen width
 */
export function useIsMobile(breakpoint: number = 768): boolean {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.matchMedia(`(max-width: ${breakpoint}px)`).matches);
        };

        // Check on mount
        checkMobile();

        // Listen for window resize
        window.addEventListener('resize', checkMobile);

        return () => window.removeEventListener('resize', checkMobile);
    }, [breakpoint]);

    return isMobile;
}
