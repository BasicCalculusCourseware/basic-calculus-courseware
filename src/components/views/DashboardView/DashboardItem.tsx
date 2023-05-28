// LIB COMPONENTS
import { Typography } from '@mui/material';
import Link from 'next/link';
// COMPONENTS
import { IconButtonOutlined } from 'src/components/styled';
import { ForwardIcon } from 'src/components/icons';

// MAIN-COMPONENT
interface Props {
    label: string;
    value: number;
    href: string;
}
export default function DashboardItem(props: Props) {
    return (
        <Item>
            <ItemHeader>
                <Typography variant="h6">{props.label}</Typography>
            </ItemHeader>
            <ItemBody>
                <Typography variant="h2">{props.value}</Typography>
            </ItemBody>
            <ItemFooter>
                <Link href={props.href} passHref>
                    <IconButtonOutlined style={{ background: 'white' }}>
                        <ForwardIcon sx={{ fontSize: 18 }} />
                    </IconButtonOutlined>
                </Link>
            </ItemFooter>
        </Item>
    );
}

// STYLES
import { styled } from '@mui/material';
import styles from 'src/utils/styles';
export const Item = styled('div')({
    ...styles.border(1),
    ...styles.borderRadius(1),
    backgroundColor: 'white',
});
export const ItemHeader = styled('div')({
    ...styles.p(2),
    paddingBottom: 0,
});
export const ItemBody = styled('div')(({ theme }) => ({
    ...styles.p(2),
    '.MuiTypography-root': {
        color: theme.palette.primary.main,
        textAlign: 'center',
    },
}));
export const ItemFooter = styled('div')({
    ...styles.flexEndCenter,
    ...styles.borderTop(1),
    ...styles.p(1),
    position: 'relative',
    '&:before': {
        content: '""',
        position: 'absolute',
        left: 0,
        top: 0,
        width: '100%',
        height: '100%',
        backgroundImage: 'url(/images/bg-1.jpg)',
        backgroundSize: 'cover',
        opacity: 0.2,
    },
});
