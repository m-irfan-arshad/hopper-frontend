/**
 * @jest-environment node
 */
 import httpMock from 'node-mocks-http';
 import type { NextApiRequest } from 'next';
 import { prismaMock } from '../../../prisma/singleton'
 import getCasesHandler from '../getCases'
 import moment from 'moment'

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
        page: '1',
        vendorConfirmation: "Incomplete",
        priorAuthorization: "Incomplete"
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
            priorAuthorization: "Incomplete",
            vendorConfirmation: "Incomplete",
            createTime: new Date(),
            updateTime: new Date(),
        }]

        const params = {
            where: {
                procedureDate: {
                    // eventually this should take in a date range parameter from client instead
                    gte: moment('10/13/2022', 'MM/DD/YYYY').startOf("day").toDate(),
                    lte: moment('10/31/2022', 'MM/DD/YYYY').endOf("day").toDate()
                },
                priorAuthorization: {
                    equals: 'Incomplete'
                },
                vendorConfirmation: {
                    equals: 'Incomplete'
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

        prismaMock.cases.findMany.mockResolvedValueOnce(cases)
        prismaMock.cases.count.mockResolvedValueOnce(1)

        await getCasesHandler(req, res)
        const data = res._getJSONData()
        expect(data.cases[0].caseId).toEqual(1)
        expect(data.cases[0].patientId).toEqual(1)
        expect(data.cases[0].providerName).toEqual("testProviderName")
        expect(data.count).toEqual(1)
        expect(prismaMock.cases.findMany).toBeCalledTimes(1)
        expect(prismaMock.cases.findMany).toBeCalledWith(params)
    })

    test('should error out', async () => {
        req = httpMock.createRequest({
            url: "/api/getCases"
        });
        res = httpMock.createResponse({});

        await getCasesHandler(req, res)
        const data = res._getJSONData();
        expect(data.message).toEqual('The following required parameters are missing: dateRangeStart dateRangeEnd page orderBy')
    })
});
