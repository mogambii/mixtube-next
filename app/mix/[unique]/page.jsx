import React from "react";
import {
  AlertCircle,
  Headphones,
  Download,
  Heart,
  Calendar,
  Info,
  ChevronRight,
  Mic2,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import CommentsPage from "@/app/(components)/Comments";
import LikeCounter from "@/components/LikeCounter";
import MixHeroActions from "../components/MixHeroActions";
import RelatedSlider from "../components/RelatedSlider";
import { getServerSession } from "next-auth";
import prisma from "@/lib/prismadb";

async function checkLikeStatus(email, mixtapeId) {
  if (!email) {
    return false;
  }
  try {
    const res = await fetch(
      `http://localhost:3000/api/mixtape/user/${mixtapeId}/liked?email=${email}`,
      { cache: "no-cache" }
    );
    if (!res.ok) throw new Error("Failed to check like status");
    const results = await res.json();
    return results.liked;
  } catch (error) {
    console.error("Error checking like status:", error);
    return false;
  }
}

async function getMixtape(unique) {
  try {
    const res = await prisma.mixtape.findUnique({
      where: { unique },
      include: {
        user: {
          select: {
            username: true,
            profilep: true,
            bio: true,
            djName: true,
          },
        },
        comments: {
          orderBy: { createdAt: "desc" },
          include: {
            user: {
              select: {
                id: true,
                username: true,
                djName: true,
                profilep: true,
              },
            },
          },
        },
      },
    });
    return res;
  } catch (error) {
    console.error("Error fetching mixtape:", error);
    return null;
  }
}

export async function generateMetadata({ params }) {
  const { unique } = await params;
  const mix = await getMixtape(unique);

  const defaultImageUrl = "https://i.ibb.co/17dxyfD/a5282d7a00d9ec58056a5.png";
  const imageUrl = mix?.cover || defaultImageUrl;

  return {
    title: mix ? `${mix.title} | Mixtapped` : "Mixtape Not Found",
    description:
      `${mix?.desc} mix on Mixtapped | Stream, play and download by ${
        mix?.djName || mix?.user?.username
      }` || `Explore ${mix?.djName}'s mixtape on Mixtapped.`,
    keywords: [
      "mixtape",
      "music",
      "dj mix",
      mix?.genre || "genre",
      mix?.title || "mixtape",
      "Mixtapped",
      mix?.djName || mix?.user?.username,
    ],
    openGraph: {
      title: `${mix?.title || "Mixtape"} | Mixtapped`,
      description:
        mix?.desc || `Explore ${mix?.djName}'s mixtape on Mixtapped.`,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: `${mix?.djName}'s mixtape cover`,
        },
      ],
      type: "music.song",
    },
    twitter: {
      card: "summary_large_image",
      title: `${mix?.title || "Mixtape"} | Mixtapped`,
      description:
        mix?.desc || `Explore ${mix?.djName}'s mixtape on Mixtapped.`,
      images: [imageUrl],
    },
    alternates: {
      canonical: `https://mixtapped.com/mix/${unique}`,
    },
  };
}

export default async function MixTape({ params }) {
  const session = await getServerSession();
  const { unique } = await params;
  const liked = await checkLikeStatus(session?.user?.email, unique);
  const mix = await getMixtape(unique);

  async function getRelatedMixtapes(mixtape, currentId) {
    if (!mixtape || !mixtape.genre) return [];

    try {
      const res = await fetch(
        `http://localhost:3000/api/mixtape/related?genre=${encodeURIComponent(
          mixtape.genre
        )}&excludeId=${currentId}&limit=10`,
        { cache: "no-cache" }
      );

      if (!res.ok) {
        const recentRes = await fetch(
          `http://localhost:3000/api/mixtape/recent?limit=10`,
          { cache: "no-cache" }
        );
        if (!recentRes.ok) throw new Error("Failed to fetch mixtapes");
        const recentData = await recentRes.json();
        return recentData.filter((item) => item.unique !== currentId);
      }

      const data = await res.json();
      return data.mixtapes || [];
    } catch (error) {
      console.error("Error fetching related mixtapes:", error);
      return [];
    }
  }

  const relatedMixtapes = await getRelatedMixtapes(mix, unique);

  if (!mix) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-950 p-4">
        <AlertCircle
          className="w-20 h-20 mb-6 text-indigo-500 dark:text-indigo-400"
          strokeWidth={1.5}
        />
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
          Mixtape Not Found
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          The mixtape you&apos;re looking for doesn&apos;t exist or has been removed.
        </p>
        <Link
          href="/"
          className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-2xl transition-colors shadow-lg shadow-indigo-500/25"
        >
          Return to Home
        </Link>
      </div>
    );
  }

  const genres = (mix.genre || "Music")
    .split(",")
    .map((g) => g.trim())
    .filter(Boolean);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-16">
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "MusicAlbum",
          "@id": `https://mixtapped.com/mix/${unique}`,
          name: mix.title,
          description: mix.desc,
          byArtist: { "@type": "Person", name: mix.djName },
          genre: mix.genre,
          image: mix.cover || mix.imgthumb,
          datePublished: mix.time,
        })}
      </script>

      {/* ── Top Ambient Hero Banner ── */}
      <div className="relative w-full overflow-hidden bg-gray-950 border-b border-white/10 pt-8 pb-10 sm:py-14 px-4 sm:px-6 lg:px-8">
        {/* Ambient Blur Backdrop */}
        <div
          className="absolute inset-0 bg-cover bg-center blur-3xl opacity-30 scale-125 transform pointer-events-none"
          style={{ backgroundImage: `url(${mix.imgthumb})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-gray-950/70 via-gray-950/90 to-gray-950 pointer-events-none" />

        {/* Main Hero Container */}
        <div className="relative max-w-6xl mx-auto z-10 flex flex-col md:flex-row items-center md:items-end gap-6 md:gap-10">

          {/* 1. Artwork */}
          <div className="relative flex-shrink-0">
            <div className="relative w-48 h-48 sm:w-60 sm:h-60 md:w-64 md:h-64 lg:w-72 lg:h-72 rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/15">
              <Image
                src={mix.imgthumb}
                alt={mix.title}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 640px) 192px, (max-width: 768px) 240px, 288px"
              />
            </div>
          </div>

          {/* 2. Metadata & Title Content */}
          <div className="flex-1 text-center md:text-left space-y-3.5 w-full">
            {/* Category / Genre Tag Line */}
            <div className="flex items-center justify-center md:justify-start gap-2 text-xs font-bold uppercase tracking-widest text-indigo-400">
              <span>Mixtape</span>
              <span>•</span>
              <span>{genres.join(" / ")}</span>
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white leading-tight tracking-tight drop-shadow-sm">
              {mix.title}
            </h1>

            {/* DJ Info */}
            <div className="flex items-center justify-center md:justify-start gap-2 pt-0.5">
              <Link
                href={`/dj/${mix.user.username}`}
                className="group flex items-center gap-2 text-gray-200 hover:text-white font-semibold transition-colors"
              >
                <div className="relative w-7 h-7 rounded-full overflow-hidden border border-indigo-500/40 group-hover:border-indigo-400 transition-colors">
                  <Image
                    src={mix.user.profilep}
                    alt={mix.djName}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex items-center gap-1.5 text-sm sm:text-base">
                  <Mic2 className="h-4 w-4 text-indigo-400" />
                  <span>{mix.djName}</span>
                </div>
              </Link>
            </div>

            {/* Minimal Subdued Metadata Line */}
            <div className="flex items-center justify-center md:justify-start gap-2 text-xs sm:text-sm text-gray-400 font-normal flex-wrap">
              <span className="flex items-center gap-1 text-gray-300">
                <Headphones className="h-3.5 w-3.5 text-gray-400" />
                <span>{mix.totalPlays.toLocaleString()} plays</span>
              </span>
              <span className="text-gray-600">•</span>
              <span className="flex items-center gap-1 text-gray-300">
                <Download className="h-3.5 w-3.5 text-gray-400" />
                <span>{mix.totalDownloads.toLocaleString()} downloads</span>
              </span>
              <span className="text-gray-600">•</span>
              <span className="flex items-center gap-1 text-gray-300">
                <Heart className="h-3.5 w-3.5 text-gray-400" />
                <LikeCounter initialCount={mix.totalLikes} mixtapeId={unique} compact={true} />
              </span>
              <span className="text-gray-600">•</span>
              <span className="flex items-center gap-1 text-gray-400">
                <Calendar className="h-3.5 w-3.5 text-gray-400" />
                <span>
                  {new Date(mix.time).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </span>
            </div>

            {/* ── 3. HERO ACTION BAR ── */}
            <div className="pt-2">
              <MixHeroActions
                id={unique}
                title={mix.title}
                initialLiked={liked}
                initialLikesCount={mix.totalLikes}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ── Main Page Content ── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 sm:mt-8 space-y-6">

        {/* About This Mix */}
        <div className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-3xl p-6 rounded-3xl border border-white/30 dark:border-white/5 shadow-xl">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
            <Info className="h-5 w-5 text-indigo-500" />
            About This Mix
          </h2>
          <div className="prose dark:prose-invert max-w-none text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
            {mix.desc ? (
              <span
                dangerouslySetInnerHTML={{
                  __html: mix.desc.replace(
                    /(https?:\/\/[^\s]+)/g,
                    '<a href="$1" target="_blank" rel="noopener noreferrer" class="text-indigo-600 dark:text-indigo-400 hover:underline font-medium">$1</a>'
                  ),
                }}
              />
            ) : (
              "No description available for this mixtape."
            )}
          </div>
        </div>

        {/* DJ Profile Card */}
        <div className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-3xl p-6 rounded-3xl border border-white/30 dark:border-white/5 shadow-xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <Link
              href={`/dj/${mix.user.username}`}
              className="group flex items-center gap-4"
            >
              <div className="relative w-16 h-16 rounded-2xl overflow-hidden border-2 border-indigo-500/30 group-hover:border-indigo-500 transition-colors flex-shrink-0">
                <Image
                  src={mix.user.profilep}
                  alt={mix.djName}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <p className="font-bold text-base sm:text-lg text-gray-900 dark:text-white group-hover:text-indigo-500 transition-colors">
                  {mix.djName}
                </p>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                  @{mix.user.username}
                </p>
                {mix.user.bio && (
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 line-clamp-1 max-w-md">
                    {mix.user.bio}
                  </p>
                )}
              </div>
            </Link>

            <Link
              href={`/dj/${mix.user.username}`}
              className="px-5 py-2.5 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-900/30 dark:hover:bg-indigo-900/50 text-indigo-600 dark:text-indigo-300 font-semibold rounded-2xl transition-colors text-xs sm:text-sm flex items-center gap-2 self-stretch sm:self-auto justify-center"
            >
              <span>View DJ Profile</span>
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {/* Netflix-style Related Mixtapes Carousel Slider */}
        <RelatedSlider
          relatedMixtapes={relatedMixtapes}
          genreTitle={genres.join(" / ")}
        />

        {/* Comments Section */}
        <div className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-3xl p-6 rounded-3xl border border-white/30 dark:border-white/5 shadow-xl">
          <CommentsPage comments={mix.comments} unique={unique} />
        </div>
      </div>
    </div>
  );
}
