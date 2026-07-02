import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://webjrsocialbureau_db_user:B4itoH5hkl1SNT5M@cluster0.alkes18.mongodb.net/?appName=Cluster0';

// Connect to MongoDB
mongoose.connect(MONGO_URI)
  .then(() => console.log('Connected to MongoDB database cluster.'))
  .catch(err => console.error('MongoDB database connection error:', err));

// Sub-schemas for Portfolio Page Sections
const BlogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  date: { type: String, required: true },
  excerpt: { type: String },
  content: { type: String },
  image: { type: String }
}, { timestamps: true });

const EventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  date: { type: String, required: true },
  location: { type: String },
  desc: { type: String }
}, { timestamps: true });

const PillarSchema = new mongoose.Schema({
  title: { type: String },
  desc: { type: String }
});

const TimelineItemSchema = new mongoose.Schema({
  period: { type: String },
  title: { type: String },
  desc: { type: String },
  tags: [{ type: String }]
});

const BroadcastHighlightSchema = new mongoose.Schema({
  period: { type: String },
  station: { type: String },
  title: { type: String },
  desc: { type: String }
});

const AwardSchema = new mongoose.Schema({
  title: { type: String },
  category: { type: String },
  desc: { type: String }
});

const PortfolioSchema = new mongoose.Schema({
  heroTitle: { type: String },
  heroSubtitle: { type: String },
  pillars: [PillarSchema],
  timeline: [TimelineItemSchema],
  broadcastHighlights: [BroadcastHighlightSchema],
  awards: [AwardSchema],
  blogs: [BlogSchema],
  events: [EventSchema],
  youtubeLink: { type: String }
});

// User Schema Definition
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  division: {
    type: String,
    default: 'General Division'
  },
  bio: {
    type: String,
    default: 'Accredited newsroom correspondent.'
  },
  status: {
    type: String,
    default: 'PENDING VERIFICATION'
  },
  isPaid: {
    type: Boolean,
    default: false
  },
  portfolio: {
    type: PortfolioSchema,
    default: () => ({})
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Configure virtual id to map to _id for compatibility
UserSchema.virtual('id').get(function() {
  return this._id.toHexString();
});

const User = mongoose.model('User', UserSchema);

// Default portfolio configuration for Ganesh Yarakala
const defaultGaneshPortfolio = {
  heroTitle: "A Legacy of Truth: Journalism Reimagined",
  heroSubtitle: "Associate Editor at BIG TV. Veteran investigative journalist. Mentoring the next generation of truth-seekers after a storied 14-year tenure at TV9.",
  pillars: [
    {
      title: "Investigative Excellence",
      desc: "Uncovering what is hidden through rigorous verification, data validation, and an unwavering eye for detail that defined decades of prime-time reporting."
    },
    {
      title: "Fearless Reporting",
      desc: "A career built on the front lines of conflict, challenging administrative frameworks, and giving voice to marginalized populations in critical socio-political climates."
    },
    {
      title: "Broadcast Mentorship",
      desc: "Cultivating professional journalistic talent at both BIG TV and TV9 networks, ensuring critical core values thrive in the age of rapid content loops."
    }
  ],
  timeline: [
    {
      period: "PRESENT — ASSOCIATE EDITOR",
      title: "BIG TV Broadcast & Digital",
      desc: "Leading regional newsroom synergy across digital and satellite television operations. Directing investigative bureaus, overseeing governance, and designing long-form broadcast dossiers.",
      tags: ["Media Architecture", "Sat Broadcast"]
    },
    {
      period: "2008 — 2022 (14 YEARS)",
      title: "Senior Editorial Leader, TV9",
      desc: "A defining era of ground-breaking field reporting. Headed core political investigative units and anchored prime-time segments. Pioneered regional news gathering frameworks and trained 80+ junior media professionals.",
      tags: ["Live Anchor", "Field Investigation"]
    },
    {
      period: "1998 — 2008",
      title: "Print Media & Regional Foundations",
      desc: "Began the journalistic pursuit as an intern with the Vishalandhra publication bureau. Mastered traditional investigative copy editing, field correspondence, and community journalism.",
      tags: ["Print Room", "Copy Editing"]
    }
  ],
  broadcastHighlights: [
    {
      period: "Present",
      station: "BIG TV NETWORK",
      title: "Regional Digital & Broadcast Synergy",
      desc: "Leading regional digital and broadcast synergy, overseeing prime-time investigative features and newsroom governance."
    },
    {
      period: "2008 — 2022",
      station: "TV9 TENURE",
      title: "Senior Editorial Leadership",
      desc: "A foundational era of ground-breaking reporting, rising through the ranks to senior editorial leadership while shaping the channel's most impactful stories."
    },
    {
      period: "1998 — 2008",
      station: "VISHALANDHRA",
      title: "Print & Regional Foundations",
      desc: "Starting as an intern at Vishalandhra, mastering the craft of long-form reporting and print integrity across regional bureaus."
    }
  ],
  awards: [
    {
      title: "Ramnath Goenka Excellence in Journalism",
      category: "RECOGNITION",
      desc: "Finalist status for uncompromising investigative work that pushed the boundaries of public interest reporting in India."
    },
    {
      title: "State Excellence Award",
      category: "RECOGNITION",
      desc: "Awarded for the \"Deep Impact\" investigative series covering rural economic transitions."
    },
    {
      title: "Journalist of the Decade",
      category: "RECOGNITION",
      desc: "Nominated by the Regional Press Association for a career defined by consistent ethical bravery."
    }
  ],
  blogs: [
    {
      title: "The Future of Regional Broadcasting in a Digital-First World",
      date: "June 15, 2026",
      excerpt: "An analysis of the shifting broadcast dynamics and how regional channels can survive digital content loops.",
      content: "Regional broadcasting faces an existential transition as digital streaming platforms capture traditional cable audiences. To survive, newsrooms must integrate digital-first content workflows, enabling reporters to publish multi-format reports directly to mobile devices, social channels, and web apps while retaining the high editorial integrity of traditional television journalism."
    },
    {
      title: "Ethical Truth in the Era of Rapid Social Media Feeds",
      date: "May 20, 2026",
      excerpt: "Navigating verification protocols when sensationalism travels faster than the facts.",
      content: "When social media feeds prioritize speed and engagement over absolute accuracy, journalists face massive pressure to publish unverified details. Maintaining rigorous secondary source checks, verification protocols, and field checks is not a slow relic of print journalism—it is the ultimate defense against disinformation and the cornerstone of public trust."
    }
  ],
  events: [
    {
      title: "National Broadcast Synergy Summit",
      date: "2026-07-12",
      location: "Hyderabad Convention Center",
      desc: "Keynote address on regional media architecture and digital satellite integration."
    },
    {
      title: "Ethics in Investigative Reporting Workshop",
      date: "2026-08-05",
      location: "BIG TV Newsroom Hub",
      desc: "A masterclass for senior correspondents covering ground verification and source protection."
    }
  ],
  youtubeLink: "https://www.youtube.com/embed/dQw4w9WgXcQ"
};

const defaultAparnaPortfolio = {
  heroTitle: "Truth Meets Integrity",
  heroSubtitle: "Senior Coordinating Editor & Anchor, BIG TV 24/7. Broadcast journalist with over two decades of experience.",
  pillars: [
    { title: "Live News Anchoring", desc: "Accustomed to anchor-driven breaking news coverage, coordinating live links, and maintaining on-screen composure." },
    { title: "Prime-Time Presentation", desc: "Over two decades of experience presenting flagship bulletins, debates, and current affairs talk shows." },
    { title: "Editorial Management", desc: "Coordinating news desks, managing output systems, and directing content strategy as Senior Coordinating Editor." }
  ],
  timeline: [
    { period: "2024 - PRESENT", title: "Senior Coordinating Editor & Anchor", desc: "Supervising editorial outputs, leading primetime debates at BIG TV 24/7." },
    { period: "PREVIOUS TENURE", title: "Coordinating Editor & Anchor", desc: "Hosted the State Award-winning show Special Correspondent at Mathrubhumi News." }
  ],
  broadcastHighlights: [],
  awards: [
    { title: "Best Anchor", category: "TMT South Indian Media Awards", desc: "Recognized for consistent on-screen excellence, clarity of voice, and balanced moderation." }
  ],
  blogs: [
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
  ],
  events: [],
  youtubeLink: ""
};

const defaultAryaPortfolio = {
  heroTitle: "Voice of Truth: Broadcast Journalism",
  heroSubtitle: "Associate News Editor & Anchor, BIG TV News Malayalam. Managing desk operations and commanding primetime debate panels with 10 years of media excellence.",
  pillars: [
    { title: "Broadcast Anchoring", desc: "Commanding primetime news bulletins, debates, and breaking news panels with composure." },
    { title: "Newsroom Management", desc: "Directing daily desk operations, coordinating regional bureaus, and editing copy." },
    { title: "Investigative Journalism", desc: "Unearthing public interest stories and carrying out verify-first reporting." }
  ],
  timeline: [
    { period: "2024 - PRESENT", title: "Associate News Editor & Anchor", desc: "Leading desk output and anchoring primetime bulletins at BIG TV News Malayalam." },
    { period: "2021 - 2024", title: "Senior Anchor & Reporter", desc: "Anchored flagship debate panels and covered major state events at 24 News and Reporter TV." },
    { period: "2016 - 2021", title: "Broadcast Correspondent", desc: "Began news reporting and segment presentation at Kerala Kaumudi." }
  ],
  broadcastHighlights: [],
  awards: [
    { title: "Media Excellence Award", category: "Broadcast Journalism", desc: "Recognized for balanced political moderation and newsroom coordination excellence." }
  ],
  blogs: [
    {
      title: "The Changing Face of Regional Malayalam Broadcasting",
      date: "June 25, 2026",
      excerpt: "An analysis of digital-first trends in regional newsrooms and maintaining editorial integrity in fast-paced streaming cycles.",
      content: "As regional Malayalam broadcast news shifts from traditional satellite feeds to mobile streaming, editorial desks face the dual challenge of rapid publishing and truth verification. Diligence remains our strongest defense against disinformation."
    }
  ],
  events: [],
  youtubeLink: ""
};

const defaultBinilPortfolio = {
  heroTitle: "Journalism of Impact: Truth in Presentation",
  heroSubtitle: "Senior News Editor & Anchor at BIG TV Malayalam. Managing desk strategy and anchoring flagship broadcasts after national correspondent tenures.",
  pillars: [
    { title: "Broadcast Anchoring", desc: "Commanding prime-time news bulletins, debate moderatorships, and live breaking coverages." },
    { title: "Desk Leadership", desc: "Supervising output desk operations, coordinating desk strategy, and editing regional copy feeds." },
    { title: "National Correspondence", desc: "Years of ground-level political reporting across Delhi and Mumbai bureaus for Kerala's leading news networks." }
  ],
  timeline: [
    { period: "2024 - PRESENT", title: "Desk Chief & Senior News Editor", desc: "BIG TV Malayalam. Prime-time news anchoring, managing output desk operations, and general news gathering strategy." },
    { period: "2020 - 2024", title: "Political Bureau Correspondent", desc: "National Bureaus (Delhi & Mumbai). On-site coverage of national events, major elections, and parliamentary briefings." },
    { period: "2016 - 2020", title: "Senior News Anchor & Reporter", desc: "Manorama News & Reporter TV. Anchor operations, prime-time bullet coordination, and high-profile political panels." },
    { period: "2012 - 2016", title: "Broadcast Journalist", desc: "MediaOne & News Malayalam 24/7. News gathering, copy desk operations, and anchor-side presentations." }
  ],
  broadcastHighlights: [],
  awards: [
    { title: "Outstanding Political Coverage", category: "Broadcast Journalism Awards", desc: "Awarded for exceptional ground reports and election bulletin coverage from the Delhi Bureau." }
  ],
  blogs: [
    {
      title: "The Dynamic Intersection of Newsroom Strategy and Live Presentation",
      date: "June 28, 2026",
      excerpt: "Reflections on bridging the gap between desk coordination and live primetime anchor delivery under breaking news pressure.",
      content: "A prime-time anchor must be more than a presenter reading copy; they must be a desk journalist who understands the deep structural flows of the story. Coordinating live satellite feeds, updating editorial bulletins in real time, and maintaining composure under the studio lights are all testaments to newsroom preparation."
    }
  ],
  events: [],
  youtubeLink: ""
};

const defaultSujayaPortfolio = {
  heroTitle: "Journalism of Integrity & Mass Outreach",
  heroSubtitle: "Chief Editor at BIG TV Malayalam. Renowned Malayalam prime-time news anchor with over 18 years of editorial excellence across Reporter TV, Asianet News, and 24 News.",
  pillars: [
    {
      title: "Editorial Leadership",
      desc: "Directing newsroom policy, overseeing prime-time bulletins, and mentoring the broadcast division to maintain highest accuracy."
    },
    {
      title: "Prime-Time Debate",
      desc: "Moderator of flagship socio-political programs, known for sharp questioning, balanced moderation, and ground verification."
    },
    {
      title: "Broadcast Innovation",
      desc: "Leading regional Malayalam news expansion, leveraging digital correspondence, and bridging satellite delivery with real-time news."
    }
  ],
  timeline: [
    {
      period: "2026 — PRESENT",
      title: "Chief Editor",
      desc: "BIG TV Malayalam. Leading the network's editorial policies, desk strategy, and hosting flagship talk shows.",
      tags: ["Editorial", "Anchoring"]
    },
    {
      period: "2023 — 2026",
      title: "Coordinating Editor",
      desc: "Reporter TV. Anchored prime-time segments and moderated 'Meet the Editors'. Overseeing daily bulletin layouts.",
      tags: ["Newsroom", "Anchor"]
    },
    {
      period: "2018 — 2023",
      title: "Senior News Editor",
      desc: "24 News & Asianet News. Managing investigative desks, national bureaus, and anchoring prime-time debates.",
      tags: ["Reporting", "Editor"]
    }
  ],
  broadcastHighlights: [
    {
      period: "Present",
      station: "BIG TV MALAYALAM",
      title: "Chief Editor's Desk",
      desc: "Directing the overall news gathering, editorial validation, and high-impact investigative reporting teams."
    },
    {
      period: "2023 — 2026",
      station: "REPORTER TV",
      title: "Meet the Editors",
      desc: "Leading discussions with senior journalists and analyzing state policy, elections, and national events."
    }
  ],
  awards: [
    {
      title: "Best News Anchor Award",
      category: "EXCELLENCE",
      desc: "Awarded for exceptional anchoring, calm demeanor, and balanced coverage of critical political events in Kerala."
    }
  ],
  blogs: [
    {
      title: "The Evolving Landscape of Malayalam News Broadcasting",
      date: "July 01, 2026",
      excerpt: "Analyzing the shift from traditional satellite television to multi-platform digital broadcasting and its impact on news credibility.",
      content: "Broadcasting is changing rapidly. The line between television screens and mobile screens is fading. In this fast-paced transition, the core values of verification, ground checks, and source validation remain the anchors of reliable journalism."
    }
  ],
  events: [
    {
      title: "Media Ethics & Modern Journalism Summit",
      desc: "Keynote presentation on navigating disinformation, desk verification, and audience engagement.",
      date: "2026-07-20",
      location: "Kochi Press Club"
    }
  ],
  youtubeLink: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
};

// Seed default accounts
async function seedDefaultAccounts() {
  try {
    // 1. Seed admin
    const adminEmail = 'admin@bigtv.com';
    const hasAdmin = await User.findOne({ email: adminEmail });
    if (!hasAdmin) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await User.create({
        name: 'Jane Doe',
        email: adminEmail,
        password: hashedPassword,
        division: 'Political Bureau',
        bio: 'Senior political bureau chief covering national assembly briefings, regional policy updates, and executive governance summits.',
        status: 'LIVE RECORD'
      });
      console.log('Seeded default admin account into MongoDB.');
    }

    // 2. Seed Ganesh Yarakala
    const ganeshEmail = 'ganesh@bigtv.com';
    let ganeshUser = await User.findOne({ email: ganeshEmail });
    if (!ganeshUser) {
      const hashedPassword = await bcrypt.hash('ganesh123', 10);
      await User.create({
        name: 'Ganesh Yarakala',
        email: ganeshEmail,
        password: hashedPassword,
        division: 'Associate Editor',
        bio: 'Associate Editor at BIG TV with 26 years of editorial integrity. Leading regional digital & broadcast synergy. Formative senior tenure at TV9.',
        status: 'LIVE RECORD',
        portfolio: defaultGaneshPortfolio
      });
      console.log('Seeded Ganesh Yarakala account into MongoDB.');
    } else if (!ganeshUser.portfolio || !ganeshUser.portfolio.heroTitle) {
      // Update existing Ganesh user if they don't have the portfolio seeded
      ganeshUser.portfolio = defaultGaneshPortfolio;
      await ganeshUser.save();
      console.log('Updated existing Ganesh Yarakala with default portfolio schema.');
    }

    // 3. Seed Aparna Kurup
    const aparnaEmail = 'aparna@bigtv.com';
    let aparnaUser = await User.findOne({ email: aparnaEmail });
    if (!aparnaUser) {
      const hashedPassword = await bcrypt.hash('aparna123', 10);
      await User.create({
        name: 'Aparna Kurup',
        email: aparnaEmail,
        password: hashedPassword,
        division: 'Senior Coordinating Editor',
        bio: 'Television journalist with over two decades of experience in broadcast news, specializing in live anchoring, editorial leadership, and current affairs production. Currently serving as Senior Coordinating Editor, BIG TV 24/7.',
        status: 'LIVE RECORD',
        portfolio: defaultAparnaPortfolio
      });
      console.log('Seeded Aparna Kurup account into MongoDB.');
    } else if (!aparnaUser.portfolio || !aparnaUser.portfolio.heroTitle) {
      aparnaUser.portfolio = defaultAparnaPortfolio;
      await aparnaUser.save();
      console.log('Updated existing Aparna Kurup with default portfolio schema.');
    } else if (!aparnaUser.portfolio.blogs || aparnaUser.portfolio.blogs.length === 0) {
      aparnaUser.portfolio = {
        ...aparnaUser.portfolio.toObject(),
        blogs: defaultAparnaPortfolio.blogs
      };
      await aparnaUser.save();
      console.log('Patched Aparna Kurup portfolio with default blog articles.');
    }

    // 4. Seed Arya Surendran
    const aryaEmail = 'arya@bigtv.com';
    let aryaUser = await User.findOne({ email: aryaEmail });
    if (!aryaUser) {
      const hashedPassword = await bcrypt.hash('arya123', 10);
      await User.create({
        name: 'Arya Surendran',
        email: aryaEmail,
        password: hashedPassword,
        division: 'Malayalam Bureau',
        bio: 'Associate News Editor & Anchor at BIG TV News Malayalam. Managing all desk operations and news anchoring with diligence, professionalism, and a strong commitment to excellence.',
        status: 'LIVE RECORD',
        portfolio: defaultAryaPortfolio
      });
      console.log('Seeded Arya Surendran account into MongoDB.');
    } else if (!aryaUser.portfolio || !aryaUser.portfolio.heroTitle) {
      aryaUser.portfolio = defaultAryaPortfolio;
      await aryaUser.save();
      console.log('Updated existing Arya Surendran with default portfolio schema.');
    }

    // 5. Seed Binil Pothen
    const binilEmail = 'binil@bigtv.com';
    let binilUser = await User.findOne({ email: binilEmail });
    if (!binilUser) {
      const hashedPassword = await bcrypt.hash('binil123', 10);
      await User.create({
        name: 'Binil Pothen Babu',
        email: binilEmail,
        password: hashedPassword,
        division: 'Senior News Editor',
        bio: 'Senior News Editor and Anchor at BIG TV Malayalam.',
        status: 'LIVE RECORD',
        portfolio: defaultBinilPortfolio
      });
      console.log('Seeded Binil Pothen Babu account into MongoDB.');
    } else if (!binilUser.portfolio || !binilUser.portfolio.heroTitle) {
      binilUser.portfolio = defaultBinilPortfolio;
      await binilUser.save();
      console.log('Updated existing Binil Pothen Babu with default portfolio schema.');
    }

    // 6. Seed Sujaya Parvathy
    const sujayaEmail = 'sujaya@bigtv.com';
    let sujayaUser = await User.findOne({ email: sujayaEmail });
    if (!sujayaUser) {
      const hashedPassword = await bcrypt.hash('sujaya123', 10);
      await User.create({
        name: 'Sujaya Parvathy',
        email: sujayaEmail,
        password: hashedPassword,
        division: 'Chief Editor',
        bio: 'Chief Editor at BIG TV Malayalam. Over 18 years of broadcast news leadership and prime-time anchoring.',
        status: 'LIVE RECORD',
        portfolio: defaultSujayaPortfolio
      });
      console.log('Seeded Sujaya Parvathy account into MongoDB.');
    } else if (!sujayaUser.portfolio || !sujayaUser.portfolio.heroTitle) {
      sujayaUser.portfolio = defaultSujayaPortfolio;
      await sujayaUser.save();
      console.log('Updated existing Sujaya Parvathy with default portfolio schema.');
    }
  } catch (err) {
    console.error('Error seeding default accounts:', err);
  }
}

// Seed once database is connected
mongoose.connection.once('open', seedDefaultAccounts);

// Database queries & modifications exports
export async function getUsers() {
  const users = await User.find({}, '-password');
  return users.map(u => u.toJSON());
}

export async function findUserByEmail(email) {
  if (!email) return null;
  const user = await User.findOne({ email: email.toLowerCase() });
  return user ? user.toObject() : null;
}

export async function findUserById(id) {
  if (!id) return null;
  const user = await User.findById(id);
  return user ? user.toObject() : null;
}

export async function createUser(userData) {
  const hashedPassword = await bcrypt.hash(userData.password, 10);

  const newUser = await User.create({
    name: userData.name,
    email: userData.email,
    password: hashedPassword,
    division: userData.division || 'General Division',
    bio: userData.bio || 'Accredited newsroom correspondent.',
    status: userData.status || 'PENDING VERIFICATION',
    portfolio: {
      heroTitle: `Portfolio of ${userData.name}`,
      heroSubtitle: userData.bio || 'Accredited newsroom correspondent.',
      pillars: [
        { title: 'Investigative Reporting', desc: 'Core investigative journalism skills.' },
        { title: 'Media Strategy', desc: 'Structuring broadcasts and media channels.' },
        { title: 'Journalistic Integrity', desc: 'Ethics and truth verification.' }
      ],
      timeline: [],
      broadcastHighlights: [],
      awards: [],
      blogs: [],
      events: [],
      youtubeLink: ''
    }
  });

  const userObj = newUser.toJSON();
  delete userObj.password;
  return userObj;
}

export async function updateUser(id, updates) {
  const user = await User.findById(id);

  if (!user) {
    throw new Error('User not found');
  }

  // Update properties if provided
  if (updates.name !== undefined) user.name = updates.name;
  if (updates.division !== undefined) user.division = updates.division;
  if (updates.bio !== undefined) user.bio = updates.bio;
  if (updates.status !== undefined) user.status = updates.status;

  // Handle portfolio updates
  if (updates.portfolio !== undefined) {
    user.portfolio = {
      ...user.portfolio.toObject(),
      ...updates.portfolio
    };
  }

  await user.save();

  const userObj = user.toJSON();
  delete userObj.password;
  return userObj;
}

export async function updateUserPaidStatus(id, isPaid) {
  const user = await User.findById(id);
  if (!user) {
    throw new Error('User not found');
  }
  user.isPaid = isPaid;
  await user.save();
  const userObj = user.toJSON();
  delete userObj.password;
  return userObj;
}
