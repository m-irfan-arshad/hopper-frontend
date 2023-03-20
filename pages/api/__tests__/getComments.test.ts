/**
 * @jest-environment node
 */
import httpMock from 'node-mocks-http';
import { prismaMock } from '../../../prisma/singleton'
import getCommentsHandler from '../getComments.page';
import { mockCommentData } from '../../../testReference';

jest.mock('@auth0/nextjs-auth0', () => ({
   withApiAuthRequired: jest.fn((args) => args),
   getSession: jest.fn()
}));

describe("getComments API", () => {
   test('should get comments', async () => {
       const req = httpMock.createRequest({
           url: `/api/getComments`
       });

       const res = httpMock.createResponse({});

       prismaMock.comment.findMany.mockResolvedValueOnce(mockCommentData)

       await getCommentsHandler(req, res)
       const data = res._getJSONData();
       expect(data[0].commentId).toEqual(1)
       expect(data[0].commentText).toEqual('comment')
       expect(data[0].userName).toEqual('user')
       expect(prismaMock.comment.findMany).toBeCalledTimes(1);
   })
});
