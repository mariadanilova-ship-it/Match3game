import type { LevelConfig, PowerUpDef } from './types';

export const BUG_TYPES = [
  { id: 0, name: 'Minor',    color: '#43D9BB', darkBg: '#071A16', borderAlpha: '#43D9BB55', label: 'minor',    glow: false },
  { id: 1, name: 'Backend',  color: '#4DA3FF', darkBg: '#07111E', borderAlpha: '#4DA3FF55', label: 'backend',  glow: false },
  { id: 2, name: 'Critical', color: '#FF4D4F', darkBg: '#1A0707', borderAlpha: '#FF4D4F99', label: 'critical', glow: true  },
  { id: 3, name: 'UX',       color: '#FFD84D', darkBg: '#1A1507', borderAlpha: '#FFD84D55', label: 'ux',       glow: false },
  { id: 4, name: 'Security', color: '#A96CFF', darkBg: '#0F071A', borderAlpha: '#A96CFF55', label: 'security', glow: false },
] as const;

export const POWER_UPS: PowerUpDef[] = [
  { type: 'freeze',   name: 'Code Freeze', description: '+15 seconds',      icon: '❄️', color: '#4DA3FF' },
  { type: 'hotfix',   name: 'Hotfix',      description: 'Clear top bug',    icon: '🔧', color: '#43D9BB' },
  { type: 'refactor', name: 'Refactor',    description: 'Shuffle board',    icon: '♻️', color: '#A96CFF' },
  { type: 'firewall', name: 'Firewall',    description: '2× next combo',    icon: '🛡️', color: '#FF4D4F' },
];

export function getInitialPowerUpCharges(levelId: number): Record<string, number> {
  if (levelId <= 5)  return { freeze: 2, hotfix: 0, refactor: 1, firewall: 0 };
  if (levelId <= 15) return { freeze: 2, hotfix: 1, refactor: 1, firewall: 1 };
  if (levelId <= 25) return { freeze: 3, hotfix: 2, refactor: 1, firewall: 1 };
  return                    { freeze: 3, hotfix: 2, refactor: 2, firewall: 2 };
}

const BASE_LEVELS: LevelConfig[] = [
  {
    id: 1, name: 'First Deploy', timeLimit: 90,
    objectives: [{ bugType: 0, count: 10 }],
    starThresholds: [100, 200, 350],
    story: { title: 'First Deploy', character: 'PM Jake',
      text: '"Just push it to prod — what could go wrong? You have... 47 minor bugs waiting. Welcome to Day 1, dev."' },
  },
  {
    id: 2, name: 'Two-Line Change', timeLimit: 90,
    objectives: [{ bugType: 0, count: 8 }, { bugType: 1, count: 8 }],
    starThresholds: [150, 300, 500],
    story: { title: '"Just a quick fix"', character: 'PM Sarah',
      text: '"It\'s just two lines." Those two lines touched 23 files and silently broke the login page for 6 hours.' },
  },
  {
    id: 3, name: 'Friday Deploy', timeLimit: 85,
    objectives: [{ bugType: 1, count: 15 }],
    starThresholds: [150, 320, 550],
    story: { title: 'Deploy on Friday', character: 'CTO Dave',
      text: '"Deploy on Friday! It\'s just backend changes!" The team has left the building. You\'re alone. Good luck.' },
  },
  {
    id: 4, name: 'Works on My Machine', timeLimit: 85,
    objectives: [{ bugType: 0, count: 10 }, { bugType: 2, count: 8 }],
    starThresholds: [200, 400, 700],
    story: { title: 'Works on My Machine™', character: 'Dev Alex',
      text: '"It works on my machine!" — famous dev proverb. We\'re now shipping their laptop to production servers.' },
  },
  {
    id: 5, name: 'Design Sprint', timeLimit: 80,
    objectives: [{ bugType: 1, count: 10 }, { bugType: 3, count: 10 }],
    starThresholds: [250, 480, 800],
    story: { title: 'The UX Sprint', character: 'UX Lead Maya',
      text: '"Users don\'t understand the button." The button says CLICK HERE. Has an arrow. Has a label. Has a tooltip.' },
  },
  {
    id: 6, name: 'Security Audit', timeLimit: 80,
    objectives: [{ bugType: 2, count: 12 }, { bugType: 4, count: 10 }],
    starThresholds: [300, 580, 950],
    story: { title: 'Security Audit Tomorrow', character: 'Security Sam',
      text: '"The password is password123. It\'s on a Post-it on the CEO\'s monitor. The audit starts in 10 minutes."' },
  },
  {
    id: 7, name: 'Triple Threat', timeLimit: 75,
    objectives: [{ bugType: 0, count: 10 }, { bugType: 1, count: 10 }, { bugType: 3, count: 8 }],
    starThresholds: [400, 750, 1250],
    story: { title: 'Stack Overflow is Down', character: 'Dev Team',
      text: 'Stack Overflow went offline for 15 minutes. Global developer productivity collapsed to exactly 0%.' },
  },
  {
    id: 8, name: 'All Hands', timeLimit: 75,
    objectives: [{ bugType: 0, count: 5 }, { bugType: 1, count: 5 }, { bugType: 2, count: 5 }, { bugType: 3, count: 5 }, { bugType: 4, count: 5 }],
    starThresholds: [500, 900, 1500],
    story: { title: 'All-Hands Bug Hunt', character: 'CTO Dave',
      text: '"Everyone on the bug hunt — even the designers!" No sane manager says this. Yet here we all are, together.' },
  },
  {
    id: 9, name: 'Critical Path', timeLimit: 70,
    objectives: [{ bugType: 2, count: 15 }, { bugType: 4, count: 12 }],
    starThresholds: [580, 1050, 1750],
    story: { title: 'P0 Incident', character: 'On-call Dev',
      text: '"P0 incident! Payment service down! 3 critical bugs, 2 security holes, CEO calling!" ...Deep breath.' },
  },
  {
    id: 10, name: 'Sprint Review', timeLimit: 70,
    objectives: [{ bugType: 0, count: 6 }, { bugType: 1, count: 6 }, { bugType: 2, count: 6 }, { bugType: 3, count: 6 }, { bugType: 4, count: 6 }],
    starThresholds: [650, 1200, 2000],
    story: { title: 'Sprint Review Day', character: 'Scrum Master Kim',
      text: '"40 story points planned. 12 completed. 47 new bugs found." Velocity: negative. Team morale: also negative.' },
  },
  {
    id: 11, name: 'Legacy Code', timeLimit: 65,
    objectives: [{ bugType: 0, count: 12 }, { bugType: 1, count: 12 }],
    starThresholds: [800, 1450, 2400],
    story: { title: 'The Legacy Codebase', character: 'New Dev Chris',
      text: '"No comments. No docs. The original dev left in 2019. There\'s a file called: final_FINAL_v3_actually_FINAL.js"' },
  },
  {
    id: 12, name: 'UX Hell', timeLimit: 65,
    objectives: [{ bugType: 3, count: 12 }, { bugType: 4, count: 12 }],
    starThresholds: [850, 1550, 2600],
    story: { title: 'User Testing Session', character: 'UX Lead Maya',
      text: '"15 users tested the app. 15 couldn\'t find logout." It\'s in the header. Purple. Blinking. With sound effects.' },
  },
  {
    id: 13, name: 'The Refactor', timeLimit: 60,
    objectives: [{ bugType: 0, count: 8 }, { bugType: 1, count: 8 }, { bugType: 2, count: 8 }, { bugType: 3, count: 8 }, { bugType: 4, count: 8 }],
    starThresholds: [1100, 1950, 3200],
    story: { title: 'Refactor Week™', character: 'Lead Dev Jordan',
      text: '"We\'ll spend this sprint refactoring." Refactor week → month → quarter. Tech debt: still compounding.' },
  },
  {
    id: 14, name: 'Backend Meltdown', timeLimit: 60,
    objectives: [{ bugType: 2, count: 15 }, { bugType: 1, count: 12 }],
    starThresholds: [1200, 2100, 3500],
    story: { title: 'The Database is Down', character: 'DBA Pat',
      text: '"DB connection pool exhausted. 10,000 users waiting. CEO watching status page. Coffee is cold. Fun times."' },
  },
  {
    id: 15, name: 'Mid-Sprint Crisis', timeLimit: 55,
    objectives: [{ bugType: 0, count: 9 }, { bugType: 1, count: 9 }, { bugType: 2, count: 9 }, { bugType: 3, count: 9 }, { bugType: 4, count: 9 }],
    starThresholds: [1500, 2600, 4200],
    story: { title: 'Mid-Sprint Scope Change', character: 'PM Sarah',
      text: '"I know we\'re 3 days from launch — but can we add... blockchain? And AI? Also a ChatGPT thing? By Friday?"' },
  },
  {
    id: 16, name: 'Zero Coverage', timeLimit: 55,
    objectives: [{ bugType: 2, count: 18 }, { bugType: 4, count: 14 }],
    starThresholds: [1600, 2800, 4600],
    story: { title: '0% Test Coverage', character: 'Dev Alex',
      text: '"We have 0% test coverage but maximum confidence." Famous last words, spoken 2 hours before launch day.' },
  },
  {
    id: 17, name: 'Tech Debt', timeLimit: 50,
    objectives: [{ bugType: 0, count: 10 }, { bugType: 1, count: 10 }, { bugType: 2, count: 10 }, { bugType: 3, count: 10 }, { bugType: 4, count: 10 }],
    starThresholds: [1900, 3300, 5400],
    story: { title: 'Tech Debt Infinity', character: 'CTO Dave',
      text: '"It\'s not debt, it\'s a strategic investment opportunity." APR: 400%. Compound interest: hourly. Pain: constant.' },
  },
  {
    id: 18, name: 'No Backups', timeLimit: 50,
    objectives: [{ bugType: 0, count: 18 }, { bugType: 1, count: 14 }],
    starThresholds: [2000, 3500, 5700],
    story: { title: 'The Intern Deleted Prod', character: 'CTO Dave',
      text: '"The intern deleted the production database." Pause. "Do we have backups?" Long pause. "...That was on the roadmap."' },
  },
  {
    id: 19, name: 'LGTM', timeLimit: 45,
    objectives: [{ bugType: 0, count: 11 }, { bugType: 1, count: 11 }, { bugType: 2, count: 11 }, { bugType: 3, count: 11 }, { bugType: 4, count: 11 }],
    starThresholds: [2300, 4000, 6500],
    story: { title: 'LGTM Code Review', character: 'Sr Dev Morgan',
      text: '"LGTM!" — the reviewer who approved 2,000 lines in 30 seconds. No tests read. No logic checked. Ship it.' },
  },
  {
    id: 20, name: 'AI Everything', timeLimit: 45,
    objectives: [{ bugType: 2, count: 18 }, { bugType: 0, count: 8 }, { bugType: 1, count: 8 }, { bugType: 3, count: 8 }, { bugType: 4, count: 8 }],
    starThresholds: [2600, 4500, 7200],
    story: { title: 'AI-Powered™', character: 'CEO Mark',
      text: '"Our app is now AI-powered!" — It has one if-else statement and a spinning robot gif. Valuation: $50M.' },
  },
  {
    id: 21, name: 'Team Chaos', timeLimit: 45,
    objectives: [{ bugType: 0, count: 12 }, { bugType: 1, count: 12 }, { bugType: 2, count: 12 }, { bugType: 3, count: 12 }, { bugType: 4, count: 12 }],
    starThresholds: [3000, 5200, 8400],
    story: { title: 'The Deleted Test Env', character: 'PM Jake',
      text: '"Why is this taking so long?" — asked the PM who deleted the test environment. And then blamed it on DNS.' },
  },
  {
    id: 22, name: 'Hotfix Chain', timeLimit: 40,
    objectives: [{ bugType: 2, count: 20 }, { bugType: 4, count: 16 }],
    starThresholds: [3400, 5900, 9500],
    story: { title: 'Hotfix for the Hotfix', character: 'Dev Alex',
      text: '"The hotfix broke production worse." Long silence. "We\'ll ship a hotfix for the hotfix." Longer silence.' },
  },
  {
    id: 23, name: 'Full Stack', timeLimit: 40,
    objectives: [{ bugType: 0, count: 12 }, { bugType: 1, count: 12 }, { bugType: 2, count: 12 }, { bugType: 3, count: 12 }, { bugType: 4, count: 12 }],
    starThresholds: [3800, 6600, 10700],
    story: { title: 'DNS Again', character: 'DevOps Riley',
      text: '"It\'s always DNS." — Ancient proverb. 48 hours of debugging. 12 engineers. Root cause: DNS. As always.' },
  },
  {
    id: 24, name: 'Scale-Up', timeLimit: 40,
    objectives: [{ bugType: 1, count: 20 }, { bugType: 0, count: 15 }],
    starThresholds: [4200, 7300, 11800],
    story: { title: 'Premature Optimization', character: 'Architect Blake',
      text: '"We need to handle 1 billion concurrent users!" — Current active users: 47. Sprint estimate: 3 months.' },
  },
  {
    id: 25, name: 'Code Freeze', timeLimit: 35,
    objectives: [{ bugType: 0, count: 12 }, { bugType: 1, count: 12 }, { bugType: 2, count: 12 }, { bugType: 3, count: 12 }, { bugType: 4, count: 12 }],
    starThresholds: [4800, 8400, 13600],
    story: { title: 'chmod 777', character: 'Sysadmin Quinn',
      text: '"chmod 777 /var/www — it\'s fine." It was not fine. The security team is now filing 47 compliance reports.' },
  },
  {
    id: 26, name: 'CORS Nightmare', timeLimit: 35,
    objectives: [{ bugType: 2, count: 22 }, { bugType: 4, count: 18 }],
    starThresholds: [5400, 9400, 15200],
    story: { title: 'CORS: Access Denied', character: 'Dev Taylor',
      text: '"Access-Control-Allow-Origin: *" — security is now an optional feature. Added to the v2 backlog. Good enough.' },
  },
  {
    id: 27, name: 'No Sleep', timeLimit: 35,
    objectives: [{ bugType: 0, count: 14 }, { bugType: 1, count: 14 }, { bugType: 2, count: 14 }, { bugType: 3, count: 14 }, { bugType: 4, count: 14 }],
    starThresholds: [6100, 10700, 17300],
    story: { title: 'Sleep is a V2 Feature', character: 'CTO Dave',
      text: '"Sleep? We\'ll implement that next sprint." Sprint cancelled due to production fire. Sleep backlogged to v3.' },
  },
  {
    id: 28, name: 'Dark Mode Disaster', timeLimit: 30,
    objectives: [{ bugType: 0, count: 14 }, { bugType: 1, count: 14 }, { bugType: 2, count: 14 }, { bugType: 3, count: 14 }, { bugType: 4, count: 14 }],
    starThresholds: [7000, 12200, 19800],
    story: { title: 'Dark Mode Disaster', character: 'Design Eng. Sam',
      text: '"Dark mode is just inverted colors, right?" The PR broke 14 screens, 3 logos, and the CEO\'s profile photo.' },
  },
  {
    id: 29, name: 'Production Vibes', timeLimit: 30,
    objectives: [{ bugType: 2, count: 22 }, { bugType: 0, count: 12 }, { bugType: 1, count: 12 }, { bugType: 3, count: 12 }, { bugType: 4, count: 12 }],
    starThresholds: [7900, 13800, 22300],
    story: { title: 'Works in Staging Only', character: 'On-call Dev',
      text: '"Works in staging. Explodes in prod. No logs. No traces. Just vibes and a 3am Slack: \'it broken lol\'"' },
  },
  {
    id: 30, name: 'Release Panic', timeLimit: 30,
    objectives: [{ bugType: 0, count: 16 }, { bugType: 1, count: 16 }, { bugType: 2, count: 16 }, { bugType: 3, count: 16 }, { bugType: 4, count: 16 }],
    starThresholds: [9000, 15700, 25400],
    story: { title: 'The Final Release 🚀', character: 'The Universe',
      text: '"Congratulations. 30 levels of pure release panic. You survived. The bugs never truly die — they just ship to prod."' },
  },
];

function getReducedTime(timeLimit: number, levelId: number) {
  const reduction = levelId < 3 ? 10 : 15;
  return Math.max(18, timeLimit - reduction);
}

function getFrozenSlotCount(levelId: number) {
  if (levelId < 3) return 0;
  if (levelId < 8) return 2;
  if (levelId < 15) return 3;
  if (levelId < 22) return 4;
  return 5;
}

export const LEVELS: LevelConfig[] = BASE_LEVELS.map((level) => ({
  ...level,
  timeLimit: getReducedTime(level.timeLimit, level.id),
  frozenSlots: getFrozenSlotCount(level.id),
}));
