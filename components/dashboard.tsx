import React from "react";
import moment from "moment";
import CaseDateGroup from '../components/caseDateGroup';
import { useQuery } from 'react-query';
import { styled, Box, Stack, Select, Button, Typography, FormControl, MenuItem } from "@mui/material";
import { IosShare } from "@mui/icons-material";
import { SingleCase } from "../reference";

interface CaseGroup {
    [key: string]: SingleCase[]
}

const StyledMenuItem = styled(MenuItem)({
    fontSize: "11px"
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
              width: "960px"
          }}>
            <Box sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                height: "60px",
                borderBottom: "1px solid #D8E4F4"
            }}>
                <Box sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                }}>
                    <Typography sx={{
                        fontSize: "16px",
                        color: "black.main",
                        fontWeight: "700"
                    }}>
                        {`${data.length} Cases`}
                    </Typography>
                    <Box sx={{ minWidth: 120 }}>
                        <FormControl fullWidth>
                            <Select
                            labelId="case-sort-select-label"
                            id="case-sort-select"
                            defaultValue={1}
                            sx={{
                                fontSize: "10px",
                                height: "32px",
                                marginLeft: "10px",
                                // border: "1px solid #D8E4F4",
                                borderRadius: "none"
                            }}
                            >
                            <StyledMenuItem value={1}>Sort: Oldest - Newest</StyledMenuItem>
                            <StyledMenuItem value={2}>Sort: Newest - Oldest</StyledMenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                </Box>
                <Button variant="contained" startIcon={<IosShare />} sx={{
                    backgroundColor: "#D8E4F4",
                    border: "none",
                    fontSize: "10px",
                    fontWeight: "700",
                    marginRight: "12px",
                    width: "80px",
                    height: "30px",
                    color: "#42A5F5"
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
