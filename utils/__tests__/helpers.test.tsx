import moment from "moment";
import type { NextApiResponse } from 'next'
import { formatDashboardQueryParams, formatDate, validateParameters } from "../helpers";
import httpMock from 'node-mocks-http';

describe("Utils", () => {
    test("formatDashboardQueryParams with case id", async() => {
        const params = {
            searchValue: '1234',
            dateRangeStart: '2022-10-10',
            dateRangeEnd: '2022-11-11',
        };

        const result = formatDashboardQueryParams(params);
        
        expect(result).toEqual({
            procedureDate: {
                gte: moment('10/10/2022', 'MM/DD/YYYY').startOf("day").toDate(),
                lte: moment('11/11/2022', 'MM/DD/YYYY').endOf("day").toDate()
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
            procedureDate: {
                gte: moment('10/10/2022', 'MM/DD/YYYY').startOf("day").toDate(),
                lte: moment('11/11/2022', 'MM/DD/YYYY').endOf("day").toDate()
            },
            patients: {
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
            procedureDate: {
                gte: moment('10/10/2022', 'MM/DD/YYYY').startOf("day").toDate(),
                lte: moment('11/11/2022', 'MM/DD/YYYY').endOf("day").toDate()
            },
            patients: {
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

    test("validateParameters return invalid parameters", () => {
        const res = httpMock.createResponse({});

        const result = validateParameters(['providerId', 'caseId'], {'providerId': 'value', 'key2': 'value2'}, res);
        
        expect(result).toEqual(res.status(400).json({ message: 'The following required parameters are missing:' }));    
    });

    test("validateParameters return nothing wrong", () => {
        const res = httpMock.createResponse({});

        const result = validateParameters(['providerId', 'caseId'], {'providerId': 'value', 'caseId': 'value2'}, res);
        
        expect(result).toEqual(null);    
    });
});
