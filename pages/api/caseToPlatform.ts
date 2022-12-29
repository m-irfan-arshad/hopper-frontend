import { cases, patients } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next'
import {GoogleAuth} from 'google-auth-library';
import { promises as fs } from 'fs';

export default async function caseToPlatform(req: NextApiRequest, res: NextApiResponse) {
      let auth;
      console.log("process.env.NODE_ENV: ", process.env.NODE_ENV)
      if(process.env.NODE_ENV === 'development') {
        const fileContents = await fs.readFile('/Users/isaacblinder/.config/gcloud/mt-hp-s-dev-b7e1-94561b2e47e6.json', 'utf8');
        const creds = JSON.parse(fileContents)
        const clientEmail = "mt-hp-s-dev-b7e1@appspot.gserviceaccount.com";
        const privateKey = creds.private_key
        auth = new GoogleAuth({
          credentials: {
            client_email: clientEmail,
            private_key: privateKey,
          }
        });
      } else { // if in production
        auth = new GoogleAuth();
      } 

      const url = 'https://us-east4-mt-hp-s-dev-b7e1.cloudfunctions.net/case-to-platform-east'
      const client = await auth.getIdTokenClient(url)
      const resp = await client.request({ url: url, method: 'POST', data: {} });
    
    res.json(resp)
}