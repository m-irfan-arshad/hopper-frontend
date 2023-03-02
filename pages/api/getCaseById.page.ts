import type { NextApiRequest, NextApiResponse } from 'next'
import { withValidation, casesFormatter } from '../../utils/helpers';
import prisma from '../../prisma/clientInstantiation';
import { withApiAuthRequired } from '@auth0/nextjs-auth0';

const requiredParams = ['caseId'];

export default withApiAuthRequired( withValidation(requiredParams, async function getCasesHandler(req: NextApiRequest, res: NextApiResponse) {
  
  try {
    const resultPosts = await prisma.cases.findUnique({
        where: {
            caseId: parseInt(req.query["caseId"] as string)
          },
          include: {
            financial: true,
            patients: true,
            locations: true,
            providers: true,
            serviceLines: true,
            procedureUnits: true
        }
    })

    res.json(casesFormatter(resultPosts));
  } catch(err) {
    res.status(500).json({ message: err });
  }
}))
