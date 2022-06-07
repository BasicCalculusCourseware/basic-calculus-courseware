// COMPONENTS
import {
    BookmarksIcon,
    DashboardIcon,
    QuartersIcon,
    TeacherIcon,
    AccountIcon,
    StudentIcon,
} from 'src/components/icons';
import SidebarMenuItem from './SidebarMenuItem';
// RECOIL
import { useRecoilValue } from 'recoil';
import { authAtoms } from 'src/states/atoms';

// MAIN COMPONENT
export default function SidebarMenu() {
    // RECOIL
    const userRoles = useRecoilValue(authAtoms.userRoles);
    // RENDER
    return (
        <Container>
            <SidebarMenuItem
                icon={<DashboardIcon />}
                label="Dashboard"
                link="/app/dashboard"
                base="dashboard"
            />
            <SidebarMenuItem
                icon={<QuartersIcon />}
                label="Quarters"
                link="/app/quarters"
                base="quarters"
            />
            {userRoles.isStudent && (
                <SidebarMenuItem
                    icon={<BookmarksIcon />}
                    label="Bookmarks"
                    link="/app/bookmarks"
                    base="bookmarks"
                />
            )}
            {userRoles.isEditor && (
                <SidebarMenuItem
                    icon={<StudentIcon />}
                    label="Students"
                    link="/app/students"
                    base="students"
                />
            )}
            {userRoles.isAdmin && (
                <SidebarMenuItem
                    icon={<TeacherIcon />}
                    label="Teachers"
                    link="/app/teachers"
                    base="teachers"
                />
            )}
            <SidebarMenuItem
                icon={<AccountIcon />}
                label="Account"
                link="/app/account"
                base="account"
            />
        </Container>
    );
}

// STYLES
import { styled } from '@mui/material';
import styles from 'src/utils/styles';
const Container = styled('div')({
    ...styles.py(2),
});
