// LIB FUNCTIONS
import { atom, useSetRecoilState, useRecoilState } from 'recoil';

// ATOMS
const isSidebarOpen = atom<boolean>({
    key: 'isSidebarOpen' + Date.now(),
    default: false,
});
const isSidebarInitialized = atom<boolean>({
    key: 'isSidebarInitialized' + Date.now(),
    default: false,
});
export const sidebarAtoms = { isSidebarOpen, isSidebarInitialized };

// HOOKS
export const useOpenSidebar = () => {
    const setIsSidebarOpen = useSetRecoilState(sidebarAtoms.isSidebarOpen);
    return () => setIsSidebarOpen(true);
};
export const useCloseSidebar = () => {
    const setIsSidebarOpen = useSetRecoilState(sidebarAtoms.isSidebarOpen);
    return () => setIsSidebarOpen(false);
};
export const useToggleSidebar = () => {
    const setIsSidebarOpen = useSetRecoilState(sidebarAtoms.isSidebarOpen);
    return () => setIsSidebarOpen((isSidebarOpen) => !isSidebarOpen);
};
export const useInitializeSidebar = () => {
    const setIsSidebarOpen = useSetRecoilState(sidebarAtoms.isSidebarOpen);
    const [isSidebarInitialized, setIsSidebarInitialized] = useRecoilState(
        sidebarAtoms.isSidebarInitialized
    );
    const openSidebar = useOpenSidebar();
    return () => {
        if (isSidebarInitialized) return;
        if (window.innerWidth > 900) openSidebar();
        setIsSidebarOpen(JSON.parse(localStorage.getItem('sidebar:isOpen') || 'false'));
        setIsSidebarInitialized(true);
    };
};
