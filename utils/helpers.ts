import type { NextApiRequest, NextApiResponse } from 'next'
import { APIParameters, FullCase } from '../reference';
import { Prisma, insurance } from '@prisma/client';
import moment from "moment";
import * as R from 'ramda'

interface DashboardQueryParams { 
    searchValue?: string
    dateRangeStart: string
    dateRangeEnd: string
    priorAuthorization?: string;
    vendorConfirmation?: string;
}

interface FilterObject {
    scheduling: object;
    caseId?: object;
    patient?: object;
    priorAuthorization?: object;
    vendorConfirmation?: object;
  }

export interface ConfigObject {
    organization: string,
    tabs: Array<{
        label: string,
        fields: Array<{
            id: string,
            required: boolean,
            visible: boolean
        }>
    }>
}

export function formatDashboardQueryParams(params: DashboardQueryParams): Prisma.casesWhereInput   {
    const { searchValue, dateRangeStart, dateRangeEnd, priorAuthorization, vendorConfirmation } = params;
    
    let filterObject: FilterObject = {
        scheduling: {
            procedureDate: {
                gte: moment(dateRangeStart).startOf("day").toDate(),
                lte: moment(dateRangeEnd).endOf("day").toDate()
            },
        },
        ...(priorAuthorization === "Incomplete") && {financial: { some: {priorAuthorization: {contains: "Incomplete"}}}},
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
        filterObject.patient = {
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
        filterObject.patient = {
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

export function formatDate(date: Date | null | undefined) : string | null {
    if (!date) return null
    return moment(date).format('MM/DD/YYYY')
}

export function casesFormatter (cases: FullCase | null): FullCase | null {
    if (cases) {
        const scheduling = cases.scheduling;
        const formattedProvider = (scheduling?.provider) ?  {
            ...scheduling.provider, 
            providerName: (scheduling.provider) ? `${scheduling.provider.firstName} ${scheduling.provider.lastName}` : ''
        } : null;
        
        let newCase = {
            ...cases,
            caseId: cases.caseId,
            fhirResourceId: cases.fhirResourceId,
            scheduling: {
                ...scheduling,
                provider: formattedProvider,
            }
        }
        return newCase
    } else {
        return null;
    }
}

export function validateParameters(requiredParams: Array<string>, req: NextApiRequest, res: NextApiResponse) {
    const isPOST = Object.keys(req.body).length > 0; 
    return validateRequest(requiredParams, isPOST ? req.body : req.query, res)
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
export function excludeField(object: any, fieldName: string): any {
    let newObject = R.clone(object)
    delete newObject[fieldName]
    return newObject
  }

/**
 * Formats an CRUD operation (default is update) for relationships
 * Sample Input Obj: {sampleTab: { sampleField: {sampleFieldId: 1, sampleFieldName: "name"}}}
 * Output: {sampleTab: { update: { sampleFieldId: 1}}}
 */
export function getRelationshipCrudObject(obj: {[key: string]: any}, key="", operation="update") {
    let formattedObj = R.clone(obj);

    //update relationships by updating the Id, not the object itself
    if (typeof obj === 'object') {
        const objNoId = excludeField(obj, key)
        Object.keys(objNoId).forEach(function(key){
            const id = key + 'Id'
            if (Array.isArray(objNoId[key])) {
                formattedObj[key] = {set: [], connect: objNoId[key].map((elem: any) => ({[id]: elem[id]}))};
            } else if (typeof objNoId[key] === 'object') {
                const id = key + 'Id'
                formattedObj[id] = obj[key][id]
                delete formattedObj[key]
            }
        })
       return {[operation]: formattedObj}
    } else {
        return formattedObj
    }
  }

export function formatCreateCaseParams(data: FullCase) {
    return Prisma.validator<Prisma.casesCreateInput>()({
      patient: {
        create: data.patient,
      },
      scheduling: {
        create: {
          procedureDate: data.scheduling.procedureDate,
          locationId: data.scheduling.location?.locationId,
          procedureUnitId: data.scheduling.procedureUnit?.procedureUnitId,
          serviceLineId: data.scheduling.serviceLine?.serviceLineId,
          providerId: data.scheduling.provider?.providerId,
        },
      },
      procedureTab: {
        create: {}
      }
    })
  }

export function parseFieldConfig(configObject: ConfigObject, tabName: string, fieldName: string, checkingFor: "visible" | "required", defaultReturnValue?: boolean) {
    const tab = configObject.tabs.find(tab => tab.label === tabName)
    if (tab) {
        const field = tab.fields.find(field => field.id === fieldName);
        return field && field[checkingFor]
    }
    return defaultReturnValue ? defaultReturnValue : false
}

/**
 * Similar to react-hook-form's getDirtyFields, however it also returns the value of the dirty field instead of a boolean.
 * Useful for building performative update queries.
 */
export function getDirtyValues(dirtyFields: any, allValues: any): object | undefined {
    if (dirtyFields === true || Array.isArray(dirtyFields))
      return allValues;
    if (R.isEmpty(allValues)) return undefined;
    return Object.fromEntries(Object.keys(dirtyFields).map(key => [key, getDirtyValues(dirtyFields[key], allValues[key])]));
}