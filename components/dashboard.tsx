import React, { useState } from "react";
import CaseDateGroup from '../components/caseDateGroup';
import CaseNavBar from "../components/caseNavBar";
import { Box, Stack, Button, Typography, useMediaQuery } from "@mui/material";
import { Logout } from "@mui/icons-material";
import { SingleCase, dashboardSortDropDownValues } from "../reference";
import DropDownComponent from "./shared/dropdown";
import { defaultTheme } from "../theme";
import { useGetCasesHook } from '../hooks';

interface CaseGroup {
    [key: string]: SingleCase[]
}

export default function Dashboard() {  
    const isMobile = useMediaQuery(defaultTheme.breakpoints.down('sm'));

    const [dateFilterValue, setDateFilterValue] = useState('This month');
    const [dateSortValue, setDateSortValue] = useState('Oldest - Newest');
    const [caseFilterValue, setCaseFilterValue] = useState('All Steps');

    const { data } = useGetCasesHook(dateFilterValue, dateSortValue);

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
        <React.Fragment>
            <CaseNavBar 
                onCaseFilterChange={setCaseFilterValue} 
                caseFilterValue={caseFilterValue} 
                onDateFilterChange={setDateFilterValue}  
                dateFilterValue={dateFilterValue}
            />
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
                                    onChange={(val: string) => setDateSortValue(val)}
                                    value={dateSortValue}
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
                                    onChange={(val: string) => setDateSortValue(val)}
                                    value={dateSortValue}
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
        </React.Fragment>
    );
  }
