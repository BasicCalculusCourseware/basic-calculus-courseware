// LIB-TYPES
import type { Theme } from '@mui/material';
// LIB-FUNCTIONS
import { useMediaQuery } from '@mui/material';
import { useState } from 'react';
import { ref, uploadString, getDownloadURL } from 'firebase/storage';
// FUNCTIONS
import { storage } from 'src/firebase/client';
import { updateUser } from 'src/firebase/client/utils/user';
// LIB-COMPONENTS
import { Grid, Button, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import Cropper from 'react-cropper';
// COMPONENTS
import { TabHeader, TabBody, TabFooter } from '.';
// RECOIL
import { useRecoilValue } from 'recoil';
import { sidebarAtoms } from 'src/states/sidebar';
import { useAddSnackbarItem } from 'src/states/snackbar';
// CONTEXT
import { useAccountDisplayContext } from '../';

// MAIN-COMPONENT
export default function ProfilePicturePanel() {
    // CONTEXT
    const { user, refreshUser } = useAccountDisplayContext();
    // RECOIL
    const addSnackbarItem = useAddSnackbarItem();
    const isSidebarOpen = useRecoilValue(sidebarAtoms.isSidebarOpen);
    // STATES
    const [image, setImage] = useState(user.photoUrl);
    const [cropper, setCropper] = useState<any>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const isMd = useMediaQuery((theme: Theme) => theme.breakpoints.only('md'));
    // FB-UTILS
    const updateDatabase = async () => {
        const imageRef = ref(storage, `avatars/${user.uid}.png`);
        await uploadString(
            imageRef,
            cropper.getCroppedCanvas().toDataURL(),
            'data_url',
            {
                cacheControl: 'public,max-age=86400',
            }
        );
        const url = await getDownloadURL(imageRef);
        await updateUser(user.uid, { photoUrl: url });
    };
    // UTILS
    const handleChange = (e: any) => {
        e.preventDefault();
        let files;
        if (e.dataTransfer) files = e.dataTransfer.files;
        else if (e.target) files = e.target.files;
        const reader = new FileReader();
        reader.onload = () => {
            setImage(reader.result as any);
        };
        reader.readAsDataURL(files[0]);
    };
    const handleSelectFile = () => {
        const fileInputer = document.getElementById('file-inputer');
        fileInputer && fileInputer.click();
    };
    const handleCancel = () => {
        setIsEditing(false);
        setImage(user.photoUrl);
    };
    const handleCropAndSave = async () => {
        try {
            addSnackbarItem('info', 'Updating data');
            setIsLoading(true);
            await updateDatabase();
            await refreshUser();
            handleCancel();
            addSnackbarItem('success', 'Data updated successfully');
        } catch (error: any) {
            const message = typeof error === 'object' ? error.message : error;
            addSnackbarItem('error', message);
        } finally {
            setIsLoading(false);
        }
    };
    // RENDER
    return (
        <div>
            {/* HIDDEN FILE INPUTER */}
            <input
                id="file-inputer"
                type="file"
                accept="image/*"
                onChange={handleChange}
                hidden
            />
            {/* HIDDEN FILE INPUTER */}
            <TabHeader>
                <Typography variant="h6">Profile Picture</Typography>
            </TabHeader>
            <TabBody>
                <Grid container spacing={2}>
                    {isEditing ? (
                        <>
                            <Grid
                                item
                                xs={12}
                                sm={6}
                                md={isMd && isSidebarOpen ? 12 : 6}
                            >
                                <CropperContainer>
                                    <CropperWrapper>
                                        <Cropper
                                            style={{ height: 225, width: 225 }}
                                            aspectRatio={1}
                                            preview=".preview"
                                            src={image}
                                            viewMode={1}
                                            guides={true}
                                            minCropBoxHeight={25}
                                            minCropBoxWidth={25}
                                            zoomable={false}
                                            background={false}
                                            responsive={true}
                                            autoCropArea={1}
                                            checkOrientation={false}
                                            onInitialized={(instance) => {
                                                setCropper(instance);
                                            }}
                                        />
                                    </CropperWrapper>
                                    <Typography variant="h6">Crop</Typography>
                                </CropperContainer>
                            </Grid>
                            <Grid
                                item
                                xs={12}
                                sm={6}
                                md={isMd && isSidebarOpen ? 12 : 6}
                            >
                                <PreviewContainer>
                                    <Preview className="preview" />
                                    <Typography variant="h6">
                                        Preview
                                    </Typography>
                                </PreviewContainer>
                            </Grid>
                        </>
                    ) : (
                        <Grid item xs={12}>
                            <PhotoContainer>
                                <Photo
                                    style={{
                                        backgroundImage: `url(${user.photoUrl})`,
                                    }}
                                />
                                <Typography variant="h6">Current</Typography>
                            </PhotoContainer>
                        </Grid>
                    )}
                </Grid>
            </TabBody>
            <TabFooter>
                {isEditing ? (
                    <>
                        <Button
                            size="large"
                            variant="text"
                            color="secondary"
                            onClick={handleCancel}
                        >
                            Cancel
                        </Button>
                        <Button
                            size="large"
                            variant="text"
                            color="secondary"
                            onClick={handleSelectFile}
                        >
                            SELECT IMAGE
                        </Button>
                        <LoadingButton
                            size="large"
                            variant="contained"
                            onClick={handleCropAndSave}
                            loading={isLoading}
                        >
                            SAVE
                        </LoadingButton>
                    </>
                ) : (
                    <LoadingButton
                        size="large"
                        variant="contained"
                        onClick={() => setIsEditing(true)}
                    >
                        Edit
                    </LoadingButton>
                )}
            </TabFooter>
        </div>
    );
}

// STYLES
import { styled } from '@mui/material';
import styles from 'src/utils/styles';
const PhotoContainer = styled('div')({
    ...styles.flexCenter,
    flexDirection: 'column',
});
const Photo = styled('div')({
    ...styles.border(1),
    ...styles.box(225),
    backgroundSize: 'cover',
    backgroundColor: styles.hoverColor,
});
const CropperContainer = styled('div')({
    ...styles.flexCenter,
    textAlign: 'center',
    flexDirection: 'column',
});
const CropperWrapper = styled('div')({
    ...styles.border(1),
    backgroundColor: styles.hoverColor,
});
const PreviewContainer = styled('div')({
    ...styles.flexCenter,
    textAlign: 'center',
    flexDirection: 'column',
});
const Preview = styled('div')({
    ...styles.border(1),
    ...styles.box(225),
    backgroundColor: styles.hoverColor,
    overflow: 'hidden',
});
