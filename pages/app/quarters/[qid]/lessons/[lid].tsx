// LIB-TYPES
import type { GetServerSidePropsContext } from 'next';
// TYPES
import type { GSSP } from 'src/interfaces';
// FUNCTIONS
import { getUserFromAuthToken, getUser } from 'src/firebase/admin/utils/user';
import { getQuarter } from 'src/firebase/admin/utils/quarter';
import { getLesson } from 'src/firebase/admin/utils/lesson';
import { getAllVideos } from 'src/firebase/admin/utils/video';
import { getAllModules } from 'src/firebase/admin/utils/module';
import { getAllWorksheets } from 'src/firebase/admin/utils/worksheet';
import { getAllAssessments } from 'src/firebase/admin/utils/assessment';
// COMPONENTS
import ViewSetter from 'src/components/setters/ViewSetter';
import LessonView from 'src/components/views/LessonView';

export async function getServerSideProps({ req, params }: GetServerSidePropsContext) {
    try {
        let authToken: string, quarterId: string, lessonId: string;

        // VARIABLE ASSIGNMENT
        if (req.cookies.authToken) authToken = req.cookies.authToken;
        else throw 'authToken is missing';
        if (!params) throw 'params is missing';
        if (params.qid) quarterId = params.qid as string;
        else throw 'qid is missing';
        if (params.lid) lessonId = params.lid as string;
        else throw 'lid is missing';

        // DATA FETCHING
        const { uid } = await getUserFromAuthToken(authToken);
        const user = await getUser(uid);
        const quarter = await getQuarter(quarterId);
        const lesson = await getLesson(lessonId);
        const videos = await getAllVideos(quarterId, lessonId);
        const modules = await getAllModules(quarterId, lessonId);
        const worksheets = await getAllWorksheets(quarterId, lessonId);
        const assessments = await getAllAssessments(quarterId, lessonId);

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
        console.log('[lesson|error]:', message);
        return {
            redirect: {
                destination: message === 'Auth token is missing' ? '/auth/sign-in' : '/',
                permanent: false,
            },
        };
    }
}

export default function Lesson({ result }: GSSP) {
    return (
        <ViewSetter gssp={result} pageBase="quarters" isPageUsingSidebar={true}>
            <LessonView />
        </ViewSetter>
    );
}
