// LIB COMPONENTS
import { Typography, IconButton } from '@mui/material';
import Link from 'next/link';
// COMPONENTS
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
                    <IconButton>
                        <ForwardIcon />
                    </IconButton>
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
});
