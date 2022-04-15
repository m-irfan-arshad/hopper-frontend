import React, { useState } from "react";
import { styled } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import InputBase from "@mui/material/InputBase";
import SearchIcon from "@mui/icons-material/Search";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import SvgIcon from "@mui/material/SvgIcon";
import Button from "@mui/material/Button";
import Popover from "@mui/material/Popover";
import Head from "next/head";

//breakpoints allow the screen to change when the breakpoint size is hit (sm=600px )
//below is saying when the screen width is greater than 600px apply the following (.down would be when its below 600px)

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  width: "200px",
  marginLeft: "50px",
  color: "rgb(25, 118, 210)",
  "&:hover": {
    backgroundColor: "#a9a9a9",
  },
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(1),
    width: "auto",
  },
}));

const CustomButton = styled(Button)(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  marginLeft: 0,
  width: "100%",
  color: "rgb(25, 118, 210)",
  "&:hover": {
    backgroundColor: "#a9a9a9",
  },
  [theme.breakpoints.down("sm")]: {
    marginLeft: theme.spacing(15),
    fontSize: 8,
    width: "150px",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  color: "rgb(25, 118, 210)",
  alignItems: "center",
  justifyContent: "center",
  [theme.breakpoints.down("sm")]: {
    fontSize: 8,
    width: "100px",
  },
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    "&:hover": {
      cursor: "crosshair",
    },
  },
  [theme.breakpoints.down("sm")]: {
    marginLeft: theme.spacing(5),
    fontSize: 8,
    width: "100%",
  },
}));

//IF YOU HAVE A PATH FOR YOUR SVG, CAN MAKE IT LIKE BELOW
function MedtelLogo(props) {
  return (
    <SvgIcon {...props} viewBox="0 0 25 25">
      <path d="M15,19.16V15.07a4.27,4.27,0,0,0,6,0h0a4.27,4.27,0,0,0,0-6h0a4.27,4.27,0,0,0-6,0l-3,3-3,3a4.27,4.27,0,0,1-6,0h0a4.27,4.27,0,0,1,0-6h0A4.27,4.27,0,0,1,9,9" />
    </SvgIcon>
  );
}

export default function SearchAppBar() {
  const [anchorEl, setAnchorEl] = useState(false);

  const handlePopoverOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  //another way to put drawer beneath appbar (and shows svg still) is to add zindex like so
  // sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
  // unfortunately the drawer is not actually hidden though the appbar is just sorta in front? its weird

  return (
    <div>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="fixed" color="transparent">
          <Toolbar>
            <MedtelLogo />
            <Typography
              variant="h6"
              noWrap
              component="div"
              color="rgb(25, 118, 210)"
              sx={{ flexGrow: 1, display: { xs: "none", sm: "block" } }}
            >
              Hopper
            </Typography>
            <Search>
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase placeholder="Search…" />
            </Search>
            <div>
              <CustomButton
                endIcon={<AccountCircleIcon />}
                onMouseEnter={handlePopoverOpen}
                onMouseLeave={handlePopoverClose}
              >
                Hover for Popover
              </CustomButton>
              <Popover
                id="mouse-over-popover"
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  pointerEvents: "none",
                  marginTop: 3,
                }}
                open={open}
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "center",
                }}
                transformOrigin={{
                  horizontal: "center",
                }}
                onClose={handlePopoverClose}
                disableRestoreFocus
              >
                <Typography>I use Popover.</Typography>
              </Popover>
            </div>
          </Toolbar>
        </AppBar>
      </Box>
    </div>
  );
}
