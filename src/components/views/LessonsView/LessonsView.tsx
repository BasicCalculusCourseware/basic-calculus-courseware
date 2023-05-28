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
            <BlackboardBG>
                <FormulasBG>
                    <ShaderBG>
                        <Container maxWidth="lg" fixed={true}>
                            <PageBreadcrumbs>
                                <Breadcrumbs
                                    maxItems={2}
                                    separator={
                                        <NavigateNextIcon fontSize="small" />
                                    }
                                >
                                    <Typography>App</Typography>
                                    <Link href="/app/quarters">
                                        <BreadcrumbsLink>
                                            Quarters
                                        </BreadcrumbsLink>
                                    </Link>
                                    <Typography>{quarter.number}</Typography>
                                    <Typography data-is-current>
                                        Lessons
                                    </Typography>
                                </Breadcrumbs>
                            </PageBreadcrumbs>
                            <PageHeader>
                                <Typography variant="h5">Lessons</Typography>
                                <Typography>
                                    Found a total of {lessons.length} available
                                    lesson
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
                    </ShaderBG>
                </FormulasBG>
            </BlackboardBG>
        </Page>
    );
}

// STYLES
import { styled } from '@mui/material';
import styles from 'src/utils/styles';
const BlackboardBG = styled('div')({
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    minHeight: 'calc(100vh - 66px)',
    backgroundImage: 'url(/images/blackboard-2.png)',
    backgroundRepeat: 'repeat-y',
    backgroundSize: '100%',
});
const FormulasBG = styled('div')({
    minHeight: 'calc(100vh - 66px)',
    backgroundImage: 'url(/images/formulas.png)',
    backgroundRepeat: 'repeat',
    backgroundSize: 400,
});
const ShaderBG = styled('div')({
    ...styles.pt(2),
    ...styles.pb(8),
    minHeight: 'calc(100vh - 66px)',
    backgroundColor: 'rgba(0, 0, 0, .2)',
});
