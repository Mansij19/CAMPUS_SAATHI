import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { sendSuccessfulLoginEmail } from "../services/mailService.js";
import {
  devComparePassword,
  devCreateUser,
  devFindUserByEmail,
  devUpdateUser,
  isDevStore
} from "../utils/devStore.js";

const signToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d"
  });
};

const sanitizeUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  preferredLanguage: user.preferredLanguage,
  createdAt: user.createdAt
});

export const register = async (req, res, next) => {
  try {
    const { name, email, password, preferredLanguage } = req.body;

    if (isDevStore()) {
      const user = await devCreateUser({ name, email, password, preferredLanguage, role: "student" });
      return res.status(201).json({
        token: signToken(user),
        user: sanitizeUser(user)
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({ message: "An account with this email already exists" });
    }

    const user = await User.create({
      name,
      email,
      password,
      preferredLanguage,
      role: "student"
    });

    res.status(201).json({
      token: signToken(user),
      user: sanitizeUser(user)
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (isDevStore()) {
      const user = await devFindUserByEmail(email, true);

      if (!user || !(await devComparePassword(password, user.password))) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      sendSuccessfulLoginEmail(user).catch((error) => {
        console.warn("Login email was not sent:", error.message);
      });

      return res.json({
        token: signToken(user),
        user: sanitizeUser(user)
      });
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    sendSuccessfulLoginEmail(user).catch((error) => {
      console.warn("Login email was not sent:", error.message);
    });

    res.json({
      token: signToken(user),
      user: sanitizeUser(user)
    });
  } catch (error) {
    next(error);
  }
};

export const getProfile = async (req, res) => {
  res.json({ user: sanitizeUser(req.user) });
};

export const updateProfile = async (req, res, next) => {
  try {
    const allowedFields = ["name", "preferredLanguage"];
    const updates = {};

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    });

    if (isDevStore()) {
      const user = await devUpdateUser(req.user._id, updates);
      return res.json({ user: sanitizeUser(user) });
    }

    const user = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
      runValidators: true
    }).select("-password");

    res.json({ user: sanitizeUser(user) });
  } catch (error) {
    next(error);
  }
};
