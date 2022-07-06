// TYPES
import type { Worksheet, SubmittedWorksheet } from 'src/interfaces';
// LIB-FUNCTIONS
import { useState } from 'react';
// FUNCTIONS
import { scoreSubmittedWorksheet } from 'src/firebase/client/utils/submitedWorksheet';
// LIB-COMPONENTS
import { TextField, Modal, Zoom, Stack, Tooltip } from '@mui/material';
// COMPONENTS
import {
    ModalContent,
    ModalContentHeader,
    ModalContentHeading,
    ModalContentBody,
    ModalContentFooter,
    IconButtonOutlined,
} from 'src/components/styled';
import { ResetIcon, SaveIcon, CloseIcon } from 'src/components/icons';
// RECOIL
import { useRecoilValue } from 'recoil';
import { SWPAtoms } from '.';
import { useAddSnackbarItem } from 'src/states/snackbar';

// MAIN-COMPONENT
interface Props {
    sworksheet: SubmittedWorksheet;
    isScoring: boolean;
    handleStopScoring: () => void;
}
export default function WorksheetScorerModal({
    sworksheet,
    isScoring,
    handleStopScoring,
}: Props) {
    // RECOIL VALUES
    const worksheet = useRecoilValue(SWPAtoms.worksheet);
    // RECOIL CUSTOM HOOKS
    const addSnackbarItem = useAddSnackbarItem();
    // STATES
    const [isLoading, setIsLoading] = useState(false);
    const [score, setScore] = useState(0);
    // UTILS
    const handleReset = () => setScore(0);
    const handleClose = () => {
        !isLoading && handleStopScoring();
        handleReset();
    };
    const handleSave = async () => {
        try {
            addSnackbarItem('info', 'Saving Worksheet');
            setIsLoading(true);
            await scoreSubmittedWorksheet(sworksheet.id, worksheet.id, score);
            handleClose();
        } catch (error: any) {
            const message = typeof error === 'object' ? error.message : error;
            addSnackbarItem('error', message);
        } finally {
            setIsLoading(false);
        }
    };
    // RENDER
    return (
        <Modal open={isScoring} keepMounted>
            <Zoom in={isScoring}>
                <ModalContent>
                    <ModalContentHeader>
                        <ModalContentHeading variant="h6" color="primary">
                            Worksheet Scorer
                        </ModalContentHeading>
                        <Tooltip title="Close">
                            <IconButtonOutlined onClick={handleClose}>
                                <CloseIcon />
                            </IconButtonOutlined>
                        </Tooltip>
                    </ModalContentHeader>
                    <ModalContentBody>
                        <TextField
                            type="number"
                            variant="outlined"
                            label={`Score - ${worksheet.points} Points`}
                            value={score}
                            onChange={(e) => {
                                let score = 0;
                                let value = parseInt(e.target.value);
                                if (value < 0) score = 0;
                                else if (value > worksheet.points)
                                    score = worksheet.points;
                                else score = value;
                                setScore(score);
                            }}
                            fullWidth
                        />
                    </ModalContentBody>
                    <ModalContentFooter>
                        <Stack spacing={1} direction="row-reverse">
                            <Tooltip title="Save">
                                <span>
                                    <IconButtonOutlined
                                        id="save"
                                        onClick={handleSave}
                                        disabled={isLoading}
                                    >
                                        <SaveIcon />
                                    </IconButtonOutlined>
                                </span>
                            </Tooltip>
                            <Tooltip title="Reset">
                                <IconButtonOutlined onClick={handleReset}>
                                    <ResetIcon />
                                </IconButtonOutlined>
                            </Tooltip>
                        </Stack>
                    </ModalContentFooter>
                </ModalContent>
            </Zoom>
        </Modal>
    );
}
