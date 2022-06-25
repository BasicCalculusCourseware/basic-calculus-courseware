// TYPES
import type { BookmarkItem as BookmarkItemType } from 'src/interfaces';
// LIB-FUNCTIONS
import { useState, useEffect } from 'react';
import { useGridItemProps } from 'src/hooks';
// LIB-COMPONENTS
import { Container, Grid, Typography } from '@mui/material';
// COMPONENTS
import { Page, PageHeader, PageBody } from 'src/components/styled';
import BookmarkItem from './BookmarkItem';
// RECOIL
import { useRecoilValue } from 'recoil';
import { gsspAtoms } from 'src/states/gssp';

// MAIN-COMPONENT
export default function BookmarksView() {
    // HOOKS
    const gridItemProps = useGridItemProps();
    // RECOIL
    const gssp = useRecoilValue(gsspAtoms.gssp);
    // STATES
    const [bookmarkItems, setBookmarkItems] = useState<BookmarkItemType[]>([]);
    // EFFECTS
    useEffect(() => {
        if (gssp.body && gssp.body.bookmarkItems)
            setBookmarkItems(gssp.body.bookmarkItems);
    }, [gssp]);
    // RENDER
    return (
        <Page>
            <Container maxWidth="lg" fixed={true}>
                <PageHeader>
                    <Typography variant="h5">Bookmarks</Typography>
                    <Typography>
                        Found a total of {bookmarkItems.length} bookmarked lesson
                        {bookmarkItems.length !== 1 && 's'}
                    </Typography>
                </PageHeader>
                <PageBody>
                    <Grid container spacing={2}>
                        {bookmarkItems.map((bookmarkItem) => (
                            <Grid key={bookmarkItem.lessonId} {...gridItemProps()}>
                                <BookmarkItem {...{ bookmarkItem }} />
                            </Grid>
                        ))}
                    </Grid>
                </PageBody>
            </Container>
        </Page>
    );
}
