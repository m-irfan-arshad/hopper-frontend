import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../prisma/clientInstantiation';

export default async function getLocationOptionsHandler(req: NextApiRequest, res: NextApiResponse) {
  const locations = await prisma.locations.findMany();

  res.json(locations)
}