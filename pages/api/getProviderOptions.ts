import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../prisma/clientInstantiation';

export default async function getProviderOptionsHandler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const providers = await prisma.providers.findMany();

    res.json(providers)
  } catch(err) {
    res.status(500).json({ message: err });
  }
}