// Firebase configuration
import { initializeApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getDatabase, Database } from 'firebase/database';

// Your Firebase configuration
// Replace these placeholder values with your actual Firebase project configuration
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
let app: FirebaseApp;
let auth: Auth;
let db: Firestore;
let database: Database;

try {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
  database = getDatabase(app);
  console.log('Firebase initialized successfully');
} catch (error) {
  console.error('Error initializing Firebase:', error);
  // Create fallback objects to prevent application crashes
  throw new Error('Firebase initialization failed');
}

export { auth, db, database };
export default app; 