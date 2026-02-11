/**
 * Cloud Sync Module - Firebase Realtime Database
 *
 * Синхронизира данните между устройства чрез Firebase.
 * localStorage се запазва като локален кеш и fallback.
 */
import { ref, set, onValue, off } from 'firebase/database';
import { db, firebaseEnabled } from './firebaseConfig';

const SYNC_PATH = 'sites/animaciqbg';

/**
 * Записва данни в облака
 */
export function pushToCloud(data) {
  if (!firebaseEnabled || !db) return Promise.resolve();
  const dbRef = ref(db, SYNC_PATH);
  return set(dbRef, {
    ...data,
    _lastUpdated: Date.now()
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

  const dbRef = ref(db, SYNC_PATH);
  const unsub = onValue(dbRef, (snapshot) => {
    const data = snapshot.val();
    if (data) {
      callback(data);
    }
  }, (err) => {
    console.warn('[CloudSync] Listen error:', err.message);
  });

  return () => off(dbRef, 'value', unsub);
}

export { firebaseEnabled };
