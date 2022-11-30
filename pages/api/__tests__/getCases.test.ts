/**
 * @jest-environment node
 */
 import httpMock from 'node-mocks-http';
 import type { NextApiRequest } from 'next';
 import { prismaMock } from '../../../prisma/singleton'
 import getCasesHandler from '../getCases'

 jest.mock('@auth0/nextjs-auth0', () => ({
        withApiAuthRequired: jest.fn((args) => args),
        getSession: jest.fn()
    }));

 describe("getCases API", () => {
    const urlParams = new URLSearchParams({
        dateRangeStart: new Date("2022-10-13T14:04:06.000Z").toUTCString(), 
        dateRangeEnd : new Date("2022-10-31T23:59:59.000Z").toUTCString(),
        orderBy: "asc",
        searchValue: "searchValue",
        page: '1'
    });

    let req: NextApiRequest = httpMock.createRequest({
        url: `/api/getCases?${urlParams.toString()}`
    });
    let res: any = httpMock.createResponse({});

    test('should get cases', async () => {
        let cases = [{
            caseId: 1,
            fhirResourceId: "testId",
            patientId: 1,
            procedureDate: new Date(),
            providerName: "testProviderName",
            locationName: "testLocationName",
            createTime: new Date(),
            updateTime: new Date(),
            priorAuthorization: "incomplete",
            vendorConfirmation: "incomplete",
        }]

        const params = {
            where: {
                procedureDate: {
                    // eventually this should take in a date range parameter from client instead
                    gte: new Date("2022-10-13T14:04:06.000Z"),
                    lte: new Date("2022-10-31T23:59:59.000Z")
                },
                patients: {
                    OR: [
                        {
                            firstName: {
                                startsWith: "searchValue",
                                mode: 'insensitive'
                            },
                        },
                        {
                            lastName: {
                                startsWith: "searchValue",
                                mode: 'insensitive'
                            },
                        },
                    ]
              }
            },
            take: 50,
            skip: 0,
            orderBy: [
                {
                    procedureDate: "asc"
                }
            ],
            include: {
                patients: true
            }
        }

        prismaMock.cases.findMany.mockResolvedValue(cases)
        prismaMock.cases.count.mockResolvedValue(1)

        await getCasesHandler(req, res)
        const data = res._getJSONData()
        expect(data.cases[0].caseId).toEqual(1)
        expect(data.cases[0].patientId).toEqual(1)
        expect(data.cases[0].providerName).toEqual("testProviderName")
        expect(data.count).toEqual(1)
        expect(prismaMock.cases.findMany).toBeCalledTimes(1)
        expect(prismaMock.cases.findMany).toBeCalledWith(params)
    })
});
