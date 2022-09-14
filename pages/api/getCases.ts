import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../prisma/clientInstantiation';

export default async function getCasesHandler(req: NextApiRequest, res: NextApiResponse) {
  const resultPosts = await prisma.cases.findMany({
      where: {
        procedureDate: {
            // eventually this should take in a date range parameter from client instead
            gte: new Date()
        }
      },
      include: {
          patients: true
      }
  })
  res.json(resultPosts)
}