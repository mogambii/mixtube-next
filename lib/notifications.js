import prisma from "@/lib/prismadb";

/**
 * Create a notification for a user
 * @param {string} type - Type of notification (FOLLOW, LIKE, COMMENT, etc.)
 * @param {string} message - The notification message
 * @param {string} userId - ID of the user receiving the notification
 * @param {string} senderId - ID of the user sending the notification
 * @param {string} mixtapeId - Optional mixtape ID for mixtape-related notifications
 */
export async function createNotification({
  type,
  message,
  userId,
  senderId,
  mixtapeId = null,
}) {
  try {
    // Don't create notification if user is notifying themselves
    if (userId === senderId) {
      return null;
    }

    const notification = await prisma.notification.create({
      data: {
        type,
        message,
        userId,
        senderId,
        mixtapeId,
      },
      include: {
        sender: {
          select: {
            username: true,
            profilep: true,
          },
        },
        mixtape: {
          select: {
            title: true,
            unique: true,
            imgthumb: true,
          },
        },
      },
    });

    return notification;
  } catch (error) {
    console.error("Error creating notification:", error);
    return null;
  }
}

/**
 * Create a follow notification
 * @param {string} followerId - ID of the user following
 * @param {string} followingId - ID of the user being followed
 */
export async function createFollowNotification(followerId, followingId) {
  const follower = await prisma.user.findUnique({
    where: { id: followerId },
    select: { username: true },
  });

  if (!follower) return null;

  return createNotification({
    type: "FOLLOW",
    message: `${follower.username} started following you`,
    userId: followingId,
    senderId: followerId,
  });
}

/**
 * Create a like notification
 * @param {string} likerId - ID of the user who liked
 * @param {string} mixtapeId - ID of the mixtape that was liked
 */
export async function createLikeNotification(likerId, mixtapeId) {
  const [liker, mixtape] = await Promise.all([
    prisma.user.findUnique({
      where: { id: likerId },
      select: { username: true },
    }),
    prisma.mixtape.findUnique({
      where: { id: mixtapeId },
      select: { title: true, userId: true },
    }),
  ]);

  if (!liker || !mixtape) return null;

  return createNotification({
    type: "LIKE",
    message: `${liker.username} liked your mixtape "${mixtape.title}"`,
    userId: mixtape.userId,
    senderId: likerId,
    mixtapeId,
  });
}

/**
 * Create a comment notification
 * @param {string} commenterId - ID of the user who commented
 * @param {string} mixtapeId - ID of the mixtape that was commented on
 * @param {string} commentContent - Content of the comment (truncated)
 */
export async function createCommentNotification(commenterId, mixtapeId, commentContent) {
  const [commenter, mixtape] = await Promise.all([
    prisma.user.findUnique({
      where: { id: commenterId },
      select: { username: true },
    }),
    prisma.mixtape.findUnique({
      where: { id: mixtapeId },
      select: { title: true, userId: true },
    }),
  ]);

  if (!commenter || !mixtape) return null;

  // Truncate comment content for notification
  const truncatedComment = commentContent.length > 50 
    ? commentContent.substring(0, 50) + "..." 
    : commentContent;

  return createNotification({
    type: "COMMENT",
    message: `${commenter.username} commented on your mixtape "${mixtape.title}": "${truncatedComment}"`,
    userId: mixtape.userId,
    senderId: commenterId,
    mixtapeId,
  });
}

/**
 * Create a milestone notification for plays
 * @param {string} mixtapeId - ID of the mixtape that reached the milestone
 * @param {number} playCount - Current play count
 * @param {number} milestone - The milestone that was reached
 */
export async function createPlayMilestoneNotification(mixtapeId, playCount, milestone) {
  const mixtape = await prisma.mixtape.findUnique({
    where: { id: mixtapeId },
    select: { title: true, userId: true },
  });

  if (!mixtape) return null;

  const milestoneText = formatMilestone(milestone);
  
  return createNotification({
    type: "MILESTONE",
    message: `🎉 Your mixtape "${mixtape.title}" just reached ${milestoneText} plays!`,
    userId: mixtape.userId,
    senderId: mixtape.userId, // Self notification
    mixtapeId,
  });
}

/**
 * Create a milestone notification for downloads
 * @param {string} mixtapeId - ID of the mixtape that reached the milestone
 * @param {number} downloadCount - Current download count
 * @param {number} milestone - The milestone that was reached
 */
export async function createDownloadMilestoneNotification(mixtapeId, downloadCount, milestone) {
  const mixtape = await prisma.mixtape.findUnique({
    where: { id: mixtapeId },
    select: { title: true, userId: true },
  });

  if (!mixtape) return null;

  const milestoneText = formatMilestone(milestone);
  
  return createNotification({
    type: "MILESTONE",
    message: `📥 Your mixtape "${mixtape.title}" just reached ${milestoneText} downloads!`,
    userId: mixtape.userId,
    senderId: mixtape.userId, // Self notification
    mixtapeId,
  });
}

/**
 * Format milestone numbers for display
 * @param {number} milestone - The milestone number
 * @returns {string} Formatted milestone text
 */
function formatMilestone(milestone) {
  if (milestone >= 1000000) {
    return `${(milestone / 1000000).toFixed(1)}M`;
  } else if (milestone >= 1000) {
    return `${(milestone / 1000).toFixed(1)}K`;
  }
  return milestone.toString();
}

/**
 * Check and create milestone notifications for a mixtape
 * @param {string} mixtapeId - ID of the mixtape to check
 * @param {string} type - 'plays' or 'downloads'
 * @param {number} currentCount - Current count
 */
export async function checkAndCreateMilestoneNotification(mixtapeId, type, currentCount) {
  // Define milestone thresholds
  const milestones = [10, 50, 100, 500, 1000, 5000, 10000, 50000, 100000, 500000, 1000000];
  
  // Get previously reached milestones for this mixtape
  const existingNotifications = await prisma.notification.findMany({
    where: {
      mixtapeId,
      type: "MILESTONE",
      message: {
        contains: type === 'plays' ? 'plays' : 'downloads'
      }
    },
    select: { message: true }
  });

  // Extract numbers from existing milestone messages
  const reachedMilestones = existingNotifications.map(notification => {
    const match = notification.message.match(/(\d+(?:\.\d+)?[KM]?)\s+(plays|downloads)/);
    if (match) {
      const value = match[1];
      if (value.includes('K')) {
        return parseInt(parseFloat(value) * 1000);
      } else if (value.includes('M')) {
        return parseInt(parseFloat(value) * 1000000);
      }
      return parseInt(value);
    }
    return 0;
  });

  // Check for new milestones
  for (const milestone of milestones) {
    if (currentCount >= milestone && !reachedMilestones.includes(milestone)) {
      if (type === 'plays') {
        await createPlayMilestoneNotification(mixtapeId, currentCount, milestone);
      } else if (type === 'downloads') {
        await createDownloadMilestoneNotification(mixtapeId, currentCount, milestone);
      }
      break; // Only create one notification at a time to avoid spam
    }
  }
}

/**
 * Mark notifications as read
 * @param {string} userId - ID of the user
 * @param {string[]} notificationIds - Array of notification IDs to mark as read
 */
export async function markNotificationsAsRead(userId, notificationIds) {
  try {
    await prisma.notification.updateMany({
      where: {
        id: { in: notificationIds },
        userId,
      },
      data: {
        read: true,
      },
    });
    return true;
  } catch (error) {
    console.error("Error marking notifications as read:", error);
    return false;
  }
}

/**
 * Get unread notification count for a user
 * @param {string} userId - ID of the user
 */
export async function getUnreadNotificationCount(userId) {
  try {
    const count = await prisma.notification.count({
      where: {
        userId,
        read: false,
      },
    });
    return count;
  } catch (error) {
    console.error("Error getting unread notification count:", error);
    return 0;
  }
} 