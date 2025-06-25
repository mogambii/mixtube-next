const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

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
 * Create a milestone notification
 * @param {Object} mixtape - Mixtape object
 * @param {string} type - 'plays' or 'downloads'
 * @param {number} milestone - The milestone that was reached
 */
async function createMilestoneNotification(mixtape, type, milestone) {
  try {
    const milestoneText = formatMilestone(milestone);
    const emoji = type === 'plays' ? '🎉' : '📥';
    const message = `${emoji} Your mixtape "${mixtape.title}" just reached ${milestoneText} ${type}!`;

    // Check if notification already exists
    const existingNotification = await prisma.notification.findFirst({
      where: {
        mixtapeId: mixtape.id,
        type: "MILESTONE",
        message: {
          contains: `${milestoneText} ${type}`
        }
      }
    });

    if (existingNotification) {
      console.log(`⚠️  Notification already exists for ${mixtape.title} - ${milestoneText} ${type}`);
      return null;
    }

    const notification = await prisma.notification.create({
      data: {
        type: "MILESTONE",
        message,
        userId: mixtape.userId,
        senderId: mixtape.userId, // Self notification
        mixtapeId: mixtape.id,
      }
    });

    console.log(`✅ Created notification: ${message}`);
    return notification;
  } catch (error) {
    console.error(`❌ Error creating notification for ${mixtape.title}:`, error.message);
    return null;
  }
}

/**
 * Check and create milestone notifications for a mixtape
 * @param {Object} mixtape - Mixtape object
 */
async function checkAndCreateMilestones(mixtape) {
  const milestones = [10, 50, 100, 500, 1000, 5000, 10000, 50000, 100000, 500000, 1000000];
  let notificationsCreated = 0;

  console.log(`\n🎵 Processing: ${mixtape.title}`);
  console.log(`   Plays: ${mixtape.totalPlays}, Downloads: ${mixtape.totalDownloads}`);

  // Check play milestones
  for (const milestone of milestones) {
    if (mixtape.totalPlays >= milestone) {
      const notification = await createMilestoneNotification(mixtape, 'plays', milestone);
      if (notification) notificationsCreated++;
    }
  }

  // Check download milestones
  for (const milestone of milestones) {
    if (mixtape.totalDownloads >= milestone) {
      const notification = await createMilestoneNotification(mixtape, 'downloads', milestone);
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
    console.log('🚀 Starting milestone notification creation for existing mixtapes...\n');

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
        OR: [
          { totalPlays: { gt: 0 } },
          { totalDownloads: { gt: 0 } }
        ]
      },
      orderBy: [
        { totalPlays: 'desc' },
        { totalDownloads: 'desc' }
      ]
    });

    console.log(`📊 Found ${mixtapes.length} mixtapes with plays or downloads\n`);

    let totalNotificationsCreated = 0;
    let processedCount = 0;

    for (const mixtape of mixtapes) {
      const notificationsCreated = await checkAndCreateMilestones(mixtape);
      totalNotificationsCreated += notificationsCreated;
      processedCount++;

      // Progress indicator
      if (processedCount % 10 === 0) {
        console.log(`\n📈 Progress: ${processedCount}/${mixtapes.length} mixtapes processed`);
      }
    }

    console.log('\n🎉 Script completed successfully!');
    console.log(`📊 Summary:`);
    console.log(`   - Mixtapes processed: ${processedCount}`);
    console.log(`   - Notifications created: ${totalNotificationsCreated}`);
    console.log(`   - Average notifications per mixtape: ${(totalNotificationsCreated / processedCount).toFixed(2)}`);

  } catch (error) {
    console.error('❌ Script failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

/**
 * Function to process specific mixtape by ID
 */
async function processSpecificMixtape(mixtapeId) {
  try {
    console.log(`🎵 Processing specific mixtape: ${mixtapeId}`);

    const mixtape = await prisma.mixtape.findUnique({
      where: { id: mixtapeId },
      select: {
        id: true,
        title: true,
        totalPlays: true,
        totalDownloads: true,
        userId: true,
      }
    });

    if (!mixtape) {
      console.error('❌ Mixtape not found');
      return;
    }

    const notificationsCreated = await checkAndCreateMilestones(mixtape);
    console.log(`\n✅ Created ${notificationsCreated} notifications for "${mixtape.title}"`);

  } catch (error) {
    console.error('❌ Error processing specific mixtape:', error);
  } finally {
    await prisma.$disconnect();
  }
}

/**
 * Function to show statistics without creating notifications
 */
async function showStatistics() {
  try {
    console.log('📊 Analyzing mixtape statistics...\n');

    const mixtapes = await prisma.mixtape.findMany({
      select: {
        id: true,
        title: true,
        totalPlays: true,
        totalDownloads: true,
        userId: true,
      },
      where: {
        OR: [
          { totalPlays: { gt: 0 } },
          { totalDownloads: { gt: 0 } }
        ]
      },
      orderBy: [
        { totalPlays: 'desc' },
        { totalDownloads: 'desc' }
      ]
    });

    const milestones = [10, 50, 100, 500, 1000, 5000, 10000, 50000, 100000, 500000, 1000000];
    
    console.log('🎯 Potential milestone notifications:');
    console.log('=====================================\n');

    let totalPotentialNotifications = 0;

    for (const mixtape of mixtapes) {
      let mixtapeNotifications = 0;
      const playMilestones = [];
      const downloadMilestones = [];

      // Check play milestones
      for (const milestone of milestones) {
        if (mixtape.totalPlays >= milestone) {
          playMilestones.push(formatMilestone(milestone));
          mixtapeNotifications++;
        }
      }

      // Check download milestones
      for (const milestone of milestones) {
        if (mixtape.totalDownloads >= milestone) {
          downloadMilestones.push(formatMilestone(milestone));
          mixtapeNotifications++;
        }
      }

      if (mixtapeNotifications > 0) {
        console.log(`🎵 ${mixtape.title}`);
        console.log(`   Plays: ${mixtape.totalPlays} (milestones: ${playMilestones.join(', ')})`);
        console.log(`   Downloads: ${mixtape.totalDownloads} (milestones: ${downloadMilestones.join(', ')})`);
        console.log(`   Total potential notifications: ${mixtapeNotifications}\n`);
        totalPotentialNotifications += mixtapeNotifications;
      }
    }

    console.log(`📊 Summary: ${mixtapes.length} mixtapes could generate ${totalPotentialNotifications} milestone notifications`);

  } catch (error) {
    console.error('❌ Error showing statistics:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Handle command line arguments
const args = process.argv.slice(2);

if (args.length === 0) {
  // Default: process all mixtapes
  main();
} else if (args[0] === '--stats' || args[0] === '-s') {
  // Show statistics only
  showStatistics();
} else if (args[0] === '--mixtape' || args[0] === '-m') {
  // Process specific mixtape
  const mixtapeId = args[1];
  if (!mixtapeId) {
    console.error('❌ Please provide a mixtape ID');
    process.exit(1);
  }
  processSpecificMixtape(mixtapeId);
} else {
  console.log('Usage:');
  console.log('  node scripts/create-milestone-notifications.js          # Process all mixtapes');
  console.log('  node scripts/create-milestone-notifications.js --stats   # Show statistics only');
  console.log('  node scripts/create-milestone-notifications.js --mixtape <id>  # Process specific mixtape');
  process.exit(1);
} 