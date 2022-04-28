import React, { useState } from "react";
import moment from "moment";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateRangePicker } from "@mui/x-date-pickers-pro/DateRangePicker";

import PatientTable from "./patientTable";

export default function StatDatePicker() {
  const [value, setValue] = useState(moment());

  return (
    <React.Fragment>
      <LocalizationProvider dateAdapter={AdapterMoment}>
        <DateRangePicker
          displayStaticWrapperAs="desktop"
          value={value}
          onChange={(newValue) => {
            setValue(newValue);
          }}
        />
      </LocalizationProvider>
      <PatientTable date={value}></PatientTable>
    </React.Fragment>
  );
}
