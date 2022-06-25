// LIB-FUNCTIONS
import { useState, useEffect } from 'react';
// FUNCTIONS
import {
    getBookmarkStatus,
    bookmarkLesson,
    unbookmarkLesson,
} from 'src/firebase/client/utils/bookmark';
// LIB-COMPONENTS
import { IconButton } from '@mui/material';
// COMPONENTS
import { BookmarkedIcon, NotBookmarkedIcon } from 'src/components/icons';
// RECOIL
import { useRecoilValue } from 'recoil';
import { authAtoms } from 'src/states/auth';
import { useAddSnackbarItem } from 'src/states/snackbar';
import { lessonViewAtoms } from '.';

// MAIN-COMPONENT
export default function BookmarkButton() {
    // RECOIL
    const user = useRecoilValue(authAtoms.user);
    const lesson = useRecoilValue(lessonViewAtoms.lesson);
    const addSnackbarItem = useAddSnackbarItem();
    // STATES
    const [isBookmarked, setIsBookmarked] = useState(false);
    // UTILS
    const handleBookmark = () => {
        setIsBookmarked(true);
        bookmarkLesson(lesson.id, user.uid);
        addSnackbarItem('info', 'Lesson bookmarked');
    };
    const handleUnbookmark = () => {
        setIsBookmarked(false);
        unbookmarkLesson(lesson.id, user.uid);
        addSnackbarItem('info', 'Lesson unbookmarked');
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
        <MainButton
            onClick={() => (isBookmarked ? handleUnbookmark() : handleBookmark())}
        >
            {isBookmarked ? <BookmarkedIcon /> : <NotBookmarkedIcon />}
        </MainButton>
    );
}

// STYLES
import { styled } from '@mui/material';
import { styles } from 'src/utils';
const MainButton = styled(IconButton)({
    position: 'absolute',
    top: styles.spacing(2),
    right: styles.spacing(2),
});
