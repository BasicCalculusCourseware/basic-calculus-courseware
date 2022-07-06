// COMPONENTS
import AssessmentsTab from './AssessmentsTab';
import SubmittedTab from './SubmittedTab';
// RECOIL
import { useRecoilValue } from 'recoil';
import { EVAtoms } from '.';

// MAIN-COMPONENT
export default function EditorView() {
    // RECOIL
    const tab = useRecoilValue(EVAtoms.tab);
    // RENDER
    return (
        <>
            {tab === 0 && <AssessmentsTab />}
            {tab === 1 && <SubmittedTab />}
        </>
    );
}
