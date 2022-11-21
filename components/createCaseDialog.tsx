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
    DialogTitle,
    InputLabel,
    styled
} from '@mui/material';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import moment from "moment";
import { useForm, Controller } from "react-hook-form";


interface Props {
    open: boolean
    closeDialog: () => void
}

export default function CreateCaseDialog(props: Props) {
  const {open, closeDialog} = props;
  const { handleSubmit, control, reset, getValues } = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      primarySurgeon: "",
      surgicalLocation: "",
      procedureUnit: "",
      serviceLine: "",
      dateOfBirth: null,
      procedureDate: null
    }
  });

  const StyledTextField = styled(TextField)({
    "& .MuiOutlinedInput-input": {
        fontSize: "0.688rem"
    },
    marginTop: "0.313rem"
  });

  //TODO: create case on submit
  const onSubmit = (data: object) => console.log("here: ", data);

  function handleClose() {
      reset();
      closeDialog();
  }

  interface InputControllerProps {
    id: "firstName" | "lastName" | "primarySurgeon" | "surgicalLocation" | "procedureUnit" | "serviceLine",
    title: string,
    placeholder: string
  }

  interface DateControllerProps {
    id: "dateOfBirth" | "procedureDate",
    title: string,
    placeholder: string
  }

  function InputController(props: InputControllerProps) {
    const {id, title, placeholder} = props;
    return <Controller
        name={id}
        control={control}
        rules={{ required: true }}
        render={({ field }) => (
            <React.Fragment>
                <InputLabel htmlFor={id} variant="standard">{title}</InputLabel>
                <StyledTextField {...field} id={id} variant="outlined" placeholder={placeholder} />
            </React.Fragment>
        )}
      />
  }

  function DateController(props: DateControllerProps) {
    const {id, title, placeholder} = props;
    return <Controller
        name={id}
        control={control}
        rules={{ required: true }}
        render={({ field }) => (
            <React.Fragment>
                <InputLabel htmlFor={id} variant="standard">{title}</InputLabel>
                <DesktopDatePicker
                    {...field}
                    components={{ OpenPickerIcon: DateRangeIcon }}
                    value={field.value}
                    onChange={field.onChange}
                    renderInput={({inputProps, ...restParams}) => (
                        <StyledTextField 
                            id={id}
                            inputProps={{
                                ...inputProps, 
                                placeholder: placeholder,
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
            </React.Fragment>
        )}
      />
  }

  return (
      <Dialog fullWidth open={open} onClose={handleClose} maxWidth="sm" sx={{ "& .MuiPaper-root": { borderRadius: "0.625rem" }}}>
        <DialogTitle 
            sx={{
                backgroundColor: "blue.dark", 
                color: "white.main",
            }}>
                <Typography variant="h5" color="white.main"> Create Case </Typography>
        </DialogTitle>
        <DialogContent>
            <LocalizationProvider dateAdapter={AdapterMoment}>
                <Typography variant="subtitle1" sx={{marginTop: "3rem", marginBottom: "1.25rem"}}>Patient Information</Typography>
                <Grid container spacing={"2.5rem"}>
                    <Grid item xs={6}>
                        <InputController id="firstName" title="First Name" placeholder="First Name"/>
                    </Grid>
                    <Grid item xs={6}>
                        <InputController id="lastName" title="Last Name" placeholder="Last Name"/>
                    </Grid>
                    <Grid item xs={6}>
                        <DateController id="dateOfBirth" title="Patient Date of Birth" placeholder="Patient Date of Birth" />
                    </Grid>
                </Grid>
                <Typography variant="subtitle1" sx={{marginTop: "3rem", marginBottom: "1.25rem"}}>Procedure Information</Typography>
                <Grid container spacing={"2.5rem"}>
                    <Grid item xs={6}>
                        <InputController id="primarySurgeon" title="Primary Surgeon" placeholder="Primary Surgeon"/>
                    </Grid>
                    <Grid item xs={6}>
                        <InputController id="surgicalLocation" title="Surgical Location" placeholder="Surgical Location"/>
                    </Grid>
                    <Grid item xs={6}>
                        <InputController id="procedureUnit" title="Procedure Unit" placeholder="Procedure Unit"/>
                    </Grid>
                    <Grid item xs={6}>
                        <InputController id="serviceLine" title="Service Line" placeholder="Service Line"/>
                    </Grid>
                    <Grid item xs={6}>
                        <DateController id="procedureDate" title="Procedure Date" placeholder="Procedure Date" />
                    </Grid>
                </Grid>
            </LocalizationProvider>
        </DialogContent>
        <DialogActions sx={{display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "0.063rem solid", padding: "0.625rem", borderColor: "gray.main"}}>
          <Button 
            onClick={handleClose}
            sx={{ color: "blue.main", padding: "0.625rem"}}
          >
                Cancel
          </Button>
          <Button 
            variant="contained" 
            startIcon={<Add />}
            onClick={handleSubmit(onSubmit)}
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
