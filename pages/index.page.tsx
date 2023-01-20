import React from "react";
import Head from "next/head";
import TopNavBar from "../components/topNavBar";
import Dashboard from "../components/dashboard";
import * as LaunchDarkly from 'launchdarkly-react-client-sdk';
import { Box } from "@mui/material";
import { withPageAuthRequired } from '@auth0/nextjs-auth0';


interface Props {
  flags: {
    [key: string]: {
      data: boolean
    }
  }
}

export function Home({ flags }: Props) {
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
          {
            flags.displayTopNav ? <TopNavBar /> : null
          }
        </header>
        <Dashboard />
      </Box>
  );
}

export default LaunchDarkly.withLDConsumer()(withPageAuthRequired(Home));
