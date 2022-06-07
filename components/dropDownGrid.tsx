import * as React from "react";
import { experimentalStyled as styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import InputBase from "@mui/material/InputBase";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

const arr = [
  "Patient Name",
  "Patient Date Of Birth (MM/DD/YYYY)",
  "Primary Surgeon",
  "Surgical Location",
  "MRN (Hospital)",
  "Case ID",
];

export default function DropDownGrid({ open }) {
  return open ? (
    <Box sx={{ width: "95%", flexGrow: 1, marginTop: "100px" }}>
      <Grid
        container
        spacing={{ xs: 2, sm: 2, md: 3 }}
        sx={{ marginLeft: "80px !important" }}
      >
        {arr.map((name, index) => (
          <Grid item xs={2} sm={3} md={4} key={index}>
            <Item
              sx={{
                width: {
                  xs: "80px",
                  sm: "100px",
                  md: "300px",
                },
              }}
            >
              {index % 2 === 0 ? (
                <InputBase placeholder="Search..." sx={{ height: "50px" }} />
              ) : (
                <Autocomplete
                  options={arr}
                  sx={{ height: "50px" }}
                  renderInput={(params) => (
                    <TextField {...params} label="Array Choice" />
                  )}
                />
              )}
            </Item>
          </Grid>
        ))}
      </Grid>
    </Box>
  ) : null;
}
