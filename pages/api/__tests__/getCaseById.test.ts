/**
 * @jest-environment node
 */
import httpMock from 'node-mocks-http';
import type { NextApiRequest } from 'next';
import { prismaMock } from '../../../prisma/singleton'
import getCaseById from '../getCaseById.page'
import {mockSingleCase} from '../../../testReference';

jest.mock('@auth0/nextjs-auth0', () => ({
   withApiAuthRequired: jest.fn((args) => args),
   getSession: jest.fn()
}));

describe("getCaseById API", () => {
   let req: NextApiRequest = httpMock.createRequest({
       url: `/api/getCaseById?caseId=123`
   });
   let res: any = httpMock.createResponse({});

   test('should get a single case', async () => {
       const singleCase = mockSingleCase;

       const params = {
            where: {
                caseId: 123
            },
            include: {
                insurances: true,
                locations: true,
                patients: true,
                procedureUnits: true,
                providers: true,
                serviceLines: true
            }
        };

       prismaMock.cases.findUnique.mockResolvedValue(singleCase)

       await getCaseById(req, res)
       const data = res._getJSONData()
       expect(data.caseId).toEqual(1)
       expect(data.providers.firstName).toEqual('Robert')
       expect(data.providers.locationName).toEqual('NYU Langone')
       expect(prismaMock.cases.findUnique).toBeCalledTimes(1)
       expect(prismaMock.cases.findUnique).toBeCalledWith(params)
   })
});
