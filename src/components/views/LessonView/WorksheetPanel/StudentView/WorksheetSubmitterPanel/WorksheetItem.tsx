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
    PDFIcon,
    WordIcon,
    PPTIcon,
    DownloadIcon,
} from 'src/components/icons';
// RECOIL
import { useSetRecoilState, useRecoilValue } from 'recoil';
import { useAddSnackbarItem } from 'src/states/snackbar';
import { studentViewAtoms } from '..';
import { worksheetSubmitterPanelAtoms } from '.';

// MAIN-COMPONENT
interface Props {
    worksheet: Worksheet;
}
export default function WorksheetItem({ worksheet }: Props) {
    // RECOIL
    const setTab = useSetRecoilState(studentViewAtoms.tab);
    const setWorksheet = useSetRecoilState(
        worksheetSubmitterPanelAtoms.worksheet
    );
    const addSnackbarItem = useAddSnackbarItem();
    const fileExtension = useMemo(
        () => getFileExtension(worksheet.fileName),
        [worksheet]
    );
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
