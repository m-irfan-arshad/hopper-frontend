import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../prisma/clientInstantiation';
import { withApiAuthRequired } from '@auth0/nextjs-auth0';


export default withApiAuthRequired(async function getSexHandler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const sex = await prisma.sex.findMany()
        res.json(sex)
    } catch(err: any) {
        res.status(500).json({ message: err.message });
    }
})