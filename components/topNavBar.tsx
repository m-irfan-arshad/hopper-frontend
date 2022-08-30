import React from "react";
import { AppBar, styled, Typography, Box, IconButton } from '@mui/material';
import { NotificationImportant, AccountCircle } from "@mui/icons-material";
import Image from 'next/image';
import logo from '../medtelLogo.png';

export default function TopNavBar() {
    const StyledBox = styled(Box)({
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
    })

    return (
          <AppBar position="static" sx={{
              backgroundColor: 'blue.dark',
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "3.75rem"
          }}>
            <StyledBox sx={{ width: "92%", maxWidth: "60rem" }}>
              <StyledBox>
                <Image
                  src={logo}
                  alt="logo"
                  width="120px"
                  height="50px"
                />
              </StyledBox>
              <StyledBox>
                <NotificationImportant sx={{
                    marginRight: "1.563rem"
                }}/>
                <Typography variant="caption" sx={{color: "#ffffff"}}>
                Welcome, Ben
              </Typography>
              <IconButton
                size="large"
                aria-label="current user account"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                color="inherit"
              >
                <AccountCircle />
              </IconButton>
              </StyledBox>
            </StyledBox>
          </AppBar>
      );
}
