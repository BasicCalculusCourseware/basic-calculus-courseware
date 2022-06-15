// LIB TYPES
import type { GridSize } from '@mui/material';
// TYPES
import type { Quarter } from 'src/interfaces';
// LIB FUNCTIONS
import { useState, useMemo } from 'react';
// LIB-COMPONENTS
import { Grid, IconButton, Menu, MenuItem, Zoom } from '@mui/material';
// COMPONENTS
import { MoreVertIcon, EditIcon, DeleteIcon } from 'src/components/icons';
import ContentItem from 'src/components/modules/ContentItem';
// RECOIL
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { sidebarAtoms } from 'src/states/sidebar';
import { quartersViewAtoms, useSetModal } from '.';

// MAIN-COMPONENT
export default function QuarterList() {
    // RECOIL
    const quarters = useRecoilValue(quartersViewAtoms.quarters);
    const isSidebarOpen = useRecoilValue(sidebarAtoms.isSidebarOpen);
    // STATES
    const gridItemProps = useMemo(() => {
        const xs: GridSize = 12;
        const sm: GridSize = 6;
        const md: GridSize = isSidebarOpen ? 6 : 4;
        const lg: GridSize = isSidebarOpen ? 4 : 3;
        return { item: true, xs, sm, md, lg };
    }, [isSidebarOpen]);
    // RENDER
    return (
        <Grid container spacing={2}>
            {quarters.map((quarter) => (
                <Grid key={quarter.id} {...gridItemProps}>
                    <QuarterItem quarter={quarter} />
                </Grid>
            ))}
        </Grid>
    );
}

// SUB-COMPONENT
interface QuarterItemProps {
    quarter: Quarter;
}
function QuarterItem({ quarter }: QuarterItemProps) {
    // RECOIL
    const setSelected = useSetRecoilState(quartersViewAtoms.selected);
    const setModal = useSetModal();
    // STATES
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    // RENDER
    return (
        <ContentItem
            color={quarter.color}
            heading={quarter.number}
            body={quarter.title}
            href={`/app/quarters/${quarter.id}`}
            tool={
                <>
                    <IconButton
                        sx={{ color: 'white' }}
                        onClick={(e) => setAnchorEl(e.currentTarget)}
                    >
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
                                setSelected(quarter);
                                setModal({ editor: true });
                                setAnchorEl(null);
                            }}
                        >
                            <EditIcon />
                            Edit
                        </MenuItem>
                        <MenuItem
                            onClick={() => {
                                setSelected(quarter);
                                setModal({ deleter: true });
                                setAnchorEl(null);
                            }}
                        >
                            <DeleteIcon />
                            Delete
                        </MenuItem>
                    </Menu>
                </>
            }
        />
    );
}
