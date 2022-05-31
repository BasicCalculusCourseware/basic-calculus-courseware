export type { AuthToken, User, UserRoles } from './auth';
export type { SnackbarItem, SnackbarItemVariant } from './snackbar';
export type { ChildrenProp, GSSP } from './props';

// OTHERS
export interface Result {
    error: null | string;
    body: any;
}
