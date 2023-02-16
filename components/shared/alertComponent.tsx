import React, { useState, useEffect, useContext } from "react";
import { Alert, AlertColor, Fade } from "@mui/material";
import {AlertContext} from "../../pages/_app.page"

export default function AlertComponent() {
  const [alertState, setAlertState] = useContext(AlertContext);

  useEffect(() => {
    const timeId = setTimeout(() => {
      setAlertState({open: false, status: alertState.status, title: alertState.title})
    }, 5000)

    return () => {
      clearTimeout(timeId)
    }
  }, [alertState.open]);

  return (
    <Fade in={alertState.open}>
      <Alert sx={{position: 'fixed', bottom: 50, right: 50, zIndex: 10000, boxShadow: 1}}severity={alertState.status ? alertState.status : 'error'} onClose={() => setAlertState({open: false, status: alertState.status, title: alertState.title})}>{alertState.title}</Alert>
    </Fade>
  );
}
