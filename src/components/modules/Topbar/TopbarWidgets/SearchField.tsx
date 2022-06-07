// LIB FUNCTIONS
import { useState, useMemo, useEffect } from 'react';
// LIB COMPONENTS
import { Tooltip, Modal, Stack, Zoom } from '@mui/material';
import { Fragment } from 'react';
import Link from 'next/link';
// COMPONENTS
import {
    SearchIcon,
    SearchOffIcon,
    TabIcon,
    HomeIcon,
    DashboardIcon,
    AccountIcon,
    StudentIcon,
    TeacherIcon,
    SignInIcon,
    SignUpIcon,
    QuartersIcon,
} from 'src/components/icons';
// RECOIL
import { useRecoilValue } from 'recoil';
import { authAtoms } from 'src/states/auth';

// MAIN-COMPONENT
export default function SeachFieldComponent() {
    // RECOIL
    const { uid, role } = useRecoilValue(authAtoms.user);
    const { isEditor } = useRecoilValue(authAtoms.userRoles);
    // MODAL
    const [isModalOpen, setIsModalOpen] = useState(false);
    const closeModal = () => setIsModalOpen(false);
    const openModal = () => {
        setIsModalOpen(true);
        setFilter('');
    };
    // HOTKEY
    useEffect(() => {
        let isMounted = true;
        let keys = { ctrl: false, q: false };
        function handleKeyDown(e: KeyboardEvent) {
            if (!isMounted) return;
            if (e.key === 'Control') keys.ctrl = true;
            if (e.key === 'q') keys.q = true;
            if (keys.ctrl && keys.q) setIsModalOpen(true);
        }
        function handleKeyUp() {
            keys = { ctrl: false, q: false };
        }
        document.addEventListener('keydown', handleKeyDown);
        document.addEventListener('keyup', handleKeyUp);
        return () => {
            isMounted = false;
            document.removeEventListener('keydown', handleKeyDown);
            document.removeEventListener('keyup', handleKeyUp);
        };
    }, []);
    // STATES
    const originalList = useMemo(
        () => [
            { label: 'Home', href: '/', icon: <HomeIcon />, visible: true },
            {
                label: 'Dashboard',
                href: '/app/dashboard',
                icon: <DashboardIcon />,
                visible: uid !== '',
            },
            {
                label: 'Quarters',
                href: '/app/quarters',
                icon: <QuartersIcon />,
                visible: uid !== '',
            },
            {
                label: 'Account',
                href: '/app/account',
                icon: <AccountIcon />,
                visible: uid !== '',
            },
            {
                label: 'Students',
                href: '/app/students',
                icon: <StudentIcon />,
                visible: isEditor,
            },
            {
                label: 'Teachers',
                href: '/app/teachers',
                icon: <TeacherIcon />,
                visible: role === 'admin',
            },
            {
                label: 'Sign In',
                href: '/auth/sign-in',
                icon: <SignInIcon />,
                visible: uid === '',
            },
            {
                label: 'Sign Up',
                href: '/auth/sign-up',
                icon: <SignUpIcon />,
                visible: uid === '',
            },
            {
                label: 'Privacy Policy',
                href: '/resources/privacy-policy',
                icon: <TabIcon />,
                visible: true,
            },
            {
                label: 'Terms and Conditions',
                href: '/resources/terms-and-conditions',
                icon: <TabIcon />,
                visible: true,
            },
        ],
        [isEditor, role, uid]
    );
    const [filter, setFilter] = useState('');
    const filteredList = useMemo(() => {
        if (filter !== '') {
            return originalList.filter(
                (item) =>
                    item.visible &&
                    item.label.toUpperCase().indexOf(filter.toUpperCase()) > -1
            );
        } else return originalList.filter((item) => item.visible);
    }, [filter, originalList]);
    // RENDER
    return (
        <Fragment>
            <SearchField onClick={openModal}>
                <Tooltip title="Search">
                    <SearchFieldIcon />
                </Tooltip>
                <SearchFieldText data-1653245195193>Search...</SearchFieldText>
                <SearchFieldBadge data-1653245195193>Ctrl+Q</SearchFieldBadge>
            </SearchField>
            <Modal open={isModalOpen} onClose={closeModal}>
                <Zoom in={isModalOpen}>
                    <SearchFieldModal>
                        <ModalHeader spacing={1} direction="row" alignItems="center">
                            <ModalHeaderIcon />
                            <ModalHeaderInput
                                type="text"
                                placeholder="Search..."
                                value={filter}
                                onChange={(e) => setFilter(e.target.value)}
                                autoFocus
                            />
                            <ModalHeaderBadge onClick={closeModal}>esc</ModalHeaderBadge>
                        </ModalHeader>
                        <ModalBody>
                            <SearchItemList>
                                {!!filteredList.length ? (
                                    filteredList.map((item, index) => (
                                        <Link key={index} href={item.href} passHref>
                                            <SearchItem onClick={closeModal}>
                                                <SearchItemIcon>
                                                    {item.icon}
                                                </SearchItemIcon>
                                                <SearchItemLabel>
                                                    {item.label}
                                                </SearchItemLabel>
                                            </SearchItem>
                                        </Link>
                                    ))
                                ) : (
                                    <SearchItem>
                                        <SearchItemIcon>
                                            <Tooltip title="Page">
                                                <SearchOffIcon />
                                            </Tooltip>
                                        </SearchItemIcon>
                                        <SearchItemLabel>
                                            No results for &quot;{filter}&quot;
                                        </SearchItemLabel>
                                    </SearchItem>
                                )}
                            </SearchItemList>
                        </ModalBody>
                    </SearchFieldModal>
                </Zoom>
            </Modal>
        </Fragment>
    );
}

// STYLES
import { styled } from '@mui/material';
import styles from 'src/utils/styles';
const SearchField = styled('div')(({ theme }) => ({
    ...styles.flexStartCenter,
    ...styles.border(1),
    ...styles.borderRadius(1),
    ...styles.px(1),
    width: 225,
    height: 40,
    fontSize: 14,
    color: theme.palette.secondary.main,
    cursor: 'pointer',
    '&:hover': {
        backgroundColor: styles.hoverColor,
    },
    [theme.breakpoints.down('sm')]: {
        width: 40,
        '[data-1653245195193]': {
            display: 'none',
            visibility: 'hidden',
        },
    },
}));
const SearchFieldIcon = styled(SearchIcon)({
    ...styles.pr(1),
    fontSize: 30,
});
const SearchFieldText = styled('p')({
    flexGrow: 1,
});
const SearchFieldBadge = styled('span')({
    ...styles.flexCenter,
    ...styles.border(1),
    ...styles.borderRadius(1),
    ...styles.px(0.5),
    backgroundColor: 'white',
});
const SearchFieldModal = styled('div')({
    ...styles.border(1),
    ...styles.borderRadius(1),
    width: '100%',
    maxWidth: 500,
    backgroundColor: 'white',
});
const ModalHeader = styled(Stack)({
    ...styles.borderBottom(1),
    ...styles.p(2),
});
const ModalHeaderIcon = styled(SearchIcon)(({ theme }) => ({
    color: theme.palette.primary.main,
}));
const ModalHeaderInput = styled('input')({
    minWidth: 0,
    flexGrow: 1,
    border: 'none',
    fontSize: 15,
});
const ModalHeaderBadge = styled('span')({
    ...styles.flexCenter,
    ...styles.border(1),
    ...styles.borderRadius(1),
    ...styles.px(0.5),
    height: 25,
    backgroundColor: styles.hoverColor,
    fontSize: 13,
    cursor: 'pointer',
});
const ModalBody = styled('div')({});
const SearchItemList = styled(Stack)(({ theme }) => ({
    ...styles.scrollbar(theme.palette.secondary.light),
    ...styles.p(1),
    maxHeight: '50vh',
    overflowY: 'auto',
}));
const SearchItem = styled('div')({
    ...styles.flexStartCenter,
    ...styles.p(2),
    borderBottom: '1px solid ' + styles.hoverColor,
    '&:hover': {
        ...styles.borderRadius(1),
        backgroundColor: styles.hoverColor,
        cursor: 'pointer',
    },
    '&:last-child': {
        border: 'none',
    },
});
const SearchItemIcon = styled('div')(({ theme }) => ({
    ...styles.flexStartCenter,
    width: 35,
    color: theme.palette.secondary.light,
}));
const SearchItemLabel = styled('p')({});
