// TYPES
import type { ContentColor } from 'src/utils';
// FUNCTIONS
import { contentColorKeys, contentColorObject } from 'src/utils';
// LIB-COMPONENTS
import { Typography } from '@mui/material';
import Link from 'next/link';

// MAIN-COMPONENT
interface Props {
    color: string;
    heading: string;
    tool?: JSX.Element;
    body: string;
    href: string;
}
export default function ContentItem({
    color,
    heading,
    tool,
    body,
    href,
}: Props) {
    // UTILS
    const getBGColor = () =>
        contentColorKeys.includes(color as ContentColor)
            ? contentColorObject[color as ContentColor]
            : 'white';
    const getTextColor = () =>
        color === 'yellow' || color === 'white' ? '#333' : 'white';
    // RENDER
    return (
        <Item>
            <ItemHeader sx={{ bgcolor: getBGColor() }}>
                <ItemHeading sx={{ color: getTextColor() }}>
                    {heading}
                </ItemHeading>
                {tool && tool}
            </ItemHeader>
            <Link href={href}>
                <ItemBody>{body}</ItemBody>
            </Link>
        </Item>
    );
}

// STYLES
import { styled } from '@mui/material';
import { styles } from 'src/utils';
export const Item = styled('div')(({ theme }) => ({
    ...styles.borderRadius(1),
    height: 250,
    backgroundColor: 'white',
    overflow: 'hidden',
    boxShadow: theme.shadows[5],
}));
export const ItemHeader = styled('div')({
    ...styles.flexStartCenter,
    ...styles.pl(2),
    ...styles.pr(1),
    height: 50,
});
export const ItemHeading = styled(Typography)({
    flexGrow: 1,
});
export const ItemBody = styled('div')({
    ...styles.flexCenter,
    ...styles.p(2),
    minHeight: 200,
    textAlign: 'center',
    cursor: 'pointer',
    position: 'relative',
    backgroundColor: 'white',
    '&:hover': {
        backgroundColor: styles.hoverColor,
    },
    '&:before': {
        content: '""',
        position: 'absolute',
        left: 0,
        top: 0,
        width: '100%',
        height: '100%',
        backgroundImage: 'url(/images/bg-2.jpg)',
        backgroundSize: 'cover',
        opacity: 0.3,
    },
});
