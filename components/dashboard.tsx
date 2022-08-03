import React from "react";
import moment from "moment";
import CaseDateGroup from '../components/caseDateGroup';
import { useQuery } from 'react-query';
import { styled, Box, Stack, Select, Button, Typography, FormControl, MenuItem } from "@mui/material";
import { IosShare } from "@mui/icons-material";
import { SingleCase } from "../reference";
import DropDownComponent from "./dropDownComponent";

interface CaseGroup {
    [key: string]: SingleCase[]
}

const StyledMenuItem = styled(MenuItem)({
    fontSize: "0.688rem"
})

export default function Dashboard() {  
    const fetchCases = async () => {
      const response = await fetch(
          `/api/getCases?dateRangeStart=${moment().utc()}`
        );
    
      return response.json();
    };

    const { data } = useQuery("getCases", fetchCases)

    if (!data) {
        return null;
    }

    const caseGroups:CaseGroup = {};
    
    data.forEach(function(singleCase: SingleCase) {
        const date = singleCase.procedureDate;
            if (date in caseGroups) {
                caseGroups[date].push(singleCase);
            } else {
                caseGroups[date] = new Array(singleCase)
            }
        })
  
    return (
        <Box sx={{
            display: "flex",
            justifyContent: "center"
        }}>
          <Stack sx={{
              width: "60rem"
          }}>
            <Box sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                height: "3.75rem",
                borderBottom: "0.063rem solid #D8E4F4"
            }}>
                <Box sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                }}>
                    <Typography sx={{
                        fontSize: "1rem",
                        color: "black.main",
                        fontWeight: "700"
                    }}>
                        {`${data.length} Cases`}
                    </Typography>
                    <Box sx={{ minWidth: 120 }}>
                        <DropDownComponent fullWidth>
                            <Select
                                labelId="case-sort-select-label"
                                id="case-sort-select"
                                defaultValue={1}
                                sx={{
                                    fontSize: "0.625rem",
                                    height: "2rem",
                                    marginLeft: "0.625rem",
                                    borderRadius: "none"
                                }}
                            >
                            <StyledMenuItem value={1}><span>Sort:</span> Oldest - Newest</StyledMenuItem>
                            <StyledMenuItem value={2}><span>Sort:</span> Newest - Oldest</StyledMenuItem>
                            </Select>
                        </DropDownComponent>
                    </Box>
                </Box>
                <Button variant="contained" startIcon={<IosShare />} sx={{
                    backgroundColor: "blue.light",
                    border: "none",
                    marginRight: "0.75rem",
                    width: "5rem",
                    height: "1.875rem",
                    color: "blue.main"
                }}>
                    Export
                </Button>
            </Box>
            {
                Object.keys(caseGroups).map((key, index) => {
                    return (
                        <CaseDateGroup key={key} date={key} list={caseGroups[key]} />
                    )
                })
            }
          </Stack>
        </Box>
    );
  }
