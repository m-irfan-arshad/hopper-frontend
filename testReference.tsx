import moment from "moment";
import { UserProvider } from '@auth0/nextjs-auth0';
import { ThemeProvider } from "@mui/material/styles";
import { defaultTheme } from "./theme";

export const mockSingleProvider = {
    providerId: 1,
    fhirResourceId: "testId",
    firstName: 'Robert',
    lastName: 'Lee',
    locationName: 'NYU Langone',
    address: 'address',
    serviceLine: 'General Surgery',
    email: 'fake@email.com',
    createTime: new Date(),
    updateTime: new Date()
}

export const mockSingleInsurance = {
    insuranceId: 1,
    insurance: "Icon",
    insuranceGroupName: "Icon Group",
    insuranceGroupNumber: "33222",
    priorAuthApproved: "Yes",
    priorAuthId: "12ws",
    priorAuthDate: new Date(),
    createTime: new Date(),
    updateTime: new Date(),
    caseId: 1
}

export const mockSingleServiceLine = {
    serviceLineId: 1,
    fhirResourceId: 'fhirResourceId',
    serviceLineName: 'serviceLineName',
    procedureUnitId: 1,
    createTime: new Date(),
    updateTime: new Date()
}

export const mockSingleProcedureUnit = {
    procedureUnitId: 1,
    fhirResourceId: 'fhirResourceId',
    procedureUnitName: 'procedureUnitName',
    locationId: 1,
    createTime: new Date(),
    updateTime: new Date()
}

export const mockSingleLocation = {
    locationId: 1,
    fhirResourceId: 'fhirResourceId',
    locationName: 'Medtel Hospital',
    createTime: new Date(),
    updateTime: new Date()
}

export const mockSinglePatient = {
    patientId: 1,
    fhirResourceId: 'patientFhirResourceId',
    firstName: 'Captain',
    middleName: 'Bernard',
    lastName: 'Whitebeard',
    mrn: 'testMrn',
    address: '360 Washington Ave',
    city: 'Portland',
    state: 'Oregon',
    zip: '92543',
    sex: 'M',
    mobilePhone: '221-345-2211',
    homePhone: '333-544-2222',
    dateOfBirth: moment('1990-02-01').toDate(),
    createTime: new Date(),
    updateTime: new Date(),
}

export const mockSingleCase = {
    caseId: 1,
    fhirResourceId: 'mockCaseFRId',
    createTime: new Date(),
    updateTime: new Date(),
    priorAuthorization: "Incomplete",
    vendorConfirmation: "Incomplete",
    patientId: 1,
    locationId: 1,
    providerId: 1,
    serviceLineId: 1,
    procedureUnitId: 1,
    procedureDate: moment('2022-10-10').toDate(),
    patients: mockSinglePatient,
    locations: mockSingleLocation,
    serviceLines: mockSingleServiceLine,
    procedureUnits: mockSingleProcedureUnit,
    providers: mockSingleProvider,
    insurances: [mockSingleInsurance],
    steps: {
        priorAuthorization: "Incomplete",
        vendorConfirmation: "Incomplete",
    }
}

export const mockCaseData = [
    mockSingleCase,
    {
            caseId: 'caseId2',
            procedureDate: moment('2022-10-11').utc().format(),
            patients: {
                firstName: 'firstName2',
                lastName: 'lastName2',
                dateOfBirth: 'DOB2',
                mobilePhone: 'mobilePhone2',
                mrn: 'mrn2',
                address: 'address2'
        },
        steps: {
            priorAuthorization: "Incomplete",
            vendorConfirmation: "Incomplete",
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
        createTime: new Date(),
        updateTime: new Date()
    }
]; 

export const mockLocationData = [
    mockSingleLocation,
    {
        locationId: 2,
        fhirResourceId: 'fhirResourceId2',
        locationName: 'locationName2',
        createTime: new Date(),
        updateTime: new Date()
    }
];

export const mockProcedureUnitData = [
    mockSingleProcedureUnit,
    {
        procedureUnitId: 2,
        fhirResourceId: 'fhirResourceId2',
        procedureUnitName: 'procedureUnitName2',
        locationId: 2,
        createTime: new Date(),
        updateTime: new Date()
    }
];

export const mockServiceLineData = [
    mockSingleServiceLine,
    {
        serviceLineId: 2,
        fhirResourceId: 'fhirResourceId2',
        serviceLineName: 'serviceLineName2',
        procedureUnitId: 2,
        createTime: new Date(),
        updateTime: new Date()
    }
];

export const PagesTestWrapper = ({ children }: any) => (
    <UserProvider >
        <ThemeProvider theme={defaultTheme} >
            {children}
        </ThemeProvider>
    </UserProvider>
);