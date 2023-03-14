import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../prisma/clientInstantiation';
import { withApiAuthRequired } from '@auth0/nextjs-auth0';
import { withValidation } from '../../utils/helpers';


const requiredParams = ['serviceLineId'];

export default withApiAuthRequired( withValidation(requiredParams, async function getProvidersHandler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const providers = await prisma.provider.findMany({
      where: {
        serviceLine: {
          some: {
            serviceLine: {
              serviceLineId: parseInt(req.query["serviceLineId"] as string)
            },
          },
        },
      },
      orderBy: { firstName: 'asc' }
    });

    res.json(providers)
  } catch(err) {
    res.status(500).json({ message: err });
  }
}))