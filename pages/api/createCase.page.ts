import { cases, patients } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../prisma/clientInstantiation';
import { validateRequest } from '../../utils/helpers';
import { withApiAuthRequired } from '@auth0/nextjs-auth0';

const requiredParams = ['procedureDate', 'providerId', 'locationId'];

export default withApiAuthRequired(async function createCaseHandler(req: NextApiRequest, res: NextApiResponse) {
  const invalidParamsMessage = validateRequest(requiredParams, req.body?.case || {}, res);

  if (invalidParamsMessage) {
    return invalidParamsMessage
  }
  
  try {
    const newPatient = await prisma.patients.create({
      data: {
          ...req.body.patient,
          createTime: new Date(),
          updateTime: new Date()
      }
    })
    const newCase = await prisma.cases.create({
      data: {
          ...req.body.case,
          patientId: <number>newPatient.patientId,
          createTime: new Date(),
          updateTime: new Date()
      }
    })
    res.json({...newCase, patients: newPatient})

  } catch(err) {
    res.status(500).json({ message: err });
  }
})