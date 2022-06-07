// LIB TYPES
import type { ReactElement } from 'react';
// LIB FUNCTIONS
import { useScrollTrigger } from '@mui/material';
import { cloneElement } from 'react';
// LIB COMPONENTS
import { AppBar, Toolbar, IconButton } from '@mui/material';
import Link from 'next/link';
import Image from 'next/image';
// COMPONENTS
import { MenuIcon } from 'src/components/icons';
import TopbarWidgets from './TopbarWidgets';
// RECOIL
import { useRecoilValue } from 'recoil';
import { pageAtoms } from 'src/states/page';
import { useToggleSidebar } from 'src/states/sidebar';

// MAIN-COMPONENT
export default function TopbarComponent() {
    // RECOIL
    const isPageUsingSidebar = useRecoilValue(pageAtoms.isPageUsingSidebar);
    const toggleSidebar = useToggleSidebar();
    // RENDER
    return (
        <ElevationScroll>
            <Topbar
                position="sticky"
                color="transparent"
                sx={{ bgcolor: 'white' }}
                data-is-using-drawer={isPageUsingSidebar}
            >
                <Toolbar disableGutters>
                    {isPageUsingSidebar && (
                        <DrawerButton size="large" onClick={toggleSidebar}>
                            <MenuIcon />
                        </DrawerButton>
                    )}
                    <Brand>
                        <Link href="/" passHref>
                            <BrandContent>
                                <BrandLogo>
                                    <Image
                                        src="/images/logo.png"
                                        alt="Basic Calculus Courseware Logo"
                                        width={45}
                                        height={45}
                                    />
                                </BrandLogo>
                                <BrandSignature>
                                    <p>Basic Calculus</p>
                                    <p>Courseware</p>
                                </BrandSignature>
                            </BrandContent>
                        </Link>
                    </Brand>
                    <TopbarWidgets />
                </Toolbar>
            </Topbar>
        </ElevationScroll>
    );
}

// SUB-COMPONENTS
function ElevationScroll(props: { window?: () => Window; children: ReactElement }) {
    const { children, window } = props;
    const trigger = useScrollTrigger({
        disableHysteresis: true,
        threshold: 10,
        target: window ? window() : undefined,
    });
    return cloneElement(children, {
        elevation: trigger ? 4 : 0,
    });
}

// STYLES
import { styled } from '@mui/material';
import { styles } from 'src/utils';
const Topbar = styled(AppBar)({
    ...styles.px(1.25),
    zIndex: 1250,
    userSelect: 'none',
    '&[data-is-using-drawer="true"]': {
        ...styles.borderBottom(1),
    },
    '.MuiToolbar-root': {
        minHeight: 65,
    },
});
const DrawerButton = styled(IconButton)(({ theme }) => ({
    ...styles.mr(0.5),
    [theme.breakpoints.up('md')]: {
        ...styles.mr(1.5),
    },
}));
const Brand = styled('div')({
    width: '100%',
});
const BrandContent = styled('div')({
    ...styles.flexStartCenter,
    cursor: 'pointer',
});
const BrandLogo = styled('div')({
    ...styles.flexStartCenter,
    ...styles.mr(1.25),
});
const BrandSignature = styled('div')(({ theme }) => ({
    fontWeight: 'bold',
    '& > p': {
        '&:first-of-type': {
            ...styles.mb(-0.7),
            color: theme.palette.primary.main,
            fontSize: '12px',
        },
        '&:last-of-type': {
            fontSize: '18px',
        },
    },
    [theme.breakpoints.down('md')]: {
        '& > p:first-of-type': {
            fontSize: '10px',
        },
        '& > p:last-of-type': {
            fontSize: '14px',
        },
    },
}));
