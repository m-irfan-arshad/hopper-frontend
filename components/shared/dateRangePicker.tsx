import React, { useState } from "react";
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker, PickersDay } from '@mui/x-date-pickers';
import { TextField, styled, Box } from '@mui/material';
import moment from "moment";

interface Props {
    dateRangeStart: moment.Moment
    dateRangeEnd: moment.Moment
    setDateRangeStart: (value: moment.Moment) => void
    setDateRangeEnd: (value: moment.Moment) => void
}

/*TODO: try to make 2 calendars, the logic being you open the first one, pick a date and then close the first one
        then open the 2nd calendar with the date from the first one pre highlighted and then click a second one and 
        execute query; bonus if I can get the highlighting between the
*/

export default function DateRangePicker(props: Props) {
    const  { dateRangeStart, dateRangeEnd, setDateRangeStart, setDateRangeEnd } = props;
    const [isDateRangeEndCalendarOpen, setDateRangeEndCalendar] = useState(false);

    const StyledDay = styled(PickersDay, {
        shouldForwardProp: (prop) =>
          prop !== 'selected' 
      })(({ theme, selected }) => ({
        ...(selected && {
          backgroundColor: theme.palette.primary.main,
          color: theme.palette.common.white,
          '&:hover, &:focus': {
            backgroundColor: theme.palette.primary.dark,
          },
        }),
      }))

    const renderPickerDay = (
        date: moment.Moment,
        selectedDates: Array<moment.Moment | null>,
        pickersDayProps: any,
      ) => {
        const shouldHighlightDate = date.isSame(dateRangeStart) || date.isSame(dateRangeEnd);
    
        return (
          <StyledDay
            {...pickersDayProps}
            disableMargin
            selected={shouldHighlightDate}
          />
        );
      };

    const isBeforeStartDate = (date: moment.Moment) => {
        return dateRangeStart.isAfter(date);
    }

    return (
        <Box sx={{ display: "flex" }}>
            <LocalizationProvider dateAdapter={AdapterMoment}>
            <DatePicker
                value={dateRangeStart}
                onChange={(newValue: moment.Moment | null) => {
                    if (newValue) {
                        if (dateRangeEnd.isBefore(newValue)) {
                            setDateRangeEnd(newValue.startOf('day'));
                        }
                        setDateRangeStart(newValue.startOf('day'));
                        setDateRangeEndCalendar(true);
                    }
                }}
                renderInput={(params) => <TextField {...params} sx={{marginLeft: "200px"}} />}
            />
            <DatePicker
                value={dateRangeEnd}
                renderDay={renderPickerDay}
                open={isDateRangeEndCalendarOpen}
                shouldDisableDate={isBeforeStartDate}
                onChange={(newValue: moment.Moment | null) => {
                    if (newValue && newValue.isSameOrAfter(dateRangeStart)) {
                        setDateRangeEnd(newValue.startOf('day'));
                    }
                    setDateRangeEndCalendar(false);
                }}
                renderInput={(params) => <TextField {...params} sx={{marginLeft: "200px"}} />}
            />
            </LocalizationProvider>
        </Box>
      );
}
