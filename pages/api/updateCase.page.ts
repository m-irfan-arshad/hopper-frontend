import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../prisma/clientInstantiation';
import { convertObjectToPrismaFormat, withValidation, excludeField } from '../../utils/helpers';
import { withApiAuthRequired } from '@auth0/nextjs-auth0';
const {Storage} = require('@google-cloud/storage');

const requiredParams = ['caseId'];

export default withApiAuthRequired( withValidation(requiredParams, async function updateCaseHandler(req: NextApiRequest, res: NextApiResponse) {
  try {
    let caseNoId = excludeField(req.body, "caseId")
    caseNoId.scheduling && (caseNoId.scheduling = convertObjectToPrismaFormat(caseNoId.scheduling, "schedulingId"))
    caseNoId.patient && (caseNoId.patient = convertObjectToPrismaFormat(caseNoId.patient, "patientId"))
    caseNoId.procedureTab && (caseNoId.procedureTab = convertObjectToPrismaFormat(caseNoId.procedureTab, "procedureTabId"))
    
    const updatedCase = await prisma.cases.update({
      where: {
        caseId: <number>req.body.caseId
      },
      data: <object>caseNoId
    })

    res.json(updatedCase)
  } catch(err: any) {
    res.status(500).json({ message: err.message });
  }
}))