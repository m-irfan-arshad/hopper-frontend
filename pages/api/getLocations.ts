import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../prisma/clientInstantiation';
import { validateParameters } from '../../utils/helpers';
import { withApiAuthRequired } from '@auth0/nextjs-auth0';


export default withApiAuthRequired(async function getLocationsHandler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const locations = await prisma.locations.findMany()
        locations.sort((loc1, loc2) => loc1.locationName.toLowerCase() > loc2.locationName.toLowerCase() ? 1 : -1);

        res.json(locations)
    } catch(err) {
        res.status(500).json({ message: err });
    }
})