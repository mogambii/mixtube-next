"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";
import toast from "react-hot-toast";

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

  const handleGoogleSignIn = () => {
    signIn("google", { callbackUrl: "/" });
  };

  // Handle form submission
  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: data.email,
          username: data.username,
          password: data.password,
        }),
      });

      if (response.ok) {
        toast.success("Account created successfully!");
        // Sign in the user immediately after successful registration
        const result = await signIn("credentials", {
          email: data.email,
          password: data.password,
          redirect: false,
        });

        if (result?.error) {
          setError("Failed to sign in after registration");
        } else {
          router.push("/");
        }
      } else {
        const data = await response.json();
        throw new Error(data.message || "Failed to create account");
      }
    } catch (err) {
      console.error(err);
      setError(err.message || "Something went wrong");
      toast.error(err.message || "Failed to create account");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-svh bg-gray-100 dark:bg-gray-950">
      <div className="w-full max-w-md p-8 space-y-8 bg-white dark:bg-gray-800 shadow-md rounded">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Create Account</h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">Welcome to MixTube</p>
        </div>

        <button
          onClick={handleGoogleSignIn}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
        >
          <FcGoogle className="text-xl" />
          Continue with Google
        </button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white dark:bg-gray-800 text-gray-500">Or sign up with email</span>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Username
            </label>
            <input
              {...register("username")}
              id="username"
              type="text"
              className="w-full px-3 py-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
            />
            <p className="mt-1 text-xs text-red-600">{errors.username?.message}</p>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Email
            </label>
            <input
              {...register("email")}
              id="email"
              type="email"
              className="w-full px-3 py-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
            />
            <p className="mt-1 text-xs text-red-600">{errors.email?.message}</p>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Password
            </label>
            <input
              {...register("password")}
              id="password"
              type="password"
              className="w-full px-3 py-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
            />
            <p className="mt-1 text-xs text-red-600">{errors.password?.message}</p>
          </div>

          <div>
            <label htmlFor="password2" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Confirm Password
            </label>
            <input
              {...register("password2")}
              id="password2"
              type="password"
              className="w-full px-3 py-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
            />
            <p className="mt-1 text-xs text-red-600">{errors.password2?.message}</p>
          </div>

          {error && (
            <div className="text-red-500 text-sm text-center" role="alert">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {submitting ? "Creating account..." : "Create Account"}
          </button>

          <div className="text-center space-y-2">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Already have an account?{" "}
              <Link href="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                Sign in
              </Link>
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Are you a DJ?{" "}
              <a href="https://dj.mixtube.xyz" className="font-medium text-indigo-600 hover:text-indigo-500">
                Sign up here
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
