import { User, UserRoles, Result } from 'src/interfaces';

interface InitialStates {
    user: User;
    userRoles: UserRoles;
    result: Result;
}

const initialStates: InitialStates = {
    user: {
        uid: '',
        email: '',
        name: '',
        birthday: '',
        gender: '',
        role: '',
        phone: '',
        fb: '',
        photoUrl: '',
        createdAt: '',
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
};

export default initialStates;
