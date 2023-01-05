import React from "react";
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
import { useForm, Controller } from "react-hook-form";
import { useCreateCaseHook, caseToPlatformHook } from '../utils/hooks';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';


interface Props {
    open: boolean
    closeDialog: () => void
}

export default function CreateCaseDialog(props: Props) {
  const {open, closeDialog} = props;
  const {mutate} = useCreateCaseHook()

  const StyledTextField = styled(TextField)({
    "& .MuiOutlinedInput-input": {
        fontSize: "0.688rem"
    },
    marginTop: "0.313rem"
  });

  const onSubmit = async (data: object) => {
    await mutate(data)
    const sendCaseToPlatform = caseToPlatformHook()
    //sendCaseToPlatform(data)
    handleClose()
  };

  function handleClose() {
      reset();
      closeDialog();
  }

  interface InputControllerProps {
    id: any,
    title: string,
    placeholder: string
  }

  interface DateControllerProps {
    id: any,
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

  const schema = yup.object().shape({
    patient: yup.object().shape({
        firstName: yup.string().required(),
        lastName: yup.string().required(),
        dateOfBirth: yup.date().required(),
    }),
    case: yup.object().shape({
        providerName: yup.string().required(),
        locationName: yup.string().required(),
        procedureUnit: yup.string().required(),
        serviceLine: yup.string().required(),
        procedureDate: yup.date().required(),
    })
  });

  const { handleSubmit, control, reset, formState: { isValid } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      patient: {
        firstName: "",
        lastName: "",
        dateOfBirth: null,
      },
      case: {
        providerName: "",
        locationName: "",
        procedureUnit: "",
        serviceLine: "",
        procedureDate: null
      }
    }
  });

  return (
      <Dialog fullWidth open={open} onClose={handleClose} maxWidth="sm" sx={{ "& .MuiPaper-root": { borderRadius: "0.625rem" }}}>
        <DialogTitle sx={{backgroundColor: "blue.dark"}}>
            <Typography sx={{fontSize: "1.5rem"}} color="white.main"> Create Case </Typography>
        </DialogTitle>
        <DialogContent>
            <LocalizationProvider dateAdapter={AdapterMoment}>
                <Typography variant="subtitle1" sx={{marginTop: "3rem", marginBottom: "1.25rem"}}>Patient Information</Typography>
                <Grid container spacing={"2.5rem"}>
                    <Grid item xs={6}>
                        <InputController id="patient.firstName" title="First Name" placeholder="First Name"/>
                    </Grid>
                    <Grid item xs={6}>
                        <InputController id="patient.lastName" title="Last Name" placeholder="Last Name"/>
                    </Grid>
                    <Grid item xs={6}>
                        <DateController id="patient.dateOfBirth" title="Patient Date of Birth" placeholder="Patient Date of Birth" />
                    </Grid>
                </Grid>
                <Typography variant="subtitle1" sx={{marginTop: "3rem", marginBottom: "1.25rem"}}>Procedure Information</Typography>
                <Grid container spacing={"2.5rem"}>
                    <Grid item xs={6}>
                        <InputController id="case.providerName" title="Primary Surgeon" placeholder="Primary Surgeon"/>
                    </Grid>
                    <Grid item xs={6}>
                        <InputController id="case.locationName" title="Surgical Location" placeholder="Surgical Location"/>
                    </Grid>
                    <Grid item xs={6}>
                        <InputController id="case.procedureUnit" title="Procedure Unit" placeholder="Procedure Unit"/>
                    </Grid>
                    <Grid item xs={6}>
                        <InputController id="case.serviceLine" title="Service Line" placeholder="Service Line"/>
                    </Grid>
                    <Grid item xs={6}>
                        <DateController id="case.procedureDate" title="Procedure Date" placeholder="Procedure Date" />
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
            disabled={!isValid}
            sx={{
                backgroundColor: "green.main",
                border: 1,
                borderColor: isValid ? "green.dark" : "grey",
                marginRight: "1.75rem",
            }}>
                Create Case
            </Button>
        </DialogActions>
      </Dialog>
  );
}
