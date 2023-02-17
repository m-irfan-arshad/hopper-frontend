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
    control: Control<any, any>,
    config: ConfigObject,
    methods: UseFieldArrayReturn<any, any>
    defaultValue: object
}

export default function FinancialTab(props: Props) {
    const {control, config, methods, defaultValue} = props;
    const { append, remove, fields } = methods;
    const gridStyles = {
    }

    return (
        <Box>
            <LocalizationProvider dateAdapter={AdapterMoment}>
                <Typography variant="h5" sx={{marginTop: "2rem", marginBottom: "2rem", color: "gray.dark" }}>Financial</Typography>
                {fields.map((item, index)=>(<React.Fragment>
                    <Grid key={'' + item.id + index} container justifyContent={"left"} spacing={"1rem"} rowSpacing={"1rem"} sx={gridStyles}>
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
                    <Divider light sx={{marginTop: "2rem", marginBottom: "2rem"}}/>
                </React.Fragment>))}
                <DialogActions sx={{ minHeight: "5rem", justifyContent: "flex-start" }}>
                    <Button 
                        variant="contained" 
                        onClick={()=>{append(defaultValue)}}
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
