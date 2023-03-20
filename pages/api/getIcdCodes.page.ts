import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../prisma/clientInstantiation';
import { withApiAuthRequired } from '@auth0/nextjs-auth0';


export default withApiAuthRequired(async function getIcdCodesHandler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const values = await prisma.icdCode.findMany()

        res.json(values)
    } catch(err: any) {
        res.status(500).json({ message: err.message });
    }
})