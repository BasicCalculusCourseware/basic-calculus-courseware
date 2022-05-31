// GLOBAL TYPES
import type { Theme } from '@mui/material';
// TYPES
import type { ChildrenProp } from 'src/interfaces';
// LIB FUNCTIONS
import { useMediaQuery } from '@mui/material';
import { useMemo } from 'react';
// COMPONENTS
import Topbar from 'src/components/modules/Topbar';
// import Drawer from '@/comps/layouts/Drawer';
// RECOIL
import { useRecoilValue } from 'recoil';
import { pageAtoms } from 'src/states/page';
import { sidebarAtoms } from 'src/states/sidebar';

export default function LayoutSetter({ children }: ChildrenProp) {
    // RECOIL
    const isPageUsingSidebar = useRecoilValue(pageAtoms.isPageUsingSidebar);
    const isSidebarOpen = useRecoilValue(sidebarAtoms.isSidebarOpen);
    // STATES
    const isMdUp = useMediaQuery((theme: Theme) => theme.breakpoints.up('md'));
    const paddingLeft = useMemo(
        () => (isMdUp && isPageUsingSidebar ? (isSidebarOpen ? 300 : 70) : 0),
        [isMdUp, isSidebarOpen, isPageUsingSidebar]
    );
    // RENDER
    return (
        <>
            <Topbar />
            {/* {isPageUsingSidebar && <Drawer />} */}
            <Container style={{ paddingLeft }}>{children}</Container>
        </>
    );
}

// STYLES
import { styled } from '@mui/material';
const Container = styled('div')(({ theme }) => ({
    transition: theme.transitions.create('padding-left'),
}));
