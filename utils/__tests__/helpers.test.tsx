import type { NextApiResponse } from 'next'
import { formatDashboardQueryParams, formatDate, APIErrorHandler } from "../helpers";
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

    test("APIErrorHandler 404", () => {
        const res = httpMock.createResponse({});

        const result = APIErrorHandler('not found', res);
        
        expect(result).toEqual(res.status(404).json({ message: 'not found' }));    
    });

    test("APIErrorHandler 400", () => {
        const res = httpMock.createResponse({});

        const result = APIErrorHandler({message: 'got invalid value argument providerId:'}, res);
        
        expect(result).toEqual(res.status(400).json({ message: 'got invalid value' }));    
    });

    test("APIErrorHandler 500", () => {
        const res = httpMock.createResponse({});

        const result = APIErrorHandler({ message: 'weird message'}, res);
        
        expect(result).toEqual(res.status(500).json({ message: 'weird message' }));    
    });
});
