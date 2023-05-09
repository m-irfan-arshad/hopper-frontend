import React, {useState, useEffect} from "react";
import { 
    Dialog, 
    DialogActions, 
    DialogContent, 
    DialogTitle,
    IconButton,
    Tabs,
    Tab,
    Box,
    Typography,
    styled,
    Button
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useForm, FormProvider } from "react-hook-form";
import { createValidationObject, formArrayToPrismaQuery, formObjectToPrismaQuery, getDifference, clinicalTabToPrismaQuery, procedureTabToPrismaQuery, patientTabToPrismaQuery } from '../../utils/helpers';
import { useGetBookingSheetConfigHook, useUpdateCaseHook } from '../../utils/hooks';
import { defaultBookingSheetConfig, defaultDiagnosticTest, defaultInsuranceValue, defaultClearance, defaultPreOpForm, BookingSheetConfig, defaultPatientAddress, defaultPhone } from '../../reference';
import * as R from 'ramda';
import { yupResolver } from "@hookform/resolvers/yup";
import PatientTab from './tabs/patientTab';
import FinancialTab from "./tabs/financialTab";
import SchedulingTab from "./tabs/schedulingTab";
import ProcedureTab from "./tabs/procedureTab";
import ClinicalTab from "./tabs/clinicalTab";
import ProductTab from "./tabs/productTab";
import { phone } from "@prisma/client";

interface Props {
    open: boolean
    closeDialog: () => void,
    data: any,
    initiallySelectedTab: string,
    bookingSheetConfig: BookingSheetConfig
}

const StyledTab = styled(Tab)({
    padding: 0,
    width: "10.938rem",
    textTransform: "capitalize"
});

function prepareFormForSubmission(caseId: number, formData: any, defaultFields: any) {
    let query: any = {caseId: caseId, ...getDifference(defaultFields, formData, ['facilityId'])};
    query.scheduling && (query.scheduling = formObjectToPrismaQuery(query.scheduling, "schedulingId"))
    query.patient && (query.patient = patientTabToPrismaQuery(query.patient, formData.patient))
    query.procedureTab && (query.procedureTab = procedureTabToPrismaQuery(query.procedureTab, formData.procedureTab))
    query.financial && (query.financial = formArrayToPrismaQuery(formData.financial, 'financialId'))
    query.productTab && (query.productTab = formArrayToPrismaQuery(formData.productTab, 'productTabId'))
    query.clinical && (query.clinical = clinicalTabToPrismaQuery(query.clinical, formData.clinical))
    return query
}

function prepareFormForRender(data: any) {
    const parsedCase: any = data;

    if (R.isEmpty(data.financial)) {
        parsedCase.financial = [defaultInsuranceValue]
    } else {
        parsedCase.financial = parsedCase.financial.map((insurance: any) => {
            if (typeof insurance.priorAuthorization === 'object') {
                return insurance
            } else {
                return {...insurance, priorAuthorization: {"priorAuthorization": insurance.priorAuthorization}}
            }
        })
    }

    if (R.isEmpty(data.patient.address)) {
        parsedCase.patient.address = [defaultPatientAddress]
    }

    if (R.isEmpty(data.patient.phone)) {
        parsedCase.patient.phone = [defaultPhone]
    } else {
        parsedCase.patient.phone = parsedCase.patient.phone.map((phone: phone) => {
            if (typeof phone.type === 'object') {
                return phone
            } else {
                return {...phone, type: {"type": phone.type}}
            }
        })
    }

    if (R.isEmpty(data.clinical.preOpForm)) {
        parsedCase.clinical.preOpForm = defaultPreOpForm
    }

    if (R.isEmpty(data.clinical.diagnosticTests)) {
        parsedCase.clinical.diagnosticTests = [defaultDiagnosticTest]
    }

    if (R.isEmpty(data.clinical.clearances)) {
        parsedCase.clinical.clearances = [defaultClearance]
    }

    return parsedCase;
}

export default function BookingSheetDialog(props: Props) {
    const {open, closeDialog, data, initiallySelectedTab, bookingSheetConfig} = props;
    const [selectedTab, selectTab] = useState(initiallySelectedTab);
    const {mutate} = useUpdateCaseHook();
    const validationSchema = createValidationObject(bookingSheetConfig);

    const form = useForm({ 
        mode: 'onChange',
        defaultValues: validationSchema.cast({}),
        resolver: yupResolver(validationSchema, { stripUnknown: true, abortEarly: false }),
    });
    const { handleSubmit, control, reset, getValues, formState: { errors, isValid, dirtyFields, defaultValues } } = form;
    
    const onSubmit = async () => {
        const query = prepareFormForSubmission(data.caseId, getValues(), defaultValues)
        reset({}, { keepValues: true }) // resets dirty fields
        await mutate(query)
        closeDialog()
        selectTab(initiallySelectedTab)
    };
        
    //populate form with data from API
    useEffect(() => {
        if(data) reset(prepareFormForRender(data), {keepDirty: true});
    }, [data]);

    useEffect(() => {
        selectTab(initiallySelectedTab)
    }, [initiallySelectedTab]);

    const validForm = isValid && !R.isEmpty(dirtyFields)
    return (
        <Dialog maxWidth='lg' open={open} sx={{ "& .MuiPaper-root": { borderRadius: "0.625rem", width: "100%" }}}>
            <DialogTitle 
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    borderBottom: "0.063rem solid", 
                    borderColor: "gray.main",
                    paddingBottom: 0,
                    paddingRight: 0,
                    paddingLeft: 0
                }}> 
                <Box sx={{display: "flex", flexDirection: "row", justifyContent: "space-between"}}>
                    <Typography variant="overline" sx={{marginLeft: "2rem", textTransform: "uppercase", padding: "0.5rem"}} >
                        {`${data?.patient?.firstName} ${data?.patient?.lastName}`}
                    </Typography>
                    <IconButton sx={{marginRight: "2.5rem", height: "2.5rem"}} onClick={closeDialog}>
                        <CloseIcon />
                    </IconButton>
                </Box>
                <Box>
                    <Tabs variant="fullWidth" value={selectedTab} onChange={(event, value) => selectTab(value)}> 
                        <StyledTab label="Patient" value="Patient" /> 
                        <StyledTab label="Financial" value="Financial"   />
                        <StyledTab label="Procedure" value="Procedure"  />
                        <StyledTab label="Scheduling" value="Scheduling" />
                        <StyledTab label="Products" value="Products"  />
                        <StyledTab label="Clinical" value="Clinical" />
                    </Tabs>
                </Box>
            </DialogTitle>
            <DialogContent sx={{height: "30rem", overflowY: "scroll", padding: "2rem", width: "100%"}}>
                <FormProvider {...form}>
                    {selectedTab === "Patient" && <PatientTab config={bookingSheetConfig}/>}
                    {selectedTab === "Financial" &&  <FinancialTab config={bookingSheetConfig}/>}
                    {selectedTab === "Procedure" &&  <ProcedureTab config={bookingSheetConfig} />}
                    {selectedTab === "Scheduling" &&  <SchedulingTab config={bookingSheetConfig} />}
                    {selectedTab === "Products" &&  <ProductTab />}
                    {selectedTab === "Clinical" &&  <ClinicalTab config={bookingSheetConfig} />}
                </FormProvider>
            </DialogContent>
            <DialogActions 
                sx={{
                    borderTop: "0.063rem solid", 
                    padding: "0.625rem", 
                    borderColor: "gray.main",
                    minHeight: "5rem"
                }}>
                    <Button 
                variant="contained" 
                onClick={handleSubmit(onSubmit, onSubmit)}
                disabled={false}
                sx={{
                    backgroundColor: "blue.main",
                    border: 1,
                    borderColor: validForm ? "blue.main" : "grey",
                    marginRight: "1.75rem",
                }}>
                    Save
                </Button>
            </DialogActions>
        </Dialog>
    );
}
