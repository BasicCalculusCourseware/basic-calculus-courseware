import { DatePicker as MuiDatePicker, LocalizationProvider } from '@mui/lab';
import { TextField } from '@mui/material';
import AdapterDateFns from '@mui/lab/AdapterDateFns';

interface Props {
    label: string;
    value: string | number;
    required?: boolean;
    setValue: (val: string | number) => void;
}

export default function DatePicker({ label, value, required, setValue }: Props) {
    const handleSetValue = (val: any) => {
        if (typeof value === 'string') setValue(val ? val : '');
        else if (typeof value === 'number') setValue(val ? new Date(val).getTime() : 0);
    };
    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <MuiDatePicker
                label={label}
                value={value}
                onChange={handleSetValue}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        fullWidth
                        error={false}
                        required={typeof required === 'undefined' ? false : required}
                    />
                )}
            />
        </LocalizationProvider>
    );
}
