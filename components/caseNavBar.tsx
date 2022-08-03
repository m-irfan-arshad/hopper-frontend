import React, { useState } from "react";
import { AppBar, styled, Box, Button, Select, MenuItem, Checkbox, Typography } from '@mui/material';
import { Add, CheckBoxOutlined as CheckBoxOutlinedIcon } from "@mui/icons-material";
import CreateCaseDialog from "./createCaseDialog";
import DropDownComponent from "./dropDownComponent";

export default function CaseNavBar() {
    const [isDialogOpen, setDialogState] = useState(false);

    const StyledBox = styled(Box)({
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
    })

    const StyledMenuItem = styled(MenuItem)({
        fontSize: "0.688rem"
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
                        <DropDownComponent>
                            <Select
                                labelId="case-date-select-label"
                                id="case-date-select"
                                defaultValue={1}
                                sx={{
                                    fontSize: "0.625rem",
                                    height: "2rem",
                                    marginLeft: "0.625rem",
                                    borderRadius: "none"
                                }}
                            >
                                <StyledMenuItem value={1}><span>Date Range:</span> This month</StyledMenuItem>
                                <StyledMenuItem value={2}><span>Date Range:</span> Next month</StyledMenuItem>
                                <StyledMenuItem value={3}><span>Date Range:</span> Next quarter</StyledMenuItem>
                            </Select>
                        </DropDownComponent>
                        <DropDownComponent>
                            <Select
                                labelId="case-step-select-label"
                                id="case-step-select"
                                defaultValue={1}
                                sx={{
                                    fontSize: "0.625rem",
                                    height: "2rem",
                                    marginLeft: "0.625rem",
                                    borderRadius: "none"
                                }}
                            >
                                <StyledMenuItem value={1}><span>Step:</span> All Steps</StyledMenuItem>
                                <StyledMenuItem value={2}><span>Step:</span> Insurance Authorization</StyledMenuItem>
                                <StyledMenuItem value={3}><span>Step:</span> Pre Surgical Testing</StyledMenuItem>
                                <StyledMenuItem value={4}><span>Step:</span> Pre Admission Testing</StyledMenuItem>
                                <StyledMenuItem value={5}><span>Step:</span> Vendor Confirmation</StyledMenuItem>
                            </Select>
                        </DropDownComponent>
                        <Checkbox checkedIcon={<CheckBoxOutlinedIcon/>} sx={{ marginRight: "5px", marginLeft: "20px", height: "24px", width: "24px"}} />
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
