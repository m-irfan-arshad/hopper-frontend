/**
 * @jest-environment node
 */
 import httpMock from 'node-mocks-http';
 import type { NextApiRequest } from 'next';
 import { prismaMock } from '../../../prisma/singleton'
import updateCaseHandler from '../updateCase.page';
import { mockSingleCase } from '../../../testReference';

jest.mock('@auth0/nextjs-auth0', () => ({
    withApiAuthRequired: jest.fn((args) => args),
    getSession: jest.fn()
}));

 describe("updateCase API", () => {


    let req: NextApiRequest = httpMock.createRequest({
        url: "/api/updateCase?caseId=1",
        body: mockSingleCase
    });
    let res: any = httpMock.createResponse({});

    test('should update a case', async () => {
        prismaMock.cases.update.mockResolvedValue(mockSingleCase)

        await updateCaseHandler(req, res)
        const data = res._getJSONData()
        expect(data.caseId).toEqual(1)
        expect(data.patientId).toEqual(1)
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
