/**
 * @jest-environment node
 */
 import httpMock from 'node-mocks-http';
 import type { NextApiRequest } from 'next';
 import { prismaMock } from '../../../prisma/singleton'
 import getProviderOptionsHandler from '../getProviderOptions'

 jest.mock('@auth0/nextjs-auth0', () => ({
    withApiAuthRequired: jest.fn((args) => args),
    getSession: jest.fn()
}));

 describe("getProviderOptions API", () => {
    let req: NextApiRequest = httpMock.createRequest({
        url: `/api/getProviderOptions`
    });
    let res: any = httpMock.createResponse({});

    test('should get providers', async () => {
        let providers = [{
            providerId: 1,
            fhirResourceId: "testId",
            firstName: 'firstName',
            lastName: 'lastName',
            locationName: 'NYU Langone',
            address: 'address',
            serviceLine: 'General Surgery',
            email: 'fake@email.com',
            createTime: new Date(),
            updateTime: new Date()
        }]

        prismaMock.providers.findMany.mockResolvedValue(providers)

        await getProviderOptionsHandler(req, res)
        const data = res._getJSONData()
        expect(data[0].providerId).toEqual(1)
        expect(data[0].firstName).toEqual('firstName')
        expect(data[0].email).toEqual('fake@email.com')
        expect(prismaMock.providers.findMany).toBeCalledTimes(1)
    })
});
