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
        fontSize: "11px"
    })

    return (
        <AppBar position="static" sx={{
            backgroundColor: 'white.main',
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "60px",
            boxShadow: "0px 1px 0px #D8E4F4"
        }}>
            <StyledBox sx={{ width: "960px" }}>
                <StyledBox>
                    <FormControl>
                        <Select
                            labelId="case-date-select-label"
                            id="case-date-select"
                            defaultValue={1}
                            sx={{
                                fontSize: "10px",
                                height: "32px",
                                marginLeft: "10px",
                                // border: "1px solid #D8E4F4",
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
                                fontSize: "10px",
                                height: "32px",
                                marginLeft: "10px",
                                // border: "1px solid #D8E4F4",
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
                    {/* <FormGroup sx={{ color: "black.main", fontSize: "11px" }}>
                        <FormControlLabel control={<Checkbox />} label="Show Completed Cases" />
                    </FormGroup> */}
                </StyledBox>
                <Button variant="contained" startIcon={<Add />} sx={{
                    backgroundColor: "green.main",
                    border: 1,
                    borderColor: "green.dark",
                    fontSize: "10px",
                    fontWeight: "700",
                    marginRight: "12px"
                }}>
                    Create Case
                </Button>
            </StyledBox>
        </AppBar>
    );
}
