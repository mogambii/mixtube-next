"use client";
import React, { useState, useEffect, useRef } from "react";
import { FaEdit } from "react-icons/fa";
import { Blocks } from "react-loader-spinner";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";

const ProfileEdit = () => {
  let token;
  let username;
  const router = useRouter();

  if (typeof window !== "undefined") {
    token = localStorage.getItem("mixtube-token");
    username = localStorage.getItem("mixtube-tokenname");
  }

  useEffect(() => {
    document.title = "Edit Profile | MixTube";
  }, []);

  const fileInputRef = useRef(null);

  const [loadingProfile, setLoadingProfile] = useState(true);
  const [form, setForm] = useState({
    profilep: "",
    username: username || "",
    Bio: "",
    Djname: "",
    facebook: "",
    instagram: "",
    x: "",
    phone: "",
    canCall: false,
    canSMS: false,
    canWhatsApp: false,
  });

  const [selectedFile, setSelectedFile] = useState(null);

  const getProfile = async () => {
    setLoadingProfile(true);
    try {
      const response = await fetch(
        `https://server-nezz.vercel.app/api/user/dj/profile/?username=${form.username}`
      );

      if (!response.ok) throw new Error(`Error: ${response.statusText}`);

      const profileData = await response.json();
      setForm((prevForm) => ({
        ...prevForm,
        Bio: profileData.Bio || "",
        Djname: profileData.Djname || "",
        profilep: profileData.profilep || "",
        facebook: profileData.socialMediaHandles?.FaceBook || "",
        instagram: profileData.socialMediaHandles?.Instagram || "",
        x: profileData.socialMediaHandles?.X || "",
        phone: profileData.contacts?.phoneNumber || "",
        canCall: profileData.contacts?.canCall || false,
        canSMS: profileData.contacts?.canSMS || false,
        canWhatsApp: profileData.contacts?.canWP || false,
      }));
    } catch (error) {
      console.error("Error loading profile:", error);
      toast.error("Error loading profile", { autoClose: 3000 });
    } finally {
      setLoadingProfile(false);
    }
  };

  useEffect(() => {
    if (form.username) {
      getProfile();
    }
  }, [form.username]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setForm((prevForm) => ({
        ...prevForm,
        profilep: URL.createObjectURL(file),
      }));
    }
  };

  const validateSocialMediaLinks = () => {
    const facebookRegex = /^(https?:\/\/)?(www\.)?facebook\.com\/[a-zA-Z0-9(\.\?)?]/;
    const instagramRegex = /^(https?:\/\/)?(www\.)?instagram\.com\/[a-zA-Z0-9(_)?]+\/?$/;
    const xRegex = /^(https?:\/\/)?(www\.)?x\.com\/[a-zA-Z0-9(_)?]+\/?$/;

    if (form.facebook && !facebookRegex.test(form.facebook)) {
      toast.error("Invalid Facebook profile link", { autoClose: 3000 });
      return false;
    }
    if (form.instagram && !instagramRegex.test(form.instagram)) {
      toast.error("Invalid Instagram profile link", { autoClose: 3000 });
      return false;
    }
    if (form.x && !xRegex.test(form.x)) {
      toast.error("Invalid X (Twitter) profile link", { autoClose: 3000 });
      return false;
    }
    return true;
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!validateSocialMediaLinks()) {
      return;
    }

    const formData = new FormData();
    formData.append("username", form.username);
    formData.append("Djname", form.Djname);
    formData.append("Bio", form.Bio);
    formData.append("FaceBook", form.facebook);
    formData.append("Instagram", form.instagram);
    formData.append("X", form.x);
    formData.append("phoneNumber", form.phone);

    formData.append("canCall", form.canCall);
    formData.append("canSMS", form.canSMS);
    formData.append("canWP", form.canWhatsApp);

    if (selectedFile) {
      formData.append("profilep", selectedFile);
    }

    try {
      const response = await fetch(
        "https://web-24h2fqj0usck.up-de-fra1-k8s-1.apps.run-on-seenode.com/api/user/profile",
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (!response.ok) throw new Error(`Error: ${response.statusText}`);

      toast.success("Profile updated successfully!", { autoClose: 3000 });

      // Reset the form
      setForm({
        profilep: "",
        username: "",
        Djname: "",
        Bio: "",
        facebook: "",
        instagram: "",
        x: "",
        phone: "",
        canCall: false,
        canSMS: false,
        canWhatsApp: false,
      });

      router.push("/profile");
    } catch (error) {
      console.error("An error occurred while updating the profile:", error);
      toast.error("An error occurred while updating the profile", {
        autoClose: 3000,
      });
    }
  };

  if (loadingProfile) {
    return (
      <div className="min-h-screen grid justify-center items-center gap-3 m-1/2">
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

  const renderInputField = (
    label,
    name,
    value,
    onChange,
    type = "text",
    placeholder = ""
  ) => (
    <div className="flex flex-col">
      <label
        htmlFor={name}
        className="text-sm font-medium text-gray-900 dark:text-gray-50"
      >
        {label}
      </label>
      <input
        value={value}
        onChange={onChange}
        type={type}
        name={name}
        id={name}
        className="mt-2 block w-full border border-gray-300 dark:border-gray-700 rounded-md py-2 px-3 text-gray-900 dark:text-gray-50 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder={placeholder}
      />
    </div>
  );

  return (
    <div className="min-h-screen bg-white dark:bg-gray-800 p-6 rounded-md">
      <form
        onSubmit={onSubmit}
        className="max-w-lg mx-auto mt-10 bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg shadow-md p-6"
      >
        <h2 className="text-2xl font-semibold text-center text-gray-900 dark:text-gray-50 mb-6">
          Edit Profile
        </h2>

        <div className="flex justify-center items-center mb-6">
          <div className="relative">
            {form.profilep ? (
              <Image
                className="rounded-full border-4 border-gray-300 dark:border-gray-700 h-40 w-40 object-cover"
                src={form.profilep}
                alt="Profile"
                height={300}
                width={300}
              />
            ) : (
              <div className="rounded-full border-4 border-gray-300 dark:border-gray-700 h-40 w-40 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                <span className="text-gray-500 dark:text-gray-300">
                  No Image
                </span>
              </div>
            )}
            <FaEdit
              className="absolute bottom-2 right-2 h-8 w-8 text-gray-500 dark:text-gray-300 cursor-pointer"
              onClick={() => fileInputRef.current.click()}
            />
          </div>
        </div>

        <input
          type="file"
          ref={fileInputRef}
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />

        <div className="grid grid-cols-1 gap-6">
          {renderInputField(
            "DJ Name",
            "Djname",
            form.Djname,
            (e) => setForm((prev) => ({ ...prev, Djname: e.target.value })),
            "text",
            "Your DJ name"
          )}
          {renderInputField(
            "Bio",
            "Bio",
            form.Bio,
            (e) => setForm((prev) => ({ ...prev, Bio: e.target.value })),
            "text",
            "Your bio"
          )}
          {renderInputField(
            "Facebook Profile Link",
            "facebook",
            form.facebook,
            (e) => setForm((prev) => ({ ...prev, facebook: e.target.value })),
            "text",
            "Your Facebook profile link"
          )}
          {renderInputField(
            "Instagram Profile Link",
            "instagram",
            form.instagram,
            (e) => setForm((prev) => ({ ...prev, instagram: e.target.value })),
            "text",
            "Your Instagram profile link"
          )}
          {renderInputField(
            "X (Twitter) Profile Link",
            "x",
            form.x,
            (e) => setForm((prev) => ({ ...prev, x: e.target.value })),
            "text",
            "Your X (Twitter) profile link"
          )}
          {renderInputField(
            "Phone Number",
            "phone",
            form.phone,
            (e) => setForm((prev) => ({ ...prev, phone: e.target.value })),
            "text",
            "Your phone number"
          )}

          <div className="flex items-center gap-4 mt-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={form.canCall}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, canCall: e.target.checked }))
                }
                className="form-checkbox h-5 w-5 text-blue-600"
              />
              <span className="ml-2 text-gray-700 dark:text-gray-50">
                Can Call
              </span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                checked={form.canSMS}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, canSMS: e.target.checked }))
                }
                className="form-checkbox h-5 w-5 text-blue-600"
              />
              <span className="ml-2 text-gray-700 dark:text-gray-50">
                Can SMS
              </span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                checked={form.canWhatsApp}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    canWhatsApp: e.target.checked,
                  }))
                }
                className="form-checkbox h-5 w-5 text-blue-600"
              />
              <span className="ml-2 text-gray-700 dark:text-gray-50">
                Can WhatsApp
              </span>
            </label>
          </div>
        </div>

        <div className="flex justify-between mt-6">
          <Link href="/profile">
            <button
              type="button"
              className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
          </Link>
          <button
            type="submit"
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
          >
            Update Profile
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileEdit;
