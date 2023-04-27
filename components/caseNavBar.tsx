import React, { useState } from "react";
import { AppBar, styled, Box, Button, useMediaQuery } from '@mui/material';
import { Add, CheckBoxOutlined as CheckBoxOutlinedIcon } from "@mui/icons-material";
import CreateCaseDialog from "./createCaseDialog";
import DateRangePicker from "./shared/dateRangePicker";
import { dashboardStepDropDownValues } from "../reference";
import { defaultTheme } from "../theme";
import DebouncedInput from './debouncedInput';
import DropDownComponent from "./shared/dropdown";
import { dashboardWorkQueueDropDownValues } from '../reference';

interface Props {
    search: (value: string) => void
    searchBarValue: string
    dateRangePickerProps: dateRangePickerProps
    workQueue: string
    onWorkQueueChange: (value: string) => void
}

interface dateRangePickerProps {
    dateRangeStart: moment.Moment
    dateRangeEnd: moment.Moment | null
    setDateRangeStart: (value: moment.Moment) => void
    setDateRangeEnd: (value: moment.Moment | null) => void
}

export default function CaseNavBar(props: Props) {
    const { searchBarValue, search, dateRangePickerProps, onWorkQueueChange, workQueue } = props;

    const [isDialogOpen, setDialogState] = useState(false);
    const isMobile = useMediaQuery(defaultTheme.breakpoints.down('sm'));

    const StyledBox = styled(Box)({
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
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
                <StyledBox sx={{ width: "92%" }}>
                    <StyledBox>
                        <DebouncedInput 
                            value={searchBarValue} 
                            onChange={search}
                            placeholder={'Search Patient Name'}
                            additionalStyles={{ 
                                "& .MuiInputBase-root": {
                                    height: '2.5rem',
                                    '& fieldset': {
                                        borderColor: 'gray.main',
                                    },
                                },
                                "& .MuiOutlinedInput-input": {
                                    fontSize: "0.875rem",
                                    "&::placeholder": {
                                        fontStyle: "normal",
                                        color: "gray.dark",
                                        opacity: 1
                                    }
                                },
                                marginRight: "0.625rem",
                                minWidth: "14.375rem"
                            }}
                        /> 
                         <DropDownComponent
                            menuItems={dashboardWorkQueueDropDownValues}
                            placeholder={'Select Work Queue'}
                            selectId="work-queue-select"
                            additionalStyles={{ marginRight: "0.625rem", alignSelf: 'flex-end'}}
                            onChange={(value) => onWorkQueueChange(value)}
                            value={workQueue}
                        />
                    { !isMobile &&
                        <React.Fragment>
                            <DateRangePicker 
                                dateRangeStart={dateRangePickerProps.dateRangeStart}
                                dateRangeEnd={dateRangePickerProps.dateRangeEnd} 
                                setDateRangeStart={dateRangePickerProps.setDateRangeStart}
                                setDateRangeEnd={dateRangePickerProps.setDateRangeEnd}
                            />
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
            </AppBar>
        </React.Fragment>
    );
}
