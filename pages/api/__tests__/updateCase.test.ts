/**
 * @jest-environment node
 */
 import httpMock from 'node-mocks-http';
 import type { NextApiRequest } from 'next';
 import { prismaMock } from '../../../prisma/singleton'
import updateCaseHandler from '../updateCase';

jest.mock('@auth0/nextjs-auth0', () => ({
    withApiAuthRequired: jest.fn((args) => args),
    getSession: jest.fn()
}));

 describe("updateCase API", () => {

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
        vendorConfirmation: "incomplete",
    }


    let req: NextApiRequest = httpMock.createRequest({
        url: "/api/updateCase?caseId=1",
        body: testCase
    });
    let res: any = httpMock.createResponse({});

    test('should update a case', async () => {
        prismaMock.cases.update.mockResolvedValue(testCase)

        await updateCaseHandler(req, res)
        const data = res._getJSONData()
        expect(data.caseId).toEqual(1)
        expect(data.patientId).toEqual(1)
        expect(data.providerName).toEqual("testProviderName")
        expect(prismaMock.cases.update).toBeCalledTimes(1)
    })

    test('should error out', async () => {
        req = httpMock.createRequest({
            url: "/api/createCase"
        });
        res = httpMock.createResponse({});

        await updateCaseHandler(req, res)
        const data = res._getJSONData()
        expect(data.message).toEqual('The following required parameters are missing: caseId')
    })
});
