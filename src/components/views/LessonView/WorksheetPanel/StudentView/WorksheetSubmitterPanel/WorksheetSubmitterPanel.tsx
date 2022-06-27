// TYPES
import type { SubmittedWorksheet } from 'src/interfaces';
// LIB-FUNCTIONS
import { useState, useEffect, useCallback, useRef } from 'react';
// FUNCTIONS
import { initialStates } from 'src/utils';
import { getSubmittedWorksheetByUID } from 'src/firebase/client/utils/submitedWorksheet';
// LIB-COMPONENT
import { Button, Divider, Typography } from '@mui/material';
// COMPONENTS
import { BackIcon } from 'src/components/icons';
import WorksheetItem from './WorksheetItem';
import SWorksheetItem from './SWorksheetItem';
import WorksheetSubmitterModal from './WorksheetSubmitterModal';
import WorksheetUnsubmitterModal from './WorksheetUnsubmitterModal';
// RECOIL
import { useRecoilState, useSetRecoilState, useRecoilValue } from 'recoil';
import { authAtoms } from 'src/states/auth';
import { studentViewAtoms } from '..';
import { WSPAtoms, useSetModal } from '.';

// MAIN-COMPONENT
export default function WorksheetSubmitterPanel() {
    // HELPER
    const isMounted = useRef(false);
    // RECOIL
    const user = useRecoilValue(authAtoms.user);
    const setTab = useSetRecoilState(studentViewAtoms.tab);
    const [worksheet, setWorksheet] = useRecoilState(WSPAtoms.worksheet);
    const setModal = useSetModal();
    // STATES
    const [isLoading, setIsLoading] = useState(true);
    const [sworksheet, setSWorksheet] = useState<SubmittedWorksheet>(
        initialStates.submittedWorksheet
    );
    // UTILS
    const handleBack = () => {
        setTab(0);
        setWorksheet(initialStates.worksheet);
    };
    const handleSubmit = () => setModal({ submitter: true });
    const fetchData = useCallback(async () => {
        setIsLoading(true);
        setSWorksheet(initialStates.submittedWorksheet);
        const sworksheet = await getSubmittedWorksheetByUID(
            worksheet.id,
            user.uid
        );
        if (isMounted.current) {
            if (sworksheet) setSWorksheet(sworksheet);
            setIsLoading(false);
        }
    }, [worksheet, user]);
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
            <WorksheetItem worksheet={worksheet} />
            <Divider sx={{ my: 2 }} />
            {isLoading ? (
                <Typography
                    sx={{
                        mb: 1,
                        fontSize: 13,
                        textAlign: 'center',
                        color: 'secondary.main',
                    }}
                >
                    Loading
                </Typography>
            ) : (
                <>
                    <Typography
                        sx={{
                            mb: 1,
                            fontSize: 13,
                            color: 'secondary.main',
                        }}
                    >
                        Your Work:
                    </Typography>
                    {sworksheet.id ? (
                        <>
                            <SWorksheetItem {...{ worksheet, sworksheet }} />
                            <WorksheetUnsubmitterModal {...{ fetchData }} />
                        </>
                    ) : (
                        <>
                            <Button variant="contained" onClick={handleSubmit}>
                                SUBMIT YOUR WORK
                            </Button>
                            <WorksheetSubmitterModal {...{ fetchData }} />
                        </>
                    )}
                </>
            )}
        </div>
    );
}
