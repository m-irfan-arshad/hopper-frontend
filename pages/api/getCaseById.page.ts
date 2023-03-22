import type { NextApiRequest, NextApiResponse } from 'next'
import { withValidation, casesFormatter } from '../../utils/helpers';
import prisma from '../../prisma/clientInstantiation';
import { withApiAuthRequired } from '@auth0/nextjs-auth0';

const requiredParams = ['caseId'];

export default withApiAuthRequired( withValidation(requiredParams, async function getCasesHandler(req: NextApiRequest, res: NextApiResponse) {
  
  try {
    const resultPosts = await prisma.cases.findUnique({
        where: {
            caseId: parseInt(req.query["caseId"] as string)
          },
          include: {
            financial: { include: {insurance: true}, orderBy: {financialId: 'asc'} },
            patient: {include: {state: true, sex: true}},
            scheduling: { include: {provider: true, location: true, procedureUnit: true, serviceLine: true, admissionType: true} },
            procedureTab: {include: {procedure: true, approach: true, laterality: true, anesthesia: true, cptCode: true, icdCode: true}},
            comment: {orderBy: {createTime: 'desc'}}
        }
    })

    res.json(casesFormatter(resultPosts));
  } catch(err: any) {
    res.status(500).json({ message: err.message });
  }
}))
