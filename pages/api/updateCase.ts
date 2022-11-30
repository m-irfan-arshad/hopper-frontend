import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../prisma/clientInstantiation';
import { validateParameters } from '../../utils/helpers';

const requiredParams = ['caseId'];

export default async function updateCaseHandler(req: NextApiRequest, res: NextApiResponse) {
  const errorMessage = validateParameters(requiredParams, req.body, res);

  if (errorMessage) {
    return errorMessage
  }
  
  try {
    const updatedCase = await prisma.cases.update({
      where: {
        caseId: <number>req.body.caseId
      },
      data: <object>req.body
    })

    res.json(updatedCase)
  } catch(err) {
    res.status(500).json({ message: err });
  }
}