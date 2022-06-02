// LIB TYPES
import type { GetServerSidePropsContext } from 'next';
// COMPONENTS
import ViewSetter from 'src/components/setters/ViewSetter';
import SignUpView from 'src/components/views/SignUpView';

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

export default function SignUp() {
    return (
        <ViewSetter pageBase="sign-up" isPageUsingSidebar={false}>
            <SignUpView />
        </ViewSetter>
    );
}
