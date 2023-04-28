import moment from "moment";
import type { NextApiResponse } from 'next'
import { checkFieldForErrors, createValidationObject, excludeField, formatDashboardQueryParams, formatDate, formObjectToPrismaQuery, clinicalTabToPrismaQuery, getDifference, procedureTabToPrismaQuery, isFieldVisible, validateQueryOrBody } from "../helpers";
import httpMock from 'node-mocks-http';
import { mockBookingSheetConfig, mockSingleCase, mockSingleClearance, mockSingleProcedure, mockSingleScheduling } from "../../testReference";
import * as R from "ramda";

describe("Utils", () => {
    test("formatDashboardQueryParams with case id", async() => {
        const params = {
            searchValue: '1234',
            dateRangeStart: '2022-10-10',
            dateRangeEnd: '2022-11-11',
        };

        const result = formatDashboardQueryParams(params);
        
        expect(result).toEqual({
            scheduling: {
                procedureDate: {
                    gte: moment('10/10/2022', 'MM/DD/YYYY').startOf("day").toDate(),
                    lte: moment('11/11/2022', 'MM/DD/YYYY').endOf("day").toDate()
                },
            },
            caseId: {
                equals: parseInt('1234')
            }
          });    
    });

    test("formatDashboardQueryParams with one name", async() => {
        const params = {
            searchValue: 'Bob',
            dateRangeStart: '2022-10-10',
            dateRangeEnd: '2022-11-11',
        };

        const result = formatDashboardQueryParams(params);

        expect(result).toEqual( {
            scheduling: {
                procedureDate: {
                    gte: moment('10/10/2022', 'MM/DD/YYYY').startOf("day").toDate(),
                    lte: moment('11/11/2022', 'MM/DD/YYYY').endOf("day").toDate()
                }
            },
            patient: {
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
        }
        );    
    });

    test("formatDashboardQueryParams with two names", async() => {
        const params = {
            searchValue: 'Bob NewPort',
            dateRangeStart: '2022-10-10',
            dateRangeEnd: '2022-11-11',
        };

        const result = formatDashboardQueryParams(params);
        
        expect(result).toEqual({
            scheduling: {
                procedureDate: {
                    gte: moment('10/10/2022', 'MM/DD/YYYY').startOf("day").toDate(),
                    lte: moment('11/11/2022', 'MM/DD/YYYY').endOf("day").toDate()
                }
            },
            patient: {
            AND: [
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
                "diagnosticTests":{"set":[]},
                "clearances":{"set":[]}
            }}
        expect(clinicalTabToPrismaQuery(sampleClinicalUpdates, sampleFormData)).toEqual(expectedQuery)
    });

    test("clinicalTabToPrismaQuery function preOpForm, diagnosticTest, and clearance all not required", async () => {
        const sampleClinicalUpdates = {"physicianFirstName":"NewCareFirst","physicianLastName":"NewCareLast","physicianPhone":"1234567890","preOpRequired":"false","diagnosticTestsRequired":"false","clearanceRequired":"false","postOpDateTime":"2023-04-28T04:21:00-04:00"}
        const sampleFormData = {"clinicalId":304,"physicianFirstName":"NewCareFirst","physicianLastName":"NewCareLast","physicianPhone":"1234567890","preOpRequired":"false","diagnosticTestsRequired":"false","clearanceRequired":"false","postOpDateTime":"2023-04-28T08:21:00.000Z","preOpFormId":null,"diagnosticTests":[{"diagnosticTest":null,"testNameOther":"","testDateTime":null,"atProcedureLocation":null,"facility":{"facilityName":"","phone":"","addressOne":"","addressTwo":"","city":"","state":"","zip":""}}],"clearances":[{"clearanceName":null,"clearanceNameOther":"","clearanceDateTime":null,"physicianFirstName":"","physicianLastName":"","physicianPhone":"","atProcedureLocation":null,"facility":{"facilityName":"","phone":"","addressOne":"","addressTwo":"","city":"","state":"","zip":""}}],"preOpForm":null}
        const expectedQuery = {"update":{"physicianFirstName":"NewCareFirst","physicianLastName":"NewCareLast","physicianPhone":"1234567890","preOpRequired":"false","diagnosticTestsRequired":"false","clearanceRequired":"false","postOpDateTime":"2023-04-28T04:21:00-04:00","diagnosticTests":{"set":[]},"clearances":{"set":[]}}}
        expect(clinicalTabToPrismaQuery(sampleClinicalUpdates, sampleFormData)).toEqual(expectedQuery)
    })

    test("clinicalTabToPrismaQuery function full update", async () => {
        const sampleClinicalUpdates = {"preOpRequired":"true","clearanceRequired":"true","diagnosticTests":[{"facility":{"phone":"Phone","addressOne":"Ad","addressTwo":"sdsdcd","city":"saxawa","state":"asxs","zip":"saefe"},"diagnosticTest":{"diagnosticTestId":219,"testName":"Chem 12"}},{"diagnosticTest":{"diagnosticTestId":224,"testName":"Complete Blood Count (CBC) With Differential"},"testNameOther":"","testDateTime":"2023-04-14T01:05:00-04:00","atProcedureLocation":true,"facility":{"facilityName":"","phone":"","addressOne":"","addressTwo":"","city":"","state":"","zip":""}}],"clearances":[{"physicianFirstName":"P First","physicianLastName":"P last","physicianPhone":"P phone","facility":{"facilityName":"F name","phone":"F phone","addressOne":"F ad","addressTwo":"F ad 2","city":"NY","state":"NY","zip":"12345"},"clearanceDateTime":"2023-04-15T00:01:00-04:00","clearance":{"clearanceId":57,"clearanceName":"Medical"}}],"preOpForm":{"facility":{"facilityName":"F 1","phone":"F 2","addressOne":"F 3","addressTwo":"F 4","city":"F 5","state":"F 6"}}}
        const sampleFormData = {"clinicalId":304,"physicianFirstName":"NewCareFirst","physicianLastName":"NewCareLast","physicianPhone":"1234567890","preOpRequired":"true","diagnosticTestsRequired":"true","clearanceRequired":"true","postOpDateTime":"2023-04-28T08:21:00.000Z","preOpFormId":null,"diagnosticTests":[{"diagnosticTestFormId":22,"diagnosticTestId":218,"clinicalId":304,"testNameOther":"","testDateTime":null,"atProcedureLocation":null,"facilityId":91,"facility":{"facilityId":91,"facilityName":"niknk","phone":"Phone","addressOne":"Ad","addressTwo":"sdsdcd","city":"saxawa","state":"asxs","zip":"saefe"},"diagnosticTest":{"diagnosticTestId":219,"testName":"Chem 12"}},{"diagnosticTest":{"diagnosticTestId":224,"testName":"Complete Blood Count (CBC) With Differential"},"testNameOther":"","testDateTime":"2023-04-14T05:05:00.000Z","atProcedureLocation":true,"facility":{"facilityName":"","phone":"","addressOne":"","addressTwo":"","city":"","state":"","zip":""}}],"clearances":[{"clearanceName":null,"clearanceNameOther":"","clearanceDateTime":"2023-04-15T04:01:00.000Z","physicianFirstName":"P First","physicianLastName":"P last","physicianPhone":"P phone","atProcedureLocation":null,"facility":{"facilityName":"F name","phone":"F phone","addressOne":"F ad","addressTwo":"F ad 2","city":"NY","state":"NY","zip":"12345"},"clearance":{"clearanceId":57,"clearanceName":"Medical"}}],"preOpForm":{"preOpDateTime":null,"atProcedureLocation":null,"facility":{"facilityName":"F 1","phone":"F 2","addressOne":"F 3","addressTwo":"F 4","city":"F 5","state":"F 6","zip":null}}}
        const expectedQuery = {"update": {
            "preOpRequired":"true",
            "clearanceRequired":"true",
            "diagnosticTests":{
                "create":[
                    {"diagnosticTest":{"connect":{"diagnosticTestId":224}},"testDateTime":"2023-04-14T05:05:00.000Z","atProcedureLocation":true,"facility":{"create":{}}}
                ],
                "update":[
                    {"data":{"facility":{"update":{"phone":"Phone","addressOne":"Ad","addressTwo":"sdsdcd","city":"saxawa","state":"asxs","zip":"saefe"}},"diagnosticTest":{"connect":{"diagnosticTestId":219}}},"where":{"diagnosticTestFormId":22}}
                ]
            },
            "clearances":{
                "create":[
                    {"physicianFirstName":"P First","physicianLastName":"P last","physicianPhone":"P phone","facility":{"create":{"facilityName":"F name","phone":"F phone","addressOne":"F ad","addressTwo":"F ad 2","city":"NY","state":"NY","zip":"12345"}},"clearanceDateTime":"2023-04-15T04:01:00.000Z","clearance":{"connect":{"clearanceId":57}}}
                ],
                "update":[]
            },
            "preOpForm":{
                "create":{
                    "facility":{"create":{"facilityName":"F 1","phone":"F 2","addressOne":"F 3","addressTwo":"F 4","city":"F 5","state":"F 6"}}
                }
            }
        }}
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
});
