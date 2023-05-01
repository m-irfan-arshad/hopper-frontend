import { Prisma } from '@prisma/client';
import moment from "moment";
import * as R from "ramda";


//INTERFACES AND TYPES

export interface BookingSheetConfig {
  patient?: object,
  financial?: object,
  procedureTab?: object,
  scheduling?: object,
  clinical?: object
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
  clinical?: {include: {diagnosticTests: {include: {facility: true, diagnosticTest: true}}, clearances: {include: {facility: true, clearance: true}}, preOpForm: {include: {facility: true}}}}
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

export const docTypeDropdownOptions = [
  {
      value: "Cardiology Clearance",
      id: "cardiologyClearance"
  },
  {
      value: "Chest X-Ray",
      id: "chestXRay"
  },
  {
      value: "Consent",
      id: "consent"
  },
  {
      value: "Driver’s License",
      id: "license"
  },
  {
      value: "EKG",
      id: "ekg"
  },
  {
      value: "H & P",
      id: "h&p"
  },
  {
      value: "Insurance Authorization Form",
      id: "insuranceAuth"
  },
  {
      value: "Insurance Card",
      id: "insuranceCard"
  },
  {
      value: "Labs",
      id: "labs"
  },
  {
      value: "Last Note",
      id: "lastNote"
  },
  {
      value: "Legal Guardianship Form",
      id: "guardianShipForm"
  },
  {
      value: "Orders",
      id: "orders"
  },
  {
      value: "Other",
      id: "other"
  },
  {
      value: "PAT Order Form",
      id: "orderForm"
  },
  {
      value: "Pharmacy Orders",
      id: "pharmacyOrders"
  },
  {
      value: "Pre-Op Clearance Packet",
      id: "clearancePacket"
  },
  {
      value: "Surgical Risk Form ",
      id: "surgicalRiskForm"
  }
];

export const dashboardWorkQueueDropDownValues = [
  {
      value: "Booking Sheet Request",
      id: "bookingSheetRequest"
  },
  {
      value: "Pending Scheduling Confirmation",
      id: "pendingSchedulingConfirmation"
  }, 
  {
      value: "Insurance Authorization",
      id: "insuranceAuth"
  },
  {
    value: "Preadmission Testing At Hospital",
    id: "preadmissionTestingAtHospital"
  },
  {
    value: "Case Amendments",
    id: "caseAmendments"
  }
];

export interface Step {
  text: string,
  status: boolean
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
    searchBarValue: '',
    page: 1,
    workQueue: ''
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

export const defaultFacility = {
  facilityName: '',
  phone: '',
  addressOne: '',
  addressTwo: '',
  city: '',
  state: '',
  zip: ''
}

export const defaultClearance = {
    clearanceName: null,
    clearanceNameOther: '',
    clearanceDateTime: null,
    physicianFirstName: '',
    physicianLastName: '',
    physicianPhone: '',
    atProcedureLocation: null,
    facility: defaultFacility
}

export const defaultPreOpForm = {
  preOpDateTime: null,
  atProcedureLocation: null,
  facility: defaultFacility,
}

export const defaultDiagnosticTest = {
  diagnosticTest: null,
  testNameOther: '',
  testDateTime: null,
  atProcedureLocation: null,
  facility: defaultFacility
}

const facilityConfig = (pathToDeleteFieldFromFacility: string) => {
  return {
    facilityName: {default: '', required: true, pathToDeleteFieldFromQuery: pathToDeleteFieldFromFacility + 'facilityName'},
    phone: {default: '', pathToDeleteFieldFromQuery: pathToDeleteFieldFromFacility + 'phone'},
    addressOne: {default: '', required: true, pathToDeleteFieldFromQuery: pathToDeleteFieldFromFacility + 'addressOne'},
    addressTwo: {default: '', required: true, pathToDeleteFieldFromQuery: pathToDeleteFieldFromFacility + 'addressTwo'},
    city: {default: '', pathToDeleteFieldFromQuery: pathToDeleteFieldFromFacility + 'city'},
    state: {default: '', pathToDeleteFieldFromQuery: pathToDeleteFieldFromFacility + 'state'},
    zip: {default: '', pathToDeleteFieldFromQuery: pathToDeleteFieldFromFacility + 'zip'}
  }
}

export const defaultBookingSheetConfig = {
  patient: {
      firstName: { default: '', required: true, pathToDeleteFieldFromQuery: 'patient.AND.0.firstName' },
      middleName: { default: '', required: false, pathToDeleteFieldFromQuery: 'patient.AND.0.middleName' },
      lastName: { default: '', pathToDeleteFieldFromQuery: 'patient.AND.0.lastName'  },
      dateOfBirth: { default: null, required: true, pathToDeleteFieldFromQuery: 'patient.AND.0.dateOfBirth' },
      sex: { default: null, pathToDeleteFieldFromQuery: 'patient.AND.0.sexId'  },
      address: { default: '', pathToDeleteFieldFromQuery: 'patient.AND.0.address'  },
      city: { default: '', pathToDeleteFieldFromQuery: 'patient.AND.0.city'  },
      state: { default: null, pathToDeleteFieldFromQuery: 'patient.AND.0.stateId' },
      zip: { default: '', pathToDeleteFieldFromQuery: 'patient.AND.0.zip'},
  },
  financial: [{
      insurance: { default: null, required: false },
      insuranceGroupName: { default: '', pathToDeleteFieldFromQuery: 'financial.none.insuranceGroupName' },
      insuranceGroupNumber: { default: '', pathToDeleteFieldFromQuery: 'financial.none.insuranceGroupNumber' },
      priorAuthorization: { default: null, required: true, pathToDeleteFieldFromQuery: 'financial.none.priorAuthorization' },
      priorAuthId: { default: '', required: true, pathToDeleteFieldFromQuery: 'financial.none.priorAuthId' },
      priorAuthDate: { default: null, pathToDeleteFieldFromQuery: 'financial.none.priorAuthDate' },
  }],
  procedureTab: {
      procedure: { default: null, pathToDeleteFieldFromQuery: 'procedureTab.AND.0.procedureId' },
      approach: { default: null, pathToDeleteFieldFromQuery: 'procedureTab.AND.0.approachId' },
      laterality: { default: null, pathToDeleteFieldFromQuery: 'procedureTab.AND.0.lateralityId' },
      anesthesia: { default: [], required: false }, 
      anesthesiaNotes: { required: true, default: '', pathToDeleteFieldFromQuery: 'procedureTab.AND.0.anesthesiaNotes' },
      cptCode: { default: null, pathToDeleteFieldFromQuery: 'procedureTab.AND.0.cptCodeId' },
      icdCode: { default: null, required: true, pathToDeleteFieldFromQuery: 'procedureTab.AND.0.icdCodeId' },
  },
  scheduling: {
      location: { default: null, required: true, pathToDeleteFieldFromQuery: 'scheduling.AND.0.locationId' },
      procedureUnit: { default: null, pathToDeleteFieldFromQuery: 'scheduling.AND.0.procedureUnitId' },
      serviceLine: { default: null, pathToDeleteFieldFromQuery: 'scheduling.AND.0.serviceLineId' },
      provider: { default: null, pathToDeleteFieldFromQuery: 'scheduling.AND.0.providerId' },
      procedureDate: { default: null },
      admissionType: { default: null, pathToDeleteFieldFromQuery: 'scheduling.AND.0.admissionTypeId' }
  },
  clinical: {
    physicianFirstName: {default: '', pathToDeleteFieldFromQuery: 'clinical.AND.0.physicianFirstName'},
    physicianLastName: {default: '', pathToDeleteFieldFromQuery: 'clinical.AND.0.physicianLastName'},
    physicianPhone: {default: '', pathToDeleteFieldFromQuery: 'clinical.AND.0.physicianPhone'},
    preOpRequired: {default: null},
    postOpDateTime: {default: null, pathToDeleteFieldFromQuery: 'clinical.AND.0.postOpDateTime'},
    diagnosticTestsRequired: {default: null},
    clearanceRequired: {default: null},
    preOpForm: {
      preOpDateTime: {default: null, required: true, pathToDeleteFieldFromQuery: 'clinical.AND.1.OR.1.preOpForm.is.preOpDateTime' },
      atProcedureLocation: {default: null},
      facility: facilityConfig('clinical.AND.1.OR.1.preOpForm.is.OR.1.facility.is.')
    },
    diagnosticTests: [{
      diagnosticTest: {default: null, required: false},
      testNameOther: {default: ''},
      testDateTime: {default: null},
      atProcedureLocation: {default: null},
      facility: facilityConfig('clinical.AND.3.OR.1.diagnosticTests.some.OR.1.facility.is.')
    }],
    clearances: [{
      clearance: {default: null, required: false},
      testNameOther: {default: ''},
      testDateTime: {default: null},
      atProcedureLocation: {default: null},
      facility: facilityConfig('clinical.AND.2.OR.1.clearances.some.OR.1.facility.is.')
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

export interface patientTabFilterInterface {
  AND: patient[],
} 

export interface patient {
  firstName?: object
  middleName?: object
  lastName?: object
  dateOfBirth?: object
  sexId?: object 
  address?: object
  city?: object
  stateId?: object
  zip?: object
}

export const defaultPatientTabFilter: patientTabFilterInterface = {
  AND: [
    {
        firstName: {not: ''},
        middleName: {not: ''},
        lastName: {not: ''},
        zip: {not: ''},
        dateOfBirth: {not: null},
        address: {not: ''},
        city: {not: ''},
        sexId: {not: 0},
        stateId: {not: 0},
    }
  ]
}

export interface SchedulingTabInterface {
  AND: scheduling[],
} 

export interface scheduling {
  admissionTypeId?: object
  locationId?: object
  procedureUnitId: object,
  serviceLineId: object,
  providerId: object,
}

export const defaultSchedulingFilter: SchedulingTabInterface = {
  AND: [
    {
      locationId: {not: 0},
      procedureUnitId: {not: 0},
      serviceLineId: {not: 0},
      providerId: {not: 0},
      admissionTypeId: {not: 0},
    }
  ]
}

export interface ProcedureTabInterface {
  AND: procedureTab[],
} 

export interface procedureTab {
  procedureId?: object 
  approachId?: object 
  lateralityId?: object 
  cptCodeId?: object 
  icdCodeId?: object 
  anesthesiaNotes?: object
}

export const defaultProcedureTabFilter: ProcedureTabInterface = {
  AND: [
    {
      procedureId: {not: 0},
      approachId: {not: 0 },
      lateralityId: {not: 0 } ,
      anesthesiaNotes: {not: ''},
      cptCodeId: {not: 0 },
      icdCodeId: {not: 0 },
    }
  ]
}

export interface FinancialTabInterface {
  none: financial,
  some: object
} 

export interface financial {
  insuranceGroupName?: string
  insuranceGroupNumber?: string
  priorAuthorization?: string
  priorAuthId?: string
  priorAuthDate?: Date | null
}

export const defaultFinancialFilter: FinancialTabInterface = {
  none: {
    insuranceGroupName: '' ,
    insuranceGroupNumber: '' ,
    priorAuthorization: '' ,
    priorAuthId: '',
    priorAuthDate: null,
  },
  some: {}
}

const facilityFilter = {
  OR: [
    {atProcedureLocation: true},
    {
      facility: {
        is: {
            facilityName: {not: ""},
            phone: {not: ""} ,
            addressOne: {not: ""} ,
            addressTwo:{not: ""} ,
            city: {not: ""} ,
            state: {not: ""} ,
            zip: {not: ""} ,
        }
      }
    }
  ]
}
  
const preOpFormFilter = {
  OR: [
    {preOpRequired: 'false'},
    {
      preOpForm: {
        is: {
          preOpDateTime: { not: null },
          ...facilityFilter
        }
      }
    }
  ]
}

const diagnosticTestFormFilter = {
  OR: [
    {diagnosticTestsRequired: 'false'},
    {
      diagnosticTests: {
        some: {
          AND: [
            { 
              OR: [
                {diagnosticTest: {is: {testName: {not: "Other"}}}},
                {diagnosticTest: {is: {testName: "Other"}}, testNameOther: { not: "" }}
              ]
            }
          ],
          testDateTime: { not: null },
          ...facilityFilter
        }
      }
    }
  ]
}
  
const clearanceFormFilter = {
  OR: [
    {clearanceRequired: 'false'},
    {
      clearances: {
        some: {
          AND: [
              { 
                OR: [
                  {clearance: {is: {clearanceName: {not: "Other"}}}},
                  {clearance: {is: {clearanceName: "Other" }}, clearanceNameOther: { not: "" }}
                ]
              }
          ],
          clearanceDateTime: { not: null },
          ...facilityFilter
        }
      }
    }
  ]  
}

export interface ClinicalTabInterface {
  AND: object[]
} 

export const defaultClinicalFilter: ClinicalTabInterface = {
  AND: [
    {
      physicianFirstName: {not: ""},
      physicianLastName: {not: ""} ,
      physicianPhone: {not: ""} ,
      postOpDateTime: {not: null},
    },
      preOpFormFilter,
      clearanceFormFilter,
      diagnosticTestFormFilter
  ],
}