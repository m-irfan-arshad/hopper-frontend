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
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import PatientTab from './tabs/patientTab';
import { parseFieldConfig } from '../../utils/helpers';
import { useUpdateCaseHook } from '../../utils/hooks';




interface Props {
    open: boolean
    closeDialog: () => void,
    data: any
    initiallySelectedTab: string
}

const configObject = {
    organization: "...",
    tabs: [
        {
            label: "Patient",
            fields: [
                {
                    id: "firstName",
                    required: true,
                    visible: true
                },
            ]
        }  
    ]
}



export default function BookingSheetDialog(props: Props) {
  const {open, closeDialog, data, initiallySelectedTab} = props;
  const [selectedTab, selectTab] = useState(initiallySelectedTab);
  const {mutate} = useUpdateCaseHook()

  const onSubmit = async (data: any) => {
    mutate({patients: data})
  };

  const schema = yup.object().shape({
        patient: yup.object().shape({
            firstName: yup.string().when([], { is: parseFieldConfig(configObject, 'Patient', 'firstName', 'required'), then: yup.string().required() }),
            middleName: yup.string().required(),
            lastName: yup.string().required(),
            dateOfBirth: yup.date().required(),
            address: yup.string().required(),
            city: yup.string().required(),
            state: yup.string().required(),
            zip: yup.string().required() //.matches(/^[0-9]+$/).min(5).max(5),
        }),
    });

    const { handleSubmit, control, reset, formState: { isValid, dirtyFields } } = useForm({ 
        mode: 'onChange',
        resolver: yupResolver(schema),
        defaultValues: {
            patient: {
                dateOfBirth: null,
            }
        }
    });

    useEffect(() => {
        if (data) {
            reset({
                'patient': data?.patients
            });
        }
    }, [data]); 

  useEffect(() => {
    selectTab(initiallySelectedTab)
  }, [initiallySelectedTab]);

  const StyledTab = styled(Tab)({
    padding: 0,
    width: "10.938rem",
    textTransform: "capitalize"
  });

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
        <DialogContent sx={{minHeight: "20rem"}}>
            {selectedTab === "Patient" && (
                <PatientTab config={configObject} control={control}/>
            )}
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
            disabled={!isValid}
            sx={{
                backgroundColor: "blue.main",
                border: 1,
                borderColor: isValid ? "blue.main" : "grey",
                marginRight: "1.75rem",
            }}>
                Save
            </Button>
        </DialogActions>
      </Dialog>
  );
}
