import { initializeApp, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables
dotenv.config();

const identifier = process.argv[2];
const serviceAccountPath = process.argv[3] || process.env.GOOGLE_APPLICATION_CREDENTIALS;

if (!identifier) {
  console.error('Usage: npx tsx src/scripts/setAdminClaim.ts <user-uid-or-email> [path-to-service-account-json]');
  process.exit(1);
}

if (!serviceAccountPath) {
  console.error('Error: Path to Firebase service account credentials JSON file is required.');
  console.error('Provide it as the second argument or set the GOOGLE_APPLICATION_CREDENTIALS environment variable.');
  process.exit(1);
}

try {
  // Resolve path relative to working directory
  const resolvedPath = path.resolve(serviceAccountPath);
  
  initializeApp({
    credential: cert(resolvedPath),
  });

  const setAdminClaim = async () => {
    let uid = identifier;
    
    // If the identifier contains '@', look up the user by email to get their UID
    if (identifier.includes('@')) {
      console.log(`✉️ Input looks like an email. Looking up user by email: ${identifier}...`);
      try {
        const userRecord = await getAuth().getUserByEmail(identifier);
        uid = userRecord.uid;
        console.log(`🔍 Found user! UID resolved to: ${uid}`);
      } catch (err) {
        console.error(`❌ Failed to find user with email '${identifier}':`, err);
        process.exit(1);
      }
    }

    await getAuth().setCustomUserClaims(uid, { admin: true });
    console.log(`\n========================================`);
    console.log(`✅ Success! Custom claim 'admin: true' set for user UID: ${uid}`);
    console.log(`👉 The user MUST sign out and sign back in for the new claims to take effect.`);
    console.log(`========================================\n`);
  };

  setAdminClaim().catch((err) => {
    console.error('Failed to set admin claim:', err);
    process.exit(1);
  });
} catch (error) {
  console.error('Initialization error:', error);
  process.exit(1);
}
