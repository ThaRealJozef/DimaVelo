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

export interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  productId: string;
  productName: string;
  message: string;
  status: 'pending' | 'contacted' | 'completed' | 'cancelled';
  createdAt: Timestamp;
}

const ORDERS_COLLECTION = 'orders';

export const orderService = {
  /**
   * Get all orders
   */
  async getAllOrders(): Promise<Order[]> {
    try {
      const q = query(collection(db, ORDERS_COLLECTION), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Order[];
    } catch (error) {
      console.error('Error getting orders:', error);
      throw new Error('Failed to fetch orders');
    }
  },

  /**
   * Get orders by status
   */
  async getOrdersByStatus(status: Order['status']): Promise<Order[]> {
    try {
      const q = query(
        collection(db, ORDERS_COLLECTION),
        where('status', '==', status),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Order[];
    } catch (error) {
      console.error('Error getting orders by status:', error);
      throw new Error('Failed to fetch orders by status');
    }
  },

  /**
   * Get a single order by ID
   */
  async getOrderById(id: string): Promise<Order | null> {
    try {
      const docRef = doc(db, ORDERS_COLLECTION, id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data(),
        } as Order;
      }
      
      return null;
    } catch (error) {
      console.error('Error getting order:', error);
      throw new Error('Failed to fetch order');
    }
  },

  /**
   * Create a new order
   */
  async createOrder(orderData: Omit<Order, 'id' | 'createdAt' | 'status'>): Promise<string> {
    try {
      const newOrder = {
        ...orderData,
        status: 'pending' as const,
        createdAt: Timestamp.now(),
      };

      const docRef = await addDoc(collection(db, ORDERS_COLLECTION), newOrder);
      return docRef.id;
    } catch (error) {
      console.error('Error creating order:', error);
      throw new Error('Failed to create order');
    }
  },

  /**
   * Update order status
   */
  async updateOrderStatus(id: string, status: Order['status']): Promise<void> {
    try {
      const docRef = doc(db, ORDERS_COLLECTION, id);
      await updateDoc(docRef, { status });
    } catch (error) {
      console.error('Error updating order status:', error);
      throw new Error('Failed to update order status');
    }
  },

  /**
   * Delete an order
   */
  async deleteOrder(id: string): Promise<void> {
    try {
      const docRef = doc(db, ORDERS_COLLECTION, id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error('Error deleting order:', error);
      throw new Error('Failed to delete order');
    }
  },
};