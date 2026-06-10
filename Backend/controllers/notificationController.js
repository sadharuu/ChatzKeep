const Notification = require(
  "../models/notificationModel"
);

const getNotifications = async (
  req,
  res
) => {
  try {
    const notifications =
      await Notification.find({
        userId: req.params.userId,
      }).sort({ createdAt: -1 });

    res.json({
      success: true,
      notifications,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getNotifications,
};