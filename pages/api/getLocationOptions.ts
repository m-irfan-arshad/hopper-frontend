import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../prisma/clientInstantiation';
import { APIErrorHandler } from '../../utils/helpers';

export default async function getLocationOptionsHandler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const locationProviderRelations = await prisma.provider_locations.findMany({
            where: {
                providerId: {
                    equals: parseInt(<string>req.query['providerId'])
                }
            }
        });

        if (locationProviderRelations.length > 0) {
            const locationIds = locationProviderRelations.map(relation => {
                return relation.locationId;
            });

            const locations = await prisma.locations.findMany({
                where: {
                    locationId: {in: locationIds}
                }
            })

            res.json(locations)
        } else {
            res.json([])
        } 
    } catch(err) {
        APIErrorHandler(err, res)
    }
}