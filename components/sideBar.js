import React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import CssBaseline from "@mui/material/CssBaseline";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import CircleNotificationsIcon from "@mui/icons-material/CircleNotifications";
import AddCircleOutlineRoundedIcon from "@mui/icons-material/AddCircleOutlineRounded";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import DvrIcon from "@mui/icons-material/Dvr";
import Tooltip from "@mui/material/Tooltip";
import Link from "next/link";
import { createTheme, ThemeProvider } from "@mui/material/styles";

//uses 'system' styling using sx prop
export default function SideBar() {
  const toolTipTheme = createTheme({
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

  const styles = {
    drawer: {
      "& .MuiDrawer-paper": {
        width: {
          xs: 50,
          sm: 70,
        },
        marginTop: {
          xs: "56px", // theme.breakpoints.up('xs')
          sm: "64px", // theme.breakpoints.up('sm')
        },
        background: {
          xs: "green",
          sm: "blue",
        },
      },
    },
    title: {
      display: "flex",
    },
    listButton: {
      minHeight: 80,
      justifyContent: "center",
      px: 2.5,
      "&:hover": {
        backgroundColor: "white",
      },
    },
    listIcon: {
      minWidth: 0,
      mr: "auto",
      justifyContent: "center",
    },
  };

  const iconToDisplay = (text) => {
    const component = (DrawerIcon) => (
      <ThemeProvider theme={toolTipTheme}>
        <Tooltip title={text} placement="right">
          <DrawerIcon data-testid={text} fontSize="large" />
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

  const arr = [
    "Dashboard",
    "Create a Case",
    "Notifications",
    "Work Queues",
    "test no icon",
  ];

  return (
    <div>
      <Box sx={styles.title}>
        <CssBaseline />
        <Drawer variant="permanent" open={false} sx={styles.drawer}>
          <List>
            {arr.map((text, index) => (
              <Link
                key={text}
                href={index % 2 === 0 ? "/" : "/calendarDatePage"}
              >
                <a>
                  <ListItemButton
                    key={text}
                    sx={styles.listButton} //works fine
                  >
                    <ListItemIcon sx={styles.listIcon}>
                      {iconToDisplay(text)}
                    </ListItemIcon>
                  </ListItemButton>
                </a>
              </Link>
            ))}
          </List>
        </Drawer>
      </Box>
    </div>
  );
}
