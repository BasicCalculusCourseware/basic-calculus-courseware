// TYPES
import type { Worksheet, SubmittedWorksheet } from 'src/interfaces';
// LIB-FUNCTIONS
import { useState } from 'react';
// FUNCTIONS
import { downloadFile } from 'src/utils';
// LIB-COMPONENTS
import { Typography, IconButton, Menu, MenuItem, Zoom } from '@mui/material';
// COMPONENTS
import {
    MoreVertIcon,
    PDFIcon,
    DownloadIcon,
    UndoIcon,
} from 'src/components/icons';
// RECOIL
import { useSetRecoilState } from 'recoil';
import { useAddSnackbarItem } from 'src/states/snackbar';
import { studentViewAtoms } from '..';
import { worksheetSubmitterPanelAtoms, useSetModal } from '.';

// MAIN-COMPONENT
interface Props {
    worksheet: Worksheet;
    sworksheet: SubmittedWorksheet;
}
export default function SWorksheetItem({ worksheet, sworksheet }: Props) {
    // RECOIL
    const setTab = useSetRecoilState(studentViewAtoms.tab);
    const setWorksheet = useSetRecoilState(
        worksheetSubmitterPanelAtoms.worksheet
    );
    const addSnackbarItem = useAddSnackbarItem();
    const setModal = useSetModal();
    // MENU
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
    const handleUnsubmit = () => setModal({ unsubmitter: true });
    // RENDER
    return (
        <Item>
            <ItemBody onClick={handleClick}>
                <ItemIcon>
                    <PDFIcon />
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
                    <MenuItem onClick={handleUnsubmit}>
                        <UndoIcon />
                        Unsubmit
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
    ...styles.border(1),
    ...styles.pr(1),
    overflow: 'hidden',
});
const ItemBody = styled('div')({
    ...styles.flexStartCenter,
    ...styles.p(1),
    ...styles.pl(1.5),
    ...styles.pr(0.5),
    flexGrow: 1,
    height: 55,
    overflow: 'hidden',
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
