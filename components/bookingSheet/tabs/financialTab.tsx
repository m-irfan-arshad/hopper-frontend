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
import { Control, useFieldArray, UseFieldArrayReturn } from "react-hook-form";
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import {InputController, DateController, DropDownSearchController} from '../../../utils/formControllers'
import { parseFieldConfig, ConfigObject } from '../../../utils/helpers';
import { insuranceData, priorAuthApprovedData } from '../../../reference';


interface Props {
    form: any,
    config: ConfigObject,
    methods: UseFieldArrayReturn<any, any>
    defaultValue: object
}

export default function FinancialTab(props: Props) {
    const {form, config, methods, defaultValue} = props;
    const { append, remove, fields } = methods;
    const {control, unregister, register} = form;

    return (
        <Box>
            <LocalizationProvider dateAdapter={AdapterMoment}>
                <Typography variant="h5" sx={{marginTop: "2rem", marginBottom: "2rem", color: "gray.dark" }}>Financial</Typography>
                {fields.map((item, index, itemList)=>(<React.Fragment key={'' + item.id + index}>
                    <Grid container justifyContent={"left"} spacing={"1rem"} rowSpacing={"1.3rem"}>
                        <Grid item xs={12}>
                            <DropDownSearchController 
                                {...item}
                                title="Insurance"
                                control={control}
                                id={`financial.${index}.insurance`}
                                options={insuranceData} 
                                labelProperties={["insurance"]}
                                placeholder="Insurance" 
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
                                id={`financial.${index}.priorAuthApproved`}
                                options={priorAuthApprovedData} 
                                labelProperties={["priorAuthApproved"]}
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
                <DialogActions sx={{ minHeight: "5rem", justifyContent: "flex-start", marginTop: "2rem" }}>
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
