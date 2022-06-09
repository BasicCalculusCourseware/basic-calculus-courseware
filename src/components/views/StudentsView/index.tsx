// TYPES
import type { User } from 'src/interfaces';
// LIB-FUNCTIONS
import { atom, useRecoilValue, useSetRecoilState } from 'recoil';
import _ from 'lodash';
// COMPONENTS
import StudentsView from './StudentsView';

// MAIN-COMPONENT
export default StudentsView;

/* STATES START */

// ATOMS
export type Filter = 'all' | 'enrolled' | 'not-enrolled';
export type OrderBy = 'name' | 'createdAt';
export type OrderDirection = 'asc' | 'desc';
const students = atom<User[]>({
    key: 'students' + Date.now(),
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
export const studentsViewAtoms = {
    students,
    filtered,
    search,
    filter,
    orderBy,
    orderDirection,
};

// HOOKS
export const useFilterStudents = () => {
    // RECOIL
    const students = useRecoilValue(studentsViewAtoms.students);
    const search = useRecoilValue(studentsViewAtoms.search);
    const filter = useRecoilValue(studentsViewAtoms.filter);
    const orderBy = useRecoilValue(studentsViewAtoms.orderBy);
    const orderDirection = useRecoilValue(studentsViewAtoms.orderDirection);
    const setFiltered = useSetRecoilState(studentsViewAtoms.filtered);
    // RETURN FUNCTION
    return (studentsParam: User[] = []) => {
        let filtered: User[] = [];
        filtered = studentsParam ? studentsParam : students;
        if (search) {
            filtered = students.filter(
                (student) => student.name.toUpperCase().indexOf(search.toUpperCase()) > -1
            );
        }
        filtered = _.orderBy(filtered, [orderBy], [orderDirection]);
        if (filter === 'enrolled')
            filtered = filtered.filter((student) => student.isEnrolled);
        else if (filter === 'not-enrolled')
            filtered = filtered.filter((student) => !student.isEnrolled);
        setFiltered(filtered);
    };
};

/* STATES END */
