/**
 * @jest-environment node
 */
 import httpMock, { createMocks, RequestMethod } from 'node-mocks-http';
 import type { NextApiRequest, NextApiResponse } from 'next';
 import { prismaMock } from '../../../prisma/singleton'
 import getCasesHandler from '../getCases'


 test('should get cases', async () => {
  let req: NextApiRequest = httpMock.createRequest({url: "https://hopper-frontend/api/getCases?dateRangeStart=Thu+Oct+13+2022+14%3A04%3A06+GMT%2B0000&dateRangeEnd=Mon+Oct+31+2022+23%3A59%3A59+GMT%2B0000&orderBy=asc"});
  let res: any = httpMock.createResponse({});

    let cases = [{
        caseId: 1,
        fhirResourceId: "testId",
        patientId: 1,
        procedureDate: new Date(),
        providerName: "testProviderName",
        locationName: "testLocationName",
        createTime: new Date(),
        updateTime: new Date(),
    }]

    const params = {
      where: {
        procedureDate: {
            // eventually this should take in a date range parameter from client instead
            gte: new Date("2022-10-13T14:04:06.000Z") ,
            lte: new Date("2022-10-31T23:59:59.000Z")
        }
      },
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
    
    await getCasesHandler(req, res)
    const data = res._getJSONData()
    expect(data[0].caseId).toEqual(1)
    expect(data[0].patientId).toEqual(1)
    expect(data[0].providerName).toEqual("testProviderName")
    expect(prismaMock.cases.findMany).toBeCalledTimes(1)
    expect(prismaMock.cases.findMany).toBeCalledWith(params)
  })