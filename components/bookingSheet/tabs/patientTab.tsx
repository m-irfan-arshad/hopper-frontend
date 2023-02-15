import React, {useEffect} from "react";
import { 
    Typography, 
    Grid, 
    Box
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { Control, useForm } from "react-hook-form";
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import {InputController, DateController, DropDownSearchController} from '../../../utils/formControllers'
import { parseFieldConfig, ConfigObject } from '../../../utils/helpers';



interface Props {
    control: any,
    config: ConfigObject,
}

export default function PatientTab(props: Props) {
    const {control, config} = props;

    const patientSexData = [{sex: 'M'}, {sex: 'F'}, {sex: 'O'}]; 
    const stateData = [{state: 'New York'}, {state: 'New Jersey'}, {state: 'Oregon'}]; 
    const gridStyles = {
        ".MuiGrid-item": {
            "paddingTop": "1rem",
        }
    }

    return (
        <Box>
            <LocalizationProvider dateAdapter={AdapterMoment}>
                <Typography variant="h5" sx={{marginTop: "2rem", marginBottom: "3rem", color: "gray.dark", height: "8rem"}}>Patient</Typography>
                <Grid container justifyContent={"left"} spacing={"2rem"} rowSpacing={"8rem"} sx={gridStyles}>
                    { parseFieldConfig(config, 'Patient', 'firstName', 'visible', true) && <Grid item xs={4} >
                        <InputController control={control} id="patient.firstName" title="First Name" placeholder="First Name"/>
                    </Grid> }
                    <Grid item xs={4}>
                        <InputController control={control} id="patient.middleName" title="Middle Name" placeholder="Middle Name"/>
                    </Grid>
                    <Grid item xs={4}>
                        <InputController control={control} id="patient.lastName" title="Last Name" placeholder="Last Name" />
                    </Grid>
                    <Grid item xs={6}>
                        <DateController control={control} id="patient.dateOfBirth" title="Date of Birth" placeholder="Date of Birth" />
                    </Grid>
                    <Grid item xs={6}>
                        <DropDownSearchController 
                            title="Sex"
                            control={control}
                            id="patient.sex"
                            options={patientSexData} 
                            labelProperties={["sex"]}
                            placeholder="Sex" 
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <InputController control={control} id="patient.address" title="Address" placeholder="Address" />
                    </Grid>
                    <Grid item xs={4}>
                        <InputController control={control} id="patient.city" title="City" placeholder="City" />
                    </Grid>
                    <Grid item xs={4}>
                        <DropDownSearchController 
                            title="State"
                            control={control}
                            id="patient.state"
                            options={stateData} 
                            labelProperties={["state"]}
                            placeholder="State" 
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <InputController control={control} id="patient.zip" title="Zip" placeholder="Zip" />
                    </Grid>
                </Grid>
            </LocalizationProvider>
        </Box>
    )
}
