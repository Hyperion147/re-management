import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM = process.env.RESEND_FROM_EMAIL ?? 'Veyro <noreply@veyro.in>';
const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://veyro.in';

// ─── Templates ────────────────────────────────────────────────────────────────

function baseLayout(content: string, previewText: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${previewText}</title>
</head>
<body style="margin:0;padding:0;background:#F5F7F5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F5F7F5;padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
        <!-- Header -->
        <tr>
          <td style="background:#000101;border-radius:16px 16px 0 0;padding:28px 40px;text-align:center;">
            <span style="font-size:24px;font-weight:900;color:#39FF14;letter-spacing:-0.5px;">Veyro</span>
          </td>
        </tr>
        <!-- Body -->
        <tr>
          <td style="background:#ffffff;padding:40px;border-left:1px solid #e8ebe8;border-right:1px solid #e8ebe8;">
            ${content}
          </td>
        </tr>
        <!-- Footer -->
        <tr>
          <td style="background:#F5F7F5;border-radius:0 0 16px 16px;padding:24px 40px;border:1px solid #e8ebe8;text-align:center;">
            <p style="margin:0;font-size:12px;color:#013D1F;opacity:0.5;">© 2026 Veyro. All rights reserved.</p>
            <p style="margin:8px 0 0;font-size:12px;color:#013D1F;opacity:0.4;">India's first on-demand real estate platform.</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function btn(label: string, href: string): string {
  return `<a href="${href}" style="display:inline-block;background:#39FF14;color:#000101;font-weight:700;font-size:15px;padding:14px 32px;border-radius:12px;text-decoration:none;margin:24px 0;">${label}</a>`;
}

function heading(text: string): string {
  return `<h1 style="margin:0 0 16px;font-size:28px;font-weight:900;color:#000101;letter-spacing:-0.5px;">${text}</h1>`;
}

function para(text: string): string {
  return `<p style="margin:0 0 16px;font-size:15px;line-height:1.7;color:#013D1F;">${text}</p>`;
}

function infoRow(label: string, value: string): string {
  return `<tr>
    <td style="padding:10px 16px;font-size:12px;font-weight:700;color:#013D1F;opacity:0.6;text-transform:uppercase;letter-spacing:0.08em;width:140px;background:#F5F7F5;border-bottom:1px solid #e8ebe8;">${label}</td>
    <td style="padding:10px 16px;font-size:14px;font-weight:600;color:#000101;background:#ffffff;border-bottom:1px solid #e8ebe8;">${value}</td>
  </tr>`;
}

function infoTable(rows: [string, string][]): string {
  return `<table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e8ebe8;border-radius:12px;overflow:hidden;margin:20px 0;">
    <tbody>${rows.map(([l, v]) => infoRow(l, v)).join('')}</tbody>
  </table>`;
}

// ─── Email 1: Agent application received ──────────────────────────────────────

export async function sendAgentApplicationReceivedEmail(to: string, name: string) {
  const content = `
    ${heading(`Thanks for applying, ${name.split(' ')[0]}!`)}
    ${para('We received your agent application and our team is reviewing it. This usually takes 1–2 business days.')}
    ${para('You will receive another email once your application has been reviewed with the outcome and next steps.')}
    <div style="background:#F5F7F5;border-radius:12px;padding:20px;margin:24px 0;">
      <p style="margin:0;font-size:13px;font-weight:600;color:#013D1F;">What happens next?</p>
      <ul style="margin:12px 0 0;padding-left:20px;font-size:13px;color:#013D1F;line-height:2;">
        <li>Our team reviews your license and credentials</li>
        <li>We verify your brokerage information</li>
        <li>You'll receive an approval or feedback email</li>
      </ul>
    </div>
    ${para('Have questions? Reply to this email or visit <a href="${APP_URL}" style="color:#087A32;font-weight:700;">veyro.in</a>')}
  `;
  return resend.emails.send({
    from: FROM,
    to,
    subject: 'Your Veyro agent application is under review',
    html: baseLayout(content, 'Application received — Veyro'),
  });
}

// ─── Email 2: Agent application approved ──────────────────────────────────────

export async function sendAgentApprovedEmail(to: string, name: string, adminNote?: string) {
  const content = `
    <div style="background:#39FF14;border-radius:12px;padding:20px 24px;margin-bottom:28px;display:flex;align-items:center;gap:12px;">
      <span style="font-size:28px;">✓</span>
      <span style="font-size:18px;font-weight:900;color:#000101;">Application Approved!</span>
    </div>
    ${heading(`Welcome to Veyro, ${name.split(' ')[0]}!`)}
    ${para('Your agent application has been reviewed and approved. You can now log in and start accepting service requests from clients in your area.')}
    ${adminNote ? `<div style="background:#F5F7F5;border-left:3px solid #39FF14;border-radius:0 8px 8px 0;padding:16px 20px;margin:20px 0;"><p style="margin:0;font-size:13px;font-weight:600;color:#013D1F;">Note from our team:</p><p style="margin:8px 0 0;font-size:13px;color:#013D1F;">${adminNote}</p></div>` : ''}
    <div style="text-align:center;">
      ${btn('Go to Dashboard →', `${APP_URL}/client`)}
    </div>
    ${para('<strong>What to do now:</strong>')}
    <ul style="margin:0 0 16px;padding-left:20px;font-size:14px;color:#013D1F;line-height:2;">
      <li>Log in at <a href="${APP_URL}/login" style="color:#087A32;font-weight:700;">veyro.in/login</a></li>
      <li>Complete your Stripe setup to receive payments</li>
      <li>Browse open service requests in your area</li>
      <li>Accept requests that match your availability</li>
    </ul>
  `;
  return resend.emails.send({
    from: FROM,
    to,
    subject: '🎉 You\'re approved — Welcome to Veyro!',
    html: baseLayout(content, 'Application approved — Veyro'),
  });
}

// ─── Email 3: Agent application rejected ──────────────────────────────────────

export async function sendAgentRejectedEmail(to: string, name: string, adminNote?: string) {
  const content = `
    ${heading(`Hi ${name.split(' ')[0]},`)}
    ${para('Thank you for your interest in becoming a Veyro agent. After reviewing your application, we\'re unable to approve it at this time.')}
    ${adminNote ? `<div style="background:#FFF5F5;border-left:3px solid #ef4444;border-radius:0 8px 8px 0;padding:16px 20px;margin:20px 0;"><p style="margin:0;font-size:13px;font-weight:600;color:#7f1d1d;">Reason provided:</p><p style="margin:8px 0 0;font-size:13px;color:#7f1d1d;">${adminNote}</p></div>` : ''}
    ${para('You may re-apply after addressing the above feedback. If you believe this was an error or would like to discuss, please reply to this email.')}
    <div style="background:#F5F7F5;border-radius:12px;padding:20px;margin:24px 0;">
      <p style="margin:0;font-size:13px;font-weight:600;color:#013D1F;">Common reasons for rejection:</p>
      <ul style="margin:12px 0 0;padding-left:20px;font-size:13px;color:#013D1F;line-height:2;">
        <li>License not active or not verifiable</li>
        <li>Incomplete or inconsistent information</li>
        <li>Coverage area not currently served</li>
      </ul>
    </div>
  `;
  return resend.emails.send({
    from: FROM,
    to,
    subject: 'Update on your Veyro agent application',
    html: baseLayout(content, 'Application update — Veyro'),
  });
}

// ─── Email 4: Client booking confirmation ─────────────────────────────────────

export async function sendBookingConfirmationEmail(
  to: string,
  clientName: string,
  details: {
    serviceType: string;
    address: string;
    city: string;
    state: string;
    date: string;
    startTime: string;
    endTime: string;
    compensation: string;
    requestId: string;
  }
) {
  const content = `
    ${heading('Booking Confirmed!')}
    ${para(`Hi ${clientName.split(' ')[0]}, your service request has been submitted successfully. A verified agent in your area will be notified and can accept your request.`)}
    ${infoTable([
      ['Service', details.serviceType],
      ['Location', `${details.address}, ${details.city}, ${details.state}`],
      ['Date', new Date(details.date).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })],
      ['Time', `${details.startTime} – ${details.endTime}`],
      ['Amount', `₹${parseInt(details.compensation).toLocaleString('en-IN')}`],
    ])}
    <div style="text-align:center;">
      ${btn('View Request →', `${APP_URL}/client/requests`)}
    </div>
    ${para('You will receive a notification once an agent accepts your request. You can track the status and communicate with your agent from your dashboard.')}
    <div style="background:#F5F7F5;border-radius:12px;padding:16px 20px;margin-top:24px;">
      <p style="margin:0;font-size:12px;color:#013D1F;opacity:0.6;">Request ID: ${details.requestId}</p>
    </div>
  `;
  return resend.emails.send({
    from: FROM,
    to,
    subject: `Booking confirmed — ${details.serviceType} on ${details.date}`,
    html: baseLayout(content, 'Booking confirmed — Veyro'),
  });
}

// ─── Email 5: Admin new agent application alert ────────────────────────────────

export async function sendAdminNewApplicationAlert(
  applicantName: string,
  applicantEmail: string,
  services: string[]
) {
  const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL;
  if (!adminEmail) return;

  const content = `
    ${heading('New Agent Application')}
    ${para('A new agent application has been submitted and is waiting for review.')}
    ${infoTable([
      ['Name', applicantName],
      ['Email', applicantEmail],
      ['Services', services.slice(0, 4).join(', ') + (services.length > 4 ? ` +${services.length - 4} more` : '')],
      ['Submitted', new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })],
    ])}
    <div style="text-align:center;">
      ${btn('Review Application →', `${APP_URL}/admin/agents`)}
    </div>
  `;
  return resend.emails.send({
    from: FROM,
    to: adminEmail,
    subject: `New agent application from ${applicantName}`,
    html: baseLayout(content, 'New agent application — Veyro'),
  });
}
