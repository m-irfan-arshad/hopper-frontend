/**
 * @jest-environment node
 */
 import httpMock from 'node-mocks-http';
 import type { NextApiRequest } from 'next';
 import { prismaMock } from '../../../prisma/singleton'
 import createCaseHander from '../createCase.page'
import { mockSingleCase, mockSinglePatient } from '../../../testReference';

 jest.mock('@auth0/nextjs-auth0', () => ({
    withApiAuthRequired: jest.fn((args) => args),
    getSession: jest.fn()
}));

 describe("createCase API", () => {
    let req: NextApiRequest = httpMock.createRequest({
        url: "/api/createCase",
        body: {case: mockSingleCase}
    });
    let res: any = httpMock.createResponse({});

    test('should create case', async () => {
        prismaMock.cases.create.mockResolvedValue(mockSingleCase)

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
