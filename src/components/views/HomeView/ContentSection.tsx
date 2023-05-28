// LIB COMPONENTS
import { Button, Typography, Divider, Hidden, Stack } from '@mui/material';
import { Fragment } from 'react';
import Link from 'next/link';
// COMPONENTS
import { DashboardIcon } from 'src/components/icons';
import LinkSection from './LinkSection';
// RECOIL
import { useRecoilValue } from 'recoil';
import { authAtoms } from 'src/states/auth';

// MAIN-COMPONENT
export default function ContentSectionComponent() {
    // RECOIL
    const isUserSignedIn = useRecoilValue(authAtoms.isUserSignedIn);
    // RENDER
    return (
        <ContentSection>
            <Content spacing={1}>
                <Typography variant="h4">Basic Calculus Courseware</Typography>
                <Typography>
                    A highly interactive web application courseware specifically
                    made for basic calculus course.
                </Typography>
            </Content>
            <Actions>
                {isUserSignedIn ? (
                    <Link href="/app/dashboard" passHref>
                        <Button
                            size="large"
                            variant="contained"
                            startIcon={<DashboardIcon />}
                        >
                            GO TO DASHBOARD
                        </Button>
                    </Link>
                ) : (
                    <Fragment>
                        <Link href="/auth/sign-in" passHref>
                            <Button size="large" variant="contained">
                                SIGN IN
                            </Button>
                        </Link>
                        <Link href="/auth/sign-up" passHref>
                            <Button size="large" variant="text">
                                SIGN UP
                            </Button>
                        </Link>
                    </Fragment>
                )}
            </Actions>
            <Divider sx={{ mt: 5, mb: 2 }} />
            <Hidden mdDown>
                <LinkSection />
            </Hidden>
        </ContentSection>
    );
}

// STYLES
import { styled } from '@mui/material';
import styles from 'src/utils/styles';
const ContentSection = styled('div')(({ theme }) => ({
    ...styles.pt(4),
    [theme.breakpoints.up('md')]: {
        ...styles.mt(-4),
    },
}));
const Content = styled(Stack)({
    ...styles.mb(4),
});
const Actions = styled('div')({
    '.MuiButton-root': {
        ...styles.py(1.5),
        ...styles.px(2.5),
        ...styles.mr(2),
    },
});
