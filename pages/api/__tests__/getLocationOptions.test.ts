/**
 * @jest-environment node
 */
 import httpMock from 'node-mocks-http';
 import type { NextApiRequest } from 'next';
 import { prismaMock } from '../../../prisma/singleton'
 import getLocationOptionsHandler from '../getLocationOptions';

 describe("getLocationOptions API", () => {
    let locations = [
        {
            locationId: 1,
            fhirResourceId: 'fhirResourceId',
            locationName: 'locationName',
            providerIds: [1,2,3],
            createTime: new Date(),
            updateTime: new Date()
        },
        {
            locationId: 2,
            fhirResourceId: 'fhirResourceId2',
            locationName: 'locationName2',
            providerIds: [2,3,4],
            createTime: new Date(),
            updateTime: new Date()
        },
        {
            locationId: 3,
            fhirResourceId: 'fhirResourceId3',
            locationName: 'locationName3',
            providerIds: [3,4,5],
            createTime: new Date(),
            updateTime: new Date()
        }
    ];

    test('should get locations', async () => {
        const req: NextApiRequest = httpMock.createRequest({
            url: `/api/getLocationOptions`
        });
        const res: any = httpMock.createResponse({});
    
        prismaMock.locations.findMany.mockResolvedValueOnce(locations)

        await getLocationOptionsHandler(req, res)
        const data = res._getJSONData()
        expect(data[0].locationId).toEqual(1)
        expect(data[0].locationName).toEqual('locationName')
        expect(data[0].providerIds).toEqual([1,2,3])
        expect(prismaMock.locations.findMany).toBeCalledTimes(1)
    })

    test('should get specific locations', async () => {
        const req = httpMock.createRequest({
            url: `/api/getLocationOptions?locationIds=2,3`
        });

        const res = httpMock.createResponse({});

        const params = {
            where: {
                locationId: {
                    in: [2,3]
                }
            }
        };

        prismaMock.locations.findMany.mockResolvedValueOnce([locations[1]])

        await getLocationOptionsHandler(req, res)
        const data = res._getJSONData();
        expect(data[0].locationId).toEqual(2)
        expect(data[0].locationName).toEqual('locationName2')
        expect(data[0].providerIds).toEqual([2,3,4])
        expect(prismaMock.locations.findMany).toBeCalledTimes(1);
        expect(prismaMock.locations.findMany).toBeCalledWith(params);

    })
});
