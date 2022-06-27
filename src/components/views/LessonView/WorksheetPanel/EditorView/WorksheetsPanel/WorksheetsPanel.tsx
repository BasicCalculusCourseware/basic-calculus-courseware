// COMPONENTS
import { InfoText } from 'src/components/styled';
import WorksheetItem from './WorksheetItem';
import WorksheetCreatorFab from './WorksheetCreatorFab';
import WorksheetCreatorModal from './WorksheetCreatorModal';
import WorksheetEditorModal from './WorksheetEditorModal';
import WorksheetDeleterModal from './WorksheetDeleterModal';
// RECOIL
import { useRecoilValue } from 'recoil';
import { authAtoms } from 'src/states/auth';
import { lessonViewAtoms } from '../../..';

// MAIN-COMPONENT
export default function WorksheetsPanel() {
    // RECOIL
    const { isEditor } = useRecoilValue(authAtoms.userRoles);
    const worksheets = useRecoilValue(lessonViewAtoms.worksheets);
    // RENDER
    return (
        <>
            {!worksheets.length ? (
                <InfoText>No Worksheets Found</InfoText>
            ) : (
                <Container>
                    {worksheets.map((worksheet) => (
                        <WorksheetItem
                            key={worksheet.id}
                            worksheet={worksheet}
                        />
                    ))}
                </Container>
            )}
            {isEditor && (
                <>
                    <WorksheetCreatorFab />
                    <WorksheetCreatorModal />
                    <WorksheetEditorModal />
                    <WorksheetDeleterModal />
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
