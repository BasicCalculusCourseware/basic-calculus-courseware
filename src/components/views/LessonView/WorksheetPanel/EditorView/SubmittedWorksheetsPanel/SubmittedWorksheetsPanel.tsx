// LIB-FUNCTIONS
import { useEffect } from 'react';
// FUNCTIONS
// LIB-COMPONENTS
import { Button, Typography } from '@mui/material';
// COMPONENTS
import { BackIcon } from 'src/components/icons';
import { InfoText } from 'src/components/styled';
import SubmittedWorksheetItem from './SubmittedWorksheetItem';
import SubmittedWorksheetDeleterModal from './SubmittedWorksheetDeleterModal';
// RECOIL
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { editorViewAtoms } from '..';
import { SWPAtoms, useFetchData } from '.';

// MAIN-COMPONENT
export default function SubmittedWorksheetsPanel() {
    // RECOIL VALUES
    const worksheet = useRecoilValue(SWPAtoms.worksheet);
    const sworksheets = useRecoilValue(SWPAtoms.sworksheets);
    const isLoading = useRecoilValue(SWPAtoms.isLoading);
    // RECOIL SETTERS
    const setTab = useSetRecoilState(editorViewAtoms.tab);
    const handleBack = () => setTab(0);
    // RECOIL CUSTOM HOOKS
    const fetchData = useFetchData();
    // EFFECTS
    useEffect(() => {
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    // RENDER
    return (
        <div>
            <Button
                startIcon={<BackIcon />}
                onClick={handleBack}
                sx={{ mb: 1 }}
            >
                GO BACK
            </Button>
            {isLoading ? (
                <Typography
                    sx={{
                        fontSize: 13,
                        textAlign: 'center',
                        color: 'secondary.main',
                    }}
                >
                    Loading
                </Typography>
            ) : !sworksheets.length ? (
                <InfoText>No Submitted Worksheets Found</InfoText>
            ) : (
                <>
                    <Container>
                        {sworksheets.map((sworksheet) => (
                            <SubmittedWorksheetItem
                                key={sworksheet.id}
                                {...{ worksheet, sworksheet }}
                            />
                        ))}
                    </Container>
                    <SubmittedWorksheetDeleterModal />
                </>
            )}
        </div>
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
