// LIB-FUNCTIONS
import { doc, getDoc, deleteDoc, setDoc } from 'firebase/firestore';
// FUNCTIONS
import { db } from 'src/firebase/client';

export async function getBookmarkStatus(lessonId: string, uid: string) {
    const docRef = await getDoc(doc(db, 'users', uid, 'bookmarks', lessonId));
    return docRef.exists();
}
export async function bookmarkLesson(lessonId: string, uid: string) {
    await setDoc(doc(db, 'users', uid, 'bookmarks', lessonId), {
        bookmarkedAt: Date.now(),
    });
}
export async function unbookmarkLesson(lessonId: string, uid: string) {
    await deleteDoc(doc(db, 'users', uid, 'bookmarks', lessonId));
}
