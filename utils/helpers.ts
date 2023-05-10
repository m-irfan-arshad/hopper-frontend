import type { NextApiRequest, NextApiResponse } from 'next'
import { APIParameters, FullCase, IndexObject, defaultPatientTabFilter, defaultSchedulingFilter, defaultProcedureTabFilter, defaultFinancialFilter, BookingSheetConfig, defaultClinicalFilter } from '../reference';
import { Prisma } from '@prisma/client';
import moment, { isMoment } from "moment";
import * as R from 'ramda';
import * as yup from 'yup';
var flatten = require('flat')

interface DashboardQueryParams { 
    searchValue?: string
    dateRangeStart: string
    dateRangeEnd: string
    workQueue?: string;
}

interface FilterObject {
    scheduling: object;
    financial?: object;
    clinical?: object;
    procedureTab?: object;
    caseId?: object;
    patient?: object;
}

export function formatDashboardQueryParams(params: DashboardQueryParams, bookingSheetConfig: BookingSheetConfig): Prisma.casesWhereInput   {
    const { searchValue, dateRangeStart, dateRangeEnd } = params;
    const bookingSheetRequiredFields = bookingSheetConfig && createBookingSheetRequiredFields(bookingSheetConfig);

    let filterObject: FilterObject = {
        scheduling: {
            AND: [
                (params.workQueue === 'Booking Sheet Request' && bookingSheetRequiredFields) ? bookingSheetRequiredFields.scheduling : {},
                {
                    procedureDate: {
                        gte: moment(dateRangeStart).startOf("day").toDate(),
                        lte: moment(dateRangeEnd).endOf("day").toDate()
                    },
                }
            ]
        }
    }
    
    if (params.workQueue === 'Booking Sheet Request' && bookingSheetRequiredFields) {
        filterObject.financial = bookingSheetRequiredFields.financial;
        filterObject.procedureTab = bookingSheetRequiredFields.procedureTab;
        filterObject.clinical = bookingSheetRequiredFields.clinical;
    }

    if (!searchValue) {
        filterObject.patient = (params.workQueue === 'Booking Sheet Request' && bookingSheetRequiredFields) ? bookingSheetRequiredFields.patient : {};
        return filterObject
    }

    //TODO: Add back in caseId logic when UI is created
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
                (params.workQueue === 'Booking Sheet Request' && bookingSheetRequiredFields) ? bookingSheetRequiredFields.patient : {},
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
            (params.workQueue === 'Booking Sheet Request' && bookingSheetRequiredFields) ? bookingSheetRequiredFields.patient : {},
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

export function casesFormatter (cases: FullCase | null, completedCaseIds?: number[] | null): FullCase | null {
    if (cases) {
        let isBookingSheetComplete = false;
        if (completedCaseIds && completedCaseIds.includes(cases.caseId)) {
            isBookingSheetComplete = true
        }
        
        let newCase = {
            ...cases,
            caseId: cases.caseId,
            fhirResourceId: cases.fhirResourceId,
            isBookingSheetComplete: isBookingSheetComplete
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
    return R.dissoc(fieldName, object);
  }

/**
 * Formats an CRUD operation (default is update) for relationships
 * Sample Input Obj: {sampleTab: { sampleField: {sampleFieldId: 1, sampleFieldName: "name"}}}
 * Output: {sampleTab: { update: { sampleFieldId: 1}}}
 */
export function formObjectToPrismaQuery(obj: IndexObject, id="", operation="update") {
    let formattedObj = excludeField(obj, id);

    //update relationships by updating the Id, not the object itself
    if (typeof obj === 'object') {
        if (R.isEmpty(obj)) {
            return undefined
        }
        const objNoId = excludeField(obj, id) // remove Id
        Object.keys(objNoId).forEach(function(fieldName){
            const fieldId = fieldName + 'Id'
            if (objNoId[fieldName] instanceof Date || isMoment(objNoId[fieldName]) || R.isNil(objNoId[fieldName])) {
                formattedObj[fieldName] = objNoId[fieldName]
            } else if (typeof objNoId[fieldName] === 'object' && !Array.isArray(objNoId[fieldName])) { // for objects, delete the Id
                formattedObj[fieldId] = obj[fieldName][fieldId]
                delete formattedObj[fieldName]
            }
        })
       return {[operation]: formattedObj}
    } else {
        return formattedObj
    }
  }

export function connectDropdownSelection(dropdownName: string, field: IndexObject) {
    const newField = R.clone(field)
    const dropdownId = dropdownName + "Id"
    if (R.isNil(newField[dropdownName])) {
        delete newField[dropdownName]
    } else {
        newField[dropdownName] = { connect: {[dropdownId]: newField[dropdownName][dropdownId]}}
    }
    delete newField[dropdownId];
    return newField
}

export function formArrayToPrismaQuery(formData: IndexObject[], arrayFieldId: string) {
    let create: object[] = [];
    formData.forEach((arrayElem: any) => {
        const id = arrayFieldId
        let formattedField: any = R.clone(arrayElem);
        delete formattedField.caseId
        delete formattedField.patientId

        // formatting for patient
        formattedField = connectDropdownSelection("state", formattedField)
        formattedField.type && (formattedField.type = formattedField.type.type);

        // formatting for insurance object
        formattedField.priorAuthorization && (formattedField.priorAuthorization = formattedField.priorAuthorization.priorAuthorization);
        formattedField = connectDropdownSelection("insurance", formattedField)

        // formatting for product object
        !R.isNil(formattedField.quantity) && (formattedField.quantity = parseInt(formattedField.quantity))
        formattedField = connectDropdownSelection("vendor", formattedField)
        formattedField = connectDropdownSelection("manufacturer", formattedField)

        // formatting for diagnostic test / clearance
        formattedField.diagnosticTest && (formattedField.diagnosticTest = { connect: {diagnosticTestId: formattedField.diagnosticTest.diagnosticTestId}});
        delete formattedField.diagnosticTestId;
        delete formattedField.testName;
        formattedField.clearance && (formattedField.clearance = { connect: {clearanceId: formattedField.clearance.clearanceId}});
        delete formattedField.clearanceId;
        delete formattedField.clearanceName;
        if (formattedField.facility) {
            formattedField.facility = formObjectToPrismaQuery(formattedField.facility, 'facilityId', arrayElem.facility.facilityId ? 'update' : 'create')
            delete formattedField.facilityId
        }

        delete formattedField[id]
        create.push(formattedField);
    });
    return { deleteMany: {}, create: create }
}

export function clinicalTabToPrismaQuery(clinicalUpdates: any, formData: any) {
        let clinicalQuery = formObjectToPrismaQuery(clinicalUpdates, 'clinicalId')
        if (clinicalQuery?.update) {
            delete clinicalQuery.update.preOpFormId
            if(clinicalUpdates.preOpRequired === "false") {
                if (R.path(['preOpForm', 'preOpFormId'], formData)) {
                    clinicalQuery.update.preOpForm = {delete: true}
                }
            } else {
                if(clinicalUpdates.preOpForm) {
                    const preOpCrudOperation = R.path(['preOpForm','preOpFormId'], formData) ? 'update' : 'create';
                    let preOpForm = formObjectToPrismaQuery(clinicalUpdates.preOpForm, 'preOpFormId', preOpCrudOperation)
                    if (preOpForm) {
                        const formQuery = preOpForm[preOpCrudOperation]
                        if (R.path(['preOpForm', 'facility'], clinicalUpdates)) {
                            const facilityCrudOperation = R.path(['preOpForm', 'facility', 'facilityId'], formData) ? 'update' : 'create'
                            preOpForm = {...preOpForm, [preOpCrudOperation]: {...formQuery, facility : formObjectToPrismaQuery(clinicalUpdates.preOpForm.facility, 'facilityId', facilityCrudOperation)}}
                        }
                        clinicalQuery.update.preOpForm = preOpForm;
                    }
                }
            }
            if (formData.diagnosticTestsRequired === "true") {
                if (clinicalUpdates.diagnosticTests) {
                    clinicalQuery.update.diagnosticTests && (clinicalQuery.update.diagnosticTests = formArrayToPrismaQuery(formData.diagnosticTests, 'diagnosticTestFormId'));
                }
            } else {
                clinicalQuery.update.diagnosticTests = {deleteMany: {}}
            }
            if (formData.clearanceRequired === "true") {
                if (clinicalUpdates.clearances) {
                    clinicalQuery.update.clearances = formArrayToPrismaQuery(formData.clearances, 'clearanceFormId');
                }
            } else {
                clinicalQuery.update.clearances = {deleteMany: {}}
            }
        }
    return clinicalQuery
  }

export function procedureTabToPrismaQuery(procedureTabUpdates: any, formData: any) {
    const query = formObjectToPrismaQuery(procedureTabUpdates, "procedureTabId")
    if (query) {
        const anesthesiaIds = formData.anesthesia.map((elem: any) => ({['anesthesiaId']: elem['anesthesiaId']}))
        query.update.anesthesia = {
            set: [],
            connect: anesthesiaIds
        }
    }
    return query
}

export function patientTabToPrismaQuery(patientTabUpdates: any, formData: any) {
    const query = formObjectToPrismaQuery(patientTabUpdates, "patientId")
    if (query.update.address?.length > 0) {
        query.update.address = formArrayToPrismaQuery(formData.address, 'addressId');
    }
    if (query.update.phone?.length > 0) {
        query.update.phone = formArrayToPrismaQuery(formData.phone, 'phoneId');
    }
    return query
}

export function formatCreateCaseParams(data: FullCase) {
    return Prisma.validator<Prisma.casesCreateInput>()({
      patient: {
        create: {...data.patient, address: {create: []}, phone: {create: []}}
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
      },
      productTab: {
        create: []
      }
    })
  }



/**
 * Similar to react-hook-form's getDirtyFields, however it also returns the value of the dirty field instead of a boolean.
 * Useful for building performative update queries.
 */
export function getDirtyValues(dirtyFields: any, allValues: any): any {
    if (dirtyFields === true || Array.isArray(allValues) || isMoment(allValues) || allValues instanceof Date ) {
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

const flattenObj = (ob: any) => {
    let result: IndexObject = {};
    for (const i in ob) {
        if (Array.isArray(ob[i])) {
            ob[i].forEach((elem: any, index: number) => {
                const temp = flattenObj(ob[i]);
                for (const j in temp) {
                    result[i + '.' + j] = temp[j];
                }
        })
        } else if ((typeof ob[i]) === 'object' && !isMoment(ob[i])) {
            const temp = flattenObj(ob[i]);
            for (const j in temp) {
                result[i + '.' + j] = temp[j];
            }
        } else if (isMoment(ob[i])) {
            result[i] = ob[i].format();
        } else {
            result[i] = ob[i];
        }
    }
    return result;
};

export const getDifference = (original: { [key: string]: any }, incoming: { [key: string]: any }, ignoreKeys?: string[]) => {
    const flatOriginal = flattenObj(original);
    const flatIncoming = flattenObj(incoming);

    const differenceKeys = Object.keys({...flatOriginal, ...flatIncoming}).filter(key => {
        if (!(key in flatIncoming)) {
            const keyName = key.split('.').at(-1)
            if(!keyName) return true
            return ignoreKeys?.includes(keyName) ? false : true
        }
        return !R.equals(flatOriginal[key], flatIncoming[key])
      }
    );
  
    return flatten.unflatten(R.pick(differenceKeys, {...flatOriginal, ...flatIncoming}));
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

let requiredBookingSheetFieldsToDelete: string[] = [];

export function findRequiredBookingSheetFieldsToDelete(bookingSheetConfig: BookingSheetConfig) {
    let configObject = bookingSheetConfig as IndexObject;

    if (Array.isArray(configObject)) {
        Object.keys(configObject[0]).forEach(key => {
            findRequiredBookingSheetFieldsToDelete(configObject[0][key]);
        })
        return requiredBookingSheetFieldsToDelete;
    } else if (typeof configObject === 'object' && !Object.keys(configObject).some(r=> ['default', 'required', 'visible'].indexOf(r) >= 0)){
        Object.keys(configObject).forEach(key => {
            findRequiredBookingSheetFieldsToDelete(configObject[key]);
        })
        return requiredBookingSheetFieldsToDelete
    }

    if (typeof configObject === 'object' && Object.keys(configObject).some(r=> ['default', 'required', 'visible'].indexOf(r) >= 0)) {
        const isRequired = R.isNil(configObject.required) || configObject.required; //required by default

        !isRequired && configObject.pathToDeleteFieldFromQuery 
        && !requiredBookingSheetFieldsToDelete.includes(configObject.pathToDeleteFieldFromQuery) 
        && requiredBookingSheetFieldsToDelete.push(configObject.pathToDeleteFieldFromQuery);
    }

    return requiredBookingSheetFieldsToDelete
}

export function createBookingSheetRequiredFields(bookingSheetConfig: BookingSheetConfig) {
    let bookingSheetFieldsToDelete = findRequiredBookingSheetFieldsToDelete(bookingSheetConfig);

    let defaultQuery = {
        patient: defaultPatientTabFilter,
        clinical: R.clone(defaultClinicalFilter),
        scheduling: defaultSchedulingFilter,
        financial: defaultFinancialFilter,
        procedureTab: defaultProcedureTabFilter
    };

    bookingSheetFieldsToDelete.map((pathToDeleteFieldFromQuery: string) => {
        deleteFromObject(defaultQuery, pathToDeleteFieldFromQuery)
    });

    return defaultQuery
}

export function deleteFromObject(object: IndexObject, pathToDeleteFieldFromQuery: string) {
    const keys = pathToDeleteFieldFromQuery.split(".");
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

export function isTabComplete(tabData: IndexObject | IndexObject[], tabConfig: IndexObject | IndexObject[]): boolean {
    let isComplete = true;
    if (R.isNil(tabData) || R.isEmpty(tabData)) {
        return false
    } else if (Array.isArray(tabData) && Array.isArray(tabConfig)) {
        if (tabData.length === 0) isComplete = false;
        tabData.forEach((tabElem) => {
            if(!isTabComplete(tabElem, tabConfig[0])) isComplete = false;
        })
    } else if (!Array.isArray(tabConfig) && typeof tabConfig === 'object' && Object.keys(tabConfig).some(r=> ['default', 'required', 'visible'].indexOf(r) >= 0)){
        if(!(tabConfig.required === false) && (R.isNil(tabData) || R.isEmpty(tabData))) {
            isComplete = false;
        } 
    } else if (typeof tabConfig === 'object' && typeof tabData === 'object' && !Array.isArray(tabData)){
        Object.keys(tabConfig).forEach(key => {
            if(!isTabComplete(tabData[key], tabConfig[key])) isComplete = false;
        })
    }
    return isComplete;
}