import { Prisma } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next'
import { formatDashboardQueryParams } from '../../utils';
import prisma from '../../prisma/clientInstantiation';

export default async function getCasesHandler(req: NextApiRequest, res: NextApiResponse) {
  const dashboardParams = {
    searchValue: <string>req.query["searchValue"],
    dateRangeStart: <string>req.query["dateRangeStart"],
    dateRangeEnd: <string>req.query["dateRangeEnd"],
  };

  const resultPosts = await prisma.cases.findMany({
      where: formatDashboardQueryParams(dashboardParams),
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