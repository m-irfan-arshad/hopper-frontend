import { cases, patients } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../prisma/clientInstantiation';
import { validateParameters } from '../../utils/helpers';
import {GoogleAuth} from 'google-auth-library';
import * as dotenv from 'dotenv'
dotenv.config()

export default async function caseToPlatform(req: NextApiRequest, res: NextApiResponse) {
    
    console.log("GOOGLE_APPLICATION_CREDENTIALS: ", process.env.GOOGLE_APPLICATION_CREDENTIALS)
      const auth = new GoogleAuth();
      console.log(await auth._getApplicationCredentialsFromFilePath(process.env.GOOGLE_APPLICATION_CREDENTIALS as string))
      const url = 'https://us-central1-mt-hp-s-dev-b7e1.cloudfunctions.net/hopper-case-to-platform'
      const creds = await auth.getIdTokenClient(url)
      console.log("creds: ", creds)

    res.json({})
}