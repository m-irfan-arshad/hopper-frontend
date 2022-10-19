import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../prisma/clientInstantiation';

export default async function updateCaseHandler(req: NextApiRequest, res: NextApiResponse) {
  const updatedCase = await prisma.cases.update({
    where: {
      fhirResourceId: <string>req.query["fhirResourceId"],
    },
    data: <object>req.query["data"] ,
  })

  res.json(updatedCase)
}