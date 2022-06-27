// LIB FUNCTIONS
import { useState } from 'react';
import { useRouter } from 'next/router';
// LIB COMPONENTS
import { Avatar, IconButton, Popover, Stack, Tooltip } from '@mui/material';
import { Fragment } from 'react';
// COMPONENTS
import {
    AccountIcon,
    SignInIcon,
    SignOutIcon,
    SignUpIcon,
} from 'src/components/icons';
// RECOIL
import { useRecoilValue } from 'recoil';
import { authAtoms, useResetAuth, useSignOut } from 'src/states/auth';
import { useAddSnackbarItem } from 'src/states/snackbar';
import { useCloseSidebar } from 'src/states/sidebar';

// MAIN-COMPONENT
export default function ProfilePopover() {
    // ROUTER
    const router = useRouter();
    // RECOIL
    const user = useRecoilValue(authAtoms.user);
    const signOut = useSignOut();
    // STATES
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
    const open = Boolean(anchorEl);
    const id = open ? 'profile-popover' : undefined;
    // UTILS
    const handleProfile = async () => {
        await router.push('/app/account');
        setAnchorEl(null);
    };
    const handleSignIn = async () => {
        await router.push('/auth/sign-in');
        setAnchorEl(null);
    };
    const handleSignUp = async () => {
        await router.push('/auth/sign-up');
        setAnchorEl(null);
    };
    const handleSignOut = () => {
        setAnchorEl(null);
        signOut();
    };
    // RENDER
    return (
        <div>
            <IconButton
                aria-describedby={id}
                onClick={(e) => setAnchorEl(e.currentTarget)}
            >
                <Avatar
                    src={user.photoUrl || '/images/no-profile.png'}
                    alt="profile-picture"
                />
            </IconButton>
            <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={() => setAnchorEl(null)}
                elevation={1}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
            >
                <Profile>
                    <ProfileBody>
                        <UserAvatar
                            variant="rounded"
                            alt="profile-picture"
                            src={user.photoUrl || '/images/no-profile.png'}
                        />
                        {user.uid && (
                            <Fragment>
                                <UserName>{user.name}</UserName>
                                <UserEmail>{user.email}</UserEmail>
                            </Fragment>
                        )}
                        {!user.uid && (
                            <WarningText>You must sign-in first</WarningText>
                        )}
                    </ProfileBody>
                    <ProfileFooter>
                        <Stack
                            spacing={1}
                            direction="row"
                            justifyContent="flex-end"
                        >
                            {user.uid ? (
                                <Fragment>
                                    <Tooltip title="Sign Out">
                                        <IconButton onClick={handleSignOut}>
                                            <SignOutIcon />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Go to Profile">
                                        <IconButton onClick={handleProfile}>
                                            <AccountIcon />
                                        </IconButton>
                                    </Tooltip>
                                </Fragment>
                            ) : (
                                <Fragment>
                                    <Tooltip title="Sign In">
                                        <IconButton onClick={handleSignIn}>
                                            <SignInIcon />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Sign Up">
                                        <IconButton onClick={handleSignUp}>
                                            <SignUpIcon />
                                        </IconButton>
                                    </Tooltip>
                                </Fragment>
                            )}
                        </Stack>
                    </ProfileFooter>
                </Profile>
            </Popover>
        </div>
    );
}

// STYLES
import { styled } from '@mui/material';
import styles from 'src/utils/styles';
const Profile = styled('div')({
    ...styles.border,
    ...styles.borderRadius,
    minWidth: 250,
    maxWidth: 500,
});
const ProfileBody = styled('div')({
    ...styles.p(2),
    p: {
        textAlign: 'center',
        wordBreak: 'break-all',
    },
});
const ProfileFooter = styled('div')({
    ...styles.borderTop(1),
    ...styles.p(1),
    '.MuiIconButton-root': {
        ...styles.border(1),
        ...styles.box(40),
    },
});
const UserAvatar = styled(Avatar)({
    ...styles.border(1),
    ...styles.mb(0.5),
    width: 75,
    height: 75,
    margin: 'auto',
    backgroundColor: styles.hoverColor,
});
const UserName = styled('p')({
    ...styles.mb(-1),
    fontSize: 20,
});
const UserEmail = styled('p')({
    fontSize: 13,
});
const WarningText = styled('p')({
    ...styles.mt(2),
});
