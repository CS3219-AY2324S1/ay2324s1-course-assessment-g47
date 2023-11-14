import * as React from 'react';
import dayjs from 'dayjs';
import Badge from '@mui/material/Badge';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { PickersDay } from '@mui/x-date-pickers/PickersDay';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { FaCheckCircle } from 'react-icons/fa';

function ServerDay(props) {
  const { highlightedDays = [], day, outsideCurrentMonth, ...other } = props;

  const isSelected = highlightedDays.some(highlightDay =>
    dayjs(highlightDay).isSame(day, 'day') && !outsideCurrentMonth);

  return (
    <Badge
      key={day.toString()}
      overlap="circular"
      badgeContent={isSelected ? <FaCheckCircle style={{ color: "green" }} /> : undefined}
    >
      <PickersDay {...other} outsideCurrentMonth={outsideCurrentMonth} day={day} />
    </Badge>
  );
}

export default function DateCalendarServerRequest({ timestamps }) {
  const [selectedDate, setSelectedDate] = React.useState(dayjs()); // controlled state
  const [highlightedDays, setHighlightedDays] = React.useState([]);

  React.useEffect(() => {
    setHighlightedDays(timestamps);
  }, [timestamps]);

  const handleMonthChange = (newMonthDate) => {
    // Filter the timestamps to include only those in the new month
    const filteredTimestamps = timestamps.filter(timestamp =>
      dayjs(timestamp).isSame(newMonthDate, 'month')
    );

    // Update the highlighted days based on the filtered timestamps
    setHighlightedDays(filteredTimestamps);
    setSelectedDate(newMonthDate);
  };

  return (
    <div style={{ maxWidth: '100%', overflow: 'auto' }}>
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DateCalendar
        value={selectedDate} // controlled value
        onChange={setSelectedDate} // handle date change
        defaultValue={dayjs()} // Sets today's date as default
        onMonthChange={handleMonthChange}
        slots={{
          day: ServerDay,
        }}
        slotProps={{
          day: {
            highlightedDays,
          },
        }}
      />
    </LocalizationProvider>
    </div>
  );
}
