// TYPES
import type { ChildrenProp } from 'src/interfaces';
// LIB FUNCTIONS
import { useMemo } from 'react';
import Link from 'next/link';
// COMPONENTS
import { AnnouncementIcon } from 'src/components/icons';
import { Warning, WarningIcon, LinkTextSpan } from 'src/components/styled';
// RECOIL
import { useRecoilValue } from 'recoil';
import { authAtoms } from 'src/states/auth';
import { pageAtoms } from 'src/states/page';

// MAIN-COMPONENT
export default function PageSetter({ children }: ChildrenProp) {
    // RECOIL
    const user = useRecoilValue(authAtoms.user);
    const pageBase = useRecoilValue(pageAtoms.pageBase);
    // STATES
    const content = useMemo(() => {
        const isPageForEnrolledOnly = [
            'dashboard',
            'quarters',
            'bookmarks',
            'history',
        ].some((val) => val === pageBase);
        if (isPageForEnrolledOnly && user.role === 'student')
            return user.isEnrolled ? children : <ForEnrolledStudentOnly />;
        const isPageForVerifiedTeacherOnly = [
            'dashboard',
            'quarters',
            'enrollees',
            'students',
        ].some((val) => val === pageBase);
        if (isPageForVerifiedTeacherOnly && user.role === 'teacher')
            return user.isTeacherVerified ? children : <ForVerifiedTeacherOnly />;
        return children;
    }, [user, pageBase, children]);
    // RENDER
    return content;
}

// SUB-COMPONENTS
function ForEnrolledStudentOnly() {
    return (
        <Warning>
            <WarningIcon>
                <AnnouncementIcon />
            </WarningIcon>
            <p>You must be enrolled first before you can access this page.</p>
            <p>
                Go to your{' '}
                <Link href="/app/account" passHref>
                    <LinkTextSpan>account</LinkTextSpan>
                </Link>{' '}
                to see your current status.
            </p>
        </Warning>
    );
}
function ForVerifiedTeacherOnly() {
    return (
        <Warning>
            <WarningIcon>
                <AnnouncementIcon />
            </WarningIcon>
            <p>You must be a verified teacher first before you can access this page.</p>
            <p>
                Go to your{' '}
                <Link href="/app/account" passHref>
                    <LinkTextSpan>account</LinkTextSpan>
                </Link>{' '}
                to see your current status.
            </p>
        </Warning>
    );
}
