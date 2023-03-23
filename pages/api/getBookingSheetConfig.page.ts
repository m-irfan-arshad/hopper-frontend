import type { NextApiRequest, NextApiResponse } from 'next';
import { withApiAuthRequired } from '@auth0/nextjs-auth0';
const {Storage} = require('@google-cloud/storage');


export default withApiAuthRequired(async function getBookingSheetConfig(req: NextApiRequest, res: NextApiResponse) {
    const storage = new Storage();
    try {
        const contents = await storage.bucket("hopper_org_config").file("sample_org_config.json").download();
        res.json(JSON.parse(contents.toString()));
    } catch(err: any) {
        res.status(500).json({ message: err.message });
    }
})