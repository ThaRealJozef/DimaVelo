import { useState, useEffect, useCallback } from 'react';

// Generic hook for data fetching to reduce boilerplate
export function useDataFetcher<T>(fetchFn: () => Promise<T>, deps: any[] = []) {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const load = useCallback(async () => {
        try {
            console.log('[useDataFetcher] Starting fetch...');
            setLoading(true);
            setError(null);
            const result = await fetchFn();
            console.log('[useDataFetcher] Fetch successful, data:', result);
            setData(result);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'An error occurred';
            console.error('[useDataFetcher] Fetch error:', errorMessage, err);
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    }, [fetchFn]);

    useEffect(() => {
        console.log('[useDataFetcher] useEffect triggered');
        load();
    }, [load, ...deps]); // Fixed: properly spread deps in the dependency array

    return { data, loading, error, refresh: load };
}
