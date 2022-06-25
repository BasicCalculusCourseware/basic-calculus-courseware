// TYPES
import type {
    Quarter,
    Lesson,
    Video,
    Module,
    Worksheet,
    Assessment,
} from 'src/interfaces';
// LIB-FUNCTIONS
import { atom, useSetRecoilState, useRecoilValue } from 'recoil';
// FUNCTIONS
import { getAllVideos } from 'src/firebase/client/utils/video';
import { getAllModules } from 'src/firebase/client/utils/module';
import { getAllWorksheets } from 'src/firebase/client/utils/worksheet';
import { getAllAssessments } from 'src/firebase/client/utils/assessment';
import initialStates from 'src/utils/initialStates';
// COMPONENTS
import LessonView from './LessonView';

// MAIN-COMPONENT
export default LessonView;

/* STATES START */

// ATOMS
const tab = atom<number>({
    key: 'tab' + Date.now(),
    default: 0,
});
const quarter = atom<Quarter>({
    key: 'quarter' + Date.now(),
    default: initialStates.quarter,
});
const lesson = atom<Lesson>({
    key: 'lesson' + Date.now(),
    default: initialStates.lesson,
});
const videos = atom<Video[]>({
    key: 'videos' + Date.now(),
    default: [],
});
const modules = atom<Module[]>({
    key: 'modules' + Date.now(),
    default: [],
});
const worksheets = atom<Worksheet[]>({
    key: 'worksheets' + Date.now(),
    default: [],
});
const assessments = atom<Assessment[]>({
    key: 'assessments' + Date.now(),
    default: [],
});
export const lessonViewAtoms = {
    tab,
    quarter,
    lesson,
    videos,
    modules,
    worksheets,
    assessments,
};

// HOOOKS
export const useRefreshVideos = () => {
    const quarter = useRecoilValue(lessonViewAtoms.quarter);
    const lesson = useRecoilValue(lessonViewAtoms.lesson);
    const setVideos = useSetRecoilState(lessonViewAtoms.videos);
    return async () => {
        const videos = await getAllVideos(quarter.id, lesson.id);
        setVideos(videos);
    };
};
export const useRefreshModules = () => {
    const quarter = useRecoilValue(lessonViewAtoms.quarter);
    const lesson = useRecoilValue(lessonViewAtoms.lesson);
    const setModules = useSetRecoilState(lessonViewAtoms.modules);
    return async () => {
        const modules = await getAllModules(quarter.id, lesson.id);
        setModules(modules);
    };
};
export const useRefreshWorksheets = () => {
    const quarter = useRecoilValue(lessonViewAtoms.quarter);
    const lesson = useRecoilValue(lessonViewAtoms.lesson);
    const setWorksheets = useSetRecoilState(lessonViewAtoms.worksheets);
    return async () => {
        const worksheets = await getAllWorksheets(quarter.id, lesson.id);
        setWorksheets(worksheets);
    };
};
export const useRefreshAssessments = () => {
    const quarter = useRecoilValue(lessonViewAtoms.quarter);
    const lesson = useRecoilValue(lessonViewAtoms.lesson);
    const setAssessments = useSetRecoilState(lessonViewAtoms.assessments);
    return async () => {
        const assessments = await getAllAssessments(quarter.id, lesson.id);
        setAssessments(assessments);
    };
};

/* STATES END */
