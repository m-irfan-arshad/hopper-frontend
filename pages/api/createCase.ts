import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../prisma/clientInstantiation';
import { validateParameters } from '../../utils/helpers';

const requiredParams = ['fhirResourceId', 'patientId', 'procedureDate', 'providerName', 'locationName', 'priorAuthorization', 'vendorConfirmation'];

export default async function createCaseHandler(req: NextApiRequest, res: NextApiResponse) {
  const invalidParamsMessage = validateParameters(requiredParams, req.body, res);

  if (invalidParamsMessage) {
    return invalidParamsMessage
  }

  try {
    const newCase = await prisma.cases.create({
      data: {
          fhirResourceId: <string>req.body.fhirResourceId,
          patientId: <number>req.body.patientId,
          procedureDate: <Date>new Date(req.body.procedureDate),
          providerName: <string>req.body.providerName,
          locationName: <string>req.body.locationName,
          createTime: new Date(),
          updateTime: new Date(),
          priorAuthorization: <string>req.body.priorAuthorization,
          vendorConfirmation: <string>req.body.vendorConfirmation,
      }
    })

    res.json(newCase)
  } catch(err) {
    res.status(500).json({ message: err });
  }
}