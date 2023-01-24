import React, {useState, useEffect} from "react";
import { 
    Dialog, 
    DialogActions, 
    DialogContent, 
    DialogTitle,
    IconButton,
    Tabs,
    Tab,
    Box,
    Typography,
    styled
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

interface Props {
    open: boolean
    closeDialog: () => void,
    data: any
    initiallySelectedTab: string
}

export default function BookingSheetDialog(props: Props) {
  const {open, closeDialog, data, initiallySelectedTab} = props;
  const [selectedTab, selectTab] = useState(initiallySelectedTab);

  useEffect(() => {
    selectTab(initiallySelectedTab)
  }, [initiallySelectedTab]);

  const StyledTab = styled(Tab)({
    padding: 0,
    width: "175px",
    textTransform: "capitalize"
  });

  return (
      <Dialog maxWidth='lg' open={open} sx={{ "& .MuiPaper-root": { borderRadius: "0.625rem" }}}>
        <DialogTitle 
            sx={{
                display: "flex",
                flexDirection: "column",
                borderBottom: "0.063rem solid", 
                borderColor: "gray.main",
                paddingBottom: 0,
                paddingRight: 0,
                paddingLeft: 0
            }}> 
            <Box sx={{display: "flex", flexDirection: "row", justifyContent: "space-between", marginBottom: "2rem"}}>
                <Typography variant="overline" sx={{marginLeft: "2rem", textTransform: "uppercase", padding: "0.5rem"}} >
                    {`${data?.patients?.firstName} ${data?.patients?.lastName}`}
                </Typography>
                <IconButton sx={{marginRight: "2.5rem"}} onClick={closeDialog}>
                    <CloseIcon />
                </IconButton>
            </Box>
            <Box>
                <Tabs value={selectedTab} onChange={(event, value) => selectTab(value)}> 
                    <StyledTab label="Patient" value="Patient" /> 
                    <StyledTab label="Financial" value="Financial"   />
                    <StyledTab label="Procedure" value="Procedure"  />
                    <StyledTab label="Scheduling" value="Scheduling" />
                    <StyledTab label="Implants & Products" value="Implants & Products"  />
                    <StyledTab label="Clinical" value="Clinical" />
                </Tabs>
            </Box>
        </DialogTitle>
        <DialogContent sx={{minHeight: "20rem"}}>
           
        </DialogContent>
        <DialogActions 
            sx={{
                borderTop: "0.063rem solid", 
                padding: "0.625rem", 
                borderColor: "gray.main",
                minHeight: "5rem"
            }}>
        </DialogActions>
      </Dialog>
  );
}
