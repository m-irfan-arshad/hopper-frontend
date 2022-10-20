import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../prisma/clientInstantiation';

export default async function updateCaseHandler(req: NextApiRequest, res: NextApiResponse) {
  const updatedCase = await prisma.cases.update({
    where: {
      caseId: <number>req.body.caseId,
    },
    data: <object>req.body,
  })

  res.json(updatedCase)
}