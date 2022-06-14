// FUNCTIONS
import { db } from 'src/firebase/admin';

export async function deleteCollection(collectionPath: string) {
    const bulkWriter = db.bulkWriter();
    bulkWriter.onWriteError((error) => {
        if (error.failedAttempts < 100) {
            return true;
        } else {
            console.log('Failed write at document: ', error.documentRef.path);
            return false;
        }
    });
    await db.recursiveDelete(db.collection(collectionPath), bulkWriter);
}
