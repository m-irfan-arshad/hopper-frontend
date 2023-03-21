import React, {useEffect} from "react";
import { 
    Typography, 
    Grid, 
    Box
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { DateController, DropDownSearchController} from '../../../utils/formControllers'
import * as R from 'ramda';
import { useFormContext } from "react-hook-form";
import { BookingSheetConfig } from "../../../reference";

interface Props {
    config: BookingSheetConfig,
}

export default function SchedulingTab(props: Props) {
    const {config} = props;
    const { watch, resetField, setValue, formState: { isDirty } } = useFormContext();

    const locationDropDownValue = watch('scheduling.location');
    const procedureUnitDropDownValue = watch('scheduling.procedureUnit');
    const serviceLineDropDownValue = watch('scheduling.serviceLine');

    useEffect(() => {
        isDirty && setValue('scheduling.procedureUnit', {procedureUnitId: null}, {shouldDirty: true});
    }, [locationDropDownValue]);

    useEffect(() => {
        isDirty && setValue('scheduling.serviceLine', {serviceLineId: null}, {shouldDirty: true});
    }, [procedureUnitDropDownValue]);

    useEffect(() => {
        isDirty && setValue('scheduling.provider', {providerId: null}, {shouldDirty: true});
    }, [serviceLineDropDownValue]);

    return (
            <LocalizationProvider dateAdapter={AdapterMoment}>
                <Typography variant="h5" sx={{marginTop: "2.25rem", marginBottom: "2.25rem", color: "gray.dark"}}>Scheduling</Typography>
                <Grid container justifyContent={"left"} spacing={"1rem"} rowSpacing={"2.25rem"}>
                    <DropDownSearchController 
                        title="Surgical Location"
                        id="scheduling.location" 
                        queryKey="getLocations"
                        labelProperties={["locationName"]}
                        placeholder="Surgical Location"
                        size={6} 
                        config={config}
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
                        config={config}
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
                        config={config}
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
                        config={config}
                    />
                    <DateController withTime id={'scheduling.procedureDate'} title="Procedure Date" placeholder="Procedure Date" size={6} config={config}/>
                    <DropDownSearchController 
                        title="Admission Type"
                        id="scheduling.admissionType"
                        labelProperties={["admissionTypeName"]}
                        placeholder="Admission Type" 
                        queryKey="getAdmissionTypes"
                        size={6} 
                        config={config}
                    />
                </Grid>
            </LocalizationProvider>
    )
}
