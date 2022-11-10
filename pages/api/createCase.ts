import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../prisma/clientInstantiation';

export default async function createCaseHandler(req: NextApiRequest, res: NextApiResponse) {
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
}