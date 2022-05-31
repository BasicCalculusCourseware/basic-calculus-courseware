export type SnackbarItemVariant = 'success' | 'error' | 'warning' | 'info';
export interface SnackbarItem {
    id: number;
    message: string;
    variant: SnackbarItemVariant;
}
