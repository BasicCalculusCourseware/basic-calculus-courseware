// LIB-TYPES
import type { GetServerSidePropsContext } from 'next';
// COMPONENTS
import ViewSetter from 'src/components/setters/ViewSetter';
import SignInView from 'src/components/views/SignInView';

export async function getServerSideProps({ req }: GetServerSidePropsContext) {
    return req.cookies.authToken
        ? {
              redirect: {
                  destination: '/',
                  permanent: false,
              },
          }
        : { props: {} };
}

export default function SignIn() {
    return (
        <ViewSetter pageBase="sign-in" isPageUsingSidebar={false}>
            <SignInView />
        </ViewSetter>
    );
}
