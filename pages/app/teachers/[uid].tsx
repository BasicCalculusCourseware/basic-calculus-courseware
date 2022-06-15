// LIB-TYPES
import type { GetServerSidePropsContext } from 'next';
// TYPES
import type { GSSP } from 'src/interfaces';
// FUNCTIONS
import { getUserFromAuthToken, getUser } from 'src/firebase/admin/utils/user';
// COMPONENTS
import ViewSetter from 'src/components/setters/ViewSetter';
import TeacherAccountView from 'src/components/views/TeacherAccountView';

export async function getServerSideProps({ req, params }: GetServerSidePropsContext) {
    try {
        let authToken: string, teacherUID: string;

        // VARIABLE ASSIGNMENT
        if (req.cookies.authToken) authToken = req.cookies.authToken;
        else throw 'authToken is missing';
        if (!params) throw 'params is missing';
        if (params.uid) teacherUID = params.uid as string;
        else throw 'uid is missing';

        // DATA FETCHING
        const { uid, role } = await getUserFromAuthToken(authToken);
        if (role !== 'admin') throw 'unauthorized access';
        const user = await getUser(uid);
        const teacher = await getUser(teacherUID);

        return {
            props: {
                result: {
                    error: null,
                    body: { user, teacher },
                },
            },
        };
    } catch (error: any) {
        const message = typeof error === 'object' ? error.message : error;
        console.log('[teachers/[uid]|error]:', message);
        return {
            redirect: {
                destination: message === 'authToken is missing' ? '/auth/sign-in' : '/',
                permanent: false,
            },
        };
    }
}

export default function TeacherAccount({ result }: GSSP) {
    return (
        <ViewSetter gssp={result} pageBase="teachers" isPageUsingSidebar={true}>
            <TeacherAccountView />
        </ViewSetter>
    );
}
