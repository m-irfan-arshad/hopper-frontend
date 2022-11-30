import type { NextApiResponse } from 'next'
import { formatDashboardQueryParams, formatDate, validateParameters } from "../helpers";
import httpMock from 'node-mocks-http';

describe("Utils", () => {
    test("formatDashboardQueryParams with case id", async() => {
        const params = {
            searchValue: '1234',
            dateRangeStart: '10/10/2022',
            dateRangeEnd: '11/11/2022'
        };

        const result = formatDashboardQueryParams(params);
        
        expect(result).toEqual({
            procedureDate: {
                gte: new Date('10/10/2022'),
                lte: new Date('11/11/2022')
            },
            caseId: {
                equals: parseInt('1234')
            }
          });    
    });

    test("formatDashboardQueryParams with one name", async() => {
        const params = {
            searchValue: 'Bob',
            dateRangeStart: '10/10/2022',
            dateRangeEnd: '11/11/2022'
        };

        const result = formatDashboardQueryParams(params);

        expect(result).toEqual( {
            procedureDate: {
                gte: new Date('10/10/2022'),
                lte: new Date('11/11/2022')
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
            dateRangeStart: '10/10/2022',
            dateRangeEnd: '11/11/2022'
        };

        const result = formatDashboardQueryParams(params);
        
        expect(result).toEqual({
            procedureDate: {
                gte: new Date('10/10/2022'),
                lte: new Date('11/11/2022')
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
