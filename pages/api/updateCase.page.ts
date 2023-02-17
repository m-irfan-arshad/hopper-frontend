import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../prisma/clientInstantiation';
import { withValidation } from '../../utils/helpers';
import { withApiAuthRequired } from '@auth0/nextjs-auth0';
import * as R from "ramda";

const requiredParams = ['caseId'];

export default withApiAuthRequired( withValidation(requiredParams, async function updateCaseHandler(req: NextApiRequest, res: NextApiResponse) {
  try {
    let bodyNoCaseId = R.clone(req.body);
    delete bodyNoCaseId.caseId;
    const updatedCase = await prisma.cases.update({
      where: {
        caseId: <number>req.body.caseId
      },
      data: <object>bodyNoCaseId
    })

    res.json(updatedCase)
  } catch(err) {
    res.status(500).json({ message: err.message });
  }
}))