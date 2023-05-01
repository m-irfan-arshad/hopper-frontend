import moment from "moment";
import { UserProvider } from '@auth0/nextjs-auth0';
import { ThemeProvider } from "@mui/material/styles";
import { defaultTheme } from "./theme";
import { FullCase } from "./reference";
import { useForm, FormProvider } from "react-hook-form";
import { Prisma, patient, provider, scheduling, location, insurance, serviceLine, procedureUnit, admissionType, procedure, approach, laterality, anesthesia, icdCode, cptCode, procedureTab, comment, document, clinical } from "@prisma/client";

const sampleDate = moment('2023-01-09').toDate();

export const mockSingleFacility = {
    facilityId: 1,
    facilityName: 'Test Facility',
    phone: '1234567890',
    addressOne: 'Test Address 1',
    addressTwo: 'Test Address 2',
    city: 'NY',
    state: 'NY',
    zip: '10000'
  }
  
  export const mockSingleClearance = {
      clinicalId: 1,
      clearanceId: 1,
      clearanceFormId: 1,
      clearanceNameId: 1,
      facilityId: 1,
      clearance: {clearanceName: 'test clearance', clearanceId: 1},
      clearanceNameOther: '',
      clearanceDateTime: null,
      physicianFirstName: '',
      physicianLastName: '',
      physicianPhone: '',
      atProcedureLocation: null,
      facility: mockSingleFacility
  }
  
  export const mockSinglePreOpForm = {
    clinicalId: 1,
    preOpFormId: 1,
    facilityId: 1,
    preOpDateTime: null,
    atProcedureLocation: null,
    facility: mockSingleFacility,
  }
  
  export const mockSingleDiagnosticTest = {
    diagnosticTestFormId: 1,
    diagnosticTestId: 1, 
    clinicalId: 1,
    facilityId: 1,
    diagnosticTest: {diagnosticTestId: 1, testName: "test test"},
    testNameOther: '',
    testDateTime: null,
    atProcedureLocation: null,
    facility: mockSingleFacility
  }

  export const mockSingleClinical = {
    clinicalId: 1,
    physicianFirstName: 'John',
    physicianLastName: 'Doe',
    physicianPhone: '1234567890',
    diagnosticTestsRequired: 'true',
    clearanceRequired: 'true',
    preOpRequired: 'true',
    preOpFormId: 1,
    postOpDateTime: moment('2023-03-29').toDate(),
    diagnosticTests: [mockSingleDiagnosticTest],
    clearances: [mockSingleClearance],
    preOpForm: mockSinglePreOpForm
}

export const mockSingleDocument: document = {
    documentId: 1,
    docTypes: ["h&p"],
    notes: "Test Note",
    user: "Test User",
    caseId: 1,
    storagePath: "testFolder/testDoc.png",
    signatureDate: moment('1990-02-01').toDate(),
    createTime: moment('2023-03-29').toDate(),
    updateTime: moment('2023-03-29').toDate(),
}

export const mockSingleProcedure: procedure = {
    procedureId: 1,
    procedureName: "Brain Swap"
}

export const mockSingleApproach: approach = {
    approachId: 1,
    approachName: "Approach 1"
}

export const mockSingleLaterality: laterality = {
    lateralityId: 1,
    lateralityName: "Laterality 1"
}
export const mockSingleAnesthesia: anesthesia = {
    anesthesiaId: 1,
    anesthesiaName: "Regional Block"
}
export const mockSingleIcdCode: icdCode = {
    icdCodeId: 1,
    icdCodeName: "1111ICD"
}
export const mockSingleCptCode: cptCode = {
    cptCodeId: 1,
    cptCodeName: "1111CPT"
}
export const mockSingleProcedureTab: Prisma.procedureTabGetPayload<{include: {procedure: true, approach: true, laterality: true, anesthesia: true, cptCode: true, icdCode: true}}> = {
    procedureTabId: 1,
    procedureId: 1,
    approachId: 1,
    lateralityId: 1,
    cptCodeId: 1,
    icdCodeId: 1,
    caseId: 1,
    anesthesiaNotes: '',
    procedure: mockSingleProcedure,
    approach: mockSingleApproach,
    laterality: mockSingleLaterality,
    anesthesia: [mockSingleAnesthesia],
    cptCode: mockSingleCptCode,
    icdCode: mockSingleIcdCode
}


export const mockSingleProvider: provider = {
    providerId: 1,
    fhirResourceId: "testId",
    firstName: 'Robert',
    lastName: 'Lee',
    address: 'address',
    email: 'fake@email.com',
    createTime: sampleDate,
    updateTime: sampleDate
}

export const mockSingleInsurance: insurance = {
    insuranceId: 1,
    insuranceName: "Icon"
}

export const mockSingleFinancial: Prisma.financialGetPayload<{include: {insurance: true}}> = {
    financialId: 1,
    insuranceId: 1,
    insurance: mockSingleInsurance,
    insuranceGroupName: "Icon Group",
    insuranceGroupNumber: "33222",
    priorAuthorization: "Incomplete",
    priorAuthId: "12ws",
    priorAuthDate: sampleDate,
    createTime: sampleDate,
    updateTime: sampleDate,
    caseId: 1
}

export const mockSingleServiceLine: serviceLine = {
    serviceLineId: 1,
    fhirResourceId: 'fhirResourceId',
    serviceLineName: 'serviceLineName',
    procedureUnitId: 1
}

export const mockSingleProcedureUnit: procedureUnit = {
    procedureUnitId: 1,
    fhirResourceId: 'fhirResourceId',
    procedureUnitName: 'procedureUnitName',
    locationId: 1
}

export const mockSingleLocation: location = {
    locationId: 1,
    fhirResourceId: 'fhirResourceId',
    locationName: 'Medtel Hospital',
    createTime: sampleDate,
    updateTime: moment('2023-01-09').toDate()
}

export const mockSingleComment: comment = {
    commentId: 1,
    caseId: 1,
    commentText: 'Medtel Hospital',
    userName: 'user',
    createTime: sampleDate,
    updateTime: sampleDate
}

export const mockSinglePatient: patient = {
    patientId: 1,
    fhirResourceId: 'patientFhirResourceId',
    firstName: 'Captain',
    middleName: 'Bernard',
    lastName: 'Whitebeard',
    mrn: 'testMrn',
    address: '360 Washington Ave',
    city: 'Portland',
    stateId: 1,
    zip: '92543',
    sexId: 1,
    mobilePhone: '221-345-2211',
    homePhone: '333-544-2222',
    dateOfBirth: moment('1990-02-01').toDate(),
    createTime: sampleDate,
    updateTime: sampleDate,
}

export const mockSingleAdmissionType: admissionType = {
    admissionTypeId: 1,
    admissionTypeName: "Admission Type 1"
}

export const mockSingleScheduling: Prisma.schedulingGetPayload<{ include: {provider: true, location: true, procedureUnit: true, serviceLine: true, admissionType: true} }> = {
    schedulingId: 1,
    locationId: 1,
    providerId: 1,
    serviceLineId: 1,
    procedureUnitId: 1,
    admissionTypeId: 1,
    location: mockSingleLocation,
    procedureUnit: mockSingleProcedureUnit,
    provider: mockSingleProvider,
    serviceLine: mockSingleServiceLine,
    admissionType: mockSingleAdmissionType,
    procedureDate: moment('2022-10-10').toDate(),
}

export const mockSingleCase: FullCase = {
    caseId: 1,
    fhirResourceId: 'mockCaseFRId',
    vendorConfirmation: "Incomplete",
    createTime: sampleDate,
    updateTime: sampleDate,
    patientId: 1,
    schedulingId: 1,
    procedureTabId: 1,
    clinicalId: 1,
    patient: mockSinglePatient,
    financial: [mockSingleFinancial],
    scheduling: mockSingleScheduling,
    procedureTab: mockSingleProcedureTab,
    comment: [mockSingleComment],
    document: [mockSingleDocument],
    clinical: mockSingleClinical
}

export const mockCaseData = [
    mockSingleCase,
    {
        ...mockSingleCase,
        caseId: 'caseId2',
        procedureDate: moment('2022-10-11').utc().format(),
        vendorConfirmation: "Incomplete",
        patient: {
            firstName: 'firstName2',
            lastName: 'lastName2',
            dateOfBirth: 'DOB2',
            mobilePhone: 'mobilePhone2',
            mrn: 'mrn2',
            address: 'address2'
        }
    }
]; 

export const mockProviderData = [
    mockSingleProvider,
    {
        providerId: 2,
        fhirResourceId: "testId2",
        firstName: 'firstName2',
        lastName: 'lastName2',
        locationName: 'NYU Langone2',
        address: 'address2',
        serviceLine: 'General Surgery2',
        email: 'fake2@email.com',
        createTime: sampleDate,
        updateTime: sampleDate
    }
]; 

export const mockLocationData: location[] = [
    mockSingleLocation,
    {
        locationId: 2,
        fhirResourceId: 'fhirResourceId2',
        locationName: 'locationName2',
        createTime: sampleDate,
        updateTime: sampleDate
    }
];

export const mockProcedureUnitData = [
    mockSingleProcedureUnit,
    {
        procedureUnitId: 2,
        fhirResourceId: 'fhirResourceId2',
        procedureUnitName: 'procedureUnitName2',
        locationId: 2,
        createTime: sampleDate,
        updateTime: sampleDate
    }
];

export const mockServiceLineData = [
    mockSingleServiceLine,
    {
        serviceLineId: 2,
        fhirResourceId: 'fhirResourceId2',
        serviceLineName: 'serviceLineName2',
        procedureUnitId: 2,
        createTime: sampleDate,
        updateTime: sampleDate
    }
];

export const mockBookingSheetConfig = {
    organization: "Aetna",
    tabs: {
        patient: {
            firstName: { visible: true, required: false, pathToDeleteFieldFromQuery: 'patient.AND.0.firstName' },
            middleName: { visible: true, required: false, pathToDeleteFieldFromQuery: 'patient.AND.0.middleName' },
            lastName: { visible: true, required: true, pathToDeleteFieldFromQuery: 'patient.AND.0.lastName' },
            state: { visible: true,  pathToDeleteFieldFromQuery: 'patient.AND.0.stateId' },
            dateOfBirth: { required: false,  pathToDeleteFieldFromQuery: 'patient.AND.0.dateOfBirth' }
        }
    }
}
export const mockCommentData = [
    {
        commentId: 1,
        caseId: 1,
        commentText: 'comment',
        userName: 'user',
        createTime: sampleDate,
        updateTime: sampleDate
    }
];

export const PagesTestWrapper = ({ children }: any) => (
    <UserProvider >
        <ThemeProvider theme={defaultTheme} >
            {children}
        </ThemeProvider>
    </UserProvider>
);

export const mockUseGetDropdownOptionsHook = ({queryKey}: any): {isLoading?: boolean, data: any} => {
    switch (queryKey) {
        case "getLocations": {
            return {isLoading: false, data: mockLocationData}
        }
        case "getProcedureUnits": {
            return {isLoading: false, data: mockProcedureUnitData}
        }
        case "getServiceLines": {
            return {isLoading: false, data: mockServiceLineData}
        }
        case "getProviders": {
            return {isLoading: false, data: mockProviderData}
        }
        case "getProcedures": {
            return {isLoading: false, data: [mockSingleProcedure]}
        }
        default: return { data: []}
    }
}

export const FormWrapper = (props: any) => {
    const formMethods = useForm({
        defaultValues: {
            scheduling: {
                procedureDate: moment('1990-02-01').toDate()
            }
        }
    });

    return (
      <FormProvider {...formMethods}>
        {props.children}
      </FormProvider>
    );
  };