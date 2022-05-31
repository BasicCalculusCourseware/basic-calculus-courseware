// LIB FUNCTIONS
import _ from 'lodash';
// FUNCTIONS
import { db } from 'src/firebase/admin';
import { getQuarter } from './quarter';

export async function getLesson(id: string) {
    const snap = await db.collection('lessons').doc(id).get();
    return snap.exists ? { id, ...snap.data() } : null;
}
export async function getLessons(qid: string) {
    const lessons: any[] = [];
    const snap = await db
        .collection('lessons')
        .orderBy('number')
        .where('qid', '==', qid)
        .get();
    if (snap.empty) return lessons;
    snap.forEach((doc) => lessons.push({ id: doc.id, ...doc.data() }));
    return lessons;
}
export async function getTotalLessons() {
    const snap = await db.collection('lessons').get();
    if (snap.empty) return 0;
    return snap.docs.length;
}
export async function getBookmarkedLessons(uid: string) {
    const bookmarks: any[] = [];
    const bookmarksLoaded: any[] = [];
    const bookmarks_snap = await db.collection(`users/${uid}/bookmarks`).get();
    if (bookmarks_snap.empty) return bookmarksLoaded;
    bookmarks_snap.forEach((doc) => bookmarks.push({ lid: doc.id, ...doc.data() }));
    const bookmarks_sorted = _.sortBy(bookmarks, (bookmark) =>
        new Date(bookmark.bookmarkedAt).getTime()
    );
    await Promise.all(
        bookmarks_sorted.map(async (bookmark) => {
            const lesson = (await getLesson(bookmark.lid)) as any;
            if (lesson) {
                const quarter = await getQuarter(lesson.qid);
                bookmarksLoaded.push({ ...bookmark, lesson, quarter });
            } else await unbookmark(bookmark.lid, uid);
        })
    );
    return bookmarksLoaded;
}
export async function unbookmark(lid: string, uid: string) {
    await db.collection(`users/${uid}/bookmarks`).doc(lid).delete();
}
export async function getTotalBookmarks(uid: string) {
    const querySnap = await db.collection(`users/${uid}/bookmarks`).get();
    return querySnap.docs.length;
}
