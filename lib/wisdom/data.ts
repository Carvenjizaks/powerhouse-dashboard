/**
 * Curated wisdom for daily reflection
 * Sources: John Maxwell (leadership), Dale Carnegie (time/people), Scripture (Jesus' life)
 */

export interface WisdomEntry {
  id: number;
  quote: string;
  author: string;
  source: string;
  category: "leadership" | "discipline" | "time" | "purpose" | "rest" | "people" | "faith";
  application: string; // practical "how to apply this today"
}

export function getWisdomForDate(dateStr: string): WisdomEntry {
  // Use the date to pick a deterministic entry
  const dayOfYear = dayOfYearFrom(dateStr);
  const index = dayOfYear % wisdom.length;
  return wisdom[index];
}

export function getWisdomByCategory(category: WisdomEntry["category"]): WisdomEntry[] {
  return wisdom.filter((w) => w.category === category);
}

function dayOfYearFrom(dateStr: string): number {
  const d = new Date(dateStr + "T00:00:00");
  const start = new Date(d.getFullYear(), 0, 0);
  const diff = d.getTime() - start.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

// ── The Wisdom Collection ──────────────────────────────
const wisdom: WisdomEntry[] = [
  // ══════════════════════════════════════════════════════
  // JOHN MAXWELL — Leadership
  // ══════════════════════════════════════════════════════
  {
    id: 1,
    quote: "Leadership is influence — nothing more, nothing less.",
    author: "John Maxwell",
    source: "The 21 Irrefutable Laws of Leadership",
    category: "leadership",
    application: "Who are you influencing today? Influence isn't position — it's presence. Pour into one person intentionally.",
  },
  {
    id: 2,
    quote: "Discipline is doing what you need to do, even when you don't feel like doing it.",
    author: "John Maxwell",
    source: "The 15 Invaluable Laws of Growth",
    category: "discipline",
    application: "Feelings follow action, not the other way around. Do the task first; the motivation will come.",
  },
  {
    id: 3,
    quote: "The greatest day in your life is when you take total responsibility for your choices.",
    author: "John Maxwell",
    source: "The 15 Invaluable Laws of Growth",
    category: "discipline",
    application: "Own your day. No blame, no excuses. You chose this path — now walk it with excellence.",
  },
  {
    id: 4,
    quote: "A leader is one who knows the way, goes the way, and shows the way.",
    author: "John Maxwell",
    source: "The 21 Irrefutable Laws of Leadership",
    category: "leadership",
    application: "You can't lead where you haven't been. Model the discipline you want to see in your leaders.",
  },
  {
    id: 5,
    quote: "People don't care how much you know until they know how much you care.",
    author: "John Maxwell",
    source: "The 21 Irrefutable Laws of Leadership",
    category: "people",
    application: "Before you teach, connect. Before you correct, affirm. Listen first, speak second.",
  },
  {
    id: 6,
    quote: "The Law of the Lid: Leadership ability determines a person's level of effectiveness.",
    author: "John Maxwell",
    source: "The 21 Irrefutable Laws of Leadership",
    category: "leadership",
    application: "Your ceiling is your leadership. To grow your impact, grow yourself first.",
  },
  {
    id: 7,
    quote: "You cannot overestimate the unimportance of practically everything.",
    author: "John Maxwell",
    source: "The 15 Invaluable Laws of Growth",
    category: "time",
    application: "Most of what you worry about won't matter in a year. Focus your energy on what outlasts you.",
  },
  {
    id: 8,
    quote: "The secret of your success is determined by your daily agenda.",
    author: "John Maxwell",
    source: "Today Matters",
    category: "time",
    application: "Your calendar is your confession. What you schedule reveals what you truly value.",
  },

  // ══════════════════════════════════════════════════════
  // DALE CARNEGIE — Time, People, Discipline
  // ══════════════════════════════════════════════════════
  {
    id: 9,
    quote: "Take a chance! All life is a chance. The man who goes furthest is generally the one who is willing to do and dare.",
    author: "Dale Carnegie",
    source: "How to Stop Worrying and Start Living",
    category: "discipline",
    application: "Fear of failure paralyzes more people than failure itself. Take one bold step today.",
  },
  {
    id: 10,
    quote: "You can make more friends in two months by becoming interested in other people than you can in two years by trying to get other people interested in you.",
    author: "Dale Carnegie",
    source: "How to Win Friends and Influence People",
    category: "people",
    application: "Stop trying to impress. Start being curious. Ask questions. Listen. Care.",
  },
  {
    id: 11,
    quote: "Inaction breeds doubt and fear. Action breeds confidence and courage.",
    author: "Dale Carnegie",
    source: "How to Stop Worrying and Start Living",
    category: "discipline",
    application: "When you don't feel like doing it — that's exactly when you must move. Action kills fear.",
  },
  {
    id: 12,
    quote: "Don't be afraid to give your best to what seemingly are small jobs.",
    author: "Dale Carnegie",
    source: "How to Stop Worrying and Start Living",
    category: "time",
    application: "Every big win is a collection of small tasks done well. Honour the small things.",
  },
  {
    id: 13,
    quote: "Our fatigue is often caused not by work, but by worry, frustration and resentment.",
    author: "Dale Carnegie",
    source: "How to Stop Worrying and Start Living",
    category: "rest",
    application: "What mental burden are you carrying right now that isn't yours to carry? Lay it down.",
  },
  {
    id: 14,
    quote: "When we hate our enemies, we are giving them power over us — power to disturb our sleep, our appetite, our happiness.",
    author: "Dale Carnegie",
    source: "How to Stop Worrying and Start Living",
    category: "people",
    application: "Forgiveness isn't for them — it's for you. Release the offense and reclaim your peace.",
  },
  {
    id: 15,
    quote: "The successful man will profit from his mistakes and try again in a different way.",
    author: "Dale Carnegie",
    source: "How to Win Friends and Influence People",
    category: "discipline",
    application: "Failure is data, not destiny. What did yesterday teach you? Adjust and move forward.",
  },
  {
    id: 16,
    quote: "Happiness doesn't depend on outward conditions — it depends on inner attitudes.",
    author: "Dale Carnegie",
    source: "How to Stop Worrying and Start Living",
    category: "purpose",
    application: "You can't control what happens to you, but you can control your response. Choose gratitude.",
  },

  // ══════════════════════════════════════════════════════
  // JESUS — The Ultimate Model
  // ══════════════════════════════════════════════════════
  {
    id: 17,
    quote: "Rising very early in the morning, while it was still dark, He departed and went out to a desolate place, and there He prayed.",
    author: "Jesus Christ",
    source: "Mark 1:35",
    category: "purpose",
    application: "Before the demands of the day, Jesus prioritized connection with the Father. Your day will reflect what you do BEFORE the day begins. Start with prayer, not phone.",
  },
  {
    id: 18,
    quote: "I must be about My Father's business.",
    author: "Jesus Christ",
    source: "Luke 2:49",
    category: "purpose",
    application: "Jesus lived with a clear mission. Everything He did flowed from one purpose. What is YOUR Father's business for today? Let it guide every decision.",
  },
  {
    id: 19,
    quote: "Come away by yourselves to a desolate place and rest a while.",
    author: "Jesus Christ",
    source: "Mark 6:31",
    category: "rest",
    application: "Jesus didn't burn out for the Kingdom — He modelled rhythm: work, then rest; pour out, then refill. Rest is not laziness; it's stewardship of your vessel.",
  },
  {
    id: 20,
    quote: "He appointed twelve that they might be with Him and that He might send them out.",
    author: "Jesus Christ",
    source: "Mark 3:14",
    category: "leadership",
    application: "Jesus invested deeply in a few, not shallowly in many. Your LeadersLAB matters. Pour into your twelve.",
  },
  {
    id: 21,
    quote: "My food is to do the will of Him who sent Me and to accomplish His work.",
    author: "Jesus Christ",
    source: "John 4:34",
    category: "purpose",
    application: "Jesus was sustained by purpose, not productivity. When the work feels heavy, remember WHO you're serving, not just WHAT you're doing.",
  },
  {
    id: 22,
    quote: "Truly, truly, I say to you, the Son can do nothing of His own accord, but only what He sees the Father doing.",
    author: "Jesus Christ",
    source: "John 5:19",
    category: "faith",
    application: "Jesus didn't operate on His own initiative — He watched what the Father was doing and joined in. Ask: 'What is God doing here, and how can I join?'",
  },
  {
    id: 23,
    quote: "He had compassion on them because they were like sheep without a shepherd.",
    author: "Jesus Christ",
    source: "Mark 6:34",
    category: "people",
    application: "Before Jesus taught, He felt. Before He acted, He saw. Lead with compassion, not just efficiency. People are not projects.",
  },
  {
    id: 24,
    quote: "Not My will, but Yours be done.",
    author: "Jesus Christ",
    source: "Luke 22:42",
    category: "faith",
    application: "The ultimate surrender. Your plans, your comfort, your timeline — laid down before the Father. That's where real power comes from.",
  },
  {
    id: 25,
    quote: "Are you not worth much more than the birds? ... Do not be anxious about tomorrow.",
    author: "Jesus Christ",
    source: "Matthew 6:26-34",
    category: "rest",
    application: "Trust is the antidote to anxiety. You're not carrying the world alone — the Father knows what you need. Do today's work and leave tomorrow to Him.",
  },
  {
    id: 26,
    quote: "Therefore be wise as serpents and innocent as doves.",
    author: "Jesus Christ",
    source: "Matthew 10:16",
    category: "time",
    application: "Wisdom without innocence becomes manipulation. Innocence without wisdom becomes naivety. Lead with both — shrewd in strategy, pure in heart.",
  },
  {
    id: 27,
    quote: "He said to them, 'Let us go on to the next towns, that I may preach there also, for that is why I came out.'",
    author: "Jesus Christ",
    source: "Mark 1:38",
    category: "purpose",
    application: "Jesus didn't let success in one place distract Him from His mission. Finish well where you are, then move where He leads.",
  },
  {
    id: 28,
    quote: "You give them something to eat.",
    author: "Jesus Christ",
    source: "Mark 6:37",
    category: "leadership",
    application: "Jesus turned the problem back to the disciples. He didn't just solve it — He developed them. Don't do everything yourself. Empower your people.",
  },

  // ══════════════════���═══════���═══════════════════════════
  // PRACTICAL WISDOM — Life Balance & Discipline
  // ══════════════════════════════════════════════════════
  {
    id: 29,
    quote: "The key is not to prioritize what's on your schedule, but to schedule your priorities.",
    author: "Stephen Covey",
    source: "The 7 Habits of Highly Effective People",
    category: "time",
    application: "Your calendar should reflect your values, not your emergencies. Block time for what matters before the urgent steals it.",
  },
  {
    id: 30,
    quote: "Between stimulus and response there is a space. In that space is our power to choose our response.",
    author: "Viktor Frankl",
    source: "Man's Search for Meaning",
    category: "discipline",
    application: "When frustration hits, pause before reacting. That pause is where freedom lives. Breathe. Pray. Then respond.",
  },
  {
    id: 31,
    quote: "He who is faithful in a very little thing is faithful also in much.",
    author: "Jesus Christ",
    source: "Luke 16:10",
    category: "discipline",
    application: "Small disciplines done daily create extraordinary results. The little things are not little — they are everything.",
  },
  {
    id: 32,
    quote: "Whether therefore you eat or drink, or whatever you do, do all to the glory of God.",
    author: "Apostle Paul",
    source: "1 Corinthians 10:31",
    category: "purpose",
    application: "There is no sacred vs. secular divide. Your work, your rest, your exercise — all of it is worship when done for His glory.",
  },
];

export { wisdom };
