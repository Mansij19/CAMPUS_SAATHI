import bcrypt from "bcryptjs";
import crypto from "crypto";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const STORE_DIR = path.join(__dirname, "..", ".data");
const STORE_FILE = path.join(STORE_DIR, "dev-store.json");

const defaultData = {
  users: [],
  conversations: [],
  forms: [],
  notices: [],
  notifications: [
    {
      id: "seed-notif-1",
      userId: null,
      title: "Welcome to CampusSathi",
      message: "Ask queries to our AI chatbot, upload forms, and check notice summaries in real-time.",
      status: "unread",
      createdAt: new Date().toISOString()
    },
    {
      id: "seed-notif-2",
      userId: null,
      title: "Upcoming Exam Registrations",
      message: "Vindhya semester end registrations start next Monday. Keep fee receipts ready.",
      status: "unread",
      createdAt: new Date().toISOString()
    }
  ],
  faqs: [
    {
      id: "seed-faq-1",
      question: "How do I get my library card issued?",
      answer: "Submit your admission slip and one passport-size photo to the central library counter between 10 AM and 4 PM.",
      category: "Library"
    },
    {
      id: "seed-faq-2",
      question: "What is the procedure for fee refund?",
      answer: "Download the fee refund application form, upload it under the Form Assistant, and wait for Accounts Office approval.",
      category: "Accounts"
    },
    {
      id: "seed-faq-3",
      question: "Where is the student welfare office?",
      answer: "The Student Welfare Dean office is located on the first floor of the Main Administrative Building.",
      category: "General"
    }
  ],
  scholarships: [
    {
      id: "seed-schol-1",
      name: "Merit-cum-Means College Scholarship",
      description: "Financial assistance for students showing excellent academic track records with household income constraints.",
      amount: 25000,
      deadline: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
      eligibility: "CGPA > 8.0 & annual income < 3 LPA"
    },
    {
      id: "seed-schol-2",
      name: "Campus Sports Excellence Award",
      description: "Awarded to student athletes representing the institution at state, national, or international sport tournaments.",
      amount: 15000,
      deadline: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000).toISOString(),
      eligibility: "State/National level championship certification"
    },
    {
      id: "seed-schol-3",
      name: "Women in STEM Research Grant",
      description: "Encouraging female students pursuing engineering, computer science, and core technology research degrees.",
      amount: 40000,
      deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      eligibility: "Female students enrolled in B.Tech/M.Tech with active research proposals"
    }
  ],
  activities: []
};

const now = () => new Date().toISOString();

const readStore = async () => {
  try {
    const raw = await fs.readFile(STORE_FILE, "utf8");
    return JSON.parse(raw);
  } catch (_error) {
    await fs.mkdir(STORE_DIR, { recursive: true });
    await fs.writeFile(STORE_FILE, JSON.stringify(defaultData, null, 2));
    return structuredClone(defaultData);
  }
};

const withDefaults = (data) => ({
  ...defaultData,
  ...data,
  users: data.users || [],
  conversations: data.conversations || [],
  forms: data.forms || [],
  notices: data.notices || [],
  notifications: data.notifications || defaultData.notifications,
  faqs: data.faqs || defaultData.faqs,
  scholarships: data.scholarships || defaultData.scholarships,
  activities: data.activities || []
});

const writeStore = async (data) => {
  await fs.mkdir(STORE_DIR, { recursive: true });
  await fs.writeFile(STORE_FILE, JSON.stringify(data, null, 2));
};

const publicUser = (user, includePassword = false) => {
  if (!user) return null;
  const output = { ...user, _id: user.id };
  if (!includePassword) delete output.password;
  return output;
};

const publicRecord = (record) => (record ? { ...record, _id: record.id } : null);

export const isDevStore = () => process.env.USE_DEV_STORE === "true";

export const devFindUserByEmail = async (email, includePassword = false) => {
  const data = withDefaults(await readStore());
  const user = data.users.find((item) => item.email === email?.toLowerCase());
  return publicUser(user, includePassword);
};

export const devFindUserById = async (id) => {
  const data = withDefaults(await readStore());
  const user = data.users.find((item) => item.id === String(id));
  return publicUser(user);
};

export const devCreateUser = async ({ name, email, password, role = "student", preferredLanguage = "English" }) => {
  const data = withDefaults(await readStore());
  const normalizedEmail = email.toLowerCase();

  if (data.users.some((user) => user.email === normalizedEmail)) {
    const error = new Error("An account with this email already exists");
    error.statusCode = 409;
    throw error;
  }

  const timestamp = now();
  const user = {
    id: crypto.randomUUID(),
    name,
    email: normalizedEmail,
    password: await bcrypt.hash(password, 12),
    role,
    preferredLanguage,
    createdAt: timestamp,
    updatedAt: timestamp
  };

  data.users.push(user);
  await writeStore(data);
  return publicUser(user);
};

export const devComparePassword = (candidatePassword, hashedPassword) => {
  return bcrypt.compare(candidatePassword, hashedPassword);
};

export const devUpdateUser = async (id, updates) => {
  const data = withDefaults(await readStore());
  const index = data.users.findIndex((user) => user.id === String(id));
  if (index === -1) return null;

  data.users[index] = {
    ...data.users[index],
    ...updates,
    updatedAt: now()
  };

  await writeStore(data);
  return publicUser(data.users[index]);
};

export const devCountUsers = async () => {
  const data = withDefaults(await readStore());
  return data.users.length;
};

export const devRecentUsers = async (limit = 8) => {
  const data = withDefaults(await readStore());
  return [...data.users]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, limit)
    .map((user) => publicUser(user));
};

export const devFindConversation = async (userId) => {
  const data = withDefaults(await readStore());
  return data.conversations.find((conversation) => conversation.userId === String(userId)) || null;
};

export const devPushMessages = async (userId, messages) => {
  const data = withDefaults(await readStore());
  const timestamp = now();
  let conversation = data.conversations.find((item) => item.userId === String(userId));

  if (!conversation) {
    conversation = {
      id: crypto.randomUUID(),
      userId: String(userId),
      messages: [],
      createdAt: timestamp,
      updatedAt: timestamp
    };
    data.conversations.push(conversation);
  }

  conversation.messages.push(...messages);
  conversation.updatedAt = timestamp;
  await writeStore(data);
  return conversation;
};

export const devDeleteConversation = async (userId) => {
  const data = withDefaults(await readStore());
  data.conversations = data.conversations.filter((conversation) => conversation.userId !== String(userId));
  await writeStore(data);
};

export const devListConversations = async () => {
  const data = withDefaults(await readStore());
  return data.conversations;
};

export const devCreateForm = async (form) => {
  const data = withDefaults(await readStore());
  const timestamp = now();
  const record = {
    id: crypto.randomUUID(),
    ...form,
    userId: String(form.userId),
    uploadedAt: timestamp,
    createdAt: timestamp,
    updatedAt: timestamp
  };
  data.forms.push(record);
  await writeStore(data);
  return publicRecord(record);
};

export const devUpdateForm = async (id, userId, updates) => {
  const data = withDefaults(await readStore());
  const index = data.forms.findIndex((form) => form.id === String(id) && form.userId === String(userId));
  if (index === -1) return null;
  data.forms[index] = { ...data.forms[index], ...updates, updatedAt: now() };
  await writeStore(data);
  return publicRecord(data.forms[index]);
};

export const devFindForm = async (id, userId) => {
  const data = withDefaults(await readStore());
  return publicRecord(data.forms.find((form) => form.id === String(id) && form.userId === String(userId)));
};

export const devListForms = async (userId) => {
  const data = withDefaults(await readStore());
  return data.forms
    .filter((form) => form.userId === String(userId))
    .sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt))
    .map((form) => publicRecord(form));
};

export const devDeleteForm = async (id, userId) => {
  const data = withDefaults(await readStore());
  const before = data.forms.length;
  data.forms = data.forms.filter((form) => !(form.id === String(id) && form.userId === String(userId)));
  await writeStore(data);
  return data.forms.length !== before;
};

export const devCreateNotice = async (notice) => {
  const data = withDefaults(await readStore());
  const timestamp = now();
  const record = {
    id: crypto.randomUUID(),
    ...notice,
    uploadedBy: String(notice.uploadedBy),
    createdAt: timestamp,
    updatedAt: timestamp
  };
  data.notices.push(record);
  await writeStore(data);
  return publicRecord(record);
};

export const devUpdateNotice = async (id, uploadedBy, updates) => {
  const data = withDefaults(await readStore());
  const index = data.notices.findIndex(
    (notice) => notice.id === String(id) && notice.uploadedBy === String(uploadedBy)
  );
  if (index === -1) return null;
  data.notices[index] = { ...data.notices[index], ...updates, updatedAt: now() };
  await writeStore(data);
  return publicRecord(data.notices[index]);
};

export const devFindNotice = async (id, uploadedBy) => {
  const data = withDefaults(await readStore());
  return publicRecord(
    data.notices.find((notice) => notice.id === String(id) && notice.uploadedBy === String(uploadedBy))
  );
};

export const devListNotices = async () => {
  const data = withDefaults(await readStore());
  return data.notices
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .map((notice) => publicRecord(notice));
};

export const devDeleteNotice = async (id) => {
  const data = withDefaults(await readStore());
  const before = data.notices.length;
  data.notices = data.notices.filter((notice) => notice.id !== String(id));
  await writeStore(data);
  return data.notices.length !== before;
};

// --- Notifications ---
export const devCreateNotification = async ({ userId, title, message }) => {
  const data = withDefaults(await readStore());
  const timestamp = now();
  const record = {
    id: crypto.randomUUID(),
    userId: userId ? String(userId) : null,
    title,
    message,
    status: "unread",
    createdAt: timestamp,
    updatedAt: timestamp
  };
  data.notifications.push(record);
  await writeStore(data);
  return publicRecord(record);
};

export const devListNotifications = async (userId) => {
  const data = withDefaults(await readStore());
  return data.notifications
    .filter((n) => n.userId === null || n.userId === String(userId))
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .map((n) => publicRecord(n));
};

export const devMarkNotificationRead = async (id, userId) => {
  const data = withDefaults(await readStore());
  const index = data.notifications.findIndex((n) => n.id === String(id) && (n.userId === null || n.userId === String(userId)));
  if (index === -1) return null;
  data.notifications[index].status = "read";
  data.notifications[index].updatedAt = now();
  await writeStore(data);
  return publicRecord(data.notifications[index]);
};

// --- FAQs ---
export const devCreateFAQ = async ({ question, answer, category }) => {
  const data = withDefaults(await readStore());
  const record = {
    id: crypto.randomUUID(),
    question,
    answer,
    category,
    createdAt: now(),
    updatedAt: now()
  };
  data.faqs.push(record);
  await writeStore(data);
  return publicRecord(record);
};

export const devListFAQs = async () => {
  const data = withDefaults(await readStore());
  return data.faqs.map((f) => publicRecord(f));
};

export const devDeleteFAQ = async (id) => {
  const data = withDefaults(await readStore());
  const before = data.faqs.length;
  data.faqs = data.faqs.filter((f) => f.id !== String(id));
  await writeStore(data);
  return data.faqs.length !== before;
};

// --- Scholarships ---
export const devCreateScholarship = async ({ name, description, amount, deadline, eligibility }) => {
  const data = withDefaults(await readStore());
  const record = {
    id: crypto.randomUUID(),
    name,
    description,
    amount: Number(amount),
    deadline: new Date(deadline).toISOString(),
    eligibility,
    createdAt: now(),
    updatedAt: now()
  };
  data.scholarships.push(record);
  await writeStore(data);
  return publicRecord(record);
};

export const devListScholarships = async () => {
  const data = withDefaults(await readStore());
  return data.scholarships.map((s) => publicRecord(s));
};

export const devDeleteScholarship = async (id) => {
  const data = withDefaults(await readStore());
  const before = data.scholarships.length;
  data.scholarships = data.scholarships.filter((s) => s.id !== String(id));
  await writeStore(data);
  return data.scholarships.length !== before;
};

// --- Activities ---
export const devCreateActivity = async ({ userId, type, description }) => {
  const data = withDefaults(await readStore());
  const record = {
    id: crypto.randomUUID(),
    userId: String(userId),
    type,
    description,
    createdAt: now()
  };
  data.activities.push(record);
  await writeStore(data);
  return publicRecord(record);
};

export const devListActivities = async (userId) => {
  const data = withDefaults(await readStore());
  return data.activities
    .filter((a) => a.userId === String(userId))
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 10)
    .map((a) => publicRecord(a));
};

export const devCountAllNotices = async () => {
  const data = withDefaults(await readStore());
  return data.notices.length;
};

export const devCountAllForms = async () => {
  const data = withDefaults(await readStore());
  return data.forms.length;
};
