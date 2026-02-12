/**
 * Cloud Sync Module - Firebase Realtime Database
 *
 * Синхронизира данните между устройства чрез Firebase.
 * localStorage се запазва като локален кеш и fallback.
 */
import { ref, set, onValue, onDisconnect, remove, serverTimestamp } from 'firebase/database';
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

/**
 * Live Visitors Presence System
 * Tracks online visitors in real-time via Firebase
 */
const SESSION_ID = Math.random().toString(36).substring(2) + Date.now().toString(36);
const PRESENCE_PATH = 'sites/animaciqbg/presence';

export function registerPresence() {
  if (!firebaseEnabled || !db) return () => {};

  const sessionRef = ref(db, `${PRESENCE_PATH}/${SESSION_ID}`);
  set(sessionRef, { online: true, joinedAt: Date.now() });
  onDisconnect(sessionRef).remove();

  return () => {
    remove(sessionRef);
  };
}

export function subscribeToPresence(callback) {
  if (!firebaseEnabled || !db) return () => {};

  const presenceRef = ref(db, PRESENCE_PATH);
  const unsubscribe = onValue(presenceRef, (snapshot) => {
    const data = snapshot.val();
    const count = data ? Object.keys(data).length : 0;
    callback(count);
  }, () => {
    callback(0);
  });

  return unsubscribe;
}

export { firebaseEnabled };
