// TYPES
import type { Lesson, Bookmark, BookmarkItem } from 'src/interfaces';
// FUNCTIONS
import { db } from 'src/firebase/admin';
import { getQuarter } from './quarter';

export async function getLesson(id: string) {
    const querySnap = await db.collection('lessons').doc(id).get();
    return querySnap.exists ? ({ id, ...querySnap.data() } as Lesson) : null;
}
export async function getLessons(quarterId: string) {
    const lessons: Lesson[] = [];
    const querySnap = await db
        .collection('lessons')
        .orderBy('number')
        .where('quarterId', '==', quarterId)
        .get();
    if (querySnap.empty) return lessons;
    querySnap.forEach((doc) => lessons.push({ id: doc.id, ...doc.data() } as Lesson));
    return lessons;
}
export async function getTotalLessons() {
    const querySnap = await db.collection('lessons').get();
    return querySnap.empty ? 0 : querySnap.docs.length;
}
export async function getBookmarkedLessons(uid: string) {
    const bookmarks: Bookmark[] = [];
    const bookmarkItem: BookmarkItem[] = [];
    const bookmarks_querySnap = await db
        .collection(`users/${uid}/bookmarks`)
        .orderBy('bookmarkedAt')
        .get();
    if (bookmarks_querySnap.empty) return bookmarkItem;
    bookmarks_querySnap.forEach((doc) =>
        bookmarks.push({ lessonId: doc.id, ...doc.data() } as Bookmark)
    );
    await Promise.all(
        bookmarks.map(async (bookmark) => {
            const lesson = await getLesson(bookmark.lessonId);
            if (lesson) {
                const quarter = await getQuarter(lesson.quarterId);
                bookmarkItem.push({ ...bookmark, lesson, quarter } as BookmarkItem);
            } else await unbookmark(bookmark.lessonId, uid);
        })
    );
    return bookmarkItem;
}
export async function unbookmark(lessonId: string, uid: string) {
    await db.collection(`users/${uid}/bookmarks`).doc(lessonId).delete();
}
export async function getTotalBookmarks(uid: string) {
    const queryquerySnap = await db.collection(`users/${uid}/bookmarks`).get();
    return queryquerySnap.docs.length;
}
