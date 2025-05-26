import ContactsDisplay from "@/components/Contacts";
import Follow from "@/components/Follow";
import MyMixxes from "@/components/MyMixxes";
import Image from "next/image";
import {
  FaHeadphones,
  FaDownload,
  FaCompactDisc,
  FaUsers,
  FaCalendarAlt,
} from "react-icons/fa";
import { MdVerified } from "react-icons/md";
import { headers } from "next/headers";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

async function fetchProfile(username) {
  try {
    const response = await fetch(`http://localhost:3000/api/dj/${username}`, {
      method: "GET",
      cache: "no-store",
    });
    if (!response.ok) throw new Error(`Error: ${response.statusText}`);
    return await response.json();
  } catch (error) {
    console.error(error);
    return null;
  }
}

async function checkIsFollowing(username) {
  try {
    const session = await getServerSession(authOptions);
    const name = session?.user?.name;
    // const lowercase_name = name.toLowerCase();
    const lowercase_username = username.toLowerCase();
    const email = session?.user?.email;
    // console.log(lowercase_name, lowercase_username, email);
    const response = await fetch(
      `http://localhost:3000/api/user/isFollowing?djusername=${lowercase_username}&email=${email}`,
      {
        method: "GET",
        cache: "no-store",
      }
    );
    if (!response.ok) return false;
    const data = await response.json();
    return data.isFollowing;
  } catch (error) {
    console.error("Error checking follow status:", error);
    return false;
  }
}

export async function generateMetadata({ params: { username } }) {
  const profile = await fetchProfile(username);

  if (!profile) {
    return {
      title: "DJ Profile Not Found | Mixtube",
      description:
        "The DJ profile you are looking for does not exist on Mixtube.",
      alternates: {
        canonical: `/dj/${username}`,
      },
    };
  }

  const imageUrl = profile.profilep || "/images/default-avatar.png";
  const name = profile.djName || username;
  const description = `Discover ${name}'s mixtapes, biography, and social contacts on Mixtube. ${
    profile.bio || ""
  }`;

  return {
    title: `${name} | DJ Profile on Mixtube`,
    description,
    keywords: [
      "DJ",
      name,
      "Mixtube",
      "DJ Profile",
      "Mixtape",
      "Music",
      "Mixes",
      `${name}'s Mixtube Profile`,
    ],
    openGraph: {
      title: `${name} | DJ Profile on Mixtube`,
      description,
      images: [{ url: imageUrl, alt: `${name}'s profile picture` }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${name} | DJ Profile on Mixtube`,
      description,
      images: [imageUrl],
    },
    alternates: {
      canonical: `/dj/${username}`,
    },
  };
}

const StatCard = ({ icon: Icon, label, value }) => (
  <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 flex items-center space-x-4">
    <div className="p-3 bg-indigo-50 dark:bg-indigo-900/30 rounded-full">
      <Icon className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
    </div>
    <div>
      <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
        {label}
      </p>
      <p className="text-xl font-bold dark:text-white">
        {value.toLocaleString()}
      </p>
    </div>
  </div>
);

const DjProfile = async ({ params: { username } }) => {
  const [profile, isFollowing] = await Promise.all([
    fetchProfile(username),
    checkIsFollowing(username),
  ]);

  if (!profile) {
    return (
      <div className="min-h-screen px-4 py-8 text-center dark:text-white">
        <h1 className="text-2xl font-bold mb-4">DJ Profile Not Found</h1>
        <p className="text-gray-600 dark:text-gray-400">
          The DJ profile you are looking for does not exist.
        </p>
      </div>
    );
  }

  // Format the date when the DJ joined
  const formatJoinDate = () => {
    if (!profile.createdAt) return "Unknown";
    const date = new Date(profile.createdAt);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen px-4 py-8 max-w-7xl mx-auto">
      {/* Profile Header */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8 mb-8 relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute top-0 right-0 w-full h-32 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 opacity-50"></div>

        <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
          <div className="relative w-36 h-36 md:w-40 md:h-40 rounded-full overflow-hidden ring-4 ring-indigo-100 dark:ring-indigo-900 shadow-xl">
            <Image
              src={profile.profilep || "/images/default-avatar.png"}
              alt={profile.djName}
              fill
              className="object-cover"
              priority
            />
          </div>
          <div className="flex-1 text-center md:text-left">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-2">
              <h1 className="text-3xl md:text-4xl font-bold dark:text-white">
                {profile.djName}
              </h1>
              {profile.isVerified && (
                <MdVerified
                  className="w-6 h-6 text-blue-500"
                  title="Verified DJ"
                />
              )}
            </div>
            <div className="flex items-center justify-center md:justify-start text-sm text-gray-500 dark:text-gray-400 mb-4">
              <FaCalendarAlt className="mr-2" />
              <span>Joined {formatJoinDate()}</span>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700/30 p-4 rounded-lg mb-6">
              <p className="text-gray-600 dark:text-gray-300">
                {profile.bio || "No bio available"}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start items-center">
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

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
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

      {/* Mixtapes Section */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold dark:text-white flex items-center">
            <FaCompactDisc className="mr-3 text-indigo-500" />
            Latest Mixtapes
          </h2>
          {profile.totalMixtapes > 0 && (
            <span className="bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-300 text-sm font-medium px-3 py-1 rounded-full">
              {profile.totalMixtapes}{" "}
              {profile.totalMixtapes === 1 ? "mixtape" : "mixtapes"}
            </span>
          )}
        </div>
        <MyMixxes username={username} />
      </div>
    </div>
  );
};

export default DjProfile;
