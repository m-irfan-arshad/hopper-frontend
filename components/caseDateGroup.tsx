import React from "react";
import CaseCard from "../components/caseCard";
import { Typography, Box } from "@mui/material";
import moment from "moment";
import { SingleCase } from "../reference";

interface Props {
    date: string,
    list: SingleCase[]
}

export default function CaseDateGroup(props: Props) {
    const { date, list } = props;
  return (
    <Box sx={{ marginTop: "1.25rem" }}>
    <Typography variant="caption" sx={{ color: "black.main", marginTop: "1.25rem" }} data-testid="caseDateGroup">
      {`${moment(date).format('MMMM D, YYYY')} (${list.length} cases)`}
    </Typography>
    {
        list.map(function(singleCase) {
            return (
                <CaseCard key={singleCase.caseId} row={singleCase} />
            )
        })
    }
    </Box>
  );
}
