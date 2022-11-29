/**
 * @jest-environment node
 */
 import httpMock from 'node-mocks-http';
 import type { NextApiRequest } from 'next';
 import { prismaMock } from '../../../prisma/singleton'
 import createCaseHander from '../createCase'

 describe("createCase API", () => {

    const testCase = {
        caseId: 1,
        fhirResourceId: "testId",
        patientId: 1,
        procedureDate: new Date(),
        providerName: "testProviderName",
        locationName: "testLocationName",
        createTime: new Date(),
        updateTime: new Date(),
        priorAuthorization: "incomplete",
        vendorConfirmation: "incomplete"
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
        expect(data.providerName).toEqual("testProviderName")
        expect(prismaMock.cases.create).toBeCalledTimes(1)
    })
});
