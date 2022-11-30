import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../prisma/clientInstantiation';
import { validateParameters } from '../../utils/helpers';

const requiredParams = ['providerId'];

export default async function getLocationOptionsHandler(req: NextApiRequest, res: NextApiResponse) {
    const invalidParamsMessage = validateParameters(requiredParams, req.query, res);

    if (invalidParamsMessage) {
      return invalidParamsMessage
    }

    try {
        const locationProviderRelations = await prisma.provider_locations.findMany({
            where: {
                providerId: {
                    equals: parseInt(<string>req.query['providerId'])
                }
            }
        });

        if (locationProviderRelations && locationProviderRelations.length > 0) {
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
    } 
    catch(err) {
        res.status(500).json({ message: err });
    }
}