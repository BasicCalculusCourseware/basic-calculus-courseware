// LIB TYPES
import type { GetServerSidePropsContext } from 'next';

// TYPES
import type { GSSP } from '@/utils/types';

// FUNCTIONS
import { getUserFromAuthToken, getUser } from '@/firebase/admin/utils/user';
import { getQuarter } from '@/firebase/admin/utils/quarter';
import { getLesson } from '@/firebase/admin/utils/lesson';
import { getVideos } from '@/firebase/admin/utils/video';
import { getModules } from '@/firebase/admin/utils/module';
import { getWorksheets } from '@/firebase/admin/utils/worksheet';
import { getAssessments } from '@/firebase/admin/utils/assessment';

// COMPONENTS
import RootSetter from '@/comps/setters/RootSetter';
import LessonView from '@/comps/views/LessonView';

export async function getServerSideProps({
    req,
    params,
}: GetServerSidePropsContext) {
    try {
        const { uid } = await getUserFromAuthToken(req.cookies.authToken);
        const user = await getUser(uid);

        const qid = params?.qid as string;
        const lid = params?.lid as string;

        const quarter = await getQuarter(qid);
        const lesson = await getLesson(lid);
        const videos = await getVideos(qid, lid);
        const modules = await getModules(qid, lid);
        const worksheets = await getWorksheets(qid, lid);
        const assessments = await getAssessments(qid, lid);

        return {
            props: {
                result: {
                    error: null,
                    body: {
                        user,
                        quarter,
                        lesson,
                        videos,
                        modules,
                        worksheets,
                        assessments,
                    },
                },
            },
        };
    } catch (error: any) {
        const message = typeof error === 'object' ? error.message : error;
        return {
            redirect: {
                destination:
                    message === 'Auth token is missing' ? '/auth/sign-in' : '/',
                permanent: false,
            },
        };
    }
}

export default function Lesson({ result }: GSSP) {
    return (
        <RootSetter
            gssp={{ result }}
            page={{ base: 'quarters' }}
            layout={{ isUsingDrawer: true }}
        >
            <LessonView />
        </RootSetter>
    );
}
