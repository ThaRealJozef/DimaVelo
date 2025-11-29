import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  Timestamp,
  where,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface Booking {
  id: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  serviceId: string;
  serviceName: string;
  date: string;
  message: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  createdAt: Timestamp;
}

const BOOKINGS_COLLECTION = 'bookings';

export const bookingService = {
  async getAllBookings(): Promise<Booking[]> {
    try {
      const q = query(collection(db, BOOKINGS_COLLECTION), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);

      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Booking[];
    } catch (error) {
      console.error('Error getting bookings:', error);
      throw new Error('Failed to fetch bookings');
    }
  },

  async getBookingsByStatus(status: Booking['status']): Promise<Booking[]> {
    try {
      const q = query(
        collection(db, BOOKINGS_COLLECTION),
        where('status', '==', status),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);

      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Booking[];
    } catch (error) {
      console.error('Error getting bookings by status:', error);
      throw new Error('Failed to fetch bookings by status');
    }
  },

  async getBookingById(id: string): Promise<Booking | null> {
    try {
      const docRef = doc(db, BOOKINGS_COLLECTION, id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data(),
        } as Booking;
      }

      return null;
    } catch (error) {
      console.error('Error getting booking:', error);
      throw new Error('Failed to fetch booking');
    }
  },

  async createBooking(bookingData: Omit<Booking, 'id' | 'createdAt' | 'status'>): Promise<string> {
    try {
      const newBooking = {
        ...bookingData,
        status: 'pending' as const,
        createdAt: Timestamp.now(),
      };

      const docRef = await addDoc(collection(db, BOOKINGS_COLLECTION), newBooking);
      return docRef.id;
    } catch (error) {
      console.error('Error creating booking:', error);
      throw new Error('Failed to create booking');
    }
  },

  async updateBookingStatus(id: string, status: Booking['status']): Promise<void> {
    try {
      const docRef = doc(db, BOOKINGS_COLLECTION, id);
      await updateDoc(docRef, { status });
    } catch (error) {
      console.error('Error updating booking status:', error);
      throw new Error('Failed to update booking status');
    }
  },

  async deleteBooking(id: string): Promise<void> {
    try {
      const docRef = doc(db, BOOKINGS_COLLECTION, id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error('Error deleting booking:', error);
      throw new Error('Failed to delete booking');
    }
  },
};