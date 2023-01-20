/**
 * @jest-environment node
 */
 import httpMock from 'node-mocks-http';
 import type { NextApiRequest } from 'next';
 import { prismaMock } from '../../../prisma/singleton'
 import createCaseHander from '../createCase.page'

 jest.mock('@auth0/nextjs-auth0', () => ({
    withApiAuthRequired: jest.fn((args) => args),
    getSession: jest.fn()
}));

 describe("createCase API", () => {

    const testCase = {
        caseId: 1,
        fhirResourceId: "testId",
        patientId: 1,
        procedureDate: new Date(),
        providerId: 123,
        locationId: 456,
        createTime: new Date(),
        updateTime: new Date(),
        priorAuthorization: "incomplete",
        vendorConfirmation: "incomplete",
        procedureUnit: "testProcedureUnit",
        serviceLine: "testServiceLine"
    }
    const testPatient = {
        firstName: "Test",
        lastName: "Patient",
        patientId: 1,
        fhirResourceId: "11223344",
        address: "112 Drive Drive",
        mobilePhone: "1234567",
        homePhone: "1234567",
        mrn: "1234567",
        dateOfBirth: new Date(),
        createTime: new Date(),
        updateTime: new Date(),
    }

    let req: NextApiRequest = httpMock.createRequest({
        url: "/api/createCase",
        body: {case: testCase, patient: testPatient}
    });
    let res: any = httpMock.createResponse({});

    test('should create case', async () => {
        prismaMock.cases.create.mockResolvedValue(testCase)
        prismaMock.patients.create.mockResolvedValue(testPatient)

        await createCaseHander(req, res)
        const data = res._getJSONData()
        expect(data.caseId).toEqual(1)
        expect(data.patientId).toEqual(1)
        expect(data.providerId).toEqual(123)
        expect(prismaMock.cases.create).toBeCalledTimes(1)
    })

    test('should error out', async () => {
        req = httpMock.createRequest({
            url: "/api/createCase"
        });
        res = httpMock.createResponse({});

        await createCaseHander(req, res)
        const data = res._getJSONData()
        expect(data.message).toEqual('The following required parameters are missing: procedureDate providerId locationId')
    })
});
