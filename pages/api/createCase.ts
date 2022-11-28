import { cases, patients } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../prisma/clientInstantiation';

export default async function createCaseHandler(req: NextApiRequest, res: NextApiResponse) {
  const caseObject = <cases>req.body.case;
  const patientObject = <patients>req.body.patient;

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
}