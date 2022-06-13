// LIB-FUNCTIONS
import { useEffect } from 'react';
// LIB-COMPONENTS
import { Container, Typography, Breadcrumbs, Divider } from '@mui/material';
// COMPONENTS
import { Page, PageHeader, PageBreadcrumbs, PageBody } from 'src/components/styled';
import { NavigateNextIcon } from 'src/components/icons';
import UsersDisplay from 'src/components/modules/UsersDisplay';
// RECOIL
import { useRecoilValue } from 'recoil';
import { usersDisplayAtoms } from 'src/components/modules/UsersDisplay';

// MAIN-COMPONENT
export default function StudentsView() {
    // RECOIL
    const filtered = useRecoilValue(usersDisplayAtoms.filtered);
    // RENDER
    return (
        <Page>
            <Container maxWidth="lg" fixed={true}>
                <PageBreadcrumbs>
                    <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />}>
                        <Typography>App</Typography>
                        <Typography data-is-current>Students</Typography>
                    </Breadcrumbs>
                </PageBreadcrumbs>
                <PageHeader>
                    <Typography variant="h5">Students</Typography>
                    <Typography>
                        Matched a total of {filtered.length} student
                        {filtered.length !== 1 && 's'}
                    </Typography>
                </PageHeader>
                <PageBody>
                    <UsersDisplay variant="students" />
                </PageBody>
            </Container>
        </Page>
    );
}
