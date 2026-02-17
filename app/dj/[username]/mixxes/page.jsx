import MyMixxes from "@/components/MyMixxes";
import prisma from "@/lib/prismadb";
import { FaCompactDisc } from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft } from "lucide-react";

async function fetchProfile(username) {
  try {
    const user = await prisma.user.findUnique({
      where: { username },
      select: {
        id: true,
        username: true,
        djName: true,
        profilep: true,
        bio: true,
        _count: {
          select: { mixtapes: true },
        },
        mixtapes: {
          select: {
            id: true,
            title: true,
            imgthumb: true,
            unique: true,
            djName: true,
            time: true,
            totalDownloads: true,
            totalPlays: true,
          },
          orderBy: { time: "desc" },
          take: 10,
        },
      },
    });

    if (!user) return null;

    return {
      username: user.username,
      djName: user.djName,
      profilep: user.profilep,
      bio: user.bio,
      totalMixtapes: user._count.mixtapes,
      initialMixxes: user.mixtapes,
    };
  } catch (error) {
    console.error("fetchProfile error:", error);
    return null;
  }
}

export async function generateMetadata({ params }) {
  const { username } = await params;
  const profile = await fetchProfile(username);

  if (!profile) {
    return {
      title: "DJ Not Found | mixtapped",
      description: "The DJ profile you are looking for does not exist.",
      alternates: { canonical: `/dj/${username}/mixxes` },
    };
  }

  const name = profile.djName || username;
  const imageUrl = profile.profilep || "/images/default-avatar.png";

  return {
    title: `${name} — All Mixtapes | mixtapped`,
    description: `Browse all ${profile.totalMixtapes} mixtapes by ${name} on mixtapped.`,
    keywords: ["DJ", name, "mixtapped", "Mixtapes", "Music", "Mixes"],
    openGraph: {
      title: `${name} — All Mixtapes | mixtapped`,
      description: `Browse all ${profile.totalMixtapes} mixtapes by ${name} on mixtapped.`,
      images: [{ url: imageUrl, alt: `${name}'s profile picture` }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${name} — All Mixtapes | mixtapped`,
      description: `Browse all ${profile.totalMixtapes} mixtapes by ${name} on mixtapped.`,
      images: [imageUrl],
    },
    alternates: { canonical: `/dj/${username}/mixxes` },
  };
}

const MixxesPage = async ({ params }) => {
  const { username } = await params;

  if (!username) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500 dark:text-gray-400">
          No username provided.
        </p>
      </div>
    );
  }

  const profile = await fetchProfile(username);

  if (!profile) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3 px-4 text-center">
        <FaCompactDisc className="w-10 h-10 text-indigo-300" />
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">
          DJ not found
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          The profile you&apos;re looking for doesn&apos;t exist.
        </p>
        <Link
          href="/"
          className="mt-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors"
        >
          Go home
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* ── Page header ──────────────────────────────────────────────────── */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 sticky top-0 z-10 backdrop-blur-md bg-white/90 dark:bg-gray-900/90">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center gap-4">
          <Link
            href={`/dj/${username}`}
            className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to profile
          </Link>

          <div className="h-5 w-px bg-gray-200 dark:bg-gray-700" />

          {/* Mini profile pill */}
          <div className="flex items-center gap-2.5">
            {profile.profilep && (
              <div className="relative w-7 h-7 rounded-full overflow-hidden flex-shrink-0 ring-2 ring-indigo-100 dark:ring-indigo-900">
                <Image
                  src={profile.profilep}
                  alt={profile.djName || username}
                  fill
                  className="object-cover"
                  sizes="28px"
                />
              </div>
            )}
            <span className="text-sm font-semibold text-gray-900 dark:text-white truncate max-w-[140px]">
              {profile.djName || username}
            </span>
          </div>

          {/* Total count badge */}
          <span className="ml-auto bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-xs font-semibold px-3 py-1 rounded-full border border-indigo-100 dark:border-indigo-800/40 flex-shrink-0">
            {profile.totalMixtapes}{" "}
            {profile.totalMixtapes === 1 ? "mixtape" : "mixtapes"}
          </span>
        </div>
      </div>

      {/* ── Mixtape grid ─────────────────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <div className="bg-white dark:bg-gray-800/80 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700/60 overflow-hidden">
          <div className="flex items-center gap-2.5 px-6 py-5 border-b border-gray-100 dark:border-gray-700/60">
            <span className="p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg">
              <FaCompactDisc className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            </span>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              All Mixtapes
            </h1>
          </div>

          <div className="p-4 sm:p-6">
            {/* Pass SSR'd first page so there's no loading flash */}
            <MyMixxes
              username={username}
              initialMixxes={profile.initialMixxes}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MixxesPage;
