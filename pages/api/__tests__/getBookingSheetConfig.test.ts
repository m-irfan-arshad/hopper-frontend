/**
 * @jest-environment node
 */
 import httpMock from 'node-mocks-http';
 import type { NextApiRequest } from 'next';
 import { prismaMock } from '../../../prisma/singleton'
 import getBookingSheetConfig from '../getBookingSheetConfig.page'
 import {mockBookingSheetConfig, mockSingleCase} from '../../../testReference';
 
 jest.mock('@auth0/nextjs-auth0', () => ({
    withApiAuthRequired: jest.fn((args) => args),
    getSession: jest.fn()
 }));

 var buf = Buffer.from(JSON.stringify(mockBookingSheetConfig));

 jest.mock('@google-cloud/storage', () => {
    return {
        Storage: jest.fn().mockImplementation(() => ({
            bucket: () => ({
                file: () => ({
                    download: jest.fn().mockResolvedValue(buf)
                })
            })
        })
    )}
})
 
 describe("getBookingSheetConfig API", () => {
    let req: NextApiRequest = httpMock.createRequest({
        url: `/api/getBookingSheetConfig`
    });
    let res: any = httpMock.createResponse({});
 
    test('should get org config json', async () => { 
        await getBookingSheetConfig(req, res)
        const data = res._getJSONData()
        expect(data).toEqual(mockBookingSheetConfig)
    })
 });
 