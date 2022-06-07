// LIB TYPES
import type { GetServerSidePropsContext } from 'next';
// TYPES
import type { GSSP } from 'src/interfaces';
// FUNCTIONS
import { getUserFromAuthToken, getUser } from 'src/firebase/admin/utils/user';
import { getTotalTeachers } from 'src/firebase/admin/utils/teacher';
import { getTotalStudents } from 'src/firebase/admin/utils/student';
import { getTotalQuarters } from 'src/firebase/admin/utils/quarter';
import { getTotalLessons, getTotalBookmarks } from 'src/firebase/admin/utils/lesson';
// COMPONENTS
import ViewSetter from 'src/components/setters/ViewSetter';
import DashboardView from 'src/components/views/DashboardView';

export async function getServerSideProps({ req }: GetServerSidePropsContext) {
    try {
        if (!req.cookies.authToken) throw 'authToken is missing';
        const { uid, role } = await getUserFromAuthToken(req.cookies.authToken);
        const user = await getUser(uid);
        const totalTeachers = role === 'admin' ? await getTotalTeachers() : null;
        const totalStudents =
            role === 'admin' || role === 'teacher' ? await getTotalStudents() : null;
        const totalBookmarks = role === 'student' ? await getTotalBookmarks(uid) : null;
        const totalQuarters = await getTotalQuarters();
        const totalLessons = await getTotalLessons();
        return {
            props: {
                result: {
                    error: null,
                    body: {
                        user,
                        totalTeachers,
                        totalStudents,
                        totalQuarters,
                        totalLessons,
                        totalBookmarks,
                    },
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

export default function Dashboard({ result }: GSSP) {
    return (
        <ViewSetter gssp={result} pageBase="dashboard" isPageUsingSidebar={true}>
            <DashboardView />
        </ViewSetter>
    );
}
