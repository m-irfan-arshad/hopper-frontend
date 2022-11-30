import { SingleCase } from '../reference';
import { Prisma, cases, patients } from '@prisma/client';
import moment from "moment";

interface DashboardQueryParams { 
    searchValue?: string
    dateRangeStart: string
    dateRangeEnd: string
    priorAuthorization?: string;
    vendorConfirmation?: string;
}

interface CasesFormatterProps {
    cases: cases & {
        patients: patients | null;
    }
}

interface FilterObject {
    procedureDate: object;
    caseId?: object;
    patients?: object;
    priorAuthorization?: object;
    vendorConfirmation?: object;
  }

export function formatDashboardQueryParams(params: DashboardQueryParams): Prisma.casesWhereInput   {
    const { searchValue, dateRangeStart, dateRangeEnd, priorAuthorization, vendorConfirmation } = params;
    
    let filterObject: FilterObject = {
        procedureDate: {
            gte: moment(dateRangeStart).startOf("day").toDate(),
            lte: moment(dateRangeEnd).endOf("day").toDate()
        },
        ...(priorAuthorization === "Incomplete") && {priorAuthorization: {equals: priorAuthorization}},
        ...(vendorConfirmation === "Incomplete") && {vendorConfirmation: {equals: vendorConfirmation}}
    }

    if (!searchValue) {
        return filterObject
    }

    const nameOne = searchValue.split(' ')[0];
    const nameTwo = searchValue.split(' ')[1];
    const caseId = parseInt(searchValue);
    const isStringNumeric = /^[0-9]+$/gi.test(searchValue);
    if (isStringNumeric) {
        filterObject.caseId = {
                equals: caseId
            }
    } else if (!nameTwo) {
        filterObject.patients = {
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
    else {
        filterObject.patients = {
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

   return filterObject
}

export function formatDate(date: Date | null) : string | null {
    if (!date) return null
    return moment(date).format('MM/DD/YYYY')
}

export function casesFormatter (params: CasesFormatterProps): any {
    const {cases} = params
    const newPatient = (cases.patients) ? {
        ...cases.patients,
        dateOfBirth: formatDate(cases.patients?.dateOfBirth) 
    } : null

    let newCase: SingleCase = {
        caseId: cases.caseId,
        procedureDate: formatDate(cases.procedureDate),
        fhirResourceId: cases.fhirResourceId,
        patientId: cases.patientId,
        patients: newPatient,
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