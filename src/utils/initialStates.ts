import {
    User,
    UserRoles,
    Result,
    Quarter,
    Lesson,
    Video,
    Module,
    Worksheet,
    SubmittedWorksheet,
    Assessment,
    Modals,
} from 'src/interfaces';

interface InitialStates {
    user: User;
    userRoles: UserRoles;
    result: Result;
    modals: Modals;
    quarter: Quarter;
    lesson: Lesson;
    video: Video;
    module: Module;
    worksheet: Worksheet;
    submittedWorksheet: SubmittedWorksheet;
    assessment: Assessment;
}

const initialStates: InitialStates = {
    user: {
        uid: '',
        email: '',
        name: '',
        birthday: 0,
        gender: '',
        role: '',
        phone: '',
        fb: '',
        photoUrl: '',
        createdAt: 0,
        isBanned: false,
        isEmailVerified: false,
        isTeacherVerified: false,
        isEnrolled: false,
    },
    userRoles: {
        isAdmin: false,
        isTeacher: false,
        isStudent: false,
        isEditor: false,
    },
    result: {
        error: null,
        body: null,
    },
    modals: {
        creator: false,
        editor: false,
        deleter: false,
    },
    quarter: {
        id: '',
        number: '',
        title: '',
        color: '',
        createdAt: 0,
    },
    lesson: {
        id: '',
        quarterId: '',
        number: '',
        title: '',
        intro: '',
        color: '',
        createdAt: 0,
    },
    video: {
        id: '',
        quarterId: '',
        lessonId: '',
        src: '',
        number: '',
        createdAt: 0,
    },
    module: {
        id: '',
        quarterId: '',
        lessonId: '',
        fileName: '',
        downloadUrl: '',
        createdAt: 0,
    },
    worksheet: {
        id: '',
        quarterId: '',
        lessonId: '',
        fileName: '',
        points: 0,
        downloadUrl: '',
        createdAt: 0,
    },
    submittedWorksheet: {
        id: '',
        worksheetId: '',
        uid: '',
        fileName: '',
        score: 0,
        downloadUrl: '',
        createdAt: 0,
        isChecked: false,
    },
    assessment: {
        id: '',
        quarterId: '',
        lessonId: '',
        title: '',
        description: '',
        createdAt: 0,
    },
};

export default initialStates;
