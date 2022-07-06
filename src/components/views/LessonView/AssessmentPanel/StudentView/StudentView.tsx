// COMPONENTS
import { InfoText } from 'src/components/styled';
import AssessmentItem from './AssessmentItem';
import QuestionnaireModal from './QuestionnaireModal';
import ReviewerModal from './ReviewerModal';
// RECOIL
import { useRecoilValue } from 'recoil';
import { lessonViewAtoms } from '../..';

// MAIN-COMPONENT
export default function StudentView() {
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
            <QuestionnaireModal />
            <ReviewerModal />
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
