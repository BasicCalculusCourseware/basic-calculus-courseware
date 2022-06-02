import { DatePicker as MuiDatePicker, LocalizationProvider } from '@mui/lab';
import { TextField } from '@mui/material';
import AdapterDateFns from '@mui/lab/AdapterDateFns';

interface Props {
    label: string;
    value: string;
    required?: boolean;
    setValue: (val: string) => void;
}

export default function DatePicker({
    label,
    value,
    required,
    setValue,
}: Props) {
    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <MuiDatePicker
                label={label}
                value={value}
                onChange={(val) => {
                    setValue(val ? val : '');
                }}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        fullWidth
                        error={false}
                        required={
                            typeof required === 'undefined' ? false : required
                        }
                    />
                )}
            />
        </LocalizationProvider>
    );
}
