import { Prisma } from '@prisma/client';
import moment from "moment";

export const caseCardProcedureInformation = [
  {
    label: "Date",
    id: "procedureDate",
    path: ["scheduling", "procedureDate"],
    type: "date"
  },
  {
    label: "Procedure Location",
    id: "locationName",
    path: ["scheduling", "location", "locationName"]
  },
  {
    label: "Provider",
    id: "providerName",
    path: ["scheduling", "provider"]
  }
];

export const caseCardCaseIdentifiers = [
  {
    label: "Case ID",
    id: "caseId",
    path: ["caseId"]
  },
  {
    label: "MRN",
    id: "mrn",
    path: ["patient", "mrn"]
  },
  {
    label: "Quick Actions",
    id: "quickActions",
    path: ["quickActions"],
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

export const priorAuthorizationData = [{priorAuthorization: 'Incomplete'}, {priorAuthorization: 'Complete'}];

export const includeReferencesObject = { 
  patient: true, 
  scheduling: { include: {provider: true, location: true, procedureUnit: true, serviceLine: true, admissionType: true} }, 
  financial: true
}

export type FullCase = Prisma.casesGetPayload<{ include: { 
  patient: true, 
  scheduling: { include: {provider: true, location: true, procedureUnit?: true, serviceLine?: true, admissionType?: true} }, 
  financial: true,
  procedureTab?: {include: {procedure?: true, approach?: true, laterality?: true, anesthesia?: true, cptCode?: true, icdCode?: true}},
  comment?: {orderBy: {createTime: 'desc'}}
} }>

export const defaultInsuranceValue = {
  insurance: null,
  insuranceGroupName: '',
  insuranceGroupNumber: '',
  priorAuthorization: '',
  priorAuthId: '',
  priorAuthDate: null,
}

// object type that allows indexing by keys
export interface IndexObject {
  [key: string]: any
}

export const defaultBookingSheetConfig = {
  patient: {
      firstName: { default: '', required: true },
      middleName: { default: '' },
      lastName: { default: '' },
      dateOfBirth: { default: null },
      sex: { default: null },
      address: { default: '' },
      city: { default: '' },
      state: { default: null },
      zip: { default: '' },
  },
  financial: [{
      insurance: { default: null },
      insuranceGroupName: { default: '' },
      insuranceGroupNumber: { default: '' },
      priorAuthorization: { default: null },
      priorAuthId: { default: '' },
      priorAuthDate: { default: null },
  }],
  procedureTab: {
      procedure: { default: null },
      approach: { default: null },
      laterality: { default: null },
      anesthesia: { default: [] },
      anesthesiaNotes: { required: true, default: '' },
      cptCode: { default: null },
      icdCode: { default: null },
  },
  scheduling: {
      location: { default: null },
      procedureUnit: { default: null },
      serviceLine: { default: null },
      provider: { default: null },
      procedureDate: { default: null },
      admissionType: { default: null }
  }
}

export const userConfigObject = {
  organization: "...",
  tabs: {
    patient: {
      firstName: { visible: true, required: false },
      middleName: { visible: true, required: false },
      lastName: { visible: true, required: true },
      state: { visible: true },
      dateOfBirth: { required: false },
    },
  }
}

export interface BookingSheetConfig {
  patient?: object,
  financial?: object,
  procedureTab?: object,
  scheduling?: object
}