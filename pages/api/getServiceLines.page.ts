import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../prisma/clientInstantiation';
import { withValidation } from '../../utils/helpers';
import { withApiAuthRequired } from '@auth0/nextjs-auth0';

const requiredParams = ['procedureUnitId'];

export default withApiAuthRequired( withValidation(requiredParams, async function getServiceLinesHandler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const serviceLines = await prisma.serviceLine.findMany({
            where: {
                procedureUnitId: parseInt(req.query["procedureUnitId"] as string)
            },
            orderBy: { serviceLineName: 'asc' }
        })

        res.json(serviceLines)
    } catch(err) {
        res.status(500).json({ message: err });
    }
}))