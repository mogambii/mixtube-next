const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

function formatMilestone(milestone) {
  if (milestone >= 1000000) {
    return `${(milestone / 1000000).toFixed(1)}M`;
  } else if (milestone >= 1000) {
    return `${(milestone / 1000).toFixed(1)}K`;
  }
  return milestone.toString();
}

async function createMilestoneNotification(mixtape, type, milestone) {
  try {
    const milestoneText = formatMilestone(milestone);
    const emoji = type === "plays" ? "🎉" : "📥";
    const message = `${emoji} Your mixtape "${mixtape.title}" just reached ${milestoneText} ${type}!`;

    // Check if notification already exists
    const existingNotification = await prisma.notification.findFirst({
      where: {
        mixtapeId: mixtape.id,
        type: "MILESTONE",
        message: {
          contains: `${milestoneText} ${type}`,
        },
      },
    });

    if (existingNotification) {
      console.log(
        `⚠️  Notification already exists for ${mixtape.title} - ${milestoneText} ${type}`
      );
      return null;
    }

    const notification = await prisma.notification.create({
      data: {
        type: "MILESTONE",
        message,
        userId: mixtape.userId,
        senderId: mixtape.userId,
        mixtapeId: mixtape.id,
      },
    });

    console.log(`✅ Created notification: ${message}`);
    return notification;
  } catch (error) {
    console.error(
      `❌ Error creating notification for ${mixtape.title}:`,
      error.message
    );
    return null;
  }
}

async function checkAndCreateMilestones(mixtape) {
  const milestones = [
    10, 50, 100, 500, 1000, 5000, 10000, 50000, 100000, 500000, 1000000,
  ];
  let notificationsCreated = 0;

  console.log(`\n🎵 Processing: ${mixtape.title}`);
  console.log(
    `   Plays: ${mixtape.totalPlays}, Downloads: ${mixtape.totalDownloads}`
  );

  // Check play milestones
  for (const milestone of milestones) {
    if (mixtape.totalPlays >= milestone) {
      const notification = await createMilestoneNotification(
        mixtape,
        "plays",
        milestone
      );
      if (notification) notificationsCreated++;
    }
  }

  // Check download milestones
  for (const milestone of milestones) {
    if (mixtape.totalDownloads >= milestone) {
      const notification = await createMilestoneNotification(
        mixtape,
        "downloads",
        milestone
      );
      if (notification) notificationsCreated++;
    }
  }

  return notificationsCreated;
}

/**
 * Main function to process all mixtapes
 */
async function main() {
  try {
    console.log(
      "🚀 Starting milestone notification creation for existing mixtapes...\n"
    );

    // Get all mixtapes with their stats
    const mixtapes = await prisma.mixtape.findMany({
      select: {
        id: true,
        title: true,
        totalPlays: true,
        totalDownloads: true,
        userId: true,
      },
      where: {
        OR: [{ totalPlays: { gt: 0 } }, { totalDownloads: { gt: 0 } }],
      },
      orderBy: [{ totalPlays: "desc" }, { totalDownloads: "desc" }],
    });

    console.log(
      `📊 Found ${mixtapes.length} mixtapes with plays or downloads\n`
    );

    let totalNotificationsCreated = 0;
    let processedCount = 0;

    for (const mixtape of mixtapes) {
      const notificationsCreated = await checkAndCreateMilestones(mixtape);
      totalNotificationsCreated += notificationsCreated;
      processedCount++;

      // Progress indicator
      if (processedCount % 10 === 0) {
        console.log(
          `\n📈 Progress: ${processedCount}/${mixtapes.length} mixtapes processed`
        );
      }
    }

    console.log("\n🎉 Script completed successfully!");
    console.log(`📊 Summary:`);
    console.log(`   - Mixtapes processed: ${processedCount}`);
    console.log(`   - Notifications created: ${totalNotificationsCreated}`);
    console.log(
      `   - Average notifications per mixtape: ${(totalNotificationsCreated / processedCount).toFixed(2)}`
    );
  } catch (error) {
    console.error("❌ Script failed:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}
