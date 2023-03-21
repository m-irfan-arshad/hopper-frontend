import React, {useEffect} from "react";
import { 
    Typography, 
    Grid, 
    Box
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import {InputController, DropDownSearchController} from '../../../utils/formControllers'
import { parseFieldConfig } from '../../../utils/helpers';
import { BookingSheetConfig } from "../../../reference";



interface Props {
    config: BookingSheetConfig,
}

export default function ProcedureTab(props: Props) {
    const {config} = props;

    return (
            <LocalizationProvider dateAdapter={AdapterMoment}>
                <Typography variant="h5" sx={{marginTop: "2.25rem", marginBottom: "2.25rem", color: "gray.dark"}}>Procedure</Typography>
                <Grid container justifyContent={"left"} spacing={"1rem"} rowSpacing={"0.85rem"}>
                    <DropDownSearchController 
                        title="Procedure"
                        id="procedureTab.procedure"
                        labelProperties={["procedureName"]}
                        placeholder="Procedure" 
                        queryKey="getProcedures"
                        size={12} 
                        config={config}
                    />
                    <DropDownSearchController 
                        title="Approach"
                        id="procedureTab.approach"
                        labelProperties={["approachName"]}
                        placeholder="Approach" 
                        queryKey="getApproaches"
                        size={6} 
                        config={config}
                    />
                    <DropDownSearchController 
                        title="Laterality"
                        id="procedureTab.laterality"
                        labelProperties={["lateralityName"]}
                        placeholder="Laterality" 
                        queryKey="getLateralities"
                        size={6} 
                        config={config}
                    />
                    <DropDownSearchController 
                        title="CPT"
                        id="procedureTab.cptCode"
                        labelProperties={["cptCodeName"]}
                        placeholder="CPT" 
                        queryKey="getCptCodes"
                        size={6} 
                        config={config}
                    />
                    <DropDownSearchController 
                        title="ICD"
                        id="procedureTab.icdCode"
                        labelProperties={["icdCodeName"]}
                        placeholder="ICD" 
                        queryKey="getIcdCodes"
                        size={6} 
                        config={config}
                    />
                    <DropDownSearchController 
                        title="Anesthesia"
                        id="procedureTab.anesthesia"
                        labelProperties={["anesthesiaName"]}
                        placeholder="Anesthesia" 
                        queryKey="getAnesthesia"
                        multiple
                        size={12} 
                        config={config}
                    />
                    <InputController 
                        title="Anesthesia Notes"
                        id="procedureTab.anesthesiaNotes"
                        placeholder="Anesthesia Notes" 
                        multiline
                        maxLength={300}
                        size={12} 
                        config={config}
                    />
                </Grid>
            </LocalizationProvider>
    )
}
