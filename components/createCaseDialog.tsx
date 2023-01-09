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
import { useCreateCaseHook, useGetLocationOptionsHook } from '../utils/hooks';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import DropDownSearchComponent from "./shared/dropdownSearch";

interface Props {
    open: boolean
    closeDialog: () => void
}

export default function CreateCaseDialog(props: Props) {
  const {open, closeDialog} = props;
  const {mutate} = useCreateCaseHook()

  useGetLocationOptionsHook
  const { data = [{label: '', id: 1}], isFetching } = useGetLocationOptionsHook();

  console.log('data',data);
  console.log('isFetching',isFetching);

  const StyledTextField = styled(TextField)({
    "& .MuiOutlinedInput-input": {
        fontSize: "0.688rem"
    },
    marginTop: "0.313rem",
  });

  const onSubmit = async (data: object) => {
    await mutate(data)
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

  interface DropDownSearchControllerProps {
    id: any,
    title: string,
    disabled?: boolean
    placeholder: string
    additionalStyles?: React.CSSProperties | object
  }

  interface DateControllerProps {
    id: any,
    title: string,
    placeholder: string
  }

  const filmsWithOutValues = [
    { label: 'Shawshank Redemption', id: 1994 },
    { label: 'Godfather', id: 1972 },
    { label: 'Godfather: Part II',  id: 1974 },
    { label: 'The Dark Knight', id: 2008 },
    { label: '12 Angry Men',  id: 1957 },
    { label: "Schindler's List",  id: 1993 },
    { label: 'Pulp Fiction', id: 1994 },
    { label: 'Horizon', id: 2000 },
    { label: 'Family Guy', id: 1950 },
    { label: 'Jedi',  id: 1998 },
    { label: 'The Darkest Day', id: 2019 },
    { label: 'The Second Return', id: 1999 }
];

  function InputController(props: InputControllerProps) {
    const {id, title, placeholder} = props;
    return <Controller
        name={id}
        control={control}
        rules={{ required: true }}
        render={({ field }) => (
            <React.Fragment>
                <InputLabel htmlFor={id} variant="standard" >{title}</InputLabel>
                <StyledTextField {...field} id={id} variant="outlined" placeholder={placeholder} />
            </React.Fragment>
        )}
      />
  }

  function DropDownSearchController(props: DropDownSearchControllerProps) {
    const {id, title, disabled, placeholder, additionalStyles} = props;
    return <Controller
        name={id}
        control={control}
        rules={{ required: true }}
        render={({ field }) => (
            <React.Fragment>
                <InputLabel htmlFor={id} variant="standard" >{title}</InputLabel>
                <DropDownSearchComponent 
                    {...field}
                    id={id}
                    options={data}
                    onChange={field.onChange}
                    disabled={disabled} 
                    placeholder={placeholder} 
                    additionalStyles={additionalStyles}
                />
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
                <InputLabel htmlFor={id} variant="standard" >{title}</InputLabel>
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

  useGetLocationOptionsHook

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

  const { handleSubmit, control, reset, formState: { isValid, dirtyFields } } = useForm({ 
    resolver: yupResolver(schema),
    defaultValues: {
      patient: {
        firstName: "",
        lastName: "",
        dateOfBirth: null,
      },
      case: {
        providerName: null,
        locationName: null,
        procedureUnit: null,
        serviceLine: null,
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
                <Grid container justifyContent={"space-between"} spacing={"2.5rem"}>
                    <Grid item xs={6}>
                        <InputController id="patient.firstName" title="First Name" placeholder="First Name"/>
                    </Grid>
                    <Grid item xs={'auto'}>
                        <InputController id="patient.lastName" title="Last Name" placeholder="Last Name" />
                    </Grid>
                    <Grid item xs={6}>
                        <DateController id="patient.dateOfBirth" title="Patient Date of Birth" placeholder="Patient Date of Birth" />
                    </Grid>
                </Grid>
                <Typography variant="subtitle1" sx={{marginTop: "3rem", marginBottom: "1.25rem"}}>Procedure Information</Typography>
                <Grid container justifyContent={"space-between"} spacing={"2.5rem"}>
                    <Grid item xs={12}>
                        <DropDownSearchController id="case.locationName" title="Surgical Location" placeholder="Surgical Location" additionalStyles={{ "& .MuiFormControl-root": { width: "100%"}}} />
                    </Grid>
                    <Grid item xs={6}>
                        <DropDownSearchController id="case.procedureUnit" title="Procedure Unit" placeholder="Procedure Unit" disabled={dirtyFields.case?.locationName !== true}/>
                    </Grid>
                    <Grid item xs={'auto'}>
                        <DropDownSearchController id="case.serviceLine" title="Service Line" placeholder="Service Line" disabled={dirtyFields.case?.procedureUnit !== true} />
                    </Grid>
                    <Grid item xs={6}>
                        <DropDownSearchController id="case.providerName" title="Primary Surgeon" placeholder="Primary Surgeon" disabled={dirtyFields.case?.serviceLine !== true} additionalStyles={{ marginBottom: "50px"}} />
                    </Grid>
                    <Grid item xs={'auto'}>
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
