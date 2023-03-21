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
import { FormProvider, useForm } from "react-hook-form";
import { 
    useCreateCaseHook
} from '../utils/hooks';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import {InputController, DateController, DropDownSearchController} from '../utils/formControllers'

interface Props {
    open: boolean
    closeDialog: () => void
}

export default function CreateCaseDialog(props: Props) {
  const {open, closeDialog} = props;
  const {mutate} = useCreateCaseHook();

  const onSubmit = async (data: any) => {
    await mutate(data);
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
    scheduling: yup.object().shape({
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

  const form = useForm({ 
    mode: 'onChange',
    resolver: yupResolver(schema),
    defaultValues: {
      patient: {
        firstName: "",
        lastName: "",
        dateOfBirth: null,
      },
      scheduling: {
        provider: null,
        location: null,
        procedureUnit: null,
        serviceLine: null,
        procedureDate: null
      }
    }
  });

  const { handleSubmit, control, reset, resetField, watch, formState: { isValid, dirtyFields } } = form;

  const locationDropDownValue = watch('scheduling.location');
  const procedureUnitDropDownValue = watch('scheduling.procedureUnit');
  const serviceLineDropDownValue = watch('scheduling.serviceLine');

  useEffect(() => {
    resetField('scheduling.procedureUnit');
  }, [locationDropDownValue, resetField]);

  useEffect(() => {
    resetField('scheduling.serviceLine');
  }, [procedureUnitDropDownValue, resetField]);

  useEffect(() => {
    resetField('scheduling.provider');
  }, [serviceLineDropDownValue, resetField]);

  return (
      <Dialog fullWidth open={open} onClose={handleClose} maxWidth="sm" sx={{ "& .MuiPaper-root": { borderRadius: "0.625rem" }}}>
        <DialogTitle sx={{backgroundColor: "blue.dark"}}>
            <Typography sx={{fontSize: "1.5rem"}} color="white.main"> Create Case </Typography>
        </DialogTitle>
        <DialogContent>
            <FormProvider {...form} >
                <LocalizationProvider dateAdapter={AdapterMoment}>
                    <Typography variant="subtitle1" sx={{marginTop: "1.5rem", marginBottom: "1.25rem"}}>Patient Information</Typography>
                    <Grid container justifyContent={"space-between"} spacing={"2.5rem"}>
                        <InputController id="patient.firstName" title="First Name" placeholder="First Name" size={6}/>
                        <InputController id="patient.lastName" title="Last Name" placeholder="Last Name" size={6}/>
                        <DateController id="patient.dateOfBirth" title="Patient Date of Birth" placeholder="Patient Date of Birth" size={6}/>
                    </Grid>
                    <Typography variant="subtitle1" sx={{marginTop: "2.5rem", marginBottom: "1.25rem"}}>Procedure Information</Typography>
                    <Grid container justifyContent={"space-between"} spacing={"2.5rem"}>
                        <DropDownSearchController
                            title="Surgical Location"
                            id="scheduling.location" 
                            queryKey="getLocations"
                            labelProperties={["locationName"]}
                            placeholder="Surgical Location"
                            size={12}
                        />
                        <DropDownSearchController 
                            title="Procedure Unit"
                            id="scheduling.procedureUnit" 
                            queryKey="getProcedureUnits"
                            labelProperties={["procedureUnitName"]}
                            placeholder="Procedure Unit"
                            dependency="scheduling.location.locationId"
                            params={[{field: "locationId", value: "scheduling.location.locationId"}]}
                            size={6}
                        />
                        <DropDownSearchController 
                            title="Service Line"
                            id="scheduling.serviceLine" 
                            queryKey="getServiceLines"
                            labelProperties={["serviceLineName"]}
                            placeholder="Service Line"
                            dependency="scheduling.procedureUnit.procedureUnitId"
                            params={[{field: "procedureUnitId", value: "scheduling.procedureUnit.procedureUnitId"}]}
                            size={6}
                        />
                        <DropDownSearchController 
                            title="Primary Surgeon"
                            id="scheduling.provider" 
                            queryKey="getProviders"
                            labelProperties={["firstName", "lastName"]}
                            placeholder="Primary Surgeon"
                            dependency="scheduling.serviceLine.serviceLineId"
                            params={[{field: "serviceLineId", value: "scheduling.serviceLine.serviceLineId"}]}
                            size={6}
                        />
                            <DateController id="scheduling.procedureDate" title="Procedure Date" placeholder="Procedure Date" size={6}/>
                    </Grid>
                </LocalizationProvider>
            </FormProvider>
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
