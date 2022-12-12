import React, { useState } from "react";
import moment from "moment";
import CaseDateGroup from '../components/caseDateGroup';
import CaseNavBar from "../components/caseNavBar";
import { Box, Stack, Button, Typography, useMediaQuery, CircularProgress, Pagination, styled, Checkbox } from "@mui/material";
import { Logout, CheckBoxOutlined as CheckBoxOutlinedIcon } from "@mui/icons-material";
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

    const [dateRangeStart, setDateRangeStart] = useState(moment().startOf('day'));
    const [dateRangeEnd, setDateRangeEnd] = useState<moment.Moment | null>(moment().add(7, 'days').endOf('day'));
    const [isDateRangeEndCalendarOpen, setDateRangeEndCalendarStatus] = useState(false);
    const [isDateRangeStartCalendarOpen, setDateRangeStartCalendarStatus] = useState(false);

    const [dateSortValue, setDateSortValue] = useState('Oldest - Newest');
    const [caseFilterValue, setCaseFilterValue] = useState(defaultCaseFilterValue);
    const [searchBarValue, setSearchBarValue ] = useState('');
    const [page, setPage] = useState(1);

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
        setPage(1);
        setSearchBarValue(value);
    }

    const { data = {cases: [], count: 0}, isFetching } = useGetCasesHook(dateRangeStart, dateRangeEnd, dateSortValue, caseFilterValue, searchBarValue, page.toString());

    const caseGroups:CaseGroup = {};

    const dateRangePickerProps = {
        dateRangeStart: dateRangeStart,
        dateRangeEnd: dateRangeEnd,
        isDateRangeStartCalendarOpen: isDateRangeStartCalendarOpen,
        isDateRangeEndCalendarOpen: isDateRangeEndCalendarOpen,
        setDateRangeStart: setDateRangeStart,
        setDateRangeEnd: setDateRangeEnd,
        setDateRangeEndCalendarStatus: setDateRangeEndCalendarStatus,
        setDateRangeStartCalendarStatus: setDateRangeStartCalendarStatus
    }

        data.cases.forEach(function(singleCase: SingleCase) {
            const date = singleCase.procedureDate || "";
            if (date in caseGroups) {
                caseGroups[date].push(singleCase);
            } else {
                caseGroups[date] = new Array(singleCase)
            }
        })
        
    const handleCaseFilterChange = (value: caseFilterInterface[]) => {
        setPage(1);

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
                searchBarValue={searchBarValue}
                search={handleSearchBarChange}
                dateRangePickerProps={dateRangePickerProps}
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
                                    onChange={setDateSortValue}
                                    value={dateSortValue}
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
                                        onChange={setDateSortValue}
                                        value={dateSortValue}
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
                        && <Pagination 
                                count={Math.ceil(data.count / paginationCount)} 
                                page={page} 
                                onChange={(event, val) => setPage(val)} 
                                sx={{ alignSelf: "center", marginTop: "4rem"}}
                            />
                }
            </Stack>
            </Box>
        </React.Fragment>
    );
  }
