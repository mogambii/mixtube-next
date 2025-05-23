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
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaMusic,
  FaExclamationCircle,
  FaArrowRight,
} from "react-icons/fa";
import {
  HiOutlineUser,
  HiOutlineMail,
  HiOutlineLockClosed,
} from "react-icons/hi";

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
        const result = await signIn("credentials", {
          email: data.email,
          password: data.password,
          redirect: false,
        });

        if (result?.error) {
          setError("Failed to sign in after registration");
          toast.error(
            "Account created but failed to sign in. Please try logging in."
          );
        } else {
          router.push("/");
        }
      } else {
        const errorData = await response.json();
        setError(errorData.error);
        toast.error(errorData.error);
      }
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to create account");
      toast.error(err.message || "Failed to create account");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="w-full max-w-lg p-8 space-y-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center mb-4">
            <FaMusic className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            Create Account
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
            Join MixTube to discover and share amazing music mixes
          </p>
        </div>

        {/* DJ Signup Notice */}
        <div className="bg-indigo-50 dark:bg-indigo-900/30 p-4 rounded-lg border border-indigo-100 dark:border-indigo-900/50 text-center">
          <div className="flex justify-center mb-2">
            <FaMusic className="text-indigo-600 dark:text-indigo-300 text-lg" />
          </div>
          <p className="font-semibold text-indigo-800 dark:text-indigo-200 mb-1">
            Are you a DJ?
          </p>
          <p className="text-sm text-indigo-700 dark:text-indigo-300 mb-2">
            Want to upload and share your mixes?
          </p>
          <Link
            href="https://dj.mixtube.xyz"
            className="inline-flex items-center justify-center font-bold text-indigo-600 hover:text-indigo-500 dark:text-indigo-300 dark:hover:text-indigo-200 underline transition-colors"
          >
            Sign up as a DJ here <FaArrowRight className="ml-1" />
          </Link>
        </div>

        <button
          onClick={handleGoogleSignIn}
          className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-lg shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 border border-gray-200 dark:border-gray-600 transition-colors duration-200"
        >
          <FcGoogle className="text-xl" />
          Continue with Google
        </button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-3 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
              Or sign up with email
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              <HiOutlineUser className="inline mr-1 -mt-1" />
              Username
            </label>
            <div className="relative">
              <input
                {...register("username")}
                id="username"
                type="text"
                autoComplete="username"
                className="w-full pl-10 pr-4 py-2.5 text-sm border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:focus:ring-indigo-400 transition-all duration-200"
                placeholder="Enter your username"
              />
              <FaUser className="absolute left-3 top-3.5 text-gray-400 dark:text-gray-500 text-sm" />
            </div>
            {errors.username && (
              <p className="mt-1.5 text-xs text-red-500 dark:text-red-400 flex items-center">
                <FaExclamationCircle className="mr-1" />
                {errors.username.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              <HiOutlineMail className="inline mr-1 -mt-1" />
              Email
            </label>
            <div className="relative">
              <input
                {...register("email")}
                id="email"
                type="email"
                autoComplete="email"
                className="w-full pl-10 pr-4 py-2.5 text-sm border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:focus:ring-indigo-400 transition-all duration-200"
                placeholder="Enter your email"
              />
              <FaEnvelope className="absolute left-3 top-3.5 text-gray-400 dark:text-gray-500 text-sm" />
            </div>
            {errors.email && (
              <p className="mt-1.5 text-xs text-red-500 dark:text-red-400 flex items-center">
                <FaExclamationCircle className="mr-1" />
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              <HiOutlineLockClosed className="inline mr-1 -mt-1" />
              Password
            </label>
            <div className="relative">
              <input
                {...register("password")}
                id="password"
                type="password"
                autoComplete="new-password"
                className="w-full pl-10 pr-4 py-2.5 text-sm border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:focus:ring-indigo-400 transition-all duration-200"
                placeholder="Enter your password"
              />
              <FaLock className="absolute left-3 top-3.5 text-gray-400 dark:text-gray-500 text-sm" />
            </div>
            {errors.password && (
              <p className="mt-1.5 text-xs text-red-500 dark:text-red-400 flex items-center">
                <FaExclamationCircle className="mr-1" />
                {errors.password.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="password2"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              <HiOutlineLockClosed className="inline mr-1 -mt-1" />
              Confirm Password
            </label>
            <div className="relative">
              <input
                {...register("password2")}
                id="password2"
                type="password"
                autoComplete="new-password"
                className="w-full pl-10 pr-4 py-2.5 text-sm border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:focus:ring-indigo-400 transition-all duration-200"
                placeholder="Confirm your password"
              />
              <FaLock className="absolute left-3 top-3.5 text-gray-400 dark:text-gray-500 text-sm" />
            </div>
            {errors.password2 && (
              <p className="mt-1.5 text-xs text-red-500 dark:text-red-400 flex items-center">
                <FaExclamationCircle className="mr-1" />
                {errors.password2.message}
              </p>
            )}
          </div>

          {error && (
            <div className="p-3 text-sm text-red-700 bg-red-100 dark:bg-red-900/30 dark:text-red-400 rounded-lg flex items-center">
              <FaExclamationCircle className="mr-2" />
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full flex justify-center py-3 px-4 rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed transition-colors duration-200"
          >
            {submitting ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Creating account...
              </>
            ) : (
              "Create Account"
            )}
          </button>

          <div className="text-center text-sm text-gray-600 dark:text-gray-400">
            <p>
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors"
              >
                Sign in
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;

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
