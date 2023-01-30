/**
 * @jest-environment node
 */
import httpMock from 'node-mocks-http';
import type { NextApiRequest } from 'next';
import { prismaMock } from '../../../prisma/singleton'
import getCaseById from '../getCaseById.page'

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
       const singleCase = {
           caseId: 123,
           fhirResourceId: "testId",
           patientId: 1,
           providerId: 2,
           locationId: 3,
           providers: { firstName: 'providerName', lastName: 'lastName'},
           locations: { locationName: 'locationName' },
           priorAuthorization: "Incomplete",
           vendorConfirmation: "Incomplete",
           procedureDate: new Date(),
           createTime: new Date(),
           updateTime: new Date()
       };

       const params = {
            where: {
                caseId: 123
            },
            include: {
                patients: true,
            }
        };

       prismaMock.cases.findUnique.mockResolvedValue(singleCase)

       await getCaseById(req, res)
       const data = res._getJSONData()
       expect(data.caseId).toEqual(123)
       expect(data.providerName).toEqual('providerName lastName')
       expect(data.locationName).toEqual('locationName')
       expect(prismaMock.cases.findUnique).toBeCalledTimes(1)
       expect(prismaMock.cases.findUnique).toBeCalledWith(params)
   })
});
