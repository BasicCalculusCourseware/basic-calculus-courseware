// TYPES
import type { Worksheet } from 'src/interfaces';
// LIB-FUNCTIONS
import { useState, useMemo } from 'react';
// FUNCTIONS
import { getFileExtension, downloadFile } from 'src/utils';
// LIB-COMPONENTS
import { Typography, IconButton, Menu, MenuItem, Zoom } from '@mui/material';
// COMPONENTS
import {
    MoreVertIcon,
    EditIcon,
    DeleteIcon,
    PDFIcon,
    WordIcon,
    PPTIcon,
    DownloadIcon,
} from 'src/components/icons';
// RECOIL
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { authAtoms } from 'src/states/atoms';
import { useAddSnackbarItem } from 'src/states/snackbar';
import { editorViewAtoms } from '..';
import { SWPAtoms } from '../SubmittedWorksheetsPanel';
import { worksheetsPanelAtoms, useSetModal } from '.';

// MAIN-COMPONENT
interface Props {
    worksheet: Worksheet;
}
export default function WorksheetItem({ worksheet }: Props) {
    // RECOIL
    const { isEditor } = useRecoilValue(authAtoms.userRoles);
    const setTab = useSetRecoilState(editorViewAtoms.tab);
    const setSelected = useSetRecoilState(worksheetsPanelAtoms.selected);
    const setWorksheet = useSetRecoilState(SWPAtoms.worksheet);
    const addSnackbarItem = useAddSnackbarItem();
    const setModal = useSetModal();
    const fileExtension = useMemo(
        () => getFileExtension(worksheet.fileName),
        [worksheet]
    );
    // STATES
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    // UTILS
    const handleClick = () => {
        setWorksheet(worksheet);
        setTab(1);
    };
    const handleDownload = () => {
        addSnackbarItem('info', 'Fetching file');
        downloadFile(worksheet.downloadUrl, worksheet.fileName);
    };
    // RENDER
    return (
        <Item>
            <ItemBody onClick={handleClick}>
                <ItemIcon>
                    {fileExtension === 'pdf' && <PDFIcon />}
                    {fileExtension === 'docx' && <WordIcon />}
                    {fileExtension === 'pptx' && <PPTIcon />}
                </ItemIcon>
                <ItemText>{worksheet.fileName}</ItemText>
                <ItemPoints>{worksheet.points} Points</ItemPoints>
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
                    {isEditor && (
                        <MenuItem
                            onClick={() => {
                                setSelected(worksheet);
                                setModal({ editor: true });
                                setAnchorEl(null);
                            }}
                        >
                            <EditIcon />
                            Edit
                        </MenuItem>
                    )}
                    {isEditor && (
                        <MenuItem
                            onClick={() => {
                                setSelected(worksheet);
                                setModal({ deleter: true });
                                setAnchorEl(null);
                            }}
                        >
                            <DeleteIcon />
                            Delete
                        </MenuItem>
                    )}
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
    ...styles.p(1),
    ...styles.pl(1.5),
    ...styles.pr(0.5),
    flexGrow: 1,
    height: 55,
    overflow: 'hidden',
    cursor: 'pointer',
});
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
