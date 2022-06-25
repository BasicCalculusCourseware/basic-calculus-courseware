// TYPES
import type { Video } from 'src/interfaces';
// FUNCTIONS
import { db } from 'src/firebase/admin';

export async function getAllVideos(quarterId: string, lessonId: string) {
    const videos: Video[] = [];
    const querySnap = await db
        .collection('videos')
        .where('quarterId', '==', quarterId)
        .where('lessonId', '==', lessonId)
        .orderBy('number')
        .get();
    if (querySnap.empty) return videos;
    querySnap.forEach((doc) => videos.push({ id: doc.id, ...doc.data() } as Video));
    return videos;
}
