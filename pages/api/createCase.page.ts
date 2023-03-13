import type { NextApiRequest, NextApiResponse } from 'next';
import { patient, Prisma, scheduling } from '@prisma/client'
import prisma from '../../prisma/clientInstantiation';
import { formatCreateCaseParams, validateRequest } from '../../utils/helpers';
import { withApiAuthRequired } from '@auth0/nextjs-auth0';
import { includeReferencesObject } from '../../reference';

const requiredSchedulingParams = ['procedureDate', 'provider', 'location', 'procedureUnit', 'serviceLine'];
const requiredPatientParams = ['firstName', 'lastName', 'dateOfBirth'];

export default withApiAuthRequired(async function createCaseHandler(req: NextApiRequest, res: NextApiResponse) {
  const invalidSchedulingParams = validateRequest(requiredSchedulingParams, req.body?.scheduling || {}, res);
  const invalidPatientParams = validateRequest(requiredPatientParams, req.body?.patient || {}, res);

  if (invalidSchedulingParams) {
    return invalidSchedulingParams
  } else if (invalidPatientParams) {
    return invalidPatientParams
  }
  
  try {
    const newCase = await prisma.cases.create({
      data: formatCreateCaseParams(req.body),
      include: includeReferencesObject
    })
    res.json(newCase)
  } catch(err: any) {
    res.status(500).json({ message: err.message });
  }
})