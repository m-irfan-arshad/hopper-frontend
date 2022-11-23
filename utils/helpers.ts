import type { NextApiResponse } from 'next'
import { SingleCase } from '../reference';
import { Prisma, cases, patients } from '@prisma/client';
import * as R from 'ramda';
import moment from "moment";

interface DashboardQueryParams { 
    searchValue?: string
    dateRangeStart: string
    dateRangeEnd: string
    priorAuthorization: string;
    vendorConfirmation: string;
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
            gte: new Date(dateRangeStart),
            lte: new Date(dateRangeEnd)
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

export function APIErrorHandler(err: any, res: NextApiResponse) {
    if (typeof (err) === 'string') {

        const is404 = err.toLowerCase().endsWith('not found');
        const statusCode = is404 ? 404 : 400;
        return res.status(statusCode).json({ message: err });
    }

    if (typeof (err) === 'object') {
        const error = err.message;
        let invalidParameters: Array<string> = [];

        const isInvalidParameter = error.toLowerCase().indexOf('got invalid value');
        const numberOfInvalidParameters = R.clone(error).toLowerCase().match(/argument/g)? R.clone(error).toLowerCase().match(/argument/g).length : 0;

        for (let i = 0; i < numberOfInvalidParameters; i++) {
            invalidParameters = invalidParameters + error.toLowerCase().split('argument')[i + 1].split(':')[0];
        }

        const statusCode = isInvalidParameter ? 400 : 500;
        return res.status(statusCode).json({ message: 'Something went wrong with the following values: ' + invalidParameters });
    }

    // default to 500 server error
    return res.status(500).json({ message: err.message });
}