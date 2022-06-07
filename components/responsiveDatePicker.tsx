import React, { useState } from "react";
import moment from "moment";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import TextField from "@mui/material/TextField";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

export default function ResponsiveDatePicker() {
  const [value, setValue] = useState(moment());

  return (
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <DatePicker
        data-testid={"responsiveDatePicker"}
        desktopModeMediaQuery={"(min-width:600px)"} //i.e. at 600px it will swap over to 'mobile' calendar picker
        disableFuture
        label="Responsive"
        openTo="year"
        views={["year", "month", "day"]}
        value={value}
        onChange={(newValue) => {
          setValue(newValue);
        }}
        renderInput={(params) => <TextField {...params} />}
      />
    </LocalizationProvider>
  );
}
