import { Prisma } from '@prisma/client';

interface Params { 
    searchValue: string
    dateRangeStart: string
    dateRangeEnd: string
}

export function formatDashboardQueryParams(params: Params): Prisma.casesWhereInput   {
    const { searchValue, dateRangeStart, dateRangeEnd } = params;
    const nameOne = searchValue.split(' ')[0];
    const nameTwo = searchValue.split(' ')[1];
    const caseId = parseInt(searchValue);

    const isStringNumeric = /^[0-9]+$/gi.test(searchValue);
    
    if (isStringNumeric) {
        return  {
            procedureDate: {
                gte: new Date(dateRangeStart),
                lte: new Date(dateRangeEnd)
            },
            caseId: {
                equals: caseId
            }
          }
    } else if (!nameTwo) {
    return  {
        procedureDate: {
            gte: new Date(dateRangeStart),
            lte: new Date(dateRangeEnd)
        },
        patients: {
            OR: [
                {
                    firstName: {
                    startsWith: nameOne,
                    mode: 'insensitive'
                    },
                },
                {
                    lastName: {
                    startsWith: nameOne,
                    mode: 'insensitive'
                    },
                },
            ]
      }
    }
   } else {
    return  {
        procedureDate: {
            gte: new Date(dateRangeStart),
            lte: new Date(dateRangeEnd)
        },
        patients: {
        AND: [
          {
            OR: [
                { firstName: { startsWith: nameOne, mode: 'insensitive' } },
                { lastName: { startsWith: nameOne, mode: 'insensitive' } }
              ]
          },
          {
            OR: [
                { firstName: { startsWith: nameTwo, mode: 'insensitive' } },
                { lastName: { startsWith: nameTwo, mode: 'insensitive' } }
              ]
          },
        ]
      }
    }
   }
}