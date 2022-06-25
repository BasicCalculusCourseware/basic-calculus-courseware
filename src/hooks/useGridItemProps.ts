// LIB-TYPES
import type { GridSize } from '@mui/material';
// LIB-FUNCTIONS
import { useMemo } from 'react';
// RECOIL
import { useRecoilValue } from 'recoil';
import { sidebarAtoms } from 'src/states/sidebar';

// MAIN-HOOK
const useGridItemProps = () => {
    const isSidebarOpen = useRecoilValue(sidebarAtoms.isSidebarOpen);
    const gridItemProps = useMemo(() => {
        const xs: GridSize = 12;
        const sm: GridSize = 6;
        const md: GridSize = isSidebarOpen ? 6 : 4;
        const lg: GridSize = isSidebarOpen ? 4 : 3;
        return { item: true, xs, sm, md, lg };
    }, [isSidebarOpen]);
    return () => gridItemProps;
};
export default useGridItemProps;
