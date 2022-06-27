// LIB COMPONENTS
import { Skeleton } from '@mui/material';

export default function SkeletonItem() {
    return (
        <Item>
            <ItemBody>
                <ItemIcon>
                    <Skeleton variant="circular" width={40} height={40} />
                </ItemIcon>
                <ItemText>
                    <Skeleton variant="text" width="50%" height={25} />
                </ItemText>
                <Skeleton variant="text" width={25} height={25} />
            </ItemBody>
        </Item>
    );
}

// STYLES
import { styled } from '@mui/material';
import { styles } from 'src/utils';
const Item = styled('div')({
    ...styles.flexStartCenter,
    ...styles.borderBottom(1),
    ...styles.pr(1),
    overflow: 'hidden',
    '&:last-child': {
        border: 'none',
    },
});
const ItemBody = styled('div')({
    ...styles.flexStartCenter,
    ...styles.p(1),
    ...styles.pl(1.5),
    ...styles.pr(0.5),
    width: 'calc(100% - 40px)',
    height: 55,
    overflow: 'hidden',
    cursor: 'pointer',
});
const ItemStatus = styled('div')({
    ...styles.flexStartCenter,
    ...styles.mr(1),
});
const ItemIcon = styled('div')({
    ...styles.flexStartCenter,
    ...styles.mr(1),
});
const ItemText = styled('div')({
    ...styles.flexStartCenter,
    flexGrow: 1,
});
