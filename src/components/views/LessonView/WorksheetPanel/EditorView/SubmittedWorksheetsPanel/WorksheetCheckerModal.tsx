// TYPES
import type { SubmittedWorksheet } from 'src/interfaces';
// LIB-FUNCTIONS
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { setDoc, doc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
// FUNCTIONS
import { db, storage } from 'src/firebase/client';
// LIB-COMPONENTS
import { Fab, Tooltip, Zoom } from '@mui/material';
// COMPONENTS
import { SaveIcon, BackIcon } from 'src/components/icons';
import WorksheetScorerModal from './WorksheetScorerModal';
// RECOIL
import { useRecoilValue } from 'recoil';
import { SWPAtoms } from '.';
import { useAddSnackbarItem } from 'src/states/snackbar';
import { useFetchData } from '.';

// MAIN-COMPONENT
interface Props {
    sworksheet: SubmittedWorksheet;
    handleStopChecking: () => void;
}
export default function WorksheetCheckerModal({
    sworksheet,
    handleStopChecking,
}: Props) {
    // RECOIL VALUES
    const worksheet = useRecoilValue(SWPAtoms.worksheet);
    // RECOIL CUSTOM HOOKS
    const addSnackbarItem = useAddSnackbarItem();
    const fetchData = useFetchData();
    // STATES
    const [isUploading, setIsUploading] = useState(false);
    const [isScoring, setIsScoring] = useState(false);
    // UTILS
    const handleStartScoring = () => setIsScoring(true);
    const handleStopScoring = () => setIsScoring(false);
    // EFFECTS
    useEffect(() => {
        (() => {
            const session = sessionStorage.getItem(sworksheet.id);
            if (session) return;
            sessionStorage.setItem(sworksheet.id, 'true');
            const container = document.getElementById('container');
            if (!container) return;
            const webviewer = document.createElement('div');
            webviewer.style.width = '100%';
            webviewer.style.height = '100%';
            container.appendChild(webviewer);
            import('@pdftron/webviewer').then(() => {
                sessionStorage.removeItem(sworksheet.id);
                // @ts-ignore
                WebViewer(
                    {
                        path: '/lib',
                        initialDoc: sworksheet.downloadUrl,
                    },
                    webviewer
                ).then((instance: any) => {
                    const { documentViewer, annotationManager } = instance.Core;
                    documentViewer.addEventListener(
                        'documentLoaded',
                        async () => {
                            const button = document.getElementById('save');
                            if (!button) return;
                            button.addEventListener('click', async () => {
                                const docv = documentViewer.getDocument();
                                const xfdfString =
                                    // @ts-ignore
                                    await annotationManager.exportAnnotations();
                                const options = { xfdfString };
                                const data = await docv.getFileData(options);
                                const arr = new Uint8Array(data);
                                const blob = new Blob([arr], {
                                    type: 'application/pdf',
                                });
                                // UPLOAD TO DB
                                setIsUploading(true);
                                const obj = await uploadBytes(
                                    ref(
                                        storage,
                                        `worksheets/submitted/${sworksheet.id}`
                                    ),
                                    blob
                                );
                                const downloadUrl = await getDownloadURL(
                                    obj.ref
                                );
                                await setDoc(
                                    doc(
                                        db,
                                        'worksheets',
                                        worksheet.id,
                                        'submitted',
                                        sworksheet.id
                                    ),
                                    { downloadUrl },
                                    { merge: true }
                                );
                                setIsUploading(false);
                                addSnackbarItem(
                                    'success',
                                    'Worksheet saved successfully'
                                );
                                fetchData();
                                handleStopChecking();
                            });
                        }
                    );
                });
            });
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    // RENDER
    return (
        <Zoom in={true}>
            <Container id="container">
                <Tooltip title="Save">
                    <Fab
                        color="primary"
                        disabled={isUploading}
                        onClick={handleStartScoring}
                        sx={{ bottom: 24, right: 24 }}
                        data-translucent
                    >
                        <SaveIcon />
                    </Fab>
                </Tooltip>
                <Tooltip title="Back">
                    <Fab
                        color="primary"
                        disabled={isUploading}
                        onClick={handleStopChecking}
                        sx={{ right: 88, bottom: 24 }}
                        data-translucent
                    >
                        <BackIcon />
                    </Fab>
                </Tooltip>
                <WorksheetScorerModal
                    {...{ sworksheet, isScoring, handleStopScoring }}
                />
            </Container>
        </Zoom>
    );
}

// STYLES
import { styled } from '@mui/material';
import { styles } from 'src/utils';
const Container = styled('div')({
    width: '100vw',
    height: 'calc(100vh - 66px)',
    position: 'fixed',
    top: 66,
    left: 0,
    zIndex: 1300,
    backgroundColor: styles.hoverColor,
    '.MuiFab-root': {
        position: 'fixed',
        zIndex: 1400,
    },
});
