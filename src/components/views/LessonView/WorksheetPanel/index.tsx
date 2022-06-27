// LIB-FUNCTIONS
import { useEffect } from 'react';
// COMPONENTS
import EditorView from './EditorView';
import StudentView from './StudentView';
// RECOIL
import { useRecoilValue } from 'recoil';
import { authAtoms } from 'src/states/auth';
import { useResetData as useResetDataSV } from './StudentView';
import { useResetData as useResetDataWSP } from './StudentView/WorksheetSubmitterPanel';
import { useResetData as useResetDataEV } from './EditorView';
import { useResetData as useResetDataSWP } from './EditorView/SubmittedWorksheetsPanel';

// MAIN-COMPONENT
export default function WorksheetPanel() {
    // RECOIL VALUES
    const { isEditor, isStudent } = useRecoilValue(authAtoms.userRoles);
    // RECOIL CUSTOM HOOKS
    const resetDataSV = useResetDataSV();
    const resetDataWSP = useResetDataWSP();
    const resetDataEV = useResetDataEV();
    const resetDataSWP = useResetDataSWP();
    // EFFECTS
    useEffect(() => {
        return () => {
            resetDataSV();
            resetDataWSP();
            resetDataEV();
            resetDataSWP();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    // RENDER
    return (
        <div>
            {isEditor && <EditorView />}
            {isStudent && <StudentView />}
        </div>
    );
}
