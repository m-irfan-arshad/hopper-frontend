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
import { useForm, useFieldArray } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { parseFieldConfig, getDirtyValues } from '../../utils/helpers';
import { useUpdateCaseHook } from '../../utils/hooks';
import { bookingSheetConfigObject } from '../../reference';
import PatientTab from './tabs/patientTab';
import FinancialTab from "./tabs/financialTab";
import { cases, insurances } from "@prisma/client";
import * as R from 'ramda';


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

const defaultInsuranceValue = {
    insurance: null,
    insuranceGroupName: '',
    insuranceGroupNumber: '',
    priorAuthApproved: '',
    priorAuthId: null,
    priorAuthDate: null,
}

function prepareCaseForApi(caseId: number, formData: any, dirtyFields: any) {
    let query: {caseId: number, patients?: object, insurances?: object} = {caseId: caseId};
    if (dirtyFields.patient) {
        query.patients = { update: {
            ...getDirtyValues(dirtyFields.patient, formData.patient),
            ...(dirtyFields.patient.sex && {sex: formData.patient.sex?.sex}),
            ...(dirtyFields.patient.state && {state: formData.patient.state?.state}),
        }}
    }
    
    if (dirtyFields.financial) {
        let newInsurances: object[] = [];
        let updateInsurances: object[] = [];
        formData.financial.forEach((insObj: any, index: number) => {
            const updatedFields = dirtyFields.financial[index]
            if (R.isNil(updatedFields)) return;

            let formattedFinancials = {
                ...getDirtyValues(updatedFields, insObj),
                ...(updatedFields.insurance && {insurance: insObj.insurance?.insurance}),
                ...(updatedFields.priorAuthApproved && {priorAuthApproved: insObj.priorAuthApproved?.priorAuthApproved}),
            };

            if (insObj.insuranceId) {
                updateInsurances.push({data: formattedFinancials, where: {insuranceId: insObj.insuranceId}})
            } else {
                newInsurances.push(formattedFinancials)
            } 
        })
        query.insurances = {create: newInsurances, update: updateInsurances}
    }

    console.log("query: ", query)
    return query
}

function prepareCaseForForm(data: any) {
    const parsedCase: any = {};
    parsedCase.patient = {
        ...data?.patients,
        ...(data?.patients.sex && {sex: {sex: data?.patients.sex}}),
        ...(data?.patients.state && {state: {state: data?.patients.state}})
    }

    if (!R.isEmpty(data.insurances)) {
        parsedCase.financial = [...data?.insurances].map((elem: any) => ({
            ...elem,
            ...(elem.insurance && {insurance: {insurance: elem.insurance}}),
            ...(elem.priorAuthApproved && {priorAuthApproved: {priorAuthApproved: elem.priorAuthApproved}})
        }))
    } else {
        parsedCase.financial = [defaultInsuranceValue]
    }
    return parsedCase;
}

export default function BookingSheetDialog(props: Props) {
  const {open, closeDialog, data, initiallySelectedTab} = props;
  const [selectedTab, selectTab] = useState(initiallySelectedTab);
  const {mutate} = useUpdateCaseHook()

    const { handleSubmit, control, reset, getValues, formState: { isValid, dirtyFields } } = useForm({ 
        mode: 'onChange',
        defaultValues: {
            patient: {
                dateOfBirth: null,
            },
            financial: [defaultInsuranceValue]
        }
    });

    const financialMethods = useFieldArray({control, name: "financial"});

    const onSubmit = async (formData: any) => {
        const query = prepareCaseForApi(data.caseId, formData, dirtyFields)
        await mutate(query)
        closeDialog()
      };
    
    useEffect(() => {
        if(data) reset(prepareCaseForForm(data));
    }, [data]);

    useEffect(() => {
        selectTab(initiallySelectedTab)
    }, [initiallySelectedTab]);

    const validForm = isValid && !R.isEmpty(dirtyFields)
    return (
        <Dialog maxWidth='lg' open={open} sx={{ "& .MuiPaper-root": { borderRadius: "0.625rem" }}}>
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
                        {`${data?.patients?.firstName} ${data?.patients?.lastName}`}
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
            <DialogContent sx={{height: "28rem", overflow: "scroll"}}>
                {selectedTab === "Patient" && <PatientTab config={bookingSheetConfigObject} control={control}/>}
                {selectedTab === "Financial" && <FinancialTab config={bookingSheetConfigObject} control={control} methods={financialMethods} defaultValue={defaultInsuranceValue}/>}
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
                disabled={!validForm}
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
