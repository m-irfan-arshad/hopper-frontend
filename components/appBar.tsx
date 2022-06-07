import React, { useState } from "react";
import { styled } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import SearchIcon from "@mui/icons-material/Search";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import SvgIcon from "@mui/material/SvgIcon";
import Button from "@mui/material/Button";
import Popover from "@mui/material/Popover";
import DropDownGrid from "./dropDownGrid";

//uses styled theme (using emotion styles under the hood) from "@mui/material/styles";

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

function MedtelLogo() {
  return (
    <SvgIcon viewBox="0 0 24 24" htmlColor="green">
      <path d="M15,19.16V15.07a4.27,4.27,0,0,0,6,0h0a4.27,4.27,0,0,0,0-6h0a4.27,4.27,0,0,0-6,0l-3,3-3,3a4.27,4.27,0,0,1-6,0h0a4.27,4.27,0,0,1,0-6h0A4.27,4.27,0,0,1,9,9" />
    </SvgIcon>
  );
}

export default function SearchAppBar() {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [isDropDownOpen, setDropDownState] = useState(false);

  const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
    console.log('event', event)
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  return (
    <div>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="fixed">
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
            <Button
              onClick={() => setDropDownState(!isDropDownOpen)}
              sx={{ paddingLeft: 0 }}
            >
              <SearchIcon sx={{ marginRight: 0 }} />
              Search
            </Button>
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
                  vertical: "center",
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
      <DropDownGrid open={isDropDownOpen} />
    </div>
  );
}
