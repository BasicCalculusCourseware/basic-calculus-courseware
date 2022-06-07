// LIB COMPONENTS
import { Stack } from '@mui/material';
// COMPONENTS
import SearchField from './SearchField';
import ProfilePopover from './ProfilePopover';

export default function TopbarWidgets() {
    return (
        <Stack spacing={1} direction="row" alignItems="center">
            <SearchField />
            <ProfilePopover />
        </Stack>
    );
}
