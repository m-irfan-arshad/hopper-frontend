import React, { useState } from "react";
import { AppBar, styled, Box, Button, Checkbox, Typography, useMediaQuery } from '@mui/material';
import { Add, CheckBoxOutlined as CheckBoxOutlinedIcon } from "@mui/icons-material";
import CreateCaseDialog from "./createCaseDialog";
import DropDownComponent from "./shared/dropdown";
import { dashboardDateRangeDropDownValues, dashboardStepDropDownValues, caseFilterInterface } from "../reference";
import { defaultTheme } from "../theme";
import DebouncedInput from './debouncedInput';
import MultiSelectDropdownComponent from "./shared/multiSelectDropdown";


interface Props {
    onDateFilterChange: (value: string) => void
    onCaseFilterChange: (value: caseFilterInterface[]) => void
    search: (value: string) => void
    caseFilterValue: caseFilterInterface[]
    dateFilterValue: string
    searchBarValue: string
}

export default function CaseNavBar(props: Props) {
    const { onDateFilterChange, dateFilterValue, onCaseFilterChange, caseFilterValue, searchBarValue, search } = props;

    const [isDialogOpen, setDialogState] = useState(false);
    const isMobile = useMediaQuery(defaultTheme.breakpoints.down('sm'));

    const StyledBox = styled(Box)({
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
    });

    const StyledCheckbox = styled(Checkbox)({
        marginLeft: "0.625rem",
        marginRight: "0.313rem", 
        height: "1.5rem", 
        width: "1.5rem",
        color: defaultTheme.palette.blue.light,
        "&.Mui-checked": {
            color: defaultTheme.palette.green.light
        },
        [defaultTheme.breakpoints.down("sm")]: {
            marginLeft: "1.25rem",
        }
    });

    return (
        <React.Fragment>
            <CreateCaseDialog open={isDialogOpen} closeDialog={() => setDialogState(false)} />
            <AppBar position="static" sx={{
                backgroundColor: 'white.main',
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: {xs: "6.75rem", sm:"3.75rem"},
                boxShadow: "0rem 0.063rem 0rem #D8E4F4"
            }}>
                <StyledBox sx={{ width: "92%", maxWidth: "60rem" }}>
                    <StyledBox>
                        <DebouncedInput 
                            value={searchBarValue} 
                            onChange={search}
                            placeholder={'Search Name or Case ID'}
                            additionalStyles={{ 
                                "& .MuiInputBase-root": {
                                    height: '2.5rem'
                                },
                                "& .MuiOutlinedInput-input": {
                                    fontSize: "0.875rem"
                                },
                                marginRight: "0.625rem",
                                minWidth: "230px"
                            }}
                        /> 
                    { !isMobile &&
                        <React.Fragment>
                            <DropDownComponent
                                menuItems={dashboardDateRangeDropDownValues}
                                title="Date Range:"
                                selectId="case-date-select"
                                onChange={onDateFilterChange}
                                value={dateFilterValue}
                            />
                            <MultiSelectDropdownComponent
                                menuItems={dashboardStepDropDownValues}
                                title="Step:"
                                selectId="case-step-select"
                                additionalStyles={{ marginLeft: "0.625rem"}}
                                onChange={onCaseFilterChange}
                                value={caseFilterValue}
                            />
                            <StyledCheckbox checkedIcon={<CheckBoxOutlinedIcon/>} />
                            <Typography variant="caption" color="black.main">Show Completed Cases</Typography>
                        </React.Fragment>
                        }
                    </StyledBox>
                    {!isMobile 
                        && <Button 
                            size="small"
                            variant="contained"
                            color="success"
                            startIcon={<Add />}
                            onClick={() => setDialogState(true)}>
                                Create Case
                        </Button>
                    }
                </StyledBox>
                {isMobile 
                    && <React.Fragment>
                        <Box sx={{ display: "flex", alignItems: "flex-start", flexDirection: "column", width: "100%"}}>
                            <div>
                            <DropDownComponent
                                menuItems={dashboardDateRangeDropDownValues}
                                title="Date Range:"
                                selectId="case-date-select"
                                onChange={onDateFilterChange}
                                value={dateFilterValue}
                            />
                            <MultiSelectDropdownComponent
                                menuItems={dashboardStepDropDownValues}
                                title="Step:"
                                selectId="case-step-select"
                                additionalStyles={{ marginLeft: "0.625rem"}}
                                onChange={onCaseFilterChange}
                                value={caseFilterValue}
                            />
                            </div>
                        <Typography variant="body1" sx={{marginTop: "1rem"}}><StyledCheckbox checkedIcon={<CheckBoxOutlinedIcon/>}/> Show Completed Cases </Typography>
                    </Box>
                    </React.Fragment>
                }
            </AppBar>
        </React.Fragment>
    );
}
