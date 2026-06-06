import Notification from "../models/Notification.js";
import { devCreateNotification, devListNotifications, devMarkNotificationRead, isDevStore } from "../utils/devStore.js";

export const createNotification = async (req, res, next) => {
  try {
    const { userId, title, message } = req.body;

    if (!title || !message) {
      return res.status(400).json({ message: "Title and message are required" });
    }

    const payload = { userId: userId || null, title, message };
    const notification = isDevStore() ? await devCreateNotification(payload) : await Notification.create(payload);

    res.status(201).json({ notification });
  } catch (error) {
    next(error);
  }
};

export const getNotifications = async (req, res, next) => {
  try {
    const userId = req.user._id;

    if (isDevStore()) {
      const notifications = await devListNotifications(userId);
      return res.json({ notifications });
    }

    const notifications = await Notification.find({
      $or: [{ userId }, { userId: null }]
    }).sort({ createdAt: -1 });

    res.json({ notifications });
  } catch (error) {
    next(error);
  }
};

export const markNotificationRead = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    if (isDevStore()) {
      const notification = await devMarkNotificationRead(id, userId);
      if (!notification) {
        return res.status(404).json({ message: "Notification not found" });
      }
      return res.json({ notification });
    }

    const notification = await Notification.findOneAndUpdate(
      { _id: id, $or: [{ userId }, { userId: null }] },
      { status: "read" },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    res.json({ notification });
  } catch (error) {
    next(error);
  }
};
