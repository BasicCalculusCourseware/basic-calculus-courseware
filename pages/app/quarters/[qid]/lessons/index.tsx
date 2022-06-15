// LIB-TYPES
import type { GetServerSidePropsContext } from 'next';
// TYPES
import type { GSSP } from 'src/interfaces';
// FUNCTIONS
import { getUserFromAuthToken, getUser } from 'src/firebase/admin/utils/user';
import { getQuarter } from 'src/firebase/admin/utils/quarter';
import { getAllLessons } from 'src/firebase/admin/utils/lesson';
// COMPONENTS
import ViewSetter from 'src/components/setters/ViewSetter';
import LessonsView from 'src/components/views/LessonsView';

export async function getServerSideProps({ req, params }: GetServerSidePropsContext) {
    try {
        if (!req.cookies.authToken) throw 'authToken is missing';
        const { uid } = await getUserFromAuthToken(req.cookies.authToken);
        const user = await getUser(uid);
        if (!params?.qid) throw 'qid is missing';
        const quarter = await getQuarter(params.qid as string);
        const lessons = await getAllLessons(params.qid as string);
        return {
            props: {
                result: {
                    error: null,
                    body: { user, lessons, quarter },
                },
            },
        };
    } catch (error: any) {
        const message = typeof error === 'object' ? error.message : error;
        return {
            redirect: {
                destination: message === 'Auth token is missing' ? '/auth/sign-in' : '/',
                permanent: false,
            },
        };
    }
}

export default function Lessons({ result }: GSSP) {
    return (
        <ViewSetter gssp={result} pageBase="quarters" isPageUsingSidebar={true}>
            <LessonsView />
        </ViewSetter>
    );
}
