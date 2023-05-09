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
                patient: {include: {address: {include: {state: true}}, sex: true, phone: true}},
                financial: {include: {insurance: true}, orderBy: {financialId: "asc"}},
                scheduling: {include: {location: true, procedureUnit: true, serviceLine: true, provider: true, admissionType: true}},
                procedureTab: {include: {procedure: true, approach: true, laterality: true, anesthesia: true, cptCode: true, icdCode: true}},
                comment: {orderBy: {createTime: 'desc'}},
                document: {orderBy: {createTime: 'desc'}},
                productTab: {include: {manufacturer: true, vendor: true}},
                clinical: {include: {diagnosticTests: {include: {facility: true, diagnosticTest: true}}, clearances: {include: {facility: true, clearance: true}}, preOpForm: {include: {facility: true}}}},
            }
        };

       prismaMock.cases.findUnique.mockResolvedValue(singleCase)

       await getCaseById(req, res)
       const data = res._getJSONData()
       expect(data.caseId).toEqual(1)
       expect(data.scheduling.provider.firstName).toEqual('Robert')
       expect(data.scheduling.location.locationName).toEqual('Medtel Hospital')
       expect(prismaMock.cases.findUnique).toBeCalledTimes(1)
       expect(prismaMock.cases.findUnique).toBeCalledWith(params)
   })
});
