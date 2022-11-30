import React from "react";
import { AppBar, styled, Typography, Box, IconButton } from '@mui/material';
import { NotificationImportant, AccountCircle } from "@mui/icons-material";
import { useUser } from '@auth0/nextjs-auth0';
import Image from 'next/image';
import logo from '../medtelLogo.svg';

export default function TopNavBar() {
    const StyledBox = styled(Box)({
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
    })

    const { user, error, isLoading } = useUser();

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
                {
                  user && (
                    <>
                    <Typography variant="caption" color="white.main">
                    {`Welcome, ${user.name}`}
                    </Typography>
                    <Typography variant="caption" color="white.main" sx={{marginLeft: "1rem"}}>
                       <a href="/api/auth/logout">Logout</a>
                    </Typography>
                    </>
                  )
                }
              </StyledBox>
            </StyledBox>
          </AppBar>
      );
}
