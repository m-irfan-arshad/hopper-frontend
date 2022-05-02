import React from "react";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { StaticDatePicker } from "@mui/x-date-pickers/StaticDatePicker";
import TextField from "@mui/material/TextField";

export default function StatDatePicker(props) {
  const { setProcedureDate, procedureDate } = props;

  return (
    <React.Fragment>
      <LocalizationProvider dateAdapter={AdapterMoment}>
        <StaticDatePicker
          displayStaticWrapperAs="desktop"
          value={procedureDate}
          renderInput={(params) => <TextField {...params} />}
          onChange={(newValue) => {
            setProcedureDate(newValue);
          }}
        />
      </LocalizationProvider>
    </React.Fragment>
  );
}
