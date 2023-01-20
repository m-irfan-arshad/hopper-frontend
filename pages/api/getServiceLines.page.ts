import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../prisma/clientInstantiation';
import { withValidation } from '../../utils/helpers';
import { withApiAuthRequired } from '@auth0/nextjs-auth0';

const requiredParams = ['procedureUnitId'];

export default withValidation(requiredParams, async function getServiceLinesHandler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const serviceLines = await prisma.serviceLines.findMany({
            where: {
                procedureUnitId: parseInt(req.query["procedureUnitId"] as string)
            }
        })
        serviceLines.sort((unit1, unit2) => unit1.serviceLineName.toLowerCase() > unit2.serviceLineName.toLowerCase() ? 1 : -1);

        res.json(serviceLines)
    } catch(err) {
        res.status(500).json({ message: err });
    }
})