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

// ─── Data fetching ────────────────────────────────────────────────────────────

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
  <div className="group relative bg-white dark:bg-gray-800/80 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700/60 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 overflow-hidden">
    {/* Subtle hover glow */}
    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/0 to-purple-500/0 group-hover:from-indigo-500/5 group-hover:to-purple-500/5 transition-all duration-500 rounded-2xl" />

    <div className="relative flex items-center gap-4">
      <div className="p-3 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl ring-1 ring-indigo-100 dark:ring-indigo-800/40 group-hover:scale-110 transition-transform duration-300">
        <Icon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
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

  const [profile, isFollowing] = await Promise.all([
    fetchProfile(username),
    checkIsFollowing(username),
  ]);

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
    <div className="min-h-screen">
      {/* ── Hero / Profile Header ─────────────────────────────────────────── */}
      <div className="relative bg-white dark:bg-gray-900 overflow-hidden">
        {/* Decorative gradient banner */}
        <div className="absolute top-0 left-0 right-0 h-48 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 opacity-90" />
        {/* Noise texture overlay */}
        <div className="absolute top-0 left-0 right-0 h-48 bg-[url('/images/noise.png')] opacity-[0.08] mix-blend-overlay pointer-events-none" />
        {/* Soft vignette at bottom of banner */}
        <div className="absolute top-0 left-0 right-0 h-48 bg-gradient-to-b from-transparent to-white dark:to-gray-900" />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 pt-10 pb-8">
          <div className="flex flex-col md:flex-row items-center md:items-end gap-6 md:gap-8">
            {/* Avatar */}
            <div className="relative flex-shrink-0 mt-4">
              <div className="relative w-32 h-32 md:w-36 md:h-36 rounded-2xl overflow-hidden ring-4 ring-white dark:ring-gray-800 shadow-2xl">
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
                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed max-w-xl mb-5 bg-gray-50 dark:bg-gray-800/60 rounded-xl px-4 py-3 border border-gray-100 dark:border-gray-700/50">
                  {profile.bio}
                </p>
              )}

              {/* Actions row */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start items-center">
                <Follow username={username} following={isFollowing} />
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
          <RecentMixxes username={username} />
        </div>
      </div>
    </div>
  );
};

export default DjProfile;
