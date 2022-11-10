/**
 * @jest-environment node
 */
 import httpMock from 'node-mocks-http';
 import type { NextApiRequest } from 'next';
 import { prismaMock } from '../../../prisma/singleton'
 import getLocationOptionsHandler from '../getLocationOptions';

 describe("getProviderOptions API", () => {
    let req: NextApiRequest = httpMock.createRequest({
        url: `/api/getProviderOptions`
    });
    let res: any = httpMock.createResponse({});

    test('should get providers', async () => {
        let locations = [{
            locationId: 1,
            fhirResourceId: 'fhirResourceId',
            locationName: 'locationName',
            providerIds: [1,2,3],
            createTime: new Date(),
            updateTime: new Date()
        }]

        prismaMock.locations.findMany.mockResolvedValue(locations)

        await getLocationOptionsHandler(req, res)
        const data = res._getJSONData()
        expect(data[0].locationId).toEqual(1)
        expect(data[0].locationName).toEqual('locationName')
        expect(data[0].providerIds).toEqual([1,2,3])
        expect(prismaMock.locations.findMany).toBeCalledTimes(1)
    })
});
