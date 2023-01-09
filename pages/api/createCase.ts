import { cases, patients } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../prisma/clientInstantiation';
import { validateRequest } from '../../utils/helpers';
import { withApiAuthRequired } from '@auth0/nextjs-auth0';

const requiredParams = ['procedureDate', 'providerName', 'locationName', 'procedureUnit', 'serviceLine'];

export default withApiAuthRequired(async function createCaseHandler(req: NextApiRequest, res: NextApiResponse) {
  const invalidParamsMessage = validateRequest(requiredParams, req.body?.case || {}, res);

  if (invalidParamsMessage) {
    return invalidParamsMessage
  }

  const caseObject = <cases>req.body.case;
  const patientObject = <patients>req.body.patient;

  try {
    const newPatient = await prisma.patients.create({
      data: {
          fhirResourceId: <string>patientObject.fhirResourceId,
          firstName: <string>patientObject.firstName,
          lastName: <string>patientObject.lastName,
          mrn: <string>patientObject.mrn,
          address: <string>patientObject.address,
          mobilePhone: <string>patientObject.mobilePhone,
          homePhone: <string>patientObject.homePhone,
          dateOfBirth: <Date>patientObject.dateOfBirth,
          createTime: new Date(),
          updateTime: new Date()
      }
    })
    const newCase = await prisma.cases.create({
      data: {
          fhirResourceId: <string>caseObject.fhirResourceId,
          patientId: <number>newPatient.patientId,
          procedureDate: <Date>caseObject.procedureDate,
          providerName: <string>caseObject.providerName,
          locationName: <string>caseObject.locationName,
          createTime: new Date(),
          updateTime: new Date(),
          priorAuthorization: <string>caseObject.priorAuthorization,
          vendorConfirmation: <string>caseObject.vendorConfirmation,
      }
    })
    res.json({...newCase, patients: newPatient})

  } catch(err) {
    res.status(500).json({ message: err });
  }
})