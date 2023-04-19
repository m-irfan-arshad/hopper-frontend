import { clinical, cases, Prisma } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next'
import { formatDashboardQueryParams, casesFormatter, withValidation } from '../../utils/helpers';
import prisma from '../../prisma/clientInstantiation';
import { diagnosticTestOptions, FullCase, paginationCount } from '../../reference';
import { withApiAuthRequired } from '@auth0/nextjs-auth0';
import PatientTab from '../../components/bookingSheet/tabs/patientTab';

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

const facilityFilter = { 
  OR: [
    {atProcedureLocation: true},
    {facility: {
      is: {
        NOT: [
          { facilityName: "" },
          { phone: "" },
          { addressOne: "" },
          { addressTwo: "" },
          { city: "" },
          { state: "" },
          { zip: "" },
        ]
      }  
    }}
  ] 
}

const patientTabFilter = {
  NOT: [
    { firstName: "" },
    { phone: "" },
    { addressOne: "" },
    { addressTwo: "" },
    { city: "" },
    { state: "" },
    { zip: "" },
  ]
}

const preOpFormFilter = {
  OR: [
    {preOpRequired: false},
    {preOpForm: {
      is: {
        preOpDateTime: { not: undefined },
        ...facilityFilter
      }
    }}
  ]
}

const diagnosticTestFormFilter = {
  OR: [
    {diagnosticTestsRequired: false},
    {diagnosticTests: {
      every: {
        AND: [
          { OR: [
            {diagnosticTest: { not: undefined,  testName: {not: "Other"}}},
            {diagnosticTest: { testName: "Other" }, testNameOther: { not: "" }}
          ]}
        ],
        testDateTime: { not: undefined },
        ...facilityFilter
      }
    }}
  ]
}

const clearanceFormFilter = {
  OR: [
    {clearanceRequired: false},
    {clearances: {
      every: {
        AND: [
          { OR: [
            {clearance: { not: undefined, clearanceName: {not: "Other"}}},
            {clearance: { clearanceName: "Other" }, clearanceNameOther: { not: "" }}
          ]}
        ],
        clearanceDateTime: { not: undefined },
        ...facilityFilter
      }
    }}
  ]
}

const clinicalFilters = {
    NOT: [
      { physicianFirstName: "" },
      { physicianLastName: "" },
      { physicianPhone: "" },
      { postOpDateTime: undefined }
    ],
    AND: [
      preOpFormFilter,
      diagnosticTestFormFilter,
      clearanceFormFilter
    ]
  }

