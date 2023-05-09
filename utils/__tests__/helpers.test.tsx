import moment from "moment";
import type { NextApiResponse } from 'next'
import { defaultBookingSheetConfig, defaultClinicalFilter, defaultFinancialFilter, defaultPatientTabFilter, defaultProcedureTabFilter, defaultSchedulingFilter } from "../../reference";
import { checkFieldForErrors, createValidationObject, excludeField, formatDashboardQueryParams, formatDate, formObjectToPrismaQuery, clinicalTabToPrismaQuery, getDifference, procedureTabToPrismaQuery, isFieldVisible, validateQueryOrBody, findRequiredBookingSheetFieldsToDelete, createBookingSheetRequiredFields, deleteFromObject, isTabComplete } from "../helpers";
import httpMock from 'node-mocks-http';
import { mockBookingSheetConfig, mockSingleCase, mockSingleClearance, mockSingleProcedure, mockSingleScheduling } from "../../testReference";
import * as R from "ramda";

describe("Utils", () => {
    test("formatDashboardQueryParams with booking sheet request work queue", async() => {
        const params = {
            workQueue: 'Booking Sheet Request',
            dateRangeStart: '2022-10-10',
            dateRangeEnd: '2022-11-11',
        };

        const result = formatDashboardQueryParams(params, defaultBookingSheetConfig);
        
        expect(result).toEqual({
            scheduling: {
                AND: [
                    defaultSchedulingFilter,
                    {
                        procedureDate: {
                            gte: moment('10/10/2022', 'MM/DD/YYYY').startOf("day").toDate(),
                            lte: moment('11/11/2022', 'MM/DD/YYYY').endOf("day").toDate()
                        },
                    }
                ]
            },
            clinical: defaultClinicalFilter,
            financial: defaultFinancialFilter,
            procedureTab: defaultProcedureTabFilter,
            patient: defaultPatientTabFilter
          });    
    });

    test("formatDashboardQueryParams with one name", async() => {
        const params = {
            searchValue: 'Bob',
            dateRangeStart: '2022-10-10',
            dateRangeEnd: '2022-11-11',
        };

        const result = formatDashboardQueryParams(params, defaultBookingSheetConfig);

        expect(result).toEqual( {
            scheduling: {
                AND: [
                    {},
                    {
                        procedureDate: {
                            gte: moment('10/10/2022', 'MM/DD/YYYY').startOf("day").toDate(),
                            lte: moment('11/11/2022', 'MM/DD/YYYY').endOf("day").toDate()
                        }
                    }
                ]
            },
            patient: {
                AND: [
                    {},
                    {
                        OR: [
                            {
                                firstName: {
                                startsWith: 'Bob',
                                mode: 'insensitive'
                                },
                            },
                            {
                                lastName: {
                                startsWith: 'Bob',
                                mode: 'insensitive'
                                },
                            },
                        ]
                    }
                ]
            }
        }
        );    
    });

    test("formatDashboardQueryParams with two names", async() => {
        const params = {
            searchValue: 'Bob NewPort',
            dateRangeStart: '2022-10-10',
            dateRangeEnd: '2022-11-11',
        };

        const result = formatDashboardQueryParams(params, defaultBookingSheetConfig);
        
        expect(result).toEqual({
            scheduling: {
                AND: [
                    {},
                    {
                        procedureDate: {
                            gte: moment('10/10/2022', 'MM/DD/YYYY').startOf("day").toDate(),
                            lte: moment('11/11/2022', 'MM/DD/YYYY').endOf("day").toDate()
                        }
                    }
                ]
            },
            patient: {
            AND: [
                {}, 
              {
                OR: [
                    { firstName: { startsWith: 'Bob', mode: 'insensitive' } },
                    { lastName: { startsWith: 'Bob', mode: 'insensitive' } }
                  ]
              },
              {
                OR: [
                    { firstName: { startsWith: 'NewPort', mode: 'insensitive' } },
                    { lastName: { startsWith: 'NewPort', mode: 'insensitive' } }
                  ]
              },
            ]
          }
        });    
    });

    test("formatDate", () => {

        const result = formatDate(new Date("1990-10-5"));
        
        expect(result).toEqual("10/05/1990");    
    });

    test("validateQueryOrBody return invalid parameters", () => {
        let req = httpMock.createRequest({
            url: `/api/test?providerId=value`
        });
        const res = httpMock.createResponse({});

        const result = validateQueryOrBody(['providerId', 'caseId'], req, res);
        
        expect(result).toEqual(res.status(400).json({ message: 'The following required parameters are missing:' }));    
    });

    test("validateQueryOrBody return nothing wrong", () => {
        let req = httpMock.createRequest({
            url: `/api/test?providerId=value`
        });
        const res = httpMock.createResponse({});

        const result = validateQueryOrBody(['providerId'], req, res);
        
        expect(result).toEqual(null);    
    });

    test("createValidationObject function", async () => {
        let schema = createValidationObject(mockBookingSheetConfig)

        await expect(schema.validateAt('patient.firstName', mockSingleCase)).resolves.toBeTruthy();
        await expect(schema.validateAt('patient.firstName', {})).resolves.toBeFalsy();
    });

    test("isFieldVisible function", async () => {
        let firstNameVisible = isFieldVisible(mockBookingSheetConfig, 'patient.firstName');
        expect(firstNameVisible).toEqual(true);

        let firstNameNotVisible = isFieldVisible({patient: {firstName: {visible: false}}}, 'patient.firstName');
        expect(firstNameNotVisible).toEqual(false);

        let insuranceNotVisible = isFieldVisible({financial: [{insurance: {visible: false}}]}, 'financial.0.insurance');
        expect(insuranceNotVisible).toEqual(false);
    });

    test("checkFieldForErrors function", async () => {
        let firstNameNoError = checkFieldForErrors('patient.firstName', {});
        expect(firstNameNoError).toEqual(false);

        let firstNameError = checkFieldForErrors('patient.firstName', {patient: {firstName: true}});
        expect(firstNameError).toEqual(true);

        let insuranceNoError = checkFieldForErrors('financial.0.insurance', {});
        expect(insuranceNoError).toEqual(false);

        let insuranceError = checkFieldForErrors('financial.0.insurance', {financial: [{insurance: true}]});
        expect(insuranceError).toEqual(true);
    });

    test("findRequiredBookingSheetFieldsToDelete function", async () => {
        let fieldsToDelete = findRequiredBookingSheetFieldsToDelete(mockBookingSheetConfig);
        expect(fieldsToDelete).toEqual([ 'patient.AND.0.middleName', "patient.AND.0.phone.none.hasVoicemail", 'patient.AND.0.firstName', 'patient.AND.0.dateOfBirth']);

    });

    test("createBookingSheetRequiredFields function", async () => {
        let bookingSheetRequiredFields = createBookingSheetRequiredFields(mockBookingSheetConfig);
        
        expect(bookingSheetRequiredFields).toEqual({
            patient: defaultPatientTabFilter,
            procedureTab: defaultProcedureTabFilter,
            clinical: defaultClinicalFilter,
            financial: defaultFinancialFilter,
            scheduling: defaultSchedulingFilter
        });
    });

    test("deleteFromObject function", async () => {
        let modifiedObject = deleteFromObject({patient: {firstName: ''}}, 'patient.firstName');
        
        expect(modifiedObject).toEqual({patient: {}});
    });
    test("formObjectToPrismaQuery function", async () => {
        const sampleForm = mockSingleScheduling;
        const sampleOutput = {"update": {"admissionTypeId": 1, "locationId": 1, "procedureDate": moment('2022-10-10').toDate(), "procedureUnitId": 1, "providerId": 1, "schedulingId": 1, "serviceLineId": 1}}
        expect(formObjectToPrismaQuery(sampleForm)).toEqual(sampleOutput)
    });

    test("procedureTabToPrismaQuery function", async () => {
        const sampleForm = {
            mockSingleProcedure, 
            anesthesia: [
                {anesthesiaId: 62, anesthesiaName: 'General and Regional'},
                {anesthesiaId: 65, anesthesiaName: 'Spinal'}
            ]
        };

        const sampleUpdates = {
            admissionTypeId: 2,
            anesthesia: [undefined, undefined, {anesthesiaId: 62}]
        }
        const sampleOutput = {
            update: {
                "admissionTypeId": 2,
                "anesthesia": {
                    "connect": [
                        { "anesthesiaId": 62, }, { "anesthesiaId": 65, }, 
                    ], 
                    "set": []
                }
            }
        }
        expect(procedureTabToPrismaQuery(sampleUpdates, sampleForm)).toEqual(sampleOutput)
    });

    test("clinicalTabToPrismaQuery function", async () => {
        const sampleClinicalUpdates = {
            "physicianFirstName":"roger",
            "physicianLastName":"newcare",
            "physicianPhone":"122112232",
            "preOpForm":{
                "facility":{
                    "facilityName":"Name",
                    "phone":"122321123",
                    "addressOne":"Address",
                    "addressTwo":"Address 2",
                    "city":"New York",
                    "state":"NY",
                    "zip":"12211"
                }
            }
        }
        const sampleFormData = {
            "clinicalId":257,
            "physicianFirstName":"roger",
            "physicianLastName":"newcare",
            "physicianPhone":"122112232",
            "preOpRequired":"true",
            "diagnosticTestsRequired":"false",
            "clearanceRequired":"false",
            "postOpDateTime":null,
            "preOpFormId":307,
            "preOpForm":{
                "preOpFormId":307,
                "clinicalId":null,
                "preOpDateTime":null,
                "atProcedureLocation":false,
                "facilityId":89,
                "facility":{"facilityId":89,"facilityName":"Name","phone":"122321123","addressOne":"Address","addressTwo":"Address 2","city":"New York","state":"NY","zip":"12211"}
            }
        }
        const expectedQuery = {
            "update":{
                "physicianFirstName":"roger",
                "physicianLastName":"newcare",
                "physicianPhone":"122112232",
                "preOpForm":{
                    "update":{
                        "facility":{
                            "update":{
                                "facilityName":"Name",
                                "phone":"122321123",
                                "addressOne":"Address",
                                "addressTwo":"Address 2",
                                "city":"New York",
                                "state":"NY",
                                "zip":"12211"
                            }
                        }
                    }
                },
                "diagnosticTests":{"deleteMany":{}},
                "clearances":{"deleteMany":{}}
            }}
        expect(clinicalTabToPrismaQuery(sampleClinicalUpdates, sampleFormData)).toEqual(expectedQuery)
    });

    test("getClinicalQuery function full update", async () => {
        const sampleClinicalUpdates = {
            clearanceRequired: "false",
            diagnosticTestsRequired: "true",
            physicianFirstName: 'NewP', 
            physicianLastName: 'NewP Last', 
            physicianPhone: '5555555555', 
            diagnosticTests: [
                {
                    diagnosticTest: {
                        diagnosticTestId: 216, 
                        testName: "Other"
                    }, 
                    facility: {
                        facilityName: "Facility 3"
                    }, 
                    testNameOther: "OtherTest",
                    atProcedureLocation: false
                },
            ], 
            preOpForm: {facility: {facilityName: "Facility 1", zip: "12212"}}
        }

        const sampleFormData = sampleClinicalUpdates;

        const expectedQuery = {
            update: {
                clearanceRequired: "false",
                clearances: {deleteMany: {}},
                diagnosticTestsRequired: "true",
                diagnosticTests: {
                    deleteMany: {}, 
                    create: [
                        {
                            atProcedureLocation: false,
                            diagnosticTest: {connect: {diagnosticTestId: 216}},
                            facility: {create: {
                                facilityName: "Facility 3",
                            }},
                            testNameOther: "OtherTest",
                        }
                    ]
                },
                physicianFirstName: "NewP",
                physicianLastName: "NewP Last",
                physicianPhone: "5555555555",
                preOpForm: {create: { facility: { create: {facilityName: "Facility 1", zip: "12212"}}}}
            }
        }
        expect(clinicalTabToPrismaQuery(sampleClinicalUpdates, sampleFormData)).toEqual(expectedQuery)
    })

    test("clinicalTabToPrismaQuery function preOpForm, diagnosticTest, and clearance all not required", async () => {
        const sampleClinicalUpdates = {"physicianFirstName":"NewCareFirst","physicianLastName":"NewCareLast","physicianPhone":"1234567890","preOpRequired":"false","diagnosticTestsRequired":"false","clearanceRequired":"false","postOpDateTime":"2023-04-28T04:21:00-04:00"}
        const sampleFormData = {"clinicalId":304,"physicianFirstName":"NewCareFirst","physicianLastName":"NewCareLast","physicianPhone":"1234567890","preOpRequired":"false","diagnosticTestsRequired":"false","clearanceRequired":"false","postOpDateTime":"2023-04-28T08:21:00.000Z","preOpFormId":null,"diagnosticTests":[{"diagnosticTest":null,"testNameOther":"","testDateTime":null,"atProcedureLocation":null,"facility":{"facilityName":"","phone":"","addressOne":"","addressTwo":"","city":"","state":"","zip":""}}],"clearances":[{"clearanceName":null,"clearanceNameOther":"","clearanceDateTime":null,"physicianFirstName":"","physicianLastName":"","physicianPhone":"","atProcedureLocation":null,"facility":{"facilityName":"","phone":"","addressOne":"","addressTwo":"","city":"","state":"","zip":""}}],"preOpForm":null}
        const expectedQuery = {"update":{"physicianFirstName":"NewCareFirst","physicianLastName":"NewCareLast","physicianPhone":"1234567890","preOpRequired":"false","diagnosticTestsRequired":"false","clearanceRequired":"false","postOpDateTime":"2023-04-28T04:21:00-04:00","diagnosticTests":{"deleteMany":{}},"clearances":{"deleteMany":{}}}}
        expect(clinicalTabToPrismaQuery(sampleClinicalUpdates, sampleFormData)).toEqual(expectedQuery)
    })

    test("formatCreateCaseParams function", async () => {
    });

    test("getDifference function", async () => {
        const sampleOld = {locationId: 1, procedureId: 1, anesthesia: [{anesthesiaId: 1},{anesthesiaId: 2},{anesthesiaId: 3}]};
        const sampleNew = {locationId: 1, procedureId: 2, anesthesia: [{anesthesiaId: 1},{anesthesiaId: 2}]};
        const expected = {procedureId: 2, anesthesia: [undefined, undefined, {anesthesiaId: 3}]};
        expect(getDifference(sampleOld, sampleNew)).toEqual(expected)
    });

    test("getDifference function with objects in array", async () => {
        const sampleOld = {anesthesia: [{anesthesiaId: 3, testId: 4}]};
        const sampleNew = {anesthesia: [{anesthesiaId: 5, testId: 4}]};
        const expected = {anesthesia: [{anesthesiaId: 5}]};
        expect(getDifference(sampleOld, sampleNew)).toEqual(expected)
    });

    test("excludeField function", ()=>{
        expect(excludeField({caseId: "123", cases: {}}, "caseId")).toEqual({cases: {}})
    })

    test("isTabComplete function", async () => {
        const patientForm = {
            firstName: "Me", 
            middleName: "B", 
            lastName: "you", 
            dateOfBirth: moment('10/10/2022', 'MM/DD/YYYY'),
            sex: {sex: "M"},
            address: "Some Address",
            city: "NY",
            state: {state: "NY"},
            zip: "10000"
        };
        expect(isTabComplete(patientForm, mockBookingSheetConfig.patient)).toEqual(true)
    });

    test("isTabComplete function with array", async () => {
        const insuranceForm = [{
            insurance: {"name": "ins"},
            insuranceGroupName: {"gname": "name"},
            insuranceGroupNumber: {"num": "num"},
            priorAuthorization: { "priorAuth": true},
            priorAuthId: "123",
            priorAuthDate: moment('10/10/2022', 'MM/DD/YYYY'),
        }];
        expect(isTabComplete(insuranceForm, mockBookingSheetConfig.financial)).toEqual(true)
    });

    test("isTabComplete function incomplete tab", async () => {
        const patientForm = {
            firstName: "Me", 
            middleName: "B", 
            lastName: "",
            dateOfBirth: moment('10/10/2022', 'MM/DD/YYYY'),
            sex: {sex: "M"},
            address: "Some Address",
            city: "NY",
            state: {state: "NY"},
            zip: "10000"
        };
        expect(isTabComplete(patientForm, mockBookingSheetConfig.patient)).toEqual(false)
    });

    test("isTabComplete function incomplete array tab", async () => {
        const insuranceForm = [{
            insurance: {"name": "ins"},
            insuranceGroupName: null,
            insuranceGroupNumber: {"num": "num"},
            priorAuthorization: { "priorAuth": true},
            priorAuthId: "123",
            priorAuthDate: moment('10/10/2022', 'MM/DD/YYYY'),
        }];
        expect(isTabComplete(insuranceForm, mockBookingSheetConfig.financial)).toEqual(false)
    });
});
