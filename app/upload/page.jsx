"use client";
import { useState, useRef } from "react";
import { enqueueSnackbar } from "notistack";
import { FiUpload, FiXCircle } from "react-icons/fi";
import { Tooltip } from "@mui/material";
import { useRouter } from "next/navigation";

export default function Create() {
  const router = useRouter();
  var username;
  var Djname;
  if (typeof window !== "undefined") {
    var username = localStorage.getItem("mixtube-tokenname");
    var Djname = localStorage.getItem("mixtube-Djname");
    document.title = "Create Mixtape | MixTube";
  }

  const genres = ["POP", "RAP", "TRAP", "BONGO", "DRILL", "DANCEHALL"];

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

  const imgThumbRef = useRef();
  const audioRef = useRef();

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      if (name === "imgthumb") {
        setImgPreview(URL.createObjectURL(files[0]));
      } else if (name === "audio") {
        setAudioTitle(files[0].name);
      }
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
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
    xhr.open("POST", "https://web-24h2fqj0usck.up-de-fra1-k8s-1.apps.run-on-seenode.com/api/upload", true);
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
      setSubmitting(false);
      if (xhr.status === 201) {
        enqueueSnackbar("Mixtape added", {
          autoHideDuration: 1000,
          anchorOrigin: { horizontal: "center", vertical: "top" },
          variant: "success",
        });
        router.push("/profile");
      } else {
        setError(
          "An error occurred while submitting the form. Please try again."
        );
        enqueueSnackbar("An error occurred while submitting the form.", {
          variant: "error",
        });
      }
    };

    xhr.onerror = () => {
      setSubmitting(false);
      setError(
        "An error occurred while submitting the form. Please check your network."
      );
      enqueueSnackbar("An error occurred while submitting the form.", {
        variant: "error",
      });
    };

    xhr.send(data);
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
  };

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
              value={formData.genre}
              onChange={handleChange}
              className="block dark border border-gray-300 rounded-md py-1 px-2 text-slate-900 focus:border-indigo-500 focus:ring-0 sm:text-sm sm:leading-6"
              required
            >
              <option value={null}>choose or type an option</option>
              {genres.map((genre) => (
                <option key={genre} value={genre}>
                  {genre}
                </option>
              ))}
              <option value="OTHER">Other (Type below)</option>
            </select>
            {!genres.includes(formData.genre) && (
              <input
                type="text"
                name="customGenre"
                value={formData.genre}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, genre: e.target.value }))
                }
                placeholder="Type your genre"
                className="mt-2 block border border-gray-300 rounded-md py-1 px-2 text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:ring-0 sm:text-sm sm:leading-6"
              />
            )}
          </div>

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
                  <img
                    src={imgPreview}
                    alt="Preview"
                    className="max-w-full rounded-md max-h-48 object-cover"
                  />
                  <FiXCircle
                    className="absolute top-0 right-0 cursor-pointer text-red-600"
                    onClick={() => {
                      setImgPreview(null);
                      setFormData((prev) => ({ ...prev, imgthumb: null }));
                      imgThumbRef.current.value = null;
                    }}
                  />
                </div>
              )}
            </div>
          </div>

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
            disabled={submitting}
            className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            {submitting ? "Submitting..." : "Save"}
          </button>
        </div>

        {uploadProgress > 0 && (
          <div className="mt-4 w-full bg-gray-200 rounded-full dark:bg-gray-700">
            <div
              className="bg-blue-600 text-xs font-medium text-blue-100 text-center p-0.5 leading-none rounded-full"
              style={{ width: `${uploadProgress}%` }}
            >
              {uploadProgress}%
            </div>
          </div>
        )}

        {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
      </form>
    </>
  );
}
