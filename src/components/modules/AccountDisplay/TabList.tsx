// LIB-COMPONENTS
import { Tooltip } from '@mui/material';
// COMPONENTS
import {
    ContactInfoIcon,
    ProfilePictureIcon,
    BasicInfoIcon,
    AccessInfoIcon,
} from 'src/components/icons';
// CONTEXT
import { useAccountDisplayContext } from '.';

// MAIN-COMPONENT
export default function TabList() {
    // CONTEXT
    const { tab, setTab } = useAccountDisplayContext();
    // STATES
    const items = [
        { index: 1, label: 'Profile Picture', icon: <ProfilePictureIcon /> },
        { index: 2, label: 'Basic Info', icon: <BasicInfoIcon /> },
        { index: 3, label: 'Contact Info', icon: <ContactInfoIcon /> },
        { index: 4, label: 'Access Info', icon: <AccessInfoIcon /> },
    ];
    // RENDER
    return (
        <Container>
            {items.map((item) => (
                <Item
                    key={item.index}
                    data-is-selected={tab === item.index}
                    onClick={() => setTab(item.index)}
                >
                    <Tooltip title={item.label}>
                        <ItemIcon className="item-icon">{item.icon}</ItemIcon>
                    </Tooltip>
                    <ItemLabel className="item-label">{item.label}</ItemLabel>
                </Item>
            ))}
        </Container>
    );
}

// STYLES
import { styled } from '@mui/material';
import styles from 'src/utils/styles';
const Container = styled('div')(({ theme }) => ({
    ...styles.borderRight(1),
    minWidth: 200,
    userSelect: 'none',
    [theme.breakpoints.down('md')]: {
        ...styles.flexStartCenter,
        ...styles.borderBottom(1),
        borderRight: 'none',
    },
}));
const Item = styled('div')(({ theme }) => ({
    ...styles.flexStartCenter,
    ...styles.px(2),
    minHeight: 50,
    '&:hover': {
        backgroundColor: styles.hoverColor,
        cursor: 'pointer',
    },
    '&[data-is-selected="true"]': {
        '.item-icon svg, .item-label': {
            color: theme.palette.primary.main,
        },
    },
    [theme.breakpoints.down('md')]: {
        ...styles.flexCenter,
    },
}));
const ItemLabel = styled('div')(({ theme }) => ({
    ...styles.flexStartCenter,
    color: theme.palette.secondary.main,
    [theme.breakpoints.down('md')]: {
        display: 'none',
    },
}));
const ItemIcon = styled('div')(({ theme }) => ({
    ...styles.flexStartCenter,
    minWidth: 35,
    color: theme.palette.secondary.main,
    [theme.breakpoints.down('md')]: {
        ...styles.flexCenter,
        minWidth: 'none',
    },
}));
