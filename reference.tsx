import { Prisma, cases, patients } from '@prisma/client';

export const caseCardProcedureInformation = [
  {
    label: "Date",
    id: "procedureDate",
  },
  {
    label: "Procedure Location",
    id: "locationName",
  },
  {
    label: "Provider",
    id: "providerName",
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
        value: "Oldest - Newest",
        id: "9"
    },
    {
        value: "Newest - Oldest",
        id: "10"
    }
];

export interface Step {
  text: string,
  status: boolean
}

export interface SingleCase extends Omit<cases, 'priorAuthorization' | 'vendorConfirmation' | 'procedureDate'> {
    [fhirResourceId: string]: any,
    patients: Omit<patients, 'createTime' | 'updateTime' | 'dateOfBirth'> & { 'dateOfBirth': string | null } | null,
    procedureDate: string | null,
    steps: {
      [priorAuthorization: string]:  string,
      vendorConfirmation:  string,
    }
}

export const caseStepMappings = {
  priorAuthorization: "Prior Authorization",
  vendorConfirmation: "Vendor Confirmation"
}
