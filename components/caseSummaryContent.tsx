import React from "react";
import { 
    DateRange as DateRangeIcon,
    AccountBox as AccountBoxIcon,
    Assignment as AssignmentIcon
} from "@mui/icons-material";
import { Typography, Grid } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import DottedDivider from "./shared/dottedDivider";
import {formatDate} from "../utils/helpers";
import {FullCase} from '../reference';
import * as R from "ramda";

interface SectionHeaderProps {
    title: string;
    icon: React.ReactNode;
}

interface Props {
    row: FullCase
}

export default function CaseSummaryContent(props: Props) {
    const {row} = props;
    const {patient, scheduling} = row;
    const {provider, location, procedureDate} = scheduling;
    
    const SectionHeader = (props: SectionHeaderProps) => {
        const {title, icon} = props;
        return (
            <Typography 
                variant="subtitle2" 
                sx={{
                    display: "flex", 
                    alignItems: "center", 
                    marginTop: "1.5rem",
                    marginBottom: "0.75rem",
                }}>                
                {icon}
                {title} 
            </Typography> 
        )
      }

      //@ts-ignore
      const phoneType = patient?.phone[0].type?.type;
      const phoneDisplay = (patient.phone && !R.isEmpty(patient?.phone)) ? phoneType  + ": " + patient?.phone[0].phoneNumber : "N/A";
      const addressDisplay = (patient.address && !R.isEmpty(patient?.address)) ? patient?.address[0].addressOne : 'N/A'

return (
    <LocalizationProvider dateAdapter={AdapterMoment}>
        <SectionHeader title={"Procedure Information"} icon={<AccountBoxIcon sx={{marginRight: "0.313rem"}}/>}/>
            <Grid container spacing={"1rem"}>
                <Grid item xs={6}>
                    <Typography variant="caption">Patient Name</Typography>
                    <Typography variant="body2">{`${patient?.firstName} ${row.patient?.lastName}`}</Typography>
                </Grid>
                <Grid item xs={6}>
                    <Typography variant="caption">DOB</Typography>
                    <Typography variant="body2">{formatDate(patient?.dateOfBirth) || 'N/A'}</Typography>
                </Grid>
                <Grid item xs={6}>
                    <Typography variant="caption">Patient Address</Typography>
                    <Typography variant="body2">{addressDisplay}</Typography>
                </Grid>
                <Grid item xs={6}>
                    <Typography variant="caption">Patient Phone</Typography>
                    <Typography variant="body2">{phoneDisplay}</Typography>
                </Grid>
            </Grid>
        <DottedDivider additionalStyles={{marginTop: "2rem"}} />
        <SectionHeader title={"Scheduling"} icon={<DateRangeIcon sx={{marginRight: "0.313rem"}}/>}/>               
            <Grid container spacing={"1rem"}>
                <Grid item xs={6}>
                    <Typography variant="caption">Procedure Date and Time</Typography>
                    <Typography variant="body2">{formatDate(procedureDate) || 'N/A'}</Typography>
                </Grid>
            </Grid>
        <DottedDivider additionalStyles={{marginTop: "2rem"}} />
        <SectionHeader title={"Procedure Details"} icon={<AssignmentIcon sx={{marginRight: "0.313rem"}}/>}/>               
            <Grid container spacing={"1rem"}>
                <Grid item xs={6}>
                    <Typography variant="caption">Site</Typography>
                    <Typography variant="body2">{location?.locationName || 'N/A'}</Typography>
                </Grid>
                <Grid item xs={6}>
                    <Typography variant="caption">Surgeon Name</Typography>
                    <Typography variant="body2">{provider ? (provider.lastName+", "+provider.firstName) : 'N/A'}</Typography>
                </Grid>
            </Grid> 
    </LocalizationProvider>
    );
}