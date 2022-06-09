// LIB-FUNCTIONS
import { getUserFromAuthAPI } from 'src/firebase/client/utils/user';
// LIB-COMPONENTS
import { Container, Typography } from '@mui/material';
// COMPONENTS
import { Page, PageHeader, PageBody } from 'src/components/styled';
import AccountDisplay from 'src/components/modules/AccountDisplay';
// RECOIL
import { useRecoilValue } from 'recoil';
import { authAtoms, useSetAuth } from 'src/states/auth';

// MAIN-COMPONENT
export default function AccountView() {
    // RECOIL
    const user = useRecoilValue(authAtoms.user);
    const setAuth = useSetAuth();
    // UTILS
    const refreshUser = async () => {
        setAuth(await getUserFromAuthAPI());
    };
    // RENDER
    return (
        <Page>
            <Container maxWidth="lg">
                <PageHeader>
                    <Typography variant="h5">Account</Typography>
                    <Typography>Change your profile and account settings</Typography>
                </PageHeader>
                <PageBody>
                    <AccountDisplay {...{ user, refreshUser }} />
                </PageBody>
            </Container>
        </Page>
    );
}
