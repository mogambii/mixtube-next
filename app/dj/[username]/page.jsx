import ContactsDisplay from "@/components/Contacts";
import MyMixxes from "@/components/MyMixxes";
import Image from "next/image";

const DjProfile = async ({ params: { username } }) => {
  async function getProfile() {
    try {
      const response = await fetch(
        `https://server-nezz.vercel.app/api/user/dj/profile/?username=${username}`,
        {
          method: "GET",
        }
      );
      if (!response.ok) throw new Error(`Error: ${response.statusText}`);

      const profileData = await response.json();
      return profileData;
    } catch (error) {
      console.error(error);
    }
  }

  const profile = await getProfile();

  if (!profile) {
    return (
      <div className="min-h-screen px-4">
        <h4>An error occurred</h4>
      </div>
    );
  }
  return (
    <div className="min-h-screen px-4">
      <div className="grid items-center justify-center grid-cols-1 md:grid-cols-2 mb-6">
        <div className="flex flex-col items-center mb-4">
          <Image
            className="rounded-full border-4 border-gray-300 h-44 w-44 object-cover"
            src={profile.profilep}
            alt={`${profile.username}'s profile`}
            width={200}
            height={200}
          />
          <h6 className="font-righteous dark:text-slate-50 text-center mt-2">
            {profile.Djname && profile.Djname}
          </h6>
          <h6 className="font-righteous dark:text-slate-50 text-center">
            @{profile.username}
          </h6>
          <ContactsDisplay
            contacts={profile.contacts}
            socialMediaHandles={profile.socialMediaHandles}
          />
        </div>
        <div className="flex flex-col items-center dark:text-slate-100">
          <div className="flex flex-col items-center mb-4">
            <div className="flex gap-6 mb-4">
              <div className="text-center">
                <h3 className="font-bold">Downloads</h3>
                <h3>{profile.downloads}</h3>
              </div>
              <div className="text-center">
                <h3 className="font-bold">Likes</h3>
                <h3>{profile.likes}</h3>
              </div>
              <div className="text-center">
                <h3 className="font-bold">Followers</h3>
                <h3>{profile.totalFollowers ? profile.totalFollowers : 0}</h3>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="p-3 border rounded-sm mb-6">
        <h4 className="dark:text-slate-50 text-center font-righteous">Bio</h4>
        <h3 className="dark:text-slate-50 text-center p-2">
          {profile.Bio || "not added"}
        </h3>
      </div>
      <div className="py-3">
        <h5 className="dark:text-slate-50 text-center py-2 font-righteous">
          Mixtapes
        </h5>
        <div className="items-center justify-center border rounded-lg p-2 gap-4">
          <MyMixxes username={profile.username} />
        </div>
      </div>
    </div>
  );
};

export default DjProfile;
