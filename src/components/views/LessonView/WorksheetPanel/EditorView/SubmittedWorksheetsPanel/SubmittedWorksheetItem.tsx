// TYPES
import type { Worksheet, SubmittedWorksheet, User } from 'src/interfaces';
// LIB-FUNCTIONS
import { useState, useEffect } from 'react';
// FUNCTIONS
import { downloadFile, initialStates } from 'src/utils';
import { getUser, doesUserExists } from 'src/firebase/client/utils/user';
import { unsubmitWorksheet } from 'src/firebase/client/utils/submitedWorksheet';
// LIB-COMPONENTS
import {
    Typography,
    IconButton,
    Menu,
    MenuItem,
    Zoom,
    Avatar,
} from '@mui/material';
// COMPONENTS
import {
    MoreVertIcon,
    DownloadIcon,
    DeleteIcon,
    EditIcon,
} from 'src/components/icons';
import SkeletonItem from './SkeletonItem';
import WorksheetCheckerModal from './WorksheetCheckerModal';
// RECOIL
import { useSetRecoilState } from 'recoil';
import { useAddSnackbarItem } from 'src/states/snackbar';
import { SWPAtoms, useSetModal, useFetchData } from '.';

// MAIN-COMPONENT
interface Props {
    worksheet: Worksheet;
    sworksheet: SubmittedWorksheet;
}
export default function SubmittedWorksheetItem({
    worksheet,
    sworksheet,
}: Props) {
    // RECOIL SETTERS
    const addSnackbarItem = useAddSnackbarItem();
    const setSelected = useSetRecoilState(SWPAtoms.selected);
    // RECOIL CUSTOM HOOKS
    const setModal = useSetModal();
    const fetchData = useFetchData();
    // STATES
    const [user, setUser] = useState<User>(initialStates.user);
    const [isLoading, setIsLoading] = useState(true);
    const [isChecking, setIsChecking] = useState(false);
    // MENU
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    // UTILS
    const handleDownload = () => {
        setAnchorEl(null);
        addSnackbarItem('info', 'Fetching file');
        downloadFile(sworksheet.downloadUrl, sworksheet.fileName);
    };
    const handleDelete = () => {
        setAnchorEl(null);
        setSelected(sworksheet);
        setModal({ deleter: true });
    };
    const handleCheck = () => {
        setAnchorEl(null);
        setIsChecking(true);
    };
    const handleStopChecking = () => setIsChecking(false);
    // EFFECTS
    useEffect(() => {
        let isMounted = true;
        (async () => {
            if (!sworksheet.id) return;
            const isUserExisting = await doesUserExists(sworksheet.uid);
            if (isUserExisting) {
                setIsLoading(true);
                const user = await getUser(sworksheet.uid);
                if (isMounted) {
                    setIsLoading(false);
                    setUser(user);
                }
            } else {
                await unsubmitWorksheet(worksheet.id, sworksheet.uid);
                await fetchData();
            }
        })();
        return () => {
            isMounted = false;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sworksheet, worksheet]);
    useEffect(() => {
        document.body.style.overflowY = isChecking ? 'hidden' : 'auto';
    }, [isChecking]);
    // RENDER
    return isLoading ? (
        <SkeletonItem />
    ) : (
        <>
            <Item>
                <ItemBody onClick={handleCheck}>
                    <ItemAvatar src={user.photoUrl} />
                    <ItemText>
                        {user.name} - {sworksheet.fileName}
                    </ItemText>
                    <ItemPoints>
                        {sworksheet.isChecked ? sworksheet.score : '?'}/
                        {worksheet.points}
                    </ItemPoints>
                </ItemBody>
                <ItemTool>
                    <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
                        <MoreVertIcon />
                    </IconButton>
                    <Menu
                        open={open}
                        anchorEl={anchorEl}
                        TransitionComponent={Zoom}
                        onClose={() => setAnchorEl(null)}
                        elevation={0}
                    >
                        <MenuItem onClick={handleDownload}>
                            <DownloadIcon />
                            Download
                        </MenuItem>
                        <MenuItem onClick={handleDelete}>
                            <DeleteIcon />
                            Delete
                        </MenuItem>
                        <MenuItem onClick={handleCheck}>
                            <EditIcon />
                            Check
                        </MenuItem>
                    </Menu>
                </ItemTool>
            </Item>
            {isChecking && (
                <WorksheetCheckerModal
                    {...{ sworksheet, handleStopChecking }}
                />
            )}
        </>
    );
}

// STYLES
import { styled } from '@mui/material';
import { styles } from 'src/utils';
const Item = styled('div')({
    ...styles.flexStartCenter,
    ...styles.borderBottom(1),
    ...styles.pr(1),
    overflow: 'hidden',
    '&:last-child': {
        border: 'none',
    },
});
const ItemBody = styled('div')({
    ...styles.flexStartCenter,
    ...styles.p(1),
    ...styles.pl(1.5),
    ...styles.pr(0.5),
    flexGrow: 1,
    height: 55,
    overflow: 'hidden',
    cursor: 'pointer',
});
const ItemAvatar = styled(Avatar)({
    ...styles.border(1),
    ...styles.mr(1),
    ...styles.box(40),
});
const ItemText = styled(Typography)({
    flexGrow: 1,
    fontSize: 13,
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
});
const ItemPoints = styled(Typography)(({ theme }) => ({
    ...styles.mx(0.5),
    fontSize: 10,
    fontWeight: 'bold',
    whiteSpace: 'nowrap',
    color: theme.palette.primary.main,
}));
const ItemTool = styled('div')({});
