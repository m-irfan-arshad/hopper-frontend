import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../prisma/clientInstantiation';
import { getRelationshipCrudObject, withValidation, excludeField } from '../../utils/helpers';
import { withApiAuthRequired } from '@auth0/nextjs-auth0';

const requiredParams = ['caseId'];

export default withApiAuthRequired( withValidation(requiredParams, async function updateCaseHandler(req: NextApiRequest, res: NextApiResponse) {
  try {
    let caseNoId = excludeField(req.body, "caseId")
    caseNoId.scheduling && (caseNoId.scheduling = getRelationshipCrudObject(excludeField(caseNoId.scheduling, "schedulingId")))
    caseNoId.patient && (caseNoId.patient = getRelationshipCrudObject(excludeField(caseNoId.patient, "patientId")))

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