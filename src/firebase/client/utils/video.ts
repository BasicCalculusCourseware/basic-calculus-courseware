// TYPES
import type { Video } from 'src/interfaces';
// LIB FUNCTIONS
import {
    collection,
    doc,
    getDocs,
    deleteDoc,
    where,
    query,
    addDoc,
    setDoc,
    orderBy,
} from 'firebase/firestore';
// FUNCTIONS
import { db } from 'src/firebase/client';

export async function createVideo(
    quarterId: string,
    lessonId: string,
    data: {
        src: string;
        number: string;
    }
) {
    await addDoc(collection(db, 'videos'), {
        quarterId,
        lessonId,
        data,
        createdAt: Date.now(),
    });
}
export async function updateVideo(
    videoId: string,
    data: Partial<{ src: string; number: string }>
) {
    await setDoc(doc(db, 'videos', videoId), data, { merge: true });
}
export async function deleteVideo(videoId: string) {
    await deleteDoc(doc(db, 'videos', videoId));
}
export async function deleteAllVideos(quarterId: string, lessonId: string) {
    const videos = await getAllVideos(quarterId, lessonId);
    if (videos.length)
        await Promise.all(videos.map(async ({ id }) => await deleteVideo(id)));
}
export async function getAllVideos(quarterId: string, lessonId: string) {
    const videos: Video[] = [];
    const querySnap = await getDocs(
        query(
            collection(db, 'videos'),
            where('quarterId', '==', quarterId),
            where('lessonId', '==', lessonId),
            orderBy('number')
        )
    );
    if (querySnap.empty) return videos;
    querySnap.forEach((doc) => videos.push({ id: doc.id, ...doc.data() } as Video));
    return videos;
}
