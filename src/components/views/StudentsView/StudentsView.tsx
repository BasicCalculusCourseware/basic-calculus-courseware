// LIB-FUNCTIONS
import { useEffect } from 'react';
// LIB-COMPONENTS
import { Container, Typography, Breadcrumbs, Stack, Divider } from '@mui/material';
// COMPONENTS
import { Page, PageHeader, PageBreadcrumbs, PageBody } from 'src/components/styled';
import { NavigateNextIcon } from 'src/components/icons';
import SearchBox from './SearchBox';
import StudentList from './StudentList';
// RECOIL
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { gsspAtoms } from 'src/states/gssp';
import { studentsViewAtoms, useFilterStudents } from '.';

// MAIN-COMPONENT
export default function StudentsView() {
    // RECOIL
    const gssp = useRecoilValue(gsspAtoms.gssp);
    const filtered = useRecoilValue(studentsViewAtoms.filtered);
    const setStudents = useSetRecoilState(studentsViewAtoms.students);
    const filterStudents = useFilterStudents();
    useEffect(() => {
        if (gssp.body && gssp.body.students) {
            setStudents(gssp.body.students);
            filterStudents();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [gssp]);
    // RENDER
    return (
        <Page>
            <Container maxWidth="lg" fixed={true}>
                <PageBreadcrumbs>
                    <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />}>
                        <p>App</p>
                        <p data-is-current>Students</p>
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
                    <SearchBox />
                    <Divider sx={{ my: 2 }} />
                    <StudentList />
                </PageBody>
            </Container>
        </Page>
    );
}
