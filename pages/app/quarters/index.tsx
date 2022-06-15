// LIB-TYPES
import type { GetServerSidePropsContext } from 'next';
// TYPES
import type { GSSP } from 'src/interfaces';
// FUNCTIONS
import { getUserFromAuthToken, getUser } from 'src/firebase/admin/utils/user';
import { getAllQuarters } from 'src/firebase/admin/utils/quarter';
// COMPONENTS
import ViewSetter from 'src/components/setters/ViewSetter';
import QuartersView from 'src/components/views/QuartersView';

export async function getServerSideProps({ req }: GetServerSidePropsContext) {
    try {
        let authToken: string;

        // VARIABLE ASSIGNMENT
        if (req.cookies.authToken) authToken = req.cookies.authToken;
        else throw 'authToken is missing';

        // DATA FETCHING
        const { uid } = await getUserFromAuthToken(authToken);
        const user = await getUser(uid);
        const quarters = await getAllQuarters();

        return {
            props: {
                result: {
                    error: null,
                    body: { user, quarters },
                },
            },
        };
    } catch (error: any) {
        const message = typeof error === 'object' ? error.message : error;
        console.log('[quarters|error]:', message);
        return {
            redirect: {
                destination: message === 'authToken is missing' ? '/auth/sign-in' : '/',
                permanent: false,
            },
        };
    }
}

export default function Quarters({ result }: GSSP) {
    return (
        <ViewSetter gssp={result} pageBase="quarters" isPageUsingSidebar={true}>
            <QuartersView />
        </ViewSetter>
    );
}
