// LIB-FUNCTIONS
import { useEffect } from 'react';
// LIB-COMPONENTS
import { Container, Typography, Breadcrumbs } from '@mui/material';
// COMPONENTS
import { Page, PageHeader, PageBreadcrumbs, PageBody } from 'src/components/styled';
import { NavigateNextIcon } from 'src/components/icons';
import QuarterList from './QuarterList';
import QuarterCreatorFab from './QuarterCreatorFab';
import QuarterCreatorModal from './QuarterCreatorModal';
import QuarterEditorModal from './QuarterEditorModal';
import QuarterDeleterModal from './QuarterDeleterModal';
// RECOIL
import { useRecoilState, useRecoilValue } from 'recoil';
import { authAtoms, gsspAtoms } from 'src/states/atoms';
import { quartersViewAtoms } from '.';

// MAIN-COMPONENT
export default function QuartersView() {
    // RECOIL
    const gssp = useRecoilValue(gsspAtoms.gssp);
    const { isEditor } = useRecoilValue(authAtoms.userRoles);
    const [quarters, setQuarters] = useRecoilState(quartersViewAtoms.quarters);
    useEffect(() => {
        if (gssp.body && gssp.body.quarters) setQuarters(gssp.body.quarters);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [gssp]);
    // RENDER
    return (
        <Page>
            <Container maxWidth="lg" fixed={true}>
                <PageBreadcrumbs>
                    <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />}>
                        <Typography>App</Typography>
                        <Typography data-is-current>Quarters</Typography>
                    </Breadcrumbs>
                </PageBreadcrumbs>
                <PageHeader>
                    <Typography variant="h5">Quarters</Typography>
                    <Typography>
                        Found a total of {quarters.length} available quarter
                        {quarters.length !== 1 && 's'}
                    </Typography>
                </PageHeader>
                <PageBody>
                    <QuarterList />
                    {isEditor && (
                        <>
                            <QuarterCreatorFab />
                            <QuarterCreatorModal />
                            <QuarterEditorModal />
                            <QuarterDeleterModal />
                        </>
                    )}
                </PageBody>
            </Container>
        </Page>
    );
}
