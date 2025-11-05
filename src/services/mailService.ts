import { existsSync, readFileSync } from "fs";
import nodemailer from "nodemailer";
import handlebars from "handlebars";
import path from "path";

interface MailRequest {
    serviceId: string;
    subject: string;
    to: string;
    template: string;
    data: {};
}

export class MailService {
    private smtpConfigPath = path.resolve("./src/config/smtp.json");
    private templatesDir = path.resolve("./src/templates");

    private loadJSON(filePath: string) {
        try {
            return JSON.parse(readFileSync(filePath, "utf-8"));
        } catch (err) {
            console.error("❌ Error reading SMTP config file:", err);
            return null;
        }
    }

    private compileTemplate(templateName: string, data: Record<string, any>) {
        try {
            const filePath = path.join(this.templatesDir, `${templateName}.html`);
            if (!existsSync(filePath)) {
                console.error(`❌ Template file not found: ${templateName}.html`);
                return null;
            }

            const source = readFileSync(filePath, "utf-8");
            const template = handlebars.compile(source);
            return template(data);
        } catch (err) {
            console.error("❌ Error compiling email template:", err);
            return null;
        }
    }

    async sendMail({ serviceId, subject, to, template, data }: MailRequest) {
        try {
            const smtpConfigs = this.loadJSON(this.smtpConfigPath);
            if (!smtpConfigs) {
                console.error("❌ SMTP config not found or invalid JSON.");
                return;
            }

            const sender = smtpConfigs[serviceId];
            if (!sender) {
                console.error(`❌ Invalid serviceId: ${serviceId}`);
                return;
            }

            const html = this.compileTemplate(template.trim(), data);
            if (!html) {
                console.error(`❌ Failed to compile template: ${template}`);
                return;
            }

            const transporter = nodemailer.createTransport({
                host: sender.host,
                port: sender.port,
                secure: false,
                auth: {
                    user: sender.user,
                    pass: sender.pass,
                },
            });

            const info = await transporter.sendMail({
                from: `${sender.user}<${sender.user}>`,
                to,
                subject,
                html,
            });

            console.log("✅ Email sent successfully:", info.messageId);
            return info;
        } catch (error) {
            console.error("❌ Error while sending email:", error);
        }
    }
}
