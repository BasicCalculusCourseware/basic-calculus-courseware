// LIB COMPONENTS
import { Container, Grid, Hidden } from '@mui/material';
// COMPONENTS
import ContentSection from './ContentSection';
import LogoSection from './LogoSection';
import LinkSection from './LinkSection';

// MAIN-COMPONENT
export default function HomeView() {
    return (
        <Home>
            <Container maxWidth="xl">
                <Grid container>
                    <Grid item xs={12} md={6}>
                        <ContentSection />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <LogoSection />
                    </Grid>
                    <Hidden mdUp>
                        <Grid item xs={12}>
                            <LinkSection />
                        </Grid>
                    </Hidden>
                </Grid>
            </Container>
        </Home>
    );
}

// STYLES
import { styled } from '@mui/material';
import styles from 'src/utils/styles';
const Home = styled('div')(({ theme }) => ({
    ...styles.flexStartCenter,
    minHeight: 'calc(100vh - 70px)',
    '.MuiGrid-item': {
        ...styles.flexCenter,
    },
    [theme.breakpoints.up('md')]: {
        ...styles.px(4),
    },
}));
