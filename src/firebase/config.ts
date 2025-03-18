import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getDatabase } from 'firebase/database';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const firestore = getFirestore(app);
export const database = getDatabase(app);

export default app; 


