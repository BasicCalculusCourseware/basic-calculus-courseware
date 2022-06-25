// TYPES
import type { Module } from 'src/interfaces';
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
import { modulePanelAtoms, useSetModal } from '.';

// MAIN-COMPONENT
interface Props {
    module: Module;
}
export default function ModuleItem({ module }: Props) {
    // RECOIL
    const { isEditor } = useRecoilValue(authAtoms.userRoles);
    const setSelected = useSetRecoilState(modulePanelAtoms.selected);
    const addSnackbarItem = useAddSnackbarItem();
    const setModal = useSetModal();
    const fileExtension = useMemo(() => getFileExtension(module.fileName), [module]);
    // STATES
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    // UTILS
    const handleDownload = () => {
        addSnackbarItem('info', 'Fetching file');
        downloadFile(module.downloadUrl, module.fileName);
    };
    // RENDER
    return (
        <Item>
            <ItemIcon>
                {fileExtension === 'pdf' && <PDFIcon />}
                {fileExtension === 'docx' && <WordIcon />}
                {fileExtension === 'pptx' && <PPTIcon />}
            </ItemIcon>
            <ItemText>{module.fileName}</ItemText>
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
                                setSelected(module);
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
                                setSelected(module);
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
    ...styles.p(1),
    ...styles.pl(1.5),
    height: 55,
    overflow: 'hidden',
    '&:last-child': {
        border: 'none',
    },
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
const ItemTool = styled('div')({});
