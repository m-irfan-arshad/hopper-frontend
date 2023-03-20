import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../prisma/clientInstantiation';
import { withApiAuthRequired } from '@auth0/nextjs-auth0';


export default withApiAuthRequired(async function getCommentsHandler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const comments = await prisma.comment.findMany({orderBy: { createTime: 'desc' }})
        res.json(comments)
    } catch(err: any) {
        res.status(500).json({ message: err.message });
    }
})