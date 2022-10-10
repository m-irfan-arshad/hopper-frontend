import { Prisma } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../prisma/clientInstantiation';

export default async function getCasesHandler(req: NextApiRequest, res: NextApiResponse) {
  const resultPosts = await prisma.cases.findMany({
      where: {
        procedureDate: {
            // eventually this should take in a date range parameter from client instead
            gte: new Date(<string>req.query["dateRangeStart"]),
            lte: new Date(<string>req.query["dateRangeEnd"])
        }
      },
      orderBy: [
        {
          procedureDate: <Prisma.SortOrder>req.query["orderBy"]
        }
      ],
      include: {
          patients: true
      }
  })
  res.json(resultPosts)
}