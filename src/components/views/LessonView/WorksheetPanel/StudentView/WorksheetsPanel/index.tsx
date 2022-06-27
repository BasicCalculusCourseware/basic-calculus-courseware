// COMPONENTS
import { InfoText } from 'src/components/styled';
import WorksheetItem from './WorksheetItem';
// RECOIL
import { useRecoilValue } from 'recoil';
import { lessonViewAtoms } from '../../..';

// MAIN-COMPONENT
export default function WorksheetsPanel() {
    // RECOIL
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
