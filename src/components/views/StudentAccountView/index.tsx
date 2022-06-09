// TYPES
import type { User } from 'src/interfaces';
// LIB-FUNCTIONS
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
// FUNCTIONS
import { sign, verify } from 'src/utils';
import initialState from 'src/utils/initialStates';
// LIB-COMPONENT
import { Container, Breadcrumbs, Typography } from '@mui/material';
import Link from 'next/link';
// COMPONENT
import { Page, PageHeader, PageBreadcrumbs, PageBody } from 'src/components/styled';
import { NavigateNextIcon } from 'src/components/icons';
import AccountDisplay from 'src/components/modules/AccountDisplay';
// RECOIL
import { useRecoilValue } from 'recoil';
import { gsspAtoms } from 'src/states/gssp';

// MAIN-COMPONENT
export default function StudentAccountView() {
    // ROUTER
    const router = useRouter();
    const { uid } = router.query as any;
    // RECOIL
    const gssp = useRecoilValue(gsspAtoms.gssp);
    // STATES
    const [user, setUser] = useState<User>(initialState.user);
    useEffect(() => {
        if (gssp.body && gssp.body.student) setUser(gssp.body.student);
    }, [gssp]);
    // UTILS
    const refreshUser = async () => {
        if (!uid) return;
        const payloadToken = sign({ target: 'getUser', uid });
        const { data } = await axios.get('/api/users', {
            params: { payloadToken },
        });
        const { body } = verify(data.responseToken);
        if (body) setUser(body.user);
    };
    // RENDER
    return (
        <Page>
            <Container maxWidth="lg">
                <PageBreadcrumbs>
                    <Breadcrumbs
                        maxItems={2}
                        separator={<NavigateNextIcon fontSize="small" />}
                    >
                        <Typography>App</Typography>
                        <Link href="/app/students" passHref>
                            <Typography data-is-link>Students</Typography>
                        </Link>
                        <Typography data-is-current>{user.name}</Typography>
                    </Breadcrumbs>
                </PageBreadcrumbs>
                <PageHeader>
                    <Typography variant="h5">Student&apos;s Account</Typography>
                    <Typography>
                        Change student&apos;s profile and account settings
                    </Typography>
                </PageHeader>
                <PageBody>
                    <AccountDisplay {...{ user, refreshUser }} />
                </PageBody>
            </Container>
        </Page>
    );
}
