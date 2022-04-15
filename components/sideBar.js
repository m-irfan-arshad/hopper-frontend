import React, { useState } from "react";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import CssBaseline from "@mui/material/CssBaseline";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import CircleNotificationsIcon from "@mui/icons-material/CircleNotifications";
import AddCircleOutlineRoundedIcon from "@mui/icons-material/AddCircleOutlineRounded";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import DvrIcon from "@mui/icons-material/Dvr";
import Tooltip from "@mui/material/Tooltip";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Head from "next/head";

export default function SideBar() {
  const theme = createTheme({
    components: {
      MuiTooltip: {
        styleOverrides: {
          tooltip: {
            color: "white",
            backgroundColor: "green",
            marginLeft: "40px !important", //need to override margin left from tooltip placement prop
          },
        },
      },
    },
  });
  const iconToDisplay = (text) => {
    const component = (DrawerIcon) => (
      <ThemeProvider theme={theme}>
        <Tooltip title={text} placement="right">
          <DrawerIcon fontSize="large" />
        </Tooltip>
      </ThemeProvider>
    );
    switch (text) {
      case "Create a Case":
        return component(AddCircleOutlineRoundedIcon);
      case "Notifications":
        return component(CircleNotificationsIcon);
      case "Work Queues":
        return component(AssignmentOutlinedIcon);
      case "Dashboard":
        return component(DvrIcon);
      default:
        return null;
    }
  };

  const arr = ["Dashboard", "Create a Case", "Notifications", "Work Queues"];

  const [anchorEl, setAnchorEl] = useState(false);

  const handlePopoverOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  return (
    <div>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <MuiDrawer
          variant="permanent"
          open={false}
          PaperProps={{ style: { width: 71 } }}
        >
          <List>
            {arr.map((text) => (
              <ListItemButton
                key={text}
                onMouseEnter={handlePopoverOpen}
                onMouseLeave={handlePopoverClose}
                sx={{
                  minHeight: 80,
                  justifyContent: "center",
                  px: 2.5,
                  "&:hover": {
                    backgroundColor: "white",
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: "auto",
                    justifyContent: "center",
                  }}
                >
                  {iconToDisplay(text)}
                </ListItemIcon>
              </ListItemButton>
            ))}
          </List>
        </MuiDrawer>
      </Box>
    </div>
  );
}
