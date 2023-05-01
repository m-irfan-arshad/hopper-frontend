/**
 * @jest-environment node
 */
 import httpMock, { MockResponse } from 'node-mocks-http';
 import type { NextApiRequest, NextApiResponse } from 'next';
 import { prismaMock } from '../../../prisma/singleton'
 import getCasesHandler from '../getCases.page'
 import moment from 'moment'
 import {mockCaseData, mockBookingSheetConfig} from "../../../testReference";
 import {defaultClinicalFilter, defaultFinancialFilter, defaultPatientTabFilter, defaultProcedureTabFilter, defaultSchedulingFilter, FullCase} from "../../../reference";

 jest.mock('@auth0/nextjs-auth0', () => ({
        withApiAuthRequired: jest.fn((args) => args),
        getSession: jest.fn()
    }));


var buf = Buffer.from(JSON.stringify(mockBookingSheetConfig));

jest.mock('@google-cloud/storage', () => {
    return {
        Storage: jest.fn().mockImplementation(() => ({
            bucket: () => ({
                file: () => ({
                    download: jest.fn().mockResolvedValue(buf)
                })
            })
        })
    )}
})

 describe("getCases API", () => {
    test('should get cases', async () => {
        const urlParams = new URLSearchParams({
            dateRangeStart: new Date("2022-10-13T14:04:06.000Z").toUTCString(), 
            dateRangeEnd : new Date("2022-10-31T23:59:59.000Z").toUTCString(),
            searchValue: "searchValue",
            page: '1',
        });
    
        const req: NextApiRequest = httpMock.createRequest({
            url: `/api/getCases?${urlParams.toString()}`
        });
        const res: MockResponse<NextApiResponse> = httpMock.createResponse({});
        const cases = mockCaseData;

        const params = {
            where: {
                scheduling: {
                    AND: [
                        {},
                        {
                            procedureDate: {
                                // eventually this should take in a date range parameter from client instead
                                gte: moment('10/13/2022', 'MM/DD/YYYY').startOf("day").toDate(),
                                lte: moment('10/31/2022', 'MM/DD/YYYY').endOf("day").toDate()
                            },
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
                    ]
              }
            },
            take: 50,
            skip: 0,
            orderBy: [
                {
                    scheduling: {
                        procedureDate: "asc"
                    }
                }
            ],
            include: { 
                patient: true,
                scheduling: { include: {provider: true, location: true} }, 
                financial: true
              }
        }

        prismaMock.cases.findMany.mockResolvedValueOnce(cases as FullCase[])
        prismaMock.cases.count.mockResolvedValueOnce(1)

        await getCasesHandler(req, res)
        const data = res._getJSONData()
        expect(data.cases[0].caseId).toEqual(1)
        expect(data.cases[0].patientId).toEqual(1)
        expect(data.cases[0].scheduling.provider.firstName).toEqual("Robert")
        expect(data.count).toEqual(1)
        expect(prismaMock.cases.findMany).toBeCalledTimes(1)
        expect(prismaMock.cases.findMany).toBeCalledWith(params)
    })

    test('should get cases with work queue as booking sheet', async () => {
        const urlParams = new URLSearchParams({
            dateRangeStart: new Date("2022-10-13T14:04:06.000Z").toUTCString(), 
            dateRangeEnd : new Date("2022-10-31T23:59:59.000Z").toUTCString(),
            searchValue: "searchValue",
            page: '1',
            workQueue: 'Booking Sheet Request'
        });
    
        const req: NextApiRequest = httpMock.createRequest({
            url: `/api/getCases?${urlParams.toString()}`
        });
        const res: MockResponse<NextApiResponse> = httpMock.createResponse({});
        const cases = mockCaseData;

        const params = {
            where: {
                clinical: defaultClinicalFilter,
                financial: defaultFinancialFilter,
                procedureTab: defaultProcedureTabFilter,
                scheduling: {
                    AND: [
                        defaultSchedulingFilter,
                        {
                            procedureDate: {
                                // eventually this should take in a date range parameter from client instead
                                gte: moment('10/13/2022', 'MM/DD/YYYY').startOf("day").toDate(),
                                lte: moment('10/31/2022', 'MM/DD/YYYY').endOf("day").toDate()
                            },
                        }
                    ]
                },
                patient: {
                    AND: [
                        defaultPatientTabFilter,
                        {
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
                    ]
              }
            },
            take: 50,
            skip: 0,
            orderBy: [
                {
                    scheduling: {
                        procedureDate: "asc"
                    }
                }
            ],
            include: { 
                patient: true,
                scheduling: { include: {provider: true, location: true} }, 
                financial: true
              }
        }

        prismaMock.cases.findMany.mockResolvedValueOnce(cases as FullCase[])
        prismaMock.cases.count.mockResolvedValueOnce(1)

        await getCasesHandler(req, res)
        const data = res._getJSONData()
        expect(data.cases[0].caseId).toEqual(1)
        expect(data.cases[0].patientId).toEqual(1)
        expect(data.cases[0].scheduling.provider.firstName).toEqual("Robert")
        expect(data.count).toEqual(1)
        expect(prismaMock.cases.findMany).toBeCalledTimes(1)
        expect(prismaMock.cases.findMany).toBeCalledWith(params)
    })

    test('should error out', async () => {
        const req = httpMock.createRequest({
            url: "/api/getCases"
        });
        const res = httpMock.createResponse({});

        await getCasesHandler(req, res)
        const data = res._getJSONData();
        expect(data.message).toEqual('The following required parameters are missing: dateRangeStart dateRangeEnd page')
    })
});
