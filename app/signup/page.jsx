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
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";
import Image from "next/image";

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

const Signup = () => {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
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

      setUsernameStatus((prev) => ({ ...prev, checking: true }));

      try {
        const response = await fetch(
          `/api/check-username?username=${encodeURIComponent(username)}`
        );
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
    }, 400);

    return () => clearTimeout(timeoutId);
  }, [watchedUsername, checkUsername]);

  const handleGoogleSignIn = async () => {
    const width = 500;
    const height = 600;
    const left = typeof window !== "undefined" ? window.screen.width / 2 - width / 2 : 100;
    const top = typeof window !== "undefined" ? window.screen.height / 2 - height / 2 : 100;

    // 1. Open blank popup synchronously to bypass browser popup blockers
    const popup = window.open(
      "about:blank",
      "GoogleSignIn",
      `width=${width},height=${height},top=${top},left=${left},scrollbars=yes`
    );

    try {
      // 2. Fetch NextAuth CSRF token
      const res = await fetch("/api/auth/csrf");
      const { csrfToken } = await res.json();

      // 3. Post CSRF form targeted to the popup window
      const form = document.createElement("form");
      form.method = "POST";
      form.action = "/api/auth/signin/google";
      form.target = "GoogleSignIn";

      const csrfInput = document.createElement("input");
      csrfInput.type = "hidden";
      csrfInput.name = "csrfToken";
      csrfInput.value = csrfToken;
      form.appendChild(csrfInput);

      const callbackInput = document.createElement("input");
      callbackInput.type = "hidden";
      callbackInput.name = "callbackUrl";
      callbackInput.value = `${window.location.origin}/auth/popup-callback`;
      form.appendChild(callbackInput);

      document.body.appendChild(form);
      form.submit();
      document.body.removeChild(form);

      // 4. Poll and listen for popup closure/message
      if (popup) {
        const handleMessage = (event) => {
          if (event.data?.type === "GOOGLE_SIGNIN_SUCCESS") {
            window.removeEventListener("message", handleMessage);
            clearInterval(checkPopup);
            if (!popup.closed) popup.close();
            router.push("/");
            router.refresh();
          }
        };
        window.addEventListener("message", handleMessage);

        const checkPopup = setInterval(() => {
          if (popup.closed) {
            clearInterval(checkPopup);
            window.removeEventListener("message", handleMessage);
            router.push("/");
            router.refresh();
          }
        }, 500);
      }
    } catch (err) {
      if (popup) popup.close();
      console.error("Google sign in error:", err);
    }
  };

  const onSubmit = async (data) => {
    if (usernameStatus.available === false) {
      toast.error("Please choose an available username");
      return;
    }

    setSubmitting(true);
    setError("");
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
    <div className="min-h-[calc(100vh-5rem)] bg-gray-50 dark:bg-gray-950 flex items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      {/* Background ambient lighting blobs */}
      <div className="absolute top-10 right-10 w-96 h-96 bg-indigo-500/10 dark:bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-purple-500/10 dark:bg-purple-500/15 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-white/85 dark:bg-gray-900/85 backdrop-blur-2xl rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.08)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-gray-200/80 dark:border-white/10 p-6 sm:p-8 space-y-6 relative z-10 animate-in fade-in zoom-in-95 duration-300">
        
        {/* Header Section */}
        <div className="text-center">
          <div className="flex justify-center mb-3">
            <Image
              src="/icon.png"
              alt="MixTapped Logo"
              width={48}
              height={48}
              className="mx-auto"
            />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-righteous tracking-wide text-gray-900 dark:text-white">
            Create an Account
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
            Join MixTapped to discover and stream global DJ mixes
          </p>
        </div>

        {/* DJ Callout Banner */}
        <div className="bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 dark:from-indigo-950/40 dark:via-purple-950/40 dark:to-pink-950/40 p-3.5 sm:p-4 rounded-2xl border border-indigo-100/80 dark:border-indigo-800/30 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-xl bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 font-bold text-xs">
              DJ
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-900 dark:text-indigo-200">Are you a DJ?</p>
              <p className="text-[11px] text-gray-500 dark:text-gray-400">Share your mixes with the world</p>
            </div>
          </div>
          <Link
            href="https://dj.mixtapped.com"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors shrink-0 bg-white dark:bg-gray-800 px-3 py-1.5 rounded-xl shadow-xs border border-indigo-100 dark:border-gray-700"
          >
            DJ Portal <FaArrowRight className="h-2.5 w-2.5" />
          </Link>
        </div>

        {/* Google Sign In Button */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-2xl bg-white dark:bg-gray-800/90 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 font-semibold text-sm transition-all duration-200 shadow-xs hover:shadow-sm"
        >
          <FcGoogle className="text-xl shrink-0" />
          <span>Continue with Google</span>
        </button>

        {/* Divider */}
        <div className="relative flex items-center justify-center">
          <div className="w-full border-t border-gray-200 dark:border-gray-800" />
          <span className="absolute px-3 bg-white dark:bg-gray-900 text-gray-400 text-xs font-medium uppercase tracking-wider">
            Or with email
          </span>
        </div>

        {/* Signup Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Error Message Alert */}
          {error && (
            <div className="p-3 text-xs text-red-700 bg-red-50 dark:bg-red-950/40 dark:text-red-300 rounded-2xl border border-red-200 dark:border-red-800/50 flex items-center gap-2">
              <FaExclamationCircle className="text-red-500 text-sm shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Username Field */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
              Username
            </label>
            <div className="relative">
              <FaUser className="absolute left-3.5 top-3.5 text-gray-400 dark:text-gray-500 text-sm pointer-events-none" />
              <input
                {...register("username")}
                type="text"
                autoComplete="username"
                className={`w-full pl-10 pr-10 py-2.5 text-sm rounded-2xl border bg-gray-50/50 dark:bg-gray-800/50 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-200 ${
                  usernameStatus.available === true
                    ? "border-green-400 dark:border-green-500 focus:ring-green-400"
                    : usernameStatus.available === false
                      ? "border-red-400 dark:border-red-500 focus:ring-red-400"
                      : "border-gray-200 dark:border-gray-700/80 focus:border-indigo-500 focus:ring-indigo-500/20"
                }`}
                placeholder="choose_username"
              />
              <div className="absolute right-3.5 top-3.5 flex items-center">
                {usernameStatus.checking ? (
                  <div className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                ) : usernameStatus.available === true ? (
                  <FaCheck className="h-4 w-4 text-green-500" />
                ) : usernameStatus.available === false ? (
                  <FaTimes className="h-4 w-4 text-red-500" />
                ) : null}
              </div>
            </div>

            {/* Username hints/status */}
            {usernameStatus.checking && (
              <p className="mt-1 text-xs text-indigo-500 font-medium flex items-center gap-1">
                Checking availability...
              </p>
            )}
            {usernameStatus.available === true && (
              <p className="mt-1 text-xs text-green-600 dark:text-green-400 font-medium flex items-center gap-1">
                <FaCheck className="h-3 w-3" /> Username is available
              </p>
            )}
            {usernameStatus.available === false && (
              <p className="mt-1 text-xs text-red-500 font-medium flex items-center gap-1">
                <FaTimes className="h-3 w-3" /> {usernameStatus.message || "Username is unavailable"}
              </p>
            )}
            {errors.username && (
              <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                <FaExclamationCircle /> {errors.username.message}
              </p>
            )}
          </div>

          {/* Email Field */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <FaEnvelope className="absolute left-3.5 top-3.5 text-gray-400 dark:text-gray-500 text-sm pointer-events-none" />
              <input
                {...register("email")}
                type="email"
                autoComplete="email"
                className="w-full pl-10 pr-4 py-2.5 text-sm rounded-2xl border border-gray-200 dark:border-gray-700/80 bg-gray-50/50 dark:bg-gray-800/50 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-200"
                placeholder="name@example.com"
              />
            </div>
            {errors.email && (
              <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                <FaExclamationCircle /> {errors.email.message}
              </p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
              Password
            </label>
            <div className="relative">
              <FaLock className="absolute left-3.5 top-3.5 text-gray-400 dark:text-gray-500 text-sm pointer-events-none" />
              <input
                {...register("password")}
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                className="w-full pl-10 pr-10 py-2.5 text-sm rounded-2xl border border-gray-200 dark:border-gray-700/80 bg-gray-50/50 dark:bg-gray-800/50 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-200"
                placeholder="At least 6 characters"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                aria-label="Toggle password visibility"
              >
                {showPassword ? <FaEyeSlash className="h-4 w-4" /> : <FaEye className="h-4 w-4" />}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                <FaExclamationCircle /> {errors.password.message}
              </p>
            )}
          </div>

          {/* Confirm Password Field */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
              Confirm Password
            </label>
            <div className="relative">
              <FaLock className="absolute left-3.5 top-3.5 text-gray-400 dark:text-gray-500 text-sm pointer-events-none" />
              <input
                {...register("password2")}
                type={showPassword2 ? "text" : "password"}
                autoComplete="new-password"
                className="w-full pl-10 pr-10 py-2.5 text-sm rounded-2xl border border-gray-200 dark:border-gray-700/80 bg-gray-50/50 dark:bg-gray-800/50 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-200"
                placeholder="Repeat password"
              />
              <button
                type="button"
                onClick={() => setShowPassword2(!showPassword2)}
                className="absolute right-3.5 top-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                aria-label="Toggle confirm password visibility"
              >
                {showPassword2 ? <FaEyeSlash className="h-4 w-4" /> : <FaEye className="h-4 w-4" />}
              </button>
            </div>
            {errors.password2 && (
              <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                <FaExclamationCircle /> {errors.password2.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 px-4 rounded-2xl font-bold text-sm text-white bg-gradient-to-r from-indigo-500 via-purple-500 to-fuchsia-600 hover:shadow-[0_0_25px_rgba(139,92,246,0.35)] hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2 mt-2"
          >
            {submitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Creating Account...</span>
              </>
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        {/* Footer Navigation */}
        <div className="text-center pt-2">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
