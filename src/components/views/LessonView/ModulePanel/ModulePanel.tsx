// COMPONENTS
import { InfoText } from 'src/components/styled';
import ModuleItem from './ModuleItem';
import ModuleCreatorFab from './ModuleCreatorFab';
import ModuleCreatorModal from './ModuleCreatorModal';
import ModuleEditorModal from './ModuleEditorModal';
import ModuleDeleterModal from './ModuleDeleterModal';
// RECOIL
import { useRecoilValue } from 'recoil';
import { authAtoms } from 'src/states/auth';
import { lessonViewAtoms } from '../.';

// MAIN-COMPONENT
export default function ModulePanel() {
    // RECOIL
    const { isEditor } = useRecoilValue(authAtoms.userRoles);
    const modules = useRecoilValue(lessonViewAtoms.modules);
    // RENDER
    return (
        <>
            {!modules.length ? (
                <InfoText>No Modules Found</InfoText>
            ) : (
                <Container>
                    {modules.map((module) => (
                        <ModuleItem key={module.id} module={module} />
                    ))}
                </Container>
            )}
            {isEditor && (
                <>
                    <ModuleCreatorFab />
                    <ModuleCreatorModal />
                    <ModuleEditorModal />
                    <ModuleDeleterModal />
                </>
            )}
        </>
    );
}

// STYLES
import { styled } from '@mui/material';
import { styles } from 'src/utils';
const Container = styled('div')({
    ...styles.border(1),
    ...styles.borderRadius(1),
    overflow: 'hidden',
});
