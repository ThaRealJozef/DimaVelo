import { useCallback } from 'react';
import { orderService } from '@/services/orderService';
import { useDataFetcher } from './useDataFetcher';

export function useOrders() {
  const fetchOrders = useCallback(() => orderService.getAllOrders(), []);
  const { data, loading, error, refresh } = useDataFetcher(fetchOrders);

  return {
    orders: data || [],
    loading,
    error,
    refreshOrders: refresh
  };
}