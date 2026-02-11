/**
 * Cloud Sync Module - Firebase Realtime Database
 *
 * Синхронизира данните между устройства чрез Firebase.
 * localStorage се запазва като локален кеш и fallback.
 */
import { ref, set, onValue } from 'firebase/database';
import { db, firebaseEnabled } from './firebaseConfig';

const SYNC_PATH = 'sites/animaciqbg';

/**
 * Записва данни в облака
 */
export function pushToCloud(data) {
  if (!firebaseEnabled || !db) return Promise.resolve();
  console.log('[CloudSync] Pushing data to Firebase...');
  const dbRef = ref(db, SYNC_PATH);
  return set(dbRef, {
    ...data,
    _lastUpdated: Date.now()
  }).then(() => {
    console.log('[CloudSync] Push successful');
  }).catch(err => {
    console.warn('[CloudSync] Push error:', err.message);
  });
}

/**
 * Слуша за промени от облака (real-time)
 * Връща функция за unsubscribe
 */
export function subscribeToCloud(callback) {
  if (!firebaseEnabled || !db) return () => {};

  console.log('[CloudSync] Subscribing to Firebase...');
  const dbRef = ref(db, SYNC_PATH);

  // onValue() in Firebase v9 returns an unsubscribe function directly
  const unsubscribe = onValue(dbRef, (snapshot) => {
    const data = snapshot.val();
    console.log('[CloudSync] Received data from Firebase:', data ? 'has data' : 'null/empty');
    if (data) {
      callback(data);
    }
  }, (err) => {
    console.warn('[CloudSync] Listen error:', err.message);
  });

  // Return the unsubscribe function directly (Firebase v9 API)
  return unsubscribe;
}

export { firebaseEnabled };
