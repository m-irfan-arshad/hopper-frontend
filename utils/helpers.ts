import type { NextApiRequest, NextApiResponse } from 'next'
import { APIParameters, FullCase, IndexObject, defaultPatientTabFilter, defaultSchedulingFilter, defaultProcedureTabFilter, defaultFinancialFilter, BookingSheetConfig, defaultClinicalFilter } from '../reference';
import { Prisma } from '@prisma/client';
import moment, { isMoment } from "moment";
import * as R from 'ramda';
import * as yup from 'yup';

interface DashboardQueryParams { 
    searchValue?: string
    dateRangeStart: string
    dateRangeEnd: string
    priorAuthorization?: string;
    vendorConfirmation?: string;
    workQueue?: string;
}

interface FilterObject {
    scheduling: object;
    financial?: object;
    clinical?: object;
    procedureTab?: object;
    caseId?: object;
    patient?: object;
    priorAuthorization?: object;
    vendorConfirmation?: object;
}

export function formatDashboardQueryParams(params: DashboardQueryParams, bookingSheetConfig: BookingSheetConfig): Prisma.casesWhereInput   {
    const { searchValue, dateRangeStart, dateRangeEnd, priorAuthorization, vendorConfirmation } = params;
    const bookingSheetParams = createBookingSheetParams(params, bookingSheetConfig);

    let filterObject: FilterObject = {
        scheduling: {
            AND: [
                params.workQueue === 'Booking Sheet Request' ? bookingSheetParams.scheduling : {},
                {
                    procedureDate: {
                        gte: moment(dateRangeStart).startOf("day").toDate(),
                        lte: moment(dateRangeEnd).endOf("day").toDate()
                    },
                }
            ]
        },
        ...(priorAuthorization === "Incomplete") && {financial: { some: {priorAuthorization: {contains: "Incomplete"}}}},
        ...(vendorConfirmation === "Incomplete") && {vendorConfirmation: {equals: vendorConfirmation}}
    }

    filterObject.financial =  params.workQueue === 'Booking Sheet Request' ? bookingSheetParams.financial : {};
    filterObject.procedureTab = params.workQueue === 'Booking Sheet Request' ? bookingSheetParams.procedureTab : {};
    filterObject.clinical = params.workQueue === 'Booking Sheet Request' ? bookingSheetParams.clinical : {};

    if (!searchValue) {
        filterObject.patient = params.workQueue === 'Booking Sheet Request' ? bookingSheetParams.patient : {};
        return filterObject
    }

    //TODO: separate caseId and name logic
    const nameOne = searchValue.split(' ')[0];
    const nameTwo = searchValue.split(' ')[1];
    const caseId = parseInt(searchValue);
    const isStringNumeric = /^[0-9]+$/gi.test(searchValue);
    // if (isStringNumeric) {
    //     filterObject.caseId = {
    //             equals: caseId
    //         }
    // }
    if (!nameTwo) { 
        filterObject.patient = {
            AND: [
                params.workQueue === 'Booking Sheet Request' ? bookingSheetParams.patient : {},
                {
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
            ]
        }
    }
    else { 
        filterObject.patient = {
          AND: [
            params.workQueue === 'Booking Sheet Request' ? bookingSheetParams.patient : {},
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
        // const patient = cases.patient;
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
            },
            // patient: {
            //     ...patient,
            //     isComplete: (patient.firstName && patient.lastName && patient.mrn) ? true : false
            // }
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
        const objNoId = excludeField(obj, id) // remove Id
        Object.keys(objNoId).forEach(function(fieldName){
            const fieldId = fieldName + 'Id'
            if (Array.isArray(objNoId[fieldName])) { // for arrays, disconnect all previous relationships and connect ids in array
                formattedObj[fieldName] = {set: [], connect: objNoId[fieldName].map((elem: any) => ({[fieldId]: elem[fieldId]}))};
            } else if (typeof objNoId[fieldName] === 'object') { // for objects, delete the Id
                formattedObj[fieldId] = obj[fieldName][fieldId]
                delete formattedObj[fieldName]
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

export function addConfigToValidationField(tabConfigObject: IndexObject, fieldName: string) {
    const config: {default: any, required?: boolean, visible?: boolean} | undefined = tabConfigObject[fieldName];
    if (!config) {
        console.warn("no config found for field: ", fieldName)
        return yup.mixed();
    }
    const required = R.isNil(config.required) || config.required; //required by default
    const visible =  R.isNil(config.visible) || config.visible; //visible by default
    if (!visible) {
        return;
    }
    
    if(R.isNil(config.default) || Array.isArray(config.default)) {
        return required ? yup.mixed().required().default(config.default) : yup.mixed().notRequired().default(config.default)
    }
    return required ? yup.string().required().default(config.default) : yup.string().notRequired().default(config.default)
}

export function createValidationObject(bookingSheetConfig: IndexObject) {
    const tabValidationObject: IndexObject = {};

    Object.keys(bookingSheetConfig).forEach(tabName=>{
        let tab = bookingSheetConfig[tabName]
        let isArray = false;
        let validationTab: IndexObject = {}
        if (Array.isArray(tab)) {
            tab = tab[0];
            isArray = true;
        }
        Object.keys(tab).forEach(fieldName=>{
            const fieldWithConfig = addConfigToValidationField(tab, fieldName)
            fieldWithConfig && (validationTab[fieldName] = fieldWithConfig)
        })
        if (isArray) {
            tabValidationObject[tabName] = yup.array().of(yup.object().shape(validationTab))
        } else {
            tabValidationObject[tabName] = yup.object().shape(validationTab)
        }
    })
    return yup.object().shape(tabValidationObject)
}

// export function createPrismaQuery(bookingSheetConfig: any) {
//     let configObject = bookingSheetConfig as IndexObject;
//     let modifiedConfig: any = {};
//     let prismaQuery: any = {}
//     let tabHeader: string;

//     /* 
//         TODO:
//         1. How to drill down all the way on the clinical tab 
//             (currently only drill down 2 layers but should drill down maybe based on pathToField?)
//             1a. Maybe create dynamic path for facility and/or facility has no path?
//         2. How to deal with the fact that there are 3 different paths to fields for facility? maybe facility doesnt need path to field...
//         3. unit tests
//         4. final review before PR
//     */

//     // if (typeof configObject === 'object' && Object.keys(configObject).some(r=> ['patient', 'financial', 'procedureTab', 'scheduling', 'clinical'].indexOf(r) >= 0)) {
//     //     Object.keys(configObject).forEach(key => {
//     //         modifiedConfig = createPrismaQuery(configObject[key]); //creates the 5 tab headers to later use to fill out because we are checking for them earlier
//     //     })
//     // }

//     // if (Array.isArray(configObject)) {
//     //     Object.keys(configObject[0]).forEach(key => {
//     //         const prismaObj = createPrismaQuery(configObject[0][key])
//     //         prismaObj && (modifiedConfig[key] = prismaObj)  
            
//     //     })
//     //     //return yup.array().of(yup.object().shape(validationTab))
//     // } else if (typeof configObject === 'object' && !Object.keys(configObject).some(r=> ['default', 'required', 'visible'].indexOf(r) >= 0)){
//     //     Object.keys(configObject).forEach(key => {
//     //         const prismaObj = createPrismaQuery(configObject[key])
//     //         prismaObj && (modifiedConfig[key] = prismaObj)
//     //     })
//     //     //return yup.object().shape(prismaQuery)
//     // }

//     //currently only on first loop will it even enter this if statement... maybe make this statement just create the prisma query object and go through the rest of this stuff later on?

//     if (typeof configObject === 'object' && Object.keys(configObject).some(r=> ['patient', 'financial', 'procedureTab', 'scheduling', 'clinical'].indexOf(r) >= 0)) {
//         Object.keys(configObject).forEach(key => {
//             const prismaQueryObj = createPrismaQuery(configObject[key]); //creates the 5 tab headers to later use to fill out because we are checking for them earlier
//             const tab = Array.isArray(configObject[key]) ? configObject[key][0]: configObject[key];
//             Object.keys(tab).forEach(keySecond => {
//                 const tab = Array.isArray(configObject[key]) ? configObject[key][0]: configObject[key];
//                 // const newPrismaQueryObj = createPrismaQuery(tab[keySecond]);

//                 if (typeof tab[keySecond] === 'object' && Object.keys(tab[keySecond]).some(r=> ['default', 'required', 'visible'].indexOf(r) >= 0)) {
//                     console.log('configObject',configObject);
//                     const pathToField = configObject.pathToField || '';
//                     const isRequired = R.isNil(configObject.required) || configObject.required; //required by default
//                     //console.log('isRequired',isRequired);
//                     const keys = pathToField.split(".");

//                     // if (configObject=== 'atProcedureLocation') {
//                     //     console.log('hi');
//                     // }

//                     switch(key) {
//                         case "patient": {
//                             !isRequired && deleteFromObject(defaultPatientTabFilter, pathToField)
//                             return prismaQueryObj && (prismaQuery[key] = defaultPatientTabFilter)
//                         }
//                         case "financial": {
//                             !isRequired && deleteFromObject(defaultFinancialFilter, pathToField)
//                             return prismaQueryObj && (prismaQuery[key] = defaultFinancialFilter)
//                         }
//                         case "procedureTab": {
//                             !isRequired && deleteFromObject(defaultProcedureTabFilter, pathToField)
//                             return prismaQueryObj && (prismaQuery[key] = defaultProcedureTabFilter)
//                         }
//                         case "scheduling": {
//                             !isRequired && deleteFromObject(defaultSchedulingFilter, pathToField)
//                             return prismaQueryObj && (prismaQuery[key] = defaultSchedulingFilter)
//                         }
//                         case "clinical": {
//                             !isRequired && deleteFromObject(defaultClinicalFilter, pathToField)
//                             return prismaQueryObj && (prismaQuery[key] = defaultClinicalFilter)
//                         }
//                         default: return
//                     }
//                 }
//             })
//         })
//         return prismaQuery
//     }
//     return prismaQuery
// }

let fieldsToDelete: string[] = [];

export function findFieldsToDelete(bookingSheetConfig: any) { //find fields to delete is new function
    let configObject = bookingSheetConfig as IndexObject;
    //let fieldsToDelete: string[] = []; //will not remember the fields to delete...
    /* 
        TODO:
        1. How to drill down all the way on the clinical tab  ... DONE
            (currently only drill down 2 layers but should drill down maybe based on pathToField?)
            1a. Maybe create dynamic path for facility and/or facility has no path?
        2. How to deal with the fact that there are 3 different paths to fields for facility? maybe facility doesnt need path to field... DONE
        3. REVIEW ISAACS PR https://github.com/Medtel/hopper-frontend/pull/88
        4. merge this code into original code with UI updates 
        5. finish other work queues
        6. unit tests
        7. final review before PR
    */

    if (Array.isArray(configObject)) {
        Object.keys(configObject[0]).forEach(key => {
            findFieldsToDelete(configObject[0][key]);
        })
        return fieldsToDelete;
    } else if (typeof configObject === 'object' && !Object.keys(configObject).some(r=> ['default', 'required', 'visible'].indexOf(r) >= 0)){
        Object.keys(configObject).forEach(key => {
            findFieldsToDelete(configObject[key]);
        })
        return fieldsToDelete
    }

    if (typeof configObject === 'object' && Object.keys(configObject).some(r=> ['default', 'required', 'visible'].indexOf(r) >= 0)) {
        const isRequired = R.isNil(configObject.required) || configObject.required; //required by default

        !isRequired && configObject.pathToField && !fieldsToDelete.includes(configObject.pathToField) && fieldsToDelete.push(configObject.pathToField);
    }

    return fieldsToDelete
}

export function createBookingSheetParams(params: any, bookingSheetConfig: any) {
    let fieldsToDelete = findFieldsToDelete(bookingSheetConfig);

    let defaultQuery = {
        patient: defaultPatientTabFilter,
        clinical: defaultClinicalFilter,
        scheduling: defaultSchedulingFilter,
        financial: defaultFinancialFilter,
        procedureTab: defaultProcedureTabFilter
    };

    fieldsToDelete.map((pathToField: string) => {
        deleteFromObject(defaultQuery, pathToField)
    });

    return defaultQuery
}

export function deleteFromObject(object: any, pathToField: string) {
    const keys = pathToField.split(".");
    const lastKey = keys.pop();
    const nextLastKey = keys.pop();
    const nextLastObj = keys.reduce((a, key) => a[key], object);
    
    delete nextLastObj[nextLastKey as string][lastKey as string]
    
    return object;
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