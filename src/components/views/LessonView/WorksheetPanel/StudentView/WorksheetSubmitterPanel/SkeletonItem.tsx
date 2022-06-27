// LIB COMPONENTS
import { Skeleton } from '@mui/material';

export default function SkeletonItem() {
    return (
        <Item>
            <ItemBody>
                <ItemStatus>
                    <Skeleton variant="circular" width={10} height={10} />
                </ItemStatus>
                <ItemIcon>
                    <Skeleton variant="rectangular" width={25} height={25} />
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
    ...styles.border(1),
    ...styles.pr(1),
    overflow: 'hidden',
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
