// TYPES
import type { SubmittedWorksheet } from 'src/interfaces';
// LIB-FUNCTIONS
import { useState, useEffect, useCallback, useRef } from 'react';
// FUNCTIONS
import { initialStates } from 'src/utils';
import { getAllSubmittedWorksheets } from 'src/firebase/client/utils/submitedWorksheet';
// LIB-COMPONENTS
import { Button, Typography } from '@mui/material';
// COMPONENTS
import { BackIcon } from 'src/components/icons';
import { InfoText } from 'src/components/styled';
import SubmittedWorksheetItem from './SubmittedWorksheetItem';
import SubmittedWorksheetDeleterModal from './SubmittedWorksheetDeleterModal';
// import SubmittedWorksheetCheckerModal from './SubmittedWorksheetCheckerModal';
// RECOIL
import { useRecoilState, useSetRecoilState } from 'recoil';
import { editorViewAtoms } from '..';
import { sworksheetsPanelAtoms } from '.';

// MAIN-COMPONENT
export default function SubmittedWorksheetsPanel() {
    // HELPER
    const isMounted = useRef(false);
    // RECOIL
    const setTab = useSetRecoilState(editorViewAtoms.tab);
    const [worksheet, setWorksheet] = useRecoilState(
        sworksheetsPanelAtoms.worksheet
    );
    // STATES
    const [sworksheets, setSWorksheets] = useState<SubmittedWorksheet[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    // UTILS
    const fetchData = useCallback(async () => {
        setIsLoading(true);
        const sworksheets = await getAllSubmittedWorksheets(worksheet.id);
        if (isMounted.current) {
            setSWorksheets(sworksheets);
            setIsLoading(false);
        }
    }, [worksheet, isMounted]);
    const handleBack = () => {
        setWorksheet(initialStates.worksheet);
        setTab(0);
    };
    // EFFECTS
    useEffect(() => {
        isMounted.current = true;
        fetchData();
        return () => {
            isMounted.current = false;
        };
    }, [fetchData]);
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
                    <SubmittedWorksheetDeleterModal {...{ fetchData }} />
                    {/* <SubmittedWorksheetCheckerModal {...{ fetchData }} /> */}
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
