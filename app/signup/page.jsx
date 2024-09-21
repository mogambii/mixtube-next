"use client";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useRouter } from "next/navigation";
import Link from "next/link";

// Validation schema with Yup
const schema = yup
  .object({
    username: yup
      .string()
      .matches(
        /^[a-zA-Z0-9._]+$/,
        "Username can only contain letters, numbers, underscores, and dots"
      )
      .required("Username is required")
      .min(3, "Username must be at least 3 characters"),
    type: yup.string().required("Account type is required"),
    email: yup
      .string()
      .email("Invalid email format")
      .required("Email is required"),
    password: yup
      .string()
      .required("Password is required")
      .min(6, "Password must be at least 6 characters"),
    password2: yup
      .string()
      .oneOf([yup.ref("password"), null], "Passwords must match"),
  })
  .required();

const Signup = () => {
  // Set document title in client-side
  if (typeof window !== "undefined") {
    document.title = "Sign Up - MixTube";
  }

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  // Handle form submission
  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      const response = await fetch(
        "https://server-nezz.vercel.app/api/user/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      const result = await response.json();

      if (response.ok && result.message === "User added") {
        toast.success("Account created successfully.");  
        router.push("/login");
      } else {
        setError(result.error || "An unexpected error occurred. Please try again.");
      }
    } catch (err) {
      console.error(err);
      setError("Network error, please try again later.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-fit dark">
      <div className="w-full max-w-md p-8 space-y-8 bg-white shadow-md rounded my-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">Hello there</h2>
          <p className="mt-2 text-sm text-gray-600">Welcome to mixtube</p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 my-8">
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700"
            >
              Username
            </label>
            <input
              aria-label="Username"
              {...register("username")}
              id="username"
              type="text"
              className="w-full px-3 py-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <p className="mt-1 text-xs text-red-600">
              {errors.username?.message}
            </p>
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              aria-label="Email"
              {...register("email")}
              id="email"
              type="email"
              className="w-full px-3 py-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <p className="mt-1 text-xs text-red-600">{errors.email?.message}</p>
          </div>
          <div>
            <label
              htmlFor="type"
              className="block text-sm font-medium text-gray-700"
            >
              Account Type
            </label>
            <select
              aria-label="Account Type"
              {...register("type")}
              id="type"
              className="w-full px-3 py-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="user">User</option>
              <option value="DJ">Music DJ</option>
            </select>
            <p className="mt-1 text-xs text-red-600">{errors.type?.message}</p>
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              aria-label="Password"
              {...register("password")}
              id="password"
              type="password"
              className="w-full px-3 py-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <p className="mt-1 text-xs text-red-600">
              {errors.password?.message}
            </p>
          </div>
          <div>
            <label
              htmlFor="password2"
              className="block text-sm font-medium text-gray-700"
            >
              Confirm Password
            </label>
            <input
              aria-label="Confirm Password"
              {...register("password2")}
              id="password2"
              type="password"
              className="w-full px-3 py-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <p className="mt-1 text-xs text-red-600">
              {errors.password2?.message}
            </p>
          </div>
          {error && (
            <div className="text-center text-sm text-red-600">{error}</div>
          )}
          <div>
            <button
              type="submit"
              className="w-full px-4 py-2 text-white bg-indigo-600 rounded shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-400"
              disabled={submitting}
            >
              {submitting ? "Creating account..." : "Sign Up"}
            </button>
          </div>
        </form>
        <div className="text-center text-sm text-gray-600">
          Already a member?{" "}
          <Link href="/login" className="text-indigo-600">
            Log in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;
