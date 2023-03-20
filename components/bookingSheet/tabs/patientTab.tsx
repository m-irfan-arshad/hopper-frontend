import React, {useEffect} from "react";
import { 
    Typography, 
    Grid, 
    Box
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import {InputController, DateController, DropDownSearchController} from '../../../utils/formControllers'
import { parseFieldConfig, ConfigObject } from '../../../utils/helpers';


interface Props {
    config: ConfigObject,
}

export default function PatientTab(props: Props) {
    const {config} = props;

    return (
            <LocalizationProvider dateAdapter={AdapterMoment}>
                <Typography variant="h5" sx={{marginTop: "2.25rem", marginBottom: "2.25rem", color: "gray.dark"}}>Patient</Typography>
                <Grid container justifyContent={"left"} spacing={"1rem"} rowSpacing={"2.25rem"}>
                    { parseFieldConfig(config, 'Patient', 'firstName', 'visible', true) && <Grid item xs={4} >
                        <InputController id="patient.firstName" title="First Name" placeholder="First Name"/>
                    </Grid> }
                    <Grid item xs={4}>
                        <InputController id="patient.middleName" title="Middle Name" placeholder="Middle Name"/>
                    </Grid>
                    <Grid item xs={4}>
                        <InputController id="patient.lastName" title="Last Name" placeholder="Last Name" />
                    </Grid>
                    <Grid item xs={6}>
                        <DateController id="patient.dateOfBirth" title="Date of Birth" placeholder="Date of Birth" />
                    </Grid>
                    <Grid item xs={6}>
                        <DropDownSearchController 
                            title="Sex"
                            id="patient.sex"
                            labelProperties={["sexName"]}
                            placeholder="Sex" 
                            queryKey="getSex"
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <InputController id="patient.address" title="Address" placeholder="Address" />
                    </Grid>
                    <Grid item xs={4}>
                        <InputController id="patient.city" title="City" placeholder="City" />
                    </Grid>
                    <Grid item xs={4}>
                        <DropDownSearchController 
                            title="State"
                            id="patient.state"
                            labelProperties={["stateName"]}
                            placeholder="State" 
                            queryKey="getState"
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <InputController id="patient.zip" title="Zip" placeholder="Zip" />
                    </Grid>
                </Grid>
            </LocalizationProvider>
    )
}
