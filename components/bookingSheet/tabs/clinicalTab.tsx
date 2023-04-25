import React from "react";
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
import { BookingSheetConfig, defaultClearance, defaultDiagnosticTest, defaultFacility, defaultPreOpForm } from "../../../reference";
import * as R from 'ramda'
import { useWatch, useFieldArray, useFormContext } from "react-hook-form";
import { Add, RemoveCircle } from "@mui/icons-material";
import { clearance, clearanceForm, diagnosticTest, diagnosticTestForm } from "@prisma/client";


interface Props {
    config: BookingSheetConfig,
}

const headerStyles = {marginTop: "2.25rem", marginBottom: "2.25rem", color: "gray.dark"}

export default function ClinicalTab(props: Props) {
    const {config} = props;
    const { control, resetField, setValue } = useFormContext();
    const preOpRequired = useWatch({ name: 'clinical.preOpRequired' })
    const showPreOpLocation = useWatch({ name: 'clinical.preOpForm.atProcedureLocation' }) !== true
    const diagnosticTestsRequired = useWatch({ name: 'clinical.diagnosticTestsRequired' })
    const clearanceRequired = useWatch({ name: 'clinical.clearanceRequired' })
    const preOpRequiredOptions = [{title: "Yes, required", value: "true"}, {title: "No, not Required", value: "false"}];
    const diagnosticTestsRequiredOptions = [{title: "Yes, required", value: "true"}, {title: "No, not Required", value: "false"}];
    const clearanceRequiredOptions = [{title: "Yes, required", value: "true"}, {title: "No, not Required", value: "false"}];

    const { append: appendDiagnosticTest, remove: removeDiagnosticTest, fields: diagnosticTestFields } = useFieldArray({control, name: "clinical.diagnosticTests"});
    const { append: appendClearance, remove: removeClearance, fields: clearanceFields } = useFieldArray({control, name: "clinical.clearances"});
    const diagnosticTests = useWatch({ name: 'clinical.diagnosticTests' })
    const clearances = useWatch({ name: 'clinical.clearances' })

    // reset form and facility details when they are hidden
    const onTestNameChange = (index: number) => (e: diagnosticTest) => {
        setValue(`clinical.diagnosticTests.${index}.testNameOther`, '', {shouldDirty: true});
        setValue(`clinical.diagnosticTests.${index}.diagnosticTest`, e, {shouldDirty: true})
    }

    const onClearanceNameChange = (index: number) => (e: diagnosticTest) => {
        setValue(`clinical.clearances.${index}.clearanceNameOther`, '', {shouldDirty: true});
        setValue(`clinical.clearances.${index}.clearance`, e, {shouldDirty: true})
    }

    const onShowTestFacilityChange = (index: number) => (e: any) => {
        setValue(`clinical.diagnosticTests.${index}.facility`, defaultFacility, {shouldDirty: true});
        setValue(`clinical.diagnosticTests.${index}.atProcedureLocation`, e.target.checked, {shouldDirty: true})
    }

    const onShowClearanceFacilityChange = (index: number) => (e: any) => {
        setValue(`clinical.clearances.${index}.facility`, defaultFacility, {shouldDirty: true});
        setValue(`clinical.clearances.${index}.atProcedureLocation`, e.target.checked, {shouldDirty: true})
    }

    const onShowPreOpFacilityChange = (e: any) => {
        setValue(`clinical.preOpForm.facility`, defaultFacility, {shouldDirty: true});
        setValue(`clinical.preOpForm.atProcedureLocation`, e.target.checked, {shouldDirty: true})
    }

      
    return (
            <LocalizationProvider dateAdapter={AdapterMoment}>
                <Typography variant="h6" sx={headerStyles}>Primary Care Physician</Typography>
                <Grid container justifyContent={"left"} spacing={"1rem"} rowSpacing={"0.85rem"}>
                    <InputController id="clinical.physicianFirstName" title="Primary Care First Name" placeholder="Primary Care First Name" size={6} config={config}/>
                    <InputController id="clinical.physicianLastName" title="Primary Care Last Name" placeholder="Primary Care Last Name" size={6} config={config}/>
                    <InputController id="clinical.physicianPhone" title="Primary Care Phone Number" placeholder="Primary Care Phone Number" size={6} config={config}/>
                </Grid>
                <Typography variant="h6" sx={headerStyles}>Pre-Admission Assessment</Typography>
                <Grid container justifyContent={"left"} spacing={"1rem"} rowSpacing={"0.85rem"}>
                    <RadioGroupController 
                        id="clinical.preOpRequired" 
                        size={12} 
                        title="Is pre-admission assessment required for this patient?" 
                        options={preOpRequiredOptions} 
                        config={config}
                    />
                    {preOpRequired==="true" && (
                        <React.Fragment>
                            <DateController withTime id={'clinical.preOpForm.preOpDateTime'} title="Pre-Op Date" placeholder="Pre-Op Date" size={12} config={config}/>
                            <CheckboxController 
                                id={'clinical.preOpForm.atProcedureLocation'} 
                                title="At Procedure Location?" 
                                size={6} 
                                config={config}
                                onChange={onShowPreOpFacilityChange}
                            />
                            <Box width="100%"/>
                            {showPreOpLocation && (
                                <React.Fragment>
                                    <InputController id="clinical.preOpForm.facility.facilityName" title="Facility Name" placeholder="Facility Name" size={6} config={config}/>
                                    <InputController id="clinical.preOpForm.facility.phone" title="Facility Phone Number" placeholder="Facility Phone Number" size={6} config={config}/>
                                    <InputController id="clinical.preOpForm.facility.addressOne" title="Facility Address 1" placeholder="Facility Address 1" size={6} config={config}/>
                                    <InputController id="clinical.preOpForm.facility.addressTwo" title="Facility Address 2" placeholder="Facility Address 2" size={6} config={config}/>
                                    <InputController id="clinical.preOpForm.facility.city" title="City" placeholder="City" size={6} config={config}/>
                                    <InputController id="clinical.preOpForm.facility.state" title="State" placeholder="State" size={6} config={config}/>
                                    <InputController id="clinical.preOpForm.facility.zip" title="Zip" placeholder="Zip" size={6} config={config}/>
                                </React.Fragment>
                            )}
                        </React.Fragment>
                    )}
                </Grid>

                <Typography variant="h6" sx={headerStyles}>Pre-Admission Testing</Typography>
                <RadioGroupController 
                    id="clinical.diagnosticTestsRequired" 
                    size={12} title="Is pre-admission testing required for this patient?" 
                    options={diagnosticTestsRequiredOptions} 
                    config={config}
                />
                    {diagnosticTestsRequired==="true" && (
                        <Grid container justifyContent={"left"} spacing={"1rem"} rowSpacing={"0.85rem"} sx={{marginTop: '1rem'}}>
                            {diagnosticTestFields.map((item, index, itemList)=>{
                            const testNameIsOther = R.path([index, 'diagnosticTest', 'testName'], diagnosticTests) === 'Other';
                            const showTestLocation = !R.path([index, 'atProcedureLocation'], diagnosticTests);
                            return (
                                    <React.Fragment key={index}>
                                    <DropDownSearchController 
                                        {...item}
                                        title="Diagnostic Test"
                                        id={`clinical.diagnosticTests.${index}.diagnosticTest`}
                                        labelProperties={["testName"]}
                                        placeholder="Diagnostic Test" 
                                        queryKey="getDiagnosticTests"
                                        size={6} 
                                        config={config}
                                        onChange={onTestNameChange(index)}
                                    />
                                    {testNameIsOther && <InputController id={`clinical.diagnosticTests.${index}.testNameOther`} title="" placeholder="Test Name" size={6} config={config}/>}
                                    <Box width="100%"/>
                                    <DateController withTime id={`clinical.diagnosticTests.${index}.testDateTime`} title="Pre-Op Testing Date" placeholder="Pre-Op Testing Date" size={6} config={config}/>
                                    <CheckboxController 
                                        onChange={onShowTestFacilityChange(index)}
                                        id={`clinical.diagnosticTests.${index}.atProcedureLocation`} 
                                        title="At Procedure Location?" 
                                        size={12} 
                                        config={config}
                                    />
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
                                    <Grid item xs={12}>{(index+1 !== itemList.length) && <Divider light sx={{marginTop: "1.6rem", marginBottom: "3rem"}}/>}</Grid>
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
                <RadioGroupController 
                    id="clinical.clearanceRequired" 
                    size={12} 
                    title="Are clearances required for this patient?" 
                    options={clearanceRequiredOptions} 
                    config={config}
                />
                    {clearanceRequired==="true" && (
                        <Grid container justifyContent={"left"} spacing={"1rem"} rowSpacing={"0.85rem"} sx={{marginTop: '1rem'}}>
                            {clearanceFields.map((item, index, itemList)=>{
                            const clearanceNameIsOther = R.path([index, 'clearance', 'clearanceName'], clearances) === 'Other';
                            const showTestLocation = !R.path([index, 'atProcedureLocation'], clearances);
                            return (
                                    <React.Fragment key={index}>
                                    <DropDownSearchController 
                                        {...item}
                                        title="Clearance"
                                        id={`clinical.clearances.${index}.clearance`}
                                        labelProperties={["clearanceName"]}
                                        placeholder="Clearance" 
                                        queryKey="getClearances"
                                        size={6} 
                                        config={config}
                                        onChange={onClearanceNameChange(index)}
                                    />
                                    {clearanceNameIsOther && <InputController id={`clinical.clearances.${index}.clearanceNameOther`} title="" placeholder="Clearance Name" size={6} config={config}/>}
                                    <Box width="100%"/>
                                    <DateController withTime id={`clinical.clearances.${index}.clearanceDateTime`} title="Clearance Date" placeholder="Clearance Date" size={6} config={config}/>
                                    <InputController id={`clinical.clearances.${index}.physicianFirstName`} title="Provider First Name" placeholder="Provider First Name" size={6} config={config}/>
                                    <InputController id={`clinical.clearances.${index}.physicianLastName`} title="Provider Last Name" placeholder="Provider Last Name" size={6} config={config}/>
                                    <InputController id={`clinical.clearances.${index}.physicianPhone`} title="Provider Phone Number" placeholder="Provider Phone Number" size={6} config={config}/>
                                    <CheckboxController 
                                        onChange={onShowClearanceFacilityChange(index)}
                                        id={`clinical.clearances.${index}.atProcedureLocation`} 
                                        title="At Procedure Location?" 
                                        size={12} 
                                        config={config}
                                    />
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
                                    <Grid item xs={12}>{(index+1 !== itemList.length) && <Divider light sx={{marginTop: "1.6rem", marginBottom: "3rem"}}/>}</Grid>
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
                <Typography variant="h6" sx={headerStyles}>Post-Operative Care</Typography>
                <DateController withTime id={'clinical.postOpDateTime'} title="Post-Op Date" placeholder="Post-Op Date" size={6} config={config}/>
            </LocalizationProvider>
    )
}
