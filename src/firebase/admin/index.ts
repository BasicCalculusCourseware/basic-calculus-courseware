import { getApps, initializeApp, cert, ServiceAccount } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import serviceAccountKey from './resources/service-account-key.json';

if (!getApps().length) {
    initializeApp({
        credential: cert(serviceAccountKey as ServiceAccount),
        databaseURL: process.env.NEXT_PUBLIC_FB_DATABASE_URL,
    });
}

export const auth = getAuth();
export const db = getFirestore();
