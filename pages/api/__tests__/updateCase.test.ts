/**
 * @jest-environment node
 */
 import httpMock from 'node-mocks-http';
 import type { NextApiRequest } from 'next';
 import { prismaMock } from '../../../prisma/singleton'
 import getCasesHandler from '../getCases'
import updateCaseHandler from '../updateCase';

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
        url: "/api/updateCase",
        body: testCase
    });
    let res: any = httpMock.createResponse({});

    test('should get cases', async () => {
        prismaMock.cases.update.mockResolvedValue(testCase)

        await updateCaseHandler(req, res)
        const data = res._getJSONData()
        expect(data.caseId).toEqual(1)
        expect(data.patientId).toEqual(1)
        expect(data.providerName).toEqual("testProviderName")
        expect(prismaMock.cases.update).toBeCalledTimes(1)
    })
});
