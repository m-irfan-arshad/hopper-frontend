import React, {useEffect} from "react";
import { 
    Typography, 
    Grid, 
    Box
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import {InputController, DateController, DropDownSearchController} from '../../../utils/formControllers'
import { parseFieldConfig, ConfigObject } from '../../../utils/helpers';


interface Props {
    config: ConfigObject,
}

export default function ProcedureTab(props: Props) {
    const {config} = props;

    return (
            <LocalizationProvider dateAdapter={AdapterMoment}>
                <Typography variant="h5" sx={{marginTop: "2.25rem", marginBottom: "2.25rem", color: "gray.dark"}}>Procedure</Typography>
                <Grid container justifyContent={"left"} spacing={"1rem"} rowSpacing={"2.25rem"}>
                    <Grid item xs={12}>
                        <DropDownSearchController 
                            title="Procedure"
                            id="procedureTab.procedure"
                            labelProperties={["procedureName"]}
                            placeholder="Procedure" 
                            queryKey="getProcedures"
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <DropDownSearchController 
                            title="Approach"
                            id="procedureTab.approach"
                            labelProperties={["approachName"]}
                            placeholder="Approach" 
                            queryKey="getApproaches"
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <DropDownSearchController 
                            title="Laterality"
                            id="procedureTab.laterality"
                            labelProperties={["lateralityName"]}
                            placeholder="Laterality" 
                            queryKey="getLateralities"
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <DropDownSearchController 
                            title="Anesthesia"
                            id="procedureTab.anesthesia"
                            labelProperties={["anesthesiaName"]}
                            placeholder="Anesthesia" 
                            queryKey="getAnesthesia"
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <InputController 
                            title="Anesthesia Notes"
                            id="procedureTab.anesthesiaNotes"
                            placeholder="Anesthesia Notes" 
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <DropDownSearchController 
                            title="CPT"
                            id="procedureTab.cptCode"
                            labelProperties={["cptCodeName"]}
                            placeholder="CPT" 
                            queryKey="getCptCodes"
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <DropDownSearchController 
                            title="ICD"
                            id="procedureTab.icdCode"
                            labelProperties={["icdCodeName"]}
                            placeholder="ICD" 
                            queryKey="getIcdCodes"
                        />
                    </Grid>
                </Grid>
            </LocalizationProvider>
    )
}
