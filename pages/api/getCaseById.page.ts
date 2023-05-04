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
            patient: {include: {address: true, sex: true}},
            scheduling: { include: {provider: true, location: true, procedureUnit: true, serviceLine: true, admissionType: true} },
            procedureTab: {include: {procedure: true, approach: true, laterality: true, anesthesia: true, cptCode: true, icdCode: true}},
            productTab: {include: {manufacturer: true, vendor: true}},
            clinical: {include: {diagnosticTests: {include: {facility: true, diagnosticTest: true}}, clearances: {include: {facility: true, clearance: true}}, preOpForm: {include: {facility: true}}}},
            comment: {orderBy: {createTime: 'desc'}},
            document: {orderBy: {createTime: 'desc'}},
        }
    })

    res.json(casesFormatter(resultPosts));
  } catch(err: any) {
    res.status(500).json({ message: err.message });
  }
}))
