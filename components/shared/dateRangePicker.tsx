import React from "react";
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker, PickersDay } from '@mui/x-date-pickers';
import { TextField, styled, Box } from '@mui/material';
import moment from "moment";

interface Props {
    dateRangeStart: moment.Moment
    dateRangeEnd: moment.Moment | null
    isDateRangeStartCalendarOpen: boolean
    isDateRangeEndCalendarOpen: boolean
    setDateRangeEndCalendarStatus: (value: boolean) => void
    setDateRangeStartCalendarStatus: (value: boolean) => void
    setDateRangeStart: (value: moment.Moment) => void
    setDateRangeEnd: (value: moment.Moment | null) => void
}

export default function DateRangePicker(props: Props) {
    const { 
      dateRangeStart, 
      dateRangeEnd, 
      setDateRangeStart, 
      setDateRangeEnd, 
      isDateRangeStartCalendarOpen, 
      isDateRangeEndCalendarOpen, 
      setDateRangeStartCalendarStatus, 
      setDateRangeEndCalendarStatus 
    } = props;

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

    function handleDateRangeStartOpen() {
      setDateRangeStartCalendarStatus(true);
      setDateRangeEndCalendarStatus(false);
    }

    function handleDateRangeStartClose() {
      setDateRangeStartCalendarStatus(false);
      setDateRangeEndCalendarStatus(true);
    }

    return (
        <Box sx={{ display: "flex" }}>
            <LocalizationProvider dateAdapter={AdapterMoment}>
            <Box>
              <DatePicker
                  label="Date Range Start"
                  value={dateRangeStart}
                  onChange={(newValue: moment.Moment | null) => {
                      if (newValue && newValue.isValid()) {
                          setDateRangeEnd(null);
                          setDateRangeStart(newValue.startOf('day'));
                      }
                  }}
                  open={isDateRangeStartCalendarOpen}
                  onOpen={() => handleDateRangeStartOpen()}
                  onClose={() => handleDateRangeStartClose()}
                  renderInput={(params) => <TextField {...params} sx={{
                    "& .MuiOutlinedInput-input": {
                      paddingTop: 0,
                      paddingBottom: 0,
                      height: "2.5rem"
                    },
                    "& .MuiInputLabel-root:not(.MuiInputLabel-shrink)": {
                      fontSize: "0.875rem",
                      top: "-0.375rem",
                    },
                    width: "10rem"
                  }} 
                />}
              />
            </Box>
            <Box>
              <DatePicker
                  label="Date Range End"
                  value={dateRangeEnd}
                  renderDay={renderPickerDay}
                  open={isDateRangeEndCalendarOpen}
                  shouldDisableDate={isBeforeStartDate}
                  onChange={(newValue: moment.Moment | null) => {
                      if (newValue && newValue.isSameOrAfter(dateRangeStart)) {
                          setDateRangeEnd(newValue.endOf('day'));
                      }
                      setDateRangeEndCalendarStatus(false);
                  }}
                  renderInput={(params) => <TextField {...params} sx={{
                    "& .MuiOutlinedInput-input": {
                      paddingTop: 0,
                      paddingBottom: 0,
                      height: "2.5rem"
                    },
                    "& .MuiInputLabel-root:not(& .MuiInputLabel-shrink)": {
                      fontSize: "0.875rem",
                      top: "-0.375rem",
                    },
                    width: "10rem",
                    marginLeft: "0.625rem"
                  }} 
                />}
              />
            </Box>
            </LocalizationProvider>
        </Box>
      );
}
