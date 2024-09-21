"use client";
import { useState, useEffect, useRef } from "react";
import { FiUpload, FiXCircle } from "react-icons/fi";
import { Tooltip } from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
export default function Edit({ params: { id } }) {
  useEffect(() => {
    document.title = "Edit Mixtape | MixTube";
  }, []);
  const [mixtapeData, setMixtapeData] = useState({
    title: "",
    date: "",
    desc: "",
    imgthumb: "",
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const imgThumbRef = useRef();
  const router = useRouter();

  useEffect(() => {
    const fetchMixtape = async () => {
      try {
        const response = await fetch(
          `https://server-nezz.vercel.app/api/my/mixtape/${id}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("mixtube-token")}`,
            },
          }
        );

        if (!response.ok) throw new Error("Failed to fetch mixtape data");

        const data = await response.json();

        setMixtapeData({
          title: data.title,
          date: data.date,
          desc: data.desc,
          imgthumb: data.imgthumb,
        });
      } catch (err) {
        toast.error("Error fetching mixtape", { autoClose: 3000 });
        console.error("Error fetching mixtape:", err);
      }
    };

    fetchMixtape();
  }, [id]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setMixtapeData((prevData) => ({
        ...prevData,
        imgthumb: URL.createObjectURL(file),
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const formData = new FormData();
    formData.append("title", mixtapeData.title);
    formData.append("desc", mixtapeData.desc);
    formData.append("date", mixtapeData.date);
    if (selectedFile) {
      formData.append("imgthumb", selectedFile);
    } else {
      formData.append("imgthumb", mixtapeData.imgthumb);
    }

    try {
      const response = await fetch(
        `https://web-24h2fqj0usck.up-de-fra1-k8s-1.apps.run-on-seenode.com/api/mixtape/${id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("mixtube-token")}`,
          },
          body: formData,
        }
      );

      if (!response.ok) throw new Error("Failed to update mixtape");
        toast.success("Mixtape updated successfully!", { autoClose: 3000 });

      navigate("/profile");
    } catch (err) {
      toast.error("Error updating mixtape", { autoClose: 3000 });
      console.error("Error updating mixtape:", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <h3 className="text-lg font-semibold p-4 dark:text-slate-50">
        Edit Mixtape
      </h3>
      <form
        onSubmit={handleSubmit}
        className="border rounded-lg overflow-hidden p-4 bg-white dark:bg-gray-800"
      >
        <div className="grid grid-cols-1 gap-x-5 gap-y-8 border-b border-slate-900/10 pb-12 md:grid-cols-2">
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
              value={mixtapeData.title}
              onChange={(e) =>
                setMixtapeData((prev) => ({ ...prev, title: e.target.value }))
              }
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
              value={mixtapeData.date}
              onChange={(e) =>
                setMixtapeData((prev) => ({ ...prev, date: e.target.value }))
              }
              className="block border border-gray-300 rounded-md py-1 px-2 text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:ring-0 sm:text-sm sm:leading-6"
              required
            />
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
              value={mixtapeData.desc}
              onChange={(e) =>
                setMixtapeData((prev) => ({ ...prev, desc: e.target.value }))
              }
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
                onChange={handleFileChange}
                type="file"
                accept="image/*"
                ref={imgThumbRef}
                className="hidden"
              />
              <Tooltip title="Upload an image" placement="right">
                <button
                  type="button"
                  onClick={() => imgThumbRef.current.click()}
                  className="flex items-center justify-center border-2 border-dashed border-gray-400 p-2 rounded-md dark:text-slate-50 text-slate-900 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <FiUpload className="mr-2" />
                  Upload Image
                </button>
              </Tooltip>
              {mixtapeData.imgthumb && (
                <div className="mt-2 relative">
                  <Image
                    src={mixtapeData.imgthumb}
                    alt="Preview"
                    className="max-w-full rounded-md max-h-full"
                    height={300}
                    width={300}
                  />
                  <FiXCircle
                    className="absolute top-0 right-0 cursor-pointer text-red-600"
                    onClick={() => {
                      setSelectedFile(null);
                      setMixtapeData((prev) => ({ ...prev, imgthumb: "" }));
                      imgThumbRef.current.value = null;
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-x-6">
          <button
            type="button"
            className="text-sm font-semibold leading-6 text-slate-900 dark:text-slate-50"
            onClick={() => router.push("/profile")}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            {submitting ? "Updating..." : "Save"}
          </button>
        </div>
      </form>
    </>
  );
}
