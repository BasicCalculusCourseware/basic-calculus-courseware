// TYPES
type Value = number | string;

// CONSTANTS
const SPACING = 8;
const SHAPING = 4;

// VARIABLES
const lineColor = '#e0e0e0';
const hoverColor = '#ebebeb';
const bgColor = '#f5f5f5';
const bgPattern = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='152' height='152' viewBox='0 0 152 152'%3E%3Cg fill-rule='evenodd'%3E%3Cg id='temple' fill='%23e0e0e0' fill-opacity='0.2'%3E%3Cpath d='M152 150v2H0v-2h28v-8H8v-20H0v-2h8V80h42v20h20v42H30v8h90v-8H80v-42h20V80h42v40h8V30h-8v40h-42V50H80V8h40V0h2v8h20v20h8V0h2v150zm-2 0v-28h-8v20h-20v8h28zM82 30v18h18V30H82zm20 18h20v20h18V30h-20V10H82v18h20v20zm0 2v18h18V50h-18zm20-22h18V10h-18v18zm-54 92v-18H50v18h18zm-20-18H28V82H10v38h20v20h38v-18H48v-20zm0-2V82H30v18h18zm-20 22H10v18h18v-18zm54 0v18h38v-20h20V82h-18v20h-20v20H82zm18-20H82v18h18v-18zm2-2h18V82h-18v18zm20 40v-18h18v18h-18zM30 0h-2v8H8v20H0v2h8v40h42V50h20V8H30V0zm20 48h18V30H50v18zm18-20H48v20H28v20H10V30h20V10h38v18zM30 50h18v18H30V50zm-2-40H10v18h18V10z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`;

// UTILS
const spacing = (val: Value) => (typeof val === 'number' ? val * SPACING + 'px' : val);
const shaping = (val: Value) => (typeof val === 'number' ? val * SHAPING + 'px' : val);

// STYLES
const styles = {
    // VARIABLES
    lineColor,
    hoverColor,
    bgColor,
    bgPattern,
    // UTILS
    spacing,
    shaping,
    // OBJECTS
    flexCenter: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    flexStartCenter: {
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    flexEndCenter: {
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    // FUNCTIONS
    m: (val: Value) => ({
        margin: spacing(val),
    }),
    mx: (val: Value) => ({
        marginLeft: spacing(val),
        marginRight: spacing(val),
    }),
    my: (val: Value) => ({
        marginTop: spacing(val),
        marginBottom: spacing(val),
    }),
    ml: (val: Value) => ({
        marginLeft: spacing(val),
    }),
    mt: (val: Value) => ({
        marginTop: spacing(val),
    }),
    mr: (val: Value) => ({
        marginRight: spacing(val),
    }),
    mb: (val: Value) => ({
        marginBottom: spacing(val),
    }),
    p: (val: Value) => ({
        padding: spacing(val),
    }),
    px: (val: Value) => ({
        paddingLeft: spacing(val),
        paddingRight: spacing(val),
    }),
    py: (val: Value) => ({
        paddingTop: spacing(val),
        paddingBottom: spacing(val),
    }),
    pl: (val: Value) => ({
        paddingLeft: spacing(val),
    }),
    pt: (val: Value) => ({
        paddingTop: spacing(val),
    }),
    pr: (val: Value) => ({
        paddingRight: spacing(val),
    }),
    pb: (val: Value) => ({
        paddingBottom: spacing(val),
    }),
    border: (val: Value) => ({
        border: `${val}px solid ${lineColor}`,
    }),
    borderLeft: (val: Value) => ({
        borderLeft: `${val}px solid ${lineColor}`,
    }),
    borderTop: (val: Value) => ({
        borderTop: `${val}px solid ${lineColor}`,
    }),
    borderRight: (val: Value) => ({
        borderRight: `${val}px solid ${lineColor}`,
    }),
    borderBottom: (val: Value) => ({
        borderBottom: `${val}px solid ${lineColor}`,
    }),
    borderRadius: (val: Value) => ({
        borderRadius: shaping(val),
    }),
    borderTopRadius: (val: Value) => ({
        borderTopLeftRadius: shaping(val),
        borderTopRightRadius: shaping(val),
    }),
    borderBottomRadius: (val: Value) => ({
        borderBottomLeftRadius: shaping(val),
        borderBottomRightRadius: shaping(val),
    }),
    // CUSTOM
    box: (val: Value) => ({
        width: val,
        height: val,
    }),
    scrollbar: (color: string) => ({
        '&::-webkit-scrollbar-track': {
            boxShadow: 'inset 0 0 6px rgba(0, 0, 0, 0.1)',
            backgroundColor: 'white',
            borderRadius: 10,
        },
        '&::-webkit-scrollbar': {
            width: 8,
            backgroundColor: 'white',
        },
        '&::-webkit-scrollbar-thumb': {
            borderRadius: 10,
            boxShadow: 'inset 0 0 6px rgba(0, 0, 0, 0.1)',
            backgroundColor: color,
        },
    }),
};
export default styles;
