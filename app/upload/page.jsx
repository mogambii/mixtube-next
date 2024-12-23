"use client";
import { useState, useRef, useEffect } from "react";
import { FiUpload, FiXCircle } from "react-icons/fi";
import { Tooltip } from "@mui/material";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Image from "next/image";

export default function Create() {
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      document.title = "Create Mixtape | MixTube";
    }
  }, []);

  const genres = ["POP", "RAP", "TRAP", "BONGO", "DRILL", "DANCEHALL", "GENGETONE", "REGGAE", "CRUNK", "HIPHOP"];

  const [formData, setFormData] = useState({
    title: "",
    genre: "",
    date: "",
    desc: "",
    imgthumb: null,
    audio: null,
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [imgPreview, setImgPreview] = useState(null);
  const [audioTitle, setAudioTitle] = useState("");

  const imgThumbRef = useRef();
  const audioRef = useRef();

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      const file = files[0];
      if (name === "imgthumb") {
        if (file.size > 4 * 1024 * 1024) { // 4MB limit
          toast.error("Image size should not exceed 4MB");
          return;
        }
        setImgPreview(URL.createObjectURL(file));
      } else if (name === "audio") {
        if (file.size > 150 * 1024 * 1024) { // 150MB limit
          toast.error("Audio size should not exceed 150MB");
          return;
        }
        setAudioTitle(file.name);
      }
      setFormData((prev) => ({ ...prev, [name]: file }));
    } else {
      if (name === "genre" && value === "OTHER") {
        setFormData((prev) => ({ ...prev, [name]: "" }));
      } else {
        setFormData((prev) => ({ ...prev, [name]: value }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setUploadProgress(0);
    setError("");

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      data.append(key, value);
    });

    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/upload",true);

    xhr.withCredentials = true;
    xhr.upload.addEventListener("progress", (event) => {
      if (event.lengthComputable) {
        const percentComplete = (event.loaded / event.total) * 100;
        setUploadProgress(Math.round(percentComplete));
      }
    });

    xhr.onload = () => {
      setSubmitting(false);
      if (xhr.status === 201) {
        toast.success("Mixtape uploaded successfully");
        router.push("/profile");
      } else {
        const message = xhr.status === 400
          ? "Bad request. Please check your input and try again."
          : xhr.status === 401
          ? "Unauthorized. Please log in again."
          : xhr.status === 500
          ? "Server error. Please try again later."
          : "An unexpected error occurred. Please try again.";
        setError(message);
        toast.error(message);
      }
    };

    xhr.onerror = () => {
      setSubmitting(false);
      setError("An error occurred while submitting the form. Please check your network.");
      toast.error("An error occurred while submitting the form. Please check your network.");
    };

    xhr.ontimeout = () => {
      setSubmitting(false);
      setError("Request timed out. Please try again.");
      toast.error("Request timed out. Please try again.");
    };

    xhr.send(data);
  };

  const handleCancel = () => {
    setFormData({
      title: "",
      genre: "",
      date: "",
      desc: "",
      imgthumb: null,
      audio: null,
    });
    setImgPreview(null);
    setAudioTitle("");
    setUploadProgress(0);
    setError("");
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
              <option value="">Choose a genre</option>
              {genres.map((genre) => (
                <option key={genre} value={genre}>
                  {genre}
                </option>
              ))}
              <option value="OTHER">Other</option>
            </select>
            {!genres.includes(formData.genre) && (
              <input
                type="text"
                name="genre"
                value={formData.genre}
                onChange={handleChange}
                placeholder="Type your genre"
                className="mt-2 block border border-gray-300 rounded-md py-1 px-2 text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:ring-0 sm:text-sm sm:leading-6"
                required
              />
            )}
          </div>

          {/* Description Field */}
          <div className="grid max-w-2xl grid-cols-1 gap-y-6 gap-x-7">
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
              className="block border border-gray-300 rounded-md py-1 px-2 text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:ring-0 sm:text-sm sm:leading-6"
              placeholder="Describe your mixtape"
              rows={4}
              required
            />
          </div>

          {/* Thumb Image Field */}
          <div className="grid max-w-2xl grid-cols-1 gap-y-6 gap-x-7">
            <label
              htmlFor="imgthumb"
              className="block dark:text-slate-50 text-sm font-small leading-6 text-slate-900"
            >
              Thumb Image
            </label>
            <div className="relative">
              <input
                name="imgthumb"
                id="imgthumb"
                onChange={handleChange}
                type="file"
                accept="image/*"
                ref={imgThumbRef}
                className="hidden"
                required
              />
              <Tooltip title="Upload an image" placement="right">
                <button
                  type="button"
                  onClick={() => imgThumbRef.current.click()}
                  className="flex items-center justify-center border-2 border-dashed border-gray-400 p-2 rounded-md dark:text-slate-50 text-slate-900 hover:bg-gray-100 dark:hover:bg-gray-700"
                  aria-label="Upload Image"
                >
                  <FiUpload className="mr-2" />
                  Upload Image
                </button>
              </Tooltip>
              {imgPreview && (
                <div className="mt-2 relative">
                  <Image
                    width={200}
                    height={200}
                    src={imgPreview}
                    alt="Preview"
                    className="max-w-full rounded-md max-h-48 object-cover"
                  />
                  <FiXCircle
                    className="absolute top-0 right-0 cursor-pointer text-red-600"
                    onClick={() => {
                      setImgPreview(null);
                      setFormData((prev) => ({ ...prev, imgthumb: null }));
                      if (imgThumbRef.current) imgThumbRef.current.value = null;
                    }}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Audio Field */}
          <div className="grid max-w-2xl grid-cols-1 gap-y-6 gap-x-7">
            <label
              htmlFor="audio"
              className="block dark:text-slate-50 text-sm font-small leading-6 text-slate-900"
            >
              Audio
            </label>
            <div className="relative">
              <input
                name="audio"
                id="audio"
                onChange={handleChange}
                type="file"
                accept="audio/*"
                ref={audioRef}
                className="hidden"
                required
              />
              <Tooltip title="Upload an audio file" placement="right">
                <button
                  type="button"
                  onClick={() => audioRef.current.click()}
                  className="flex items-center justify-center border-2 border-dashed border-gray-400 p-2 rounded-md dark:text-slate-50 text-slate-900 hover:bg-gray-100 dark:hover:bg-gray-700"
                  aria-label="Upload Audio"
                >
                  <FiUpload className="mr-2" />
                  Upload Audio
                </button>
              </Tooltip>
              {audioTitle && (
                <p className="mt-2 dark:text-slate-50 text-slate-900">
                  {audioTitle}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="mt-6 flex items-center justify-end gap-x-6">
          <button
            type="button"
            onClick={handleCancel}
            className="text-sm font-semibold leading-6 text-slate-900 dark:text-slate-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isFormIncomplete}
            className={`rounded-md px-3 py-2 text-sm font-semibold text-white shadow-sm ${
              isFormIncomplete
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-500"
            } focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600`}
          >
            {submitting ? "Submitting..." : "Save"}
          </button>
        </div>

        {/* Upload Progress */}
        {uploadProgress > 0 && uploadProgress < 100 && (
          <div className="mt-4 w-full bg-gray-200 rounded-full dark:bg-gray-700">
            <div
              className="bg-blue-600 text-xs font-medium text-blue-100 text-center p-0.5 leading-none rounded-full"
              style={{ width: `${uploadProgress}%` }}
            >
              {uploadProgress}%
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && <p className="mt-4 text-sm text-red-600 text-center">{error}</p>}
      </form>
    </>
  );
}