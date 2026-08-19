/**
 * Powerhouse Evening Review Script
 * Run via cron: 0 21 * * *
 * Sends accountability scorecard via AgentMail
 */

const API_KEY = "am_us_78feac149533f2690272c115d8b60b9272ea3ad9249efe27d5dc847c0eb409e0";

async function sendEveningEmail() {
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const body = `⚡ POWERHOUSE — Evening Review • ${today}

Time to review your day. Be honest.

━━━ ⚡ POWERHOUSE ━━━
[ ] a) LeadersLAB — Did you invest in a leader?
[ ] b) Powerhouse Academy — Did you move it forward?
[ ] c) Discipleship — Did you pour into someone?

━━━ 🧑 PERSONAL ━━━
[ ] d) Read 1hr + Write 1 Chapter — Did you do it?
[ ] e) Exercise 1.5hr — Did you move?

━━━━━━━━━━━━━━━━━━━━
Score: __ / 5

"Examine yourselves to see whether you are in the faith; test yourselves."
— 2 Corinthians 13:5

Log your answers: https://carvenjizaks-dashboard.vercel.app/dashboard
━━━━━━━━━━━━━━━━━━━━
`;

  const response = await fetch("https://api.agentmail.to/v1/send", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "carvenjiz@agentmail.to",
      to: "carvenjizaks@gmail.com",
      subject: `⚡ Carvenjizaks — Evening Review (${today})`,
      text: body,
    }),
  });

  const data = await response.json();
  console.log(`[${new Date().toISOString()}] Evening email sent:`, data);
}

sendEveningEmail().catch(console.error);
