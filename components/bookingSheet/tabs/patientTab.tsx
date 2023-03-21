import React from "react";
import { 
    Typography, 
    Grid, 
    Box
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import {InputController, DateController, DropDownSearchController} from '../../../utils/formControllers'
import { BookingSheetConfig } from "../../../reference";

interface Props {
    config: BookingSheetConfig,
}

export default function PatientTab(props: Props) {
    const {config} = props;

    return (
            <LocalizationProvider dateAdapter={AdapterMoment}>
                <Typography variant="h5" sx={{marginTop: "2.25rem", marginBottom: "2.25rem", color: "gray.dark"}}>Patient</Typography>
                <Grid container justifyContent={"left"} spacing={"1rem"} rowSpacing={"0.95rem"}>
                    <InputController id="patient.firstName" title="First Name" placeholder="First Name" size={4} config={config}/>
                    <InputController id="patient.middleName" title="Middle Name" placeholder="Middle Name" size={4} config={config}/>
                    <InputController id="patient.lastName" title="Last Name" placeholder="Last Name" size={4} config={config} />
                    <DateController id="patient.dateOfBirth" title="Date of Birth" placeholder="Date of Birth" size={6} config={config}/>
                    <DropDownSearchController 
                        title="Sex"
                        id="patient.sex"
                        labelProperties={["sexName"]}
                        placeholder="Sex" 
                        queryKey="getSex"
                        size={6} 
                        config={config}
                    />
                    <InputController id="patient.address" title="Address" placeholder="Address" size={12} config={config}/>
                    <InputController id="patient.city" title="City" placeholder="City" size={4} config={config}/>
                    <DropDownSearchController 
                        title="State"
                        id="patient.state"
                        labelProperties={["stateName"]}
                        placeholder="State" 
                        queryKey="getStates"
                        size={4} 
                        config={config}
                    />
                    <InputController id="patient.zip" title="Zip" placeholder="Zip" size={4} config={config}/>
                </Grid>
            </LocalizationProvider>
    )
}
