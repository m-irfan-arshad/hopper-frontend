import React, {useEffect} from "react";
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
import { 
    useCreateCaseHook, 
    useGetLocationsHook, 
    useGetProcedureUnitsHook,
    useGetServiceLinesHook, 
    useGetProvidersHook 
} from '../utils/hooks';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import DropDownSearchComponent from "./shared/dropdownSearch";
import { formatCreateCaseParams } from '../utils/helpers';

interface Props {
    open: boolean
    closeDialog: () => void
}

interface InputControllerProps {
    id: any,
    title: string,
    placeholder: string
    control: any
}

interface DateControllerProps {
    id: any,
    title: string,
    placeholder: string
    control: any
}

interface DropDownSearchOption {
    [key: string]: string
    fhirResourceId: string
}

interface DropDownSearchControllerProps {
    id: any,
    title: string,
    disabled?: boolean
    placeholder: string
    additionalStyles?: React.CSSProperties | object
    options: DropDownSearchOption[]
    labelProperties: string[]
    control: any
}

const StyledTextField = styled(TextField)({
    "& .MuiOutlinedInput-input": {
        fontSize: "0.688rem"
    },
    marginTop: "0.313rem"
});
  

function InputController(props: InputControllerProps) {
    const {id, title, placeholder, control} = props;
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
    const {id, title, placeholder, control} = props;
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

function DropDownSearchController(props: DropDownSearchControllerProps) {
    const {id, title, disabled, placeholder, options, labelProperties, additionalStyles, control} = props;

    return <Controller
            name={id}
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
                <React.Fragment>
                    <InputLabel htmlFor={id} variant="standard" >{title}</InputLabel>
                    <DropDownSearchComponent 
                        {...field}
                        labelProperties={labelProperties}
                        id={id}
                        options={options}
                        onChange={field.onChange}
                        disabled={disabled} 
                        placeholder={placeholder} 
                        additionalStyles={additionalStyles}
                    />
                </React.Fragment>
            )}
        />
}

export default function CreateCaseDialog(props: Props) {
  const {open, closeDialog} = props;
  const {mutate} = useCreateCaseHook();

  const onSubmit = async (data: any) => {
    const submissionData = formatCreateCaseParams(data);
    await mutate(submissionData);
    handleClose();
  };

  function handleClose() {
      reset();
      closeDialog();
  }

  const schema = yup.object().shape({
    patient: yup.object().shape({
        firstName: yup.string().required(),
        lastName: yup.string().required(),
        dateOfBirth: yup.date().required(),
    }),
    case: yup.object().shape({
        provider: yup.object().shape({
            providerId: yup.number().required(),
            fhirResourceId: yup.string().required(),
            firstName: yup.string().required(),
            lastName: yup.string().required(),
            address: yup.string().nullable(true),
            email: yup.string().nullable(true)
        }),
        location: yup.object().shape({
            locationId: yup.number().required(),
            fhirResourceId: yup.string().required(),
            locationName: yup.string().required(),
        }),
        procedureUnit: yup.object().shape({
            procedureUnitId: yup.number().required(),
            fhirResourceId: yup.string().required(),
            procedureUnitName: yup.string().required(),
            locationId: yup.number().required()
        }),
        serviceLine: yup.object().shape({
            serviceLineId: yup.number().required(),
            fhirResourceId: yup.string().required(),
            serviceLineName: yup.string().required(),
            procedureUnitId: yup.number().required()
        }),
        procedureDate: yup.date().required(),
    })
  });

  const { handleSubmit, control, reset, resetField, watch, formState: { isValid, dirtyFields } } = useForm({ 
    mode: 'onChange',
    resolver: yupResolver(schema),
    defaultValues: {
      patient: {
        firstName: "",
        lastName: "",
        dateOfBirth: null,
      },
      case: {
        provider: null,
        location: null,
        procedureUnit: null,
        serviceLine: null,
        procedureDate: null
      }
    }
  });

  const currentFormValues = watch(); 

  const locationId = currentFormValues.case.location ? currentFormValues.case.location["locationId"] : NaN; 
  const procedureUnitId =  currentFormValues.case.procedureUnit ? currentFormValues.case.procedureUnit["procedureUnitId"] : NaN;
  const serviceLineId = currentFormValues.case.serviceLine ? currentFormValues.case.serviceLine["serviceLineId"] : NaN;

  const { data: locationData = [] } = useGetLocationsHook();
  const { data: procedureUnitData = [] } = useGetProcedureUnitsHook(locationId); 
  const { data: serviceLineData = [] } = useGetServiceLinesHook(procedureUnitId);
  const { data: providerData = [] } = useGetProvidersHook(serviceLineId);

  useEffect(() => {
    resetField('case.procedureUnit');
    resetField('case.serviceLine');
    resetField('case.provider');
  }, [currentFormValues.case.location, resetField]);

  useEffect(() => {
    resetField('case.serviceLine');
    resetField('case.provider');
  }, [currentFormValues.case.procedureUnit, resetField]);

  useEffect(() => {
    resetField('case.provider');
  }, [currentFormValues.case.serviceLine, resetField]);

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
                        <InputController control={control} id="patient.firstName" title="First Name" placeholder="First Name"/>
                    </Grid>
                    <Grid item xs="auto">
                        <InputController control={control} id="patient.lastName" title="Last Name" placeholder="Last Name" />
                    </Grid>
                    <Grid item xs={6}>
                        <DateController control={control} id="patient.dateOfBirth" title="Patient Date of Birth" placeholder="Patient Date of Birth" />
                    </Grid>
                </Grid>
                <Typography variant="subtitle1" sx={{marginTop: "3rem", marginBottom: "1.25rem"}}>Procedure Information</Typography>
                <Grid container justifyContent={"space-between"} spacing={"2.5rem"}>
                    <Grid item xs={12}>
                        <DropDownSearchController
                            control={control}
                            id="case.location" 
                            options={locationData} 
                            labelProperties={["locationName"]} 
                            title="Surgical Location"
                            placeholder="Surgical Location" 
                            additionalStyles={{ "& .MuiFormControl-root": { width: "100%"}}} 
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <DropDownSearchController 
                            control={control}
                            id="case.procedureUnit"
                            options={procedureUnitData} 
                            labelProperties={["procedureUnitName"]}
                            title="Procedure Unit" 
                            placeholder="Procedure Unit" 
                            disabled={!dirtyFields.case?.location}
                        />
                    </Grid>
                    <Grid item xs="auto">
                        <DropDownSearchController 
                            control={control}
                            id="case.serviceLine" 
                            options={serviceLineData} 
                            labelProperties={["serviceLineName"]}
                            title="Service Line" 
                            placeholder="Service Line" 
                            disabled={!dirtyFields.case?.procedureUnit} 
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <DropDownSearchController 
                            control={control}
                            id="case.provider" 
                            options={providerData} 
                            labelProperties={["firstName", "lastName"]}
                            title="Primary Surgeon" 
                            placeholder="Primary Surgeon" 
                            disabled={!dirtyFields.case?.serviceLine} 
                            additionalStyles={{ marginBottom: "50px"}} 
                        />
                    </Grid>
                    <Grid item xs="auto">
                        <DateController control={control} id="case.procedureDate" title="Procedure Date" placeholder="Procedure Date" />
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
