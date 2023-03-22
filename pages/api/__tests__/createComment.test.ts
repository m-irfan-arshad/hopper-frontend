/**
 * @jest-environment node
 */
import httpMock from 'node-mocks-http';
import type { NextApiRequest } from 'next';
import { prismaMock } from '../../../prisma/singleton'
import createCommentHandler from '../createComment.page'
import { mockCommentData } from '../../../testReference';

jest.mock('@auth0/nextjs-auth0', () => ({
   withApiAuthRequired: jest.fn((args) => args),
   getSession: jest.fn()
}));

describe("createComment API", () => {
   let req: NextApiRequest = httpMock.createRequest({
       url: "/api/createComment",
       body: mockCommentData[0]
   });
   let res: any = httpMock.createResponse({});

   test('should create comment', async () => {
       prismaMock.comment.create.mockResolvedValue(mockCommentData[0])

       await createCommentHandler(req, res)
       const data = res._getJSONData()
       expect(data.commentId).toEqual(1)
       expect(data.commentText).toEqual('comment')
       expect(prismaMock.comment.create).toBeCalledTimes(1)
   })
});
