import type { NextApiRequest, NextApiResponse } from 'next';
import { withApiAuthRequired } from '@auth0/nextjs-auth0';
import prisma from '../../prisma/clientInstantiation';
const {Storage} = require('@google-cloud/storage');
import { withValidation } from '../../utils/helpers';
import Chance from 'chance';
import stream from 'stream';


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
    const {docTypes, user, caseId, content, fileName, notes, signitureDate} = req.body;
    const destFileName = chance.guid() + '_' + fileName;
    try {
        await Promise.resolve().then(() => {
            const myBucket = storage.bucket("hopper_booking_sheet_documents");
            const fileRef = myBucket.file(destFileName);
            const passthroughStream = new stream.PassThrough();
            passthroughStream.write(content);
            passthroughStream.end();
            return passthroughStream.pipe(fileRef.createWriteStream())
        }).then(async () => {
            const document = await prisma.document.create({
                data: {
                    docTypes: docTypes,
                    user: user,
                    caseId: caseId,
                    notes: notes,
                    storagePath: destFileName,
                    ...(signitureDate && {signitureDate: signitureDate})
                }
            });
            res.json(document)
            return;
        });
    } catch(err: any) {
        res.status(500).json({ message: err.message });
    }
}))