// TYPES
import type { User } from 'src/interfaces';
// LIB-FUNCTIONS
import { atom, useRecoilValue, useSetRecoilState } from 'recoil';
import _ from 'lodash';
// COMPONENTS
import TeachersView from './TeachersView';

// MAIN-COMPONENT
export default TeachersView;

/* STATES START */

// ATOMS
export type Filter = 'all' | 'teacher-verified' | 'teacher-not-verified';
export type OrderBy = 'name' | 'createdAt';
export type OrderDirection = 'asc' | 'desc';
const teachers = atom<User[]>({
    key: 'teachers' + Date.now(),
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
export const teachersViewAtoms = {
    teachers,
    filtered,
    search,
    filter,
    orderBy,
    orderDirection,
};

// HOOKS
export const useFilterTeachers = () => {
    // RECOIL
    const teachers = useRecoilValue(teachersViewAtoms.teachers);
    const search = useRecoilValue(teachersViewAtoms.search);
    const filter = useRecoilValue(teachersViewAtoms.filter);
    const orderBy = useRecoilValue(teachersViewAtoms.orderBy);
    const orderDirection = useRecoilValue(teachersViewAtoms.orderDirection);
    const setFiltered = useSetRecoilState(teachersViewAtoms.filtered);
    // RETURN FUNCTION
    return (teachersParam: User[] = []) => {
        let filtered: User[] = [];
        filtered = teachersParam.length ? teachersParam : teachers;
        if (search) {
            filtered = teachers.filter(
                (teacher) => teacher.name.toUpperCase().indexOf(search.toUpperCase()) > -1
            );
        }
        filtered = _.orderBy(filtered, [orderBy], [orderDirection]);
        if (filter === 'teacher-verified')
            filtered = filtered.filter((teacher) => teacher.isTeacherVerified);
        else if (filter === 'teacher-not-verified')
            filtered = filtered.filter((teacher) => !teacher.isTeacherVerified);
        setFiltered(filtered);
    };
};

/* STATES END */
