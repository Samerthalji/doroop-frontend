import { AxiosError } from 'axios';
import { createSeed, makeLogo, ME, DEMO_CV_URL } from './demoData';

/**
 * Axios adapter used in demo mode. It answers every request the app makes
 * from a small database kept in localStorage, so the whole UI works without
 * the backend. The response shapes mirror what the real API returns.
 */

const DB_KEY = 'demoDb';

const load = () => {
  try {
    const raw = localStorage.getItem(DB_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    /* fall through to a fresh seed */
  }
  const fresh = createSeed();
  persist(fresh);
  return fresh;
};

function persist(db) {
  try {
    localStorage.setItem(DB_KEY, JSON.stringify(db));
  } catch {
    /* storage full or blocked: changes last only for this request */
  }
}

class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const clone = (value) => JSON.parse(JSON.stringify(value));
const parseBody = (data) => {
  if (typeof data === 'string') {
    try { return JSON.parse(data); } catch { return {}; }
  }
  return data || {};
};

// ---------- image helpers (browser only) ----------
const fileToDataUrl = (file, maxSize) =>
  new Promise((resolve) => {
    if (typeof FileReader === 'undefined' || typeof document === 'undefined' || !file || !file.type?.startsWith('image/')) {
      resolve(null);
      return;
    }
    const reader = new FileReader();
    reader.onerror = () => resolve(null);
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => resolve(null);
      img.onload = () => {
        // Downscale so the data URL stays small enough for localStorage.
        const scale = Math.min(1, maxSize / Math.max(img.width, img.height));
        const canvas = document.createElement('canvas');
        canvas.width = Math.max(1, Math.round(img.width * scale));
        canvas.height = Math.max(1, Math.round(img.height * scale));
        canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', 0.85));
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });

const firstFile = (formData) => {
  if (!formData || typeof formData.values !== 'function') return null;
  for (const value of formData.values()) {
    if (typeof value !== 'string') return value;
  }
  return null;
};

// ---------- output shapes ----------
const userOut = (db) => ({ ...clone(db.user), fullName: `${db.user.fName} ${db.user.lName}`.trim() });

const jobOut = (db, job, { withStatus = false } = {}) => {
  const company = db.companies.find((c) => c.id === job.companyId);
  const out = {
    id: job.id,
    title: job.title,
    description: job.description,
    salary: job.salary,
    location: job.location,
    // The real API (and some pages) use both spellings, so both are provided.
    typeJob: job.typeJob,
    typeJop: job.typeJob,
    experienceLevel: job.experienceLevel,
    experieceLevel: job.experienceLevel,
    skills: [...job.skills],
    companyId: job.companyId,
    companyName: company ? company.name : 'Unknown Company',
    logoUrl: company ? company.logoUrl : undefined,
    createdAt: job.createdAt,
    applicationsCount: db.applications.filter((a) => a.jobId === job.id).length,
  };
  if (withStatus) {
    const mine = db.applications.find((a) => a.jobId === job.id && a.userId === ME);
    if (mine) out.status = mine.status;
  }
  return out;
};

const newestFirst = (a, b) => new Date(b.createdAt) - new Date(a.createdAt);
const mustFind = (list, id, what) => {
  const found = list.find((item) => item.id === Number(id));
  if (!found) throw new HttpError(404, `${what} not found.`);
  return found;
};

// ---------- route table ----------
const routes = [
  // --- user ---
  ['GET', /^\/users\/profile$/, ({ db }) => userOut(db)],
  ['PUT', /^\/users\/user$/, ({ db, body }) => {
    ['fName', 'lName', 'headline', 'about'].forEach((key) => {
      if (typeof body[key] === 'string') db.user[key] = body[key];
    });
    return { message: 'Profile updated.' };
  }],
  ['POST', /^\/users\/upload-image$/, async ({ db, data }) => {
    const url = await fileToDataUrl(firstFile(data), 256);
    if (url) db.user.profileImageUrl = url;
    return { message: 'Image updated.' };
  }],

  // --- skills ---
  ['POST', /^\/skill$/, ({ db, body }) => {
    const name = String(body.addSkillRequest || '').trim();
    if (!name) throw new HttpError(400, 'Skill name is required.');
    const skillId = db.nextId.skill++;
    db.user.skills.push({ skillId, skillName: name });
    return { skillId };
  }],
  ['DELETE', /^\/skill\/(\d+)$/, ({ db, match }) => {
    db.user.skills = db.user.skills.filter((s) => s.skillId !== Number(match[1]));
    return { message: 'Skill deleted.' };
  }],

  // --- jobs ---
  ['GET', /^\/job$/, ({ db, query }) => {
    if (query.id !== undefined) {
      return jobOut(db, mustFind(db.jobs, query.id, 'Job'), { withStatus: true });
    }
    const items = [...db.jobs].sort(newestFirst).map((j) => jobOut(db, j));
    return { items, totalCount: items.length };
  }],
  ['GET', /^\/job\/search-by-skill$/, ({ db, query }) => {
    const term = String(query.skill || '').trim().toLowerCase();
    const items = db.jobs
      .filter((j) => !term || j.skills.some((s) => s.toLowerCase().includes(term)) || j.title.toLowerCase().includes(term))
      .sort(newestFirst)
      .map((j) => jobOut(db, j));
    return { items, totalCount: items.length };
  }],
  ['GET', /^\/job\/company$/, ({ db, query }) => {
    const items = db.jobs.filter((j) => j.companyId === Number(query.companyId)).sort(newestFirst).map((j) => jobOut(db, j));
    return { items, totalCount: items.length, page: Number(query.page) || 1, pageSize: Number(query.pageSize) || 10 };
  }],
  ['POST', /^\/job$/, ({ db, body }) => {
    if (!body.title) throw new HttpError(400, 'Title is required.');
    const job = {
      id: db.nextId.job++,
      companyId: Number(body.companyId),
      title: body.title,
      description: body.description || '',
      salary: Number(body.salary) || 0,
      location: body.location || '',
      typeJob: body.typeJop || body.typeJob || 'FullTime',
      experienceLevel: body.experieceLevel || body.experienceLevel || 'Mid',
      skills: Array.isArray(body.skills) ? body.skills : [],
      createdAt: new Date().toISOString(),
    };
    db.jobs.push(job);
    return jobOut(db, job);
  }],
  ['PUT', /^\/job\/(\d+)$/, ({ db, match, body }) => {
    const job = mustFind(db.jobs, match[1], 'Job');
    Object.assign(job, {
      title: body.title ?? job.title,
      description: body.description ?? job.description,
      salary: body.salary !== undefined ? Number(body.salary) : job.salary,
      location: body.location ?? job.location,
      typeJob: body.typeJob ?? job.typeJob,
      experienceLevel: body.experienceLevel ?? job.experienceLevel,
      skills: Array.isArray(body.skills) ? body.skills : job.skills,
    });
    return jobOut(db, job);
  }],
  ['DELETE', /^\/job\/(\d+)$/, ({ db, match }) => {
    const job = mustFind(db.jobs, match[1], 'Job');
    db.jobs = db.jobs.filter((j) => j.id !== job.id);
    db.applications = db.applications.filter((a) => a.jobId !== job.id);
    return { message: 'Job deleted.' };
  }],

  // --- applications ---
  ['POST', /^\/application\/job\/applications$/, ({ db, body }) => {
    const items = db.applications
      .filter((a) => a.jobId === Number(body.jobId))
      .sort(newestFirst)
      .map(({ id, userName, userEmail, status, cvUrl, avatarColor, createdAt }) => ({ id, userName, userEmail, status, cvUrl, avatarColor, createdAt }));
    return { items, totalCount: items.length };
  }],
  ['POST', /^\/application\/apply$/, ({ db, query }) => {
    const job = mustFind(db.jobs, query.jobId, 'Job');
    if (db.applications.some((a) => a.jobId === job.id && a.userId === ME)) {
      throw new HttpError(400, 'You have already applied to this job.');
    }
    db.applications.push({
      id: db.nextId.application++,
      jobId: job.id,
      userId: ME,
      userName: `${db.user.fName} ${db.user.lName}`.trim(),
      userEmail: db.user.email,
      avatarColor: 'from-indigo-500 to-blue-600',
      status: 'Pending',
      cvUrl: DEMO_CV_URL,
      createdAt: new Date().toISOString(),
    });
    return { message: 'Application submitted successfully.' };
  }],
  ['POST', /^\/application\/myapplication$/, ({ db }) => {
    const items = db.applications
      .filter((a) => a.userId === ME)
      .sort(newestFirst)
      .map((a) => {
        const job = db.jobs.find((j) => j.id === a.jobId);
        const company = job && db.companies.find((c) => c.id === job.companyId);
        return {
          id: a.id,
          applicationId: a.id,
          jobId: a.jobId,
          jobTitle: job ? job.title : 'Removed job',
          companyName: company ? company.name : 'Unknown Company',
          companyLogoUrl: company ? company.logoUrl : undefined,
          salary: job ? job.salary : undefined,
          jobType: job ? job.typeJob : undefined,
          location: job ? job.location : undefined,
          status: a.status,
          createdAt: a.createdAt,
        };
      });
    return { items, totalCount: items.length };
  }],
  ['GET', /^\/application\/details$/, ({ db, query }) => {
    const a = mustFind(db.applications, query.applicationId, 'Application');
    return { id: a.id, jobId: a.jobId, status: a.status, createdAt: a.createdAt, cvUrl: a.cvUrl, userName: a.userName, userEmail: a.userEmail };
  }],
  ['POST', /^\/application\/status$/, ({ db, query }) => {
    const a = mustFind(db.applications, query.applicationId, 'Application');
    a.status = query.status;
    return { message: 'Status updated.' };
  }],
  ['DELETE', /^\/application\/(\d+)$/, ({ db, match }) => {
    const a = mustFind(db.applications, match[1], 'Application');
    db.applications = db.applications.filter((x) => x.id !== a.id);
    return { message: 'Application withdrawn.' };
  }],

  // --- companies ---
  ['GET', /^\/company\/my-companies$/, ({ db }) =>
    db.companies.filter((c) => db.ownedCompanyIds.includes(c.id)).map((c) => ({ id: c.id, name: c.name, logo: c.logoUrl }))],
  ['POST', /^\/company$/, ({ db, body }) => {
    if (!body.name) throw new HttpError(400, 'Company name is required.');
    const id = db.nextId.company++;
    const palette = ['#1e40af', '#7c3aed', '#059669', '#0284c7', '#b45309', '#be123c'];
    const company = {
      id,
      name: body.name,
      email: body.email || '',
      location: body.location || '',
      description: body.description || '',
      website: body.website || '',
      industry: body.industry || '',
      size: body.size || '',
      logoUrl: makeLogo(String(body.name).charAt(0).toUpperCase() || 'C', palette[id % palette.length]),
    };
    db.companies.push(company);
    db.ownedCompanyIds.push(id);
    return clone(company);
  }],
  ['POST', /^\/company\/(\d+)\/logo$/, async ({ db, match, data }) => {
    const company = mustFind(db.companies, match[1], 'Company');
    const url = await fileToDataUrl(firstFile(data), 128);
    if (url) company.logoUrl = url;
    return { message: 'Logo updated.' };
  }],
  ['GET', /^\/company\/(\d+)$/, ({ db, match }) => clone(mustFind(db.companies, match[1], 'Company'))],

  // --- dashboard / resume analysis (these live under /api, not /api/v1) ---
  ['GET', /^\/dashboard\/(\d+)$/, ({ db }) => userOut(db)],
  ['POST', /^\/dashboard\/analyze-profile\/(\d+)$/, async ({ db }) => { await sleep(900); return userOut(db); }],
  ['POST', /^\/resume\/upload-resume\/(\d+)$/, async ({ db }) => { await sleep(1200); return userOut(db); }],
];

// ---------- request plumbing ----------
const normalisePath = (config) => {
  const base = (config.baseURL || '').replace(/\/+$/, '');
  const url = String(config.url || '').replace(/^\/+/, '');
  const [pathPart, queryPart = ''] = `${base}/${url}`.split('?');
  const lower = pathPart.toLowerCase().replace(/\/+$/, '');
  const apiAt = lower.indexOf('/api');
  const path = (apiAt >= 0 ? lower.slice(apiAt + 4) : lower).replace(/^\/v1(?=\/|$)/, '') || '/';
  const query = { ...Object.fromEntries(new URLSearchParams(queryPart)), ...(config.params || {}) };
  return { path, query };
};

const buildResponse = (config, status, data) => ({
  data, status, statusText: status < 400 ? 'OK' : 'Error', headers: {}, config, request: {},
});

export const demoAdapter = async (config) => {
  await sleep(200 + Math.random() * 200); // feel like a real network call

  const method = String(config.method || 'get').toUpperCase();
  const { path, query } = normalisePath(config);
  const route = routes.find(([m, re]) => m === method && re.test(path));

  try {
    if (!route) throw new HttpError(404, `Demo mode has no handler for ${method} ${path}`);
    const db = load();
    const match = path.match(route[1]);
    const result = await route[2]({ db, match, query, body: parseBody(config.data), data: config.data });
    persist(db);
    return buildResponse(config, 200, clone(result));
  } catch (error) {
    const status = error instanceof HttpError ? error.status : 500;
    const message = error.message || 'Unexpected demo error';
    const response = buildResponse(config, status, { statusCode: status, message });
    throw new AxiosError(message, status >= 500 ? 'ERR_BAD_RESPONSE' : 'ERR_BAD_REQUEST', config, {}, response);
  }
};
