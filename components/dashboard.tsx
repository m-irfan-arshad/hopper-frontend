import React from "react";
import moment from "moment";
import CaseDateGroup from '../components/caseDateGroup';
import { useQuery } from 'react-query';
import { Box, Stack } from "@mui/material";

interface SingleCase {
    caseID: string,
    firstName: string,
    lastName: string,
    dateOfBirth: string,
    procedureDate: string,
    procedureLocation: string,
    proceduralist: string,
    mrn: string
}

interface CaseGroup {
    [key: string]: SingleCase[]
}

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
        const date = singleCase.procedureDate.split('T')[0];
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
