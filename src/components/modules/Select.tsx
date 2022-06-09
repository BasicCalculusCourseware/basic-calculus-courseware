import { FormControl, InputLabel, MenuItem, Select as MuiSelect } from '@mui/material';

interface Item {
    value: any;
    label: string;
}

interface Props {
    label: string;
    value: any;
    items: Item[];
    required?: boolean;
    disabled?: boolean;
    setValue: (val: any) => void;
}

export default function Select({
    label,
    value,
    items,
    required,
    disabled,
    setValue,
}: Props) {
    return (
        <FormControl
            sx={{ textAlign: 'left' }}
            required={typeof required === 'undefined' ? false : required}
            fullWidth
        >
            <InputLabel>{label}</InputLabel>
            <MuiSelect
                label={label}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                required={typeof required === 'undefined' ? false : required}
                disabled={typeof disabled === 'undefined' ? false : disabled}
            >
                {items.map(({ value, label }) => (
                    <MenuItem key={value} value={value}>
                        {label}
                    </MenuItem>
                ))}
            </MuiSelect>
        </FormControl>
    );
}
