import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../prisma/clientInstantiation';
import { validateParameters } from '../../utils/helpers';
import { withApiAuthRequired } from '@auth0/nextjs-auth0';


export default withApiAuthRequired(async function getLocationsHandler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const locations = await prisma.location.findMany({orderBy: { locationName: 'asc' }})

        res.json(locations)
    } catch(err: any) {
        res.status(500).json({ message: err.message });
    }
})