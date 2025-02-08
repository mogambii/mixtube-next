const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const userId = "679ddae192263e69a90a8587";
  const senderIds = [
    "nezz",
    "keith",
    "djnate",
    "james",
    "nate"
  ];
  
  const mixtapeIds = [
   "679def9737df7945509bf490",
   "679def9737df7945509bf490",
   "679def9737df7945509bf490",
  ];

  const notificationTypes = ['FOLLOW', 'LIKE', 'COMMENT'];
  
  // Create 20 dummy notifications
  const notifications = [];
  for (let i = 0; i < 10; i++) {
    const type = notificationTypes[Math.floor(Math.random() * notificationTypes.length)];
    const senderId = senderIds[Math.floor(Math.random() * senderIds.length)];
    const mixtapeId = type !== 'FOLLOW' ? mixtapeIds[Math.floor(Math.random() * mixtapeIds.length)] : null;
    
    let message = '';
    switch (type) {
      case 'FOLLOW':
        message = `User ${senderId} started following you`;
        break;
      case 'LIKE':
        message = `User ${senderId} liked your mixtape`;
        break;
      case 'COMMENT':
        message = `User ${senderId} commented on your mixtape`;
        break;
    }

    notifications.push({
      type,
      message,
      read: Math.random() > 0.3, // 30% chance of being unread
      userId,
      senderId,
      mixtapeId,
      createdAt: new Date(Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000)) 
    });
  }

  // Clear existing notifications
  await prisma.notification.deleteMany({
    where: { userId }
  });

  // Create new notifications
  for (const notification of notifications) {
    await prisma.notification.create({
      data: notification
    });
  }

  console.log('Added dummy notifications');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
