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
        const { uid, role } = await getUserFromAuthToken(req.cookies.authToken);
        if (role !== 'teacher' && role !== 'admin') throw 'Unauthorized access';
        const user = await getUser(uid);
        const student = await getUser(params?.uid as string);
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
        return {
            redirect: {
                destination: message === 'Auth token is missing' ? '/auth/sign-in' : '/',
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
