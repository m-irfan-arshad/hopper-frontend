import React, { useState } from "react";
import { AppBar, styled, Box, Button, Select, MenuItem, Checkbox, Typography, FormControl, useMediaQuery } from '@mui/material';
import { Add, CheckBoxOutlined as CheckBoxOutlinedIcon } from "@mui/icons-material";
import CreateCaseDialog from "./createCaseDialog";
import DropDownComponent from "./shared/dropdown";
import { dashboardDateRangeDropDownValues, dashboardStepDropDownValues } from "../reference";
import { defaultTheme } from "../theme";

export default function CaseNavBar() {
    const [isDialogOpen, setDialogState] = useState(false);
    const isMobile = useMediaQuery(defaultTheme.breakpoints.down('sm'));

    const StyledBox = styled(Box)({
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
    });

    const StyledCheckbox = styled(Checkbox)({
        marginLeft: "0.625rem",
        marginRight: "0.313rem", 
        height: "1.5rem", 
        width: "1.5rem",
        color: defaultTheme.palette.blue.light,
        "&.Mui-checked": {
            color: defaultTheme.palette.green.light
        },
        [defaultTheme.breakpoints.down("sm")]: {
            marginLeft: "1.25rem",
            marginTop: "1rem"
        }
    });

    return (
        <React.Fragment>
            <CreateCaseDialog open={isDialogOpen} closeDialog={() => setDialogState(false)} />
            <AppBar position="static" sx={{
                backgroundColor: 'white.main',
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: {xs: "6.75rem", sm:"3.75rem"},
                boxShadow: "0rem 0.063rem 0rem #D8E4F4"
            }}>
                <StyledBox sx={{ width: "92%", maxWidth: "60rem" }}>
                    <StyledBox>
                        <DropDownComponent
                            menuItems={dashboardDateRangeDropDownValues}
                            additionalMenuItemText="Time:"
                            selectId="case-date-select"
                        />
                        <DropDownComponent
                            menuItems={dashboardStepDropDownValues}
                            additionalMenuItemText="Step:"
                            selectId="case-step-select"
                            additionalStyles={{ marginLeft: "0.625rem" }}
                        />
                        { !isMobile &&
                            <React.Fragment>
                                <StyledCheckbox checkedIcon={<CheckBoxOutlinedIcon/>} />
                                <Typography variant="body1" color="black.main">Show Completed Cases</Typography>
                            </React.Fragment>
                        }
                    </StyledBox>
                    {!isMobile 
                        && <Button 
                            variant="contained" 
                            startIcon={<Add />}
                            onClick={() => setDialogState(true)}
                            sx={{
                                backgroundColor: "green.main",
                                border: 1,
                                borderColor: "green.dark",
                                marginRight: "0.75rem"
                            }}>
                                Create Case
                        </Button>
                    }
                </StyledBox>
                {isMobile 
                    && <Box sx={{ display: "flex", alignItems: "center", width: "100%"}}>
                        <StyledCheckbox checkedIcon={<CheckBoxOutlinedIcon/>} />
                        <Typography variant="body1" color="black.main" sx={{marginTop: "1rem"}}>Show Completed Cases</Typography>
                    </Box>
                }
            </AppBar>
        </React.Fragment>
    );
}
