// COMPONENTS
import ProfilePicturePanel from './ProfilePicturePanel';
import BasicInfoPanel from './BasicInfoPanel';
import ContactInfoPanel from './ContactInfoPanel';
import AccessInfoPanel from './AccessInfoPanel';
// CONTEXT
import { useAccountDisplayContext } from '../';

// MAIN-COMPONENT
export default function TabPanels() {
    // CONTEXT
    const { tab } = useAccountDisplayContext();
    // RENDER
    return (
        <Container>
            {tab === 1 && <ProfilePicturePanel />}
            {tab === 2 && <BasicInfoPanel />}
            {tab === 3 && <ContactInfoPanel />}
            {tab === 4 && <AccessInfoPanel />}
        </Container>
    );
}

// STYLES
import { styled } from '@mui/material';
import styles from 'src/utils/styles';
const Container = styled('div')({
    ...styles.p(2),
    width: '100%',
    minHeight: 397.25,
});
