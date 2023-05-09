import React from "react";
import CaseCard from "../components/caseCard";
import { Typography, Box } from "@mui/material";
import moment from "moment";
import { FullCaseWithBookingSheetStatus } from "../reference";

interface Props {
    date: string,
    list: FullCaseWithBookingSheetStatus[]
    index: number
}

export default function CaseDateGroup(props: Props) {
    const { date, list, index } = props;

  return (
    <Box sx={{ marginTop: "1.25rem" }}>
      <Box sx={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
        <Typography variant="caption" sx={{ color: "black.main" }} data-testid="caseDateGroup">
          {`${moment(date).format('MMMM D, YYYY')} (${list.length} cases)`}
        </Typography>
        <Box>
          {index === 0 && <Typography variant="caption" sx={{marginRight: "3.5rem", color:"black.main"}}>Booking Request</Typography>}
          {index === 0 && <Typography variant="caption" sx={{marginRight: "3.5rem", color:"black.main"}}>Case Progress</Typography>}
        </Box>
      </Box>
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
