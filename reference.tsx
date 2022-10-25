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

export const dashboardStepDropDownValues = [
    {
        value: "All Steps",
        id: "4"
    },
    {
        value: "Insurance Authorization",
        id: "5"
    },
    {
        value: "Pre Surgical Testing",
        id: "6"
    },
    {
        value: "Pre Admission Testing",
        id: "7"
    },
    {
        value: "Vendor Confirmation",
        id: "8"
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
