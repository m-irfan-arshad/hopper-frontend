import React from "react";
import moment from "moment";
import CaseDateGroup from '../components/caseDateGroup';
import { useQuery } from 'react-query';
import { styled, Box, Stack, Select, Button, Typography, FormControl, MenuItem, useMediaQuery } from "@mui/material";
import { useTheme } from '@mui/material/styles';
import { Logout } from "@mui/icons-material";
import { SingleCase, dashboardSortDropDownValues } from "../reference";
import DropDownComponent from "./shared/dropdown";
import { defaultTheme } from "../theme";

interface CaseGroup {
    [key: string]: SingleCase[]
}

export default function Dashboard() {  
    console.log("env: ", process.env);

    const isMobile = useMediaQuery(defaultTheme.breakpoints.down('sm'));

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
        const date = singleCase.procedureDate.split('T')[0];
        singleCase.procedureDate = date;
            if (date in caseGroups) {
                caseGroups[date].push(singleCase);
            } else {
                caseGroups[date] = new Array(singleCase)
            }
        })
  
    return (
        <Box sx={{
            display: "flex",
            justifyContent: "center",
        }}>
          <Stack sx={{
              width: "92%",
              maxWidth: "60rem",
              marginBottom: "1.25rem"
          }}>
            <Box sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-end",
                paddingBottom: "0.75rem",
                height: "4.438rem",
                borderBottom: "0.063rem solid #D8E4F4"
            }}>
                <Box sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                }}>
                    <Typography variant="h6">
                        {`${data.length} Cases`}
                    </Typography>
                    {!isMobile 
                        && <Box sx={{ minWidth: 120 }}>
                            <DropDownComponent
                                menuItems={dashboardSortDropDownValues}
                                title="Sort:"
                                selectId="case-sort-select"
                                additionalStyles={{ marginLeft: "0.625rem" }}
                            />
                        </Box>
                    }
                </Box>
                <Box sx={{display: "flex"}}>
                    {isMobile 
                        && <Box sx={{ marginRight: "0.313rem" }}>
                            <DropDownComponent
                                menuItems={dashboardSortDropDownValues}
                                title="Sort:"
                                selectId="case-sort-select"
                            />
                        </Box>
                    }
                    <Button variant="contained" size="small">
                        <Logout sx={{
                            transform: "rotate(270deg)", 
                            marginRight: {xs: 0, sm:"0.375rem"}, 
                            height: "0.875rem", 
                            width: "0.875rem"
                        }} />

                        {isMobile ? '' : 'Export'}
                    </Button>
                </Box>
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
