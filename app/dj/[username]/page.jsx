import ContactsDisplay from "@/components/Contacts";
import Follow from "@/components/Follow";
import Image from "next/image";
import {
  FaHeadphones,
  FaDownload,
  FaCompactDisc,
  FaUsers,
  FaCalendarAlt,
} from "react-icons/fa";
import { MdVerified } from "react-icons/md";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prismadb";
import RecentMixxes from "@/components/RecentMixxes";
import { optimizeCloudinaryUrl } from "@/lib/cloudinary";

async function fetchProfile(username) {
  try {
    const response = await prisma.user.findUnique({
      where: { username },
      include: {
        followedBy: true,
        following: true,
        _count: {
          select: { mixtapes: true },
        },
        mixtapes: {
          take: 10,
          orderBy: { time: "desc" },
          select: {
            title: true,
            imgthumb: true,
            unique: true,
            djName: true,
            stats: {
              select: { plays: true, downloads: true },
            },
          },
        },
      },
    });

    if (!response) return null;

    const stats = await prisma.stats.groupBy({
      by: ["mixtapeId"],
      where: {
        mixtape: { userId: response.id },
      },
      _sum: {
        downloads: true,
        plays: true,
      },
    });

    const totalStats = stats.reduce(
      (acc, curr) => ({
        downloads: (acc.downloads || 0) + (curr._sum.downloads || 0),
        plays: (acc.plays || 0) + (curr._sum.plays || 0),
      }),
      { downloads: 0, plays: 0 }
    );

    return {
      id: response.id,
      username: response.username,
      djName: response.djName,
      email: response.email,
      profilep: response.profilep,
      bio: response.bio,
      createdAt: response.createdAt,
      isVerified: response.isVerified ?? false,
      totalMixtapes: response._count.mixtapes,
      totalFollowers: response.followedBy.length,
      totalFollowing: response.following.length,
      totalDownloads: totalStats.downloads,
      totalPlays: totalStats.plays,
      contacts: response.contacts,
      socialMediaHandles: response.socialMediaHandles,
      recentMixtapes: response.mixtapes.map((mix) => ({
        title: mix.title,
        imgthumb: mix.imgthumb,
        unique: mix.unique,
        djName: mix.djName,
        totalPlays: mix.stats.reduce((sum, stat) => sum + stat.plays, 0),
        totalDownloads: mix.stats.reduce((sum, stat) => sum + stat.downloads, 0),
      })),
    };
  } catch (error) {
    console.error("fetchProfile error:", error);
    return null;
  }
}

async function checkIsFollowingDirect(djUsername, loggedInEmail) {
  if (!loggedInEmail || !djUsername) return false;
  try {
    const user = await prisma.user.findUnique({
      where: { email: loggedInEmail },
      select: { id: true },
    });
    const djUser = await prisma.user.findUnique({
      where: { username: djUsername },
      select: { id: true },
    });
    if (!user || !djUser) return false;

    const followerRecord = await prisma.follower.findUnique({
      where: {
        followerId_followingId: {
          followerId: user.id,
          followingId: djUser.id,
        },
      },
    });
    return Boolean(followerRecord);
  } catch (error) {
    console.error("Error checking follow status:", error);
    return false;
  }
}

// ─── Metadata ─────────────────────────────────────────────────────────────────

export async function generateMetadata({ params }) {
  const { username } = await params;
  const profile = await fetchProfile(username);

  if (!profile) {
    return {
      title: "DJ Profile Not Found | Mixtapped",
      description: "The DJ profile you are looking for does not exist on Mixtapped.",
      alternates: { canonical: `/dj/${username}` },
    };
  }

  const imageUrl = profile.profilep || "/images/default-avatar.png";
  const name = profile.djName || username;
  const description = `Discover ${name}'s mixtapes, biography, and social contacts on Mixtapped. ${
    profile.bio || ""
  }`;

  return {
    title: `${name} | DJ Profile on Mixtapped`,
    description,
    keywords: [
      "DJ",
      name,
      "Mixtapped",
      "DJ Profile",
      "Mixtape",
      "Music",
      "Mixes",
    ],
    openGraph: {
      title: `${name} | DJ Profile on Mixtapped`,
      description,
      images: [{ url: imageUrl, alt: `${name}'s profile picture` }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${name} | DJ Profile on Mixtapped`,
      description,
      images: [imageUrl],
    },
    alternates: { canonical: `/dj/${username}` },
  };
}

// ─── Sub-components ───────────────────────────────────────────────────────────

const StatCard = ({ icon: Icon, label, value }) => (
  <div className="group relative bg-white/40 dark:bg-gray-900/40 backdrop-blur-xl rounded-2xl p-4 sm:p-5 shadow-sm border border-white/20 dark:border-white/5 hover:shadow-md hover:bg-white/60 dark:hover:bg-gray-800/60 transition-all duration-300 overflow-hidden">
    <div className="relative flex items-center gap-3 sm:gap-4">
      <div className="p-2.5 sm:p-3 bg-indigo-500/10 dark:bg-indigo-900/40 backdrop-blur-md rounded-xl border border-indigo-500/10 group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
        <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-500 dark:text-indigo-400" />
      </div>
      <div className="min-w-0">
        <p className="text-[10px] sm:text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-0.5 truncate">
          {label}
        </p>
        <p className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white leading-none">
          {Number(value).toLocaleString()}
        </p>
      </div>
    </div>
  </div>
);

// ─── Page Component ───────────────────────────────────────────────────────────

const DjProfile = async ({ params }) => {
  const { username } = await params;
  const session = await getServerSession(authOptions);
  const loggedInEmail = session?.user?.email;

  const [profile, isFollowing] = await Promise.all([
    fetchProfile(username),
    checkIsFollowingDirect(username, loggedInEmail),
  ]);

  const isOwnProfile = Boolean(
    profile?.email && loggedInEmail && profile.email === loggedInEmail
  );

  if (!profile) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 py-16 text-center">
        <div className="w-20 h-20 rounded-full bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center mb-6">
          <FaCompactDisc className="w-8 h-8 text-indigo-400" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
          DJ Profile Not Found
        </h1>
        <p className="text-gray-500 dark:text-gray-400 max-w-sm">
          The DJ profile you are looking for does not exist or may have been removed.
        </p>
      </div>
    );
  }

  const joinDate = profile.createdAt
    ? new Date(profile.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Unknown";

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-20 p-1 sm:p-4">
      {/* ── Hero / Profile Header ─────────────────────────────────────────── */}
      <div className="relative overflow-hidden mb-6 rounded-3xl">
        {/* Banner */}
        <div className="h-44 sm:h-56 bg-gradient-to-br from-indigo-600 via-purple-600 to-fuchsia-700 relative overflow-hidden">
          <div className="absolute -top-8 -left-8 w-48 h-48 rounded-full bg-white/10 blur-3xl animate-pulse" />
          <div className="absolute -bottom-10 right-10 w-40 h-40 rounded-full bg-fuchsia-400/20 blur-2xl" />
        </div>

        {/* Profile Card Overlay */}
        <div className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-3xl relative px-4 sm:px-8 pb-6 border-b border-x border-white/20 dark:border-white/5 rounded-b-3xl shadow-xl">
          <div className="flex flex-col md:flex-row items-center md:items-end gap-5 md:gap-8">
            {/* Avatar */}
            <div className="relative flex-shrink-0 -mt-16 sm:-mt-20">
              <div className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-full overflow-hidden border-4 border-white dark:border-gray-900 shadow-2xl ring-4 ring-indigo-500/20">
                <Image
                  src={optimizeCloudinaryUrl(profile.profilep) || "/images/default-avatar.png"}
                  alt={profile.djName || username}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>

            {/* Name + Details */}
            <div className="flex-1 text-center md:text-left pt-2">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-1">
                <h1 className="text-2xl sm:text-4xl font-black text-gray-900 dark:text-white tracking-tight">
                  {profile.djName || username}
                </h1>
                {profile.isVerified && (
                  <MdVerified
                    className="w-6 h-6 sm:w-7 sm:h-7 text-blue-500 flex-shrink-0"
                    title="Verified DJ"
                  />
                )}
              </div>

              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 flex items-center justify-center md:justify-start gap-1.5 mb-3">
                <FaCalendarAlt className="flex-shrink-0" />
                Joined {joinDate}
              </p>

              {/* Bio */}
              {profile.bio && (
                <p className="text-gray-700 dark:text-gray-200 text-xs sm:text-sm leading-relaxed max-w-xl mb-4 bg-white/40 dark:bg-gray-800/40 backdrop-blur-xl rounded-2xl px-4 py-3 border border-white/20 dark:border-white/5">
                  {profile.bio}
                </p>
              )}

              {/* Actions row */}
              <div className="flex flex-wrap gap-3 justify-center md:justify-start items-center">
                {!isOwnProfile && (
                  <Follow username={username} following={isFollowing} />
                )}
                <ContactsDisplay
                  className="justify-center"
                  username={username}
                  contacts={profile.contacts}
                  socialMediaHandles={profile.socialMediaHandles}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Main content ──────────────────────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-1.5 sm:px-6 space-y-6">
        {/* ── Stats grid ────────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
          <StatCard
            icon={FaCompactDisc}
            label="Mixtapes"
            value={profile.totalMixtapes}
          />
          <StatCard
            icon={FaHeadphones}
            label="Total Plays"
            value={profile.totalPlays}
          />
          <StatCard
            icon={FaDownload}
            label="Downloads"
            value={profile.totalDownloads}
          />
          <StatCard
            icon={FaUsers}
            label="Followers"
            value={profile.totalFollowers}
          />
        </div>

        {/* ── Recent Mixtapes section ──────────────────────────────────── */}
        <div className="p-0">
          <RecentMixxes
            username={username}
            mixtapes={profile.recentMixtapes}
            totalCount={profile.totalMixtapes}
          />
        </div>
      </div>
    </div>
  );
};

export default DjProfile;
