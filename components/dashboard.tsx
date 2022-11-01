import React, { useState } from "react";
import CaseDateGroup from '../components/caseDateGroup';
import CaseNavBar from "../components/caseNavBar";
import { Box, Stack, Button, Typography, useMediaQuery, CircularProgress, Pagination } from "@mui/material";
import { Logout } from "@mui/icons-material";
import { SingleCase, dashboardSortDropDownValues, caseFilterInterface } from "../reference";
import DropDownComponent from "./shared/dropdown";
import { defaultTheme } from "../theme";
import { useGetCasesHook } from '../utils/hooks';
import { paginationCount } from '../reference';

interface CaseGroup {
    [key: string]: SingleCase[]
}

export default function Dashboard() {  
    const isMobile = useMediaQuery(defaultTheme.breakpoints.down('sm'));
    const defaultCaseFilterValue: caseFilterInterface[] = [{id: "all", value: "All Steps"}]

    const [dateFilterValue, setDateFilterValue] = useState('This month');
    const [dateSortValue, setDateSortValue] = useState('Oldest - Newest');
    const [caseFilterValue, setCaseFilterValue] = useState(defaultCaseFilterValue);
    const [searchBarValue, setSearchBarValue ] = useState('');
    const [paginationPage, setPaginationPage] = useState(1);

    function handleDateFilterChange(value: string) {
        setPaginationPage(1);
        setDateFilterValue(value);
    }

    function handleSearchBarChange(value: string) {
        setPaginationPage(1);
        setSearchBarValue(value);
    }
   
    const { data = {cases: [], count: 0}, isLoading } = useGetCasesHook(dateFilterValue, dateSortValue, caseFilterValue, searchBarValue, paginationPage.toString());

    const caseGroups:CaseGroup = {};

        data.cases.forEach(function(singleCase: SingleCase) {
            const date = singleCase.procedureDate || "";
            if (date in caseGroups) {
                caseGroups[date].push(singleCase);
            } else {
                caseGroups[date] = new Array(singleCase)
            }
        })
        
    const handleCaseFilterChange = (value: caseFilterInterface[]) => {
        setPaginationPage(1);
        
        if (value?.at(-1)?.id === "all" || value?.length === 0) {
            setCaseFilterValue(defaultCaseFilterValue);
        } else {
            setCaseFilterValue(value.filter(elem => elem.id !== "all"));
        }
    };

    return (
        <React.Fragment>
            <CaseNavBar 
                onCaseFilterChange={handleCaseFilterChange} 
                caseFilterValue={caseFilterValue} 
                onDateFilterChange={handleDateFilterChange}  
                dateFilterValue={dateFilterValue}
                searchBarValue={searchBarValue}
                search={handleSearchBarChange}
            />
            <Box sx={{
                display: "flex",
                justifyContent: "center",
            }}>
            <Stack 
            spacing={isLoading ? 25 : 0}
            sx={{
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
                            {`${data.count} ${data.count === 1 ? 'Case' : 'Cases'}`}
                        </Typography>
                        {!isMobile 
                            && <Box sx={{ minWidth: 120 }}>
                                <DropDownComponent
                                    menuItems={dashboardSortDropDownValues}
                                    title="Sort:"
                                    selectId="case-sort-select"
                                    additionalStyles={{ marginLeft: "0.625rem" }}
                                    onChange={setDateSortValue}
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
                                    onChange={setDateSortValue}
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
                {isLoading && <CircularProgress sx={{alignSelf: 'center'}} />}
                {
                    data.count > 50 
                        && <Pagination 
                                count={Math.ceil(data.count / paginationCount)} 
                                page={paginationPage} 
                                onChange={(event, val) => setPaginationPage(val)} 
                                sx={{ alignSelf: "center", marginTop: "4rem"}}
                            />
                }
            </Stack>
            </Box>
        </React.Fragment>
    );
  }
