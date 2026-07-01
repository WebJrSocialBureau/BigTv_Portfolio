import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://webjrsocialbureau_db_user:B4itoH5hkl1SNT5M@cluster0.alkes18.mongodb.net/?appName=Cluster0';

await mongoose.connect(MONGO_URI);
console.log('Connected to MongoDB.');

const User = mongoose.model('User', new mongoose.Schema({}, { strict: false }));
const aparna = await User.findOne({ email: 'aparna@bigtv.com' });

if (!aparna) {
  console.log('Aparna user not found.');
  process.exit(1);
}

const blogs = aparna.portfolio?.blogs || [];
console.log(`Aparna blog count: ${blogs.length}`);

const defaultBlogs = [
  {
    title: "The Art of Live Anchoring: Staying Composed When the World is Watching",
    date: "June 20, 2026",
    excerpt: "Two decades in front of the camera have taught me that composure under pressure is not a gift — it is a discipline, earned through preparation and an unwavering commitment to the viewer.",
    content: "Every anchor who has ever held a live bulletin during a breaking crisis knows the feeling: the earpiece crackles, the script is obsolete, and millions are watching. It is in that precise moment — when everything is unplanned — that the real craft of anchoring reveals itself.\n\nIn my twenty-plus years of broadcast journalism, from the regional desks of Asianet to the primetime studios of Mathrubhumi News and now BIG TV 24/7, I have stood at that precipice countless times. Floods that rewrote Kerala's geography overnight. Election nights where results defied every projected trend. Cabinet reshuffles that no political analyst had predicted. In each of those moments, the anchor's role is not simply to read — it is to be the steady, trusted voice that holds the public's hand through the chaos.\n\nComposure under pressure is not a natural gift. It is a practice. My preparation before any live bulletin begins hours in advance — not just reading wire dispatches and ministry briefs, but understanding the emotional register of the story. A flood is not a statistic; it is a village submerged. A political transition is not just a cabinet list; it is the weight of public mandate carried forward. When an anchor understands what a story means to the people living it, the words carry differently. The viewer feels held, not merely informed.\n\nPerhaps the single greatest discipline live broadcasting has taught me is silence. The instinct, when something unexpected breaks, is to fill every second with words. But silence — a measured, deliberate pause — communicates composure more powerfully than any sentence. It says: I know what is happening. I am in control of this moment. I will guide you through.\n\nFor every young journalist stepping in front of a camera today, I would offer this: rehearse your knowledge, not just your script. The script will fail you. Your knowledge never will."
  },
  {
    title: "Women in Broadcast Journalism: Rewriting the Narrative, One Bulletin at a Time",
    date: "May 14, 2026",
    excerpt: "When I walked into my first newsroom, I was often the only woman at the editorial table. Two decades later, that has changed — but the work is far from finished.",
    content: "There is a particular kind of silence that greets a woman who walks into a high-stakes editorial meeting with conviction. I have known that silence intimately. Not hostile, not exactly — but watchful. Waiting to see whether she would shrink or occupy the space she deserved.\n\nI chose to occupy it.\n\nWhen I began my career in broadcast journalism, the industry was structured — architecturally, culturally, and ideologically — around a certain kind of authority. Mostly male. Mostly older. Deeply hierarchical. Women were welcome as long as they were decorative, as long as their opinions aligned with the existing current, as long as they did not disrupt the editorial consensus too loudly.\n\nI was not particularly good at any of those conditions.\n\nOver the past two decades, I have anchored coverage of some of India's most consequential political moments. I have moderated panel discussions where senior politicians attempted to talk over my questions. I have produced investigative specials — including the State Award-winning 'Special Correspondent' series at Mathrubhumi News — that demanded sources, courage, and the editorial authority to push a story forward even when institutional pressures pushed back.\n\nAnd throughout all of it, I have watched the newsroom change. Slowly, imperfectly, but meaningfully. Today, when I look across the BIG TV 24/7 studio floor, I see young women who anchor without apology. Who challenge guests with precision. Who produce stories that move policy.\n\nBut representation at the front of camera must translate into authority behind the camera as well. Editorial leadership — the decisions about which stories get told, how they are framed, whose voices are centered — must reflect the full diversity of the societies we serve. Until it does, the work continues.\n\nI am not done disrupting the silence."
  },
  {
    title: "Beyond Breaking News: Why Long-Form Current Affairs Storytelling Still Matters",
    date: "April 3, 2026",
    excerpt: "In an era of sixty-second news cycles and algorithmic feeds, the most important journalism we can do is slow down — and go deeper.",
    content: "The breaking news ticker never sleeps. In our current media landscape, a political crisis can cycle from revelation to analysis to archive in under four hours. The speed is remarkable. The depth, often, is not.\n\nI have spent a significant portion of my career working in the space between the instant bulletin and the long-form documentary — in the current affairs format that asks not merely 'what happened?' but 'why did it happen, and what does it mean for the people it affects?' This is the territory I explored through programmes like 'Special Correspondent' and 'Parayanundu', and it remains, for me, the most meaningful work broadcast journalism can produce.\n\nCurrent affairs storytelling done well requires a different kind of patience than breaking news. It requires a journalist to sit with a community, not just a correspondent's report about one. It requires the editorial courage to give a story the screen time its complexity demands, even when metrics suggest that shorter performs better.\n\nThe argument that audiences no longer have the attention for long-form programming is, in my experience, simply false. What audiences reject is not length — they reject inauthenticity. They can tell when a panel debate is performance rather than substance. They can tell when a 'documentary' is a press release with cinematography. What they hunger for — and what they will still give their full attention to — is a story that trusts them with its full complexity.\n\nThe finest journalism I have been part of has always involved this trust. A series about women who fought for property rights in rural Kerala. An investigation into the human cost of infrastructure displacement. Stories that took weeks of reporting and thirty minutes of air time — and were remembered for years afterward.\n\nIn the race to be first, we must not forget the obligation to be thorough. The news cycle will always move on. The story, told well, will not."
  }
];

const existingTitles = new Set(blogs.map(b => b.title));
const toAdd = defaultBlogs.filter(b => !existingTitles.has(b.title));

if (toAdd.length > 0) {
  await User.updateOne(
    { email: 'aparna@bigtv.com' },
    { $push: { 'portfolio.blogs': { $each: toAdd } } }
  );
  console.log(`✅ Added ${toAdd.length} new blog article(s) to Aparna Kurup.`);
  toAdd.forEach((b, i) => console.log(`  ${i+1}. ${b.title}`));
} else {
  console.log('ℹ️  All default blogs already exist. No changes made.');
}

await mongoose.disconnect();
process.exit(0);
