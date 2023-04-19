import { Prisma } from '@prisma/client';
import moment from "moment";


//INTERFACES AND TYPES

export interface BookingSheetConfig {
  patient?: object,
  financial?: object,
  procedureTab?: object,
  scheduling?: object
}

export interface caseFilterInterface {
  value: string,
  id: string
} 

export interface Step {
  text: string,
  status: boolean
}

export interface APIParameters {
  [key: string]: string | string[]
}

// object type that allows indexing by keys
export interface IndexObject {
  [key: string]: any
}

export type FullCase = Prisma.casesGetPayload<{ include: { 
  patient: true, 
  scheduling: { include: {provider: true, location: true, procedureUnit?: true, serviceLine?: true, admissionType?: true} }, 
  financial: true,
  procedureTab?: {include: {procedure?: true, approach?: true, laterality?: true, anesthesia?: true, cptCode?: true, icdCode?: true}},
  comment?: {orderBy: {createTime: 'desc'}},
  document?: {orderBy: {createTime: 'desc'}},
} }>


// REFERENCE OBJECTS

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

export const includeReferencesObject = { 
  patient: true, 
  scheduling: { include: {provider: true, location: true, procedureUnit: true, serviceLine: true, admissionType: true} }, 
  financial: true
}


// BOOKING SHEET REFERENCE

export const defaultInsuranceValue = {
  insurance: null,
  insuranceGroupName: '',
  insuranceGroupNumber: '',
  priorAuthorization: '',
  priorAuthId: '',
  priorAuthDate: null,
}

export const defaultDiagnosticTest = {
  testName: null,
  testNameOther: '',
  testDateTime: null,
  atProcedureLocation: null,
  testFacilityName: '',
  testPhone: '',
  testAddressOne: '',
  testAddressTwo: '',
  testCity: '',
  testState: '',
  testZip: '',
}

export const defaultClearance = {
    testName: null,
    testNameOther: '',
    testDateTime: null,
    atProcedureLocation: null,
    facility: null
}

export const defaultFacility = {
  facilityName: '',
  phone: '',
  addressOne: '',
  addressTwo: '',
  city: '',
  state: '',
  zip: ''
}

export const defaultPreOpForm = {
  preOpDateTime: null,
  atProcedureLocation: null,
  facility: defaultFacility,
}

const facilityConfig = {
  facilityName: {default: ''},
  phone: {default: ''},
  addressOne: {default: ''},
  addressTwo: {default: ''},
  city: {default: ''},
  state: {default: ''},
  zip: {default: ''}
}

export const defaultBookingSheetConfig = {
  patient: {
      firstName: { default: '', required: true, visible: true },
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
  },
  clinical: {
    physicianFirstName: {default: ''},
    physicianLastName: {default: ''},
    physicianPhone: {default: ''},
    preOpRequired: {default: null},
    postOpDateTime: {default: null},
    diagnosticTestsRequired: {default: null},
    preOpForm: {
      preOpDateTime: {default: null},
      atProcedureLocation: {default: null},
      facility: facilityConfig,
    },
    diagnosticTests: [{
      diagnosticTest: {default: null},
      testNameOther: {default: ''},
      testDateTime: {default: null},
      atProcedureLocation: {default: null},
      facility: facilityConfig
    }],
    clearances: [{
      clearance: {default: null},
      testNameOther: {default: ''},
      testDateTime: {default: null},
      atProcedureLocation: {default: null},
      facility: facilityConfig
    }],
  }
}

export const priorAuthorizationData = [{priorAuthorization: 'Incomplete'}, {priorAuthorization: 'Complete'}];

export const diagnosticTestOptions = [
  {testName: 'A1C'},
  {testName: 'Basic Metabolic Panel (BMP)'},
  {testName: 'Chem 12'},
  {testName: 'Chem 7'},
  {testName: 'Chest X-ray'},
  {testName: 'Colonoscopy'},
  {testName: 'Complete Blood Count (CBC)'},
  {testName: 'Complete Blood Count (CBC) With Differential'},
  {testName: 'Complete Metabolic Panel (CMP)'},
  {testName: 'COVID'},
  {testName: 'Computerized tomography (CT) scan'},
  {testName: 'Electrocardiogram (ECG or EKG)'},
  {testName: 'Glucose'},
  {testName: 'International Normalized Ratio (INR)'},
  {testName: 'Lung Function Tests'},
  {testName: 'Magnetic resonance imaging (MRI)'},
  {testName: 'Methicillin-resistant Staphylococcus Aureus (MRSA)'},
  {testName: 'Pacemaker or Defibrillator Placement Report'},
  {testName: 'Partial thromboplastin time (PTT)'},
  {testName: 'Prothrombin time test (PT)'},
  {testName: 'Sickle Cell'},
  {testName: 'Stress Test'},
  {testName: 'Urinalysis (UA)'},
  {testName: 'Ultrasound'},
  {testName: 'Upper Endoscopy'},
  {testName: 'X-Ray'},
  {testName: 'Other'}
]

export const clearanceOptions = [
  {clearanceName: 'Medical'},
  {clearanceName: 'Cardiac'},
  {clearanceName: 'Dental'},
  {clearanceName: 'Pulmonary'},
  {clearanceName: 'Endocrine'},
  {clearanceName: 'Oncology/Hematology'},
  {clearanceName: 'Other'},
]