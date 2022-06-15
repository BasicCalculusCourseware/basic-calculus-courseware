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
        let authToken: string, quarterId: string;

        // VARIABLE ASSIGNMENT
        if (req.cookies.authToken) authToken = req.cookies.authToken;
        else throw 'authToken is missing';
        if (!params) throw 'params is missing';
        if (params.qid) quarterId = params.qid as string;
        else throw 'qid is missing';

        // DATA FETCHING
        const { uid } = await getUserFromAuthToken(authToken);
        const user = await getUser(uid);
        const quarter = await getQuarter(quarterId);
        const lessons = await getAllLessons(quarterId);

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
        console.log('[lessons|error]:', message);
        return {
            redirect: {
                destination: message === 'authToken is missing' ? '/auth/sign-in' : '/',
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
