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

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  status: 'new' | 'read' | 'replied';
  createdAt: Timestamp;
}

const CONTACT_MESSAGES_COLLECTION = 'contact_messages';

export const contactService = {
  /**
   * Get all contact messages
   */
  async getAllMessages(): Promise<ContactMessage[]> {
    try {
      const q = query(collection(db, CONTACT_MESSAGES_COLLECTION), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as ContactMessage[];
    } catch (error) {
      console.error('Error getting contact messages:', error);
      throw new Error('Failed to fetch contact messages');
    }
  },

  /**
   * Get messages by status
   */
  async getMessagesByStatus(status: ContactMessage['status']): Promise<ContactMessage[]> {
    try {
      const q = query(
        collection(db, CONTACT_MESSAGES_COLLECTION),
        where('status', '==', status),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as ContactMessage[];
    } catch (error) {
      console.error('Error getting messages by status:', error);
      throw new Error('Failed to fetch messages by status');
    }
  },

  /**
   * Get a single message by ID
   */
  async getMessageById(id: string): Promise<ContactMessage | null> {
    try {
      const docRef = doc(db, CONTACT_MESSAGES_COLLECTION, id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data(),
        } as ContactMessage;
      }
      
      return null;
    } catch (error) {
      console.error('Error getting message:', error);
      throw new Error('Failed to fetch message');
    }
  },

  /**
   * Create a new contact message
   */
  async createMessage(messageData: Omit<ContactMessage, 'id' | 'createdAt' | 'status'>): Promise<string> {
    try {
      const newMessage = {
        ...messageData,
        status: 'new' as const,
        createdAt: Timestamp.now(),
      };

      const docRef = await addDoc(collection(db, CONTACT_MESSAGES_COLLECTION), newMessage);
      return docRef.id;
    } catch (error) {
      console.error('Error creating message:', error);
      throw new Error('Failed to create message');
    }
  },

  /**
   * Update message status
   */
  async updateMessageStatus(id: string, status: ContactMessage['status']): Promise<void> {
    try {
      const docRef = doc(db, CONTACT_MESSAGES_COLLECTION, id);
      await updateDoc(docRef, { status });
    } catch (error) {
      console.error('Error updating message status:', error);
      throw new Error('Failed to update message status');
    }
  },

  /**
   * Delete a message
   */
  async deleteMessage(id: string): Promise<void> {
    try {
      const docRef = doc(db, CONTACT_MESSAGES_COLLECTION, id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error('Error deleting message:', error);
      throw new Error('Failed to delete message');
    }
  },
};