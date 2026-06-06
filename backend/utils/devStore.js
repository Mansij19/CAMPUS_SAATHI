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
  conversations: []
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

export const isDevStore = () => process.env.USE_DEV_STORE === "true";

export const devFindUserByEmail = async (email, includePassword = false) => {
  const data = await readStore();
  const user = data.users.find((item) => item.email === email?.toLowerCase());
  return publicUser(user, includePassword);
};

export const devFindUserById = async (id) => {
  const data = await readStore();
  const user = data.users.find((item) => item.id === String(id));
  return publicUser(user);
};

export const devCreateUser = async ({ name, email, password, role = "student", preferredLanguage = "English" }) => {
  const data = await readStore();
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
  const data = await readStore();
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
  const data = await readStore();
  return data.users.length;
};

export const devRecentUsers = async (limit = 8) => {
  const data = await readStore();
  return [...data.users]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, limit)
    .map((user) => publicUser(user));
};

export const devFindConversation = async (userId) => {
  const data = await readStore();
  return data.conversations.find((conversation) => conversation.userId === String(userId)) || null;
};

export const devPushMessages = async (userId, messages) => {
  const data = await readStore();
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
  const data = await readStore();
  data.conversations = data.conversations.filter((conversation) => conversation.userId !== String(userId));
  await writeStore(data);
};

export const devListConversations = async () => {
  const data = await readStore();
  return data.conversations;
};
