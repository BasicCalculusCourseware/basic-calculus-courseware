// COMPONENTS
import { InfoText } from 'src/components/styled';
import AssessmentItem from './AssessmentItem';
import AssessmentCreatorFab from './AssessmentCreatorFab';
import AssessmentCreatorModal from './AssessmentCreatorModal';
import AssessmentEditorModal from './AssessmentEditorModal';
import AssessmentDeleterModal from './AssessmentDeleterModal';
// RECOIL
import { useRecoilValue } from 'recoil';
import { lessonViewAtoms } from '../../..';

// MAIN-COMPONENT
export default function AssessmentsTab() {
    // RECOIL VALUES
    const assessments = useRecoilValue(lessonViewAtoms.assessments);
    // RENDER
    return (
        <>
            {!assessments.length ? (
                <InfoText>No Assessments Found</InfoText>
            ) : (
                <Container>
                    {assessments.map((assessment) => (
                        <AssessmentItem
                            key={assessment.id}
                            assessment={assessment}
                        />
                    ))}
                </Container>
            )}
            <AssessmentCreatorFab />
            <AssessmentCreatorModal />
            <AssessmentEditorModal />
            <AssessmentDeleterModal />
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
