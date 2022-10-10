import React, { useState, useEffect } from "react";
import Head from "next/head";
import TopNavBar from "../components/topNavBar";
import CaseNavBar from "../components/caseNavBar";
import Dashboard from "../components/dashboard";
import * as LaunchDarkly from 'launchdarkly-react-client-sdk';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Box } from "@mui/material";

interface Props {
  flags: {
    [key: string]: {
      data: boolean
    }
  }
}

const queryClient = new QueryClient();

export function Home({ flags }: Props) {
  return (
    <QueryClientProvider client={queryClient}>
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
    </QueryClientProvider>
  );
}

export default LaunchDarkly.withLDConsumer()(Home);
