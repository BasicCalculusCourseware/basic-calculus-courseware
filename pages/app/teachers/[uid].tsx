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
        if (!req.cookies.authToken) throw 'authToken is missing';
        const { uid, role } = await getUserFromAuthToken(req.cookies.authToken);
        if (role !== 'admin') throw 'Unauthorized access';
        const user = await getUser(uid);
        const teacher = await getUser(params?.uid as string);
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
        return {
            redirect: {
                destination: message === 'Auth token is missing' ? '/auth/sign-in' : '/',
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
