// LIB-FUNCTIONS
import { useEffect } from 'react';
// LIB-COMPONENTS
import { Container, Typography, Breadcrumbs, Tabs, Tab } from '@mui/material';
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
import BookmarkButton from './BookmarkButton';
import VideoPanel from './VideoPanel';
import ModulePanel from './ModulePanel';
import WorksheetPanel from './WorksheetPanel';
import AssessmentPanel from './AssessmentPanel';
// RECOIL
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { gsspAtoms, authAtoms } from 'src/states/atoms';
import { lessonViewAtoms } from '.';

// MAIN-COMPONENT
export default function LessonView() {
    // RECOIL
    const gssp = useRecoilValue(gsspAtoms.gssp);
    const { isStudent } = useRecoilValue(authAtoms.userRoles);
    const [tab, setTab] = useRecoilState(lessonViewAtoms.tab);
    const [quarter, setQuarter] = useRecoilState(lessonViewAtoms.quarter);
    const [lesson, setLesson] = useRecoilState(lessonViewAtoms.lesson);
    const setVideos = useSetRecoilState(lessonViewAtoms.videos);
    const setModules = useSetRecoilState(lessonViewAtoms.modules);
    const setWorksheets = useSetRecoilState(lessonViewAtoms.worksheets);
    const setAssessments = useSetRecoilState(lessonViewAtoms.assessments);
    // EFFECTS
    useEffect(() => {
        if (gssp.body) {
            if (gssp.body.quarter) setQuarter(gssp.body.quarter);
            if (gssp.body.lesson) setLesson(gssp.body.lesson);
            if (gssp.body.videos) setVideos(gssp.body.videos);
            if (gssp.body.modules) setModules(gssp.body.modules);
            if (gssp.body.worksheets) setWorksheets(gssp.body.worksheets);
            if (gssp.body.assessments) setAssessments(gssp.body.assessments);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [gssp]);
    // RENDER
    return (
        <Page>
            <Container maxWidth="lg">
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
                        <Link href={`/app/quarters/${quarter.id}/lessons`}>
                            <BreadcrumbsLink>Lessons</BreadcrumbsLink>
                        </Link>
                        <Typography data-is-current>{lesson.number}</Typography>
                    </Breadcrumbs>
                </PageBreadcrumbs>
                <PageHeader>
                    <Typography variant="h5">{lesson.number}</Typography>
                    <Typography>{lesson.title}</Typography>
                </PageHeader>
                <PageBody>
                    <ContentContainer>
                        <ContentHeader>
                            <Typography color="primary">
                                Introduction
                            </Typography>
                            <Typography sx={{ textIndent: '50px' }}>
                                {lesson.intro}
                            </Typography>
                            {isStudent && <BookmarkButton />}
                        </ContentHeader>
                        <ContentNavigation>
                            <Tabs
                                variant="scrollable"
                                scrollButtons="auto"
                                allowScrollButtonsMobile
                                value={tab}
                                onChange={(_e, v) => setTab(v)}
                            >
                                <Tab label="VIDEOS" />
                                <Tab label="MODULES" />
                                <Tab label="WORKSHEETS" />
                                <Tab label="ASSESSMENTS" />
                            </Tabs>
                        </ContentNavigation>
                        <ContentBody>
                            {tab === 0 && <VideoPanel />}
                            {tab === 1 && <ModulePanel />}
                            {tab === 2 && <WorksheetPanel />}
                            {tab === 3 && <AssessmentPanel />}
                        </ContentBody>
                    </ContentContainer>
                </PageBody>
            </Container>
        </Page>
    );
}

// STYLES
import { styled } from '@mui/material';
import { styles } from 'src/utils';
const ContentContainer = styled('div')(({ theme }) => ({
    ...styles.borderRadius(1),
    backgroundColor: 'white',
    position: 'relative',
    overflow: 'hidden',
    boxShadow: theme.shadows[5],
}));
const ContentHeader = styled('div')({
    ...styles.p(2),
});
const ContentNavigation = styled('div')({
    ...styles.borderBottom(1),
});
const ContentBody = styled('div')({
    ...styles.p(2),
});
