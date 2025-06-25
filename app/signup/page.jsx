"use client";
import React, { useState, useEffect, useCallback } from "react";
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
  FaCheck,
  FaTimes,
} from "react-icons/fa";
import {
  HiOutlineUser,
  HiOutlineMail,
  HiOutlineLockClosed,
} from "react-icons/hi";

const Signup = () => {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [usernameStatus, setUsernameStatus] = useState({
    checking: false,
    available: null,
    message: "",
    formattedUsername: "",
  });
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const watchedUsername = watch("username");

  // Debounced username check
  const checkUsername = useCallback(
    async (username) => {
      if (!username || username.length < 3) {
        setUsernameStatus({
          checking: false,
          available: null,
          message: "",
          formattedUsername: "",
        });
        return;
      }

      setUsernameStatus(prev => ({ ...prev, checking: true }));

      try {
        const response = await fetch(`/api/check-username?username=${encodeURIComponent(username)}`);
        const data = await response.json();

        if (response.ok) {
          setUsernameStatus({
            checking: false,
            available: data.available,
            message: data.error || data.message,
            formattedUsername: data.formattedUsername,
          });

          // Auto-update the field with formatted username if available
          if (data.available && data.formattedUsername !== username) {
            setValue("username", data.formattedUsername);
          }
        } else {
          setUsernameStatus({
            checking: false,
            available: false,
            message: "Error checking username availability",
            formattedUsername: "",
          });
        }
      } catch (error) {
        console.error("Error checking username:", error);
        setUsernameStatus({
          checking: false,
          available: false,
          message: "Error checking username availability",
          formattedUsername: "",
        });
      }
    },
    [setValue]
  );

  // Debounce effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (watchedUsername) {
        checkUsername(watchedUsername);
      }
    }, 500); // 500ms debounce

    return () => clearTimeout(timeoutId);
  }, [watchedUsername, checkUsername]);

  const handleGoogleSignIn = () => {
    signIn("google", { callbackUrl: "/" });
  };

  const onSubmit = async (data) => {
    // Check if username is available before submitting
    if (usernameStatus.available === false) {
      toast.error("Please choose a different username");
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: data.email,
          username: usernameStatus.formattedUsername || data.username,
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="mx-auto h-16 w-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mb-6 shadow-lg">
            <FaMusic className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-3">
            Join MixTube
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
            Discover and share amazing music mixes with the world
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 dark:border-gray-700/50 p-8">
          {/* DJ Signup Notice */}
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/30 dark:to-purple-900/30 p-6 rounded-xl border border-indigo-100 dark:border-indigo-800/50 text-center mb-8">
            <div className="flex justify-center mb-3">
              <div className="h-10 w-10 rounded-full bg-indigo-100 dark:bg-indigo-800 flex items-center justify-center">
                <FaMusic className="text-indigo-600 dark:text-indigo-300 text-lg" />
              </div>
            </div>
            <h3 className="font-bold text-indigo-800 dark:text-indigo-200 mb-2 text-lg">
              Are you a DJ?
            </h3>
            <p className="text-sm text-indigo-700 dark:text-indigo-300 mb-4 leading-relaxed">
              Want to upload and share your mixes with the community?
            </p>
            <Link
              href="https://dj.mixtube.xyz"
              className="inline-flex items-center justify-center font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-300 dark:hover:text-indigo-200 underline transition-colors text-sm"
            >
              Sign up as a DJ here <FaArrowRight className="ml-2 h-3 w-3" />
            </Link>
          </div>

          {/* Google Sign In Button */}
          <button
            onClick={handleGoogleSignIn}
            className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-xl shadow-sm text-sm font-semibold text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 border-2 border-gray-200 dark:border-gray-600 transition-all duration-200 hover:shadow-md mb-8"
          >
            <FcGoogle className="text-xl" />
            Continue with Google
          </button>

          {/* Divider */}
          <div className="relative mb-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white/80 dark:bg-gray-800/80 text-gray-500 dark:text-gray-400 font-medium">
                Or sign up with email
              </span>
            </div>
          </div>

          {/* Signup Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Username Field */}
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3"
              >
                <HiOutlineUser className="inline mr-2 -mt-1" />
                Username
              </label>
              <div className="relative">
                <input
                  {...register("username")}
                  id="username"
                  type="text"
                  autoComplete="username"
                  className={`w-full pl-12 pr-12 py-4 text-sm border-2 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:focus:ring-indigo-400 transition-all duration-200 ${
                    usernameStatus.available === true
                      ? "border-green-300 dark:border-green-600 focus:ring-green-500 dark:focus:ring-green-400"
                      : usernameStatus.available === false
                      ? "border-red-300 dark:border-red-600 focus:ring-red-500 dark:focus:ring-red-400"
                      : "border-gray-200 dark:border-gray-600"
                  }`}
                  placeholder="Choose your username"
                />
                <FaUser className="absolute left-4 top-4 text-gray-400 dark:text-gray-500 text-sm" />
                
                {/* Status indicator icon */}
                <div className="absolute right-4 top-4">
                  {usernameStatus.checking && (
                    <svg className="animate-spin h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  )}
                  {usernameStatus.available === true && (
                    <FaCheck className="h-5 w-5 text-green-500 dark:text-green-400" />
                  )}
                  {usernameStatus.available === false && (
                    <FaTimes className="h-5 w-5 text-red-500 dark:text-red-400" />
                  )}
                </div>
              </div>
              
              {/* Status message */}
              {usernameStatus.checking && (
                <div className="mt-3 flex items-center space-x-2">
                  <div className="flex space-x-1">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce"></div>
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                  <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                    Checking availability...
                  </span>
                </div>
              )}
              
              {usernameStatus.available === true && (
                <div className="mt-3 flex items-center space-x-2">
                  <div className="flex items-center space-x-1">
                    <FaCheck className="h-3 w-3 text-green-500 dark:text-green-400" />
                    <span className="text-xs text-green-600 dark:text-green-400 font-medium">
                      Username available
                    </span>
                  </div>
                  {usernameStatus.formattedUsername && usernameStatus.formattedUsername !== watchedUsername && (
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      (will be saved as "{usernameStatus.formattedUsername}")
                    </span>
                  )}
                </div>
              )}
              
              {usernameStatus.available === false && (
                <div className="mt-3 flex items-center space-x-2">
                  <div className="flex items-center space-x-1">
                    <FaTimes className="h-3 w-3 text-red-500 dark:text-red-400" />
                    <span className="text-xs text-red-600 dark:text-red-400 font-medium">
                      {usernameStatus.message}
                    </span>
                  </div>
                </div>
              )}
              
              {errors.username && (
                <p className="mt-2 text-xs text-red-500 dark:text-red-400 flex items-center">
                  <FaExclamationCircle className="mr-1" />
                  {errors.username.message}
                </p>
              )}
              
              <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-l-3 border-blue-200 dark:border-blue-800">
                <p className="text-xs text-blue-700 dark:text-blue-300 leading-relaxed">
                  💡 Username will be converted to lowercase with no spaces. Only letters, numbers, dots, and underscores are allowed.
                </p>
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3"
              >
                <HiOutlineMail className="inline mr-2 -mt-1" />
                Email Address
              </label>
              <div className="relative">
                <input
                  {...register("email")}
                  id="email"
                  type="email"
                  autoComplete="email"
                  className="w-full pl-12 pr-4 py-4 text-sm border-2 border-gray-200 dark:border-gray-600 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white dark:focus:ring-indigo-400 transition-all duration-200"
                  placeholder="Enter your email address"
                />
                <FaEnvelope className="absolute left-4 top-4 text-gray-400 dark:text-gray-500 text-sm" />
              </div>
              {errors.email && (
                <p className="mt-2 text-xs text-red-500 dark:text-red-400 flex items-center">
                  <FaExclamationCircle className="mr-1" />
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3"
              >
                <HiOutlineLockClosed className="inline mr-2 -mt-1" />
                Password
              </label>
              <div className="relative">
                <input
                  {...register("password")}
                  id="password"
                  type="password"
                  autoComplete="new-password"
                  className="w-full pl-12 pr-4 py-4 text-sm border-2 border-gray-200 dark:border-gray-600 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white dark:focus:ring-indigo-400 transition-all duration-200"
                  placeholder="Create a strong password"
                />
                <FaLock className="absolute left-4 top-4 text-gray-400 dark:text-gray-500 text-sm" />
              </div>
              {errors.password && (
                <p className="mt-2 text-xs text-red-500 dark:text-red-400 flex items-center">
                  <FaExclamationCircle className="mr-1" />
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div>
              <label
                htmlFor="password2"
                className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3"
              >
                <HiOutlineLockClosed className="inline mr-2 -mt-1" />
                Confirm Password
              </label>
              <div className="relative">
                <input
                  {...register("password2")}
                  id="password2"
                  type="password"
                  autoComplete="new-password"
                  className="w-full pl-12 pr-4 py-4 text-sm border-2 border-gray-200 dark:border-gray-600 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white dark:focus:ring-indigo-400 transition-all duration-200"
                  placeholder="Confirm your password"
                />
                <FaLock className="absolute left-4 top-4 text-gray-400 dark:text-gray-500 text-sm" />
              </div>
              {errors.password2 && (
                <p className="mt-2 text-xs text-red-500 dark:text-red-400 flex items-center">
                  <FaExclamationCircle className="mr-1" />
                  {errors.password2.message}
                </p>
              )}
            </div>

            {/* Error Display */}
            {error && (
              <div className="p-4 text-sm text-red-700 bg-red-50 dark:bg-red-900/30 dark:text-red-400 rounded-xl border border-red-200 dark:border-red-800 flex items-center">
                <FaExclamationCircle className="mr-3 text-red-500" />
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full flex justify-center py-4 px-6 rounded-xl shadow-sm text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 hover:shadow-lg transform hover:scale-[1.02]"
            >
              {submitting ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                  Creating your account...
                </>
              ) : (
                "Create Account"
              )}
            </button>

            {/* Login Link */}
            <div className="text-center pt-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors underline"
                >
                  Sign in here
                </Link>
              </p>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            By creating an account, you agree to our{" "}
            <Link href="/terms" className="underline hover:text-gray-700 dark:hover:text-gray-300">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="underline hover:text-gray-700 dark:hover:text-gray-300">
              Privacy Policy
            </Link>
          </p>
        </div>
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
      .required("Username is required")
      .min(3, "Username must be at least 3 characters")
      .max(30, "Username must be less than 30 characters"),
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
