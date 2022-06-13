// LIB-FUNCTIONS
import { useEffect } from 'react';
// LIB-COMPONENTS
import { Divider } from '@mui/material';
// COMPONENTS
import SearchBox from './SearchBox';
import UserList from './UserList';
// RECOIL
import { useRecoilValue, useSetRecoilState, useResetRecoilState } from 'recoil';
import { gsspAtoms } from 'src/states/gssp';
import { usersDisplayAtoms, useFilterUsers } from '.';

// MAIN-COMPONENT
interface Props {
    variant: 'students' | 'teachers';
}
export default function UserDisplay({ variant }: Props) {
    // RECOIL
    const gssp = useRecoilValue(gsspAtoms.gssp);
    const setVariant = useSetRecoilState(usersDisplayAtoms.variant);
    const setUsers = useSetRecoilState(usersDisplayAtoms.users);
    const resetSearch = useResetRecoilState(usersDisplayAtoms.search);
    const resetFilter = useResetRecoilState(usersDisplayAtoms.filter);
    const filterUsers = useFilterUsers();
    useEffect(() => {
        if (variant === 'students') {
            if (gssp.body && gssp.body.students) {
                setUsers(gssp.body.students);
                filterUsers(gssp.body.students);
            }
        } else if (variant === 'teachers') {
            if (gssp.body && gssp.body.teachers) {
                setUsers(gssp.body.teachers);
                filterUsers(gssp.body.teachers);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [gssp]);
    useEffect(() => {
        setVariant(variant);
        resetSearch();
        resetFilter();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [variant]);
    // RENDER
    return (
        <div>
            <SearchBox />
            <Divider sx={{ my: 2 }} />
            <UserList />
        </div>
    );
}
