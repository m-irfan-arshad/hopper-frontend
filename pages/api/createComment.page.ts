import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../prisma/clientInstantiation';
import { validateRequest } from '../../utils/helpers';
import { withApiAuthRequired } from '@auth0/nextjs-auth0';


const requiredParams = ['commentText', 'userName', 'caseId'];

export default withApiAuthRequired(async function createCommentHandler(req: NextApiRequest, res: NextApiResponse) {
    const invalidCommentParams = validateRequest(requiredParams, req.body || {}, res);

    if (invalidCommentParams) {
        return invalidCommentParams
    }

    try {
        const comments = await prisma.comment.create({
            data: {
                commentText: req.body?.commentText,
                userName: req.body?.userName,
                caseId: req.body.caseId
            }
        });
        res.json(comments)
    } catch(err: any) {
        res.status(500).json({ message: err.message });
    }
})