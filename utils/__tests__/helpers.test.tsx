import { formatDashboardQueryParams } from "../helpers";

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
});
