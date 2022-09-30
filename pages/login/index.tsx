import React, { useState, useEffect } from "react";
import Head from "next/head";
import LoginDialog from "../../components/loginDialog";
import ForgotPasswordDialog from "../../components/forgotPasswordDialog";
import { Box } from "@mui/material";

interface Props {
  flags: {
    [key: string]: {
      data: boolean
    }
  }
}

export default function Home({ flags }: Props) {
    const [isLoginModalOpen, setLoginModalState] = useState(true);
    const [isForgotPasswordModalOpen, setForgotPasswordModalState] = useState(false);

    function handleForgotPasswordClick() {
        setLoginModalState(false);
        setForgotPasswordModalState(true);
    }

    function onBackClick() {
        setLoginModalState(true);
        setForgotPasswordModalState(false);
    }

  return (
      <Box sx={{
        backgroundColor: "gray.light",
        minHeight: "100vh"
      }}>
        <Head>
          {/* ensure styling for all device sizes (mobile, desktop etc.) */}
          <meta name="viewport" content="initial-scale=1, width=device-width" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <header>
        </header>
        <LoginDialog open={isLoginModalOpen} onForgotPasswordClick={handleForgotPasswordClick} />
        <ForgotPasswordDialog open={isForgotPasswordModalOpen} onBackClick={onBackClick} /> 
      </Box>
  );
}

