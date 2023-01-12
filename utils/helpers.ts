import type { NextApiRequest, NextApiResponse } from 'next'
import { SingleCase, APIParameters } from '../reference';
import { Prisma, cases, patients, locations, providers } from '@prisma/client';
import moment from "moment";

interface DashboardQueryParams { 
    searchValue?: string
    dateRangeStart: string
    dateRangeEnd: string
    priorAuthorization?: string;
    vendorConfirmation?: string;
}

interface PatientTableParams {
    firstName: string;
    lastName: string;
    dateOfBirth: moment.Moment;
}

interface CaseTableParams {
    providerId: number
    locationId: number
    procedureUnitId: number
    serviceLineId: number
    procedureDate: moment.Moment;
}

interface CaseFormParams {
    provider: any
    location: any
    procedureUnit: any
    serviceLine: any
    procedureDate: moment.Moment;
}

interface CreateCaseFromFormObject {
    patient: PatientTableParams
    case: CaseFormParams 
}

interface CreateCaseObject {
    patient: PatientTableParams
    case: CaseTableParams 
}

interface CasesFormatterProps {
    cases: cases & {
        patients: patients | null;
        locations: locations | null
        providers: providers | null
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

    const newLocation = (cases.locations) ? cases.locations : null;
    const newProvider = (cases.providers) ? cases.providers : null;

    let newCase: SingleCase = {
        caseId: cases.caseId,
        procedureDate: formatDate(cases.procedureDate),
        fhirResourceId: cases.fhirResourceId,
        patientId: cases.patientId,
        locationId: cases.locationId,
        providerId: cases.providerId,
        patients: newPatient,
        providers: newProvider,
        locations: newLocation,
        createTime: cases.createTime,
        updateTime: cases.updateTime,
        steps: {
            priorAuthorization: cases.priorAuthorization,
            vendorConfirmation: cases.vendorConfirmation,
          }
    }
    return newCase
}

export function validateParameters(requiredParams: Array<string>, req: NextApiRequest, res: NextApiResponse) {
    return validateRequest(requiredParams, req.query, res)
}


export function validateRequest(requiredParams: Array<string>, inputtedParams: APIParameters, res: NextApiResponse) {
    const invalidParameters = requiredParams.reduce(function(acc: any, key: string) {
        if (!inputtedParams[key]) {
            return acc + ' ' + key;
        }
        return acc;
    }, []);
    if (invalidParameters.length > 0) {
        return res.status(400).json({ message: 'The following required parameters are missing:' + invalidParameters });
    } 
    return null;
}


export function withValidation(requiredParams: Array<string>, queryFunc: Function) {
    return (...args: [NextApiRequest, NextApiResponse]) => {
        const invalidParamsMessage = validateParameters(requiredParams, ...args);

        if (invalidParamsMessage) {
            return invalidParamsMessage
        }

        return queryFunc(...args)
    }
}

export function formatCreateCaseParams(params: CreateCaseFromFormObject) {
    const createCaseObject: CreateCaseObject = {
        patient: params.patient,
        case: {
            procedureDate: params.case.procedureDate,
            locationId: params.case.location.locationId,
            procedureUnitId: params.case.procedureUnit.procedureUnitId,
            providerId: params.case.provider.providerId,
            serviceLineId: params.case.serviceLine.serviceLineId
        }
    }
    return createCaseObject;
}