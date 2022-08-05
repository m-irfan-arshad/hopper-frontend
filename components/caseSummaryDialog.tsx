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

export default function CaseSummaryDialog(props: Props) {
  const {open, closeDialog, row} = props;

  return (
      <Dialog fullWidth open={open} maxWidth="sm" sx={{ "& .MuiPaper-root": { borderRadius: "0.625rem" }}}>
        <DialogTitle 
            sx={{
                backgroundColor: "blue.dark", 
                color: "white.main",
                fontSize: "1rem",
                fontWeight: "400",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
            }}>
            <Box sx={{display: "flex", flexDirection: "column"}}>
                <Typography variant="h2">{`${row.lastName}, ${row.firstName}`}</Typography>
                <Typography
                    variant="title2"
                >
                    {`${row.dateOfBirth} - ${row.mrn}`}
                </Typography>
            </Box>
            <Button 
                variant="contained" 
                endIcon={<ReplyIcon sx={{transform: "scaleX(-1)", height: "1rem", width: "1rem"}} />}
                sx={{
                    paddingLeft: "0.625rem",
                    paddingRight: "0.625rem",
                    backgroundColor: "green.main",
                    border: 1,
                    borderColor: "green.dark",
                    borderRadius: "0.313rem"
                }}>
                    View Full Case
            </Button>
        </DialogTitle>
        <DialogContent>
            <LocalizationProvider dateAdapter={AdapterMoment}>
                <Typography 
                    variant="title1" 
                    color="blue.dark" 
                    sx={{
                        display: "flex", 
                        alignItems: "center", 
                        marginTop: "2rem", 
                        marginBottom: "0.75rem"
                    }}>                
                    <AccountBoxIcon sx={{marginRight: "0.313rem"}}/>
                    PATIENT INFORMATION
                </Typography>
                <Grid container spacing={"1rem"}>
                    <Grid item xs={6}>
                        <Typography variant="subtitle1">Patient Name</Typography>
                        <Typography variant="subtitle2">{`${row.firstName} ${row.lastName}`}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="subtitle1">DOB</Typography>
                        <Typography variant="subtitle2">{row.dateOfBirth || 'N/A'}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="subtitle1">Patient Address</Typography>
                        <Typography variant="subtitle2">{row.patientAddress || 'N/A'}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="subtitle1">Special Needs</Typography>
                        <Typography variant="subtitle2">{row.specialNeeds || 'N/A'}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="subtitle1">Patient Phone</Typography>
                        <Typography variant="subtitle2">{`Mobile: ${row.mobilePhone || 'N/A'}`}</Typography>
                        <Typography variant="subtitle2">{`Home: ${row.homePhone || 'N/A'}`}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="subtitle1">Allergies</Typography>
                        <Typography variant="subtitle2">{row.allergies || 'N/A'}</Typography>
                    </Grid>
                </Grid>
                <DottedDivider />
                <Typography 
                    variant="title1" 
                    color="blue.dark" 
                    sx={{
                        display: "flex", 
                        alignItems: "center", 
                        marginTop: "1.5rem",
                        marginBottom: "0.75rem",
                    }}>                
                    <DateRangeIcon sx={{marginRight: "0.313rem"}}/>
                    SCHEDULING 
                </Typography>                
                <Grid container spacing={"1rem"}>
                    <Grid item xs={6}>
                        <Typography variant="subtitle1">Procedure Date and Time</Typography>
                        <Typography variant="subtitle2">{row.procedureDate || 'N/A'}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="subtitle1">Length of Surgery</Typography>
                        <Typography variant="subtitle2">{row.surgeryLength || 'N/A'}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="subtitle1">Comments</Typography>
                        <Typography variant="subtitle2">{row.comments || 'N/A'}</Typography>
                    </Grid>
                </Grid>
                <DottedDivider />
                <Typography 
                    variant="title1" 
                    color="blue.dark" 
                    sx={{
                        display: "flex", 
                        alignItems: "center", 
                        marginBottom: "0.75rem",
                        marginTop: "1.5rem",
                    }}>                
                    <AssignmentIcon sx={{marginRight: "0.313rem"}}/>
                    PROCEDURE DETAILS 
                </Typography>
                <Grid container spacing={"1rem"}>
                    <Grid item xs={6}>
                        <Typography variant="subtitle1">Site</Typography>
                        <Typography variant="subtitle2">{row.procedureLocation || 'N/A'}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="subtitle1">Surgeon Name</Typography>
                        <Typography variant="subtitle2">{row.proceduralist || 'N/A'}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="subtitle1">Admission Type</Typography>
                        <Typography variant="subtitle2">{row.admissionType || 'N/A'}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="subtitle1">Surgical Assistance</Typography>
                        <Typography variant="subtitle2">{row.surgeryAssistance || 'N/A'}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="subtitle1">Procedures</Typography>
                        <Typography variant="subtitle2">{row.procedures || 'N/A'}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="subtitle1">Anesthesia Notes</Typography>
                        <Typography variant="subtitle2">{row.notes || 'N/A'}</Typography>
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
