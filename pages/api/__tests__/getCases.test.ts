/**
 * @jest-environment node
 */
 import httpMock, { createMocks, RequestMethod } from 'node-mocks-http';
 import type { NextApiRequest, NextApiResponse } from 'next';
 import { prismaMock } from '../../../prisma/singleton'
 import getCasesHandler from '../getCases'


 test('should get cases', async () => {
  let req: NextApiRequest = httpMock.createRequest({});
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

    prismaMock.cases.findMany.mockResolvedValue(cases)
    
    await getCasesHandler(req, res)
    const data = res._getJSONData()
    expect(data[0].caseId).toEqual(1)
    expect(data[0].patientId).toEqual(1)
    expect(data[0].providerName).toEqual("testProviderName")
  })