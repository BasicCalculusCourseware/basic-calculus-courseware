// LIB-FUNCTIONS
import { useEffect } from 'react';
// LIB-COMPONENTS
import { Container, Typography, Breadcrumbs } from '@mui/material';
import Link from 'next/link';
// COMPONENTS
import {
    Page,
    PageHeader,
    PageBreadcrumbs,
    PageBody,
    BreadcrumbsLink,
} from 'src/components/styled';
import { NavigateNextIcon } from 'src/components/icons';
import LessonList from './LessonList';
import LessonCreatorFab from './LessonCreatorFab';
import LessonCreatorModal from './LessonCreatorModal';
import LessonEditorModal from './LessonEditorModal';
import LessonDeleterModal from './LessonDeleterModal';
// RECOIL
import { useRecoilState, useRecoilValue } from 'recoil';
import { authAtoms, gsspAtoms } from 'src/states/atoms';
import { lessonsViewAtoms } from '.';

// MAIN-COMPONENT
export default function LessonsView() {
    // RECOIL
    const gssp = useRecoilValue(gsspAtoms.gssp);
    const { isEditor } = useRecoilValue(authAtoms.userRoles);
    const [lessons, setLessons] = useRecoilState(lessonsViewAtoms.lessons);
    const [quarter, setQuarter] = useRecoilState(lessonsViewAtoms.quarter);
    useEffect(() => {
        if (gssp.body) {
            if (gssp.body.lessons) setLessons(gssp.body.lessons);
            if (gssp.body.quarter) setQuarter(gssp.body.quarter);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [gssp]);
    // RENDER
    return (
        <Page>
            <Container maxWidth="lg" fixed={true}>
                <PageBreadcrumbs>
                    <Breadcrumbs
                        maxItems={2}
                        separator={<NavigateNextIcon fontSize="small" />}
                    >
                        <Typography>App</Typography>
                        <Link href="/app/quarters">
                            <BreadcrumbsLink>Quarters</BreadcrumbsLink>
                        </Link>
                        <Typography>{quarter.number}</Typography>
                        <Typography data-is-current>Lessons</Typography>
                    </Breadcrumbs>
                </PageBreadcrumbs>
                <PageHeader>
                    <Typography variant="h5">Lessons</Typography>
                    <Typography>
                        Found a total of {lessons.length} available lesson
                        {lessons.length !== 1 && 's'}
                    </Typography>
                </PageHeader>
                <PageBody>
                    <LessonList />
                    {isEditor && (
                        <>
                            <LessonCreatorFab />
                            <LessonCreatorModal />
                            <LessonEditorModal />
                            <LessonDeleterModal />
                        </>
                    )}
                </PageBody>
            </Container>
        </Page>
    );
}
