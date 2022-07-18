import React from "react";
import CaseCard from "../components/caseCard";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import moment from "moment";
import { Step } from "../reference";

interface Props {
    date: string,
    list: {
        caseID: string,
        firstName: string,
        lastName: string,
        dateOfBirth: string,
        procedureDate: string,
        procedureLocation: string,
        proceduralist: string,
        mrn: string,
        steps: Step[]
    }[]
}

export default function caseDateGroup(props: Props) {
    const { date, list } = props;
  return (
    <Box sx={{ marginBottom: "20px" }}>
    <Typography sx={{
      fontSize: "12px",
      color: "black.main",
      fontStyle: "italic",
      fontFamily: "Roboto",
      marginTop: "20px"
    }}>
      {`${moment(date).format('MMMM D, YYYY')} (${list.length} cases)`}
    </Typography>
    {
        list.map(function(singleCase) {
            return (
                <CaseCard key={singleCase.caseID} row={singleCase} />
            )
        })
    }
    </Box>
  );
}
