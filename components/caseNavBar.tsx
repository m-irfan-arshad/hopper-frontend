import React from "react";
import { AppBar, styled, Checkbox, Box, Button, Select } from '@mui/material';
import { Add } from "@mui/icons-material";

export default function CaseNavBar() {
    const StyledBox = styled(Box)({
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
    })

    return (
          <AppBar position="sticky" sx={{
              backgroundColor: 'white.main',
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "60px",
              boxShadow: "0px 1px 0px #D8E4F4"
          }}>
            <StyledBox sx={{ width: "960px" }}>
                <StyledBox>
                    <Select></Select>
                    <Select></Select>
                    <Checkbox></Checkbox>
                </StyledBox>
                <Button variant="contained" startIcon={<Add />} sx={{
                    backgroundColor: "#66BB6A",
                    border: "1px solid #4DA551",
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
