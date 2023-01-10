import { Prisma } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next'
import { formatDashboardQueryParams, casesFormatter, withValidation } from '../../utils/helpers';
import prisma from '../../prisma/clientInstantiation';
import { paginationCount } from '../../reference';
import { withApiAuthRequired } from '@auth0/nextjs-auth0';

const requiredParams = ['dateRangeStart', 'dateRangeEnd', 'page', 'orderBy'];

export default withApiAuthRequired( withValidation(requiredParams, async function getCasesHandler(req: NextApiRequest, res: NextApiResponse) {
  const dashboardParams = {
    searchValue: <string>req.query["searchValue"],
    dateRangeStart: <string>req.query["dateRangeStart"],
    dateRangeEnd: <string>req.query["dateRangeEnd"],
    vendorConfirmation: <string>req.query["vendorConfirmation"],
    priorAuthorization: <string>req.query["priorAuthorization"],
  };

  const paginationSkipAmount = (parseInt(<string>req.query["page"]) - 1) * 50;

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
}))
