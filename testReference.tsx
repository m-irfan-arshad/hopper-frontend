import moment from "moment";
import { UserProvider } from '@auth0/nextjs-auth0';
import { ThemeProvider } from "@mui/material/styles";
import { defaultTheme } from "./theme";
import { FullCase } from "./reference";
import { Prisma, patient, provider, scheduling, location, insurance, serviceLine, procedureUnit } from "@prisma/client";

const sampleDate = moment('2023-01-09').toDate();

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

export const mockSingleFinancial: Prisma.financialGetPayload<{include: {insurance: true}}> = {
    financialId: 1,
    insuranceId: 1,
    insurance: {insuranceName: "Icon", insuranceId: 1},
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

export const mockSingleScheduling: Prisma.schedulingGetPayload<{ include: {provider: true, location: true, procedureUnit: true, serviceLine: true} }> = {
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
    patient: mockSinglePatient,
    financial: [mockSingleFinancial],
    scheduling: mockSingleScheduling
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

export const PagesTestWrapper = ({ children }: any) => (
    <UserProvider >
        <ThemeProvider theme={defaultTheme} >
            {children}
        </ThemeProvider>
    </UserProvider>
);