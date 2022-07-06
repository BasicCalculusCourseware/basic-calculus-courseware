// LIB-FUNCTIONS
import { useEffect } from 'react';
// COMPONENTS
import AssessmentsTab from './AssessmentsTab';
import SubmittedTab from './SubmittedTab';
// RECOIL
import { useRecoilValue } from 'recoil';
import { EVAtoms, useResetData as useResetDataEV } from '.';
import { useResetData as useResetDataST } from './SubmittedTab';

// MAIN-COMPONENT
export default function EditorView() {
    // RECOIL VALUES
    const tab = useRecoilValue(EVAtoms.tab);
    // RECOIL CUSTOM HOOKS
    const resetDataEV = useResetDataEV();
    const resetDataST = useResetDataST();
    // EFFECTS
    useEffect(() => {
        return () => {
            resetDataEV();
            resetDataST();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    // RENDER
    return (
        <>
            {tab === 0 && <AssessmentsTab />}
            {tab === 1 && <SubmittedTab />}
        </>
    );
}
