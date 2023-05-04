import React from "react";
import { 
    Typography, 
    Grid, 
    Box,
    Divider
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import {InputController, DateController, DropDownSearchController} from '../../../utils/formControllers'
import { BookingSheetConfig } from "../../../reference";
import { useFieldArray, useFormContext } from "react-hook-form";

interface Props {
    config: BookingSheetConfig,
}

export default function PatientTab(props: Props) {
    const {config} = props;
    const { control } = useFormContext();
    const { append, remove, fields } = useFieldArray({control, name: "patient.address"});

    return (
            <LocalizationProvider dateAdapter={AdapterMoment}>
                <Typography variant="h5" sx={{marginTop: "2.25rem", marginBottom: "2.25rem", color: "gray.dark"}}>Patient</Typography>
                <Grid container justifyContent={"left"} spacing={"1rem"} rowSpacing={"0.85rem"}>
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
                    {fields.map((item, index, itemList)=>(<React.Fragment key={item.id}>
                        <Grid container justifyContent={"left"} spacing={"1.25rem"} rowSpacing={"0.85rem"}>
                            <InputController id={`patient.address.${index}.addressOne`} title="Address One" placeholder="Address One" size={12} config={config}/>
                            <InputController id={`patient.address.${index}.addressTwo`} title="Address Two" placeholder="Address Two" size={12} config={config}/>
                            <InputController id={`patient.address.${index}.city`} title="City" placeholder="City" size={4} config={config}/>
                            <DropDownSearchController 
                                title="State"
                                id={`patient.address.${index}.state`}
                                labelProperties={["stateName"]}
                                placeholder="State" 
                                queryKey="getStates"
                                size={4} 
                                config={config}
                            />
                            <InputController id={`patient.address.${index}.zip`} title="Zip" placeholder="Zip" size={4} config={config}/>
                        </Grid>
                        {(index+1 !== itemList.length) && <Divider light sx={{marginTop: "1.6rem", marginBottom: "3rem"}}/>}
                    </React.Fragment>))}
                </Grid>
            </LocalizationProvider>
    )
}
