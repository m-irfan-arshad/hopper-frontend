import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../prisma/clientInstantiation';
import { validateParameters } from '../../utils/helpers';
import { withApiAuthRequired } from '@auth0/nextjs-auth0';

const requiredParams = ['caseId'];

export default withApiAuthRequired (async function updateCaseHandler(req: NextApiRequest, res: NextApiResponse) {
  const invalidParamsMessage = validateParameters(requiredParams, req.body, res);

  if (invalidParamsMessage) {
    return invalidParamsMessage
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
})