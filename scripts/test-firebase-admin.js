#!/usr/bin/env node

/**
 * Test Firebase Admin SDK initialization
 * Usage: node scripts/test-firebase-admin.js
 */

require('dotenv').config();

const admin = require('firebase-admin');

console.log('🔍 Testing Firebase Admin SDK initialization...\n');

// Check environment variables
console.log('📋 Environment Variables:');
console.log('- NEXT_PUBLIC_FIREBASE_PROJECT_ID:', process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ? '✅' : '❌');
console.log('- FIREBASE_SERVICE_ACCOUNT_KEY:', process.env.FIREBASE_SERVICE_ACCOUNT_KEY ? '✅' : '❌');

if (!process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
  console.error('\n❌ FIREBASE_SERVICE_ACCOUNT_KEY is not set in .env');
  process.exit(1);
}

// Try to parse service account
try {
  console.log('\n🔐 Parsing Service Account Key...');
  const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
  console.log('✅ Service account key parsed successfully');
  console.log('   - Project ID:', serviceAccount.project_id);
  console.log('   - Client Email:', serviceAccount.client_email);
} catch (error) {
  console.error('❌ Failed to parse service account key:', error.message);
  process.exit(1);
}

// Try to initialize Firebase Admin
try {
  console.log('\n🚀 Initializing Firebase Admin SDK...');
  
  if (!admin.apps.length) {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    });
  }
  
  console.log('✅ Firebase Admin SDK initialized successfully');
  
  // Test Firestore connection
  console.log('\n📚 Testing Firestore connection...');
  const db = admin.firestore();
  console.log('✅ Firestore instance created');
  
  // Test Auth connection
  console.log('\n🔐 Testing Firebase Auth connection...');
  const auth = admin.auth();
  console.log('✅ Firebase Auth instance created');
  
  console.log('\n✨ All tests passed! Firebase Admin SDK is working correctly.\n');
  process.exit(0);
} catch (error) {
  console.error('❌ Firebase Admin SDK initialization failed:', error.message);
  console.error('\nFull error:', error);
  process.exit(1);
}
