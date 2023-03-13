import React, {useEffect} from "react";
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
import { Control, UseFieldArrayReturn } from "react-hook-form";
import {InputController, DateController, DropDownSearchController} from '../../../utils/formControllers'
import { ConfigObject } from '../../../utils/helpers';
import { priorAuthorizationData } from '../../../reference';


interface Props {
    control: Control<any, any>,
    config: ConfigObject,
    methods: UseFieldArrayReturn<any, any>,
    defaultValue: object,
    getValues: any
}

export default function FinancialTab(props: Props) {
    const {control, config, methods, defaultValue, getValues} = props;
    const { append, remove, fields } = methods;

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
                                control={control}
                                id={`financial.${index}.insurance`}
                                labelProperties={["insuranceName"]}
                                placeholder="Insurance" 
                                queryKey="getInsurances"
                                getValues={getValues}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <InputController control={control} id={`financial.${index}.insuranceGroupName`} title="Insurance Group Name" placeholder="Insurance Group Name"/>
                        </Grid>
                        <Grid item xs={6}>
                            <InputController control={control} id={`financial.${index}.insuranceGroupNumber`} title="Insurance Group Number" placeholder="Insurance Group Number"/>
                        </Grid>
                        <Grid item xs={4}>
                            <DropDownSearchController 
                                {...item}
                                title="Prior Auth Approved"
                                control={control}
                                id={`financial.${index}.priorAuthorization`}
                                options={priorAuthorizationData} 
                                labelProperties={["priorAuthorization"]}
                                placeholder="Prior Auth Approved" 
                            />
                        </Grid>
                        <Grid item xs={4}>
                            <InputController control={control} id={`financial.${index}.priorAuthId`} title="Prior Auth Id" placeholder="Prior Auth Id"/>
                        </Grid>
                        <Grid item xs={4}>
                            <DateController control={control} id={`financial.${index}.priorAuthDate`} title="Prior Auth Date" placeholder="Prior Auth Date" />
                        </Grid>
                    </Grid>
                    {(index+1 !== itemList.length) && <Divider light sx={{marginTop: "3rem", marginBottom: "3rem"}}/>}
                </React.Fragment>))}
                <DialogActions sx={{ minHeight: "5rem", justifyContent: "flex-start", marginTop: "4rem" }}>
                    <Button 
                        variant="contained" 
                        onClick={()=>append(defaultValue)}
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
