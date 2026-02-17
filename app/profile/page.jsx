import { redirect } from "next/navigation";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import DeleteAccountDialog from "./DeleteAccountDialog";
import LogoutButton from "./LogoutButton";
import ShareProfileDialog from "./ShareProfileDialog";
import { getServerSession } from "next-auth";
import {
  Share2,
  Edit3,
  Music2,
  Heart,
  Users,
  Globe,
  Mic2,
  Trash2,
  CheckCircle2,
  Twitter,
  Instagram,
  ExternalLink,
  LayoutDashboard,
  Settings,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import UserList from "./components/UserList";


export const metadata = {
  title: "My Profile ",
  description:
    "View and edit your profile, manage your mixtapes, and connect with the mixtapped community.",
  alternates: { canonical: "/profile" },
};


function calculateProfileCompletion(user) {
  const baseFields = [user.name, user.bio, user.image || user.profilep];
  const djFields =
    user.type === "DJ"
      ? [
          user.djName,
          user.twitter,
          user.instagram,
          user.website,
          user.spotify,
          user.soundcloud,
          user.mixcloud,
        ]
      : [];
  const all = [...baseFields, ...djFields];
  return Math.round((all.filter(Boolean).length / all.length) * 100);
}

async function getProfile(email) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/user/profile?email=${encodeURIComponent(email)}`,
      { cache: "no-store" },
    );
    if (!res.ok) throw new Error("Failed to fetch profile");
    return res.json();
  } catch (err) {
    console.error("Error fetching profile:", err);
    return null;
  }
}

function formatCount(n = 0) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

function StatCard({ icon: Icon, value, label, accent = "indigo" }) {
  const colors = {
    indigo:
      "bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400",
    rose: "bg-rose-50 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400",
    amber:
      "bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400",
    teal: "bg-teal-50 text-teal-600 dark:bg-teal-900/30 dark:text-teal-400",
  };
  return (
    <div className="flex flex-col items-center gap-2 px-4 py-3 rounded-2xl bg-white dark:bg-gray-800/60 shadow-sm border border-gray-100 dark:border-gray-700/50 min-w-[80px]">
      <div className={`p-2 rounded-xl ${colors[accent]}`}>
        <Icon className="h-4 w-4" />
      </div>
      <span className="text-xl font-bold text-gray-900 dark:text-white leading-none">
        {formatCount(value)}
      </span>
      <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
        {label}
      </span>
    </div>
  );
}

function SocialLink({ href, icon: Icon, label, color }) {
  if (!href) return null;
  return (
    <a
      href={href.startsWith("http") ? href : `https://${href}`}
      target="_blank"
      rel="noopener noreferrer"
      className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all duration-200 hover:scale-105 hover:shadow-md ${color}`}
    >
      <Icon className="h-3.5 w-3.5" />
      {label}
    </a>
  );
}

function SettingsRow({ icon: Icon, label, description, children, danger }) {
  return (
    <div
      className={`flex items-center justify-between gap-4 p-4 rounded-2xl border transition-colors ${
        danger
          ? "border-red-100 bg-red-50/50 dark:border-red-900/30 dark:bg-red-900/10"
          : "border-gray-100 dark:border-gray-700/50 bg-white dark:bg-gray-800/60"
      }`}
    >
      <div className="flex items-start gap-3 min-w-0">
        <div
          className={`p-2 rounded-xl flex-shrink-0 ${
            danger
              ? "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400"
              : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
          }`}
        >
          <Icon className="h-4 w-4" />
        </div>
        <div className="min-w-0">
          <p
            className={`text-sm font-semibold ${danger ? "text-red-700 dark:text-red-400" : "text-gray-900 dark:text-white"}`}
          >
            {label}
          </p>
          {description && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              {description}
            </p>
          )}
        </div>
      </div>
      <div className="flex-shrink-0">{children}</div>
    </div>
  );
}


export default async function ProfilePage() {
  const session = await getServerSession();
  if (!session?.user?.email) redirect("/login");

  const user = await getProfile(session.user.email);
  if (!user) redirect("/login");

  const isDJ = user.type === "DJ";
  const completion = calculateProfileCompletion(user);
  const displayName = isDJ && user.djName ? user.djName : user.name;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        <div className="rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700/50">
          {/* Banner */}
          <div className="h-32 sm:h-40 bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 relative rounded-t-3xl overflow-hidden">
            <div className="absolute -top-6 -right-6 w-36 h-36 rounded-full bg-white/10 blur-2xl" />
            <div className="absolute bottom-0 left-12 w-24 h-24 rounded-full bg-indigo-300/20 blur-xl" />
            <div className="absolute top-4 left-1/3 w-16 h-16 rounded-full bg-purple-400/20 blur-lg" />
            {/* <Link
              href="/settings/profile"
              className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white text-xs font-medium transition-all duration-200 border border-white/25 hover:shadow-lg"
            >
              <Edit3 className="h-3 w-3" />
              Edit Profile
            </Link> */}
          </div>

          {/* White section — position:relative so avatar can be absolute inside */}
          <div className="relative bg-white dark:bg-gray-900 rounded-b-3xl px-5 pb-6">
            {/* Avatar — absolutely positioned, centred on the banner/white seam */}
            <div className="absolute left-5 -top-12 sm:-top-14">
              <div className="relative">
                <Avatar className="w-24 h-24 sm:w-28 sm:h-28 ring-4 ring-white dark:ring-gray-900 shadow-xl">
                  <AvatarImage
                    src={user.image || user.profilep}
                    alt={user.name}
                  />
                  <AvatarFallback className="text-2xl font-bold bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
                    {(user.name || user.email)?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                {user.isVerified && (
                  <div className="absolute -bottom-1 -right-1 bg-indigo-600 rounded-full p-0.5 ring-2 ring-white dark:ring-gray-900">
                    <CheckCircle2 className="h-4 w-4 text-white" />
                  </div>
                )}
              </div>
            </div>

            {/*
              Spacer + action buttons row.
              pt-14 / sm:pt-16 = half the avatar height, so text starts below it.
              Buttons are right-aligned in this same row.
            */}
            <div className="flex items-start justify-end gap-2 pt-3 pb-3">
              {isDJ && (
                <Link href="https://dj.mixtapped.com" target="_blank">
                  <Button
                    size="sm"
                    className="rounded-xl gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-500/25"
                  >
                    <LayoutDashboard className="h-3.5 w-3.5" />
                    Dashboard
                  </Button>
                </Link>
              )}
              <Link href="/favorites">
                <Button
                  size="sm"
                  variant="outline"
                  className="rounded-xl gap-1.5 border-gray-200 dark:border-gray-700"
                >
                  <Heart className="h-3.5 w-3.5 text-rose-500" />
                  Favorites
                  <span className="text-xs font-bold text-gray-500">
                    ({formatCount(user._count.likedMixtapes)})
                  </span>
                </Button>
              </Link>
            </div>

            {/* Name / DJ name / email — starts after avatar clears */}
            <div className="pt-2">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white leading-tight">
                  {user.name}
                </h1>
                {isDJ && (
                  <Badge
                    variant="secondary"
                    className="text-xs uppercase tracking-wide"
                  >
                    DJ
                  </Badge>
                )}
                {user.isVerified && (
                  <Badge className="text-xs bg-indigo-600 hover:bg-indigo-700">
                    Verified
                  </Badge>
                )}
              </div>
              {isDJ && user.djName && (
                <div className="flex items-center gap-1.5 mt-1">
                  <Mic2 className="h-4 w-4 text-indigo-500" />
                  <span className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                    {user.djName}
                  </span>
                </div>
              )}
              <p className="text-gray-400 dark:text-gray-500 text-xs mt-0.5">
                {user.email}
              </p>
            </div>

            {/* Bio */}
            {user.bio && (
              <p className="mt-4 text-gray-600 dark:text-gray-300 text-sm leading-relaxed max-w-xl">
                {user.bio}
              </p>
            )}

            {/* Social links */}
            {isDJ && (
              <div className="flex flex-wrap gap-2 mt-4">
                <SocialLink
                  href={user.twitter}
                  icon={Twitter}
                  label="Twitter"
                  color="border-sky-200 bg-sky-50 text-sky-700 hover:bg-sky-100 dark:border-sky-800 dark:bg-sky-900/20 dark:text-sky-400"
                />
                <SocialLink
                  href={user.instagram}
                  icon={Instagram}
                  label="Instagram"
                  color="border-pink-200 bg-pink-50 text-pink-700 hover:bg-pink-100 dark:border-pink-800 dark:bg-pink-900/20 dark:text-pink-400"
                />
                <SocialLink
                  href={user.website}
                  icon={Globe}
                  label="Website"
                  color="border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
                />
                <SocialLink
                  href={user.spotify}
                  icon={Music2}
                  label="Spotify"
                  color="border-green-200 bg-green-50 text-green-700 hover:bg-green-100 dark:border-green-800 dark:bg-green-900/20 dark:text-green-400"
                />
                <SocialLink
                  href={user.soundcloud}
                  icon={ExternalLink}
                  label="SoundCloud"
                  color="border-orange-200 bg-orange-50 text-orange-700 hover:bg-orange-100 dark:border-orange-800 dark:bg-orange-900/20 dark:text-orange-400"
                />
                <SocialLink
                  href={user.mixcloud}
                  icon={ExternalLink}
                  label="Mixcloud"
                  color="border-indigo-200 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 dark:border-indigo-800 dark:bg-indigo-900/20 dark:text-indigo-400"
                />
              </div>
            )}
          </div>
        </div>

        {/* ── Stats Row ── */}
        <div className="flex flex-wrap justify-center sm:justify-start gap-3">
          {isDJ && (
            <StatCard
              icon={Music2}
              value={user._count.mixtapes}
              label="Mixtapes"
              accent="indigo"
            />
          )}
          {isDJ && (
            <StatCard
              icon={Users}
              value={user._count.followedBy}
              label="Followers"
              accent="teal"
            />
          )}
          <StatCard
            icon={Users}
            value={user._count.following}
            label="Following"
            accent="amber"
          />
          <StatCard
            icon={Heart}
            value={user._count.likedMixtapes}
            label="Liked"
            accent="rose"
          />
        </div>

        {/* ── Tabs ── */}
        <Tabs defaultValue="following" className="w-full">
          <TabsList className="w-full grid grid-cols-2 rounded-2xl p-1 bg-gray-100 dark:bg-gray-800/80 h-auto gap-1">
            <TabsTrigger
              value="following"
              className="rounded-xl py-2.5 text-sm font-medium data-[state=active]:bg-white dark:data-[state=active]:bg-gray-900 data-[state=active]:shadow-sm data-[state=active]:text-indigo-600 dark:data-[state=active]:text-indigo-400 transition-all"
            >
              <Users className="h-4 w-4 mr-1.5 inline-block" />
              Following
            </TabsTrigger>
            <TabsTrigger
              value="settings"
              className="rounded-xl py-2.5 text-sm font-medium data-[state=active]:bg-white dark:data-[state=active]:bg-gray-900 data-[state=active]:shadow-sm data-[state=active]:text-indigo-600 dark:data-[state=active]:text-indigo-400 transition-all"
            >
              <Settings className="h-4 w-4 mr-1.5 inline-block" />
              Settings
            </TabsTrigger>
          </TabsList>

          {/* Following */}
          <TabsContent value="following" className="mt-4">
            <UserList email={user.email} />
          </TabsContent>

          {/* Settings */}
          <TabsContent value="settings" className="mt-4 space-y-3">
            {/* <SettingsRow
              icon={Edit3}
              label="Edit Profile"
              description="Update your name, bio, and profile picture"
            >
              <Link href="/settings/profile">
                <Button
                  size="sm"
                  variant="outline"
                  className="rounded-xl gap-1 text-xs"
                >
                  Edit <ChevronRight className="h-3 w-3" />
                </Button>
              </Link>
            </SettingsRow> */}

            <SettingsRow
              icon={Share2}
              label="Share Profile"
              description="Share your public profile with others"
            >
              <ShareProfileDialog username={user.name} />
            </SettingsRow>

            {isDJ && (
              <SettingsRow
                icon={LayoutDashboard}
                label="DJ Dashboard"
                description="Manage your mixtapes and analytics"
              >
                <Link href="https://dj.mixtapped.com" target="_blank">
                  <Button
                    size="sm"
                    variant="outline"
                    className="rounded-xl gap-1 text-xs"
                  >
                    Open <ExternalLink className="h-3 w-3" />
                  </Button>
                </Link>
              </SettingsRow>
            )}

            <div className="pt-2 space-y-3">
              <SettingsRow
                icon={Edit3}
                label="Log Out"
                description="Sign out of your account"
              >
                <LogoutButton />
              </SettingsRow>

              {!isDJ && (
                <SettingsRow
                  icon={Trash2}
                  label="Delete Account"
                  description="Permanently delete your account and all data"
                  danger
                >
                  <DeleteAccountDialog />
                </SettingsRow>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
