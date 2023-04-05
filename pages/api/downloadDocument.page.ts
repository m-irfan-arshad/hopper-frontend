import type { NextApiRequest, NextApiResponse } from 'next';
import { withApiAuthRequired } from '@auth0/nextjs-auth0';
import prisma from '../../prisma/clientInstantiation';
import { Storage } from "@google-cloud/storage";
import { withValidation } from '../../utils/helpers';
const path = require('path');
const cwd = path.join(__dirname, '..');

const requiredParams = ['storagePath'];

export default withApiAuthRequired( withValidation(requiredParams, async function createDocumentHandler(req: NextApiRequest, res: NextApiResponse) {
    const storage = new Storage();
    const storagePath = <string>req.query["storagePath"];

    try {
        const contents = await storage.bucket("hopper-case-hub-documents").file(storagePath).download();
        res.json(contents.toString());
    } catch(err: any) {
        res.status(500).json({ message: err.message });
    }
}))