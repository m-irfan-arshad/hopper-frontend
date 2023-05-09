import { Prisma } from '@prisma/client';
import * as R from 'ramda'
import type { NextApiRequest, NextApiResponse } from 'next'
import { formatDashboardQueryParams, casesFormatter, withValidation } from '../../utils/helpers';
import { FullCase } from "../../reference";
import prisma from '../../prisma/clientInstantiation';
import { paginationCount, defaultBookingSheetConfig } from '../../reference';
import { withApiAuthRequired } from '@auth0/nextjs-auth0';
import { Storage } from "@google-cloud/storage";

const requiredParams = ['dateRangeStart', 'dateRangeEnd', 'page'];

export default withApiAuthRequired( withValidation(requiredParams, async function getCasesHandler(req: NextApiRequest, res: NextApiResponse) {
  
  const dashboardParams = {
    searchValue: <string>req.query["searchValue"],
    dateRangeStart: <string>req.query["dateRangeStart"],
    dateRangeEnd: <string>req.query["dateRangeEnd"],
    workQueue: <string>req.query["workQueue"]
  };

  const paginationSkipAmount = (parseInt(<string>req.query["page"]) - 1) * 50;
  const storage = new Storage();
  let bookingSheetConfig = {};
  let bookingSheetCompletedCases: FullCase[]= [];

  try {
    if (req.query["workQueue"] === 'Booking Sheet Request') {
      const orgConfigData = await storage.bucket("hopper_booking_sheet_configs").file("sample_org_config.json").download();
      const orgConfigJSON = JSON.parse(orgConfigData.toString());
      const config = R.clone(defaultBookingSheetConfig);
      bookingSheetConfig = R.mergeDeepRight(config, orgConfigJSON)
    }

    if (!req.query["workQueue"]) {
        const bookingSheetDashboardParams = R.clone(dashboardParams);
        bookingSheetDashboardParams.workQueue = 'Booking Sheet Request';
        const orgConfigData = await storage.bucket("hopper_booking_sheet_configs").file("sample_org_config.json").download();
        const orgConfigJSON = JSON.parse(orgConfigData.toString());
        const config = R.clone(defaultBookingSheetConfig);
        bookingSheetConfig = R.mergeDeepRight(config, orgConfigJSON)
        bookingSheetCompletedCases =  await prisma.cases.findMany({
          where: formatDashboardQueryParams(bookingSheetDashboardParams, bookingSheetConfig),
          take: paginationCount,
          skip: paginationSkipAmount,
          orderBy: [
            {
              scheduling: {
                procedureDate: 'asc'
              }
            }
          ],
          include: { 
            patient: true,
            scheduling: { include: {provider: true, location: true} }, 
            financial: true
          }
      })
    }
    
    const count =  await prisma.cases.count({
      where: formatDashboardQueryParams(dashboardParams, bookingSheetConfig)
    });

    const resultPosts = await prisma.cases.findMany({
        where: formatDashboardQueryParams(dashboardParams, bookingSheetConfig),
        take: paginationCount,
        skip: paginationSkipAmount,
        orderBy: [
          {
            scheduling: {
              procedureDate: 'asc'
            }
          }
        ],
        include: { 
          patient: true,
          scheduling: { include: {provider: true, location: true} }, 
          financial: true
        }
    })

    const completedCaseIds = req.query["workQueue"] === 'Booking Sheet Request'
      ? resultPosts.map(function(completedCase) {
          return completedCase.caseId;
      })
      : bookingSheetCompletedCases.map(function(completedCase) {
          return completedCase.caseId;
    })

    res.json({
      cases: resultPosts.map(function(oldCase) {
        return casesFormatter(oldCase, completedCaseIds)
      }),
      count: count
    })
  } catch(err: any) {
    res.status(500).json({ message: err.message });
}
  
}))