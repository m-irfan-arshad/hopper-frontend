import React from "react";
import CaseCard from "../components/caseCard";
import Typography from "@mui/material/Typography";
import { createTheme, ThemeProvider } from "@mui/material/styles";

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
        mrn: string
    }[]
}

const titleTheme = createTheme({
    typography: {
      body1: {
        width: '95%',
        fontSize: '14px',
        marginLeft: '70px',
        fontFamily: "Inter",
        fontStyle: "italic",
        marginTop: '30px'
      }
    },
  });


export default function caseDateGroup(props: Props) {
    const { date, list } = props;
  return (
      <>
    <ThemeProvider key={date} theme={titleTheme}><Typography>{date}</Typography></ThemeProvider>
    {
        list.map(function(singleCase) {
            return (
                <CaseCard key={singleCase.caseID} row={singleCase} />
            )
        })
    }
    </>
  );
}
