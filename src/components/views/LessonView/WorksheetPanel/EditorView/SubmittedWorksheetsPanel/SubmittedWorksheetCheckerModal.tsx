// TYPES
import type { SubmittedWorksheet } from 'src/interfaces';
// LIB-FUNCTIONS
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
// FUNCTIONS
import { storage } from 'src/firebase/client';
// RECOIL
import { useRecoilValue } from 'recoil';
import { useAddSnackbarItem } from 'src/states/snackbar';
import { sworksheetsPanelAtoms, useSetModal } from '.';

// MAIN-COMPONENT
interface Props {
    fetchData: () => Promise<void>;
}
export default function SubmittedWorksheetCheckerModal({ fetchData }: Props) {
    // RECOIL
    const selected = useRecoilValue(sworksheetsPanelAtoms.selected);
    const { checker: isModalOpen } = useRecoilValue(
        sworksheetsPanelAtoms.modals
    );
    const addSnackbarItem = useAddSnackbarItem();
    const setModal = useSetModal();
    // STATES
    const [isUploading, setIsUploading] = useState(false);
    const viewer = useRef(null);
    setModal({ checker: false });
    // EFFECTS
    useEffect(() => {
        import('@pdftron/webviewer').then(async () => {
            console.log(selected);
            // @ts-ignore
            // WebViewer(
            //     {
            //         // @ts-ignore
            //         path: '/lib',
            //         initialDoc: url,
            //     },
            //     viewer.current
            //     // @ts-ignore
            // ).then((instance: any) => {
            //     const { documentViewer, annotationManager } = instance.Core;
            //     documentViewer.addEventListener(
            //         'documentLoaded',
            //         async () => {
            //             document
            //                 .getElementById('save')
            //                 ?.addEventListener('click', async () => {
            //                     const doc = documentViewer.getDocument();
            //                     const xfdfString =
            //                         // @ts-ignore
            //                         await annotationManager.exportAnnotations();
            //                     const options = { xfdfString };
            //                     const data = await doc.getFileData(options);
            //                     const arr = new Uint8Array(data);
            //                     const blob = new Blob([arr], {
            //                         type: 'application/pdf',
            //                     });
            //                     // UPLOAD TO DB
            //                     setIsUploading(true);
            //                     await uploadBytes(
            //                         ref(
            //                             storage,
            //                             `worksheets/submitted/${selected.id}`
            //                         ),
            //                         blob
            //                     );
            //                     await fetchData();
            //                     setIsUploading(false);
            //                     setModal({ checker: false });
            //                     addSnackbarItem(
            //                         'success',
            //                         'Worksheet saved successfully'
            //                     );
            //                 });
            //         }
            //     );
            // });
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);         
    // RENDER
    return !isModalOpen ? null : (
        <Container>
            <WebViewer ref={viewer} />
        </Container>
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
});
const WebViewer = styled('div')({
    height: '100%',
    backgroundColor: styles.hoverColor,
});
