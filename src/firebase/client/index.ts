import { initializeApp, getApps } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getStorage, connectStorageEmulator } from 'firebase/storage';

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FB_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FB_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FB_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FB_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FB_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FB_APP_ID,
};

if (!getApps().length) {
    initializeApp(firebaseConfig);
    // INITIALIZE EMULATORS
    if (process.env.NODE_ENV === 'development') {
        connectAuthEmulator(getAuth(), 'http://localhost:9099', {
            disableWarnings: true,
        });
        connectFirestoreEmulator(getFirestore(), 'localhost', 8080);
        connectStorageEmulator(getStorage(), 'localhost', 9199);
    }
}

export const auth = getAuth();
export const db = getFirestore();
export const storage = getStorage();
