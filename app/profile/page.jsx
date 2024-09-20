"use client";
import React, { useEffect, useState, useCallback } from "react";
import { Blocks } from "react-loader-spinner";
import { enqueueSnackbar } from "notistack";
import { FaSpinner } from "react-icons/fa6";
import { IoClose } from "react-icons/io5";
import { CiMenuFries } from "react-icons/ci";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import ContactsDisplay from "@/components/Contacts";
import MixCard from "../(components)/MixCard";
import Share from "@/components/Share";
import { LogOut } from "@/actions/handlers";

const Profile = () => {
  var username;
  if (typeof window !== "undefined") {
    document.title = "My Profile | MixTube";
    var username = localStorage.getItem("mixtube-tokenname");
  }
  const router = useRouter();
  const [likes, setLikes] = useState(0);
  const [downloads, setDownloads] = useState(0);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [loadingMixes, setLoadingMixes] = useState(true);
  const [profile, setProfile] = useState({});
  const [mixes, setMixes] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageCount, setPageCount] = useState(0);
  const [itemsPerPage] = useState(4);
  const [activeMixIndex, setActiveMixIndex] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [mixToDelete, setMixToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [open, setOpen] = useState(false);

  const fetchProfile = useCallback(async () => {
    try {
      const response = await fetch(
        `https://server-nezz.vercel.app/api/user/dj/profile/?username=${username}`
      );
      if (!response.ok) throw new Error(`Error: ${response.statusText}`);
      const profileData = await response.json();
      setProfile(profileData);
      setLoadingProfile(false);
    } catch (error) {
      console.error(error);
      setLoadingProfile(false);
    }
  }, [username]);

  const fetchMixes = useCallback(async () => {
    setLoadingMixes(true);
    try {
      const mixResponse = await fetch(
        `https://server-nezz.vercel.app/api/search/mixtapes?search=${username}&page=${currentPage}&limit=${itemsPerPage}`
      );
      if (mixResponse.status === 404) {
        setMixes([]);
        setDownloads(0);
        setLikes(0);
        setPageCount(0);
        setLoadingMixes(false);
        return;
      }
      if (!mixResponse.ok || !mixResponse.status === 404)
        throw new Error(`Error: ${mixResponse}`);

      const mixData = await mixResponse.json();
      setMixes(mixData.results);
      setDownloads(mixData.totalDownloads);
      setLikes(mixData.totalLikes);
      setPageCount(Math.ceil(mixData.totalmixtapes / itemsPerPage));
    } catch (error) {
      console.error(error);
      enqueueSnackbar("Failed to load mixes", { variant: "error" });
    } finally {
      setLoadingMixes(false);
    }
  }, [username, currentPage, itemsPerPage]);

  useEffect(() => {
    fetchProfile();
    fetchMixes();
  }, [fetchProfile, fetchMixes]);

  const handleLogout = async  () => {
    await LogOut();
    router.push("/");
  };

  const handleDeleteMix = async () => {
    setDeleting(true);
    try {
      const response = await fetch(
        `https://server-nezz.vercel.app/api/mixtape/${mixToDelete}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("mixtube-token")}`,
          },
        }
      );

      if (!response.ok || !response.status(404))
        throw new Error(`Error: ${response.statusText}`);

      setMixes(mixes.filter((mix) => mix.unique !== mixToDelete));
      enqueueSnackbar("Mixtape deleted successfully!", {
        variant: "success",
      });
    } catch (error) {
      console.error("Failed to delete mixtape:", error);
      enqueueSnackbar("Failed to delete mixtape", {
        variant: "error",
      });
    } finally {
      setDeleting(false);
      setShowModal(false);
    }
  };

  const toggleMenu = () => setOpen((prev) => !prev);

  const handleToggleMenu = (index) => {
    setActiveMixIndex(activeMixIndex === index ? null : index);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const createPaginationControls = () => {
    const controls = [];
    for (let i = 1; i <= pageCount; i++) {
      controls.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`border px-2 py-1 rounded-md mx-1 ${
            currentPage === i
              ? "bg-blue-600 text-white"
              : "bg-gray-200 dark:bg-gray-700 dark:text-gray-300"
          }`}
        >
          {i}
        </button>
      );
    }
    return controls;
  };

  if (loadingProfile) {
    return (
      <div className="min-h-screen grid justify-center items-center gap-3">
        <Blocks
          height="100"
          width="100"
          color="#4fa94d"
          ariaLabel="blocks-loading"
          visible={true}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-800 rounded-lg">
      <div className="flex justify-between p-2 relative">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-50">
          My Profile
        </h3>
        <div>
          <button
            onClick={toggleMenu}
            aria-label="Toggle menu"
            className="ring-1 rounded-full p-3 ring-slate-600 dark:ring-gray-500"
          >
            {open ? (
              <IoClose className="h-4 w-4 dark:text-slate-50" />
            ) : (
              <CiMenuFries className="h-4 w-4 dark:text-slate-50" />
            )}
          </button>
          {open && (
            <div className="transition-all duration-300 ease-in-out shadow-lg absolute right-10 top-10 border p-4 rounded-xl dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-50">
              <div className="grid gap-3 w-full">
                <Link href="/editprofile">
                  <button className="w-full rounded-full px-4 py-2 font-semibold text-sm bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors duration-200 ease-in-out">
                    Edit Profile
                  </button>
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full rounded-full px-4 py-2 font-semibold text-sm bg-slate-100 dark:bg-slate-700 hover:bg-red-500 dark:hover:bg-red-600 text-red-700 dark:text-red-500 border-2 border-slate-300 dark:border-slate-600 transition-colors duration-200 ease-in-out"
                >
                  Logout
                </button>
                <button
                  onClick={() => setShowModal(true)}
                  className="w-full rounded-full px-4 py-2 font-semibold text-sm bg-slate-100 dark:bg-slate-700 hover:bg-red-500 dark:hover:bg-red-600 text-red-700 dark:text-red-500 border-2 border-slate-300 dark:border-slate-600 transition-colors duration-200 ease-in-out"
                >
                  Delete Profile
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="flex flex-col items-center md:flex-row justify-evenly p-4">
        <div className="flex flex-col items-center mb-6 md:mb-0">
          <Image
            className="rounded-full border-4 h-44 w-44 object-cover border-gray-300 dark:border-gray-700"
            src={profile.profilep}
            alt={`${profile.username}'s profile`}
            height={200}
            width={200}
          />
          <h6 className="font-righteous text-gray-900 dark:text-gray-50 text-center mt-4">
            {profile.Djname}
          </h6>
          <h6 className="font-righteous text-gray-900 dark:text-gray-50 text-center">
            @{profile.username}
          </h6>
          <ContactsDisplay
            contacts={profile.contacts}
            socialMediaHandles={profile.socialMediaHandles}
          />
        </div>
        <div className="flex flex-col items-center md:ml-20">
          <div className="flex flex-col items-center dark:text-gray-100 mb-6">
            <div className="flex gap-10 mb-4">
              <div className="text-center">
                <h3 className="font-bold">Downloads</h3>
                <h3>{downloads}</h3>
              </div>
              <div className="text-center">
                <h3 className="font-bold">Likes</h3>
                <h3>{likes}</h3>
              </div>
              <div className="text-center">
                <h3 className="font-bold">Followers</h3>
                <h3>{profile.totalFollowers ? profile.totalFollowers : 0}</h3>
              </div>
            </div>
            <div className=" flex items-center justify-between gap-x-3">
              <Link
                href="/upload"
                className="text-center px-4 py-2 w-full bg-blue-600 text-white hover:bg-blue-700 rounded-3xl"
              >
                Upload New
              </Link>
              <Share id={profile.username} />
            </div>
          </div>
        </div>
      </div>
      <div className="p-4 border rounded-md bg-gray-100 dark:bg-gray-900 dark:border-gray-700 m-2">
        <h4 className="dark:text-gray-50 text-center font-righteous">Bio</h4>
        <h3 className="dark:text-gray-50 text-center p-3">
          {profile.Bio || "Not added"}
        </h3>
      </div>
      <div className="py-6">
        <h5 className="dark:text-gray-50 text-center py-4 font-righteous">
          Mixtapes
        </h5>
        <div className="border rounded-lg p-4 bg-gray-100 dark:bg-gray-900 dark:border-gray-700 m-2">
          {loadingMixes ? (
            <div className="h-96 flex justify-center items-center">
              <Blocks
                height="100"
                width="100"
                color="#4fa94d"
                ariaLabel="blocks-loading"
                visible={true}
              />
            </div>
          ) : mixes.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {mixes.map((mix, index) => (
                  <div key={mix.unique} className="relative">
                    <MixCard
                      Djname={mix.Djname}
                      link={`/mix/${mix.unique}`}
                      title={mix.title}
                      year={mix.date}
                      name={mix.name}
                      img={mix.imgthumb}
                      downloads={mix.downloads}
                      likes={mix.likes}
                    />
                    <div className="absolute top-2 right-2">
                      <button
                        onClick={() => handleToggleMenu(index)}
                        className="bg-transparent rounded-md p-2 text-black border-t-2 border-r-2 m-1 ring-slate-50"
                      >
                        ☰
                      </button>
                      {activeMixIndex === index && (
                        <div className="absolute border-t-2 border-r-2 mt-1 bg-white rounded-lg shadow-lg z-10 ring-gray-900 ring-1 p-1 right-1">
                          <Link
                            href={`/editmixtape/${mix.unique}`}
                            className="block px-2 text-black hover:bg-gray-200 my-2 rounded-3xl w-full text-center ring-1 ring-slate-900"
                          >
                            Edit
                          </Link>
                          <button
                            onClick={() => {
                              setMixToDelete(mix.unique);
                              setShowModal(true);
                            }}
                            className="block px-2  text-red-600 my-2 hover:bg-gray-200 rounded-3xl w-full text-center ring-1 ring-red-900"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-center mt-4">
                {createPaginationControls()}
              </div>
            </>
          ) : (
            <div className="h-96 flex justify-center items-center">
              <h4 className="dark:text-gray-50 text-center font-righteous text-xs">
                No mixes
              </h4>
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
            <h2 className="text-lg dark:text-gray-50">Confirm Deletion</h2>
            <p className="mt-2 dark:text-gray-50">
              Are you sure you want to delete this mixtape?
            </p>
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-300 dark:bg-gray-700 text-black dark:text-gray-50 rounded-md mr-2"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteMix}
                className="px-4 py-2 bg-red-600 text-white rounded-md flex items-center justify-center"
                disabled={deleting}
              >
                {deleting ? <FaSpinner className="animate-spin" /> : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
