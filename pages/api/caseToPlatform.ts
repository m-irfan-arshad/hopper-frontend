import { cases, patients } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next'
import {GoogleAuth} from 'google-auth-library';
import { promises as fs } from 'fs';
import moment from 'moment';

async function generateServiceKeys(path: string) {
  const fileContents = await fs.readFile(path, 'utf8');
  const creds = JSON.parse(fileContents)
  const clientEmail = "mt-hp-s-dev-b7e1@appspot.gserviceaccount.com";
  const privateKey = creds.private_key
  return {client_email: clientEmail, private_key: privateKey}
}

interface caseObjectInterface {
  procedureDate: string,
  serviceLine: string,
  procedureUnit: string,
  locationName: string,
  providerName: string
}

function parseCase(caseObject: caseObjectInterface) {
  const bundleId = 1234;
  const currentTime = moment().utc().format();
  const patientUuid = 1234;
  return {
    "resourceType": "Bundle",
    "id": `bundle-transaction-${bundleId}`,
    "meta": {
      "lastUpdated": currentTime
    },
    "type": "transaction",
    entry: [
      {
        "resource": {
          "resourceType": "Appointment",
          "start": currentTime,
          "end": caseObject.procedureDate,
          "status": "proposed",
          "participant": [
            {
              "actor": {
                "reference": `Patient/${patientUuid}`
              },
              "status": "accepted"
            },
            {
              "actor": {
                "reference": "Location/ce692c7c-84ea-4b8f-d3ff-3ec9f0e51bd8"
              },
              "status": "tentative"
            },
            {
              "actor": {
                "reference": "Practitioner/bf0b9fec-b7f0-e253-7671-5fe1ae23dc02"
              },
              "type": [
                {
                  "coding": [
                    {
                      "code": "1.1",
                      "display": "Primary"
                    }
                  ]
                }
              ],
              "period": {
                "start": caseObject.procedureDate
              },
              "status": "tentative"
            }
          ]
        },
        "request": {
          "method": "POST",
          "url": "Appointment"
        }
      }
    ]
  }
}

export default async function caseToPlatform(req: NextApiRequest, res: NextApiResponse) {
    const formattedCase = parseCase(req.body);

    let auth;
    if(process.env.NODE_ENV === 'development') {
      const creds = await generateServiceKeys('/Users/isaacblinder/.config/gcloud/mt-hp-s-dev-b7e1-94561b2e47e6.json')
      auth = new GoogleAuth({
        credentials: creds
      });
    } else { // if in production
      auth = new GoogleAuth();
    }

    const url = 'https://us-east4-mt-hp-s-dev-b7e1.cloudfunctions.net/case-to-platform-east'
    const client = await auth.getIdTokenClient(url)
    const resp = await client.request({ url: url, method: 'POST', data: formattedCase });
    
    res.json(resp)
}