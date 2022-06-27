// COMPONENTS
import EditorView from './EditorView';
import StudentView from './StudentView';
// RECOIL
import { useRecoilValue } from 'recoil';
import { authAtoms } from 'src/states/auth';

// MAIN-COMPONENT
export default function WorksheetPanel() {
    // RECOIL
    const { isEditor, isStudent } = useRecoilValue(authAtoms.userRoles);
    // RENDER
    return (
        <div>
            {isEditor && <EditorView />}
            {isStudent && <StudentView />}
        </div>
    );
}
