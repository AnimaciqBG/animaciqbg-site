/**
 * Firebase Configuration
 *
 * За да активираш cloud sync:
 * 1. Създай Firebase проект на https://console.firebase.google.com
 * 2. Включи Realtime Database (Build -> Realtime Database -> Create Database)
 * 3. Задай правила: { "rules": { ".read": true, ".write": true } }
 * 4. Копирай .env.example -> .env и попълни Firebase данните
 * 5. Рестартирай приложението
 *
 * Без конфигурация приложението работи с localStorage (както преди).
 */
import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID
};

let db = null;
let firebaseEnabled = false;

try {
  if (firebaseConfig.apiKey && firebaseConfig.databaseURL) {
    const app = initializeApp(firebaseConfig);
    db = getDatabase(app);
    firebaseEnabled = true;
    console.log('[CloudSync] Firebase connected');
  } else {
    console.log('[CloudSync] Firebase not configured - using localStorage only');
  }
} catch (err) {
  console.warn('[CloudSync] Firebase init error:', err.message);
}

export { db, firebaseEnabled };
