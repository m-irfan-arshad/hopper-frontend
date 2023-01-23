import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../prisma/clientInstantiation';
import { withApiAuthRequired } from '@auth0/nextjs-auth0';
import { withValidation } from '../../utils/helpers';


const requiredParams = ['serviceLineId'];

export default withApiAuthRequired( withValidation(requiredParams, async function getProvidersHandler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const providers = await prisma.providers.findMany({
      where: {
        serviceLines: {
          some: {
            serviceLine: {
              serviceLineId: parseInt(req.query["serviceLineId"] as string)
            },
          },
        },
      },
    });
    providers.sort((unit1, unit2) => unit1.firstName.toLowerCase() > unit2.firstName.toLowerCase() ? 1 : -1);

    res.json(providers)
  } catch(err) {
    res.status(500).json({ message: err });
  }
}))