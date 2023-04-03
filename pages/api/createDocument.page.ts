import type { NextApiRequest, NextApiResponse } from 'next';
import { withApiAuthRequired } from '@auth0/nextjs-auth0';
import prisma from '../../prisma/clientInstantiation';
import { Storage } from "@google-cloud/storage";
import { withValidation } from '../../utils/helpers';
import Chance from 'chance';

const requiredParams = ['docTypes', 'user', 'caseId', 'content', 'fileName'];

export const config = {
    api: {
        bodyParser: {
            sizeLimit: '500mb'
        }
    }
}

export default withApiAuthRequired( withValidation(requiredParams, async function createDocumentHandler(req: NextApiRequest, res: NextApiResponse) {
    const storage = new Storage();
    const chance = new Chance();
    const {docTypes, user, caseId, content, fileName, notes, signatureDate} = req.body;
    const destFileName = chance.guid() + '-' + fileName;
    var buf = Buffer.from(content, 'utf8');
    try {
        await Promise.resolve().then(async () => {
            await storage.bucket("hopper-case-hub-documents").file(destFileName).save(buf);
        }).then(async () => {
            const document = await prisma.document.create({
                data: {
                    docTypes: docTypes,
                    user: user,
                    caseId: caseId,
                    notes: notes,
                    storagePath: destFileName,
                    ...(signatureDate && {signatureDate: signatureDate})
                }
            });
            res.json(document)
            return;
        });
    } catch(err: any) {
        res.status(500).json({ message: err.message });
    }
}))