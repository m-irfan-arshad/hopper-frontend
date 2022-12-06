/**
 * @jest-environment node
 */
 import httpMock from 'node-mocks-http';
 import { prismaMock } from '../../../prisma/singleton'
 import getLocationOptionsHandler from '../getLocationOptions';

 jest.mock('@auth0/nextjs-auth0', () => ({
    withApiAuthRequired: jest.fn((args) => args),
    getSession: jest.fn()
}));

 describe("getLocationOptions API", () => {
    let locations = [
        {
            locationId: 1,
            fhirResourceId: 'fhirResourceId',
            locationName: 'locationName',
            procedureUnits: ['first'],
            createTime: new Date(),
            updateTime: new Date()
        },
        {
            locationId: 2,
            fhirResourceId: 'fhirResourceId2',
            locationName: 'locationName2',
            procedureUnits: ['second'],
            createTime: new Date(),
            updateTime: new Date()
        },
        {
            locationId: 3,
            fhirResourceId: 'fhirResourceId3',
            locationName: 'locationName3',
            procedureUnits: ['third'],
            createTime: new Date(),
            updateTime: new Date()
        }
    ];

    let providerLocationRelations = [
        {
            id: 1,
            locationId: 2,
            providerId: 3,
            createTime: new Date(),
            updateTime: new Date()
        }
    ];

    test('should get specific locations', async () => {
        const req = httpMock.createRequest({
            url: `/api/getLocationOptions?providerId=3`
        });

        const res = httpMock.createResponse({});

        const provider_locationParams = {
            where: {
                providerId: {
                    equals: 3
                }
            }
        };

        const locationParams = {
            where: {
                locationId: {
                    in: [2]
                }
            }
        };

        prismaMock.provider_locations.findMany.mockResolvedValueOnce(providerLocationRelations)
        prismaMock.locations.findMany.mockResolvedValueOnce([locations[1]])

        await getLocationOptionsHandler(req, res)
        const data = res._getJSONData();
        expect(data[0].locationId).toEqual(2)
        expect(data[0].locationName).toEqual('locationName2')
        expect(data[0].procedureUnits).toEqual(['second'])
        expect(prismaMock.provider_locations.findMany).toBeCalledTimes(1);
        expect(prismaMock.provider_locations.findMany).toBeCalledWith(provider_locationParams);
        expect(prismaMock.locations.findMany).toBeCalledTimes(1);
        expect(prismaMock.locations.findMany).toBeCalledWith(locationParams);
    })

    test('should return 0 locations', async () => {
        const req = httpMock.createRequest({
            url: `/api/getLocationOptions?providerId=9`
        });

        providerLocationRelations = [
            {
                id: 1,
                locationId: 8,
                providerId: 7,
                createTime: new Date(),
                updateTime: new Date()
            }
        ]

        const res = httpMock.createResponse({});

        const params = {
            where: {
                providerId: {
                    equals: 9
                }
            }
        };

        prismaMock.provider_locations.findMany.mockResolvedValueOnce([])
        prismaMock.locations.findMany.mockResolvedValueOnce([])

        await getLocationOptionsHandler(req, res)
        const data = res._getJSONData();
        expect(data[0]).toBeUndefined();
        expect(prismaMock.provider_locations.findMany).toBeCalledTimes(1);
        expect(prismaMock.provider_locations.findMany).toBeCalledWith(params);
        expect(prismaMock.locations.findMany).toBeCalledTimes(0);
    });

    test('should error out', async () => {
        const req = httpMock.createRequest({
            url: "/api/getLocationOptions"
        });
        const res = httpMock.createResponse({});

        await getLocationOptionsHandler(req, res)
        const data = res._getJSONData()
        expect(data.message).toEqual('The following required parameters are missing: providerId')
    })
});
