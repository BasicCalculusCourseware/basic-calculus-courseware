export type { AuthToken, User, UserRoles } from './auth';
export type { SnackbarItem, SnackbarItemVariant } from './snackbar';
export type { ChildrenProp, GSSP } from './props';
export type {
    Quarter,
    Lesson,
    Bookmark,
    BookmarkItem,
    Video,
    Module,
    Worksheet,
    SubmittedWorksheet,
    Assessment,
    AssessmentItem,
    AssessmentItemChoice,
    AssessmentResult,
} from './content';

// OTHERS
export interface Result {
    error: null | string;
    body: any;
}
