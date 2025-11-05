import express from 'express';
import type { Request, Response } from 'express';
import dotenv from 'dotenv';
import { MailService } from './services/mailService.js';
import { basicAuth } from './middleware/basicAuth.js';

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

const mailService = new MailService();
app.use(express.json());

app.post('/send-mail/v1', basicAuth, async (req: Request, res: Response) => {
    try {
        const { serviceId, subject, to, template, data } = req.body;
        if (!serviceId || !subject || !to || !template || !data) {
            return res.status(400).json({ error: 'Missing required fileds' });
        }
        await mailService.sendMail(req.body);
        console.log("✅ Mail send successfully");
        return res.status(200).json({ success: true, message: `email send to ${to} successfully` });
    } catch (error: any) {
        console.error('❌ Mail sending failed', error.message);
        return res.status(500).json({ success: false, error: error.message });
    }
})
app.post('/send-mail/v2', basicAuth, async (req: Request, res: Response) => {
    try {
        const { serviceId, subject, to, template, data } = req.body;
        if (!serviceId || !subject || !to || !template || !data) {
            return res.status(400).json({ error: 'Missing required fileds' });
        }
        mailService.sendMail(req.body);
        console.log("✅ Mail send successfully");
        return res.status(200).json({ success: true, message: `email send to ${to} successfully` });
    } catch (error: any) {
        console.error('❌ Mail sending failed', error.message);
        return res.status(500).json({ success: false, error: error.message });
    }
})

app.listen(port, () => console.info("mail server listening on port 3000"));