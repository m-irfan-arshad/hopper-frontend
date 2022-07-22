import React from "react";
import { AppBar, styled, Checkbox, Box, Button, Select, FormGroup, FormControl, FormControlLabel, MenuItem } from '@mui/material';
import { Add } from "@mui/icons-material";

export default function CaseNavBar() {
    const StyledBox = styled(Box)({
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
    })

    const StyledMenuItem = styled(MenuItem)({
        fontSize: "0.688rem"
    })

    return (
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
                    <FormControl>
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
                            <StyledMenuItem value={1}>Date Range: This month</StyledMenuItem>
                            <StyledMenuItem value={2}>Date Range: Next month</StyledMenuItem>
                            <StyledMenuItem value={3}>Date Range: Next quarter</StyledMenuItem>
                        </Select>
                    </FormControl>
                    <FormControl>
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
                            <StyledMenuItem value={1}>Step: All Steps</StyledMenuItem>
                            <StyledMenuItem value={2}>Step: Insurance Authorization</StyledMenuItem>
                            <StyledMenuItem value={3}>Step: Pre Surgical Testing</StyledMenuItem>
                            <StyledMenuItem value={4}>Step: Pre Admission Testing</StyledMenuItem>
                            <StyledMenuItem value={5}>Step: Vendor Confirmation</StyledMenuItem>
                        </Select>
                    </FormControl>
                </StyledBox>
                <Button variant="contained" startIcon={<Add />} sx={{
                    backgroundColor: "green.main",
                    border: 1,
                    borderColor: "green.dark",
                    marginRight: "0.75rem"
                }}>
                    Create Case
                </Button>
            </StyledBox>
        </AppBar>
    );
}
