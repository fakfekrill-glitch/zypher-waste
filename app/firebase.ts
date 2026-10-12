import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyB-XXXXXXXXXXXXXXX",
  authDomain: "zypher-app.firebaseapp.com",
  projectId: "zypher-app",
  storageBucket: "zypher-app.appspot.com",
  messagingSenderId: "1234567890",
  appId: "1:123456:web:abcdef"
};

// Inisialisasi Firebase
const app = initializeApp(firebaseConfig);

// Export layanan yang dibutuhkan
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);