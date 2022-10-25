import { SingleCase } from '../reference';
import { Prisma, cases, patients } from '@prisma/client';

interface DashboardQueryParams { 
    searchValue: string
    dateRangeStart: string
    dateRangeEnd: string
}

interface CasesFormatterProps {
    cases: cases & {
        patients: patients | null;
    }
}

export function formatDashboardQueryParams(params: DashboardQueryParams): Prisma.casesWhereInput   {
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

export function casesFormatter (params: CasesFormatterProps): any {
    const {cases} = params
    let newCase: SingleCase = {
        caseId: cases.caseId,
        procedureDate: cases.procedureDate.toISOString().split('T')[0],
        fhirResourceId: cases.fhirResourceId,
        patientId: cases.patientId,
        patients: cases.patients,
        providerName: cases.providerName,
        locationName: cases.locationName,
        createTime: cases.createTime,
        updateTime: cases.updateTime,
        steps: {
            priorAuthorization: cases.priorAuthorization,
            vendorConfirmation: cases.vendorConfirmation,
          }
    }
    return newCase
}