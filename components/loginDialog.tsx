import React from "react";
import { 
    Button, 
    TextField, 
    Dialog, 
    DialogActions, 
    DialogContent, 
    DialogTitle,
    styled
} from '@mui/material';
import Image from 'next/image';
import logo from '../medtelLogo.png';
import { defaultTheme } from "../theme";

interface Props {
    onForgotPasswordClick: () => void,
    open: boolean
}

export default function LoginDialog(props: Props) {
  const { onForgotPasswordClick, open } = props;

  const StyledTextField = styled(TextField)({
    "& .MuiOutlinedInput-input": {
        "&::placeholder": {
            fontSize: "0.688rem",
        },
        color: defaultTheme.palette.black.main,
    },
  });

  return (
      <Dialog fullWidth open={open} maxWidth="xs" sx={{ "& .MuiPaper-root": { borderRadius: "0.625rem" }}}>
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
            <StyledTextField variant="outlined" placeholder="Email Address" sx={{minWidth: "350px", marginBottom: "24px"}} />
            <StyledTextField type="password" variant="outlined" placeholder="Password"  sx={{minWidth: "350px"}} />
    
            <Button 
                variant="text"
                onClick={onForgotPasswordClick}
                sx={{
                    color: "blue.light",
                    textTransform: "none",
                    fontSize: "10px",
                    fontWeight: "400",
                    marginRight: "230px",
                    "&:hover": {
                        backgroundColor: "transparent"
                    }
                }}
            >
                Forgot password? 
            </Button>
        </DialogContent>
        <DialogActions sx={{display: "flex", justifyContent: "center", alignItems: "center"}}>
          <Button 
            variant="contained" 
            sx={{
                backgroundColor: "green.main",
                marginBottom: "2rem"
            }}>
                SIGN IN 
            </Button>
        </DialogActions>
      </Dialog>
  );
}
