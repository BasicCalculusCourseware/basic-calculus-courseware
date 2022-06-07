// LIB TYPES
import type { Theme } from '@mui/material';
// LIB FUNCTIONS
import { useEffect, useMemo } from 'react';
import { useMediaQuery } from '@mui/material';
// LIB COMPONENTS
import { Dialog } from '@mui/material';
// COMPONENTS
import SidebarMenu from './SidebarMenu';
// RECOIL
import { useRecoilValue } from 'recoil';
import {
    sidebarAtoms,
    useInitializeSidebar,
    useOpenSidebar,
    useCloseSidebar,
} from 'src/states/sidebar';

// MAIN COMPONENT
export default function Sidebar() {
    // RECOIL
    const isSidebarOpen = useRecoilValue(sidebarAtoms.isSidebarOpen);
    const initializeSidebar = useInitializeSidebar();
    const openSidebar = useOpenSidebar();
    const closeSidebar = useCloseSidebar();
    // RESPONSIVENESS
    const isMdUp = useMediaQuery((theme: Theme) => theme.breakpoints.up('md'));
    const { width, left } = useMemo(
        () => ({
            width: isMdUp ? (isSidebarOpen ? 300 : 70) : 300,
            left: isMdUp ? 0 : isSidebarOpen ? 0 : -300,
        }),
        [isSidebarOpen, isMdUp]
    );
    useEffect(() => {
        initializeSidebar();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    // SET SWIPABLE FEATURE
    useEffect(() => {
        const x = { start: 0, end: 0 };
        function handleTouchStart(e: TouchEvent) {
            x.start = e.changedTouches[0].clientX;
        }
        function handleTouchEnd(e: TouchEvent) {
            const minLeft = 50;
            const minRight = window.innerWidth - 50;
            const startedLeft = x.start < minLeft;
            const startedRight = x.start > minRight;
            x.end = e.changedTouches[0].clientX;
            if (startedLeft && x.end - x.start > 100) openSidebar();
            else if (startedRight && x.start - x.end > 100) closeSidebar();
        }
        document.addEventListener('touchstart', handleTouchStart);
        document.addEventListener('touchend', handleTouchEnd);
        return () => {
            document.removeEventListener('touchstart', handleTouchStart);
            document.removeEventListener('touchend', handleTouchEnd);
        };
    }, [openSidebar, closeSidebar]);
    // RENDER
    return (
        <Container style={{ width, left }}>
            <SidebarMenu />
            <SidebarBackdrop />
        </Container>
    );
}

// SUB-COMPONENT
function SidebarBackdrop() {
    // RECOIL
    const isSidebarOpen = useRecoilValue(sidebarAtoms.isSidebarOpen);
    const closeSidebar = useCloseSidebar();
    // STATES
    const isMdUp = useMediaQuery((theme: Theme) => theme.breakpoints.up('md'));
    const isOpen = useMemo(
        () => (isMdUp ? false : isSidebarOpen),
        [isSidebarOpen, isMdUp]
    );
    // RENDER
    return (
        <Dialog
            open={isOpen}
            onClick={closeSidebar}
            sx={{ cursor: 'pointer', zIndex: 1200 }}
        />
    );
}

// STYLES
import { styled } from '@mui/material';
import styles from 'src/utils/styles';
const Container = styled('div')(({ theme }) => ({
    ...styles.borderRight(1),
    height: 'calc(100vh - 66px)',
    margin: 0,
    position: 'fixed',
    top: 66,
    backgroundColor: 'white',
    overflowX: 'hidden',
    zIndex: 1250,
    transition: theme.transitions.create(['width', 'left']),
}));
