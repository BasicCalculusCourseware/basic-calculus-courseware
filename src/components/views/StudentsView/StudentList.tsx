// LIB TYPES
import type { GridSize } from '@mui/material';
// LIB FUNCTIONS
import { useMemo } from 'react';
// LIB-COMPONENTS
import { Grid, Typography, Stack, Tooltip } from '@mui/material';
import Link from 'next/link';
// COMPONENTS
import {
    EmailIcon,
    PhoneIcon,
    FacebookIcon,
    StudentIcon,
    BannedIcon,
    EmailVerifiedIcon,
    ForwardIcon,
} from 'src/components/icons';
import { LinkTextSpan } from 'src/components/styled';
// RECOIL
import { useRecoilValue } from 'recoil';
import { sidebarAtoms } from 'src/states/sidebar';
import { studentsViewAtoms } from '.';

// MAIN-COMPONENT
export default function StudentList() {
    // RECOIL
    const isSidebarOpen = useRecoilValue(sidebarAtoms.isSidebarOpen);
    const filtered = useRecoilValue(studentsViewAtoms.filtered);
    // STATES
    const gridItemProps = useMemo(() => {
        const xs: GridSize = 12;
        const sm: GridSize = 6;
        const md: GridSize = isSidebarOpen ? 6 : 4;
        const lg: GridSize = isSidebarOpen ? 4 : 3;
        return { item: true, xs, sm, md, lg };
    }, [isSidebarOpen]);
    // RENDER
    return (
        <Grid container spacing={2}>
            {filtered.map((student) => (
                <Grid key={student.uid} {...gridItemProps}>
                    <Item>
                        <ItemBanner />
                        <ItemPhoto sx={{ backgroundImage: `url(${student.photoUrl})` }} />
                        <ItemBody>
                            <NameText>{student.name}</NameText>
                            <InfoList direction="column" spacing={1}>
                                <InfoListItem>
                                    <InfoListItemIcon>
                                        <EmailIcon />
                                    </InfoListItemIcon>
                                    <InfoListItemText>{student.email}</InfoListItemText>
                                </InfoListItem>
                                <InfoListItem>
                                    <InfoListItemIcon>
                                        <PhoneIcon />
                                    </InfoListItemIcon>
                                    <InfoListItemText>{student.phone}</InfoListItemText>
                                </InfoListItem>
                                <InfoListItem>
                                    <InfoListItemIcon>
                                        <FacebookIcon />
                                    </InfoListItemIcon>
                                    <Link href={student.fb}>
                                        <InfoListItemText>
                                            <LinkTextSpan>{student.fb}</LinkTextSpan>
                                        </InfoListItemText>
                                    </Link>
                                </InfoListItem>
                            </InfoList>
                        </ItemBody>
                        <ItemFooter>
                            <Stack spacing={2} direction="row" justifyContent="flex-end">
                                <Tooltip
                                    title={student.isBanned ? 'Banned' : 'Not Banned'}
                                >
                                    <StatusItem data-is-active={student.isBanned}>
                                        <BannedIcon />
                                    </StatusItem>
                                </Tooltip>
                                <Tooltip
                                    title={
                                        student.isEmailVerified
                                            ? 'Email Verified'
                                            : 'Email Not Verified'
                                    }
                                >
                                    <StatusItem data-is-active={student.isEmailVerified}>
                                        <EmailVerifiedIcon />
                                    </StatusItem>
                                </Tooltip>
                                <Tooltip
                                    title={
                                        student.isEnrolled ? 'Enrolled' : 'Not Enrolled'
                                    }
                                >
                                    <StatusItem data-is-active={student.isEnrolled}>
                                        <StudentIcon />
                                    </StatusItem>
                                </Tooltip>
                                <Tooltip title="To Student's Account">
                                    <Link href={`/app/students/${student.uid}`}>
                                        <StatusItem>
                                            <ForwardIcon />
                                        </StatusItem>
                                    </Link>
                                </Tooltip>
                            </Stack>
                        </ItemFooter>
                    </Item>
                </Grid>
            ))}
        </Grid>
    );
}

// STYLES
import { styled } from '@mui/material';
import styles from 'src/utils/styles';
const Item = styled('div')({
    ...styles.border(1),
    ...styles.borderRadius(1),
    backgroundColor: 'white',
    overflow: 'hidden',
});
const ItemBanner = styled('div')(({ theme }) => ({
    ...styles.borderBottom(1),
    width: '100%',
    aspectRatio: '5/2',
    backgroundColor: theme.palette.primary.main,
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='88' height='24' viewBox='0 0 88 24'%3E%3Cg fill-rule='evenodd'%3E%3Cg id='autumn' fill='%23eeeeee' fill-opacity='0.1'%3E%3Cpath d='M10 0l30 15 2 1V2.18A10 10 0 0 0 41.76 0H39.7a8 8 0 0 1 .3 2.18v10.58L14.47 0H10zm31.76 24a10 10 0 0 0-5.29-6.76L4 1 2 0v13.82a10 10 0 0 0 5.53 8.94L10 24h4.47l-6.05-3.02A8 8 0 0 1 4 13.82V3.24l31.58 15.78A8 8 0 0 1 39.7 24h2.06zM78 24l2.47-1.24A10 10 0 0 0 86 13.82V0l-2 1-32.47 16.24A10 10 0 0 0 46.24 24h2.06a8 8 0 0 1 4.12-4.98L84 3.24v10.58a8 8 0 0 1-4.42 7.16L73.53 24H78zm0-24L48 15l-2 1V2.18A10 10 0 0 1 46.24 0h2.06a8 8 0 0 0-.3 2.18v10.58L73.53 0H78z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
}));
const ItemPhoto = styled('div')({
    ...styles.border(1),
    width: '50%',
    aspectRatio: '1',
    borderRadius: '100%',
    backgroundColor: 'white',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    margin: 'auto',
    marginTop: '-25%',
});
const ItemBody = styled('div')({
    ...styles.p(2),
    ...styles.pt(1),
    width: '100%',
});
const NameText = styled(Typography)(({ theme }) => ({
    ...theme.typography.h6,
    fontSize: 18,
    textAlign: 'center',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
}));
const InfoList = styled(Stack)({
    ...styles.mt(1),
});
const InfoListItem = styled('div')({
    ...styles.flexStartCenter,
    ...styles.px(2),
    overflow: 'hidden',
});
const InfoListItemIcon = styled('div')({
    ...styles.flexStartCenter,
    ...styles.mr(1.25),
    '& > svg': {
        fontSize: 18,
    },
});
const InfoListItemText = styled('p')({
    fontSize: 13,
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
});
const ItemFooter = styled('div')({
    ...styles.borderTop(1),
    ...styles.p(1),
});
const StatusItem = styled('div')({
    ...styles.flexCenter,
    ...styles.border(1),
    width: 40,
    height: 40,
    borderRadius: '100%',
    cursor: 'pointer',
    '& > svg': {
        fontSize: 18,
    },
    '&[data-is-active="false"]': {
        '& > svg': {
            color: styles.lineColor,
        },
    },
});
