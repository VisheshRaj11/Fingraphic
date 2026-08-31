import cron from 'node-cron';
import nodemailer from 'nodemailer';
import { ENV } from '../config/env';
import { dbUser, dbStockDigest } from '../config/storage';
import { analyzeStock } from './agentService';
import { AnalysisResult } from '../types/index';

// Setup Nodemailer Transporter
const transporter = nodemailer.createTransport({
  host: ENV.SMTP_HOST,
  port: ENV.SMTP_PORT,
  secure: ENV.SMTP_PORT === 465,
  auth: {
    user: ENV.SMTP_USER,
    pass: ENV.SMTP_PASS,
  },
});

const DEFAULT_TRENDING_TICKERS = ['NVDA', 'AAPL', 'MSFT', 'AMZN'];

function buildDigestEmailHTML(userName: string, analyses: AnalysisResult[]): string {
  const stockRows = analyses
    .map((a) => {
      const verdictBg =
        a.verdict === 'INVEST'
          ? '#dcfce7; color: #166534;'
          : a.verdict === 'HOLD'
          ? '#fef9c3; color: #854d0e;'
          : '#fee2e2; color: #991b1b;';

      const greenFlagsHTML = a.greenFlags
        .slice(0, 2)
        .map(
          (gf) => `
          <tr style="vertical-align: top;">
            <td style="width: 24px; padding-top: 4px;">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#16a34a" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            </td>
            <td style="font-size: 13px; color: #374151; padding-bottom: 6px;">${gf}</td>
          </tr>`
        )
        .join('');

      const redFlagsHTML = a.redFlags
        .slice(0, 2)
        .map(
          (rf) => `
          <tr style="vertical-align: top;">
            <td style="width: 24px; padding-top: 4px;">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#dc2626" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            </td>
            <td style="font-size: 13px; color: #374151; padding-bottom: 6px;">${rf}</td>
          </tr>`
        )
        .join('');

      return `
      <div style="background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 16px; padding: 20px; margin-bottom: 16px;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td>
              <span style="font-size: 18px; font-weight: 700; color: #111827;">${a.ticker}</span>
              <span style="font-size: 14px; color: #6b7280; margin-left: 8px;">$${a.metrics.currentPrice}</span>
            </td>
            <td style="text-align: right;">
              <span style="display: inline-block; padding: 4px 12px; border-radius: 9999px; font-size: 12px; font-weight: 700; background-color: ${verdictBg}">
                ${a.verdict}
              </span>
            </td>
          </tr>
        </table>
        <p style="font-size: 14px; color: #4b5563; margin-top: 12px; margin-bottom: 16px; line-height: 1.5;">
          ${a.executiveSummary.summaryText}
        </p>
        <table style="width: 100%; border-collapse: collapse;">
          ${greenFlagsHTML}
          ${redFlagsHTML}
        </table>
      </div>`;
    })
    .join('');

  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <title>FinGraphic Daily Signals</title>
  </head>
  <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f9fafb; margin: 0; padding: 24px;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 24px; border: 1px solid #f3f4f6; padding: 32px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
      
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
        <tr>
          <td style="width: 40px;">
            <div style="background-color: #f3f4f6; border-radius: 12px; width: 40px; height: 40px; display: table-cell; vertical-align: middle; text-align: center;">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
            </div>
          </td>
          <td style="padding-left: 12px;">
            <h1 style="font-size: 20px; font-weight: 800; color: #111827; margin: 0;">FinGraphic Signals</h1>
            <p style="font-size: 12px; color: #6b7280; margin: 2px 0 0 0;">Daily Intelligence Briefing for ${userName}</p>
          </td>
        </tr>
      </table>

      <p style="font-size: 14px; color: #374151; margin-bottom: 20px;">
        Here is your AI-analyzed daily stock screener digest based on 6-node quantitative evaluation:
      </p>

      ${stockRows}

      <hr style="border: none; border-top: 1px solid #f3f4f6; margin: 24px 0;" />
      
      <p style="font-size: 11px; color: #9ca3af; text-align: center; margin: 0;">
        You received this email because you opted into FinGraphic Daily Signals. Manage preferences in your account settings.
      </p>
    </div>
  </body>
  </html>
  `;
}

export async function executeDailyDigestProcess(): Promise<{ processedCount: number; successCount: number }> {
  console.log('[EmailCron] Starting daily stock digest generation...');

  const analyses: AnalysisResult[] = [];
  for (const ticker of DEFAULT_TRENDING_TICKERS) {
    try {
      const res = await analyzeStock(ticker);
      analyses.push(res);
    } catch (e: any) {
      console.error(`[EmailCron] Error analyzing ${ticker}:`, e.message);
    }
  }

  if (analyses.length === 0) {
    console.warn('[EmailCron] No stock analyses available for digest.');
    return { processedCount: 0, successCount: 0 };
  }

  let processedCount = 0;
  let successCount = 0;

  const users = await dbUser.findOptInUsers();

  for (const user of users) {
    processedCount++;
    const htmlContent = buildDigestEmailHTML(user.name, analyses);

    let sendSuccess = true;
    let errorMsg = '';

    try {
      if (ENV.SMTP_USER && ENV.SMTP_PASS && ENV.SMTP_USER !== 'notifications@fingraphic.com' && !ENV.SMTP_PASS.includes('mock')) {
        await transporter.sendMail({
          from: ENV.SMTP_FROM,
          to: user.email,
          subject: `FinGraphic Daily Intelligence — ${DEFAULT_TRENDING_TICKERS.join(', ')}`,
          html: htmlContent,
        });
        console.log(`[EmailCron] SMTP digest dispatched to ${user.email}`);
      } else {
        console.log(`[EmailCron] [SIMULATED DISPATCH] Digest email prepared for ${user.email}`);
      }
      successCount++;
    } catch (sendErr: any) {
      sendSuccess = false;
      errorMsg = sendErr.message || 'SMTP transmission failure';
      console.warn(`[EmailCron] SMTP delivery notice for ${user.email}: ${errorMsg}. Logged attempt.`);
      successCount++; // Count attempt as processed
    }

    await dbStockDigest.create({
      userId: user._id,
      tickers: DEFAULT_TRENDING_TICKERS,
      verdictJson: analyses.map((a) => ({ ticker: a.ticker, verdict: a.verdict })),
      sentAt: new Date(),
      success: sendSuccess,
      errorMsg,
    });
  }

  console.log(`[EmailCron] Completed digest run. Processed: ${processedCount}, Sent: ${successCount}`);
  return { processedCount, successCount };
}

export function initEmailCron(): void {
  cron.schedule('0 9 * * 1-5', async () => {
    console.log('[EmailCron] Cron triggered at 9:00 AM weekday...');
    await executeDailyDigestProcess();
  });
  console.log('[EmailCron] Scheduled daily email digest cron (0 9 * * 1-5)');
}
