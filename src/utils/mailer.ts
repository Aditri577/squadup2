import nodemailer, { type Transporter } from 'nodemailer';

interface SendMailOptions {
  to: string;
  subject: string;
  html: string;
}

let cachedTransporter: Transporter | null = null;

export async function getTransporter(): Promise<Transporter | null> {
  if (cachedTransporter) return cachedTransporter;

  const emailUser = process.env.EMAIL_USER;
  const emailPass = process.env.EMAIL_PASS;
  const smtpHost = process.env.SMTP_HOST;

  if (smtpHost && emailUser && emailPass) {
    cachedTransporter = nodemailer.createTransport({
      host: smtpHost,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === 'true',
      auth: { user: emailUser, pass: emailPass }
    });
    return cachedTransporter;
  }

  if (emailUser && emailPass) {
    cachedTransporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE || 'gmail',
      auth: { user: emailUser, pass: emailPass }
    });
    return cachedTransporter;
  }

  return null;
}

export async function sendSquadEmail({ to, subject, html }: SendMailOptions) {
  try {
    const transporter = await getTransporter();
    const fromAddress = process.env.EMAIL_FROM || process.env.EMAIL_USER || '"SquadUP Portal" <notifications@squadup.dev>';

    if (transporter) {
      const info = await transporter.sendMail({
        from: fromAddress,
        to,
        subject,
        html
      });
      console.log(`[SquadUP Mailer] Email dispatched to ${to}. MessageId: ${info.messageId}`);
      return { success: true, messageId: info.messageId, mode: 'live' };
    } else {
      // Fallback: Resilient logging with mock dispatch for dev & testing without credentials
      console.log(`\n======================================================`);
      console.log(`📧 [SQUADUP EMAIL ENGINE - SIMULATED DISPATCH]`);
      console.log(`To: ${to}`);
      console.log(`Subject: ${subject}`);
      console.log(`Status: Successfully delivered to virtual inbox`);
      console.log(`(Configure EMAIL_USER & EMAIL_PASS in .env for live inbox delivery)`);
      console.log(`======================================================\n`);
      return { 
        success: true, 
        messageId: `mock-${Date.now()}`, 
        mode: 'simulated',
        note: 'Email simulated. Configure EMAIL_USER and EMAIL_PASS in .env for live inbox delivery.'
      };
    }
  } catch (error: any) {
    console.error(`[SquadUP Mailer Error] Failed to send email to ${to}:`, error.message);
    return { success: false, error: error.message };
  }
}

/**
 * SquadUP Branded HTML Template: Hackathon Registration Pass
 */
export function getSquadRegistrationEmailHtml(params: {
  hackathonTitle: string;
  teamName: string;
  inviteCode: string;
  userName?: string;
  baseUrl?: string;
}) {
  const base = params.baseUrl || process.env.APP_BASE_URL || 'http://localhost:3000';
  const joinUrl = `${base}/teams?joinCode=${params.inviteCode}`;

  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <style>
      body { margin: 0; padding: 0; background-color: #06040d; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #f1f5f9; }
      .container { max-width: 600px; margin: 30px auto; background: #0c0819; border: 1px solid rgba(168, 85, 247, 0.25); border-radius: 20px; overflow: hidden; box-shadow: 0 20px 50px rgba(0, 0, 0, 0.7); }
      .header { padding: 36px 30px 24px; text-align: center; background: radial-gradient(circle at top, rgba(168, 85, 247, 0.18), transparent 70%); }
      .brand { font-size: 26px; font-weight: 900; letter-spacing: 2px; color: #ffffff; margin-bottom: 6px; }
      .brand span { color: #a855f7; }
      .badge-pill { display: inline-block; padding: 4px 14px; border-radius: 9999px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; background: rgba(168, 85, 247, 0.15); border: 1px solid rgba(168, 85, 247, 0.35); color: #c084fc; margin-bottom: 12px; }
      .hero-title { font-size: 22px; font-weight: 800; color: #ffffff; line-height: 1.3; margin: 10px 0 6px; }
      .content { padding: 0 32px 36px; }
      .card { background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 14px; padding: 22px; margin: 20px 0; }
      .card-title { font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #94a3b8; margin-bottom: 12px; }
      .hackathon-name { font-size: 17px; font-weight: 700; color: #38bdf8; margin-bottom: 6px; }
      .squad-name { font-size: 15px; font-weight: 600; color: #e2e8f0; }
      .code-box { background: #07050e; border: 1px dashed rgba(168, 85, 247, 0.5); border-radius: 12px; padding: 18px; text-align: center; margin: 20px 0; }
      .code-label { font-size: 11px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; color: #a855f7; margin-bottom: 6px; }
      .code-value { font-family: 'Courier New', monospace; font-size: 28px; font-weight: 900; letter-spacing: 4px; color: #ffffff; text-shadow: 0 0 12px rgba(168, 85, 247, 0.6); }
      .btn { display: block; width: fit-content; margin: 28px auto 10px; padding: 14px 36px; background: linear-gradient(135deg, #9333ea, #6366f1); border-radius: 9999px; color: #ffffff; text-decoration: none; font-weight: 800; font-size: 13px; text-transform: uppercase; letter-spacing: 1px; box-shadow: 0 10px 25px rgba(147, 51, 234, 0.4); text-align: center; }
      .footer { border-top: 1px solid rgba(255, 255, 255, 0.06); padding: 24px; text-align: center; font-size: 11px; color: #64748b; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <div class="badge-pill">Verified Builder Pass</div>
        <div class="brand">SQUAD<span>UP</span></div>
        <div class="hero-title">You're Registered for the Hackathon!</div>
      </div>
      <div class="content">
        <p style="color: #94a3b8; font-size: 14px; text-align: center; margin-bottom: 24px;">
          Hey ${params.userName || 'Builder'}, your entry has been locked in. Assemble your squad, verify your skill badges, and build something epic.
        </p>
        
        <div class="card">
          <div class="card-title">Hackathon Registration Summary</div>
          <div class="hackathon-name">🎯 ${params.hackathonTitle}</div>
          <div class="squad-name">🛡️ Assigned Squad: <strong>${params.teamName || 'Independent Builder'}</strong></div>
        </div>

        <div class="code-box">
          <div class="code-label">Your Squad Invite Code</div>
          <div class="code-value">${params.inviteCode}</div>
          <div style="font-size: 11px; color: #64748b; margin-top: 6px;">Share this code with teammates so they can join your squad directly.</div>
        </div>

        <a href="${joinUrl}" class="btn">⚡ Open Squad Workspace</a>

        <div style="text-align: center; margin-top: 16px;">
          <span style="font-size: 11px; color: #64748b;">Direct link: <a href="${joinUrl}" style="color: #a855f7; text-decoration: none;">${joinUrl}</a></span>
        </div>
      </div>
      <div class="footer">
        SquadUP — AI-Powered Verified Skill Hackathon Formation Platform<br>
        Anti-Cheat Proctored Assessments • Skill Synergy AI • Live Sprint Workspaces
      </div>
    </div>
  </body>
  </html>
  `;
}

/**
 * SquadUP Branded HTML Template: Teammate Invitation & AI Synergy Card
 */
export function getSquadInviteEmailHtml(params: {
  senderName: string;
  senderRole: string;
  teamName: string;
  hackathonTitle: string;
  proposedRole: string;
  inviteCode: string;
  personalMessage?: string;
  synergyScore?: number;
  baseUrl?: string;
}) {
  const base = params.baseUrl || process.env.APP_BASE_URL || 'http://localhost:3000';
  const joinUrl = `${base}/teams?joinCode=${params.inviteCode}`;
  const score = params.synergyScore || 94;

  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <style>
      body { margin: 0; padding: 0; background-color: #06040d; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #f1f5f9; }
      .container { max-width: 600px; margin: 30px auto; background: #0c0819; border: 1px solid rgba(168, 85, 247, 0.25); border-radius: 20px; overflow: hidden; box-shadow: 0 20px 50px rgba(0, 0, 0, 0.7); }
      .header { padding: 36px 30px 24px; text-align: center; background: radial-gradient(circle at top, rgba(99, 102, 241, 0.2), transparent 70%); }
      .brand { font-size: 26px; font-weight: 900; letter-spacing: 2px; color: #ffffff; margin-bottom: 6px; }
      .brand span { color: #a855f7; }
      .badge-pill { display: inline-block; padding: 4px 14px; border-radius: 9999px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; background: rgba(56, 189, 248, 0.15); border: 1px solid rgba(56, 189, 248, 0.35); color: #38bdf8; margin-bottom: 12px; }
      .hero-title { font-size: 22px; font-weight: 800; color: #ffffff; line-height: 1.3; margin: 10px 0 6px; }
      .content { padding: 0 32px 36px; }
      .card { background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 14px; padding: 20px; margin: 18px 0; }
      .synergy-badge { display: flex; align-items: center; justify-content: space-between; background: linear-gradient(90deg, rgba(168, 85, 247, 0.12), rgba(56, 189, 248, 0.12)); border: 1px solid rgba(168, 85, 247, 0.3); border-radius: 10px; padding: 12px 16px; margin: 16px 0; }
      .synergy-score { font-size: 20px; font-weight: 900; color: #38bdf8; }
      .message-box { background: rgba(0, 0, 0, 0.25); border-left: 3px solid #a855f7; border-radius: 4px; padding: 12px 16px; font-style: italic; color: #cbd5e1; font-size: 13px; margin: 16px 0; }
      .btn { display: block; width: fit-content; margin: 28px auto 10px; padding: 14px 36px; background: linear-gradient(135deg, #a855f7, #3b82f6); border-radius: 9999px; color: #ffffff; text-decoration: none; font-weight: 800; font-size: 13px; text-transform: uppercase; letter-spacing: 1px; box-shadow: 0 10px 25px rgba(168, 85, 247, 0.4); text-align: center; }
      .footer { border-top: 1px solid rgba(255, 255, 255, 0.06); padding: 24px; text-align: center; font-size: 11px; color: #64748b; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <div class="badge-pill">New Squad Invitation</div>
        <div class="brand">SQUAD<span>UP</span></div>
        <div class="hero-title">${params.senderName} invited you to join "${params.teamName}"</div>
      </div>
      <div class="content">
        <p style="color: #94a3b8; font-size: 14px; text-align: center;">
          You've been scouted based on your <strong>Verified Skill Badges</strong> for the upcoming <strong>${params.hackathonTitle}</strong>!
        </p>

        <div class="card">
          <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #94a3b8; margin-bottom: 8px;">Squad Scout Details</div>
          <div style="font-size: 15px; color: #ffffff;"><strong>Leader:</strong> ${params.senderName} (${params.senderRole})</div>
          <div style="font-size: 15px; color: #ffffff; margin-top: 4px;"><strong>Target Role For You:</strong> <span style="color: #a855f7; font-weight: 700;">${params.proposedRole}</span></div>
          <div style="font-size: 13px; color: #94a3b8; margin-top: 4px;"><strong>Hackathon:</strong> ${params.hackathonTitle}</div>
        </div>

        <div class="synergy-badge">
          <div>
            <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #a855f7;">Gemini AI Skill Synergy</div>
            <div style="font-size: 12px; color: #94a3b8;">High technical complementarity with existing squad</div>
          </div>
          <div class="synergy-score">${score}% MATCH</div>
        </div>

        ${params.personalMessage ? `
          <div class="message-box">
            "${params.personalMessage}"
          </div>
        ` : ''}

        <a href="${joinUrl}" class="btn">🚀 Accept & Launch Squad Workspace</a>

        <div style="text-align: center; margin-top: 16px;">
          <span style="font-size: 11px; color: #64748b;">Invite Code: <strong>${params.inviteCode}</strong> • Click button above to auto-join.</span>
        </div>
      </div>
      <div class="footer">
        SquadUP — AI-Powered Verified Skill Hackathon Formation Platform<br>
        Proctored Skill Badges • Gemini Synergy Engine • Live Sprint Workspaces
      </div>
    </div>
  </body>
  </html>
  `;
}
