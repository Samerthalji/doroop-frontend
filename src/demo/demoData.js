// Sample data for demo mode. Every company, person and e-mail below is fictional
// (".example" is a reserved domain that can never belong to a real site).

const svgLogo = (letter, bg) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 96 96">` +
      `<rect width="96" height="96" rx="22" fill="${bg}"/>` +
      `<text x="48" y="65" font-family="Arial, Helvetica, sans-serif" font-size="44" font-weight="700" text-anchor="middle" fill="#ffffff">${letter}</text></svg>`
  )}`;

export const makeLogo = svgLogo;
export const ME = 1; // id of the demo user
export const DEMO_CV_URL = '/demo/sample-cv.pdf';

const daysAgo = (n) => new Date(Date.now() - n * 86400000).toISOString();

const companies = [
  { id: 1, name: 'TechNova', letter: 'T', color: '#1e40af', location: 'Amman, Jordan', industry: 'Software', size: '11-50', email: 'careers@technova.example', website: 'https://technova.example',
    description: 'TechNova builds web products for regional start-ups. This is the company managed by the demo user.' },
  { id: 2, name: 'Orbit Labs', letter: 'O', color: '#7c3aed', location: 'Riyadh, Saudi Arabia', industry: 'Cloud & SaaS', size: '51-200', email: 'jobs@orbitlabs.example', website: 'https://orbitlabs.example',
    description: 'Orbit Labs ships cloud tooling for engineering teams.' },
  { id: 3, name: 'Nabd Digital', letter: 'N', color: '#059669', location: 'Amman, Jordan', industry: 'Design & Media', size: '11-50', email: 'hello@nabd.example', website: 'https://nabd.example',
    description: 'A product design and content studio.' },
  { id: 4, name: 'BlueNile Systems', letter: 'B', color: '#0284c7', location: 'Cairo, Egypt', industry: 'Enterprise Software', size: '201-500', email: 'talent@bluenile.example', website: 'https://bluenile.example',
    description: 'Enterprise software for logistics and finance.' },
  { id: 5, name: 'Cedar Analytics', letter: 'C', color: '#b45309', location: 'Dubai, UAE', industry: 'Data & AI', size: '51-200', email: 'people@cedar.example', website: 'https://cedar.example',
    description: 'Analytics and data-platform consultancy.' },
  { id: 6, name: 'Hayat Health Tech', letter: 'H', color: '#be123c', location: 'Remote', industry: 'Health Tech', size: '11-50', email: 'team@hayat.example', website: 'https://hayat.example',
    description: 'A remote-first health-tech company.' },
].map(({ letter, color, ...c }) => ({ ...c, logoUrl: svgLogo(letter, color) }));

const jobs = [
  [1, 1, 'Frontend Developer (React)', 1800, 'Amman, Jordan', 'FullTime', 'Mid', ['React', 'JavaScript', 'Tailwind CSS', 'REST APIs'], 2,
    'Build and maintain the customer-facing web app. You will work closely with designers and backend engineers, own features end to end and keep the UI fast and accessible.'],
  [2, 1, 'Junior React Developer', 900, 'Amman, Jordan', 'FullTime', 'Junior', ['React', 'HTML', 'CSS', 'Git'], 5,
    'A great first role for a recent graduate. You will pair with senior engineers, fix bugs and ship small features.'],
  [3, 1, 'UI Engineer', 2300, 'Remote', 'Remote', 'Senior', ['React', 'TypeScript', 'Design Systems', 'Accessibility'], 9,
    'Own our component library and design tokens. You will set the bar for accessibility and visual consistency across products.'],
  [4, 1, 'Frontend Intern', 300, 'Amman, Jordan', 'PartTime', 'Junior', ['JavaScript', 'HTML', 'CSS'], 12,
    'A part-time internship for students. Learn modern frontend tooling while working on real tickets.'],
  [5, 2, 'Senior Frontend Engineer', 3500, 'Riyadh, Saudi Arabia', 'FullTime', 'Senior', ['React', 'TypeScript', 'Testing', 'Next.js'], 1,
    'Lead the architecture of our dashboard. Mentor engineers, review code and drive performance improvements.'],
  [6, 2, 'Full-Stack Developer', 3000, 'Riyadh, Saudi Arabia', 'FullTime', 'Mid', ['Node.js', 'React', 'PostgreSQL', 'Docker'], 4,
    'Work across the stack on internal developer tools, from database schema to React UI.'],
  [7, 3, 'UI/UX Designer', 1500, 'Amman, Jordan', 'FullTime', 'Mid', ['Figma', 'Prototyping', 'User Research'], 3,
    'Design web and mobile experiences for our clients, from research to polished prototypes.'],
  [8, 3, 'Content & Docs Writer', 700, 'Remote', 'PartTime', 'Junior', ['Technical Writing', 'Markdown', 'Git'], 8,
    'Write product documentation and tutorials for developer-facing products.'],
  [9, 4, 'Backend .NET Developer', 2200, 'Cairo, Egypt', 'FullTime', 'Mid', ['C#', '.NET', 'SQL Server', 'REST APIs'], 6,
    'Design and build REST APIs for our logistics platform, with a focus on reliability and clean architecture.'],
  [10, 4, 'QA Automation Engineer', 1700, 'Remote', 'Remote', 'Mid', ['Selenium', 'JavaScript', 'CI/CD', 'Testing'], 10,
    'Build automated test suites and own the quality gate of our release pipeline.'],
  [11, 5, 'Data Analyst', 2000, 'Dubai, UAE', 'FullTime', 'Junior', ['SQL', 'Python', 'Power BI', 'Excel'], 7,
    'Turn raw data into dashboards and insights for client teams.'],
  [12, 5, 'DevOps Engineer', 3200, 'Dubai, UAE', 'FullTime', 'Senior', ['Docker', 'Kubernetes', 'CI/CD', 'AWS'], 14,
    'Run and improve our container platform and deployment pipelines.'],
  [13, 6, 'React Native Developer', 2400, 'Remote', 'Remote', 'Mid', ['React Native', 'JavaScript', 'REST APIs', 'Git'], 2,
    'Build our patient-facing mobile app used by thousands of people every day.'],
  [14, 6, 'Product Designer', 2100, 'Remote', 'Remote', 'Senior', ['Figma', 'Design Systems', 'User Research'], 11,
    'Shape the end-to-end product experience in a small, remote design team.'],
].map(([id, companyId, title, salary, location, typeJob, experienceLevel, skills, ago, description]) => ({
  id, companyId, title, salary, location, typeJob, experienceLevel, skills, description, createdAt: daysAgo(ago),
}));

const GRADIENTS = [
  'from-indigo-500 to-blue-600', 'from-emerald-500 to-teal-600', 'from-rose-500 to-pink-600',
  'from-amber-500 to-orange-600', 'from-violet-500 to-purple-600',
];

const people = [
  [11, 'Omar Khalil'], [12, 'Nour Aziz'], [13, 'Yousef Mansour'], [14, 'Rania Saleh'], [15, 'Tariq Nasser'],
  [16, 'Dina Haddad'], [17, 'Hamza Obeid'], [18, 'Salma Fares'], [19, 'Kareem Jaber'], [20, 'Maya Qasem'],
];
const person = (uid) => {
  const [, name] = people.find(([id]) => id === uid);
  return { userId: uid, userName: name, userEmail: `${name.toLowerCase().replace(/ /g, '.')}@example.com`, avatarColor: GRADIENTS[uid % GRADIENTS.length] };
};

// [id, jobId, userId, status, daysAgo]
const applications = [
  // the demo user's own applications
  [101, 5, ME, 'Pending', 3], [102, 13, ME, 'Accepted', 9], [103, 9, ME, 'Rejected', 15],
  // applicants to TechNova's jobs (the company the demo user manages)
  [201, 1, 11, 'Pending', 1], [202, 1, 12, 'Accepted', 4], [203, 1, 13, 'Pending', 2], [204, 1, 14, 'Rejected', 6],
  [205, 2, 15, 'Pending', 1], [206, 2, 16, 'Pending', 3], [207, 2, 17, 'Accepted', 5],
  [208, 3, 18, 'Pending', 2], [209, 3, 19, 'Rejected', 7], [210, 4, 20, 'Pending', 4],
].map(([id, jobId, uid, status, ago]) => {
  const base = uid === ME ? { userId: ME, userName: 'Demo User', userEmail: 'demo@doroop.example', avatarColor: GRADIENTS[0] } : person(uid);
  return { id, jobId, status, createdAt: daysAgo(ago), cvUrl: DEMO_CV_URL, ...base };
});

const res = (courseTitle, platform, url) => ({ courseTitle, platform, url });
const roadmap = {
  missingSkills: [
    { skillName: 'React', impactPercentage: 95 },
    { skillName: 'JavaScript', impactPercentage: 90 },
    { skillName: 'TypeScript', impactPercentage: 92 },
    { skillName: 'Testing (Jest)', impactPercentage: 85 },
    { skillName: 'Next.js', impactPercentage: 78 },
    { skillName: 'Accessibility', impactPercentage: 70 },
    { skillName: 'Redux Toolkit', impactPercentage: 55 },
    { skillName: 'GraphQL', impactPercentage: 40 },
  ],
  courses: [
    { skillName: 'React', topResources: [res('Learn React', 'Official Docs', 'https://react.dev/learn'), res('Thinking in React', 'Official Docs', 'https://react.dev/learn/thinking-in-react')] },
    { skillName: 'JavaScript', topResources: [res('JavaScript Guide', 'MDN', 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide'), res('The Modern JavaScript Tutorial', 'javascript.info', 'https://javascript.info/')] },
    { skillName: 'TypeScript', topResources: [res('TypeScript Handbook', 'Official Docs', 'https://www.typescriptlang.org/docs/handbook/intro.html'), res('TypeScript for JavaScript Programmers', 'Official Docs', 'https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes.html')] },
    { skillName: 'Testing (Jest)', topResources: [res('Jest: Getting Started', 'Official Docs', 'https://jestjs.io/docs/getting-started'), res('React Testing Library intro', 'Official Docs', 'https://testing-library.com/docs/react-testing-library/intro/')] },
    { skillName: 'Next.js', topResources: [res('Next.js Learn', 'Official Docs', 'https://nextjs.org/learn'), res('Next.js Documentation', 'Official Docs', 'https://nextjs.org/docs')] },
    { skillName: 'Accessibility', topResources: [res('Learn Accessibility', 'web.dev', 'https://web.dev/learn/accessibility'), res('Accessibility learning path', 'MDN', 'https://developer.mozilla.org/en-US/docs/Learn/Accessibility')] },
    { skillName: 'Redux Toolkit', topResources: [res('Getting Started', 'Official Docs', 'https://redux-toolkit.js.org/introduction/getting-started'), res('Quick Start', 'Official Docs', 'https://redux-toolkit.js.org/tutorials/quick-start')] },
    { skillName: 'GraphQL', topResources: [res('Introduction to GraphQL', 'Official Docs', 'https://graphql.org/learn/'), res('Apollo Client for React', 'Official Docs', 'https://www.apollographql.com/docs/react/')] },
  ],
};

const user = {
  id: ME,
  email: 'demo@doroop.example',
  fName: 'Demo',
  lName: 'User',
  fullName: 'Demo User',
  headline: 'Frontend Developer · React & Tailwind',
  about: 'Frontend developer who enjoys building clean, accessible interfaces with React. This profile is sample data used by the demo mode.',
  targetTitle: 'Frontend Developer',
  views: 128,
  rank: 'Top 12%',
  profileImageUrl: svgLogo('DU', '#4f46e5'),
  skills: [
    { skillId: 1, skillName: 'React' },
    { skillId: 2, skillName: 'JavaScript' },
    { skillId: 3, skillName: 'Tailwind CSS' },
    { skillId: 4, skillName: 'HTML & CSS' },
    { skillId: 5, skillName: 'Git' },
  ],
  aiRecommendation:
    'Your React and JavaScript foundations are strong. Adding TypeScript and automated testing would make you competitive for mid-level frontend roles.',
  roadmapData: JSON.stringify(roadmap),
};

export const createSeed = () => ({
  user,
  companies,
  ownedCompanyIds: [1],
  jobs,
  applications,
  nextId: { job: 100, application: 1000, company: 100, skill: 100 },
});
