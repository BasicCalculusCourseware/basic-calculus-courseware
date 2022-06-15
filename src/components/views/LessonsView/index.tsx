// TYPES
import type { Quarter, Lesson } from 'src/interfaces';
// LIB-FUNCTIONS
import { atom, useSetRecoilState } from 'recoil';
import { useRouter } from 'next/router';
// FUNCTIONS
import { getAllLessons } from 'src/firebase/client/utils/lesson';
import initialState from 'src/utils/initialStates';
// COMPONENTS
import LessonsView from './LessonsView';

// MAIN-COMPONENT
export default LessonsView;

/* STATES START */

// ATOM TYPES
interface Modals {
    creator: boolean;
    editor: boolean;
    deleter: boolean;
}

// ATOMS
const quarter = atom<Quarter>({
    key: 'quarter' + Date.now(),
    default: initialState.quarter,
});
const lessons = atom<Lesson[]>({
    key: 'lessons' + Date.now(),
    default: [],
});
const selected = atom<Lesson>({
    key: 'selected' + Date.now(),
    default: initialState.lesson,
});
const modals = atom<Modals>({
    key: 'modals' + Date.now(),
    default: {
        creator: false,
        editor: false,
        deleter: false,
    },
});
export const lessonsViewAtoms = { quarter, lessons, selected, modals };

// HOOKS
export const useRefreshLessons = () => {
    const router = useRouter();
    const { qid } = router.query as any;
    const setLessons = useSetRecoilState(lessonsViewAtoms.lessons);
    return async () => {
        const lessons = await getAllLessons(qid);
        setLessons(lessons);
    };
};
export const useSetModal = () => {
    const setModals = useSetRecoilState(lessonsViewAtoms.modals);
    return (data: Partial<Modals>) => {
        setModals((modals) => ({ ...modals, ...data }));
    };
};

/* STATES END */
