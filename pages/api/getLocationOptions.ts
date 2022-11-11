import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../prisma/clientInstantiation';

export default async function getLocationOptionsHandler(req: NextApiRequest, res: NextApiResponse) {
    const locationIds = req.query['locationIds'] && (<string>req.query['locationIds']).split(',').map(locationId => {
        return parseInt(locationId);
    });

    const locations = await prisma.locations.findMany({
        where: {
            locationId: {in: locationIds || []},
        }
    });

  res.json(locations)
}