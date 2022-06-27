// LIB TYPES
import type { GridSize } from '@mui/material';
// LIB FUNCTIONS
import { useMemo } from 'react';
// LIB COMPONENTS
import { Container, Grid, Typography } from '@mui/material';
// COMPONENTS
import { Page, PageHeader, PageBody } from 'src/components/styled';
import DashboardItem from './DashboardItem';
// RECOIL
import { useRecoilValue } from 'recoil';
import { authAtoms, gsspAtoms, sidebarAtoms } from 'src/states/atoms';

// MAIN-COMPONENT
export default function DashboardView() {
    // RECOIL
    const userRoles = useRecoilValue(authAtoms.userRoles);
    const gssp = useRecoilValue(gsspAtoms.gssp);
    const isSidebarOpen = useRecoilValue(sidebarAtoms.isSidebarOpen);
    // STATES
    const total = useMemo(() => {
        const total = {
            teachers: 0,
            students: 0,
            quarters: 0,
            lessons: 0,
            bookmarks: 0,
        };
        if (gssp.body) {
            if (gssp.body.totalTeachers)
                total.teachers = gssp.body.totalTeachers;
            if (gssp.body.totalStudents)
                total.students = gssp.body.totalStudents;
            if (gssp.body.totalQuarters)
                total.quarters = gssp.body.totalQuarters;
            if (gssp.body.totalLessons) total.lessons = gssp.body.totalLessons;
            if (gssp.body.totalBookmarks)
                total.bookmarks = gssp.body.totalBookmarks;
            return total;
        } else return total;
    }, [gssp]);
    const gridItemProps = useMemo(() => {
        const xs: GridSize = 12;
        const sm: GridSize = 6;
        const md: GridSize = isSidebarOpen ? 6 : 4;
        const lg: GridSize = isSidebarOpen ? 4 : 3;
        return { item: true, xs, sm, md, lg };
    }, [isSidebarOpen]);
    // RENDER
    return (
        <Page>
            <Container maxWidth="lg" fixed={true}>
                <PageHeader>
                    <Typography variant="h5">Dashboard</Typography>
                    <Typography>
                        Tools to navigate instantly throughout different pages
                    </Typography>
                </PageHeader>
                <PageBody>
                    <Grid container spacing={2}>
                        <Grid {...gridItemProps}>
                            <DashboardItem
                                label="Quarters"
                                value={total.quarters}
                                href="/app/quarters"
                            />
                        </Grid>
                        <Grid {...gridItemProps}>
                            <DashboardItem
                                label="Lessons"
                                value={total.lessons}
                                href="/app/quarters"
                            />
                        </Grid>
                        {userRoles.isEditor && (
                            <Grid {...gridItemProps}>
                                <DashboardItem
                                    label="Students"
                                    value={total.students}
                                    href="/app/students"
                                />
                            </Grid>
                        )}
                        {userRoles.isAdmin && (
                            <Grid {...gridItemProps}>
                                <DashboardItem
                                    label="Teachers"
                                    value={total.teachers}
                                    href="/app/teachers"
                                />
                            </Grid>
                        )}
                        {userRoles.isStudent && (
                            <Grid {...gridItemProps}>
                                <DashboardItem
                                    label="Bookmarks"
                                    value={total.bookmarks}
                                    href="/app/bookmarks"
                                />
                            </Grid>
                        )}
                    </Grid>
                </PageBody>
            </Container>
        </Page>
    );
}
