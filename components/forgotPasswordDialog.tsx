import React from "react";
import { 
    Typography, 
    Button, 
    TextField, 
    Dialog, 
    DialogActions, 
    DialogContent, 
    DialogTitle,
    styled
} from '@mui/material';
import Image from 'next/image';
import logo from '../medtelLogo.svg';
import { defaultTheme } from "../theme";

interface Props {
    onBackClick: () => void,
    open: boolean
}

export default function ForgotPasswordDialog(props: Props) {
  const { onBackClick, open } = props;
  const StyledTextField = styled(TextField)({
    "& .MuiOutlinedInput-input": {
        "&::placeholder": {
            fontSize: "0.688rem",
        },
        color: defaultTheme.palette.black.main,
    },
  });

  return (
      <Dialog open={open} fullWidth maxWidth="xs" sx={{ "& .MuiPaper-root": { borderRadius: "0.625rem", width: "400px" }}}>
        <DialogTitle 
            sx={{
                display: "flex",
                justifyContent: "center",
                backgroundColor: "blue.dark", 
                color: "white.main",
            }}>
                <Image
                  src={logo}
                  alt="logo"
                  width="84px"
                  height="35px"
                />
        </DialogTitle>
        <DialogContent sx={{display: "flex", alignItems: "center", flexDirection: "column", marginTop: "40px"}}>
            <Typography variant="body2" sx={{width: "310px", paddingRight: "20px"}}>Enter email to receive instructions to reset your password</Typography>
            <StyledTextField variant="outlined" placeholder="Email Address"  sx={{minWidth: "310px", marginTop: "40px"}} />
        </DialogContent>
        <DialogActions sx={{display: "flex", justifyContent: "flex-start", marginBottom: "2rem"}}>
            <Button 
                variant="text"
                onClick={onBackClick}
                sx={{
                    color: "blue.light",
                    textTransform: "none",
                    fontSize: "10px",
                    fontWeight: "400",
                    marginLeft: "30px",
                    marginRight: "50px",
                    "&:hover": {
                        backgroundColor: "transparent"
                    }
                }}
            >
                Back 
            </Button>
            <Button 
            variant="contained" 
            sx={{ backgroundColor: "green.main" }}>
                SUBMIT 
            </Button>
        </DialogActions>
      </Dialog>
  );
}
