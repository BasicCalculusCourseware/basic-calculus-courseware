// LIB TYPES
import type { GetServerSidePropsContext } from 'next';

// TYPES
import type { GSSP } from '@/utils/types';

// FUNCTIONS
import { getUserFromAuthToken, getUser } from '@/firebase/admin/utils/user';
import { getQuarter } from '@/firebase/admin/utils/quarter';
import { getLessons } from '@/firebase/admin/utils/lesson';

// COMPONENTS
import RootSetter from '@/comps/setters/RootSetter';
import LessonsView from '@/comps/views/LessonsView';

export async function getServerSideProps({
    req,
    params,
}: GetServerSidePropsContext) {
    try {
        const { uid } = await getUserFromAuthToken(req.cookies.authToken);
        const user = await getUser(uid);
        const quarter = await getQuarter(params?.qid as string);
        const lessons = await getLessons(params?.qid as string);
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
                destination:
                    message === 'Auth token is missing' ? '/auth/sign-in' : '/',
                permanent: false,
            },
        };
    }
}

export default function Lessons({ result }: GSSP) {
    return (
        <RootSetter
            gssp={{ result }}
            page={{ base: 'quarters' }}
            layout={{ isUsingDrawer: true }}
        >
            <LessonsView />
        </RootSetter>
    );
}
