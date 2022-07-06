// LIB-FUNCTIONS
import { useEffect } from 'react';
// FUNCTIONS
// LIB-COMPONENTS
import { Button, Typography } from '@mui/material';
// COMPONENTS
import { BackIcon } from 'src/components/icons';
import { InfoText } from 'src/components/styled';
import SubmittedItem from './SubmittedItem';
import DeleterModal from './DeleterModal';
import ViewerModal from './ViewerModal';
// RECOIL
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { EVAtoms } from '..';
import { STAtoms, useFetchData } from '.';

// MAIN-COMPONENT
export default function SubmittedTab() {
    // RECOIL VALUES
    const assessment = useRecoilValue(STAtoms.assessment);
    const sassessments = useRecoilValue(STAtoms.sassessments);
    const isLoading = useRecoilValue(STAtoms.isLoading);
    // RECOIL SETTERS
    const setTab = useSetRecoilState(EVAtoms.tab);
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
            ) : !sassessments.length ? (
                <InfoText>No Submitted Assessments Found</InfoText>
            ) : (
                <>
                    <Container>
                        {sassessments.map((sassessment) => (
                            <SubmittedItem
                                key={sassessment.id}
                                {...{ assessment, sassessment }}
                            />
                        ))}
                    </Container>
                    <DeleterModal />
                    <ViewerModal />
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
