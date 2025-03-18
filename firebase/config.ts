import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getDatabase, connectDatabaseEmulator, ref, set } from 'firebase/database';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAGH6Ps0TK6iP9ggP0pZQ2lCJL5rgb9J6c",
  authDomain: "teimas-planning.firebaseapp.com",
  databaseURL: "https://teimas-planning-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "teimas-planning",
  storageBucket: "teimas-planning.firebasestorage.app",
  messagingSenderId: "157624624685",
  appId: "1:157624624685:web:19deb7edb64ec28946faa4",
  measurementId: "G-57Q3RQMVKJ"
};

// Initialize Firebase
let app;
try {
  if (getApps().length === 0) {
    console.log('Initializing Firebase app...');
    app = initializeApp(firebaseConfig);
    console.log('Firebase app initialized successfully');
  } else {
    console.log('Using existing Firebase app');
    app = getApps()[0];
  }
} catch (error) {
  console.error('Error initializing Firebase app:', error);
  throw new Error('Firebase initialization failed');
}

// Initialize services
export const auth = getAuth(app);
export const firestore = getFirestore(app);

// Initialize Realtime Database
export const database = getDatabase(app);
console.log('Firebase Realtime Database initialized with URL:', firebaseConfig.databaseURL);

// Test database connection by writing to a test node
// This can help identify permission issues early
try {
  set(ref(database, 'connection_test'), {
    timestamp: Date.now(),
    message: 'Testing database connection'
  })
    .then(() => console.log('Database test write successful'))
    .catch(error => {
      console.error('Database test write failed:', error);
      console.log('This is likely a Firebase Realtime Database security rules issue.');
      console.log('Make sure your database rules allow reading and writing.');
      console.log('For testing, you can use these rules:');
      console.log(`{
  "rules": {
    ".read": true,
    ".write": true
  }
}`);
    });
} catch (error) {
  console.error('Error testing database connection:', error);
}

// For debugging purposes
if (process.env.NODE_ENV === 'development') {
  // Uncomment the following line to use Firebase emulator if available
  // connectDatabaseEmulator(database, 'localhost', 9000);
} 