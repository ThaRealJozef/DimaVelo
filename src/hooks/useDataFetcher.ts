import { useState, useEffect, useCallback } from 'react';

// Generic hook for data fetching to reduce boilerplate
export function useDataFetcher<T>(fetchFn: () => Promise<T>, deps: any[] = []) {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const load = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const result = await fetchFn();
            setData(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setLoading(false);
        }
    }, [fetchFn]); // fetchFn should be stable or wrapped in useCallback if it depends on props

    useEffect(() => {
        load();
    }, deps);

    return { data, loading, error, refresh: load };
}
