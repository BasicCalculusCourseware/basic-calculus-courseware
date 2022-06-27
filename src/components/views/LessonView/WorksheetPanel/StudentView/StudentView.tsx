// COMPONENTS
import WorksheetsPanel from './WorksheetsPanel';
import WorksheetSubmitterPanel from './WorksheetSubmitterPanel';
// RECOIL
import { useRecoilValue } from 'recoil';
import { studentViewAtoms } from '.';

// MAIN-COMPONENT
export default function StudentView() {
    // RECOIL
    const tab = useRecoilValue(studentViewAtoms.tab);
    // RENDER
    return (
        <div>
            {tab === 0 && <WorksheetsPanel />}
            {tab === 1 && <WorksheetSubmitterPanel />}
        </div>
    );
}
