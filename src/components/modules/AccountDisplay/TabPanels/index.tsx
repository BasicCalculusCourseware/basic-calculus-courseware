// LIB-FUNCTIONS
import { styled } from '@mui/material';
// FUNCTIONS
import styles from 'src/utils/styles';
// COMPONENTS
import TabPanels from './TabPanels';

// MAIN-COMPONENT
export default TabPanels;

/* STYLES START */

export const TabHeader = styled('div')({
    ...styles.mb(2),
});
export const TabBody = styled('div')({
    minHeight: 275,
});
export const TabFooter = styled('div')({
    ...styles.flexEndCenter,
    ...styles.pt(2),
    '.MuiButton-root': {
        ...styles.mr(1),
    },
    '.MuiLoadingButton-root': {
        ...styles.mr(0),
    },
});

/* STYLES END */
