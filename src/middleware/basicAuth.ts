import type { NextFunction, Request, Response } from 'express';
import dotenv from 'dotenv';

dotenv.config();

export function basicAuth(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Basic ")) {
        return res.status(401).json({ error: 'Unauthorized' })
    }
    const base64Credantials = authHeader.split(" ")[1];
    if (!base64Credantials) {
        return res.status(401).json({ error: 'Unauthorized' })
    }
    const credantials = Buffer.from(base64Credantials, 'base64').toString('ascii');
    const [userName, password] = credantials.split(":");

    if (userName === process.env.API_USER && password === process.env.API_PASSWORD) {
        return next();
    }
    return res.status(403).json({ error: "Invalid credentials" });
}