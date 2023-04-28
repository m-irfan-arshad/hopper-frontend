import React, { useContext } from "react";
import CaseDateGroup from '../components/caseDateGroup';
import CaseNavBar from "../components/caseNavBar";
import { Box, Stack, Button, Typography, useMediaQuery, CircularProgress, Pagination, styled, Checkbox } from "@mui/material";
import { FullCase, dashboardSortDropDownValues } from "../reference";
import { defaultTheme } from "../theme";
import { useGetCasesHook } from '../utils/hooks';
import { paginationCount } from '../reference';
import { formatDate } from '../utils/helpers';
import * as R from 'ramda';
import { CaseFilterContext } from "../pages/_app.page";

interface CaseGroup {
    [key: string]: FullCase[]
}

export default function Dashboard() {  
    const isMobile = useMediaQuery(defaultTheme.breakpoints.down('sm'));
    const [context, setContext] = useContext(CaseFilterContext);
    const shouldShowCount = context.dashboard.workQueue || context.dashboard.searchBarValue;

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
        context.dashboard.searchBarValue, 
        context.dashboard.page.toString(),
        context.dashboard.workQueue
    );

    const caseGroups:CaseGroup = {};

    data.cases.forEach(function(singleCase: FullCase) {
        const date = formatDate(singleCase.scheduling?.procedureDate) || "";
        if (date in caseGroups) {
            caseGroups[date].push(singleCase);
        } else {
            caseGroups[date] = new Array(singleCase)
        }
    })

    return (
        <React.Fragment>
            <CaseNavBar 
                searchBarValue={context.dashboard.searchBarValue}
                workQueue={context.dashboard.workQueue}
                onWorkQueueChange={(value: any) => handleStateUpdate('workQueue', value)}
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
                            {`${shouldShowCount && (data.count || 0)} ${data.count === 1 ? 'Case' : 'Cases'}`}
                        </Typography>
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
