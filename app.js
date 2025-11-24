const admin = require('firebase-admin');

// Initialize with your service account
admin.initializeApp({
  credential: admin.credential.cert(require('./service-account.json'))
});

const uid = 'biAVk7oVYWOvE0PQIFRZH5tUekg1'; // Get this from Firebase Console > Authentication > Users

admin.auth().setCustomUserClaims(uid, {
  admin: true,
  role: 'superuser'
})
.then(() => {
  console.log('Custom claims set successfully');
  process.exit();
})
.catch(error => {
  console.error('Error setting claims:', error);
});