import { User, UserRoles, Result, Quarter, Lesson } from 'src/interfaces';

interface InitialStates {
    user: User;
    userRoles: UserRoles;
    result: Result;
    quarter: Quarter;
    lesson: Lesson;
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
};

export default initialStates;
