import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../prisma/clientInstantiation';

export default async function getProviderOptionsHandler(req: NextApiRequest, res: NextApiResponse) {
  const providers = await prisma.providers.findMany();

  res.json(providers)
}