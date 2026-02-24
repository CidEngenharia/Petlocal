import prisma from '../lib/prisma';

export default async function handler(req: any, res: any) {
    try {
        const envKeys = Object.keys(process.env).filter(k => k.includes('DATABASE') || k.includes('URL') || k.includes('SECRET'));
        await prisma.$connect();
        res.status(200).json({
            status: 'API is working',
            envKeys,
            database: 'connected',
            nodeEnv: process.env.NODE_ENV,
            vercel: !!process.env.VERCEL
        });
    } catch (err: any) {
        res.status(500).json({
            status: 'Diagnostic failed',
            error: err.message,
            code: err.code,
            envKeys: Object.keys(process.env).filter(k => k.includes('DATABASE') || k.includes('URL') || k.includes('SECRET'))
        });
    }
}
