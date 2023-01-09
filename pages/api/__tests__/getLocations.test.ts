/**
 * @jest-environment node
 */
 import httpMock from 'node-mocks-http';
 import { prismaMock } from '../../../prisma/singleton'
 import getLocationOptionsHandler from '../getLocations';

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

    test('should get locations', async () => {
        const req = httpMock.createRequest({
            url: `/api/getLocations`
        });

        const res = httpMock.createResponse({});

        prismaMock.locations.findMany.mockResolvedValueOnce(locations)

        await getLocationOptionsHandler(req, res)
        const data = res._getJSONData();
        expect(data[0].locationId).toEqual(1)
        expect(data[0].locationName).toEqual('locationName')
        expect(data[0].procedureUnits).toEqual(['first'])
        expect(prismaMock.locations.findMany).toBeCalledTimes(1);
    })
});
