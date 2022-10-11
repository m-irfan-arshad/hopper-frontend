import { createMocks, RequestMethod, createRequest, createResponse } from 'node-mocks-http';
import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../prisma/clientInstantiation';
import getCases from '../getCases';

const mockData = [
    {
        caseId: 'caseId',
        procedureDate: '10/10/2022',
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
            procedureDate: '10/11/2022',
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

jest.mock('@prisma/client', ()=>{
    return {
        PrismaClient: function() {
            return {
                cases: {
                    findMany: jest.fn(() => mockData),
                    update: jest.fn(),
                },
            };
        },
    };
});

function mockRequestResponse(method: RequestMethod = 'GET') {
    const { req, res }: { 
        req: NextApiRequest & ReturnType<typeof createRequest>; 
        res: NextApiResponse & ReturnType<typeof createResponse>
    } = createMocks({ method });

    req.query = { 
        dateRangeStart: '10/10/2022',
        dateRangeEnd: '10/20/2022',
        orderBy: 'asc'
    };
    return { req, res };
}

describe('/api/getCases', () => {
    test('calls api route and prisma query with expected parameters', async () => {
        const { req, res } = mockRequestResponse();

        await getCases(req, res);

        expect(res.statusCode).toBe(200);
        expect(res.statusMessage).toEqual('OK');
        expect(req.query).toEqual({ 
            dateRangeStart: '10/10/2022',
            dateRangeEnd: '10/20/2022',
            orderBy: 'asc'
        });
        expect(prisma.cases.findMany).toHaveBeenCalledTimes(1); 
        expect(prisma.cases.findMany).toHaveBeenCalledWith({
            where: {
                procedureDate: {
                    gte: new Date(req.query["dateRangeStart"]),
                    lte: new Date(req.query["dateRangeEnd"])
                }
              },
              orderBy: [
                {
                  procedureDate: req.query["orderBy"]
                }
              ],
              include: {
                  patients: true
              }
        }); 
        expect((res._getJSONData())).toEqual(mockData);
    });
});