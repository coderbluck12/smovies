#!/usr/bin/env node

/**
 * Script to set admin claims for a Firebase user
 * Usage: node scripts/set-admin-claims.js <uid>
 * 
 * Example: node scripts/set-admin-claims.js biAVk7oVYWOvE0PQIFRZH5tUekg1
 */

const admin = require('firebase-admin');
const path = require('path');

// Get UID from command line arguments
const uid = process.argv[2];

if (!uid) {
  console.error('❌ Error: Please provide a user UID');
  console.error('Usage: node scripts/set-admin-claims.js <uid>');
  console.error('\nExample: node scripts/set-admin-claims.js biAVk7oVYWOvE0PQIFRZH5tUekg1');
  process.exit(1);
}

// Initialize Firebase Admin
try {
  const serviceAccountPath = path.join(__dirname, '../service-account.json');
  admin.initializeApp({
    credential: admin.credential.cert(require(serviceAccountPath))
  });
} catch (error) {
  console.error('❌ Error: Could not load service account key');
  console.error('Make sure service-account.json exists in the project root');
  process.exit(1);
}

// Set custom claims
admin.auth().setCustomUserClaims(uid, {
  admin: true,
  role: 'superuser'
})
.then(() => {
  console.log(`✅ Admin claims set successfully for user: ${uid}`);
  process.exit(0);
})
.catch(error => {
  console.error(`❌ Error setting claims: ${error.message}`);
  process.exit(1);
});
