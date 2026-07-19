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


async function fetchProfile(username) {
  try {
    // FIX: was missing `await` — the original code compared a Promise to null
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

    // FIX: moved this inside the try so it runs after we confirm response exists
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
      { downloads: 0, plays: 0 },
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

async function checkIsFollowing(username) {
  try {
    const session = await getServerSession(authOptions);
    const email = session?.user?.email;
    if (!email) return false;

    const response = await fetch(
      `http://localhost:3000/api/user/isFollowing?djusername=${username}&email=${email}`,
      { method: "GET", cache: "no-store" },
    );
    if (!response.ok) return false;
    const data = await response.json();
    return data.isFollowing;
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
      title: "DJ Profile Not Found | mixtapped",
      description:
        "The DJ profile you are looking for does not exist on mixtapped.",
      alternates: { canonical: `/dj/${username}` },
    };
  }

  const imageUrl = profile.profilep || "/images/default-avatar.png";
  const name = profile.djName || username;
  const description = `Discover ${name}'s mixtapes, biography, and social contacts on mixtapped. ${profile.bio || ""}`;

  return {
    title: `${name} | DJ Profile on mixtapped`,
    description,
    keywords: [
      "DJ",
      name,
      "mixtapped",
      "DJ Profile",
      "Mixtape",
      "Music",
      "Mixes",
    ],
    openGraph: {
      title: `${name} | DJ Profile on mixtapped`,
      description,
      images: [{ url: imageUrl, alt: `${name}'s profile picture` }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${name} | DJ Profile on mixtapped`,
      description,
      images: [imageUrl],
    },
    alternates: { canonical: `/dj/${username}` },
  };
}

// ─── Sub-components ───────────────────────────────────────────────────────────

const StatCard = ({ icon: Icon, label, value, accent = "indigo" }) => (
  <div className="group relative bg-white/40 dark:bg-gray-800/40 backdrop-blur-xl rounded-3xl p-5 shadow-lg border border-white/20 dark:border-white/10 hover:shadow-xl hover:bg-white/60 dark:hover:bg-gray-700/60 transition-all duration-300 overflow-hidden">
    {/* Subtle hover glow */}
    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/0 to-purple-500/0 group-hover:from-indigo-500/5 group-hover:to-purple-500/5 transition-all duration-500 rounded-2xl" />

    <div className="relative flex items-center gap-4">
      <div className="p-3 bg-white/60 dark:bg-indigo-900/40 backdrop-blur-md rounded-2xl border border-white/40 dark:border-white/5 group-hover:scale-110 transition-transform duration-300">
        <Icon className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
      </div>
      <div>
        <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-0.5">
          {label}
        </p>
        <p className="text-2xl font-bold text-gray-900 dark:text-white leading-none">
          {Number(value).toLocaleString()}
        </p>
      </div>
    </div>
  </div>
);

// ─── Page ─────────────────────────────────────────────────────────────────────

const DjProfile = async ({ params }) => {
  const { username } = await params;
  const session = await getServerSession(authOptions);
  const loggedInEmail = session?.user?.email;

  const [profile, isFollowing] = await Promise.all([
    fetchProfile(username),
    checkIsFollowing(username),
  ]);

  const isOwnProfile = Boolean(profile?.email && loggedInEmail && profile.email === loggedInEmail);

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
          The DJ profile you are looking for does not exist or may have been
          removed.
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-20">
      {/* ── Hero / Profile Header ─────────────────────────────────────────── */}
      <div className="relative overflow-hidden mb-8">
        {/* Decorative gradient banner */}
        <div className="absolute top-0 left-0 right-0 h-56 bg-gradient-to-br from-indigo-600 via-purple-600 to-fuchsia-600 opacity-90" />
        
        {/* Animated pulsing orbs in background */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob" />
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000" />

        {/* Soft vignette at bottom of banner */}
        <div className="absolute top-12 left-0 right-0 h-44 bg-gradient-to-b from-transparent to-gray-50 dark:to-gray-950" />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 pt-16 pb-8">
          <div className="flex flex-col md:flex-row items-center md:items-end gap-6 md:gap-8 bg-white/40 dark:bg-gray-800/40 backdrop-blur-3xl p-6 sm:p-8 rounded-3xl border border-white/20 dark:border-white/10 shadow-2xl mt-8">
            {/* Avatar */}
            <div className="relative flex-shrink-0 -mt-20 md:-mt-24">
              <div className="relative w-36 h-36 md:w-44 md:h-44 rounded-full overflow-hidden border-4 border-white dark:border-gray-800 shadow-2xl">
                <Image
                  src={profile.profilep || "/images/default-avatar.png"}
                  alt={profile.djName || username}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>

            {/* Name + meta */}
            <div className="flex-1 text-center md:text-left pb-1">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-1.5">
                <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                  {profile.djName || username}
                </h1>
                {profile.isVerified && (
                  <MdVerified
                    className="w-7 h-7 text-blue-500 flex-shrink-0"
                    title="Verified DJ"
                  />
                )}
              </div>

              <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center justify-center md:justify-start gap-1.5 mb-4">
                <FaCalendarAlt className="flex-shrink-0" />
                Joined {joinDate}
              </p>

              {/* Bio */}
              {profile.bio && (
                <p className="text-gray-700 dark:text-gray-200 text-sm leading-relaxed max-w-xl mb-6 bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl rounded-2xl px-5 py-4 border border-white/20 dark:border-white/5 shadow-inner line-clamp-4">
                  {profile.bio}
                </p>
              )}

              {/* Actions row */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start items-center">
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
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* ── Stats grid ────────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
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

        {/* ── Mixtapes section ──────────────────────────────────────────── */}

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
