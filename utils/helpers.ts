import type { NextApiRequest, NextApiResponse } from 'next'
import { APIParameters, FullCase, IndexObject } from '../reference';
import { Prisma, insurance } from '@prisma/client';
import moment, { isMoment } from "moment";
import * as R from 'ramda';
import * as yup from 'yup';
var flatten = require('flat')

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

export function validateQueryOrBody(requiredParams: Array<string>, req: NextApiRequest, res: NextApiResponse) {
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
        const invalidParamsMessage = validateQueryOrBody(requiredParams, ...args);

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
export function convertObjectToPrismaFormat(obj: {[key: string]: any}, id="", operation="update") {
    let formattedObj = R.clone(obj);

    //update relationships by updating the Id, not the object itself
    if (typeof obj === 'object') {
        if (R.isEmpty(obj)) {
            return undefined
        }
        const objNoId = excludeField(obj, id) // remove Id
        Object.keys(objNoId).forEach(function(fieldName){
            const fieldId = fieldName + 'Id'
            if (Array.isArray(objNoId[fieldName])) { // for arrays, disconnect all previous relationships and connect ids in array
                formattedObj[fieldName] = {set: [], connect: objNoId[fieldName].map((elem: any) => ({[fieldId]: elem[fieldId]}))};
            } else if (objNoId[fieldName] instanceof Date || R.isNil(objNoId[fieldName])) {
                formattedObj[fieldName] = objNoId[fieldName]
            }
            else if (typeof objNoId[fieldName] === 'object') { // for objects, delete the Id
                formattedObj[fieldId] = obj[fieldName][fieldId]
                delete formattedObj[fieldName]
            }
        })
       return {[operation]: formattedObj}
    } else {
        return formattedObj
    }
  }

  //not in use yet
  export function convertObjectToPrismaFormatRecursive(data: any, id="", operation="update") {
    if(Array.isArray(data)) {
        return {set: [], connect: data.map((elem: any) => ({[id]: elem[id]}))};
    } else if (typeof data === 'object' && !R.isEmpty(data)) {
        console.log(id, " is object: ", data)
        let newObj = excludeField(data, id)
        Object.keys(data).forEach(key => (
            newObj[key] = convertObjectToPrismaFormat(data[key], key+'Id')
        ))
        return {'update': newObj}
    } else {
        return data
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
      },
      clinical: {
        create: {}
      }
    })
  }

/**
 * Similar to react-hook-form's getDirtyFields, however it also returns the value of the dirty field instead of a boolean.
 * Useful for building performative update queries.
 */
export function getDirtyValues(dirtyFields: any, allValues: any): any {
    if (dirtyFields === true || Array.isArray(allValues) || isMoment(allValues)) {
      return allValues;
    }
    else if (R.isEmpty(dirtyFields) || R.isNil(dirtyFields)) {
        return undefined;
    } 
    else if (typeof dirtyFields === 'object') {
        return Object.fromEntries(Object.keys(dirtyFields).map(key => [key, getDirtyValues(dirtyFields[key], allValues[key])]));
    } else {
        return allValues;
    }
}

export const getDifference = (original: any, incoming: any) => {
    const flatOriginal = flatten(original);
    const flatIncoming = flatten(incoming);
  
    const differenceKeys = Object.keys(flatIncoming).filter(
      key => !R.equals(flatOriginal[key], flatIncoming[key])
    );
  
    return flatten.unflatten(R.pick(differenceKeys, flatIncoming));
  }

/**
 * Recursive function that converts a booking sheet config into a yup validation object.
 * Iterates over config until it reaches a field config object, which is an object containing a 'default', 'required', or 'visible' field
 * 
 * @returns yup validation schema
 */
export function createValidationObject(configObject: IndexObject | Array<IndexObject>): any {
    let validationTab: IndexObject = {}
    if (Array.isArray(configObject)) {
        Object.keys(configObject[0]).forEach(key => {
            const yupObject = createValidationObject(configObject[0][key])
            yupObject && (validationTab[key] = yupObject)  
        })
        return yup.array().of(yup.object().shape(validationTab))
    } else if (typeof configObject === 'object' && !Object.keys(configObject).some(r=> ['default', 'required', 'visible'].indexOf(r) >= 0)){
        Object.keys(configObject).forEach(key => {
            const yupObject = createValidationObject(configObject[key])
            yupObject && (validationTab[key] = yupObject)
        })
        return yup.object().shape(validationTab)
    }

    // configObject is a field config
    const isRequired = R.isNil(configObject.required) || configObject.required; //required by default
    const isVisible =  R.isNil(configObject.visible) || configObject.visible; //visible by default
    if (!isVisible) {
        return yup.mixed();
    }
    
    if(R.isNil(configObject.default) || Array.isArray(configObject.default)) {
        return isRequired ? yup.mixed().required().default(configObject.default) : yup.mixed().notRequired().default(configObject.default)
    }
    return isRequired ? yup.string().required().default(configObject.default) : yup.string().notRequired().default(configObject.default)
}

export function getPathFromId(id: string) {
    return id.split('.');
}

export function isFieldVisible(config: object | undefined, id: string) {
    if (!config) return true;
    const path = getPathFromId(id);
    const visible: boolean | undefined = R.path([...path, "visible"], config);
    return R.isNil(visible) ? true : visible;
}

export function checkFieldForErrors(id: string, errors: any): boolean {
    return R.isNil(R.path(getPathFromId(id), errors)) ? false : true
}

export function getPrismaArrayUpdateQuery(formData: any, dirtyFields: any, arrayFieldId: string) {
    let create: object[] = [];
    let update: object[] = [];
    formData.forEach((arrayElem: any, index: number) => {
        const updatedFields: any = dirtyFields[index]
        if (R.isNil(updatedFields)) return; // check if any fields were updated
        const id = arrayFieldId
        let formattedField: any = getDirtyValues(updatedFields, arrayElem);
        delete formattedField.caseId

        // formatting for insurance object
        formattedField.priorAuthorization && (formattedField.priorAuthorization = formattedField.priorAuthorization.priorAuthorization);
        if (formattedField.insurance) {
            formattedField.insurance = { connect: {insuranceId: formattedField.insurance.insuranceId}}
        } else {
            delete formattedField.insurance;
        }
        delete formattedField.insuranceId;

        // formatting for diagnostic test / clearance
        formattedField.diagnosticTest && (formattedField.diagnosticTest = { connect: {diagnosticTestId: formattedField.diagnosticTest.diagnosticTestId}});
        delete formattedField.diagnosticTestId
        formattedField.clearance && (formattedField.clearance = { connect: {clearanceId: formattedField.clearance.clearanceId}});
        delete formattedField.clearanceId;
        if (formattedField.facility) {
            formattedField.facility = convertObjectToPrismaFormat(formattedField.facility, 'facilityId', arrayElem.facility.facilityId ? 'update' : 'create')
            delete formattedField.facilityId
        }
        
        if (arrayElem[id]) { //if there is id present, update. Otherwise create
            delete formattedField.caseId;
            update.push({ data: formattedField, where: { [id]: arrayElem[id] } });
            delete formattedField[id];
        } else {
            delete formattedField[id]
            create.push(formattedField);
        }
    });
    return { create, update }
}