// import { createTheme } from "@mui/material/styles";

// export const defaultTheme = createTheme({
//   typography: {
//     poster: {
//       color: "green",
//     },
//     h3: undefined,
//   },
//   components: {
//     MuiAppBar: {
//       styleOverrides: {
//         colorPrimary: {
//           backgroundColor: "blue",
//         },
//       },
//     },
//     MuiTypography: {
//       defaultProps: {
//         fontFamily: "Roboto",
//       },
//     },
//   },
// });

export const caseCardProcedureInformation = [
  {
    label: "Date",
    id: "procedureDate",
  },
  {
    label: "Procedure Location",
    id: "procedureLocation",
  },
  {
    label: "Proceduralist",
    id: "proceduralist",
  },
  {
    label: "Provider",
    id: "provider",
  }
];

export const caseCardCaseIdentifiers = [
  {
    label: "Case ID",
    id: "caseID",
  },
  {
    label: "MRN",
    id: "mrn",
  },
  {
    label: "Quick Actions",
    id: "quickActions",
  }
];

export interface Step {
  text: string,
  status: boolean
}

export interface SingleCase {
  [key: string]: any,
  caseID: string,
  firstName: string,
  lastName: string,
  dateOfBirth: string,
  procedureDate: string,
  procedureLocation: string,
  proceduralist: string,
  patientAddress?: string,
  specialNeeds?: string,
  mobilePhone?: string,
  homePhone?: string,
  allergies?: string,
  surgeryLength?: string,
  comments?: string,
  admissionType?: string,
  surgeryAssistance?: string,
  procedures?: string,
  notes?: string,
  mrn: string,
  steps: Step[]
}
