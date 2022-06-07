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
import { OverridableComponent } from "@mui/material/OverridableComponent";
import { SvgIconTypeMap } from "@mui/material";

//uses 'system' styling using sx prop
export default function SideBar() {
  const toolTipTheme = createTheme({
    components: {
      MuiTooltip: {
        styleOverrides: {
          tooltip: {
            color: "white",
            backgroundColor: "darkgray",
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
          xs: "gray",
          sm: "gray",
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

  const iconToDisplay = (text: string) => {
    const component = (DrawerIcon: OverridableComponent<SvgIconTypeMap<{}, "svg">>) => (
      <ThemeProvider theme={toolTipTheme}>
        <Tooltip title={text} placement="right">
          <DrawerIcon data-testid={text} fontSize="large" />
        </Tooltip>
      </ThemeProvider>
    );
    switch (text) {
      case "Dashboard":
        return component(DvrIcon);
      default:
        return null;
    }
  };

  const sidebarOptions = [
    "Dashboard"
  ];

  return (
    <div>
      <Box sx={styles.title}>
        <CssBaseline />
        <Drawer variant="permanent" open={false} sx={styles.drawer}>
          <List>
            {sidebarOptions.map((text) => (
              <Link
                key={text}
                href='/'
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
