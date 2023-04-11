import React, { useState } from "react";
import { 
    Typography, 
    Grid, 
    DialogActions,
    Button,
    Divider,
    Box
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import {InputController, DateController, DropDownSearchController, CheckboxController, RadioGroupController} from '../../../utils/formControllers'
import { BookingSheetConfig, defaultClearance, defaultDiagnosticTest } from "../../../reference";
import * as R from 'ramda'
import { useWatch, useFieldArray, useFormContext } from "react-hook-form";
import { Add, RemoveCircle } from "@mui/icons-material";


interface Props {
    config: BookingSheetConfig,
}

const headerStyles = {marginTop: "2.25rem", marginBottom: "2.25rem", color: "gray.dark"}

export default function ClinicalTab(props: Props) {
    const {config} = props;
    const preOpRequired = useWatch({ name: 'clinical.preOpRequired' })
    const showPreOpLocation = useWatch({ name: 'clinical.showPreOpLocation' })
    const diagnosticTestsRequired = useWatch({ name: 'clinical.diagnosticTestsRequired' })
    const clearanceRequired = useWatch({ name: 'clinical.clearanceRequired' })
    const preOpRequiredOptions = [{title: "Yes", value: "true"}, {title: "No", value: "false"}];
    const diagnosticTestsRequiredOptions = [{title: "Yes, required", value: "true"}, {title: "No, not Required", value: "false"}];
    const clearanceRequiredOptions = [{title: "Yes, required", value: "true"}, {title: "No, not Required", value: "false"}];
    const { control } = useFormContext();
    const { append: appendDiagnosticTest, remove: removeDiagnosticTest, fields: diagnosticTestFields } = useFieldArray({control, name: "diagnosticTests"});
    const diagnosticTests = useWatch({ name: 'clinical.diagnosticTests' })
    const { append: appendClearance, remove: removeClearance, fields: clearanceFields } = useFieldArray({control, name: "clearances"});
    const clearances = useWatch({ name: 'clinical.clearances' })

    return (
            <LocalizationProvider dateAdapter={AdapterMoment}>
                <Typography variant="h6" sx={headerStyles}>Primary Care Physician</Typography>
                <Grid container justifyContent={"left"} spacing={"1rem"} rowSpacing={"0.85rem"}>
                    <InputController id="clinical.physicianFirstName" title="First Name" placeholder="First Name" size={6} config={config}/>
                    <InputController id="clinical.physicianLastName" title="Last Name" placeholder="Last Name" size={6} config={config}/>
                    <InputController id="clinical.physicianPhone" title="Phone Number" placeholder="Phone Number" size={6} config={config}/>
                </Grid>
                <Typography variant="h6" sx={headerStyles}>Pre-Admission Assessment</Typography>
                <Grid container justifyContent={"left"} spacing={"1rem"} rowSpacing={"0.85rem"}>
                    <RadioGroupController id="clinical.preOpRequired" size={12} title="Is pre-admission assessment required for this patient?" options={preOpRequiredOptions} config={config}/>
                    {preOpRequired==="true" && (
                        <React.Fragment>
                            <DateController withTime id={'clinical.preOpDateTime'} title="Pre-Op Date" placeholder="Pre-Op Date" size={12} config={config}/>
                            <CheckboxController id={'clinical.showPreOpLocation'} title="At Procedure Location?" size={12} config={config}/>
                            {showPreOpLocation && (
                                <React.Fragment>
                                    <InputController id="clinical.preOpFacility.facilityName" title="Facility Name" placeholder="Facility Name" size={6} config={config}/>
                                    <InputController id="clinical.preOpFacility.phone" title="Facility Phone Number" placeholder="Facility Phone Number" size={6} config={config}/>
                                    <InputController id="clinical.preOpFacility.addressOne" title="Facility Address 1" placeholder="Facility Address 1" size={6} config={config}/>
                                    <InputController id="clinical.preOpFacility.addressTwo" title="Facility Address 2" placeholder="Facility Address 2" size={6} config={config}/>
                                    <InputController id="clinical.preOpFacility.city" title="City" placeholder="City" size={6} config={config}/>
                                    <InputController id="clinical.preOpFacility.state" title="State" placeholder="State" size={6} config={config}/>
                                    <InputController id="clinical.preOpFacility.zip" title="Zip" placeholder="Zip" size={6} config={config}/>
                                </React.Fragment>
                            )}
                        </React.Fragment>
                    )}
                </Grid>

                <Typography variant="h6" sx={headerStyles}>Pre-Admission Testing</Typography>
                <RadioGroupController id="clinical.diagnosticTestsRequired" size={12} title="Is pre-admission testing required for this patient?" options={diagnosticTestsRequiredOptions} config={config}/>
                    {diagnosticTestsRequired==="true" && (
                        <Grid container justifyContent={"left"} spacing={"1rem"} rowSpacing={"0.85rem"} sx={{marginTop: '1rem'}}>
                            {diagnosticTestFields.map((item, index, itemList)=>{
                            const testNameIsOther = R.path([index, 'diagnosticTest', 'testName'], diagnosticTests) === 'Other';
                            const showTestLocation = !R.path([index, 'sameAsProcedureLocation'], diagnosticTests);
                            return (
                                    <React.Fragment>
                                    <DropDownSearchController 
                                        {...item}
                                        title="Diagnostic Test"
                                        id={`clinical.diagnosticTests.${index}.diagnosticTest`}
                                        labelProperties={["testName"]}
                                        placeholder="Diagnostic Test" 
                                        queryKey="getDiagnosticTests"
                                        size={6} 
                                        config={config}
                                    />
                                    {testNameIsOther && <InputController id={`clinical.diagnosticTests.${index}.testNameOther`} title="" placeholder="Test Name" size={6} config={config}/>}
                                    <Box width="100%"/>
                                    <DateController withTime id={`clinical.diagnosticTests.${index}.testDateTime`} title="Pre-Op Date" placeholder="Pre-Op Date" size={6} config={config}/>
                                    <CheckboxController id={`clinical.diagnosticTests.${index}.sameAsProcedureLocation`} title="At Procedure Location?" size={12} config={config}/>
                                    {showTestLocation && (
                                        <React.Fragment>
                                            <InputController id={`clinical.diagnosticTests.${index}.facility.facilityName`} title="Facility Name" placeholder="Facility Name" size={6} config={config}/>
                                            <InputController id={`clinical.diagnosticTests.${index}.facility.phone`} title="Facility Phone Number" placeholder="Facility Phone Number" size={6} config={config}/>
                                            <InputController id={`clinical.diagnosticTests.${index}.facility.addressOne`} title="Facility Address 1" placeholder="Facility Address 1" size={6} config={config}/>
                                            <InputController id={`clinical.diagnosticTests.${index}.facility.addressTwo`} title="Facility Address 2" placeholder="Facility Address 2" size={6} config={config}/>
                                            <InputController id={`clinical.diagnosticTests.${index}.facility.city`} title="City" placeholder="City" size={6} config={config}/>
                                            <InputController id={`clinical.diagnosticTests.${index}.facility.state`} title="State" placeholder="State" size={6} config={config}/>
                                            <InputController id={`clinical.diagnosticTests.${index}.facility.zip`} title="Zip" placeholder="Zip" size={6} config={config}/>
                                        </React.Fragment>
                                    )}
                                    <Grid item xs={12}><Divider light sx={{marginBottom: "1rem"}}/></Grid>
                                    </React.Fragment>
                           )
                        })}
                        <DialogActions sx={{ minHeight: "5rem", justifyContent: "flex-start" }}>
                        <Button 
                            variant="contained" 
                            onClick={()=>appendDiagnosticTest(defaultDiagnosticTest)}
                            startIcon={<Add />}
                            disabled={false}
                            size="small"
                            sx={{
                                backgroundColor: "blue.dark",
                                marginRight: "1.75rem",
                            }}>
                            Add Diagnostic Test
                        </Button>
                    </DialogActions>
                    </Grid>
                    )}

                <Typography variant="h6" sx={headerStyles}>Clearances</Typography>
                <RadioGroupController id="clinical.clearanceRequired" size={12} title="Are clearances required for this patient?" options={clearanceRequiredOptions} config={config}/>
                    {clearanceRequired==="true" && (
                        <Grid container justifyContent={"left"} spacing={"1rem"} rowSpacing={"0.85rem"} sx={{marginTop: '1rem'}}>
                            {clearanceFields.map((item, index, itemList)=>{
                            const clearanceNameIsOther = R.path([index, 'clearance', 'clearanceName'], clearances) === 'Other';
                            const showTestLocation = !R.path([index, 'sameAsProcedureLocation'], clearances);
                            return (
                                    <React.Fragment>
                                    <DropDownSearchController 
                                        {...item}
                                        title="Clearance"
                                        id={`clinical.clearances.${index}.clearance`}
                                        labelProperties={["clearanceName"]}
                                        placeholder="Clearance" 
                                        queryKey="getClearances"
                                        size={6} 
                                        config={config}
                                    />
                                    {clearanceNameIsOther && <InputController id={`clinical.clearances.${index}.clearanceNameOther`} title="" placeholder="Clearance Name" size={6} config={config}/>}
                                    <Box width="100%"/>
                                    <DateController withTime id={`clinical.clearances.${index}.testDateTime`} title="Pre-Op Date" placeholder="Pre-Op Date" size={6} config={config}/>
                                    <CheckboxController id={`clinical.clearances.${index}.sameAsProcedureLocation`} title="At Procedure Location?" size={12} config={config}/>
                                    {showTestLocation && (
                                        <React.Fragment>
                                            <InputController id={`clinical.clearances.${index}.facility.facilityName`} title="Facility Name" placeholder="Facility Name" size={6} config={config}/>
                                            <InputController id={`clinical.clearances.${index}.facility.phone`} title="Facility Phone Number" placeholder="Facility Phone Number" size={6} config={config}/>
                                            <InputController id={`clinical.clearances.${index}.facility.addressOne`} title="Facility Address 1" placeholder="Facility Address 1" size={6} config={config}/>
                                            <InputController id={`clinical.clearances.${index}.facility.addressTwo`} title="Facility Address 2" placeholder="Facility Address 2" size={6} config={config}/>
                                            <InputController id={`clinical.clearances.${index}.facility.city`} title="City" placeholder="City" size={6} config={config}/>
                                            <InputController id={`clinical.clearances.${index}.facility.state`} title="State" placeholder="State" size={6} config={config}/>
                                            <InputController id={`clinical.clearances.${index}.facility.zip`} title="Zip" placeholder="Zip" size={6} config={config}/>
                                        </React.Fragment>
                                    )}
                                    <Grid item xs={12}><Divider light sx={{marginBottom: "1rem"}}/></Grid>
                                    </React.Fragment>
                           )
                        })}
                        <DialogActions sx={{ minHeight: "5rem", justifyContent: "flex-start" }}>
                        <Button 
                            variant="contained" 
                            onClick={()=>appendClearance(defaultClearance)}
                            startIcon={<Add />}
                            disabled={false}
                            size="small"
                            sx={{
                                backgroundColor: "blue.dark",
                                marginRight: "1.75rem",
                            }}>
                            Add Clearance
                        </Button>
                    </DialogActions>
                    </Grid>
                    )}
            </LocalizationProvider>
    )
}
