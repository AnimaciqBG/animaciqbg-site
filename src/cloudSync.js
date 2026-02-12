/**
 * Cloud Sync Module - Firebase Realtime Database
 *
 * Синхронизира данните между устройства чрез Firebase.
 * localStorage се запазва като локален кеш и fallback.
 */
import { ref, set, onValue, onDisconnect, remove } from 'firebase/database';
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
 * Uses Firebase when available, falls back to localStorage + BroadcastChannel
 */
const SESSION_ID = Math.random().toString(36).substring(2) + Date.now().toString(36);
const PRESENCE_PATH = 'sites/animaciqbg/presence';
const LOCAL_PRESENCE_KEY = 'v14_presence';

// --- Local presence fallback (localStorage + BroadcastChannel) ---
function getLocalSessions() {
  try {
    const data = JSON.parse(localStorage.getItem(LOCAL_PRESENCE_KEY) || '{}');
    const now = Date.now();
    // Clean up sessions older than 30 seconds (stale)
    const active = {};
    for (const [id, ts] of Object.entries(data)) {
      if (now - ts < 30000) active[id] = ts;
    }
    return active;
  } catch { return {}; }
}

function updateLocalPresence() {
  const sessions = getLocalSessions();
  sessions[SESSION_ID] = Date.now();
  localStorage.setItem(LOCAL_PRESENCE_KEY, JSON.stringify(sessions));
  return Object.keys(sessions).length;
}

function removeLocalPresence() {
  const sessions = getLocalSessions();
  delete sessions[SESSION_ID];
  localStorage.setItem(LOCAL_PRESENCE_KEY, JSON.stringify(sessions));
}

export function registerPresence() {
  // Firebase presence
  if (firebaseEnabled && db) {
    const sessionRef = ref(db, `${PRESENCE_PATH}/${SESSION_ID}`);
    set(sessionRef, { online: true, joinedAt: Date.now() });
    onDisconnect(sessionRef).remove();

    return () => {
      remove(sessionRef);
    };
  }

  // Local fallback: heartbeat every 10 seconds
  updateLocalPresence();
  const heartbeat = setInterval(() => updateLocalPresence(), 10000);

  // Notify other tabs
  let bc;
  try {
    bc = new BroadcastChannel('animaciqbg_presence');
    bc.postMessage({ type: 'join', id: SESSION_ID });
  } catch { /* BroadcastChannel not supported */ }

  // Cleanup on tab close
  const handleUnload = () => {
    removeLocalPresence();
    if (bc) bc.postMessage({ type: 'leave', id: SESSION_ID });
  };
  window.addEventListener('beforeunload', handleUnload);

  return () => {
    clearInterval(heartbeat);
    removeLocalPresence();
    window.removeEventListener('beforeunload', handleUnload);
    if (bc) {
      bc.postMessage({ type: 'leave', id: SESSION_ID });
      bc.close();
    }
  };
}

export function subscribeToPresence(callback) {
  // Firebase presence
  if (firebaseEnabled && db) {
    const presenceRef = ref(db, PRESENCE_PATH);
    const unsubscribe = onValue(presenceRef, (snapshot) => {
      const data = snapshot.val();
      const count = data ? Object.keys(data).length : 0;
      callback(Math.max(1, count));
    }, () => {
      callback(1);
    });

    return unsubscribe;
  }

  // Local fallback: poll localStorage + listen BroadcastChannel
  const poll = () => {
    const count = Object.keys(getLocalSessions()).length;
    callback(Math.max(1, count));
  };

  poll();
  const interval = setInterval(poll, 5000);

  let bc;
  try {
    bc = new BroadcastChannel('animaciqbg_presence');
    bc.onmessage = () => poll();
  } catch { /* BroadcastChannel not supported */ }

  return () => {
    clearInterval(interval);
    if (bc) bc.close();
  };
}

export { firebaseEnabled };
