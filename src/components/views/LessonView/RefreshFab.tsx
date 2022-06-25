// LIB-COMPONENTS
import { Tooltip, Fab } from '@mui/material';
// COMPONENT
import { ResetIcon } from 'src/components/icons';
// RECOIL
import {
    useRefreshVideos,
    useRefreshModules,
    useRefreshWorksheets,
    useRefreshAssessments,
} from '.';

// MAIN-COMPONENT
export default function RefreshFab() {
    // RECOIL
    const refreshVideos = useRefreshVideos();
    const refreshModules = useRefreshModules();
    const refreshWorksheets = useRefreshWorksheets();
    const refreshAssessments = useRefreshAssessments();
    // UTILS
    const handleRefresh = () => {
        refreshVideos();
        refreshModules();
        refreshWorksheets();
        refreshAssessments();
    };
    // RENDER
    return (
        <Tooltip title="Refresh Data">
            <Fab
                color="primary"
                onClick={handleRefresh}
                sx={{ position: 'fixed', right: '88px', bottom: '24px' }}
            >
                <ResetIcon />
            </Fab>
        </Tooltip>
    );
}
