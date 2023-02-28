import React, {useEffect} from "react";
import { 
    Typography, 
    Grid, 
    Box
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { DateController, DropDownSearchController} from '../../../utils/formControllers'
import { ConfigObject } from '../../../utils/helpers';

interface Props {
    form: any,
    config: ConfigObject,
}

export default function SchedulingTab(props: Props) {
    const {form, config} = props;
    const { control, watch, resetField, getValues } = form;

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
        <Box>
            <LocalizationProvider dateAdapter={AdapterMoment}>
                <Typography variant="h5" sx={{marginTop: "2rem", marginBottom: "2rem", color: "gray.dark"}}>Scheduling</Typography>
                <Grid container justifyContent={"left"} spacing={"1rem"} rowSpacing={"1.3rem"}>
                    <Grid item xs={6}>
                        <DropDownSearchController 
                            title="Surgical Location"
                            control={control}
                            id="scheduling.location" 
                            queryKey="getLocations"
                            labelProperties={["locationName"]}
                            placeholder="Surgical Location"
                            getValues={getValues}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <DropDownSearchController 
                            title="Procedure Unit"
                            control={control}
                            id="scheduling.procedureUnit" 
                            queryKey="getProcedureUnits"
                            labelProperties={["procedureUnitName"]}
                            placeholder="Procedure Unit"
                            getValues={getValues}
                            dependency="scheduling.location.locationId"
                            params={[{field: "locationId", value: "scheduling.location.locationId"}]}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <DropDownSearchController 
                            title="Service Line"
                            control={control}
                            id="scheduling.serviceLine" 
                            queryKey="getServiceLines"
                            labelProperties={["serviceLineName"]}
                            placeholder="Service Line"
                            getValues={getValues}
                            dependency="scheduling.procedureUnit.procedureUnitId"
                            params={[{field: "procedureUnitId", value: "scheduling.procedureUnit.procedureUnitId"}]}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <DropDownSearchController 
                            title="Primary Surgeon"
                            control={control}
                            id="scheduling.provider" 
                            queryKey="getProviders"
                            labelProperties={["firstName", "lastName"]}
                            placeholder="Primary Surgeon"
                            getValues={getValues}
                            dependency="scheduling.serviceLine.serviceLineId"
                            params={[{field: "serviceLineId", value: "scheduling.serviceLine.serviceLineId"}]}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <DateController withTime control={control} id={'scheduling.procedureDate'} title="Procedure Date" placeholder="Procedure Date" />
                    </Grid>
                </Grid>
            </LocalizationProvider>
        </Box>
    )
}
