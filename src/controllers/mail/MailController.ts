import express from 'express';
import MailService from '../../services/mail/MailService';
import fs from 'node:fs';

const mail = new MailService();

const router = (router: express.Application) => {
    router.get('/api', async (req: express.Request, res: express.Response) => {
        try {
            let pathFile = String(fs.readFileSync('src/views/email.html'));
            // console.log(pathFile)
            await mail.content(pathFile).send('smtp');
            res.status(200).json({
                status: 'success',
                message: 'Email sucessfully sent !!',
            });
        } catch (err) {
            console.log(err);
            res.status(400).json({
                status: 'error',
                message: 'Sending email failed',
            });
        }
    });
};

export default router;
