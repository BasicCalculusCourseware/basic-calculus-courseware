// TYPES
import type { User } from 'src/interfaces';
// LIB-FUNCTIONS
import {
    atom,
    useRecoilValue,
    useSetRecoilState,
    useResetRecoilState,
} from 'recoil';
import _ from 'lodash';
// COMPONENTS
import UsersDisplay from './UsersDisplay';

// MAIN-COMPONENT
export default UsersDisplay;

/* STATES START */

// ATOMS
export type Filter =
    | 'all'
    | 'enrolled'
    | 'not-enrolled'
    | 'teacher-verified'
    | 'teacher-not-verified'
    | 'email-verified'
    | 'email-not-verified'
    | 'banned'
    | 'not-banned';
export type OrderBy = 'name' | 'createdAt';
export type OrderDirection = 'asc' | 'desc';
const variant = atom<string>({
    key: 'variant' + Date.now(),
    default: '',
});
const users = atom<User[]>({
    key: 'users' + Date.now(),
    default: [],
});
const filtered = atom<User[]>({
    key: 'filtered' + Date.now(),
    default: [],
});
const search = atom<string>({
    key: 'search' + Date.now(),
    default: '',
});
const filter = atom<Filter>({
    key: 'filter' + Date.now(),
    default: 'all',
});
const orderBy = atom<OrderBy>({
    key: 'orderBy' + Date.now(),
    default: 'name',
});
const orderDirection = atom<OrderDirection>({
    key: 'orderDirection' + Date.now(),
    default: 'asc',
});
export const usersDisplayAtoms = {
    variant,
    users,
    filtered,
    search,
    filter,
    orderBy,
    orderDirection,
};

// HOOKS
export const useResetAll = () => {
    // RECOIL
    const resetUsers = useResetRecoilState(usersDisplayAtoms.users);
    const resetFiltered = useResetRecoilState(usersDisplayAtoms.filtered);
    const resetSearch = useResetRecoilState(usersDisplayAtoms.search);
    const resetFilter = useResetRecoilState(usersDisplayAtoms.filter);
    // RETURN FUNCTION
    return () => {
        resetUsers();
        resetFiltered();
        resetSearch();
        resetFilter();
    };
};
export const useFilterUsers = () => {
    // RECOIL
    const variant = useRecoilValue(usersDisplayAtoms.variant);
    const users = useRecoilValue(usersDisplayAtoms.users);
    const search = useRecoilValue(usersDisplayAtoms.search);
    const filter = useRecoilValue(usersDisplayAtoms.filter);
    const orderBy = useRecoilValue(usersDisplayAtoms.orderBy);
    const orderDirection = useRecoilValue(usersDisplayAtoms.orderDirection);
    const setFiltered = useSetRecoilState(usersDisplayAtoms.filtered);
    // RETURN FUNCTION
    return (usersParam: User[] = []) => {
        let filtered: User[] = [];
        filtered = usersParam.length ? usersParam : users;
        if (search) {
            filtered = users.filter(
                (user) =>
                    user.name.toUpperCase().indexOf(search.toUpperCase()) > -1
            );
        }
        if (variant === 'students') {
            if (filter === 'enrolled')
                filtered = filtered.filter((user) => user.isEnrolled);
            else if (filter === 'not-enrolled')
                filtered = filtered.filter((user) => !user.isEnrolled);
        } else if (variant === 'teachers') {
            if (filter === 'teacher-verified')
                filtered = filtered.filter((user) => user.isTeacherVerified);
            else if (filter === 'teacher-not-verified')
                filtered = filtered.filter((user) => !user.isTeacherVerified);
        }
        if (filter === 'email-verified')
            filtered = filtered.filter((user) => user.isEmailVerified);
        else if (filter === 'email-not-verified')
            filtered = filtered.filter((user) => !user.isEmailVerified);
        else if (filter === 'banned')
            filtered = filtered.filter((user) => user.isBanned);
        else if (filter === 'not-banned')
            filtered = filtered.filter((user) => !user.isBanned);
        filtered = _.orderBy(filtered, [orderBy], [orderDirection]);
        setFiltered(filtered);
    };
};

/* STATES END */
