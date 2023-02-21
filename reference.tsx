import { Prisma, cases, patients } from '@prisma/client';
import moment from "moment";

export const caseCardProcedureInformation = [
  {
    label: "Date",
    id: "procedureDate",
  },
  {
    label: "Procedure Location",
    id: "locationName",
    fromTable: "locations"
  },
  {
    label: "Provider",
    id: "providerName",
    fromTable: "providers"
  }
];

export const caseCardCaseIdentifiers = [
  {
    label: "Case ID",
    id: "caseId",
  },
  {
    label: "MRN",
    id: "mrn",
    fromTable: 'patients'
  },
  {
    label: "Quick Actions",
    id: "quickActions",
  }
];

export const dashboardDateRangeDropDownValues = [
    {
        value: "This month",
        id: "1"
    },
    {
        value: "Next month",
        id: "2"
    }, 
    {
        value: "Next quarter",
        id: "3"
    }
];

export interface caseFilterInterface {
  value: string,
  id: string
} 

export const dashboardStepDropDownValues = [
    {
        value: "All Steps",
        id: "all"
    },
    {
        value: "Insurance Authorization",
        id: "priorAuthorization"
    },
    {
        value: "Vendor Confirmation",
        id: "vendorConfirmation"
    },
];

export const dashboardSortDropDownValues = [
    {
        value: "Newest - Oldest",
        id: "9"
    },
    {
        value: "Oldest - Newest",
        id: "10"
    }
];

export interface Step {
  text: string,
  status: boolean
}

export interface APIParameters {
  [key: string]: string | string[]
}

export const caseStepMappings = {
  priorAuthorization: "Prior Authorization",
  vendorConfirmation: "Vendor Confirmation"
}

export const paginationCount = 50;

export const defaultCaseFilterContext = {
  dashboard: {
    dateRangeStart:  moment().startOf('day'),
    dateRangeEnd:  moment().add(7, 'days').endOf('day'),
    dateSortValue: 'Newest - Oldest',
    caseFilterValue: [{id: "all", value: "All Steps"}],
    searchBarValue: '',
    page: 1
  }
};

export const bookingSheetConfigObject = {
  organization: "...",
  tabs: [
      {
          label: "Patient",
          fields: [
              {
                  id: "firstName",
                  required: true,
                  visible: true
              },
          ]
      }
  ]
}

export const patientSexData = [{sex: 'M'}, {sex: 'F'}, {sex: 'O'}]; 
export const stateData = [{state: 'New York'}, {state: 'New Jersey'}, {state: 'Oregon'}]; 
export const insuranceData = [{insurance: 'insurance1'}, {insurance: 'insurance2'}, {insurance: 'insurance3'}]; 
export const priorAuthApprovedData = [{priorAuthApproved: 'Yes'}, {priorAuthApproved: 'No'}]; 

export type FullCase = Prisma.casesGetPayload<{
  include: { patients?: true, locations?: true, providers?: true, serviceLines?: true, procedureUnits?: true, insurances?: true }
}>