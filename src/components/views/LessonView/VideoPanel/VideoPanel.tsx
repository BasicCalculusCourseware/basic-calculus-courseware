// LIB-COMPONENTS
import { Stack } from '@mui/material';
// COMPONENTS
import { InfoText } from 'src/components/styled';
import VideoItem from './VideoItem';
import VideoCreatorFab from './VideoCreatorFab';
import VideoCreatorModal from './VideoCreatorModal';
import VideoEditorModal from './VideoEditorModal';
import VideoDeleterModal from './VideoDeleterModal';
// RECOIL
import { useRecoilValue } from 'recoil';
import { authAtoms } from 'src/states/auth';
import { lessonViewAtoms } from '../.';

// MAIN-COMPONENT
export default function VideoPanel() {
    // RECOIL
    const { isEditor } = useRecoilValue(authAtoms.userRoles);
    const videos = useRecoilValue(lessonViewAtoms.videos);
    // RENDER
    return (
        <>
            <Stack spacing={2}>
                {!videos.length ? (
                    <InfoText>No Videos Found</InfoText>
                ) : (
                    videos.map((video) => <VideoItem key={video.id} video={video} />)
                )}
            </Stack>
            {isEditor && (
                <>
                    <VideoCreatorFab />
                    <VideoCreatorModal />
                    <VideoEditorModal />
                    <VideoDeleterModal />
                </>
            )}
        </>
    );
}
