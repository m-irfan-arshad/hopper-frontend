import React, { useState } from "react";
import moment from "moment";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import TextField from "@mui/material/TextField";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { StaticDatePicker } from "@mui/x-date-pickers/StaticDatePicker";
import PatientTable from "./patientTable";

export default function StatDatePicker() {
  const [value, setValue] = useState(moment());

  return (
    <React.Fragment>
      <LocalizationProvider dateAdapter={AdapterMoment}>
        <StaticDatePicker
          displayStaticWrapperAs="desktop"
          value={value}
          onChange={(newValue) => {
            setValue(newValue);
          }}
          renderInput={(params) => <TextField {...params} />}
        />
      </LocalizationProvider>
      <PatientTable date={value}></PatientTable>
    </React.Fragment>
  );
}
