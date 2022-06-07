// LIB FUNCTIONS
import { useRouter } from 'next/router';
// LIB COMPONENTS
import { Typography, Tooltip } from '@mui/material';
// RECOIL
import { useRecoilValue } from 'recoil';
import { pageAtoms } from 'src/states/page';
import { useCloseSidebar } from 'src/states/sidebar';

// MAIN-COMPONENT
interface Props {
    icon: JSX.Element;
    label: string;
    link: string;
    base: string;
}
export default function SidebarMenuItem(props: Props) {
    // ROUTER
    const router = useRouter();
    // RECOIL
    const pageBase = useRecoilValue(pageAtoms.pageBase);
    const closeSidebar = useCloseSidebar();
    // STATES
    const isCurrentPage = pageBase === props.base;
    // UTILS
    async function handleClick() {
        await router.push(props.link);
        if (window.innerWidth < 900) closeSidebar();
    }
    // RENDER
    return (
        <Item data-is-current-page={isCurrentPage} onClick={handleClick}>
            <Tooltip title={props.label} placement="right">
                <ItemIcon>{props.icon}</ItemIcon>
            </Tooltip>
            <ItemLabel variant="h6">{props.label}</ItemLabel>
        </Item>
    );
}

// STYLES
import { styled } from '@mui/material';
import styles from 'src/utils/styles';
const Item = styled('div')(({ theme }) => ({
    ...styles.flexStartCenter,
    width: 300,
    height: 50,
    userSelect: 'none',
    cursor: 'pointer',
    '&:hover': {
        backgroundColor: styles.hoverColor,
    },
    "&[data-is-current-page='true']": {
        backgroundColor: theme.palette.primary.light,
        svg: {
            color: theme.palette.primary.dark,
        },
    },
}));
const ItemIcon = styled('div')(({ theme }) => ({
    ...styles.flexCenter,
    width: 70,
    color: theme.palette.secondary.main,
}));
const ItemLabel = styled(Typography)(({ theme }) => ({
    fontSize: 16,
    color: theme.palette.secondary.main,
}));
