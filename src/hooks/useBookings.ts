import { useCallback } from 'react';
import { bookingService } from '@/services/bookingService';
import { useDataFetcher } from './useDataFetcher';

export function useBookings() {
  const fetchBookings = useCallback(() => bookingService.getAllBookings(), []);
  const { data, loading, error, refresh } = useDataFetcher(fetchBookings);

  return {
    bookings: data || [],
    loading,
    error,
    refreshBookings: refresh
  };
}