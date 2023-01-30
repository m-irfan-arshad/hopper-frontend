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
    Box,
} from '@mui/material';
import { Check } from "@mui/icons-material";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { SingleCase } from "../reference";
import DottedDivider from "./shared/dottedDivider";
import { useUpdateCaseHook } from '../utils/hooks';
import CaseSummaryContent from './caseSummaryContent';


interface Props {
    open: boolean
    closeDialog: () => void,
    row: SingleCase
}

interface StepCompletedButtonProps {
    title: string;
}

export default function CaseSummaryDialog(props: Props) {
  const {open, closeDialog, row} = props;
  const {mutate} = useUpdateCaseHook()

  const StepCompletedButton = (props: StepCompletedButtonProps) => {
        return <Button 
            variant="outlined"
            size="small"
            disabled
            startIcon={<Check />}
            sx={{
                "&:disabled": {
                    color:"success.main",
                    borderColor: "success.main"
                }
            }}
            >
                {props.title}
        </Button>
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
                <Typography variant="body1" color="white.main">{`${row.patients?.lastName}, ${row.patients?.firstName}`}</Typography>
                <Typography
                    variant="caption"
                    color="white.main"
                >
                    {`${row.patients?.dateOfBirth} - ${row.patients?.mrn}`}
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
            <CaseSummaryContent row={row} />
        </DialogContent>
        <DialogActions 
            sx={{
                display: "flex", 
                justifyContent: "space-between", 
                alignItems: "center", 
                borderTop: "0.063rem solid", 
                padding: "0.625rem", 
                borderColor: "gray.main"
            }}>
            <Button 
                onClick={() => closeDialog()}
                sx={{ color: "blue.main", padding: "0.625rem"}}
            >
                Cancel
            </Button>
            <div style={{display: 'flex', gap: 15, marginRight: 10}}>
            {row.steps.priorAuthorization === "Complete" ? <StepCompletedButton title={"Insurance Verified"}/> : <Button 
                variant="contained"
                size="small"
                onClick={() => mutate({priorAuthorization: "Complete", caseId: row.caseId})}
                >
                    Verify Insurance
            </Button>}
            {row.steps.vendorConfirmation === "Complete" ? <StepCompletedButton title={"Vendor Confirmed"}/> : <Button 
                variant="contained"
                size="small"
                onClick={() => mutate({vendorConfirmation: "Complete", caseId: row.caseId})}
                >
                    Confirm Vendor
            </Button>}
            </div>
        </DialogActions>
      </Dialog>
  );
}
