export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

import 'server-only';
import type { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  const { to, subject, html } = await req.json();
  if (!to || !subject || !html) {
    return new Response(JSON.stringify({ error: 'Missing fields' }), { status: 400 });
  }

  const nodemailer = (await import('nodemailer')).default;

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT ?? 587),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });

  await transporter.sendMail({
    from: process.env.SMTP_FROM ?? 'noreply@bhv360.nl',
    to, subject, html
  });

  return new Response(JSON.stringify({ ok: true }), { status: 200 });
}
