import Activity from "../models/Activity.js";
import { devListActivities, isDevStore } from "../utils/devStore.js";

export const getStudentActivity = async (req, res, next) => {
  try {
    const userId = req.user._id;

    if (isDevStore()) {
      const activities = await devListActivities(userId);
      return res.json({ activities });
    }

    const activities = await Activity.find({ userId })
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({ activities });
  } catch (error) {
    next(error);
  }
};
