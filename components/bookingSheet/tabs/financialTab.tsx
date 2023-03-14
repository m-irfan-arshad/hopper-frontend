import React from "react";
import { 
    Typography, 
    Grid, 
    Box,
    Button,
    DialogActions,
    Divider
} from '@mui/material';
import { Add } from "@mui/icons-material";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { useFieldArray, useFormContext } from "react-hook-form";
import {InputController, DateController, DropDownSearchController} from '../../../utils/formControllers'
import { ConfigObject } from '../../../utils/helpers';
import { defaultInsuranceValue, priorAuthorizationData } from '../../../reference';


interface Props {
    config: ConfigObject,
}

export default function FinancialTab(props: Props) {
    const { control } = useFormContext();
    const { append, remove, fields } = useFieldArray({control, name: "financial"});

    return (
        <Box>
            <LocalizationProvider dateAdapter={AdapterMoment}>
                <Typography variant="h5" sx={{marginTop: "2.25rem", marginBottom: "2.25rem", color: "gray.dark" }}>Financial</Typography>
                {fields.map((item, index, itemList)=>(<React.Fragment key={item.id}>
                    <Grid container justifyContent={"left"} spacing={"1.25rem"} rowSpacing={"2.25rem"}>
                        <Grid item xs={12}>
                            <DropDownSearchController 
                                {...item}
                                title="Insurance"
                                id={`financial.${index}.insurance`}
                                labelProperties={["insuranceName"]}
                                placeholder="Insurance" 
                                queryKey="getInsurances"
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <InputController id={`financial.${index}.insuranceGroupName`} title="Insurance Group Name" placeholder="Insurance Group Name"/>
                        </Grid>
                        <Grid item xs={6}>
                            <InputController id={`financial.${index}.insuranceGroupNumber`} title="Insurance Group Number" placeholder="Insurance Group Number"/>
                        </Grid>
                        <Grid item xs={4}>
                            <DropDownSearchController 
                                {...item}
                                title="Prior Auth Approved"
                                id={`financial.${index}.priorAuthorization`}
                                options={priorAuthorizationData} 
                                labelProperties={["priorAuthorization"]}
                                placeholder="Prior Auth Approved" 
                            />
                        </Grid>
                        <Grid item xs={4}>
                            <InputController id={`financial.${index}.priorAuthId`} title="Prior Auth Id" placeholder="Prior Auth Id"/>
                        </Grid>
                        <Grid item xs={4}>
                            <DateController id={`financial.${index}.priorAuthDate`} title="Prior Auth Date" placeholder="Prior Auth Date" />
                        </Grid>
                    </Grid>
                    {(index+1 !== itemList.length) && <Divider light sx={{marginTop: "3rem", marginBottom: "3rem"}}/>}
                </React.Fragment>))}
                <DialogActions sx={{ minHeight: "5rem", justifyContent: "flex-start", marginTop: "4rem" }}>
                    <Button 
                        variant="contained" 
                        onClick={()=>append(defaultInsuranceValue)}
                        startIcon={<Add />}
                        disabled={false}
                        size="small"
                        sx={{
                            backgroundColor: "blue.dark",
                            marginRight: "1.75rem",
                        }}>
                        Add Insurance
                    </Button>
                </DialogActions>
            </LocalizationProvider>
        </Box>
    )
}
