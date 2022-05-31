export interface AuthToken {
    uid: string;
    role: string;
}
export interface User {
    uid: string;
    email: string;
    name: string;
    birthday: string;
    gender: string;
    role: string;
    phone: string;
    fb: string;
    photoUrl: string;
    createdAt: string;
    isEmailVerified: boolean;
    isTeacherVerified: boolean;
    isEnrolled: boolean;
    isBanned: boolean;
}
export interface UserRoles {
    isStudent: boolean;
    isTeacher: boolean;
    isAdmin: boolean;
    isEditor: boolean;
}
