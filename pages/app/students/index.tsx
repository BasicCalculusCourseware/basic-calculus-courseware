// LIB-TYPES
import type { GetServerSidePropsContext } from 'next';
// TYPES
import type { GSSP } from 'src/interfaces';
// FUNCTIONS
import { getUserFromAuthToken, getUser } from 'src/firebase/admin/utils/user';
import { getStudents } from 'src/firebase/admin/utils/student';
// COMPONENTS
import ViewSetter from 'src/components/setters/ViewSetter';
import StudentsView from 'src/components/views/StudentsView';

export async function getServerSideProps({ req }: GetServerSidePropsContext) {
    try {
        if (!req.cookies.authToken) throw 'authToken is missing';
        const { uid, role } = await getUserFromAuthToken(req.cookies.authToken);
        if (role !== 'teacher' && role !== 'admin') throw 'Unauthorized access';
        const user = await getUser(uid);
        const students = await getStudents();
        return {
            props: {
                result: {
                    error: null,
                    body: { user, students },
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

export default function Students({ result }: GSSP) {
    return (
        <ViewSetter gssp={result} pageBase="students" isPageUsingSidebar={true}>
            <StudentsView />
        </ViewSetter>
    );
}
