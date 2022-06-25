// LIB TYPES
import type { GridSize } from '@mui/material';
// TYPES
import type { Lesson } from 'src/interfaces';
// LIB FUNCTIONS
import { useState, useMemo } from 'react';
// LIB-COMPONENTS
import { Grid, IconButton, Menu, MenuItem, Zoom } from '@mui/material';
// COMPONENTS
import { MoreVertIcon, EditIcon, DeleteIcon } from 'src/components/icons';
import ContentItem from 'src/components/modules/ContentItem';
// RECOIL
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { authAtoms, sidebarAtoms } from 'src/states/atoms';
import { lessonsViewAtoms, useSetModal } from '.';

// MAIN-COMPONENT
export default function LessonList() {
    // RECOIL
    const lessons = useRecoilValue(lessonsViewAtoms.lessons);
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
            {lessons.map((lesson) => (
                <Grid key={lesson.id} {...gridItemProps}>
                    <LessonItem lesson={lesson} />
                </Grid>
            ))}
        </Grid>
    );
}

// SUB-COMPONENT
interface LessonItemProps {
    lesson: Lesson;
}
function LessonItem({ lesson }: LessonItemProps) {
    // RECOIL
    const { isEditor } = useRecoilValue(authAtoms.userRoles);
    const quarter = useRecoilValue(lessonsViewAtoms.quarter);
    const setSelected = useSetRecoilState(lessonsViewAtoms.selected);
    const setModal = useSetModal();
    // STATES
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    // RENDER
    return (
        <ContentItem
            color={lesson.color}
            heading={lesson.number}
            body={lesson.title}
            href={`/app/quarters/${quarter.id}/lessons/${lesson.id}`}
            tool={
                <>
                    {isEditor && (
                        <>
                            <IconButton
                                sx={{
                                    color:
                                        lesson.color === 'yellow' ||
                                        lesson.color === 'white'
                                            ? '#333'
                                            : 'white',
                                }}
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
                                        setSelected(lesson);
                                        setModal({ editor: true });
                                        setAnchorEl(null);
                                    }}
                                >
                                    <EditIcon />
                                    Edit
                                </MenuItem>
                                <MenuItem
                                    onClick={() => {
                                        setSelected(lesson);
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
                </>
            }
        />
    );
}
