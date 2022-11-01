import { Prisma } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next'
import { formatDashboardQueryParams,casesFormatter } from '../../utils/helpers';
import prisma from '../../prisma/clientInstantiation';
import { paginationCount } from '../../reference';

export default async function getCasesHandler(req: NextApiRequest, res: NextApiResponse) {
  const dashboardParams = {
    searchValue: <string>req.query["searchValue"],
    dateRangeStart: <string>req.query["dateRangeStart"],
    dateRangeEnd: <string>req.query["dateRangeEnd"],
  };

  const paginationSkipAmount = (parseInt(<string>req.query["paginationPage"]) - 1) * 50;

  const count =  await prisma.cases.count({
    where: formatDashboardQueryParams(dashboardParams)
  });

  const resultPosts = await prisma.cases.findMany({
      where: formatDashboardQueryParams(dashboardParams),
      take: paginationCount,
      skip: paginationSkipAmount,
      orderBy: [
        {
          procedureDate: <Prisma.SortOrder>req.query["orderBy"]
        }
      ],
      include: {
          patients: true
      }
  })

  res.json({
    cases: resultPosts.map(function(oldCase) {
      return casesFormatter({cases: oldCase})
    }), 
    count: count
  })
}