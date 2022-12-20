import moment from "moment";

export const mockCaseData = [
    {
        caseId: 'caseId',
        procedureDate: moment('2022-10-10').utc().format(),
        patients: {
            firstName: 'firstName',
            lastName: 'lastName',
            dateOfBirth: 'DOB',
            mobilePhone: 'mobilePhone',
            mrn: 'mrn',
            address: 'address'
        }
    },
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
        }
    }
]; 

export const mockProviderData = [
    {
        providerId: 1,
        fhirResourceId: "testId",
        firstName: 'firstName',
        lastName: 'lastName',
        locationName: 'NYU Langone',
        address: 'address',
        serviceLine: 'General Surgery',
        email: 'fake@email.com',
        createTime: new Date(),
        updateTime: new Date()
    },
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
    {
        locationId: 1,
        fhirResourceId: 'fhirResourceId',
        locationName: 'locationName',
        createTime: new Date(),
        updateTime: new Date()
    },
    {
        locationId: 2,
        fhirResourceId: 'fhirResourceId2',
        locationName: 'locationName2',
        createTime: new Date(),
        updateTime: new Date()
    }
];