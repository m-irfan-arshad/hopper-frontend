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
import { useForm, useFieldArray, FormProvider } from "react-hook-form";
import { getDirtyValues } from '../../utils/helpers';
import { useUpdateCaseHook } from '../../utils/hooks';
import { bookingSheetConfigObject, defaultInsuranceValue } from '../../reference';
import PatientTab from './tabs/patientTab';
import FinancialTab from "./tabs/financialTab";
import * as R from 'ramda';
import SchedulingTab from "./tabs/schedulingTab";
import ProcedureTab from "./tabs/procedureTab";

interface Props {
    open: boolean
    closeDialog: () => void,
    data: any
    initiallySelectedTab: string
}

const StyledTab = styled(Tab)({
    padding: 0,
    width: "10.938rem",
    textTransform: "capitalize"
});

function prepareFormForSubmission(caseId: number, formData: any, dirtyFields: any) {
    let query: any = {caseId: caseId, ...getDirtyValues(dirtyFields, formData)};
    
    if (dirtyFields.financial) {
        let newInsurances: object[] = [];
        let updateInsurances: object[] = [];
        formData.financial.forEach((insObj: any, index: number) => {
            const updatedFields = dirtyFields.financial[index]
            if (R.isNil(updatedFields)) return; // check if any fields in this insurance was updated

            let formattedFinancials: any = getDirtyValues(updatedFields, insObj);
            formattedFinancials.priorAuthorization && (formattedFinancials.priorAuthorization = formattedFinancials.priorAuthorization.priorAuthorization);
            formattedFinancials.insurance && (formattedFinancials.insuranceId = formattedFinancials.insurance.insuranceId);
            delete formattedFinancials.insurance;

            if (insObj.financialId) { //if there is financialId present, update. Otherwise create
                delete formattedFinancials.financialId;
                delete formattedFinancials.caseId;
                updateInsurances.push({data: formattedFinancials, where: {financialId: insObj.financialId}})
            } else {
                newInsurances.push(formattedFinancials)
            } 
        })
        query.financial = {create: newInsurances, update: updateInsurances}
    }

    return query
}

function prepareFormForRender(data: any) {
    const parsedCase: any = data;

    if (R.isEmpty(data.financial)) {
        parsedCase.financial = [defaultInsuranceValue]
    } else {
        parsedCase.financial = parsedCase.financial.map((insurance: any) => ({...insurance, priorAuthorization: {"priorAuthorization": insurance.priorAuthorization}}))
    }

    return parsedCase;
}

export default function BookingSheetDialog(props: Props) {
    const {open, closeDialog, data, initiallySelectedTab} = props;
    const [selectedTab, selectTab] = useState(initiallySelectedTab);
    const {mutate} = useUpdateCaseHook()

    const form = useForm({ 
        mode: 'onChange',
        defaultValues: {
            patient: {
                firstName: '',
                middleName: '',
                lastName: '',
                dateOfBirth: null,
                sex: null,
                address: '',
                city: '',
                state: null,
                zip: ''
            },
            financial: [{...defaultInsuranceValue}],
            procedureTab: {
                procedure: null,
                approach: null,
                laterality: null,
                anesthesia: null,
                cptCode: null,
                icdCode: null
            },
            scheduling: {
                location: null,
                procedureUnit: null,
                serviceLine: null,
                provider: null,
                procedureDate: null,
                admissionType: null
            }
        }
    });
    const { handleSubmit, control, reset, getValues, formState: { errors, isValid, dirtyFields } } = form;

    const onSubmit = async (formData: any) => {
        const query = prepareFormForSubmission(data.caseId, formData, dirtyFields)
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
        <Dialog maxWidth='lg' open={open} sx={{ "& .MuiPaper-root": { borderRadius: "0.625rem", maxWidth: "60rem" }}}>
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
                <Box sx={{display: "flex", flexDirection: "row", justifyContent: "space-between", marginBottom: "2rem"}}>
                    <Typography variant="overline" sx={{marginLeft: "2rem", textTransform: "uppercase", padding: "0.5rem"}} >
                        {`${data?.patient?.firstName} ${data?.patient?.lastName}`}
                    </Typography>
                    <IconButton sx={{marginRight: "2.5rem", height: "2.5rem"}} onClick={closeDialog}>
                        <CloseIcon />
                    </IconButton>
                </Box>
                <Box>
                    <Tabs value={selectedTab} onChange={(event, value) => selectTab(value)}> 
                        <StyledTab label="Patient" value="Patient" /> 
                        <StyledTab label="Financial" value="Financial"   />
                        <StyledTab label="Procedure" value="Procedure"  />
                        <StyledTab label="Scheduling" value="Scheduling" />
                        <StyledTab label="Implants & Products" value="Implants & Products"  />
                        <StyledTab label="Clinical" value="Clinical" />
                    </Tabs>
                </Box>
            </DialogTitle>
            <DialogContent sx={{height: "30rem", overflowY: "scroll", padding: "2rem"}}>
                <FormProvider {...form}>
                    {selectedTab === "Patient" && <PatientTab config={bookingSheetConfigObject}/>}
                    {selectedTab === "Financial" &&  <FinancialTab config={bookingSheetConfigObject}/>}
                    {selectedTab === "Procedure" &&  <ProcedureTab config={bookingSheetConfigObject} />}
                    {selectedTab === "Scheduling" &&  <SchedulingTab config={bookingSheetConfigObject} />}
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
                onClick={handleSubmit(onSubmit)}
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
