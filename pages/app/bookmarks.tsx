// LIB TYPES
import type { GetServerSidePropsContext } from 'next';
// TYPES
import type { GSSP } from 'src/interfaces';
// FUNCTIONS
import { getUserFromAuthToken, getUser } from 'src/firebase/admin/utils/user';
import { getBookmarkedLessons } from 'src/firebase/admin/utils/bookmark';
// COMPONENTS
import ViewSetter from 'src/components/setters/ViewSetter';
import BookmarksView from 'src/components/views/BookmarksView';

export async function getServerSideProps({ req }: GetServerSidePropsContext) {
    try {
        let authToken: string;

        // VARIABLE ASSIGNMENT
        if (req.cookies.authToken) authToken = req.cookies.authToken;
        else throw 'authToken is missing';

        // DATA FETCHING
        const { uid, role } = await getUserFromAuthToken(authToken);
        if (role !== 'student') throw 'unauthorized access';
        const user = await getUser(uid);
        const bookmarkItems = await getBookmarkedLessons(uid);

        return {
            props: {
                result: {
                    error: null,
                    body: { user, bookmarkItems },
                },
            },
        };
    } catch (error: any) {
        const message = typeof error === 'object' ? error.message : error;
        return {
            redirect: {
                destination: message === 'authToken is missing' ? '/auth/sign-in' : '/',
                permanent: false,
            },
        };
    }
}

export default function Bookmarks({ result }: GSSP) {
    return (
        <ViewSetter gssp={result} pageBase="bookmarks" isPageUsingSidebar={true}>
            <BookmarksView />
        </ViewSetter>
    );
}
