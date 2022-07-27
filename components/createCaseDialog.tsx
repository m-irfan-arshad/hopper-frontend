import React, { useState } from "react";
import { Add, DateRange as DateRangeIcon } from "@mui/icons-material";
import { 
    Typography, 
    Grid, 
    Button, 
    TextField, 
    Dialog, 
    DialogActions, 
    DialogContent, 
    DialogTitle 
} from '@mui/material';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import moment from "moment";


interface Props {
    open: boolean
    handleClose: () => void
}

export default function CreateCaseDialog(props: Props) {
  const {open, handleClose} = props;
  const [dateOfBirth, setDateOfBirth] = useState<moment.Moment | null>(null);
  const [procedureDate, setProcedureDate] = useState<moment.Moment | null>(null);

  const handleDateOfBirthChange = (newValue: moment.Moment | null) => {
    setDateOfBirth(newValue);
  };

  const handleProcedureDateChange = (newValue: moment.Moment | null) => {
    setProcedureDate(newValue);
  };

  return (
      <Dialog fullWidth open={open} onClose={handleClose} maxWidth="sm" sx={{ "& .MuiPaper-root": { borderRadius: "0.625rem" }}}>
        <DialogTitle 
            sx={{
                backgroundColor: "blue.dark", 
                color: "white.main",
                fontSize: "1rem",
                fontWeight: "400" 
            }}>
                Create Case
        </DialogTitle>
        <DialogContent>
            <LocalizationProvider dateAdapter={AdapterMoment}>
                <Typography variant="h3" sx={{marginTop: "3rem", marginBottom: "1.25rem"}}>Patient Information</Typography>
                <Grid container spacing={"2.5rem"}>
                    <Grid item xs={6}>
                        <Typography variant="body2" color="gray.main">First Name</Typography>
                        <TextField variant="outlined" placeholder="First Name" />
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="body2" color="gray.main">Last Name</Typography>
                        <TextField variant="outlined" placeholder="Last Name" />
                    </Grid>
                    <Grid item xs={6}>
                    <Typography variant="body2" color="gray.main">Patient Date of Birth</Typography>
                        <DesktopDatePicker
                            components={{ OpenPickerIcon: DateRangeIcon }}
                            value={dateOfBirth}
                            onChange={handleDateOfBirthChange}
                            renderInput={({inputProps, ...restParams}) => (
                                <TextField 
                                    inputProps={{
                                        ...inputProps, 
                                        placeholder: "Patient Date of Birth",
                                    }} 
                                    sx={{
                                        svg: { 
                                            color: "blue.main",
                                            height: "0.75rem",
                                            width: "0.75rem"
                                        }
                                    }} 
                                    {...restParams} 
                                />
                            )}
                        />
                    </Grid>
                </Grid>
                <Typography variant="h3" sx={{marginTop: "3rem", marginBottom: "1.25rem"}}>Procedure Information</Typography>
                <Grid container spacing={"2.5rem"}>
                    <Grid item xs={6}>
                        <Typography variant="body2" color="gray.main">Primary Surgeon</Typography>
                        <TextField variant="outlined" placeholder="Primary Surgeon" />
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="body2" color="gray.main">Surgical Location</Typography>
                        <TextField variant="outlined" placeholder="Surgical Location" />
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="body2" color="gray.main">Procedure Unit</Typography>
                        <TextField variant="outlined" placeholder="Procedure Unit" />
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="body2" color="gray.main">Service Line</Typography>
                        <TextField variant="outlined" placeholder="Service Line" />
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="body2" color="gray.main">Procedure Date</Typography>
                        <DesktopDatePicker
                            components={{ OpenPickerIcon: DateRangeIcon }}
                            value={procedureDate}
                            onChange={handleProcedureDateChange}
                            renderInput={({inputProps, ...restParams}) => (
                                <TextField 
                                    inputProps={{
                                        ...inputProps, 
                                        placeholder: "Procedure Date"
                                    }} 
                                    sx={{
                                        svg: { 
                                            color: "blue.main", 
                                            height: "0.75rem",
                                            width: "0.75rem" 
                                        }
                                    }} 
                                    {...restParams} 
                                />
                            )}
                        />
                    </Grid>
                </Grid>
            </LocalizationProvider>
        </DialogContent>
        <DialogActions sx={{display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "0.063rem solid", padding: "0.625rem", borderColor: "blue.light"}}>
          <Button 
            onClick={handleClose}
            sx={{ color: "blue.main", padding: "0.625rem"}}
          >
                Cancel
          </Button>
          <Button 
            variant="contained" 
            startIcon={<Add />}
            sx={{
                backgroundColor: "green.main",
                border: 1,
                borderColor: "green.dark",
                marginRight: "1.75rem",
            }}>
                Create Case
            </Button>
        </DialogActions>
      </Dialog>
  );
}
