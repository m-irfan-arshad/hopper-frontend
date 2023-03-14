import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../prisma/clientInstantiation';
import { withApiAuthRequired } from '@auth0/nextjs-auth0';


export default withApiAuthRequired(async function getInsuranceHandler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const insurances = await prisma.insurance.findMany({orderBy: { insuranceName: 'asc' }})
        res.json(insurances)
    } catch(err: any) {
        res.status(500).json({ message: err.message });
    }
})