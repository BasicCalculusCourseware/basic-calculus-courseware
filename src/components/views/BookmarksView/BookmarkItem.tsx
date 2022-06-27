// TYPES
import type { BookmarkItem } from 'src/interfaces';
import type { ContentColor } from 'src/utils';
// LIB-FUNCTIONS
import { useState, useEffect } from 'react';
// FUNCTIONS
import { contentColorKeys, contentColorObject } from 'src/utils';
// FUNCTIONS
import {
    getBookmarkStatus,
    bookmarkLesson,
    unbookmarkLesson,
} from 'src/firebase/client/utils/bookmark';
// LIB-COMPONENTS
import { Typography, IconButton } from '@mui/material';
import Link from 'next/link';
// COMPONENTS
import { BookmarkedIcon, NotBookmarkedIcon } from 'src/components/icons';
// RECOIL
import { useRecoilValue } from 'recoil';
import { authAtoms } from 'src/states/auth';

// MAIN-COMPONENT
interface Props {
    bookmarkItem: BookmarkItem;
}
export default function BookmarkItem({
    bookmarkItem: { quarter, lesson },
}: Props) {
    // RECOIL
    const user = useRecoilValue(authAtoms.user);
    // STATES
    const [isBookmarked, setIsBookmarked] = useState(true);
    // UTILS
    const getBGColor = () =>
        contentColorKeys.includes(lesson.color as ContentColor)
            ? contentColorObject[lesson.color as ContentColor]
            : 'white';
    const getTextColor = () =>
        lesson.color === 'yellow' || lesson.color === 'white'
            ? '#333'
            : 'white';
    const handleBookmark = () => {
        setIsBookmarked(true);
        bookmarkLesson(lesson.id, user.uid);
    };
    const handleUnbookmark = () => {
        setIsBookmarked(false);
        unbookmarkLesson(lesson.id, user.uid);
    };
    // EFFECTS
    useEffect(() => {
        let isMounted = true;
        (async () => {
            const isBookmarked = await getBookmarkStatus(lesson.id, user.uid);
            if (isMounted) setIsBookmarked(isBookmarked);
        })();
        return () => {
            isMounted = false;
        };
    }, [lesson, user]);
    // RENDER
    return (
        <Item>
            <ItemHeader sx={{ bgcolor: getBGColor() }}>
                <ItemHeading sx={{ color: getTextColor() }}>
                    {quarter.number}
                </ItemHeading>
                <IconButton
                    sx={{ color: getTextColor() }}
                    onClick={() =>
                        isBookmarked ? handleUnbookmark() : handleBookmark()
                    }
                >
                    {isBookmarked ? <BookmarkedIcon /> : <NotBookmarkedIcon />}
                </IconButton>
            </ItemHeader>
            <Link href={`/app/quarters/${quarter.id}/lessons/${lesson.id}`}>
                <ItemBody>
                    <Typography>{lesson.number}</Typography>
                    <ItemTitle>{lesson.title}</ItemTitle>
                </ItemBody>
            </Link>
        </Item>
    );
}

// STYLES
import { styled } from '@mui/material';
import { styles } from 'src/utils';
export const Item = styled('div')({
    ...styles.border(1),
    ...styles.borderRadius(1),
    height: 250,
    backgroundColor: 'white',
    overflow: 'hidden',
});
export const ItemHeader = styled('div')({
    ...styles.flexStartCenter,
    ...styles.borderBottom(1),
    ...styles.pl(2),
    ...styles.pr(1),
    height: 50,
});
export const ItemHeading = styled(Typography)({
    flexGrow: 1,
});
export const ItemBody = styled('div')({
    ...styles.p(2),
    minHeight: 200,
    cursor: 'pointer',
    '&:hover': {
        backgroundColor: styles.hoverColor,
    },
});
export const ItemTitle = styled(Typography)({
    textAlign: 'center',
});
