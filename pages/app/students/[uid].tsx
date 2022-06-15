// LIB-TYPES
import type { GetServerSidePropsContext } from 'next';
// TYPES
import type { GSSP } from 'src/interfaces';
// FUNCTIONS
import { getUserFromAuthToken, getUser } from 'src/firebase/admin/utils/user';
// COMPONENTS
import ViewSetter from 'src/components/setters/ViewSetter';
import StudentAccountView from 'src/components/views/StudentAccountView';

export async function getServerSideProps({ req, params }: GetServerSidePropsContext) {
    try {
        let authToken: string, studentUID: string;

        // VARIABLE ASSIGNMENT
        if (req.cookies.authToken) authToken = req.cookies.authToken;
        else throw 'authToken is missing';
        if (!params) throw 'params is missing';
        if (params.uid) studentUID = params.uid as string;
        else throw 'uid is missing';

        // DATA FETCHING
        const { uid, role } = await getUserFromAuthToken(authToken);
        if (role !== 'teacher' && role !== 'admin') throw 'Unauthorized access';
        const user = await getUser(uid);
        const student = await getUser(studentUID);

        return {
            props: {
                result: {
                    error: null,
                    body: { user, student },
                },
            },
        };
    } catch (error: any) {
        const message = typeof error === 'object' ? error.message : error;
        console.log('[students/uid|error]:', message);
        return {
            redirect: {
                destination: message === 'authToken is missing' ? '/auth/sign-in' : '/',
                permanent: false,
            },
        };
    }
}

export default function StudentAccount({ result }: GSSP) {
    return (
        <ViewSetter gssp={result} pageBase="students" isPageUsingSidebar={true}>
            <StudentAccountView />
        </ViewSetter>
    );
}
