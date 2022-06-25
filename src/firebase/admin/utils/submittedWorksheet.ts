// TYPES
import type { SubmittedWorksheet } from 'src/interfaces';
// FUNCTIONS
import { db } from 'src/firebase/admin';

export async function getSubmittedWorksheet(
    submittedWorksheetId: string,
    worksheetId: string
) {
    const docRef = await db
        .doc(`worksheets/${worksheetId}/submitted/${submittedWorksheetId}`)
        .get();
    if (!docRef.exists) throw 'submitted worksheet was not found';
    return { id: submittedWorksheetId, ...docRef.data() } as SubmittedWorksheet;
}
