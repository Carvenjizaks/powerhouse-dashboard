/**
 * Powerhouse Morning Reminder Script
 * Run via cron: 0 6 * * *
 * Sends email with today's checklist via AgentMail
 */

const API_KEY = "am_us_78feac149533f2690272c115d8b60b9272ea3ad9249efe27d5dc847c0eb409e0";

async function sendMorningEmail() {
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const body = `👑 KINGDOM BUILDING — Daily Focus • ${today}

Good morning, Carven.

Here are your 5 priorities today:

━━━ 👑 KINGDOM BUILDING ━━━
☐ a) LeadersLAB — Invest in a future leader
☐ b) Powerhouse Academy — Move the plan forward (1 step)
☐ c) Discipleship + Demonstration — Pour into someone today

━━━ 🧑 PERSONAL ━━━
☐ d) Read 1hr + Write 1 Chapter — 2 books by 30 Nov 2026 🎯
☐ e) Exercise 1.5hr — Steward your body

━━━━━━━━━━━━━━━━━━━━
"The harvest is plentiful, but the workers are few." — Luke 10:2

Track your progress: https://carvenjizaks-dashboard.vercel.app/dashboard
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
      subject: `👑 Carvenjizaks — Today's Focus (${today})`,
      text: body,
    }),
  });

  const data = await response.json();
  console.log(`[${new Date().toISOString()}] Morning email sent:`, data);
}

sendMorningEmail().catch(console.error);
