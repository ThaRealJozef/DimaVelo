import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { categories, products } from '@/lib/data';

/**
 * Migration script to populate Firebase with initial data
 * Run this script once to migrate mock data to Firebase
 */

async function migrateCategories() {
  console.log('Starting categories migration...');
  
  for (const category of categories) {
    try {
      await addDoc(collection(db, 'categories'), {
        ...category,
        displayOrder: categories.indexOf(category),
      });
      console.log(`✓ Migrated category: ${category.nameFr}`);
    } catch (error) {
      console.error(`✗ Failed to migrate category ${category.nameFr}:`, error);
    }
  }
  
  console.log('Categories migration completed!');
}

async function migrateProducts() {
  console.log('Starting products migration...');
  
  for (const product of products) {
    try {
      await addDoc(collection(db, 'products'), {
        ...product,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        displayOrder: products.indexOf(product),
      });
      console.log(`✓ Migrated product: ${product.nameFr}`);
    } catch (error) {
      console.error(`✗ Failed to migrate product ${product.nameFr}:`, error);
    }
  }
  
  console.log('Products migration completed!');
}

export async function runMigration() {
  try {
    console.log('=== Starting Data Migration ===');
    await migrateCategories();
    await migrateProducts();
    console.log('=== Migration Completed Successfully ===');
  } catch (error) {
    console.error('Migration failed:', error);
  }
}

// Uncomment the line below to run the migration
// runMigration();