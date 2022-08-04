import React, { useState } from "react";
import { AppBar, styled, Box, Button, Select, MenuItem, Checkbox, Typography, FormControl } from '@mui/material';
import { Add, CheckBoxOutlined as CheckBoxOutlinedIcon } from "@mui/icons-material";
import CreateCaseDialog from "./createCaseDialog";
import DropDownComponent from "./dropDownComponent";
import { dashboardDateRangeDropDownValues, dashboardStepDropDownValues } from "../reference";

export default function CaseNavBar() {
    const [isDialogOpen, setDialogState] = useState(false);

    const StyledBox = styled(Box)({
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
    })

    const StyledCheckbox = styled(Checkbox)({
        marginRight: "5px", 
        marginLeft: "20px", 
        height: "24px", 
        width: "24px",
        color: "#D8E4F4",
        "&.Mui-checked": {
            color: "#81C784"
        },
    })

    return (
        <React.Fragment>
            <CreateCaseDialog open={isDialogOpen} closeDialog={() => setDialogState(false)} />
            <AppBar position="static" sx={{
                backgroundColor: 'white.main',
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "3.75rem",
                boxShadow: "0rem 0.063rem 0rem #D8E4F4"
            }}>
                <StyledBox sx={{ width: "60rem" }}>
                    <StyledBox>
                        <DropDownComponent
                            menuItems={dashboardDateRangeDropDownValues}
                            additionalMenuItemText="Date Range:"
                        />
                        <DropDownComponent
                            menuItems={dashboardStepDropDownValues}
                            additionalMenuItemText="Step:"
                        />
                        <StyledCheckbox checkedIcon={<CheckBoxOutlinedIcon/>} />
                        <Typography variant="body1" color="black.main">Show Completed Cases</Typography>
                    </StyledBox>
                    <Button 
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
                </StyledBox>
            </AppBar>
        </React.Fragment>
    );
}
