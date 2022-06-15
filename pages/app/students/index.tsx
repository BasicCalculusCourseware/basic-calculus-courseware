// LIB-TYPES
import type { GetServerSidePropsContext } from 'next';
// TYPES
import type { GSSP } from 'src/interfaces';
// FUNCTIONS
import { getUserFromAuthToken, getUser } from 'src/firebase/admin/utils/user';
import { getAllStudents } from 'src/firebase/admin/utils/student';
// COMPONENTS
import ViewSetter from 'src/components/setters/ViewSetter';
import StudentsView from 'src/components/views/StudentsView';

export async function getServerSideProps({ req }: GetServerSidePropsContext) {
    try {
        let authToken: string;

        // VARIABLE ASSIGNMENT
        if (req.cookies.authToken) authToken = req.cookies.authToken;
        else throw 'authToken is missing';

        // DATA FETCHING
        const { uid, role } = await getUserFromAuthToken(authToken);
        if (role !== 'teacher' && role !== 'admin') throw 'unauthorized access';
        const user = await getUser(uid);
        const students = await getAllStudents();

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
        console.log('[students|error]:', message);
        return {
            redirect: {
                destination: message === 'authToken is missing' ? '/auth/sign-in' : '/',
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
