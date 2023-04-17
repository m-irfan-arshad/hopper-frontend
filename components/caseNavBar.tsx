import React, { useState } from "react";
import { AppBar, styled, Box, Button, useMediaQuery } from '@mui/material';
import { Add, CheckBoxOutlined as CheckBoxOutlinedIcon } from "@mui/icons-material";
import CreateCaseDialog from "./createCaseDialog";
import DateRangePicker from "./shared/dateRangePicker";
import { dashboardStepDropDownValues, caseFilterInterface } from "../reference";
import { defaultTheme } from "../theme";
import DebouncedInput from './debouncedInput';
import MultiSelectDropdown from "./shared/multiSelectDropdown";
import DropDownComponent from "./shared/dropdown";
import { dashboardWorkQueueDropDownValues } from '../reference';


/* 
TODO: implement filters below

    1. Booking Sheet Request

       - Shows all cases where required fields are not filled out

            QUESTION:

            - Do we have a list of all required fields?  (we have default list but the list is configurable by org, for this scope lets do just default list)

            - How to tell what fields are required? It seems like right now by default they all are? 

    2. Pending Scheduling Confirmation

        - Shows all cases where the “Confirmation #” and “Hospital MRN” fields have not been filled out

        - The filter is configurable to show either both “Confirmation #” and “Hospital MRN” fields or just one of the two: “Confirmation #” or “Hospital MRN” 

            QUESTION:

            - What are the “Confirmation #” and “Hospital MRN” fields? Where are they? (apparently hospital MRN DOES NOT EQUAL patient MRN)
                - one is used for identifying the scheduled case and the other is used to identify the patient

            - This is on the scheduling tab

    3. Insurance Authorization

        - Shows all cases where the “Is this procedure authorized by the insurance company?” field has a dropdown value selected but the verification button has not yet been verified on the Insurance tab

             QUESTION:

            - is the insurance tab actually just the financial tab or is there another tab?

            - There is the priorAuthorization field on the financial tab thats either complete or incomplete... is this what I am supposed to use?

    4. Preadmission Testing At Hospital

        - Shows all cases where the “Is pre-admission testing required for this patient?” radio button “Required” is selected and the checkbox “At Procedure Location” is selected on the Clinical tab

             QUESTION:
            
             - Where is this pre-admission testing radio button located?
                - clinical tab

    5. Case Amendments

        - Show all cases where there is an un-acknowledged case amendment

        QUESTION:

            - What is an un-acknowledged case? Have we even made a mechanism to acknowledge/unacknowledge a case?


    

    TODO: 
    ANSWERING JOELS QUESTION IN STANDUP CHAT FROM 4/13

    i dont think we will need individual case step filers (case step being the first 4 of the 5 filters above) 
    outside of the booking sheet completion since the rest are just based on 2 fields and shouldn't be too hard to pull the individual fields when calling getCases


    IMPLEMENTATION IDEAS FOR THE FIVE ABOVE

    Is insurance tab = financial tab?

    1. Booking Sheet Request - have some sort of boolean that tells us when the booking sheet is finished
        1a. Where is this boolean stored? my guess is case but maybe not?
        1b. How is this value calculated and then stored in the database? Should this come from the front end? 
    2. Pending Scheduling Confirmation - need to show all cases where hospital MRN and confirmation # are not filled out 
        (but can be figured to show only 1 of the 2)
        1a. By configurability, we mean that the user can see either the patients without mrn or the patients without confirmation # right?
        1b. How is this configurable? (I.E. what does the UI look like for the user to configure to see either option)
            (options being confirmation # only or hospital MRN only)
    3. Insurance Authorization - Is this procedure authorized by the insurance company? field needs a dropdownvalue answer
        but the verification button has not been clicked on the Insurance tab...
        1a. Is the verification button a boolean value that we store or is it like another save button to save the progress?
            If its the former... this is pretty easy... just check if dropdown has a value and boolean is false on 'insurance tab'
    4. Preadmission Testing At Hospital - Is pre-admission testing required for this patient? Radio button has been clicked (boolean = true)
        and checkbox 'At Procedure Location' has been selected... (boolean = true)... seems easy enough
    5. Case Amendments - out of scope, don't know enough about how to persist amendments to really start

    SIDE QUESTIONS: 
    Step: All Steps filter is getting removed in favor of this work queue stuff right?
    Should the + filters dialog be started in this ticket too or should I just make the button and its functionality is in a separate ticket?

    TODO: 

    try to dynamically query for the booking sheet being complete (with some sort of helper function)

*/
interface Props {
    onCaseFilterChange: (value: caseFilterInterface[]) => void
    search: (value: string) => void
    caseFilterValue: caseFilterInterface[]
    searchBarValue: string
    dateRangePickerProps: dateRangePickerProps
}

interface dateRangePickerProps {
    dateRangeStart: moment.Moment
    dateRangeEnd: moment.Moment | null
    setDateRangeStart: (value: moment.Moment) => void
    setDateRangeEnd: (value: moment.Moment | null) => void
}

export default function CaseNavBar(props: Props) {
    const { onCaseFilterChange, caseFilterValue, searchBarValue, search, dateRangePickerProps } = props;

    const [isDialogOpen, setDialogState] = useState(false);
    const [selectedWorkQueue, selectWorkQueue] = useState('');
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
                            onChange={(value) => selectWorkQueue(value)}
                            value={selectedWorkQueue}
                        />
                    { !isMobile &&
                        <React.Fragment>
                            <DateRangePicker 
                                dateRangeStart={dateRangePickerProps.dateRangeStart}
                                dateRangeEnd={dateRangePickerProps.dateRangeEnd} 
                                setDateRangeStart={dateRangePickerProps.setDateRangeStart}
                                setDateRangeEnd={dateRangePickerProps.setDateRangeEnd}
                            />
                            <MultiSelectDropdown
                                menuItems={dashboardStepDropDownValues}
                                title="Step:"
                                selectId="case-step-select"
                                additionalStyles={{ marginLeft: "0.625rem", padding: 0}}
                                onChange={onCaseFilterChange}
                                value={caseFilterValue}
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
