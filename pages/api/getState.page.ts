import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../prisma/clientInstantiation';
import { withApiAuthRequired } from '@auth0/nextjs-auth0';


export default withApiAuthRequired(async function getStateHandler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const states = await prisma.state.findMany({orderBy: { stateName: 'asc' }})
        res.json(states)
    } catch(err: any) {
        res.status(500).json({ message: err.message });
    }
})