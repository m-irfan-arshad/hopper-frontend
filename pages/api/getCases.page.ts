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

  try {
    const count =  await prisma.cases.count({
      where: formatDashboardQueryParams(dashboardParams)
    });

    const resultPosts = await prisma.cases.findMany({
        where: formatDashboardQueryParams(dashboardParams),
        take: paginationCount,
        skip: paginationSkipAmount,
        orderBy: [
          {
            scheduling: {
              procedureDate: <Prisma.SortOrder>req.query["orderBy"]
            }
          }
        ],
        include: { 
          patient: true,
          scheduling: { include: {provider: true, location: true} }, 
          financial: true
        }
    })

    res.json({
      cases: resultPosts.map(function(oldCase) {
        return casesFormatter(oldCase)
      }),
      count: count
    })
  } catch(err: any) {
    res.status(500).json({ message: err.message });
}
  
}))


/* TODO: HPR-425


    1. isComplete is not part of the object itself... its added as an extension, need each tab to have this 
        and then use all of these combined to make a full case
    2. use prisma $extends to solve 

      [12:44 PM] Isaac Blinder



      TODO: 
      use AND/OR logic of native prisma to try and create relational logic for prisma (in clinical Tab, if this checkbox is clicked, then all of these fields are required)

      example below is saying on the clinicalTab grab it if clearanceRequired is false or clearances is filled out (not working just an idea)

      const getUser = prisma.cases.findMany({
  where: {
    clinicalTab: {
      OR: [
        {clearanceRequired: false},
        {clearances: {
          clearanceDateTime: {}
        }}
     ]
    }
  },
  include: {
    clinicalTab: true
  }
})

has context menu

*/
