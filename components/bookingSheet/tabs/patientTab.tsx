import React from "react";
import { 
    Typography, 
    Grid, 
    Box,
    Divider,
    Button,
    DialogActions
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import {InputController, DateController, DropDownSearchController, CheckboxController} from '../../../utils/formControllers'
import { BookingSheetConfig, defaultPatientAddress, defaultPhone, phoneTypeOptions } from "../../../reference";
import { useFieldArray, useFormContext } from "react-hook-form";
import { Add } from "@mui/icons-material";

interface Props {
    config: BookingSheetConfig,
}

export default function PatientTab(props: Props) {
    const {config} = props;
    const { control } = useFormContext();
    const { append: appendAddress, remove: removeAddress, fields: addressFields } = useFieldArray({control, name: "patient.address"});
    const { append: appendPhone, remove: removePhone, fields: phoneFields } = useFieldArray({control, name: "patient.phone"});

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
                </Grid>
                <Grid container justifyContent={"left"} spacing={"1rem"} rowSpacing={"0.85rem"}>
                    <Grid item><Typography variant="body2" sx={{marginTop: "0.5rem", color: "gray.dark"}}>Patient Address</Typography></Grid>
                    {addressFields.map((item, index, itemList)=>(<React.Fragment key={item.id}>
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
                    </React.Fragment>))}
                </Grid>
                <Button 
                    variant="contained" 
                    onClick={()=>appendAddress(defaultPatientAddress)}
                    startIcon={<Add />}
                    disabled={false}
                    size="small"
                    sx={{
                        backgroundColor: "blue.dark",
                        marginRight: "1.75rem",
                    }}>
                    Add Address
                </Button>
                <Grid container justifyContent={"left"} spacing={"1rem"} rowSpacing={"0.85rem"}  sx={{marginTop: "1rem"}}>
                    <Grid item sm={12}><Typography variant="body2" sx={{marginTop: "0.5rem", color: "gray.dark"}}>Patient Phone</Typography></Grid>
                    {phoneFields.map((item, index, itemList)=>(<React.Fragment key={item.id}>
                        <InputController id={`patient.phone.${index}.phoneNumber`} title="Phone Number" placeholder="Phone Number" size={6} config={config}/>
                        <DropDownSearchController 
                            {...item}
                            title="Type"
                            id={`patient.phone.${index}.type`}
                            options={phoneTypeOptions} 
                            labelProperties={["type"]}
                            placeholder="Type" 
                            size={4} 
                            config={config}
                        />
                        <CheckboxController 
                            id={`patient.phone.${index}.hasVoicemail`} 
                            title="Voicemail" 
                            size={2} 
                            config={config}
                        />

                    </React.Fragment>))}
                </Grid>
                <Button 
                    variant="contained" 
                    onClick={()=>appendPhone(defaultPhone)}
                    startIcon={<Add />}
                    disabled={false}
                    size="small"
                    sx={{
                        backgroundColor: "blue.dark",
                        marginRight: "1.75rem",
                    }}>
                    Add Phone
                </Button>
            </LocalizationProvider>
    )
}
