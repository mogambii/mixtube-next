import ContactsDisplay from "@/components/Contacts";
import Follow from "@/components/Follow";
import MyMixxes from "@/components/MyMixxes";
import { cookies } from "next/headers";
import Image from "next/image";

async function fetchProfile(username, cacheOption = "force-cache") {
  try {
    const response = await fetch(
      `https://server-nezz.vercel.app/api/user/dj/profile/?username=${username}`,
      {
        method: "GET",
        cache: cacheOption,
      }
    );
    if (!response.ok) throw new Error(`Error: ${response.statusText}`);
    return await response.json();
  } catch (error) {
    console.error(error);
    return null;
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

  const imageUrl = profile.profilep || 'https://default-image-url.com/default.jpg';
  const name = profile.Djname || username;
  const description = ` Discover ${name}'s mixtapes, biography, and social contacts on Mixtube. \n ${profile.Bio && profile.Bio} `;

  return {
    title: `${name} | DJ Profile on Mixtube`,
    description,
    keywords: [
      "DJ", 
      `${name}`, 
      "Mixtube", 
      "DJ Profile", 
      "Mixtape", 
      `${profile.genre}`, 
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

const checkFollowing = async (token, username) => {
  try {
    const res = await fetch(
      `https://server-nezz.vercel.app/api/user/check_follow?username=${username}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (!res.ok) throw new Error("Failed to check following status");

    const results = await res.json();
    return results.is_followed;
  } catch (error) {
    console.error("Error checking following status:", error);
    return false;
  }
};

const DjProfile = async ({ params: { username } }) => {
  const cookie = cookies().get("mixtube-token")?.value;
  const profile = await fetchProfile(username, "no-cache");
  const following = await checkFollowing(cookie, username);

  if (!profile) {
    return (
      <div className="min-h-screen px-4 text-center">
        <h1 className="text-xl font-bold">DJ Profile Not Found</h1>
        <p>The DJ profile you are looking for does not exist.</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen px-4" itemScope itemType="http://schema.org/Person">
      <link rel="canonical" href={`/dj/${username}`} />
      <div className="grid items-center justify-center grid-cols-1 md:grid-cols-2 mb-6">
        <div className="flex flex-col items-center mb-4">
          <Image
            priority
            className="rounded-full border-4 border-gray-300 h-44 w-44 object-cover"
            src={profile.profilep}
            alt={`Profile picture of DJ ${profile.Djname || username}`}
            width={200}
            height={200}
            itemProp="image"
          />
          <h2 className="text-2xl font-righteous dark:text-slate-50 text-center mt-2" itemProp="name">
            {profile.Djname}
          </h2>
          <h3 className="font-righteous dark:text-slate-50 text-center">@{profile.username}</h3>
          <ContactsDisplay
            contacts={profile.contacts}
            socialMediaHandles={profile.socialMediaHandles}
          />
        </div>
        <div className="flex flex-col items-center dark:text-slate-100">
          <div className="flex flex-col items-center mb-4">
            <div className="flex gap-6 mb-4">
              <div className="text-center" itemProp="interactionStatistic" itemScope itemType="http://schema.org/InteractionCounter">
                <meta itemProp="interactionType" content="http://schema.org/DownloadAction" />
                <h3 className="font-bold">Downloads</h3>
                <h3 itemProp="userInteractionCount">{profile.totalDownloads}</h3>
              </div>
              <div className="text-center" itemProp="interactionStatistic" itemScope itemType="http://schema.org/InteractionCounter">
                <meta itemProp="interactionType" content="http://schema.org/LikeAction" />
                <h3 className="font-bold">Likes</h3>
                <h3 itemProp="userInteractionCount">{profile.totalLikes}</h3>
              </div>
              <div className="text-center" itemProp="interactionStatistic" itemScope itemType="http://schema.org/InteractionCounter">
                <meta itemProp="interactionType" content="http://schema.org/FollowAction" />
                <h3 className="font-bold">Followers</h3>
                <h3 itemProp="userInteractionCount">{profile.totalFollowers || 0}</h3>
              </div>
            </div>
            {cookie && <Follow username={username} following={following} token={cookie} />}
          </div>
        </div>
      </div>
      <section className="p-3 border rounded-sm mb-6">
        <h4 className="dark:text-slate-50 text-center font-righteous">Bio</h4>
        <p className="dark:text-slate-50 text-center p-2" itemProp="description">
          {profile.Bio || "Bio not added"}
        </p>
      </section>
      <section className="py-3">
        <h5 className="dark:text-slate-50 text-center py-2 font-righteous">Mixtapes</h5>
        <div className="items-center justify-center border rounded-lg p-2 gap-4">
          <MyMixxes username={profile.username} />
        </div>
      </section>
    </main>
  );
};

export default DjProfile;
