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
        const response = await fetch(`/api/mymix?id=${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          if (response.status === 401) {
            router.push('/login');
            return;
          }
          throw new Error("Failed to fetch mixtape data");
        }

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
  }, [id, router]);

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
      const response = await fetch(`/api/mymix?id=${id}`, {
        method: "PATCH",
        body: formData,
      });

      if (!response.ok) {
        if (response.status === 401) {
          router.push('/login');
          return;
        }
        throw new Error("Failed to update mixtape");
      }

      toast.success("Mixtape updated successfully!");
      router.push(`/mix/${id}`);
    } catch (error) {
      toast.error("Error updating mixtape");
      console.error("Error updating mixtape:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleRemoveImage = () => {
    setSelectedFile(null);
    setMixtapeData((prevData) => ({
      ...prevData,
      imgthumb: "",
    }));
    if (imgThumbRef.current) {
      imgThumbRef.current.value = "";
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Edit Mixtape</h1>
      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Title</label>
          <input
            type="text"
            value={mixtapeData.title}
            onChange={(e) =>
              setMixtapeData({ ...mixtapeData, title: e.target.value })
            }
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Date</label>
          <input
            type="text"
            value={mixtapeData.date}
            onChange={(e) =>
              setMixtapeData({ ...mixtapeData, date: e.target.value })
            }
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Description</label>
          <textarea
            value={mixtapeData.desc}
            onChange={(e) =>
              setMixtapeData({ ...mixtapeData, desc: e.target.value })
            }
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 h-32"
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Thumbnail</label>
          <div className="flex items-center space-x-4">
            <input
              type="file"
              ref={imgThumbRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
              id="thumbnail-upload"
            />
            <label
              htmlFor="thumbnail-upload"
              className="cursor-pointer flex items-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
            >
              <FiUpload />
              <span>Upload Image</span>
            </label>
            {mixtapeData.imgthumb && (
              <div className="relative">
                <Image
                  src={mixtapeData.imgthumb}
                  alt="Thumbnail preview"
                  width={100}
                  height={100}
                  className="rounded"
                />
                <Tooltip title="Remove Image">
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute -top-2 -right-2 text-red-500 hover:text-red-600"
                  >
                    <FiXCircle size={20} />
                  </button>
                </Tooltip>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={submitting}
            className={`bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition-colors ${
              submitting ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {submitting ? "Updating..." : "Update Mixtape"}
          </button>
        </div>
      </form>
    </div>
  );
}

