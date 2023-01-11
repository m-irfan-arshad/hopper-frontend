import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../prisma/clientInstantiation';
import { withValidation } from '../../utils/helpers';
import { withApiAuthRequired } from '@auth0/nextjs-auth0';

const requiredParams = ['procedureUnitId'];

export default withApiAuthRequired( withValidation(requiredParams, async function getServiceLinesHandler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const procedureUnits = await prisma.serviceLines.findMany({
            where: {
                procedureUnitId: parseInt(req.query["procedureUnitId"] as string)
            }
        })
        res.json(procedureUnits)
    } catch(err) {
        res.status(500).json({ message: err });
    }
}))