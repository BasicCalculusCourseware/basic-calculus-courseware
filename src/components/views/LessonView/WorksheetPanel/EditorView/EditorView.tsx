// COMPONENTS
import WorksheetsPanel from './WorksheetsPanel';
import SubmittedWorksheetsPanel from './SubmittedWorksheetsPanel';
// RECOIL
import { useRecoilValue } from 'recoil';
import { editorViewAtoms } from '.';

// MAIN-COMPONENT
export default function EditorView() {
    // RECOIL
    const tab = useRecoilValue(editorViewAtoms.tab);
    // RENDER
    return (
        <div>
            {tab === 0 && <WorksheetsPanel />}
            {tab === 1 && <SubmittedWorksheetsPanel />}
        </div>
    );
}
