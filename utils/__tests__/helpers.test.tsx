import { formatDashboardQueryParams, formatDate } from "../helpers";
import moment from "moment";

describe("Utils", () => {
    test("formatDashboardQueryParams with case id", async() => {
        const params = {
            searchValue: '1234',
            dateRangeStart: '10/10/2022',
            dateRangeEnd: '11/11/2022',
        };

        const result = formatDashboardQueryParams(params);
        
        expect(result).toEqual({
            procedureDate: {
                gte: moment('10/10/2022').startOf("day").toDate(),
                lte: moment('11/11/2022').endOf("day").toDate()
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
            dateRangeEnd: '11/11/2022',
        };

        const result = formatDashboardQueryParams(params);

        expect(result).toEqual( {
            procedureDate: {
                gte: moment('10/10/2022').startOf("day").toDate(),
                lte: moment('11/11/2022').endOf("day").toDate()
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
            dateRangeEnd: '11/11/2022',
        };

        const result = formatDashboardQueryParams(params);
        
        expect(result).toEqual({
            procedureDate: {
                gte: moment('10/10/2022').startOf("day").toDate(),
                lte: moment('11/11/2022').endOf("day").toDate()
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
});
