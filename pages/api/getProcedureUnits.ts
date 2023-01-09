import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../prisma/clientInstantiation';
import { withValidation } from '../../utils/helpers';
import { withApiAuthRequired } from '@auth0/nextjs-auth0';

const requiredParams = ['locationId'];

export default withApiAuthRequired( withValidation(requiredParams, async function getProcedureUnitsHandler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const procedureUnits = await prisma.procedureUnits.findMany({
            where: {
                locationId: {
                    equals: req.body.locationId
                }
            }
        })
        res.json(procedureUnits)
    } catch(err) {
        res.status(500).json({ message: err });
    }
}))