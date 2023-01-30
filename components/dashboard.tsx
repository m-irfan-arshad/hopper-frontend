import React, { useContext } from "react";
import CaseDateGroup from '../components/caseDateGroup';
import CaseNavBar from "../components/caseNavBar";
import { Box, Stack, Button, Typography, useMediaQuery, CircularProgress, Pagination, styled, Checkbox } from "@mui/material";
import { Logout, CheckBoxOutlined as CheckBoxOutlinedIcon } from "@mui/icons-material";
import { SingleCase, dashboardSortDropDownValues, caseFilterInterface } from "../reference";
import DropDownComponent from "./shared/dropdown";
import { defaultTheme } from "../theme";
import { useGetCasesHook } from '../utils/hooks';
import { paginationCount } from '../reference';
import * as R from 'ramda';
import { CaseFilterContext } from "../pages/_app.page";

interface CaseGroup {
    [key: string]: SingleCase[]
}

export default function Dashboard() {  
    const isMobile = useMediaQuery(defaultTheme.breakpoints.down('sm'));
    const defaultCaseFilterValue: caseFilterInterface[] = [{id: "all", value: "All Steps"}]
    const [context, setContext] = useContext(CaseFilterContext);

    function handleStateUpdate(key: any, value: any) {
        const contextState = R.clone(context);
        contextState.dashboard[key] = value;
        setContext(contextState)
    }

    const StyledCheckbox = styled(Checkbox)({
        marginLeft: "0.625rem",
        marginRight: "0.313rem", 
        height: "1.5rem", 
        width: "1.5rem",
        color: defaultTheme.palette.blue.light,
        "&.Mui-checked": {
            color: defaultTheme.palette.green.light
        }
    });

    function handleSearchBarChange(value: string) {
        handleStateUpdate('page', 1);
        handleStateUpdate('searchBarValue', value);

    }

    const { data = {cases: [], count: 0}, isFetching } = useGetCasesHook(
        context.dashboard.dateRangeStart, 
        context.dashboard.dateRangeEnd, 
        context.dashboard.dateSortValue, 
        context.dashboard.caseFilterValue, 
        context.dashboard.searchBarValue, 
        context.dashboard.page.toString()
    );

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
        handleStateUpdate('page',1);

        if (value?.at(-1)?.id === "all" || value?.length === 0) {
            handleStateUpdate('caseFilterValue',defaultCaseFilterValue);
        } else {
            handleStateUpdate('caseFilterValue',value.filter(elem => elem.id !== "all"));
        }
    };

    return (
        <React.Fragment>
            <CaseNavBar 
                onCaseFilterChange={handleCaseFilterChange} 
                caseFilterValue={context.dashboard.caseFilterValue} 
                searchBarValue={context.dashboard.searchBarValue}
                search={handleSearchBarChange}
                dateRangePickerProps={{
                    dateRangeStart: context.dashboard.dateRangeStart,
                    dateRangeEnd: context.dashboard.dateRangeEnd,
                    setDateRangeStart: (value: any) => handleStateUpdate('dateRangeStart', value),
                    setDateRangeEnd:  (value: any) => handleStateUpdate('dateRangeEnd', value)
                }}
            />
            <Box sx={{
                display: "flex",
                justifyContent: "center",
            }}>
            <Stack 
                spacing={isFetching ? 25 : 0}
                sx={{
                    width: "92%",
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
                            {`${data.count || 0} ${data.count === 1 ? 'Case' : 'Cases'}`}
                        </Typography>
                        {!isMobile 
                            && <Box sx={{ minWidth: 120 }}>
                                    <DropDownComponent
                                        menuItems={dashboardSortDropDownValues}
                                        title="Sort:"
                                        selectId="case-sort-select"
                                        additionalStyles={{ marginLeft: "0.625rem" }}
                                        onChange={(value) => handleStateUpdate('dateSortValue', value)}
                                        value={context.dashboard.dateSortValue}
                                    />
                                <StyledCheckbox checkedIcon={<CheckBoxOutlinedIcon/>} />
                                <Typography variant="caption" color="black.main">Show Completed Cases</Typography>
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
                                        onChange={(value) => handleStateUpdate('dateSortValue', value)}
                                        value={context.dashboard.dateSortValue}
                                    />
                                <StyledCheckbox checkedIcon={<CheckBoxOutlinedIcon/>} />
                                <Typography variant="caption" color="black.main" >Show Completed Cases</Typography>
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
                {isFetching && <CircularProgress sx={{alignSelf: 'center'}} />}
                {
                    data.count > 50 
                        && 
                            <Pagination 
                                count={Math.ceil(data.count / paginationCount)} 
                                page={context.dashboard.page} 
                                onChange={(event, val) => handleStateUpdate('page', val)} 
                                sx={{ alignSelf: "center", marginTop: "4rem"}}
                            />
                }
            </Stack>
            </Box>
        </React.Fragment>
    );
  }
