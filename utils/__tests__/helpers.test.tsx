import moment from "moment";
import type { NextApiResponse } from 'next'
import { checkFieldForErrors, createValidationObject, formatDashboardQueryParams, formatDate, isFieldVisible, validateQueryOrBody } from "../helpers";
import httpMock from 'node-mocks-http';
import { mockBookingSheetConfig, mockSingleCase } from "../../testReference";

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
});
