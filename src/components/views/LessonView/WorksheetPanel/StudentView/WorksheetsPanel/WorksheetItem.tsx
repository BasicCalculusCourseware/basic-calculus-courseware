// TYPES
import type { SubmittedWorksheet, Worksheet } from 'src/interfaces';
// LIB-FUNCTIONS
import { useState, useMemo, useEffect, useCallback, useRef } from 'react';
// FUNCTIONS
import { getFileExtension, downloadFile, initialStates } from 'src/utils';
import { getSubmittedWorksheetByUID } from 'src/firebase/client/utils/submitedWorksheet';
// LIB-COMPONENTS
import {
    Typography,
    IconButton,
    Menu,
    MenuItem,
    Zoom,
    Tooltip,
} from '@mui/material';
// COMPONENTS
import {
    MoreVertIcon,
    PDFIcon,
    WordIcon,
    PPTIcon,
    DownloadIcon,
} from 'src/components/icons';
import SkeletonItem from './SkeletonItem';
// RECOIL
import { useSetRecoilState, useRecoilValue } from 'recoil';
import { authAtoms } from 'src/states/auth';
import { useAddSnackbarItem } from 'src/states/snackbar';
import { studentViewAtoms } from '..';
import { WSPAtoms } from '../WorksheetSubmitterPanel';

// MAIN-COMPONENT
interface Props {
    worksheet: Worksheet;
}
export default function WorksheetItem({ worksheet }: Props) {
    // HELPER
    const isMounted = useRef(false);
    // RECOIL VALUES
    const user = useRecoilValue(authAtoms.user);
    // RECOIL SETTERS
    const setTab = useSetRecoilState(studentViewAtoms.tab);
    const setWorksheet = useSetRecoilState(WSPAtoms.worksheet);
    // RECOIL CUSTOM HOOKS
    const addSnackbarItem = useAddSnackbarItem();
    // STATES
    const [isLoading, setIsLoading] = useState(true);
    const [sworksheet, setSWorksheet] = useState<SubmittedWorksheet>(
        initialStates.submittedWorksheet
    );
    const fileExtension = useMemo(
        () => getFileExtension(worksheet.fileName),
        [worksheet]
    );
    // MENU
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    // UTILS
    const fetchData = useCallback(async () => {
        setIsLoading(true);
        const sworksheet = await getSubmittedWorksheetByUID(
            worksheet.id,
            user.uid
        );
        if (isMounted.current) {
            if (sworksheet) setSWorksheet(sworksheet);
            setIsLoading(false);
        }
    }, [worksheet, user, isMounted]);
    const handleClick = () => {
        setWorksheet(worksheet);
        setTab(1);
    };
    const handleDownload = () => {
        addSnackbarItem('info', 'Fetching file');
        downloadFile(worksheet.downloadUrl, worksheet.fileName);
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
    return isLoading ? (
        <SkeletonItem />
    ) : (
        <Item>
            <ItemBody onClick={handleClick}>
                <Tooltip
                    title={sworksheet.id !== '' ? 'Completed' : 'Incomplete'}
                >
                    <ItemStatus data-is-completed={sworksheet.id !== ''} />
                </Tooltip>
                <ItemIcon>
                    {fileExtension === 'pdf' && <PDFIcon />}
                    {fileExtension === 'docx' && <WordIcon />}
                    {fileExtension === 'pptx' && <PPTIcon />}
                </ItemIcon>
                <ItemText>{worksheet.fileName}</ItemText>
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
                </Menu>
            </ItemTool>
        </Item>
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
    ...styles.py(1),
    ...styles.pl(1.5),
    flexGrow: 1,
    height: 55,
    overflow: 'hidden',
    cursor: 'pointer',
});
const ItemStatus = styled('div')(({ theme }) => ({
    ...styles.border(1),
    ...styles.borderRadius(100),
    ...styles.mr(1),
    minWidth: 10,
    minHeight: 10,
    '&[data-is-completed="true"]': {
        backgroundColor: theme.palette.success.main,
    },
    '&[data-is-completed="false"]': {
        backgroundColor: theme.palette.error.main,
    },
}));
const ItemIcon = styled('div')({
    ...styles.flexCenter,
    ...styles.mr(1),
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
