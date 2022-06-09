// LIB-FUNCTIONS
import { useEffect } from 'react';
// LIB-COMPONENTS
import { Container, Typography, Breadcrumbs, Divider } from '@mui/material';
// COMPONENTS
import { Page, PageHeader, PageBreadcrumbs, PageBody } from 'src/components/styled';
import { NavigateNextIcon } from 'src/components/icons';
import SearchBox from './SearchBox';
import TeacherList from './TeacherList';
// RECOIL
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { gsspAtoms } from 'src/states/gssp';
import { teachersViewAtoms, useFilterTeachers } from '.';

// MAIN-COMPONENT
export default function TeachersView() {
    // RECOIL
    const gssp = useRecoilValue(gsspAtoms.gssp);
    const filtered = useRecoilValue(teachersViewAtoms.filtered);
    const filterTeachers = useFilterTeachers();
    const setTeachers = useSetRecoilState(teachersViewAtoms.teachers);
    useEffect(() => {
        if (gssp.body && gssp.body.teachers) {
            setTeachers(gssp.body.teachers);
            filterTeachers(gssp.body.teachers);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [gssp]);
    // RENDER
    return (
        <Page>
            <Container maxWidth="lg" fixed={true}>
                <PageBreadcrumbs>
                    <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />}>
                        <Typography>App</Typography>
                        <Typography data-is-current>Teachers</Typography>
                    </Breadcrumbs>
                </PageBreadcrumbs>
                <PageHeader>
                    <Typography variant="h5">Teachers</Typography>
                    <Typography>
                        Matched a total of {filtered.length} teacher
                        {filtered.length !== 1 && 's'}
                    </Typography>
                </PageHeader>
                <PageBody>
                    <SearchBox />
                    <Divider sx={{ my: 2 }} />
                    <TeacherList />
                </PageBody>
            </Container>
        </Page>
    );
}
