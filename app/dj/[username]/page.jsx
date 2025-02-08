import ContactsDisplay from "@/components/Contacts";
import Follow from "@/components/Follow";
import MyMixxes from "@/components/MyMixxes";
import Image from "next/image";
import { FaHeadphones, FaDownload, FaCompactDisc, FaUsers } from 'react-icons/fa';
import { headers } from "next/headers";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

async function fetchProfile(username) {
  try {
    const response = await fetch(`http://localhost:3000/api/dj/${username}`, {
      method: "GET",
      cache: 'no-store'
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
    const response = await fetch(
      `http://localhost:3000/api/user/isFollowing?djusername=${username}&username=${name}`,
      {
        method: "GET",
        cache: 'no-store'
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
      description: "The DJ profile you are looking for does not exist on Mixtube.",
      alternates: {
        canonical: `/dj/${username}`,
      },
    };
  }

  const imageUrl = profile.profilep || '/images/default-avatar.png';
  const name = profile.djName || username;
  const description = `Discover ${name}'s mixtapes, biography, and social contacts on Mixtube. ${profile.bio || ''}`;

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
      `${name}'s Mixtube Profile`
    ],
    openGraph: {
      title: `${name} | DJ Profile on Mixtube`,
      description,
      images: [{ url: imageUrl, alt: `${name}'s profile picture` }],
    },
    twitter: {
      card: 'summary_large_image',
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
  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm flex items-center space-x-3">
    <div className="p-3 bg-blue-50 dark:bg-blue-900 rounded-full">
      <Icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
    </div>
    <div>
      <p className="text-gray-600 dark:text-gray-400 text-sm">{label}</p>
      <p className="text-xl font-semibold dark:text-white">{value.toLocaleString()}</p>
    </div>
  </div>
);

const DjProfile = async ({ params: { username } }) => {
  const [profile, isFollowing] = await Promise.all([
    fetchProfile(username),
    checkIsFollowing(username)
  ]);

  if (!profile) {
    return (
      <div className="min-h-screen px-4 py-8 text-center dark:text-white">
        <h1 className="text-2xl font-bold mb-4">DJ Profile Not Found</h1>
        <p className="text-gray-600 dark:text-gray-400">The DJ profile you are looking for does not exist.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-8 max-w-7xl mx-auto">
      {/* Profile Header */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-8">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="relative w-32 h-32 rounded-full overflow-hidden ring-4 ring-gray-100 dark:ring-gray-700">
            <Image
              src={profile.profilep || '/images/default-avatar.png'}
              alt={profile.djName}
              fill
              className="object-cover"
            />
          </div>
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl font-bold mb-2 dark:text-white">{profile.djName}</h1>
            <p className="text-gray-600 dark:text-gray-400 mb-4">{profile.bio || 'No bio available'}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 justify-center md:justify-start items-center">
              <Follow username={username} following={isFollowing} />
              <ContactsDisplay className="justify-center" username={username} contacts={profile.contacts} socialMediaHandles={profile.socialMediaHandles} />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          icon={FaCompactDisc}
          label="Total Mixtapes"
          value={profile.totalMixtapes}
        />
        <StatCard
          icon={FaHeadphones}
          label="Total Plays"
          value={profile.totalPlays}
        />
        <StatCard
          icon={FaDownload}
          label="Total Downloads"
          value={profile.totalDownloads}
        />
        <StatCard
          icon={FaUsers}
          label="Followers"
          value={profile.totalFollowers}
        />
      </div>

      {/* Mixtapes Section */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
        <h2 className="text-2xl font-bold mb-6 dark:text-white">Latest Mixtapes</h2>
        <MyMixxes username={username} />
      </div>
    </div>
  );
};

export default DjProfile;
