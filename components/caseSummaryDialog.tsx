import React from "react";
import { 
    DateRange as DateRangeIcon,
    AccountBox as AccountBoxIcon,
    Assignment as AssignmentIcon,
    Reply as ReplyIcon
} from "@mui/icons-material";
import { 
    Typography, 
    Grid, 
    Button, 
    Dialog, 
    DialogActions, 
    DialogContent, 
    DialogTitle,
    Box
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { SingleCase } from "../reference";
import DottedDivider from "./shared/dottedDivider";

interface Props {
    open: boolean
    closeDialog: () => void,
    row: SingleCase
}

interface SectionHeaderProps {
    title: string;
    icon: React.ReactNode;
  }

export default function CaseSummaryDialog(props: Props) {
  const {open, closeDialog, row} = props;

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
      <Dialog fullWidth open={open} maxWidth="sm" sx={{ "& .MuiPaper-root": { borderRadius: "0.625rem" }}}>
        <DialogTitle 
            sx={{
                backgroundColor: "blue.dark", 
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
            }}>
            <Box sx={{display: "flex", flexDirection: "column"}}>
                <Typography variant="body1" color="white.main">{`${row.lastName}, ${row.firstName}`}</Typography>
                <Typography
                    variant="caption"
                    color="white.main"
                >
                    {`${row.dateOfBirth} - ${row.mrn}`}
                </Typography>
            </Box>
            <Button 
                variant="contained" 
                endIcon={<ReplyIcon sx={{transform: "scaleX(-1)", height: "1rem", width: "1rem"}} />}
                color="success"
                >
                    View Full Case
            </Button>
        </DialogTitle>
        <DialogContent>
            <LocalizationProvider dateAdapter={AdapterMoment}>
                <SectionHeader title={"Procedure Information"} icon={<AccountBoxIcon sx={{marginRight: "0.313rem"}}/>}/>
                <Grid container spacing={"1rem"}>
                    <Grid item xs={6}>
                        <Typography variant="caption">Patient Name</Typography>
                        <Typography variant="body2">{`${row.firstName} ${row.lastName}`}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="caption">DOB</Typography>
                        <Typography variant="body2">{row.dateOfBirth || 'N/A'}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="caption">Patient Address</Typography>
                        <Typography variant="body2">{row.patientAddress || 'N/A'}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="caption">Special Needs</Typography>
                        <Typography variant="body2">{row.specialNeeds || 'N/A'}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="caption">Patient Phone</Typography>
                        <Typography variant="body2">{`Mobile: ${row.mobilePhone || 'N/A'}`}</Typography>
                        <Typography variant="body2">{`Home: ${row.homePhone || 'N/A'}`}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="caption">Allergies</Typography>
                        <Typography variant="body2">{row.allergies || 'N/A'}</Typography>
                    </Grid>
                </Grid>
                <DottedDivider />
                <SectionHeader title={"Scheduling"} icon={<DateRangeIcon sx={{marginRight: "0.313rem"}}/>}/>               
                <Grid container spacing={"1rem"}>
                    <Grid item xs={6}>
                        <Typography variant="caption">Procedure Date and Time</Typography>
                        <Typography variant="body2">{row.procedureDate || 'N/A'}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="caption">Length of Surgery</Typography>
                        <Typography variant="body2">{row.surgeryLength || 'N/A'}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="caption">Comments</Typography>
                        <Typography variant="body2">{row.comments || 'N/A'}</Typography>
                    </Grid>
                </Grid>
                <DottedDivider />
                <SectionHeader title={"Procedure Details"} icon={<AssignmentIcon sx={{marginRight: "0.313rem"}}/>}/>               
                <Grid container spacing={"1rem"}>
                    <Grid item xs={6}>
                        <Typography variant="caption">Site</Typography>
                        <Typography variant="body2">{row.procedureLocation || 'N/A'}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="caption">Surgeon Name</Typography>
                        <Typography variant="body2">{row.proceduralist || 'N/A'}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="caption">Admission Type</Typography>
                        <Typography variant="body2">{row.admissionType || 'N/A'}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="caption">Surgical Assistance</Typography>
                        <Typography variant="body2">{row.surgeryAssistance || 'N/A'}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="caption">Procedures</Typography>
                        <Typography variant="body2">{row.procedures || 'N/A'}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="caption">Anesthesia Notes</Typography>
                        <Typography variant="body2">{row.notes || 'N/A'}</Typography>
                    </Grid>
                </Grid> 
            </LocalizationProvider>
        </DialogContent>
        <DialogActions 
            sx={{
                display: "flex", 
                justifyContent: "flex-start", 
                alignItems: "center", 
                borderTop: "0.063rem solid", 
                padding: "0.625rem", 
                borderColor: "blue.light"
            }}>
            <Button 
                onClick={() => closeDialog()}
                sx={{ color: "blue.main", padding: "0.625rem"}}
            >
                Cancel
            </Button>
        </DialogActions>
      </Dialog>
  );
}
