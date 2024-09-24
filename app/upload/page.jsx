"use client";
import { useState, useRef, useEffect } from "react";
import { FiUpload, FiXCircle } from "react-icons/fi";
import { Tooltip } from "@mui/material";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Image from "next/image";

export default function Create() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [Djname, setDjname] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setUsername(localStorage.getItem("mixtube-tokenname") || "");
      setDjname(localStorage.getItem("mixtube-Djname") || "");
      document.title = "Create Mixtape | MixTube";
    }
  }, []);

  const genres = [
    "POP", "RAP", "TRAP", "BONGO", "DRILL", "DANCEHALL", "GENGETONE", "REGGAE", "CRUNK", "HIPHOP"
  ];

  const [formData, setFormData] = useState({
    title: "",
    genre: "",
    date: "",
    desc: "",
    username,
    Djname,
    imgthumb: null,
    audio: null,
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [imgPreview, setImgPreview] = useState(null);
  const [audioTitle, setAudioTitle] = useState("");
  const [isCustomGenre, setIsCustomGenre] = useState(false); // Track custom genre input

  const imgThumbRef = useRef();
  const audioRef = useRef();

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      const file = files[0];
      if (name === "imgthumb") {
        if (file.size > 4 * 1024 * 1024) {
          toast.error("Image size should not exceed 4MB");
          return;
        }
        setImgPreview(URL.createObjectURL(file));
      } else if (name === "audio") {
        if (file.size > 150 * 1024 * 1024) {
          toast.error("Audio size should not exceed 150MB");
          return;
        }
        setAudioTitle(file.name);
      }
      setFormData((prev) => ({ ...prev, [name]: file }));
    } else {
      if (name === "genre" && value === "OTHER") {
        setIsCustomGenre(true); // Show custom genre input
        setFormData((prev) => ({ ...prev, genre: "" }));
      } else {
        setIsCustomGenre(false);
        setFormData((prev) => ({ ...prev, [name]: value }));
      }
    }
  };

  const MAX_RETRIES = 3;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setUploadProgress(0);
    setError("");

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      data.append(key, value);
    });

    let retries = 0;

    const uploadMixtape = () => {
      return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open(
          "POST",
          "https://web-24h2fqj0usck.up-de-fra1-k8s-1.apps.run-on-seenode.com/api/upload",
          true
        );
        xhr.setRequestHeader(
          "Authorization",
          `Bearer ${localStorage.getItem("mixtube-token")}`
        );

        xhr.upload.addEventListener("progress", (event) => {
          if (event.lengthComputable) {
            const percentComplete = (event.loaded / event.total) * 100;
            setUploadProgress(Math.round(percentComplete));
          }
        });

        xhr.onload = () => {
          if (xhr.status === 201) {
            resolve();
          } else {
            const errorMsg =
              xhr.status === 400
                ? "Bad request. Please check your input and try again."
                : xhr.status === 401
                ? "Unauthorized. Please log in again."
                : xhr.status === 500
                ? "Server error. Please try again later."
                : "An unexpected error occurred. Please try again.";
            reject(new Error(errorMsg));
          }
        };

        xhr.onerror = () =>
          reject(new Error("Network error. Please try again."));

        // No timeout, as long uploads should not fail due to time limits
        xhr.send(data);
      });
    };

    const attemptUpload = async () => {
      while (retries < MAX_RETRIES) {
        try {
          await uploadMixtape();
          toast.success("Mixtape uploaded successfully");
          router.push("/profile");
          return;
        } catch (err) {
          retries += 1;
          if (retries === MAX_RETRIES) {
            setError(err.message);
            toast.error(err.message);
            break;
          }
          toast(`Retrying upload... (${retries}/${MAX_RETRIES})`);
        }
      }
      setSubmitting(false);
    };

    attemptUpload();
  };

  const handleCancel = () => {
    setFormData({
      title: "",
      genre: "",
      date: "",
      desc: "",
      username,
      Djname,
      imgthumb: null,
      audio: null,
    });
    setImgPreview(null);
    setAudioTitle("");
    setUploadProgress(0);
    setError("");
    setIsCustomGenre(false);
    if (imgThumbRef.current) imgThumbRef.current.value = null;
    if (audioRef.current) audioRef.current.value = null;
  };

  const isFormIncomplete =
    !formData.title ||
    !formData.genre ||
    !formData.date ||
    !formData.desc ||
    !formData.imgthumb ||
    !formData.audio ||
    submitting;

  return (
    <>
      <h3 className="text-lg font-semibold p-4 dark:text-slate-50">Mixtube</h3>
      <form
        onSubmit={handleSubmit}
        className="border rounded-lg overflow-hidden p-4 bg-white dark:bg-gray-800"
      >
        <div className="grid grid-cols-1 gap-x-5 gap-y-8 border-b border-slate-900/10 pb-12 md:grid-cols-2">
          <h2 className="text-base p-1 gap-y-2 font-semibold leading-7 text-slate-900 dark:text-slate-50">
            Mixtape Information
          </h2>

          {/* Title Field */}
          <div className="grid max-w-2xl grid-cols-1 gap-y-3 gap-x-3">
            <label
              htmlFor="title"
              className="block dark:text-slate-50 text-sm font-small leading-6 text-slate-900"
            >
              Title
            </label>
            <input
              name="title"
              id="title"
              value={formData.title}
              onChange={handleChange}
              type="text"
              className="block border border-gray-300 rounded-md py-1 px-2 text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:ring-0 sm:text-sm sm:leading-6"
              placeholder="Title"
              required
            />
          </div>

          {/* Release Year Field */}
          <div className="grid max-w-2xl grid-cols-1 gap-y-6 gap-x-7">
            <label
              htmlFor="date"
              className="block dark:text-slate-50 text-sm font-small leading-6 text-slate-900"
            >
              Release Year
            </label>
            <input
              name="date"
              id="date"
              value={formData.date}
              onChange={handleChange}
              type="text"
              className="block border border-gray-300 rounded-md py-1 px-2 text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:ring-0 sm:text-sm sm:leading-6"
              placeholder="Release date"
              required
            />
          </div>

          {/* Genre Field */}
          <div className="grid max-w-2xl grid-cols-1 gap-y-6 gap-x-7">
            <label
              htmlFor="genre"
              className="block dark:text-slate-50 text-sm font-small leading-6 text-slate-900"
            >
              Genre
            </label>
            <select
              name="genre"
              id="genre"
              value={genres.includes(formData.genre) ? formData.genre : "OTHER"}
              onChange={handleChange}
              className="block dark border border-gray-300 rounded-md py-1 px-2 text-slate-900 focus:border-indigo-500 focus:ring-0 sm:text-sm sm:leading-6"
              required
            >
              <option value="">Select a genre</option>
              {genres.map((genre) => (
                <option key={genre} value={genre}>
                  {genre}
                </option>
              ))}
              <option value="OTHER">Other</option>
            </select>
            {isCustomGenre && (
              <input
                name="customGenre"
                value={formData.genre}
                onChange={handleChange}
                type="text"
                className="block w-full mt-2 border border-gray-300 rounded-md py-1 px-2 text-slate-900 focus:border-indigo-500 focus:ring-0 sm:text-sm sm:leading-6"
                placeholder="Enter your genre"
                required
              />
            )}
          </div>

          {/* Description Field */}
          <div className="grid max-w-2xl grid-cols-1 gap-y-3 gap-x-3">
            <label
              htmlFor="desc"
              className="block dark:text-slate-50 text-sm font-small leading-6 text-slate-900"
            >
              Description
            </label>
            <textarea
              name="desc"
              id="desc"
              value={formData.desc}
              onChange={handleChange}
              className="block w-full border border-gray-300 rounded-md py-1 px-2 text-slate-900 focus:border-indigo-500 focus:ring-0 sm:text-sm sm:leading-6"
              placeholder="Description"
              rows="3"
              required
            />
          </div>
        </div>

        {/* Upload Thumbnail */}
        <div className="py-4">
          <label
            htmlFor="imgthumb"
            className="block dark:text-slate-50 text-sm font-small leading-6 text-slate-900"
          >
            Upload Mixtape Cover Image
          </label>
          <div className="flex items-center mt-1">
            <input
              ref={imgThumbRef}
              name="imgthumb"
              id="imgthumb"
              type="file"
              accept="image/*"
              onChange={handleChange}
              className="border-gray-300 focus:border-indigo-500 focus:ring-0 sm:text-sm rounded-md"
              required
            />
            {imgPreview && (
              <div className="ml-4 relative w-16 h-16 overflow-hidden rounded-md">
                <Image
                  src={imgPreview}
                  alt="Thumbnail Preview"
                  fill
                  style={{ objectFit: "cover" }}
                />
                <Tooltip title="Remove" arrow>
                  <button
                    onClick={() => {
                      setImgPreview(null);
                      setFormData((prev) => ({ ...prev, imgthumb: null }));
                      if (imgThumbRef.current) imgThumbRef.current.value = null;
                    }}
                    className="absolute top-0 right-0 mt-1 mr-1 text-red-600"
                  >
                    <FiXCircle size={16} />
                  </button>
                </Tooltip>
              </div>
            )}
          </div>
        </div>

        {/* Upload Audio */}
        <div className="py-4">
          <label
            htmlFor="audio"
            className="block dark:text-slate-50 text-sm font-small leading-6 text-slate-900"
          >
            Upload Mixtape Audio
          </label>
          <div className="flex items-center mt-1">
            <input
              ref={audioRef}
              name="audio"
              id="audio"
              type="file"
              accept="audio/*"
              onChange={handleChange}
              className="border-gray-300 focus:border-indigo-500 focus:ring-0 sm:text-sm rounded-md"
              required
            />
            {audioTitle && (
              <div className="ml-4 text-sm dark:text-slate-50">
                {audioTitle}
              </div>
            )}
          </div>
        </div>

        {/* Upload Progress */}
        {uploadProgress > 0 && (
          <div className="py-4">
            <label className="block dark:text-slate-50 text-sm font-small leading-6 text-slate-900">
              Upload Progress: {uploadProgress}%
            </label>
            <progress
              className="w-full bg-gray-200 rounded-full"
              value={uploadProgress}
              max="100"
            />
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="py-2 text-red-600 text-sm font-small">{error}</div>
        )}

        {/* Action Buttons */}
        <div className="mt-6 flex justify-end gap-x-6">
          <button
            type="button"
            className="block w-32 text-center border-gray-300 rounded-md py-2 bg-red-600 text-white text-sm font-semibold"
            onClick={handleCancel}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isFormIncomplete}
            className={`block w-32 text-center py-2 ${
              isFormIncomplete
                ? "bg-gray-300 text-gray-600"
                : "bg-indigo-600 text-white"
            } rounded-md text-sm font-semibold`}
          >
            {submitting ? "Uploading..." : "Upload"}
          </button>
        </div>
      </form>
    </>
  );
}
