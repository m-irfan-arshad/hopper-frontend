/**
 * @jest-environment node
 */
 import httpMock from 'node-mocks-http';
 import { prismaMock } from '../../../prisma/singleton'
 import getDropdownOptionsHandler from '../getDropdownOptions.page';
 import {mockLocationData, mockProviderData, mockSingleAdmissionType, mockSingleAnesthesia, mockSingleApproach, mockSingleCptCode, mockSingleIcdCode, mockSingleInsurance, mockSingleLaterality, mockSingleProcedure, mockSingleProcedureUnit, mockSingleProvider} from '../../../testReference';

 jest.mock('@auth0/nextjs-auth0', () => ({
    withApiAuthRequired: jest.fn((args) => args),
    getSession: jest.fn()
}));

 describe("getDropdownOptions API", () => {
    test('should get Admission Types', async () => {
        const req = httpMock.createRequest({
            url: `/api/getDropdownOptionsHandler?queryKey=getAdmissionTypes`
        });

        const res = httpMock.createResponse({});
        prismaMock.admissionType.findMany.mockResolvedValueOnce([mockSingleAdmissionType])

        await getDropdownOptionsHandler(req, res)
        const data = res._getJSONData();
        expect(data[0].admissionTypeId).toEqual(1)
        expect(data[0].admissionTypeName).toEqual('Admission Type 1')
        expect(prismaMock.admissionType.findMany).toBeCalledTimes(1);
    })

    test('should get Anesthesia', async () => {
        const req = httpMock.createRequest({
            url: `/api/getDropdownOptionsHandler?queryKey=getAnesthesia`
        });

        const res = httpMock.createResponse({});
        prismaMock.anesthesia.findMany.mockResolvedValueOnce([mockSingleAnesthesia])

        await getDropdownOptionsHandler(req, res)
        const data = res._getJSONData();
        expect(data[0].anesthesiaId).toEqual(1)
        expect(data[0].anesthesiaName).toEqual('Regional Block')
        expect(prismaMock.anesthesia.findMany).toBeCalledTimes(1);
    })

    test('should get Approaches', async () => {
        const req = httpMock.createRequest({
            url: `/api/getDropdownOptionsHandler?queryKey=getApproaches`
        });

        const res = httpMock.createResponse({});
        prismaMock.approach.findMany.mockResolvedValueOnce([mockSingleApproach])

        await getDropdownOptionsHandler(req, res)
        const data = res._getJSONData();
        expect(data[0].approachId).toEqual(1)
        expect(data[0].approachName).toEqual('Approach 1')
        expect(prismaMock.approach.findMany).toBeCalledTimes(1);
    })

    test('should get Cpt Codes', async () => {
        const req = httpMock.createRequest({
            url: `/api/getDropdownOptionsHandler?queryKey=getCptCodes`
        });

        const res = httpMock.createResponse({});
        prismaMock.cptCode.findMany.mockResolvedValueOnce([mockSingleCptCode])

        await getDropdownOptionsHandler(req, res)
        const data = res._getJSONData();
        expect(data[0].cptCodeId).toEqual(1)
        expect(data[0].cptCodeName).toEqual('1111CPT')
        expect(prismaMock.cptCode.findMany).toBeCalledTimes(1);
    })

    test('should get Icd Codes', async () => {
        const req = httpMock.createRequest({
            url: `/api/getDropdownOptionsHandler?queryKey=getIcdCodes`
        });

        const res = httpMock.createResponse({});
        prismaMock.icdCode.findMany.mockResolvedValueOnce([mockSingleIcdCode])

        await getDropdownOptionsHandler(req, res)
        const data = res._getJSONData();
        expect(data[0].icdCodeId).toEqual(1)
        expect(data[0].icdCodeName).toEqual('1111ICD')
        expect(prismaMock.icdCode.findMany).toBeCalledTimes(1);
    })

    test('should get insurances', async () => {
        const req = httpMock.createRequest({
            url: `/api/getDropdownOptionsHandler?queryKey=getInsurances`
        });

        const res = httpMock.createResponse({});
        prismaMock.insurance.findMany.mockResolvedValueOnce([mockSingleInsurance])

        await getDropdownOptionsHandler(req, res)
        const data = res._getJSONData();
        expect(data[0].insuranceId).toEqual(1)
        expect(data[0].insuranceName).toEqual('Icon')
        expect(prismaMock.insurance.findMany).toBeCalledTimes(1);
        expect(prismaMock.insurance.findMany).toBeCalledWith({orderBy: { insuranceName: 'asc' }})
    })

    test('should get lateralities', async () => {
        const req = httpMock.createRequest({
            url: `/api/getDropdownOptionsHandler?queryKey=getLateralities`
        });

        const res = httpMock.createResponse({});
        prismaMock.laterality.findMany.mockResolvedValueOnce([mockSingleLaterality])

        await getDropdownOptionsHandler(req, res)
        const data = res._getJSONData();
        expect(data[0].lateralityId).toEqual(1)
        expect(data[0].lateralityName).toEqual('Laterality 1')
        expect(prismaMock.laterality.findMany).toBeCalledTimes(1);
    })

    test('should get locations', async () => {
        const req = httpMock.createRequest({
            url: `/api/getDropdownOptionsHandler?queryKey=getLocations`
        });

        const res = httpMock.createResponse({});
        prismaMock.location.findMany.mockResolvedValueOnce(mockLocationData)

        await getDropdownOptionsHandler(req, res)
        const data = res._getJSONData();
        expect(data[0].locationId).toEqual(1)
        expect(data[0].locationName).toEqual('Medtel Hospital')
        expect(prismaMock.location.findMany).toBeCalledTimes(1);
        expect(prismaMock.location.findMany).toBeCalledWith({orderBy: { locationName: 'asc' }})
    })

    test('should get Procedures', async () => {
        const req = httpMock.createRequest({
            url: `/api/getDropdownOptionsHandler?queryKey=getProcedures`
        });

        const res = httpMock.createResponse({});
        prismaMock.procedure.findMany.mockResolvedValueOnce([mockSingleProcedure])

        await getDropdownOptionsHandler(req, res)
        const data = res._getJSONData();
        expect(data[0].procedureId).toEqual(1)
        expect(data[0].procedureName).toEqual('Brain Swap')
        expect(prismaMock.procedure.findMany).toBeCalledTimes(1);
    })

    test('should get ProcedureUnits', async () => {
        const req = httpMock.createRequest({
            url: `/api/getDropdownOptionsHandler?queryKey=getProcedureUnits&locationId=1`
        });

        const res = httpMock.createResponse({});
        prismaMock.procedureUnit.findMany.mockResolvedValueOnce([mockSingleProcedureUnit])

        await getDropdownOptionsHandler(req, res)
        const data = res._getJSONData();
        expect(data[0].procedureUnitId).toEqual(1)
        expect(data[0].procedureUnitName).toEqual('procedureUnitName')
        expect(prismaMock.procedureUnit.findMany).toBeCalledTimes(1);
        expect(prismaMock.procedureUnit.findMany).toBeCalledWith({
            where: {
               locationId: 1
            },
            orderBy: { procedureUnitName: 'asc' }
        })
    })

    test('should get Providers', async () => {
        const req = httpMock.createRequest({
            url: `/api/getDropdownOptionsHandler?queryKey=getProviders&serviceLineId=1`
        });

        const res = httpMock.createResponse({});
        prismaMock.provider.findMany.mockResolvedValueOnce([mockSingleProvider])

        await getDropdownOptionsHandler(req, res)
        const data = res._getJSONData();
        expect(data[0].providerId).toEqual(1)
        expect(data[0].firstName).toEqual('Robert')
        expect(data[0].lastName).toEqual('Lee')
        expect(prismaMock.provider.findMany).toBeCalledTimes(1);
        expect(prismaMock.provider.findMany).toBeCalledWith({
            where: {
                serviceLine: {
                    some: {
                        serviceLine: {
                            serviceLineId: 1
                        }
                    }
                }
            },
            orderBy: { firstName: 'asc' }
        })
    })

    test('invalid queryKey should not return data', async () => {
        const req = httpMock.createRequest({
            url: `/api/getDropdownOptionsHandler?queryKey=secureData`
        });

        const res = httpMock.createResponse({});
        await getDropdownOptionsHandler(req, res)
        const data = res._getJSONData();
        expect(data.length).toEqual(0)
    })
});
