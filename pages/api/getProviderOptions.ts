import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../prisma/clientInstantiation';
import { withApiAuthRequired } from '@auth0/nextjs-auth0';

export default withApiAuthRequired(async function getProviderOptionsHandler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const providers = await prisma.providers.findMany();

    res.json(providers)
  } catch(err) {
    res.status(500).json({ message: err });
  }
})