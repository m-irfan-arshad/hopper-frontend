import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../prisma/clientInstantiation';
import { withValidation } from '../../utils/helpers';
import { withApiAuthRequired } from '@auth0/nextjs-auth0';

const requiredParams = ['caseId'];

export default withApiAuthRequired( withValidation(requiredParams, async function updateCaseHandler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const updatedCase = await prisma.cases.update({
      where: {
        caseId: <number>req.body.caseId
      },
      data: <object>{
        patients: {
            update: {
                where: { patientId: 46 },
                data: { sex: "M" },
             },
        }
      }
    })

    res.json(updatedCase)
  } catch(err) {
    res.status(500).json({ message: err });
  }
}))