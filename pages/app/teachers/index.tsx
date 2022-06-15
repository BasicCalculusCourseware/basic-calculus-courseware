// LIB-TYPES
import type { GetServerSidePropsContext } from 'next';
// TYPES
import type { GSSP } from 'src/interfaces';
// FUNCTIONS
import { getUserFromAuthToken, getUser } from 'src/firebase/admin/utils/user';
import { getAllTeachers } from 'src/firebase/admin/utils/teacher';
// COMPONENTS
import ViewSetter from 'src/components/setters/ViewSetter';
import TeachersView from 'src/components/views/TeachersView';

export async function getServerSideProps({ req }: GetServerSidePropsContext) {
    try {
        if (!req.cookies.authToken) throw 'authToken is missing';
        const { uid, role } = await getUserFromAuthToken(req.cookies.authToken);
        if (role !== 'admin') throw 'Unauthorized access';
        const user = await getUser(uid);
        const teachers = await getAllTeachers();
        return {
            props: {
                result: {
                    error: null,
                    body: { user, teachers },
                },
            },
        };
    } catch (error: any) {
        const message = typeof error === 'object' ? error.message : error;
        console.log('[teachers|error]:', message);
        return {
            redirect: {
                destination: message === 'Auth token is missing' ? '/auth/sign-in' : '/',
                permanent: false,
            },
        };
    }
}

export default function Teachers({ result }: GSSP) {
    return (
        <ViewSetter gssp={result} pageBase="teachers" isPageUsingSidebar={true}>
            <TeachersView />
        </ViewSetter>
    );
}
