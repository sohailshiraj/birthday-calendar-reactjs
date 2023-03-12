import PropTypes from 'prop-types';
import { Dayjs } from "dayjs";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { CalendarPicker } from '@mui/x-date-pickers/CalendarPicker';

function Calendar({date, onChange, ...props}: CalendarProps) {
    return (
        <>
            <h5>Select Date</h5>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <CalendarPicker
                    aria-label="date picker" 
                    date={date} 
                    onChange={(newDate) => {
                        onChange(newDate)
                    }} 
                />
            </LocalizationProvider>
        </>
    );
}

const propTypes = {
    date: PropTypes.instanceOf(Dayjs).isRequired,
    onChange: PropTypes.func.isRequired
}
type CalendarProps = PropTypes.InferProps<typeof propTypes>;

export default Calendar;