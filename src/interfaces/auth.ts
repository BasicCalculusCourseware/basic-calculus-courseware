export interface AuthToken {
    uid: string;
    role: string;
}
export interface User {
    uid: string;
    email: string;
    name: string;
    birthday: number;
    gender: string;
    role: string;
    phone: string;
    fb: string;
    photoUrl: string;
    createdAt: number;
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
