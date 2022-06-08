// TYPES
import type { User } from 'src/interfaces';
// COMPONENTS
import TabList from './TabList';
import TabPanels from './TabPanels';
// CONTEXT
import { AccountDisplaySetter } from '.';

// MAIN-COMPONENT
interface Props {
    user: User;
    refreshUser: () => Promise<void>;
}
export default function AccountDisplay(props: Props) {
    return (
        <AccountDisplaySetter {...props}>
            <Container>
                <TabList />
                <TabPanels />
            </Container>
        </AccountDisplaySetter>
    );
}

// STYLES
import { styled } from '@mui/material';
import styles from 'src/utils/styles';
const Container = styled('div')(({ theme }) => ({
    ...styles.border(1),
    ...styles.borderRadius(1),
    display: 'flex',
    backgroundColor: 'white',
    [theme.breakpoints.down('md')]: {
        flexDirection: 'column',
    },
}));
