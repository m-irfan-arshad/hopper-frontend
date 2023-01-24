import React from "react";
import { 
    DateRange as DateRangeIcon,
    AccountBox as AccountBoxIcon,
    Assignment as AssignmentIcon
} from "@mui/icons-material";
import { Typography, Grid } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { SingleCase } from "../reference";
import DottedDivider from "./shared/dottedDivider";

interface SectionHeaderProps {
    title: string;
    icon: React.ReactNode;
}

interface Props {
    row: SingleCase
}

export default function CaseSummaryContent(props: Props) {
    const {row} = props;

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
    

return (
    <LocalizationProvider dateAdapter={AdapterMoment}>
        <SectionHeader title={"Procedure Information"} icon={<AccountBoxIcon sx={{marginRight: "0.313rem"}}/>}/>
            <Grid container spacing={"1rem"}>
                <Grid item xs={6}>
                    <Typography variant="caption">Patient Name</Typography>
                    <Typography variant="body2">{`${row.patients?.firstName} ${row.patients?.lastName}`}</Typography>
                </Grid>
                <Grid item xs={6}>
                    <Typography variant="caption">DOB</Typography>
                    <Typography variant="body2">{row.patients?.dateOfBirth || 'N/A'}</Typography>
                </Grid>
                <Grid item xs={6}>
                    <Typography variant="caption">Patient Address</Typography>
                    <Typography variant="body2">{row.patients?.address || 'N/A'}</Typography>
                </Grid>
                <Grid item xs={6}>
                    <Typography variant="caption">Patient Phone</Typography>
                    <Typography variant="body2">{`Mobile: ${row.patients?.mobilePhone || 'N/A'}`}</Typography>
                    <Typography variant="body2">{`Home: ${row.patients?.homePhone || 'N/A'}`}</Typography>
                </Grid>
            </Grid>
        <DottedDivider />
        <SectionHeader title={"Scheduling"} icon={<DateRangeIcon sx={{marginRight: "0.313rem"}}/>}/>               
            <Grid container spacing={"1rem"}>
                <Grid item xs={6}>
                    <Typography variant="caption">Procedure Date and Time</Typography>
                    <Typography variant="body2">{row.procedureDate || 'N/A'}</Typography>
                </Grid>
            </Grid>
        <DottedDivider />
        <SectionHeader title={"Procedure Details"} icon={<AssignmentIcon sx={{marginRight: "0.313rem"}}/>}/>               
            <Grid container spacing={"1rem"}>
                <Grid item xs={6}>
                    <Typography variant="caption">Site</Typography>
                    <Typography variant="body2">{row.locationName || 'N/A'}</Typography>
                </Grid>
                <Grid item xs={6}>
                    <Typography variant="caption">Surgeon Name</Typography>
                    <Typography variant="body2">{row.providerName || 'N/A'}</Typography>
                </Grid>
            </Grid> 
    </LocalizationProvider>
    );
}