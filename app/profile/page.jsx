import { redirect } from "next/navigation";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
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
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import UserList from "./components/UserList";
import {
  BsInstagram,
  BsTwitterX,
  BsSpotify,
  BsSoundcloud,
} from "react-icons/bs";
import { FaMixcloud } from "react-icons/fa";

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

  const allFields = [...baseFields, ...djFields];
  const filledFields = allFields.filter((field) => field).length;
  return Math.round((filledFields / allFields.length) * 100);
}

async function getProfile(email) {
  try {
    const response = await fetch(
      `http://localhost:3000/api/user/profile?email=${encodeURIComponent(
        email
      )}`,
      {
        cache: "no-store",
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch profile");
    }

    return response.json();
  } catch (error) {
    console.error("Error fetching profile:", error);
    return null;
  }
}

export default async function ProfilePage() {
  const session = await getServerSession();

  if (!session?.user?.email) {
    redirect("/login");
  }

  const user = await getProfile(session.user.email);

  if (!user) {
    redirect("/login");
  }

  const isDJ = user.type === "DJ";

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Profile Header Card */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center space-y-4">
            {/* Avatar Section */}
            <div className="relative group">
              <Avatar className="w-24 h-24 ring-2 ring-primary ring-offset-2 ring-offset-background">
                <AvatarImage
                  src={user.image || user.profilep}
                  alt={user.name}
                />
                <AvatarFallback>
                  {user.name?.charAt(0).toUpperCase() ||
                    user.email?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </div>

            {/* Name and Basic Info */}
            <div className="text-center space-y-2">
              <div className="flex items-center justify-center gap-2">
                <h1 className="text-2xl font-bold">{user.name}</h1>
              </div>
              {isDJ && user.djName && (
                <div className="flex items-center justify-center gap-2">
                  <Mic2 className="h-5 w-5 text-primary" />
                  <p className="text-gray-600 dark:text-gray-300 text-lg">
                    {user.djName}
                  </p>
                </div>
              )}
              <p className="text-gray-600 dark:text-gray-300">{user.email}</p>
              <div className="flex justify-center gap-2">
                {isDJ && (
                  <Badge variant="secondary" className="text-sm">
                    Professional DJ
                  </Badge>
                )}
                {user.isVerified && (
                  <Badge variant="default" className="text-sm">
                    Verified
                  </Badge>
                )}
              </div>
            </div>

            {user.bio && (
              <p className="text-gray-600 dark:text-gray-300 text-center max-w-lg">
                {user.bio}
              </p>
            )}

            {/* Stats Section */}
            <div className="flex gap-8 text-center">
              {isDJ && (
                <div className="flex flex-col  items-center">
                  <Music2 className="h-5 w-5 mb-1 text-primary" />
                  <div className="text-2xl font-bold">
                    {user._count.mixtapes}
                  </div>
                  <div className="text-gray-600 dark:text-gray-400">
                    Mixtapes
                  </div>
                </div>
              )}
              {isDJ && (
                <div className="flex flex-col items-center">
                  <>
                    <Users className="h-5 w-5 mb-1 text-primary" />
                    <div className="text-2xl font-bold">
                      {user._count.followedBy}
                    </div>
                    <div className="text-gray-600 dark:text-gray-400">
                      Followers
                    </div>
                  </>
                </div>
              )}
              <div className="flex flex-col items-center">
                <Users className="h-5 w-5 mb-1 text-primary" />
                <div className="text-2xl font-bold">
                  {user._count.following}
                </div>
                <div className="text-gray-600 dark:text-gray-400">
                  Following
                </div>
              </div>
              <div className="flex flex-col items-center">
                <Heart className="h-5 w-5 mb-1 text-primary" />
                <div className="text-2xl font-bold">
                  {user._count.likedMixtapes}
                </div>
                <div className="text-gray-600 dark:text-gray-400">Liked</div>
              </div>
            </div>
            <div className="mt-8 w-full max-w-md mx-auto flex flex-col md:flex-row items-center justify-center gap-4">
              <Link href="/favorites" className="w-full md:w-auto">
                <Button variant="outline" className="w-full md:w-auto">
                  My Favorites ({user._count.likedMixtapes})
                </Button>
              </Link>

              {isDJ && (
                <Link
                  href="https://dj.mixtube.xyz"
                  target="_blank"
                  className="w-full md:w-auto"
                >
                  <Button
                    variant="outline"
                    className="w-full md:w-auto bg-primary text-primary-foreground"
                  >
                    Dashboard
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabbed Content - Different tabs for DJs */}
      <Tabs defaultValue="following" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="following">Following</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="following" className="space-y-4">
          <UserList email={user.email} />
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <h2 className="text-2xl font-semibold mb-4">Account Settings</h2>
          <div className="grid gap-4">
            <ShareProfileDialog username={user.name} />
            <div className="pt-6 border-t">
              <LogoutButton />
              {!isDJ && (
                <div className="mt-6">
                  <DeleteAccountDialog />
                </div>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
