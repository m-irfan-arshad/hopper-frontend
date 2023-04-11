import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../prisma/clientInstantiation';
import { withApiAuthRequired } from '@auth0/nextjs-auth0';


export default withApiAuthRequired(async function getDropdownOptionsHandler(req: NextApiRequest, res: NextApiResponse) {
    const queryKey = req.query["queryKey"];
    let values: any[];
    try {
        switch (queryKey) {
            case "getAdmissionTypes":
                values = await prisma.admissionType.findMany();
                break;
            case "getAnesthesia":
                values = await prisma.anesthesia.findMany();
                break;
            case "getApproaches":
                values = await prisma.approach.findMany();
                break;
            case "getCptCodes":
                values = await prisma.cptCode.findMany();
                break;
            case "getIcdCodes":
                values = await prisma.icdCode.findMany();
                break;
            case "getInsurances":
                values = await prisma.insurance.findMany({orderBy: { insuranceName: 'asc' }});
                break;
            case "getLateralities":
                values = await prisma.laterality.findMany();
                break;
            case "getLocations":
                values = await prisma.location.findMany({orderBy: { locationName: 'asc' }})
                break;
            case "getProcedures":
                values = await prisma.procedure.findMany();
                break;
            case "getProcedureUnits":
                values = await prisma.procedureUnit.findMany({
                    where: {
                        locationId: parseInt(req.query["locationId"] as string)
                    },
                    orderBy: { procedureUnitName: 'asc' }
                });
                break;
            case "getProviders":
                values = await prisma.provider.findMany({
                    where: {
                      serviceLine: {
                        some: {
                          serviceLine: {
                            serviceLineId: parseInt(req.query["serviceLineId"] as string)
                          },
                        },
                      },
                    },
                    orderBy: { firstName: 'asc' }
                  });
                  break;
            case "getServiceLines":
                values = await prisma.serviceLine.findMany({
                    where: {
                        procedureUnitId: parseInt(req.query["procedureUnitId"] as string)
                    },
                    orderBy: { serviceLineName: 'asc' }
                })
                break;
            case "getSex":
                values = await prisma.sex.findMany();
                break;
            case "getStates":
                values = await prisma.state.findMany();
                break;
            case "getDiagnosticTests":
                values = await prisma.diagnosticTest.findMany();
                break;
            case "getClearances":
                values = await prisma.clearance.findMany();
                break;
            default:
                console.warn("could not find field name ", queryKey)
                values = [];
        }
        res.json(values);
    } catch(err: any) {
        res.status(500).json({ message: err.message });
    }
})