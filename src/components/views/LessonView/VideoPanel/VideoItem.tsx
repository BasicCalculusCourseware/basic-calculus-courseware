// TYPES
import type { Video } from 'src/interfaces';
// LIB-FUNCTIONS
import { useState } from 'react';
// LIB-COMPONENTS
import { Typography, IconButton, Menu, MenuItem, Zoom } from '@mui/material';
// COMPONENTS
import { VideoIcon, MoreVertIcon, EditIcon, DeleteIcon } from 'src/components/icons';
// RECOIL
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { authAtoms } from 'src/states/atoms';
import { videoPanelAtoms, useSetModal } from '.';

// MAIN-COMPONENT
interface Props {
    video: Video;
}
export default function VideoItem({ video }: Props) {
    // RECOIL
    const { isEditor } = useRecoilValue(authAtoms.userRoles);
    const setSelected = useSetRecoilState(videoPanelAtoms.selected);
    const setModal = useSetModal();
    // STATES
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    // RENDER
    return (
        <Item>
            <ItemHeader>
                <ItemHeaderIcon />
                <ItemHeaderText>{video.number}</ItemHeaderText>
                {isEditor && (
                    <>
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
                            <MenuItem
                                onClick={() => {
                                    setSelected(video);
                                    setModal({ editor: true });
                                    setAnchorEl(null);
                                }}
                            >
                                <EditIcon />
                                Edit
                            </MenuItem>
                            <MenuItem
                                onClick={() => {
                                    setSelected(video);
                                    setModal({ deleter: true });
                                    setAnchorEl(null);
                                }}
                            >
                                <DeleteIcon />
                                Delete
                            </MenuItem>
                        </Menu>
                    </>
                )}
            </ItemHeader>
            <ItemBody>
                <iframe src={video.src} allowFullScreen>
                    Your browser doesn&apos;t support iFrames.
                </iframe>
            </ItemBody>
        </Item>
    );
}

// STYLES
import { styled } from '@mui/material';
import { styles } from 'src/utils';
const Item = styled('div')({
    ...styles.border(1),
    ...styles.borderRadius(1),
    overflow: 'hidden',
});
const ItemHeader = styled('div')({
    ...styles.borderBottom(1),
    ...styles.flexStartCenter,
    ...styles.p(1),
    ...styles.pl(1.5),
    height: 55,
});
const ItemHeaderIcon = styled(VideoIcon)({
    ...styles.mr(1),
});
const ItemHeaderText = styled(Typography)({
    flexGrow: 1,
});
const ItemBody = styled('div')({
    ...styles.flexCenter,
    backgroundColor: styles.hoverColor,
    iframe: {
        width: '100%',
        aspectRatio: '2/1',
        border: 'none',
    },
});
