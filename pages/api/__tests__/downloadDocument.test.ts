/**
 * @jest-environment node
 */
import httpMock from 'node-mocks-http';
import type { NextApiRequest } from 'next';
import downloadDocumentHandler from '../downloadDocument.page'
import { mockSingleDocument } from '../../../testReference';

jest.mock('@auth0/nextjs-auth0', () => ({
   withApiAuthRequired: jest.fn((args) => args),
   getSession: jest.fn()
}));

jest.mock('@google-cloud/storage', () => ({
    Storage: jest.fn().mockReturnValue({
        bucket: jest.fn().mockReturnValue({
            file: jest.fn().mockReturnValue({
                download: () => Promise.resolve(mockSingleDocument)
            })
        })
    })
 }));

describe("downloadDocument API", () => {
   let req: NextApiRequest = httpMock.createRequest({
       url: "/api/downloadDocument?storagePath=path"
   });

   let res: any = httpMock.createResponse({});

   test('should get a document', async () => {

       await downloadDocumentHandler(req, res)
       const data = res._getJSONData()
       expect(data).toEqual(mockSingleDocument.toString())
   })
});
